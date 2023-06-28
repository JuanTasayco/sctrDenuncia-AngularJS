(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'sctrMngSearchSubactivity', ['angular', 'system'],
  function(angular, system) {

    angular.module('appAutos')
      .controller('sctrMngSearchSubactivityController', ['proxyGeneral', '$timeout', function(proxyGeneral, $timeout) {
        var vm = this;
        var seed;
        vm.$onInit =onInit;
        function onInit() {
          vm.selectItem = selectItem;
          vm.okItem = okItem;
         }
        vm.closeModal = function(){
          vm.onClose({})
        }
        function okItem(){
          if (vm.selectedItem)
            vm.onActivity({$event:{selectedItem:vm.selectedItem}});
        }
        function selectItem(item, accept){
          if (vm.selectedItem) vm.selectedItem.rowSelected = false;

          angular.forEach(vm.subactividades, function(value,key){
            if(vm.subactividades[key].rowSelected === true){
              vm.subactividades[key].rowSelected = false;
            }
          });
          
          vm.selectedItem = item
          vm.selectedItem.rowSelected = true;
          if (accept)
            okItem();          
        }
        

      }])
      .component('sctrMngSearchSubactivity', {
        templateUrl: '/polizas/app/sctr/mantenimiento/component/search.subactivity.html',
        controller: 'sctrMngSearchSubactivityController',
        bindings: {
          onClose: "&?",
          onActivity: "&?",
          subactividades : "<?",
        }
      })
  });