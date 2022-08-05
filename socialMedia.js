//Develope Social Media ( CRUD APIs for every Entity )
//Entities: User - Post - Like

//imports
const express = require('express');
const app = express();
const users = require('./routs/users');
const posts = require('./routs/posts');
const likes = require('./routs/likes');


app.use(express.json());
app.use('/api/users', users.router);
app.use('/api/posts', posts.router);
app.use('/api/likes', likes.router);



//Listener...
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));