'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add security columns to users table
    await queryInterface.addColumn('users', 'failed_login_attempts', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('users', 'account_locked_until', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'last_failed_login', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'password_changed_at', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    await queryInterface.addColumn('users', 'token_version', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });

    await queryInterface.addColumn('users', 'backup_codes', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'failed_login_attempts');
    await queryInterface.removeColumn('users', 'account_locked_until');
    await queryInterface.removeColumn('users', 'last_failed_login');
    await queryInterface.removeColumn('users', 'password_changed_at');
    await queryInterface.removeColumn('users', 'token_version');
    await queryInterface.removeColumn('users', 'backup_codes');
  }
};
