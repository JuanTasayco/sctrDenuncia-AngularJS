/**
    * @doc-component directive
    * @name gaiafrontend.directive.mpToUpperCase
    * @description
    * This component has been migrated to "GAIA Site"
    * There you will find its documentation and several examples.
    * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
    * @example
    <doc:example>
         <doc:source>
         label GAIA site direct links are:
         a(href='https://wportalinterno.es.mapfre.net/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Intranet /
         a(href='https://wportalinterno.mapfre.com/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Internet
         </doc:source>
    </doc:example>
*/
/*global angular */
angular.module('mpToUpperCase', [])
    .directive('mpToUpperCase', function() {
        return {
            require: 'ngModel',
            link: function(_scope, _element, _attributes, ngModelCtrl) {
                function upperCase(inputValue) {
                    var upperCased = angular.isString(inputValue) ? inputValue.toUpperCase() : inputValue;

                    if (upperCased !== inputValue) {
                        ngModelCtrl.$setViewValue(upperCased);
                        ngModelCtrl.$render();
                    }

                    return upperCased;
                }

                ngModelCtrl.$parsers.push(upperCase);
                ngModelCtrl.$formatters.push(upperCase);
            }
        };
    });
