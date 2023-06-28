(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'miningTypeRegisterJs',
  'miningSearchedCensusJs'],
  function(angular, constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningQueriesCensusMassiveController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices', 'nsctrFactory',
      'nsctrService',
      function($scope, $window, $state, $timeout, mainServices, nsctrFactory,
      nsctrService){
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "CONSULTA_PADRON_MASIVO", "nombreCabecera");
          $scope.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto")
        })();
        /*########################
        # fnProcessPadron
        ########################*/
        function _searchPadron(params){
          $scope.$broadcast('fnSearchCensus_searchedCensus', params);
        }
        $scope.fnProcessPadron = function(){
          $scope.$broadcast('fnParamsRequest_typeRegister');
        };
        /*########################
        # fnFromTypeRegister
        ########################*/
        $scope.$on('fnSendParams_typeRegister', function(event, valid, activeTab, params){
          if (valid) _searchPadron(params);
        });

      }]);
  });
