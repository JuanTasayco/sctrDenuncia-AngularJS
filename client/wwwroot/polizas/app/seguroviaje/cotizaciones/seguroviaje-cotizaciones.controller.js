'use strict';

define([
  'angular',
  'oim_security',
  'seguroviajeService',
  'seguroviajeFactory'
  ], function(ng) {

  SeguroviajeCotizacionesController.$inject = [
    '$state',
    'MxPaginador',
    'accessSupplier',
    'oimPrincipal',
    'mModalAlert',
    'seguroviajeService',
    'seguroviajeFactory'
  ];

  function SeguroviajeCotizacionesController($state, MxPaginador, oimClaims, oimPrincipal, mModalAlert, seguroviajeService, seguroviajeFactory) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      vm.filter = seguroviajeFactory.setFilterBody();
      vm.sortingTypes = seguroviajeFactory.setsortingTypes();
      vm.filter.sortingType = vm.sortingTypes[1]
      vm.agents = searchAgents;
      vm.managers = searchManagers;

      vm.getQuotation = getQuotation;
      vm.getListDocuments = getListDocuments;
      vm.getDetail = getDetail;
      vm.getQuotation()
      vm.getListDocuments()

      var page = new MxPaginador();
      page.setNroItemsPorPagina(vm.filter.pageSize);
    }

    function getListDocuments(){
      var list = _.map(seguroviajeFactory.getDocuments(), function(item){
        return _.pick(item, ['types'])
      })
      var docs = _.union(list[0].types, list[1].types)
      vm.tipoDocumentos = docs;
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
    function getDetail(validity, numeroDoc){
      if(validity){
        $state.go('seguroviajeGuardada',{ numeroDoc : numeroDoc });
      }
      else{
        mModalAlert.showWarning('','Esta cotización se ha vencido')
      }
    }
    function getQuotation(){
      seguroviajeService.getQuotationPage(seguroviajeFactory.setFilterRequest(angular.copy(vm.filter)), true)
      .then(function(response){
        if(response.operationCode == 200){
          vm.quotations = response.data;
        }
        else{
          mModalAlert.showWarning(response.message,'ERROR')
        }
      })
    }
  }

  return ng.module('appSeguroviaje').controller('SeguroviajeCotizacionesController', SeguroviajeCotizacionesController);
});
