# Travel Stories — Cinematic Travel Storytelling Platform

A production-ready emotional travel storytelling platform built with Next.js 14, TypeScript, TailwindCSS, Prisma, PostgreSQL, and Mapbox GL JS.

---

## Project Structure

```
travel-stories/
├── prisma/
│   ├── schema.prisma          # Database models
│   └── seed.ts                # Sample data seeder
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (dark mode)
│   │   ├── page.tsx            # Home / landing page
│   │   ├── globals.css         # Global styles + Tailwind
│   │   ├── api/
│   │   │   ├── stories/
│   │   │   │   ├── route.ts           # GET /api/stories
│   │   │   │   └── [slug]/route.ts    # GET /api/stories/[slug]
│   │   │   └── admin/
│   │   │       ├── login/route.ts     # POST/DELETE /api/admin/login
│   │   │       └── stories/
│   │   │           ├── route.ts       # POST /api/admin/stories
│   │   │           └── [id]/route.ts  # PUT, DELETE /api/admin/stories/[id]
│   │   ├── stories/
│   │   │   ├── page.tsx        # /stories — public story grid
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # /stories/[slug] — full story detail
│   │   ├── map/
│   │   │   └── page.tsx        # /map — full-screen world map
│   │   └── admin/
│   │       ├── layout.tsx      # Admin navigation shell
│   │       ├── page.tsx        # /admin — dashboard
│   │       ├── login/
│   │       │   └── page.tsx    # /admin/login — password form
│   │       ├── new/
│   │       │   └── page.tsx    # /admin/new — create story
│   │       └── edit/
│   │           └── [id]/
│   │               └── page.tsx  # /admin/edit/[id] — edit story
│   ├── components/
│   │   ├── NavBar.tsx           # Public navigation
│   │   ├── StoryCard.tsx        # Story grid card
│   │   ├── StoryContent.tsx     # Markdown renderer
│   │   ├── QuestionHighlight.tsx # Emotional question block
│   │   ├── SongPlayer.tsx       # Spotify/YouTube embed
│   │   ├── MoodTimeline.tsx     # Mood progression timeline
│   │   ├── MapView.tsx          # Single story map
│   │   ├── WorldMap.tsx         # All stories world map
│   │   └── admin/
│   │       ├── AdminStoryForm.tsx  # Create/Edit form
│   │       ├── AdminStoryList.tsx  # Dashboard story table
│   │       └── AdminLogout.tsx     # Logout button
│   ├── lib/
│   │   └── prisma.ts           # Prisma singleton
│   ├── middleware.ts            # Admin route protection
│   └── types/
│       └── index.ts             # TypeScript types
├── .env.example
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Database Schema

```prisma
model Story {
  id           String       @id @default(cuid())
  title        String
  slug         String       @unique
  city         String
  country      String
  coverImage   String
  content      String       @db.Text
  questionAsked String
  songName     String
  songEmbedUrl String
  latitude     Float
  longitude    Float
  totalCost    Float
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  moodEntries  MoodEntry[]
  expenses     Expense[]
}

model MoodEntry {
  id      String  @id @default(cuid())
  day     Int
  mood    String
  note    String?
  storyId String
  story   Story   @relation(fields: [storyId], references: [id], onDelete: Cascade)
}

model Expense {
  id      String @id @default(cuid())
  title   String
  amount  Float
  storyId String
  story   Story  @relation(fields: [storyId], references: [id], onDelete: Cascade)
}
```

Cascade deletes ensure that when a Story is deleted, all its MoodEntries and Expenses are automatically removed.

---

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local or cloud)
- A Mapbox account (free tier works)

### 2. Clone and Install

```bash
# Copy this project directory
cd travel-stories

# Install dependencies
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/travel_stories"

# Admin password (choose something secure)
ADMIN_SECRET="your-secret-admin-password"

# Mapbox public token (from https://account.mapbox.com/)
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6InlvdXJ0b2tlbiJ9.xxxxxxxx"
```

### 4. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb travel_stories

# Or via psql:
psql -U postgres -c "CREATE DATABASE travel_stories;"
```

**Option B: Docker**
```bash
docker run --name travel-pg \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=travel_stories \
  -p 5432:5432 \
  -d postgres:16
```

**Option C: Cloud (Supabase, Neon, Railway)**
- Create a new project on your cloud provider
- Copy the connection string to `DATABASE_URL` in `.env`

### 5. Initialize Database

```bash
# Push the schema to the database
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 6. Seed Sample Data

```bash
npm run db:seed
```

This creates two stories:
- **Lost in Lisbon** (Portugal) — with 5 mood entries and 6 expenses
- **Tokyo After Midnight** (Japan) — with 5 mood entries and 5 expenses

### 7. Run Development Server

```bash
npm run dev
```

Visit:
- **Public site**: http://localhost:3000
- **Stories grid**: http://localhost:3000/stories
- **World map**: http://localhost:3000/map
- **Admin login**: http://localhost:3000/admin/login

Login with the password you set in `ADMIN_SECRET`.

---

## Mapbox Setup

1. Sign up at https://account.mapbox.com/
2. Go to **Tokens** → create a new token (or use the default public token)
3. Copy the token and set it as `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env`

The token starts with `pk.eyJ1...`

> **Without Mapbox token**: The app works fully, but the map sections show placeholder UI instead of actual maps.

---

## Admin Access

The admin dashboard is protected by middleware at `src/middleware.ts`.

- Navigate to `/admin/login`
- Enter the password from `ADMIN_SECRET` in your `.env`
- A secure cookie is set for 7 days

**Admin capabilities:**
- View all stories in a dashboard table
- Create new stories with the full form
- Edit existing stories (all fields including mood timeline and expenses)
- Delete stories (with confirmation dialog — cascades to mood entries and expenses)

---

## API Routes

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | List all stories |
| GET | `/api/stories/[slug]` | Single story by slug |

### Admin (require `Authorization: Bearer <ADMIN_SECRET>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/stories` | Create a new story |
| PUT | `/api/admin/stories/[id]` | Update a story |
| DELETE | `/api/admin/stories/[id]` | Delete a story |
| POST | `/api/admin/login` | Set admin session cookie |
| DELETE | `/api/admin/login` | Clear admin session cookie |

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard or:
vercel env add DATABASE_URL
vercel env add ADMIN_SECRET
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN
```

After setting env vars, redeploy:
```bash
vercel --prod
```

### Deploy to Railway / Render

1. Connect your GitHub repo
2. Add environment variables in the dashboard
3. Add a PostgreSQL database service
4. Set `DATABASE_URL` to the provided connection string
5. Add build command: `npm run db:push && npm run build`

### Deploy with Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t travel-stories .
docker run -p 3000:3000 \
  -e DATABASE_URL="your-db-url" \
  -e ADMIN_SECRET="your-secret" \
  -e NEXT_PUBLIC_MAPBOX_TOKEN="your-token" \
  travel-stories
```

---

## Prisma Database Management

```bash
# View database in browser UI
npm run db:studio

# Reset and re-seed
npx prisma migrate reset
npm run db:seed

# Create a migration (production)
npx prisma migrate dev --name init
```

---

## Key Design Decisions

1. **Dark mode default** — All UI is dark-themed using `bg-ink-*` custom colors for cinematic feel

2. **Server Components by default** — Story list, story detail, admin dashboard are all Server Components fetching directly from Prisma — no unnecessary client-side fetching

3. **Prisma singleton** — Prevents connection pooling issues in development with Next.js hot reload

4. **Cookie-based admin auth** — Simple but effective: password stored as httpOnly cookie, validated by middleware

5. **Cascade deletes** — Prisma schema uses `onDelete: Cascade` so story deletion cleans up all related records automatically

6. **Markdown content** — Story body is stored as Markdown and rendered with `react-markdown` + `remark-gfm` for rich formatting

7. **Mapbox fallback** — Both map components gracefully degrade when no Mapbox token is configured

8. **Static params** — `generateStaticParams` pre-generates all story slugs at build time for performance

---

## Customization

### Adding a new mood color
Edit `src/components/MoodTimeline.tsx`:
```typescript
const moodColors: Record<string, string> = {
  YourMood: 'bg-emerald-500',
  // ...
}
```

### Changing the map style
Edit the `style` property in `MapView.tsx` or `WorldMap.tsx`:
- `mapbox://styles/mapbox/dark-v11` (current)
- `mapbox://styles/mapbox/satellite-streets-v12`
- `mapbox://styles/mapbox/light-v11`

### Adding authentication (upgrade from simple password)
Replace the `ADMIN_SECRET` cookie approach with NextAuth.js:
```bash
npm install next-auth
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS |
| Database ORM | Prisma |
| Database | PostgreSQL |
| Maps | Mapbox GL JS |
| Markdown | react-markdown + remark-gfm |
| Auth | Custom middleware + cookie |
