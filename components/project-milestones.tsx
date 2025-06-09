"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  const addMilestone = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newMilestone: ProjectMilestone = {
      stage: '',
      date: '',
      comment: ''
    }
    if (onChange) {
      onChange([...milestones, newMilestone])
    }
  }

  const updateMilestone = (index: number, field: keyof ProjectMilestone, value: string) => {
    if (onChange) {
      const updatedMilestones = [...milestones]
      updatedMilestones[index] = { ...updatedMilestones[index], [field]: value }
      onChange(updatedMilestones)
    }
  }

  const removeMilestone = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onChange) {
      const updatedMilestones = [...milestones]
      updatedMilestones.splice(index, 1)
      onChange(updatedMilestones)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Major Milestones</CardTitle>
          <CardDescription>Add and manage project milestones</CardDescription>
        </div>
        {editable && (
          <Button onClick={addMilestone} size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Milestone
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No milestones have been added yet.</p>
            {editable && (
              <Button onClick={addMilestone} variant="outline" className="mt-4">
                Add First Milestone
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Input
                    type="text"
                    placeholder="Enter stage"
                    value={milestone.stage}
                    onChange={(e) => updateMilestone(index, 'stage', e.target.value)}
                    disabled={!editable}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={milestone.date}
                    onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                    disabled={!editable}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Comment</Label>
                  <Input
                    type="text"
                    placeholder="Enter comment"
                    value={milestone.comment}
                    onChange={(e) => updateMilestone(index, 'comment', e.target.value)}
                    disabled={!editable}
                  />
                </div>
                {editable && (
                  <div className="flex items-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => removeMilestone(index, e)}
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
  )
}
