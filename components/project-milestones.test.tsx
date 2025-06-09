import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectMilestones } from './project-milestones'
import type { ProjectMilestone } from '@/lib/types'

describe('ProjectMilestones', () => {
  const mockMilestones: ProjectMilestone[] = [
    { stage: 'Test Stage', date: '2024-03-01', comment: 'Test Comment' }
  ]

  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not trigger parent form submission when adding a milestone', () => {
    const parentFormSubmit = jest.fn()
    
    render(
      <form onSubmit={parentFormSubmit}>
        <ProjectMilestones 
          milestones={mockMilestones} 
          editable={true} 
          onChange={mockOnChange} 
        />
      </form>
    )

    // Click add milestone button
    const addButton = screen.getByText('Add Milestone')
    fireEvent.click(addButton)

    // Fill in the form
    const stageInput = screen.getByPlaceholderText('Stage')
    const dateInput = screen.getByPlaceholderText('Date')
    const commentInput = screen.getByPlaceholderText('Comment')

    fireEvent.change(stageInput, { target: { value: 'New Stage' } })
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } })
    fireEvent.change(commentInput, { target: { value: 'New Comment' } })

    // Submit the milestone form
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    // Verify parent form was not submitted
    expect(parentFormSubmit).not.toHaveBeenCalled()
    
    // Verify milestone was added
    expect(mockOnChange).toHaveBeenCalledWith([
      ...mockMilestones,
      { stage: 'New Stage', date: '2024-03-15', comment: 'New Comment' }
    ])
  })

  it('should not submit if required fields are empty', () => {
    render(
      <ProjectMilestones 
        milestones={mockMilestones} 
        editable={true} 
        onChange={mockOnChange} 
      />
    )

    // Click add milestone button
    const addButton = screen.getByText('Add Milestone')
    fireEvent.click(addButton)

    // Try to submit without filling required fields
    const saveButton = screen.getByText('Save')
    fireEvent.click(saveButton)

    // Verify onChange was not called
    expect(mockOnChange).not.toHaveBeenCalled()
  })
}) 