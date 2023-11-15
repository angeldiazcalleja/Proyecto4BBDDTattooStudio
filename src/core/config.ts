import dotenv from 'dotenv'
dotenv.config()

const CONF = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    HASH_ROUNDS: Number(process.env.HASH_ROUNDS)
};

export default CONF;
