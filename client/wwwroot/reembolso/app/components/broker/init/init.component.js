'use strict';

define(['angular', 'ReembolsoActions', 'lodash'], function (ng, ReembolsoActions, _) {
  InitAsignarBrokerController.$inject = ['reFactory', '$ngRedux', '$uibModal', '$log', '$q', 'mModalAlert', '$scope'];

  function InitAsignarBrokerController(reFactory, $ngRedux, $uibModal, $log, $q, mModalAlert, $scope) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.changeCompany = changeCompany;
    vm.getBrokerList = getBrokerList;
    vm.getEjecutivoList = getEjecutivoList;
    vm.search = search;
    vm.openModalAssign = openModalAssign;
    vm.openModalReassign = openModalReassign;
    vm.onEnableReassign = onEnableReassign;
    vm.pageChanged = pageChanged;
    vm.cleanForm = cleanForm;

    // function declaration

    function onInit() {
      vm.itemsChecked = [];
      vm.disabledButton = "disabled";
      vm.consultData = _mapInitForm();

      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {
          Descripcion: 'Más reciente',
          Codigo: '1'
        }
      };

      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      _getCompanies();
      _getStates();
      search(vm.pagination.currentPage);
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        asignarBroker: state
      };
    }

    function getBrokerList(input) {
      var criteria = input.toUpperCase();

      var defer = $q.defer();
      reFactory.solicitud.GetBrokerList(criteria).then(
        function (res) {
          defer.resolve(res.data);
        },
        function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        }
      );

      return defer.promise;
    }

    function getEjecutivoList(input) {
      var criteria = input.toUpperCase();

      var defer = $q.defer();
      reFactory.solicitud.GetEjecutivoList(criteria).then(
        function (res) {
          defer.resolve(res.data);
        },
        function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        }
      );

      return defer.promise;
    }

    function openModalAssign(item) {
      var edit = _.keys(item).length > 0;
      var data = edit ? item : vm.consultData;
      _showModalAssignNew(data, edit).result.then(function (r) {})
    }

    function openModalReassign() {
      _showModalReassignBroker();
    }

    function changeCompany() {
      if (vm.consultData.company.idCompany) {
        _getProductType(vm.consultData.company.idCompany);
      }
    }

    function search(currentPageNumber) {
      var request = {
        executiveCode: vm.consultData.ejecutivo ? vm.consultData.ejecutivo.executiveCode : null,
        idBroker: vm.consultData.broker ? vm.consultData.broker.idBroker : null,
        idCompany: vm.consultData.company.idCompany,
        idDocumentStatus: vm.consultData.state.idDocumentStatus,
        pageNum: currentPageNumber || vm.pagination.currentPage,
        pageSize: vm.pagination.maxSize,
        productCode: vm.consultData.productType.productCode,
        sortingType: 0
      };

      reFactory.solicitud
        .GetAllProductsDashboard(request)
        .then(function (res) {
          vm.dashboardData = res.isValid ? res.data.result : [];
          vm.pagination.totalRecords = res.isValid ? res.data.totalRows : 0;
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function pageChanged() {
      search(vm.pagination.currentPage);
    }

    function cleanForm() {
      vm.consultData = _mapInitForm();
      search(1);
    }

    function onEnableReassign() {
      vm.itemsChecked = _.filter(vm.dashboardData, function (item) {
        return item.mCheck
      })

      vm.isEnableReassignBtn = vm.itemsChecked.length > 0;
    }

    // privates

    function _getCompanies() {
      reFactory.solicitud
        .GetAllCompany()
        .then(function (res) {
          vm.companiesList = res.data;
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getProductType(companyId) {
      reFactory.solicitud
        .GetProductsByCompany(companyId)
        .then(function (res) {
          vm.productType = res.data;
        })
        .catch(function (err) {
          vm.productType = [];
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getStates() {
      reFactory.solicitud
        .GetAllDocumentStatus()
        .then(function (res) {
          vm.states = res.data;
        })
        .catch(function (err) {
          vm.states = [];
          $log.error('Fallo en el servidor', err);
        });
    }

    function _showModalAssignNew(data, edit) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<re-modal-assign-broker close="close($event)" data="data" edit="edit"></re-modal-assign-broker>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.data = data;
            scope.edit = edit;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _showModalReassignBroker() {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl: 'app/common/modals/modal-assign-broker/modal-reassign-broker.html',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.closeModal = function () {
              $uibModalInstance.close();
            };

            scope.ejecutivoAutocomplete = function (input) {
              return getEjecutivoList(input);
            };

            scope.reassignBroker = function () {
              if (scope.frmBroker.$invalid) {
                scope.frmBroker.markAsPristine();
                return void 0;
              }

              var request = _.map(vm.itemsChecked, function (item) {
                return _.assign({}, {
                  executiveCode: scope.ejecutivo.executiveCode,
                  idRefundBroker: item.idRefundBroker
                })
              })

              reFactory.solicitud
                .ReassignExecutiveMassive(request)
                .then(function (res) {
                  if (res.isValid) {
                    search(vm.pagination.currentPage);
                    scope.closeModal();
                  } else {
                    mModalAlert.showError('', 'Error');
                  }
                })
                .catch(function (err) {
                  $log.error('Fallo en el servidor', err);
                })
            }
          }
        ]
      });
    }

    function _mapInitForm() {
      return _.assign({}, {
        company: {
          idCompany: null
        },
        productType: {
          productCode: null
        },
        state: {
          idDocumentStatus: null
        }
      })
    }
  }

  return ng
    .module('appReembolso')
    .controller('InitAsignarBrokerController', InitAsignarBrokerController)
    .component('reInitAsignarBroker', {
      templateUrl: '/reembolso/app/components/broker/init/init.html',
      controller: 'InitAsignarBrokerController',
      bindings: {}
    });
});
