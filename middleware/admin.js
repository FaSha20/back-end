const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function(req, res, next){
    const token = req.header('x-auth-token');
    try{
        /*decode the payload */
        const decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));
        if(!decodedUser.isAdmin) {
            return res.status(403).send('Admin permission is needed!');
        }
        next();
    }
    catch{
        res.status(401).send('Invalid token!');
    }
}