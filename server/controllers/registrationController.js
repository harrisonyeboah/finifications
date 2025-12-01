const express = require('express');
const bcrypt = require('bcrypt');


const nodemailer = require("nodemailer");

// Configure your transporter (SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587, // This is my port numner 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});



class RegistrationController {
    constructor(prisma) {
        this.prisma = prisma;
        this.router = express.Router();
        this.router.post('/api/register', this.register.bind(this));
    }

    async register(req, res) {
        const { firstName, lastName, username, password, email, phone } = req.body;
        console.log("Received registration data:", req.body);

        // Basic validation
        if (!firstName || !lastName || !username || !password || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            // Check if username or email already exists
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { userName: username },
                        { email: email }
                    ]
                }
            });

            if (existingUser) {
                return res.status(409).json({ message: 'Username or email already in use' });
            }

            // Create new user
        
            const newUser = await this.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    userName: username,
                    password: hashedPassword,
                    email,
                    phone
                }
            });
            console.log("New user created:", newUser);
            return res.status(201).json({ message: 'User registered', userId: newUser.id });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.log("Prisma error code:", error.code); // <-- local debugging
            } else {
                console.error(error);
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = RegistrationController;