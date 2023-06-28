(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  'modalSendEmail',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'
],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarQuoteS5Controller',
      ['$scope', '$window', '$state', 'hogarFactory', 'mModalAlert', '$uibModal', '$sce', 'oimAbstractFactory',
      function($scope, $window, $state, hogarFactory, mModalAlert, $uibModal, $sce, oimAbstractFactory){

        $scope.isMyDream = oimAbstractFactory.isMyDream();
        var codCompania = constants.module.polizas.hogar.codeCia;
        var codRamo = constants.module.polizas.hogar.codeRamo;

        $scope.paramsPdf = {
          url: 'api/reporte/hogar/cotizacion',
          data: ''
        };

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};

          $scope.fifthStep = $state.params.paramsHogarModule || {};

          if (Object.keys($scope.fifthStep).length > 0) {
            $scope.mainStep.showagente = false;
            $scope.mainStep.goback = false;
            $scope.mainStep.showtitle = false;
            $scope.headerCalculatePremium = [null, 'Hogar Hipotecario', 'Hogar Ideal Integral', 'Hogar Ideal Plus', 'Hogar Ideal Seguro'];
          } else {
            $state.go('.',{
              step: 1
            });
          }

          if($state.params.encuesta){
            $scope.encuesta = $state.params.encuesta;
            if($scope.encuesta.mostrar == 1){
              mostrarEncuesta();
            }
          }

          //URL DownloadPDF
          $scope.secondStep.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/hogar/cotizacion');

        })();

        function mostrarEncuesta(){
          $scope.encuesta.tipo = 'P';
          $scope.encuesta.CodigoCompania = constants.module.polizas.hogar.codeCia;
          $scope.encuesta.CodigoRamo = constants.module.polizas.hogar.codeRamo;
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

        // Firma
        $scope.isMobile = helper.isMobile();
        $scope.onSignature = function (data) { }

        $scope.getParamsSignature = function (item) {

          if (item) {
            $scope.paramsSignature = {
              tipoFirma: 1,
              tipoPoliza: "HOGAR",
              numeroRamo: codRamo,
              numeroCompania: codCompania,
              numeroModalidad: item.Documento.CodigoModalidad || 0,
              numeroCotizacion: 0,
              numeroPoliza: 0,
              numeroDocumento: item.Documento.NumeroDocumento,
              agrupador : item.Documento.NumeroDocumento,
              firma: ''
            };
          }

          return $scope.paramsSignature;
        }

        $scope.getParamsPdf = function (nroDoc) {
          return {
            url: 'api/reporte/hogar/cotizacion',
            data: codCompania + '/' + nroDoc + '/' + codRamo
          }
        }

        /*#########################
        # SendEmail
        #########################*/
        $scope.sendEmail = function(item){
          $scope.emailData = {
            reporteParam: {
              CodigoCompania: constants.module.polizas.hogar.codeCompany, //'1',
              CodigoRamo: constants.module.polizas.hogar.codeRamo, //'120',
              CodigoDocumento: item.Documento.NumeroDocumento //'186258'
            },
            mensaje: '',
            receptor: '',
            asunto: '',
            emisor: '',
            nombreEmisor: '',
          };

          //Modal
          //DataEmail, cuando la cotizacion NO esta guardada
          $scope.action = constants.modalSendEmail.hogarQuote.action;
           $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
            controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
        }

        // Falta enviar codigoModalidad
        function buildQuotation(codeModality){
          var data = {
            CodigoCompania : constants.module.polizas.hogar.codeCompany, //'1',
            CodigoTipoEntidad : '1', //FIJO
            Documento : {
              NumeroDocumento : '',
              NumeroAnterior : '0',
              NumeroTicket : '',
              CodigoEstado : '1', //FIJO
              CodigoUsuario : $scope.mainStep.claims.codigoUsuario, //'DBISBAL,
              IpDocumento : '',
              CodigoUsuarioRED : constants.module.polizas.hogar.networkUser, //'Usuario',
              EstadoEmision  : '',
              FlagDocumento : '',
              CodigoProceso : '1', //FIJO
              CodigoModalidad : codeModality, //$scope.firstStep.mProducto.Codigo, //'1',
              NumeroPlaca : '',
              CodigoMoneda : '',
              MontoPrima : '0',
              McaAsegNuevo : '',
              CodigoAgente : '0',
              MarcaAsistencia : '',
              Ubigeo : {
                CodigoDepartamento : '',
                CodigoProvincia : '',
                CodigoDistrito : ''
              }
            },
            Agente : {
              CodigoAgente : $scope.mainStep.claims.codigoAgente, //'9808',
              NombreCompleto : $scope.mainStep.claims.nombreAgente //'DIRECTO . ORGANIZACION TERRITORIAL'
            },
            Contratante : {
              TipoDocumento : $scope.firstStep.mTipoDocumento.Codigo, //'DNI',
              CodigoDocumento : $scope.firstStep.mNumeroDocumento, //'12345678',
              MCAFisico : '',
              Nombre : ($scope.firstStep.legarlEntity) ? $scope.firstStep.mRazonSocial : $scope.firstStep.mNomContratante, //'MATIAS',
              ApellidoPaterno : ($scope.firstStep.legarlEntity) ? '' : $scope.firstStep.mApePatContratante, //'AÑAÑOS',
              ApellidoMaterno : ($scope.firstStep.legarlEntity) ? '' : $scope.firstStep.mApeMatContratante, //'NUIÑEZ',
              MCAMapfreDolar : ($scope.firstStep.mOpcionMapfreDolares == 'Si') ? 'S' : 'N', //'N',
              ImporteMapfreDolar : $scope.firstStep.mSaldoMapfreDolar, //'69.72',
              ImporteAplicarMapfreDolar : ($scope.firstStep.mOpcionMapfreDolares == 'Si' && !isNaN($scope.firstStep.mMapfreDolares)) ? $scope.firstStep.mMapfreDolares : 0 //'0'
            },
            Hogar : {
              CodigoCategoria : $scope.firstStep.mCategoria.Codigo, //'1',
              NombreCategoria : $scope.firstStep.mCategoria.Dato, //'1ER CATEGORIA',
              AnioInmueble : $scope.firstStep.mAnioConstruccion.Codigo, //'2016',
              FlagEdificacionValor : $scope.firstStep.mEdificacion.valueDefault ? 'S' : 'N', //'S',
              FlagContenidoValor : $scope.firstStep.mContenido.valueDefault ? 'S' : 'N', //'S',
              ValorEdificacion : ($scope.firstStep.mEdificacion.valueDefault && !isNaN($scope.firstStep.mCostoEdificacion)) ? $scope.firstStep.mCostoEdificacion : 0, //'20000',
              ValorContenido : ($scope.firstStep.mContenido.valueDefault && !isNaN($scope.firstStep.mCostoContenido)) ? $scope.firstStep.mCostoContenido : 0, //'2000',
              ValorObjetosValiosos : ($scope.firstStep.mContenido.valueDefault && !isNaN($scope.firstStep.mMontoObjetosValiosos)) ? $scope.firstStep.mMontoObjetosValiosos : 0, //'0',
              FlagContrataTerremotoEdificacion : $scope.firstStep.mCoberturaTerremotoEdificacion.valueDefault ? 'S' : 'N', //'N',
              FlagContrataTerremotoContenido : $scope.firstStep.mCoberturaTerremotoContenido.valueDefault ? 'S' : 'N', //'N',
              FlagContrataRobo : 'S', //FIJO
              CodigoAlarmaMonitoreo : ($scope.firstStep.mAlarmaMonitoreo.Codigo == null) ? '0' : $scope.firstStep.mAlarmaMonitoreo.Codigo, //'0',
              NombreAlarmaMonitoreo : $scope.firstStep.mAlarmaMonitoreo.Descripcion, //'--NO CONTRATA--',
              FlagFinanciar : 'S', //FIJO
              DsctoComercial: !isNaN($scope.firstStep.mDescuentoComercial) ? $scope.firstStep.mDescuentoComercial : 0,
              Ubigeo : {
                CodigoDepartamento : $scope.firstStep.ubigeoData.mDepartamento.Codigo, //'15',
                NombreDepartamento : $scope.firstStep.ubigeoData.mDepartamento.Descripcion, //'LIMA',
                CodigoProvincia : $scope.firstStep.ubigeoData.mProvincia.Codigo, //'128',
                NombreProvincia : $scope.firstStep.ubigeoData.mProvincia.Descripcion, //'LIMA',
                CodigoDistrito : $scope.firstStep.ubigeoData.mDistrito.Codigo, //'1',
                NombreDistrito : $scope.firstStep.ubigeoData.mDistrito.Descripcion //'CERCADO DE LIMA'
              },
            }
          }
          return data;
        }
        /*#########################
        # saveQuotation
        #########################*/
        $scope.saveQuotation = function(codeModality){
          var paramsQuotation = buildQuotation(codeModality);
          hogarFactory.saveQuotation(paramsQuotation,true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $state.go('hogarEmitt1', {
                quotationNumber: response.Data.Documento.NumeroDocumento
              });
            }else{
              mModalAlert.showError(response.Message, 'Error');
            }
          }, function(error){
          }, function(defaultError){
          });
        }

        /*#########################
        # emitirPoliza
        #########################*/
        $scope.emitirPoliza = function(document) {
          $state.go('hogarEmitt1', {
            numDocument: document
          });
        }

        /*#########################
        # downloadPDF
        #########################*/
        $scope.downloadPDF = function(item){

          $scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/hogar/cotizacion');

          $scope.pdfData = {
            "CodigoCompania": constants.module.polizas.hogar.codeCia,
            "CodigoRamo": constants.module.polizas.hogar.codeRamo,
            "CodigoDocumento": item.Documento.NumeroDocumento,
            "cotizacion": {
              "NumeroCotizacion": item.Hogar.NumeroCotizacion,
              "CodigoModalidad": item.Documento.CodigoModalidad,
              "CodigoMoneda": item.Documento.CodigoMoneda,
              "Hogar": {
                "FlagContrataRobo": "S",
                "ValorEdificacion": item.Hogar.ValoresDeclarados.ValorEdificacion,
                "ValorContenido": item.Hogar.ValoresDeclarados.ValorContenido,
                "ValorObjetosValiosos": item.Hogar.ValoresDeclarados.ValorObjetosValiosos,
                "CodigoAlarmaMonitoreo": item.Hogar.CodigoAlarmaMonitoreo,
                "FlagEdificacionValor": "S",
                "FlagContenidoValor": "S",
                "FlagContrataTerremotoEdificacion": item.Hogar.ValoresDeclarados.FlagContrataTerremotoEdificacion,
                "FlagContrataTerremotoContenido": item.Hogar.ValoresDeclarados.FlagContrataTerremotoContenido,
                "FlagFinanciar": "S",
                "Ubigeo": {
                  "CodigoDepartamento": item.Hogar.Ubigeo.CodigoDepartamento,
                  "CodigoProvincia": item.Hogar.Ubigeo.CodigoProvincia,
                  "CodigoDistrito": item.Hogar.Ubigeo.CodigoDistrito
                },
                "ValoresDeclarados": {
                  "ValorEdificacion": item.Hogar.ValoresDeclarados.ValorEdificacion,
                  "ValorContenido": item.Hogar.ValoresDeclarados.ValorContenido,
                  "ValorObjetosValiosos": item.Hogar.ValoresDeclarados.ValorObjetosValiosos,
                  "ImporteContenidoRobo": item.Hogar.ValoresDeclarados.ImporteContenidoRobo,
                  "ImporteObjetosValiososRobo": item.Hogar.ValoresDeclarados.ImporteObjetosValiososRobo,
                  "FlagContrataTerremotoContenido": item.Hogar.ValoresDeclarados.FlagContrataTerremotoContenido,
                  "FlagContrataTerremotoEdificacion": item.Hogar.ValoresDeclarados.FlagContrataTerremotoEdificacion,
                  "FlagContrataTerremotoObjetosValiosos": item.Hogar.ValoresDeclarados.FlagContrataTerremotoObjetosValiosos,
                  "FlagContrataIncendioContenido": item.Hogar.ValoresDeclarados.FlagContrataIncendioContenido,
                  "FlagContrataIncendioEdificacion": item.Hogar.ValoresDeclarados.FlagContrataIncendioEdificacion,
                  "FlagContrataIncendioObjetosValiosos": item.Hogar.ValoresDeclarados.FlagContrataIncendioObjetosValiosos,
                  "FlagContrataRoboContenido": item.Hogar.ValoresDeclarados.FlagContrataRoboContenido,
                  "FlagContrataRoboObjetosValiosos": item.Hogar.ValoresDeclarados.FlagContrataRoboObjetosValiosos
                },
                "CoberturaAdicional": {
                  "DesaparicionMisteriosa": item.Hogar.CoberturaAdicional.DesaparicionMisteriosa,
                  "DeshonestidadEmpleado": item.Hogar.CoberturaAdicional.DeshonestidadEmpleado
                }
              },
              "Agente": {
                "CodigoAgente": item.Agente.CodigoAgente,
                "NombreCompleto": item.Agente.NombreCompleto,
                "TipoGestor": ""
              },
              "Contratante": {
                "NombreCompleto": item.Contratante.NombreCompleto + " " + item.Contratante.ApellidoPaterno + " " + item.Contratante.ApellidoMaterno,
                "TipoDocumento": item.Contratante.TipoDocumento,
                "CodigoDocumento": item.Contratante.CodigoDocumento
              }
            }
          }

          $window.setTimeout(function(){
            document.getElementById('frmDownloadPDF').submit();
          });
        }

    }]);

  });
