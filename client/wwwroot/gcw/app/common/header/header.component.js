define([
  'angular', 'constants'
], function(ng, constants) {
  HeaderController.$inject = ['$scope', '$window', 'gcwFactory', '$http', '$sce', 'mModalAlert', '$uibModal', '$timeout', '$rootScope', '$state'];

  function HeaderController($scope, $window, gcwFactory, $http, $sce, mModalAlert, $uibModal, $timeout, $rootScope, $state) {

    var vm = this;

    vm.$onInit = function() {

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

      var showBtn = gcwFactory.getVariableSession('showBtn');

      if(showBtn.value == 1){
        $scope.showBtn = 1;
      }else{
        $rootScope.$on('showButtonGenerate', function(event, data){
          $scope.showBtn = data;
        });
      }
    }

    function obtenerAgente(){
      switch(vm.dataTicket.roleCode){
        case "GESTOR-OIM":
          return {
            gestorID: vm.dataTicket.oimClaims.agentID,
            agenteID: ($rootScope.cabecera.agente == null) ? "0" : $rootScope.cabecera.agente.id
          };
          break;
        case "DIRECTOR":
          return {
            gestorID: vm.dataTicket.codeManagerOffice,
            agenteID: ($rootScope.cabecera.agente == null) ? "0" : $rootScope.cabecera.agente.id
          };
          break;
        case "GESTOR":
        case "ADM-COBRA":
        case "ADM-COMI":
        case "ADM-RENOV":
        case "ADM-SINIE":
        case "ADM-CART":
          return {
            gestorID: (ng.isUndefined($rootScope.cabecera.gestor)) ? "0" : $rootScope.cabecera.gestor.id,
            agenteID: ($rootScope.cabecera.agente == null) ? "0" : $rootScope.cabecera.agente.id
          }
          break;
        default:
          return {
            gestorID: "0",
            agenteID: vm.dataTicket.oimClaims.agentID
          }
      }
    }

    $scope.back = function() {
      $window.history.back();
    }

    $scope.exportar = function(){
      if(vm.title === "Cartera - Póliza"){
        $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/policy/download');
        document.getElementById('fmExport').submit();
      }else if(vm.title === "Cobranzas anuladas por deudas"){
        $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/collection/cancellation/download');
        document.getElementById('fmExport').submit();
      }else if(vm.title === "Cobranzas - Historial de Pagos"){
        $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/payment/history/download');
        if($header.export.policyNumber){
          $timeout(function() {
            document.getElementById('fmExport').submit();
          }, 500);
        }else{
          mModalAlert.showInfo("Debe ingresar un número de póliza", "Advertencia", "", "", "", "g-myd-modal");
        }
      }
    }

    $scope.generarLiquidacion = function(){
      var exportData = ng.isUndefined(gcwFactory.getVariableSession("unCheckedSS")) ? vm.export : gcwFactory.getVariableSession("unCheckedSS");

      if(exportData){

        $scope.message = false;
        $scope.porGenerar = false;
        $scope.error = false;

        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          templateUrl : '/gcw/app/components/cobranzas/liquidacion-soat/modalLiquidacion.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {

            $scope.close = function () {
              $uibModalInstance.close();
              $rootScope.$broadcast('getDataPostLiquidation', 1);
            };

            $scope.generar = function(){

              var amount = gcwFactory.getVariableSession("amountSession");
              if(amount.value > 0) $scope.porGenerar = true;
              else $scope.porGenerar = false;

              if($scope.porGenerar){ //desencadena generacion de liq

                gcwFactory.generarLiquidacionSelected(exportData, true).then(function(response){
                  $scope.message = true;
                  $scope.preSettlement = response.data.value;

                  $scope.downloadFile = {
                    preSettlement: $scope.preSettlement,
                    agentId: exportData.agentId,
                    managerId: exportData.managerId,
                    userCode: exportData.userCode
                  };
                  gcwFactory.addVariableSession('downloadFile', $scope.downloadFile);
                }, function(error){
                  console.log(error);
                });

              }else{
                $scope.error = true;
              }
            }

            $scope.exportarLiq = function(){
              $scope.exportURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw+ 'api/collection/soat/download?extensionFile=PDF');
              $scope.downloadFile = gcwFactory.getVariableSession('downloadFile');
              $timeout(function() {
                document.getElementById('frmLiquidSoat').submit();
              }, 500);
            }
          }]
        });
      }else{
        mModalAlert.showInfo("El total de liquidación es 0. No es posible generar liquidación", "Liquidación SOAT");
      }
    }

    $scope.verHistorial = function(){
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      if(ng.isUndefined(vm.rol.agenteID) || vm.rol.agenteID == 0){
        mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Liquidaciones SOAT", "", "", "", "g-myd-modal");
      }else{
        gcwFactory.addVariableSession("dataTandaSession", vm.datatanda);
        $state.go('consulta.liquidacionSoatHistorial', {}, {reload: false, inherit: false});

      }
    }

    $scope.enviarConsulta = function(){
        $scope.message = false;
        $scope.porGenerar = false;
        $scope.error = false;

        if(vm.rol.gestorID == 0 || ng.isUndefined(vm.rol.gestorID)){
          mModalAlert.showInfo("No se puede enviar la consulta ya que no posee gestor de cobro", "Liquidacion SOAT", "", "", "", "g-myd-modal");
        }else{
          if(vm.rol.agenteID == 0 || ng.isUndefined(vm.rol.agenteID)){
            mModalAlert.showInfo("Debe ingresar un agente antes de enviar una consulta", "Liquidacion SOAT", "", "", "", "g-myd-modal");
          }else{

            vm.agentId = vm.rol.agenteID;
            vm.gestorId = vm.rol.gestorID;

            gcwFactory.getEmailLiq(vm.agentId, true).then(function(response) {

              if(response.data){
                $scope.email = response.data.email;
                gcwFactory.addVariableSession('email', $scope.email);

                if($scope.email){
                  $uibModal.open({
                    backdrop: true, // background de fondo
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    scope: $scope,
                    templateUrl : '/gcw/app/components/cobranzas/liquidacion-soat/modalEnvioConsulta.html',
                    controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                      $scope.close = function () {
                        $uibModalInstance.close();
                      };

                      $scope.enviar = function(){
                        if(vm.agentId &&  vm.gestorId && $scope.email){
                          gcwFactory.sendEmailLiq({
                            agentId: vm.agentId,
                            managerId: vm.gestorId,
                            email: $scope.email,
                            message: $scope.frmConsultaLiquid.mConsultaText
                          }, true).then(function(response) {
                            if(response.data){
                              $scope.message = true;
                            }
                          }, function(error){
                          });
                        }
                      };

                      $scope.limpiar = function(){
                        $scope.frmConsultaLiquid.mConsultaText = '';
                      }
                    }]
                  });
                }

              }
             }, function(error){
                $scope.error = false;
            });
          }
        }
      }

  } // end controller

  return ng.module('appGcw')
    .controller('HeaderController', HeaderController)
    .component('gcwHeader', {
      templateUrl: '/gcw/app/common/header/header.html',
      controller: 'HeaderController as $header',
      bindings: {
        data: '=?',
        title: '=?',
        export: '=?',
        datatanda: '=?'
      }
    });
});
