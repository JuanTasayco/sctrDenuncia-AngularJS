(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'sctrMngUploadResult', ['angular', 'system'],
  function(angular, system) {

    angular.module('appAutos')
      .controller('sctrMngUploadResultController', ['proxySctr', function(proxySctr) {
        var vm = this;
        vm.upload = upload;
        vm.clean = clean;
        vm.closeModal= closeModal;
        function closeModal(){
          vm.close({});
        }
        function clean(){
          vm.clear()
        }
        function upload(){
          vm.reupload({reupload:1})
        }
      }])
      .component('sctrMngUploadResult', {
        templateUrl: '/polizas/app/sctr/mantenimiento/component/upload.result.html',
        controller: 'sctrMngUploadResultController',
        bindings: {
          errors:"=",
          reupload: "&?",
          clear: "&?",
          close:"&?"
        }
      })
  });