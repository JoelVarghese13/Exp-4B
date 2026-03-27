# CryptoLens — Crypto Price Tracker

A Node.js + Express web application that fetches live cryptocurrency prices from the **Blockchain.com Exchange REST API v3** using **Axios**.

## Features

- **Live prices** for 10 major cryptocurrencies (BTC, ETH, SOL, XRP, DOGE, ADA, AVAX, MATIC, LINK, DOT)
- **Market overview** with 24h price change indicators
- **Detail page** per coin — last trade price, 24h high/low, volume, raw API JSON
- **Custom symbol search** — enter any symbol supported by Blockchain.com
- **Auto-refresh** every 30 seconds on the home page
- **JSON API endpoint** at `/api/ticker/:symbol` for programmatic access
- Built with EJS templates, clean dark-themed CSS, no frontend frameworks

## Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Runtime     | Node.js                          |
| Framework   | Express.js 4                     |
| HTTP Client | Axios                            |
| Templating  | EJS                              |
| API Source  | Blockchain.com Exchange v3       |

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in browser
http://localhost:3000
```

For development with auto-reload:
```bash
npm run dev
```

## Project Structure

```
crypto-tracker/
├── app.js                  # Express server + routes + Axios API calls
├── package.json
├── views/
│   ├── index.ejs           # Home — all coins market overview
│   ├── detail.ejs          # Detail — single coin stats + raw JSON
│   └── error.ejs           # Error page
└── public/
    ├── css/style.css       # All styles
    └── js/main.js          # Client-side JS (auto-refresh, search UX)
```

## API Used

**Blockchain.com Exchange REST API v3 (Unauthenticated)**

| Endpoint                          | Usage               |
|-----------------------------------|---------------------|
| `GET /v3/exchange/tickers`        | All tickers at once |
| `GET /v3/exchange/tickers/{symbol}` | Single symbol     |

No API key required. Docs: https://api.blockchain.com/v3/#/unauthenticated

## Routes

| Route                 | Description                          |
|-----------------------|--------------------------------------|
| `GET /`               | Home page — all supported coins      |
| `GET /coin/:symbol`   | Detail page for a specific coin      |
| `GET /api/ticker/:symbol` | JSON API — raw ticker data       |
| `POST /search`        | Search form handler (redirects)      |
