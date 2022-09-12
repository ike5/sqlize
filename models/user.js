'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    getAllUsers() {}
  }
  User.init(
    {
      discordId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      discordNickname: DataTypes.STRING,
      date_joined: DataTypes.DATE,
      time_studied: DataTypes.TIME,
      phone: DataTypes.TEXT,
      checkins: DataTypes.INTEGER,
      friendList: DataTypes.TEXT,
    },
    { sequelize, modelName: 'User', timestamps: false }
  );
  return User;
};
