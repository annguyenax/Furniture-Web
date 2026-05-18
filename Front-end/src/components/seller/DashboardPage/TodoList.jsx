import React, { useState, useEffect } from "react";
import { getOrderStats } from "../../../services/vendorService";
import { useSelector } from "react-redux";
import { Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";

const OrderStatusStats = () => {
  const [stats, setStats] = useState({
    ordersByStatus: {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, roles } = useSelector((state) => state.auth || {});

  useEffect(() => {
    const fetchOrderStats = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.user_id) {
          throw new Error("You are not logged in");
        }
        if (!roles || !roles.includes("vendor")) {
          throw new Error("You don't have permission to access this page");
        }

        const response = await getOrderStats();
        setStats((prev) => ({ ...prev, ...(response || {}) }));
      } catch (err) {
        setError(err.message || "Error loading data");
        console.error("Error fetching order stats:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && roles && roles.length > 0) {
      fetchOrderStats();
    }
  }, [user, roles]);

  const statusConfig = [
    {
      key: "pending",
      label: "Pending",
      icon: Clock,
      color: "blue",
      bgGradient: "from-blue-50 to-blue-100/50",
      textColor: "text-blue-700",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      key: "processing",
      label: "Processing",
      icon: Package,
      color: "amber",
      bgGradient: "from-amber-50 to-amber-100/50",
      textColor: "text-amber-700",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "purple",
      bgGradient: "from-purple-50 to-purple-100/50",
      textColor: "text-purple-700",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "emerald",
      bgGradient: "from-emerald-50 to-emerald-100/50",
      textColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      key: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "red",
      bgGradient: "from-red-50 to-red-100/50",
      textColor: "text-red-700",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const totalOrders = Object.values(stats.ordersByStatus || {}).reduce((sum, val) => sum + (val || 0), 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200" />
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent absolute top-0 left-0" />
          </div>
          <p className="text-xs text-gray-500">Loading order statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <div className="p-2 bg-red-50 rounded-full">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Order Status Statistics</h3>
          <div className="text-xs text-gray-500">
            Total: <span className="font-semibold text-gray-900">{totalOrders}</span>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {statusConfig.map((status) => {
            const Icon = status.icon;
            const count = stats.ordersByStatus?.[status.key] || 0;
            const percentage = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : 0;

            return (
              <div
                key={status.key}
                className={`bg-gradient-to-br ${status.bgGradient} rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 ${status.iconBg} rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 ${status.iconColor}`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${status.textColor}`}>{count}</p>
                    <p className="text-xs text-gray-500">{percentage}%</p>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600">{status.label}</p>
                
                {/* Progress bar */}
                <div className="mt-2 w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${status.bgGradient} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Bar */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Order Distribution</span>
            <span className="text-xs text-gray-500">{totalOrders} total orders</span>
          </div>
          <div className="flex w-full h-2 rounded-full overflow-hidden bg-gray-200">
            {statusConfig.map((status, idx) => {
              const count = stats.ordersByStatus?.[status.key] || 0;
              const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
              
              return (
                <div
                  key={status.key}
                  className={`h-full transition-all duration-500 ${
                    idx === 0 ? 'bg-blue-500' :
                    idx === 1 ? 'bg-amber-500' :
                    idx === 2 ? 'bg-purple-500' :
                    idx === 3 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                  title={`${status.label}: ${count}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusStats;