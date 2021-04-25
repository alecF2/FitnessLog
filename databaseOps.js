'use strict'

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');

// SQL commands for ActivityTable
const insertDB = "insert into ActivityTable (activity, date, amount) values (?,?,?)";
const getOneDB = "select * from ActivityTable where activity = ? and date = ? and amount = ?";
const allDB = "select * from ActivityTable where activity = ?";
const futureDB = "select * from ActivityTable where amount = ?";

async function testDB () {

  // for testing, always use today's date
  const today = new Date().getTime();

  // all DB commands are called using await

  // empty out database - probably you don't want to do this in your program
  await db.deleteEverything();

  await db.run(insertDB,["running",today,2.4]);
  await db.run(insertDB,["walking",today,1.1]);
  await db.run(insertDB,["walking",today,2.7]);
  await db.run(insertDB,["Bike",new Date("April 22, 2021 21:00:00"),-1]);
  await db.run(insertDB,["Soccer",new Date("April 23, 2021 23:22:11"),-1]);
  await db.run(insertDB,["Walk",new Date("April 25, 2021 23:23:11"),-1]);
  await db.run(insertDB,["Yoga",new Date("April 23, 2021 23:23:11"),-1]);
  console.log("inserted two items");

  // look at the item we just inserted
  let result = await db.get(getOneDB,["running",today,2.4]);
  console.log(result);

  // get multiple items as a list
  result = await db.all(allDB,["walking"]);
  console.log(result);
}

// append to the database
async function appendDB(activity, date, amount) {
  const newDate = new Date(date).getTime();
  await db.run(insertDB,[activity,newDate,amount]);
  let result = await db.all(futureDB,[-1]);
  console.log(result);
}

// Get the most recent planned activity 
async function getRecentFuture() {

  let today = new Date().getTime();
  let midnight = new Date().setHours(0,0,0,0);
  // Find the planned activity with the smallest time difference
  // Credit: https://stackoverflow.com/questions/14075722/find-closest-date
  let query = "SELECT * FROM ActivityTable where amount = ? and date < ? ORDER BY ABS(date - ?) ASC"
  let result = await db.get(query,[-1, midnight, today]);
  let delete_query = "DELETE FROM ActivityTable where amount = ? and date < ?";
  await db.run(delete_query, [-1, today]);
  // console.log(result);
  return result;
}

module.exports.testDB = testDB;
module.exports.appendDB = appendDB;
module.exports.getRecentFuture = getRecentFuture;
