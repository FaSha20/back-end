const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const selfOrAdmin = require('../../middleware/selfOrAdmin');
const _ = require('lodash');
require('express-async-errors');
const {createPost, findAll, findOne, findAllOne, updatePost, deletePost} = require('./post_services');



//GET ALL
router.get('/', auth,  async (req, res) => {
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

//GET BY ID
router.get('/:id', auth, async(req, res) => {
    try{
        const post = await findOne(req);
        res.send(post);
    }
    catch(err){
        res.status(404).send(err.message);
    }
});

//CREATE 
router.post('/', auth, async(req, res) => {
    try{
        const post = await createPost(req);
        res.send(_.pick(post, ['_id', 'title', 'text', 'createdAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

//UPDATE 
router.put('/:id', [auth, selfOrAdmin], async(req, res) => {
    try{
    const post = await updatePost(req);
    res.send(_.pick(post, ['_id', 'title', 'text', 'createdAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

//DELETE 
router.delete('/:id', [auth, selfOrAdmin], async(req, res) => {
    try{
        const post = await deletePost(req);
        res.send(_.pick(post, ['_id', 'title', 'text']));
    }
    catch(err){
        res.status(404).send(err.message);
    }    
});



exports.router = router;

