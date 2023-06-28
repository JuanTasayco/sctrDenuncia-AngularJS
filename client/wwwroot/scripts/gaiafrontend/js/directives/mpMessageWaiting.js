/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpMessageWaiting
 * @param {string} mpMessageWaiting receives the path to the image / gif to display while viewing the message.
 * @param {string} mp-message-waiting-alt By attribute mp-message-waiting-alt stablish the image alt.
 * @description
 * DEPRECATED
 * Use mpLoading instead
 */
angular.module('mpMessageWaiting', [])
    .directive('mpMessageWaiting', function() {
        return {
            replace: true,
            transclude: true,
            scope: {
                mpMessageWaiting: '@',
                mpMessageWaitingAlt: '@'
            },
            templateUrl: 'gaiafrontend/html/messageWaiting.html'
        };
    });
