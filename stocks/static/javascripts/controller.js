// Required controllers

(function(){

  angular.module('stockWatch.controllers',[])
    .controller('indexController', indexController);

  indexController.$inject = ['$scope','Layout','$interval','$window','$timeout'];

  function indexController($scope,Layout, $interval,$window,$timeout){

    var vm = this;
    vm.showpage = false;
    vm.get_stocks = get_stocks;
    vm.setInterval = 60*5;
    vm.alert = {"success": false, "failure": false, "message": ""};
    vm.show_alert = alert;
    vm.notification_text_high = "";
    vm.notification_text_low = "";
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
        vm.show_alert(" Stock added in your portfolio", "success");
        vm.stock_operation = "";
        vm.get_stocks();
      })
    }

    function alert(msg,type){

      vm.alert.message = msg;

      if (type == "success") {
        vm.alert.success = true;
      } else if(type == "failure"){
        vm.alert.failure = true;
      }
      $timeout(function() {
        if (type == "success") {
          vm.alert.success = false;
        } else if(type == "failure"){
          vm.alert.failure = false;
        }
      }, 3000);
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

        vm.showpage = true;
        // Notification system
        vm.notification_text_high = ""
        vm.notification_text_low = ""
        if (vm.stocksList.length > 0) {
          $scope.selected_stock = vm.stocksList[0].id;

          if (Notification.permission == "granted") {

            for (var i = vm.stocksList.length - 1; i >= 0; i--) {
              if(vm.stocksList[i].trigger_price_high < vm.stocksList[i].lastPrice){
                vm.notification_text_high += vm.stocksList[i].symbol + " " + vm.stocksList[i].lastPrice.toString()
                  + "/" + vm.stocksList[i].invested_price + "\n";
              }
              if(vm.stocksList[i].trigger_price_low > vm.stocksList[i].lastPrice){
                vm.notification_text_low += vm.stocksList[i].symbol + " " + vm.stocksList[i].lastPrice.toString()
                  + "/" + vm.stocksList[i].invested_price + "\n";
              }
            };
            if(vm.notification_text_high.length > 1){
              var notification = new Notification('Sell', {
                icon: 'http://www.iconsdb.com/icons/preview/soylent-red/sell-2-xxl.png',
                body: vm.notification_text_high,
              });
            }
            if(vm.notification_text_low.length > 1){
              var notification = new Notification('Buy', {
                icon: 'https://cdn0.iconfinder.com/data/icons/social-messaging-ui-color-shapes/128/shopping-circle-green-128.png',
                body: vm.notification_text_low,
              });
            }
          };
        };
      };

    });
    }
  };
})();