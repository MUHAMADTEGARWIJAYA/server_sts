import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import express from 'express'
import connectDB from './configs/db.js'
import songRoutes from './router/songRoutes.js'
import cors from 'cors';

const app = express()
const port = 3000


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors(
  {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }
));

connectDB();

app.use('/song', songRoutes);
console.log('Hello World!');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})