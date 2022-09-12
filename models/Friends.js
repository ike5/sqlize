const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friends extends Model {}
  Friends.init(
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
    { sequelize, modelName: 'Friends', timestamps: false }
  );
  return Friends;
};
