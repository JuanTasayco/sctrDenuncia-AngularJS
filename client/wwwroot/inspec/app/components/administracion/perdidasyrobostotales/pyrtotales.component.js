'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  pyrtotalesController.$inject = [
    '$scope',
    '$rootScope',
    'inspecFactory',
    '$uibModal',
    'mModalAlert',
    'mModalConfirm',
    'MxPaginador',
    '$timeout',
    'ErrorHandlerService',
    '$q'
  ];

  function pyrtotalesController(
    $scope
    , $rootScope
    , inspecFactory
    , $uibModal
    , mModalAlert
    , mModalConfirm
    , MxPaginador
    , $timeout
    , ErrorHandlerService
    , $q) {
    var vm = this;
    var page;

    vm.$onInit = onInit;
    vm.loadData = loadData;
    vm.loadItems = loadItems;

    vm.arrPruebas = [];

    function onInit() {

      page = new MxPaginador();
      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page.setNroItemsPorPagina(vm.itemsXPagina);

      vm.dataTotalLost = [];
      vm.totalItems = 0;
      vm.totalPages = 0;

      $timeout(function(){
        loadItems();
      }, 2000);
    }

    function loadItems(){
      vm.currentPage = 1;
      vm.params = {
        search: ng.isUndefined(vm.mSearchLicenseTxt) ? "" : vm.mSearchLicenseTxt.value,
        type: ng.isUndefined(vm.mSearchLicenseTxt) ? "" : vm.mSearchLicenseTxt.type,
        pageNum: 1,
        pageSize: 10,
        sortingType: 1,
        history: true
      }
      page.setCurrentTanda(vm.currentPage);
      getItems();
    }

    vm.fnAutoCompleteLicense = _fnAutoCompleteLicense;
    function _fnAutoCompleteLicense(txt){
      if(txt && txt.length >= 2){
        var defer = $q.defer();
        var pms = inspecFactory.management.totalLostSearch(txt)
        pms.then(function(response){
          var dataLicense = response.data || response.Data
          if(dataLicense.length > 0){
            var i = 0;
            ng.forEach(dataLicense, function(item){
              dataLicense[i].idName = dataLicense[i].description
              i++
            })
            $scope.noResults = false;
          }else $scope.noResults = true
          defer.resolve(dataLicense);
        })
        .catch(function(e) {
          ErrorHandlerService.handleError(e);
        });
        return defer.promise
      }
    }

    /*--------------------------------------
    Paginador
    ----------------------------------------*/
    vm.pageChanged = pageChanged;
    function pageChanged(event){
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda){
        vm.params.pageNum = nroTanda;
        getItems();
      }, setLstCurrentPage);
    }

    function getItems(){
      var pms = inspecFactory.management.getItemListTotalLost(vm.params);
      pms.then(function(response){
        if(response.operationCode == 200){
          vm.dataTotalLost =  response.data.totalLost
          vm.totalItems = response.data.totalRow;
          vm.totalPages = response.data.totalPage;
        }
        else mModalAlert.showWarning(response.message, '');
        page.setNroTotalRegistros(vm.totalItems).setDataActual(vm.dataTotalLost).setConfiguracionTanda();
        setLstCurrentPage();
      })
      .catch(function(e){
        ErrorHandlerService.handleError(e)
      })
    }

    function setLstCurrentPage() {
      vm.dataTotalLost = page.getItemsDePagina();
    }

    function loadData() {
      var vModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'md',
        templateUrl: '/inspec/app/components/administracion/perdidasyrobostotales/modal-carga-masiva.html',
        controllerAs: '$ctrl',
        controller: [
          '$scope',
          'mModalAlert',
          '$uibModalInstance',
          'ErrorHandlerService',
          function($scope, mModalAlert, $uibModalInstance, ErrorHandlerService) {
            var vm = this;
            vm.closeModal = closeModal;
            vm.loadData = loadData;
            vm.formData = {};

            function closeModal() {
              $uibModalInstance.close();
            }

            function loadData() {
              var pms = inspecFactory.management.loadDataLost(vm.formData.planilla[0])
              pms.then(function(response) {
                if(response.operationCode == 200){
                  mModalAlert.showSuccess('Carga exitosa', 'CARGA EXCEL')
                  .then(function() {
                    closeModal();
                    loadItems()
                  });
                }else mModalAlert.showWarning(response.message, '')
              })
              .catch(function(e) {
                ErrorHandlerService.handleError(e);
              });
            }

            $scope.$watch(
              function() {
                return vm.formData.planilla;
              },
              function(newValue) {
                if (newValue) {
                  vm.formData.fileName = vm.formData.planilla[0].name;
                }
              }
            );
          }
        ]
      });
      vModal.result.then(
        function() {
          //  todo
        },
        function() {
          //  todo
        }
      );
    }

  }

  return ng
    .module('appInspec')
    .controller('PyrtotalesController', pyrtotalesController)
    .component('inspecTotales', {
      templateUrl: '/inspec/app/components/administracion/perdidasyrobostotales/pyrtotales.html',
      controller: 'PyrtotalesController',
      controllerAs: '$ctrl'
    });
});
