const { PrismaClient } = require('../src/generated');
const prisma = new PrismaClient();

const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendSMS } = require('../utils/twilio');




class DashboardController {
    constructor(prisma) {
        this.prisma = prisma;
        this.router = express.Router();
        this.router.get('/api/authenticate', this.authenticate.bind(this));
        this.router.get('/api/getUserInfo', this.getUserInfo.bind(this));
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
            console.log("No token");
            return res.status(401).json({ message: "No token found" });
        }

        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded); // 👈 SEE USERID inside token

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

        


            console.log("My username is", user, "And my watchlist contains", watchlist);



            //sendSMS(formatted, "This is a test to see if utils works. ");
            return res.status(200).json({ message: "Authenticated", userName: user, stockWatchlist: watchlist});   
        } catch(err) {
            console.error("JWT Error:", err);
            return res.status(401).json({ message: "Invalid token" });
        }
    }

}
module.exports = DashboardController;