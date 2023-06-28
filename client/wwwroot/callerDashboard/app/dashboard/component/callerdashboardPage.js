(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'callerDashboardPage', ['angular', 'system', 'lodash'], function(angular, system, _) {
  angular
    .module('oim.caller.dashboard')
    .controller('callerDashboardPageController', [
      '$scope',
      'proxyDashboard',
      'serviceMonitor',
      'decoratorData',
      'accessSupplier',
      function($scope, proxyDashboard, serviceMonitor, decoratorData, accessSupplier) {
        var vm = this;
        vm.$onInit = onInit;
        var countToCall = 12;
        var countToAssing = countToCall;
        var audio = new Audio('/callerDashboard/alert.mp3');
        var oldIdsSummaryToCall = [];
        var newIdsSummaryToCall = [];
        var firstTime = true;

        function onInit() {
          vm.isTvUser = /usr_dashboard/g.test(accessSupplier.profile().loginUserName.toLowerCase());
          // vm.isTvUser = /usr_dashboard/g.test(accessSupplier.profile().loginUserName);
          vm.options = {
            isTvUser: vm.isTvUser
          };
          serviceMonitor(function() {
            return proxyDashboard.Get(countToCall, countToAssing, true);
          }, $scope)
            .begin()
            .then(
              function(response) {
                decoratorData.incidents(response.summaryToCall);
                decoratorData.incidents(response.summaryToAssign);
                vm.data = response;
                if (firstTime) {
                  oldIdsSummaryToCall = getIds(response.summaryToCall);
                  return void (firstTime = false);
                }

                newIdsSummaryToCall = getIds(response.summaryToCall);
                if (!!checkNewItemInArray(oldIdsSummaryToCall, newIdsSummaryToCall).length) {
                  audio.play();
                  oldIdsSummaryToCall = [].concat(newIdsSummaryToCall);
                }
              },
              function(response) {
                console.error(response);
              }
            );
        }

        function getIds(arr) {
          return _.map(arr, function mstc(item) {
            return item.attentionRequestId;
          });
        }

        function checkNewItemInArray(arrOld, arrNew) {
          return _.filter(arrNew, function filterArrO(item) {
            return !_.include(arrOld, item);
          });
        }
      }
    ])
    .component('callerDashboardPage', {
      templateUrl: system.pathAppBase('/dashboard/component/callerdashboardPage.html'),
      controller: 'callerDashboardPageController',
      bindings: {
        objectValue: '<?'
      }
    });
});
