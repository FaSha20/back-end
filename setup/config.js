const config = require('config')

module.exports = function(){
    /*check set environment variables */
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defind.');
    } 
}