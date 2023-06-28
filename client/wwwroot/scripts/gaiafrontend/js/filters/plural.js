/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.plural
 * @description
 * This filter indicates if input number is greater than one.
 * @example
   <doc:example module="plural">
    <doc:source>
    input(ng-model="input", placeholder="Quantity")
    pre Quantity: {{(input || '0') + ' item' | plural:input}}
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('plural', [])
    .filter('plural', function() {
        return function(input, quantity) {
            var isPlural = !isNaN(quantity) && parseInt(quantity, 10) !== 1;
            return isPlural ? input + 's' : input;
        };
    });
