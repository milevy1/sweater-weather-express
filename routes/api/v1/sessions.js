var express = require('express');
var router = express.Router();
var User = require('../../../models').User;

/*POST new session for account login*/
router.post("/", function(req, res, next) {
  const params = req.body
  res.setHeader("Content-Type", "application/json");

  User.findAll({
    where: {
      email: params.email
    }
  })
  .then(userData => {
    const user = userData[0].dataValues;
    const bcrypt = require('bcrypt');
    bcrypt.compare(params.password, user.password_digest, function(err, result) {
      // result == true if valid password
      if (result) {
        res.status(200).send(JSON.stringify(
          {
            "api_key": user.api_key,
          }
        ));
      } else {
        res.status(500).send({"Error": "Invalid password"});
      }
    });
  })
  .catch(error => {
    res.status(500).send({ error });
  });
});

module.exports = router;
