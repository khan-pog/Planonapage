import { describe, it, expect } from 'vitest'
import { matchesPlantAndDiscipline } from '@/lib/filter-utils'

describe('matchesPlantAndDiscipline', () => {
  const project = {
    plant: 'Granulation',
    disciplines: ['HSE', 'Static', 'EIC']
  }

  it('returns true when no filters provided', () => {
    expect(matchesPlantAndDiscipline(project, null, null)).toBe(true)
  })

  it('matches by plant only', () => {
    expect(matchesPlantAndDiscipline(project, 'Granulation', null)).toBe(true)
    expect(matchesPlantAndDiscipline(project, 'Ammonia & Laboratory', null)).toBe(false)
  })

  it('matches by discipline only', () => {
    expect(matchesPlantAndDiscipline(project, null, ['HSE'])).toBe(true)
    expect(matchesPlantAndDiscipline(project, null, ['Rotating'])).toBe(false)
  })

  it('matches when either plant or disciplines match if both provided', () => {
    // Plant mismatch but discipline matches
    expect(matchesPlantAndDiscipline(project, 'Camp', ['HSE'])).toBe(true)

    // Plant matches but disciplines mismatch
    expect(matchesPlantAndDiscipline(project, 'Granulation', ['Rotating'])).toBe(true)

    // Neither matches
    expect(matchesPlantAndDiscipline(project, 'Camp', ['Rotating'])).toBe(false)

    // Both match
    expect(matchesPlantAndDiscipline(project, 'Granulation', ['Static'])).toBe(true)
  })
}) 