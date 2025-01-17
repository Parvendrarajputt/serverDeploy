import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const Connection = async () => {
    const username = process.env.DB_USERNAME;
    const password = process.env.DB_PASSWORD;
    const localDB = process.env.DB;

    const URL = localDB || `mongodb+srv://${username}:${password}@myblogapplciationprojec.h4rdp.mongodb.net/?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true    
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error while connecting to the database: ', error.message);
    }
};

export default Connection;
