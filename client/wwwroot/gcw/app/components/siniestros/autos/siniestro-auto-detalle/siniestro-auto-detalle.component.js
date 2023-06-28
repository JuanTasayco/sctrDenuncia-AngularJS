define([
  'angular', 'constants', 'lodash'
], function(ng, constants, _) {

  SiniestroAutoDetalleController.$inject = ['$scope', '$rootScope', '$stateParams', 'gcwFactory', '$uibModal', '$state', 'mModalAlert', '$sce', '$timeout', 'MxPaginador', '$http', 'mpSpin', '$window', 'mainServices'];

  function SiniestroAutoDetalleController($scope, $rootScope, $stateParams, gcwFactory, $uibModal, $state, mModalAlert, $sce, $timeout, MxPaginador, $http, mpSpin, $window, mainServices) {

    var vm = this;

    vm.$onInit = function(){

      $rootScope.preLocSiniestro = $state.current.url;

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('anuladasPorDeuda');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');
      $rootScope.reloadAgent = false;

      vm.getDetalleSiniestro = getDetalleSiniestro;
      vm.verCheques = verCheques;
      vm.verExpedientes = verExpedientes;
      vm.verOrdenTrabajo = verOrdenTrabajo;
      vm.verDocumento = verDocumento;
      vm.solicitarInfo = solicitarInfo;

      if($stateParams.id){
        vm.formSiniestro = {};
        vm.formSiniestro.siniestroDetail = gcwFactory.getVariableSession("siniestroDetail");

        if(vm.formSiniestro.siniestroDetail){
          var numberSinister;
          if(!ng.isUndefined($rootScope.preLocPoliza)){ //si viene de Cartera
            $scope.companyId = vm.formSiniestro.siniestroDetail.company;
            numberSinister = vm.formSiniestro.siniestroDetail.accidentNumber;
          }else if (!ng.isUndefined($rootScope.preLocSiniestro)){
            $scope.companyId = vm.formSiniestro.siniestroDetail.companyId;
            numberSinister = vm.formSiniestro.siniestroDetail.sinisterNumber;
          }

          var dataTicket = gcwFactory.getVariableSession("dataTicket");
          $scope.roleType = dataTicket.roleCode;
          $scope.siniestro = numberSinister;
          var typeUser = gcwFactory.getTypeUser();
          if(typeUser == "3"){
            var profile = JSON.parse(localStorage.getItem('evoProfile'))
            $scope.agentId = profile.agentID || profile.agenteID;
          }else{
            var ga = gcwFactory.getVariableSession("rolSession");
            $scope.agentId = ga.agenteID;
          }

          getDetalleSiniestro($scope.companyId, numberSinister, $scope.roleType);
        }
      }
    }

    $scope.downloadDetail = function(){
      mpSpin.start();
      $http({
        method: "GET",
        url: "https://oim.mapfre.com.pe/oim_gcw/api/sinister/car/detail/download/"+$scope.companyId+"/"+$scope.siniestro+"/"+$scope.roleType+"/"+$scope.agentId,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'arraybuffer'
      }).then(function(data) {
          if (data.status == 200){
            var defaultFileName = 'Detalle Siniestro';
            defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
            var vtype=  data.headers(["content-type"]);
            var file = new Blob([data.data], {type: vtype});
            mpSpin.end();
            $window.saveAs(file, defaultFileName);
            deferred.resolve(defaultFileName);
          }else{
            mpSpin.end();
            mModalAlert.showError("Ocurrió un error al intentar descargar el detalle del siniestro.", "Siniestro Autos", "", "", "", "g-myd-modal");
          }
        }, function(response) { // optional

        });
    }

    function getDetalleSiniestro(companyId, numberSinister, roleType){
      gcwFactory.getListDetalleSiniestro(companyId, numberSinister, roleType, false).then(
        function(response){
          vm.siniestro = response.data;
        },
        function(error){

        });
    }

    function verCheques(item) {

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/modal-cheques.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

          $scope.siniestro = vm.formSiniestro.siniestroDetail.sinisterNumber;
          $scope.cheques = item.liquidations;

          $scope.closeModal = function() {
            $uibModalInstance.close();
          };

        }]
      });
    }

    function verExpedientes(item) {

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/modal-expedientes.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

          // $scope.siniestro = vm.formSiniestro.siniestroDetail.sinisterNumber;
          $scope.files = item.files;

          $scope.closeModal = function() {
            $uibModalInstance.close();
          };

          $scope.formatDate = function(date){
            var  dateValues = date.split(' ')[0];
            var day = dateValues.split('/')[0];
            var month = dateValues.split('/')[1];
            var year = dateValues.split('/')[2];
            return new Date(+year, month - 1, +day);
          };

        }]
      });
    }

    function verOrdenTrabajo(item) {

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/modal-ordenTrabajo.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

          $scope.siniestro = vm.formSiniestro.siniestroDetail.sinisterNumber;
          $scope.workOrder = item.workOrder;

          $scope.closeModal = function() {
            $uibModalInstance.close();
          };

        }]
      });
    }

    function verDocumento(item) {

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/modal-documento.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

          $scope.siniestro = vm.formSiniestro.siniestroDetail.sinisterNumber;
          $scope.documents = item.documents;

          
          $scope.downloadDocument = function(idDocument, nameDocument){
            
            var vFileName = nameDocument;
            gcwFactory.recuperaDocumento(idDocument, 'pdf', true).then(function (response) {
              var vMessage = response.message;
              switch (response.operationCode) {
                case constants.operationCode.success:
                  mainServices.fnDownloadFileBase64(response.data, 'pdf', vFileName);
                  break;
                case constants.operationCode.code400:
                  mModalAlert.showError(vMessage, 'Error');
                  break;
                case constants.operationCode.code500:
                  mModalAlert.showWarning(vMessage, 'Error');
                  break;
                // default:
              }
            }, function (error) {
              mModalAlert.showError(error.data.data.message, "Error", "", "", "", "g-myd-modal");
            }, function (defaultError) {
              // console.log('errorDefault');
            });
          }

          $scope.closeModal = function() {
            $uibModalInstance.close();
          };

        }]
      });
    }

    function solicitarInfo(){

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal--md fade',
        templateUrl: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/modal-solicitar-info-siniestro-auto-detalle.html',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance){

          $scope.mAsunto = "Consulta de Siniestro Nro. "+vm.formSiniestro.siniestroDetail.sinisterNumber;

          $scope.closeModal = function() {
            $uibModalInstance.close();
          };

          $scope.enviar = function(msje, contact){
            var filter = {
              CompanyId: vm.formSiniestro.siniestroDetail.companyId,
              SinisterNumber: vm.formSiniestro.siniestroDetail.sinisterNumber,
              BodyMessage: msje,
              MailContact: contact
            };

            gcwFactory.sendSolicitarInfo(filter, true).then(function(response) {
              if(response.operationCode == 200){
                $scope.message = true;
                $uibModalInstance.close();
                mModalAlert.showInfo("Tu solicitud ha sido enviada.", "Exito");
              }else{
                $scope.message = false;
                mModalAlert.showError("La solicitud no pudo enviarse.", "Error");
              }
             }, function(error){
                mModalAlert.showError("La solicitud no pudo enviarse.", "Error", "", "", "", "g-myd-modal");
             });
          }

        }]
      });

    }

    $scope.printDetail = function(compania, item, documento){
      mpSpin.start();
      $http({
        method: "GET",
        url: "https://oim.mapfre.com.pe/oim_gcw/api/sinister/car/detailPayment/download/"+compania+"/"+item.transferNumber+"/"+documento+"/"+item.sinisterOrigin+"/"+item.wayPay,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'arraybuffer'
      }).then(function(data) {
          if (data.status == 200){
            var defaultFileName = 'Detalle Siniestro';
            defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
            var vtype=  data.headers(["content-type"]);
            var file = new Blob([data.data], {type: vtype});
            mpSpin.end();
            $window.saveAs(file, defaultFileName);
            deferred.resolve(defaultFileName);
          }else{
            mpSpin.end();
            mModalAlert.showError("Ocurrió un error al intentar descargar el detalle.", "Siniestro Autos", "", "", "", "g-myd-modal");
          }
        }, function(response) { // optional

        });
    }

    $scope.printRetention = function(compania, item){
      mpSpin.start();
      $http({
        method: "GET",
        url: "https://oim.mapfre.com.pe/oim_gcw/api/sinister/car/retention/download/"+compania+"/"+item.retention+"/"+item.sinisterOrigin,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'arraybuffer'
      }).then(function(data) {
          if (data.status == 200){
            var defaultFileName = 'Detalle Retención';
            defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
            var vtype=  data.headers(["content-type"]);
            var file = new Blob([data.data], {type: vtype});
            mpSpin.end();
            $window.saveAs(file, defaultFileName);
            deferred.resolve(defaultFileName);
          }else{
            mpSpin.end();
            mModalAlert.showError("El pago seleccionado no cuenta con comprobante de retención.", "Siniestro Autos", "", "", "", "g-myd-modal");
          }
        }, function(response) { // optional

        });
    }

  } // end controller

  return ng.module('appGcw')
    .controller('SiniestroAutoDetalleController', SiniestroAutoDetalleController)
    .component('gcwSiniestroAutoDetalle', {
      templateUrl: '/gcw/app/components/siniestros/autos/siniestro-auto-detalle/siniestro-auto-detalle.html',
      controller: 'SiniestroAutoDetalleController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
