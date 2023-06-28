define([
  'angular', 'constants', 'lodash',
  '/gcw/app/factory/gcwFactory.js',
], function(ng, constants, _) {

  RenovacionDetalleController.$inject = [
  '$scope',
  '$rootScope',
  '$stateParams',
  'gaService',
  'gcwFactory',
  '$uibModal',
  '$state',
  'mModalAlert',
  '$sce',
  '$timeout',
  'MxPaginador',
  '$q',
  'mpSpin',
  '$http',
  '$window'
  ];

  function RenovacionDetalleController(
    $scope,
    $rootScope,
    $stateParams,
    gaService,
    gcwFactory,
    $uibModal,
    $state,
    mModalAlert,
    $sce,
    $timeout,
    MxPaginador,
    $q,
    mpSpin,
    $http,
    $window
    ) {

    var vm = this;
    var pageRenovaciones, pageSiniestros, pagePagos;
    vm.setPage = setPage;
    vm.pageChangedPagos = pageChangedPagos;
    vm.pageChangedSiniestro = pageChangedSiniestro;
    vm.pageChangedRenovaciones = pageChangedRenovaciones;
    vm.selectRenovacion = selectRenovacion;
    vm.selectAll = selectAll;
    vm.showDetailSiniestro = showDetailSiniestro;
    vm.downloadImpresion = downloadImpresion;
    vm.showRenovacionElectronica = showRenovacionElectronica;
    vm.modalCartera = modalCartera;
    vm.validationForm = validationForm;
    vm.showCheckAndButton = showCheckAndButton;
    vm.modalEnvioMail = modalEnvioMail;

    vm.$onInit = function() {
      $rootScope.preLocRenovacion = $state.current.url;
      gaService.add({ gaCategory: 'CG - Renovaciones', gaAction: 'MPF - Lista renovaciones - Vista Detalle Póliza', gaLabel: 'Vista: Detalle Póliza', gaValue: 'Periodo Regular' });
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      $rootScope.$broadcast('anuladasPorDeuda');

      vm.itemsXPagina = 5;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      pageRenovaciones = new MxPaginador();
      pageRenovaciones.setNroItemsPorPagina(vm.itemsXPagina).setCurrentTanda(1);
      pageSiniestros = new MxPaginador();
      pageSiniestros.setNroItemsPorPagina(vm.itemsXPagina).setCurrentTanda(1);
      pagePagos = new MxPaginador();
      pagePagos.setNroItemsPorPagina(vm.itemsXPagina).setCurrentTanda(1);

      $scope.currentPage = 1;
      $scope.pageSize = 5;
      $scope.pages = [];
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      $rootScope.cabecera = gcwFactory.getVariableSession('cabeceraSession');
      vm.cabecera = $rootScope.cabecera;

      vm.firstLoadAgent = firstLoadAgent;
      vm.obtenerAgente = obtenerAgente;

      if($stateParams.id){
        vm.formDataRenovacion = {};
        vm.noResultPagos = true;
        vm.noResultSiniestro = true;
        vm.noResultRenovaciones = true;

        $timeout(firstLoadAgent(), 1500);

        vm.formDataRenovacion.itemDetail = gcwFactory.getVariableSession("renovacionDetail");

        vm.clientName = vm.formDataRenovacion.itemDetail.clientName;
        if(vm.formDataRenovacion.itemDetail){
           var paramsPending = {
              dateStart: vm.formDataRenovacion.itemDetail.dateStartExpiration,
              dateEnd: vm.formDataRenovacion.itemDetail.dateEndExpiration,
              policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,
              situationType: 'RE',
              RoleType: vm.dataTicket.roleType,
              agentId: vm.formDataRenovacion.itemDetail.agentId,
              managerId: vm.formDataRenovacion.itemDetail.managerId,
              RowByPage: '10',
              CurrentPage: '1',
              ramo: {
                ramoId: vm.formDataRenovacion.itemDetail.branchId,
              },
              client: {
                documentType: vm.formDataRenovacion.itemDetail.documentType,
                documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,
                agent: {
                  agentId: vm.rol.agenteID
                }
              }
            }

            paymentPending(paramsPending);

            var paramsSiniestro =
             {
                dateStart: vm.formDataRenovacion.itemDetail.dateStartExpiration,
                dateEnd: vm.formDataRenovacion.itemDetail.dateEndExpiration,
                policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,
                documentType: vm.formDataRenovacion.itemDetail.documentType,
                documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,
                RowByPage: "10",
                CurrentPage: "1",
                ramo: {
                  ramoId: vm.formDataRenovacion.itemDetail.branchId,
                },
                client: {
                  agent: {
                    agentId: vm.rol.agenteID
                    //agentId: vm.agentID
                  }
                }
              };

            obtenerSiniestros(paramsSiniestro);

            var paramsImpresion =
            {
              policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,
              RowByPage: "5",
              CurrentPage: "1",
              ramo: {
                CompanyId: vm.formDataRenovacion.itemDetail.companyId,
                ramoId: vm.formDataRenovacion.itemDetail.branchId,
              },
              client: {
                agent: {
                  agentId: vm.rol.agenteID
                  //agentId: vm.formDataRenovacion.itemDetail.agentId
                  //agentId: vm.agentID
                }
              }
            };
            impresionRenovacion(paramsImpresion);
        }
      }
    } //end onInit

    function firstLoadAgent(){
      vm.rol = {};
      vm.rol.gestorID = 0;
      vm.rol.agenteID = 0;
      vm.cabecera = $rootScope.cabecera;
      vm.rol = obtenerAgente();
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
          return {
            gestorID: vm.dataTicket.codeManagerOffice,
            agenteID: (vm.cabecera.agente == null) ? "0" : vm.cabecera.agente.id
          };
          break;
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

    function paymentPending(params){
      gcwFactory.getListPendingPayment(params, true).then(function(response) {
        vm.muestraPago = "SI";
        vm.muestraSiniestro = "SI";
        if (response.data.list.length > 0) {

          vm.pagos = response.data.list;
          vm.totalItemsPagos = response.data.totalRows;
          vm.totalPagesPagos = response.data.totalPages;
          vm.noResultPagos = false;
        }else{
          vm.pagos = [];
          vm.totalItemsPagos = 0;
          vm.totalPagesPagos = 0;
          vm.noResultPagos = true;
        }
      });
    }

    function obtenerSiniestros(params){
      gcwFactory.getDetailAccident(params, true).then(function(response) {
        if (response.data.list.length > 0) {
          vm.siniestros = response.data.list;
          vm.totalItemsSiniestro = response.data.totalRows;
          vm.totalPagesSiniestro = response.data.totalPages;
          vm.noResultSiniestro = false;
        }else{
          vm.siniestros = [];
          vm.totalItemsSiniestro = 0;
          vm.totalPagesSiniestro = 0;
          vm.noResultSiniestro = true;
        }
      });
    }

    function impresionRenovacion(params){
      var renovaciones;
      if(vm.formDataRenovacion.itemDetail.situation == "RENOVADA"){
        gcwFactory.getDetailRenewal(params, true).then(function(response) {
          if (response.data) {
            renovaciones = response.data;
            vm.renovacionesLength = renovaciones.length;

            for(var i = 0; i<vm.renovacionesLength; i++){
              if(renovaciones[i].selected == 'S'){
                renovaciones[i].selected =true;
              }else{
                renovaciones[i].selected = false;
              }
            }

            if(vm.renovacionesLength>0){
              vm.noResultRenovaciones = false;
            }else{
              vm.noResultRenovaciones = true;
            }
          }else{
            renovaciones = [];
            vm.noResultRenovaciones = true;
          }
          vm.totalItems = renovaciones.length;
          pageRenovaciones.setNroTotalRegistros(vm.totalItems).setDataActual(renovaciones).setConfiguracionTanda();
          setLstCurrentPageRenovaciones();
        });
      }else{
          renovaciones = [];
          vm.noResultRenovaciones = true;
          vm.renovacionesLength = 0;
      }
    }

    function setLstCurrentPageRenovaciones() {
      vm.renovaciones = pageRenovaciones.getItemsDePagina();
    }

    function setPage(index) {
      $scope.currentPage = index - 1;
    }

    function pageChangedPagos(index) {

      var paramsPending = {
          dateStart: vm.formDataRenovacion.itemDetail.expirationDateStart,//
          dateEnd: vm.formDataRenovacion.itemDetail.expirationDateEnd,//
          policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,//'3011400056144',
          situationType: 'RE',
          RoleType: vm.dataTicket.roleType, //'A',
          agentId: vm.rol.agenteID,
          managerId: vm.rol.gestorID,
          RowByPage: '10',
          CurrentPage: index,
          ramo: {
            ramoId: vm.formDataRenovacion.itemDetail.branchId,//301
          },
          client: {
            documentType: vm.formDataRenovacion.itemDetail.documentType,//'RUC',
            documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,//'20303972821',
            agent: {
              agentId: vm.rol.agenteID
            }
          }
        }

      paymentPending(paramsPending);
    }

    function pageChangedSiniestro(index) {

      var paramsSiniestro =
       {
          dateStart: vm.formDataRenovacion.itemDetail.expirationDateStart,//
          dateEnd: vm.formDataRenovacion.itemDetail.expirationDateEnd,//
          policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,
          documentType: vm.formDataRenovacion.itemDetail.documentType,
          documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,
          RowByPage: "10",
          CurrentPage: index,
          ramo: {
            ramoId: vm.formDataRenovacion.itemDetail.branchId,
          },
          client: {
            agent: {
              agentId: vm.rol.agenteID
            }
          }
        };

      obtenerSiniestros(paramsSiniestro);
    }

    function pageChangedRenovaciones(event) {
      pageRenovaciones.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(null, setLstCurrentPageRenovaciones);
    }

    function selectRenovacion(index, val){
      vm.showEmailBtn = val;
      vm.renovaciones[index].selected = val;

      for(var i=0; i<vm.renovacionesLength; i++){
        if(vm.renovaciones[i].selected){
          vm.renovacionesChecked = true;
          break;
        }else{
          vm.renovacionesChecked = false;
        }
      }

      if(!vm.renovacionesChecked){
        vm.showEmailBtn = false;
        vm.showSelectAll = false;
        vm.mCheckAll = false;
        vm.mCheckAllValue = false;
      }
    }

    function selectAll(val){
      vm.showEmailBtn = val;
      vm.showSelectAll = val;
      vm.mCheckAllValue = val;

      for(var i=0; i<vm.renovacionesLength; i++){
        vm.renovaciones[i].selected = val;
      }
    }

    function showDetailSiniestro(val){
      if(val.viewDetail){
        $state.go('consulta.siniestroAutoDetalle', {id:val.accidentNumber}, {reload: false, inherit: false});
      }
    }

    function downloadImpresion(val){
      val.agent = {
        agentId: vm.rol.agenteID//818
      };
      val.userCode = vm.dataTicket.userCode;//'WEBMASTER',  

      var downloadFile = JSON.stringify(val);
      var deferred = $q.defer();
      var datajson = "json="+downloadFile;

      mpSpin.start();
      $http({
        method: "POST",
        url: constants.system.api.endpoints.gcw+"api/renewal/download/sinister",
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: datajson,
        responseType: 'arraybuffer'
      })
      .then(function(data) {
              // success
        if (data.status == 200) {
          var today = new Date();
          var y = today.getFullYear().toString().substr(-2);
          var m = (today.getMonth()+1 < 10) ? "0"+(today.getMonth()+1).toString() : (today.getMonth()+1).toString();
          var d = today.getDate().toString();
          var dateDownload = y+m+d;

          var h = (today.getHours() < 10) ? "0"+(today.getHours().toString()) : today.getHours().toString();
          m = today.getMinutes().toString();
          var s = (today.getSeconds() < 10) ? "0"+(today.getSeconds().toString()) : today.getSeconds().toString();
          var hourDownload = h+m+s;

          var defaultFileName = 'OIM_'+val.companyId+'_'+val.policyNumber+'_'+val.supplement+'_'+val.application+'_'+val.applicationSupplement+'_'+dateDownload+'_'+hourDownload+'U.pdf';
          defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
          var vtype=  data.headers(["content-type"]);
          var file = new Blob([data.data], {type: vtype});
          mpSpin.end();
          $window.saveAs(file, defaultFileName);
          deferred.resolve(defaultFileName);
        }else{
          mpSpin.end();
          mModalAlert.showError("No se encontraron documentos en la consulta", "Impresión de Póliza: Renovaciones", "", "", "", "g-myd-modal");
        }
      }, function(response) { // optional // failed
          mpSpin.end();
          mModalAlert.showError("No se encontraron documentos en la consulta", "Impresión de Póliza: Renovaciones", "", "", "", "g-myd-modal");
      });
    }

    function showRenovacionElectronica(){
      if(typeof vm.dataTicket != 'undefined'){
        return vm.dataTicket.roleCode === "GESTOR" || vm.dataTicket.roleCode === "ADM-RENOV";
      }
    }

    function showModalRenovacionElectronica(){
      vm.paramsGetDataModalRenovacionElec = {
            documentType: vm.formDataRenovacion.itemDetail.documentType,
            documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,
            list: []
          };

          for(var i=0; i<vm.renovacionesLength; i++){
            if(vm.renovaciones[i].selected){
              vm.renovaciones[i].ramo.sectorId = vm.formDataRenovacion.itemDetail.sectorId;
              vm.paramsGetDataModalRenovacionElec.list.push(vm.renovaciones[i]);
              vm.getDataPolicyElectronic = true;
            }
          }

          if(vm.paramsGetDataModalRenovacionElec.list.length>0){// si hay data seleccionada
            gcwFactory.getDataPolicyElectronic(vm.paramsGetDataModalRenovacionElec, true).then(function(response) {
              if(response.data){
                vm.dataPolicyElectronic = response.data;

                if(vm.dataPolicyElectronic.withPolicyElectronic){
                  vm.formDataRenovacion.mConsentimientoRenovacion = (vm.dataPolicyElectronic.withPolicyElectronic == 'S') ? true : false;
                }

                if(vm.dataPolicyElectronic.withInsured){
                  vm.formDataRenovacion.mConsentimientoAllRenovacion = (vm.dataPolicyElectronic.withInsured == 'S') ? true : false;
                }
              }
             }, function(error){

            });
          }
    }

    function modalCartera(){
      showModalRenovacionElectronica();
      $scope.message = false;
      //Modal
      if(vm.paramsGetDataModalRenovacionElec.list.length>0){
        $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl : '/gcw/app/components/modalCarteraRenovacion/component/modalCartera.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };

            $scope.enviarEmail = function(){

              if (vm.validationForm() && (vm.formDataRenovacion.mConsentimientoRenovacion || vm.formDataRenovacion.mConsentimientoAllRenovacion)){
                vm.paramsSetDataModalRenovacionElec = {
                  documentType: vm.formDataRenovacion.itemDetail.documentType,
                  documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,
                  userCode: vm.dataTicket.userCode,
                  email: vm.dataPolicyElectronic.email,
                  withPolicyElectronic: (vm.formDataRenovacion.mConsentimientoRenovacion == true) ? 'S' : 'N',
                  withInsured: (vm.formDataRenovacion.mConsentimientoAllRenovacion == true) ? 'S' : 'N',
                  list: vm.paramsGetDataModalRenovacionElec.list
                };

                gcwFactory.getSetDataPolicyElectronic(vm.paramsSetDataModalRenovacionElec, true).then(function(response) {
                  if(response.data){
                    $scope.message = true;
                    $scope.respuesta = response.data.description;
                  }
                 }, function(error){
                });
              }
            }
          }]
        });
      }else{
        mModalAlert.showInfo("Debe elegir por lo menos una póliza.", "Advertencia", "", "", "", "g-myd-modal");
      }
    }

    function modalEnvioMail(renovacion){
      $scope.suplemento = renovacion;
      //Modal
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        templateUrl : '/gcw/app/components/modalCarteraPoliza/component/modalEnvioMail.html',
        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };

          $scope.enviar = function(){

            if ($scope.frmSendMail.mPara && $scope.frmSendMail.mAsunto && !$scope.frmSendMail.nPara.$invalid){
              vm.paramsEnviarEmail = {
                email: $scope.frmSendMail.mPara,
                bodyMessage: (typeof $scope.frmSendMail.mComentario == 'undefined') ? '': $scope.frmSendMail.mComentario,
                subject: $scope.frmSendMail.mAsunto,
                list: [
                    {
                      ramo: {
                        ramoId: renovacion.ramo.branchId,
                        companyId: renovacion.companyId
                      },
                        agent: {
                          agentId: vm.rol.agenteID
                        },
                      userCode: vm.dataTicket.userCode,
                      policyNumber: renovacion.policyNumber,
                      supplement: renovacion.supplement,
                      application: renovacion.application,
                      applicationSupplement: renovacion.applicationSupplement
                    }
                  ]
              };

              gcwFactory.sendImpresionesRenovacionesEmail(vm.paramsEnviarEmail, true).then(function(response) {
                if(response.operationCode == 200){
                  $scope.message = true;
                  $scope.respuesta = 'Email enviado';//response.data.description;
                }
               }, function(error){
              });
            }
          }
        }]
      });
    }

    function validationForm() {
      return ((vm.formDataRenovacion.mConsentimientoRenovacion || !vm.formDataRenovacion.mConsentimientoRenovacion) &&
        (vm.formDataRenovacion.mConsentimientoAllRenovacion || !vm.formDataRenovacion.mConsentimientoAllRenovacion));
    }

    function showCheckAndButton(){
      if(typeof vm.formDataRenovacion.itemDetail !== 'undefined'){
        return (vm.formDataRenovacion.itemDetail.branchId === '301');
      }
    }

  } // end controller

  function startFromGrid(){
      return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
      }
    }

  return ng.module('appGcw')
    .controller('RenovacionDetalleController', RenovacionDetalleController)
    .component('gcwRenovacionDetalle', {
      templateUrl: '/gcw/app/components/renovaciones/renovaciones/renovacion-detalle/renovacion-detalle.html',
      controller: 'RenovacionDetalleController',
      controllerAs: 'vm',
      bindings: {
      }
    })
    .filter('startFromGrid', startFromGrid)

});
