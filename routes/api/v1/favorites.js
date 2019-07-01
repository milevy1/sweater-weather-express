var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var Favorite = require('../../../models').Favorite;
var UserFavorite = require('../../../models').UserFavorite;

// POST /api/v1/favorites
router.post("/", async function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  try {
    // 1. Authenticate API key
    let user = await User.findOne({
      where: {
        api_key: req.body.api_key
        }
      })
    if (user == null) {
      res.status(401).send({"Error": "Unauthorized. Invalid API key."});
    }
    // 2. Find or create a Favorite for req.body.location
    let favorite = await Favorite.findOrCreate({
      where: {
        location: req.body.location
      }
    })
    // 3. Find or create a UserFavorite
    let userFavorite = await UserFavorite.findOrCreate({
      where: {
        user_id: user.dataValues.id,
        favorite_id: favorite[0].dataValues.id
      }
    })
    // 4. Send confirmation
    let response = {
      "message": `${favorite[0].dataValues.location} has been added to your favorites`,
    }
    res.status(200).send(JSON.stringify(response))
    // End of Try, catch errors
  } catch(error) {
      res.status(401).send({ error });
    }
});

// DELETE /api/v1/favorites
router.delete("/", async function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  try {
    // 1. Authenticate API key
    let user = await User.findOne({
      where: {
        api_key: req.body.api_key
        }
      })
    if (user == null) {
      res.status(401).send({"Error": "Unauthorized. Invalid API key."});
    }
    // 2. Find Favorite for req.body.location
    let favorite = await Favorite.findOne({
      where: {
        location: req.body.location
      }
    })
    // 3. Find and destroy a UserFavorite
    let userFavorite = await UserFavorite.findOne({
      where: {
        user_id: user.dataValues.id,
        favorite_id: favorite.dataValues.id
      }
    })
    userFavorite.destroy()
    // 4. Send confirmation
    res.status(204).send()
    // End of Try, catch errors
  } catch(error) {
      res.status(401).send({ error });
    }
});


// GET /api/v1/favorites
router.get("/", async function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  try {
    // 1. Authenticate API key
    let user = await User.findOne({
      where: {
        api_key: req.body.api_key
        }
      })
    if (user == null) {
      res.status(401).send({"Error": "Unauthorized. Invalid API key."});
    }
    // 2. Find all UserFavorites for this user
    let userFavorites = await UserFavorite.findAll({
      where: {
        user_id: user.dataValues.id
      }
    })
    // 3. Convert to ids
    let favoritesIds = userFavorites.map(
      uF => uF.dataValues.favorite_id
    )
    // 4. Find all Favorites with the corresponding UserFavorites.favorite_id
    let favorites = await Favorite.findAll({
      where: {
        id: favoritesIds
      }
    })

    // 4. Map currently for each favorite
    var services = require('../../../services');
    var serializers = require('../../../serializers');
    var response = []

    async function serialize(favorites) {
      for (let i = 0; i < favorites.length; i++) {
        // 4a. Convert location param to longitude/latitude
        let location = favorites[i].dataValues.location
        let _googleMapsService = new services.GoogleMapsService(location)
        let location_data = await _googleMapsService.getData()

        // 4b. Convert longitude/latitude to weather_data
        let _darkSkyService = new services.DarkSkyService(
          location_data.latitude, location_data.longitude)
          let weather_data = await _darkSkyService.getData()

        // 4c. Serialize weather_data
        let _forecastSerializer = new serializers.ForecastSerializer(
          weather_data, location_data)
          let result = {
            "location":        location,
            "current_weather": _forecastSerializer.currently()
          }
          response.push(result)
          // 4. Send confirmation if reached the end
          if (i + 1 == favorites.length) {
            res.status(200).send(JSON.stringify(response))
          }
      }
    }
    // Call the async function
    serialize(favorites);
    // End of Try, catch errors
  } catch(error) {
      res.status(401).send({ error });
    }
});

module.exports = router;
