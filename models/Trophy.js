'use strict'
const { Model } = require('sequelize');

class Trophy extends Model {
  static associate(models) {
    // define association here
    this.belongsToMany(models.User, { through: models.UserTrophies });
  }
  static init(sequelize, DataTypes) {
    return super.init(
      {
        trophy_name: DataTypes.STRING,
        description: DataTypes.TEXT,
        date_earned: DataTypes.DATE,
      },
      { sequelize, modelName: 'Trophy', timestamps: false }
    );
  }
}
module.exports = Trophy;