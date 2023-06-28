(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants',
  'modalSendEmail', '/scripts/mpf-main-controls/components/modalConfirmation/component/modalConfirmation.js'],
  function(angular, constants){

    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarQuoteS3Controller',
      ['$scope', '$window', '$state', 'hogarFactory', 'mModalAlert', '$uibModal', '$sce', 'oimAbstractFactory',
      function($scope, $window, $state, hogarFactory, mModalAlert, $uibModal, $sce, oimAbstractFactory){

        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $state.params.paramsHogarModule || {};

          if (Object.keys($scope.thirdStep).length > 0) {
            $scope.mainStep.showagente = true;
            $scope.mainStep.goback = false;
            $scope.mainStep.showtitle = true;
            $scope.showPlanType = $scope.thirdStep.data.planType ? true : false;
            $scope.showDiscount = $scope.thirdStep.data.product.Codigo == '31' ? true : false;
            $scope.mDsctoComercial = $scope.firstStep.mDescuentoComercial
            $scope.thirdStep.primaAnual = $scope.thirdStep.response.cotizacion.conceptosDesglose.impPrimaTotal;
            $scope.discoutNotValid = false;
            $scope.fraccionamientoCode = $scope.thirdStep.data.product.Codigo == '30' ? constants.module.polizas.hogar.codeFracc3 : $scope.thirdStep.data.product.Codigo == '31' ? constants.module.polizas.hogar.codeFracc1 : constants.module.polizas.hogar.codeFracc2;

            hogarFactory.getPrimaMensual({
              "COD_FRACCIONAMIENTO": $scope.fraccionamientoCode,
              "ImporteAplicarMapfreDolar": "0",
              "NUM_COTIZACION": $scope.thirdStep.response.cotizacion.numCotizacion,
              "NUMCOTIZACIONTEMP": 0,
              "NUMERODOCUMENTO": 0,
              "NUM_SECUENCIA": 0,
              "VALOR_CUOTA": 0,
              "VALOR_TOTAL": 0
            }, true).then(function(res) {
              $scope.thirdStep.primaMensual = res.Data.VALOR_CUOTA;
            })

            $scope.headerCalculatePremium = [null, 'Hogar Hipotecario', 'Hogar Ideal Integral', 'Hogar Ideal Plus', 'Hogar Ideal Seguro'];
          } else {
            $state.go('.',{
              step: 1
            });
          }

          //URL DownloadPDF
          $scope.secondStep.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/hogar/cotizacion');

        })();

        /*#########################
        # SendEmail
        #########################*/
        $scope.sendEmail = function(){

          //Modal
          //DataEmail, cuando la cotizacion NO esta guardada
          $scope.emailData = {
            reporteParam: buildPDF('0')
          };
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
        $scope.dataSaveQuotation = {
          CodigoCompania : constants.module.polizas.hogar.codeCompany, //'1',
          CodigoTipoEntidad : '1', //FIJO
          Documento : {
            CodigoSistema: oimAbstractFactory.getOrigin(),
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
            CodigoModalidad : $scope.firstStep.mProducto ? $scope.firstStep.mProducto.Codigo : '',
            NumeroPlaca : '',
            CodigoMoneda : $scope.firstStep.mMoneda ? $scope.firstStep.mMoneda.Codigo : '',
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
            TipoDocumento : $scope.firstStep.dataContractorPoliza.mTipoDocumento.Codigo,
            CodigoDocumento : $scope.firstStep.dataContractorPoliza.mNumeroDocumento,
            MCAFisico : '',
            Nombre : $scope.firstStep.dataContractorPoliza.mNomContratante || $scope.firstStep.dataContractorPoliza.mRazonSocial,
            ApellidoPaterno : $scope.firstStep.dataContractorPoliza.mApePatContratante,
            ApellidoMaterno : $scope.firstStep.dataContractorPoliza.mApeMatContratante,
            MCAMapfreDolar : ($scope.firstStep.mOpcionMapfreDolares == 'Si') ? 'S' : 'N', //'N',
            ImporteMapfreDolar : $scope.firstStep.mSaldoMapfreDolar, //'69.72',
            ImporteAplicarMapfreDolar : ($scope.firstStep.mOpcionMapfreDolares == 'Si' && !isNaN($scope.firstStep.mMapfreDolares)) ? $scope.firstStep.mMapfreDolares : 0 //'0'
          },
          Hogar : {
            CodigoCategoria : $scope.firstStep.mCategoria.Codigo, //'1',
            NombreCategoria : $scope.firstStep.mCategoria.Descripcion, //'1ER CATEGORIA',
            AnioInmueble : $scope.firstStep.mAnioConstruccion.Codigo, //'2016',
            FlagEdificacionValor : $scope.firstStep.mEdificacion.valueDefault ? 'S' : 'N', //'S',
            FlagContenidoValor : $scope.firstStep.mContenido.valueDefault ? 'S' : 'N', //'S',
            mcaKitSmart: $scope.thirdStep.data.mcaKitSmart,
            FlagContrataRobo : 'S', //FIJO
            CodigoAlarmaMonitoreo : $scope.thirdStep.data.mcaAlarmaMonitoreo, //'0',
            NombreAlarmaMonitoreo : $scope.thirdStep.data.alarmType ? $scope.thirdStep.data.alarmType.Description : '--NO CONTRATA--', //'--NO CONTRATA--',
            NombreTipoComunicacion: $scope.firstStep.mTipoComunicacion ? $scope.firstStep.mTipoComunicacion.Descripcion : '',
            FlagFinanciar : 'S', //FIJO
            DsctoComercial: !isNaN($scope.mDsctoComercial) ? $scope.mDsctoComercial : 0,
            FlagTipoComunicacion: $scope.thirdStep.data.comunicationType ? $scope.thirdStep.data.comunicationType.Codigo : '',
            FlagAlarmaMonitoreo: $scope.thirdStep.data.mcaAlarmaMonitoreo,
            FlagPulsadorMedico: $scope.thirdStep.data.mcaLlaveroMedico,
            FlagVideoWeb: $scope.thirdStep.data.mcaVideoWeb,
            ImporteRecargo: $scope.thirdStep.response.cotizacion.conceptosDesglose.impRecargos,
            ImporteImpuesto: $scope.thirdStep.response.cotizacion.conceptosDesglose.impImptos,
            ImporteNeta: $scope.thirdStep.response.cotizacion.conceptosDesglose.impPneta,
            ImporteTotal: $scope.thirdStep.response.cotizacion.conceptosDesglose.impPrimaTotal,
            NumeroPisoPredio: $scope.firstStep.mNroPisos ? $scope.firstStep.mNroPisos : 0,
            NumeroSotanoPredio: $scope.firstStep.mNroSotanos ? $scope.firstStep.mNroSotanos : 0,
            NumeroCotizacion: $scope.thirdStep.response.cotizacion.numCotizacion,
            ValoresDeclarados: {
              ValorEdificacion: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impEdificacion : 0,
              ValorContenido: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impContenido : 0,
              ValorObjetosValiosos: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impObjetosValiosos : 0,
              ImporteContenidoRobo: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impRoboContenido : 0,
              ImporteObjetosValiososRobo: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impRoboObjetosValiosos : 0,
              FlagContrataTerremotoContenido: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaTerremotoContenido : 'N',
              FlagContrataTerremotoEdificacion: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaTerremotoEdificacion : 'N',
              FlagContrataTerremotoObjetosValiosos: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaTerremotoObjetosVal : 'N',
              FlagContrataIncendioContenido: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaIncendioContenido : 'N',
              FlagContrataIncendioEdificacion: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaIncendioEdificacion : 'N',
              FlagContrataIncendioObjetosValiosos: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaIncendioObjetosVal : 'N',
              FlagContrataRoboContenido: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaRoboContenido : 'N',
              FlagContrataRoboObjetosValiosos: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].mcaRoboObjetosVal : 'N',
            },
            CoberturaAdicional: {
              DesaparicionMisteriosa: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impDesaparicion : 0,
              DeshonestidadEmpleado: $scope.thirdStep.requestQuotation ? $scope.thirdStep.requestQuotation.riesgoHogar[0].impDesonestidad: 0
            },
            Ubigeo : {
              CodigoDepartamento : $scope.firstStep.ubigeoData.mDepartamento.Codigo, //'15',
              NombreDepartamento : $scope.firstStep.ubigeoData.mDepartamento.Descripcion, //'LIMA',
              CodigoProvincia : $scope.firstStep.ubigeoData.mProvincia.Codigo, //'128',
              NombreProvincia : $scope.firstStep.ubigeoData.mProvincia.Descripcion, //'LIMA',
              CodigoDistrito : $scope.firstStep.ubigeoData.mDistrito.Codigo, //'1',
              NombreDistrito : $scope.firstStep.ubigeoData.mDistrito.Descripcion //'CERCADO DE LIMA'
            },
          },
          Poliza: {
            PorDctoIntgPlaza: $scope.firstStep.PorDctoIntgPlaza || 0,
            MarcaPorDctoIntegralidad:  $scope.firstStep.DctoIntegralidad ? "S" : "N",
            PolizaGrupo: typeof($scope.firstStep.groupPolizeData) == 'object' ? $scope.firstStep.groupPolizeData.groupPolize : $scope.firstStep.groupPolizeData
          },
          CotizacionHogar: {
          }
        }

        // Validadicón de descuento comercial
        $scope.validateDiscount= function(value) {
          $scope.discoutNotValid = value > 10 ? true : false;
        }

        $scope.quoteWithDiscount = function() {
          if (!$scope.mDsctoComercial == undefined || !$scope.mDsctoComercial == "") {
            if (!$scope.discoutNotValid) {
              $scope.thirdStep.requestQuotation.poliza.pctDctoComercial = $scope.mDsctoComercial;
              $scope.thirdStep.requestQuotation.poliza.pctDctoComercialSpecified = true;

              hogarFactory.quote($scope.thirdStep.requestQuotation, true).then(function(response) {
                $scope.thirdStep.primaAnual = response.Data.cotizacion.conceptosDesglose.impPrimaTotal;
                $scope.numQuotation = response.Data.cotizacion.numCotizacion;

                $scope.dataSaveQuotation.Hogar.ImporteRecargo = response.Data.cotizacion.conceptosDesglose.impRecargos;
                $scope.dataSaveQuotation.Hogar.ImporteImpuesto = response.Data.cotizacion.conceptosDesglose.impImptos;
                $scope.dataSaveQuotation.Hogar.ImporteNeta = response.Data.cotizacion.conceptosDesglose.impPneta;
                $scope.dataSaveQuotation.Hogar.ImporteTotal = $scope.thirdStep.primaAnual;

                hogarFactory.getPrimaMensual({"COD_FRACCIONAMIENTO": "10012", "ImporteAplicarMapfreDolar": "0", "NUM_COTIZACION": $scope.numQuotation, "NUMCOTIZACIONTEMP": 0, "NUMERODOCUMENTO": 0, "NUM_SECUENCIA": 0, "VALOR_CUOTA": 0, "VALOR_TOTAL": 0 }, true).then(function(res) {
                  $scope.thirdStep.primaMensual = res.Data.VALOR_CUOTA;
                })
              });
            }
          } else {
            mModalAlert.showInfo('', 'Debes elegir un monto para aplicar el descuento');
          }
        }

        /*#########################
        # saveQuotation
        #########################*/
        $scope.saveQuotation = function() {
          $scope.dataSaveQuotation.Hogar.DsctoComercial = $scope.mDsctoComercial ? $scope.mDsctoComercial : $scope.dataSaveQuotation.Hogar.DsctoComercial;
          $scope.dataConfirmation = {
            save:false
          };

          $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template : '<mpf-modal-confirmation data="dataConfirmation" close="close()"></mpf-modal-confirmation>',
            controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          }).result.then(function(){
            $scope.$watch('dataConfirmation', function(value){
              if (value.save) {
                $scope.guardarCotizacion($scope.dataSaveQuotation);
              }
            });
          },function(){
          });
        }

        $scope.guardarCotizacion = function(paramsQuotation) {
          hogarFactory.saveQuotation(paramsQuotation, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.thirdStep.numDocumento = response.Data.Documento.NumeroDocumento;

              $state.go('hogarGeneratedLetter', {
                numDocument: $scope.thirdStep.numDocumento
              });
            }else{
              mModalAlert.showError(response.Message, 'Error');
            }
          }, function(error){
          }, function(defaultError){
          });
        }

        function buildPDF(codeModality){
          var data = {
            CodigoCompania  : constants.module.polizas.hogar.codeCompany, //"1",
            CodigoRamo      : constants.module.polizas.hogar.codeRamo, //"120",
            codDocumento    : 0,
            cotizacion : {
              NumeroCotizacion  : $scope.secondStep.dataCalculatePremium.NumeroCotizacion, //"583",
              CodigoModalidad   : codeModality, //"0",
              CodigoMoneda      : constants.currencyType.dollar.code, //"2",
              Hogar : {
                FlagContrataRobo                  : 'S', //Fijo
                ValorEdificacion                  : ($scope.firstStep.mEdificacion.valueDefault && !isNaN($scope.firstStep.mCostoEdificacion)) ? $scope.firstStep.mCostoEdificacion : 0, //"200",
                ValorContenido                    : ($scope.firstStep.mContenido.valueDefault && !isNaN($scope.firstStep.mCostoContenido)) ? $scope.firstStep.mCostoContenido : 0, //"200",
                ValorObjetosValiosos              : ($scope.firstStep.mContenido.valueDefault && !isNaN($scope.firstStep.mMontoObjetosValiosos)) ? $scope.firstStep.mMontoObjetosValiosos : 0, //"0",
                CodigoAlarmaMonitoreo             : ($scope.firstStep.mAlarmaMonitoreo.Codigo == null) ? '0' : $scope.firstStep.mAlarmaMonitoreo.Codigo, //"0",
                FlagEdificacionValor              : $scope.firstStep.mEdificacion.valueDefault ? 'S' : 'N', //"S",
                FlagContenidoValor                : $scope.firstStep.mContenido.valueDefault ? 'S' : 'N', //"S",
                FlagContrataTerremotoEdificacion  : $scope.firstStep.mCoberturaTerremotoEdificacion.valueDefault ? 'S' : 'N', //"N",
                FlagContrataTerremotoContenido    : $scope.firstStep.mCoberturaTerremotoContenido.valueDefault ? 'S' : 'N', //"N",
                FlagFinanciar                     : 'S', //FIJO
                Ubigeo : {
                  CodigoDepartamento  : $scope.firstStep.ubigeoData.mDepartamento.Codigo, //"15",
                  CodigoProvincia     : $scope.firstStep.ubigeoData.mProvincia.Codigo, //"128",
                  CodigoDistrito      : $scope.firstStep.ubigeoData.mDistrito.Codigo //"22"
                }
              },
              Agente : {
                CodigoAgente    : $scope.mainStep.claims.codigoAgente, //"9808",
                NombreCompleto  : $scope.mainStep.claims.nombreAgente, //"DIRECTO . ORGANIZACION TERRITORIAL",
                TipoGestor      : constants.module.polizas.hogar.agent.managerType //"CO"
              },
              Contratante : {
                NombreCompleto  : ($scope.firstStep.legarlEntity) ? $scope.firstStep.mRazonSocial : $scope.firstStep.mNomContratante + ' ' + $scope.firstStep.mApePatContratante + ' ' + $scope.firstStep.mApeMatContratante, //"MATIAS AÑAÑOS NUIÑEZ",
                TipoDocumento   : $scope.firstStep.mTipoDocumento.Codigo, //"DNI",
                CodigoDocumento : $scope.firstStep.mNumeroDocumento //"12345678",
              }
            }
          }
          return data;
        }

        /*#########################
        # downloadPDF
        #########################*/
        $scope.downloadPDF = function(codeModality){
          $scope.secondStep.pdfData = buildPDF(codeModality);
          $window.setTimeout(function(){
            document.getElementById('frmDownloadPDF').submit();
          });
        }

    }]);

  });
