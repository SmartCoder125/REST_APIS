// TO IMPORT EXPRESS USING ESM PACKAGE!

import express  from "express";

// OBJECT OF THE EXPRESS 

const app = express();

// IMPORT THE APP PORT

import {APP_PORT , DB_URL } from './config';

// IMPORT THE ERRORHANDLER

import errorHandler from "./middlewares/errorHandler";

// IMPORT A ROUTE INDEX.JS

import routes from './routes/index.js';


// IMPORT THE MONGOOSE

import mongoose from 'mongoose';

// IMPORT THE PATH MODULE

import path from 'path';


// THE DATABASE CONNECTION


mongoose.connect(DB_URL, { 
        useNewUrlParser : true,
        // useCreateIndex : true,
        useUnifiedTopology : true,
        // useFindAndModify : true
})


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error : '));

db.once('open', ()=> {
 
    console.log('Database Connected!!!')

});


// GLOBAL VARIBALE USE HERE

global.appRoot = path.resolve(__dirname);


// EXPRESS IN-BILT MIDLLEWARE 

app.use(express.json()) // FOR READING JSON

app.use(express.urlencoded({ extended: false })) // FOR READING MULTIPART

// USE THE ALL ROUTES

app.use('/api' , routes);

// MIDDLEWARE 

app.use(errorHandler);


// CREATE  A ROUTES FOR IMAGE UPLOAD

app.use('/uploads',express.static('uploads'))


// LISTENING ON THE PORT

app.listen(APP_PORT, ()=> {

    console.log(`Listening on the port ${APP_PORT}`)

})