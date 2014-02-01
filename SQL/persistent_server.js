var mysql = require('mysql');
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require("path");
var helpers = require('../server/helpers');
var handler = require('../server/request-handler');

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});
dbConnection.connect();

var getUserNameID = function(username, cb) {
  // usernameQuery = "select id from users where username = '" + username + "';";
  // queryDatabase(usernameQuery, function(result) {

  dbConnection.query("select id from users where username = '" + username + "';", function(err, result){
    if (err) throw err;

    if (result[0]) {
      cb(result[0].id);
    } else {
      addUser(username, function(id){
        cb(id);
      });
    }
  });

};

var addUser = function(username, cb) {
  // usernameInsertQuery = "insert into users (username) values ('" + username + "');";
  // queryDatabase(usernameInsertQuery, function(result) {

  dbConnection.query("insert into users (username) values ('" + username + "');", function(err, result) {
    if (err) throw err;
    console.log('add ' + username + ' to users table');
  });

  dbConnection.query("select id from users where username = '" + username + "';", function(err, result){
    if (err) throw err;
    cb(result[0].id);
  });
};

var getRoomNameID = function(roomname, cb) {

 dbConnection.query("select id from rooms where roomname = '" + roomname + "';", function(err, result){
    if (err) throw err;
    console.log('the result and result id inside getRoomNameID are: ', result[0], result[0].id);

    if (result[0]) {
      cb(result[0].id);
    } else {
      addRoom(roomname, function(id){
        cb(id);
      });
    }
  });

};

var addRoom = function(roomname, cb) {
  // usernameInsertQuery = "insert into users (username) values ('" + username + "');";
  // queryDatabase(usernameInsertQuery, function(result) {

  dbConnection.query("insert into rooms (roomname) values ('" + roomname + "')", function(err, result) {
    if (err) throw err;
    console.log('add ' + roomname + ' to rooms table');
  });

  dbConnection.query("select id from rooms where roomname = '" + roomname + "'", function(err, result){
    if (err) throw err;
    cb(result[0].id);
  });
};


var getAllMessages = function(cb) {

  // getAllDataQuery = 'select users.username, messages.text, rooms.roomname from users inner join messages on users.id = messages.id_users inner join rooms on messages.id_rooms = rooms.id;';
  // queryDatabase(getAllDataQuery, function(result) {//, function(result){

  dbConnection.query('select users.username, messages.text, rooms.roomname from users inner join messages on users.id = messages.id_users inner join rooms on messages.id_rooms = rooms.id', function(err, result){
    if (err) throw err;
    cb(result);
  });

};

var postNewData = function(data, cb) {
  var userID, roomID;
  var username = data.username;
  var text = data.text;
  var roomname = data.roomname || 'room1';

  // console.log('the data in postNewData is ', data);

  // check if the user name and the room name are already in their respective tables
  getUserNameID(username, function(userresult) {
    getRoomNameID(roomname, function(roomresult) {
      roomID = roomresult;
      userID = userresult;
      console.log('userID and roomID are : ', userID, roomID)
      // what about duplicate messages with same user / room / and text - need a distinguishing factor
      // var postQuery = "insert into messages (text, id_rooms, id_users) values ('" +  text + "', '" + roomID + "', '" + userID + "');";
      // queryDatabase(postQuery, function(result){
      dbConnection.query("insert into messages (text, id_rooms, id_users) values ('" +  text + "', '" + roomID + "', '" + userID + "');", function(err, result){
        if (err) throw err; 
        // console.log('inside postNewData ', result);
      });
    });
  });

};


var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(function(request, response){

  // console.log('Messages in handleRequest function');
  // msg = msg || [];

   var sendResponse = function(statusCode, content) {
      var headers = helpers.headers;
      headers['Content-Type'] = "text/plain";
      response.writeHead(statusCode, headers);
      response.end(content);
   };
   var coreUrl = url.parse(request.url);
   var urlPath = coreUrl.pathname;

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  if (urlPath === '/1/classes/chatterbox'){
    if(request.method === 'POST'){

      var body = '';
      request.on('data', function (data) {
        body += data;
      });

      request.on('end', function () {
        var POST = JSON.parse(body);
        // msg.push(POST);
        // writeMessage(POST);

        //instead, do a post to the db

        postNewData(POST, function() {
          sendResponse(200, "Hello world!");
        });
      });
    } 
    else if (request.method === 'GET') {
      
      // do a get from the db
      getAllMessages(function(msg) {
        var msgJson = JSON.stringify(msg);
        sendResponse(200, msgJson);
      })
    } else {
      sendResponse(200, "Hello world!");
    }

  } else if (urlPath === '/'){
      if (request.method === 'GET') {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        var file = fs.createReadStream("/Users/jeanettepettibone/2014-01-databases/server/client/index.html");
        file.pipe(response);
      }

  } else if (helpers.contentT[urlPath]) {
      helpers.sendUrlResponse(urlPath, response);
  } else {
    sendResponse(404, "Resource not found");
  }
  
  // console.log("Serving request type " + request.method + " for url " + path);

});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

