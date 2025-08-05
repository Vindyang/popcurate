# 🍿 Popcurate

**Curated popcorn-ready picks, daily**

A modern movie discovery web application built with Next.js 15 that helps users discover and explore movies using The Movie Database (TMDb) API. Find trending movies, browse by genre, search for specific titles, and get detailed movie information including trailers and watch providers.

## ✨ Features

### Current Features

- 🔍 **Movie Search & Discovery** - Powered by TMDb API
- � **Movie Categories** - Browse trending, popular, top-rated, now playing, and upcoming movies
- 🏷️ **Genre Filtering** - Discover movies by genre
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🌙 **Dark/Light Mode** - Theme switching with next-themes
- 🎥 **Movie Details** - Comprehensive movie information with trailers
- 🔗 **Watch Providers** - Find where to watch movies legally
- 📺 **Movie Videos** - Trailers and clips integration

### Coming Soon

- 📝 **Custom Watchlists** - Create and manage movie lists
- ⭐ **User Ratings & Reviews** - Community-driven feedback
- 🎯 **Personalized Recommendations** - AI-powered suggestions
- 👥 **Social Features** - Follow users and share recommendations

## 🛠 Tech Stack

### Frontend

- **Next.js 15** with App Router and React 19
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Radix UI** components for accessible UI primitives
- **Heroicons & Lucide React** for icons
- **next-themes** for dark/light mode

### Backend & Database

- **Supabase** (PostgreSQL + Auth + Realtime) - _Coming Soon_
- **TMDb API** for movie data
- **Next.js API Routes** for backend functionality

### Development Tools

- **Bun** as runtime and package manager
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **TypeScript** for type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
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

Fill in your TMDb API credentials in `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_ACCESS_TOKEN=your_tmdb_read_access_token_here
```

Get your TMDb API key from [TMDb API Settings](https://www.themoviedb.org/settings/api)

3. **Run the development server:**

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
popcurate/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── movies/        # Movie-related API endpoints
│   │   └── debug/         # Debug endpoints
│   ├── genre/[id]/        # Genre-specific movie pages
│   ├── movie/[slug]/      # Individual movie detail pages
│   ├── now-playing/       # Now playing movies page
│   ├── popular/           # Popular movies page
│   ├── search/            # Search functionality
│   ├── top-rated/         # Top rated movies page
│   ├── trending/          # Trending movies page
│   ├── upcoming/          # Upcoming movies page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Dialog, etc.)
│   ├── movie/            # Movie-specific components
│   ├── layout/           # Layout components (Header, Footer)
│   └── theme-provider.tsx # Theme context provider
├── lib/                  # Utility functions and configurations
│   ├── tmdb/             # TMDb API integration
│   ├── supabase/         # Supabase client setup
│   ├── hooks/            # Custom React hooks
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
│   ├── tmdb.ts           # TMDb API types
│   ├── app.ts            # App-specific types
│   └── supabase.ts       # Supabase types
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔧 Development

### Available Scripts

```bash
bun dev          # Start development server with Turbopack
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint
bun lint:fix     # Run ESLint with auto-fix
bun type-check   # Run TypeScript compiler
bun format       # Format code with Prettier
bun format:check # Check code formatting
```

### Code Quality

- **ESLint** for code linting with Next.js config
- **Prettier** with Tailwind CSS plugin for code formatting
- **TypeScript** for type checking
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

## 🎬 API Endpoints

### Movie Routes

- `GET /api/movies/trending` - Get trending movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/top-rated` - Get top-rated movies
- `GET /api/movies/now-playing` - Get now playing movies
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/search` - Search movies
- `GET /api/movies/genres` - Get movie genres
- `GET /api/movies/discover` - Discover movies with filters
- `GET /api/movies/[id]` - Get movie details
- `GET /api/movies/[id]/videos` - Get movie videos/trailers

### Debug Routes

- `GET /api/debug/env` - Environment variables check
- `GET /api/debug/tmdb-test` - TMDb API connection test

## � TMDb API Integration

### Features

- **Movie Data**: Comprehensive movie information including cast, crew, ratings
- **Search**: Full-text search across movie titles and descriptions
- **Categories**: Trending, popular, top-rated, now playing, upcoming
- **Genres**: Browse movies by genre categories
- **Videos**: Trailers, teasers, and behind-the-scenes content
- **Images**: Posters, backdrops, and stills

### Attribution

"This product uses the TMDb API but is not endorsed or certified by TMDb."

### Rate Limiting

- Implemented proper caching strategies
- Respectful API usage following TMDb guidelines
- Client-side caching for optimal performance

## 🚀 Deployment

### Vercel (Recommended)

1. **Deploy to Vercel:**

```bash
# Deploy to Vercel
vercel deploy
```

2. **Set environment variables in Vercel Dashboard:**

```env
TMDB_API_KEY=your_tmdb_api_key
TMDB_ACCESS_TOKEN=your_tmdb_access_token
```

3. **Configure domain and settings as needed**

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- **Netlify**: Add build command `bun build` and publish directory `out`
- **Railway**: Connect your GitHub repository and deploy
- **DigitalOcean App Platform**: Use the Next.js template

## 🎯 Roadmap

### Phase 1 ✅ (Current)

- [x] Next.js 15 setup with App Router
- [x] TMDb API integration
- [x] Movie search and discovery
- [x] Genre-based browsing
- [x] Movie detail pages with trailers
- [x] Responsive UI with Tailwind CSS
- [x] Dark/Light theme support
- [x] TypeScript implementation

### Phase 2 🚧 (In Progress)

- [ ] Enhanced search with filters
- [ ] Watch providers integration
- [ ] Movie recommendations
- [ ] Performance optimizations
- [ ] SEO improvements

### Phase 3 📋 (Planned)

- [ ] Supabase integration for user data
- [ ] User authentication and profiles
- [ ] Personal watchlists
- [ ] User ratings and reviews
- [ ] Social features (following, sharing)
- [ ] Personalized recommendations
- [ ] PWA features

### Phase 4 🌟 (Future)

- [ ] AI-powered recommendations
- [ ] Mobile app companion
- [ ] Advanced analytics
- [ ] Community features
- [ ] Content moderation tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **TMDb** for comprehensive movie data API
- **Vercel** for hosting and deployment platform
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Next.js team** for the excellent React framework
- **Bun** for fast runtime and package management

---

**Popcurate** - Making movie discovery delightful, one recommendation at a time! 🍿✨
