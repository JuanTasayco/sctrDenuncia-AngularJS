(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, "tabProducts", ['angular'], function(angular){
  angular.module('kpissalud.app').
  controller('tabProductsController',['$state', function($state){
    var vm = this;
    vm.$onInit = onInit;

    function selectProduct(product) {
      vm.selectItem = product.cdgo;
      vm.selectCia = product.cod_cia;
      vm.onSelect({$product: product});
    }

    function setInitialData() {
      vm.selectItem = 'S';
      vm.selectCia = '3';
      vm.products = [
        {'cdgo': 'S', 'dscrpcn': 'EPS Regular', 'cod_cia': '3' },
        {'cdgo': 'S', 'dscrpcn': 'Asistencia Médica', 'cod_cia': '1' },
        {'cdgo': 'O', 'dscrpcn': 'SOAT', 'cod_cia': '1' },
        {'cdgo': 'R', 'dscrpcn': 'SCTR', 'cod_cia': '3' },
        {'cdgo': 'A', 'dscrpcn': 'Accidentes Personales', 'cod_cia': '1' }
      ];

      vm.onSelect({$product: vm.products[0]});
    }

    function onInit() {
      vm.selectProduct = selectProduct;
      setInitialData();
    }
  }]).
  component("tabProducts", {
    templateUrl: "/kpissalud/app/components/products/tab-products.html",
    controller: "tabProductsController",
    bindings: {
      onSelect: '&'
    }
  })
});