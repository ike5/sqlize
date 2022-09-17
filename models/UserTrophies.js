'use strict'
const { Model } = require('sequelize');
const { User } = require('../models/User.js');
const { Trophy } = require('../models/Trophy.js');

class UserTrophies extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        UserId: {
          type: DataTypes.STRING,
          references: {
            model: User,
            key: 'discordId',
          },
        },
        TrophyId: {
          type: DataTypes.INTEGER,
          references: {
            model: Trophy,
            key: 'id',
          },
        },
      },
      { sequelize, modelName: 'UserTrophies', timestamps: false }
    );
  }
}
module.exports = UserTrophies;