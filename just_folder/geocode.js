const request = require("request");
require("dotenv").config();

const geocode = (address, callback) => {
    const geocodeUrl =
        "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
        encodeURIComponent(address) +
        ".json?access_token=" +
        process.env.MAPBOX_TOKEN;

    if (!process.env.MAPBOX_TOKEN) {
        return callback("MAPBOX_TOKEN is missing. Add it to your .env file", undefined);
    }

    request({ url: geocodeUrl, json: true }, (error, response) => {
        if (error) {
            return callback("unable to connect geocode service", undefined);
        }

        if (!response || !response.body) {
            return callback("invalid response from geocode service", undefined);
        }

        if (response.body.message) {
            return callback(response.body.message, undefined);
        }

        if (!response.body.features || response.body.features.length === 0) {
            return callback("Unable to find location", undefined);
        }

        const location = response.body.features[0];

        callback(undefined, {
            longitude: location.center[0],
            latitude: location.center[1]
        });
    });
};

module.exports = geocode;
