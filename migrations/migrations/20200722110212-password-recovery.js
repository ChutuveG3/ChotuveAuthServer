'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('recovery_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      recovery_token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('recovery_tokens')
};
