'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('servers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'name'
      },
      apiKey: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'api_key'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATEONLY
      }
    }),
  down: queryInterface => queryInterface.dropTable('servers')
};
