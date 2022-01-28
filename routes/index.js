// TO IMPORT THIS

import express from "express";

const router = express.Router();

// IMPORT THE REGISTER CONTROLLER 

import { registerController , loginController, userController, refreshController , productController, } from '../controllers';

import auth from "../middlewares/auth";

import admin from '../middlewares/admin'


// CREATE A SERVER

// ALL FOR THE AUTH

router.post('/register', registerController.register);

router.post('/login', loginController.login);

router.get('/me', auth ,userController.me); // auth

router.post('/refresh', refreshController.refresh);

router.post('/logout', auth ,loginController.logout);  // SAME LOG IN(&) AND LOGOUT // auth



// ALL FOR THE PRODUCTS  NOTE: IN [] SEQUANCE MIDDLEWARE CALL...


router.post('/products' , [auth, admin] , productController.store);  // [auth, admin]

router.put('/products/:id', [auth, admin],productController.update); // [auth , admin]

router.delete('/products/:id', [auth, admin] ,productController.destroy);  //[auth,admin]

router.get('/products' ,productController.index);

router.get('/products/:id' ,productController.show);





// TO EXPORT THIS

export default router;
