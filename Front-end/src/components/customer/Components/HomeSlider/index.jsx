import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
const HomeSlider = () => {
  return (
    <div className="homeSlider py-3 sm:py-4">
      <div className="container px-4 sm:px-6 overflow-hidden">
        <Swiper
          spaceBetween={10}
          navigation={true}
          loop={true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="sliderHome"
        >
          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://theme.hstatic.net/200000065946/1001264503/14/slideshow_3.jpg?v=1322"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://theme.hstatic.net/200000065946/1001264503/14/slideshow_4.jpg?v=1322"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[10px] sm:rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://theme.hstatic.net/200000065946/1001264503/14/slideshow_1_master.jpg?v=1322"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://theme.hstatic.net/200000065946/1001264503/14/background_banner_2.jpg?v=1322"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://theme.hstatic.net/200000065946/1001264503/14/background_banner_3.jpg?v=1322"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="item rounded-[20px] overflow-hidden h-[180px] sm:h-[260px] md:h-[400px]">
              <img
                src="https://file.hoaphat.com.vn/hoaphat-com-vn/2024/08/slide-pc.jpg.webp"
                alt="Banner slide"
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
