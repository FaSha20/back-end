const mongoose = require('mongoose');

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

exports.Post = Post;
