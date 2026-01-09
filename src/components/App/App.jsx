import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { coordinates, APIkey } from "../../utils/constants";
import {
  addItem,
  getItems,
  removeItem,
  updateProfileData,
  addCardLike,
  removeCardLike,
} from "../../utils/api";
import { signin, signup, getUserData } from "../../utils/auth";

import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";
import AddItemModal from "../AddItemModal/AddItemModal";
import ItemModal from "../ItemModal/ItemModal";
// Delete Confirmation modal to be added
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import EditProfileModal from "../EditProfileModal/EditProfileModal";
import { ProtectedRoute } from "../ProtectedRoute/ProtectedRoute";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: false,
  });
  const [clothingItems, setClothingItems] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [currentDate, setCurrentDate] = useState("");
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  // isDeleteModalOpen
  // cardToDelete
  // isLoading
  // isDeleting
  // isCanceling
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  // useEffect to fetch today

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch((err) => {
        console.error("Failed to fetch weather data:", err);
      });
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data);
        data.reverse();
      })
      .catch((err) => {
        console.error("Failed to fetch clothing items:", err);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      getUserData(token)
        .then((user) => {
          setCurrentUser(user);
          setIsLoggedIn(true);
        })
        .catch(() => {
          localStorage.removeItem("jwt");
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const handleSignupClick = () => {
    setActiveModal("new-user");
  };

  const handleLoginClick = () => {
    setActiveModal("login-user");
  };

  const handleEditProfileClick = () => {
    setActiveModal("edit-profile");
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleCardLike = ({ id, isLiked }) => {
    const token = localStorage.getItem("jwt");

    !isLiked
      ? addCardLike(id, token)
          .then((updatedCard) => {
            setClothingItems((cards) =>
              cards.map((card) => (card._id === id ? updatedCard : card))
            );
          })
          .catch((err) => console.error(err))
      : removeItem(id, token)
          .then((updatedCard) => {
            setClothingItems((cards) =>
              cards.map((card) => (card._id === id ? updatedCard : card))
            );
          })
          .catch(console.error);
  };

  // Update user?

  const handleRegistration = (userData) => {
    signup({
      name: userData.name,
      avatar: userData.avatar,
      email: userData.email,
      password: userData.password,
    })
      .then(() => {
        handleLogin({ email: userData.email, password: userData.password });
      })
      .then((user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleLogin = ({ email, password }) => {
    signin({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        setIsLoggedIn(true);
        return checkToken(res.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        // setIsLoggedIn(true);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleAddItemSubmit = (inputValues) => {
    const token = localStorage.getItem("jwt");
    const newCardData = {
      name: inputValues.name,
      imageUrl: inputValues.imageUrl,
      weather: inputValues.weather,
    };

    addItem(newCardData, token)
      .then((data) => {
        setClothingItems([data, ...clothingItems]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleDeleteClick = (_id) => {
    const token = localStorage.getItem("jwt");
    const filteredArr = clothingItems.filter((item) => {
      return item._id != selectedCard._id;
    });

    removeItem(selectedCard._id, token)
      .then(() => {
        setClothingItems(filteredArr);
        closeActiveModal(card);
      })
      .catch(console.error);
  };

  // handleCancel

  const closeActiveModal = () => {
    setActiveModal("");
  };

  // openConfirmationModal

  const handleEditSubmit = ({ name, avatar }) => {
    const token = localStorage.getItem("jwt");
    updateProfileData({ token, name, avatar })
      .then(({ name, avatar }) => {
        setCurrentUser({ ...currentUser, name, avatar });
        closeActiveModal();
      })
      .catch(console.error);
  };

  // const onSecondaryButtonClick = () => {
  //   if (activeModal === "login-user") {
  //     setActiveModal("new-user");
  //   }
  //   if (activeModal === "new-user") {
  //     setActiveModal("login-user");
  //   }
  // };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentTemperatureUnitContext.Provider
        value={{ currentTemperatureUnit, handleToggleSwitchChange }}
      >
        <div className="page">
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              handleSignupClick={handleSignupClick}
              handleLoginClick={handleLoginClick}
              currentDate={currentDate}
              weatherData={weatherData}
              isLoggedIn={isLoggedIn}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    onCardLike={handleCardLike}
                    isLoggedIn={isLoggedIn}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Profile
                      clothingItems={clothingItems}
                      handleCardClick={handleCardClick}
                      handleAddClick={handleAddClick}
                      onEditProfile={handleEditProfileClick}
                      onLogout={handleLogout}
                      isLoggedIn={isLoggedIn}
                      onCardLike={handleCardLike}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>

          <AddItemModal
            isOpen={activeModal === "add-garment"}
            closeActiveClose={closeActiveModal}
            handleAddItemSubmit={handleAddItemSubmit}
          ></AddItemModal>

          <ItemModal
            activeModal={activeModal}
            card={selectedCard}
            closeActiveClose={closeActiveModal}
            handleDeleteClick={handleDeleteClick}
            selectedCard={selectedCard}
            onLoginModalSubmit={handleLogin}
            // onSecondaryButtonClick={onSecondaryButtonClick}
            // isOpen={activeModal === "login-user"}
          />

          <RegisterModal
            isOpen={activeModal === "new-user"}
            closeActiveModal={closeActiveModal}
            onSubmit={handleRegistration}
            // activeModal={activeModal}
            handleSignupClick={handleSignupClick}
            // onSecondaryButtonClick={onSecondaryButtonClick}
          />

          <LoginModal
            isOpen={activeModal === "login-user"}
            closeActiveModal={closeActiveModal}
            onLoginModalSubmit={handleLogin}
            activeModal={activeModal}
            loginClick={handleLoginClick}
            handleSignupClick={handleSignupClick}
            // onSecondButtonClick={onSecondaryButtonClick}
          />

          <EditProfileModal
            closeActiveModal={closeActiveModal}
            // onEditModalSubmit={handleEditSubmit}
            isOpen={activeModal === "edit-profile"}
          />
        </div>
      </CurrentTemperatureUnitContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
