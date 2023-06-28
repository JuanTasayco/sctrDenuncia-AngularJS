define([
    'angular'
  ], function(angular) {
    var appBoDistrict = angular.module('farmapfre.app');
    appBoDistrict.controller('createBoDistrictController', 
    ['$scope', 'mModalAlert', 
    function($scope, mModalAlert) {

      showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
      };
      
    }])
  });
  