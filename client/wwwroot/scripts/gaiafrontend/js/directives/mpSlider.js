/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpSlider
 * @description
 * DEPRECATED
 * If you need this component ask for it through UX department
 */
angular.module('mpSlider', [])
    .directive('mpSlider', function() {
        return {
            templateUrl: 'gaiafrontend/html/slider.html',
            link: function(scope, elm, attrs) {
                var min = attrs.mpSliderMin,
                    max = attrs.mpSliderMax,
                    sliderOptions;

                scope.sliderValue = 0;

                function refreshValue() {
                    scope.$apply(function() {
                        scope.sliderValue = elm.slider('option', 'value');
                    });
                }

                sliderOptions = {
                    min: min,
                    max: max,
                    slide: refreshValue
                };

                elm.slider(sliderOptions);
            }
        };
    });
