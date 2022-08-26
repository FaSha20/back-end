const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const selfOrAdmin = require('../../middleware/selfOrAdmin');
const _ = require('lodash');
require('express-async-errors');
const {createLike, findAll, findOne, findAllOne, updateLike, deleteLike} = require('./like_services');



//GET ALL
router.get('/', auth,  async (req, res) => {
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

//GET BY ID
router.get('/:id', auth, async(req, res) => {
    try{
        const like = await findOne(req);
        res.send(like);
    }
    catch(err){
        res.status(404).send(err.message);
    }
});

//CREATE 
router.post('/', auth, async(req, res) => {
    try{
        const like = await createLike(req);
        res.send(_.pick(like, ['_id', 'user', 'post', 'createdAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

//UPDATE 
router.put('/:id', [auth, selfOrAdmin], async(req, res) => {
    try{
    const like = await updateLike(req);
    res.send(_.pick(like, ['_id', 'user', 'post', 'updatedAt']));
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

//DELETE 
router.delete('/:id', [auth, selfOrAdmin], async(req, res) => {
    try{
        const like = await deleteLike(req);
        res.send(_.pick(like, ['_id', 'user', 'post', 'updatedAt']));
    }
    catch(err){
        res.status(404).send(err.message);
    }    
});



exports.router = router;

