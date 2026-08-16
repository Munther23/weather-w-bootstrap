const API_KEY = "407c9d7040a5d29658346ae22992b7cc"

const weatherResult = document.getElementById("weather-result");

function mapApiResponse(data) {
    return {
        city: data.name,
        temp: data.main.temp,
        wind: data.wind.speed,
        description: data.weather[0].description,
        iconCode: data.weather[0].icon,
        iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    };
}


$("#search-field").on("submit", function(e) {
    e.preventDefault();
    const search = $("#city-input").val();
    $("#search-error").addClass("d-none");
    fetchWeatherByCity(search)

});

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude: ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    fetchWeatherByCoords(crd.latitude, crd.longitude);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

$("#my-location").on("click", function () {
    navigator.geolocation.getCurrentPosition(success, error, options);
});

function fetchWeatherByCoords(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    $.getJSON(url)
        .done(function (data) {
            displayWeather(mapApiResponse(data));
            addHistory(mapApiResponse(data))
        });
}

function displayWeather(weather) {
    const cardHtml = `
        <div class="weather-card">
            <img src="${weather.iconUrl}" alt="${weather.description}">
            <span>${weather.city}</span>
            <span>${weather.temp.toFixed(2)} °C</span>
            <span>${weather.wind.toFixed(2)} m/s</span>
        </div>
    `;

    $("#weather-result").html(cardHtml);
}


function fetchWeatherByCity(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`;

    $.getJSON(url)
        .done(function (data) {
            const weather = mapApiResponse(data);
            displayWeather(weather)
            addHistory(weather)
        })
        .fail(function (e) {
            if (e.status === 500 || e.status=== 404) {
                $("#search-error")
                .removeClass("d-none")
            }
        });
}

function addHistory(weather) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.unshift(weather);
    history = history.slice(0, 5);
    localStorage.setItem("history", JSON.stringify(history));

    displayHistory();
}

function displayHistory(){
    const history = JSON.parse(localStorage.getItem("history")) || [];

    $("#weather-history").empty();

    history.forEach(function (weather) {
        const li = `
        <div class="weather-card">
            <img src="${weather.iconUrl}" alt="${weather.description}">
            <span>${weather.city}</span>
            <span>${weather.temp.toFixed(2)} °C</span>
            <span>${weather.wind.toFixed(2)} m/s</span>
        </div>
    `;
        $("#weather-history").append(li);
    });
}

$(document).ready(function () {
    displayHistory();
    $("#city-input").popover();
});