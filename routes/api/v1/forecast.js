var express = require('express');
var router = express.Router();
var User = require('../../../models').User;

var services = require('../../../services');
var serializers = require('../../../serializers');

router.get("/", async function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  try {
    // 1. Authenticate API key
    let user = await User.findAll({
      where: {
        api_key: req.body.api_key
        }
      })
    if (typeof user[0] == "undefined") {
      res.status(401).send({"Error": "Unauthorized. Invalid API key."});
    }

    // 2. Convert location param to longitude/latitude
    let location = req.query.location
    let _googleMapsService = new services.GoogleMapsService(location)
    let location_data = await _googleMapsService.getData()

    // 3. Convert longitude/latitude to weather_data
    let _darkSkyService = new services.DarkSkyService(
      location_data.latitude, location_data.longitude)
    let weather_data = await _darkSkyService.getData()

    // 4. Serialize weather_data
    let _forecastSerializer = new serializers.ForecastSerializer(
      weather_data, location_data)
    let response = _forecastSerializer.response()

    res.status(200).send(JSON.stringify(response))
    // End of Try, catch errors
  } catch(error) {
      res.status(401).send({ error });
    }
});

module.exports = router;
