'use strict';

define(['angular'], function(angular) {
  CardFilterController.$inject = ['$log'];
  function CardFilterController($log) {
    var vm = this;

    vm.$onInit = function() {
      var type = (vm.type || '').toUpperCase();
      vm.isSearcherType = type === 'SEARCHER';
      vm.type = vm.isSearcherType ? 'SEARCHER' : 'FILTER';
      vm.filterButtonText = vm.isSearcherType ? 'Buscar' : 'Filtrar';
      vm.clearButtonText = 'Limpiar';
    };

    vm.isOpenToggle = function() {
      vm.isOpen = !vm.isOpen;
    };

    vm.filter = function() {
      vm.onFilter();
    };

    vm.clear = function() {
      vm.onClear();
    };
  }

  OpenCardFilterDirective.$inject = ['$window', '$document'];
  function OpenCardFilterDirective($window, $document) {
    function link(scope, element, attrs) {
      var windowEl = angular.element($window);
      var body = $document.find('body');

      function isDesktop() {
        return $window.innerWidth > 991;
      }

      function offset() {
        return {
          width: $window.innerWidth,
          height: $window.innerHeight,
        }
      }

      function watchOpenCardFilter(isOpen) {
        var windowOffset = offset();

        if (isDesktop()) {
          element.css('top', 'auto');
          body.removeClass('g-overflow-hidden-xs');
        } else {
          if (!isOpen) {
            element.removeClass('show');
            element.css('top', windowOffset.height - 61 + 'px');
            body.removeClass('g-overflow-hidden-xs');
          } else {
            element.addClass('show');
            element.css('top', '0px');
            body.addClass('g-overflow-hidden-xs');
          }
        }
      }

      var $watchOpenCardFilter = scope.$watch(attrs.openCardFilter, watchOpenCardFilter);

      windowEl.bind('resize', function() {
        watchOpenCardFilter(scope.$ctrl.isOpen);
      });

      scope.$on('$destroy', function() {
        $watchOpenCardFilter();
      });
    }

    return {
      restrict: 'A',
      link: link
    }
  }

  return angular
    .module('mapfre.controls')
    .controller('CardFilterController', CardFilterController)
    .component('mpfCardFilter', {
      templateUrl: '/scripts/mpf-main-controls/components/card-filter/card-filter.component.html',
      controller: 'CardFilterController',
      transclude: true,
      replace: true,
      bindings: {
        type: '=?', // INFO: type: FILTER | SEARCHER
        isOpen: '=?',
        title: '=?',
        filterButtonText: '=?',
        clearButtonText: '=?',
        onFilter: '&',
        onClear: '&'
      }
    })
    .directive('openCardFilter', OpenCardFilterDirective);
});
