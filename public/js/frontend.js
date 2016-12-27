var app = angular.module("crm_app", ["ui.router", "ngCookies"]);


////////////////
/// FACTORY ///
///////////////
app.factory("CRM_Factory", function($http, $state, $rootScope, $cookies) {
  var service = {};

  $rootScope.CRM_FactoryCookieData = $cookies.getObject("cookieData");
  // console.log("This is the factory cookie: ", $rootScope.CRM_FactoryCookieData);

  if ($rootScope.CRM_FactoryCookieData) {
    $rootScope.authToken = $rootScope.CRM_FactoryCookieData.data.token;
    $rootScope.user = $rootScope.CRM_FactoryCookieData.data.user_information;
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

  ////////////////////////////////////////////////////////////
  ///////////////////// ACCOUNT SERVICES /////////////////////
  ////////////////////////////////////////////////////////////

  // Create an account
  service.createAccount = function(account_info) {
    var user_id = $rootScope.user._id;
    console.log("I'm in the Factory -- Account Services");
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
    console.log("I'm in the factory and I got this: ", accountID);
    return $http({
      method: "GET",
      url: "/account/view/" + accountID,
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
    var user_id = $rootScope.user._id;
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

  // Search contacts
  service.searchContacts = function(searchTerm) {
    console.log("Term being searched in the factory is: ", searchTerm);
    return $http({
      method: "GET",
      url: "/search_contacts/" + searchTerm
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






  return service;
});


///////////////////////////////////////////////////////
///////////////////// CONTROLLERS /////////////////////
///////////////////////////////////////////////////////

///////////////////// HOME CONTROLLER ////////////////////
app.controller("HomeController", function($scope, $state, CRM_Factory) {
  console.log("I'm using the HomeController");
});


//////////// USER-SPECIFIC CONTROLLERS ///////////
app.controller("RegisterController", function($scope, $state, CRM_Factory) {
  // console.log("I'm using the RegisterController");
  $scope.register = function() {
    var user_registration = $scope.user;
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
        $rootScope.user = login_result.data.user_information;
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

  // $scope.sortType = "name"; // set the default sort type
  // $scope.sortReverse = false;  // set the default sort order

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

app.controller("ViewAccountController", function($scope, $stateParams, CRM_Factory) {
  console.log("I'm in the ViewAccountController");
  console.log("stateParams", $stateParams);
  var account_id = $stateParams.accountID;
  CRM_Factory.viewAccount(account_id)
    .then(function(account_info) {
      console.log("\n\nThis is the account_info: ", account_info);
      $scope.account = account_info.data.account;
      $scope.account_contacts = account_info.data.account_contacts;
      console.log("\nThe account: ", $scope.account);
      console.log("\nThe contacts: ", $scope.account_contacts);
    })
    .catch(function(error) {
      console.log("There was an error!!!", error);
    });

  $scope.searchContacts = function(event) {
    console.log("Event is: ", event);
    if (event.keyCode === 8) {
      console.log('here!');
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

app.controller("ViewContactController", function($scope, $stateParams, CRM_Factory) {
  console.log("I'm inside the ViewContactController");
  console.log("stateParams", $stateParams);
  var contact_id = $stateParams.contactID;

  CRM_Factory.viewContact(contact_id)
  .then(function(contact_info) {
    console.log("\n\nThis is the contact_info: ", contact_info);
    $scope.contact = contact_info.data.contact;
    $scope.contact_accounts = contact_info.data.contact_accounts;
    console.log("\nThe contact: ", $scope.contact);
    console.log("\nThe accounts: ", $scope.contact_accounts);
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
    name: "users",
    url: "/Users",
    templateUrl: "views/users.html",
    controller: "UsersController"
  })
  .state({
    name: "register",
    url: "/User/register",
    templateUrl: "views/register.html",
    controller: "RegisterController"
  })
  .state({
    name: "login",
    url: "/User/login",
    templateUrl: "views/login.html",
    controller: "LoginController"
  })
  .state({
    name: "accounts",
    url: "/Accounts",
    templateUrl: "views/accounts.html",
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
    templateUrl: "views/view_account.html",
    controller: "ViewAccountController"
  })
  .state({
    name: "contacts",
    url: "/Contacts",
    templateUrl: "views/contacts.html",
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
    templateUrl: "views/view_contact.html",
    controller: "ViewContactController"
  });

  $urlRouterProvider.otherwise("/");
});
