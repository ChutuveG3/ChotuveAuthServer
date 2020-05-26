'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('users', 'birthdate', { type: Sequelize.DATEONLY, allowNull: false }),
      queryInterface.changeColumn('users', 'updated_at', { type: Sequelize.DATE })
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('users', 'birthdate', { type: Sequelize.DATE, allowNull: false }),
      queryInterface.changeColumn('users', 'updated_at', { type: Sequelize.DATEONLY })
    ])
};
