const express = require('express');
const router = express.Router();
const authenticate = require('./auth_services');

//Authenticate 
router.post('/', async(req, res) => {
    try{
        const token = await authenticate(req);
        res.send(token);
    }
    catch(err){
        res.status(400).send(err.message);
    }
});

exports.router = router;

