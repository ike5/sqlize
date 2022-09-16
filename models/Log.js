const { Model } = require('sequelize');
const { DB } = require('../models/DB.js');
module.exports = (DataTypes) => {
  /**
   * Associations:
   * - 1:M with User
   */
  class Log extends Model {
    static associate(models) {
      this.belongsTo(models.User);
    }
  }
  Log.init(
    {
      ci_description: DataTypes.TEXT,
      co_description: DataTypes.TEXT,
      ci_timestamp: {
        type: DataTypes.TIME,
        set(value) {
          this.setDataValue('ci_timestamp', value);
        },
      },
      co_timestamp: {
        type: DataTypes.TIME,
        set(value) {
          this.setDataValue('co_timestamp', value);
        },
      },
      messageId: DataTypes.STRING,
      messageReplyId: DataTypes.STRING,
      time_studied: {
        // in unix epoch time
        type: DataTypes.VIRTUAL,
        get() {
          return `${new Date(this.co_timestamp) - new Date(this.ci_timestamp)}`;
        },
        set(value) {
          throw new Error('Do not try to set the `time_studied` value!');
        },
      },
    },
    { sequelize: DB.prototype.sequelize, modelName: 'Log', timestamps: true }
  );
  return Log;
};
