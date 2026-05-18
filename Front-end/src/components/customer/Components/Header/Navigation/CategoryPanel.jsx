import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams, createSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";

const CategoryPanel = ({ isOpenCatPanel, setIsOpenCatPanel }) => {
    const [openIdx, setOpenIdx] = useState(null); // nếu sau này nhóm cha/con
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const toggle = (i) => setOpenIdx(openIdx === i ? null : i);
    const close = () => setIsOpenCatPanel(false);

    // Đọc category_id hiện tại để tick
    const currentCategoryId = Number(searchParams.get("category_id"));

    // === DANH MỤC: dùng ID thật từ DB của bạn ===
    const CATS = [
        { id: 1, label: "Sofa & Armchair" },
        { id: 2, label: "Bàn trà" },
        { id: 3, label: "Bàn góc (Side table)" },
        { id: 4, label: "Kệ tivi / Bàn console" },
        { id: 5, label: "Bàn ăn" },
        { id: 6, label: "Ghế ăn" },
        { id: 7, label: "Ghế bar" },
        { id: 8, label: "Giường ngủ" },
        { id: 9, label: "Tủ áo" },
        { id: 10, label: "Táp đầu giường" },
        { id: 11, label: "Nệm" },
        { id: 12, label: "Bàn trang điểm" },
        { id: 13, label: "Kệ sách" },
        { id: 14, label: "Tủ treo tường" },
        { id: 15, label: "Tủ/kệ đa năng" },
        { id: 16, label: "Đèn bàn" },
        { id: 17, label: "Đèn sàn (floor lamp)" },
        { id: 18, label: "Đèn thả trần" },
        { id: 19, label: "Tranh" },
        { id: 20, label: "Gương" },
        { id: 21, label: "Bình / Lọ" },
        { id: 22, label: "Thảm" },
        { id: 23, label: "Tượng / Phù điêu" },
        { id: 24, label: "Khung hình" },
        { id: 25, label: "Hoa & cây" },
        { id: 26, label: "Gối trang trí" },
        { id: 27, label: "Nến & chân nến" },
        { id: 28, label: "Bàn ngoài trời" },
        { id: 29, label: "Ghế ngoài trời" },
        { id: 30, label: "Bàn làm việc" },
        { id: 31, label: "Ghế văn phòng" },
    ];

    // Giữ lại các query khác khi điều hướng
    const navigateWithMergedParams = (nextParamsObj) => {
        const current = Object.fromEntries(searchParams.entries());
        const merged = { ...current, ...nextParamsObj };

        // Loại key rỗng
        Object.keys(merged).forEach((k) => {
            if (merged[k] === undefined || merged[k] === null || merged[k] === "") {
                delete merged[k];
            }
        });

        navigate({
            pathname: "/search",
            search: `?${createSearchParams(merged).toString()}`,
        });
        close();
    };

    const handleSelectCategory = (id) => {
        navigateWithMergedParams({ category_id: id });
    };

    return (
        <Drawer
            anchor="left"
            open={isOpenCatPanel}
            onClose={close}
            PaperProps={{ sx: { width: { xs: 320, sm: 360 } } }}
        >
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-[16px] font-semibold">Danh mục nội thất</h3>
                <button
                    onClick={close}
                    className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                    <IoCloseSharp className="text-xl" />
                </button>
            </div>

            <Box sx={{ height: "100%", overflowY: "auto" }}>
                <ul className="divide-y">
                    {CATS.map((cat) => {
                        const active = currentCategoryId === cat.id;
                        return (
                            <li key={cat.id} className="list-none">
                                <button
                                    onClick={() => handleSelectCategory(cat.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-[15px] font-medium hover:bg-gray-50 ${active ? "bg-gray-100" : ""
                                        }`}
                                >
                                    <span>{cat.label}</span>
                                    {active && <FaCheck className="text-[14px]" aria-label="selected" />}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </Box>
        </Drawer>
    );
};

export default CategoryPanel;
