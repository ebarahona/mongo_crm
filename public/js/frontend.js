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
  });

  $urlRouterProvider.otherwise("/");
});
