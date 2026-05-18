import React from "react";
import "../bannerBoxV2/style.css";
import { Link } from "react-router-dom";

const BannerBoxV2 = (props) => {
  const { image, info, title, price } = props;

  return (
    <div className="bannerBoxV2 w-full overflow-hidden rounded-md group relative">
      <img
        src={image}
        className="w-full transition-all duration-150 group-hover:scale-105"
      />

      <div
        className={`
          info absolute p-5 top-0
          ${info === "left" ? "left-0" : "right-0"}
          w-[50%] h-[100%] z-50
          flex items-center justify-center flex-col gap-2
          ${info === "left" ? "" : "pl-12"}
        `}
      >
        <h2 className="text-[18px] font-[600]">
          {title || "Tiêu đề mặc định"}
        </h2>

        <span className="text-[25px] text-red-600 font-[600] w-full">
          {price || "$0.00"}
        </span>

        <div className="w-full">
          <Link to="/" className="text-[16px] font-[600] link">
            SHOP NOW
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BannerBoxV2;
