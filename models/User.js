'use strict';
const { Model } = require('sequelize');
class User extends Model {
  static associate(models) {
    this.hasMany(models.Log);
  }
  static init(sequelize, DataTypes) {
    return super.init(
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
      {
        sequelize,
        modelName: 'User',
        timestamps: false,
      }
    );
  }
}

module.exports = User;
