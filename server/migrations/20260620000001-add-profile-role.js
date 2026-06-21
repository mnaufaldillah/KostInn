'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Profiles', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Pencari Kost'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Profiles', 'role');
  }
};
