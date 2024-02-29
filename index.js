const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//displays index.html of root path
app.get("/", function (_req, res) {
  res.sendFile(__dirname + "/index.html");
});


//invoked after hitting go in the html form
app.post("/", function (req, res) {
  
//hw extention: set var to city so that the weather will be displayed by city instead of zipcode//

const city = req.body.cityInput;

//use encodeURIComponent to embedd the city name pulled from the post request in the openweather API url//  
const encodedCity = encodeURIComponent(city);


//build up the URL for the JSON query.//
const units = "imperial";

//class activity: get API key from openweather and make API key a secret//
const mySecret = process.env['API_KEY']

  //hw extension, change url parameter to querry by city name. I used Claude AI to use the city input from the post request as the {city name} parameter.//
const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=${units}&APPID=${mySecret}`;
 
 
// this gets the data from Open WeatherPI.//

  
  https.get(url, function (response) {
    console.log(response.statusCode);

    // gets individual items from Open Weather API
    response.on("data", function (data) {

      //create a variable that holds the JSON file from API?//
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name;

      //hw extension: use documentation to include humidty and wind speed//
        const humidity = weatherData.main.humidity;
        const wind = weatherData.wind.speed;
        const low = weatherData.main.temp_min;
        const high = weatherData.main.temp_max;
        
      
      const weatherDescription = weatherData.weather[0].description;

      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // displays the output of the results based on city name. how do i change the html based on teh temperature? //
      res.write("<h1> The weather is " + weatherDescription + "<h1>");
      res.write(`
        <h2>
          The current temperature in ${city} is ${temp} degrees Fahrenheit. Expect           a high of ${high} degrees and a low of ${low} degrees.
          The wind speed is ${wind} mph and the humidity is ${humidity}%. 

        </h2>
      `);
      res.write("<img src=" + imageURL +">");
      res.send();
    });
  });
});

//Code will run on 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port");
 
});
