import { useMemo, useState } from "react"
import Chart from "react-apexcharts"
import type { ApexOptions } from "apexcharts"
import { Dropdown } from "../../../components/ui/dropdown/Dropdown"
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem"
import { MoreDotIcon } from "../../../icons"
import type { DashboardRevenue } from "../types"

type Props = {
  revenue?: DashboardRevenue
  loading?: boolean
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  )

export default function MonthlySalesChart({ revenue, loading = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const categories = ["Paid", "Pending", "Cancelled", "Expected"]
  const series = useMemo(
    () => [
      {
        name: "Revenue",
        data: [
          revenue?.paid ?? 0,
          revenue?.pending ?? 0,
          revenue?.cancelled ?? 0,
          revenue?.expected ?? 0,
        ],
      },
    ],
    [revenue],
  )

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 200,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit, sans-serif",
    },
    yaxis: { labels: { formatter: (val: number) => formatCurrency(val) } },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val: number) => formatCurrency(val) } },
  }

  function toggleDropdown() {
    setIsOpen((prev) => !prev)
  }

  function closeDropdown() {
    setIsOpen(false)
  }

  const isEmpty = !revenue && !loading

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Revenue Snapshot</h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={toggleDropdown}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Export
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-sm text-gray-500 animate-pulse dark:text-gray-400">Loading revenue...</div>
      ) : isEmpty ? (
        <div className="py-10 text-sm text-gray-500 dark:text-gray-400">No revenue data yet.</div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[450px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="bar" height={200} />
          </div>
        </div>
      )}
    </div>
  )
}
