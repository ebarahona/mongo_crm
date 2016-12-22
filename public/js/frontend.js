var app = angular.module("crm_app", ["ui.router", "ngCookies"]);

///////////////
// FACTORIES //
//////////////
///////////////////// USER FACTORY ///////////////////////
app.factory("UserFactory", function($http) {
  let service = {};


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




  return service;
});


//////////////////
// CONTROLLERS //
/////////////////

///////////////////// HOME CONTROLLER ////////////////////
app.controller("HomeController", function($scope, $state) {
  console.log("I'm using the HomeController");
});


//////////////// USER-SPECIFIC CONTROLLERS ///////////////
app.controller("RegisterController", function($scope, $state, UserFactory) {
  // console.log("I'm using the RegisterController");
  $scope.register = function() {
    var user_registration = $scope.user;
    delete user_registration.password2;
    UserFactory.register(user_registration)
      .then(function(success) {
        console.log("We were successful: ", success);
        $state.go("login");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error.stack);
      });
  };
});

app.controller("LoginController", function($scope, $state, UserFactory) {
  // console.log("I'm using the LoginController");
  $scope.login = function() {
    console.log("You clicked the login button");
    var login_information = $scope.user;
    UserFactory.login(login_information)
      .then(function(success) {
        console.log("We were successful: ", success);
        $state.go("home");
      })
      .catch(function(error) {
        console.log("There was an error!!!", error);
      });
  };
});

app.controller("UsersController", function($scope, UserFactory) {
  console.log("I'm using the UsersController.  Yay!");
  UserFactory.showUsers()
    .then(function(users) {
      $scope.users = users.data.users;
console.log("Here are all the users: ", $scope.users);
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
    url: "/users",
    templateUrl: "views/users.html",
    controller: "UsersController"
  })
  .state({
    name: "register",
    url: "/users/register",
    templateUrl: "views/register.html",
    controller: "RegisterController"
  })
  .state({
    name: "login",
    url: "/users/login",
    templateUrl: "views/login.html",
    controller: "LoginController"
  });

  $urlRouterProvider.otherwise("/");
});
