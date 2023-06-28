'use strict';

define([
  'angular',
  'oim_security',
  'seguroviajeService',
  'seguroviajeFactory'
  ], function(ng) {

  SeguroviajeListaCotizacionesController.$inject = [
    '$scope',
    'accessSupplier',
    'oimPrincipal',
    'seguroviajeService',
    'seguroviajeFactory'
  ];

  function SeguroviajeListaCotizacionesController($scope, oimClaims, oimPrincipal, seguroviajeService, seguroviajeFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.agents = searchAgents;
      vm.managers = searchManagers;
      vm.tipoDocumentos = seguroviajeFactory.getDocuments()[0].types;
      vm.getQuotationPage = getQuotationPage;
    }

    function searchAgents(value){
      var params = {
        CodigoNombre: value.toUpperCase(),
        CodigoGestor: 0,
        CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode,
        McaGestSel: 'S',
        RolUsuario: oimPrincipal.get_role()
      };
      return seguroviajeService.getAgents(params, false);
    }
    function searchManagers(value){
      var params = {
        CodigoNombre: value.toUpperCase(),
        CodigoGestor: 0,
        CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode,
        McaGestSel: 'S',
        RolUsuario: oimPrincipal.get_role()
      };
      return seguroviajeService.getManagers(params, false)
    }
    function getQuotationPage(){
      seguroviajeFactory.setQuotationPageBody(vm.filter)
    }
  }

  return ng.module('appSeguroviaje').controller('SeguroviajeListaCotizacionesController', SeguroviajeListaCotizacionesController);
});
