const { PrismaClient } = require('../src/generated');
const prisma = new PrismaClient();
require('dotenv').config();
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

async function getQuote(tickerName) {
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${tickerName}&token=${process.env.FINNHUB_API_KEY}`
  );

  const data = await response.json();
  console.log(data.c);
  return data.c;
}


const sendEmailToAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
    select: {
        email: true,
        id: true
    }
    });


    console.log("Users fetched from DB:", users);
    const recipients = users.map(user => ({
    id: user.userId,
    email: user.email
    }));

    if (recipients.length > 0) {
        for (const user of recipients) {
        console.log(`these are my recipients ${user.email}.`);
        // I will then run a query to creat a email users in db based on their info.

        const watchlist = await prisma.stockWatchlist.findMany({
        where: {
            userId: user.id,  
        },
        });
        let emailsStringToBeSent = "";
        for (const item of watchlist) {
            const quoteData = await getQuote(item.stockTicker);
            emailsStringToBeSent += `<p> your stock ticker: ${item.stockTicker.toLowerCase()} is set for $${item.notifyPrice} and current price: $${quoteData} </p>`;
        };
        console.log("Emails content:", emailsStringToBeSent);
      const response = await resend.emails.send({
        from: "finifications <noreply@finifications.com>",
        to: user.email, 
        subject: `updates for ${user.email}`,
        html: emailsStringToBeSent
      });
    }
      
    } else {
      console.log('No users found in the database.');
    }
  } catch (error) {
    console.error('Error sending email to users:', error);
  }
};

sendEmailToAllUsers();
