const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    try{
        /*decode the payload */
        const decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));
        if(!decodedUser.isAdmin && decodedUser._id != req.params.id){
            return res.status(403).send('Access denied!');
        }
        next();
    }
    catch{
        res.status(400).send('Invalid token!');
    }
}