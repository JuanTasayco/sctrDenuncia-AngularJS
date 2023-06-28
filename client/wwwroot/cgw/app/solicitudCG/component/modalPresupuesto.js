define([
  'angular'
], function(ng) {

  ModalPresupuestoController.$inject = ['$scope', '$rootScope', '$state'];

  function ModalPresupuestoController($scope, $rootScope, $state) {

    var vm = this;

    (function onLoad() {
      if ($state.current.name === "levantarObservacion") {
        vm.isLevantarObservacion = true;
        vm.dataBkp = ng.copy(vm.data.lista);
      }else{
        vm.isLevantarObservacion = false;
        if (typeof vm.formData === 'undefined') {
         vm.formData = {
            mPresupuesto: []
          };

          vm.montoTotal = 0;
        }

        if (vm.data.lista.price>0) {
          for(var i=0; i<vm.data.lista.details.length; i++) {
            vm.formData.mPresupuesto[vm.data.lista.details[i].codeDetail] = vm.data.lista.details[i].price;
          }

          vm.montoTotal = vm.data.lista.price;
        }
      }

    })();

     $scope.update = function(presupuesto) {
        vm.montoTotal = 0;

        Object.keys(presupuesto).forEach(function(key, index) {

          if (isNaN(parseFloat(this[key]))) {
            vm.montoTotal += 0;
          }else{
            vm.montoTotal += parseFloat(this[key]);
          }

        }, presupuesto);
     };

     $scope.updateRequestedAmount = function(presupuesto) {
       vm.montoTotal = 0;

       angular.forEach(presupuesto, function(value,key) {

          if (isNaN(parseFloat(presupuesto[key].requestedAmount))) {
            vm.montoTotal += 0;
          }else{
            vm.montoTotal += parseFloat(presupuesto[key].requestedAmount);
          }

        }, presupuesto);

        vm.dataBkp.requestedAmount  = vm.montoTotal;
     };

     $scope.grabar = function(val) {
        if (vm.isLevantarObservacion) {
          vm.data.lista = ng.copy(vm.dataBkp)
        }else{
          Object.keys(vm.formData.mPresupuesto).forEach(function(key, index) {

            for(var i=0; i<vm.data.lista.details.length; i++) {
              if (vm.data.lista.details[i].codeDetail === key) {
                vm.data.lista.details[i].price = parseFloat(this[key]);
                break;
              }
            }

          }, vm.formData.mPresupuesto);
          //presupuesto total por procedimiento
          vm.data.lista.price = vm.montoTotal;
        }
     };
  }

  return ng.module('appCgw')
    .controller('ModalPresupuestoController', ModalPresupuestoController)
    .component('mpfModalPresupuesto', {
      templateUrl: '/cgw/app/solicitudCG/component/modalPresupuesto.html',
      controller: 'ModalPresupuestoController',
      bindings: {
        data: '=',
        close: '&',
        grabar: '&'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
