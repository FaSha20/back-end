const {User, complexityOptions} = require('./user_model');
const _ = require('lodash');
const password_checking = require('joi-password-complexity');
const hashingPassword = require('../../tools/hashingPassword');

exports.createUser = async function createUser(req){
    const {error} = password_checking(complexityOptions).validate(req.body.password);
    if(error) throw new Error(error.message);

    const user = await User.create(_.pick(req.body, 
    ['name', 'email', 'phone', 'password', 'isAdmin']));
                
    user.password = await hashingPassword(user.password);
    user.token = user.generateAuthToken();

    await user.save();
    return user;
}

exports.updateUser = async function updateUser(req){
    const {error} = password_checking(complexityOptions).validate(req.body.password);
    if(error) throw new Error(error.message);
    req.body.password = await hashingPassword(req.body.password);

    const user = await User
        .findByIdAndUpdate(req.params.id,_.pick(req.body, 
        ['name', 'email', 'phone', 'password', 'isAdmin']), { new: true });

    if(!user) throw new Error(`ID : "${req.params.id}" does not find.`);
    await user.validate();
    user.token = user.generateAuthToken();
    return user;
}

exports.deleteUser = async function deleteUser(req){
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) throw new Error(`ID : "${req.params.id}" does not find.`);
    return user;
}

exports.findAll = async function findAll(req){
    const limit = (parseInt(req.query.limit) || 10);
    const page = (parseInt(req.query.page) || 1);
    const sortOrder = (parseInt(req.query.sortOrder) || -1);
    const users =  await User.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({createdAt: sortOrder});
    return users;
}

exports.findOne = async function findOne(req){
    const user = await User.findById(req.params.id);
    if(!user) throw new Error(`ID : "${req.params.id}" does not find.`);
    return user;
}