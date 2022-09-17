'use strict';
const { Model } = require('sequelize');
const { User } = require('../models/User');
class Friends extends Model {
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
        FriendId: {
          type: DataTypes.STRING,
          references: {
            model: User,
            key: 'discordId',
          },
        },
      },
      {
        sequelize,
        modelName: 'Friends',
        timestamps: false,
      }
    );
  }
}

module.exports = Friends;
