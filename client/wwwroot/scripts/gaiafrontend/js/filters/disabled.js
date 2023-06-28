/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.disabled
 * @description
 * This filter indicates if input is disabled.
 * @example
   <doc:example module="Disabled">
    <doc:source>
    input(ng-model="input", placeholder="Escribe para aplicar filtro")
    pre {{input | disabled}}
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('disabled', [])
    .filter('disabled', function() {
        return function(input) {
            return input ? ' disabled' : '';
        };
    });
