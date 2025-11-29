import React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "../../../icons"

// Simplified badge logic for monochrome theme
type MetricCard = {
  id: string
  label: string
  value: string | number
  helperText?: string
  icon?: React.ReactNode
  badgeText?: string
  trendDirection?: "up" | "down"
}

type Props = {
  metrics: MetricCard[]
}

export default function EcommerceMetrics({ metrics }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {metrics.map((metric) => {
        const showBadge = Boolean(metric.badgeText)
        const isUp = metric.trendDirection !== "down" // Default to up if undefined
        const TrendIcon = isUp ? ArrowUpIcon : ArrowDownIcon

        return (
          <div
            key={metric.id}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/60 md:p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                {metric.icon ?? (
                  <span className="text-lg font-bold">
                    {metric.label.charAt(0)}
                  </span>
                )}
              </div>
              
              {showBadge && (
                <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium border ${
                    isUp 
                    ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900" 
                    : "border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-400"
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  <span>{metric.badgeText}</span>
                </div>
              )}
            </div>

            <div className="mt-5">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.label}</span>
              <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </h4>
              {metric.helperText && (
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{metric.helperText}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}