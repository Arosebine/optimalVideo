import * as dotenv from "dotenv";
dotenv.config();
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL
const REDIS_PASSWORD = process.env.REDIS_PASSWORD

const redisClient = createClient({
    url: REDIS_URL,
    password: REDIS_PASSWORD,
});

redisClient.on('connect', () => {
    console.log('Connecting to Redis...');
});

redisClient.on('ready', () => {
    console.log('Connected to Redis and ready to use');
});

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error.message);
});

redisClient.on('end', () => {
    console.warn('Redis connection closed');
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis');
    } catch (error: any) {
        console.error('Failed to connect to Redis:', error.message);
    }
};

process.on('SIGINT', async () => {
    console.log('Shutting down Redis connection...');
    await redisClient.disconnect();
    console.log('Redis connection closed');
    process.exit(0);
});

export default redisClient;
