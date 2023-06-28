define([
  'angular',
  'CommonCboService',
  '/gcw/app/factory/gcwFactory.js',
  '/polizas/app/empresa/factory/empresasFactory.js'
], function(ng) {

  AutocompleteInspectorController.$inject = [
  'CommonCboService',
  '$rootScope',
  '$scope',
  'gcwFactory',
  'empresasFactory',
  '$q',
  '$timeout',
  'accessSupplier',
  'mModalAlert'];

  function AutocompleteInspectorController(
    CommonCboService,
    $rootScope,
    $scope,
    gcwFactory,
    empresasFactory,
    $q,
    $timeout,
    oimClaims,
    mModalAlert
    ){

    var vm = this;
    vm.cleanMsgAdvertencia = cleanMsgAdvertencia;
    vm.getListInspector = getListInspector;

    vm.sinResultados;
    if(!$rootScope.hideInspector)
      vm.hideInspector = true;
    else
      vm.hideInspector = $rootScope.hideInspector;

    vm.$onInit = function() {

      vm.inspector = vm.inspector || {}
    }

    function getListInspector(input) {
      var defer = $q.defer();
      var params = input.toUpperCase();

      empresasFactory.autocompleteInspector(params).then(
        function iacmFn(response){
          defer.resolve(response.data);
          vm.sinResultados = (response.data && response.data.lenght === 0 ? true : false);
      });

      return defer.promise;
    }

    function cleanMsgAdvertencia() {
      vm.sinResultados = false;
    }

    $scope.updateInspector = function(nv) {
      $rootScope.cabecera.inspector = nv;
      gcwFactory.addVariableSession('rolSessionG', nv);
    };

  } // end controller

  return ng.module('appAutos')
    .controller('AutocompleteInspectorController', AutocompleteInspectorController)
    .component('polizaAutocompleteInspector', {
      templateUrl: '/poliza/app/empresa/common/autocomplete-inspector/autocomplete-inspector.html',
      controller: 'AutocompleteInspectorController as $inspectorCtrl',
      controllerAs: 'vm',
      bindings: {
       inspector: '=?'
      }
    });
});
