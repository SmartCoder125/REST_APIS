// IMPORT THE JOI LIBRERY

import Joi from 'joi';

// IMPORT THE USER

import { RefreshToken, User } from '../../models';

// IMPORT THE BCRYPT.

import bcrypt from 'bcrypt';

// IMPORT JWT SERVICE.

import JwtService from '../../services/JwtService';

// CUSTOM ERROR HANDLER CLASS

import CustomErrorHandler from '../../services/CustomErrorHandler';

// IMPORT THE REFRESH SECRET

import {REFRESH_SECRET } from '../../config';
 

// INSTED OF PASSING THE ANONYMOUS FUNCTION PASS THIS

const registerController = {

   async register(req, res, next){
    
       // // // // LOGIC TO THE REGISTER // // // //
       

      //  CHEAKKIST TO FOLLOW MUST IF
        
      //   1. VALIDATE THE REQUEST
      //   2. AUTHORISED THE REQUEST
      //   3. CHEAK IF THE USER ALREADY IN THE DATABASE
      //   4. PREAPRE MODEL
      //   5. STORE IN THE DATABASE
      //   6. GENRATE THE JWT TOKEN
      //   7. SEND RESPONCE 



      // VALIDATION

      const registerSchema = Joi.object({

         name: Joi.string().min(3).max(30).required(),
         email : Joi.string().email().required(),
         password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
         repeat_password : Joi.ref('password')


      });

      console.log(req.body)

      const { error } = registerSchema.validate(req.body)

      if(error) {
         return next(error)
      }

       // CHEAK IF USER IN THE DATABASE

       try {

         const exist = await User.exists({email : req.body.email});

         if(exist) {

            return next(CustomErrorHandler.alreadyExist("This Email is Already Taken!!")); 
         }

       } catch(err) {
              
            return next(err)

       }



       //  OBJECT DES

       const {name, email, password } = req.body;

       // HASH THE PASSWORD

       const hashedPassedword = await bcrypt.hash(password, 10);

       
       // PREAPARE THE MODEL HOW LOOKS LIKES IN THE DATABASE.

      //  OBJECT DES

      //  const {name, email, password } = req.body;

       const user = new User({

            name,
            email,
            password : hashedPassedword

       });


       let access_token;

       let refresh_token;

       try {

         const result = await user.save();

         console.log(result)

         // TOKEN IN THE 

         access_token =  JwtService.sign({_id : result._id , role : result.role});

         refresh_token =  JwtService.sign({_id : result._id , role : result.role},'1y', REFRESH_SECRET );

         // DATABASE WHITELIST

         await RefreshToken.create({token : refresh_token})

       } catch(err) {

            return next(err)

       }
      



        return res.json({ access_token : access_token , refresh_token : refresh_token })

   }


  
    
}


// TO EXPORT THIS

export default registerController;