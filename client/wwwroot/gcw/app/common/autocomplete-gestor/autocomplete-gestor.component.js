define([
  'angular', 'CommonCboService', '/gcw/app/factory/gcwFactory.js'
], function(ng) {

  AutocompleteGestorController.$inject = ['CommonCboService', '$rootScope', '$scope', 'gcwFactory', '$q', '$timeout', 'accessSupplier', 'mModalAlert'];

  function AutocompleteGestorController(CommonCboService, $rootScope, $scope, gcwFactory, $q, $timeout, oimClaims, mModalAlert) {
    var vm = this;
    oimClaims = oimClaims.profile();
    vm.cleanMsgAdvertencia = cleanMsgAdvertencia;
    vm.getListGestor = getListGestor;

    vm.sinResultados;
    if(!$rootScope.hideGestor)
      vm.hideGestor = true;
    else
      vm.hideGestor = $rootScope.hideGestor;

    vm.$onInit = function() {

      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.gestor = {
          id: 0,
          fullName: "TODOS LOS GESTORES",
          idFullName: "0 - TODOS LOS GESTORES"
        };

      var paramsTicket = {
        grupoAplicacion: (oimClaims.userSubType == 'undefined') ? 0 : oimClaims.userSubType,
        usuario: (oimClaims.loginUserName == 'undefined') ? 0 : oimClaims.loginUserName.toUpperCase(),
        codigoAgente: (oimClaims.agentID == 'undefined') ? '' : oimClaims.agentID,
        descripcionAgente: (oimClaims.agentName == 'undefined') ? '' : oimClaims.agentName,
      };
      gcwFactory.getTicketUser(paramsTicket, true).then(function(response){
        if(response.operationCode == constants.operationCode.success){

          vm.dataTicket = response.data;
          vm.dataTicket.oimClaims = oimClaims;
          vm.dataTicket.agentID = oimClaims.agentID;
          vm.dataTicket.agentName = oimClaims.agentName;
          vm.dataTicket.codeManagerOffice = response.data.codeManagerOffice;

          vm.dataTicket.roleCode = response.data.roleCode;
          vm.dataTicket.codeOffice = response.data.oimClaims.officeCode;

          if(typeof vm.dataTicket !== 'undefined'){
            vm.agente = {};

            if(vm.dataTicket.roleCode === "GESTOR-OIM"){
              vm.hideGestor = true;
              vm.hideAgente = false;
              vm.dataTicket.hideGestor = true;
              vm.dataTicket.hideAgente = false;
            }else if(vm.dataTicket.roleCode === "DIRECTOR" ||
                    vm.dataTicket.roleCode === "GESTOR" ||
                    vm.dataTicket.roleCode === "ADM-COBRA" ||
                    vm.dataTicket.roleCode === "ADM-COMI" ||
                    vm.dataTicket.roleCode === "ADM-RENOV" ||
                    vm.dataTicket.roleCode === "ADM-CART" ||
                    vm.dataTicket.roleCode ===  "ADM-SINIE"
                    ){
              vm.hideGestor = false;
              vm.hideAgente = false;
              vm.dataTicket.hideGestor = false;
              vm.dataTicket.hideAgente = false;
            }else{
              vm.hideGestor = true;
              vm.hideAgente = true;
              vm.dataTicket.hideGestor = true;
              vm.dataTicket.hideAgente = true;
            }
          }
          gcwFactory.addVariableSession("dataTicket", vm.dataTicket);
        }else{
         mModalAlert.showError("Al obtener credenciales de acceso a Consultas de Gestión", "Error", "", "", "", "g-myd-modal").then(function(response){
            window.location.href = '/';
          }, function(error){
            window.location.href = '/';
          });
        }
      }, function(error){
        console.log('Error en getTicketUser: ' + error);
        mModalAlert.showError("Al obtener credenciales de acceso a Consultas de Gestión", "Error", "", "", "", "g-myd-modal").then(function(response){
          window.location.href = '/';
        }, function(error){
          window.location.href = '/';
        });
      });

     $rootScope.$on('comprobanteRemitido', function(event) {
        vm.hideGestor = $rootScope.currentURL === "/cobranzas/comprobante-remitido";
      });
    }

    $rootScope.$on('anuladasPorDeuda', function(event) {
        if($rootScope.polizaAnulada == "2" && (!vm.gestor || vm.gestor.id == 0)){
          vm.dataTicket.codeManager = $rootScope.codeManager;
          vm.dataTicket.descriptionManager = $rootScope.descriptionManager;

           vm.gestor = {
              id: (ng.isUndefined(vm.dataTicket.codeManager)) ? 0 : vm.dataTicket.codeManager,
              fullName: "",
              idFullName: (ng.isUndefined(vm.dataTicket.codeManager)) ? 0 + " - " + vm.dataTicket.descriptionManager : vm.dataTicket.codeManager + " - " + vm.dataTicket.descriptionManager
            }
          if($rootScope.codeAgent == undefined)
            vm.agente = null;
        }else if($rootScope.reloadAgent && $rootScope.polizaAnulada != "2"){
          $rootScope.codeAgent = undefined;
          $rootScope.codeManager = undefined;
          vm.gestor = {
            id: 0,
            fullName: "TODOS LOS GESTORES",
            idFullName: "0 - TODOS LOS GESTORES"
          };
        }
    });

    function getListGestor(input) {
      var defer = $q.defer();
      var params = input.toUpperCase();
      CommonCboService.getAutoCompleteManager(params, vm.dataTicket.codeOffice, vm.dataTicket.roleCode, true).then(function gacmFn(resp) {
        vm.sinResultados = (resp.data && resp.data.length === 0 ? true : false);
        defer.resolve(resp.data);
      });

      return defer.promise;
    }

    function cleanMsgAdvertencia() {
      vm.sinResultados = false;
    }

    $scope.updateGestor = function(nv) {
      $rootScope.cabecera.gestor = nv;
      gcwFactory.addVariableSession('rolSessionG', nv);
    };

  } // end controller

  return ng.module('appGcw')
    .controller('AutocompleteGestorController', AutocompleteGestorController)
    .component('gcwAutocompleteGestor', {
      templateUrl: '/gcw/app/common/autocomplete-gestor/autocomplete-gestor.html',
      controller: 'AutocompleteGestorController as $gestorCtrl',
      controllerAs: 'vm',
      bindings: {
       gestor: '=?'
      }
    });
});
