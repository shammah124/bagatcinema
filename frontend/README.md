# BagatCinema Frontend

The frontend for **BagatCinema**, a personalized movie streaming and recommendation platform. Built with React and styled using Tailwind CSS, it connects to the backend API and TMDB (The Movie Database) to deliver an engaging movie discovery experience.

## Live URL on Vercel

-  https://bagatcinema.vercel.app/

## Technologies Used

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Context API (for auth state)
- TMDB API
- LocalStorage (for user session/prefs)
- Custom Hooks for recommendations and filtering
- Progressive Web Application (PWA)

## Getting Started

### 1. Install dependencies

- npm install

### 2. Set environment variables

Create a `.env` file in the root of the `frontend/` directory:

.env

- VITE_BACKEND_URL=http://localhost:5000/api
- VITE_TMDB_API_KEY=the_tmdb_api_key

> Replace `your_tmdb_api_key` with your real TMDB API key.

### 3. Run the dev server

- npm run dev

- Visit `http://localhost:5173` in your browser.

## Auth System

- Users can register, login, and logout
- Auth token stored in `localStorage` under `bagatcinemaUserInfo`
- Protected routes via `ProtectedRoute` wrapper component

## Features

- Search and filter movies by genre, language, year
- Add/remove from watchlist (synced with backend)
- Personalized recommendations based on user preferences and feedback
- Feedback system for rating/reviewing movies
- Social features: follow users, view followers/following
- Error boundaries and toast notifications

## Folder Structure

src/
- api/ # Axios wrappers
- assets/ # Images used for tab icons/PWA
- cmponents/ # Reusable UI components
- context/ # AuthContext
- hooks/ # Custom hooks (e.g., useMovieFilter)
- pages/ # Route pages (Home, Dashboard, etc.)
- social/ # Components, Files for the social connects
- utils/ # Helpers (cache, showToast, etc.)

## Notes

- All TMDB requests are cached via sessionStorage.
- Watchlist toggling is optimistic and synced via backend validation.
