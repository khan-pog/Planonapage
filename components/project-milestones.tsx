import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { ProjectMilestone } from "@/lib/types"
import { useState } from "react"

interface ProjectMilestonesProps {
  milestones: ProjectMilestone[]
  editable?: boolean
  onChange?: (milestones: ProjectMilestone[]) => void
}

export function ProjectMilestones({ milestones, editable = false, onChange }: ProjectMilestonesProps) {
  const [showForm, setShowForm] = useState(false)
  const [newMilestone, setNewMilestone] = useState<ProjectMilestone>({ stage: '', date: '', comment: '' })

  const handleAddMilestone = () => {
    setShowForm(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMilestone({ ...newMilestone, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent event from bubbling up to parent form
    if (!newMilestone.stage || !newMilestone.date) return
    if (onChange) {
      onChange([...milestones, newMilestone])
    }
    setNewMilestone({ stage: '', date: '', comment: '' })
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Major Milestones</CardTitle>
        {editable && (
          <Button size="sm" variant="outline" className="h-8" onClick={handleAddMilestone}>
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
        
        {editable && showForm && (
          <form className="mt-4 flex flex-col gap-2" onSubmit={handleFormSubmit}>
            <div className="flex gap-2">
              <input
                name="stage"
                type="text"
                placeholder="Stage"
                value={newMilestone.stage}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 flex-1"
                required
              />
              <input
                name="date"
                type="date"
                placeholder="Date"
                value={newMilestone.date}
                onChange={handleFormChange}
                className="border rounded px-2 py-1"
                required
              />
              <input
                name="comment"
                type="text"
                placeholder="Comment"
                value={newMilestone.comment}
                onChange={handleFormChange}
                className="border rounded px-2 py-1 flex-1"
              />
              <Button type="submit" size="sm" className="h-8">Save</Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
