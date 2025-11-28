// These are my imports
require('dotenv').config();  
const express = require('express');
const WebSocket = require("ws"); // My websocket server will also be in here. 
const cors = require('cors');
const { PrismaClient } = require('./src/generated/client');                // CommonJS style
const RegistrationController = require('./controllers/registrationController.js');
const LoginController = require('./controllers/loginController.js');
const DashboardController = require('./controllers/dashboardController.js');
const cookieParser = require('cookie-parser');

// This is my express appliation starting point
const app = express();


// This is my API key for my web socket server 
const API_KEY = process.env.MASSIVE_API_KEY;

// This is the objects to my login controllers and prisma client
const prisma = new PrismaClient();
const registrationController = new RegistrationController(prisma);
const loginController = new LoginController(prisma);
const dashboardController = new DashboardController(prisma);
const socket = new WebSocket("wss://socket.massive.com/stocks");


socket.on("open", () => {
  console.log("Connected to Massive WebSocket");

  // Step 1: authenticate
  socket.send(JSON.stringify({
    action: "auth",
    params: API_KEY
  }));
});

socket.on("message", (raw) => {
  const msg = JSON.parse(raw);

  msg.forEach(event => {
    if (event.ev === "status" && event.status === "auth_success") {
      console.log("Authenticated!");

      // Step 2: subscribe once authenticated
      socket.send(JSON.stringify({
        action: "subscribe",
        params: "AM.AAPL,AM.MSFT" // aggregate per minute
      }));
    } 

    if (event.ev === "AM") {
      console.log("Aggregate:", event.sym, event);
    }

    if (event.ev === "T") {
      console.log("Trade:", event.sym, event);
    }
  });
});

socket.on("close", () => console.log("Socket closed"));
socket.on("error", (err) => console.error("WebSocket error:", err));





const PORT = process.env.PORT || 8080;

  app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true, // Crucial for allowing cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
app.use(express.json());
app.use(cookieParser());







app.use('/', registrationController.router);
app.use('/', loginController.router);
app.use('/', dashboardController.router);


app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});


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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
