import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Convert file URL to path for __dirname compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = path.join(__dirname, `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });