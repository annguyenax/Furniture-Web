"use strict";

/**
 * Seeder: Shops (phiên bản Furniture-only)
 * - Tự động tìm user_id của các user có role 'vendor' để gán owner_id
 * - Tránh lỗi FK khi DB được migrate/seed lại và user_id thay đổi
 */
module.exports = {
  up: async (queryInterface) => {
    // Lấy danh sách vendor user_id hiện có trong DB
    const [vendors] = await queryInterface.sequelize.query(`
      SELECT u.user_id
      FROM Users u
      JOIN User_Roles ur ON ur.user_id = u.user_id
      JOIN Roles r ON r.role_id = ur.role_id
      WHERE r.role_name = 'vendor'
      ORDER BY u.user_id ASC
    `);

    if (!vendors || vendors.length === 0) {
      throw new Error(
        "[Shops seeder] Không tìm thấy user có role 'vendor'. Hãy seed Roles, Users, User_Roles trước!"
      );
    }

    // Helper chọn owner_id lần lượt từ danh sách vendors
    const pickOwner = (i) => vendors[i % vendors.length].user_id;
    const now = new Date();

    // Chỉ để furniture/home-living; không còn electronics, pets, v.v.
    const shops = [
      {
        owner_id: pickOwner(0),
        shop_name: "Nhà Xinh Furniture",
        description: "Nội thất tinh gọn phong cách Japandi & Scandinavian.",
        logo: "https://th.bing.com/th/id/OIP.CovrwJYhFExlfEEUHK2B6gHaHa?w=167&h=180&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
        banner:
          "https://th.bing.com/th?q=Furniture+Banner+Image+in+Yellow+Background&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&pid=InlineBlock&rm=3&ucfimg=1&mkt=en-WW&cc=VN&setlang=vi&adlt=moderate&t=1&mw=247",
        rating: 4.8,
        followers: 5200,
        total_products: 240,
        views: 18500,
        address: "90 Phạm Văn Đồng, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(1),
        shop_name: "Scandi Living",
        description:
          "Sofa vải, bàn trà, kệ TV chuẩn Bắc Âu – tối giản và ấm áp.",
        logo: "https://images.unsplash.com/photo-1617093727343-374698b1b08a?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1600&auto=format&fit=crop",
        rating: 4.7,
        followers: 3100,
        total_products: 180,
        views: 9700,
        address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(2),
        shop_name: "Bedroom Studio",
        description: "Giường gỗ sồi, tủ áo cánh lùa, nệm foam hybrid.",
        logo: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1600&auto=format&fit=crop",
        rating: 4.6,
        followers: 2100,
        total_products: 120,
        views: 7800,
        address: "78 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(3),
        shop_name: "Dining Atelier",
        description: "Bàn ăn gỗ tự nhiên & bộ ghế uốn cong ergonomic.",
        logo: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop",
        rating: 4.5,
        followers: 1800,
        total_products: 95,
        views: 6200,
        address: "45 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(4),
        shop_name: "Lighting House",
        description: "Đèn sàn, đèn bàn gốm, đèn thả – ánh sáng ấm áp.",
        logo: "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
        rating: 4.6,
        followers: 1500,
        total_products: 130,
        views: 7000,
        address: "12 Võ Văn Kiệt, TP. Thủ Đức, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(5),
        shop_name: "Office & Study",
        description: "Bàn làm việc 120cm, ghế công thái học ErgoMesh.",
        logo: "https://images.unsplash.com/photo-1505409859467-3a796fd5798e?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
        rating: 4.4,
        followers: 1700,
        total_products: 110,
        views: 6400,
        address: "87 Cách Mạng Tháng 8, Quận 3, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(6),
        shop_name: "Outdoor Patio",
        description: "Bàn ghế ngoài trời giả mây, gỗ teak chống thời tiết.",
        logo: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
        rating: 4.5,
        followers: 1200,
        total_products: 90,
        views: 5200,
        address: "15 Tân Bình, Quận Tân Bình, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
      {
        owner_id: pickOwner(7),
        shop_name: "Minimal Objects",
        description: "Gương đứng viền kim loại, thảm Nordic, bình gốm.",
        logo: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=400&auto=format&fit=crop",
        banner:
          "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop",
        rating: 4.6,
        followers: 1900,
        total_products: 150,
        views: 6100,
        address: "22 Đồng Khởi, Quận 1, TP. Hồ Chí Minh",
        status: "active",
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("Shops", shops);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Shops", null, {});
  },
};
