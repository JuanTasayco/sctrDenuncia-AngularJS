define(['angular', 'lodash'], function(ng, _) {

  ConsultaRedPlazaDetalleClienteController.$inject = [
    '$state'
    , '$rootScope'
    , '$window'
    , 'ErrorHandlerService'
    , '$stateParams'
    , 'mModalAlert'
    , 'gcwFactory'
    , '$timeout'];

  function ConsultaRedPlazaDetalleClienteController(
    $state
    , $rootScope
    , $window
    , ErrorHandlerService
    , $stateParams
    , mModalAlert
    , gcwFactory
    , $timeout) {
    var vm = this;

    vm.$onInit = function() {

      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('msgSinResultados');

      vm.cabecera = $rootScope.cabecera;
      vm.profile = JSON.parse($window.localStorage.getItem('profile'));
      vm.isVisibleNetwork = gcwFactory.isVisibleNetwork();
      if (!$rootScope.step1) {
        var agenteId = (!vm.isVisibleNetwork) ? vm.profile.codagent : vm.cabecera.agente.id
        var route = (constants.environment === 'PROD') ? 'consulta.1481' : 'consulta.1807';
        $state.go(route, {'month':$stateParams.month, 'year':$stateParams.year, 'id': agenteId});
        return;
      }

      $rootScope.reloadAgent = false;
      vm.volver = volver;

      getAdditionalInfo();

      $timeout(function() {
        getListPolicies();
      }, 1000)
    }; //end onInit

    function getAdditionalInfo(){
      vm.infoClient = {};
      var clients = gcwFactory.getVariableSession('dataSessionAgentClient');
      var client = _.find(clients, {'numDoc': $stateParams.numDoc});
      vm.infoClient.name = client.nombre;

      var session = gcwFactory.getVariableSession('frmSessionNetwork');
      vm.infoClient.agentName = session.infoAgent.idFullName;

      vm.infoClient.phoneNumber = client.phoneNumber;
      vm.infoClient.address = client.address;
      vm.infoClient.email = client.email;
      vm.infoClient.date = new Date();
    }

    function getListPolicies(){
      var params = {
        Month: parseInt($stateParams.month)
        , Year: parseInt($stateParams.year)
        , AgentId: (!vm.isVisibleNetwork) ? vm.profile.codagent : vm.cabecera.agente.id
        , DocumentNumber: $stateParams.numDoc
        , DocumentType: $stateParams.typeDoc
        , RowByPage: 10
        , CurrentPage: 1
        , OrderBy: 1
      };
      gcwFactory.getListPoliciesByClient(params)
      .then(function(response) {
        vm.polizas = [];
        if (response.operationCode === 200) {
          var dataList = response.data.list;
          vm.totalRows = response.data.totalRows;
          var i = 1;
          ng.forEach(dataList, function(item) {
            var poliza = {
              id: i++
              , nroPoliza: item.numPolicy
              , ramos: item.productType
              , fechaInicio: item.issueDate
              , fechaVencimiento: item.expirationDate
              , primaAnual: item.premiumAmount
              , recibosVencidos: item.amountReceipts
              , importe: item.totalReceipts
              , morosidad: item.delinquencyTime
              , formaPago: item.paymentMethod
            };
            vm.polizas.push(poliza);
          });
        }else mModalAlert.showWarning(response.message, '');
      })
      .catch(function(err){
        ErrorHandlerService.handleError(err)
      })
    }

    function volver() {
      $window.history.back();
    }

  } // end controller

  return ng.module('appGcw')
    .controller('ConsultaRedPlazaDetalleClienteController', ConsultaRedPlazaDetalleClienteController)
    .component('gcwConsultaRedPlazaDetalleCliente', {
      templateUrl: '/gcw/app/components/comisiones/consulta-red-plaza/consulta-red-plaza-detalle-cliente.html',
      controller: 'ConsultaRedPlazaDetalleClienteController',
      controllerAs: 'vm',
      bindings: {
      }
    });
});
