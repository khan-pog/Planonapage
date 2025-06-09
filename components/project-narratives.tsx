import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectNarrative } from "@/lib/types"

interface ProjectNarrativesProps {
  narrative: ProjectNarrative
  editable?: boolean
  onChange?: (narrative: ProjectNarrative) => void
}

export function ProjectNarratives({ narrative, editable = false, onChange }: ProjectNarrativesProps) {
  const handleNarrativeChange = (field: keyof ProjectNarrative, value: string) => {
    if (onChange) {
      onChange({ ...narrative, [field]: value })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          {editable ? (
            <Textarea
              value={narrative.general}
              onChange={(e) => handleNarrativeChange('general', e.target.value)}
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
              value={narrative.achieved}
              onChange={(e) => handleNarrativeChange('achieved', e.target.value)}
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
              value={narrative.plannedNext}
              onChange={(e) => handleNarrativeChange('plannedNext', e.target.value)}
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
              value={narrative.riskIssues}
              onChange={(e) => handleNarrativeChange('riskIssues', e.target.value)}
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
