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
        console.log("This controller is hit reached");
        const token = req.cookies.authToken;
        console.log("Token from cookies:", token);
        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }
        console.log("We have a valid token");

        try {
            const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            console.log("Yes");
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
            console.log("Decoded JWT:", decoded); // 👈 SEE USERID inside token

            let phone = decoded.phone;
            let cleaned = phone.replace(/\D/g, ""); // remove non-digits
            let formatted = `+1${cleaned}`;         
            console.log(formatted); // +17738176657

            sendSMS(formatted, "This is a test to see if utils works. ");
            return res.status(200).json({ message: "Authenticated", user: decoded })    
        } catch(err) {
            console.error("JWT Error:", err);
            return res.status(401).json({ message: "Invalid token" });
        }
    }

}
module.exports = DashboardController;