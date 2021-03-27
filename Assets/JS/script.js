// DOM declarations
const cityNameInput = document.querySelector("#city-name");
const searchForm = document.querySelector("#search-form");
const existingButtons = document.querySelectorAll("#previous-searches button");
const currentConditionsUl = document.querySelector("#current-forecast #conditions");
const currentConditionsH3 = document.querySelector("#current-forecast h3");
const previousSearches = document.querySelector("#previous-searches");
const previousSearchContainer = document.querySelector("#previous-searches .card-body");
const dailyCardContainer = document.querySelector("#daily-forecast");
const fiveDayHeader = document.querySelector("#five-day");

// Declares localCityArray in global variable
const localCityArray = [];

// Pulls in previous searches from localStorage
let previousSearch = JSON.parse(localStorage.getItem("searches"));

// Removes any null results stored in localStorage
if (previousSearch !== null) {
    for (let i = 0; i < previousSearch.length; i++) {
        if (previousSearch[i] === null) {
            previousSearch.splice(i, i+1);
        } else {
            // Populates localCityArray to publish previous search buttons
            localCityArray.push(previousSearch[i]);
        }
    }
}

const updateSearchHistory = () => {
    // Pulls localStorage results of previous searches
    previousSearch = JSON.parse(localStorage.getItem("searches"));

    if (existingButtons.length === 0) {
        for (let i = 0; i < previousSearch.length; i++) {
            const searchButton = document.createElement("button");
            searchButton.classList.add("m-2", "btn", "btn-light");
            // Sets data-city attribute on button for event listener to reference
            searchButton.dataset.city = previousSearch[i];
            searchButton.textContent = previousSearch[i];
            searchButton.addEventListener("click", (event) => {
                // References data-city property to call API
                callOpenWeather(event.target.dataset.city);
            })
            previousSearchContainer.appendChild(searchButton); 
        }
    } else {
        existingButtons.forEach(button => {
            // Ensures buttons aren't repeated for existing searches
            for (let i = 0; i < previousSearch.length; i++)
            if (button.dataset.city.includes(previousSearch[i])) {
                previousSearch.splice(i, i + 1);
            }
        })
        for (let i = 0; i < previousSearch.length; i++) {
            const searchButton = document.createElement("button");
            searchButton.classList.add("m-2", "btn", "btn-light");
            // Sets data-city attribute on button for event listener to reference
            searchButton.dataset.city = previousSearch[i];
            searchButton.textContent = previousSearch[i];
            searchButton.addEventListener("click", (event) => {
                // References data-city property to call API
                callOpenWeather(event.target.dataset.city);
            })
            previousSearchContainer.appendChild(searchButton); 
        }
    }
}

const updateLocalStorage = (city) => {
    // Ensures searched city isn't pushed into array (and then localStorage) if city has already been searched
    if (localCityArray.includes(city)) {
        return;
    } else {
        localCityArray.push(city);

        // Stores for next user visit
        localStorage.setItem("searches", JSON.stringify(localCityArray));
        
        // Calls updateSearchHistory to add new search to previous search buttons
        updateSearchHistory();
    }
}

const callOpenWeather = (city) => {
    // Creates URL for initial API call to retrieve latitude and longitude of requested city
    const apiUrlCoords = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=0656324568a33303c80afd015f0c27f8";

    fetch(apiUrlCoords)
    .then(function (response) {
        // Handler if city is not found
        if (!response.ok) {
            currentConditionsUl.innerHTML = "";
            currentConditionsH3.textContent = "Try again!";
            const errorText = document.createElement("li");
            errorText.textContent = "City not found.";
            currentConditionsUl.appendChild(errorText);
            dailyCardContainer.innerHTML = "";
            // Removes .hidden class in case previous search resulted in error
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

                // Evaluation to populate c
                if (data.current.uvi <= 2) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-info uv">${data.current.uvi}</button>`;
                } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-success uv">${data.current.uvi}</button>`;
                } else if (data.current.uvi > 5 && data.current.uvi <= 8) {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-warning uv">${data.current.uvi}</button>`;
                } else {
                    liArray[3].innerHTML = `UV Index: <button class="btn btn-danger uv">${data.current.uvi}</button>`;
                }

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

                // Removes .hidden class in case previous search resulted in error
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

// Adds event listener to search form
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Removes white space from both ends of search term
    let searchValue = cityNameInput.value.trim("");

    // Handler if user submits form with blank field
    if (searchValue === "") {
        currentConditionsH3.textContent = "Please enter a city!";
        currentConditionsUl.innerHTML = "";
        dailyCardContainer.innerHTML = "";
        // Hides 5-day forecast if API won't be called
        fiveDayHeader.classList.add("hidden");
    } else {
        // Calls API to fetch provided value
        callOpenWeather(searchValue);
        // Clears text in input
        cityNameInput.value = "";
    }
});

// Runs on load time to populate search buttons for previous searches in localStorage
updateSearchHistory();

// Default city to display on load time
callOpenWeather("Washington D.C.");