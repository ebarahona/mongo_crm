var app = angular.module("crm_app", ["ui.router", "ngCookies"]);

///////////////
// FACTORIES //
//////////////
///////////////////// USER FACTORY ///////////////////////
app.factory("UserFactory", function($http) {
  let service = {};

  service.register = function(user_registration) {
    console.log("I got the user_registration in the factory: ", user_registration);
    return $http({
      method: "POST",
      url: "/users/register",
      data: user_registration
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


///////////////////// USER CONTROLLER ////////////////////
app.controller("UserController", function($scope, $state, UserFactory) {
  // console.log("I'm using the UserController");
  $scope.register = function() {
    var user_registration = $scope.user;
    delete user_registration.password2;
    UserFactory.register(user_registration);
      // .then(function(success) {
      //   console.log("We were successful: ", success);
      // })
      // .catch(function(error) {
      //   console.log("There was an error!!!", error.stack);
      // });
  };
});



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
    url: "/users/register",
    templateUrl: "views/register.html",
    controller: "UserController"
  });

  $urlRouterProvider.otherwise("/");
});
