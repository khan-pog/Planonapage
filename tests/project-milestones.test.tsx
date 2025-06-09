import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProjectMilestones } from '@/components/project-milestones'
import type { ProjectMilestone } from '@/lib/types'

describe('ProjectMilestones', () => {
  const mockMilestones: ProjectMilestone[] = [
    { stage: 'Design Phase', date: '2024-02-15', comment: 'Initial design complete' },
    { stage: 'Construction', date: '2024-06-01', comment: 'Construction begins' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders milestones in read-only mode', () => {
    render(
      <ProjectMilestones 
        milestones={mockMilestones} 
        editable={false} 
      />
    )

    expect(screen.getByText('Major Milestones')).toBeInTheDocument()
    expect(screen.getByText('Design Phase')).toBeInTheDocument()
    expect(screen.getByText('Construction')).toBeInTheDocument()
    expect(screen.getByText('2024-02-15')).toBeInTheDocument()
    expect(screen.getByText('2024-06-01')).toBeInTheDocument()
    expect(screen.queryByText('Add Milestone')).not.toBeInTheDocument()
  })

  it('renders empty state when no milestones exist', () => {
    render(
      <ProjectMilestones 
        milestones={[]} 
        editable={true} 
      />
    )

    expect(screen.getByText('No milestones have been added yet.')).toBeInTheDocument()
    expect(screen.getByText('Add Milestone')).toBeInTheDocument()
  })

  it('shows add milestone form when Add Milestone button is clicked', () => {
    render(
      <ProjectMilestones 
        milestones={[]} 
        editable={true} 
        onChange={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Add Milestone'))

    expect(screen.getByPlaceholderText('Stage')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Date')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Comment')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('saves a new milestone when save button is clicked', async () => {
    const mockOnChange = vi.fn()
    render(
      <ProjectMilestones 
        milestones={mockMilestones} 
        editable={true} 
        onChange={mockOnChange}
      />
    )

    // Open the form
    fireEvent.click(screen.getByText('Add Milestone'))

    // Fill in the form
    const stageInput = screen.getByPlaceholderText('Stage')
    const dateInput = screen.getByPlaceholderText('Date')
    const commentInput = screen.getByPlaceholderText('Comment')

    fireEvent.change(stageInput, { target: { value: 'Testing Phase' } })
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } })
    fireEvent.change(commentInput, { target: { value: 'Testing begins' } })

    // Click save
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith([
        ...mockMilestones,
        { stage: 'Testing Phase', date: '2024-03-15', comment: 'Testing begins' }
      ])
    })

    // Form should be hidden after save
    expect(screen.queryByPlaceholderText('Stage')).not.toBeInTheDocument()
  })

  it('disables save button when required fields are empty', () => {
    render(
      <ProjectMilestones 
        milestones={[]} 
        editable={true} 
        onChange={vi.fn()}
      />
    )

    fireEvent.click(screen.getByText('Add Milestone'))

    const saveButton = screen.getByRole('button', { name: /save/i })
    expect(saveButton).toBeDisabled()

    // Fill only stage
    const stageInput = screen.getByPlaceholderText('Stage')
    fireEvent.change(stageInput, { target: { value: 'Test Stage' } })
    expect(saveButton).toBeDisabled()

    // Fill both stage and date
    const dateInput = screen.getByPlaceholderText('Date')
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } })
    expect(saveButton).not.toBeDisabled()
  })

  it('does not submit parent form when save button is clicked', () => {
    const mockParentSubmit = vi.fn()
    const mockOnChange = vi.fn()

    const { container } = render(
      <form onSubmit={mockParentSubmit}>
        <ProjectMilestones 
          milestones={[]} 
          editable={true} 
          onChange={mockOnChange}
        />
        <button type="submit">Submit Parent Form</button>
      </form>
    )

    // Open the milestone form
    fireEvent.click(screen.getByText('Add Milestone'))

    // Fill required fields
    const stageInput = screen.getByPlaceholderText('Stage')
    const dateInput = screen.getByPlaceholderText('Date')

    fireEvent.change(stageInput, { target: { value: 'Test Stage' } })
    fireEvent.change(dateInput, { target: { value: '2024-03-15' } })

    // Click save button in milestone form
    fireEvent.click(screen.getByRole('button', { name: /save/i }))

    // Parent form should NOT have been submitted
    expect(mockParentSubmit).not.toHaveBeenCalled()
    // But the milestone onChange should have been called
    expect(mockOnChange).toHaveBeenCalled()
  })
})