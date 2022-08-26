const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const selfOrAdmin = require('../../middleware/selfOrAdmin');
const _ = require('lodash');
require('express-async-errors');
const {createUser, findAll, findOne, updateUser, deleteUser} = require('./user_services');



//GET ALL
router.get('/',  async (req, res) => {
    const users = await findAll(req);
    res.send(users);
});

//GET BY ID
router.get('/:id', auth, async(req, res) => {
    try{
        const user = await findOne(req);
        res.send(user);
    }
    catch(err){
        res.status(404).send(err.message);
    }
});

//CREATE 
router.post('/', async(req, res) => {
    try{
        const user = await createUser(req);
        console.log(user.token);
        res.header('x-auth-token', user.token)
            .send(_.pick(user, ['_id', 'name', 'email', 'isAdmin', 'createdAt']));
    }
    catch(err){
        if (err.code === 11000 ) err.message = 'This user has already exist';
        res.status(400).send(err.message);
    }
});

//UPDATE 
router.put('/:id', [auth, selfOrAdmin], async(req, res) => {
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

//DELETE 
router.delete('/:id', [auth, selfOrAdmin], async(req, res) => {
    try{
        const user = await deleteUser(req);
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(err){
        res.status(404).send(err.message);
    }    
});



exports.router = router;

