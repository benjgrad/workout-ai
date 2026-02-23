# Workout AI — Adaptive Training Platform for Garmin

AI-generated training plans delivered to Garmin watches. Plans execute natively on the watch, collect performance data, and adapt future workouts.

## Prerequisites

- Node.js >= 20
- Docker (for PostgreSQL)
- Garmin Connect IQ SDK 8.4.1 (for watch builds)
- Expo Go on a physical phone (for mobile dev)

## Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL
docker compose -f backend/docker-compose.yml up -d

# Run migrations and seed test data
npm run -w backend migrate
npm run -w backend seed
```

## Running

```bash
# Backend (port 3000)
npm run backend:dev

# Mobile (Expo Go)
npm run mobile:start

# Watch (build .prg for sideloading)
cd watch && bash build.sh
```

## Testing

```bash
# All tests (backend + mobile)
npm test -- --forceExit

# Backend only
npm test -w backend -- --forceExit

# Mobile only
npm test -w mobile -- --forceExit
```

## Watch Development

The watch fetches plans from the backend via HTTPS. For local dev, expose the backend with ngrok:

```bash
ngrok http 3000
```

Update the `BASE_URL` in `watch/source/PlanSync.mc` with the ngrok URL, then rebuild and sideload.

## Test Credentials

- **Email:** `test@workout.ai`
- **Password:** `testpass123`
- **Watch API key:** `dev-watch-key-change-in-production`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | None | Health check |
| POST | `/v1/auth/login` | None | Login → JWT |
| GET | `/v1/plan/latest` | Bearer JWT | Latest plan for authenticated user |
| GET | `/v1/watch/plan/:userId?key=<key>` | API key | Latest plan for watch |

## Project Structure

```
backend/          Node.js + TypeScript + Express + PostgreSQL
mobile/           React Native (Expo) companion app
watch/            Garmin Connect IQ app (Monkey C)
```

See `BRIEF.md` for requirements, `System-Design.md` for architecture, and `decision-log.md` for design decisions.
