"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import type { CostTracking, MonthlyCostData } from "@/lib/types"

// Add function to get current month and year
const getCurrentMonthYear = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

interface ProjectCostFormProps {
  costTracking: CostTracking
  onChange: (costTracking: CostTracking) => void
  editable?: boolean
}

export function ProjectCostForm({ costTracking, onChange, editable = true }: ProjectCostFormProps) {
  const updateCostTracking = (updates: Partial<CostTracking>) => {
    onChange({ ...costTracking, ...updates })
  }

  const updateMonthlyData = (index: number, updates: Partial<MonthlyCostData>) => {
    const newMonthlyData = [...costTracking.monthlyData]
    const updatedMonth = { ...newMonthlyData[index], ...updates }
    
    // Calculate variance
    updatedMonth.variance = updatedMonth.actualCost - updatedMonth.budgetedCost
    
    // Calculate cumulative values
    let cumulativeBudget = 0
    let cumulativeActual = 0
    
    // Update all months up to and including the current month
    for (let i = 0; i <= index; i++) {
      if (i === index) {
        cumulativeBudget += updatedMonth.budgetedCost
        cumulativeActual += updatedMonth.actualCost
        newMonthlyData[i] = {
          ...updatedMonth,
          cumulativeBudget,
          cumulativeActual
        }
      } else {
        cumulativeBudget += newMonthlyData[i].budgetedCost
        cumulativeActual += newMonthlyData[i].actualCost
        newMonthlyData[i] = {
          ...newMonthlyData[i],
          cumulativeBudget,
          cumulativeActual
        }
      }
    }
    
    // Update remaining months with new cumulative values
    for (let i = index + 1; i < newMonthlyData.length; i++) {
      cumulativeBudget += newMonthlyData[i].budgetedCost
      cumulativeActual += newMonthlyData[i].actualCost
      newMonthlyData[i] = {
        ...newMonthlyData[i],
        cumulativeBudget,
        cumulativeActual
      }
    }

    // Calculate overall variance percentage
    const totalBudget = costTracking.totalBudget
    const totalActual = newMonthlyData.reduce((sum, month) => sum + month.actualCost, 0)
    const variancePercentage = totalBudget > 0 ? ((totalActual - totalBudget) / totalBudget) * 100 : 0

    updateCostTracking({ 
      monthlyData: newMonthlyData,
      variance: variancePercentage
    })
  }

  const addMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    let newMonthValue: string
    
    if (costTracking.monthlyData.length === 0) {
      // First entry - use current month
      newMonthValue = getCurrentMonthYear()
    } else {
      // Get the last month's date and add one month
      const lastMonth = costTracking.monthlyData[costTracking.monthlyData.length - 1].month
      const [year, month] = lastMonth.split('-').map(Number)
      const date = new Date(year, month - 1) // month is 0-based in JS Date
      date.setMonth(date.getMonth() + 1)
      newMonthValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    }
    
    const newMonth: MonthlyCostData = {
      month: newMonthValue,
      budgetedCost: 0,
      actualCost: 0,
      cumulativeBudget: 0,
      cumulativeActual: 0,
      variance: 0
    }
    updateCostTracking({ monthlyData: [...costTracking.monthlyData, newMonth] })
  }

  const removeMonth = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newMonthlyData = [...costTracking.monthlyData]
    newMonthlyData.splice(index, 1)
    updateCostTracking({ monthlyData: newMonthlyData })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: costTracking.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Budget Information */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Information</CardTitle>
          <CardDescription>Set the overall project budget and tracking parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-budget">Total Budget</Label>
              <Input
                id="total-budget"
                type="number"
                placeholder="Enter total budget"
                value={costTracking.totalBudget}
                onChange={(e) => updateCostTracking({ totalBudget: Number(e.target.value) })}
                disabled={!editable}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={costTracking.currency}
                onValueChange={(value) => updateCostTracking({ currency: value })}
                disabled={!editable}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost-status">Cost Status</Label>
              <Select
                value={costTracking.costStatus}
                onValueChange={(value: any) => updateCostTracking({ costStatus: value })}
                disabled={!editable}
              >
                <SelectTrigger id="cost-status">
                  <SelectValue placeholder="Select cost status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under Budget">Under Budget</SelectItem>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Over Budget">Over Budget</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forecast-completion">Forecast at Completion</Label>
              <Input
                id="forecast-completion"
                type="number"
                placeholder="Enter forecast"
                value={costTracking.forecastCompletion}
                onChange={(e) => updateCostTracking({ forecastCompletion: Number(e.target.value) })}
                disabled={!editable}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Cost Data */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Cost Data</CardTitle>
            <CardDescription>Track monthly budgeted vs actual costs</CardDescription>
          </div>
          {editable && (
            <Button onClick={addMonth} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Month
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {costTracking.monthlyData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No monthly data added yet.</p>
              {editable && (
                <Button onClick={addMonth} variant="outline" className="mt-4">
                  Add First Month
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {costTracking.monthlyData.map((month, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select
                      value={month.month}
                      onValueChange={(value) => updateMonthlyData(index, { month: value })}
                      disabled={!editable}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const date = new Date()
                          date.setMonth(i)
                          const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' })
                          const value = `${date.getFullYear()}-${String(i + 1).padStart(2, '0')}`
                          return (
                            <SelectItem key={value} value={value}>
                              {monthYear}
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budgeted Cost</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={month.budgetedCost}
                      onChange={(e) => updateMonthlyData(index, { budgetedCost: Number(e.target.value) })}
                      disabled={!editable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Actual Cost</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={month.actualCost}
                      onChange={(e) => updateMonthlyData(index, { actualCost: Number(e.target.value) })}
                      disabled={!editable}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Variance</Label>
                    <div
                      className={`p-2 text-sm rounded border ${
                        month.variance > 0
                          ? "text-red-600 bg-red-50"
                          : month.variance < 0
                            ? "text-green-600 bg-green-50"
                            : "text-gray-600 bg-gray-50"
                      }`}
                    >
                      {month.variance > 0 ? "+" : ""}
                      {formatCurrency(month.variance)}
                    </div>
                  </div>
                  {editable && (
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => removeMonth(index, e)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cost Summary */}
      {costTracking.monthlyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(costTracking.totalBudget)}</div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(costTracking.monthlyData.reduce((sum, month) => sum + month.actualCost, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(costTracking.forecastCompletion)}</div>
                <div className="text-sm text-muted-foreground">Forecast at Completion</div>
              </div>
              <div className="text-center">
                <div
                  className={`text-2xl font-bold ${
                    costTracking.variance > 0
                      ? "text-red-600"
                      : costTracking.variance < 0
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  {costTracking.variance > 0 ? "+" : ""}
                  {costTracking.variance.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Variance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
