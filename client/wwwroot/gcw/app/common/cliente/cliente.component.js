define([
  'angular', 'constants',
  '/gcw/app/factory/gcwFactory.js',
], function(ng, constants) {
  ClienteController.$inject = [
  '$scope'
  , '$uibModal'
  , 'gcwFactory'
  , 'CommonCboService'
  , 'mModalAlert'
  , '$rootScope'
  , 'MxPaginador'
  , '$state'];
  function ClienteController(
    $scope
    , $uibModal
    , gcwFactory
    , CommonCboService
    , mModalAlert
    , $rootScope
    , MxPaginador
    , $state) {
    var vm = this;
    var page, onClienteBorrar;
    vm.showBuscarCliente = showBuscarCliente;
    vm.cleanCliente = cleanCliente;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    var rolesArray =  ["DIRECTOR", "GESTOR", "ADM-COBRA", "ADM-COMI", "ADM-RENOV", "ADM-CART",  "ADM-SINIE"]

    function onInit() {
      onClienteBorrar = $rootScope.$on('cliente:borrar', borrarCliente);
      $scope.itemsXPagina = 10;
      $scope.itemsXTanda = $scope.itemsXPagina * 4;
      $scope.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina($scope.itemsXPagina);
      $scope.onlyNumber = false;
      ($state.current.url === '/cobranzas/cronograma-pagos') ? $scope.key = true : $scope.key = false;
    }

    function onDestroy() {
      onClienteBorrar();
    }

    (function onLoad() {
      $scope.formModalCliente = {};
      $scope.formModalCliente.firtSearch = false;
      $scope.formModalCliente.totalItems = 0;

      var cliente = gcwFactory.getVariableSession('clienteSession');
      if(cliente.length === 0){
        $scope.noResultM = false;
        $scope.formModalCliente.mNumeroDocumentoM = '';
        $scope.formModalCliente.mNombreRazonSocial = '';
        $scope.formModalCliente.mPagination = 1;
        $scope.formModalCliente.firstSearchM = false;
        $scope.formModalCliente.clientes = [];
        $scope.formModalCliente.numeroDocumento = '';

        $scope.docNumMaxLength = 13;
        $scope.docNumMinLength = 6;
        $scope.onlyNumber = true;

      }else{
        $scope.formModalCliente.Cliente = {
          documentType: cliente.documentType,
          documentNumber: cliente.documentNumber,
          fullName: cliente.fullName
        };
        vm.data = $scope.formModalCliente.Cliente;
      }

      CommonCboService.getDocumentType(false).then(function glpPr(req) {
        $scope.lstTipoDocEntidad = req.data;
      });

      initVar();

    })();

    function initVar(){
      $scope.naturalPerson = true;
    }

    function showBuscarCliente(value) {
      if(value){
        $scope.formModalCliente.clientes = undefined;
        $scope.formModalCliente.mNumeroDocumentoM = '';
        $scope.formModalCliente.mNombreRazonSocial = '';
        $scope.formModalCliente.mLastName = '';
        $scope.formModalCliente.mSurname = '';
        $scope.formModalCliente.noResultM = true;
        $scope.formModalCliente.totalItems = 0;
      }

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/common/cliente/modal-buscar-cliente.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.seleccionarCliente = function(value){
            $scope.formModalCliente.Cliente = value;
            vm.data = ng.copy(value);
            gcwFactory.addVariableSession('clienteSession', vm.data);
            $uibModalInstance.close();

          }
        }]
      });
    }

    function borrarCliente() {
      cleanCliente();
    }

    function buscarClientes(paramsSearchClient) {
      $scope.formModalCliente.firstSearchM = true;
      $scope.noResultM = false;
      var pms;
      var currentUrl = $state.current.url;
      if(currentUrl === "/cobranzas/facturas-emitidas")
        pms = gcwFactory.getListPagingPersonCode(paramsSearchClient, true)
      else
        pms = gcwFactory.getListPagingPersonFilter(paramsSearchClient, true)

      pms.then(function(response) {
        if (response.operationCode === constants.operationCode.success) {
          var clientes;
          if (response.data.list.length > 0) {
            clientes = response.data.list;
            $scope.formModalCliente.totalItems = response.data.totalRows;
            $scope.noResultM = false;
          } else {
            clientes = [];
            $scope.formModalCliente.totalItems = 0;
            $scope.noResultM = true;
          }
          page
            .setNroTotalRegistros($scope.formModalCliente.totalItems)
            .setDataActual(clientes)
            .setConfiguracionTanda();
          setLstCurrentPage();
        }
      });
    }

    $scope.filtrarResultado = function() {
      $scope.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = gcwFactory.obtenerAgente($scope.dataTicket);

      if(!rolesArray.includes($scope.dataTicket.roleCode)){
        if(!vm.rol.agenteID || vm.rol.agenteID == 0){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cartera: Pólizas", "", "", "", "g-myd-modal");
          
          return;
        }
      }

      $scope.formModalCliente.frmTercerPeatonForm.markAsPristine();
      if(($scope.formModalCliente.mTipoDocM && $scope.formModalCliente.mNumeroDocumentoM) ||
        $scope.formModalCliente.mNombreRazonSocial || $scope.formModalCliente.mLastName ||
        $scope.formModalCliente.mSurname) {

        $scope.cabecera = $rootScope.cabecera;
        $scope.dataTicket = gcwFactory.getVariableSession("dataTicket");
        if(typeof $scope.dataTicket !== 'undefined') {
            var params = getParams();
            params.CurrentPage = 1;
            $scope.formModalCliente.mPagination = 1; // El paginador selecciona el nro 1
            page.setCurrentTanda($scope.formModalCliente.mPagination);
            buscarClientes(params);
        }
      }else{
        mModalAlert.showInfo("Debe ingresar el documento y/o descripción de la persona para filtrar la lista", "Búsqueda de cliente", "", "", "", "g-myd-modal");
      }
    };

    function seteoFormato() {
      if ($scope.formModalCliente.mNombreRazonSocial)
        $scope.formModalCliente.mNombreRazonSocial = $scope.formModalCliente.mNombreRazonSocial.toUpperCase();
      if ($scope.formModalCliente.mLastName)
        $scope.formModalCliente.mLastName = $scope.formModalCliente.mLastName.toUpperCase();
      if ($scope.formModalCliente.mSurname)
        $scope.formModalCliente.mSurname = $scope.formModalCliente.mSurname.toUpperCase();
    }

    function getParams() {
      seteoFormato();
      return {
        OfficeCode: $scope.dataTicket.codeManagerOffice,
        GestorCode: $scope.cabecera.gestor.id,
        AgentyCode: $scope.dataTicket.oimClaims.agentID.toString(),
        AgentyCodeSelect: ($scope.cabecera.agente == null) ? 0 : $scope.cabecera.agente.id,
        roleType: $scope.dataTicket.roleAccess,//"G",
        DocumentType: $scope.formModalCliente.mTipoDocM.typeId,
        DocumentNumber: (ng.isUndefined($scope.formModalCliente.mNumeroDocumentoM)) ? '' : $scope.formModalCliente.mNumeroDocumentoM,
        Name: (ng.isUndefined($scope.formModalCliente.mNombreRazonSocial)) ? '' : $scope.formModalCliente.mNombreRazonSocial,
        LastName: (ng.isUndefined($scope.formModalCliente.mLastName)) ? '' : $scope.formModalCliente.mLastName,
        Surname: (ng.isUndefined($scope.formModalCliente.mSurname)) ? '' : $scope.formModalCliente.mSurname,
        RowByPage: $scope.itemsXTanda
      };
    }

    /*########################
    # Filter x page
    ########################*/
    $scope.pageChanged = function(event){
      var params = getParams();
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        params.CurrentPage = nroTanda;
        buscarClientes(params);
      }, setLstCurrentPage);
    };

    function cleanCliente(){
      $scope.formModalCliente.clientes = undefined;
      $scope.formModalCliente.mNumeroDocumentoM = '';
      $scope.formModalCliente.mNombreRazonSocial = '';
      $scope.formModalCliente.mLastName = '';
      $scope.formModalCliente.mSurname = '';
      $scope.formModalCliente.noResultM = true;
      $scope.formModalCliente.Cliente = undefined;
      $scope.formModalCliente.totalItems = 0;
      $scope.formModalCliente.mTipoDocM = {};
      $scope.formModalCliente.numeroDocumento = '';
      vm.data = undefined;
    }

    function setLstCurrentPage() {
      $scope.formModalCliente.clientes = page.getItemsDePagina();
    }

    $scope.$watch('formModalCliente.mTipoDocM', function(nv)
    {
      $scope.showNaturalPerson(nv);
      $scope.formModalCliente.numeroDocumento = '';
      $scope.formModalCliente.totalItems = 0;
    });

    function funDocNumMaxLength(documentType){
      $scope.formModalCliente.mNumeroDocumentoM = '';
      //MaxLength documentType
      switch(documentType) {
        case constants.documentTypes.dni.Codigo:
          $scope.docNumMaxLength = 8;
          $scope.docNumMinLength = 8;
          $scope.onlyNumber = false;
          break;
        case constants.documentTypes.ruc.Codigo:
          $scope.docNumMaxLength = 11;
          $scope.docNumMinLength = 11;
          $scope.onlyNumber = true;
          break;
        default:
          $scope.docNumMaxLength = 13;
          $scope.docNumMinLength = 6;
          $scope.onlyNumber = false;
          break;
      }
    }

    $scope.funDocNumMaxLength2 = function (tipo) {
      funDocNumMaxLength(tipo)
    };

    $scope.showNaturalPerson = function(item){
      if(typeof item != 'undefined'){
        (item.typeId == null || item.typeId === "RUC") ? $scope.naturalPerson = false : $scope.naturalPerson = true;
      }
    };

    $scope.grabarNum = function(val){
      $scope.formModalCliente.mNumeroDocumentoM = val;
    }
  } // end controller

  return ng.module('appGcw')
    .controller('ClienteController', ClienteController)
    .component('gcwCliente', {
      templateUrl: '/gcw/app/common/cliente/cliente.html',
      controller: 'ClienteController as $cliente',
      bindings:{
        data: '='
      }
    });
});
