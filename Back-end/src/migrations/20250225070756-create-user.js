module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true, // ← ĐỔI THÀNH TRUE cho Google login
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(15),
        allowNull: true,
        unique: true,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("active", "inactive", "banned"),
        allowNull: false,
        defaultValue: "active",
      },
      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      // Security fields
      login_attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      locked_until: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      last_failed_login: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      // ← GOOGLE OAUTH FIELDS
      google_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      auth_provider: {
        type: Sequelize.ENUM("local", "google"),
        allowNull: false,
        defaultValue: "local",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("Users");
  },
};
