/*global angular */
angular.module('carouselFix', ['ui.bootstrap'])
    .config(['$provide', function ($provide) {
        $provide.decorator('carouselDirective', function ($delegate, $animate) {
            var carouselDirective = $delegate[0],
                compile = carouselDirective.compile || function () {
                    return function () {};
                };

            carouselDirective.compile = function () {
                var postLink = compile.apply(this, arguments);

                return function (scope, element) {
                    $animate.enabled(false, element);
                    postLink.apply(this, arguments);
                };
            };

            return $delegate;
        });
    }]);
