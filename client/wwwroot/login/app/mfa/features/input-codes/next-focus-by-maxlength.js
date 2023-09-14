'use strict';
define([
  'angular',
  'lodash',
], function(angular, _) {
  NextFocusByMaxlength.$inject = [];
  function NextFocusByMaxlength() {

    function link(scope, element, attrs) {
      function keyup(e) {
        var value = element.val();
        var maxlength = parseInt(element.attr('maxlength'));

        if (_.contains([8, 46], e.keyCode) && !value) {  // INFO: To back & del
          $(this).prev().focus();
        } else if(element.val().length === maxlength) {
          var $nextElement = element.next();
          if ($nextElement.length) {
            $nextElement[0].focus();
          }
        }
      }

      element.on('keyup', keyup);
    }

    return {
      restrict: 'A',
      link: link
    };
  }

  return angular
    .module('appLogin')
    .directive('nextFocusByMaxlength', NextFocusByMaxlength);
});
