//Like Fields : 
//id, user (ref to user who liked), post (id of the liked post), create time

const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const router = express.Router();
const Joi = require('joi');
const password_checking = require('joi-password-complexity');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const {Post} = require('./posts');
const {User} = require('./users');


const likeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }   
},{ timestamps: true});

const Like = mongoose.model('Like', likeSchema);
   

//GET ALL
router.get('/', async(req, res) => {
    const likes = await Like
        .find()
        .populate('user', 'phone')
        .populate('post', 'text');
    res.send(likes);
});

//GET BY ID
router.get('/:id', async(req, res) => {
    const like = await Like
        .findById(req.params.id)
        .populate('user', 'phone')
        .populate('post', 'text');
    if(!like) return res.status(404).send('ID dose not find');
    res.send(like);
});

//CREATE 
router.post('/', [auth], async(req, res) => {
    const post = await Post.findById(req.body.post);
    if(!post) return res.status(404).send('PostID dose not find') ;
    const { error } = dataValidation(req.body);
    if(error)return res.status(400).send(`Bad request: ${error.details[0].message} `);
    
    const like = await Like.create(_.pick(req.body, ['post']));
    like.user = req.user._id;
    await like.save();

    post.likes.push(like);
    await post.save();

    res.send(_.pick(like, ['user', 'post']));    
});


//DELETE 
router.delete('/:id', [auth, selfOrAdmin], async(req, res) => {
    const like = await Like.findByIdAndRemove(req.params.id);
    if(!like) return res.status(404).send('ID dose not find') ;
    
    const post = await Post.findById(like.post);
    var index = post.likes.indexOf(like._id);
    if(index != -1) post.likes.splice(index, 1);
    await post.save();

    res.send(like);
});


//functions
function dataValidation(data){
    const schema = Joi.object({
        post: Joi.string().length(24).required()
    });
    return schema.validate(data);
};

exports.router = router;
exports.Like = Like;