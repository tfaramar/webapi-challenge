//import express
const express = require('express');

//create server, an instance of express
const server = express();
//use express middleware to parse requests
server.use(express.json());

//import router and apply to specific url
const projectRouter = require('./routers/projectRouter.js');
server.use('/api/projects', projectRouter);

module.exports = server;