"use strict";

module.exports = {
  async up() {
    // Không seed order_items ở môi trường dev
    return Promise.resolve();
  },
  async down(queryInterface) {
    // Cho phép rollback xoá sạch nếu lỡ có dữ liệu demo
    await queryInterface.bulkDelete("Order_Items", null, {});
  }
};