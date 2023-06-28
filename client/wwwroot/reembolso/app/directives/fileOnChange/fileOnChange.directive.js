'use strict';

define(['angular', 'lodash'], function (ng, _) {
  function reFileOnChange() {
    return {
      restrict: 'A',
      link: link
    }

    function link(scope, element, attrs) {
      var onChangeHandler = scope.$eval(attrs.reFileOnChange);
      element.bind('change', onChangeHandler);
    }
  }

  return ng
    .module('appReembolso')
    .directive('reFileOnChange', reFileOnChange)
})
