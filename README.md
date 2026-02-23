# SkillPilot

**Live at [skillpilotapp.vercel.app](https://skillpilotapp.vercel.app/welcome)**

SkillPilot turns a skill you want to learn into a week by week plan you can actually follow. You give it the skill, a rough timeline, and how many hours a week you realistically have. It returns a set of weekly milestones, each with reading, exercises and an hour estimate, and tracks what you have finished.

The idea came from a simple problem: most roadmaps you find online assume you have unlimited evenings. This one starts from your schedule instead.

---

## Features

- **Roadmaps sized to your week.** Hours per week is an input, not an afterthought, so a five hour week and a twenty hour week give you different plans.
- **Weekly milestones.** Each week has its own resources, exercises and time estimate.
- **Editable after generation.** Change your hours and the remaining weeks regenerate. Completed milestones are left alone.
- **Progress tracking.** Milestone completion rolls up into a percentage per path and across your dashboard.
- **Public explore page.** Browse roadmaps other people have created.
- **Works on mobile.**

## Tech stack

| | |
|---|---|
| Language | TypeScript |
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Clerk |
| Generation | Google Gemini 2.5 Flash-Lite |
| Hosting | Vercel |

## Running it locally

```bash
npm install
npm run dev
```

You will need a `.env.local` with Clerk, Supabase and Gemini keys. Without them the app builds but cannot render authenticated pages.

## Planned

- Sort the explore page by most saved
- Clone someone else's roadmap into your own dashboard
- Export a roadmap to Google Calendar

---

### Screenshots

Screenshots are being retaken after the interface refresh. Coming back shortly.
