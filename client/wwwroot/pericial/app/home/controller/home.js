(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'constantsPericial', 'helper'],
  function(angular, constants, constantsPericial, helper){

    angular.module('appPericial')

    .controller('homeController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices', '$uibModal', 'mModalAlert', 'mModalConfirm',
        function($scope, $window, $state, $timeout, mainServices, $uibModal, mModalAlert, mModalConfirm){

          var vm = this;

          vm.$onInit = function() {
            $scope.servListado = 5;
            $scope.tallerName = 'Taller Automotriz J. Leyva'
          }

          $scope.panelActv = 0;
          var listener = $scope.$watch('panelActv', function (newVal, oldVal) {
            console.log(oldVal, newVal);
          })

          vm.$onDestroy = function() {
            //clean watch
            listener();
          }

        }])
      .directive('panelSlider', function() {
        return {
          link: link,
          restrict: 'A',
          scope: {
            activePanel: '='
          }
        };

        function link(scope, element, attrs, ctrl) {
          // console.log('panel slider... ');
          var arrows = element[0].getElementsByClassName('slide-arrow');
          var panels = element[0].getElementsByClassName('slide-content');
          var panelsNum = panels.length;
          var active = parseInt(scope.activePanel);

          panels[active].classList.add('show');
          panels[active].classList.add('active');

          angular.element(panels).bind('click', function () {
            angular.forEach(panels, function (v,k) {
              panels[k].classList.remove('show');
              panels[k].classList.remove('active');
            });
            this.classList.add('active');
            this.classList.add('show');
            active = Array.from(panels).indexOf(this);
            scope.activePanel = active;
          });

          angular.element(arrows[0]).bind('click', function () {
            angular.forEach(panels, function (v,k) {
              panels[k].classList.remove('show');
              panels[k].classList.remove('active');
            });
            if (active) {
              panels[active - 1].classList.add('show');
              panels[active - 1].classList.add('active');
              active = active - 1;
            } else {
              panels[0].classList.add('show');
              panels[0].classList.add('active');
              active = 0;
            }
          });

          angular.element(arrows[1]).bind('click', function () {
            angular.forEach(panels, function (v,k) {
              panels[k].classList.remove('show');
              panels[k].classList.remove('active');
            });
            if (active < panelsNum - 1) {
              panels[active + 1].classList.add('show');
              panels[active + 1].classList.add('active');
              active = active + 1;
            } else {
              panels[panelsNum - 1].classList.add('show')
              panels[panelsNum - 1].classList.add('active')
              active = panelsNum - 1;
            }
          });
        }
      })
  });
