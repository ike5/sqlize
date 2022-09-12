const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Trophy extends Model {
    getAllTrophies() {}
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, { through: models.UserTrophies });
    }
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
