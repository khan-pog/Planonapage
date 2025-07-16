import type { CostTracking } from "@/lib/types";

function encodeChart(chartConfig: object, width = 480, height = 240): string {
  const encoded = encodeURIComponent(JSON.stringify(chartConfig));
  return `https://quickchart.io/chart?w=${width}&h=${height}&bkg=white&c=${encoded}`;
}

export function getCostChartUrls(costTracking: CostTracking): { monthlyChartUrl: string; cumulativeChartUrl: string } {
  const labels = costTracking.monthlyData.map((m) => m.month);
  const budgeted = costTracking.monthlyData.map((m) => m.budgetedCost);
  const actual = costTracking.monthlyData.map((m) => m.actualCost);
  const cumBudget = costTracking.monthlyData.map((m) => m.cumulativeBudget);
  const cumActual = costTracking.monthlyData.map((m) => m.cumulativeActual);

  // Monthly bar chart
  const monthlyConfig = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Budgeted",
          backgroundColor: "#3b82f6",
          data: budgeted,
        },
        {
          label: "Actual",
          backgroundColor: "#16a34a",
          data: actual,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { display: false } },
        y: { ticks: { display: false } },
      },
    },
  };

  // Cumulative line chart
  const cumulativeConfig = {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Cumulative Budget",
          borderColor: "#1e293b",
          borderWidth: 2,
          fill: false,
          data: cumBudget,
        },
        {
          label: "Cumulative Actual",
          borderColor: "#dc2626",
          borderWidth: 2,
          fill: false,
          data: cumActual,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: { ticks: { display: false } },
        y: { ticks: { display: false } },
      },
    },
  };

  return {
    monthlyChartUrl: encodeChart(monthlyConfig),
    cumulativeChartUrl: encodeChart(cumulativeConfig),
  };
} 