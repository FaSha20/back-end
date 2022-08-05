//User Fields : id, name, username, age

const express = require('express');
const router = express.Router();
const Joi = require('joi');


const usersDB = [
    { id: 1, name: 'Ali', username: 'AA', age: 20 },
    { id: 2, name: 'Mahdieh', username: 'MM', age: 22 },
    { id: 3, name: 'Hadi', username: 'HH', age: 25 }
];
   

//GET ALL
router.get('/', (req, res) => {
    res.send(usersDB);
});

//GET BY ID
router.get('/:id', (req, res) => {
    const user = usersDB.find(c => c.id === parseInt(req.params.id));
    if(!user){ return res.status(404).send('ID dose not find')};
    res.send(user);
});

//CREATE 
router.post('/', (req, res) => {
    const { error } = dataValidation(req.body);
    if(error){
         return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    const newUser = {
        id : usersDB.length + 1,
        name : req.body.name,
        username : req.body.username,
        age : req.body.age
    }
    usersDB.push(newUser);
    res.send(newUser);    
});


//UPDATE 
router.put('/:id', (req, res) => {
    const user = usersDB.find(c => c.id === parseInt(req.params.id));
    if(!user){ return res.status(404).send('ID dose not find') };
    const { error } = dataValidation(req.body);
    if(error){
        return res.status(400).send(`Bad request: ${error.details[0].message} `);
    }
    user.name = req.body.name;
    user.username = req.body.username;
    user.age = req.body.age;
    res.send(user);
});

//DELETE 
router.delete('/:id', (req, res) => {
    const user = usersDB.find(c => c.id === parseInt(req.params.id));
    if(!user){ return res.status(404).send('ID dose not find') };
    const index = usersDB.indexOf(user);
    usersDB.splice(index, 1);
    res.send(user);
});


//functions
function dataValidation(data){
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        username: Joi.string().alphanum().min(2).max(30).required(),
        age: Joi.number().integer().min(1).required()
    });
    return schema.validate(data);
};

module.exports.router = router;
module.exports.users = usersDB