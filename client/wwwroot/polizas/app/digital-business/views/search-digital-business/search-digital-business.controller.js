define([
  'angular'
], function (angular) {
  'use strict';

  angular
    .module('appAutos')
    .controller('searchDigitalBusinessController', SctrSearchDigitalBusinessController);

  SctrSearchDigitalBusinessController.$inject = ['$interval', '$scope', '$uibModal', 'mModalAlert', 'mModalConfirm', 'digitalBusinessService'];
  function SctrSearchDigitalBusinessController($interval, $scope, $uibModal, mModalAlert, mModalConfirm, digitalBusinessService) {
    var vm = this;
    var timer;

    // Propiedades
    vm.pagination = {
      currentPage: 1,
      maxSize: 10,
      totalItems: 0,
      items: [],
      response: [],
      noSearch: true,
      noResult: false
    };
    vm.parameters = {
      description: ''
    };

    // Funciones
    vm.$onInit = OnInit;
    vm.$onDestroy = OnDestroy;
    vm.newDigitalBusiness = NewDigitalBusiness;
    vm.editDigitalBusiness = EditDigitalBusiness;
    vm.deleteDigitalBusiness = DeleteDigitalBusiness;
    vm.clearSearch = ClearSearch;
    vm.searchDigitalBusiness = SearchDigitalBusiness;
    vm.pageChanged = PageChanged;

    function OnInit() {
    }

    function OnDestroy() {
      $interval.cancel(timer);
    }

    function SearchDigitalBusiness(noClear) {
      if (!noClear) _clearResults();
      digitalBusinessService.searchDigitalBusiness(vm.parameters.description).then(_searchDigitalBusinessResponse);
    }

    function PageChanged(currentPage) {
      _searchDigitalBusinessResponse(vm.pagination.response);
    }

    function ClearSearch() {
      vm.parameters.description = '';
      _clearResults();
    }

    function NewDigitalBusiness() {
      _openPopupDigitalBusiness();
    }

    function EditDigitalBusiness(item) {
      digitalBusinessService.getTemplateMail(item.CodigoCompania, item.CodigoRamo)
        .then(function (response) {
          console.log(response);
          if (response.OperationCode === 200) {
            _openPopupDigitalBusiness(response.Data);
          } else {
            mModalAlert.showWarning("Ha ocurrido un error al intentar obtener los datos de la plantilla", "Mantenimiento de Plantilla");
          }
        });
    }

    function DeleteDigitalBusiness(item) {
      mModalConfirm.confirmWarning('¿Seguro que desea eliminar la plantilla?', 'Eliminar lista', '')
        .then(function (response) {
          digitalBusinessService.deleteDigitalBusiness(item.CodigoCompania, item.CodigoRamo)
            .then(function (response) {
              console.log(response);
              if (response.OperationCode === 200) {
                mModalAlert.showSuccess("La acción solicitada se ha realizado correctamente", "Información actualizada");
                vm.searchDigitalBusiness(true);
              } else {
                mModalAlert.showWarning("Ha ocurrido un error al intentar obtener los datos de la plantilla", "Mantenimiento de Plantilla");
              }
            });
        }, function (error) { });
    }

    // Funciones privadas
    function _openPopupDigitalBusiness(item) {
      $scope.data = item
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template: '<mpf-popup-digital-business item="data" close="closeModal()" dismiss="closeModal()" success="successModal()"></mpf-popup-digital-business>',
        controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

          $scope.successModal = function () {
            vm.searchDigitalBusiness(true);
            $uibModalInstance.close();
          };
        }]
      });
    }

    function _searchDigitalBusinessResponse(response) {
      vm.pagination.noSearch = false;
      vm.pagination.response = response;
      response.TotalPaginas = Math.ceil(response.Data.length / vm.pagination.maxSize); // Eliminar cuando se genere el paginador
      vm.pagination.totalItems = parseInt(response.TotalPaginas) * vm.pagination.maxSize;
      vm.pagination.items = _paginate(response.Data, vm.pagination.maxSize, vm.pagination.currentPage); // Quitar funcion cuando se genere paginador
      vm.pagination.noResult = response.Data.length === 0;
    }

    function _paginate(data, size, page) {
      return data.slice((page - 1) * size, page * size)
    }

    function _clearResults() {
      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalItems: 0,
        items: [],
        noSearch: true,
        noResult: false
      };
    }
  }
});
