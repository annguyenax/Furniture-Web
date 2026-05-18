import React, { useEffect } from "react";
import HomeSlider from "../../../../components/customer/Components/HomeSlider";
import HomeCatSlider from "../../../../components/customer/Components/HomeCatSlider";
import { FaShippingFast } from "react-icons/fa";
import AdsbannerSliderV2 from "../../../../components/customer/Components/AdsBannerSliderV2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../../../../redux/adminSlice";
import { fetchAllProducts } from "../../../../redux/productSilce";
import ProductItem from "../../../../components/customer/Components/ProductItem";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import HomeBannerV2 from "../../../../components/customer/Components/HomeSliderV2";
import BannerBoxV2 from "../../../../components/customer/Components/bannerBoxV2";

const FURNITURE_TABS = [
  "Tất cả",
  "Sofa & Armchair",
  "Bàn",
  "Ghế",
  "Giường ngủ",
  "Tủ & kệ",
  "Bếp",
  "Đèn trang trí",
  "Hàng trang trí",
  "Ngoại thất",
];

// Gắn nhãn danh mục nội thất cho từng product dựa vào dữ liệu hiện có
const normalizeCategory = (p) => {
  const src = [
    p?.category,
    p?.collection,
    ...(Array.isArray(p?.tags) ? p.tags : []),
    p?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const hasAny = (arr) => arr.some((k) => src.includes(k));

  if (hasAny(["sofa", "armchair"])) return "Sofa & Armchair";
  if (hasAny(["bàn ăn", "bàn trà", "bàn góc", "console", "bàn"])) return "Bàn";
  if (hasAny(["ghế ăn", "ghế bar", "đôn", "thư giãn", "ghế"])) return "Ghế";
  if (hasAny(["giường", "táp", "đầu giường", "nệm", "phòng ngủ"]))
    return "Giường ngủ";
  if (
    hasAny(["tủ áo", "tủ", "kệ", "kệ sách", "tủ treo", "âm tường", "trưng bày"])
  )
    return "Tủ & kệ";
  if (hasAny(["bếp", "dụng cụ bếp", "thiết bị bếp"])) return "Bếp";
  if (hasAny(["đèn bàn", "đèn sàn", "đèn thả", "đèn"])) return "Đèn trang trí";
  if (
    hasAny([
      "tranh",
      "gương",
      "bình",
      "lọ",
      "thảm",
      "tượng",
      "khung hình",
      "cây",
      "hoa",
      "gối",
      "nến",
    ])
  )
    return "Hàng trang trí";
  if (hasAny(["ngoài trời", "outdoor"])) return "Ngoại thất";

  return "Tất cả";
};

const Home = () => {
  const dispatch = useDispatch();

  // Redux state
  const { products = [] } = useSelector((state) => state.products);
  const userId = useSelector((state) => state.auth.user?.user_id);

  // Tải dữ liệu
  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchAllProducts());
  }, [dispatch, products?.length]);
  useEffect(() => {
    if (userId) dispatch(fetchUserById(userId));
  }, [dispatch, userId]);

  // Tabs + lọc
  const [value, setValue] = React.useState(0);
  const selectedTab = FURNITURE_TABS[value];

  const activeProducts = Array.isArray(products)
    ? products.filter((p) => p?.status === "active")
    : [];

  const furnitureProducts = activeProducts.map((p) => ({
    ...p,
    __cat: normalizeCategory(p),
  }));

  const visibleProducts =
    selectedTab === "Tất cả"
      ? furnitureProducts
      : furnitureProducts.filter((p) => p.__cat === selectedTab);

  // Phân trang
  const productsPerPage = 24;
  const [currentPage, setCurrentPage] = React.useState(1);
  useEffect(() => setCurrentPage(1), [selectedTab]);

  const totalPages = Math.ceil(visibleProducts.length / productsPerPage) || 1;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = visibleProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (n) => {
    if (n >= 1 && n <= totalPages) setCurrentPage(n);
  };

  return (
    <>
      <HomeSlider />

      {/* Banner lớn + 2 box nhỏ */}
      <section className="py-4 sm:py-6">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            <div className="part1 w-full md:w-[70%]">
              <HomeBannerV2 />
            </div>
            <div className="part2 w-full md:w-[30%] flex flex-row md:flex-col items-center gap-4 md:gap-5 justify-between">
              <div className="w-1/2 md:w-full">
                <BannerBoxV2
                  info="left"
                  image="https://nhaxinh.com/wp-content/uploads/2021/10/ban-lam-viec-biblio-1000x666-1-600x400.jpg"
                  title="Bàn làm việc Biblio"
                  price="$199.00"
                />
              </div>
              <div className="w-1/2 md:w-full">
                <BannerBoxV2
                  info="right"
                  image="https://nhaxinh.com/wp-content/uploads/2021/10/Rectangle.jpeg"
                  title="Ghế bar Monaco"
                  price="$129.00"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dãy icon danh mục */}
      {/* <HomeCatSlider /> */}

      {/* Tabs danh mục nội thất */}
      <section className="py-4 sm:py-5 pt-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            <div className="w-full lg:w-auto">
              <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold">
                Bộ sưu tập nội thất nổi bật
              </h2>
              <p className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-600">
                Lựa chọn phù hợp cho mọi phong cách sống
              </p>
            </div>

            <div className="w-full lg:flex-1 overflow-x-auto max-w-full">
              <Tabs
                value={value}
                onChange={(_, nv) => setValue(nv)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="tabs-noi-that"
                sx={{
                  minHeight: "42px",
                  "& .MuiTab-root": {
                    fontSize: { xs: "13px", sm: "14px" },
                    minHeight: "42px",
                    textTransform: "none",
                    fontWeight: 600,
                  },
                  "& .MuiTabs-indicator": { backgroundColor: "#b45309" }, // amber-700
                  "& .Mui-selected": { color: "#b45309 !important" },
                }}
              >
                {FURNITURE_TABS.map((label) => (
                  <Tab key={label} label={label} />
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* Promo + slider quảng cáo */}
      {/* <section className="py-4 sm:py-5 pt-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="freeShipping w-full py-3 sm:py-4 px-3 sm:px-4 border-2 border-amber-700 flex flex-col sm:flex-row items-center gap-3 sm:gap-0 sm:justify-between rounded-md mb-2">
            <div className="col1 flex items-center gap-2 sm:gap-4">
              <FaShippingFast className="text-[30px] sm:text-[40px] font-[600] flex-shrink-0" />
              <span className="text-[16px] sm:text-[20px] font-[700] uppercase">
                Freeship đơn từ 200$
              </span>
            </div>
            <div className="col2 text-center sm:text-left">
              <p className="text-[13px] sm:text-[15px] mb-0 font-[500]">
                Miễn phí giao hàng cho đơn đầu tiên và đơn trên $200
              </p>
            </div>
          </div>

          {/* <div className="mt-4 sm:mt-6">
            <AdsbannerSliderV2 items={4} />
          </div> */}
      {/* </div>
      </section> */}

      {/* Lưới sản phẩm */}
      <section className="py-4 sm:py-5 pt-0">
        <div className="container px-4 sm:px-6">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-[600] mb-4">
            {selectedTab === "Tất cả" ? "Sản phẩm nội thất" : selectedTab}
          </h2>

          {visibleProducts.length === 0 ? (
            <p className="text-gray-500">
              Chưa có sản phẩm phù hợp danh mục này.
            </p>
          ) : (
            <div className="product-list grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
              {currentProducts.map((product) => (
                <ProductItem
                  key={product.id || product._id}
                  product={product}
                />
              ))}
            </div>
          )}

          {/* Phân trang */}
          <div className="flex justify-center mt-8 gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-40"
            >
              <FaArrowLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-9 h-9 flex items-center justify-center rounded-full border ${
                  currentPage === i + 1
                    ? "bg-amber-600 text-white font-bold border-amber-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center border rounded-full text-gray-600 hover:bg-gray-200 disabled:opacity-40"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
