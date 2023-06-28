/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpMultiselect
 * @description
 * DEPRECATED
 * Use mpSelect instead
 */
angular.module('mpMultiselect', [])
    .directive('mpMultiselect', function() {
        return {
            scope: {
                mpModel: '='
            },
            templateUrl: 'gaiafrontend/html/multiselect.html',
            link: function(scope, elm, attrs) {
                var options = attrs.mpMultiselect.split(',');
                scope.options = options;
            }
        };
    })
    .directive('mpMultiselectEnd', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                link: function(scope, elm, attrs) {
                    var regexpOptions = /^.* in (.*)$/,
                        observable;

                    function refresh() {
                        elm.siblings('button.ui-multiselect').remove();
                        elm.multiselect({
                            selectedList: 4
                        });
                    }

                    if (attrs.ngOptions) {
                        observable = regexpOptions.exec(attrs.ngOptions)[1];
                        scope.$watch(observable, function() {
                            loadPlugin('jquery.multiselect.min.js').then(refresh);
                        });
                    }
                }
            };
        }]);
