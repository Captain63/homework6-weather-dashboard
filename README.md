# OpenWeather Dashboard

## Project Overview
Weather Dashboard 1.0 buildout. Developer created single-window application to display current weather and 5-day forecast for cities searched by user. Application leverages <a href="https://openweathermap.org/api" target="_blank">OpenWeather API</a> to pull weather and forecast informaton for cities across the world. JavaScript is used to dynamically update HTML with data requested through fetch methods and parsed by JSON, and UI is structured using Bootstrap with minimal CSS customizations for sleek, mobile-first interface. Moment.js is called to display current date and future dates for 5-day forecast.

localStorage is leveraged to save search queries so that user can access previous searches under Previous Searches section during current session and between sessions in browser. User is able to easily search previous cities with buttons that are assigned event listeners to call OpenWeather API with associated city by pulling the button's custom data-city HTML attribute.

### Technologies Used:
<ul>
<li>JavaScript</li>
<li>HTML</li>
<li>CSS</li>
</ul>

### External Libraries/APIs Used:
<ul>
<li><a href="https://openweathermap.org/api" target="_blank">OpenWeather API</a></li>
<li><a href="https://momentjs.com/" target="_blank">Moment.js</a></li>
<li><a href="https://getbootstrap.com/" target="_blank">Bootstrap</a></li>
</ul>

## Live Application
https://captain63.github.io/weather-dashboard/

## Screenshot of Application
![Screenshot of running application showing current weather and 5-day forecast for Washington D.C.](./Assets/Images/completed-application.PNG)
