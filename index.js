const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// week9 openweather HW extension: create html form to take Longitude and Latitude and pass those pieces of data tp the index file. From here make a api request that displays weather conditions based on html input// 

app.get("/", function (_req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    // create long and lat variables to hold the input from the html form. check the id to make sure parsing is successful//
    const long = req.body.lonInput;
    const lat = req.body.latInput;

    const encodedLat = encodeURIComponent(lat);
    const encodedLong = encodeURIComponent(long);

    const units = "imperial";
    const mySecret = process.env.API_KEY;
  
//used Claude AI to construct the url to take html form input and use it to get the coordinates from the openweather api//
    const weatherDataURL = `https://api.openweathermap.org/data/2.5/weather? 
    lat=${encodedLat}&lon=${encodedLong}&APPID=${mySecret}&units=${units}`;

    https.get(weatherDataURL, function (response) {
      console.log(response.statusCode);

      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const temp = weatherData.main.temp;
        const humidity = weatherData.main.humidity;
        const clouds = weatherData.clouds.all;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.write("<h1> The weather is " + weatherDescription + "</h1>");
        res.write(`
          <h2>
            The current temperature for this location is ${temp} degrees Fahrenheit. The cloud coverage 
            is ${clouds}% and the humidity level is ${humidity}%.
          </h2>
        `);
        res.write("<img src=" + imageURL + ">");
        res.send();
      });
    });
 });


// Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port");
});