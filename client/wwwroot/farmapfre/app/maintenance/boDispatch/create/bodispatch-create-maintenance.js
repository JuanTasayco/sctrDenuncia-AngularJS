define([
    'angular'
  ], function(angular) {
    var appAutos = angular.module('farmapfre.app');
    appAutos.controller('createBoDispatchController', 
    ['$scope', 'mModalAlert', 
    function($scope, mModalAlert) {
      var title = 'Relación BO Despachos - Sede - Almacén';
      $scope.title = title;
      document.title = title;

      showMsgError = function() {
          mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
      };
    }])
  });
  