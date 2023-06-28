(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'sctrMngSearchActivity', ['angular', 'system'],
  function(angular, system) {

    angular.module('appAutos')
      .controller('sctrMngSearchActivityController', ['proxyGeneral', '$timeout', function(proxyGeneral, $timeout) {
        var vm = this;
        var seed;
        vm.$onInit =onInit;
        function onInit() {
          vm.tipos = [{codigo:constants.module.polizas.sctr.periodoCorto.TipoPeriodo, 
            descripcion:constants.module.polizas.sctr.periodoCorto.Descripcion}, 
           {codigo:constants.module.polizas.sctr.periodoNormal.TipoPeriodo, 
            descripcion:constants.module.polizas.sctr.periodoNormal.Descripcion}];
          vm.selectItem = selectItem;
          vm.okItem = okItem;
         }
        vm.closeModal = function(){
          vm.onClose({})
        }
        vm.changeValue = function(){
          var value = vm.mNombSubAct
          if (value && value.length >=3){
            if (seed) cancelSearch();
            seed = $timeout(function() {
                  resolveData(value);
            }, 500);
          }
        }
        function resolveData(value){
          var localseed = seed;
          proxyGeneral.GetActividadEconomicaPoliza({
            CodigoDescripcionCiiuEmp: value.toUpperCase(),
            CodigoGrupo: (vm.typePeriodo.codigo == constants.module.polizas.sctr.periodoNormal.TipoPeriodo) ? 5 : 6,
            Solicitud: {
              TipoPeriodo: vm.typePeriodo.codigo
            },
            TamanoPagina : 20,
            NumeroPagina : 1
          })
          .then(function(response){
            if (localseed == seed){
              vm.dataActivities = response.Data;
            }
          });
        }
        function cancelSearch() {
          if (seed) $timeout.cancel(seed);
          vm.data = [];
          loading = false;
          seed = undefined;
        }
        function okItem(){
          if (vm.selectedItem)
            vm.onActivity({$event:{selectedItem:vm.selectedItem}});
        }
        function selectItem(item, accept){
          if (vm.selectedItem) vm.selectedItem.rowSelected = false;
          vm.selectedItem = item
          vm.selectedItem.rowSelected = true;
          if (accept)
            okItem();
        }
        

      }])
      .component('sctrMngSearchActivity', {
        templateUrl: '/polizas/app/sctr/mantenimiento/component/search.activity.html',
        controller: 'sctrMngSearchActivityController',
        bindings: {
          onClose: "&?",
          onActivity: "&?",
          typePeriodo : "<?",
          hidenPeriod : "<?"
        }
      })
  });