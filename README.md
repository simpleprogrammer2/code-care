# CodeReview Marketplace

A peer-to-peer code review platform where developers submit code for review and optionally tip reviewers with a pay-what-you-want model.

## Features

- **Submit Code for Review** — Paste code, link a repo, or upload files (max 5 MB) with language tags and descriptions
- **Browse Open Reviews** — Discover and pick up reviews from the community
- **Live IDE Sandbox** — Embedded StackBlitz editor opens when a review is picked up, supporting multiple languages
- **Feedback & Ratings** — Reviewers submit star ratings and detailed feedback on completed reviews
- **Real-time Notifications** — Requesters receive in-app notifications when their review is completed
- **Pay-What-You-Want Tips** — Optionally reward reviewers via integrated payments
- **User Profiles** — Track ratings, completed reviews, and skills
- **Authentication** — Email-based signup and login

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Lovable Cloud (PostgreSQL, Auth, Edge Functions, Storage)
- **State Management:** TanStack React Query
- **Routing:** React Router v6
- **Embedded IDE:** StackBlitz SDK

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
├── components/       # Reusable UI components (Navbar, ReviewCard, NotificationBell, etc.)
├── hooks/            # Custom React hooks (auth, reviews, profiles, notifications)
├── integrations/     # Backend client & types
├── pages/            # Route-level page components
│   ├── Index.tsx     # Landing page
│   ├── Auth.tsx      # Login / Signup
│   ├── SubmitReview.tsx  # Submit code for review (paste / link / upload)
│   ├── BrowseReviews.tsx # Browse & filter open reviews
│   └── ReviewDetail.tsx  # Review detail with IDE sandbox & feedback
└── lib/              # Utilities
```

## Incomplete Tasks & Future Improvements

### High Priority
- [ ] **Email notifications** — Send email alerts (in addition to in-app) when a review is completed
- [ ] **Stripe payment integration** — Wire up the payments table to actual Stripe checkout for tips
- [ ] **File upload preview on review detail** — Show uploaded file name and download link on review cards and the detail page
- [ ] **Refactor ReviewDetail.tsx** — Break into smaller components (SandboxEmbed, FeedbackForm, ReviewHeader)

### Medium Priority
- [ ] **User dashboard** — Show submitted reviews, picked-up reviews, and review history per user
- [ ] **Profile editing** — Allow users to update display name, bio, avatar, and skills
- [ ] **Notify on review pick-up** — Alert the requester when someone starts reviewing their code
- [ ] **Real-time review status updates** — Use realtime subscriptions to update browse/detail pages live
- [ ] **Drag-and-drop file upload** — Enhance the file upload tab with drag-and-drop support

### Low Priority
- [ ] **Search & advanced filters** — Full-text search on review titles/descriptions, filter by language, date range
- [ ] **Dark/light theme toggle** — Expose the theme switcher in the navbar
- [ ] **Pagination** — Paginate the browse page beyond the default 1000-row Supabase limit
- [ ] **Code syntax highlighting** — Use a proper highlighter (e.g. Shiki) for the code preview on open reviews
- [ ] **Admin moderation panel** — Allow admins to moderate reviews, cancel spam, manage users
- [ ] **Rate limiting** — Prevent abuse on review submission and feedback endpoints
- [ ] **SEO & meta tags** — Add per-page titles, descriptions, and Open Graph tags

## License

MIT
