# Plan on a Page

A modern project management dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Project tracking and management
- Cost tracking and reporting
- Image upload and management
- Responsive design
- Real-time updates

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Required environment variables:
- `POSTGRES_URL`: Your PostgreSQL database URL
- `KV_URL`: Vercel KV URL
- `KV_REST_API_URL`: Vercel KV REST API URL
- `KV_REST_API_TOKEN`: Vercel KV REST API token
- `KV_REST_API_READ_ONLY_TOKEN`: Vercel KV REST API read-only token

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL
- Vercel KV
- Vercel Blob Storage

## License

MIT
