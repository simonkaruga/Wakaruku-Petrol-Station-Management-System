'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing category column
    await queryInterface.removeColumn('products', 'category');
    
    // Recreate it as an enum with proper default
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.ENUM('fuel', 'lubricant', 'accessory', 'service'),
      defaultValue: 'fuel',
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the enum column
    await queryInterface.removeColumn('products', 'category');
    
    // Recreate as string
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
