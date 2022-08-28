//Develope Social Media ( CRUD APIs for every Entity )
//Entities: User - Post - Like

const express = require('express');
const app = express();


require('./setup/logging')();
require('./setup/config')();
require('./setup/db')();
require('./setup/routes')(app);


//Listener...
const port = process.env.port || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;