// src/components/customer/Components/SearchPage/SearchPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../../../../redux/productSilce";
import { fetchAllCategories } from "../../../../redux/categorySlice";
import FilterSection from "./FilterSection";
import ProductListing from "../../../../pages/Customer/Pages/ProductListing";

const SearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { searchResults, loading, error } = useSelector((s) => s.products);
  const { categories } = useSelector((s) => s.categories);

  useEffect(() => {
    if (!categories || categories.length === 0) dispatch(fetchAllCategories());
  }, [categories, dispatch]);

  const getSearchParams = () => {
    const params = new URLSearchParams(location.search);

    // ĐỌC snake_case để đồng bộ với backend
    const rawId = params.get("category_id") || params.get("categoryId") || "";
    const categoryIdArr = rawId ? rawId.split(",") : [];

    return {
      keyword: params.get("q") || "",
      categoryId: categoryIdArr,                   // array string id
      categorySlug: params.get("category") ? params.get("category").split(",") : [],

      // === quan trọng: đọc snake_case ===
      minPrice: params.get("min_price") !== null && params.get("min_price") !== ""
        ? Number(params.get("min_price"))
        : undefined,
      maxPrice: params.get("max_price") !== null && params.get("max_price") !== ""
        ? Number(params.get("max_price"))
        : undefined,
      minRating: params.get("min_rating") ? Number(params.get("min_rating")) : 0,
      sort: params.get("sort") || "",
    };
  };

  // migrate URL cũ (camelCase) -> snake_case
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let changed = false;

    if (params.has("minPrice")) {
      params.set("min_price", params.get("minPrice")); params.delete("minPrice"); changed = true;
    }
    if (params.has("maxPrice")) {
      params.set("max_price", params.get("maxPrice")); params.delete("maxPrice"); changed = true;
    }
    if (params.has("minRating")) {
      params.set("min_rating", params.get("minRating")); params.delete("minRating"); changed = true;
    }
    if (params.has("categoryId") && !params.has("category_id")) {
      params.set("category_id", params.get("categoryId")); params.delete("categoryId"); changed = true;
    }

    if (changed) navigate(`/search?${params.toString()}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const {
      keyword, categoryId, categorySlug, minPrice, maxPrice, minRating, sort,
    } = getSearchParams();

    // map slug -> id nếu cần
    let effectiveCategoryIds = [...(categoryId || [])];
    if (categorySlug?.length && categories?.length) {
      const mapIds = categorySlug
        .map((s) => categories.find((c) => c.slug === s)?.category_id)
        .filter(Boolean)
        .map(String);
      if (effectiveCategoryIds.length === 0 && mapIds.length) {
        effectiveCategoryIds = mapIds;
      }
    }

    // chống min > max
    if (
      typeof minPrice === "number" &&
      typeof maxPrice === "number" &&
      !isNaN(minPrice) &&
      !isNaN(maxPrice) &&
      minPrice > maxPrice
    ) {
      dispatch({
        type: "products/searchProducts/rejected",
        payload: "Giá tối thiểu không thể lớn hơn giá tối đa",
      });
      return;
    }

    // gọi API (redux thunk của bạn build URL)
    const payload = { keyword, categoryId: effectiveCategoryIds, minPrice, maxPrice, minRating, sort };
    const timer = setTimeout(() => dispatch(searchProducts(payload)), 200);
    return () => clearTimeout(timer);
  }, [location.search, categories, dispatch]);

  // Giữ nguyên handleFilter của bạn (map camel -> snake khi ghi URL)
  const handleFilter = (newParams) => {
    const params = new URLSearchParams(location.search);

    const keyMap = { keyword: "q", minPrice: "min_price", maxPrice: "max_price", minRating: "min_rating", sort: "sort" };
    Object.entries(newParams).forEach(([key, value]) => {
      if (key === "categoryId") return;
      const paramKey = keyMap[key] || key;
      if (Array.isArray(value)) value.length ? params.set(paramKey, value.join(",")) : params.delete(paramKey);
      else if (value || value === 0) params.set(paramKey, String(value));
      else params.delete(paramKey);
    });

    if (newParams.categoryId !== undefined) {
      const ids = newParams.categoryId;
      if (Array.isArray(ids) && ids.length) params.set("category_id", ids.join(","));
      else if (typeof ids === "string" && ids) params.set("category_id", ids);
      else params.delete("category_id");
      params.delete("category"); params.delete("categoryId");
    }

    navigate(`/search?${params.toString()}`);
  };

  const filters = getSearchParams();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/4">
          <FilterSection onFilter={handleFilter} filters={filters} />
        </aside>
        <main className="w-full md:w-3/4">
          {loading || error ? (
            <div className="bg-white p-6 rounded-lg min-h-[300px] flex items-center justify-center">
              {loading ? <span className="text-gray-500 text-lg">Đang tải...</span>
                : <span className="text-red-500 text-lg">{error}</span>}
            </div>
          ) : (
            <ProductListing products={searchResults} />
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
