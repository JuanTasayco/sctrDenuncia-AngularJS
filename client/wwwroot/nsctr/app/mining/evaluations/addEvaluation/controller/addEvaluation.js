(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'miningTypeRegisterJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningAddEvaluationController',
      ['$scope', '$window', '$state', '$timeout', 'mainServices', 'nsctrFactory', 'nsctrService',
      'addEvaluationLists', 'mModalAlert', 'oimPrincipal',
      function($scope, $window, $state, $timeout, mainServices, nsctrFactory, nsctrService,
      addEvaluationLists, mModalAlert, oimPrincipal){
      /*########################
      # _goEvaluation
      ########################*/
      function _goEvaluation(){
        $state.go('miningEvaluation', {});
      }
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){

        $scope.data = $scope.data || {};

        $scope.USER = new nsctrFactory.object.oUser();

        if (addEvaluationLists) {
          $scope.data.doctorData = addEvaluationLists[0].data;
          $scope.data.clinicData = addEvaluationLists[1].data;
        }

      })();
      /*########################
      # fnGoEvalation
      ########################*/
      $scope.fnGoEvaluation = function(){
        _goEvaluation();
      };
      /*########################
      # fnProcess
      ########################*/
      function _validateForm(){
        $scope.frmAddEvaluation.markAsPristine();
        return $scope.frmAddEvaluation.$valid;
      }
      $scope.fnProcess = function(){
        if (_validateForm()){
          $scope.$broadcast('fnParamsRequest_typeRegister');
        }
      }
      function _paramsSaveEvaluation(params){
        var vParams = params || {};
        vParams.ClinicId = ($scope.data.mClinicia && $scope.data.mClinicia.code)
                              ? $scope.data.mClinicia.code
                              : '';
        vParams.MedicId = ($scope.data.mMedico && $scope.data.mMedico.code)
                              ? $scope.data.mMedico.code
                              : '';
        vParams.UserName = $scope.USER.name;
        return vParams;
      }
      $scope.$on('fnSendParams_typeRegister', function(event, valid, activeTab, params){
        if (valid) {
          var vParams = _paramsSaveEvaluation(params);
          nsctrFactory.mining.proxyEvaluations.CSSaveEvaluation(activeTab, vParams, true).then(function(response){
            switch (response.operationCode) {
              case constants.operationCode.success:
                mModalAlert.showSuccess('Se registro la evaluación con éxito', '').then(function(response){
                  _goEvaluation();
                })
                break;
              case constants.operationCode.code901:
                var vErrorHTML = nsctrService.fnGenerateHtmlErrorTable(nsctr_constants.errorTable.et2, '', response.data);
                mModalAlert.showWarning(vErrorHTML, 'ALERTA');
                break;
              default:
                mModalAlert.showWarning(response.message, 'ALERTA');
            }
          }, function(error){
            mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
          });
        }
      });


    }]).factory('loaderMiningAddEvaluationController', ['nsctrFactory', '$q', 'mainServices',
      function(nsctrFactory, $q, mainServices){
      var lists;

      function getLists(showSpin){
        var deferred = $q.defer();
        mainServices.fnReturnSeveralPromise([
          nsctrFactory.common.proxyLookup.ServicesMedicList(false),
          nsctrFactory.common.proxyLookup.ServicesAllClinics(false)
          ], showSpin).then(function(response){
            lists = response;
            deferred.resolve(lists);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getLists: function(showSpin){
          if(lists) return $q.resolve(lists);
          return getLists(showSpin);
        }
      };
    }]);

  });
