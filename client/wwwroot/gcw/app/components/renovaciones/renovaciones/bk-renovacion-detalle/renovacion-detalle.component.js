

define([
  'angular', 'constants',
  '/gcw/app/factory/gcwFactory.js',
], function(ng, constants) {

  RenovacionDetalleController.$inject = ['$scope', '$rootScope', '$stateParams', 'gcwFactory', '$uibModal', '$state', 'mModalAlert', '$sce', '$timeout'];

  function RenovacionDetalleController($scope, $rootScope, $stateParams, gcwFactory, $uibModal, $state, mModalAlert, $sce, $timeout) {

    var vm = this;

    vm.$onInit = function() {

    $rootScope.currentURL = $state.current.url;
    $rootScope.$broadcast('comprobanteRemitido');

    //$rootScope.polizaAnulada = "1";
    //$rootScope.$broadcast('anuladasPorDeuda');

      $scope.currentPage = 1;
      $scope.pageSize = 5;
      $scope.pages = [];
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      vm.firstLoadAgent = firstLoadAgent;
      vm.cabecera = $rootScope.cabecera;
      vm.obtenerAgente = obtenerAgente;

      $timeout(firstLoadAgent(), 1000);

      if($stateParams.id){
        vm.formDataRenovacion = {};
        vm.noResultPagos = true;
        vm.noResultSiniestro = true;
        vm.noResultRenovaciones = true;

        vm.formDataRenovacion.itemDetail = gcwFactory.getVariableSession("renovacionDetail");

        vm.clientName = vm.formDataRenovacion.itemDetail.clientName;
        if(vm.formDataRenovacion.itemDetail){
           var paramsPending = {
              dateStart: vm.formDataRenovacion.itemDetail.expirationDateStart,//
              dateEnd: vm.formDataRenovacion.itemDetail.expirationDateEnd,//
              policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,//'3011400056144',
              situationType: 'RE',
              RoleType: vm.dataTicket.roleType, //'A',
              //agentId: vm.formDataRenovacion.itemDetail.agentId,//818,
              agentId: vm.agentID,//818,
              //managerId: vm.formDataRenovacion.itemDetail.managerId,//0,
              managerId: vm.cabecera.gestor.id,//0,
              RowByPage: '10',
              CurrentPage: '1',
              ramo: {
                ramoId: vm.formDataRenovacion.itemDetail.branchId,//301
              },
              client: {
                documentType: vm.formDataRenovacion.itemDetail.documentType,//'RUC',
                documentNumber: vm.formDataRenovacion.itemDetail.documentNumber,//'20303972821',
                agent: {
                  //agentId: vm.formDataRenovacion.itemDetail.agentId,//818
                  agentId: vm.agentID//818
                }
              }
            }

            paymentPending(paramsPending);

            var paramsSiniestro =
             {
                dateStart: vm.formDataRenovacion.itemDetail.expirationDateStart,//
                dateEnd: vm.formDataRenovacion.itemDetail.expirationDateEnd,//
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
                    //agentId: vm.formDataRenovacion.itemDetail.agentId,
                    agentId: vm.agentID
                  }
                }
              };

            obtenerSiniestros(paramsSiniestro);

            var paramsImpresion =
            {
              policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,
              RowByPage: "10",
              CurrentPage: "1",
              ramo: {
                CompanyId: vm.formDataRenovacion.itemDetail.companyId,
                ramoId: vm.formDataRenovacion.itemDetail.branchId,
              },
              client: {
                agent: {
                  //agentId: vm.formDataRenovacion.itemDetail.agentId
                  agentId: vm.agentID
                }
              }
            };

            impresionRenovacion(paramsImpresion);
        }
      }
    } //end onInit

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

    function paymentPending(params){
      gcwFactory.getListPendingPayment(params, true).then(function(response) {
        vm.muestraPago = vm.formDataRenovacion.itemDetail.withPendingPayment;
        vm.muestraSiniestro = vm.formDataRenovacion.itemDetail.withAmountSinister;
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
      //gcwFactory.getDetailRenewal(params, true).gcwFactory
      gcwFactory.getDetailRenewal(params, true).then(function(response) {
        if (response.data) {
          vm.renovaciones = response.data;
          vm.renovacionesLength = vm.renovaciones.length;

          for(var i = 0; i<vm.renovacionesLength; i++){
            if(vm.renovaciones[i].selected == 'S'){
              vm.renovaciones[i].selected =true;
            }else{
              vm.renovaciones[i].selected = false;
            }
          }

          if(vm.renovaciones.length>0){
            configPages();
            vm.noResultRenovaciones = false;
          }else{
            vm.noResultRenovaciones = true;
          }
        }else{
          vm.renovaciones = [];
          vm.noResultRenovaciones = true;
        }
      });
    }

    function configPages() {
      $scope.pages.length = 0;
      var ini = $scope.currentPage - 4;
      var fin = $scope.currentPage + 5;
      if (ini < 1) {
        ini = 1;
        if (Math.ceil(vm.renovaciones.length / $scope.pageSize) > 5)
          fin = 10;
        else
          fin = Math.ceil(vm.renovaciones.length / $scope.pageSize);
      } else {
        if (ini >= Math.ceil(vm.renovaciones.length / $scope.pageSize) - 5) {
          ini = Math.ceil(vm.renovaciones.length / $scope.pageSize) - 5;
          fin = Math.ceil(vm.renovaciones.length / $scope.pageSize);
        }
      }
      if (ini < 1) ini = 1;
      for (var i = ini; i <= fin; i++) {
        $scope.pages.push({
          no: i
        });
      }

      if ($scope.currentPage >= $scope.pages.length)
        $scope.currentPage = $scope.pages.length - 1;
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
              //agentId: vm.formDataRenovacion.itemDetail.agentId,
              agentId: vm.rol.agenteID
            }
          }
        };

      obtenerSiniestros(paramsSiniestro);
    }

    function pageChangedRenovaciones(index) {

      var paramsImpresion =
        {
          policyNumber: vm.formDataRenovacion.itemDetail.policyNumber,
          RowByPage: "10",
          CurrentPage: index,
          ramo: {
            CompanyId: vm.formDataRenovacion.itemDetail.ciaId,
            ramoId: vm.formDataRenovacion.itemDetail.branchId,
          },
          client: {
            agent: {
              //agentId: vm.formDataRenovacion.itemDetail.agentId,
              agentId: vm.rol.agenteID
            }
          }
        };

      impresionRenovacion(paramsImpresion);
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
      vm.downloadFile = val;
      vm.impresionRenovacionURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/renewal/download');

      $timeout(function() {
        document.getElementById('frmImpresionRenovacion').submit();
      }, 500);
    }

    function showRenovacionElectronica(){
      if(typeof vm.dataTicket != 'undefined'){
        return (vm.dataTicket.roleCode === "GESTOR" || vm.dataTicket.roleCode === "ADM-RENOV");
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
                  email: vm.dataPolicyElectronic.email,//'diana@multiplica.com',
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
        mModalAlert.showInfo("Debe elegir por lo menos una póliza.", "Advertencia");
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
        templateUrl : '/gcw/app/components/modalCarteraRenovacion/component/modalEnvioMail.html',
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
      if(typeof vm.formDataRenovacion.itemDetail != 'undefined'){
        return (vm.formDataRenovacion.itemDetail.branchId == '301');
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
