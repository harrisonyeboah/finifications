const express = require('express');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');


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

            jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) {
                    console.error('Error generating token:', err);
                    return res.status(500).json({ message: 'Internal server error' });
                }
                // Successful login with token
                console.log("Generated token:", token);
                res.status(200).json({ message: 'Login successful', token });
            });

            // Successful login
            res.status(200).json({ message: 'Login successful', userId: user.id });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = LoginController;