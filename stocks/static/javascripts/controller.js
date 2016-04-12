// Required controllers

(function(){

  angular.module('stockWatch.controllers',[])
    .controller('indexController', indexController);

  indexController.$inject = ['$scope','Layout','$interval'];

  function indexController($scope,Layout, $interval){

    var vm = this;
    vm.get_stocks = get_stocks;
    vm.setInterval = 60*5;
    vm.notification_text = "";
    vm.addStock =  add_stock;
    vm.stock_operation = "";
    vm.stock_id = 0;
    vm.formdata = {};
    vm.formdata.symbol = "";
    vm.formdata.company_name = "";
    vm.portfolio = {};
    vm.portfolio.invested_amount = 0;
    vm.portfolio.change = 0;
    vm.portfolio.percent_change = 0;

    // Scope variables
    $scope.selected_stock = -1;

    vm.get_stocks();

    $interval(vm.get_stocks, 1000*vm.setInterval);

    $scope.$watch(function(){return vm.formdata.symbol},function(){
      if (vm.formdata.symbol !== undefined) {
        if(vm.formdata.symbol.length > 0){
          Layout.validate_symbol(vm.formdata.symbol)
          .then(function(response){
            if (response.data.is_valid == true) {
              vm.formdata.company_name = response.data.companyName;
            } else {
              vm.formdata.company_name = "";
            }
          });
        }
      };
    })
    // Function blocks
    function add_stock(){
      Layout.add_stock(vm.formdata).then(function(response){
        console.log(response);
        vm.stock_operation = "";
        vm.get_stocks();
      })
    }
    function get_stocks(){
      Layout.get_stocks()
      .then(function(response){

      if (response.data !== null) {
        vm.stocksList = response.data;
        
        // Calculate portfolio change
        vm.portfolio.change = 0;
        vm.portfolio.invested_amount = 0;
        vm.portfolio.percent_change = 0;

        for (var i = vm.stocksList.length - 1; i >= 0; i--) {
          vm.portfolio.invested_amount += vm.stocksList[i].invested_amount;
          vm.portfolio.change += vm.stocksList[i].amount_change;
        };
        vm.portfolio.percent_change = Math.ceil(vm.portfolio.change/vm.portfolio.invested_amount*10000)/100;

        // Notification system
        if (vm.stocksList.length > 0) {
          $scope.selected_stock = vm.stocksList[0].id;

          if (Notification.permission == "granted") {

            for (var i = vm.stocksList.length - 1; i >= 0; i--) {
              if(vm.stocksList[i].trigger_price > vm.stocksList[i].lastPrice){
                vm.notification_text += vm.stocksList[i].symbol + " " + vm.stocksList[i].lastPrice.toString()
                  + "/" + vm.stocksList[i].invested_price + "\n";
              }
            };
            if(vm.notification_text.length > 1){
              var notification = new Notification('Market Status', {
                icon: 'http://icons.iconarchive.com/icons/iynque/ios7-style/128/Stocks-icon.png',
                body: vm.notification_text,
              });
            }
          };
        };
        console.log(vm.stocksList[0]);
      };

    });
    }
  };
})();