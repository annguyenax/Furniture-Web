import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";

/**
 * Drawer/Box không dùng ở component này nên bỏ để tránh nhầm props.
 * Cấu trúc mới: danh mục nội thất (2 cấp).
 */

const CATEGORIES = [
    {
        label: "Living Room",
        to: "/collections/living",
        children: [
            { label: "Sofas", to: "/collections/sofa" },
            { label: "Coffee Tables", to: "/collections/coffee-table" },
            { label: "TV Stands", to: "/collections/tv-stand" },
        ],
    },
    {
        label: "Tables & Chairs",
        to: "/collections/table-chair",
        children: [
            {
                label: "Tables",
                to: "/collections/table",
                children: [
                    { label: "Dining Tables", to: "/collections/dining-table" },
                    { label: "Side Tables", to: "/collections/side-table" },
                    { label: "Console Tables", to: "/collections/console-table" },
                ],
            },
            { label: "Chairs", to: "/collections/chair" },
            { label: "Benches & Stools", to: "/collections/stool" },
        ],
    },
    {
        label: "Bedroom",
        to: "/collections/bedroom",
        children: [
            { label: "Beds", to: "/collections/bed" },
            { label: "Wardrobes", to: "/collections/wardrobe" },
            { label: "Nightstands", to: "/collections/nightstand" },
            { label: "Dressers", to: "/collections/dresser" },
        ],
    },
    {
        label: "Storage & Shelves",
        to: "/collections/storage",
        children: [
            { label: "Cabinets", to: "/collections/cabinet" },
            { label: "Bookshelves", to: "/collections/bookshelf" },
            { label: "Wall Shelves", to: "/collections/wall-shelf" },
        ],
    },
    {
        label: "Lighting",
        to: "/collections/lighting",
        children: [
            { label: "Floor Lamps", to: "/collections/floor-lamp" },
            { label: "Table Lamps", to: "/collections/table-lamp" },
            { label: "Pendant Lights", to: "/collections/pendant" },
        ],
    },
    {
        label: "Home Decor",
        to: "/collections/decor",
        children: [
            { label: "Rugs", to: "/collections/rug" },
            { label: "Mirrors", to: "/collections/mirror" },
            { label: "Wall Art", to: "/collections/wall-art" },
        ],
    },
];

const CategoryCollapse = () => {
    // index cấp 1 đang mở
    const [submenuIndex, setSubmenuIndex] = useState(null);
    // index cấp 2 đang mở (nằm trong mục cấp 1 hiện tại)
    const [innerSubmenuIndex, setInnerSubmenuIndex] = useState(null);

    const toggleLevel1 = (idx) => {
        if (submenuIndex === idx) {
            setSubmenuIndex(null);
            setInnerSubmenuIndex(null);
        } else {
            setSubmenuIndex(idx);
            setInnerSubmenuIndex(null); // reset level 2 khi đổi level 1
        }
    };

    const toggleLevel2 = (idx) => {
        setInnerSubmenuIndex(innerSubmenuIndex === idx ? null : idx);
    };

    return (
        <div className="scroll">
            <ul className="w-full">
                {CATEGORIES.map((cat, i) => {
                    const openL1 = submenuIndex === i;
                    const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;

                    return (
                        <li key={cat.label} className="list-none flex items-center relative flex-col mt-2 first:mt-0">
                            <Link to={cat.to} className="w-full">
                                <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.85)]">
                                    {cat.label}
                                </Button>
                            </Link>

                            {hasChildren &&
                                (openL1 ? (
                                    <FiMinusSquare
                                        className="absolute top-[10px] right-[15px] cursor-pointer"
                                        onClick={() => toggleLevel1(i)}
                                    />
                                ) : (
                                    <FaRegSquarePlus
                                        className="absolute top-[10px] right-[15px] cursor-pointer"
                                        onClick={() => toggleLevel1(i)}
                                    />
                                ))}

                            {/* Submenu cấp 1 */}
                            {openL1 && hasChildren && (
                                <ul className="submenu w-full pl-3">
                                    {cat.children.map((child, j) => {
                                        const childHasChildren =
                                            Array.isArray(child.children) && child.children.length > 0;
                                        const openL2 = innerSubmenuIndex === j;

                                        return (
                                            <li key={child.label} className="list-none relative">
                                                <Link to={child.to} className="w-full">
                                                    <Button className="w-full !text-left !justify-start !px-3 !text-[rgba(0,0,0,0.8)]">
                                                        {child.label}
                                                    </Button>
                                                </Link>

                                                {childHasChildren &&
                                                    (openL2 ? (
                                                        <FiMinusSquare
                                                            className="absolute top-[10px] right-[15px] cursor-pointer"
                                                            onClick={() => toggleLevel2(j)}
                                                        />
                                                    ) : (
                                                        <FaRegSquarePlus
                                                            className="absolute top-[10px] right-[15px] cursor-pointer"
                                                            onClick={() => toggleLevel2(j)}
                                                        />
                                                    ))}

                                                {/* Submenu cấp 2 */}
                                                {openL2 && childHasChildren && (
                                                    <ul className="inner_submenu w-full pl-3">
                                                        {child.children.map((g) => (
                                                            <li key={g.label} className="list-none relative mb-1">
                                                                <Link to={g.to} className="w-full">
                                                                    <Button className="w-full !text-left !justify-start !px-3 transition !text-[14px]">
                                                                        {g.label}
                                                                    </Button>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CategoryCollapse;
