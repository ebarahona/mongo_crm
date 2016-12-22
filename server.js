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
    index: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  profileimage: {
    type: String
  }
});







/////////////////
// ROUTE CALLS //
/////////////////
//////////////// USER ROUTES /////////////
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


// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
