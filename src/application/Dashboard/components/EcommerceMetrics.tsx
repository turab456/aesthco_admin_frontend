import React from "react"
import { ArrowDownIcon, ArrowUpIcon } from "../../../icons"
import Badge from "../../../components/ui/badge/Badge"

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark"

type MetricCard = {
  id: string
  label: string
  value: string | number
  helperText?: string
  icon?: React.ReactNode
  badgeText?: string
  badgeColor?: BadgeColor
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
        const badgeColor = metric.badgeColor ?? "primary"
        const TrendIcon = metric.trendDirection === "down" ? ArrowDownIcon : ArrowUpIcon

        return (
          <div
            key={metric.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              {metric.icon ?? (
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {metric.label.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between mt-5">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
                <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                  {metric.value}
                </h4>
                {metric.helperText ? (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{metric.helperText}</p>
                ) : null}
              </div>
              {showBadge ? (
                <Badge color={badgeColor} size="sm">
                  <TrendIcon />
                  {metric.badgeText}
                </Badge>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
