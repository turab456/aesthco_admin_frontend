import { useMemo } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { DashboardRevenue } from "../types";

type Props = {
  revenue?: DashboardRevenue;
  loading?: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export default function MonthlySalesChart({ revenue, loading = false }: Props) {
  const categories = ["Paid", "Pending", "Cancelled", "Expected"];

  const series = useMemo(
    () => [
      {
        name: "Revenue Volume",
        data: [
          revenue?.paid ?? 0,
          revenue?.pending ?? 0,
          revenue?.cancelled ?? 0,
          revenue?.expected ?? 0,
        ],
      },
    ],
    [revenue]
  );

  const options: ApexOptions = {
    colors: ["#000000"], // Pure Black
    chart: {
      fontFamily: "inherit",
      type: "area", // Changed to Area for a "graph" look
      height: 240,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#000000"], // Black Line
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#6b7280", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatCurrency(val),
        style: { colors: "#6b7280", fontSize: "12px" },
      },
    },
    grid: {
      borderColor: "#f3f4f6", // very light gray
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => formatCurrency(val) },
      marker: { show: true },
    },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: "#000",
      strokeWidth: 2,
      hover: { size: 6 },
    },
  };

  const isEmpty = !revenue && !loading;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/60 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Revenue Analysis
          </h3>
          <p className="text-xs text-gray-500">Breakdown by payment status</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-[240px] items-center justify-center text-sm text-gray-400 animate-pulse">
          Loading chart...
        </div>
      ) : isEmpty ? (
        <div className="flex h-[240px] items-center justify-center text-sm text-gray-400">
          No revenue data available.
        </div>
      ) : (
        <div className="-ml-3 w-[calc(100%+10px)]">
          <Chart options={options} series={series} type="area" height={240} />
        </div>
      )}
    </div>
  );
}
