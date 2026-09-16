const forecast = require("./just_folder/forecast");
const geocode = require("./just_folder/geocode");

const address = process.argv[2];

if (!address) {
    console.log("Please provide a location.");
    console.log("Example: node app.js Cairo");
    process.exit(1);
}

geocode(address, (error, data) => {
    if (error) {
        console.log("ERROR:", error);
        return;
    }

    forecast(data.latitude, data.longitude, (error, weather) => {
        if (error) {
            console.log("ERROR:", error);
            return;
        }

        console.log("DATA:", weather);
    });
});
