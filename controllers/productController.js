import {Product } from '../models';

import multer from 'multer';

import path from 'path';

import Joi  from 'joi';

import CustomErrorHandler from '../services/CustomErrorHandler.js';

import fs from 'fs';

import productSchema from '../valiadators/productValidators';



// DEFINE STORAGE MULTER

const storage = multer.diskStorage({

    destination : (req, file, cb) => cb (null, 'uploads/'),

    filename : (req,file, cb) => {

        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`

        // 32584512-41525525.png

        cb(null, uniqueName)
    }
})

//  SPECIAL METHOD OF MULTER

const handelMultipartData = multer({storage, limits : {fileSize : 1000000 * 5 }}).single('image')   // 5MB


// CON CONTROLLER ROUTES

const productController = {

    async store(req,res,next) {

        // TO UPLOAD IMAGE SPECIAL TYPE OF DATA IMPORT

        // MULTI-POINT FROM DATA // EXPREE JS DOESN'T HAVE MULTER SO USE { MULTER LIB }

        handelMultipartData(req,res, async (err)=> {

            if(err) {

                return next(CustomErrorHandler.serverError(err.message));
            }

            // console.log(req.file)

            const filePath = req.file.path;


            // VALIDATE THE REQUEST

            // const productSchema = Joi.object({

            //     name : Joi.string().required(),
            //     price : Joi.number().required(),
            //     size : Joi.string().required()
            // });
        
                const { error } = productSchema.validate(req.body);

                if(error) {

                    // DELETE THE UPLOAD FILE IF ERROR

                    // ROOTFOLDER/UPLOADS/FILENAME

                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        
                        if(err) {
    
                            return next(CustomErrorHandler.serverError(err.message));

                        }


                    });

                    return next(error);

                }


                const {name, price, size} = req.body;

                let document;

                 try {

                    document = await Product.create({

                        name,
                        price,
                        size,
                        image : filePath

                    })

                 } catch(err) {

                    return next(err)

                 }

            res.status(201).json(document);

        });
        

    },

    async update(req,res,next) {


        handelMultipartData(req,res, async (err)=> {

            if(err) {

                return next(CustomErrorHandler.serverError(err.message));
            }

            
            let filePath;

            if(req.file)  {

                const filePath = req.file.path;
            }

            


            // VALIDATE THE REQUEST

            // const productSchema = Joi.object({

            //     name : Joi.string().required(),
            //     price : Joi.number().required(),
            //     size : Joi.string().required()
            // });

        
                const { error } = productSchema.validate(req.body);

                if(error) {

                    // DELETE THE UPLOAD FILE IF ERROR

                    // ROOTFOLDER/UPLOADS/FILENAME

                    if(req.file) {

                        fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        
                            if(err) {
        
                                return next(CustomErrorHandler.serverError(err.message));
    
                            }
    
    
                        });
                    }

                    return next(error);

                }


                const {name, price, size} = req.body;

                let document;

                 try {

                    document = await Product.findOneAndUpdate({_id : req.params.id},{

                        name,
                        price,
                        size,
                        ...(req.file && {image : filePath})
                        // image : filePath

                    }, {new : true}) // updated data

                    // console.log(document);

                 } catch(err) {

                    return next(err)

                 }

            res.status(201).json(document);

        });


    },

    async destroy(req,res,next) {

        const document = await Product.findOneAndRemove({_id : req.params.id});

        if(!document) {

            return next(new Error('Nothing to delete!!'))

        }

        //  IMAGE DELETE

        const imagePath = document._doc.image;  // ._doc is jumbling

        //._doc original documents without getters AND GET CLEAN URL

        // console.log(imagePath);

        // http://localhost:5000/uploads\\1643254503626-692236328.png

        // approot/http://localhost:5000/uploads\\1643254503626-692236328.png


        fs.unlink(`${appRoot}/${imagePath}`, (err)=> {
            if(err) {

                return next(CustomErrorHandler.serverError())
            }

            res.json(document);
        });

        // res.json(document);

    },

    async index(req,res,next)  {

        let documents;

        // PAGINATION MONGOOSE PAGINATION

        try {

            documents = await Product.find().select('-updatedAt -__v').sort({_id : -1});    //  USE PAGINATION FOR MORE PRODUCTS

        } catch(err)  {

            return next(CustomErrorHandler.serverError())
        }


        return res.json(documents);


    },

    async show(req,res,next)  {

        let document;

        try {

            document = await Product.findOne({_id : req.params.id}).select('-updatedAt  -__v')

        } catch(err) {

            return next(CustomErrorHandler.serverError())
        }


        return res.json(document)

    },




};

export default productController;