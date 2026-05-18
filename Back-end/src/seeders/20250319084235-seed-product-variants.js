"use strict";

/**
 * Product_Variants seeder — map theo product_name để không lệch FK.
 * Giữ field đơn giản: color/material/size/price/stock/image_url.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Lấy map name -> id
    const [rows] = await queryInterface.sequelize.query(
      "SELECT product_id, product_name FROM Products;"
    );
    const nameToId = Object.fromEntries(
      rows.map((r) => [r.product_name.trim(), r.product_id])
    );
    const pid = (name) => nameToId[name?.trim()];

    // helper add
    const out = [];
    const add = (productName, variants) => {
      const id = pid(productName);
      if (!id) {
        console.warn(
          `[Product_Variants] Bỏ qua: không tìm thấy product_id cho "${productName}"`
        );
        return;
      }
      variants.forEach((v) =>
        out.push({
          product_id: id,
          size: v.size ?? null,
          color: v.color ?? null,
          material: v.material ?? null,
          storage: null,
          ram: null,
          processor: null,
          weight: v.weight ?? null,
          price: v.price, // VND
          stock: v.stock,
          image_url: v.image_url ?? null,
          created_at: new Date(),
          updated_at: new Date(),
        })
      );
    };

    // ========== LIVING ROOM ==========
    add("Sofa vải 3 chỗ Oakwood", [
      {
        size: "3-seater",
        color: "Beige",
        material: "Fabric/Oak",
        price: 15990000,
        stock: 20,
        image_url:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200",
      },
      {
        size: "3-seater",
        color: "Gray",
        material: "Fabric/Oak",
        price: 15990000,
        stock: 15,
        image_url:
          "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1200",
      },
    ]);

    add("Ghế thư giãn Armchair Velvet", [
      {
        size: null,
        color: "Emerald",
        material: "Velvet/Metal",
        price: 4990000,
        stock: 30,
        image_url: "https://govi.vn/wp-content/uploads/2023/03/JD-V15B-ct1.jpg",
      },
      {
        size: null,
        color: "Navy",
        material: "Velvet/Metal",
        price: 4990000,
        stock: 20,
        image_url:
          "https://govi.vn/wp-content/uploads/2023/03/FU8021-1-ct1.jpg",
      },
    ]);

    add("Bàn trà tròn 80cm Walnut", [
      {
        size: "Ø80 x 40 cm",
        color: "Walnut",
        material: "Veneer/solid wood",
        price: 2890000,
        stock: 40,
        image_url:
          "https://nhaxinh.com/wp-content/uploads/2021/10/Ban-nuoc-tron-Opal-mat-da-tron-O900.jpg",
      },
    ]);

    add("Kệ TV 180cm phong cách Bắc Âu", [
      {
        size: "180 x 40 x 45 cm",
        color: "Oak",
        material: "Engineered wood",
        price: 4790000,
        stock: 25,
        image_url:
          "https://th.bing.com/th/id/OIP.C6GXqXWHyw-3wVLuD0OYrwHaHa?w=183&h=183&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
      },
      {
        size: "180 x 40 x 45 cm",
        color: "Walnut",
        material: "Engineered wood",
        price: 4990000,
        stock: 15,
        image_url:
          "https://images.unsplash.com/photo-1591389703639-a8f3c7b9a07b?q=80&w=1200",
      },
    ]);

    // ========== DINING ==========
    add("Bàn ăn tròn 120cm Solid Oak", [
      {
        size: "Ø120 x 75 cm",
        color: "Natural Oak",
        material: "Solid Oak",
        price: 8990000,
        stock: 18,
        image_url:
          "https://images.unsplash.com/photo-1549497538-303791108f95?q=80&w=1200",
      },
    ]);

    add("Bộ 2 ghế ăn uốn cong Plywood", [
      {
        size: null,
        color: "Walnut",
        material: "Plywood/Veneer",
        price: 2690000,
        stock: 35,
        image_url:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200",
      },
      {
        size: null,
        color: "Oak",
        material: "Plywood/Veneer",
        price: 2690000,
        stock: 35,
        image_url:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200",
      },
    ]);

    // ========== BEDROOM ==========
    add("Giường ngủ Queen 1m6 Nordica", [
      {
        size: "160 x 200 cm",
        color: "Oak",
        material: "Oak/Fabric headboard",
        price: 11990000,
        stock: 20,
        image_url:
          "https://th.bing.com/th/id/OIP.4Hs2XWP7uWoh2flPwTfMAQHaHa?w=183&h=183&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
      },
    ]);

    add("Tủ áo 3 cánh cánh lùa Walnut", [
      {
        size: "180 x 60 x 220 cm",
        color: "Walnut",
        material: "Engineered wood",
        price: 13490000,
        stock: 10,
        image_url:
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200",
      },
    ]);

    add("Tủ đầu giường 2 ngăn kéo", [
      {
        size: "45 x 40 x 50 cm",
        color: "Oak",
        material: "Rubber wood",
        price: 1490000,
        stock: 50,
        image_url:
          "https://spacet-release.s3.ap-southeast-1.amazonaws.com/img/product/2024-08-09/tu-dau-giuong-2-ngan-keo-12933-0-66b5e957f12a11f6de041e06.webp",
      },
      {
        size: "45 x 40 x 50 cm",
        color: "Walnut",
        material: "Rubber wood",
        price: 1590000,
        stock: 40,
        image_url:
          "https://images.unsplash.com/photo-1626986021249-1d9f1ba58828?q=80&w=1200",
      },
    ]);

    add("Nệm Foam Hybrid 7 vùng nâng đỡ", [
      {
        size: "160 x 200 x 25 cm",
        color: "White",
        material: "Foam/Hybrid",
        price: 7990000,
        stock: 25,
        image_url:
          "https://th.bing.com/th/id/OIP.n0Frn9vKFgfMqGo1T0dgigHaHa?w=212&h=212&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
      },
    ]);

    // ========== STORAGE & SHELVES ==========
    add("Kệ sách 5 tầng khung thép", [
      {
        size: "80 x 30 x 180 cm",
        color: "Black",
        material: "Steel/MDF",
        price: 2290000,
        stock: 40,
        image_url:
          "https://product.hstatic.net/200000666677/product/ke_de_do_ks05-80-01_0deffbd2260145dcbc118df899fe37c6_master.jpg",
      },
    ]);

    add("Tủ giày 2 cánh cỡ lớn", [
      {
        size: "100 x 35 x 120 cm",
        color: "White Oak",
        material: "Engineered wood",
        price: 3190000,
        stock: 25,
        image_url:
          "https://noithatminhkhoi.com/upload/images/tu-giay-2-canh-da-nang.jpg",
      },
    ]);

    // ========== LIGHTING ==========
    add("Đèn sàn Scandinavian Arc", [
      {
        size: "Ø40 x 170 cm",
        color: "Black",
        material: "Metal/Linen",
        price: 2590000,
        stock: 30,
        image_url:
          "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=1200",
      },
    ]);

    add("Đèn bàn gốm men mờ", [
      {
        size: "Ø28 x 45 cm",
        color: "Sand",
        material: "Ceramic/Fabric",
        price: 1290000,
        stock: 60,
        image_url:
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200",
      },
    ]);

    // ========== DECOR ==========
    add("Gương đứng viền kim loại 60x160", [
      {
        size: "60 x 160 cm",
        color: "Black",
        material: "Metal/Glass",
        price: 2190000,
        stock: 20,
        image_url:
          "https://pula.vn/storage/images/2023/10/31/o1cn01b8wmsk1wopvwty5wq-22159287.webp",
      },
    ]);

    add("Thảm trải sàn dệt phẳng Nordic", [
      {
        size: "160 x 230 cm",
        color: "Gray",
        material: "Polypropylene",
        price: 1990000,
        stock: 45,
        image_url:
          "https://th.bing.com/th/id/OIP.nJkFWtFbDfBt8atVi7C8nQHaHa?w=204&h=204&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
      },
    ]);

    add("Bình gốm trang trí set 3", [
      {
        size: "Set 3",
        color: "Neutral",
        material: "Ceramic",
        price: 990000,
        stock: 35,
        image_url:
          "https://tse1.mm.bing.net/th/id/OIP.nvbquxuPy1vn2PwrosrIfgHaHa?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
    ]);

    // ========== OFFICE ==========
    add("Bàn làm việc 120cm khung thép", [
      {
        size: "120 x 60 x 75 cm",
        color: "Oak/Black",
        material: "Engineered wood/Steel",
        price: 2590000,
        stock: 30,
        image_url:
          "https://th.bing.com/th/id/OIP.B6-T-CZp5HxnDqTDwGAVZgHaHa?w=203&h=203&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
      },
    ]);

    add("Ghế công thái học ErgoMesh", [
      {
        size: null,
        color: "Black",
        material: "Mesh/ABS",
        price: 3690000,
        stock: 25,
        image_url:
          "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200",
      },
    ]);

    // ========== OUTDOOR ==========
    add("Bàn ngoài trời giả mây 4 ghế", [
      {
        size: "Table 150x90 + 4 chairs",
        color: "Natural",
        material: "Aluminum/PE Rattan",
        price: 6990000,
        stock: 12,
        image_url:
          "https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200",
      },
    ]);

    add("Ghế băng ngoài trời gỗ teak", [
      {
        size: "150 x 60 x 90 cm",
        color: "Teak",
        material: "Solid Teak",
        price: 5990000,
        stock: 10,
        image_url:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
      },
    ]);

    // ========== EXTRA ==========
    add("Bàn console lối vào Veneer Ash", [
      {
        size: "120 x 35 x 80 cm",
        color: "Ash",
        material: "Veneer/MDF",
        price: 3290000,
        stock: 18,
        image_url:
          "https://nhaxinh.com/wp-content/uploads/2021/11/nha-xinh-ban-console.jpg",
      },
    ]);

    add("Kệ treo tường chữ U (bộ 3)", [
      {
        size: "60/45/30 x 15 x 3 cm",
        color: "White",
        material: "MDF/Melamine",
        price: 690000,
        stock: 60,
        image_url:
          "https://i.pinimg.com/originals/7f/92/3b/7f923b1fa2b5085adfa5179a12c66d7a.jpg",
      },
    ]);

    add("Gối tựa lưng vải linen 45x45", [
      {
        size: "45 x 45 cm",
        color: "Beige",
        material: "Linen",
        price: 249000,
        stock: 120,
        image_url:
          "https://th.bing.com/th/id/OIP.Mlnuhluw9i13VIvHP4qGcQHaHa?w=203&h=203&c=7&r=0&o=7&cb=ucfimg2&pid=1.7&rm=3&ucfimg=1",
      },
      {
        size: "45 x 45 cm",
        color: "Gray",
        material: "Linen",
        price: 249000,
        stock: 100,
        image_url:
          "https://images.unsplash.com/photo-1598300183815-4435b94f7d71?q=80&w=1200",
      },
    ]);

    if (!out.length) return;
    await queryInterface.bulkInsert("Product_Variants", out);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Product_Variants", null, {});
  },
};
