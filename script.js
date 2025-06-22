const weatherApiKey = "a799814e43b2f425b6837cc5330e82e6";
const unsplashApiKey = "zzFuh5DDSIUQ6EDgDIHH7eS-sjuxwel3VVSXPZgSU-0";

const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const cityInput = document.getElementById("city");
const unitToggle = document.getElementById("unitToggle");

let unit = localStorage.getItem("unit") || "metric";

unitToggle.addEventListener("click", () => {
  unit = unit === "metric" ? "imperial" : "metric";
  localStorage.setItem("unit", unit);
  const city = cityInput.value;
  if (city) {
    fetchWeather(city);
    fetchCityImage(city);
  }
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value;
  if (city) {
    fetchWeather(city);
    fetchCityImage(city);
  }
});

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => {
        alert("Unable to fetch your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=${unit}`
    );
    const data = await response.json();
    if (data.cod === 200) {
      displayWeather(data);
    } else {
      alert("City not found!");
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function fetchCityImage(city) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashApiKey}&per_page=1`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const imageUrl = data.results[0].urls.full;
      document.body.style.backgroundImage = `url(${imageUrl})`;
    } else {
      console.log("No images found for this city.");
    }
  } catch (error) {
    console.error("Error fetching city image:", error);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=${unit}`
    );
    const data = await response.json();
    const city = data.name;
    fetchWeather(city);
    fetchCityImage(city);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function displayWeather(data) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  document.getElementById("cityName").textContent = `Weather in ${data.name}`;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}${tempUnit}`;
  document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("windSpeed").textContent = `Wind Speed: ${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"}`;
  document.getElementById("weatherInfo").classList.remove("hidden");
}

// Dark mode toggle (optional button handler)
const darkToggle = document.createElement("button");
darkToggle.textContent = "🌓 Toggle Dark Mode";
darkToggle.style.marginTop = "10px";
document.querySelector(".search").appendChild(darkToggle);
document.body.classList.toggle('dark-mode');

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
});

window.addEventListener("load", () => {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
