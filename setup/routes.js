const users = require('../entities/user/user_routes');
const auth = require('../entities/auth/auth_routes');
const posts = require('../entities/post/post_routes');
const likes = require('../entities/like/like_routes');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger_output.json');


module.exports = function(app){
    /*routers */
    app.use(express.json());
    app.use('/api/users', users.router);
    app.use('/api/posts', posts.router);
    app.use('/api/likes', likes.router);
    app.use('/api/auths', auth.router);
    app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
}