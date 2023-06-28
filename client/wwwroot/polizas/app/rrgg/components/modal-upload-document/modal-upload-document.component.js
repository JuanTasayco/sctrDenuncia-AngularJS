define([
  'angular', 'constantsRiesgosGenerales', 'constants'
], function (ng, constantsRiesgosGenerales, constants) {
  modalUploadDocumentController.$inject = ['$scope', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function modalUploadDocumentController($scope, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.cargarMultipleFile = cargarMultipleFile
    vm.deleteFile = deleteFile
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesService.tipoDocumental().then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          vm.tipoDocumento = response.Data
        }
      })
    };
    $scope.fnChangeLoadFile = function () {
      setTimeout(function () {
        for (var index = 0; index < vm.data.emision.modelo.documentacion[vm.data.item].documentosTemporal.length; index++) {
          var element = vm.data.emision.modelo.documentacion[vm.data.item].documentosTemporal[index];
          element.TipoGrupo = vm.data.emision.modelo.documentacion[vm.data.item].TipoGrupo
          vm.data.emision.modelo.documentacion[vm.data.item].documentos.push(element)
          vm.data.emision.modelo.documentacionAll.push(element)
        }
        document.getElementById("formFile").click();
      }, 500);

    }
    function cargarMultipleFile() {
      vm.close();
    }
    function deleteFile(item) {
      var newFileList = Array.from(vm.data.emision.modelo.documentacion[vm.data.item].documentos);
      vm.data.emision.modelo.documentacion[vm.data.item].documentos = newFileList.filter(function (element, i) { return i !== item })
      vm.data.emision.modelo.documentacionAll = newFileList.filter(function (element, i) { return i !== item })
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('modalUploadDocumentController', modalUploadDocumentController)
    .component('rrggModalUploadDocument', {
      templateUrl: '/polizas/app/rrgg/components/modal-upload-document/modal-upload-document.html',
      controller: 'modalUploadDocumentController',
      bindings: {
        close: '&',
        data: "="
      }
    })
});
