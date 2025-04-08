import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define the structure of your environment variables
interface Env {
  EMAIL_USER: string;
  EMAIL_PASS: string;
}

// Validate and return the environment variables
const getEnv = (): Env => {
  const env = process.env as unknown as Env;

  if (!env.EMAIL_USER || !env.EMAIL_PASS) {
    throw new Error('Missing required environment variables');
  }

  return env;
};

export const env = getEnv();