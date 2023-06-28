define([
  'angular'
], function (ng) {

  AnuladasController.$inject = ['$scope', '$rootScope', 'gcwFactory', '$sce', '$timeout', '$state', '$uibModal', 'mModalAlert', 'mModalConfirm', 'MxPaginador','$http', 'httpData', 'mainServices', 'gaService'];

  function AnuladasController($scope, $rootScope, gcwFactory, $sce, $timeout, $state, $uibModal, mModalAlert, mModalConfirm, MxPaginador, $http, httpData, mainServices, gaService) {
    var vm = this;
    var page;

    vm.$onInit = function () {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);
      vm.formDataAnul = {};
      vm.formDataAnul.Cliente = {};
      vm.formDataAnul.optRadioTap1 = 1;

      vm.firstSearch = false;
      vm.formDataAnul.Anuladas = 'Cobranzas anuladas por deudas';

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      $rootScope.polizaAnulada = "1";
      $rootScope.$broadcast('anuladasPorDeuda');
      $rootScope.reloadAgent = true;

      gcwFactory.cleanStorage();
      vm.templateFexConsult = gcwFactory.getFexConsultTemplate();
    }

    vm.pageChanged = pageChanged;
    vm.buscarAnuladas = buscarAnuladas;
    vm.limpiarBusqueda = limpiarBusqueda;
    vm.exportarDetail = exportarDetail;
    vm.verDetalle = verDetalle;

    $rootScope.$watch('cabecera', function () {
      vm.cabecera = $rootScope.cabecera;
      //buscarAnuladas();
    }, true);

    $scope.$watch('vm.formDataAnul.optRadioTap1', function () {
      vm.formDataAnul.mNumPoliza = '';
      vm.formDataAnul.Desde = {};
      vm.formDataAnul.Desde.code = 3;
      //vm.formDataAnul.Desde.code = "3";
      if (vm.formDataAnul.Cliente) {
        $rootScope.$emit('cliente:borrar');
        vm.formDataAnul.Cliente = undefined;
      }
    });

    function firstLoad() {
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
    }

    function buscarAnuladas() {
      gaService.add({ gaCategory: 'CG - Cobranzas', gaAction: 'MPF - Anuladas por deuda - Buscar', gaLabel: 'Botón: Buscar', gaValue: 'Periodo Regular' });
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);
      var params;

      switch (vm.formDataAnul.optRadioTap1.toString()) {
        case "1":
          if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
            mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cartera: Pólizas");
          } else {
            vm.currentPage = 1;
            params = {
              policyNumber: "",
              documentType: (ng.isUndefined(vm.formDataAnul.Cliente)) ? '' : vm.formDataAnul.Cliente.documentType, //'',
              documentNumber: (ng.isUndefined(vm.formDataAnul.Cliente)) ? '' : vm.formDataAnul.Cliente.documentNumber, //'',
              numberProcessDate: vm.formDataAnul.Desde.code,
              userCode: vm.dataTicket.userCode,
              roleType: vm.dataTicket.roleType, //'A',
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              RowByPage: vm.itemsXTanda,
              CurrentPage: vm.currentPage
            }
            page.setCurrentTanda(vm.currentPage);
            getListaCobranzaAnulada(params);
          }
          break;
        case "2":
          if (vm.formDataAnul.mNumPoliza == '' || ng.isUndefined(vm.formDataAnul.mNumPoliza)) {
            mModalAlert.showInfo("Debe ingresar un número de póliza", "Advertencia");
          } else {
            vm.currentPage = 1;
            params = {
              policyNumber: vm.formDataAnul.mNumPoliza,
              documentType: "",
              documentNumber: "",
              numberProcessDate: "",
              userCode: vm.dataTicket.userCode,
              roleType: vm.dataTicket.roleType, //'A',
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              RowByPage: vm.itemsXTanda,
              CurrentPage: vm.currentPage
            }
            page.setCurrentTanda(vm.currentPage);
            getListaCobranzaAnulada(params);
          }
          break;
      } // end switch
    }

    function limpiarBusqueda() {

      vm.anuladas = null;
      if (vm.formDataAnul.Cliente) {
        $rootScope.$emit('cliente:borrar');
        vm.formDataAnul.Cliente = undefined;
      }
      vm.formDataAnul = {};
      vm.totalPages = 0;
      vm.totalItems = 0;
      vm.formDataAnul.optRadioTap1 = 1;
      vm.formDataAnul.mNumPoliza = '';
      vm.firstSearch = true;
    }

    function pageChanged(event) {
      vm.paramsAnuladas = {
        policyNumber: (typeof vm.formDataAnul.mNumPoliza == 'undefined') ? '' : vm.formDataAnul.mNumPoliza,
        documentType: (typeof vm.formDataAnul.Cliente == 'undefined') ? '' : vm.formDataAnul.Cliente.documentType, //'',
        documentNumber: (typeof vm.formDataAnul.Cliente == 'undefined') ? '' : vm.formDataAnul.Cliente.documentNumber, //'',
        numberProcessDate: vm.formDataAnul.Desde.code,
        userCode: vm.dataTicket.userCode,
        roleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType, //'A',
        agentId: vm.rol.agenteID,
        managerId: vm.rol.gestorID,
        RowByPage: vm.itemsXTanda
      };

      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function (nroTanda) {
        vm.paramsAnuladas.CurrentPage = nroTanda;
        getListaCobranzaAnulada(vm.paramsAnuladas);
      }, setLstCurrentPage);
    }

    function setLstCurrentPage() {
      vm.anuladas = page.getItemsDePagina();
    }

    function getListaCobranzaAnulada(params) {

      gcwFactory.buscarAnuladas(params, true).then(
        function (response) {
          var anuladas;
          if (response.data) {
            if (response.data.totalRows > 0) {
              anuladas = response.data.list;

              if (vm.formDataAnul.optRadioTap1.toString() == "2") { //por poliza

                var filter = {
                  policyNumber: vm.formDataAnul.mNumPoliza,
                  documentTypeCode: '',
                  documentTypeNumber: '',
                  roleType: vm.dataTicket.roleType,
                  managerId: 0
                }
                gcwFactory.getGestorAgentePorPoliza(filter, false).then(function (response) {
                  var ga = {};
                  ga = response.data;

                  $rootScope.codeAgent = (ng.isUndefined(ga.agentId) || ga.agentId == 0) ? "" : ga.agentId.toString();
                  $rootScope.nameAgent = (ng.isUndefined(ga.agentNameFull)) ? "" : ga.agentNameFull;

                  $rootScope.codeManager = (ng.isUndefined(ga.managerId) || ga.managerId == 0) ? "" : ga.managerId.toString();
                  $rootScope.descriptionManager = ng.isUndefined(ga.managerNameFull) ? "INDEFINIDO" : ga.managerNameFull;

                  if ($rootScope.codeAgent == "" && $rootScope.nameAgent == "")
                    vm.cabecera.agente = "";

                  $rootScope.polizaAnulada = vm.formDataAnul.optRadioTap1;
                  $rootScope.$broadcast('anuladasPorDeuda');
                });

              } else {
                $rootScope.codeAgent = undefined;
                $rootScope.nameAgent = undefined
                $rootScope.codeManager = undefined;
                $rootScope.descriptionManager = undefined

                $rootScope.polizaAnulada = vm.formDataAnul.optRadioTap1;
                //$rootScope.$broadcast('anuladasPorDeuda');
              }

              vm.totalPages = response.data.totalPages;
              vm.totalItems = response.data.totalRows;
              vm.noResult = false;
              vm.firstSearch = true;
            } else {
              anuladas = [];
              vm.totalPages = 0;
              vm.totalItems = 0;
              vm.noResult = true;
              vm.firstSearch = false;
            }
          } else {
            anuladas = [];
            vm.totalPages = 0;
            vm.totalItems = 0;
            vm.noResult = true;
            vm.firstSearch = false;
          }
          page.setNroTotalRegistros(vm.totalItems).setDataActual(anuladas).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function exportarDetail(value) {
      gaService.add({ gaCategory: 'CG - Cobranzas', gaAction: 'MPF - Anuladas por deuda - Click Reimpresiones COBRANZAS', gaLabel: 'Botón: fila', gaValue: 'Periodo Regular' });
      vm.exportAnuladaDetail = {
        companyId: value.ramo.companyId,
        policyNumber: value.policyNumber,
        supplement: value.supplement,
        application: value.application,
        applicationSupplement: value.applicationSupplement,
        cancellationDate: value.cancellationDate
      };
      vm.exportAnuladaURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/collection/cancellation/receipPending/download');

      $timeout(function () {
        document.getElementById('fmExportAnulada').submit();
      }, 500);
    }

    function verDetalle(nroCarta) {
      $state.go('detalleConsultaAdmin', {
        reload: true,
        inherit: false
      });
    }

    function _downloadReportFile(){

      const pathParams = {
        codObjeto: localStorage.getItem('codObjeto'),
        opcMenu: localStorage.getItem('currentBreadcrumb')
       };
      const downloadFileBody = {
        'policyNumber': (typeof vm.formDataAnul.mNumPoliza == 'undefined') ? '' : vm.formDataAnul.mNumPoliza,
        'documentType': (typeof vm.formDataAnul.Cliente == 'undefined') ? '' : vm.formDataAnul.Cliente.documentType,
        'documentNumber': (typeof vm.formDataAnul.Cliente == 'undefined') ? '' : vm.formDataAnul.Cliente.documentNumber,
        'numberProcessDate': vm.formDataAnul.Desde.code,
        'userCode': vm.dataTicket.userCode,
        'roleType': (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
        'agentId': vm.rol.agenteID,
        'managerId': vm.rol.gestorID,
      }
      const dataJsonRequest = 'json=' + JSON.stringify(downloadFileBody);
      const urlRequest = constants.system.api.endpoints.gcw + 'api/collection/cancellation/download' +'?COD_OBJETO='+pathParams.codObjeto+'&OPC_MENU='+pathParams.opcMenu;

     httpData.postDownload(
      urlRequest,
      dataJsonRequest,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },responseType: 'arraybuffer'},
      true
      ).then(function(data){
      mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
    });
    }

    $scope.exportar = function () {
      _downloadReportFile();
    }



  } // end controller

  return ng.module('appGcw')
    .controller('AnuladasController', AnuladasController)
    .component('gcwAnuladas', {
      templateUrl: '/gcw/app/components/cobranzas/anuladas/anuladas.html',
      controller: 'AnuladasController',
      controllerAs: 'vm',
      bindings: {}
    });
});
