// FE/src/api/VendorAPI/revenueApi.js
import axiosClient from "../axiosClient";

const revenueApi = {
  // Lấy doanh thu tổng (nếu cần)
  getRevenue: () => {
    return axiosClient.get("/vendor/");
  },

  // Lấy doanh thu theo từng tháng cho năm truyền vào
  getMonthlyRevenue: (year) => {
    return axiosClient.get(`/vendor/revenue/${year}`);
  },
};

export default revenueApi;
