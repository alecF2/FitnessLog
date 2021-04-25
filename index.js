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

app.get("/week", (request, response)=>{
  let date = request.query.date;
  let activity = request.query.activity;
  // Query the DB to get activity that matches the query string
  

  // TODO: if the activity is empty, find the most recent database entry and use that activity
  //TODO: if the request is for a date that is at least a week ago, send back list of entries from the DB for the chosen activity for the week ending with that date
  // TODO: else send a message refusing the query because the date is too late
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


