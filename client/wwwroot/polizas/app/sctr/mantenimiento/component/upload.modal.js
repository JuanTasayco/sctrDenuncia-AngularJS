(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'sctrMngUploadModal', ['angular', 'system'],
  function(angular, system) {

    angular.module('appAutos')
      .controller('sctrMngUploadModalController', ['proxySctr', function(proxySctr) {
        var vm= this;
        vm.$onInit = onInit;
        function onInit(){
          vm.processed = false;
          vm.closeModal = close; 
        }
        function close(){
          vm.onClose({});
        }
      }])
      .component('sctrMngUploadModal', {
        templateUrl: '/polizas/app/sctr/mantenimiento/component/upload.modal.html',
        controller: 'sctrMngUploadModalController',
        bindings: {
          onClose: "&?",
          typeUpload : "="
          
        }
      })
  });