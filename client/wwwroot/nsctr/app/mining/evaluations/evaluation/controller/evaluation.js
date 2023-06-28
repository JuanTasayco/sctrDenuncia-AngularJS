(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrNoResultFilterJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningEvaluationController',
      ['$scope', '$window', '$state', '$timeout', 'mModalConfirm', 'mainServices', 'nsctrFactory', 'nsctrService',
      'evaluationDoctors', 'mModalAlert',
      function($scope, $window, $state, $timeout, mModalConfirm, mainServices, nsctrFactory, nsctrService,
      evaluationDoctors, mModalAlert){
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){

        $scope.data = $scope.data || {};

        $scope.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
        $scope.data.dataList = new nsctrFactory.object.oDataList();
        $scope.data.mPagination = new nsctrFactory.object.oPagination();

        if (evaluationDoctors) $scope.data.doctorData = evaluationDoctors;

        $scope.MODULE = $state.current.module;
        var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "EVALUACIONES_ACCIONES", "nombreCabecera");
        $scope.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto");
        $scope.segurityAdd = nsctrFactory.validation._filterData(segurity.items, "AGREGAR_EVALUACION", "nombreCorto");
      })();
      /*########################
      # fnGoAddEvaluation
      ########################*/
      $scope.fnGoAddEvaluation = function(){
        $state.go('miningAddEvaluation', {});
      }
      /*########################
      # fnSearchEvaluation
      ########################*/
      function _clearSearchedEvaluation(option){
        var vIsClear = option == 'C',
            vIsPagination = option == 'P';

        $scope.noResultFilter.setNoResultFilter(vIsClear, false);
        $scope.data.dataList.setDataList();
        $scope.data.mPagination.setTotalItems(0);
        if (!vIsPagination) $scope.data.mPagination.setCurrentPage(1);
      }
      function _paramsSearchEvaluation(){
        var vParams = {
          MedicId :     ($scope.data.mMedico && $scope.data.mMedico.code !== null)
                          ? $scope.data.mMedico.code
                          : '',
          CurrentPage : $scope.data.mPagination.currentPage,
          RowByPage :   '10'
        };
        return vParams;
      }
      function _searchEvaluation(){
        var vParams = _paramsSearchEvaluation();
        nsctrFactory.mining.proxyEvaluations.Evaluations_EvaluationsPagingList(vParams, true).then(function(response){
          if (response.operationCode == constants.operationCode.success){
            if (response.data.list.length > 0){
              $scope.data.dataList.setDataList(response.data.list, response.data.totalRows, 0, response.data.totalPages);
              $scope.data.mPagination.setTotalItems($scope.data.dataList.totalItemsPagination);
            }else{
              $scope.noResultFilter.setNoResult(true);
            }
          }else{
            $scope.noResultFilter.setNoResult(true);
          }
        }, function(error){
          $scope.noResultFilter.setNoResult(true);
        });
      }
      function _validateForm(){
        $scope.frmSearchEvaluation.markAsPristine();
        return $scope.frmSearchEvaluation.$valid;
      }
      $scope.fnSearchEvaluation = function(){
        if (_validateForm()){
          _clearSearchedEvaluation('S');
          _searchEvaluation();
        }
      };
      /*########################
      # fnChangePage
      ########################*/
      $scope.fnChangePage = function(){
        _clearSearchedEvaluation('P');
        _searchEvaluation();
      };
      /*########################
      # fnClearEvaluation
      ########################*/
      function _clearEvaluationSearcher(){
        $scope.data.mMedico = {
          code: null
        };
      }
      $scope.fnClearEvaluation = function(){
        _clearEvaluationSearcher();
        _clearSearchedEvaluation('C');
      };
      /*########################
      # fnClearEvaluation
      ########################*/
      $scope.fnDeleteEvaluation = function(item){
         mModalConfirm.confirmInfo(
          '¿Estás seguro de eliminar la siguiente evaluación?',
          'ELIMINAR EVALUACIÓN',
          'ELIMINAR').then(function(btnAction){
            var vFileId = item.fileId;
            nsctrFactory.mining.proxyEvaluations.Evaluations_DeleteEvaluation(vFileId, true).then(function(response){
              if (response.operationCode == constants.operationCode.success){
                _clearSearchedEvaluation('S');
                _searchEvaluation();
              } else {
                mModalAlert.showWarning(response.message, 'ALERTA');
              }
            }, function(error){
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
            });
        });
      };
      /*########################
      # fnDetailEvaluation
      ########################*/
      $scope.fnDetailEvaluation = function(item){
        var vEvaluation = item;
        $state.go('miningDetailEvaluation', {
          evaluation: vEvaluation
        });
      };


    }]).factory('loaderMiningEvaluationController', ['nsctrFactory', '$q', function(nsctrFactory, $q){
      var doctors;

      function getDoctors(showSpin){
        var deferred = $q.defer();
        nsctrFactory.common.proxyLookup.ServicesMedicList(showSpin).then(function(response){
          doctors = response.data || response.Data;
          deferred.resolve(doctors);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getDoctors: function(showSpin){
          if(doctors) return $q.resolve(doctors);
          return getDoctors(showSpin);
        }
      };
    }]);

  });
