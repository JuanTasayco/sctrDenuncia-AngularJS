/*global angular */
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpAccordionHeading .
 * @description
 * This directive shows a loading gliphicon when it´s linked to a promess to be resolved
 */
angular.module('mpAccordionHeading', [])
    .directive('mpAccordionHeading', ['$parse', function($parse) {
        // Runs during compile
        return {
            scope: true,
            templateUrl: 'gaiafrontend/html/mpAccordionHeading.html',
            link: function(scope, element, $attrs) {
                var accordionDefaultIcon = {
                    isOpen : true,
                    isLoading: false
                };
                scope.accordionIcon = $attrs.accordionIcon ? $parse($attrs.accordionIcon)(scope) : accordionDefaultIcon;
                scope.accTitle = $attrs.accTitle || '';

            }
        };
    }]);
