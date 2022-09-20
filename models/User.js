"use strict";
const { Model } = require("sequelize");
const { userData } = require("../modules/user-data");
class User extends Model {
  static associate(models) {
    this.hasMany(models.Log);
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        checkins: DataTypes.INTEGER,
        discordId: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        time_studied: DataTypes.TIME,
        user_data: {
          type: DataTypes.STRING,
          defaultValue: JSON.stringify(Object.assign(userData)),
        },
      },
      {
        sequelize,
        modelName: "User",
        timestamps: false,
      }
    );
  }
}

module.exports = User;
