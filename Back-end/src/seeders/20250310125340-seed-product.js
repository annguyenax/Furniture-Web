"use strict";

module.exports = {
  up: async (queryInterface) => {
    // Lấy map slug -> category_id
    const [cats] = await queryInterface.sequelize.query(
      "SELECT category_id, slug FROM Categories;"
    );
    const slugToId = Object.fromEntries(cats.map(c => [c.slug, c.category_id]));
    const requireId = (slug) => {
      const id = slugToId[slug];
      if (!id) {
        throw new Error(
          `Category slug "${slug}" chưa tồn tại. Hãy thêm slug này vào seed-categories hoặc đổi catSlug sản phẩm.`
        );
      }
      return id;
    };

    const now = new Date();

    // Khai báo sản phẩm dùng catSlug (flat category)
    const products = [
      // ===== LIVING / SOFA – TABLES – TV =====
      {
        product_name: "Sofa vải 3 chỗ Oakwood",
        description: "Sofa bọc vải màu trung tính, đệm ngồi êm, khung gỗ sồi.",
        discount: 10.0, stock: 0, sold: 320, weight: 45.0,
        dimensions: "220 x 88 x 80 cm", status: "active",
        average_rating: 4.6, review_count: 0, shop_id: 1,
        catSlug: "sofa",
      },
      {
        product_name: "Ghế thư giãn Armchair Velvet",
        description: "Armchair bọc nhung, tựa lưng cao, chân kim loại mạ.",
        discount: 12.0, stock: 0, sold: 140, weight: 16.0,
        dimensions: "78 x 85 x 100 cm", status: "active",
        average_rating: 4.4, review_count: 0, shop_id: 2,
        catSlug: "sofa",
      },
      {
        product_name: "Bàn trà tròn 80cm Walnut",
        description: "Mặt gỗ veneer walnut chống trầy, chân gỗ đặc.",
        discount: 8.0, stock: 0, sold: 210, weight: 14.0,
        dimensions: "Ø80 x 40 cm", status: "active",
        average_rating: 4.3, review_count: 0, shop_id: 3,
        catSlug: "coffee-table",
      },
      {
        product_name: "Kệ TV 180cm phong cách Bắc Âu",
        description: "Thiết kế tối giản, 2 ngăn kéo + 1 khoang mở.",
        discount: 7.0, stock: 0, sold: 95, weight: 28.0,
        dimensions: "180 x 40 x 45 cm", status: "active",
        average_rating: 4.5, review_count: 0, shop_id: 1,
        catSlug: "tv-console",
      },

      // ===== DINING =====
      {
        product_name: "Bàn ăn tròn 120cm Solid Oak",
        description: "Gỗ sồi nguyên khối, phủ dầu lau an toàn.",
        discount: 9.0, stock: 0, sold: 120, weight: 34.0,
        dimensions: "Ø120 x 75 cm", status: "active",
        average_rating: 4.7, review_count: 0, shop_id: 2,
        catSlug: "dining-table",
      },
      {
        product_name: "Bộ 2 ghế ăn uốn cong Plywood",
        description: "Ghế form công thái học, bề mặt veneer bền đẹp.",
        discount: 6.0, stock: 0, sold: 260, weight: 10.0,
        dimensions: "47 x 50 x 82 cm", status: "active",
        average_rating: 4.2, review_count: 0, shop_id: 3,
        catSlug: "dining-chair",
      },

      // ===== BEDROOM =====
      {
        product_name: "Giường ngủ Queen 1m6 Nordica",
        description: "Khung gỗ sồi, vạt phản, đầu giường bọc vải.",
        discount: 11.0, stock: 0, sold: 180, weight: 52.0,
        dimensions: "206 x 166 x 105 cm", status: "active",
        average_rating: 4.6, review_count: 0, shop_id: 1,
        catSlug: "bed",
      },
      {
        product_name: "Tủ áo 3 cánh cánh lùa Walnut",
        description: "Ray trượt êm, chia khoang tối ưu, gương trong cánh.",
        discount: 13.0, stock: 0, sold: 75, weight: 85.0,
        dimensions: "180 x 60 x 220 cm", status: "active",
        average_rating: 4.5, review_count: 0, shop_id: 2,
        catSlug: "wardrobe",
      },
      {
        product_name: "Tủ đầu giường 2 ngăn kéo",
        description: "Gỗ cao su tiêu chuẩn, tay nắm âm, bo cạnh an toàn.",
        discount: 5.0, stock: 0, sold: 230, weight: 9.0,
        dimensions: "45 x 40 x 50 cm", status: "active",
        average_rating: 4.1, review_count: 0, shop_id: 3,
        catSlug: "nightstand",
      },
      {
        product_name: "Nệm Foam Hybrid 7 vùng nâng đỡ",
        description: "Thoáng khí, ôm lưng, hỗ trợ cột sống khi ngủ.",
        discount: 15.0, stock: 0, sold: 110, weight: 24.0,
        dimensions: "160 x 200 x 25 cm", status: "active",
        average_rating: 4.8, review_count: 0, shop_id: 1,
        catSlug: "mattress",
      },

      // ===== STORAGE & SHELVES =====
      {
        product_name: "Kệ sách 5 tầng khung thép",
        description: "Khung sơn tĩnh điện, đợt MDF chống ẩm.",
        discount: 10.0, stock: 0, sold: 190, weight: 18.0,
        dimensions: "80 x 30 x 180 cm", status: "active",
        average_rating: 4.3, review_count: 0, shop_id: 2,
        catSlug: "bookcase",
      },
      {
        product_name: "Tủ giày 2 cánh cỡ lớn",
        description: "Chia tầng linh hoạt, cửa lùa tiết kiệm diện tích.",
        discount: 8.0, stock: 0, sold: 95, weight: 24.0,
        dimensions: "100 x 35 x 120 cm", status: "active",
        average_rating: 4.0, review_count: 0, shop_id: 3,
        catSlug: "storage",
      },

      // ===== LIGHTING =====
      {
        product_name: "Đèn sàn Scandinavian Arc",
        description: "Chụp vải linen, cần cong kim loại, ánh sáng ấm.",
        discount: 9.0, stock: 0, sold: 135, weight: 7.5,
        dimensions: "Ø40 x 170 cm", status: "active",
        average_rating: 4.4, review_count: 0, shop_id: 1,
        catSlug: "floor-lamp",
      },
      {
        product_name: "Đèn bàn gốm men mờ",
        description: "Đế gốm thủ công, chao vải, công tắc xoay.",
        discount: 6.0, stock: 0, sold: 210, weight: 2.8,
        dimensions: "Ø28 x 45 cm", status: "active",
        average_rating: 4.2, review_count: 0, shop_id: 2,
        catSlug: "table-lamp",
      },

      // ===== DECOR =====
      {
        product_name: "Gương đứng viền kim loại 60x160",
        description: "Kính cường lực, viền mảnh sơn tĩnh điện.",
        discount: 10.0, stock: 0, sold: 175, weight: 12.0,
        dimensions: "60 x 160 x 3 cm", status: "active",
        average_rating: 4.5, review_count: 0, shop_id: 3,
        catSlug: "mirror",
      },
      {
        product_name: "Thảm trải sàn dệt phẳng Nordic",
        description: "Sợi tổng hợp chống bám bẩn, dễ vệ sinh.",
        discount: 14.0, stock: 0, sold: 300, weight: 6.0,
        dimensions: "160 x 230 x 1 cm", status: "active",
        average_rating: 4.3, review_count: 0, shop_id: 1,
        catSlug: "rug",
      },
      {
        product_name: "Bình gốm trang trí set 3",
        description: "Men lì tông trung tính, hợp nhiều không gian.",
        discount: 5.0, stock: 0, sold: 90, weight: 3.2,
        dimensions: "15 x 15 x 30 cm", status: "active",
        average_rating: 4.0, review_count: 0, shop_id: 2,
        catSlug: "vase",
      },

      // ===== OFFICE =====
      {
        product_name: "Bàn làm việc 120cm khung thép",
        description: "Mặt gỗ công nghiệp chống xước, chân chữ U.",
        discount: 9.0, stock: 0, sold: 160, weight: 20.0,
        dimensions: "120 x 60 x 75 cm", status: "active",
        average_rating: 4.2, review_count: 0, shop_id: 1,
        catSlug: "desk",
      },
      {
        product_name: "Ghế công thái học ErgoMesh",
        description: "Tựa lưng lưới, đệm đúc, ngả khóa đa điểm.",
        discount: 12.0, stock: 0, sold: 110, weight: 14.0,
        dimensions: "68 x 65 x 120 cm", status: "active",
        average_rating: 4.5, review_count: 0, shop_id: 2,
        catSlug: "office-chair",
      },

      // ===== OUTDOOR =====
      {
        product_name: "Bàn ngoài trời giả mây 4 ghế",
        description: "Khung nhôm sơn tĩnh điện, sợi mây PE chống UV.",
        discount: 10.0, stock: 0, sold: 70, weight: 32.0,
        dimensions: "Bàn 150 x 90 x 74 cm", status: "active",
        average_rating: 4.1, review_count: 0, shop_id: 3,
        catSlug: "outdoor-table",
      },
      {
        product_name: "Ghế băng ngoài trời gỗ teak",
        description: "Gỗ teak tự nhiên, chịu mưa nắng, bền màu.",
        discount: 8.0, stock: 0, sold: 55, weight: 24.0,
        dimensions: "150 x 60 x 90 cm", status: "active",
        average_rating: 4.4, review_count: 0, shop_id: 1,
        catSlug: "outdoor-chair",
      },

      // ===== EXTRA =====
      {
        product_name: "Bàn console lối vào Veneer Ash",
        description: "Ngăn kéo âm, chân thuôn gọn, phong cách Japandi.",
        discount: 7.0, stock: 0, sold: 84, weight: 17.0,
        dimensions: "120 x 35 x 80 cm", status: "active",
        average_rating: 4.2, review_count: 0, shop_id: 2,
        catSlug: "tv-console",
      },
      {
        product_name: "Kệ treo tường chữ U (bộ 3)",
        description: "MDF phủ melamine, set 3 kích thước lắp ghép.",
        discount: 5.0, stock: 0, sold: 260, weight: 4.0,
        dimensions: "60/45/30 x 15 x 3 cm", status: "active",
        average_rating: 4.1, review_count: 0, shop_id: 3,
        catSlug: "wall-storage",
      },
      {
        product_name: "Gối tựa lưng vải linen 45x45",
        description: "Ruột gòn vi sợi, vỏ tháo giặt, nhiều màu trung tính.",
        discount: 15.0, stock: 0, sold: 410, weight: 0.6,
        dimensions: "45 x 45 x 12 cm", status: "active",
        average_rating: 4.0, review_count: 0, shop_id: 1,
        catSlug: "cushion",
      },
      {
        product_name: "Sofa góc chữ L Urban Grey",
        description: "Sofa vải chống bám bụi, khung gỗ tự nhiên.",
        discount: 8.0, stock: 0, sold: 200, weight: 48.0,
        dimensions: "250 x 160 x 90 cm", status: "active",
        average_rating: 4.5, review_count: 0, shop_id: 1,
        catSlug: "sofa",
      },
      {
        product_name: "Bàn nước mặt kính khung vàng",
        description: "Mặt kính cường lực, khung thép phủ titan.",
        discount: 6.0, stock: 0, sold: 150, weight: 18.0,
        dimensions: "100 x 50 x 45 cm", status: "active",
        average_rating: 4.3, review_count: 0, shop_id: 2,
        catSlug: "coffee-table",
      },
      {
        product_name: "Bàn ăn 6 ghế gỗ cao su",
        description: "Gỗ cao su đã xử lý chống mối mọt.",
        discount: 10.0, stock: 0, sold: 180, weight: 42.0,
        dimensions: "160 x 80 x 75 cm", status: "active",
        average_rating: 4.4, review_count: 0, shop_id: 2,
        catSlug: "dining-table",
      },
      {
        product_name: "Ghế ăn bọc nệm Nordic",
        description: "Khung gỗ sồi, nệm vải bố êm ái.",
        discount: 7.0, stock: 0, sold: 260, weight: 7.0,
        dimensions: "45 x 50 x 85 cm", status: "active",
        average_rating: 4.3, review_count: 0, shop_id: 3,
        catSlug: "dining-chair",
      },
      {
        product_name: "Giường ngủ bọc da PU",
        description: "Khung gỗ tự nhiên, đầu giường êm ái.",
        discount: 9.0, stock: 0, sold: 150, weight: 60.0,
        dimensions: "200 x 160 x 110 cm", status: "active",
        average_rating: 4.4, review_count: 0, shop_id: 1,
        catSlug: "bed",
      },
      {
        product_name: "Gương treo tường bo góc Oval",
        description: "Viền mỏng sơn tĩnh điện, phong cách tối giản.",
        discount: 5.0, stock: 0, sold: 210, weight: 4.0,
        dimensions: "60 x 90 cm", status: "active",
        average_rating: 4.2, review_count: 0, shop_id: 3,
        catSlug: "mirror",
      },
      {
        product_name: "Đèn thả trần 3 bóng Modern Minimal",
        description: "Ánh sáng ấm, phù hợp phòng ăn & phòng khách.",
        discount: 12.0, stock: 0, sold: 120, weight: 3.2,
        dimensions: "Dài 90cm", status: "active",
        average_rating: 4.6, review_count: 0, shop_id: 2,
        catSlug: "pendant",
      },
    ];

    // Map sang shape bảng Products
    const rows = products.map(p => ({
      product_name: p.product_name,
      description: p.description,
      discount: p.discount,
      stock: p.stock,
      sold: p.sold,
      weight: p.weight,
      dimensions: p.dimensions,
      status: p.status,
      average_rating: p.average_rating,
      review_count: p.review_count,
      shop_id: p.shop_id,
      category_id: requireId(p.catSlug),
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert("Products", rows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Products", null, {});
  },
};