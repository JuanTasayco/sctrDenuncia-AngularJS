(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper','generalConstantVida',
  '/polizas/app/vida/proxy/vidaFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'],
  function(angular, constants, helper, generalConstantVida){

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaEmittedController',
      ['$scope', '$state', '$filter', 'liveEmission', 'vidaService', 'proxyPolicies', '$uibModal', 'mpfPersonFactory',
      function($scope, $state,  $filter, liveEmission, vidaService, proxyPolicies, $uibModal, mpfPersonFactory){

        (function onLoad(){          
          $scope.mainStep = $scope.mainStep || {};
          $scope.mainStep.accionistas = []; //buildsoft
          if (angular.isUndefined($scope.mainStep.isRucContratante)) $scope.mainStep.isRucContratante = false; //buildsoft
          $scope.mainStep.filterAge = $filter('calculateAge');
          $scope.mainStep.twoDecimal = 2;
          $scope.disabledPPJPU = false;
		  
		   $scope.mainStep.relacionLista = {};//BUILDSOFT
		   obtenerRelacion();//BUILDSOFT

          console.log("accionistas bs, step 4:", $scope);

          if (liveEmission && typeof liveEmission.NumeroPoliza !== 'undefined' && liveEmission.NumeroPoliza !== ''){
            $scope.mainStep.dataEmission = liveEmission;
            validarControlTecnico($scope.mainStep.dataEmission.NumeroPoliza);
            //buildsoft inicio
            var typeDoc=$scope.mainStep.dataEmission.Contratante.TipoDocumento;
            var NumDoc=$scope.mainStep.dataEmission.Contratante.NumeroDocumento;        
            var NumDocAbreviado=NumDoc.substr(-20,2);
            if (typeDoc=="RUC" && NumDocAbreviado=="20"){
                $scope.mainStep.isRucContratante=true;
                getAccionistasSociosAsociado(typeDoc,NumDoc);            
            }else{
              $scope.mainStep.isRucContratante=false;
            }
            //buildsoft fin

            var vInsuredBirthDate = $scope.mainStep.dataEmission.Asegurado.FechaNacimiento;
            $scope.mainStep.dataEmission.Asegurado.EdadActual = $scope.mainStep.filterAge(vidaService.toDate(vInsuredBirthDate));

            $scope.paramsSignature = {
              tipoFirma: 2, //emision 2 cotizacion 1
              tipoPoliza: "VIDA",
              numeroRamo: $scope.mainStep.dataEmission.Producto.CodigoRamo,
              numeroCompania: constants.module.polizas.vida.companyCode,
              numeroModalidad: $scope.mainStep.dataEmission.Producto.CodigoModalidad || 0,
              numeroCotizacion: 0,
              numeroPoliza: $scope.mainStep.dataEmission.NumeroPoliza,
              numeroDocumento: $scope.mainStep.dataEmission.NumeroCotizacion,
              agrupador : $scope.mainStep.dataEmission.NumeroPoliza,
              firma: ''
            };

            $scope.paramsPdf = {
              url: 'api/reporte/vida/cotizacion/' + $scope.mainStep.dataEmission.NumeroCotizacion ,
              data: ''
            };

            if($state.params.encuesta){
              $scope.encuesta = $state.params.encuesta;
              $scope.encuesta.numOperacion = $scope.mainStep.dataEmission.NumeroPoliza;
              if($scope.encuesta.mostrar == 1){
                mostrarEncuesta();
              }
            }
            
          }else{
            $state.go('homePolizasVidas');
          }
          
          if(generalConstantVida.productsPPJ.find(function(element) {return element==$scope.mainStep.dataEmission.Producto.CodigoProducto})){
            $scope.disabledPPJPU = true
          }         
        })();

        // Inicio BuildSoft
        function getAccionistasSociosAsociado(typeDoc,NumDoc){
          mpfPersonFactory.getAccionista(typeDoc,NumDoc)
            .then(function(response){
              console.log("asociado vida",response);
              angular.forEach(response.Data, function(value){
                if (response.Data != [] && response.Data != null) {
                  $scope.mainStep.isRucContratante = true;
                  var accionista = {
                    documentType: { Codigo: value.TipDocumento },
                    documentNumber: value.NroDocumento,
                    //Relacion : obtieneDescripcion(value.Relacion),
                    Nombre : value.Nombres,
                    ApellidoMaterno :value.ApellidoMaterno,
                    ApellidoPaterno :value.ApellidoPaterno,
                    RazonSocial : value.RazonSocial,
                    PorParticipacion : parseInt(value.PorParticipacion) > 100 || parseInt(value.PorParticipacion) < 0 
                                        ? 0 : parseInt(value.PorParticipacion)//BUILDSOFT
                  };
				  if(value.Relacion in $scope.mainStep.relacionLista){
                    accionista.Relacion=$scope.mainStep.relacionLista[value.Relacion];
				  }				  
                  $scope.mainStep.accionistas.push(accionista);
                  console.log("accionista", accionista);
                  console.log("$scope", $scope);
                }else{
                  $scope.mainStep.isRucContratante = false;
                }
              });
              console.log("todos los datis para mostrar", $scope.mainStep.accionistas);
            }).catch(function (err) {
              console.error(err);
            });
          }
		  
		function obtenerRelacion(){
        mpfPersonFactory.getRelacion().then(function (response) {
          console.log("Lista obtenerRelacion relacion", response);          
          if (response.Data && response.Data.length) {
            angular.forEach(response.Data, function (value) {
              $scope.mainStep.relacionLista[value.Codigo]=value.Descripcion;
            });
          } 
          console.log("Lista obtenerRelacion relacion push", $scope.mainStep.relacionLista);         
        }).catch(function (err) {
          console.error(err);
        });
      }     
        // Fin BuildSoft

        $scope.isMobile = helper.isMobile();

        $scope.onSignature = function (data) { }

        function mostrarEncuesta(){
          console.log("$scope.encuesta", $scope.encuesta);
          $scope.encuesta.tipo = 'P';
          $scope.dataConfirmation = {
            save:false,
            valor: 0,
            encuesta: $scope.encuesta
          };
          var vModalConfirmation = $uibModal.open({
            backdrop: 'static', // background de fondo
            keyboard: false,
            scope: $scope,
            // size: 'lg',
            template : '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
            controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
          vModalConfirmation.result.then(function(){
          },function(){
          });
        }

      function validarControlTecnico(numeroPoliza) {
        proxyPolicies
          .GetValidatePolicy(
            numeroPoliza,
            true
          )
          .then(function(response) {
            if (response.operationCode === constants.operationCode.success) {
              $scope.sinCT = response.data.flagValido;
            }
          })
          .catch(function(error) {
            console.log('Error en validarControlTecnico: ' + error);
          });

      }
    }]).factory('loaderVidaEmittedController', ['proxyCotizacion', '$q', function(proxyCotizacion, $q){
      var emission;
      //getemission
      function getEmission(documentNumber, showSpin){
        var deferred = $q.defer();
        proxyCotizacion.buscarCotizacionVidaPorCodigo(documentNumber, showSpin).then(function(response){
          emission = response.Data || response.data;
          deferred.resolve(emission);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        getEmission: function(documentNumber, showSpin){
          return getEmission(documentNumber, showSpin);
        }
      }

    }])

  });
