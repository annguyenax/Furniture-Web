module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "reset_password_token", {
      type: Sequelize.STRING(128),
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "reset_password_expires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("Users", "reset_password_expires");
    await queryInterface.removeColumn("Users", "reset_password_token");
  },
};
