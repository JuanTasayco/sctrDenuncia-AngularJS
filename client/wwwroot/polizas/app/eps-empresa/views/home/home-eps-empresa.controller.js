define([
    'angular', 'constants'
  ], function (angular, constants) {
    'use strict';
  
    angular
      .module(constants.module.polizas.epsEmpresa.moduleName)
      .controller('homeEpsEmpresaController', HomeEpsEmpresaController);
  
    HomeEpsEmpresaController.$inject = ['$window'];
  
    function HomeEpsEmpresaController($window) {
      var vm = this;
  
      vm.opciones = [];
      vm.rutas = [];

      (function onLoadHomeEpsEmpresaController(){

        var storage = $window.localStorage;
        var subMenu = angular.fromJson(storage['evoSubMenuEMISA']);
        var menus = subMenu.filter(function(x) { return x.nombreCabecera === "EPSEMPRESA"})[0] ? subMenu.filter(function(x) { return x.nombreCabecera === "EPSEMPRESA"})[0].items : [];
        if(menus.length >0){
          vm.rutas = constants.module.polizas.epsEmpresa.URLS;
          vm.opciones = menus;
          vm.opciones.forEach(function(element) {
            element.ruta = vm.rutas[element.nombreCorto];
          });
        }
      })();
    }
  });