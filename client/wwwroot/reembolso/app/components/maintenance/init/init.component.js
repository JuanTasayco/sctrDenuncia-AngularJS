'use strict';

define(['angular', 'lodash'], function (ng, _) {
  InitMaintenanceController.$inject = [
    'reFactory',
    '$log',
    '$q',
    '$uibModal',
    '$scope',
    'mModalAlert'
  ];

  function InitMaintenanceController(
    reFactory,
    $log,
    $q,
    $uibModal,
    $scope,
    mModalAlert
  ) {
    var vm = this;
    vm.soatExecutivesList = [];
    vm.executivesList = [];
    vm.executivesListChecked = [];
    vm.brokersList = [];
    vm.isSoatExecutive = true;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.onDeactivateGroup = onDeactivateGroup;
    vm.onCreateExecutive = onCreateExecutive;
    vm.onCheckExecutive = onCheckExecutive;
    vm.onChangeExecutiveState = onChangeExecutiveState;
    vm.onEditExecutive = onEditExecutive;
    vm.onSelectTab = onSelectTab;
    vm.fnModalSoatExecutive = fnModalSoatExecutive;
    vm.fnModalExecutive = fnModalExecutive;

    function onInit() {
      vm.headerSoatExecutiveGrid = ['', 'Código', 'Último dígito', 'Estado', ''];
      vm.headerExecutiveGrid = ['', 'Código', 'Médico', 'Estado', ''];
      _serviceGetAllSoatExecutives();
      _serviceGetAllExecutives();
    }

    function onChanges(change) {
    }

    function onSelectTab(index) {
      vm.isSoatExecutive = index === 0;
      _validateConfigByDefaultExecutiveList();
    }

    function onDeactivateGroup() {
      _serviceDeactivateMassive(vm.executivesListChecked);
    }

    function onCreateExecutive() {
      var inputList = [
        {
          placeholder: 'Código Ejecutivo',
          source: _serviceSearchExecutive,
          model: 'executive',
          nameInput: 'nExecutive'
        }
      ];

      var seekers = !vm.isSoatExecutive ? inputList.concat({
        placeholder: 'Código Médico',
        source: _serviceSearchMedic,
        model: 'medic',
        nameInput: 'nMedic'
      }) : inputList;

      _showModal('add', {}, seekers).result
        .then(function(data) {
          data.error
            ? mModalAlert.showError(data.txtError, 'Error')
            :_serviceAddExecutive(data)
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function onEditExecutive(data) {
      data.error
        ? mModalAlert.showError(data.txtError, 'Error')
        : _serviceUpdateExecutive(data);
    }

    function onCheckExecutive(executive) {
      var currentList = vm.isSoatExecutive ? vm.soatExecutivesList : vm.executivesList;
      vm.executivesListChecked = _validateCheckedItems(currentList, executive);
    }

    function onChangeExecutiveState(item) {
      _serviceChangeExecutiveState(item);
    }

    function fnModalExecutive(item) {
      var seekers = [
        {
          placeholder: 'Código Ejecutivo',
          source: _serviceSearchExecutive,
          model: 'executive',
          nameInput: 'nExecutive'
        },
        {
          placeholder: 'Código Médico',
          source: _serviceSearchMedic,
          model: 'medic',
          nameInput: 'nMedic'
        }
      ];

      return _showModal('edit', item, seekers);
    }

    function fnModalSoatExecutive(item) {
      var seekers = [
        {
          placeholder: 'Código Ejecutivo',
          source: _serviceSearchExecutive,
          model: 'executive',
          nameInput: 'nExecutive'
        }
      ];

      return _showModal('edit', item, seekers);
    }

    function _serviceGetAllSoatExecutives() {
      reFactory.maintenance.GetAllSoatExecutives()
        .then(function(res) {
          vm.soatExecutivesList = res.isValid && _mapStateExecutivesList(_mapCheckExecutivesList(res.data));
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _serviceGetAllExecutives() {
      reFactory.maintenance.GetAllExecutives()
        .then(function(res) {
          vm.executivesList = res.isValid && _mapStateExecutivesList(_mapCheckExecutivesList(res.data));
          _validateConfigByDefaultExecutiveList();
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _serviceChangeExecutiveState(item) {
      var req = vm.isSoatExecutive ? {
        executiveCode: item.executiveCode,
        lastSinisterNumber: item.lastSinisterNumber,
        isActive: item.isActive
      } : {
        idRefundExecutive: item.idRefundExecutive,
        isActive: item.isActive,
      };
      var serviceName = vm.isSoatExecutive ? 'ToggleStateSoatExecutive' : 'ToggleStateExecutive';

      _serviceBase(serviceName, req, _serviceGetAllSoatExecutives);
    }

    function _serviceDeactivateMassive(itemsListChecked) {
      var req = _.map(itemsListChecked, function(item) {
        return _.assign(
          {},
          vm.isSoatExecutive ? {
            executiveCode: item.executiveCode,
            isActive: item.isActive,
            lastSinisterNumber: item.lastSinisterNumber
          } : {
            idRefundExecutive: item.idRefundExecutive,
            isActive: item.isActive
          }
        );
      });

      var serviceName = vm.isSoatExecutive ? 'MassiveDeactivateStateSoat' : 'MassiveDeactivateState';
      vm.executivesListChecked = [];

      _serviceBase(serviceName, req);
    }

    function _serviceSearchExecutive(input) {
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

    function _serviceSearchMedic(input) {
      var criteria = input.toUpperCase();
      var defer = $q.defer();

      reFactory.solicitud.GetMedicList(criteria).then(
        function (res) {
          defer.resolve(res.data);
        },
        function (err) {
          mModalAlert.showError(err.data.message, 'Error');
        }
      );

      return defer.promise;
    }

    function _serviceUpdateExecutive(data) {
      var req = {
        executiveCode: data.executive.userCode,
        lastSinisterNumber: data.digit && data.digit.lastSinisterNumber,
        isActive: data.isActive,
        oldLastSinisterNumber: data.lastSinisterNumber
      };
      
      vm.isSoatExecutive ? _serviceBase('UpdateExecutive', req) : _serviceGetAllExecutives();
    }

    function _serviceAddExecutive(data) {
      var req = {
        executiveCode: data.executive.userCode,
        lastSinisterNumber: data.digit && data.digit.lastSinisterNumber
      };

      vm.isSoatExecutive ? _serviceBase('AddSoatExecutive', req) : _serviceGetAllExecutives();
    }

    function _serviceBase(service, request, fnCallbackError) {
      reFactory.maintenance[service](request)
        .then(function(res) {
          if (res.isValid) {
            vm.isSoatExecutive ? _serviceGetAllSoatExecutives() : _serviceGetAllExecutives();
          } else {
            mModalAlert.showError(res.brokenRulesCollection[0].description, 'Error')
              .then(function(res) {
                res && fnCallbackError();
              });
          }
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _showModal(mode, item, seekersList, brokersList) {
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
            current-item='item' \
            mode='mode' \
            show-detail-executive='showDetailExecutive' \
            brokers-list='brokersList' \
            is-maintenance='isMaintenance'> \
          </re-reassign-modal>",
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.mode = mode;
            scope.title = mode === 'add' ? 'Agregar nuevo ejecutivo' : 'Reasignar ejecutivo';
            scope.item = item || null;
            scope.showDetailExecutive = !vm.isSoatExecutive
            scope.inputsSeekersList = seekersList;
            scope.brokersList = brokersList || [];
            scope.isMaintenance = true;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _validateCheckedItems(itemsList) {
      return _.filter(itemsList, function(item) {
        return item.isChecked;
      })
    }

    function _validateConfigByDefaultExecutiveList() {
      var defaultItemConfiguration = _.find(vm.executivesList, function(executive) {
        return executive.isDefaultConfiguration === '1'
      });

      (defaultItemConfiguration === undefined && !vm.isSoatExecutive) &&
        mModalAlert.showWarning('Debes tener una configuración por defecto', 'Alerta');
    }

    function _mapStateExecutivesList(list) {
      return _.map(list, function(item) {
        return _.assign({}, item, {
          isActiveState: item.isActive == '1',
          itemId: item.lastSinisterNumber || item.lastSinisterNumber === 0
            ? (item.executiveCode + item.lastSinisterNumber)
            : item.idRefundExecutive
        })
      })
    }

    function _mapCheckExecutivesList(list) {
      return _.map(list, function(item) {
        return _.assign({}, item, {
          isChecked: false
        })
      })
    }
  }

  return ng
    .module('appReembolso')
    .controller('InitMaintenanceController', InitMaintenanceController)
    .component('reInitMaintenance', {
      templateUrl: '/reembolso/app/components/maintenance/init/init.html',
      controller: 'InitMaintenanceController',
      bindings: {}
    })
});
