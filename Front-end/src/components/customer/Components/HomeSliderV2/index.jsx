import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper/modules';
import Button from '@mui/material/Button';


const HomeBannerV2 = () => {
    return (
        <Swiper
            loop={true}
            spaceBetween={30}
            effect={'fade'}
            navigation={true}
            pagination={{
                clickable: true,
            }}
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false
            }}
            className="homeSliderV2"
        >
            <SwiperSlide>
                <div className='item relative w-full h-[260px] sm:h-[320px] lg:h-[450px] rounded-md overflow-hidden'>
                    <img src="https://nhaxinh.com/wp-content/uploads/2025/09/sofa-home-pages.jpg" className="w-full h-full object-cover" />
                    <div className='info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex items-center
                     flex-col justify-center transition-all duration-700  mt-[-50px]'>
                        <h4 className='text-[18px] font-[500] text-left w-full mb-3 relative -right-[100%] opacity-0'>
                            Big Saving Days Sale
                        </h4>
                        <h2 className='text-[35px] font-[700] w-full relative -right-[100%] opacity-0'>
                            Sofa Taura 2 Chỗ 2m (Vải Army Eponji)

                        </h2>
                        <h3 className='flex items-center gap-3 text-[18px] font-[500] text-left w-full mt-3 mb-3 relative -right-[100%] opacity-0'>
                            Starting At Only
                            <span className='text-red-500 text-[30px] font-[700]'>
                                $59.00</span>
                        </h3>
                        <div className='w-full relative -right-[100%] opacity-0 btn_'>
                            <Button className='btn-org'>SHOP NOW</Button>
                        </div>
                    </div>
                </div>
            </SwiperSlide>

            <SwiperSlide>
                <div className='item relative w-full h-[260px] sm:h-[320px] lg:h-[450px] rounded-md overflow-hidden'>
                    <img src="https://nhaxinh.com/wp-content/uploads/2025/09/Ban-an.jpg" className="w-full h-full object-cover " />
                    <div className='info absolute top-0 -right-[100%] opacity-0 w-[50%] h-[100%] z-50 p-8 flex items-center
                     flex-col justify-center transition-all duration-700  mt-[-50px]'>
                        <h4 className='text-[18px] font-[500] text-left w-full mb-3 relative -right-[100%] opacity-0'>
                            Big Saving Days Sale
                        </h4>
                        <h2 className='text-[35px] font-[700] w-full relative -right-[100%] opacity-0'>
                            Bàn ăn Taura 8 chỗ E0202 Eponji 2m

                        </h2>
                        <h3 className='flex items-center gap-3 text-[18px] font-[500] text-left w-full mt-3 mb-3 relative -right-[100%] opacity-0'>
                            Starting At Only
                            <span className='text-red-500 text-[30px] font-[700]'>
                                $59.00</span>
                        </h3>
                        <div className='w-full relative -right-[100%] opacity-0 btn_'>
                            <Button className='btn-org'>SHOP NOW</Button>
                        </div>
                    </div>
                </div>
            </SwiperSlide>

        </Swiper>
    )
}

export default HomeBannerV2
