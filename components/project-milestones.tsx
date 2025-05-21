import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ProjectMilestone } from "@/lib/types"

interface ProjectMilestonesProps {
  milestones: ProjectMilestone[]
  editable?: boolean
}

export function ProjectMilestones({ milestones, editable = false }: ProjectMilestonesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Major Milestones</CardTitle>
        {editable && (
          <Button size="sm" variant="outline" className="h-8">
            <Plus className="h-4 w-4 mr-1" />
            Add Milestone
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {milestones.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Stage</TableHead>
                <TableHead className="w-[150px]">Date</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((milestone, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{milestone.stage}</TableCell>
                  <TableCell>{milestone.date}</TableCell>
                  <TableCell>{milestone.comment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No milestones have been added yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
