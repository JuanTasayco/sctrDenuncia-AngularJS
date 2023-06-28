/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.exclude
 * @description
 * This filter exclude results that are indicated by the filter
 * @example
   <doc:example module="Exclude">
    <doc:source>
    input(ng-model="input", placeholder="Escribe para aplicar filtro")
    pre {{input | exclude}}
    </doc:source>
   </doc:example>
 */
/*global angular, _ */
angular.module('exclude', [])
    .filter('exclude', ['$filter',
        function($filter) {
            var allResults,
                resultsToExculde,
                resultado;
            return function(input, expressionToExclude) {
                allResults = $filter('filter')(input, '');
                resultsToExculde = $filter('filter')(input, expressionToExclude);
                resultado = _.difference(allResults, resultsToExculde);
                return resultado;
            };
        }]);
