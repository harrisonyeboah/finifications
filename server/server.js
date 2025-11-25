const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();


const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());


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
