const {User, complexityOptions} = require('../user/user_model');
const bcrypt = require('bcrypt');
const password_checking = require('joi-password-complexity');

module.exports = async function authenticate(req){
    const {error} = password_checking(complexityOptions).validate(req.body.password);
    if(error) throw new Error(error.message);
    
    let user = await User.findOne({email: req.body.email});
    if(!user) throw new Error('Invalid email!');

    /*check matching between entered password and DB hashed-password*/
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) throw new Error('Invalid password!');

    const token = user.generateAuthToken();
    return token; 
}