(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('nsctrDIController',
      ['$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrFactory',
      'nsctrService', '$filter',
      function($scope, $window, $state, $stateParams, $timeout, mainServices, nsctrFactory,
      nsctrService, $filter){
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.dataS1 = $scope.dataS1 || {};
          $scope.dataS2 = $scope.dataS2 || {};

          $scope.data.MODULE = $scope.data.MODULE || $state.current.module;
          $scope.data.VALID_PAGE = $scope.data.VALID_PAGE || nsctrService.fnValidatePage();

          if ($scope.data.VALID_PAGE){
            $scope.data.STATE_PARAMS = $scope.data.STATE_PARAMS || new nsctrFactory.object.oStateParams();
            $scope.data.USER = $scope.data.USER || new nsctrFactory.object.oUser();

            $scope.data.CURRENCY_TYPES = $scope.data.CURRENCY_TYPES || constants.currencyType;
            $scope.data.TYPE_LOAD = $scope.data.TYPE_LOAD || nsctr_constants.typeLoad;
            $scope.data.ADD_ROWS = $scope.data.ADD_ROWS || 'AR';
            $scope.data.MOUNT_MIN_WORKER = $scope.data.MOUNT_MIN_WORKER || 850;
            $scope.data.MAX_NUM_WORKERS = $scope.data.MAX_NUM_WORKERS || 10;
            $scope.data.TIMER = $scope.data.TIMER || 'timer';
            $scope.data.SHOW_RISKS_LIST = $scope.data.SHOW_RISKS_LIST || nsctrService.fnShowRiskList($scope.data.STATE_PARAMS['showRisksList']);
            $scope.data.IS_DECLARATION = $scope.data.IS_DECLARATION || nsctrService.fnIsDeclaration($state.current.movementType);
            $scope.data.IS_MANIPULABLE = $scope.data.IS_MANIPULABLE || nsctrService.fnIsManipulable($scope.data.STATE_PARAMS['selectedApplications']);

            $scope.data.fnFilterDate = $scope.data.fnFilterDate || $filter('date');
          }else{
            var vStateName = $scope.data.MODULE.prefixState + 'SearchClient';
            $state.go(vStateName, {});
          }


        })();
        /*########################
        # fnGoBack
        ########################*/
        $scope.fnGoBack = function(){
          $scope.dataS1.FIRST_PARAMS_DI = {};
          var vMovementType = ($scope.data.IS_DECLARATION)
                                ? 'Declaration'
                                : 'Inclusion',
              vStateName = $scope.data.MODULE.prefixState + vMovementType + '.steps';
          $state.go(vStateName, {
            step: 1
          });
        }

        $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
          $scope.currentStep = param.step;
        });

    }]);

  });
