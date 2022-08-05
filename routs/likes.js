//Like Fields : id, userId (id of user who liked), postId (id of the liked post)

const express = require('express');
const router = express.Router();
const Joi = require('joi');
const posts = require('./posts');
const users = require('./users');


const likeDB = [
    { id: 1, postId: 2, userId: 1 },
    { id: 2, postId: 3, userId: 2 },
    { id: 3, postId: 1, userId: 2 }
];
   

//GET ALL
router.get('/', (req, res) => {
    res.send(likeDB);
});

//GET BY ID
router.get('/:id', (req, res) => {
    const like = likeDB.find(c => c.id === parseInt(req.params.id));
    if(!like){ return res.status(404).send('ID dose not find')};
    res.send(like);
});

//CREATE 
router.post('/', (req, res) => {
    const post = posts.posts.find(c => c.id === parseInt(req.body.postId));
    if(!post){ return res.status(404).send('PostID dose not find') };
    const user = users.users.find(c => c.id === parseInt(req.body.userId));
    if(!user){ return res.status(404).send('UserID dose not find') };
    const { error } = dataValidation(req.body);
    if(error){
         return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    const newlike = {
        id : likeDB.length + 1,
        postId : req.body.postId, 
        userId : req.body.userId
    }
    likeDB.push(newlike);
    res.send(newlike);    
});


//UPDATE 
router.put('/:id', (req, res) => {
    const post = posts.posts.find(c => c.id === parseInt(req.body.postId));
    if(!post){ return res.status(404).send('PostID dose not find') };
    const user = users.users.find(c => c.id === parseInt(req.body.userId));
    if(!user){ return res.status(404).send('UserID dose not find') };
    
    const like = likeDB.find(c => c.id === parseInt(req.params.id));
    if(!like){ return res.status(404).send('ID dose not find') };
    const { error } = dataValidation(req.body);
    if(error){
        return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    like.postId = req.body.postId;
    like.userId = req.body.userId;
    res.send(like);
});

//DELETE 
router.delete('/:id', (req, res) => {
    const like = likeDB.find(c => c.id === parseInt(req.params.id));
    if(!like){ return res.status(404).send('ID dose not find') };
    const index = likeDB.indexOf(like);
    likeDB.splice(index, 1);
    res.send(like);
});


//functions
function dataValidation(data){
    const schema = Joi.object({
        postId: Joi.number().integer().min(1).required(),
        userId: Joi.number().integer().min(1).required()
    });
    return schema.validate(data);
};

module.exports.router = router;
module.exports.likes = likeDB;