// Angular app module

(function(){

  angular.module('stockWatch',['stockWatch.routes','stockWatch.controllers','stockWatch.services','angular-loading-bar']);

  angular.module('stockWatch.routes',['ui.router']);

})();