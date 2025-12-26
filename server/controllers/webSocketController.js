require('dotenv').config();

const { PrismaClient } = require('../src/generated');
const prisma = new PrismaClient();

const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios'); 
const nodemailer = require('nodemailer');
const session = require('express-session');
const { Redis } = require('@upstash/redis');
const { Resend } = require("resend");

const WebSocket = require("ws");


const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});


const resend = new Resend(process.env.RESEND_API_KEY);


const FINNHUB_KEY = process.env.FINNHUB_API_KEY;


async function sendWebSocketEmail(to, randomCode) {
  try {
    const response = await this.resend.emails.send({
      from: "finifications <noreply@finifications.com>",
      to: "harrisonyeboahcs@gmail.com",
      subject: `Subscribed to ${symbol}`,
      html: `<p>You are currently subscribed to ${symbol}</p>`,
    });
    console.log("Email sent:", response);
    return { success: true, data };
  } catch (error) {
    console.error("Email error:", error);
    return { success: false, error };
  }
}


class WebSocketController {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async handleConnection(ws, req) {
        // Extract symbol from query params
        const url = new URL(req.url, "http://localhost");
        const symbol = url.searchParams.get("symbol");

        const finnhubSocket = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_KEY}`);

        finnhubSocket.on("open", async() => {
            console.log("Connected to Finnhub for symbol:", symbol);

          const response = await resend.emails.send({
            from: "finifications <noreply@finifications.com>",
            to: "harrisonyeboahcs@gmail.com",
            subject: `Subscribed to ${symbol}`,
            html: `<p>You are currently subscribed to ${symbol}</p>`,
          });


            // Subscribe to the symbol
            finnhubSocket.send(JSON.stringify({ type: "subscribe", symbol }));
            ws.send(JSON.stringify({ type: "subscribe", symbol }));
        });

        finnhubSocket.on("message", (data) => {
            const payload = JSON.parse(data.toString());

            // Finnhub sends many messages; only forward price updates
            if (payload.type === "trade") {
                payload.data.forEach((trade) => {
                    if (trade.s === symbol) {
                        ws.send(JSON.stringify({ type: "PRICE_UPDATE", price: trade.p, time: trade.t }));
                    }
                });
            }
        });

        // Optionally, use a service class to handle Finnhub or DB logic
        // Example: marketService.fetchAndStream(symbol, ws);

        ws.on("message", (msg) => {
            console.log("Message from client:", msg);
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });

        ws.send(JSON.stringify({ type: "CONNECTED", symbol }));
    }
}


module.exports = WebSocketController;