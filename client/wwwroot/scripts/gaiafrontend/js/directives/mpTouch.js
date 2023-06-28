/*global angular */
/*
 * A directive that allows creation of custom onclick handlers that are defined as angular
 * expressions and are compiled and executed within the current scope.
 *
 * Events that are handled via these handler are always configured not to propagate further.
 */
angular.module('mpTouch', ['utils'])
    .config(['$compileProvider', 'Utils', function ($compileProvider, Utils) {
        var toCamelCase = Utils.string.toCamelCase,
            mpTouchEventDirectives = {};
        /**
         * @doc-component directive
         * @name gaiafrontend.directive.mpTouchstart
         * @description
         * The mpTouchstart directive allows you to specify custom behavior when an element is begining to being touched.
         *
         * Other touch events are supported through their respective directives.
         * @param {expression} mpTouchstart Expression to evaluate when the user makes contact with the touch surface. Event object is available as `$event`.
         * @example
           <doc:example module="mpValuesList">
             <doc:source>
             script
                function TouchEventsCtrl() {
                    $scope.output = 'Not touched.';

                    this.touchStarting = function () {
                        $scope.output = 'Touch starting...';
                    };
                    this.touchEnding = function () {
                        $scope.output = 'Touch ended.';
                    };
                }
                TouchEventsCtrl.$inject = ['$scope'];
             div(ng-controller="TouchEvenetsCtrl as Touch")
                pre {{output}}
                button.btn.btn-default(type="button", mp-touchstart="touchStarting()", mp-touchend="touchEnding()") Touch me
             </doc:source>
           </doc:example>
         */
        angular.forEach('touchstart touchmove touchend touchenter touchleave touchcancel'.split(' '), function (name) {
            var directiveName = toCamelCase('mp-' + name);
            mpTouchEventDirectives[directiveName] = ['$parse', function ($parse) {
                return {
                    compile: function (cElement, cAttr) {
                        var fn = $parse(cAttr[directiveName]);
                        return function postLink (scope, lElement) {
                            lElement.on(angular.lowercase(name), function(event) {
                                scope.$apply(function() {
                                    fn(scope, {
                                        $event: event
                                    });
                                });
                            });
                        };
                    }
                };
            }];
        });

        $compileProvider.directive(mpTouchEventDirectives);
    }]);
