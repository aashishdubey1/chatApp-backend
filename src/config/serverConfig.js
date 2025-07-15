import { configDotenv } from "dotenv";

configDotenv()

export default {
    PORT:process.env.PORT || 4000,
    DB_URL:process.env.DB_URL,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY,
    JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN,
}