# RTR Dynamic Interviewer

An AI-powered tool that captures your client's unique writing voice through a dynamic interview process, generating actionable style profiles for content syndication.

## Features

- **Magic Link Authentication** - Passwordless login for both admins and clients
- **Admin Dashboard** - Manage clients, add brand knowledge, view completed profiles
- **Brand Knowledge Files** - Add markdown context documents per client to inform the AI
- **Dynamic Interview Flow** - AI-generated follow-up questions based on initial responses
- **Style Profile Generation** - Comprehensive voice guides with platform-specific rules

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **AI**: OpenAI GPT-4o

## Prerequisites

- Node.js 20.19+ or 22.12+
- A Supabase account
- An OpenAI API key

## Setup Instructions

### 1. Clone & Install

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these values in your Supabase project:
- Settings > API > Project URL
- Settings > API > Project API keys > `anon` `public`

### 4. Run Database Migrations

In Supabase SQL Editor, run the contents of:
```
supabase/migrations/20241212000000_initial_schema.sql
```

This creates:
- `user_roles` - Admin vs client roles
- `admin_invites` - Admin team invites
- `clients` - Client profiles created by admins
- `brand_knowledge` - Markdown context files per client
- `interview_sessions` - Interview progress and answers
- `style_profiles` - Generated voice profiles

### 5. Configure Supabase Auth

1. Go to Authentication > URL Configuration
2. Set Site URL to: `http://localhost:5173` (or your production URL)
3. Add `http://localhost:5173/auth/callback` to Redirect URLs

### 6. Deploy Edge Functions

Install Supabase CLI:
```bash
npm install -g supabase
```

Login and link your project:
```bash
supabase login
supabase link --project-ref your-project-ref
```

Set your OpenAI API key as a secret:
```bash
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

Deploy the functions:
```bash
supabase functions deploy generate-followups
supabase functions deploy synthesize-profile
```

### 7. Create First Admin User

Since the first admin can't invite themselves, manually insert an admin invite:

```sql
INSERT INTO admin_invites (email) VALUES ('your-email@example.com');
```

Then login with that email using the magic link flow.

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Admin/           # Admin dashboard components
│   │   ├── Auth/            # Authentication components
│   │   ├── Interview/       # Interview flow components
│   │   └── ui/              # Shared UI components
│   ├── hooks/
│   │   ├── useAuth.ts       # Authentication hook
│   │   └── useInterview.ts  # Interview state management
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   └── types.ts         # TypeScript types
│   └── pages/
│       ├── Admin.tsx        # Admin dashboard
│       ├── Interview.tsx    # Client interview
│       └── Login.tsx        # Authentication
├── supabase/
│   ├── functions/
│   │   ├── generate-followups/   # AI follow-up question generation
│   │   └── synthesize-profile/   # AI profile synthesis
│   └── migrations/
│       └── 20241212000000_initial_schema.sql
└── ...
```

## User Flows

### Admin Flow
1. Login with magic link
2. Create client profile with name, email, company
3. Add brand knowledge markdown documents
4. Send invite to client
5. View completed style profiles

### Client Flow
1. Receive invite email, click magic link
2. Answer 5 base questions about their voice
3. AI analyzes and generates 3 follow-up questions
4. Answer follow-up questions
5. Receive comprehensive style profile
6. Copy/download profile for use in content creation

## OpenAI API Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new secret key
5. Add billing/credits (GPT-4o: ~$5/1M input, ~$15/1M output tokens)

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy dist/ to Vercel
```

Set environment variables in Vercel dashboard.

### Other Platforms
Build the static files:
```bash
npm run build
```

Deploy the `dist/` folder to any static hosting service.

## License

MIT
