'use strict';

define(['angular', 'moment', 'lodash'], function(ng, moment, _) {
  alertsController.$inject = ['$scope', 'UserService', 'inspecFactory', '$timeout', '$log', '$uibModal'];

  function alertsController($scope, UserService, inspecFactory, $timeout, $log, $uibModal) {
    var vm = this;
    vm.$onInit = onInit;
    vm.queryAlerts = queryAlerts;
    vm.toggleReply = toggleReply;
    vm.createAlert = createAlert;
    vm.addAlert = addAlert;
    vm.showDropdown = showDropdown;
    vm.validateMessage = validateMessage;
    vm.showReplicateAlert = showReplicateAlert;

    function onInit() {
      vm.alerts = [];
      vm.replyAlert = false;
      vm.activePill = 0;
      vm.validMessage = true;
      vm.roles = [{name: 'SOLICITANTE', id: 'S'}, {name: 'INSPECTOR', id: 'I'}];
      vm.isForProgram = false;
      vm.selectedRequests = [];
      vm.selectedRequestLength = 0;
      queryAlerts();
    }

    function queryAlerts() {
      return inspecFactory.requests
        .getAlerts(vm.riskId, true)
        .then(function(response) {
          return _.map(response.data, function(alert) {
            alert.previewMessage = alert.message ? alert.message.substring(0, 69) + '...' : '';
            alert.message = alert.message ? alert.message.replace(/\r/g, '<br>') : '';
            alert.creationDate = moment(alert.creationDate, 'D/MM/YYYY h:mm:ss A').toDate();
            alert.sendEmail = alert.sendEmailCode === 'S';
            return alert;
          });
        })
        .then(function(alerts) {
          vm.alerts = alerts;
          if (alerts.length > 0) {
            $timeout(function() {
              vm.activePill = 0;
              vm.isForProgram = alerts[0].riskStatusId === 1;
            });
          }
        });
    }

    function toggleReply() {
      vm.validMessage = true;
      vm.replyAlert = !vm.replyAlert;
      vm.selectedRequestLength = 0;
      vm.selectedRequests = [];
      vm.responseAlert = true;
      vm.mMessage = '';
      vm.sendEmail = true;
    }

    function createAlert() {
      vm.validMessage = true;
      vm.responseAlert = false;
      vm.replyAlert = true;
      vm.selectedRequestLength = 0;
      vm.selectedRequests = [];
      vm.mMessage = '';
      vm.sendEmail = true;
    }

    function addAlert() {
      if (validateMessage(true)) {
        var originalAlert = {
          RiskId: +vm.riskId,
          AlertTypeCode: vm.responseAlert ? '2' : '1',
          AlertMessage: vm.mMessage.toUpperCase(),
          UserRoleTarget: vm.roleDestination ? vm.roleDestination.name : 'SOLICITANTE',
          SendTypeCode: vm.roleDestination ? vm.roleDestination.id : 'I',
          SendEmailCode: vm.sendEmail ? 'S' : 'N'
        };

        if (vm.selectedRequests > 0) {
          var alerts = [];
          alerts.push(originalAlert);
          ng.forEach(vm.selectedRequests, function(riskId) {
            var alert = {
              RiskId: +riskId,
              AlertTypeCode: vm.responseAlert ? '2' : '1',
              AlertMessage: vm.mMessage.toUpperCase(),
              UserRoleTarget: vm.roleDestination ? vm.roleDestination.name : 'SOLICITANTE',
              SendTypeCode: vm.roleDestination ? vm.roleDestination.id : 'I',
              SendEmailCode: vm.sendEmail ? 'S' : 'N'
            };
            alerts.push(alert);
          });
          inspecFactory.requests.addAlertFleet(alerts, true).then(function() {
            queryAlerts();
            vm.replyAlert = false;
          });
        } else {
          inspecFactory.requests.addAlert(originalAlert, true).then(function() {
            queryAlerts();
            vm.replyAlert = false;
          });
        }
      } else {
        vm.validMessage = false;
      }
    }

    function getFleetAlerts() {
      return inspecFactory.requests.getFleetForAlerts(vm.requestId, true).then(function(response) {
        vm.isFleet = response.data.length > 1;
        if (vm.isFleet) {
          vm.associatedFleet = response.data;
        }
      });
    }

    function showDropdown(riskStatusCode) {
      return riskStatusCode !== '1';
    }

    function validateMessage(sending) {
      return sending ? vm.mMessage.length > 0 : true;
    }

    function showReplicateAlert() {
      var associedFleet = vm.associatedFleet;
      var selectedRequests = ng.copy(vm.selectedRequests);
      var riskId = vm.riskId;
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/_app/common/modals/modal-replicate.html',
          controllerAs: '$ctrl',
          controller: 'ModalReplicateController',
          resolve: {
            modalTitle: function() {
              return 'REPLICAR ALERTA';
            },
            buttonText: function() {
              return 'REPLICAR';
            },
            associedFleet: function() {
              return associedFleet;
            },
            selectedRequests: function() {
              return selectedRequests;
            },
            riskId: function() {
              return riskId.toString();
            }
          }
        })
        .result.then(function(toReply) {
          if (toReply) {
            var found = toReply.indexOf(+vm.riskId);
            if (found !== -1) {
              toReply.splice(found, 1);
            }
            vm.selectedRequests = toReply;
            vm.selectedRequestLength = toReply.length;
          }
        });
    }

    $scope.$watch(
      function() {
        return vm.activePill;
      },
      function() {
        vm.replyAlert = false;
        vm.mMessage = '';
        vm.sendEmail = false;
      }
    );

    $scope.$watch(
      function() {
        return vm.replyAlert;
      },
      function(newValue) {
        if (newValue) {
          if (vm.isFleet) {
            getFleetAlerts();
          }
        }
      }
    );

    $scope.$watch(
      function() {
        return vm.mMessage;
      },
      function(newValue) {
        if (newValue) {
          vm.validMessage = newValue.length > 0;
        }
      }
    );

    $scope.$watch(
      function() {
        return vm.reInit;
      },
      function(newValue, oldValue) {
        if (newValue) {
          onInit();
        } else if (!newValue && oldValue) {
          vm.alerts = [];
        }
      }
    );
  }

  return ng
    .module('appInspec')
    .controller('AlertsController', alertsController)
    .component('inspecAlerts', {
      templateUrl: '/inspec/app/common/alerts/alerts.html',
      controller: 'AlertsController',
      controllerAs: '$ctrl',
      bindings: {
        riskId: '=',
        requestId: '=',
        reInit: '=',
        isFleet: '='
      }
    });
});
