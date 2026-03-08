# CodeReview Marketplace

A peer-to-peer code review platform where developers submit code for review and optionally tip reviewers with a pay-what-you-want model.

## Features

- **Submit Code for Review** — Post code snippets with language tags and descriptions
- **Browse Open Reviews** — Discover and pick up reviews from the community
- **Pay-What-You-Want Tips** — Optionally reward reviewers via integrated payments
- **User Profiles** — Track ratings, completed reviews, and skills
- **Authentication** — Email-based signup and login

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Lovable Cloud (PostgreSQL, Auth, Edge Functions, Storage)
- **State Management:** TanStack React Query
- **Routing:** React Router v6

## Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks (auth, reviews, profiles)
├── integrations/  # Backend client & types
├── pages/         # Route-level page components
└── lib/           # Utilities
```

## License

MIT
