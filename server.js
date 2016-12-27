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


///////////////////////////////////////////////////////
/////////////////////// MODELS ////////////////////////
///////////////////////////////////////////////////////

///////////////////// USER MODEL //////////////////////
const User = mongoose.model("User", {
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

////////////////// ACCOUNTS MODEL ////////////////////
const Account = mongoose.model("Account", {
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: [{
    type: String
  }],
  website: {
    type: String
  },
  address: {
    type: String
  },
  address2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip_code: {
    type: String
  },
  type: {
    type: String
  },
  description: {
    type: String
  },
  contacts: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created_at: {
    type: Date,
    // default: Date.now,      // Not currenty used.  This is currently being done before save
    required: true
  },
  created_by_ID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
});

////////////////// CONTACTS MODEL ////////////////////
const Contact = mongoose.model("Contact", {
  salutation: {
    type: String
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String
  },
  email: {
    type: String
  },
  phone: [{
    type: String
  }],
  address: {
    type: String
  },
  address2: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip_code: {
    type: String
  },
  do_not_call: {
    type: Boolean
  },
  description: {
    type: String
  },
  twitter: {
    type: String
  },
  linkedin: {
    type: String
  },
  facebook: {
    type: String
  },
  github: {
    type: String
  },
  account: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  ownerID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  created_at: {
    type: Date,
    required: true
  },
  created_by_ID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
});






/////////////////
// ROUTE CALLS //
/////////////////

//////////////// USER ROUTES /////////////
// ----------- Register User ---------- //
app.post("/users/register", function(request, response) {
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

// ----------- Login User ---------- //
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
            return bluebird.all([
              user,
              token,
              User.update(
                { username: username },
                {
                  $set: {
                    token: token
                  }
                }
              )
            ]);

          } else {
            throw new Error("You are not allowed to enter");
          }
        });
    })
    .then(function(user_information) {
      console.log("\n\n\nHere's the user_information: ", user_information);
      let user = user_information[0];
      let token = user_information[1];
      response.json({
        user_information: user,
        token: token
      });
    })
    .catch(function(error) {
      response.status(401) ;
      response.json({
        message: "Error with login"
      });
    });
});

// ----------- Show All Users --------- //
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

// ----------- Remove User's Token --------- //
// NOT CURRENTLY IN PLACE
// app.post("/users/remove_token", function(request, response) {
//   console.log("I'm in the backend trying to remove a token!");
// });


////////////// ACCOUNT ROUTES /////////////
// ----------- Create Account ---------- //
app.post("/accounts/create", function(request, response) {
  let user_id = request.body.user_id;
  console.log("This is the request sent from the front end: ", request.body);

  let newAccount = new Account({
    name: request.body.account_info.name,
    email: request.body.account_info.email,
    phone: request.body.account_info.phone,
    website: request.body.account_info.website,
    address: request.body.account_info.address,
    address2: request.body.account_info.address2,
    city: request.body.account_info.city,
    state: request.body.account_info.state,
    zip_code: request.body.account_info.zip_code,
    type: request.body.account_info.type,
    description: request.body.account_info.description,
    // contacts: request.body.contacts_info.contacts,     // Not currently working!!!
    ownerID: user_id,
    created_at: new Date(),
    created_by_ID: user_id
  });

  newAccount.save()
    .then(function(result) {
      console.log("Account created successfully: ", result);
      response.json({
        message: "Account created successfully"
      });
    })
    .catch(function(error) {
      response.status(400);
      console.log("Didn't create account because: ", error.stack);
      console.log("\n\n\n");
      console.log("Didn't create account because: ", error);
    });

});

// ---------- Show All Accounts -------- //
app.get("/accounts", function(request, response) {
  console.log("I'm in the backend and want to show you all my accounts");
  Account.find()
    .then(function(accounts) {
      console.log("\nHere are my accounts: \n", accounts);
      response.json({
        accounts: accounts
      });
    })
    .catch(function(error) {
      console.log("There was an error getting the accounts");
      response.status(401) ;
      response.json({
        message: "There was an error getting the accounts"
      });
    });
});

// ---------- Search Accounts --------- //
app.get("/search_accounts/:searchTerm", function (request, response) {
  let searchTerm = request.params.searchTerm;
  let search = "/" + searchTerm + ".*/i"

  console.log("This is the term passed from the front end", searchTerm);
  console.log("This is the search", search);

  Account.find({
    name: eval(search)
  })
    .then(function(results) {
      console.log("There are the search results", results);
      response.json({
        results: results
      })
    })
    .catch(function(error) {
      console.log("There was an error");
    });
});

// ------------ Show Account ---------- //
app.get("/account/view/:accountID", function(request, response) {
  let accountID = request.params.accountID;
  console.log("I'm in the backend", accountID);
  Account.findById(accountID)
    .then(function(account) {
      let account_contact_IDs = account.contacts;
      // console.log("Here are the contacts: ", account_contact_IDs);
      // console.log("\n\nAccount: ", account);

      return Contact.find({
        _id: {
          $in: account_contact_IDs
        }
      })
        .then(function(contacts) {
          console.log("\nHere are the contacts: ", contacts);
          console.log("\nHere is the account: ", account);
          response.json({
            account: account,
            account_contacts: contacts
          });
        })
        .catch(function(error) {
          response.status(400);
          console.log("There was an error looking for the information: ", error.stack);
        });
    })
    .catch(function(error) {
      response.status(400);
      console.log("There was an error looking for that account: ", error.stack);
    });
});

// --------- Add Contact to Account -------- //
app.post("/account/add_contact", function(request, response) {
  let contactID = request.body.contact_id;
  let accountID = request.body.account_id;
  let queryContact = { _id: contactID };
  let queryAccount = { _id: accountID };

  console.log("\n\nContact ID: ", contactID);
  console.log("\n\nAccount ID: ", accountID);
  console.log("\n\n");

  return bluebird.all([
    Account.findOneAndUpdate(queryAccount,
      {
        $addToSet: {
          contacts: contactID
        }
      }
    ),
    Contact.findOneAndUpdate(queryContact,
      {
        $addToSet: {
          account: accountID
        }
      }
    )
  ])
    .then(function(contact, account) {
      console.log("\n\nContact updated: ", contact);
      console.log("\n\nAccount updated: ", account);
      response.json({
        account: account,
        contact: contact
      });
    })
    .catch(function(error) {
      response.status(500);
      console.log("There was an error updating the account: ", error.stack);
    });
});


///////////// CONTACT ROUTES /////////////
// ---------- Create Contacts --------- //
app.post("/contacts/create", function(request, response) {
  let user_id = request.body.user_id;
  console.log("This is the request sent from the front end: ", request.body);

  let newContact = new Contact({
    salutation: request.body.contact_info.salutation,
    first_name: request.body.contact_info.first_name,
    last_name: request.body.contact_info.last_name,
    email: request.body.contact_info.email,
    phone: request.body.contact_info.phone,
    address: request.body.contact_info.address,
    address2: request.body.contact_info.address2,
    city: request.body.contact_info.city,
    state: request.body.contact_info.state,
    zip_code: request.body.contact_info.zip_code,
    description: request.body.contact_info.description,
    account: request.body.contact_info.account,
    ownerID: user_id,
    created_at: new Date(),
    created_by_ID: user_id
  });

  newContact.save()
    .then(function(result) {
      console.log("Contact created successfully: ", result);
      response.json({
        message: "Contact created successfully"
      });
    })
    .catch(function(error) {
      response.status(400);
      console.log("Didn't create contact because: ", error.stack);
    });

});

// ---------- Show All Contacts -------- //
app.get("/contacts", function(request, response) {
  console.log("I'm in the backend and want to show you all my contacts");
  Contact.find()
    .then(function(contacts) {
      console.log("\nHere are my contacts: \n", contacts);
      response.json({
        contacts: contacts
      });
    })
    .catch(function(error) {
      console.log("There was an error getting the contacts");
      response.status(401) ;
      response.json({
        message: "There was an error getting the contacts"
      });
    });
});

// ---------- Search Contacts --------- //
app.get("/search_contacts/:searchTerm", function (request, response) {
  let searchTerm = request.params.searchTerm;
  let search = "/" + searchTerm + ".*/i"

  console.log("This is the term passed from the front end", searchTerm);
  console.log("This is the search", search);

  Contact.find({
    first_name: eval(search)
  })
    .then(function(results) {
      console.log("There are the search results", results);
      response.json({
        results: results
      })
    })
    .catch(function(error) {
      console.log("There was an error");
    });
});

// ------------- Show Contact ----------- //
app.get("/contact/view/:contactID", function(request, response) {
  let contactID = request.params.contactID;
  console.log("I'm in the backend", contactID);
  Contact.findById(contactID)
  .then(function(contact) {
    console.log("This is the contact: ", contact);
    let contact_account_IDs = contact.account;
    console.log("Here are the account IDs: ", contact_account_IDs);

    return Account.find({
      _id: {
        $in: contact_account_IDs
      }
    })
      .then(function(accounts) {
        console.log("\nHere is the contact: ", contact);
        console.log("\nHere are the accounts: ", accounts);
        response.json({
          contact: contact,
          contact_accounts: accounts
        });
      })
      .catch(function(error) {
        response.status(400);
        console.log("There was an error looking for the information: ", error.stack);
      });
  })
  .catch(function(error) {
    response.status(400);
    console.log("There was an error looking for that account: ", error.stack);
  });
});

// --------- Add Account to Contact -------- //
app.post("/contact/add_account", function(request, response) {
  console.log("Body received: ", request.body);
  let accountID = request.body.account_id;
  let contactID = request.body.contact_id;
  let queryAccount = { _id: accountID };
  let queryContact = { _id: contactID };

  console.log("\n\nAccount ID: ", accountID);
  console.log("\n\nContact ID: ", contactID);
  console.log("\n\n");

  return bluebird.all([
    Account.findOneAndUpdate(queryAccount,
      {
        $addToSet: {
          contacts: contactID
        }
      }
    )
  ]),
  Contact.findOneAndUpdate(queryContact,
    {
      $addToSet: {
        account: accountID
      }
    }
  )
    .then(function(contact, account) {
      console.log("\n\nContact updated: ", contact);
      console.log("\n\nAccount updated: ", account);
      response.json({
        contact: contact,
        account: account
      });
    })
    .catch(function(error) {
      response.status(500);
      console.log("There was an error updating the account: ", error.stack);
    });
});





// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
