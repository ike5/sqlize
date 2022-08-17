"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tag.init(
    {
      name: {
        type: DataTypes.STRING,
        primaryKey: true,
        unique: true,
      },
      description: DataTypes.TEXT,
      username: DataTypes.STRING,
      usage_count:{
        type:DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      } 
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
