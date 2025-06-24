export interface HasPlantDisciplines {
  plant?: string | null;
  disciplines?: string[];
}

/**
 * Determine whether a project satisfies the supplied plant / discipline filters.
 * A project matches when:
 * 1. No filters are provided → always matches.
 * 2. `plant` is supplied and equals project.plant.
 * 3. `disciplines` array is supplied and there is any overlap with project.disciplines.
 * If both `plant` and `disciplines` are supplied, a project matches when EITHER (2) OR (3) is true.
 */
export function matchesPlantAndDiscipline<T extends HasPlantDisciplines>(
  project: T,
  plant?: string | null,
  disciplines?: (string | null)[] | null
): boolean {
  // No filters provided – match everything
  if (!plant && (!disciplines || disciplines.length === 0)) {
    return true;
  }

  const plantMatches = plant ? project.plant === plant : false;

  let disciplineMatches = false;
  if (disciplines && disciplines.length > 0 && Array.isArray(project.disciplines)) {
    disciplineMatches = project.disciplines.some((d) => disciplines.includes(d));
  }

  return plantMatches || disciplineMatches;
} 