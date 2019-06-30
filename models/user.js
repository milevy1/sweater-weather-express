'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_digest: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      },
    api_key: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.belongsToMany(
      models.Favorite,
      { through: 'UserFavorites',
        as: 'favorites',
        foreignKey: 'favorite_id'}
    );
  };
  return User;
};
