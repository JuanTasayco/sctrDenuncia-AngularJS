(function($root, deps, action) {
    define(deps, action);
})(this, ['angular', 'constants', 'helper', 'modalSendEmail'], function(angular, constants, helper) {
    angular.module('appVida').controller('vidaEmitController',
      ['$scope', '$state', 'liveQuotation',
      function($scope, $state, liveQuotation) {

        (function onLoad() {

          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};

          $scope.mainStep.FORMAT_DATE = $scope.mainStep.FORMAT_DATE || constants.formats.dateFormat;
          $scope.mainStep.FORMAT_MASK = $scope.mainStep.FORMAT_MASK || constants.formats.dateFormatMask;
          $scope.mainStep.FORMAT_PATTERN = $scope.mainStep.FORMAT_PATTERN || constants.formats.dateFormatRegex;
          $scope.mainStep.ALT_INPUT_FORMATS = $scope.mainStep.ALT_INPUT_FORMATS || ['M!/d!/yyyy'];

          console.log("accionistas bs, step 4:", $scope);

        })();

            if (liveQuotation && liveQuotation.FlagRentaSegura === 'S') {
              $scope.pasosVida = [
                { description: 'Datos del Contratante y Asegurado' },
                { description: 'Datos de la póliza' },
                { description: 'Documentos Requeridos' }
              ];
            }
            else {
              $scope.pasosVida = [
                { description: 'Datos del Contratante y Asegurado' },
                { description: 'Datos de la póliza' },
                { description: 'Declaración Personal de Salud' }
              ];
            }

            $scope.$on('$stateChangeSuccess', function(s, state, param, d) {
                $scope.currentStep = param.step;
            });

            $scope.gotoStep = function(step) {
                if ($scope.currentStep > step) {
                    $state.go('.', {
                        step: step
                    });
                }
            };
        }
    ]).factory('loaderVidaEmitController',
    ['proxyClaims', 'proxyGeneral', 'proxyUbigeo', 'proxyCotizacion', '$q', 'vidaFactory', 'mpSpin',
    function(proxyClaims, proxyGeneral, proxyUbigeo, proxyCotizacion, $q, vidaFactory, mpSpin){
      var claims, civilStatus, economicActivities, occupations, countries, quotation,
          financialEntities, accountTypes, coins, cardsType;
      var surveyDPS = {
        quotationNumber: undefined,
        productoCode: undefined,
        questions: [],
        answers: [],
      };

      //getClaims
      function getClaims(showSpin){
       var deferred = $q.defer();
        proxyClaims.getClaims(showSpin).then(function(response){
          claims = response;
          deferred.resolve(claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getCivilStatus
      function getCivilStatus(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetListEstadoCivil(showSpin).then(function(response){
          civilStatus = response;
          deferred.resolve(civilStatus);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getEconomicActivity
      function getEconomicActivities(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetActividadEconomica(showSpin).then(function(response){
          economicActivities = response;
          deferred.resolve(economicActivities);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getOccupation
      function getOccupations(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetOcupacion(null, null, showSpin).then(function(response){
          occupations = response;
          deferred.resolve(occupations);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getCountries
      function getCountries(showSpin){
        var deferred = $q.defer();
        proxyUbigeo.GetListPais(showSpin).then(function(response){
          countries = response;
          deferred.resolve(countries);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getQuotation
      function getQuotation(quotationNumber, showSpin){
        var deferred = $q.defer();
        proxyCotizacion.buscarCotizacionVidaPorCodigo(quotationNumber, showSpin).then(function(response){
          quotation = response.Data || response.data;
          deferred.resolve(quotation);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getFinancialEntities
      function getFinancialEntities(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetListEntidadFinanciera(showSpin).then(function(response){
          financialEntities = response.Data || response.data;
          deferred.resolve(financialEntities);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getAccountTypes
      function getAccountTypes(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetListTipoCuenta(showSpin).then(function(response){
          accountTypes = response.Data || response.data;
          deferred.resolve(accountTypes);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getCoins
      function getCoins(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetListMonedaVida(showSpin).then(function(response){
          coins = response.Data || response.data;
          deferred.resolve(coins);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getCardsType
      function getCardsType(showSpin){
        var deferred = $q.defer();
        proxyGeneral.GetListTipoTarjeta(showSpin).then(function(response){
          cardsType = response.Data || response.data;
          deferred.resolve(cardsType);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }
      //getSurveyDPS
      function getSurveyDPS(productoCode, quotationNumber, isSameSurveyDPS, showSpin) {
        if (showSpin) mpSpin.start();

        var deferred = $q.defer();
        surveyDPS.productoCode = productoCode;
        surveyDPS.quotationNumber = quotationNumber;

        function _end() { if (showSpin) mpSpin.end(); }

        function _getAnswers(quotationNumber) {
          vidaFactory.evaluarCotizacion.recuperarRespuestasDPS(quotationNumber, false)
            .then(function(resAnswers) {
              surveyDPS.answers = resAnswers.Resultado;
              deferred.resolve(surveyDPS);
              _end();
            }).catch(function(error) {
              deferred.reject(error.statusText);
              _end();
            });
        }

        function _getSurveyDPS(productoCode, quotationNumber) {
          vidaFactory.cuestionario.recuperarCuestionario(productoCode, false)
            .then(function(resQuestions) {
              surveyDPS.questions = resQuestions.Resultado;
              if (surveyDPS.questions) {
                _getAnswers(quotationNumber);
              } else {
                deferred.resolve(surveyDPS);
                _end();
              }
            }).catch(function(error) {
              deferred.reject(error.statusText);
              _end();
            });
        }

        isSameSurveyDPS
          ? _getAnswers(quotationNumber)
          : _getSurveyDPS(productoCode, quotationNumber);

        return deferred.promise;
      }


      return {
        getClaims: function(showSpin){
          if(claims) return $q.resolve(claims);
          return getClaims(showSpin);
        },
        getCivilStatus: function(showSpin){
          if(civilStatus) return $q.resolve(civilStatus);
          return getCivilStatus(showSpin);
        },
        getEconomicActivities: function(showSpin){
          if(economicActivities) return $q.resolve(economicActivities);
          return getEconomicActivities(showSpin);
        },
        getOccupations: function(showSpin){
          if(occupations) return $q.resolve(occupations);
          return getOccupations(showSpin);
        },
        getCountries: function(showSpin){
          if(countries) return $q.resolve(countries);
          return getCountries(showSpin);
        },
        getQuotation: function(quotationNumber, showSpin){
          // if(quotation) return $q.resolve(quotation);
          return getQuotation(quotationNumber, showSpin);
        },
        getFinancialEntities: function(showSpin){
          if(financialEntities) return $q.resolve(financialEntities);
          return getFinancialEntities(showSpin);
        },
        getAccountTypes: function(showSpin){
          if(accountTypes) return $q.resolve(accountTypes);
          return getAccountTypes(showSpin);
        },
        getCoins: function(showSpin){
          if(coins) return $q.resolve(coins);
          return getCoins(showSpin);
        },
        getCardsType: function(showSpin){
          if(cardsType) return $q.resolve(cardsType);
          return getCardsType(showSpin);
        },
        getSurveyDPS: function(productoCode, quotationNumber, showSpin) {
          var isSameSurveyDPS = surveyDPS.quotationNumber === quotationNumber;
          if (isSameSurveyDPS && surveyDPS.answers.length) return $q.resolve(surveyDPS);

          return getSurveyDPS(productoCode, quotationNumber, isSameSurveyDPS, showSpin);
        }
      };

    }]);
});
