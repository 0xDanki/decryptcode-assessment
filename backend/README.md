# Part 2: Node.js Backend

Implement the REST API as described in the root **ASSESSMENT.md**. This backend is written in **JavaScript** (Node.js + Express).

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

After deploying the Counter contract, set `CONTRACT_ADDRESS` in `backend/.env` to the deployed address.

## Task

- Expose **GET /api/health** – returns `{ "status": "ok", "timestamp", "uptime" }`.
- Expose **GET /api/config** – returns `{ "contractAddress": "...", "chainId": 31337 }` for the front-end. Return 503 if `CONTRACT_ADDRESS` is not set.
- Use **Node.js** with **Express** (JavaScript). You may add more routes (e.g. activity log) or replace this with your own structure.
- Document how to run the server in this README and in the root **SOLUTION.md**.

A reference implementation is provided. You may replace or extend it.

## Run

**Development (with auto-reload, Node 18+):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The server listens on **http://localhost:4000** by default (override with `PORT` in `.env`).

## Structure

- `index.js` – app entry, mounts routes and middleware
- `config.js` – loads env (PORT, CONTRACT_ADDRESS, CHAIN_ID)
- `middleware/` – request logger, error handler
- `routes/` – health, config, activity
- `services/` – in-memory activity store

## Endpoints

| Method | Path            | Description                                              |
|--------|-----------------|----------------------------------------------------------|
| GET    | /               | API info and list of endpoints                          |
| GET    | /api/health     | Health check (status, timestamp, uptime)                |
| GET    | /api/config     | Contract address and chain ID (dApp config)             |
| GET    | /api/activity   | Recent counter activity (query: `?limit=20`)            |
| POST   | /api/activity   | Record an action: `{ "type": "increment"\|"decrement", "walletAddress?", "value": number }` |
| DELETE | /api/activity   | Clear activity log (optional)                           |
