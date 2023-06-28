(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'miningSearchedCensusJs'],
  function(angular, constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningQueriesCensusIndividualController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices', 'nsctrFactory',
      'nsctrService', 'lists',
      function($scope, $window, $state, $timeout, mainServices, nsctrFactory,
      nsctrService, lists){
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};

          if (lists) $scope.data.clinicData = lists;
          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "CONSULTA_PADRON_INDIVIDUAL", "nombreCabecera");
          $scope.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto");
        })();
        /*########################
        # fnSearchPadron
        ########################*/
        function _paramsSearchPadron(){
          var vParams = {
            ClinicId        : ($scope.data.mClinica && $scope.data.mClinica.code)
                                ? $scope.data.mClinica.code
                                : '',
            RequestNumber   : $scope.data.mNroSolicitud || '',
            DocumentNumber  : $scope.data.mNroDoc || '',
            Name            : $scope.data.mNombre || ''
          };
          return vParams;
        }
        function _searchPadron(){
          var vParams = _paramsSearchPadron();
          $scope.$broadcast('fnSearchCensus_searchedCensus', vParams);
        }
        $scope.fnSearchPadron = function(){
          _searchPadron();
        };
        /*#######################
        # fnClearPadron
        #######################*/
        function _clearPadronSearcher(){
          $scope.data.mClinica = {
            code: null
          };
          $scope.data.mNroSolicitud = '';
          $scope.data.mNroDoc = '';
          $scope.data.mNombre = '';
        }
        /*########################
        # _clearSearchedPadron
        ########################*/
        function _clearSearchedPadron(){
          $scope.$broadcast('fnClearSearchedCensus_searchedCensus');
        }
        $scope.fnClearPadron = function(){
          _clearPadronSearcher();
          _clearSearchedPadron();
        };


    }]).factory('loaderMiningQueriesCensusIndividualController', ['nsctrFactory', '$q', function(nsctrFactory, $q){
      var clinics;

      function getLists(showSpin){
        var deferred = $q.defer();
        nsctrFactory.common.proxyLookup.ServicesAllClinics(showSpin).then(function(response){
          clinics = response.data || response.Data;
          deferred.resolve(clinics);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getLists: function(showSpin){
          if(clinics) return $q.resolve(clinics);
          return getLists(showSpin);
        }
      };
    }]);
  });
