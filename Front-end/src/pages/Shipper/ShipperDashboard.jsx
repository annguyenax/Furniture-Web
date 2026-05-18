import React, { useState, useEffect, useMemo } from "react";
import ShipperStatsCards from "../../components/shipper/ShipperStatsCards";
import OrdersTable from "../../components/shipper/OrdersTable";
import { FaSearch } from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";

/* ======================
   HELPERS
====================== */

const isTodayVN = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date().toLocaleDateString("vi-VN");
  const date = new Date(dateStr).toLocaleDateString("vi-VN");
  return today === date;
};

const formatCurrency = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v || 0);

const transformOrder = (order) => {
  const user = order.Order?.User || {};
  const address = order.Order?.shipping_address;

  return {
    id: String(order.sub_order_id),
    customerName:
      user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : "Không xác định",
    customerPhone: user.phone || "",
    customerEmail: user.email || "",
    customerAvatar: user.profile_picture || null,
    address: address
      ? [address.address_line, address.city, address.province]
          .filter(Boolean)
          .join(", ")
      : "Không xác định",
    createdAt: order.created_at,
    deliveredAt: order.shipment?.actual_delivery_date,
    time: order.created_at
      ? new Date(order.created_at).toLocaleString("vi-VN")
      : "Không xác định",
    deliveredTime:
      order.status === "delivered" && order.shipment?.actual_delivery_date
        ? new Date(order.shipment.actual_delivery_date).toLocaleString("vi-VN")
        : null,
    total: formatCurrency(order.total_price),
    shippingFee: Number(order.shipping_fee || 0),
    rawStatus: order.status,
    statusLabel:
      order.status === "processing"
        ? "Đang xử lý"
        : order.status === "shipped"
        ? "Đang giao hàng"
        : order.status === "delivered"
        ? "Đã hoàn thành"
        : order.status === "cancelled"
        ? "Đã hủy"
        : "Không xác định",
    status: order.status === "processing"
      ? "Đang xử lý"
      : order.status === "shipped"
      ? "Đang giao hàng"
      : order.status === "delivered"
      ? "Đã hoàn thành"
      : order.status === "cancelled"
      ? "Đã hủy"
      : "Không xác định",
    sub_order_id: order.sub_order_id,
    shipment: order.shipment,
  };
};

const fetchAndTransformOrders = async () => {
  const res = await axiosClient.get("/shippers/sub_orders");
  const rawOrders = res.data?.data || [];
  return rawOrders.map(transformOrder);
};

/* ======================
   COMPONENT
====================== */

const ShipperDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  /* ======================
     FETCH DATA
  ====================== */

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axiosClient.get("/shippers/sub_orders");
        
        if (!mounted) return;

        const transformed = await fetchAndTransformOrders();
        setOrders(transformed);
      } catch (err) {
        if (mounted) {
          console.error("Error fetching dashboard data:", err);
          toast.error(
            err.response?.data?.message || "Không thể tải dữ liệu dashboard"
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  /* ======================
     STATS (MEMO)
  ====================== */

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) =>
      isTodayVN(o.createdAt)
    ).length;

    const completedOrders = orders.filter(
      (o) => o.rawStatus === "delivered"
    ).length;

    const pendingOrders = orders.filter((o) =>
      ["processing", "shipped"].includes(o.rawStatus)
    ).length;

    const todayRevenue = orders
      .filter(
        (o) => o.rawStatus === "delivered" && isTodayVN(o.deliveredAt)
      )
      .reduce((sum, o) => sum + o.shippingFee, 0);

    return {
      todayOrders,
      completedOrders,
      pendingOrders,
      todayRevenue: formatCurrency(todayRevenue),
    };
  }, [orders]);

  /* ======================
     SEARCH
  ====================== */

  const filteredOrders = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }, [orders, searchTerm]);

  /* ======================
     ACTIONS
  ====================== */

  const handleAcceptOrder = async (id) => {
    try {
      const response = await axiosClient.post(`/shippers/sub_orders/${id}/accept`);
      
      if (response.data?.success) {
        toast.success("Nhận đơn hàng thành công");
        // Refresh data instead of reloading page
        const transformed = await fetchAndTransformOrders();
        setOrders(transformed);
      } else {
        toast.error(response.data?.message || "Không thể nhận đơn");
      }
    } catch (err) {
      console.error("Error accepting order:", err);
      toast.error(
        err.response?.data?.message || "Không thể nhận đơn"
      );
    }
  };

  const handleCompleteOrder = async (id) => {
    try {
      const response = await axiosClient.post(`/shippers/sub_orders/${id}/complete`);
      
      if (response.data?.success) {
        toast.success("Hoàn thành đơn hàng");
        // Refresh data instead of reloading page
        const transformed = await fetchAndTransformOrders();
        setOrders(transformed);
      } else {
        toast.error(response.data?.message || "Không thể hoàn thành đơn");
      }
    } catch (err) {
      console.error("Error completing order:", err);
      toast.error(
        err.response?.data?.message || "Không thể hoàn thành đơn"
      );
    }
  };

  /* ======================
     RENDER
  ====================== */

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col p-4 md:p-6 space-y-6">
        {/* Stats Section */}
        <div className="w-full">
          <ShipperStatsCards stats={stats} />
        </div>

        {/* Recent Orders Section */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Đơn hàng gần đây
              </h2>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Tìm theo mã / tên / SĐT"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  onOrderUpdate={async () => {
                    try {
                      const transformed = await fetchAndTransformOrders();
                      setOrders(transformed);
                    } catch (err) {
                      console.error("Error refreshing orders:", err);
                      toast.error("Không thể làm mới dữ liệu");
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperDashboard;
