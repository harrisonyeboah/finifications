/* This is my render cron job that that will run safely */

require("dotenv").config();
const { PrismaClient } = require("../src/generated");
const { Resend } = require("resend");

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const FINNHUB_URL = "https://finnhub.io/api/v1/quote";
const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY;
const FINNHUB_TIMEOUT = 4000;
const FINNHUB_BATCH_SIZE = 50; // safe for free tier


  const data = await response.json();
  console.log(data.c);
  return data.c;
} // Yessir

async function getQuote(ticker) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FINNHUB_TIMEOUT);

  try {
    const res = await fetch(
      `${FINNHUB_URL}?symbol=${ticker}&token=${FINNHUB_TOKEN}`,
      { signal: controller.signal }
    );

    if (!res.ok) throw new Error(`Finnhub error for ${ticker}`);

    const data = await res.json();
    return { ticker, price: data.c };
  } finally {
    clearTimeout(timeout);
  }
}



async function runCron() {
  console.log("⏱️ Cron job started");


  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    console.log("No users found");
    return;
  }

  const userIds = users.map(u => u.id);


  const watchlists = await prisma.stockWatchlist.findMany({
    where: { userId: { in: userIds } },
  });

  if (watchlists.length === 0) {
    console.log("No watchlists found");
    return;
  }


  const uniqueTickers = [...new Set(watchlists.map(w => w.stockTicker))];

  console.log(`Fetching ${uniqueTickers.length} unique tickers`);


  const quotesMap = new Map();

  for (let i = 0; i < uniqueTickers.length; i += FINNHUB_BATCH_SIZE) {
    const batch = uniqueTickers.slice(i, i + FINNHUB_BATCH_SIZE);
    const results = await Promise.allSettled(batch.map(getQuote));

    for (const result of results) {
      if (result.status === "fulfilled") {
        quotesMap.set(result.value.ticker, result.value.price);
      }
    }
  }


  const watchlistsByUser = new Map();

  for (const item of watchlists) {
    if (!watchlistsByUser.has(item.userId)) {
      watchlistsByUser.set(item.userId, []);
    }
    watchlistsByUser.get(item.userId).push(item);
  }

  for (const user of users) {
    const items = watchlistsByUser.get(user.id) || [];
    let emailHTML = "";

    for (const item of items) {
      const currentPrice = quotesMap.get(item.stockTicker);
      if (currentPrice == null) continue;
      
      const triggerAbove =
        item.condition === "above" && currentPrice >= item.notifyPrice;
      const triggerBelow =
        item.condition === "below" && currentPrice <= item.notifyPrice;
      
      if (triggerAbove || triggerBelow) {
        emailHTML += `
          <p>
            <strong>${item.stockTicker}</strong> alert<br/>
            Target: $${item.notifyPrice}<br/>
            Current: $${currentPrice}
          </p>
        `;
      }
    }

    if (emailHTML.length > 0) {
      await resend.emails.send({
        from: "finifications <noreply@finifications.com>",
        to: user.email,
        subject: "Stock price alerts",
        html: emailHTML,
      });

      console.log(`📧 Email sent to ${user.email}`);
    }
  }

  console.log("✅ Cron job completed");
}

/* -------------------- Safe Exit Wrapper -------------------- */

(async () => {
  try {
    await runCron();
  } catch (err) {
    console.error("❌ Cron failed:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
})();
