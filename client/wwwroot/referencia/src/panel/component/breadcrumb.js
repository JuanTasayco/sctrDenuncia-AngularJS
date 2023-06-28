'use strict';
define(['angular'], function(ng) {
  return ng.module('referenciaApp')
    .controller('BreadcrumbController', ['$state', function ctrlFn($state) {
      var vm = this;
      vm.$onInit = function oiFn() {
        vm.isLvl0Open = false;
        vm.isDptoOpen = false;
        vm.showUbigeo = (vm.lstDptos && vm.lstDptos.length) ? true : false;
      };  // end onInit

      vm.openClientes = function ocFn() {
        vm.loader.text = 'Estamos cargando la lista de clientes';
        var currentState = $state.current.name;
        (currentState !== 'referencia.panel.clientes') && (vm.loader.loading = true);

        $state.go('referencia.panel.clientes', {}, {inherit: false});
      };
      vm.openProveedores = function opFn() {
        vm.loader.text = 'Estamos cargando la lista de proveedores';
        var currentState = $state.current.name;
        (currentState !== 'referencia.panel.proveedores') && (vm.loader.loading = true);

        $state.go('referencia.panel.proveedores', {}, {inherit: false});
      };
      vm.open = function oFn(a, b) {
        var state = $state.current.name;
        var regxClientes = new RegExp('clientes', 'g');
        var currentState = regxClientes.test(state) ? 'clientes' : 'proveedores';
        var destinationState = 'referencia.panel.' + currentState;

        if (state === 'referencia.panel.clientes' || state === 'referencia.panel.proveedores') {
          vm.openMap({ lvl: a, pl: b });
        } else {
          // from internals pages
          $state.go(destinationState, { lvl: a, pl: b }, { inherit: false });
        }
      };
    }]).component('mfbreadcrumb', {
      templateUrl: '/referencia/app/panel/component/breadcrumb.html',
      controller: 'BreadcrumbController',
      bindings: {
        panel: '=',
        lvl0: '=?',
        lvl1: '=?',
        lvl2: '=?',
        showLvl1: '=?',
        showLvl2: '=?',
        lstDptos: '<?',
        openMap: '&?',
        showcp: '<?',
        mainState: '<?',
        loader: '='
      }
    });
});
