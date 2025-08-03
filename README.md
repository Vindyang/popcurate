# 🍿 Popcurate

**Curated popcorn-ready picks, daily**

A modern, full-stack movie recommendation web application built with Next.js 15 that helps users discover, track, and curate movie watchlists with personalized recommendations and community-driven curation.

## ✨ Features

### Core Functionality

- 🔍 **Movie Search & Discovery** - Powered by TMDb API
- 🎯 **Personalized Recommendations** - AI-powered suggestion engine
- 📝 **Custom Watchlists** - Create and manage movie lists
- ⭐ **User Ratings & Reviews** - Community-driven feedback
- 👥 **Social Features** - Follow users and share recommendations

### Advanced Features

- 🧠 **Mood-Based Recommendations** - AI-powered suggestions using pgvector
- 🎬 **Trailer Streaming** - Secure video playback
- 📱 **PWA Support** - Mobile-first responsive design
- 🌙 **Dark/Light Mode** - Theme switching
- 🔄 **Real-time Updates** - Live notifications and chat

## 🛠 Tech Stack

### Frontend

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **shadcn/ui** components (Radix + Tailwind)
- **Heroicons/Lucide** for icons

### Backend & Database

- **Supabase** (PostgreSQL + Auth + Realtime)
- **Row Level Security** for data protection
- **Supabase Auth** with OAuth providers

### State Management & Data Fetching

- **TanStack Query v5** for client-side caching
- **React Server Components** for optimal performance
- **Server Actions** for mutations

### APIs & External Services

- **TMDb API** - Movie metadata, cast, crew, ratings
- **Internet Archive API** - Public domain movie streaming
- **Streaming Availability API** - Legal streaming sources

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Supabase account
- TMDb API key

### Installation

1. **Clone and install dependencies:**

```bash
git clone <your-repo-url>
cd popcurate
bun install
```

2. **Set up environment variables:**

```bash
cp .env.example .env.local
```

Fill in your actual values in `.env.local`:

- Get Supabase credentials from [Supabase Dashboard](https://supabase.com/dashboard)
- Get TMDb API key from [TMDb API Settings](https://www.themoviedb.org/settings/api)
- Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

3. **Set up Supabase:**

```bash
# Install Supabase CLI
bun add -g @supabase/cli

# Initialize Supabase
supabase init

# Start local development
supabase start
```

4. **Run the development server:**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
popcurate/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── movies/            # Movie-related pages
│   ├── watchlist/         # Watchlist management
│   ├── profile/           # User profiles
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── movie/            # Movie-specific components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client and utilities
│   ├── tmdb/             # TMDb API integration
│   └── utils/            # General utilities
├── types/                # TypeScript type definitions
└── supabase/             # Database schema and migrations
```

## 🔧 Development

### Available Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
bun type-check   # Run TypeScript compiler
```

### Code Quality

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## 🗄 Database Schema

### Key Tables

- `users` - User profiles and preferences
- `movies` - TMDb data cache with enhancements
- `watchlists` - User-created movie lists
- `reviews` - User ratings and reviews
- `recommendations` - AI-generated suggestions
- `follows` - Social following relationships

### Security

- Row Level Security (RLS) policies
- User data isolation
- Secure API routes with middleware

## 🔐 Authentication

- **Supabase Auth** with social providers
- **Cookie-based sessions** for SSR
- **Anonymous sessions** with upgrade paths
- **OAuth providers**: GitHub, Google

## 📊 API Integration

### TMDb API

- **Attribution**: "This product uses the TMDb API but is not endorsed or certified by TMDb"
- **Rate limiting**: Implemented caching strategies
- **Data points**: Movies, cast, crew, images, trailers

### Legal Compliance

- ✅ Only metadata from TMDb (no pirated content)
- ✅ Public domain movies from Internet Archive
- ✅ Links to legal streaming services
- ✅ Proper content moderation

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel deploy

# Set environment variables in Vercel Dashboard
# Connect Supabase production instance
```

### Environment Setup

- **Production Supabase** instance
- **TMDb API** production keys
- **Vercel Analytics** for monitoring
- **Sentry** for error tracking

## 🎯 Roadmap

### Phase 1 ✅

- [x] Next.js 15 setup with App Router
- [x] Supabase integration
- [x] TMDb API integration
- [x] Basic UI components
- [x] Authentication system

### Phase 2 🚧

- [ ] Movie search and discovery
- [ ] Watchlist management
- [ ] User profiles and reviews
- [ ] Recommendation engine
- [ ] Social features

### Phase 3 📋

- [ ] AI-powered recommendations
- [ ] Real-time chat
- [ ] PWA features
- [ ] Mobile app companion
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDb** for movie data API
- **Supabase** for backend infrastructure
- **Vercel** for hosting platform
- **shadcn/ui** for component library

---

**Popcurate** - Making movie discovery delightful, one recommendation at a time! 🍿✨
