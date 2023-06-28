(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'sctrMngBloquedAgent', ['angular', 'system'],
    function(angular, system) {
  
      angular.module('appAutos')
        .controller('sctrMngBloquedAgentController', ['proxySctr', 'oimProxyPoliza', '$timeout', '$window', '$sce', function(proxySctr, oimProxyPoliza, $timeout, $window, $sce) {
          var vm = this;

          vm.$onInit = onInit;

          function onInit(){
            vm._find = _find;
            vm.pageChanged = pageChanged;
            vm.unloked = unloked;
            vm.download = download;
            cleanSearch();
          }
          function unloked(){
            var selectedItems = []
            for (var index = 0; vm.agentBloqueds && index < vm.agentBloqueds.length; index++) {
              var element = vm.agentBloqueds[index];
              if (element.checked){
                selectedItems.push(element.IdAgenteLocked)
              }
            }
            proxySctr.DesbloquearAgente({ListaIdAgenteLocked:selectedItems,Motivo:"unloked"}, true)
            .then(function(){
              search(vm.sizePage, vm.pageNumber);
            });
          }

          function download(){
            vm.urlDonwload = $sce.trustAsResourceUrl(oimProxyPoliza.endpoint + oimProxyPoliza.controllerSctr.actions.methodReportePolizaPorVencer.path);
            vm.dwRegions = getSelectedRegions().join(",");
            $timeout(function(){
             // window.open("","_dw");
              document.getElementById("frmdwBlokeds").submit();
            },500);
          }

          function _find() {
            cleanSearch();
            search(vm.sizePage, vm.pageNumber)
          }
          function pageChanged(pageNumber){
            search(vm.sizePage, pageNumber)
          }
          function cleanSearch(){
            vm.pageNumber = 1;
            vm.sizePage = 10;
            vm.agentBloqueds = [];
          }
          function getSelectedRegions(){
            var reg = []
            for (var index = 0; vm.listRegions && index < vm.listRegions.length; index++) {
              var element = vm.listRegions[index];
              if (element.checked) reg.push(element.IdRegion)
            }
            return reg;
          }
          function search (sizePage, pageNumber){
            var reg = getSelectedRegions();
            
            proxySctr.ReportePolizaVencidaPaginado({"NombreAgente": vm.nombreAgente,
            "Regiones": reg,
            "TamanoPagina": sizePage,
            "NumeroPagina": pageNumber}, true).then(function(response){
              if (response.OperationCode == 200){
                vm.totalItems  = response.Data.CantidadTotalFilas
                vm.agentBloqueds = response.Data.Lista;  
              }
              
            })
          }
          proxySctr.GetListRegion().then(function(response){
            
            vm.listRegions = response.Data;
          });
          vm.toggled = function(open){
            if (!open){
              cleanSearch();
              search(vm.sizePage, vm.pageNumber);
            }
          }
          
        }])
        .component('sctrMngBloquedAgent', {
          templateUrl: '/polizas/app/sctr/mantenimiento/component/manager.bloquedagent.html',
          controller: 'sctrMngBloquedAgentController',
          bindings: {
  
          }
        })
    });