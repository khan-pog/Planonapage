"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import type { ProjectMilestone } from "@/lib/types"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface ProjectMilestonesProps {
  milestones: ProjectMilestone[]
  editable?: boolean
  onChange?: (milestones: ProjectMilestone[]) => void
}

export function ProjectMilestones({ milestones, editable = false, onChange }: ProjectMilestonesProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newMilestone, setNewMilestone] = useState<ProjectMilestone>({ stage: '', date: '', comment: '' })

  const handleAddMilestone = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowForm(true)
    setEditingIndex(null)
    setNewMilestone({ stage: '', date: '', comment: '' })
  }

  const handleEditMilestone = (index: number) => {
    setEditingIndex(index)
    setNewMilestone({ ...milestones[index] })
    setShowForm(true)
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent the event from bubbling up to any parent forms
    e.nativeEvent.stopImmediatePropagation()
    
    if (!newMilestone.stage || !newMilestone.date) return
    
    if (onChange) {
      if (editingIndex !== null) {
        // Update existing milestone
        const updatedMilestones = [...milestones]
        updatedMilestones[editingIndex] = newMilestone
        onChange(updatedMilestones)
      } else {
        // Add new milestone
        onChange([...milestones, newMilestone])
      }
    }
    
    setNewMilestone({ stage: '', date: '', comment: '' })
    setShowForm(false)
    setEditingIndex(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingIndex(null)
    setNewMilestone({ stage: '', date: '', comment: '' })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Major Milestones</CardTitle>
        {editable && !showForm && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8" 
            onClick={handleAddMilestone}
            type="button"
          >
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
                {editable && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map((milestone, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{milestone.stage}</TableCell>
                  <TableCell>{milestone.date}</TableCell>
                  <TableCell>{milestone.comment}</TableCell>
                  {editable && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMilestone(index)}
                          type="button"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMilestone(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No milestones have been added yet.</p>
          </div>
        )}
        
        {showForm && (
          <form 
            className="mt-4 flex flex-col gap-2" 
            onSubmit={handleFormSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <Input
                name="stage"
                type="text"
                placeholder="Stage"
                value={newMilestone.stage}
                onChange={handleFormChange}
                className="flex-1"
                required
              />
              <Input
                name="date"
                type="date"
                placeholder="Date"
                value={newMilestone.date}
                onChange={handleFormChange}
                required
              />
              <Input
                name="comment"
                type="text"
                placeholder="Comment"
                value={newMilestone.comment}
                onChange={handleFormChange}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="h-8"
                onClick={(e) => e.stopPropagation()}
              >
                {editingIndex !== null ? 'Update' : 'Save'}
              </Button>
              <Button 
                type="button" 
                size="sm" 
                variant="ghost"
                className="h-8"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
