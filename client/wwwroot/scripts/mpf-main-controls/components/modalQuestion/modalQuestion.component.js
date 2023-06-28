define([
  'angular'
], function(ng) {

  ModalQuestionController.$inject = ['$scope'];

  function ModalQuestionController($scope) {
    var vm = this;
    vm.data.txtBtnThx = vm.data.txtBtnThx || 'Cerrar';
  } // end controller

  return ng.module('appAutos')
    .controller('ModalQuestionController', ModalQuestionController)
    .component('mpfModalQuestion', {
      templateUrl: '/scripts/mpf-main-controls/components/modalQuestion/modalQuestion.html',
      controller: 'ModalQuestionController',
      bindings: {
        data: '=?',
        close: '&?'
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