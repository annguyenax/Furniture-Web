// seed-categories.js (FLAT — chỉ danh mục “lá”)
"use strict";

module.exports = {
  async up(qi) {
    const now = new Date();

    const flatLeaves = [
      // Living / console / tables / seating
      { category_name: "Sofa & Armchair", slug: "sofa" },
      { category_name: "Bàn trà", slug: "coffee-table" },
      { category_name: "Bàn góc (Side table)", slug: "side-table" },
      { category_name: "Kệ tivi / Bàn console", slug: "tv-console" },

      // Dining
      { category_name: "Bàn ăn", slug: "dining-table" },
      { category_name: "Ghế ăn", slug: "dining-chair" },
      { category_name: "Ghế bar", slug: "bar-chair" },

      // Bedroom
      { category_name: "Giường ngủ", slug: "bed" },
      { category_name: "Tủ áo", slug: "wardrobe" },
      { category_name: "Táp đầu giường", slug: "nightstand" },
      { category_name: "Nệm", slug: "mattress" },
      { category_name: "Bàn trang điểm", slug: "vanity" },

      // Storage & Shelves
      { category_name: "Kệ sách", slug: "bookcase" },
      { category_name: "Tủ treo tường", slug: "wall-storage" },
      { category_name: "Tủ/kệ đa năng", slug: "storage" },

      // Lighting
      { category_name: "Đèn bàn", slug: "table-lamp" },
      { category_name: "Đèn sàn (floor lamp)", slug: "floor-lamp" },
      { category_name: "Đèn thả trần", slug: "pendant" },

      // Decor
      { category_name: "Tranh", slug: "art" },
      { category_name: "Gương", slug: "mirror" },
      { category_name: "Bình / Lọ", slug: "vase" },
      { category_name: "Thảm", slug: "rug" },
      { category_name: "Tượng / Phù điêu", slug: "sculpture" },
      { category_name: "Khung hình", slug: "frame" },
      { category_name: "Hoa & cây", slug: "plant" },
      { category_name: "Gối trang trí", slug: "cushion" },
      { category_name: "Nến & chân nến", slug: "candle" },

      // Outdoor
      { category_name: "Bàn ngoài trời", slug: "outdoor-table" },
      { category_name: "Ghế ngoài trời", slug: "outdoor-chair" },

      // Office
      { category_name: "Bàn làm việc", slug: "desk" },
      { category_name: "Ghế văn phòng", slug: "office-chair" },
    ].map(x => ({ ...x, parent_id: null, created_at: now, updated_at: now }));

    await qi.bulkInsert("Categories", flatLeaves);
  },

  async down(qi) {
    await qi.bulkDelete("Categories", null, {});
  }
};