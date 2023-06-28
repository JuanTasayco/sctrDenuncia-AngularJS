'use strict';

define(['angular'], function (ng) {
  ReStepsController.$inject = ['$scope'];

  function ReStepsController($scope) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit() {
      $scope.$on('$stateChangeSuccess', function (scope, state, params) {
        vm.currentStep = params.step;
      });
    }

    /*#########################
    # Steps
    #########################*/
    $scope.nav = {};
    $scope.nav.go = function (step) {
      var e = {
        cancel: false,
        step: step
      };
      $scope.$broadcast('changingStep', e);
      return !e.cancel;
      // if (!e.cancel)
      //   $state.go('hogarQuote.steps', {step: step })
    }
  }

  return ng.module('appReembolso').controller('ReStepsController', ReStepsController);
});
