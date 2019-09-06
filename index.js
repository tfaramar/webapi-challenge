const express = require('express');

//create server, an instance of express
const server = express();
//use express middleware to parse requests
server.use(express.json());

//listen for requests on port 8000
server.listen(8000, () => console.log("server running on port 8000"));


