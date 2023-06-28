define([
  'angular', 'constants',
  '/grqc/app/factory/grqcFactory.js'
], function(ng, constants) {

  grqcHomeController.$inject = ['$scope', 'grqcFactory', '$window', '$rootScope', 'oimClaims', 'mModalAlert', 'localStorageService', '$state', 'mpSpin', '$http'];

  function grqcHomeController($scope, grqcFactory, $window, $rootScope, oimClaims, mModalAlert, localStorageService, $state, mpSpin, $http) {

    /*(function onLoad() {
    })();*/

      $scope.API_POLIZAS = constants.system.api.endpoints.policy;       
      $scope.API_SECURITY = constants.system.api.endpoints.security;      
      $scope.mostrar_bandeja_reqi = 'N';
      $scope.mostrar_bandeja_gest = 'N';

      mpSpin.start();
      $http.get($scope.API_SECURITY + 'api/home/submenu/GRQC', { params: {} })
      .then(function (response) {
        mpSpin.end();

        console.log('response.data');
        console.log(response.data);

        var data = response.data.data || [];

        var v_mostrar_bandeja_reqi = 'N';
        var v_mostrar_bandeja_gest = 'N';

        if(data.length > 0){
          if(data[0].nombreCabecera == 'BANDEJAS'){
            var items = data[0].items || [];
            for (var i = 0; i < items.length; i++) {
              if(items[i].nombreCorto == 'BANDEJA DE REQUERIMIENTOS'){
                v_mostrar_bandeja_reqi = 'S';
              }
              if(items[i].nombreCorto == 'BANDEJA DE GESTION'){
                v_mostrar_bandeja_gest = 'S';
              }          
            }  
          }
        }
        
        console.log('mostrar_bandeja_reqi');
        console.log(v_mostrar_bandeja_reqi);
        console.log('mostrar_bandeja_gest');
        console.log(v_mostrar_bandeja_gest);   
        $scope.mostrar_bandeja_reqi = v_mostrar_bandeja_reqi;
        $scope.mostrar_bandeja_gest = v_mostrar_bandeja_gest;        
      })['catch'](function (e) {
        mpSpin.end();
        mModalAlert.showError('Ocurrió un problema obteniendo permisos / Seguridad', 'Error');
      });   

      /*
      mpSpin.start();
      $http.get($scope.API_POLIZAS + '/api/cobranza/deceso/requerimientos/parametros', { params: {} })
      .then(function (response) {
        mpSpin.end();

        console.log('response.data');
        console.log(response.data);

        var parametros = response.data.Data.parametros || {};

        var perfiles = parametros.perfiles || [];
        console.log('perfiles');
        console.log(perfiles);

        var v_mostrar_bandeja_reqi = 'N';
        var v_mostrar_bandeja_gest = 'N';
                
        for (var i = 0; i < perfiles.length; i++) {
          if(perfiles[i].mostrar_bandeja_reqi == 'S'){
            v_mostrar_bandeja_reqi = 'S';
          }
          if(perfiles[i].mostrar_bandeja_gest == 'S'){
            v_mostrar_bandeja_gest = 'S';
          }          
        }   
        
        console.log('mostrar_bandeja_reqi');
        console.log(v_mostrar_bandeja_reqi);
        console.log('mostrar_bandeja_gest');
        console.log(v_mostrar_bandeja_gest);   
        $scope.mostrar_bandeja_reqi = v_mostrar_bandeja_reqi;
        $scope.mostrar_bandeja_gest = v_mostrar_bandeja_gest;        
      })['catch'](function (e) {
        mpSpin.end();
        mModalAlert.showError('Ocurrió un problema obteniendo parámetros', 'Error');
      });   
      */

  } //  end controller

  return ng.module('appGrqc')
    .controller('GrqcHomeController', grqcHomeController);
});