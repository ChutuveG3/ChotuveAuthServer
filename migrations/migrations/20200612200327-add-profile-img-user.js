'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'profile_img_url', {
      type: Sequelize.STRING,
      field: 'profile_img_url'
    }),
  down: queryInterface => queryInterface.removeColumn('users', 'profile_img_url')
};
