const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const selfOrAdmin = require('../../middleware/selfOrAdmin');
const _ = require('lodash');
require('express-async-errors');
const {createPost, findAll, findOne, findAllOne, updatePost, deletePost} = require('./post_services');




router.get('/', auth,  async (req, res) => {
    /*
        #swagger.tags = ['Post'] 
        #swagger.path = 'api/posts/'
        #swagger.method = 'get'
        #swagger.description = 'get all posts'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Post"},
            description: 'Return all posts'
        }
     */
    const userId = req.query.user;
    try{
        if(userId){                                        /*get All posts of a user*/
            const posts = await findAllOne(req, userId);
            res.send(posts);
        }
        else{                                              /*get all posts*/
            const posts = await findAll(req);                  
            res.send(posts);
        }
    }
    catch(err){
        res.status(404).send(err.message);
    }
});


router.get('/:id', auth, async(req, res) => {
    /*
    #swagger.tags = ['Post'] 
        #swagger.path = 'api/posts/{id}'
        #swagger.method = 'get'
        #swagger.description = 'Get a Post'
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'post id',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Post"},
            description: 'Return the Updated Post'
        }
    */
    try{
        const post = await findOne(req);
        res.send(post);
    }
    catch(err){
        res.status(404).send(err.message);
    }
});


router.post('/', auth, async(req, res) => {
    /*
        #swagger.tags = ['Post'] 
        #swagger.path = 'api/posts/'
        #swagger.method = 'post'
        #swagger.description = 'Create a New Post'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Post"},
            description: 'Return the Created Post'
        }
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/definitions/Post"}
    }
     */
    try{
        const post = await createPost(req);
        res.send(_.pick(post, ['_id', 'title', 'text', 'createdAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


router.put('/:id', selfOrAdmin, async(req, res) => {
    /*
        #swagger.tags = ['Post'] 
        #swagger.path = 'api/posts/{id}'
        #swagger.method = 'put'
        #swagger.description = 'Update a Post'
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'post id',
            required: true,
            type: 'objectId'
        }
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Post"},
            description: 'Return the Updated Post'
        }
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/definitions/Post"}
    }
     */
    try{
    const post = await updatePost(req);
    res.send(_.pick(post, ['_id', 'title', 'text', 'createdAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});


router.delete('/:id', selfOrAdmin, async(req, res) => {
    /*
        #swagger.tags = ['Post'] 
        #swagger.path = 'api/posts/{id}'
        #swagger.method = 'delete'
        #swagger.description = 'Remove a Post'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/Post"},
            description: 'Return the Removed Post'
        }
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'post id',
            required: true,
            type: 'objectId'
        }
    }
     */
    try{
        const post = await deletePost(req);
        res.send(_.pick(post, ['_id', 'title', 'text']));
    }
    catch(err){
        res.status(404).send(err.message);
    }    
});



exports.router = router;

