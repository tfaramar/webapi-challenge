//import express
const express = require('express');

//import router
const projectRouter = require('./routers/projectRouter.js');

//create server, an instance of express
const server = express();
//use express middleware to parse requests
server.use(express.json());

//apply routers to specific urls
server.use('/api/projects', projectRouter);



module.exports = server;