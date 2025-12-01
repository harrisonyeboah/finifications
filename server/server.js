// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { PrismaClient } = require('./src/generated/client');
const RegistrationController = require('./controllers/registrationController.js');
const LoginController = require('./controllers/loginController.js');
const DashboardController = require('./controllers/dashboardController.js');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://finifications-front-end.onrender.com"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// Initialize Prisma with safe connection
const prisma = new PrismaClient();
(async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully");
  } catch (err) {
    console.error("Prisma connection error:", err);
  }
})();

// Initialize controllers
const registrationController = new RegistrationController(prisma);
const loginController = new LoginController(prisma);
const dashboardController = new DashboardController(prisma);

// Register routes
app.use('/', registrationController.router);
app.use('/', loginController.router);
app.use('/', dashboardController.router);

// Health check and test routes
app.get('/api/hello', (req, res) => res.json({ message: 'Hello from the server!' }));

app.get("/test-db", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (!users.length) {
      console.log("No users found");
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handling
process.on('uncaughtException', (err) => console.error('Uncaught Exception:', err));
process.on('unhandledRejection', (err) => console.error('Unhandled Rejection:', err));
