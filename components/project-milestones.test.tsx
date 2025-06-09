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

  it('should render milestones in view-only mode', () => {
    render(
      <ProjectMilestones 
        milestones={mockMilestones} 
        editable={false} 
      />
    )

    // Should show the milestone
    expect(screen.getByText('Test Stage')).toBeInTheDocument()
    expect(screen.getByText('2024-03-01')).toBeInTheDocument()
    expect(screen.getByText('Test Comment')).toBeInTheDocument()

    // Should not show add button or form
    expect(screen.queryByText('Add Milestone')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText('Stage')).not.toBeInTheDocument()
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

  it('should hide add button when form is visible', () => {
    render(
      <ProjectMilestones 
        milestones={mockMilestones} 
        editable={true} 
        onChange={mockOnChange} 
      />
    )

    // Initially show add button
    expect(screen.getByText('Add Milestone')).toBeInTheDocument()

    // Click add button
    const addButton = screen.getByText('Add Milestone')
    fireEvent.click(addButton)

    // Add button should be hidden
    expect(screen.queryByText('Add Milestone')).not.toBeInTheDocument()

    // Form should be visible
    expect(screen.getByPlaceholderText('Stage')).toBeInTheDocument()
  })
}) 