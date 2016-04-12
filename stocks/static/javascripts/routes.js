// Angular routes

(function(){

  angular.module('stockWatch.routes')
  .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/stocks");
    //
    // Now set up the states
    $stateProvider
      .state('home', {
        url: "/stocks",
        templateUrl: "/static/partials/homepage.html",
        controller: "indexController",
        controllerAs: 'vm'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');
  });

})();