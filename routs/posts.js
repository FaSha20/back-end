//Post Fields :
//id, title, text, userId (Id of the Writer), likes, create & update time

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
const {User} = require('./users');



const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text:{
        type:String,
        max: 256,
        required: true
    },
    writer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes:{
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Like'
    }
}, {timestamps: true});

const Post = mongoose.model('Post', postSchema);

//GET ALL
// router.get('/', [auth, admin], async(req, res) => {
//     const posts = await Post
//         .find()
//         .sort({createdAt: -1})
//         .populate('writer', 'name email phone')
//         .populate({path: 'likes',select: 'user', populate: {path: 'user', select: 'name'}});
//     res.send(posts);
// });

//GET BY ID
router.get('/:id', async(req, res) => {
    const post = await Post
        .findById(req.params.id)
        .populate('writer', 'name email phone')
        .populate({path: 'likes',select: 'user', populate: {path: 'user', select: 'name'}});
    if(!post) return res.status(404).send('ID dose not find');
    res.send(post);
});

//GET ALL POST OF A USER
router.get('/', async(req, res) => {
    const userId = req.query.user;
    if(userId){                                                /*get posts of a user*/
        let user = await User
            .findById(userId)
            .select('posts')
            .populate({
                path: 'posts',
                select: 'title text writer likes', 
                populate: {path: 'writer', select: 'name'}
                // populate: {path: 'likes', select:'user'}
            });
        if(!user) return res.send('Inavlid user ID.');
        res.send(user.posts);
    }
    else{                                                       /*get all posts*/
        const token = req.header('x-auth-token');
        try{
            /*decode the payload */
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            if(!decoded.isAdmin) return res.status(403).send('Admin permission is needed!');
            const posts = await Post
                .find()
                .sort({createdAt: -1})
                .populate('writer', 'name email phone')
                .populate({path: 'likes',select: 'user', populate: {path: 'user', select: 'name'}});
            res.send(_.pick(posts, ['title','text','writer','likes']));
        }
        catch{
            res.status(400).send('Invalid token!');
        }
    }
});

//CREATE 
router.post('/', [auth], async(req, res) => {
    const { error } = dataValidation(req.body);
    if(error){
         return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    const post = await Post.create(_.pick(req.body, ['title', 'text']));

    const token = req.header('x-auth-token');
    const decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));
    post.writer = decodedUser._id;
    await post.save();
    
    const user = await User.findById(decodedUser._id);
    user.posts.push(post._id);
    await user.save();

    res.send(_.pick(post, ['title', 'text', 'writer', 'createdAt']));    
});


//UPDATE 
router.put('/:id', [auth, selfOrAdmin], async(req, res) => {
    const { error } = dataValidation(req.body);
    if(error){
        return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    const post = await Post.findByIdAndUpdate(req.params.id,
        _.pick(req.body, ['title', 'text']), {new: true});
    if(!post) return res.status(404).send('ID dose not find');

    res.send(_.pick(post, ['title', 'text', 'writer', 'updatedAt']));
});


//DELETE 
router.delete('/:id', [auth, selfOrAdmin], async(req, res) => {
    const post = await Post.findByIdAndRemove(req.params.id);
    if(!post){ return res.status(404).send('ID dose not find') };

    const user = await User.findById(post.writer);
    var index = user.posts.indexOf(post._id);
    if(index != -1) user.posts.splice(index, 1);
    await user.save();

    res.send(post);
});


//functions
function dataValidation(data){
    const schema = Joi.object({
        title: Joi.string().required(),
        text: Joi.string().max(200).required(),
    });
    return schema.validate(data);
};

exports.router = router;
exports.Post = Post;
