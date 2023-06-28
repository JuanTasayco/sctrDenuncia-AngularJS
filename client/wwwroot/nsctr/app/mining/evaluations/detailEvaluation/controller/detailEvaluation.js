(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'miningCheckFilterJs',
  'nsctrNoResultFilterJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningDetailEvaluationController',
      ['$rootScope', '$scope', '$window', '$state', '$stateParams', '$timeout', 'mainServices', 'nsctrFactory',
      'nsctrService', 'mpSpin',
      function($rootScope, $scope, $window, $state, $stateParams, $timeout, mainServices, nsctrFactory,
      nsctrService, mpSpin){
      /*########################
      # variables
      ########################*/
      var fnWatchCheckFilter = function(){};
      /*########################
      # _goEvaluation
      ########################*/
      function _goEvaluation(){
        $state.go('miningEvaluation', {});
      }
      /*########################
      # _clearDetailEvaluation
      ########################*/
      function _clearDetailEvaluation(option){
        var vIsClear = option == 'C';

        $scope.noResultFilter.setNoResultFilter(vIsClear, false);
        $scope.data.dataList.setDataList();
      }
      /*########################
      # _detailEvaluation
      ########################*/
      function _detailEvaluation(idEvaluation){
        var vIdEvaluation = idEvaluation;
        nsctrFactory.mining.proxyEvaluations.Evaluations_DetailEvaluationList(vIdEvaluation, true)
          .then(function(response){
            if (response.operationCode == constants.operationCode.success && response.data && response.data.length) {
              fnWatchCheckFilter = $scope.$watch('checkFilter.checkList', function(newValue, oldValue){
                var vCheckList = newValue || $scope.checkFilter.checkList;
                $scope.data.dataList.setDataList(response.data, vCheckList, 'apto');
              });
            }else{
              $scope.noResultFilter.setNoResult(true);
            }
          }).catch(function() {
            $scope.noResultFilter.setNoResult(true);
          });
      }
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){

        $scope.data = $scope.data || {};
        $scope.checkFilter = $scope.checkFilter | {};

        $scope.data.VALID_PAGE = $scope.data.VALID_PAGE || nsctrService.fnValidatePage();

        if ($scope.data.VALID_PAGE){
          $scope.data.STATE_PARAMS = $scope.data.STATE_PARAMS || new nsctrFactory.object.oStateParams();

          $scope.noResultFilter = new nsctrFactory.object.oNoResultFilter();
          $scope.data.dataList = new nsctrFactory.object.oDataListCheckFilter();

          _clearDetailEvaluation('S');
          _detailEvaluation($scope.data.STATE_PARAMS['evaluation'].fileId);
        }else{
          _goEvaluation();
        }

      })();
      /*########################
      # fnGoEvalation
      ########################*/
      $scope.fnGoEvaluation = function(){
        _goEvaluation();
      };
      /*########################
      # fnCheckFilter
      ########################*/
      $scope.fnCheckFilter = function() {
        $scope.data.dataList.setDataListByCheckFilter($scope.checkFilter.checkList)
          .then(function(response) {
            $scope.noResultFilter.setNoResult(!response.length);
          });
      };

      /*#######################
      # DESTROY_EVENTS
      #######################*/
      $scope.$on('$destroy', function(){
        fnWatchCheckFilter();
      });

    }]);

  });
