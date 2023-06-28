define([
  'angular', 'constants',
   '/gcw/app/factory/gcwFactory.js'
], function(ng, constants) {

  BeneficiosController.$inject = [
    '$scope'
    , '$rootScope'
    , '$state'
    , 'gcwFactory'
    , '$sce'
    , '$timeout'
    , 'mModalAlert'
    , 'ErrorHandlerService'
    , 'MxPaginador'
    , 'gaService'];

  function BeneficiosController(
    $scope
    , $rootScope
    , $state
    , gcwFactory
    , $sce
    , $timeout
    , mModalAlert
    , ErrorHandlerService
    , MxPaginador
    , gaService) {

    var vm = this;

    vm.$onInit = function() {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');

      $rootScope.polizaAnulada = "1";
      $rootScope.$broadcast('anuladasPorDeuda');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      var page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      vm.formBeneficios = {};
      vm.formBeneficios.mTipoDoc = {};
      vm.formBeneficios.mTipoDoc.typeId = 'CEX';
      vm.noResultB = true;
      vm.firstSearchB = false;
      vm.onlyNumber = false;
      vm.optRadio2 = 1;

      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      vm.firstLoad = firstLoad;
      $timeout(firstLoad(), 1000);
    }

    vm.showNaturalPerson = showNaturalPerson;
    vm.buscar = buscar;
    vm.pageChangedB = pageChangedB;
    vm.clean = clean;
    vm.resetFiltro = resetFiltro;
    vm.cabecera = $rootScope.cabecera;
    vm.docNumMaxLength = 13;
    vm.docNumMinLength = 6;

    $rootScope.$watch('cabecera' ,function(){
      vm.cabecera = $rootScope.cabecera;
    },true);

    $scope.$watch('vm.formBeneficios.mTipoDoc', function(nv){
      vm.showNaturalPerson(nv);
    });

    $scope.$watch('vm.optRadio2', function(){
      clean();
    });

    function firstLoad(){
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
    }

    function obtenerAgente(){

      switch(vm.dataTicket.roleCode){
        case "GESTOR-OIM":
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          };
          break;
        case "DIRECTOR":
        case "GESTOR":
        case "ADM-COBRA":
        case "ADM-COMI":
        case "ADM-RENOV":
        case "ADM-SINIE":
        case "ADM-CART":
          // TODO: Quitar mensaje de error: TypeError: Cannot read property 'agente' of undefined
          return {
            gestorID: (ng.isUndefined(vm.cabecera.gestor)) ? 0 : vm.cabecera.gestor.id,
            agenteID: (vm.cabecera.agente == null) ? 0 : vm.cabecera.agente.id
          }
          break;
        default:
          return {
            gestorID: 0,
            agenteID: vm.dataTicket.oimClaims.agentID
          }
      }
    }

    function funDocNumMaxLength(documentType){
      switch(documentType) {
        case constants.documentTypes.dni.Codigo:
          vm.docNumMaxLength = 8;
          vm.docNumMinLength = 8;
          vm.onlyNumber = true;
          break;
        case constants.documentTypes.ruc.Codigo:
          vm.docNumMaxLength = 11;
          vm.docNumMinLength = 11;
          vm.onlyNumber = true;
          break;
        default:
          vm.docNumMaxLength = 13;
          vm.docNumMinLength = 5;
          vm.onlyNumber = false;
      }
    }

    function showNaturalPerson(item){
      vm.formBeneficios.mNumeroDocumento = undefined;
      //MaxLength documentType
      if(typeof item != 'undefined')
        funDocNumMaxLength(item.typeId);
    }

    function buscar(){
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = obtenerAgente();
      
      gaService.add({ gaCategory: 'CG - Beneficios', gaAction: 'MPF - Listado Beneficios - Buscar', gaLabel: 'Botón: Buscar', gaValue: 'Periodo Regular' });

      if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
        if(!vm.rol.agenteID){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Beneficios", "", "", "", "g-myd-modal");
        }else{ // agente valido
          var page = new MxPaginador();
          if(vm.optRadio2 == 1){ //buscar por tipo de doc y numero doc
            if(vm.formBeneficios.mNumeroDocumento == "" || ng.isUndefined(vm.formBeneficios.mNumeroDocumento)){
               mModalAlert.showInfo("Debe ingresar un No. de Documento", "Beneficios");
               return;
            }
          }else{ // buscar por num de poliza
            if(vm.formBeneficios.mNumPoliza == ''){
              mModalAlert.showInfo("Debe ingresar un No. de Póliza", "Beneficios");
              return;
            }
          }
          vm.params = getParams();
          page.setCurrentTanda(vm.currentPage);
          buscarBeneficios(vm.params);
        }
      }
    }

    function getParams(){
      vm.currentPage = 1;
      if(vm.optRadio2.toString() === "1"){ //buscar por tipo de doc y numero doc
        if(ng.isUndefined(vm.formBeneficios.mNumeroDocumento)){
          mModalAlert.showInfo("Ingrese el documento", "Beneficios", "", "", "", "g-myd-modal")
        }else{
          return {
            policyNumber: '',
            documentType: ng.isUndefined(vm.formBeneficios.mTipoDoc) ? '' : vm.formBeneficios.mTipoDoc.typeId,
            documentNumber: vm.formBeneficios.mNumeroDocumento,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
        }

      }else{
        return {
          policyNumber: ng.isUndefined(vm.formBeneficios.mNumPoliza) ? '' : vm.formBeneficios.mNumPoliza,
          documentType: '',
          documentNumber: '',
          agentId: vm.rol.agenteID,
          managerId: vm.rol.gestorID,
          RowByPage: vm.itemsXTanda,
          CurrentPage: vm.currentPage
        };
      }
    }

    function pageChangedB(index) {

      var params = {
        policyNumber: ng.isUndefined(vm.formBeneficios.mNumPoliza) ? '' : vm.formBeneficios.mNumPoliza,
        documentType: ng.isUndefined(vm.formBeneficios.mTipoDoc) ? '' : vm.formBeneficios.mTipoDoc.typeId,
        documentNumber: ng.isUndefined(vm.formBeneficios.mNumeroDocumento) ? '' : vm.formBeneficios.mNumeroDocumento,
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        buscarBeneficios(params);
      }, setLstCurrentPage);
      gcwFactory.addVariableSession('currentPageSession', params.CurrentPage);
    }

    function setLstCurrentPage() {
      vm.beneficios = page.getItemsDePagina();
    }

    function buscarBeneficios(params){
      vm.firstSearchB = false;
      vm.totalRows = -1;
      gcwFactory.getListBeneficios(params, true).then(
        function(response){
          if(response.data.totalRows > 0){
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            vm.commercialSegment = response.data.commercialSegment;
            vm.beneficios = response.data.list;
            vm.noResultB = false;
          }else{
            vm.beneficios = null;
            vm.totalRows = 0;
            vm.totalPages = 0;
            vm.noResultB = true;
          }
        }, function(error){
          vm.noResultB = true;
        vm.beneficios = {};
      });
    }

    function clean(){
      vm.optRadio2 = 1;
      vm.formBeneficios.mTipoDoc.typeId = 'CEX';
      vm.formBeneficios.mNumeroDocumento = '';
      vm.formBeneficios.mNumPoliza = '';
      vm.noResultB = true;
      vm.firstSearchB = true;
      vm.totalRows = 0;
      vm.totalPages = 0;
    }

    function resetFiltro(){
      cleanFields();
    }

    function cleanFields(){
      vm.formBeneficios.mNumeroDocumento = '';
      vm.formBeneficios.mNumPoliza = '';
    }

    $scope.exportar = function(){
     vm.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/benefit/download');

      if(vm.optRadio2 == 1){ //buscar por tipo de doc y numero doc

          vm.downloadFile = {
            policyNumber: '',
            documentType: ng.isUndefined(vm.formBeneficios.mTipoDoc) ? '' : vm.formBeneficios.mTipoDoc.typeId,
            documentNumber: ng.isUndefined(vm.formBeneficios.mNumeroDocumento) ? '' : vm.formBeneficios.mNumeroDocumento,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
          };

      }else{

          vm.downloadFile = {
            policyNumber: ng.isUndefined(vm.formBeneficios.mNumPoliza) ? '' : vm.formBeneficios.mNumPoliza,
            documentType: '',
            documentNumber: '',
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
          };

      }

      $timeout(function() {
        document.getElementById('frmExport').submit();
      }, 500);
    }

  } // end controller

  return ng.module('appGcw')
    .controller('BeneficiosController', BeneficiosController)
    .component('gcwBeneficios', {
      templateUrl: '/gcw/app/components/beneficios/beneficios/beneficios.html',
      controller: 'BeneficiosController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
