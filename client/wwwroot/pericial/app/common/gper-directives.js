define(['angular', 'spin', 'system'],
  function(angular, Spinner, system) {
    angular.module('gPer.module', [])
      .directive('gperTabsFixed', ['$window', function($window){
        // Runs during compile
        return {
          restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
          link: function(scope, element, attrs) {
            console.log('Directiva Tabs Fijos...');
            scope.widthWindow = $window.innerWidth; //console.log(scope.widthWindow + 'px')
            if (scope.widthWindow > 991) {
              scope.heightScroll = 297;
            } else {
              if (scope.widthWindow > 761 && scope.widthWindow <= 991) {
                scope.heightScroll = 232;
              } else {
                scope.heightScroll = 232;
              }
            }
            angular.element($window).bind('scroll', function() {
              // console.log('Scrolling... ', this.pageYOffset, scope.heightScroll);
              if (this.pageYOffset >= scope.heightScroll) {
                scope.boolChangeClass = true;
              } else {
                scope.boolChangeClass = false;
              }
              // console.log(scope.boolChangeClass);
              if (scope.widthWindow >= 1200) {
                scope.changeTabWidth = true;
              } else {
                scope.changeTabWidth = false;
              }
              scope.$apply();
            });
          }
        };
      }]);
  });
