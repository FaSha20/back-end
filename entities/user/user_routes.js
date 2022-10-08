const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const selfOrAdmin = require('../../middleware/selfOrAdmin');
const _ = require('lodash');
require('express-async-errors');
const {createUser, findAll, findOne, updateUser, deleteUser} = require('./user_services');



router.get('/',  async (req, res) => {
    /*
        #swagger.tags = ['User'] 
        #swagger.path = 'api/users/'
        #swagger.method = 'get'
        #swagger.description = 'get all users'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/User"},
            description: 'Return all users'
        }
     */
    const users = await findAll(req);
    res.send(users);
});


router.get('/:id', auth, async(req, res) => {
    /*
    #swagger.tags = ['User'] 
        #swagger.path = 'api/users/{id}'
        #swagger.method = 'get'
        #swagger.description = 'Get a User'
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'user id',
            required: true,
            type: 'string'
        }
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/User"},
            description: 'Return the Updated User'
        }
    */
    try{
        const user = await findOne(req);
        res.send(user);
    }
    catch(err){
        res.status(404).send(err.message);
    }
});


router.post('/', async(req, res) => { 
     /*
        #swagger.tags = ['User'] 
        #swagger.path = 'api/users/'
        #swagger.method = 'post'
        #swagger.description = 'Create a New User'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/User"},
            description: 'Return the Created User'
        }
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/definitions/User"}
    }
     */
    try{
        const user = await createUser(req);
        res.header('x-auth-token', user.token)
            .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin', 'createdAt']));
    }
    catch(err){
        if (err.code === 11000 ) err.message = 'This user has already exist';
        res.status(400).send(err.message);
    }
});


router.put('/:id', selfOrAdmin, async(req, res) => {
     /*
        #swagger.tags = ['User'] 
        #swagger.path = 'api/users/{id}'
        #swagger.method = 'put'
        #swagger.description = 'Update a User'
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'user id',
            required: true,
            type: 'objectId'
        }
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/User"},
            description: 'Return the Updated User'
        }
        #swagger.requestBody = {
            required: true,
            schema: {$ref: "#/definitions/User"}
    }
     */
    try{
    const user = await updateUser(req);
    res.header('x-auth-token', user.token)
        .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin', 'createdAt', 'updatedAt']));
    }
    catch(err){
        if (err.code === 11000 ) err.message = 'This user has already exist';
        res.status(400).send(err.message);
    }
});


router.delete('/:id', selfOrAdmin, async(req, res) => {
    /*
        #swagger.tags = ['User'] 
        #swagger.path = 'api/users/{id}'
        #swagger.method = 'delete'
        #swagger.description = 'Remove a User'
        #swagger.responses[200] = {
            schema: {$ref: "#/definitions/User"},
            description: 'Return the Removed User'
        }
        #swagger.parameters["id"] = {
            in: 'path',
            description: 'user id',
            required: true,
            type: 'objectId'
        }
    }
     */
    try{
        const user = await deleteUser(req);
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(err){
        res.status(404).send(err.message);
    }    
});



exports.router = router;

