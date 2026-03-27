const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Supported symbols (Blockchain.com USD pairs) ───────────────────────────
const SUPPORTED_COINS = [
  { symbol: "BTC-USD", name: "Bitcoin", icon: "₿" },
  { symbol: "ETH-USD", name: "Ethereum", icon: "Ξ" },
  { symbol: "SOL-USD", name: "Solana", icon: "◎" },
  { symbol: "XRP-USD", name: "XRP", icon: "✕" }
];

// ── Blockchain.com API helper ──────────────────────────────────────────────
const BASE_URL = "https://api.blockchain.com/v3/exchange/tickers";

async function fetchTicker(symbol) {
  const { data } = await axios.get(`${BASE_URL}/${symbol}`, {
    timeout: 8000,
    headers: { Accept: "application/json" },
  });
  return data;
}

async function fetchAllTickers() {
  const { data } = await axios.get(BASE_URL, {
    timeout: 10000,
    headers: { Accept: "application/json" },
  });
  return data;
}

// ── Routes ─────────────────────────────────────────────────────────────────

// Home – show all supported coins
app.get("/", async (req, res) => {
  try {
    const allTickers = await fetchAllTickers();

    // Build a quick lookup map from the API response
    const tickerMap = {};
    allTickers.forEach((t) => {
      tickerMap[t.symbol] = t;
    });

    const coins = SUPPORTED_COINS.map((coin) => {
      const ticker = tickerMap[coin.symbol] || null;
      return {
        ...coin,
        price: ticker ? ticker.last_trade_price : null,
        change: ticker ? (ticker.price_24h || 0) : null,
        volume: ticker ? ticker.volume_24h : null,
      };
    });

    res.render("index", { coins, error: null });
  } catch (err) {
    console.error("Home error:", err.message);
    res.render("index", { coins: SUPPORTED_COINS.map(c => ({ ...c, price: null, change: null, volume: null })), error: "Could not load market data. Please try again." });
  }
});

// Detail page – single coin
app.get("/coin/:symbol", async (req, res) => {
  const rawSymbol = req.params.symbol.toUpperCase();
  const coinMeta = SUPPORTED_COINS.find((c) => c.symbol === rawSymbol);

  if (!coinMeta) {
    return res.status(404).render("error", { message: `Symbol "${rawSymbol}" is not supported.` });
  }

  try {
    const ticker = await fetchTicker(rawSymbol);
    res.render("detail", { coin: coinMeta, ticker });
  } catch (err) {
    console.error("Detail error:", err.message);
    res.render("error", { message: `Failed to fetch data for ${rawSymbol}. The API may be unavailable.` });
  }
});

// JSON API endpoint – used by the search widget (AJAX)
app.get("/api/ticker/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try {
    const ticker = await fetchTicker(symbol);
    res.json({ success: true, data: ticker });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search handler (form POST from search bar)
app.post("/search", (req, res) => {
  const raw = (req.body.symbol || "").trim().toUpperCase();
  if (!raw) return res.redirect("/");
  // Append -USD if user didn't include it
  const symbol = raw.includes("-") ? raw : `${raw}-USD`;
  res.redirect(`/coin/${symbol}`);
});

// ── Start server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Crypto Tracker running at http://localhost:${3000}`);
});
