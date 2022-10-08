const {Like} = require('./like_model');
const {Post} = require('../post/post_model');
const _ = require('lodash');


exports.createLike = async function createLike(req){
    const like = await Like.create(_.pick(req.body, ['post']));
    like.user = req.user._id;
    await like.save();
    
    const post = await Post.findById(req.body.post);
    post.likes.push(like._id);
    await post.save();

    return like;
}

exports.updateLike = async function updateLike(req){
    const like = await Like
        .findByIdAndUpdate(req.params.id,_.pick(req.body, ['user', 'post']), { new: true });
    if(!like) throw new Error(`Like ID : "${req.params.id}" does not find.`);
    await like.validate();

    return like;
}

exports.deleteLike = async function deleteLike(req){
    const like = await Like.findByIdAndRemove(req.params.id);
    if(!like) throw new Error(`Like ID : "${req.params.id}" does not find.`);
    console.log(like, like.user);

    const post = await Post.findById(like.post);
    var index = post.likes.indexOf(like._id);
    if(index != -1) post.likes.splice(index, 1);
    await post.save();

    return like;
}

exports.findAll = async function findAll(req){
    if(!req.user.isAdmin) throw new Error('Admin permission is needed!');

    const limit = (parseInt(req.query.limit) || 10);
    const page = (parseInt(req.query.page) || 1);
    const sortOrder = (parseInt(req.query.sortOrder) || -1);
    const likes =  await Like.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt: sortOrder})
        .populate('user', 'name email')
        .populate({
            path: 'post',
            select: 'title text writer', 
            populate: {path: 'writer', select: 'name email'}
        });
    return likes;
}

exports.findOne = async function findOne(req){
    const like = await Like.findById(req.params.id);
    if(!like) throw new Error(`Like ID : "${req.params.id}" does not find.`);
    return like;
}

exports.findAllOne = async function findAllOne(req, postId){
    const limit = (parseInt(req.query.limit) || 10);
    const page = (parseInt(req.query.page) || 1);
    const sortOrder = (parseInt(req.query.sortOrder) || -1);
    const post = await Post
        .findById(postId)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt: sortOrder})
        .select('likes')
        .populate({
            path: 'likes',
            select: 'user post', 
            populate: [
                {path: 'user', select: 'name'},
                {path: 'post', select:'title text'}
            ]
        });
    
    if(!post) throw new Error(`Post ID : "${userId}" does not find.`);
    return post.likes;
}