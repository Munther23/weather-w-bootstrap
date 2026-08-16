const baseURL = "api.openweathermap.org/data/2.5/weather?q=CITY,C&APPID=407c9d7040a5d29658346ae22992b7cc";

const searchField = document.getElementById("search-field");
const movieList = document.getElementById("movie-list");


$("#search-field input").on("input", function() {
    let search = $(this).val();
    
    if (search.length >= 3) {
        onSearch(search);
    } else {
        movieList.innerHTML = "";
    }
});

async function onSearch(search) {
    search = search.split(" ").join("+");
    const response = await fetch(baseURL + search);
    const data = await response.json();
    displayWeather(data);
}

function displayWeather(data){
    movieList.innerHTML = "";
    data.Search.forEach(movie => {
    let li = "<li><img src='" + movie.Poster + "'><span>" + movie.Title + "</span><span>" + movie.Year + "</span></li>";
    movieList.innerHTML += li;
});
}