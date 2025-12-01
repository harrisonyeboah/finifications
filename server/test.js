import express from 'express';
const app = express();
const PORT = 8080;

app.get('/', (req, res) => res.send('Hello world'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
