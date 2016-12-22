// server.js

// modules =================================================
const express = require('express');
const path = require('path');
// Used instead of the native Promises
const bluebird = require('bluebird');
// Connect to mongodb
const mongoose = require("mongoose");
// Used to receive data (post)
// Used for markdown
// const marked = require("marked");                               // not currently used
const bodyParser = require('body-parser');
// Authentication middleware for Node.js
const passport = require('passport');                           // not currently used
const LocalStrategy = require('passport-local').Strategy;       // not currently used
// Node.js middleware for handling multipart/form-data, which is primarily used for uploading files
const multer = require('multer');
const upload = multer({dest: './uploads'}); // Handle file uploads
// Used for flash messages
const flash = require('connect-flash');
// Used to validate forms before submitting
const expressValidator = require('express-validator');
// Generate a v4 UUID (random)
const uuidV4 = require('uuid/v4');
// Used to encrypt passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

var app = express();



// configuration ===========================================

// upload config file
const config = require('./config');

// connect to our mongoDB database
mongoose.connect(config.database);

// Set bluebird as default Promise module
mongoose.Promise = bluebird;

// view database queries
mongoose.set("debug", true);

// set the static files location /public/imgages will be /imgages for users
app.use(express.static(__dirname + '/public'));
// Or we can use this code below
// app.use(express.static(path.join(__dirname, 'public')));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


////////////////
// USER MODEL //
////////////////
const User = mongoose.model('User', {
  salutation: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  username: {
    type: String,
    index: true,
    required: true
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  profileimage: {
    type: String
  },
  token: {
    type: String
  }
});







/////////////////
// ROUTE CALLS //
/////////////////
//////////////// USER ROUTES /////////////
// ----------- Register Users --------- //
app.post("/users/register", function(request, response) {
  // console.log("This is the request: ", request.body);
  let salutation = request.body.salutation;
  let first_name = request.body.first_name;
  let last_name = request.body.last_name;
  let username = request.body.username;
  let email = request.body.email;
  let password = request.body.password;

  bcrypt.hash(password, saltRounds)
    .then(function(hash) {
      let newRegistration = new User({
        salutation: request.body.salutation,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        username: request.body.username,
        email: request.body.email,
        password: hash
      });

      // console.log("This is the newRegistration info: ", newRegistration);

      newRegistration.save()
        .then(function(result) {
          console.log("Saved successfully: ", result);
          response.json({
            message: "Registered user successfully"
          });
        })
        .catch(function(error) {
          console.log("Didn't save because: ", error.stack);
        });
    })
    .catch(function(error) {
      console.log("Didn't save because: ", error.stack);
      response.json({
        message: "Error message: " + error.stack
      });
    });
});

// ----------- Login Users --------- //
app.post("/users/login", function(request, response) {
  console.log("This is the request from the front end: ", request.body);
  let username = request.body.username;
  let verify_password = request.body.password;

  User.find({ username: username })
    .then(function(user) {
      user = user[0];
      console.log("This is the user from the database: ", user);
      let hash = user.password;
      console.log("Password from database: ", hash);
      // Load hash from your password DB.
      return bcrypt.compare(verify_password, hash)
        .then(function(response) {
          if (response) {
            console.log("You are allowed to enter because response is: ", response);
            console.log("\n\nThis is the user: ", user);
            var token = uuidV4();
            console.log("This is my special token.  Don't touch: ", token);
            return User.update(
              { username: username },
              {
                $set: {
                  token: token
                }
              });
          } else {
            throw new Error("You are not allowed to enter");
          }
        });
    })
    .then(function(updated_user) {
      response.json({
        message: "Updated user"
      });
    })
    .catch(function(error) {
      response.status(401) ;
      response.json({
        message: "Error with login"
      });
    });
});
//
// // ----------- Show All Users --------- //
app.get("/users", function(request, response) {
  console.log("I'm in the backend and want to show you all my users");
  User.find()
    .then(function(users) {
      console.log("Here are my users: \n\n", users);
      response.json({
        users: users
      });
    })
    .catch(function(error) {
      console.log("There was an error getting the users");
      response.status(401) ;
      response.json({
        message: "There was an error getting the users"
      });
    });
});







// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
