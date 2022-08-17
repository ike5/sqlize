"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tags", {
      name: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      username: {
        type: Sequelize.STRING,
      },
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Tags");
  },
};
