const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trophy extends Model {
    getAllTrophies() {}
    Trophy.belongsToMany(User, { through: UserTrophies });
  }
  Trophy.init(
    {
      trophy_name: DataTypes.STRING,
      description: DataTypes.TEXT,
      date_earned: DataTypes.DATE,
    },
    { sequelize, modelName: 'Trophy', timestamps: false }
  );
  return Trophy;
};
