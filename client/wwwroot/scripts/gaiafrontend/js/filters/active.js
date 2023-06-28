/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.active
 * @description
 * This filter indicates if input is active.
 * @example
   <doc:example module="Active">
    <doc:source>
    input(ng-model="input", placeholder="Escribe para aplicar filtro")
    pre {{input | active}}
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('active', [])
    .filter('active', function() {
        return function(input) {
            return input ? ' active' : '';
        };
    });
