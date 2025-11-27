const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const sendSMS = require('../utils/twilio');  






class LoginController {
    constructor(prisma) {
        this.prisma = prisma;
        this.router = express.Router();
        this.router.post('/api/login', this.login.bind(this));
    }

    async login(req, res) {
        const { username, password } = req.body;
        console.log("Received login data:", req.body);


        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        try {
            const user = await this.prisma.user.findUnique({
                where: { userName: username }
            });
            console.log("User examined:", user);
            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
            // Created my jwt token then I storied in http cookies to prevent xss attacks.
            const token = jsonwebtoken.sign(
            { userId: user.id, 
                phone: user.phone
             },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );

            res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000
            });

            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = LoginController;