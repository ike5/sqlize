const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  /**
   * Associations:
   * - 1:M with User
   */
  class Log extends Model {}
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
    { sequelize, modelName: 'Log', timestamps: true }
  );
  return Log;
};
