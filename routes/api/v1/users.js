var express = require('express');
var router = express.Router();
var User = require('../../../models').User;

/*POST new user for account creation*/
router.post("/", function(req, res, next) {
  const params = req.body
  res.setHeader("Content-Type", "application/json");

  // Check if password / confirmation match
  if (params.password != params.password_confirmation) {
    res.status(500).send({"Error": "Passwords do not match."});
  } else {
    // Generate API key & create user
    // bcrypt to hash the password
    const UIDGenerator = require('uid-generator');
    const uidgen = new UIDGenerator();
    const bcrypt = require('bcrypt');

    bcrypt.hash(params.password, 10, function(err, hash) {
      User.create({
        email: params.email,
        password_digest: hash,
        api_key: uidgen.generateSync()
      })
      .then(user => {
        res.status(201).send(JSON.stringify(
          {
            "api_key": user.api_key,
          }
        ));
      })
      .catch(error => {
        res.status(500).send({ error });
      });
    });
  }
});

module.exports = router;
