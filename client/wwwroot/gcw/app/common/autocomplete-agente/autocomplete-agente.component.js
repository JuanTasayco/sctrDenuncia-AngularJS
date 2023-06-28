define([
  'angular', 'lodash', 'CommonCboService', '/gcw/app/factory/gcwFactory.js'
], function(ng, _) {

  AutocompleteAgenteController.$inject = [
    'CommonCboService'
    , '$rootScope'
    , '$scope'
    , '$q'
    , 'accessSupplier'
    , 'gcwFactory'
    , 'mModalAlert'];

  function AutocompleteAgenteController(
    CommonCboService
    , $rootScope
    , $scope
    , $q
    , oimClaims
    , gcwFactory
    , mModalAlert) {

    var vm = this;
    vm.cleanMsgAdvertencia = cleanMsgAdvertencia;
    vm.getListAgente = getListAgente;
    vm.sinResultados = $rootScope.redCross ? false : undefined

    vm.$onInit = function() {

      oimClaims = oimClaims.profile();

      var paramsTicket = {
        grupoAplicacion: (oimClaims.userSubType == 'undefined') ? 0 : oimClaims.userSubType,
        usuario: (oimClaims.loginUserName == 'undefined') ? 0 : oimClaims.loginUserName.toUpperCase(),
        codigoAgente: (oimClaims.agentID == 'undefined') ? '' : oimClaims.agentID,
        descripcionAgente: (oimClaims.agentName == 'undefined') ? '' : oimClaims.agentName,
      };
      gcwFactory.getTicketUser(paramsTicket, true).then(function(response){
        if(response.operationCode == constants.operationCode.success){

          $scope.dataTicket = response.data;
          $scope.dataTicket.oimClaims = oimClaims;
          $scope.dataTicket.agentID = oimClaims.agentID;
          $scope.dataTicket.agentName = oimClaims.agentName;
          $scope.dataTicket.codeManagerOffice = response.data.codeManagerOffice;

          $scope.dataTicket.roleCode = response.data.roleCode;
          $scope.dataTicket.codeOffice = response.data.oimClaims.officeCode;

          if(typeof $scope.dataTicket != 'undefined'){

            if($scope.dataTicket.roleCode === "GESTOR-OIM"){
              vm.hideGestor = true;
              vm.hideAgente = false;
              $scope.dataTicket.hideGestor = true;
              $scope.dataTicket.hideAgente = false;
            }else if($scope.dataTicket.roleCode === "DIRECTOR" ||
                    $scope.dataTicket.roleCode === "GESTOR" ||
                    $scope.dataTicket.roleCode === "ADM-COBRA" ||
                    $scope.dataTicket.roleCode === "ADM-COMI" ||
                    $scope.dataTicket.roleCode === "ADM-RENOV" ||
                    $scope.dataTicket.roleCode === "ADM-CART" ||
                    $scope.dataTicket.roleCode ===  "ADM-SINIE"
                    ){
              vm.hideGestor = false;
              vm.hideAgente = false;
              $scope.dataTicket.hideGestor = false;
              $scope.dataTicket.hideAgente = false;
            }else{
              vm.hideGestor = true;
              vm.hideAgente = true;
              $scope.dataTicket.hideGestor = true;
              $scope.dataTicket.hideAgente = true;
            }

            if ($scope.dataTicket.visibleAgent == 'N') {
              CommonCboService.getAutoCompleteAgent(0, $scope.dataTicket.agentID, $scope.dataTicket.codeOffice, $scope.dataTicket.roleCode, true)
              .then(function(resp) {
                vm.isVisibleAgentSelect = true;
                vm.listAgent = resp.data;
                if(vm.listAgent){
                  vm.agente = _.find(vm.listAgent, function(agent){ return agent.id == oimClaims.agentID
                  })
                  gcwFactory.addVariableSession('sessionAgente', vm.agente);
                }
              });
            } else {
              vm.isVisibleAgentSelect = false;
            }
          }

          gcwFactory.addVariableSession("dataTicket", $scope.dataTicket);
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
        vm.hideAgente = $rootScope.currentURL === "/cobranzas/comprobante-remitido";
      });

      $rootScope.$on('dashboard', function(event) {
        vm.hideAgente = $rootScope.currentURL === "/comisiones/dashboard-red-plaza";
      });

      $rootScope.$on('msgSinResultados', function(event){
        if($rootScope.redCross && vm.sinResultados){
          cleanMsgAdvertencia();
        }
      })
    }

     $rootScope.$on('anuladasPorDeuda', function(event) {

        if($rootScope.polizaAnulada == "2"){
          $scope.dataTicket.agentID = $rootScope.codeAgent;
          $scope.dataTicket.agentName = $rootScope.nameAgent;
          if ($scope.dataTicket.agentID && $scope.dataTicket.agentName) {
            vm.agente = {
              id: $scope.dataTicket.agentID,
              fullName: $scope.dataTicket.agentName,
              idFullName: $scope.dataTicket.agentID + '-' + $scope.dataTicket.agentName
          };
          if($rootScope.codeAgent == undefined)
            vm.agente = null;
          } else {
            vm.agente = null;
          }
        }else if($rootScope.reloadAgent && $rootScope.polizaAnulada != "2"){
          $rootScope.codeAgent = undefined;
          $rootScope.codeManager = undefined;
          vm.agente = null;
        }
    });

    function getListAgente(input) {

      var defer = $q.defer();
      // TODO: obtener data del gestor seleccionado del componente autocomplete-gestor
      var idManager = 0 // vm.data.idManager;
      var params = input.toUpperCase();
      var codeOffice = $scope.dataTicket.codeOffice;
      var roleCode = $scope.dataTicket.roleCode;
      var networkId = !$scope.$agenteCtrl.network ? 0 : $scope.$agenteCtrl.network;
      CommonCboService.getAutoCompleteAgent(idManager, params, codeOffice, roleCode, networkId, true).then(function gacmFn(resp) {
        vm.sinResultados = (resp.data && resp.data.length === 0 ? true : false);
        defer.resolve(resp.data);
      });

      return defer.promise;
    }

    function cleanMsgAdvertencia() {
      vm.sinResultados = false;
    }

    $scope.updateAgente = function(nv) {
      $rootScope.cabecera.agente = nv;
      gcwFactory.addVariableSession('rolSessionA', nv);
      if($rootScope.redCross && $rootScope.isDirector && !$rootScope.isVisibleNetwork){
        $rootScope.$emit('searchNetWorkAgents');
      }
    };

  } // end controller

  return ng.module('appGcw')
    .controller('AutocompleteAgenteController', AutocompleteAgenteController)
    .component('gcwAutocompleteAgente', {
      templateUrl: '/gcw/app/common/autocomplete-agente/autocomplete-agente.html',
      controller: 'AutocompleteAgenteController as $agenteCtrl',
      controllerAs: 'vm',
      bindings: {
        agente: '=?',
        gestor: '=?',
        network: '=?'
      }
    });
});
