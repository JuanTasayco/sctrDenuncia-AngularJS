(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants', 'helper', '/polizas/app/documentos/proxy/documentosFactory.js',
'/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'], function(angular, constants, helper) {
  angular
    .module('appAutos')
    .controller('carEmitResumenController', [
      '$scope',
      'resumen',
      '$state',
      '$window',
      '$uibModal',
      'proxyInspeccion',
      'mainServices',
      'oimAbstractFactory',
      'documentosFactory',
      '$stateParams',
      'mpfPersonFactory',
      function(
        $scope,
        resumen,
        $state,
        $window,
        $uibModal,
        proxyInspeccion,
        mainServices,
        oimAbstractFactory,
        documentosFactory,
        $stateParams,
        mpfPersonFactory
      ) {

        console.log("Llega data carEmitResumen: ", $scope);
        console.log("Llega data carEmitResumen: ", $stateParams);

        $scope.isMyDream = oimAbstractFactory.isMyDream();
        $scope.isMobile = helper.isMobile();

        //ver si se muestra la encuesta o no
        console.log("encuesta", $stateParams.encuesta);
        if($stateParams.encuesta){
          $scope.encuesta = $stateParams.encuesta;
          if($scope.encuesta.mostrar == 1){
            $scope.encuesta = $stateParams.encuesta;
            mostrarEncuesta();
          }
        }

        // Al terminar de firmar
        $scope.onSignature = function (data) { }

        function getDerechoEmision() {
          proxyInspeccion
            .GetPorcentajeDerechoEmision(
              {
                CodigoAgente: $scope.emision.codigoAgente,
                CodigoMoneda: '2',
                CodigoRamo: '301',
                CodigoProducto: $scope.emision.vehiculo.productoVehiculo.codigoProducto,
                NumeroPolizaGrupo: '',
                McaGps: $scope.emision.vehiculo.mcagps,
                FechaRiesgo: $scope.emision.fechaInicio
              },
              true
            )
            .then(
              function(response) {
                $scope.derechoEmision = helper.clone(response, true).data;
              },
              function error(response) {
                console.error('Error en el derecho de emision');
                $scope.derechoEmision = { porcentajeDerechoEmision: 3, impMinInsp: 5 };
              }
            );
        }

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

        $scope.primaCalc = function() {
          if ($scope.derechoEmision) {
            var derEmi = ($scope.derechoEmision.porcentajeDerechoEmision / 100) * $scope.emision.primaNeta;
            derEmi = derEmi >= $scope.derechoEmision.impMinInsp ? derEmi : $scope.derechoEmision.impMinInsp;
            return derEmi + $scope.emision.primaNeta;
          }
          return 0;
        };

        $scope.hideDsctoComercial = function () {
          return Math.abs($scope.emision.vehiculo.dsctoComercial || 0) === 0
        }

        $scope.dsctoComercialCal = function() {
          return $scope.emision.montoPrima * (Math.abs($scope.emision.vehiculo.dsctoComercial) / 100)
        }

        $scope.emision = resumen.emision;
        $scope.cotizacion = resumen.cotizacion;

        // Inicio BuildSoft
        console.log("Accionista tipo y num", $scope.emision)
        $scope.emision.relacionLista = [];//BUILDSOFT
        obtenerRelacion();//BUILDSOFT

        $scope.emision.accionistas = [];
        if (angular.isUndefined($scope.emision.isRucContratante)) {
          $scope.emision.isRucContratante = false; //buildsoft
        }
        var typeDoc = $scope.emision.contratante.tipoDocumento;
        var NumDoc = $scope.emision.contratante.codigoDocumento;
        var NumDocAbreviado = NumDoc.substr(-20, 2);
        if (typeDoc == "RUC" && NumDocAbreviado == "20"){
            $scope.emision.isRucContratante = true;         
            getAccionistasSociosAsociado(typeDoc,NumDoc);                  
        } else {
            $scope.emision.isRucContratante = false;
        }
      // Fin BuildSoft

      // Inicio BuildSoft
      function getAccionistasSociosAsociado(typeDoc,NumDoc){
        mpfPersonFactory.getAccionista(typeDoc,NumDoc)
          .then(function(response){
            console.log("asociado vida",response);
            angular.forEach(response.Data, function(value){
              if (response.Data != [] && response.Data != null) {
                $scope.emision.isRucContratante = true;
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
                $scope.emision.accionistas.push(accionista);
                console.log("accionista", accionista);
                console.log("$scope", $scope);
              } else {
                $scope.emision.isRucContratante = false;
              }
            });
            console.log("todos los datos para mostrar", $scope.emision.accionistas);
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
                $scope.emision.relacionLista.push(relacion);
              });
            } 
            console.log("Lista obtenerRelacion relacion push", $scope.emision.relacionLista);         
          }).catch(function (err) {
            console.error(err);
          });
        }
  
        function obtieneDescripcion(codigo) {
          console.log("LLegue 2",$scope.emision.relacionLista);
          var descripcion = "";
          if (codigo) {
            $scope.emision.relacionLista.forEach(function(e){
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


        // Response para firma
        $scope.paramsSignature = {
          tipoFirma: 2,
          tipoPoliza: 'AUTO',
          numeroRamo: 301,
          numeroCompania: 1,
          numeroModalidad: 0,
          numeroCotizacion: 0,
          numeroPoliza: $scope.emision.numeroPoliza,
          numeroDocumento: 0,
          agrupador: $scope.emision.numeroDocumento, // cotizacion
          firma: ''
        };

        $scope.paramsPdf = {
          url: 'api/documento/descargardocumento',
          data: $scope.emision.numeroPoliza
        };

        function checkRucPerson(tipo, numero) {
          return mainServices.fnShowNaturalRucPerson(tipo, numero);
        }

        $scope.showNaturalRucPerson = checkRucPerson($scope.emision.contratante.tipoDocumento, $scope.emision.contratante.codigoDocumento)

        getDerechoEmision()
        $scope._download = function(){
          var vFileName = 'OIM - ' + $scope.emision.numeroPoliza + '.pdf';
          documentosFactory.generarArchivo($scope.emision.numeroPoliza, vFileName);
        }
        $scope.open_model = function(){
            $scope.emailData = {
                                    "emisor": "",
                                    "nombreEmisor": "",
                                    "reporteParam": {
                                        "NumeroPoliza" : $scope.emision.numeroPoliza,
                                        "cotizacion" : resumen.emision
                                    }
                            }

            $scope.action = constants.modalSendEmail.emitir.action;
            $uibModal.open({
              backdrop: true, // background de fondo
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              template : '<mpf-modal-send-email action="action"  data="emailData" close="close()"></mpf-modal-send-email>',
              controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
                //CloseModal
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
            });
        }

        $scope.goToPaymentGateway = function() {
          // TODO: pendiente de actualizar con campos del servicio: : monto a pagar y moneda
          $state.go('paymentGateway', {
            paymentParam: {
              policy: {
                policyNumber: $scope.emision.numeroPoliza,
                quoteNumber: 1,
                codeRamo: constants.module.polizas.autos.codeRamo
              },
              contractor: {
                firstName: $scope.emision.contratante.nombre,
                lastName: $scope.emision.contratante.apellidoPaterno,
                phoneNumber: $scope.emision.contratante.telefono,
                email: $scope.emision.contratante.correoElectronico
              },
              font: 'ico-mapfre-351-myd-car'
            }
          });
        };
      }
    ])
    .factory('resumenFactory', [
      '$q',
      'proxyDocumento',
      function($q, proxyDocumento) {
        var resumen = {};

        function tryLoadResumen(emitId) {
          var deferred = $q.defer();
          var m = proxyDocumento.ObtenerCotizacionEmisionVehiculo(
            constants.module.polizas.autos.companyCode,
            emitId,
            constants.module.polizas.autos.codeRamo
          );
          m.then(
            function(r) {
              var data = helper.clone(r.Data, true);
              resumen[emitId] = {
                emision: data,
                cotizacion: null
              };
              deferred.resolve(resumen[emitId]);
            },
            function(r) {
              deferred.reject(r);
            }
          );
          return deferred.promise;
        }
        return {
          loadResumen: function(emitId) {
            if (resumen[emitId]) {
              return $q.resolve(resumen[emitId]);
            }
            resumen = {};
            return tryLoadResumen(emitId);
          }
        };
      }
    ]);
});
