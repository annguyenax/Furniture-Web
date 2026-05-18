import React, { useState, useEffect, useMemo, useCallback } from "react";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

/* =======================
   CONSTANTS
======================= */

const STATUS_MAP = {
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const MAX_SEARCH_LENGTH = 50;

// Chỉ log errors trong development
const safeLogError = (message, error) => {
  if (import.meta.env.DEV) {
    console.error(message, error);
  }
};

/* =======================
   HELPERS
======================= */

const formatAddress = (addr) => {
  if (!addr || typeof addr !== "object") return "Không xác định";
  
  return [
    addr.address_line,
    addr.city,
    addr.province,
    addr.postal_code,
  ]
    .filter(Boolean)
    .join(", ");
};

const safeCurrency = (value) => {
  const num = Number(value || 0);
  if (isNaN(num)) return "0 ₫";
  
  return num.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const safeDate = (date) => {
  if (!date) return "Không xác định";
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "Không xác định";
    return dateObj.toLocaleString("vi-VN");
  } catch {
    return "Không xác định";
  }
};

const validateOrderData = (order) => {
  if (!order || typeof order !== "object") return null;
  
  // Validate required fields
  if (!order.sub_order_id) return null;
  
  return order;
};

const transformOrder = (order = {}) => {
  const validatedOrder = validateOrderData(order);
  if (!validatedOrder) {
    safeLogError("Invalid order data:", order);
    return null;
  }

  const user = validatedOrder.Order?.User || {};
  const fullName =
    user.first_name && user.last_name
      ? `${String(user.first_name)} ${String(user.last_name)}`
      : "Không xác định";

  return {
    id: String(validatedOrder.sub_order_id || ""),
    customerName: fullName,
    customerPhone: user.phone ? String(user.phone) : "Không có SĐT",
    customerEmail: user.email ? String(user.email) : "",
    customerAvatar: user.profile_picture ? String(user.profile_picture) : null,
    address: formatAddress(validatedOrder.Order?.shipping_address),
    time: safeDate(validatedOrder.created_at),
    deliveredTime:
      validatedOrder.status === "delivered"
        ? safeDate(validatedOrder.shipment?.actual_delivery_date)
        : null,
    total: safeCurrency(validatedOrder.total_price),
    status: STATUS_MAP[validatedOrder.status] || "Không xác định",
    rawStatus: validatedOrder.status,
    sub_order_id: validatedOrder.sub_order_id,
    shipment: validatedOrder.shipment || null,
  };
};

/* =======================
   COMPONENT
======================= */

const ShipperOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = React.useCallback(async (signal = null) => {
    try {
      setIsLoading(true);

      const config = signal ? { signal } : {};
      const res = await axiosClient.get("/shippers/sub_orders", config);

      if (!res.data || !Array.isArray(res.data?.data)) {
        throw new Error("INVALID_RESPONSE");
      }

      const transformedOrders = res.data.data
        .map(transformOrder)
        .filter(Boolean); // Remove null values from invalid orders

      setOrders(transformedOrders);
    } catch (err) {
      if (err.name === "AbortError" || err.name === "CanceledError") {
        return; // Request was cancelled, ignore
      }

      safeLogError("Error fetching orders:", err);

      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchOrders(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchOrders]);

  /* ===== Sanitized search ===== */
  const sanitizedSearch = useMemo(
    () => searchTerm.slice(0, MAX_SEARCH_LENGTH).toLowerCase().trim(),
    [searchTerm]
  );

  const filteredOrders = useMemo(() => {
    if (!sanitizedSearch) return orders;

    return orders.filter((o) =>
      o.id.toLowerCase().includes(sanitizedSearch)
    );
  }, [orders, sanitizedSearch]);

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6 space-y-6">
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Danh sách đơn hàng
              </h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  maxLength={MAX_SEARCH_LENGTH}
                  placeholder="Tìm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <OrdersTable
                  orders={filteredOrders}
                  onOrderUpdate={fetchOrders}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrders;
