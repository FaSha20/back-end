const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function decodedUser(req){
    const token = req.header('x-auth-token');
    const decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));
    return decodedUser;
}
