'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReassignModalController.$inject = ['reFactory', '$log', '$q', 'mModalAlert'];

  function ReassignModalController(reFactory, $log, $q, mModalAlert) {
    var vm = this;
    vm.brokersList = [];
    vm.isVisibleBrokers = false;
    vm.$onInit = onInit;
    vm.closeModal = closeModal;
    vm.onAccept = onAccept;
    vm.onSearchBroker = onSearchBroker;
    vm.onAddBroker = onAddBroker;
    vm.onAddHeader = onAddHeader;
    vm.onDeleteBroker = onDeleteBroker;
    vm.onCheck = onCheck;

    function onInit() {
      vm.data = _.assign(
        {},
        {
          brokers: [],
          sinisterNumber: ''
        },
        vm.mode === 'edit' && {
          idRefundExecutive: vm.currentItem.idRefundExecutive,
          isDefaultConfiguration: vm.currentItem.isDefaultConfiguration === '1',
          executive: {
            userCode: vm.currentItem.executiveCode
          },
          medic: {
            userCode: vm.currentItem.doctorCode
          },
        }
      );

      (vm.mode === 'edit' && vm.showDetailExecutive) &&  _serviceGetBrokers(vm.data.idRefundExecutive);
      (!vm.showDetailExecutive && vm.isMaintenance) && _serviceLastSinisterNumber();
    }

    function closeModal() {
      vm.close(void 0);
    }

    function onAccept() {
      if (vm.frm.$invalid) {
        vm.frm.markAsPristine();
        return void 0;
      }

      vm.close({
        $event: {
          data: vm.data,
          status: 'ok'
        }
      })
    }

    function onAddBroker() {
      if (vm.frm.$invalid) {
        vm.frm.markAsPristine();
        return void 0;
      }

      typeof vm.broker !== 'undefined' && _serviceAddBroker({
        idRefundExecutive: vm.data.idRefundExecutive,
        idBroker: vm.broker.idBroker
      });
    }

    function onAddHeader() {
      if (vm.frm.$invalid) {
        vm.frm.markAsPristine();
        return void 0;
      }

      _serviceAddHeader({
        idRefundExecutive: vm.data.idRefundExecutive || 0,
        isDefaultConfiguration: vm.data.isDefaultConfiguration ? '1' : '0',
        executiveCode: vm.data.executive.userCode,
        doctorCode: vm.data.medic.userCode
      });
    }

    function onDeleteBroker(broker) {
      vm.mode === 'edit' && _serviceDeleteBroker({
        idRefundExecutive: vm.data.idRefundExecutive,
        idBroker: broker.idBroker
      });
    }

    function onSearchBroker(input) {
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

    function onCheck(item) {
    }

    function _serviceGetBrokers(executiveId) {
      reFactory.maintenance.GetBrokersByExecutive(executiveId)
        .then(function(res) {
          vm.brokersList = res.isValid ? res.data.broker : [];
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _serviceDeleteBroker(broker) {
      reFactory.maintenance.DeleteBroker(broker)
        .then(function(res) {
          res.isValid && _serviceGetBrokers(vm.data.idRefundExecutive);
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _serviceAddHeader(req) {
      reFactory.maintenance.AddExecutive(req)
        .then(function(res) {
          vm.isVisibleBrokers = res.isValid;
          vm.isVisibleBrokers && (vm.data.idRefundExecutive = res.data.idRefundExecutive);
          (vm.mode === 'edit' && vm.isVisibleBrokers) && _serviceGetBrokers(vm.data.idRefundExecutive);
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _serviceAddBroker(req) {
      reFactory.maintenance.AddBroker(req)
        .then(function(res) {
          res.isValid ?
            _serviceGetBrokers(vm.data.idRefundExecutive) :
            mModalAlert.showError(res.brokenRulesCollection[0].description, 'Error');
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _serviceLastSinisterNumber() {
      reFactory.maintenance.GetAllAvailableLastDigit()
        .then(function(res) {
          vm.lastSinisterNumberList = res.isValid ? _.map(res.data, function(item) {
            return { lastSinisterNumber: item.lastSinisterNumber.toString() }
          }) : [];

          if (!res.isValid && vm.mode !== 'edit') {
            vm.close({
              $event: {
                data: {
                  error: true,
                  txtError: res.brokenRulesCollection[0].description
                },
                status: 'ok'
              }
            })
          }
        })
        .catch(function(err) {
          $log.error(err);
        })
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReassignModalController', ReassignModalController)
    .component('reReassignModal', {
      templateUrl: '/reembolso/app/common/modals/reassign/reassign.html',
      controller: 'ReassignModalController',
      bindings: {
        close: '&?',
        inputSeekersList: '<',
        title: '<',
        currentItem: '<',
        mode: '<',
        showDetailExecutive: '<',
        isReassignMasive: '<',
        isMaintenance: '<'
      }
    })
})
