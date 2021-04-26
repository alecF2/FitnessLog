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

app.get("/week", (request, response) => {
  let week_before_today = new Date();
  week_before_today.setDate(week_before_today.getDate() - 7);
  week_before_today = week_before_today.getTime();
  let date = Number(request.query.date);
  let activity = request.query.activity;
  console.log('query string date value: ', date);
  console.log('query string activity value: ', activity);
  // date is too new, reject the request
  if (date > week_before_today) {
    console.log("done");
    response.send({message:"the date is too late."});
    return;
  }

  // Query the DB to get activity that matches the query string

  // If the activity is empty, find the most recent database entry and use that activity
  if (activity === '' || activity === undefined) {
    console.log('activity undefined!')
    dbo.getLatestActivity().then(act => {
      activity = act;
    });
  }

  // get activities within a week timespan
  dbo.getWeekActivities(activity, date).then(list => {
    console.log(list);
  });
  
});

// This is where the server receives and responds to POST requests
app.post('*', function(request, response, next) {
  console.log("Server received a post request at", request.url);
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
