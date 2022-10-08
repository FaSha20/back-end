const bcrypt = require('bcrypt');


module.exports = async function hashingPassword(password){
    const salt = await bcrypt.genSalt(10);
    hashed = await bcrypt.hash(password, salt);
    return hashed;
}