import React, { useState, useEffect } from "react";
import shopApi from "../../../api/VendorAPI/shopApi";
import { useSelector } from "react-redux";
import { Users, Eye, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const ShopAnalytics = () => {
  const [shopAnalytics, setShopAnalytics] = useState({
    views: 0,
    visits: 0,
    conversionRate: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.user_id) {
          throw new Error("Please login again");
        }

        const shopResponse = await shopApi.getShopInfo();

        const views = parseInt(shopResponse?.data?.data?.views) || 0;
        const visits = Math.round(views * 0.7);
        const deliveredOrders =
          parseFloat(shopResponse?.data?.data?.order_stats?.delivered) || 0;
        const conversionRate =
          visits > 0 ? ((deliveredOrders / visits) * 100).toFixed(2) : 0;

        setShopAnalytics({
          views,
          visits,
          conversionRate,
        });
      } catch (error) {
        setError(error.message || "Unable to load statistics");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.user_id) {
      fetchData();
    }
  }, [user]);

  const metricsConfig = [
    {
      key: "visits",
      label: "Visits",
      icon: Users,
      value: shopAnalytics.visits,
      bgGradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-700",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      key: "views",
      label: "Views",
      icon: Eye,
      value: shopAnalytics.views,
      bgGradient: "from-purple-50 to-purple-100/50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-700",
      trend: "+8.3%",
      trendUp: true,
    },
    {
      key: "conversion",
      label: "Conversion Rate",
      icon: TrendingUp,
      value: `${shopAnalytics.conversionRate}%`,
      bgGradient: "from-emerald-50 to-emerald-100/50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      textColor: "text-emerald-700",
      trend: "-2.1%",
      trendUp: false,
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200" />
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent absolute top-0 left-0" />
          </div>
          <p className="text-xs text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg">
        <div className="flex flex-col items-center justify-center h-48 gap-2">
          <div className="p-2 bg-red-50 rounded-full">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-xs text-red-600 font-medium text-center px-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
       <h3 className="text-xl font-bold text-gray-900">Shop Analytics</h3> 
        <p className="text-xs text-gray-500 mt-0.5">Track your shop performance metrics</p>
      </div>

      {/* Metrics Cards */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-3">
          {metricsConfig.map((metric) => {
            const Icon = metric.icon;
            const TrendIcon = metric.trendUp ? ArrowUp : ArrowDown;

            return (
              <div
                key={metric.key}
                className={`bg-gradient-to-br ${metric.bgGradient} rounded-lg p-3 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden`}
              >
                {/* Background decoration */}
                <div className={`absolute -right-4 -top-4 w-16 h-16 ${metric.iconBg} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`} />
                
                <div className="relative">
                  {/* Icon */}
                  <div className={`inline-flex p-2 ${metric.iconBg} rounded-lg mb-2 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 ${metric.iconColor}`} />
                  </div>

                  {/* Value */}
                  <div className="mb-1">
                    <p className={`text-2xl font-bold ${metric.textColor} leading-none`}>
                      {typeof metric.value === 'number' ? metric.value.toLocaleString("en-US") : metric.value}
                    </p>
                  </div>

                  {/* Label & Trend */}
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-600">{metric.label}</p>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${
                      metric.trendUp ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      <TrendIcon className="w-3 h-3" />
                      <span>{metric.trend}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">View/Visit Ratio</p>
                <p className="text-lg font-bold text-gray-900">
                  {shopAnalytics.visits > 0 
                    ? (shopAnalytics.views / shopAnalytics.visits).toFixed(2) 
                    : '0.00'}x
                </p>
              </div>
              <div className="p-2 bg-gray-200 rounded-lg">
                <Eye className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Engagement Score</p>
                <p className="text-lg font-bold text-gray-900">
                  {Math.min(Math.round((parseFloat(shopAnalytics.conversionRate) * 10) + 
                    (shopAnalytics.visits / 100)), 100)}
                </p>
              </div>
              <div className="p-2 bg-gray-200 rounded-lg">
                <TrendingUp className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopAnalytics;