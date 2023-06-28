define([
  'angular',
  'helper',
  'lodash',
  '/polizas/app/autos/autosCotizacionGuardada/component/component.js',
  '/polizas/app/autos/autosHome/service/autosFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js',
  'modalSendEmail'
], function (angular, helper, _, factory) {

  angular.module('appAutos')
    .controller("cotizacionGuardadaController", ['$scope', 'autosFactory', '$rootScope', '$window', '$state', '$stateParams', '$uibModal', 'mpSpin', 'oimPrincipal', 'mainServices', 'oimAbstractFactory', 'proxyClaims', 'mModalAlert','proxyReferido',
      function ($scope, autosFactory,  $rootScope, $window, $state, $stateParams, $uibModal, mpSpin, oimPrincipal, mainServices, oimAbstractFactory, proxyClaims, mModalAlert,proxyReferido) {

        var profile = [];

        $scope.isMyDream = oimAbstractFactory.isMyDream();
        // Request para firma
        $scope.paramsSignature = {
          tipoFirma: 1,
          tipoPoliza: "AUTO",
          numeroRamo: 301,
          numeroCompania: 1,
          numeroModalidad: 0,
          numeroDocumento: 0,
          numeroCotizacion: 0,
          numeroPoliza: 0,
          agrupador: 0,
          firma: ''
        };
        $scope.paramsPdf = {
          url: 'api/reporte/autos/cotizacion',
          data: ''
        }

        var keyProd = 'productosCotizacion';
        var productos = autosFactory.getVariableSession(keyProd);
        var key = 'documentosCotizacion';
        var arraySaveDocumento = [];
        var numeroDocumento = [];
        var codCompania = '1'; //codigo de compania
        var codRamo = '301';
        var hasREGSOL = false;
        $scope.data = {};
        $scope.emailData = [];
        $scope.nroCoti = 0;
        $scope.prgSeleccionados3 = [];
        $scope.prgSeleccionados2 = [];
        $scope.formData = {};
        $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido

        getREGSOL();

        //variables para ng-show
        $scope.labelGral = [
          { id: 'S', valor: 'SI' },
          { id: 'N', valor: 'NO' },
          { id: 'RUC', valor: 'RUC' },
          { id: 'nZero', valor: 1 },
          { id: 'two', valor: 2 },
          { id: 'U', valor: 'Usado' }
        ];

        // Datos del usuario logueado
        proxyClaims.GetClaims()
          .then(function (data) {
            if (data != null) {
              profile = data;
              if (profile.length > 0) {
                $scope.codAgente = profile[7].value;
              }
              //obtenemos codigo gestor, codigo oficina, nombre oficina
              var vParams = codCompania + '/' + $scope.codAgente;
              autosFactory.getData('api/general/gestoroficina', vParams)
                .then(function (data) {
                  arraySaveDocumento.CodigoGestor = data.codigoGestor;
                  arraySaveDocumento.CodigoOficina = data.codigoOficina;
                }).catch(function (error) {
                  console.log('Error' + error + vParams);
                });
            }
          }).catch(function (error) {
            console.log('Error' + error);
          });
         
        $scope.userRoot = false;
          if ((oimPrincipal.isAdmin()) && $scope.codAgente != ''){
            $scope.userRoot = true;
        }

        // Si venimos de la pagina de cotizacion
        if ((autosFactory.getVariableSession(key).length) || (angular.isUndefined(autosFactory.getVariableSession(key)) != true)) {

          var documentos = autosFactory.getVariableSession(key);
          autosFactory.eliminarVariableSession(key);

          if (documentos.length > 1) {
            numeroDocumento = documentos;
            buscarDocumentos();
          } else {
            $scope.nroCoti = documentos;
            buscarDocumento();
            autosFactory.eliminarVariableSession(key);
          }
        // Viene de documentos
        } else {
          numeroDocumento[0] = autosFactory.getVariableSession(key);
          $scope.nroCoti = documentos;
          buscarDocumento();
          autosFactory.eliminarVariableSession(key);
        }
        autosFactory.eliminarVariableSession(keyProd);

        //ver si se muestra la encuesta o no
        console.log("encuesta", $stateParams.encuesta);
        if($stateParams.encuesta){
          if($stateParams.encuesta.mostrar == 1){
            $scope.encuesta = $stateParams.encuesta;
            mostrarEncuesta();
          }
        }

        // busqueda cuando venimos de documentos o de cotizacion con un solo producto
        function buscarDocumento() {
          if ($scope.nroCoti != null && $scope.nroCoti > 0) {
            var vParams = codCompania + '/' + $scope.nroCoti + '/' + codRamo;
            mpSpin.start();
            autosFactory.getData('api/documento/documentoBuscar', vParams)
              .then(function (data) {
                mpSpin.end();
                if ($scope.nroCoti != null) {
                  setData(data);
                  if($scope.cotizacionGuardada.PolizaGrupoDescripcion=='' || angular.isUndefined($scope.cotizacionGuardada.PolizaGrupoDescripcion)){
                      $scope.cotizacionGuardada.PolizaGrupoDescripcion = '-';
                  }

                  if($scope.cotizacionGuardada.Contratante.ImporteMapfreDolar == 0.0 || angular.isUndefined(  $scope.cotizacionGuardada.Contratante.ImporteMapfreDolar)){
                      $scope.cotizacionGuardada.Contratante.ImporteMapfreDolar = 0;
                  }
                  arraySaveDocumento.NumeroDocumento = $scope.nroCoti;
                  arraySaveDocumento.PrimaNeta = data.PrimaNeta;
                }
              }).catch(function (error) {
                mpSpin.end();
                console.log('Error' + error + vParams);
                $state.go('homePolizasAutos');
              });
          }
          else {
            $state.go('homePolizasAutos');
          }
        }

        $scope.$watch('prgSeleccionados3', function (nv) {
          $rootScope.prgSeleccionados3 = nv;
        })
        
        
        function _validateReferredNumber(onLoad) {
          if($scope.formData.numReferido){
            proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.cotizacionGuardada.CodigoAgente,$scope.userRoot, true)              
            .then(function(response){
                if(response.data == "F1" || response.data == "F2" || response.data == "F3"){
                  if(!onLoad){mModalAlert.showWarning(response.mensaje, '')} 
                  $scope.formData.msjReferidoValidate = response.mensaje;
                  $scope.numReferidoIsValid = false;
                }
                else{
                  $scope.numReferidoIsValid = true;
                  $scope.formData.msjReferidoValidate = null;
                }
              });
          }
        }

        function setData(data) {
          $scope.cotizacionGuardada = data;
          _validateReferredNumber(true);

          if ($scope.isMyDream) {
            $scope.paramsSignature = $scope.getParamsSignature(data.NumeroDocumento, data.CodigoProducto);
            $scope.paramsPdf = $scope.getParamsPdf(data.NumeroDocumento);
          }

          if ($scope.cotizacionGuardada.PolizaGrupoDescripcion == '' ||
            angular.isUndefined($scope.cotizacionGuardada.PolizaGrupoDescripcion)) {
            $scope.cotizacionGuardada.PolizaGrupoDescripcion = '-';
          }

          if ($scope.cotizacionGuardada.Contratante.ImporteMapfreDolar == 0.0 ||
            angular.isUndefined($scope.cotizacionGuardada.Contratante.ImporteMapfreDolar)) {
            $scope.cotizacionGuardada.Contratante.ImporteMapfreDolar = 0;
          }
        }

        function getModality(codigoProducto) {
          if (!productos) { return 0 };
          var producto = _.find(productos, function(prod) {
            return (prod.CodigoProducto === codigoProducto || prod.codigoProducto === codigoProducto );
          });
          return producto ? (producto.CodigoModalidad ? producto.CodigoModalidad : producto.codigoModalidad) : 0;
        }

        function ordenarDocumento() {
          for (var i = 0; i < numeroDocumento.length; i++) {
            $scope.prgSeleccionados3[i] = cotizacionDoc(numeroDocumento[i]);
          }
          $scope.$apply();
        }

        function cotizacionDoc(nro) {
          for (var i = 0; i < $scope.prgSeleccionados2.length; i++) {
            if ($scope.prgSeleccionados2[i].NumeroDocumento === nro) {
              return $scope.prgSeleccionados2[i];
            }
          }
        }
        
        // recuperamos la cotizacion guardada
        function buscarDocumentos() {
          if (numeroDocumento.length > 1) {
            for (var i = 0; i < numeroDocumento.length; i++) {
              var vParams = codCompania + '/' + numeroDocumento[i] + '/' + codRamo;
              mpSpin.start();
              autosFactory.getData('api/documento/documentoBuscar', vParams)
                .then(function (data) {
                  setData(data);
                  mpSpin.end();
                  if($scope.cotizacionGuardada.PolizaGrupoDescripcion=='' || angular.isUndefined($scope.cotizacionGuardada.PolizaGrupoDescripcion)){
                      $scope.cotizacionGuardada.PolizaGrupoDescripcion = '-';
                  }

                  if($scope.cotizacionGuardada.Contratante.ImporteMapfreDolar == 0.0 || angular.isUndefined($scope.cotizacionGuardada.Contratante.ImporteMapfreDolar)){
                      $scope.cotizacionGuardada.Contratante.ImporteMapfreDolar = 0;
                  }
                  $scope.prgSeleccionados2.push(data);
                })
                .catch(function (error) {
                  mpSpin.end();
                  console.log('Error' + error + vParams);
                });
            }
          }

          setTimeout(function () {
            ordenarDocumento();
          }, 5000);
        }

        //MSAAVEDRA 20211112
        $scope.reporteCotizacion = function (nroDoc) {
          
          /*if(codRamo == 301)
          {
            var data = {            
              nom_aplicativo:"OIM_POLIZAS",
              p_cia: 1,
              p_cod_ramo: codRamo,
              p_num_cotizacion: nroDoc, 
            }
            console.log('msaavedra data' , data);
            autosFactory.generarPDF301(data, vFileName);

          }else
          {*/
          var params = codCompania + '/' + nroDoc + '/' + codRamo;
          var vFileName = 'OIM_COTIZACION_' + nroDoc + '.pdf';
          autosFactory.generarPDF(params, vFileName);
          //}
                           
        };

        // Firma
        $scope.isMobile = helper.isMobile();
        $scope.onSignature = function (data) { }

        $scope.getParamsSignature = function (nroDoc, codigoProducto) {
          return {
            tipoFirma: 1,
            tipoPoliza: "AUTO",
            numeroRamo: 301,
            numeroCompania: 1,
            numeroModalidad: getModality(codigoProducto),
            numeroCotizacion: 0,
            numeroPoliza: 0,
            numeroDocumento: nroDoc,
            agrupador: nroDoc,
            firma: ''
          };
        }

        $scope.getParamsPdf = function (nroDoc) {
          return {
            url: 'api/reporte/autos/cotizacion',
            data: codCompania + '/' + nroDoc + '/' + codRamo
          }
        }

        // IR A EMITIR
        $scope.irAEmitir = function (nroDoc, documento) {
          if($scope.formData.numReferido){
            _validateReferredNumber(false);

            setTimeout(function() {
              if($scope.numReferidoIsValid){
                //redirect to emision
                var profileObject = JSON.parse(window.localStorage.getItem("profile"))
                profileObject.numeroReferido = $scope.formData.numReferido;
                window.localStorage.setItem("profile", JSON.stringify(profileObject));
                _irAEmitir(nroDoc,documento);
                }
              }, 1000);
            }
            else{
              _irAEmitir(nroDoc,documento);
            }
          
        };

        function _irAEmitir(nroDoc,documento) {
          if ($scope.cotizacionGuardada.Vehiculo.MCANUEVO == 'S') {
            $state.go('newEmit.steps', { quotation: nroDoc, step: 1, tipo: documento.tipo, numero: documento.numero });
          }
          else {
            $state.go('usedEmit.steps', { step: 1 }); // Redireccionamiento
          }
        }


        // IR A SOLICITAR INSPECCION
        function getREGSOL() {
          var permisesINSPEC = angular.fromJson($window.localStorage.getItem('evoSubMenuINSPEC'));

          if (!permisesINSPEC) {
            autosFactory.getHeader('api/home/submenu/INSPEC', '')
              .then(function (data) {
                if (data == null) {
                  hasREGSOL = false;
                }
                else {
                  permisesINSPEC = data.data;
                  $window.localStorage.setItem('evoSubMenuINSPEC', JSON.stringify(data.data));
                  hasREGSOL = hasREGSOLFromPermises(permisesINSPEC);
                }
              })
              .catch(function (error) {
                console.log('Error' + error);
              });
          }
          else {
            hasREGSOL = hasREGSOLFromPermises(permisesINSPEC);
          }
        }

        function hasREGSOLFromPermises(permisesINSPEC) {
          return !!_.chain(permisesINSPEC).find(function (permise) {
            return permise.nombreCabecera === 'ACCIONES' && _.find(permise.items, function (item) {
              return item.nombreCorto === 'REGSOL';
            })
          }).value()
        }

        $scope.irAInspeccion = function (documento) {
          var url = '/inspec/#/cotizaciones/' + documento.CodigoCia + '-' + documento.NumeroDocumento + '-' + documento.CodigoRamo;
          var urlWithExtraData = url + '?placa=' + $stateParams.vehiclePlate + '&requestId=' + $stateParams.requestId;
          $window.location = ($stateParams.vehiclePlate && $stateParams.requestId) ? urlWithExtraData : url;
        }

        $scope.checkRucPerson = function (tipo, numero) {
          return mainServices.fnShowNaturalRucPerson(tipo, numero)
        }

        $scope.calificaInspeccion = function (documento) {
          return documento ? documento.Vehiculo.MCANUEVO == $scope.labelGral[1].id && documento.TipoProducto !== 'RC' : false;
        }

        $scope.puedeRedirigirInspeccion = function () {
          return hasREGSOL;
        }

        // SEND EMAIL
        $scope.sendEmail = function (nroCotizacion, PrimaNeta) {
          $scope.emailData = {
            emisor: '',
            nombreEmisor: '',
            reporteParam: {
              codCompania: codCompania,//$scope.cotizacionGuardada.CodigoCia,
              CodigoDocumento: nroCotizacion, //arraySaveDocumento.NumeroDocumento,//$scope.prgSeleccionado.NumeroDocumento,
              sumaAsegurada: $scope.cotizacionGuardada.Vehiculo.ValorComercial,
              CodigoRamo: constants.module.polizas.autos.codeRamo,//301,
              cotizacion: {
                Contratante: {//datos del contratante los sacare del servicio OIM-142
                  TipoDocumento: $scope.cotizacionGuardada.Contratante.TipoDocumento,
                  CodigoDocumento: $scope.cotizacionGuardada.Contratante.CodigoDocumento,
                  FechaNacimiento: $scope.cotizacionGuardada.Contratante.FechaNacimiento,
                  ApellidoPaterno: $scope.cotizacionGuardada.Contratante.ApellidoPaterno,
                  ApellidoMaterno: $scope.cotizacionGuardada.Contratante.ApellidoMaterno,
                  Nombre: $scope.cotizacionGuardada.Contratante.Nombre,
                  Sexo: $scope.cotizacionGuardada.Contratante.Sexo,
                  ImporteMapfreDolar: $scope.cotizacionGuardada.Contratante.ImporteMapfreDolar
                },
                Agente: {
                  CodigoOficina: arraySaveDocumento.CodigoOficina, //OIM-229
                  CodigoAgente: $scope.cotizacionGuardada.CodigoAgente,
                  CodigoGestor: arraySaveDocumento.CodigoGestor //oim-229
                },
                Poliza: {
                  TipoDocumento: "", //consultar a que se refiere con tipo de documento
                  CodigoDocumento: "", //Nro de documento de la cotizacion
                  CodigoAgente: $scope.cotizacionGuardada.CodigoAgente,
                  CodigoGestor: arraySaveDocumento.CodigoGestor, //oim-229
                  Modalidad: {
                    Codigo: "0"
                  }
                },
                Vehiculo: {
                  CodigoCompania: $scope.cotizacionGuardada.CodigoCia,
                  SumaAsegurada: $scope.cotizacionGuardada.Vehiculo.ValorComercial,
                  AnioFabricacion: $scope.cotizacionGuardada.Vehiculo.AnioFabricacion,
                  CodigoUso: $scope.cotizacionGuardada.Vehiculo.CodigoUso,
                  CodigoCategoria: $scope.cotizacionGuardada.Vehiculo.CodigoCategoria,
                  PrimaVehicular: PrimaNeta,
                  MCAGPS: $scope.cotizacionGuardada.Vehiculo.MCAGPS,
                  NombreSubModelo: $scope.cotizacionGuardada.Vehiculo.NombreSubModelo,
                  DerechoEmision: '',
                  ProductoVehiculo: {
                    CodigoCompania: $scope.cotizacionGuardada.CodigoCia,
                    CodigoMoneda: $scope.cotizacionGuardada.CodigoMoneda,
                    CodigoRamo: $scope.cotizacionGuardada.CodigoRamo
                  }
                }
              }
            }
          };

          $scope.action = constants.modalSendEmail.cotizar.action;
          //Modal
          var vModalSendEmail = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template: '<mpf-modal-send-email action="action"  data="emailData" close="close()"></mpf-modal-send-email>',
            controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
          vModalSendEmail.result.then(function () { });
        }

        $scope.isBancaSeg = function () {
          return oimPrincipal.get_role() =='BANSEG';
        }

        $scope.showVigencia = function () {
          if ($scope.cotizacionGuardada) {
            if ($scope.cotizacionGuardada.TipoProducto == 'PLURIANUAL') {
              return false;
            }
            else {
              return oimPrincipal.get_role() =='BANSEG';
            }
          }
        }

        
        function mostrarEncuesta(){
          $scope.encuesta.tipo = 'C';
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
            $scope.$watch('dataConfirmation', function(value){
              if (value.save) {
                console.log('resultEncuesta', value);
              }
            });
          },function(){
          });
        }  

      }]);
});
