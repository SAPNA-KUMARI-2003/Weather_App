let cityName = document.querySelector(".cityName");
let dateTime = document.querySelector(".dateTime");
let weather_status = document.querySelector(".weather_status");
let weather_temp = document.querySelector(".weather_temp");
let min_temp = document.querySelector(".min_temp");
let max_temp = document.querySelector(".max_temp");
let searchButton = document.querySelector(".searchButton");
let errorMessage = document.querySelector(".error-message"); // Error message element
let weather_icon = document.querySelector(".weather_icon");

const getcountry = (country) => {
    return new Intl.DisplayNames(['en'], { type: "region" }).of(country);
};

const getdateTime = (dt) => {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        minute: "numeric",
        hour: "numeric",
    }).format(new Date(dt * 1000));
};

const checkCityExists = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=423c26fe5c4f3de06e5727af8431c857`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            document.querySelector(".error-message").style.display = "block";
            document.querySelector(".error-message").innerHTML = "City not found";
            return false; // City not found
        }

        // Hide error message if the city is found
        document.querySelector(".error-message").style.display = "none";
        document.querySelector(".error-message").innerHTML = "";
        return true; // ✅ City exists
    } catch (error) {
        console.error("Error checking city:", error);
        document.querySelector(".error-message").style.display = "block";
        document.querySelector(".error-message").innerHTML = "City not found";
        return false;
    }
};


const weather = async (city = "Kota") => {
    console.log("Checking city:", city);

    // ✅ First check if city exists
    const cityExists = await checkCityExists(city);
    if (!cityExists) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = "City not found";
        return; // Stop execution if city is not found
    }

    console.log("Fetching weather data for:", city);
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=423c26fe5c4f3de06e5727af8431c857`;

    try {
        const res = await fetch(weatherUrl);
        const data = await res.json();
        const { main, name, sys, wind, weather, dt } = data;

        // ✅ Update weather details
        cityName.innerHTML = `${name}, ${getcountry(sys.country)}`;
        dateTime.innerHTML = getdateTime(dt);
        weather_status.innerHTML = weather[0].description;
        weather_temp.innerHTML = (main.temp - 273.15).toFixed(2) + "°C";
        min_temp.innerHTML = `Min: ${(main.temp_min - 273.15).toFixed(2)}°C`;
        max_temp.innerHTML = `Max: ${(main.temp_max - 273.15).toFixed(2)}°C`;

        document.querySelector(".feel").innerHTML = `${(main.feels_like - 273.15).toFixed(2)}°C`;
        document.querySelector(".humidd").innerHTML = `${main.humidity}%`;
        document.querySelector(".windss").innerHTML = `${wind.speed}m/s`;
        document.querySelector(".press").innerHTML = `${main.pressure}hPa`;

        ////Icon updated using url
        weather_icon.innerHTML = `<img src= "https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" />`
        
        // ✅ Hide error message when city is found
        errorMessage.style.display = "none";
        errorMessage.innerHTML = "";
    } catch (error) {
        console.error(error);
    }
};

searchButton.addEventListener("click", () => {
    const city = document.querySelector(".input").value.trim();
    if (city) {
        weather(city);
    }
    document.querySelector(".input").value = "";
});

document.addEventListener("DOMContentLoaded", () => {
    weather();
});
