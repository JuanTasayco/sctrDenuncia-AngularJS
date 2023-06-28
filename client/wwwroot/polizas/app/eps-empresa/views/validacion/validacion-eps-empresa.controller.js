define([
    'angular', 'constants', 'constantsEpsEmpresa'
  ], function (angular, constants, constantsEpsEmpresa) {
    'use strict';
  
    angular
      .module(constants.module.polizas.epsEmpresa.moduleName)
      .controller('validacionEpsEmpresaController', ValidacionEpsEmpresaController);
  
    ValidacionEpsEmpresaController.$inject = ['$state','epsEmpresaFactory'];
  
    function ValidacionEpsEmpresaController($state, epsEmpresaFactory) {
      var vm = this;
      vm.validaciones = {};

      (function load_ValidacionEpsEmpresaController() {
        vm.validaciones = epsEmpresaFactory.validaciones;
      })();
    
      
    }
});