import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PhasePercentages } from "@/lib/types"

interface ProjectPhaseProgressProps {
  percentages: PhasePercentages
}

export function ProjectPhaseProgress({ percentages }: ProjectPhaseProgressProps) {
  const phases = [
    { key: "fel0", label: "FEL 0", color: "bg-violet-500", legacy: "FEL0" },
    { key: "fel2", label: "FEL 2", color: "bg-blue-500", legacy: "FEL2" },
    { key: "fel3", label: "FEL 3", color: "bg-cyan-500", legacy: "FEL3" },
    { key: "preExecution", label: "Pre-Execution", color: "bg-amber-500", legacy: "Pre-Execution" },
    { key: "execution", label: "Execution", color: "bg-emerald-500", legacy: "Execution" },
    { key: "closeOut", label: "Close-Out", color: "bg-rose-500", legacy: "Close-Out" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            {phases.map((phase) => {
              const raw =
                percentages[phase.key as keyof PhasePercentages] ??
                // @ts-ignore - legacy fallback
                (percentages as any)[phase.legacy]
              const percent = typeof raw === "number" ? raw : 0
              // Each phase contributes equally (1/6) to total bar; multiply by completion ratio
              const widthFraction = (percent / 100) * (100 / phases.length)
              return widthFraction > 0 ? (
                <div key={phase.key} className={`${phase.color} transition-all`} style={{ width: `${widthFraction}%` }} />
              ) : null
            })}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
            {phases.map((phase) => {
              const raw =
                percentages[phase.key as keyof PhasePercentages] ??
                // @ts-ignore legacy fallback
                (percentages as any)[phase.legacy]
              const percent = typeof raw === "number" ? raw : 0
              return (
                <div key={phase.key} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${phase.color} mb-1`} />
                  <span className="text-center">{phase.label}</span>
                  <span className="text-muted-foreground">{percent}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
