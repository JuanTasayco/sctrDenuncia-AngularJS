'use strict';

define(['angular', 'lodash'], function (ng, _) {
  InitReasignarEjecutivoController.$inject = [
    'reFactory',
    '$log',
    '$q',
    '$uibModal',
    '$scope',
    'mModalAlert'
  ];

  function InitReasignarEjecutivoController(
    reFactory,
    $log,
    $q,
    $uibModal,
    $scope,
    mModalAlert
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.onChangeCompany = onChangeCompany;
    vm.onSelectExecutive = onSelectExecutive;
    vm.onSelectMedic = onSelectMedic;
    vm.onEdit = onEdit;
    vm.onCheck = onCheck;
    vm.onCleanFilters = onCleanFilters;
    vm.onSearchFilter = onSearchFilter;
    vm.onChangePage = onChangePage;
    vm.onReassign = onReassign;

    function onInit() {
      vm.reassignList = [];
      vm.consultData = _mapInitFilters();

      _getCompanies();

      vm.pagination = {
        currentPage: 1,
        maxSize: 10,
        totalRecords: 0,
        mOrderBy: {
          Descripcion: 'Más reciente',
          Codigo: '1'
        }
      };
    }

    function onChangeCompany() {
      if (vm.consultData.company.idCompany) {
        vm.consultData.productType = {
          productCode: null
        };
        _getProductType(vm.consultData.company.idCompany);
      } else {
        vm.productType = [];
      }
    }

    function onSelectExecutive(input) {
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

    function onSelectMedic(input) {
      var criteria = input.toUpperCase();
      var defer = $q.defer();

      if (vm.consultData.productType.productCode) {
        reFactory.solicitud.GetMedicList(criteria, vm.consultData.productType.productCode).then(
          function (res) {
            defer.resolve(res.data);
          },
          function (err) {
            mModalAlert.showError(err.data.message, 'Error');
          }
        );

        return defer.promise;
      } else {
        mModalAlert.showError('Debes elegir un producto', 'Error');
      }
    }

    function onEdit(executive) {
      var seekers = _seekersModal();
      _showModalEdit('edit', seekers, executive);
    }

    function onReassign() {
      var seekers = _seekersModal();
      _showModalEdit('', seekers, null, true);
    }

    function onCheck() {
      vm.reassignList = _.filter(vm.executiveList, function (item) {
        return item.mCheck;
      });

      vm.isEnableReassignBtn = vm.reassignList.length > 1;
    }

    function onCleanFilters() {
      vm.consultData = _mapInitFilters();
      vm.productType = [];
      vm.executiveList = [];
    }

    function onSearchFilter(currentPageNumber) {
      if (vm.frmExecutive.$invalid) {
        vm.frmExecutive.markAsPristine();
        return void 0;
      }

      var request = {
        idCompany: vm.consultData.company.idCompany,
        productCode: vm.consultData.productType.productCode,
        executiveCode: vm.consultData.executive ? vm.consultData.executive.userCode : undefined,
        doctorCode: vm.consultData.medic ? vm.consultData.medic.userCode : undefined,
        pageNum: currentPageNumber || vm.pagination.currentPage,
        pageSize: vm.pagination.maxSize,
        sortingType: 0
      };

      reFactory.reassignExecutive.GetSinisterList(request)
        .then(function (res) {
          vm.executiveList = res.isValid ? res.data.result : [];
          vm.pagination.totalRecords = res.isValid ? res.data.totalRows : 0;
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function onChangePage() {
      vm.onSearchFilter(vm.pagination.currentPage);
    }

    function _showModalEdit(mode, seekersList, item, isReassignMasive) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: "\
          <re-reassign-modal \
            close='close($event)' \
            title='title' \
            input-seekers-list='inputsSeekersList' \
            mode='mode' \
            current-item='item' \
            is-reassign-masive='isReassignMasive' \
            show-detail-executive='showDetailExecutive' \
          </re-reassign-modal>",
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.inputsSeekersList = seekersList;
            scope.title = 'Reasignar ejecutivo';
            scope.mode = mode;
            scope.item = item || null;
            scope.isReassignMasive = isReassignMasive;
            scope.showDetailExecutive = false
            scope.close = function (ev) {
              if (ev && ev.status === 'ok') {
                $uibModalInstance.close(ev.data);
                var list = vm.isEnableReassignBtn ? vm.reassignList : [scope.item]
                _updateAssignment(list, ev.data);
              } else {
                $uibModalInstance.dismiss();
              }
            };
          }
        ]
      });
    }

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

    function _updateAssignment(executive, modalData) {
      if (modalData.executive || modalData.medic) {
        var req = _.map(executive, function(item) {
          return {
            executiveCode: modalData.executive ? modalData.executive.userCode : item.executiveCode,
            doctorCode: modalData.medic ? modalData.medic.userCode : item.doctorCode,
            productCode: item.productCode,
            anio: item.anio,
            documentControlNumber: item.documentControlNumber
          }
        });

        reFactory.reassignExecutive.UpdateAssignment(req)
          .then(function(res) {
            vm.onSearchFilter(vm.pagination.currentPage);
          })
          .catch(function(err) {
            $log.error(err);
          });
      }
    }

    function _mapInitFilters() {
      return {
        company: {
          idCompany: null
        },
        productType: {
          productCode: null
        }
      }
    }

    function _seekersModal() {
      return [
        {
          placeholder: 'Código Ejecutivo',
          source: onSelectExecutive,
          model: 'executive',
          nameInput: 'nExecutive'
        },
        {
          placeholder: 'Código Médico',
          source: onSelectMedic,
          model: 'medic',
          nameInput: 'nMedic'
        }
      ];
    }
  }

  return ng
    .module('appReembolso')
    .controller('InitReasignarEjecutivoController', InitReasignarEjecutivoController)
    .component('reInitReasignarEjecutivo', {
      templateUrl: '/reembolso/app/components/ejecutivo/init/init.html',
      controller: 'InitReasignarEjecutivoController',
      bindings: {}
    })
});
