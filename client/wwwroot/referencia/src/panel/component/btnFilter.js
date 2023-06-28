'use strict';
define(['angular'], function(ng) {

  btnFilterCtrl.$inject = [];

  function btnFilterCtrl() {}

  btnFilterDirectiveFn.$inject = [];
  function btnFilterDirectiveFn() {

    function linkFn(scope, element, attrs, controller) {
      var elementTo = '.' + attrs.scrollTo;

      var unbindFn = scope.$on('doScrolling', function dsFn() {
        controller.btnOptions.applyFilterText = 'Aplicar filtros';
        ng.element('html, body').animate({
          scrollTop: ng.element(elementTo).offset().top - 50
        }, 1000);
      });

      scope.$on('$destroy', unbindFn);
    }

    return {
      restrict: 'E',
      controller: 'BtnFilterController as $ctrl',
      scope: {},
      templateUrl: '/referencia/app/panel/component/btnFilter.html',
      link: linkFn,
      bindToController: {
        areThereFilters: '=?',
        applyFilter: '&?',
        resetFilter: '&?',
        scrollTo: '=?',
        btnOptions: '=?'
      }
    };
  } //  end btnFilterDirectiveFn

  return ng.module('referenciaApp')
    .controller('BtnFilterController', btnFilterCtrl)
    .directive('mfBtnFilter', btnFilterDirectiveFn);
});
