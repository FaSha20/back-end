//Develope Social Media ( CRUD APIs for every Entity )
//Entities: User - Post - Like

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const users = require('./routs/users');
const auth = require('./routs/authentication');
const posts = require('./routs/posts');
const likes = require('./routs/likes');

/*check set environment variables */
if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defind.');
    process.exit(1);
}

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);
// mongoose.set('useUnifiedTopology', true);


/*conncting to data base */
mongoose.connect('mongodb://localhost/socialMedia')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.error('Could not connect to MongoDB...'));


/*routers */
app.use(express.json());
app.use('/api/users', users.router);
app.use('/api/posts', posts.router);
app.use('/api/likes', likes.router);
app.use('/api/auths', auth.router);



//Listener...
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));