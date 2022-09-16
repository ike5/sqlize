'use strict';
const { Model, DataTypes } = require('sequelize');
const { DB } = require('./DB');
module.exports = () => {
  class User extends Model {
    getAllUsers() {}
    static associate(models) {
      this.belongsToMany(models.Trophy, { through: models.UserTrophies });
      this.hasMany(models.Log);
      this.belongsToMany(this, { as: 'Parent', through: models.Friends });
      this.belongsToMany(this, { as: 'Sibling', through: models.Friends });
    }
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
    { sequelize: DB.prototype.sequelize, modelName: 'User', timestamps: false }
  );
  return User;
};
