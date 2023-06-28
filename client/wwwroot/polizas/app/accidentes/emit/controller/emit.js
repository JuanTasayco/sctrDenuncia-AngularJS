(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
  '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
  '/polizas/app/accidentes/quote/service/accidentesFactory.js',
  '/polizas/app/accidentes/doc/service/accidentesGuardadoFactory.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('accidentesEmitController', 
      ['$scope', 'oimPrincipal', '$window', '$state', '$timeout', '$rootScope', 'mModalAlert', '$stateParams', 'accidentesFactory', 'accidentesGuardadoFactory', 'mpSpin', '$q', 
      function($scope, oimPrincipal , $window, $state, $timeout, $rootScope, mModalAlert, $stateParams, accidentesFactory, accidentesGuardadoFactory, mpSpin, $q){

      (function onLoad(){
        $scope.formData = $rootScope.formData || {}; 
  
        if(!$scope.formData.validatedPaso1){
          $scope.formData.riesgos = [];
          $scope.formData.quotationNumber =  $stateParams.quotationNumber;

          $scope.formData.PrimaNetaIndividual = 0;
          $scope.formData.PrimaNeta = 0;
          $scope.formData.PrimaTotal = 0;
          getClaims();
          buscarDocumento(); 
        }              

      })();
    
      function getClaims(){
       var deferred = $q.defer();
        accidentesFactory.getClaims().then(function(response){
         
          $scope.formData.claims = response;
          // if ($scope.formData.claims){
            $scope.formData.claims = {
              codigoUsuario:  $scope.formData.claims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
              rolUsuario:     $scope.formData.claims[12].value, //'ADMIN'
              nombreAgente:   $scope.formData.claims[6].value.toUpperCase(),
              codigoAgente:   $scope.formData.claims[7].value //Ejm: 9808 //agendid en el claim
            }            
            $scope.userRoot = false;
            if ((oimPrincipal.isAdmin()) && $scope.formData.claims.nombreAgente != ''){
              $scope.userRoot = true;
            }

             $scope.mAgente = {
              codigoAgente: $scope.formData.claims.codigoAgente,
              codigoNombre: $scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente,
              importeAplicarMapfreDolar:0,
              mcamapfreDolar:"",
              codigoEstadoCivil:0,
              codigoUsuario: $scope.formData.claims.codigoUsuario,
              rolUsuario: $scope.formData.claims.rolUsuario
            };

          // }


          deferred.resolve($scope.formData.claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise; 
      }

      $scope.saveAgent = function(agent){
        $scope.formData.claims.codigoAgente = agent.codigoAgente;
        $scope.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
      }

      $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      })
    
      function listarRiesgos(riesgo, usuario){
        var num = 0; 
        $scope.formData.riesgos = [];
        $scope.formData.riesgos2 = [];

        if(!(typeof riesgo == 'undefined') && !(typeof usuario == 'undefined')) {
          accidentesFactory.ListarRiesgoAccidente(riesgo, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.formData.riesgosListados = response.Data;
          
              for(var i=0; i<$scope.formData.riesgosListados.length; i++){
                 var newRiesgo = {
                  nroRiesgo: num+1,
                  actividad: $scope.formData.riesgosListados[i].NombreOcupacion,
                  numeroAseg:$scope.formData.riesgosListados[i].NumeroAsegurados,
                  primaNetaAseg: $scope.formData.riesgosListados[i].PrimaNetaIndividual,
                  primaNetaTotal: $scope.formData.riesgosListados[i].PrimaNeta,
                  primaTotal: $scope.formData.riesgosListados[i].PrimaTotal
                };
                $scope.formData.PrimaNetaIndividual += newRiesgo.primaNetaAseg;
                $scope.formData.PrimaNeta += newRiesgo.primaNetaTotal;
                $scope.formData.PrimaTotal += newRiesgo.primaTotal;
                console.log(newRiesgo.primaTotal);

                num++;
                $scope.formData.riesgos2.push(newRiesgo);
              }

              $scope.formData.PrimaNetaIndividual = $scope.formData.PrimaNetaIndividual;
              $scope.formData.PrimaNeta = $scope.formData.PrimaNeta;
              $scope.formData.PrimaTotal = $scope.formData.PrimaTotal;  

              if(response.Data.length > $scope.formData.riesgos2.length){
                for(var i=0; i<$scope.formData.riesgos2.length/2; i++){
                  $scope.formData.riesgos[i] = $scope.formData.riesgos2[i];
                }

                $scope.formData.PrimaNetaIndividual = $scope.formData.PrimaNetaIndividual/2;
                $scope.formData.PrimaNeta = $scope.formData.PrimaNeta/2;
                $scope.formData.PrimaTotal = $scope.formData.PrimaTotal/2;
              }else{
                for(var i=0; i<$scope.formData.riesgos2.length; i++){
                  $scope.formData.riesgos[i] = $scope.formData.riesgos2[i];
                }
              }    
            }
          });
        }
      }

      function buscarDocumento(){
        if($scope.formData.quotationNumber!=null && $scope.formData.quotationNumber>0 && !$scope.formData.validatedPaso1){          
          mpSpin.start();   

          accidentesGuardadoFactory.buscarDocumento($scope.formData.quotationNumber).then(function(response){
            if(response.OperationCode == constants.operationCode.success){
                mpSpin.end();
                $scope.formData.quotationRisk = response.Data.NumeroSecuencia;
                $scope.formData.codigoUsuario = response.Data.CodigoUsuario;
                $scope.formData.inicioVigencia = response.Data.PolizaB.InicioVigencia;
                $scope.formData.finVigencia = response.Data.PolizaB.FinVigencia;
                $scope.formData.codigoMoneda = response.Data.CodigoMoneda;
                listarRiesgos($scope.formData.quotationRisk, $scope.formData.codigoUsuario);
            }else if (response.Message.length > 0){
              mpSpin.end();
            }        
          }, function(error){
            mpSpin.end();
            console.log('Error en buscarDocumento: ' + error);
          });

        }

        if($scope.cotizacionGuardada==null){
          //mModalAlert.showWarning("No se puede mostrar la cotización", "Consultar cotización");
        }
      }

      $scope.$on('$stateChangeSuccess', function (s, state, param, d) {
        $scope.currentStep = param.step;
      });

      /*#########################
      # Steps
      #########################*/
      $scope.nav = {}
      $scope.nav.go = function (step){
        var e = { cancel : false, step: step }  
        $scope.$broadcast('changingStep', e);
        return !e.cancel;       
      }
    
    }]).factory('loaderAccidentesEmitController', ['accidentesFactory', '$q', 'mpSpin', function(accidentesFactory, $q, mpSpin){
      var claims;
      //Claims
      function getClaims(){
       var deferred = $q.defer();
        accidentesFactory.getClaims().then(function(response){         
          claims = response;
          deferred.resolve(claims);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise; 
      }
    
      return {
        getClaims: function(){
          if(claims) return $q.resolve(claims);
          return getClaims();
        }       
      }

    }])   

  });
