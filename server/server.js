// These are my imports
require('dotenv').config();  
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./src/generated/client');                // CommonJS style
const RegistrationController = require('./controllers/registrationController.js');
const LoginController = require('./controllers/loginController.js');

// This is my express appliation starting point
const app = express();


// This is the objects to my login controllers and prisma client
const prisma = new PrismaClient();
const registrationController = new RegistrationController(prisma);
const loginController = new LoginController(prisma);



const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());







app.use('/', registrationController.router);
app.use('/', loginController.router);


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
