const { Model } = require('sequelize');
const {User } = require('./User.js')
const {Trophy} = require('../models/Trophy.js')
module.exports = (sequelize, DataTypes) => {
  class UserTrophies extends Model {}
  UserTrophies.init(
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
  return UserTrophies;
};
