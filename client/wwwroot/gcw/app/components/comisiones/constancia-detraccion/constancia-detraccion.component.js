

define([
  'angular', 'constants', 'gcwServicePoliza'
], function(ng, constants) {

  ConstanciaDetraccionController.$inject = ['$scope', 'gcwFactory', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', '$rootScope', '$sce', '$timeout', 'gcwServicePoliza'];

  function ConstanciaDetraccionController($scope, gcwFactory, $state, $uibModal, mModalAlert, mModalConfirm, $rootScope, $sce, $timeout, gcwServicePoliza) {
    var vm = this;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.formDetraccion = {};
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.formDetraccion.mTipoBusqueda = 1;

      vm.totalPages = 0;
      vm.totalRows = 0;

      lstCompanias();
      lstTipoDoc();

      vm.format = 'dd/MM/yyyy';

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      $timeout(firstLoadAgent(), 1000);

    }; //end onInit

    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.firstSearch = true;
    vm.pageChanged = pageChanged; //paginacion

    //actualiza registros segun agente o gestor seleccionado
    $rootScope.$watch('cabecera' ,function() {
      vm.cabecera = $rootScope.cabecera;
    },true);

    function lstCompanias() {
      gcwServicePoliza.getListCompanias().then(
        function glpPr(req) {
          vm.lstCompanias = req.Data;
        });
    }

    function lstTipoDoc() {
      gcwFactory.getListTipoDoc().then(
        function glpPq(res) {
          vm.lstTipoDoc = res.data;
        });
    }

    $scope.showConstDep = showConstDep;
    function showConstDep(item) {
      // if(value)
        // cleanCliente();

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/comisiones/constancia-detraccion/modal-constancia-deposito.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

          vm.filter = {
            companyId: item.companyId,
            constancyNumber: item.constancyNumber,
            documentType: item.documentType,
            documentNumber: item.documentNumber,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID
          };

          gcwFactory.getDetalleConstanciaDetraccion(vm.filter, true).then(
            function(response) {
              if (response.data) {
                $scope.nConstancia = response.data.constancyNumber;
                $scope.usuario = response.data.userSol;
                $scope.nCuenta = response.data.checkingAccountNumber;
                $scope.ruc = response.data.rucSupplier;
                $scope.rSocial = response.data.nameSupplier;
                $scope.rucAdq = response.data.rucBuyer;
                $scope.rSocialAdq = response.data.nameBuyer;
                $scope.tipoOperacion = response.data.detractionOperation;
                $scope.bien = response.data.detractionService;
                $scope.importe = response.data.amount;
                $scope.fechaPago = response.data.paymentDate;
                $scope.periodo = response.data.taxPeriod;
                $scope.tipoDocumento = response.data.documentType;
                $scope.numDocumento = response.data.documentNumber;
              }
            });

          scope.close = function() {
            $uibModalInstance.close();
          };

          $scope.descargarPDF = function() { //OIM-2160

            vm.downloadFile = {
              companyId: ng.isUndefined(item.companyId) ? '' : item.companyId,
              constancyNumber: (item.constancyNumber) ? '' : item.constancyNumber,
              documentType: ng.isUndefined(item.mTipoDoc) ? '' : item.mTipoDoc.code,
              documentNumber: item.documentNumber,
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID
            };
            vm.descargarPDFURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw +
              'api/commission/detraction/download');

            $timeout(function() {
              document.getElementById('frmDescargarPDF').submit();
            }, 500);

          };

        }]
      });
    }

    function firstLoadAgent(){
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

    function buscar(){
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = obtenerAgente();
      var documentNumber;

      if(vm.cabecera && typeof vm.dataTicket != 'undefined'){
        if(!vm.rol.agenteID){
          mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Comisiones Constancia de Detracción", "", "", "", "g-myd-modal");
        }else{
          if(!ng.isUndefined(vm.formDetraccion.mSerieDoc) && !ng.isUndefined(vm.formDetraccion.mNumeroDoc))
            documentNumber = vm.formDetraccion.mSerieDoc + '-' + vm.formDetraccion.mNumeroDoc;
          else
            documentNumber = '';

          vm.firstSearch = false;
          vm.filter = {
            companyId: (vm.formDetraccion.mCompania.Value === null) ? '' : vm.formDetraccion.mCompania.Value,
            constancyNumber: ng.isUndefined(vm.formDetraccion.mNroConstancia) ? '' : vm.formDetraccion.mNroConstancia,
            documentType: (vm.formDetraccion.mTipoDoc.code === null) ? '' : vm.formDetraccion.mTipoDoc.code,
            documentNumber: documentNumber,
            dateStart: ng.isUndefined(vm.formDetraccion.mFechaDesde) ? '' : gcwFactory.formatearFecha(vm.formDetraccion.mFechaDesde),
            dateEnd: ng.isUndefined(vm.formDetraccion.mFechaHasta) ? '' : gcwFactory.formatearFecha(vm.formDetraccion.mFechaHasta),
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: "10",
            CurrentPage: "1"
          };
          getConstanciaDetraccion(vm.filter);
        }
      }
    }

    function getConstanciaDetraccion(filter) {
      gcwFactory.getConstanciaDetraccion(filter, true).then(
        function(response) {
          if (response.data) {
            vm.totalRows = response.data.totalRows;
            vm.totalPages = response.data.totalPages;
            if (response.data.list.length > 0) {
              vm.detracciones = response.data.list;
            } else {
              vm.detracciones = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }
          } else {
            vm.detracciones = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
        });
    }

    //Paginacion
    function pageChanged(index) {
      var documentNumber;
      if(!ng.isUndefined(vm.formDetraccion.mSerieDoc) && !ng.isUndefined(vm.formDetraccion.mNumeroDoc))
        documentNumber = vm.formDetraccion.mSerieDoc + '-' + vm.formDetraccion.mNumeroDoc;
      else
        documentNumber = '';

      vm.filter = {
        companyId: (vm.formDetraccion.mCompania.Value === null) ? '' : vm.formDetraccion.mCompania.Value,
        constancyNumber: ng.isUndefined(vm.formDetraccion.mNroConstancia) ? '' : vm.formDetraccion.mNroConstancia,
        documentType: (vm.formDetraccion.mTipoDoc.code === null) ? '' : vm.formDetraccion.mTipoDoc.code,
        documentNumber: documentNumber,
        dateStart: ng.isUndefined(vm.formDetraccion.mFechaDesde) ?
          '' : gcwFactory.formatearFecha(vm.formDetraccion.mFechaDesde),
        dateEnd: ng.isUndefined(vm.formDetraccion.mFechaHasta) ?
          '' : gcwFactory.formatearFecha(vm.formDetraccion.mFechaHasta),
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: '10',
        CurrentPage: index
      };
      getConstanciaDetraccion(vm.filter);
    }

    function limpiar() {
      vm.firstSearch = true;
      vm.detracciones = [];
      vm.totalPages = 0;
      vm.totalRows = 0;

      vm.formDetraccion = {};
      vm.formDetraccion.mTipoBusqueda = 1;
      vm.formDetraccion.mNroConstancia = '';
      vm.formDetraccion.mSerieDoc = '';
      vm.formDetraccion.mNumeroDoc = '';
      vm.formDetraccion.mFechaDesde = '';
      vm.formDetraccion.mFechaHasta = '';
      vm.formDetraccion.mCompania = {};
      vm.formDetraccion.mCompania.Value = null;
      vm.formDetraccion.mTipoDoc = {};
      vm.formDetraccion.mTipoDoc.code = null;
    }

  } // end controller

  return ng.module('appGcw')
    .controller('ConstanciaDetraccionController', ConstanciaDetraccionController)
    .component('gcwConstanciaDetraccion', {
      templateUrl: '/gcw/app/components/comisiones/constancia-detraccion/constancia-detraccion.html',
      controller: 'ConstanciaDetraccionController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
