import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, BarChart3, PieChart, LineChart } from "lucide-react";
import revenueApi from "../../../api/VendorAPI/revenueApi";

const monthLabels = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MonthlyRevenueChart = ({ initialYear = new Date().getFullYear() }) => {
  const [year, setYear] = useState(initialYear);
  const [data, setData] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [chartType, setChartType] = useState("bar"); // bar, pie, line

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
  // Call real API
  const resp = await revenueApi.getMonthlyRevenue(year);
        const payload = resp?.data;
        if (payload && payload.success && payload.data && Array.isArray(payload.data.revenue)) {
          if (mounted) setData(payload.data.revenue.map((v) => Number(v) || 0));
        } else if (payload && Array.isArray(payload.revenue)) {
          if (mounted) setData(payload.revenue.map((v) => Number(v) || 0));
        } else {
          if (mounted) setError("No data returned");
        }
      } catch (err) {
        console.error("Error fetching monthly revenue:", err);
        if (mounted) setError(err.message || "Failed to load revenue");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => (mounted = false);
  }, [year]);

  const maxVal = Math.max(...data, 1);
  const totalRevenue = data.reduce((sum, val) => sum + val, 0);
  const avgRevenue = totalRevenue / 12;

  const renderBarChart = () => (
    <svg 
      viewBox="0 0 120 32" 
  className="w-full h-44"
      onMouseLeave={() => setHoveredMonth(null)}
    >
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = 27 - ratio * 22;
        return (
          <line
            key={i}
            x1="2"
            y1={y}
            x2="118"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="0.2"
            strokeDasharray="1,1"
          />
        );
      })}

      {/* Bars */}
      {data.map((val, idx) => {
        const x = 2 + idx * 9;
        const heightPct = (val / maxVal) * 22;
        const y = 27 - heightPct;
        const isHovered = hoveredMonth === idx;
        
        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={6}
              height={heightPct}
              rx={1}
              fill={isHovered ? "#1e40af" : "#3b82f6"}
              className="transition-all cursor-pointer"
              onMouseEnter={() => setHoveredMonth(idx)}
              opacity={isHovered ? 1 : 0.9}
            />
            
            {isHovered && (
              <>
                <rect
                  x={x - 0.5}
                  y={y - 0.5}
                  width={7}
                  height={heightPct + 1}
                  rx={1.2}
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
                <rect
                  x={x - 4}
                  y={y - 6}
                  width={14}
                  height={5}
                  rx={1}
                  fill="#1e293b"
                  opacity="0.9"
                />
                <text
                  x={x + 3}
                  y={y - 2.5}
                  fontSize="2.5"
                  textAnchor="middle"
                  fill="white"
                  fontWeight="600"
                >
                  {(val / 1000000).toFixed(1)}M
                </text>
              </>
            )}
            
            <text
              x={x + 3}
              y={30}
              fontSize="2.5"
              textAnchor="middle"
              fill={isHovered ? "#1e40af" : "#6b7280"}
              fontWeight={isHovered ? "600" : "500"}
            >
              {monthLabels[idx]}
            </text>
          </g>
        );
      })}
    </svg>
  );

  const renderPieChart = () => {
    const colors = [
      "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", 
      "#10b981", "#06b6d4", "#6366f1", "#f97316",
      "#14b8a6", "#a855f7", "#ef4444", "#84cc16"
    ];
    
    let currentAngle = -90;
    const centerX = 60;
    const centerY = 18;
    const radius = 13;
    
    return (
      <svg 
        viewBox="0 0 120 38" 
  className="w-full h-44"
        onMouseLeave={() => setHoveredMonth(null)}
      >
        {data.map((val, idx) => {
          const percentage = (val / totalRevenue) * 100;
          const angle = (percentage / 100) * 360;
          
          const startAngle = currentAngle * (Math.PI / 180);
          const endAngle = (currentAngle + angle) * (Math.PI / 180);
          
          const x1 = centerX + radius * Math.cos(startAngle);
          const y1 = centerY + radius * Math.sin(startAngle);
          const x2 = centerX + radius * Math.cos(endAngle);
          const y2 = centerY + radius * Math.sin(endAngle);
          
          const largeArc = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');
          
          const isHovered = hoveredMonth === idx;
          
          currentAngle += angle;
          
          return (
            <g key={idx}>
              <path
                d={pathData}
                fill={colors[idx]}
                stroke="white"
                strokeWidth="0.5"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredMonth(idx)}
                opacity={isHovered ? 1 : 0.9}
              />
            </g>
          );
        })}
        
        {/* Legend */}
        <g>
          {data.map((val, idx) => {
            const row = Math.floor(idx / 2);
            const col = idx % 2;
            const x = 5 + col * 50;
            const y = 34 + row * 3;
            
            return (
              <g 
                key={idx}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredMonth(idx)}
              >
                <rect x={x} y={y - 1.5} width={2.5} height={2.5} fill={colors[idx]} rx={0.5} />
                <text x={x + 3.5} y={y + 0.5} fontSize="2.2" fill="#374151" fontWeight={hoveredMonth === idx ? "600" : "400"}>
                  {monthLabels[idx]}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  const renderLineChart = () => {
    const points = data.map((val, idx) => {
      const x = 10 + idx * 9;
      const y = 27 - (val / maxVal) * 22;
      return { x, y, val };
    });
    
    const pathData = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');
    
    const areaPathData = `${pathData} L ${points[points.length - 1].x} 27 L ${points[0].x} 27 Z`;
    
    return (
      <svg 
        viewBox="0 0 120 32" 
  className="w-full h-44"
        onMouseLeave={() => setHoveredMonth(null)}
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = 27 - ratio * 22;
          return (
            <line
              key={i}
              x1="10"
              y1={y}
              x2="118"
              y2={y}
              stroke="#e5e7eb"
              strokeWidth="0.2"
              strokeDasharray="1,1"
            />
          );
        })}
        
        {/* Area fill */}
        <path
          d={areaPathData}
          fill="url(#gradient)"
          opacity="0.3"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {points.map((p, idx) => {
          const isHovered = hoveredMonth === idx;
          return (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 2 : 1.5}
                fill="white"
                stroke="#3b82f6"
                strokeWidth={isHovered ? 1 : 0.8}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredMonth(idx)}
              />
              
              {isHovered && (
                <>
                  <rect
                    x={p.x - 6}
                    y={p.y - 8}
                    width={12}
                    height={5}
                    rx={1}
                    fill="#1e293b"
                    opacity="0.9"
                  />
                  <text
                    x={p.x}
                    y={p.y - 4.5}
                    fontSize="2.5"
                    textAnchor="middle"
                    fill="white"
                    fontWeight="600"
                  >
                    {(p.val / 1000000).toFixed(1)}M
                  </text>
                </>
              )}
              
              <text
                x={p.x}
                y={30}
                fontSize="2.5"
                textAnchor="middle"
                fill={isHovered ? "#1e40af" : "#6b7280"}
                fontWeight={isHovered ? "600" : "500"}
              >
                {monthLabels[idx]}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Monthly Revenue</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-md p-0.5">
            <button
              className={`p-1.5 rounded transition-all ${
                chartType === "bar" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setChartType("bar")}
              title="Bar Chart"
            >
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-1.5 rounded transition-all ${
                chartType === "line" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setChartType("line")}
              title="Line Chart"
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
            <button
              className={`p-1.5 rounded transition-all ${
                chartType === "pie" 
                  ? "bg-white shadow-sm text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setChartType("pie")}
              title="Pie Chart"
            >
              <PieChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-md p-0.5">
            <button
              className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-50"
              onClick={() => setYear((y) => y - 1)}
              disabled={loading}
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <span className="px-3 py-1 font-semibold text-sm text-gray-900 min-w-[60px] text-center">
              {year}
            </span>
            <button
              className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-50"
              onClick={() => setYear((y) => y + 1)}
              disabled={loading}
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-44 gap-2">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-200" />
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent absolute top-0 left-0" />
          </div>
          <p className="text-xs text-gray-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-44 gap-2">
          <div className="p-2 bg-red-50 rounded-full">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 px-1 py-2 bg-gray-50">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-md p-3">
              <p className="text-xs font-medium text-blue-600 mb-0.5">Total Revenue</p>
              <p className="text-base font-semibold text-blue-900">
                {new Intl.NumberFormat("vi-VN").format(totalRevenue)} ₫
              </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-md p-3">
              <p className="text-xs font-medium text-emerald-600 mb-0.5">Average / Month</p>
              <p className="text-base font-semibold text-emerald-900">
                {new Intl.NumberFormat("vi-VN").format(avgRevenue)} ₫
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-md p-3">
              <p className="text-xs font-medium text-purple-600 mb-0.5">Peak Revenue</p>
              <p className="text-base font-semibold text-purple-900">
                {new Intl.NumberFormat("vi-VN").format(maxVal)} ₫
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="px-1 py-3">
            {chartType === "bar" && renderBarChart()}
            {chartType === "pie" && renderPieChart()}
            {chartType === "line" && renderLineChart()}

            {/* Hover Info */}
            {hoveredMonth !== null && (
              <div className="mt-3 p-2.5 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">
                  {monthLabels[hoveredMonth]} {year}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {new Intl.NumberFormat("vi-VN").format(data[hoveredMonth])} ₫
                </p>
                {chartType === "pie" && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {((data[hoveredMonth] / totalRevenue) * 100).toFixed(1)}% of total
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyRevenueChart;