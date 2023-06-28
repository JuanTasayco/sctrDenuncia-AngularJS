(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants',
	'/polizas/app/empresa/factory/empresasFactory.js'],
  function(angular, constants){

    var appAutos = angular.module('appAutos');

    appAutos.controller('empresaEmitController', [
      '$scope',
      '$state',
      '$filter',
      'empresasFactory',
      'empresaEmissionStep',
      'mainServices',
      '$timeout',
      function(
        $scope,
        $state,
        $filter,
        empresasFactory,
        empresaEmissionStep,
        mainServices,
        $timeout
        ){
      /*########################
      # onLoad
      ########################*/
      (function onLoad(){
        $scope.emit = $scope.emit || {};
        $scope.emitS1 = $scope.emitS1 || {};
        $scope.emitS2 = $scope.emitS2 || {};
        $scope.emitS3 = $scope.emitS3 || {};
        $scope.emitS4 = $scope.emitS4 || {};

        $scope.emit.FORMAT_DATE = constants.formats.dateFormat;
        $scope.emit.FORMAT_MASK = constants.formats.dateFormatMask;
        $scope.emit.FORMAT_PATTERN = constants.formats.dateFormatRegex;
        $scope.emit.ALT_INPUT_FORMATS = ['M!/d!/yyyy'];


        $scope.emit.fnFilterDate = $filter('date');

        if (empresaEmissionStep){
          $scope.emit.step = empresaEmissionStep;
          var vCurrency = _.find(constants.currencyType, function(o){
                            return o.code == $scope.emit.step.Moneda.Codigo;
                          });
          $scope.emit.CURRENCY = vCurrency.description;
        }

        $scope.isRuc = isRuc;
      })();

      function isRuc(){
      var vNatural = true;
        if ($scope.emit.step.Contratante.TipoDocumento.Codigo && $scope.emit.step.Contratante.NumeroDocumento) vNatural = mainServices.fnShowNaturalRucPerson($scope.emit.step.Contratante.TipoDocumento.Codigo, $scope.emit.step.Contratante.NumeroDocumento);
        return !vNatural;
      }

      /*########################
      # stateChangeSuccess
      ########################*/
      $scope.$on('$stateChangeSuccess', function(s, state, param, d) {
        $scope.currentStep = param.step
      });

      /*########################
      # fnSteps
      ########################*/
      $scope.fnSteps = function(step){
        var e = {cancel: false, step: step}
        $scope.$broadcast('changingStep', e);
        return !e.cancel;
      }

    }]).factory('loaderEmpresaEmitController', ['empresasFactory', '$q', 'mainServices',
    function(empresasFactory, $q, mainServices){
      var vEmissionStep, vListThirdStep, vListFourthStep;

      //getEmissionStep
      function getEmissionStep(quoteNumber, showSpin){
        var deferred = $q.defer();
        empresasFactory.proxyEmpresa.GetEmissionStep(quoteNumber, true).then(function(response){
          vEmissionStep = response.data || response.Data;
          deferred.resolve(vEmissionStep);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      function getListThirdStep(showSpin){
        var deferred = $q.defer();
        mainServices.fnReturnSeveralPromise([
          empresasFactory.proxyTipoDocumento.getTipoDocumento(false),
          empresasFactory.proxyGeneral.GetOcupacion(null, null, false),
          empresasFactory.proxyGeneral.GetActividadEconomica(false),
          empresasFactory.proxyGeneral.GetListCargo(false)
          ], showSpin).then(function(response){
          vListThirdStep = response;
           deferred.resolve(vListThirdStep);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      function getListFourthStep(showSpin){
        var deferred = $q.defer();
        mainServices.fnReturnSeveralPromise([
          empresasFactory.proxyFinanciamiento.GetListaFinanciamiento('E', false),
          empresasFactory.proxyContratante.GetListEndosatario(false)
          ], showSpin).then(function(response){
          vListFourthStep = response;
           deferred.resolve(vListFourthStep);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getEmissionStep: function(quoteNumber, showSpin){
          return getEmissionStep(quoteNumber, showSpin);
        },
        getListThirdStep: function(showSpin){
          if (vListThirdStep) return $q.resolve(vListThirdStep);
          return getListThirdStep(showSpin);
        },
        getListFourthStep: function(showSpin){
          if (vListFourthStep) return $q.resolve(vListFourthStep);
          return getListFourthStep(showSpin);
        }
      };

    }]);

  });
