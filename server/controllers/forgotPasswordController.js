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


const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});





const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,          // Use SSL
  secure: true,       // SSL
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS, // Gmail App Password
  },
  connectionTimeout: 30000, // 30 seconds
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// Optional: verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server ready");
  }
});

/**
 * Sends a password reset code email.
 * @param {string} userEmail - User email from database (for logging or storage)
 * @param {string|number} randomCode - The code to send
 * @param {string} inputEmail - The recipient email (can be same as userEmail)
 */
export async function sendCode(userEmail, randomCode, inputEmail) {
  console.log("sendCode is hit.");
  try {
    console.log("try is hit.");

    // Wrap sendMail in a 30-second timeout
    const info = await Promise.race([
      transporter.sendMail({
        from: `"Finifications" <${process.env.NODEMAILER_USER}>`,
        to: inputEmail,
        subject: "Password Reset Code",
        text: `Your password reset code is: ${randomCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Password Reset Request</h2>
            <p>Your password reset code is:</p>
            <h1 style="background-color: #f4f4f4; padding: 15px; letter-spacing: 5px;">${randomCode}</h1>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
          </div>
        `,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email sending timed out")), 30000)
      ),
    ]);

    console.log(`Password reset email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send reset code email:", error.message);
    throw new Error("Failed to send reset code. Please try again.");
  }
}







class ForgotPasswordController {
    constructor(prisma) {
        this.prisma = prisma;
        this.router = express.Router();
        this.router.post('/api/validateBeforeCode', this.validateBeforeCode.bind(this));
        this.router.post('/api/confirmCode', this.confirmCode.bind(this));
        this.router.post('/api/authenticate', this.authenticate.bind(this));
        this.router.post('/api/changePassword', this.changePassword.bind(this));
    }

    async validateBeforeCode(req, res) {
        /* This will send the body and then it will look for a email in the database. 
        Once we look for the email in the db. If the email does not exist then it is not a user in the 
        db.
        */
        console.log("This controller is hit");
        try {
        const sentEmail = req.body.email; 
        console.log(`My sent email is ${sentEmail}.`);


        const dbEmail = await prisma.user.findUnique({
        where: {
            email: sentEmail,
        },
        });
        console.log(dbEmail);


        if (!dbEmail) {
            return res.status(401).json({ message: 'email does not exist or you must enter email.' });
        }
        // This will be my logic to send the code.

        const min = 10000000; // Smallest 8-digit number
        const max = 99999999; // Largest 8-digit number
        const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log("Before send code");
        await sendCode(dbEmail, randomCode, sentEmail);
        console.log("After send code");

        const hashedRandomCode = await bcrypt.hash(randomCode.toString(), 10);




        console.log(dbEmail.id);
        await redisClient.set(dbEmail.id, randomCode, { ex: 600 });
        console.log("Student shii sent 200");
        return res.status(200).json({forSession: dbEmail.id});



        }
        catch(error) {
            return res.status(401).json({message: "There is an error"});
        }


    }
    async confirmCode(req, res) {
        try {
            const insertedCode = req.body.code;
            const myId = req.body.myId;

            console.log(myId);

            const realCode = await redisClient.get(myId);
            console.log(realCode);
            console.log(insertedCode);

            if (realCode != insertedCode) {
                return res.status(401).json({ message: 'the code you entered is inccorect'});
            }
            const token = jsonwebtoken.sign(
            { userId: myId, 
             },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
            );
            res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,       // must be true for SameSite: none
            sameSite: "none",
            maxAge: 10 * 60 * 1000
            });

            console.log(token);
            return res.status(200).json({ message: 'change password successful.'});
        } catch (error) {
            return res.status(401).json({ message: 'there is a backend error.' });
        }
    }
    async authenticate(req, res) {
        console.log("I Hit my controller");
        try {
            const token = req.cookies.authToken;
            if (!token) {
                return res.status(401).json({ message: 'user is not authenticated' });
            }
            console.log(" I paassed my token ")
            return res.status(200).json({ message: 'welcome' });
        } catch(error) {
            return res.status(401).json({ message: 'there is an error' });
        }

    }
    async changePassword(req, res) {
            try {
                // 1. Get the token from cookie
                const token = req.cookies?.authToken;
                console.log("LESS GOOO", token);
                if (!token) {
                    return res.status(401).json({ error: "No authorization token found" });
                }

                // 2. Verify token
                let decoded;
                try {
                    decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
                    console.log(decoded);
                } catch (err) {
                    return res.status(401).json({ error: "Invalid or expired token" });
                }

                const userId = decoded.userId;

                // 3. Validate body input
                const { newPassword } = req.body;
                if (!newPassword || newPassword.length < 8) {
                    return res.status(400).json({
                        error: "Password must be at least 8 characters",
                    });
                }

                // 4. Hash password
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // 5. Update user
                await prisma.user.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });

                // 6. Clear token cookie since it's used now
                res.clearCookie("authToken", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                const exists = await redisClient.exists(userId);
                if (exists) {
                    await redisClient.del(userId);
                }
        

                // 7. Send success
                return res.status(200).json({ message: "Password changed successfully", delly: userId});

            } catch (err) {
                console.error("changePassword error:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
        }
}


module.exports = ForgotPasswordController;