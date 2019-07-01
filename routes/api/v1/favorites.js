var express = require('express');
var router = express.Router();
var User = require('../../../models').User;
var Favorite = require('../../../models').Favorite;
var UserFavorite = require('../../../models').UserFavorite;

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

module.exports = router;
