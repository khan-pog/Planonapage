import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectNarrative } from "@/lib/types"

interface ProjectNarrativesProps {
  narrative: ProjectNarrative
  editable?: boolean
}

export function ProjectNarratives({ narrative, editable = false }: ProjectNarrativesProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          {editable ? (
            <Textarea
              defaultValue={narrative.general}
              placeholder="Add general narrative..."
              className="min-h-[150px]"
            />
          ) : (
            <div className="whitespace-pre-wrap">{narrative.general || "No general narrative provided."}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achieved This Month</CardTitle>
        </CardHeader>
        <CardContent>
          {editable ? (
            <Textarea
              defaultValue={narrative.achieved}
              placeholder="Add achievements for this month..."
              className="min-h-[150px]"
            />
          ) : (
            <div className="whitespace-pre-wrap">{narrative.achieved || "No achievements listed for this month."}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Planned - Next Month</CardTitle>
        </CardHeader>
        <CardContent>
          {editable ? (
            <Textarea
              defaultValue={narrative.plannedNext}
              placeholder="Add plans for next month..."
              className="min-h-[150px]"
            />
          ) : (
            <div className="whitespace-pre-wrap">{narrative.plannedNext || "No plans listed for next month."}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk/Issues/Escalations</CardTitle>
        </CardHeader>
        <CardContent>
          {editable ? (
            <Textarea
              defaultValue={narrative.riskIssues}
              placeholder="Add risks, issues, or escalations..."
              className="min-h-[150px]"
            />
          ) : (
            <div className="whitespace-pre-wrap">
              {narrative.riskIssues || "No risks, issues, or escalations listed."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
