const {Post} = require('./post_model');
const {User} = require('../user/user_model');
const decodeUser = require('../../tools/decodeUser');
const _ = require('lodash');


exports.createPost = async function createPost(req){
    const post = await Post.create(_.pick(req.body, ['title', 'text']));

    post.writer = req.user._id;
    await post.save();
    
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();

    return post;
}

exports.updatePost = async function updatePost(req){
    const post = await Post
        .findByIdAndUpdate(req.params.id,_.pick(req.body, ['title', 'text']), { new: true });
    if(!post) throw new Error(`ID : "${req.params.id}" does not find.`);
    await post.validate();

    return post;
}

exports.deletePost = async function deletePost(req){
    const post = await Post.findByIdAndRemove(req.params.id);
    if(!post) throw new Error(`ID : "${req.params.id}" does not find.`);
    
    const user = await User.findById(post.writer);
    var index = user.posts.indexOf(post._id);
    if(index != -1) user.posts.splice(index, 1);
    await user.save();

    return post;
}

exports.findAll = async function findAll(req){
    if(!req.user.isAdmin) throw new Error('Admin permission is needed!');

    const limit = (parseInt(req.query.limit) || 10);
    const page = (parseInt(req.query.page) || 1);
    const sortOrder = (parseInt(req.query.sortOrder) || -1);
    const posts =  await Post
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt: sortOrder})
        .populate('writer', 'name email phone')
        .populate({
            path: 'likes',
            select: 'user', 
            populate: {path: 'user', select: 'name'}
        });
    return posts;
}

exports.findOne = async function findOne(req){
    const post = await Post
        .findById(req.params.id)
        .populate('writer', 'name email')
        .populate({
            path: 'likes',
            select: 'user', 
            populate: {path: 'user', select: 'name'}
        });
    if(!post) throw new Error(`ID : "${req.params.id}" does not find.`);
    return post;
}

exports.findAllOne = async function findAllOne(req, userId){
    const limit = (parseInt(req.query.limit) || 10);
    const page = (parseInt(req.query.page) || 1);
    const sortOrder = (parseInt(req.query.sortOrder) || -1);
    const user = await User
        .findById(userId)
        .select('posts')
        .populate({
            path: 'posts',
            select: 'title text writer likes', 
            sort: {createdAt: sortOrder},
            skip: (page - 1) * limit,
            limit: limit,
            populate: [
                {path: 'writer', select: 'name'},
                {path: 'likes', select:'user', populate: {
                    path:'user', select:'name'
                }}
            ]
        });
    if(!user) throw new Error(`ID : "${userId}" does not find.`);
    return user.posts;
}