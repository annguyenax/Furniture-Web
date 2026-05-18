import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { FaBars } from "react-icons/fa";

import CategoryPanel from "./CategoryPanel";
import "../Navigation/style.css";

/**
 * ====== DỮ LIỆU DANH MỤC SẢN PHẨM ======
 */
const PRODUCTS_COLS = [
  {
    heading: "Phòng khách",
    items: [
      { id: 1, label: "Sofa & Armchair" },
      { id: 2, label: "Bàn trà" },
      { id: 3, label: "Bàn góc" },
      { id: 4, label: "Kệ / Bàn TV" },
    ],
  },
  {
    heading: "Phòng ăn",
    items: [
      { id: 5, label: "Bàn ăn" },
      { id: 6, label: "Ghế ăn" },
      { id: 7, label: "Ghế bar" },
    ],
  },
  {
    heading: "Phòng ngủ",
    items: [
      { id: 8, label: "Giường ngủ" },
      { id: 9, label: "Tủ áo" },
      { id: 10, label: "Táp đầu giường" },
      { id: 11, label: "Nệm" },
      { id: 12, label: "Bàn trang điểm" },
    ],
  },
  {
    heading: "Làm việc & Lưu trữ",
    items: [
      { id: 30, label: "Bàn làm việc" },
      { id: 31, label: "Ghế công thái học" },
      { id: 13, label: "Kệ sách" },
      { id: 15, label: "Tủ / Kệ đa năng" },
    ],
  },
  {
    heading: "Trang trí",
    items: [
      { id: 16, label: "Đèn trang trí" },
      { id: 20, label: "Gương" },
      { id: 19, label: "Tranh treo" },
      { id: 21, label: "Bình / Lọ" },
      { id: 24, label: "Tượng / Khung hình" },
      { id: 26, label: "Gối & Thảm" },
      { id: 27, label: "Nến & phụ kiện" },
    ],
  },
];

/**
 * ====== NAV EXTRA ITEMS — không điều hướng (URL "#") ======
 */
const NAV_EXTRA_ITEMS = [
  { label: "PHÒNG", to: "#" },
  { label: "BỘ SƯU TẬP", to: "#" },
  { label: "THIẾT KẾ NỘI THẤT", to: "#" },
  { label: "GÓC CẢM HỨNG", to: "#" },
];

const Navigation = () => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const openCategoryPanel = () => setIsOpenCatPanel(true);

  const handleGoCategoryById = (id) => {
    if (!id) return;
    navigate(`/search?category_id=${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="relative border-b border-gray-200 bg-white">
        {/* ===== Desktop ===== */}
        <div className="container px-4 sm:px-6 hidden md:flex items-center justify-center gap-10">
          {/* Trái: Drawer Button */}
          <Button
            className="!text-black flex items-center gap-2 !py-2"
            onClick={openCategoryPanel}
          >
            <HiOutlineMenuAlt1 className="text-[18px]" />
            <span className="truncate text-sm">DANH MỤC NỘI THẤT</span>
          </Button>

          {/* Menu giữa */}
          <ul className="flex items-center gap-6">
            {/* SẢN PHẨM — Normal weight */}
            <li className="relative group">
              <button className="text-[16px] font-normal tracking-wide hover:text-amber-700 flex items-center gap-1">
                SẢN PHẨM <span className="text-amber-600">▾</span>
              </button>

              {/* Mega menu */}
              <div className="megaMenu absolute left-0 top-full w-[min(1100px,92vw)] bg-white shadow-xl border z-[60] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
                  {PRODUCTS_COLS.map((col) => (
                    <div key={col.heading}>
                      <h4 className="text-[15px] font-semibold mb-2">
                        {col.heading}
                      </h4>
                      <ul className="space-y-2">
                        {col.items.map((it) => (
                          <li key={it.id}>
                            <button
                              onClick={() => handleGoCategoryById(it.id)}
                              className="text-[14px] text-gray-700 hover:text-amber-700"
                            >
                              {it.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            {/* NAV EXTRA ITEMS */}
            {NAV_EXTRA_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-[15px] font-normal text-gray-800 hover:text-amber-700 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Mobile ===== */}
        <div
          className="md:hidden container px-4 py-2 flex items-center justify-between"
          ref={mobileMenuRef}
        >
          <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FaBars className="text-lg" />
          </Button>

          <Button
            onClick={openCategoryPanel}
            className="flex items-center gap-1"
          >
            <HiOutlineMenuAlt1 className="text-lg" />
            <span className="text-xs">Danh mục</span>
          </Button>

          {isMobileMenuOpen && (
            <div className="mobileMenu bg-white shadow-xl border absolute left-0 top-full w-full z-[70] max-h-[70vh] overflow-auto">
              <details open className="border-b">
                <summary className="py-3 px-4 text-sm font-semibold">
                  SẢN PHẨM
                </summary>

                {PRODUCTS_COLS.map((col) => (
                  <details key={col.heading} className="border-t">
                    <summary className="py-2 px-5 text-sm font-medium">
                      {col.heading}
                    </summary>

                    <ul className="pl-8 pb-3 space-y-2">
                      {col.items.map((it) => (
                        <li key={it.id}>
                          <button
                            onClick={() => {
                              handleGoCategoryById(it.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className="text-sm block text-left w-full py-1 hover:text-amber-700"
                          >
                            {it.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </details>

              {/* NAV EXTRA — MOBILE */}
              <div className="border-t px-4 py-3 space-y-1 text-sm">
                {NAV_EXTRA_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.to);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-1 text-gray-800 font-normal hover:text-amber-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Drawer */}
      <CategoryPanel
        isOpenCatPanel={isOpenCatPanel}
        setIsOpenCatPanel={setIsOpenCatPanel}
      />
    </>
  );
};

export default Navigation;
