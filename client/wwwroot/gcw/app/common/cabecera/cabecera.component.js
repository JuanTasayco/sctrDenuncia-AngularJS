define([
  'angular'
], function(ng) {

  CabeceraController.$inject = ['$scope'
  , '$location'
  , '$sce'
  , '$state'
  , '$rootScope'
  , 'gcwFactory'];

  function CabeceraController($scope
    , $location
    , $sce
    , $state
    , $rootScope
    , gcwFactory) {

    var vm = this;

    $scope.mostrarCabecera = true;
    vm.red = null;
    vm.viewNetwork = false;
    vm.viewManager = true;
    vm.viewAgent = true;
    if(vm.title === undefined){
      var label = $location.url();
      switch(label){
        case '/polizas':
          vm.title = 'Cartera Póliza';
          break;
        case '/polizas/poliza-detalle/:id':
          vm.title = 'Cartera Póliza - Detalle';
          break;
        case "/renovaciones/beneficios":
          vm.title = 'Beneficios';
          break;
        case "/cobranzas":
          vm.title = "Cobranzas - Anuladas por Deudas";
          break;
        case "/cobranzas/anuladas":
          vm.title = "Cobranzas - Anuladas por Deudas";
          break;
        case "/cobranzas/comprobante-remitido":
          vm.title = 'Cobranzas - Comprobante remitido';
          break;
        case "/cobranzas/documentos-pagar":
          vm.title = 'Cobranzas - Documentos por Pagar';
          break;
        case "/cobranzas/cronograma-pagos":
          vm.title = "Cobranzas - Cronograma de Pagos";
          break;
        case "/cobranzas/estado-documento":
          vm.title = 'Cobranzas - Estado de Documento';
          break;
        case "/cobranzas/liquidacion-soat":
          vm.title = 'Cobranzas - Liquidación SOAT';
          break;
        case "/cobranzas/facturas-emitidas":
          vm.title = "Cobranzas - Facturas emitidas por cliente";
          break;
        case "/comisiones/ganadas":
          vm.title = 'Comisiones - Ganadas';
          break;
        case "/comisiones/movimientos":
          vm.title = 'Comisiones - Movimientos';
          break;
        case "/comisiones/ganar":
          vm.title = 'Comisiones - Por ganar';
          break;
        case "/comisiones/ramo-cliente":
          vm.title = 'Comisiones - Por Ramo y/o Cliente';
          break;
        case "/comisiones/constancia-detraccion":
          vm.title = 'Comisiones - Constancia de detracción';
          break;
        case "/comisiones/estado-recibos":
          vm.title = 'Comisiones - Estado de recibos';
          break;
        case "/comisiones/dashboard-red-plaza":
          vm.title = 'Comisiones - Dashboard Red Plaza';
          break;
        case "/comisiones/consulta-red-plaza":
          vm.title = 'Comisiones - Consultas de Red Plaza';
          break;
        case "/comisiones/consulta-red-plaza/detalle":
          vm.title = 'Comisiones - Detalle de Red Plaza';
          break;
        case "/comisiones/consulta-red-plaza/detalle/detalle-cliente":
          vm.title = 'Comisiones - Cliente de Red Plaza';
          break;
        case "/siniestros/siniestros-autos":
          vm.title = 'Siniestros Autos';
          break;
        case "/siniestros/auto-reemplazo":
          vm.title = 'Siniestros - Auto de Reemplazo';
          break;
        case "/siniestros/auto-reemplazo/planilla":
          vm.title = 'Planilla - Auto de Reemplazo';
          break;
        case "/siniestros/auto-reemplazo/proveedor":
          vm.title = 'Proveedor - Auto de Reemplazo';
          break;
        case "/renovaciones":
          vm.title = 'Renovaciones';
          break;
        case "/renovaciones/renovacion-detalle/:id":
          vm.title = 'Renovaciones';
          break;
        case "/mapfre-dolar/estado-md":
          vm.title = 'Estado MD';
          break;
        case "/mapfre-dolar/mapfre-dolar":
          vm.title = 'Mapfre Dolar';
          break;
        default :
          vm.title = 'Consultas de Gestión';
          break;
      }
    }
    vm.updateNetwork = updateNetwork;
    function updateNetwork(){
      $rootScope.network = vm.red;
      var network = vm.red;
      var str = '/comisiones/consulta-red-plaza';
      if($location.url().indexOf(str) === 0){
        if(!network.networkId && vm.agente){
          vm.agente = undefined
          $rootScope.loadAgent = false;
          $rootScope.firstLoad = true;
          $scope.$parent.$broadcast('initBoard');
          if(constants.environment === 'PROD'){
            $state.go('consulta.1481')
          }else{
            $state.go('consulta.1807')
          }
        }
      }else if($location.url() === '/comisiones/dashboard-red-plaza' &&
      gcwFactory.isVisibleNetwork()){
        if(network.networkId !== null){
          $scope.$parent.$broadcast('loadBoard');
        }else{
          vm.gestor = {
            id: 0,
            fullName: 'TODOS LOS GESTORES',
            idFullName: '0 - TODOS LOS GESTORES'
          };
          $scope.$parent.$broadcast('initBoard');
        }
      }
    }

    $scope.$on('networkInit', function(event) {
      if(gcwFactory.isVisibleNetwork()){
        vm.red = {
          networkId: null
        }
        if($location.url() === '/comisiones/consulta-red-plaza'
        || $location.url() === '/comisiones/dashboard-red-plaza'){
          updateNetwork();
        }
      }
    });

    $scope.exportar = function(){
      if(vm.title === "Cartera - Póliza"){
        $scope.exportURL = $sce.trustAsResourceUrl('http://api.oim.com/oim_gcw/'+ 'api/policy/download');
        document.getElementById('fmExport').submit();
      }else if(vm.title === "Cobranzas anuladas por deudas"){
        $scope.exportURL = $sce.trustAsResourceUrl('http://api.oim.com/oim_gcw/'+ 'api/collection/cancellation/download');
        document.getElementById('fmExport').submit();
      }else if(vm.title === "Cobranzas - Historial de Pagos"){
        $scope.exportURL = $sce.trustAsResourceUrl('http://api.oim.com/oim_gcw/'+ 'api/payment/history/download');

        if(vm.export.policyNumber){
          $timeout(function() {
            document.getElementById('fmExport').submit();
          }, 500);
        }else{
          mModalAlert.showInfo("Debe ingresar un número de póliza", "Advertencia", "", "", "", "g-myd-modal");
        }

      }
    }

  } // end controller

  return ng.module('appGcw')
    .controller('CabeceraController', CabeceraController)
    .component('gcwCabecera', {
      templateUrl: '/gcw/app/common/cabecera/cabecera.html',
      controller: 'CabeceraController as $cabecera',
      bindings: {
        data: '=?',
        gestor: '=?',
        agente: '=?',
        viewNetwork: '=?',
        viewManager: '=?',
        viewAgent: '=?',
        network: '=?',
        title: '=?'
      }
    });
});
