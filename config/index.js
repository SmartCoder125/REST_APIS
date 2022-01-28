// DESTRUCTRING IMPORT FROM ENV FILE

import dotenv from 'dotenv';

dotenv.config();



export const {

    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    APP_URL

} = process.env; 


// SIMILAR TO THE PROCESS . ENV. PORT BUT THIS DESTRCUTING