import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import moment from "moment";
import { toast } from "react-toastify";
import "moment/locale/vi";

moment.locale("vi");

/* =======================
   CONSTANTS
======================= */

const STATUS_TEXT = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipped: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  in_transit: "Đang vận chuyển",
};

const STATUS_COLOR = {
  pending: "#faad14",
  processing: "#1890ff",
  shipped: "#1890ff",
  in_transit: "#1890ff",
  delivered: "#52c41a",
  cancelled: "#f5222d",
};

/* =======================
   HELPERS
======================= */

const safeDate = (d) =>
  d ? moment(d).format("DD/MM/YYYY HH:mm") : "Không xác định";

const safeCurrency = (value) => {
  const num = Number(value || 0);
  if (isNaN(num)) return "0 ₫";
  return num.toLocaleString("vi-VN") + "đ";
};

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

/* =======================
   COMPONENT
======================= */

const ShipperOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [processing, setProcessing] = useState(false);

  /* ===== Fetch order ===== */
  useEffect(() => {
    // Validate orderId format
    if (!orderId || !/^\d+$/.test(orderId)) {
      toast.error("Mã đơn hàng không hợp lệ");
      navigate(-1);
      return;
    }

    const controller = new AbortController();

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          `/shippers/sub_orders/${orderId}`,
          { signal: controller.signal }
        );

        if (!res.data?.success) {
          throw new Error("NOT_FOUND");
        }

        // Validate response structure
        if (!res.data.data) {
          throw new Error("INVALID_DATA");
        }

        setOrder(res.data.data);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;

        if (err.response?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn");
          navigate("/login");
        } else if (err.response?.status === 404) {
          toast.error("Không tìm thấy đơn hàng");
          navigate(-1);
        } else {
          toast.error(
            err.response?.data?.message || "Không thể tải chi tiết đơn hàng"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    return () => controller.abort();
  }, [orderId, navigate]);

  /* ===== Derived data ===== */
  const items = useMemo(() => order?.orderItems || [], [order]);

  const totalItemsValue = useMemo(() => {
    return items.reduce((sum, i) => {
      const price = Number(i.price || 0);
      const quantity = Number(i.quantity || 0);
      return sum + price * quantity;
    }, 0);
  }, [items]);

  const calcItemTotal = (item) => {
    const itemPrice = Number(item.price || 0);
    const itemQuantity = Number(item.quantity || 0);
    const itemTotal = itemPrice * itemQuantity;
    const shippingFee = Number(order?.shipping_fee || 0);

    if (!totalItemsValue || !shippingFee || totalItemsValue === 0) {
      return itemTotal;
    }

    return itemTotal + (shippingFee * itemTotal) / totalItemsValue;
  };

  // Get final status - prioritize shipment status
  const finalStatus = useMemo(() => {
    if (!order) return null;
    
    // If order is cancelled, return cancelled
    if (order.status === "cancelled" || order.Order?.status === "cancelled") {
      return "cancelled";
    }
    
    // Prioritize shipment status if available
    if (order.shipment?.status) {
      return order.shipment.status;
    }
    
    return order.status;
  }, [order]);

  /* ===== Actions ===== */
  const confirmAction = async (msg, fn) => {
    if (!window.confirm(msg)) return;

    try {
      setProcessing(true);
      const res = await fn();
      
      if (res?.data?.success) {
        toast.success("Thao tác thành công");
        // Refresh order data
        const refreshRes = await axiosClient.get(
          `/shippers/sub_orders/${orderId}`
        );
        if (refreshRes.data?.success) {
          setOrder(refreshRes.data.data);
        }
      } else {
        throw new Error(res?.data?.message || "Thao tác thất bại");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Thao tác thất bại";
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const acceptOrder = () =>
    confirmAction("Bạn có chắc muốn nhận đơn này?", () =>
      axiosClient.post(`/shippers/sub_orders/${orderId}/accept`)
    );

  const completeOrder = () =>
    confirmAction("Xác nhận đã giao hàng?", () =>
      axiosClient.post(`/shippers/sub_orders/${orderId}/complete`)
    );

  /* =======================
     RENDER
  ======================= */

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p style={{ marginTop: 16 }}>Đang tải...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => navigate(-1)}>← Quay lại</button>
        <div style={{ marginTop: 24, padding: 20, textAlign: "center" }}>
          <p>Không tìm thấy thông tin đơn hàng</p>
        </div>
      </div>
    );
  }

  const user = order.Order?.User || {};
  const address = order.Order?.shipping_address || {};

  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 16,
          padding: "8px 16px",
          border: "1px solid #d9d9d9",
          borderRadius: 4,
          background: "#fff",
          cursor: "pointer",
        }}
      >
        ← Quay lại
      </button>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Chi tiết đơn hàng #{order.sub_order_id}</h2>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", marginBottom: 10 }}>
            <div style={{ width: 150, fontWeight: "bold" }}>Trạng thái:</div>
            <div>
              <span
                style={{
                  background: STATUS_COLOR[finalStatus] || "#d9d9d9",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: 4,
                }}
              >
                {STATUS_TEXT[finalStatus] || finalStatus || "Không xác định"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", marginBottom: 10 }}>
            <div style={{ width: 150, fontWeight: "bold" }}>Ngày tạo:</div>
            <div>{safeDate(order.createdAt)}</div>
          </div>

          {order.shipment?.estimated_delivery_date && (
            <div style={{ display: "flex", marginBottom: 10 }}>
              <div style={{ width: 150, fontWeight: "bold" }}>
                Ngày giao dự kiến:
              </div>
              <div>{safeDate(order.shipment.estimated_delivery_date)}</div>
            </div>
          )}

          {order.shipment?.tracking_number && (
            <div style={{ display: "flex", marginBottom: 10 }}>
              <div style={{ width: 150, fontWeight: "bold" }}>Mã vận đơn:</div>
              <div>{order.shipment.tracking_number}</div>
            </div>
          )}
        </div>

        {/* Customer Info */}
        {(user.first_name || user.email || user.phone) && (
          <div style={{ marginBottom: 20, paddingTop: 20, borderTop: "1px solid #e8e8e8" }}>
            <h3 style={{ marginBottom: 12 }}>Thông tin người nhận</h3>
            {user.first_name && (
              <div style={{ display: "flex", marginBottom: 8 }}>
                <div style={{ width: 150, fontWeight: "bold" }}>Họ tên:</div>
                <div>
                  {user.first_name} {user.last_name || ""}
                </div>
              </div>
            )}
            {user.phone && (
              <div style={{ display: "flex", marginBottom: 8 }}>
                <div style={{ width: 150, fontWeight: "bold" }}>Số điện thoại:</div>
                <div>{user.phone}</div>
              </div>
            )}
            {user.email && (
              <div style={{ display: "flex", marginBottom: 8 }}>
                <div style={{ width: 150, fontWeight: "bold" }}>Email:</div>
                <div>{user.email}</div>
              </div>
            )}
            {address.address_line && (
              <div style={{ display: "flex", marginBottom: 8 }}>
                <div style={{ width: 150, fontWeight: "bold" }}>Địa chỉ:</div>
                <div>{formatAddress(address)}</div>
              </div>
            )}
          </div>
        )}

        {/* Products */}
        <div style={{ marginBottom: 20, paddingTop: 20, borderTop: "1px solid #e8e8e8" }}>
          <h3 style={{ marginBottom: 12 }}>Sản phẩm</h3>
          {items.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                width="100%"
                style={{
                  borderCollapse: "collapse",
                  border: "1px solid #d9d9d9",
                }}
              >
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    <th style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "left" }}>
                      Sản phẩm
                    </th>
                    <th style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "center" }}>
                      SL
                    </th>
                    <th style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "right" }}>
                      Giá
                    </th>
                    <th style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "right" }}>
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.order_item_id || idx}>
                      <td style={{ padding: 12, border: "1px solid #d9d9d9" }}>
                        <div>
                          <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                            {item.product?.product_name || "Không xác định"}
                          </div>
                          {item.productVariant && (
                            <div style={{ fontSize: "0.9em", color: "#666" }}>
                              {[
                                item.productVariant.color && `Màu: ${item.productVariant.color}`,
                                item.productVariant.size && `Size: ${item.productVariant.size}`,
                                item.productVariant.material && `Chất liệu: ${item.productVariant.material}`,
                              ]
                                .filter(Boolean)
                                .join(" | ")}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "center" }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "right" }}>
                        {safeCurrency(item.price)}
                      </td>
                      <td style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "right" }}>
                        {safeCurrency(calcItemTotal(item))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: "#fafafa", fontWeight: "bold" }}>
                    <td colSpan={3} style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "right" }}>
                      Tổng cộng:
                    </td>
                    <td style={{ padding: 12, border: "1px solid #d9d9d9", textAlign: "right" }}>
                      {safeCurrency(
                        totalItemsValue + Number(order.shipping_fee || 0)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p>Không có sản phẩm nào trong đơn hàng</p>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: 24, textAlign: "center", paddingTop: 20, borderTop: "1px solid #e8e8e8" }}>
          {finalStatus === "processing" && (
            <button
              disabled={processing}
              onClick={acceptOrder}
              style={{
                padding: "10px 24px",
                border: "none",
                borderRadius: 4,
                background: processing ? "#ccc" : "#1890ff",
                color: "#fff",
                cursor: processing ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {processing ? "Đang xử lý..." : "Nhận đơn"}
            </button>
          )}

          {finalStatus === "shipped" && (
            <button
              disabled={processing}
              onClick={completeOrder}
              style={{
                padding: "10px 24px",
                border: "none",
                borderRadius: 4,
                background: processing ? "#ccc" : "#52c41a",
                color: "#fff",
                cursor: processing ? "not-allowed" : "pointer",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {processing ? "Đang xử lý..." : "Hoàn thành"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderDetail;
