define([
  'angular'
], function(angular) {
  var appAlliedPharmacies = angular.module('farmapfre.app');
  appAlliedPharmacies.controller('createAlliedPharmaciesController',
    ['$scope', 'mModalAlert',
      function($scope, mModalAlert) {

        showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };

      }])
});
