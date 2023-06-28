'use strict';
define(['angular'], function(ng) {
  return ng.module('referenciaApp')
    .controller('PageHeaderController', ['$scope', '$transclude', function ctrlFn($scope, $transclude) {
      var vm = this;
      vm.areRightActionsCollapsed = true;

      vm.$onInit = function() {
        vm.areRightActions = vm.checkIfRightActions();
      };

      vm.checkIfRightActions = function() {
        return $transclude.isSlotFilled('right');
      };

      vm.rightActionsToggle = function() {
        vm.areRightActionsCollapsed = !vm.areRightActionsCollapsed;
      };

      vm.rightActionsHide = function() {
        vm.areRightActionsCollapsed = true;
      };

      vm.rightActionsShow = function() {
        vm.areRightActionsCollapsed = false;
      };

      vm.rightActionsClose = function() {
        vm.areRightActionsCollapsed = true;
      };

      $scope.$on('rightActionsToggle', function() {
        vm.rightActionsToggle();
      });

      $scope.$on('rightActionsClose', function() {
        vm.rightActionsClose();
      });

      $scope.$on('changedAuditMode', function() {
        vm.rightActionsToggle();
      });

    }]).component('mfpageHeader', {
      transclude: {
        'right': '?rightActions'
      },
      templateUrl: '/referencia/app/core/pageHeader/pageHeader.html',
      controller: 'PageHeaderController',
      bindings: {
        title: '<',
        subtitle: '<',
        subtitleHideOn: '<',
        rating: '<?',
        ratingHideOn: '<',
        finished: '<',
        finishedHideOn: '<'
      }
    });
});
