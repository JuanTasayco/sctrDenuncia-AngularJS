/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpCarousel
 * @param {string} mpCarousel An array with the paths of the images of the carousel.
 * @description
 * This component is used to display a carousel with a collection of images.
 * @example
   <doc:example module="mpCarousel">
    <doc:source>
    json = '{"data" : ["resources/img/usercontent/flower1.jpg","resources/img/usercontent/flower2.jpg"]}'
    div(mp-carousel=json)
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('mpCarousel', ['utils'])
    .directive('mpCarousel', function() {
        return {
            replace: true,
            templateUrl: 'gaiafrontend/html/carousel.html',
            link: function(scope, elm, attrs) {
                var loadedImages = angular.fromJson(attrs.mpCarousel);
                scope.images = loadedImages.data;
            }

        };
    })
    .directive('mpCarouselEnd', ['Loader',
        function(Loader) {
            var loadPlugin = Loader.load;

            return {
                restrict: 'A',
                link: function(scope, elm) {
                    function showCarousel() {
                        elm.parent().jcarousel({
                            'scroll': 1
                        });
                    }

                    if (scope.$last) {
                        loadPlugin('jquery.jcarousel.js').then(showCarousel);
                    }
                }

            };
        }]);
