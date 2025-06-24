export interface GalleryFilterOptions {
  /**
   * The set of plants the recipient is interested in.
   * Only the first item will be used as the `plant` query param, because the
   * current gallery page only supports a single plant value.
   */
  plants?: string[] | null
  /**
   * List of disciplines to filter by. Will be serialised as a comma-separated
   * list in the `disciplines` query param.
   */
  disciplines?: string[] | null
}

/**
 * Builds an absolute URL pointing at the public gallery page with the supplied
 * plant / discipline filters serialised into the query string.
 *
 * Examples:
 *  buildFilteredGalleryURL({ plants: ["Granulation"], disciplines: ["HSE"] })
 *   → https://example.com?plant=Granulation&disciplines=HSE
 */
export function buildFilteredGalleryURL({ plants, disciplines }: GalleryFilterOptions): string {
  // Determine the public base URL of the application.
  // 1. Prefer explicitly configured NEXT_PUBLIC_APP_URL
  // 2. Fall back to VERCEL_URL when running on Vercel
  // 3. Otherwise assume localhost for dev/test
  let base = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || "http://localhost:3000"

  // The VERCEL_URL value does not include a protocol, so we need to add one.
  if (!/^https?:\/\//.test(base)) {
    base = `https://${base}`
  }

  const url = new URL(base)
  // Gallery lives on the root path – if this ever changes simply update here.
  url.pathname = "/"

  // Only the first plant is used (current UI only supports a single plant at a time)
  if (plants && plants.length > 0) {
    url.searchParams.set("plant", plants[0])
  }

  if (disciplines && disciplines.length > 0) {
    url.searchParams.set("disciplines", disciplines.join(","))
  }

  return url.toString()
} 