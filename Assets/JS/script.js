const cityNameInput = document.querySelector("#city-name");
const searchForm = document.querySelector("#search-form");
const currentConditionsUl = document.querySelector("#current-forecast #conditions");
const currentConditionsH3 = document.querySelector("#current-forecast h3");
const previousSearches = document.querySelector("#previous-searches");
const dailyCardContainer = document.querySelector("#daily-forecast");
const fiveDayHeader = document.querySelector("#five-day");

let searchValue = "";

const localCityArray = [];

const previousSearch = JSON.parse(localStorage.getItem("searches"));

if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        } else {
            localCityArray.push(previousSearch[i]);
        }
    }
}

const updateSearchHistory = () => {
    const previousSearch = JSON.parse(localStorage.getItem("searches"));

    if (previousSearch === null) {
        previousSearches.classList.add("hidden");
    } else {
        previousSearches.classList.remove("hidden");
        const existingButtons = document.querySelectorAll("#previous-searches button");

        if (existingButtons.length === 0) {
            for (let i = 0; i < previousSearch.length; i++) {
                const searchButton = document.createElement("button");
                searchButton.classList.add("m-2", "btn", "btn-light");
                searchButton.dataset.city = previousSearch[i];
                searchButton.textContent = previousSearch[i];
                searchButton.addEventListener("click", (event) => {
                    callOpenWeather(event.target.dataset.city);
                })
                document.querySelector("#previous-searches .card-body").appendChild(searchButton); 
            }
        } else {
            existingButtons.forEach(button => {
                for (let i = 0; i < previousSearch.length; i++)
                if (button.dataset.city.includes(previousSearch[i])) {
                    previousSearch.splice(i, i + 1);
                }
            })
            for (let i = 0; i < previousSearch.length; i++) {
                const searchButton = document.createElement("button");
                searchButton.classList.add("m-2", "btn", "btn-light");
                searchButton.dataset.city = previousSearch[i];
                searchButton.textContent = previousSearch[i];
                searchButton.addEventListener("click", (event) => {
                    callOpenWeather(event.target.dataset.city);
                })
                document.querySelector("#previous-searches .card-body").appendChild(searchButton); 
            }
        }
    }

    
}

const updateLocalStorage = (city) => {
    console.log(localCityArray);

    if (localCityArray.includes(city)) {
        return;
    } else {
        localCityArray.push(city);

        // Stores for next user visit
        localStorage.setItem("searches", JSON.stringify(localCityArray));
        
        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
    const apiUrlCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=0656324568a33303c80afd015f0c27f8";
    // const apiUrlFuture = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=0656324568a33303c80afd015f0c27f8";


    fetch(apiUrlCoords)
    .then(function (response) {
        if (!response.ok) {
            currentConditionsUl.innerHTML = "";
            currentConditionsH3.textContent = "Try again!";
            const errorText = document.createElement("li");
            errorText.textContent = "City not found.";
            currentConditionsUl.appendChild(errorText);
            dailyCardContainer.innerHTML = "";
            fiveDayHeader.classList.add("hidden");
        } else {
            response.json()
        .then(function (data) {
            console.log(data)

            const cityName = data.name;

            const oneCallUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=0656324568a33303c80afd015f0c27f8";
            fetch(oneCallUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json()
            .then(function (data) {
                console.log(data);
                const icon = ("<img src='http://openweathermap.org/img/w/" + data.current.weather[0].icon + ".png' alt='Weather icon'>");
                currentConditionsH3.innerHTML = cityName + " (" + moment().format("MM/DD/YYYY") + ") " + icon;
                const liArray = [];
                
                currentConditionsUl.innerHTML = "";

                for (let i = 0; i < 4; i++) {
                    const li = document.createElement("li");
                    li.classList.add("mb-2");
                    liArray.push(li);
                }

                liArray[0].innerHTML = "Temperature: " + data.current.temp + " &deg;F" ;
                liArray[1].textContent = "Humidity: " + data.current.humidity + "%";
                liArray[2].textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
                liArray[3].textContent = "UV Index: " + data.current.uvi;

                liArray.forEach(li => {
                    currentConditionsUl.append(li);
                })

                let dailyArray = [];

                dailyCardContainer.innerHTML = "";

                for (let i = 0; i < 5; i++) {
                    const dailyCard = document.createElement("div");
                    dailyCard.innerHTML = `
                    <div class="p-2 m-2 card bg-info text-white">
                        <h5>${moment().add(i + 1, "days").format("MM/DD/YYYY")}</h5>
                        <ul id="conditions">
                            <li><img src='http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png' alt="Weather icon" class="mx-auto"></li>
                            <li>Temp: ${data.daily[i].temp.day} &deg;F</li>
                            <li>Humidity: ${data.daily[i].humidity}%</li>
                        </ul>
                    </div>`;

                    dailyArray.push(dailyCard);
                }

                fiveDayHeader.classList.remove("hidden");

                dailyArray.forEach(card => {
                    dailyCardContainer.appendChild(card);
                })
                // Not called under searchForm event listener to ensure search parameter returns result first
                updateLocalStorage(cityName);
            })
        }
        })
    })
}
})   
}

searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    searchValue = cityNameInput.value.trim("");
    if (searchValue === "") {
        currentConditionsH3.textContent = "Please enter a city!";
        currentConditionsUl.innerHTML = "";
        dailyCardContainer.innerHTML = "";
        fiveDayHeader.classList.add("hidden");
    } else {
        callOpenWeather(searchValue);
        cityNameInput.value = "";
    }
});

updateSearchHistory();

// Default city to display
callOpenWeather("Washington D.C.");