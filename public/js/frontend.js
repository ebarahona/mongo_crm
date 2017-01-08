var app = angular.module("crm_app", ["ui.router", "ngCookies", "ngTouch", "ngAnimate", "ui.bootstrap", "angularFileUpload"]);


////////////////
/// FACTORY ///
///////////////
app.factory("CRM_Factory", function($http, $state, $rootScope, $cookies) {
  var service = {};

  $rootScope.CRM_FactoryCookieData = $cookies.getObject("cookieData");
  // console.log("This is the factory cookie: ", $rootScope.CRM_FactoryCookieData);

  if ($rootScope.CRM_FactoryCookieData) {
    $rootScope.authToken = $rootScope.CRM_FactoryCookieData.data.token;
    $rootScope.logged_user = $rootScope.CRM_FactoryCookieData.data.user_information;
  }


  $rootScope.logout = function() {
    // console.log("Entered the logout function");
    // remove method => pass in the value of the cookie you want to remove
    $cookies.remove('cookieData');
    // reset all the scope variables
    $rootScope.CRM_FactoryCookieData = null;
    $rootScope.authToken = null;
    $rootScope.userID = null;
    $state.go("home");
  };

  ////////////////////////////////////////////////////////////
  ////////////////////// USER SERVICES ///////////////////////
  ////////////////////////////////////////////////////////////

  // Register a user
  service.register = function(user_registration) {
    console.log("I got the user_registration in the factory: ", user_registration);
    return $http({
      method: "POST",
      url: "/users/register",
      data: user_registration
    });
  };

  // Login a user
  service.login = function(login_information) {
    console.log("I'm in the factory and received: ", login_information);
    return $http({
      method: "POST",
      url: "/users/login",
      data: login_information
    });
  };

  // Show all users
  service.showUsers = function() {
    console.log("I'm in the factory trying to show you all the users!!");
    return $http({
      method: "GET",
      url: "/users"
    });
  };

  // Show user
  service.viewUser = function(userID) {
    console.log("I'm in the factory!");
    console.log(userID);
    return $http({
      method: "GET",
      url: "/user/" + userID
    });
  };

  // Update user
  service.updateUser = function(user_info) {
    console.log("In the factory trying to update the user");
    console.log("UserID: ", user_info);
    return $http({
      method: "PUT",
      url: "/user/update",
      data: {
        user_info: user_info
      }
    });
  };

  ////////////////////////////////////////////////////////////
  ///////////////////// ACCOUNT SERVICES /////////////////////
  ////////////////////////////////////////////////////////////

  // Create an account
  service.createAccount = function(account_info) {
    var user_id = $rootScope.logged_user._id;
    console.log("ID of the user that clicked the save account button: ", user_id);
    console.log("Account info: ", account_info);
    return $http({
      method: "POST",
      url: "/accounts/create",
      data: {
        user_id: user_id,
        account_info: account_info
      }
    });
  };

  // Show all accounts
  service.showAccounts = function() {
    console.log("I'm in the factory trying to show you all the accounts!!");
    return $http({
      method: "GET",
      url: "/accounts"
    });
  };

  // View account
  service.viewAccount = function(accountID) {
    // console.log("I'm in the factory to view: ", accountID);
    return $http({
      method: "GET",
      url: "/account/view/" + accountID,
    });
  };

  // Update account
  service.updateAccount = function(account_info) {
    var user_id = $rootScope.logged_user._id;
    console.log("I'm in the factory and will update: ", account_info);
    return $http({
      method: "PUT",
      url: "/account/update",
      data: {
        user_id: user_id,
        account_info: account_info
      }
    });
  };

  // Search accounts
  service.searchAccounts = function(searchTerm) {
    console.log("Term being searched in the factory is: ", searchTerm);
    return $http({
      method: "GET",
      url: "/search_accounts/" + searchTerm
    });
  };

  // Add contact to account
  service.addContactToAccount = function(contactID, accountID) {
    console.log("In the factory.  Here are the IDs sent from the view account page: ", contactID, accountID);
    return $http({
      method: "POST",
      url: "/account/add_contact",
      data: {
        contact_id: contactID,
        account_id: accountID
      }
    });
  };

  ////////////////////////////////////////////////////////////
  ///////////////////// CONTACT SERVICES /////////////////////
  ////////////////////////////////////////////////////////////

  // Create a contact
  service.createContact = function(contact_info) {
    var user_id = $rootScope.logged_user._id;
    console.log("ID of the user that clicked the save contact button: ", user_id);
    console.log("Contact info: ", contact_info);
    return $http({
      method: "POST",
      url: "/contacts/create",
      data: {
        user_id: user_id,
        contact_info: contact_info
      }
    });
  };

  // Show all contacts
  service.showContacts = function() {
    console.log("I'm in the factory trying to show you all the contacts!!");
    return $http({
      method: "GET",
      url: "/contacts"
    });
  };

  // View contact
  service.viewContact = function(contactID) {
    console.log("I'm in the factory and I got this: ", contactID);
    return $http({
      method: "GET",
      url: "/contact/view/" + contactID,
    });
  };

  // Update contact
  service.updateContact = function(contact_info) {
    var user_id = $rootScope.logged_user._id;
    console.log("I'm in the factory and will update: ", contact_info);
    return $http({
      method: "PUT",
      url: "/contact/update",
      data: {
        user_id: user_id,
        contact_info: contact_info
      }
    });
  };

  // Search contacts
  service.searchContacts = function(searchTerm) {
    console.log("Term being searched in the factory is: ", searchTerm);
    return $http({
      method: "GET",
      url: "/search_contacts/" + searchTerm
    });
  };

// Add account to contact
service.addAccountToContact = function(accountID, contactID) {
  console.log("In the factory.  Here are the IDs sent from the view contact page: ", accountID, contactID);
  return $http({
    method: "POST",
    url: "/contact/add_account",
    data: {
      account_id: accountID,
      contact_id: contactID
    }
  });
};


////////////////////////////////////////////////////////////
///////////////////// CALL SERVICES ///////////////////////
////////////////////////////////////////////////////////////

// Create call
service.createCall = function(callInfo) {
  var user_id = $rootScope.logged_user._id;
  console.log("ID of the user that clicked the save contact button: ", user_id);
  console.log("Call info: ", callInfo);
  return $http({
    method: "POST",
    url: "/calls/create",
    data: {
      user_id: user_id,
      call_info: callInfo
    }
  });
};

// Show all calls
service.showCalls = function() {
  console.log("I'm in the factory");
  return $http({
    method: "GET",
    url: "/calls"
  });
};

// View call
service.viewCall = function(callID) {
  console.log("I'm in the factory and I got this: ", callID);
  return $http({
    method: "GET",
    url: "/call/view/" + callID,
  });
};


////////////////////////////////////////////////////////////
///////////////////// COMMENT SERVICES /////////////////////
////////////////////////////////////////////////////////////
service.saveComment = function(comment, accountID) {
  var user_id = $rootScope.logged_user._id;
  return $http({
    method: "POST",
    url: "/comments/create",
    data: {
      user_id: user_id,
      comment_text: comment,
      account_id: accountID
    }
  });
};

service.viewComments = function(accountID) {
  console.log("I got an account_id in the factory: ", accountID);
  return $http({
    method: "GET",
    url: "/comments/view/" + accountID,
  });
};


////////////////////////////////////////////////////////////
///////////////////// GENERAL SERVICES /////////////////////
////////////////////////////////////////////////////////////
service.searchParent = function(searchInfo) {
  var parent = searchInfo.selected_parent;
  var searchTerm = searchInfo.linked_to_search;
  var url = "/search_parent/" + parent + "/" + searchTerm;

  return $http({
    method: "GET",
    url: url
  });
};

service.ViewUserCallsSmallView = function(searchID) {
  console.log("ID to search: ", searchID);

  return $http({
    method: "GET",
    url: "/view/user/calls_small_view/" + searchID,
  });
};

service.ViewAccountCallsSmallView = function(searchID) {
  console.log("ID to search: ", searchID);

  return $http({
    method: "GET",
    url: "/view/account/calls_small_view/" + searchID,
  });
};

service.ViewContactCallsSmallView = function(searchID) {
  console.log("ID to search: ", searchID);

  return $http({
    method: "GET",
    url: "/view/contact/calls_small_view/" + searchID,
  });
};







  return service;
});


///////////////////////////////////////////////////////
///////////////////// CONTROLLERS /////////////////////
///////////////////////////////////////////////////////

///////////////// HOME CONTROLLER /////////////////
app.controller("HomeController", function($scope, $state, CRM_Factory) {
  console.log("I'm using the HomeController");
});


//////////// USER-SPECIFIC CONTROLLERS ///////////
app.controller("RegisterController", function($scope, $state, CRM_Factory) {
  // console.log("I'm using the RegisterController");
  $scope.user = {};
  $scope.register = function() {
    // var user_registration = $scope.user;
    var user_registration = $scope.user;
    var password2 = $scope.user.password2;
    console.log("password2", password2);
    console.log("user_registration: ", user_registration);
    delete user_registration.password2;
    CRM_Factory.register(user_registration)
      .then(function(success) {
        console.log("We were successful: ", success);
        $state.go("login");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };
});

// Need to update later to have the avatar upload
// app.controller("RegisterController", function($scope, $state, CRM_Factory) {
//   console.log("I'm using the RegisterController");
//   $scope.user = {};
//   $scope.register = function() {
//     console.log("I clicked the register button");
//     var user_registration = $scope.user;
//     console.log("User registration: ", user_registration);
//     var image = $scope.user.profile_image;
//     console.log("Image: ", image);
//   };
// });

app.controller("LoginController", function($scope, $state, $cookies, $rootScope, CRM_Factory) {
  $scope.user = {
    username: "",
    password: ""
  };
  console.log("I'm using the LoginController");
  $scope.login = function() {
    console.log("You clicked the login button");
    var login_information = $scope.user;
    CRM_Factory.login(login_information)
      .then(function(login_result) {
        console.log("We were successful: ", login_result);
        $cookies.putObject("cookieData", login_result);
        $rootScope.cookie_data = login_result;
        $rootScope.logged_user = login_result.data.user_information;
        $rootScope.authToken = login_result.data.token;
        // $route.reload();
        console.log("username", $scope.user.username);
        $state.go("home");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };
});

app.controller("UsersController", function($scope, CRM_Factory) {
  // console.log("I'm using the UsersController.  Yay!");
  CRM_Factory.showUsers()
    .then(function(users) {
      $scope.users = users.data.users;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("ViewUserController", function($scope, $state, $stateParams, $rootScope, CRM_Factory) {
  var user_id = $stateParams.userID;
  console.log("user_id: ", user_id);

  // Scroll to top when loading page (need this when coming from another page)
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  $state.go("view_user.comments");

  CRM_Factory.viewUser(user_id)
    .then(function(user) {
      console.log("Here's the user: ", user);
      $scope.user = user.data.user[0];
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("EditUserController", function($scope, $state, $stateParams, $rootScope, CRM_Factory, FileUploader) {

  var user_id = $stateParams.userID;
  console.log("user_id: ", user_id);
  // $scope.user = {};
  // Scroll to top when loading page (need this when coming from another page)
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  $scope.viewUser = function() {
    CRM_Factory.viewUser(user_id)
      .then(function(user) {

        $scope.user = user.data.user[0];
        console.log("Here's the rootscope user: ", $scope.user);
        delete $scope.user.password;
        console.log("Here's the user: ", $scope.user);
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };

  // load view user initally when the page loads
  $scope.viewUser();

  var uploader = $scope.uploader = new FileUploader({
    url: "/upload_profile_image/" + user_id
  });

  uploader.onSuccessItem = function(response, status) {
    console.info('onSuccessItem', response, status);
    $scope.viewUser();
    console.log("I can see me after uploading an image");
  };

  $scope.updateUser = function() {
    var user_information = $scope.user;
    console.log("user_information: ", user_information);
    console.log("Clicked the update button!");
    CRM_Factory.updateUser(user_information)
      .then(function(success) {
        console.log("\n\n\nWe were successful: ", success);
        // Go back to view the updated account
        $state.go("view_user", {userID: user_id});
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

});


//////////// ACCOUNT-SPECIFIC CONTROLLERS ///////////
app.controller("CreateAccountController", function($scope, $state, CRM_Factory) {
  console.log("I'm using the CreateAccountController.  Yay!");
  $scope.saveAccount = function() {
    var account_information = $scope.account;
    console.log("Account information: ", account_information);
    CRM_Factory.createAccount(account_information)
      .then(function(success) {
        console.log("We were successful: ", success);
        $state.go("accounts");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };
});

app.controller("AccountsController", function($scope, $rootScope, $state, CRM_Factory) {
  console.log("I'm using the AccountsController.  Yay!");

  $scope.createAccount = function() {
    console.log("Clicked the createAccount button");
    $state.go("create_account");
  };

  CRM_Factory.showAccounts()
    .then(function(accounts) {
      $scope.accounts = accounts.data.accounts;
      console.log("Accounts from backend:",  $scope.accounts);
      $state.go("accounts");
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("ViewAccountController", function($scope, $stateParams, $state, CRM_Factory) {
  var account_id = $stateParams.accountID;

  console.log("I'm in the ViewAccountController");
  // console.log("stateParams", $stateParams);

  // Scroll to top when loading page (need this when coming from a contact)
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  $state.go("view_account.comments");

  CRM_Factory.viewAccount(account_id)
    .then(function(account_info) {
      console.log("\n\nThis is the account_info: ", account_info);
      $scope.account = account_info.data.account;
      $scope.account_contacts = account_info.data.account_contacts;
      $scope.account_owner = account_info.data.user[0];
      // console.log("\nThe account: ", $scope.account);
      // console.log("\nThe contacts: ", $scope.account_contacts);
      // console.log("\nThe account owner: ", $scope.account_owner);
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });

  $scope.searchContacts = function(event) {
    console.log("Event is: ", event);
    if (event.keyCode === 8) {
      console.log("This is the event: ", event);
      $scope.contacts = "";
    } else if (event.keyCode === 16) {
      console.log("This is the event: ", event);
    } else {
      CRM_Factory.searchContacts($scope.account.contacts_search)
        .then(function(contacts) {
          console.log("Here are the contacts: ", contacts);
          $scope.contacts = contacts.data.results;
        })
        .catch(function(error) {
          console.log("There was an error!!!", error);
        });
    }
  };

  $scope.addContactToAccount = function(contactID, accountID) {
    console.log("Here's ID of the contact you clicked: ", contactID);
    console.log("Here's the ID of the account you are viewing: ", accountID);
    CRM_Factory.addContactToAccount(contactID, accountID)
      .then(function(updated_information) {
        console.log("Here's the updated_information", updated_information);
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };
});

app.controller("EditAccountController", function($scope, $stateParams, $state, CRM_Factory) {
  console.log("Using the EditAccountController");
  console.log("stateParams", $stateParams);

  // Scroll to top when loading page (need this when coming from a contact)
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  var account_id = $stateParams.accountID;

  $scope.viewAccount = function() {
    CRM_Factory.viewAccount(account_id)
      .then(function(account_info) {
        console.log("\n\nThis is the account_info: ", account_info);
        $scope.account = account_info.data.account;
        $scope.account_contacts = account_info.data.account_contacts;
        $scope.account_owner = account_info.data.user[0];
        console.log("\nThe account: ", $scope.account);
        console.log("\nThe contacts: ", $scope.account_contacts);
        console.log("\nThe account owner: ", $scope.account_owner);
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };

  // Call viewAccount after loading page
  $scope.viewAccount();


  $scope.searchContacts = function(event) {
    console.log("Event is: ", event);
    if (event.keyCode === 8) {
      console.log("This is the event: ", event);
      $scope.contacts = "";
    } else if (event.keyCode === 16) {
      console.log("This is the event: ", event);
    } else {
      CRM_Factory.searchContacts($scope.account.contacts_search)
        .then(function(contacts) {
          console.log("Here are the contacts: ", contacts);
          $scope.contacts = contacts.data.results;
        })
        .catch(function(error) {
          console.log("There was an error!!!", error);
        });
    }
  };

  $scope.addContactToAccount = function(contactID, accountID) {
    console.log("Here's ID of the contact you clicked: ", contactID);
    console.log("Here's the ID of the account you are viewing: ", accountID);
    CRM_Factory.addContactToAccount(contactID, accountID)
      .then(function(updated_information) {
        console.log("Here's the updated_information", updated_information);
        $scope.account.contacts_search = "";
        // Reload account information after adding contact
        $scope.viewAccount();
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };

  $scope.saveAccount = function() {
    var account_information = $scope.account;
    console.log("Account information: ", account_information);
    CRM_Factory.updateAccount(account_information)
      .then(function(success) {
        console.log("\n\n\nWe were successful: ", success);
        console.log("\n\naccount_information._id: ", account_information._id);
        // Go back to view the updated account
        $state.go("view_account", {accountID: account_information._id});
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };
});


//////////// COMMENT-SPECIFIC CONTROLLERS ///////////
app.controller("AccountCommentsController", function($scope, $state, $stateParams, CRM_Factory) {
  var account_id = $stateParams.accountID;
  console.log("Account ID: ", account_id);

  CRM_Factory.viewComments(account_id)
    .then(function(comments) {
      console.log("Comments for account: ", comments);
      $scope.comments = comments.data.comments;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error.stack);
    });

  $scope.saveComment = function() {
    var comment = $scope.comment;
    var account_id = $scope.account._id;
    console.log("Comment after clicking the save button: ", comment);
    console.log("Account id: ", account_id);
    CRM_Factory.saveComment(comment, account_id)
      .then(function(success) {
        $scope.comment = "";
        // Request all comments from the database
        $scope.reload();
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

  $scope.reload = function() {
    CRM_Factory.viewComments(account_id)
      .then(function(comments) {
        console.log("Comments for account: ", comments);
        $scope.comments = comments.data.comments;
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

});

app.controller("ContactCommentsController", function($scope, $state, $stateParams, CRM_Factory) {
  var contact_id = $stateParams.contactID;
  console.log("Contact ID: ", contact_id);

  CRM_Factory.viewComments(contact_id)
    .then(function(comments) {
      console.log("Comments for contact: ", comments);
      $scope.comments = comments.data.comments;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error.stack);
    });

  $scope.saveComment = function() {
    var comment = $scope.comment;
    var contact_id = $scope.contact._id;
    console.log("Comment after clicking the save button: ", comment);
    console.log("Contact id: ", contact_id);
    CRM_Factory.saveComment(comment, contact_id)
      .then(function(success) {
        $scope.comment = "";
        // Request all comments from the database
        $scope.reload();
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

  $scope.reload = function() {
    CRM_Factory.viewComments(contact_id)
      .then(function(comments) {
        console.log("Comments for contact: ", comments);
        $scope.comments = comments.data.comments;
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

});

app.controller("UserCommentsController", function($scope, $state, $stateParams, CRM_Factory) {
  var user_id = $stateParams.userID;
  console.log("User ID: ", user_id);

  CRM_Factory.viewComments(user_id)
    .then(function(comments) {
      console.log("Comments for user: ", comments);
      $scope.comments = comments.data.comments;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error.stack);
    });

  $scope.saveComment = function() {
    var comment = $scope.comment;
    var user_id = $scope.logged_user._id;
    console.log("Comment after clicking the save button: ", comment);
    console.log("User id: ", user_id);
    CRM_Factory.saveComment(comment, user_id)
      .then(function(success) {
        $scope.comment = "";
        // Request all comments from the database
        $scope.reload();
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

  $scope.reload = function() {
    CRM_Factory.viewComments(user_id)
      .then(function(comments) {
        console.log("Comments for user: ", comments);
        $scope.comments = comments.data.comments;
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

});


//////////// CONTACT-SPECIFIC CONTROLLERS ///////////
app.controller("CreateContactController", function($scope, $state, CRM_Factory) {
  console.log("I'm using the CreateContactController.  Yay!");
  $scope.saveContact = function() {
    var contact_information = $scope.contact;
    console.log("Contact information: ", contact_information);
    CRM_Factory.createContact(contact_information)
      .then(function(success) {
        console.log("We were successful: ", success);
        $state.go("contacts");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };
});

app.controller("ContactsController", function($scope, $rootScope, $state, CRM_Factory) {
  console.log("I'm using the ContactsController.  Yay!");

  $scope.sortType = "first_name"; // set the default sort type
  $scope.sortReverse = false;  // set the default sort order

  $scope.createContact = function() {
    $state.go("create_contact");
  };

  CRM_Factory.showContacts()
    .then(function(contacts) {
      $scope.contacts = contacts.data.contacts;
      console.log("Contacts from backend:",  $scope.contacts);
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("ViewContactController", function($scope, $state, $stateParams, CRM_Factory) {
  var contact_id = $stateParams.contactID;

  console.log("I'm inside the ViewContactController");
  console.log("stateParams", $stateParams);

  // Scroll to top when loading page (need this when coming from an account)
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  $state.go("view_contact.comments");

  CRM_Factory.viewContact(contact_id)
  .then(function(contact_info) {
    console.log("\n\nThis is the contact_info: ", contact_info);
    $scope.contact = contact_info.data.contact;
    $scope.contact_accounts = contact_info.data.contact_accounts;
    $scope.contact_owner = contact_info.data.user[0];
    console.log("\nThe contact: ", $scope.contact);
    console.log("\nThe accounts: ", $scope.contact_accounts);
    console.log("\nThe contact owner: ", $scope.contact_owner);
  })
  .catch(function(error) {
    console.log("There was an error!!!", error);
  });

  $scope.searchAccounts = function(event) {
    console.log("Event is: ", event);
    if (event.keyCode === 8) {
      console.log("This is the event.keyCode 8: ", event);
      $scope.accounts = "";
    } else if (event.keyCode === 16) {
      console.log("This is the event.keyCode 16: ", event);
    } else {
      console.log("$scope.contact.accounts_search", $scope.contact.accounts_search);
      CRM_Factory.searchAccounts($scope.contact.accounts_search)
        .then(function(accounts) {
          console.log("Here are the accounts: ", accounts);
          $scope.accounts = accounts.data.results;
        })
        .catch(function(error) {
          console.log("There was an error!!!", error);
        });
    }
  };

  $scope.addAccountToContact = function(accountID, contactID) {
    console.log("Here's ID of the account you clicked: ", accountID);
    console.log("Here's the ID of the contact you are viewing: ", contactID);
    CRM_Factory.addAccountToContact(accountID, contactID)
      .then(function(updated_information) {
        console.log("Here's the updated_information", updated_information);
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };
});

app.controller("EditContactController", function($scope, $stateParams, $state, CRM_Factory) {
  console.log("I'm inside the EditContactController");
  console.log("stateParams", $stateParams);

  // Scroll to top when loading page (need this when coming from an account)
  document.body.scrollTop = document.documentElement.scrollTop = 0;

  var contact_id = $stateParams.contactID;

  CRM_Factory.viewContact(contact_id)
  .then(function(contact_info) {
    console.log("\n\nThis is the contact_info: ", contact_info);
    $scope.contact = contact_info.data.contact;
    $scope.contact_accounts = contact_info.data.contact_accounts;
    $scope.contact_owner = contact_info.data.user[0];
    console.log("\nThe contact: ", $scope.contact);
    console.log("\nThe accounts: ", $scope.contact_accounts);
    console.log("\nThe contact owner: ", $scope.contact_owner);
  })
  .catch(function(error) {
    console.log("There was an error!!!", error);
  });

  $scope.searchAccounts = function(event) {
    console.log("Event is: ", event);
    if (event.keyCode === 8) {
      console.log("This is the event.keyCode 8: ", event);
      $scope.accounts = "";
    } else if (event.keyCode === 16) {
      console.log("This is the event.keyCode 16: ", event);
    } else {
      console.log("$scope.contact.accounts_search", $scope.contact.accounts_search);
      CRM_Factory.searchAccounts($scope.contact.accounts_search)
        .then(function(accounts) {
          console.log("Here are the accounts: ", accounts);
          $scope.accounts = accounts.data.results;
        })
        .catch(function(error) {
          console.log("There was an error!!!", error);
        });
    }
  };

  $scope.addAccountToContact = function(accountID, contactID) {
    console.log("Here's ID of the account you clicked: ", accountID);
    console.log("Here's the ID of the contact you are viewing: ", contactID);
    CRM_Factory.addAccountToContact(accountID, contactID)
      .then(function(updated_information) {
        console.log("Here's the updated_information", updated_information);
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };

  $scope.saveContact = function() {
    var contact_information = $scope.contact;
    console.log("Contact information: ", contact_information);
    CRM_Factory.updateContact(contact_information)
      .then(function(success) {
        console.log("\n\n\nWe were successful: ", success);
        console.log("\n\ncontact_information._id: ", contact_information._id);
        // Go back to view the updated contact
        $state.go("view_contact", {contactID: contact_information._id});
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };

});

//////////// CALL-SPECIFIC CONTROLLERS ///////////
app.controller("CallsController", function($scope, $state, CRM_Factory) {
  console.log("I'm using the CallsController.  Yay!");

  $scope.createCall = function() {
    console.log("Clicked the createCall button");
    $state.go("create_call");
  };

  CRM_Factory.showCalls()
    .then(function(calls) {
      $scope.calls = calls.data.calls;
      console.log("Calls from backend:",  $scope.calls);
      // $state.go("calls");
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("CreateCallController", function($scope, $state, CRM_Factory) {
  // $scope.call.selected_parent = "";
  $scope.call_parents = ["Account", "Contact"];
  $scope.call_statuses = ["Planned", "Held", "Not Held"];

  $scope.searchParent = function(event) {
    console.log("Event is: ", event);
    if (event.keyCode === 8) {
      // console.log("This is the event.keyCode 8: ", event);
      $scope.results = "";
    } else if (event.keyCode === 16) {
      // console.log("This is the event.keyCode 16: ", event);
    } else {
      var selected_parent = $scope.call.selected_parent;
      var linked_to_search = $scope.call.linked_to_search;
      var chosen_result_id = $scope.call.chosen_result_id;
      var searchInfo = {
        selected_parent: selected_parent,
        linked_to_search: linked_to_search,
        chosen_result_id: chosen_result_id
      };
      console.log("searchInfo: ", searchInfo);
      CRM_Factory.searchParent(searchInfo)
        .then(function(response) {
          console.log("Here is the response: ", response);
          var type = response.data.type;
          console.log("This is the type: ", type);
          $scope.results = response.data.results;
          console.log("These are the results: ", $scope.results);
        })
        .catch(function(error) {
          console.log("There was an error!!!", error);
        });
    }
  };

  $scope.addResult = function(resultID, resultName, resultFirstName, resultLastName) {
    console.log("Clicked the chosen result: ", resultID, resultName, resultFirstName, resultLastName);
    // Clear out search area
    $scope.call.linked_to_search = "";
    // Clear out the results
    $scope.results = "";
    $scope.resultID = resultID;
    if (resultName) {
      console.log("I am account");
      $scope.call.chosen_result = resultName;
      $scope.call.chosen_result_id = resultID;
      console.log($scope.call.chosen_result);
    } else {
      console.log("I am a contact");
      var first_name = resultFirstName;
      var last_name = resultLastName;
      $scope.call.chosen_result = first_name + " " + last_name;
      $scope.call.chosen_result_id = resultID;
      console.log($scope.call.chosen_result);
    }
  };

  $scope.clearFields = function() {
    console.log("I'm clearing the fields");
    $scope.call.linked_to_search = "";
    // $scope.results = "";
    $scope.call.chosen_result = "";
  };

  $scope.saveCall = function() {
    console.log("Clicked the save button");
    var call_information = $scope.call;
    console.log("Here is the call_information: ", call_information);
    CRM_Factory.createCall(call_information)
      .then(function(success) {
        console.log("We were successful: ", success);
        $state.go("calls");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };
});

app.controller("ViewCallController", function($scope, $stateParams, CRM_Factory) {
  console.log("I'm inside the ViewCallController");
  console.log("stateParams", $stateParams);

  // Scroll to top when loading page (need this when coming from an account)
  // document.body.scrollTop = document.documentElement.scrollTop = 0;

  var call_id = $stateParams.callID;

  CRM_Factory.viewCall(call_id)
  .then(function(call_info) {
    console.log("\n\nThis is the call_info: ", call_info);
    $scope.call = call_info.data.call;
    // $scope.call_accounts = call_info.data.call_accounts;
    console.log("\nThe call: ", $scope.call);
    // console.log("\nThe accounts: ", $scope.call_accounts);
  })
  .catch(function(error) {
    console.log("There was an error!!!", error);
  });

  // $scope.searchAccounts = function(event) {
  //   console.log("Event is: ", event);
  //   if (event.keyCode === 8) {
  //     console.log("This is the event.keyCode 8: ", event);
  //     $scope.accounts = "";
  //   } else if (event.keyCode === 16) {
  //     console.log("This is the event.keyCode 16: ", event);
  //   } else {
  //     console.log("$scope.call.accounts_search", $scope.call.accounts_search);
  //     CRM_Factory.searchAccounts($scope.call.accounts_search)
  //       .then(function(accounts) {
  //         console.log("Here are the accounts: ", accounts);
  //         $scope.accounts = accounts.data.results;
  //       })
  //       .catch(function(error) {
  //         console.log("There was an error!!!", error);
  //       });
  //   }
  // };
  //
  // $scope.addAccountToContact = function(accountID, callID) {
  //   console.log("Here's ID of the account you clicked: ", accountID);
  //   console.log("Here's the ID of the call you are viewing: ", callID);
  //   CRM_Factory.addAccountToContact(accountID, callID)
  //     .then(function(updated_information) {
  //       console.log("Here's the updated_information", updated_information);
  //     })
  //     .catch(function(error) {
  //       console.log("There was an error!!!", error);
  //     });
  // };
});


//////////// CALLS-SPECIFIC CONTROLLERS ///////////
app.controller("UserCallsSmallViewController", function($scope, $stateParams, CRM_Factory) {
  var userID = $stateParams.userID;
  console.log("Using the UserCallsSmallViewController: ", userID);

  CRM_Factory.ViewUserCallsSmallView(userID)
    .then(function(calls) {
      console.log("calls: ", calls);
      $scope.calls = calls.data.calls;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("AccountCallsSmallViewController", function($scope, $stateParams, CRM_Factory) {
  var accountID = $stateParams.accountID;
  console.log("Using the AccountCallsSmallViewController: ", accountID);

  CRM_Factory.ViewAccountCallsSmallView(accountID)
    .then(function(calls) {
      console.log("calls: ", calls);
      $scope.calls = calls.data.calls;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});

app.controller("ContactCallsSmallViewController", function($scope, $stateParams, CRM_Factory) {
  var contactID = $stateParams.contactID;
  console.log("Using the ContactCallsSmallViewController: ", contactID);

  CRM_Factory.ViewContactCallsSmallView(contactID)
    .then(function(calls) {
      console.log("calls: ", calls);
      $scope.calls = calls.data.calls;
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });
});






//////////////////
//    ROUTES    //
/////////////////
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state({
    name: "home",
    url: "/",
    templateUrl: "views/home.html",
    controller: "HomeController"
  })
  .state({
    name: "register",
    url: "/User/register",
    templateUrl: "views/user/register.html",
    controller: "RegisterController"
  })
  .state({
    name: "login",
    url: "/User/login",
    templateUrl: "views/user/login.html",
    controller: "LoginController"
  })
  .state({
    name: "users",
    url: "/Users",
    templateUrl: "views/user/users.html",
    controller: "UsersController"
  })
  .state({
    name: "view_user",
    url: "/Users/view/{userID}",
    templateUrl: "views/user/view_user.html",
    controller: "ViewUserController"
  })
  .state({
    name: "view_user.comments",
    url: "/comments",
    templateUrl: "views/user/user_comments.html",
    controller: "UserCommentsController"
  })
  .state({
    name: "view_user.calls",
    url: "/calls",
    templateUrl: "views/call/calls_small_view.html",
    controller: "UserCallsSmallViewController"
  })
  .state({
    name: "edit_user",
    url: "/User/edit/{userID}",
    templateUrl: "views/user/edit_user.html",
    controller: "EditUserController"
  })
  .state({
    name: "accounts",
    url: "/Accounts",
    templateUrl: "views/account/accounts.html",
    controller: "AccountsController"
  })
  .state({
    name: "create_account",
    url: "/Account/create",
    templateUrl: "views/create_account.html",
    controller: "CreateAccountController"
  })
  .state({
    name: "view_account",
    url: "/Account/view/{accountID}",
    templateUrl: "views/account/view_account.html",
    controller: "ViewAccountController"
  })
  .state({
    name: "view_account.comments",
    url: "/comments",
    templateUrl: "views/account/account_comments.html",
    controller: "AccountCommentsController"
  })
  .state({
    name: "view_account.calls",
    url: "/calls",
    templateUrl: "views/calls/calls_small_view.html",
    controller: "AccountCallsSmallViewController"
  })
  .state({
    name: "edit_account",
    url: "/Account/edit/{accountID}",
    templateUrl: "views/account/edit_account.html",
    controller: "EditAccountController"
  })
  .state({
    name: "contacts",
    url: "/Contacts",
    templateUrl: "views/contact/contacts.html",
    controller: "ContactsController"
  })
  .state({
    name: "create_contact",
    url: "/Contact/create",
    templateUrl: "views/create_contact.html",
    controller: "CreateContactController"
  })
  .state({
    name: "view_contact",
    url: "/Contact/view/{contactID}",
    templateUrl: "views/contact/view_contact.html",
    controller: "ViewContactController"
  })
  .state({
    name: "view_contact.comments",
    url: "/comments",
    templateUrl: "views/contact/contact_comments.html",
    controller: "ContactCommentsController"
  })
  .state({
    name: "view_contact.calls",
    url: "/calls",
    templateUrl: "views/calls/calls_small_view.html",
    controller: "ContactCallsSmallViewController"
  })
  .state({
    name: "edit_contact",
    url: "/Contact/edit/{contactID}",
    templateUrl: "views/contact/edit_contact.html",
    controller: "EditContactController"
  })
  .state({
    name: "calls",
    url: "/Calls",
    templateUrl: "views/call/calls.html",
    controller: "CallsController"
  })
  .state({
    name: "create_call",
    url: "/Call/create",
    templateUrl: "views/create_call.html",
    controller: "CreateCallController"
  })
  .state({
    name: "view_call",
    url: "/Call/view/{callID}",
    templateUrl: "views/call/view_call.html",
    controller: "ViewCallController"
  })
  ;

  $urlRouterProvider.otherwise("/");
});
