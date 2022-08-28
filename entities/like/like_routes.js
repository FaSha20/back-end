const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const selfOrAdmin = require('../../middleware/selfOrAdmin');
const _ = require('lodash');
require('express-async-errors');
const {createLike, findAll, findOne, findAllOne, updateLike, deleteLike} = require('./like_services');



router.get('/', auth,  async (req, res) => {
    /*
        #swagger.tags = ['Like'] 
        #swagger.path = 'api/likes/'
        #swagger.method = 'get'
        #swagger.description = 'get all likes'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Like"},
            description: 'Return all likes'
        }
     */
    const postId = req.query.post;
    try{
        if(postId){                                        /*get All likes of a post*/
            const likes = await findAllOne(req, postId);
            res.send(likes);
        }
        else{                                              /*get all likes*/
            const likes = await findAll(req);                    
            res.send(likes);
        }
    }
    catch(err){
        res.status(404).send(err.message);
    }
});


router.get('/:id', auth, async(req, res) => {
    /*
    #swagger.tags = ['Like'] 
        #swagger.path = 'api/likes/{id}'
        #swagger.method = 'get'
        #swagger.description = 'Get a Like'
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'like id',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Like"},
            description: 'Return the Updated Like'
        }
    */
    try{
        const like = await findOne(req);
        res.send(like);
    }
    catch(err){
        res.status(404).send(err.message);
    }
});

 
router.post('/', auth, async(req, res) => {
    /*
        #swagger.tags = ['Like'] 
        #swagger.path = 'api/likes/'
        #swagger.method = 'like'
        #swagger.description = 'Create a New Like'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Like"},
            description: 'Return the Created Like'
        }
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/definitions/Like"}
    }
     */
    try{
        const like = await createLike(req);
        res.send(_.pick(like, ['_id', 'user', 'post', 'createdAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


router.put('/:id', [auth, selfOrAdmin], async(req, res) => {
    /*
        #swagger.tags = ['Like'] 
        #swagger.path = 'api/likes/{id}'
        #swagger.method = 'put'
        #swagger.description = 'Update a Like'
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'like id',
            required: true,
            type: 'objectId'
        }
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Like"},
            description: 'Return the Updated Like'
        }
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/definitions/Like"}
    }
     */
    try{
    const like = await updateLike(req);
    res.send(_.pick(like, ['_id', 'user', 'like', 'updatedAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


router.delete('/:id', [auth, selfOrAdmin], async(req, res) => {
    /*
        #swagger.tags = ['Like'] 
        #swagger.path = 'api/likes/{id}'
        #swagger.method = 'delete'
        #swagger.description = 'Remove a Like'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Like"},
            description: 'Return the Removed Like'
        }
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'like id',
            required: true,
            type: 'objectId'
        }
    }
     */
    try{
        const like = await deleteLike(req);
        res.send(_.pick(like, ['_id', 'user', 'post', 'updatedAt']));
    }
    catch(err){
        res.status(404).send(err.message);
    }    
});



exports.router = router;

