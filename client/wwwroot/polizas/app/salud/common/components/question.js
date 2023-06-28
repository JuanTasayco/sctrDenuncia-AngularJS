define([
  'angular', 'constants', 'constantsSalud'
], function(ng) {

  questionController.$inject = ['$scope', 'mModalConfirm'];

  function questionController($scope, mModalConfirm) {
    var vm = this;

    vm.$onInit = function() {
      $scope.format = constants.formats.dateFormat;
      $scope.answer = constantsSalud.suscripcion.questionAnswers;
      $scope.questionType = constantsSalud.suscripcion.questionTypes;
      $scope.question = vm.data;
      $scope.datePopup = {
        opened: false
      }
    };

    $scope.clearDetail = function (type) {
      if (type == 'principal') {
        _clearDetailPrincipal()
      }
    }

    $scope.openDatePicker = function () {
      $scope.datePopup.opened = true
    }

    var _clearDetailPrincipal = function () {
      if ($scope.question.response.code === $scope.answer.yes) {
        return;
      }
      if ($scope.question.valid) {
        $scope.question.response = $scope.answer.yes;
        mModalConfirm.confirmWarning('SI cambia la respuesta a NO, se borrará el detalle de esta pregunta. ¿Está seguro de continuar?', 'Alerta')
        .then(function (response) {
          $scope.question.response = $scope.answer.no;
          $scope.question.cuestionarios = {};
          $scope.question.valid = false;
        }, function (response) {
          return false;
        });
      }
    }

    var _clearDetailPrincipal = function () {
      if ($scope.question.valid) {
        $scope.question.response = $scope.answer.yes;
        mModalConfirm.confirmWarning('SI cambia la respuesta a NO, se borrará el detalle de esta pregunta. ¿Está seguro de continuar?', 'Alerta')
        .then(function (response) {
          $scope.question.response = $scope.answer.no;
          $scope.question.cuestionarios = {};
          $scope.question.valid = false;
        }, function (response) {
          return false;
        });
      }
    }

  } // end controller

  return ng.module('appSalud')
    .controller('questionController', questionController)
    .component('question', {
      templateUrl: '/polizas/app/salud/common/components/question.html',
      controller: 'questionController',
      bindings: {
        type: '@',
        data: '=',
        mQuestion: '=',
        withIndex: '=?',
        block:'=',
        form: '='
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
