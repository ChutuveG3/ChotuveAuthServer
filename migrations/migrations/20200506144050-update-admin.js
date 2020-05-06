'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('admins', 'user_name'),
      queryInterface.addColumn('admins', 'first_name', {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name'
      }),
      queryInterface.addColumn('admins', 'last_name', {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name'
      })
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.removeColumn('admins', 'firstName'),
      queryInterface.removeColumn('admins', 'lastName'),
      queryInterface.addColumn('admins', 'userName', {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'user_name',
        unique: true
      })
    ])
};
