import React, { useState, useContext } from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { SlWallet } from "react-icons/sl";
import { LuGift } from "react-icons/lu";
import { BiSupport } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa";
import { RiYoutubeLine } from "react-icons/ri";
import Drawer from "@mui/material/Drawer";
import CartPanel from "../CartPanel";
import { IoCloseSharp } from "react-icons/io5";
import MyContext from "../../../../context/MyContext";

const Footer = () => {
  const context = useContext(MyContext);

  return (
    <>
      {/* ⭐ TOP FOOTER INFO */}
      <footer className="py-6 bg-[#2B2C31] text-[#E6E6E6]">
        <div className="container">
          {/* ===== ICON ROW ===== */}
          <div className="flex items-center justify-center gap-2 py-8">
            {[
              {
                icon: LiaShippingFastSolid,
                title: "Free Shipping",
                text: "For Orders Over $100",
              },
              {
                icon: PiKeyReturn,
                title: "30 Days Returns",
                text: "Easy product exchange",
              },
              {
                icon: SlWallet,
                title: "Secured Payment",
                text: "Cards Accepted",
              },
              { icon: LuGift, title: "Special Gifts", text: "For First Order" },
              {
                icon: BiSupport,
                title: "Support 24/7",
                text: "Contact Anytime",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="col flex items-center justify-center flex-col w-[15%] group"
              >
                <item.icon className="text-[40px] text-[#C9C9C9] transition-all duration-300 group-hover:text-white group-hover:-translate-y-1" />
                <h3 className="text-[16px] font-[600] mt-3 text-[#E6E6E6]">
                  {item.title}
                </h3>
                <p className="text-[12px] text-[#BFBFBF]">{item.text}</p>
              </div>
            ))}
          </div>

          {/* ===== MAIN FOOTER SECTIONS ===== */}
          <div className="footer flex gap-10 py-10 text-[#E6E6E6]">
            {/* LEFT */}
            <div className="part1 w-[25%] border-r border-white/10 pr-6">
              <h2 className="text-[20px] font-[600] mb-4 text-white">
                Liên hệ
              </h2>

              <p className="text-[13px] text-[#C9C9C9] pb-4">
                Classyshop - Mega Super Store
                <br />
                97 - Man Thiện, Hiệp Phú, Thủ Đức
              </p>

              <Link
                to="mailto:sales@classyshop.com"
                className="text-[13px] text-[#E6E6E6] hover:text-white"
              >
                sales@classyshop.com
              </Link>

              <span className="text-[22px] font-[600] block mt-3 mb-5 text-white">
                0334-074-016
              </span>

              <div className="flex items-center gap-2">
                <IoChatboxOutline className="text-[40px] text-white" />
                <span className="text-[16px] font-[600] text-white">
                  Online Chat <br /> Hỗ trợ nhanh
                </span>
              </div>
            </div>

            {/* MIDDLE */}
            <div className="part2 w-[40%] flex pl-8 gap-10">
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4 text-white">
                  Sản phẩm
                </h2>

                <ul>
                  {[
                    "Giảm giá",
                    "Sản phẩm mới",
                    "Bán chạy",
                    "Liên hệ",
                    "Sitemap",
                    "Hệ thống cửa hàng",
                  ].map((t, i) => (
                    <li key={i} className="mb-2">
                      <Link className="text-[14px] text-[#C9C9C9] hover:text-white">
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="part2_col2 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4 text-white">
                  Công ty
                </h2>

                <ul>
                  {[
                    "Giao hàng",
                    "Chính sách",
                    "Điều khoản",
                    "Giới thiệu",
                    "Thanh toán",
                    "Đăng nhập",
                  ].map((t, i) => (
                    <li key={i} className="mb-2">
                      <Link className="text-[14px] text-[#C9C9C9] hover:text-white">
                        {t}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT */}
            <div className="part2 w-[35%] flex flex-col pr-8">
              <h2 className="text-[18px] font-[600] mb-4 text-white">
                Newsletter
              </h2>

              <p className="text-[13px] text-[#C9C9C9]">
                Nhận thông tin khuyến mãi & xu hướng nội thất mới nhất
              </p>

              <form className="mt-5">
                <input
                  type="text"
                  className="w-full h-[45px] bg-[#1E1E22] text-white border border-white/20 outline-none pl-4 rounded-sm mb-4"
                  placeholder="Email của bạn"
                />

                <Button className="!bg-white !text-[#2B2C31] !font-semibold hover:!bg-gray-200 w-full">
                  ĐĂNG KÝ
                </Button>

                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked
                      sx={{
                        color: "#C9C9C9",
                        "&.Mui-checked": { color: "#fff" },
                      }}
                    />
                  }
                  label={
                    <span className="text-[#C9C9C9] text-[13px]">
                      Tôi đồng ý với điều khoản
                    </span>
                  }
                />
              </form>
            </div>
          </div>
        </div>
      </footer>

      {/* ⭐ Bottom strip */}
      <div className="bottomStrip border-t border-white/10 py-3 bg-[#2B2C31]">
        <div className="container flex items-center justify-between text-[#C9C9C9]">
          {/* SOCIAL */}
          <ul className="flex items-center gap-3">
            {[FaFacebookF, RiYoutubeLine, FaPinterestP, FaInstagram].map(
              (Icon, i) => (
                <li key={i}>
                  <Link className="w-[35px] h-[35px] rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#2B2C31] transition-all">
                    <Icon className="text-[20px]" />
                  </Link>
                </li>
              )
            )}
          </ul>

          <p className="text-[12px]">2025 - Ecommerce Web</p>

          <div className="flex items-center gap-2 opacity-75">
            <img src="/carte_bleue.png" alt="" />
            <img src="/master_card.png" alt="" />
            <img src="/paypal.png" alt="" />
            <img src="/visa.png" alt="" />
            <img src="/american_express.png" alt="" />
          </div>
        </div>
      </div>

      {/* Cart Panel */}
      <Drawer
        open={context.openCartPanel}
        onClose={() => context.toggleCartPanel(false)}
        anchor={"right"}
      >
        <div className="flex items-center justify-between py-3 px-4 border-b border-white/10 bg-[#2B2C31] text-white">
          <h4>Shopping Cart (1)</h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={() => context.toggleCartPanel(false)}
          />
        </div>

        <CartPanel />
      </Drawer>
    </>
  );
};

export default Footer;
