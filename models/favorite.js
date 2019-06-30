'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    location: DataTypes.STRING
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
    Favorite.associate = function(models) {
      Favorite.belongsToMany(
        models.User,
        { through: 'UserFavorites',
          as: 'users',
          foreignKey: 'user_id'}
      );
    };
  };
  return Favorite;
};
