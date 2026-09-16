const request = require("request");
require("dotenv").config();

const forecast = (latitude, longitude, callback) => {
    if (!process.env.WEATHER_API_KEY) {
        return callback("WEATHER_API_KEY is missing. Add it to your .env file", undefined);
    }

    const url =
        "https://api.weatherapi.com/v1/current.json?key=" +
        process.env.WEATHER_API_KEY +
        "&q=" +
        latitude +
        "," +
        longitude;

    request({ url, json: true }, (error, response) => {
        if (error) {
            return callback("unable to connect weather api service", undefined);
        }

        if (!response || !response.body) {
            return callback("invalid response from weather api service", undefined);
        }

        if (response.body.error) {
            return callback(response.body.error.message, undefined);
        }

        callback(
            undefined,
            response.body.location.name +
                " it is: " +
                response.body.current.condition.text +
                " and temp is: " +
                response.body.current.temp_c +
                "°C"
        );
    });
};

module.exports = forecast;
