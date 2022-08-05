//Post Fields : id, title, text, userId(user Id of the Writer)

const express = require('express');
const router = express.Router();
const Joi = require('joi');


const postDB = [
    { id: 1, title: 'school', text: 'lets go to school.', userId: 1 },
    { id: 2, title: 'work', text: 'lets go to work.', userId: 2 },
    { id: 3, title: 'game', text: 'lets play a game.', userId: 3 }
];
   

//GET ALL
router.get('/', (req, res) => {
    res.send(postDB);
});

//GET BY ID
router.get('/:id', (req, res) => {
    const post = postDB.find(c => c.id === parseInt(req.params.id));
    if(!post){ return res.status(404).send('ID dose not find')};
    res.send(post);
});

//CREATE 
router.post('/', (req, res) => {
    const { error } = dataValidation(req.body);
    if(error){
         return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    const newpost = {
        id : postDB.length + 1,
        title : req.body.title,
        text : req.body.text,
        userId : req.body.userId
    }
    postDB.push(newpost);
    res.send(newpost);    
});


//UPDATE 
router.put('/:id', (req, res) => {
    const post = postDB.find(c => c.id === parseInt(req.params.id));
    if(!post){ return res.status(404).send('ID dose not find') };
    const { error } = dataValidation(req.body);
    if(error){
        return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    post.title = req.body.title;
    post.text = req.body.text;
    post.userId = req.body.userId;
    res.send(post);
});

//DELETE 
router.delete('/:id', (req, res) => {
    const post = postDB.find(c => c.id === parseInt(req.params.id));
    if(!post){ return res.status(404).send('ID dose not find') };
    const index = postDB.indexOf(post);
    postDB.splice(index, 1);
    res.send(post);
});


//functions
function dataValidation(data){
    const schema = Joi.object({
        title: Joi.string().required(),
        text: Joi.string().max(200).required(),
        userId: Joi.number().integer().min(1).required()
    });
    return schema.validate(data);
};

module.exports.router = router;
module.exports.posts = postDB;
