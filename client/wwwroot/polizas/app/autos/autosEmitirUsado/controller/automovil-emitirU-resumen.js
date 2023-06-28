(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
	'/polizas/app/autos/autosEmitirUsado/service/usedCarEmitFactory.js', '/polizas/app/documentos/proxy/documentosFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'],
	function(angular, constants, helper){
		angular.module("appAutos").controller('usedCarEmitSummary',
			['$scope', '$window', '$state', 'usedCarEmitFactory', 'oimAbstractFactory', 'documentosFactory', '$uibModal','mpfPersonFactory',
			function($scope, $window, $state, usedCarEmitFactory, oimAbstractFactory, documentosFactory, $uibModal, mpfPersonFactory){

			(function onLoad(){
        $scope.mainStep = $scope.mainStep || {};
        $scope.firstStep = $scope.firstStep || {};
        $scope.secondStep = $scope.secondStep || {};
        $scope.thirdStep = $scope.thirdStep || {};
        $scope.fourthStep = $scope.fourthStep || {};
        $scope.fiveStep = $scope.fiveStep || {};
        $scope.fiveStep.relacionLista = [];//BUILDSOFT
        obtenerRelacion();//BUILDSOFT
        $scope.fiveStep.accionistas = []; //buildsoft
        if (angular.isUndefined($scope.fiveStep.isRucContratante)) $scope.fiveStep.isRucContratante = false; //buildsoft
        $scope.summaryStep = $scope.summaryStep || {};
        $scope.baseURLInspec = constants.system.api.endpoints.inspec;
        $scope.isMyDream = oimAbstractFactory.isMyDream();
        $scope.isMobile = helper.isMobile();

        if ($scope.firstStep.dataInspection && $scope.fiveStep.dataPDF) {
           // Response para firma
          $scope.paramsSignature = {
            tipoFirma: 1,
            tipoPoliza: 'AUTO',
            numeroRamo: 301,
            numeroCompania: 1,
            numeroModalidad: 0,
            numeroCotizacion: 0,
            numeroPoliza: 0,
            numeroDocumento: $scope.fiveStep.dataPDF.NumeroCotizacion,
            numeroInspeccion: $scope.firstStep.dataInspection.NumeroInspeccion,
            numeroRiesgo: $scope.firstStep.dataInspection.Nro_Riesgo,
            agrupador: $scope.firstStep.dataInspection.NumeroInspeccion, // cotizacion
            firma: ''
          };

           //buildsoft inicio
           var typeDoc=$scope.fiveStep.dataSummary.datosContratante.tipoDocumento;
           var NumDoc=$scope.fiveStep.dataSummary.datosContratante.numeroDocumento;        
           var NumDocAbreviado=NumDoc.substr(-20,2);
           if (typeDoc=="RUC" && NumDocAbreviado=="20"){
               $scope.fiveStep.isRucContratante=true;
               getAccionistasSociosAsociado(typeDoc,NumDoc);            
           }else{
             $scope.fiveStep.isRucContratante=false;
           }
           //buildsoft fin

          $scope.paramsSignatureEmi = angular.copy($scope.paramsSignature);
          $scope.paramsSignatureEmi.tipoFirma = 2;
          $scope.paramsSignatureEmi.numeroDocumento = 0;
          $scope.paramsSignatureEmi.numeroPoliza = $scope.fiveStep.dataPDF.NumeroPoliza;

          $scope.paramsSignatureIsnpec = angular.copy($scope.paramsSignature);
          $scope.paramsSignatureIsnpec.tipoFirma = 3;
          $scope.paramsSignatureIsnpec.numeroDocumento = 0;

          $scope.paramsPdfCoti = {
            url: 'api/reporte/autos/cotizacion/1/'+ $scope.fiveStep.dataPDF.NumeroCotizacion,
            data: constants.module.polizas.autos.codeRamo
          };

          $scope.paramsPdfEmi = {
            url: 'api/documento/descargardocumento',
            data: $scope.fiveStep.dataPDF.NumeroPoliza
          };

          usedCarEmitFactory.downloadInspectPdf($scope.firstStep.dataInspection.Nro_Riesgo, $scope.firstStep.dataInspection.NumeroInspeccion).then(
            function(res) {
              $scope.paramsPdfInsp = {
                url: res,
                data: undefined
              };
            },
            function(error) {
              mModalAlert.showError(error.data.message, "Error");
            }
          );

         }
        
        console.log("$scope.fiveStep.encuesta",$scope.fiveStep.encuesta);
        if($scope.fiveStep.encuesta){
          $scope.encuesta = $scope.fiveStep.encuesta;
          if($scope.encuesta.mostrar == 1){
            mostrarEncuesta();
          }
        }
      })();

      // Inicio BuildSoft
        function getAccionistasSociosAsociado(typeDoc,NumDoc){
          mpfPersonFactory.getAccionista(typeDoc,NumDoc)
            .then(function(response){
              console.log("asociado vida",response);
              angular.forEach(response.Data, function(value){
                if (response.Data != [] && response.Data != null) {
                  $scope.fiveStep.isRucContratante = true;
                  var accionista = {
                    documentType: { Codigo: value.TipDocumento },
                    documentNumber: value.NroDocumento,
                    Relacion : obtieneDescripcion(value.Relacion),
                    Nombre : value.Nombres,
                    ApellidoMaterno :value.ApellidoMaterno,
                    ApellidoPaterno :value.ApellidoPaterno,
                    RazonSocial : value.RazonSocial,
                    PorParticipacion : parseInt(value.PorParticipacion) > 100 || parseInt(value.PorParticipacion) < 0 
                                        ? 0 : parseInt(value.PorParticipacion)//BUILDSOFT
                  };              
                  $scope.fiveStep.accionistas.push(accionista);
                  console.log("accionista", accionista);
                  console.log("$scope", $scope);
                }else {
                  $scope.fiveStep.isRucContratante = false;
                }
              });
              console.log("todos los datos para mostrar", $scope.fiveStep.accionistas);
            }).catch(function (err) {
              console.error(err);
            });
          }

          function obtenerRelacion(){
            mpfPersonFactory.getRelacion().then(function (response) {
              console.log("Lista obtenerRelacion relacion", response);          
              if (response.Data && response.Data.length) {
                angular.forEach(response.Data, function (value) {
                  var relacion = {
                      Codigo: value.Codigo,
                      Descripcion: value.Descripcion
                  };
                  $scope.fiveStep.relacionLista.push(relacion);
                });
              } 
              console.log("Lista obtenerRelacion relacion push", $scope.fiveStep.relacionLista);         
            }).catch(function (err) {
              console.error(err);
            });
          }
    
          function obtieneDescripcion(codigo) {
            console.log("LLegue 2",$scope.fiveStep.relacionLista);
            var descripcion = "";
            if (codigo) {
              $scope.fiveStep.relacionLista.forEach(function(e){
                if (e.Codigo === codigo) {
                  descripcion = e.Descripcion;
                }
              });
    
              /*var accionista = $scope.data.relacionLista.filter(function(e){
                return e.Codigo === codigo;
              });
              if (accionista.length > 0) {
                  return accionista[0].Descripcion;
              }
              return "";*/
            }
            return descripcion;
          }
        // Fin BuildSoft

			$scope.downloadPDF = function(){
        if (typeof $scope.fiveStep.dataPDF !== 'undefined' && $scope.fiveStep.dataPDF.NumeroPoliza !== '') {
          var vFileName = 'OIM - ' + $scope.fiveStep.dataPDF.NumeroPoliza + '.pdf';
          documentosFactory.generarArchivo($scope.fiveStep.dataPDF.NumeroPoliza, vFileName);
        }
      }

       $scope.goToPaymentGateway = function() {
          $state.go('paymentGateway', {
            paymentParam: {
              policy: {
                policyNumber: $scope.fiveStep.dataPDF.NumeroPoliza,
                quoteNumber: 1,
                codeRamo: constants.module.polizas.autos.codeRamo
              },
              contractor: {
                firstName: $scope.fiveStep.dataSummary.datosContratante.nombre,
                lastName: $scope.fiveStep.dataSummary.datosContratante.apellidoPaterno,
                phoneNumber: $scope.fiveStep.dataSummary.datosContratante.telefonoFijo,
                email: $scope.fiveStep.dataSummary.datosContratante.telefonoFijo
              },
              font: 'ico-mapfre-351-myd-car'
            }
          });
      };

      // Al terminar de firmar
      $scope.onSignature = function (data) { }

      function mostrarEncuesta(){
        $scope.encuesta.tipo = 'P';
        $scope.encuesta.CodigoCompania = constants.module.polizas.autos.companyCode;
        $scope.encuesta.CodigoRamo = constants.module.polizas.autos.codeRamo;
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

	}]);
});
