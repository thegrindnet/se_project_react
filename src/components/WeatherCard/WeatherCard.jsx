import "./WeatherCard.css";
import sunny from "../../assets/sunny.svg";

function WeatherCard() {
  return (
    <section className="weather-card">
      <p className="weather-card__temp">75 &deg; F</p>
      <img className="weather-card__image" src={sunny} alt="sunny weather" />
    </section>
  );
}

export default WeatherCard;
