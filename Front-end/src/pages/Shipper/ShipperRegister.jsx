import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import ShipperLogo from "../../components/shipper/ShipperLogo";

/* =======================
   CONSTANTS
======================= */
const VEHICLE_TYPES = [
  { value: "bike", label: "Xe máy" },
  { value: "car", label: "Ô tô" },
  { value: "truck", label: "Xe tải" },
  { value: "van", label: "Xe tải nhỏ" },
];

const PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;
const RATE_LIMIT_MS = 5000; // 5 giây
const MAX_LICENSE_PLATE_LENGTH = 20;
const PHONE_LENGTH = 10;

/* =======================
   COMPONENT
======================= */
const ShipperRegister = () => {
  const navigate = useNavigate();
  const lastSubmitRef = useRef(0);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: "",
    license_plate: "",
    phone: "",
  });

  /* =======================
     AUTH CHECK
  ======================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Security: Kiểm tra đăng nhập bằng cách check token
        // Token được lưu trong localStorage (có thể migrate sang HttpOnly cookies)
        const token = getAuthToken();
        if (!token) {
          toast.warning("Vui lòng đăng nhập để đăng ký làm shipper");
          setIsAuthenticated(false);
          navigate("/login");
          return;
        }

        // Kiểm tra xem người dùng đã là shipper chưa
        const response = await axiosClient.get("/shippers/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          // Nếu đã là shipper (có thông tin shipper), chuyển hướng về trang landing
          toast.info("Bạn đã đăng ký làm shipper");
          navigate("/shipper");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        // Backend trả về 404 nếu không tìm thấy shipper record
        // Hoặc 403 nếu user chưa có role shipper (chưa đăng ký)
        // Cả 2 trường hợp đều cho phép đăng ký
        if (error.response && 
            (error.response.status === 404 || error.response.status === 403)) {
          setIsAuthenticated(true);
        } else {
          console.error("Error checking shipper status:", error);
          toast.error("Có lỗi xảy ra khi kiểm tra thông tin shipper");
          setIsAuthenticated(false);
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, [navigate]);

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    // XSS Protection: React tự động escape, nhưng vẫn cần validate
    // Giới hạn độ dài input để tránh DoS
    const maxLengths = {
      license_plate: MAX_LICENSE_PLATE_LENGTH,
      phone: PHONE_LENGTH,
      vehicle_type: 20, // Max length cho vehicle type
    };
    
    const maxLength = maxLengths[name];
    const sanitizedValue = maxLength && value.length > maxLength 
      ? value.slice(0, maxLength) 
      : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const sanitizeLicensePlate = (plate) => {
    // XSS & Injection Protection: Chỉ giữ chữ cái, số và dấu gạch ngang
    // Loại bỏ tất cả ký tự đặc biệt có thể gây hại
    return plate.replace(/[^A-Za-z0-9\-]/g, "");
  };
  
  const sanitizePhone = (phone) => {
    // Chỉ giữ số để tránh injection
    return phone.replace(/[^0-9]/g, "");
  };

  const validateForm = () => {
    if (!VEHICLE_TYPES.some((v) => v.value === formData.vehicle_type)) {
      return "Vui lòng chọn loại phương tiện";
    }
    
    const trimmedPlate = formData.license_plate.trim();
    if (!trimmedPlate) {
      return "Vui lòng nhập biển số xe";
    }
    if (trimmedPlate.length > MAX_LICENSE_PLATE_LENGTH) {
      return `Biển số xe không được quá ${MAX_LICENSE_PLATE_LENGTH} ký tự`;
    }
    
    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      return "Vui lòng nhập số điện thoại";
    }
    if (trimmedPhone.length !== PHONE_LENGTH) {
      return "Số điện thoại phải có 10 chữ số";
    }
    if (!PHONE_REGEX.test(trimmedPhone)) {
      return "Số điện thoại không hợp lệ (định dạng: 03/05/07/08/09xxxxxxxx)";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.warning("Vui lòng đăng nhập để đăng ký làm shipper");
      navigate("/login");
      return;
    }

    // Rate limiting frontend (5s)
    const now = Date.now();
    if (now - lastSubmitRef.current < RATE_LIMIT_MS) {
      toast.warning("Vui lòng chờ vài giây trước khi gửi lại");
      return;
    }
    lastSubmitRef.current = now;

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    // Sanitize và validate input trước khi gửi (XSS & Injection Protection)
    const sanitizedPlate = sanitizeLicensePlate(
      formData.license_plate.trim().toUpperCase()
    );
    const sanitizedPhone = sanitizePhone(formData.phone.trim());
    
    // Double-check validation sau khi sanitize
    if (!sanitizedPlate || sanitizedPlate.length === 0) {
      toast.error("Biển số xe không hợp lệ");
      return;
    }
    if (!sanitizedPhone || sanitizedPhone.length !== PHONE_LENGTH) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    const payload = {
      vehicle_type: formData.vehicle_type,
      license_plate: sanitizedPlate,
      phone: sanitizedPhone,
    };

    try {
      setLoading(true);
      
      // Security: Lấy token an toàn
      const token = getAuthToken();
      if (!token) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        navigate("/login");
        return;
      }
      
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Explicit content type
      };

      // CSRF Protection: Thêm CSRF token nếu backend hỗ trợ
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        headers["X-CSRF-Token"] = csrfToken;
      }

      const response = await axiosClient.post("/shippers/register", payload, {
        headers,
      });

      if (response.data.success) {
        toast.success(
          "Đăng ký shipper thành công. Vui lòng đợi admin xét duyệt."
        );
        navigate("/");
      } else {
        handleSafeError({ response });
      }
    } catch (error) {
      handleSafeError(error);
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     HELPERS
  ======================= */
  const getCsrfToken = () => {
    // CSRF Protection: Lấy CSRF token từ HttpOnly cookie
    // Backend nên set cookie này khi user login và verify trong middleware
    try {
      const cookies = document.cookie.split("; ");
      const csrfCookie = cookies.find((row) => row.startsWith("csrfToken="));
      if (csrfCookie) {
        const token = csrfCookie.split("=")[1];
        // Basic validation: token không được rỗng
        return token && token.length > 0 ? token : null;
      }
    } catch (error) {
      console.error("Error reading CSRF token:", error);
      return null;
    }
    return null;
  };
  
  const getAuthToken = () => {
    // Token Storage: Lấy token từ localStorage
    // ⚠️ SECURITY NOTE: localStorage có thể bị XSS attack
    // Best practice: Backend nên dùng HttpOnly cookies cho production
    // Hiện tại dùng localStorage vì backend hỗ trợ Bearer token
    try {
      const token = localStorage.getItem("accessToken");
      if (!token || token.trim().length === 0) {
        return null;
      }
      return token;
    } catch (error) {
      console.error("Error reading auth token:", error);
      return null;
    }
  };

  const handleSafeError = (err) => {
    if (!err.response) {
      toast.error("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      return;
    }

    const code = err.response.data?.code;
    const status = err.response.status;

    switch (code) {
      case "DUPLICATE_PHONE":
        toast.error("Số điện thoại này đã được đăng ký. Vui lòng sử dụng số điện thoại khác.");
        break;
      case "DUPLICATE_LICENSE_PLATE":
        toast.error("Biển số xe này đã được đăng ký. Vui lòng kiểm tra lại.");
        break;
      default:
        // Rate limiting (429)
        if (status === 429) {
          const rateLimitMessage = err.response.data?.message || 
            "Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 15 phút.";
          toast.error(rateLimitMessage);
        } else if (status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          navigate("/login");
        } else if (status === 403) {
          toast.error("Bạn không có quyền thực hiện thao tác này.");
        } else if (status === 409) {
          toast.error(
            "Thông tin đăng ký đã tồn tại trong hệ thống. Vui lòng kiểm tra lại số điện thoại hoặc biển số xe."
          );
        } else if (err.response.data?.errors && Array.isArray(err.response.data.errors)) {
          err.response.data.errors.forEach((errorMsg) => {
            toast.error(errorMsg);
          });
        } else if (err.response.data?.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error("Đăng ký thất bại. Vui lòng thử lại sau.");
        }
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          padding: "40px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <ShipperLogo
              width={30}
              height={30}
              className="shipper-logo"
              style={{ width: "30px", height: "30px", objectFit: "contain" }}
            />
          </div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 0 20px",
              color: "#333",
            }}
          >
            Vui lòng đăng nhập
          </h2>
          <p
            style={{
              margin: "0 0 30px",
              color: "#666",
            }}
          >
            Bạn cần đăng nhập để đăng ký làm shipper
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#1890ff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 2px 8px rgba(24,144,255,0.35)",
            }}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
        }}
      >
        {/* Cột bên trái: Logo */}
        <div
          style={{
            flex: "1",
            backgroundColor: "#1890ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <ShipperLogo
            width={30}
            height={30}
            className="shipper-logo"
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
          />
        </div>

        {/* Cột bên phải: Form đăng ký */}
        <div
          style={{
            flex: "2",
            padding: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "20px",
              color: "#333",
            }}
          >
            Đăng ký làm Shipper
          </h2>
          <p
            style={{
              marginBottom: "20px",
              color: "#666",
            }}
          >
            Tham gia cùng chúng tôi để trở thành đối tác giao hàng
          </p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Loại phương tiện:
              </label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                disabled={loading}
                autoFocus
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.3s",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <option value="">Chọn loại phương tiện</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Biển số xe:
              </label>
              <input
                type="text"
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder="Nhập biển số xe (VD: 29A-12345)"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.3s",
                  cursor: loading ? "not-allowed" : "text",
                  opacity: loading ? 0.7 : 1,
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  color: "#333",
                }}
              >
                Số điện thoại:
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (VD: 0912345678)"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  transition: "all 0.3s",
                  cursor: loading ? "not-allowed" : "text",
                  opacity: loading ? 0.7 : 1,
                }}
              />
            </div>

            <div style={{ marginTop: "32px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#1890ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.3s",
                  boxShadow: "0 2px 8px rgba(24,144,255,0.35)",
                }}
              >
                {loading ? "Đang xử lý..." : "Đăng ký ngay"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "1px solid #d9d9d9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginTop: "12px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Quay lại
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShipperRegister;
