(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'sctrMngManagerUploadRates', ['angular', 'system', 'constants'],
    function(angular, system, constants) {
  
      angular.module('appAutos')
        .controller('sctrMngManagerUploadRatesController', ['proxySctr','oimProxyPoliza', '$uibModal',  '$scope', function(proxySctr, oimProxyPoliza, $uibModal, $scope) {
          var vm = this;
          vm.$onInit = onInit;
          vm.replaceFile = replaceFile;
          vm.donwloadFileTasa = donwloadFileTasa;
          function onInit(){

          }
          proxySctr.GetListTasa()
          .then(function(response){
            vm.typesRate = response.Data;
          });
          function donwloadFileTasa(id){
            var u = helper.formatNamed(oimProxyPoliza.controllerSctr.actions.methodDownloadFileTasa.path,
            { 'idTemplate':id   });
            window.open(oimProxyPoliza.endpoint + u, "_self", "width=20,height=10");
          }
          function replaceFile(id){
            var vModal = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              template: '<sctr-Mng-Upload-Modal on-close="close()" type-upload="typeUpload"><sctr-Mng-Upload-Modal>',
              controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.typeUpload = id
                $scope.close = function() {
                  $uibModalInstance.close({});
                };
              }]
            });
          }
        }])
        .component('sctrMngManagerUploadRates', {
          templateUrl: '/polizas/app/sctr/mantenimiento/component/manager.uploadarates.html',
          controller: 'sctrMngManagerUploadRatesController',
          bindings: {
  
          }
        })
    });