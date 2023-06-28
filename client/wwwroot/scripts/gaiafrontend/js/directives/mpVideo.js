/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpVideo
 * @param {string} mpVideo Video path without extension.
 * @description
 * DEPRECATED
 * If you need this component ask for it through UX department
 */
angular.module('mpVideo', [])
    .directive('mpVideo', function() {
        return {
            scope: {
                mpVideo: '@'
            },
            templateUrl: 'gaiafrontend/html/video.html',
            link: function(scope, elm, attrs) {
                elm.find('video').attr('poster', attrs.mpVideo + '.jpg');
            }
        };
    });
