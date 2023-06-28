/*global angular */
angular.module('mpChange', [])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpChange
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
    .directive('mpChange', ['$parse', function($parse) {
        return {
            link: function(scope, element, attributes) {
                var onChangeFn = $parse(attributes.mpChange),
                    currentValue = element.val();

                function onFocusFn() {
                    currentValue = element.val();
                }

                // FIX. IE8 IS NOT TRIGGERING change EVENT
                function onBlurFn(event) {
                    scope.$apply(function() {
                        var newValue = element.val();
                        if (currentValue !== newValue) {
                            onChangeFn(scope, {
                                $event: event
                            });
                            currentValue = newValue;
                        }
                    });
                }

                element.on('focus', onFocusFn);
                element.on('blur', onBlurFn);
                element.on('$destroy', function() {
                    element.off('focus', onFocusFn);
                    element.off('blur', onBlurFn);
                });
            }
        };
    }]);
