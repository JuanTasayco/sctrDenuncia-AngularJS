/*global angular */
/*DEPRECATED*/
angular.module('mpGenie', [])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpGenie
     * @description
     * DEPRECATED
     * If you need this component ask for it through UX department
    */
    .directive('mpGenie', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load,
                genie = 'genie.js',
                html2Canvas = 'html2canvas.js',
                jQueryGenie = 'jquery.genie.js';
            return {
                link: function(scope, element) {
                    function initGenie() {
                        element.on('click', function() {
                            angular.element('body').htmlGenieCollapse(element, ['bottom']);
                        });

                        element.on('$destroy', function() {
                            element.off('click');
                        });
                    }

                    loadPlugin(html2Canvas).then(function() {
                        loadPlugin(genie).then(function() {
                            loadPlugin(jQueryGenie).then(initGenie);
                        });
                    });
                }
            };
        }]);
