import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
await client.connect()
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
export const db = client.db(process.env.DB_NAME);
export const todos = db.collection('todos');