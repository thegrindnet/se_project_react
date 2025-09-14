import "./WeatherCard.css";
import sunny from "../../assets/sunny.svg";

function WeatherCard({ weatherData }) {
  return (
    <section className="weather-card">
      <p className="weather-card__temp">{weatherData.temp.F} &deg; F</p>
      <img className="weather-card__image" src={sunny} alt="sunny weather" />
    </section>
  );
}

export default WeatherCard;
