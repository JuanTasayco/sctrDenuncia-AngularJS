define([
  'angular', 'constants', 'constantsRiesgosGenerales'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('homeRrggController', HomeRrggController);

  HomeRrggController.$inject = ['$state', '$scope', 'isAdmin','riesgosGeneralesFactory','oimPrincipal', '$window'];

  function HomeRrggController($state, $scope, isAdmin,riesgosGeneralesFactory,oimPrincipal, $window) {
    (function load_HomeRrggController() {
      $scope.clonePermission = false;
      var storage = $window.localStorage;
        var subMenu = angular.fromJson(storage['evoSubMenuEMISA']);
        var menus = subMenu.filter(function(x) { return x.nombreCabecera === "RRGG"})[0] ? subMenu.filter(function(x) { return x.nombreCabecera === "RRGG"})[0].items : [];
        if(menus.length >0){
          var opc = [];
          opc =  menus.filter(function(x) { return  x.nombreCorto === 'CLONAR PRODUCTO'});
          $scope.clonePermission = !!opc.length
        }
    })();
    
    $scope.IrACotizar = function () {
      riesgosGeneralesFactory.initCotizacion();
      $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: 1 }, { reload: true, inherit: false });
    }
    $scope.GetHrefBandejaPoliza = function () {
      $state.go(constantsRiesgosGenerales.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
    }
    $scope.IrAClonar = function () {
      $state.go(constantsRiesgosGenerales.ROUTES.CLONAR, {}, { reload: true, inherit: false });
    }
  }

});

