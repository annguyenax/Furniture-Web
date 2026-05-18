import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const ProductItem = ({ product }) => {
  const variants = Array.isArray(product?.variants) ? product.variants : [];

  const cover =
    variants.find((v) => v?.image_url)?.image_url ||
    product?.image_url ||
    "https://placehold.co/600x600?text=Furniture";

  const variantPrices = variants
    .map((v) => Number(v?.price) || 0)
    .filter((n) => n > 0);

  const basePrice = variantPrices.length ? Math.min(...variantPrices) : 0;
  const discount = Number(product?.discount) || 0;
  const finalPrice = basePrice ? basePrice * (1 - discount / 100) : 0;

  const fVND = (n) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number.isFinite(n) ? n : 0);

  const formatSold = (n = 0) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : n);

  const averageRating = Number(product?.average_rating) || 0;
  const renderRatingStars = (rating) =>
    Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} className="text-amber-400 text-xs" />
      ) : (
        <FaRegStar key={i} className="text-amber-400 text-xs" />
      )
    );

  const firstVariant = variants[0] || {};
  const chipColor = firstVariant?.color;
  const chipMaterial = firstVariant?.material;

  return (
    <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      {/* Badge giảm giá */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount.toFixed(0)}%
          </span>
        </div>
      )}

      {/* Ảnh */}
      <div className="relative overflow-hidden aspect-square">
        <Link to={`/product/${product.product_id}`}>
          <img
            src={cover}
            className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            alt={product?.product_name}
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/600x600?text=Furniture")
            }
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </Link>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Tên sản phẩm */}
        <h3 className="font-medium text-gray-800 text-[15px] mb-2 line-clamp-2 h-[40px] group-hover:text-amber-700 transition-colors">
          <Link to={`/product/${product.product_id}`}>
            {product?.product_name}
          </Link>
        </h3>

        {/* Chips biến thể */}
        <div className="flex flex-wrap gap-2 mb-3 h-[48px] content-start">
          {chipColor && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 h-fit">
              Màu: {chipColor}
            </span>
          )}
          {chipMaterial && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 h-fit">
              Chất liệu: {chipMaterial}
            </span>
          )}
        </div>

        {/* Giá */}
        <div className="flex items-baseline gap-2 mb-3 h-[36px]">
          {finalPrice > 0 ? (
            <>
              <span className="text-lg font-bold text-amber-700">
                {fVND(finalPrice)}
              </span>
              {discount > 0 && basePrice > 0 && (
                <span className="text-gray-400 line-through text-xs">
                  {fVND(basePrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm font-medium text-amber-700">
              Xem chi tiết
            </span>
          )}
        </div>

        {/* Rating + sold */}
        <div className="flex items-center justify-between h-[30px]">
          <div className="flex text-amber-400 text-xs">
            {renderRatingStars(averageRating)}
          </div>
          <div className="bg-gray-100 rounded-full px-2 py-1">
            <span className="text-xs text-gray-600 font-medium">
              {formatSold(product?.sold || 0)} đã bán
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
