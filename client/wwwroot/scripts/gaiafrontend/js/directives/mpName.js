/*global angular */
angular.module('mpName', [])
    .directive('mpName', ['$interpolate',
        function($interpolate) {
            return {
                priority: 9999,
                controller: ['$scope', '$attrs',
                    function($scope, $attrs) {
                        var interpolatedName = $interpolate($attrs.mpName || '')($scope);
                        if (interpolatedName) {
                            $attrs.$set('name', interpolatedName);
                        }
                    }]
            };
        }]);