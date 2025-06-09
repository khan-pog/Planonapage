import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectCostForm } from './project-cost-form'
import type { CostTracking } from '@/lib/types'

describe('ProjectCostForm', () => {
  const mockCostTracking: CostTracking = {
    totalBudget: 1000000,
    currency: 'AUD',
    monthlyData: [
      {
        month: 'Jan 2024',
        budgetedCost: 100000,
        actualCost: 95000,
        cumulativeBudget: 100000,
        cumulativeActual: 95000,
        variance: -5000
      }
    ],
    costStatus: 'On Track',
    variance: -0.5,
    forecastCompletion: 950000
  }

  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not trigger parent form submission when adding a month', () => {
    const parentFormSubmit = jest.fn()
    
    render(
      <form onSubmit={parentFormSubmit}>
        <ProjectCostForm 
          costTracking={mockCostTracking} 
          onChange={mockOnChange} 
          editable={true} 
        />
      </form>
    )

    // Click add month button
    const addButton = screen.getByText('Add Month')
    fireEvent.click(addButton)

    // Verify parent form was not submitted
    expect(parentFormSubmit).not.toHaveBeenCalled()
    
    // Verify new month was added
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockCostTracking,
      monthlyData: [
        ...mockCostTracking.monthlyData,
        {
          month: '',
          budgetedCost: 0,
          actualCost: 0,
          cumulativeBudget: 0,
          cumulativeActual: 0,
          variance: 0
        }
      ]
    })
  })

  it('should not trigger parent form submission when removing a month', () => {
    const parentFormSubmit = jest.fn()
    
    render(
      <form onSubmit={parentFormSubmit}>
        <ProjectCostForm 
          costTracking={mockCostTracking} 
          onChange={mockOnChange} 
          editable={true} 
        />
      </form>
    )

    // Click remove month button
    const removeButton = screen.getByRole('button', { name: /remove/i })
    fireEvent.click(removeButton)

    // Verify parent form was not submitted
    expect(parentFormSubmit).not.toHaveBeenCalled()
    
    // Verify month was removed
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockCostTracking,
      monthlyData: []
    })
  })

  it('should update cost tracking when input values change', () => {
    render(
      <ProjectCostForm 
        costTracking={mockCostTracking} 
        onChange={mockOnChange} 
        editable={true} 
      />
    )

    // Change total budget
    const budgetInput = screen.getByLabelText(/total budget/i)
    fireEvent.change(budgetInput, { target: { value: '2000000' } })

    // Verify cost tracking was updated
    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockCostTracking,
      totalBudget: 2000000
    })
  })
}) 