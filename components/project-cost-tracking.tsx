"use client"

import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { CostTracking } from "@/lib/types"

interface ProjectCostTrackingProps {
  costTracking: CostTracking
}

export function ProjectCostTracking({ costTracking }: ProjectCostTrackingProps) {
  const getCostStatusColor = (status: string) => {
    switch (status) {
      case "Under Budget":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "On Track":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Monitor":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Over Budget":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: costTracking.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalSpent = costTracking.monthlyData.reduce((sum, month) => sum + month.actualCost, 0)
  const budgetUtilization = (totalSpent / costTracking.totalBudget) * 100

  return (
    <div className="space-y-6">
      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(costTracking.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Total Budget</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{formatCurrency(costTracking.forecastCompletion)}</div>
            <p className="text-xs text-muted-foreground">Forecast at Completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge className={getCostStatusColor(costTracking.costStatus)}>{costTracking.costStatus}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {costTracking.variance > 0 ? "+" : ""}
              {costTracking.variance.toFixed(1)}% variance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Utilization</CardTitle>
          <CardDescription>{budgetUtilization.toFixed(1)}% of total budget utilized</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={budgetUtilization} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatCurrency(totalSpent)} spent</span>
            <span>{formatCurrency(costTracking.totalBudget - totalSpent)} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Cost Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Tracking</CardTitle>
          <CardDescription>Budgeted vs Actual costs by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              budgetedCost: {
                label: "Budgeted Cost",
                color: "hsl(222.2 84% 4.9%)",
              },
              actualCost: {
                label: "Actual Cost",
                color: "hsl(346.8 77.2% 49.8%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costTracking.monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Legend />
                <Bar dataKey="budgetedCost" fill="hsl(222.2 84% 4.9%)" name="Budgeted Cost" />
                <Bar dataKey="actualCost" fill="hsl(346.8 77.2% 49.8%)" name="Actual Cost" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Cumulative Cost Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cumulative Cost Tracking</CardTitle>
          <CardDescription>Running total of budgeted vs actual costs</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              cumulativeBudget: {
                label: "Cumulative Budget",
                color: "hsl(222.2 84% 4.9%)",
              },
              cumulativeActual: {
                label: "Cumulative Actual",
                color: "hsl(346.8 77.2% 49.8%)",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costTracking.monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cumulativeBudget"
                  stroke="hsl(222.2 84% 4.9%)"
                  name="Cumulative Budget"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeActual"
                  stroke="hsl(346.8 77.2% 49.8%)"
                  name="Cumulative Actual"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Monthly Variance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Variance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Budgeted</th>
                  <th className="text-right p-2">Actual</th>
                  <th className="text-right p-2">Variance</th>
                  <th className="text-right p-2">Variance %</th>
                </tr>
              </thead>
              <tbody>
                {costTracking.monthlyData.map((month, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{month.month}</td>
                    <td className="p-2 text-right">{formatCurrency(month.budgetedCost)}</td>
                    <td className="p-2 text-right">{formatCurrency(month.actualCost)}</td>
                    <td className={`p-2 text-right ${month.variance > 0 ? "text-red-600" : "text-green-600"}`}>
                      {month.variance > 0 ? "+" : ""}
                      {formatCurrency(month.variance)}
                    </td>
                    <td className={`p-2 text-right ${month.variance > 0 ? "text-red-600" : "text-green-600"}`}>
                      {month.budgetedCost > 0 ? ((month.variance / month.budgetedCost) * 100).toFixed(1) : "0.0"}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
