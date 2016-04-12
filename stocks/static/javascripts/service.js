// Angular services

(function(){

  angular.module('stockWatch.services',[])
    .factory('Layout',Layout);

    Layout.$inject = ['$http'];

    function Layout($http){

      var BASE_URL = "http://localhost:8000/";

      var Layout = {
        get_stocks :      get_stocks,
        delete_stock:     delete_stock,
        validate_symbol:  validate_symbol,
        add_stock:        add_stock
      };

      return Layout;

      function get_stocks(){
        return $http.get(BASE_URL + "stocks/portfolio");
      }

      function delete_stock(id){
        return $http.delete(BASE_URL + "api/stocks/" + id.toString());
      }

      function validate_symbol(symbol){
        return $http.get(BASE_URL + "stocks/validateSymbol?symbol=" + symbol)
        .success(function(){
        });
      }

      function add_stock(data){
        return $http.post(BASE_URL + "api/stocks/",data);
      }

    };

})();