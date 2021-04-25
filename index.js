'use strict'

// A server that uses a database. 

// express provides basic server functions
const express = require("express");

// our database operations
const dbo = require('./databaseOps');

// object that provides interface for express
const app = express();

const db = require('./sqlWrap');

// use this instead of the older body-parser
app.use(express.json());

// make all the files in 'public' available on the Web
app.use(express.static('public'))

// when there is nothing following the slash in the url, return the main page of the app.
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/fitnessLog.html");
});

app.get("/reminder", (request, response) => {
  dbo.getRecentFuture().then((result) => {
    response.send(result);
  });
});

// This is where the server recieves and responds to POST requests
app.post('*', function(request, response, next) {
  console.log("Server recieved a post request at", request.url);
  console.log("body",request.body);
  response.send("I got your POST request");

  if (request.url === '/store') {
    dbo.appendDB(request.body.activity, request.body.date, -1);
  }
});


// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});


// call the async test function for the database
// this is an example showing how the database is used
// you will eventually delete this call.
dbo.testDB().catch(
  function (error) {
    console.log("error:", error);
  }
);


