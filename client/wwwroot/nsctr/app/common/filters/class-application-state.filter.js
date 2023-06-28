'use strict'

define([
	'angular', 'nsctr_constants',
], function (angular, NSCTR_CONSTANTS) {

  function ClassApplicationStateFilter() {
    return function (state) {
      var STATE = NSCTR_CONSTANTS.state;

      switch(state.toUpperCase()) {
        case STATE.undeclared.description:
          return 'gBgcRed1';
        case STATE.declared.description:
          return 'gBgcGreen1';
        case STATE.manipulable.description:
          return 'gBgcGreen6';
        case STATE.inProcess.description:
          return 'gBgcOrange3';
        default:
          return 'gBgcBlack1';
      }
    };
  }

  angular
    .module('appNsctr')
    .filter('classApplicationState', ClassApplicationStateFilter);
});