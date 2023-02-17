import * as dotenv from "dotenv";
dotenv.config();

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    mongo_url: process.env.MONGO_URL,
  },
  redis_url: process.env.REDIS_URL,
  private_key: process.env.PRIVATE_KEY,
});
