'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserFavorite = sequelize.define('UserFavorite', {
    user_id: DataTypes.INTEGER,
    favorite_id: DataTypes.INTEGER
  }, {});
  UserFavorite.associate = function(models) {
    // associations can be defined here
  };
  return UserFavorite;
};
