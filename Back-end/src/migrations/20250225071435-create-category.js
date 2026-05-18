'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
      category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      // 👉 Thêm slug: khóa duy nhất, URL-safe
      slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
        // có thể thêm validate ở model, migration không xử lý generate slug
      },

      category_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'Categories', key: 'category_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',     // xoá cha thì con được set null, tránh lỗi cascade vòng
      },

      description: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE },
    });

    // Index tối ưu truy vấn
    await queryInterface.addIndex('Categories', ['slug'], {
      name: 'categories_slug_uindex',
      unique: true,
    });
    await queryInterface.addIndex('Categories', ['parent_id'], {
      name: 'categories_parent_idx',
    });
    // (Tuỳ chọn) tránh trùng tên trong cùng 1 parent:
    await queryInterface.addIndex('Categories', ['parent_id', 'category_name'], {
      name: 'categories_parent_name_uq',
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Categories', 'categories_parent_name_uq').catch(() => { });
    await queryInterface.removeIndex('Categories', 'categories_parent_idx').catch(() => { });
    await queryInterface.removeIndex('Categories', 'categories_slug_uindex').catch(() => { });
    await queryInterface.dropTable('Categories');
  },
};