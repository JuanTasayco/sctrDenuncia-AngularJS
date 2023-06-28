/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpMultilist
 * @description
 * DEPRECATED
 * If you need this component ask for it through the UX department
 */
angular.module('mpMultilist', ['utils'])
    .directive('mpMultilist', function() {
        return {
            scope: {
                mpModel: '='
            },
            templateUrl: 'gaiafrontend/html/multilist.html',
            link: function(scope, elm, attrs) {
                var options = attrs.mpMultilist.split(',');
                scope.options = options;
            }
        };
    })
    // TODO: Review
    .directive('mpMultilistEnd', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                restrict: 'A',
                link: function(scope, elm, attrs) {
                    var regexpOptions = /^.* in (.*)$/,
                        observable;

                    function refresh() {
                        elm.find('.ui-multilist').remove();
                        elm.multilist();
                    }

                    if (attrs.ngOptions) {
                        observable = regexpOptions.exec(attrs.ngOptions)[1];
                        scope.$watch(observable, function() {
                            loadPlugin('multilist.js').then(refresh);
                        });
                    }
                }
            };
        }]);
