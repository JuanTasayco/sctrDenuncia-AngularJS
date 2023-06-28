define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('bandejaDocumentosController', bandejaDocumentosController);

    bandejaDocumentosController.$inject = ['$scope', '$state', 'oimClaims', 'parametros'];

  function bandejaDocumentosController($scope, $state, oimClaims, parametros) {

    (function load_bandejaDocumentosController() {
    })();

    
  }

});
