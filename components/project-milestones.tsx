"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import type { ProjectMilestone } from "@/lib/types"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProjectMilestonesProps {
  milestones: ProjectMilestone[]
  editable?: boolean
  onChange?: (milestones: ProjectMilestone[]) => void
}

export function ProjectMilestones({ milestones, editable = false, onChange }: ProjectMilestonesProps) {
  const [newMilestone, setNewMilestone] = useState<ProjectMilestone>({ stage: '', date: '', comment: '' })

  const handleAddMilestone = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!newMilestone.stage || !newMilestone.date) return
    
    if (onChange) {
      onChange([...milestones, newMilestone])
    }
    
    setNewMilestone({ stage: '', date: '', comment: '' })
  }

  const handleDeleteMilestone = (index: number) => {
    if (onChange) {
      const updatedMilestones = [...milestones]
      updatedMilestones.splice(index, 1)
      onChange(updatedMilestones)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMilestone({ ...newMilestone, [e.target.name]: e.target.value })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Major Milestones</CardTitle>
          <p className="text-sm text-muted-foreground">Add and manage project milestones</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add New Milestone Form */}
          {editable && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Input
                  id="stage"
                  name="stage"
                  type="text"
                  placeholder="Enter stage"
                  value={newMilestone.stage}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newMilestone.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Input
                  id="comment"
                  name="comment"
                  type="text"
                  placeholder="Enter comment"
                  value={newMilestone.comment}
                  onChange={handleFormChange}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddMilestone}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
            </div>
          )}

          {/* Milestones List */}
          {milestones.length > 0 ? (
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Stage</Label>
                    <div className="font-medium">{milestone.stage}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <div>{milestone.date}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>Comment</Label>
                    <div>{milestone.comment}</div>
                  </div>
                  {editable && (
                    <div className="flex items-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMilestone(index)}
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
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No milestones have been added yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
