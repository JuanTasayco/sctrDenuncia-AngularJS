/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.capitalize
 * @description
 * This filter capitalize each word from input
 * @example
   <doc:example module="Capitalize">
    <doc:source>
    input(ng-model="input", placeholder="Escribe para aplicar filtro")
    pre {{input | capitalize}}
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('capitalize', [])
    .filter('capitalize', function() {
        return function(input) {
            return typeof input === 'string' ? input.replace(/\w\S*/g, function(inputString) {
                return inputString.charAt(0).toUpperCase() + inputString.substr(1).toLowerCase();
            }) : input;
        };
    });
