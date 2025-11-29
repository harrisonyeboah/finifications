// We will need our .env for api key.
require('dotenv').config();  

const { PrismaClient } = require('../src/generated');
const prisma = new PrismaClient();

const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require("axios"); 



class DashboardController {
    constructor(prisma) {
        this.prisma = prisma;
        this.router = express.Router();
        this.router.get('/api/authenticate', this.authenticate.bind(this));
        this.router.get('/api/getUserInfo', this.getUserInfo.bind(this));
        this.router.post('/api/deleteButton', this.deleteButton.bind(this));
        this.router.get('/api/getTicker/:tickerName', this.getTicker.bind(this));
        this.router.post('/api/addStockToWishlist', this.addStockToWatchlist.bind(this));
    }


    async authenticate(req, res) {

        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }

        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            return res.status(200).json({message: "Successful auth"});
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ message: 'Invalid authentication token' });
        }
    }
    async getUserInfo(req, res) {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({ message: "No token found" });
        }

        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

            // I am going to send my text message to my user that he/she is logged in 
            let phone = decoded.phone;
            let cleaned = phone.replace(/\D/g, ""); // remove non-digits
            let formatted = `+1${cleaned}`;         

            // Now I am going to also query in prisma to get the user name and its post then console.log it in react
            
            const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                userName: true,
            },
            });

            const watchlist = await prisma.stockWatchlist.findMany({
            where: {
                userId: decoded.userId,  
            },
            });



            //sendSMS(formatted, "This is a test to see if utils works. ");
            return res.status(200).json({ message: "Authenticated", userName: user, stockWatchlist: watchlist});   
        } catch(err) {
            console.error("JWT Error:", err);
            return res.status(401).json({ message: "Invalid token" });
        }
    }
    async deleteButton(req, res) {
        const token = req.cookies.authToken;

        if (!token) {
            console.log("No token");
            return res.status(401).json({ message: "No token found" });
        }
        const stockIdDict = req.body;
        const stockId = stockIdDict.stockId;
        console.log(stockId);
        
        try {
        // We will try deleting the stock then 
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const deleted = await prisma.stockWatchlist.delete({
            where: { id: stockId }
        });

        // We will get a new watch list


        const watchlist = await prisma.stockWatchlist.findMany({
            where: {
                userId: decoded.userId,  
            },
        });
        console.log("My new watch list is ", watchlist);

        return res.status(200).json({ watchlist });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not delete" });
        }
    }

    async getTicker(req, res) {
        const token = req.cookies.authToken;

        if (!token) {
            console.log("No token");
            return res.status(401).json({ message: "No token found" });
        }
        const tickerName = req.params.tickerName; // <-- get tickerName from params
        console.log("Ticker:", tickerName.toUpperCase());

        // Call Finnhub API here, for example
        const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${tickerName.toUpperCase()}&token=${process.env.FINNHUB_API_KEY}`
        );
        const data = await response.json();
        res.json(data); // send data back to frontend
    }

    async addStockToWatchlist(req, res) {
        const token = req.cookies.authToken; // Always make sure that the user has a token when they enter. 

        if (!token) {
            console.log("No token");
            return res.status(401).json({ message: "No token found" });
        }
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET); 
        const userId = decoded.userId; // Make sure your token has userId

        const stockToAdd = req.body.stockToAdd.toUpperCase();
        const notifyPrice = parseFloat(req.body.notifyPrice);
        
        const existing = await prisma.stockWatchlist.findFirst({
            where: {
                userId,
                stockTicker: stockToAdd,
                notifyPrice: notifyPrice
            }
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Stock with this notify price already exists in your watchlist."
            });
        }
        
        const newEntry = await prisma.stockWatchlist.create({
            data: {
                userId,
                stockTicker: stockToAdd,
                notifyPrice: notifyPrice || null
            }
        });

        const watchlist = await prisma.stockWatchlist.findMany({
            where: {
                userId: decoded.userId,  
            },
        });

        return res.status(200).json({ message: "Succesfully added", watchlist});

        
    }



}


module.exports = DashboardController;