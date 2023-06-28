(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'sctrMngContainerTabs', ['angular', 'system'],
    function(angular, system) {
  
      angular.module('appAutos')
        .controller('sctrMngContainerTabsController', ['proxySctr', '$scope', '$stateParams', 
          function(proxySctr, $scope, $stateParams) {

            if($stateParams.tab) {          
              $scope.tab = parseInt($stateParams.tab);              
            }else{
              $scope.tab = 0;
            }

        }])
        .component('sctrMngContainerTabs', {
          templateUrl: '/polizas/app/sctr/mantenimiento/component/container.tabs.html',
          controller: 'sctrMngContainerTabsController',
          bindings: {
  
          }
        }).directive('fileInputOnChange', function() {
          return {
            restrict: 'A',
            link: function (scope, element, attrs) {
              var onChangeHandler = scope.$eval(attrs.fileInputOnChange);
              element.bind('change', onChangeHandler);
            }
          };
        });
    });