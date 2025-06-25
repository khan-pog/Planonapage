# Plan on a Page

A modern project management dashboard built with Next.js, TypeScript, and Tailwind CSS

## Features

- Project tracking and management
- Cost tracking and reporting
- Image upload and management
- Automated email reports & PM reminders (monthly), powered by Vercel Cron
- Calendar preview of upcoming reports/reminders in the admin dashboard
- Infinite-scroll project gallery with progressive rendering
- Skeleton loading states for a smoother UX
- Responsive design & mobile-first layout
- Real-time updates

### Automated Reports

The route `/api/reports/send` is executed automatically every day at **08:00 AEST** by Vercel Cron, as configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/reports/send",
      "schedule": "0 8 * * *" // daily at 08:00 UTC (adjust in Vercel dashboard if needed)
    }
  ]
}
```

When the script detects that today is the configured send day, it compiles the report and emails all recipients. During the lead-up window it instead triggers PM reminders based on your settings (configured in the admin dashboard).

### Calendar Preview

The **Admin → Email & Schedule** tab now includes an interactive calendar that highlights:

•  🟢  Report send day  
•  🟡  Weekly PM reminder days & the final reminder day

This gives administrators at-a-glance visibility of the upcoming schedule.

### Infinite Scrolling

The project gallery no longer renders every project at once. Instead it shows the first batch and loads subsequent batches automatically as the user scrolls, following common industry practice for large lists.

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
- `EMAIL_API_KEY`: Your email service API key (for sending reports)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- PostgreSQL
- Vercel KV
- Vercel Blob Storage
- Email Service (Resend/SendGrid)

## License

MIT
