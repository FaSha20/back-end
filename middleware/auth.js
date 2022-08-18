const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    try{
        /*decode the payload */
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch{
        res.status(400).send('Invalid token!');
    }
}