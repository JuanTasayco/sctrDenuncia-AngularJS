define([
  'angular'
], function(ng) {

  GcwTemplateController.$inject = ['$scope', '$rootScope', '$state', 'gcwFactory'];

  function GcwTemplateController($scope, $rootScope, $state, gcwFactory) {

    var vm = this;
    vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

    function getAllNetworks(){
      var pms = gcwFactory.getAllNetworks();
      pms.then(function(response){
        vm.network = response.data
      });
    }

    $scope.$on('$stateChangeStart', function(e, to, toParam, from, fromParam) {
      vm.ocultarCabecera = false;
      vm.viewNetwork = false;
      vm.viewManager = true;
      vm.viewAgent = true;
      switch(to.url){
        case '/':
          vm.title = '';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case '/polizas':
          vm.title = 'Cartera Póliza';
          $rootScope.reloadAgent = $rootScope.preLocPoliza ? false : true;
          
          viewAutocomplete();
          break;
        case '/polizas/poliza-detalle/:id':
          vm.title = 'Cartera Póliza - Detalle';
          $rootScope.reloadAgent = false;
          
          viewAutocomplete();
          break;
        case "/renovaciones/beneficios":
          vm.title = 'Beneficios';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/cobranzas":
        case "/cobranzas/anuladas":
          vm.title = "Cobranzas - Anuladas por Deudas";
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/cobranzas/comprobante-remitido":
          vm.title = 'Cobranzas - Comprobante remitido';
          vm.viewManager = false,
          vm.viewAgent = false,
          $rootScope.reloadAgent = false;
          break;
        case "/cobranzas/facturas-emitidas":
          vm.title = 'Cobranzas - Facturas emitidas';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/cobranzas/documentos-pagar":
          vm.title = 'Cobranzas - Documentos por Pagar';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/cobranzas/cronograma-pagos":
          vm.title = "Cobranzas - Cronograma de Pagos";
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/cobranzas/estado-documento":
          vm.title = 'Cobranzas - Estado de Documento';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/cobranzas/liquidacion-soat":
          vm.title = 'Cobranzas - Liquidación SOAT';
          $rootScope.reloadAgent = false;
          
          viewAutocomplete();
          break;
        case "/cobranzas/liquidacion-soat-historial":
          vm.title = 'Cobranzas - Historial de Liquidación SOAT';
          $rootScope.reloadAgent = false;
          break;
        case "/comisiones/autoliquidacion":
          vm.title = 'Comisiones - Autoliquidacion';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/comisiones/ganadas":
          vm.title = 'Comisiones - Ganadas';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/comisiones/movimientos":
          vm.title = 'Comisiones - Movimientos';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/comisiones/ganar":
          vm.title = 'Comisiones - Por ganar';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/comisiones/ramo-cliente":
          vm.title = 'Comisiones - Por Ramo y/o Cliente';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/comisiones/constancia-detraccion":
          vm.title = 'Comisiones - Constancia de detracción';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/comisiones/dashboard-red-plaza":
          vm.title = 'Comisiones - Dashboard Red Plaza';
          vm.viewNetwork = gcwFactory.isVisibleNetwork();
          vm.viewAgent = false;
          if(vm.viewNetwork){
            getAllNetworks();
          }
          $rootScope.reloadAgent = true;
          break;
        case "/comisiones/consulta-red-plaza":
          vm.title = 'Comisiones - Consultas de Red Plaza';
          vm.viewNetwork = gcwFactory.isVisibleNetwork();
          vm.viewManager = false;
          if(vm.viewNetwork){
            getAllNetworks();
          }
          $rootScope.reloadAgent = $rootScope.netWorkVisitDetails ? false : true;
          break;
        case "/comisiones/consulta-red-plaza/detalle/:month/:year/:id":
          vm.title = 'Comisiones - Detalle de Red Plaza';
          vm.viewNetwork = gcwFactory.isVisibleNetwork();
          vm.viewManager = false;
          $rootScope.reloadAgent = false;
          break;
        case "/comisiones/consulta-red-plaza/detalle/detalle-cliente/:month/:year/:typeDoc/:numDoc/:id":
          vm.title = 'Comisiones - Cliente de Red Plaza';
          vm.viewNetwork = gcwFactory.isVisibleNetwork();
          vm.viewManager = false;
          $rootScope.reloadAgent = false;
          break;
        case "/comisiones/estado-recibos":
          vm.title = 'Comisiones - Estado de recibos';
          
          viewAutocomplete();
          break;
        case "/siniestros/siniestros-autos":
        case "/siniestros/siniestro-auto-detalle/:id":
          vm.title = 'Siniestros Autos';
          $rootScope.reloadAgent = false;
          
          viewAutocomplete();
          break;
        case "/siniestros/auto-reemplazo":
          vm.title = 'Siniestros - Auto de Reemplazo';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/siniestros/auto-reemplazo/proveedor":
          vm.title = 'Proveedor - Auto de Reemplazo';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/siniestros/auto-reemplazo/planilla":
          vm.title = 'Planilla - Auto de Reemplazo';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/siniestros/auto-reemplazo/detalle":
          vm.ocultarCabecera = true;
        break;
        case "/renovaciones":
        case "/renovaciones/renovacion-detalle/:id":
          vm.title = 'Renovaciones';
          $rootScope.reloadAgent = false;
          
          viewAutocomplete();
          break;
        case "/mapfre-dolar/mapfre-dolar":
          vm.title = 'Mapfre Dolar';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        case "/mapfre-dolar/estado-md":
          vm.title = 'Estado MD';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
        default :
          vm.title = 'Consultas de Gestión';
          $rootScope.reloadAgent = true;
          
          viewAutocomplete();
          break;
      }

      $rootScope.polizaAnulada = "1";
      $rootScope.$broadcast('anuladasPorDeuda');

    });
    
    function viewAutocomplete() {
      vm.viewManager = !vm.dataTicket.hideGestor;
      vm.viewAgent = !vm.dataTicket.hideAgente;
    }

    $scope.$watch('cabecera', function(nv) {
      $rootScope.cabecera = nv;
    });

  } // end controller

  return ng.module('appGcw')
    .controller('GcwTemplateController', GcwTemplateController)
    .component('gcwTemplate', {
      templateUrl: '/gcw/app/common/gcw-template/gcw-template.html',
      controller: 'GcwTemplateController as $tpl',
      bindings: {
        data: '=?'
      }
    });
});
