// Angular routes

(function(){

  angular.module('stockWatch.routes')
  .config(function($stateProvider, $urlRouterProvider,$locationProvider) {
    
    // For any unmatched url, redirect to /state1
    // $urlRouterProvider.otherwise("/");
    //
    // Now set up the states
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "/static/partials/homepage.html",
        controller: "indexController",
        controllerAs: 'vm'
      })
      .state('company',{
        url: "/:name",
        templateUrl: "/static/partials/company.html",
        controller: "companyDetailsController",
        controllerAs: 'vm'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $locationProvider.hashPrefix('!');
  });

})();