import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const CATS = [
  {
    key: "sofa",
    label: "Sofa",
    to: "/collections/sofa",
    img: "https://cdn-icons-png.flaticon.com/512/628/628283.png",
  },
  {
    key: "chair",
    label: "Chairs",
    to: "/collections/chair",
    img: "https://cdn-icons-png.flaticon.com/512/628/628299.png",
  },
  {
    key: "table",
    label: "Tables",
    to: "/collections/table",
    img: "https://cdn-icons-png.flaticon.com/512/628/628292.png",
  },
  {
    key: "storage",
    label: "Storage",
    to: "/collections/storage",
    img: "https://cdn-icons-png.flaticon.com/512/628/628296.png",
  },
  {
    key: "lighting",
    label: "Lighting",
    to: "/collections/lighting",
    img: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
  },
  {
    key: "decor",
    label: "Home Decor",
    to: "/collections/decor",
    img: "https://cdn-icons-png.flaticon.com/512/628/628285.png",
  },
  {
    key: "bedroom",
    label: "Bedroom",
    to: "/collections/bedroom",
    img: "https://cdn-icons-png.flaticon.com/512/628/628295.png",
  },
  {
    key: "outdoor",
    label: "Outdoor",
    to: "/collections/outdoor",
    img: "https://cdn-icons-png.flaticon.com/512/628/628290.png",
  },
];

const HomeCatSlider = () => {
  return (
    <div className="homeCatSlider pt-3 sm:pt-4 py-1">
      <div className="container px-4 sm:px-6 overflow-hidden">
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          navigation
          modules={[Navigation]}
          className="mySwiper"
          breakpoints={{
            480: { slidesPerView: 4, spaceBetween: 10 },
            640: { slidesPerView: 5, spaceBetween: 10 },
            768: { slidesPerView: 6, spaceBetween: 10 },
            1024: { slidesPerView: 7, spaceBetween: 10 },
            1280: { slidesPerView: 8, spaceBetween: 10 },
          }}
        >
          {CATS.map((c) => (
            <SwiperSlide key={c.key}>
              <Link to={c.to}>
                <div className="item py-3 sm:py-5 px-2 bg-white rounded-sm text-center flex items-center justify-center flex-col hover:shadow-sm transition">
                  <img
                    src={c.img}
                    alt={c.label}
                    className="w-[40px] sm:w-[60px] transition-all"
                    loading="lazy"
                  />
                  <h3 className="text-[13px] sm:text-[15px] font-[500] mt-2 sm:mt-3 truncate">
                    {c.label}
                  </h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
