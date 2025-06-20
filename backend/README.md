# BagatCinema Backend

A Node.js + Express REST API powering the BagatCinema movie recommendation platform. It integrates user preferences, feedback, and TMDB APIs to deliver smart, personalized suggestions.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- TMDB API Integration

## Setup Instructions

### 1. Install dependencies

- npm install

### 2. Create a `.env` file

.env

- PORT=5000
- MONGO_URI=the_mongo_connection_string
- JWT_SECRET=the_jwt_secret
- TMDB_API_KEY=the_tmdb_api_key

### 3. Run the server

- npm run server

- API will run on `http://localhost:5000/api`.

## Authentication

- Users register with detailed profile preferences (genre, mood, language, etc.)
- JWT tokens with 7-day expiry
- All protected routes use `authMiddleware`

## API Endpoints Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### User

- `GET /api/user/profile`
- `PUT /api/user/profile`
- `DELETE /api/user/delete`

### Feedback

- `GET /api/feedback`
- `POST /api/feedback`
- `DELETE /api/feedback/:movieId`

### Watchlist

- `GET /api/watchlist`
- `POST /api/watchlist`
- `DELETE /api/watchlist/:movieId`

### Lists

- `POST /api/lists`
- `GET /api/lists/:id`
- `POST /api/lists/:id/view`
- `POST /api/lists/:id/share`

### Social

- `POST /api/social/follow/:userId`
- `DELETE /api/social/unfollow/:userId`
- `GET /api/social/following`
- `GET /api/social/followers`
- `GET /api/social/:userId/followers/count`

### Recommendations

- `GET /api/recommendations` – personalized based on:
  - Genres from watchlist & feedback
  - Preferred language
  - Favorite actor
  - Mood
  - Watch frequency

## Notes

- Movie data is filtered server-side to ensure `poster_path` exists.
- All TMDB API calls handled via `axios` and cached minimally.
- Modular controller structure (`controllers/`) and clean routes separation.
