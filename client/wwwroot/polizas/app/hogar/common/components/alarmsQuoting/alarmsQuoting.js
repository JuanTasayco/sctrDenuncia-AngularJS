'use strict';

define(['angular', 'constants', 'hogarCpnteAlarmsTypes'],
  function(angular, constants) {
    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarCpnteAlarmsQuotingController', ['$scope', '$uibModal', 'hogarFactory', 'mModalAlert',
      function($scope, $uibModal, hogarFactory, mModalAlert) {
        var vm = this;
        vm.data = vm.data || {};
        vm.$onInit = onInit;

        var cotizacion = vm.data.valorCotizacion ? vm.data.valorCotizacion.conceptosDesglose : null;
        vm.primaAnual = cotizacion ? cotizacion.impPrimaTotal : 0;
        vm.importeRecargo = cotizacion ? cotizacion.impRecargos : 0;
        vm.importeImpuesto = cotizacion ? cotizacion.impImptos : 0;
        vm.importeNeta = cotizacion ? cotizacion.impPneta : 0;
        vm.primaMensual = vm.data.valorCotizacion.primaMensual;
        vm.numQuote = vm.data.valorCotizacion.numCotizacion;
        vm.isChecked = true;
        vm.calculatePrimaMensual = calculatePrimaMensual;
        vm.recalculatePrima = recalculatePrima;
        vm.checkQuote = checkQuote;

        var textIdeal = '* Se divide en 12 cuotas, incluye intereses.';
        var textMapfre24 = '* Se divide en 12 cuotas, no incluye intereses.';
        var textSmart24 = '* Se divide en 24 cuotas, incluye intereses.';
        vm.textCuotas = vm.data.producto.codModalidad == '31' ? textIdeal : vm.data.producto.codModalidad == '6' ? textMapfre24 : textSmart24;

        /*#########################
        # onEventEmmit fnSendAlarmsData
        #########################*/
        $scope.$on('fnSendAlarmsData', function(event, dataAlarms, change) {
          vm.mKitSmart = dataAlarms.mKitSmart == '1' ? 'S' : 'N';
          vm.mTipoComunicacion = dataAlarms.mTipoComunicacion || {Codigo: null, Descripcion: null};
          vm.mVideoWeb = dataAlarms.mVideoWeb == '1' ? 'S' : 'N';
          vm.mLlaveroImagen = dataAlarms.mLlaveroImagen == '1' ? 'S' : 'N';
          vm.mServiceAlarma = dataAlarms.mServiceAlarma == '1' ? 'S' : 'N';
          vm.pctDctoComercial = dataAlarms.mDescuentoComercial || 0;
          vm.changeData = change;
        });

        $scope.$on('fnValidateChecked', function(event){
          if (vm.isChecked) {
            var dataQuote = _createRequestSaveQuote();
            $scope.$emit('fnSendQuoteChecked', dataQuote);
          }
        })

        /*#########################
        # Public methods
        #########################*/
        function recalculatePrima() {
          var requestParams = _createRequestQuote();
          if (vm.pctDctoComercial <= 10) {
            hogarFactory.quote(requestParams, true).then(function(response) {
              if (response.Data.codError == '0') {
                vm.primaAnual = response.Data.cotizacion.conceptosDesglose.impPrimaTotal;
                vm.importeRecargo = response.Data.cotizacion.conceptosDesglose.impRecargos;
                vm.importeImpuesto = response.Data.cotizacion.conceptosDesglose.impImptos;
                vm.importeNeta = response.Data.cotizacion.conceptosDesglose.impPneta;
                vm.numQuote = response.Data.cotizacion.numCotizacion;
                vm.changeData = false;
                _recalculatePrimaMensual(vm.numQuote);
              } else {
                mModalAlert.showInfo('', response.Data.descError);
              }
            });
          }
        }

        function calculatePrimaMensual() {
          _recalculatePrimaMensual(vm.numQuote);
        }

        function checkQuote(val) {
          vm.isChecked = val;
        }

        /*#########################
        # Private methods
        #########################*/
        function _createRequestQuote() {
          var requestQuote = {
            cabecera: vm.data.cabecera,
            poliza: vm.data.poliza,
            producto: vm.data.producto,
            riesgoHogar: vm.data.riesgoHogar
          }
          requestQuote.riesgoHogar[0].mcaKitSmart = vm.mKitSmart;
          requestQuote.riesgoHogar[0].mcaLlaveroMedico = vm.mLlaveroImagen;
          requestQuote.riesgoHogar[0].mcaVideoWeb = vm.mVideoWeb;
          requestQuote.riesgoHogar[0].mcaAlarmaMonitoreo = vm.mServiceAlarma;
          requestQuote.riesgoHogar[0].tipComunicacion = vm.mTipoComunicacion ? vm.mTipoComunicacion.Codigo : null;
          requestQuote.poliza.pctDctoComercial = vm.pctDctoComercial;
          requestQuote.poliza.pctDctoComercialSpecified = true;
          return requestQuote;
        }

        function _createRequestSaveQuote() {
          var requestSaveQuote = {
            CodigoCompania : constants.module.polizas.hogar.codeCompany, //'1',
            CodigoTipoEntidad : '1', //FIJO
            Documento : {
              NumeroDocumento : '',
              NumeroAnterior : '0',
              NumeroTicket : '',
              CodigoEstado : '1', //FIJO
              IpDocumento : '',
              CodigoUsuarioRED : constants.module.polizas.hogar.networkUser, //'Usuario',
              EstadoEmision  : '',
              FlagDocumento : '',
              CodigoProceso : '1', //FIJO
              CodigoModalidad : vm.data.producto.codModalidad,
              DescripcionModalidad: vm.data.producto.desModalidad,
              NumeroPlaca : '',
              CodigoMoneda : vm.data.poliza.moneda.codMon,
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
              CodigoAgente : vm.data.poliza.codAgt
            },
            Contratante : {
              TipoDocumento : vm.saveQuoteData.documentType.Codigo,
              CodigoDocumento : vm.saveQuoteData.documentNumber,
              MCAFisico : '',
              Nombre : vm.saveQuoteData.firstName,
              ApellidoPaterno : vm.saveQuoteData.lastName,
              ApellidoMaterno : vm.saveQuoteData.motherLastName,
              MCAMapfreDolar : vm.data.poliza.mcaMapfreDolares,
              ImporteMapfreDolar : vm.data.poliza.impMapfreDolares
            },
            Hogar : {
              CodigoCategoria : vm.saveQuoteData.category.Codigo,
              NombreCategoria : vm.saveQuoteData.category.Descripcion,
              AnioInmueble : vm.saveQuoteData.yearConstruction.Codigo,
              FlagFinanciar : 'S',
              DsctoComercial: vm.pctDctoComercial,
              FlagEdificacionValor : vm.data.riesgoHogar[0].impEdificacion > 0 ? 'S' : 'N',
              FlagContenidoValor : vm.data.riesgoHogar[0].impContenido > 0 ? 'S' : 'N',
              mcaKitSmart: vm.mKitSmart,
              CodigoAlarmaMonitoreo : vm.mServiceAlarma,
              NombreTipoComunicacion: vm.mTipoComunicacion.Descripcion,
              FlagTipoComunicacion: vm.mTipoComunicacion.Codigo,
              FlagAlarmaMonitoreo: vm.mServiceAlarma,
              FlagPulsadorMedico: vm.mLlaveroImagen,
              FlagVideoWeb: vm.mVideoWeb,
              ImporteRecargo: vm.importeRecargo,
              ImporteImpuesto: vm.importeImpuesto,
              ImporteNeta: vm.importeNeta,
              ImporteTotal: vm.primaAnual,
              NumeroPisoPredio: vm.saveQuoteData.floorsNumber,
              NumeroSotanoPredio: vm.saveQuoteData.basementsNumber,
              NumeroCotizacion: vm.numQuote,
              ValoresDeclarados: {
                ValorEdificacion: vm.data.riesgoHogar[0].impEdificacion,
                ValorContenido: vm.data.riesgoHogar[0].impContenido,
                ValorObjetosValiosos: vm.data.riesgoHogar[0].impObjetosValiosos,
                ImporteContenidoRobo: vm.data.riesgoHogar[0].impRoboContenido,
                ImporteObjetosValiososRobo: vm.data.riesgoHogar[0].impRoboObjetosValiosos,
                FlagContrataTerremotoContenido: vm.data.riesgoHogar[0].mcaTerremotoContenido,
                FlagContrataTerremotoEdificacion: vm.data.riesgoHogar[0].mcaTerremotoEdificacion,
                FlagContrataTerremotoObjetosValiosos: vm.data.riesgoHogar[0].mcaTerremotoObjetosVal,
                FlagContrataIncendioContenido: vm.data.riesgoHogar[0].mcaIncendioContenido,
                FlagContrataIncendioEdificacion: vm.data.riesgoHogar[0].mcaIncendioEdificacion,
                FlagContrataIncendioObjetosValiosos: vm.data.riesgoHogar[0].mcaIncendioObjetosVal,
                FlagContrataRoboContenido: vm.data.riesgoHogar[0].mcaRoboContenido,
                FlagContrataRoboObjetosValiosos: vm.data.riesgoHogar[0].mcaRoboObjetosVal,
              },
              CoberturaAdicional: {
                DesaparicionMisteriosa: vm.data.riesgoHogar[0].impDesaparicion,
                DeshonestidadEmpleado: vm.data.riesgoHogar[0].impDesonestidad
              },
              Ubigeo : {
                CodigoDepartamento : vm.saveQuoteData.ubigeo.department.Codigo,
                NombreDepartamento : vm.saveQuoteData.ubigeo.department.Descripcion,
                CodigoProvincia : vm.saveQuoteData.ubigeo.province.Codigo,
                NombreProvincia : vm.saveQuoteData.ubigeo.province.Descripcion,
                CodigoDistrito : vm.saveQuoteData.ubigeo.district.Codigo,
                NombreDistrito : vm.saveQuoteData.ubigeo.district.Descripcion
              },
            },
            Poliza: {
              PolizaGrupo: vm.data.poliza.numPolizaGrupo
            }
          };
          return requestSaveQuote;
        }

        function _recalculatePrimaMensual(numberQuote) {
          var code = vm.data.producto.codModalidad == '31' ? constants.module.polizas.hogar.codeFracc1 : vm.data.producto.codModalidad == '6' ? constants.module.polizas.hogar.codeFracc2 : constants.module.polizas.hogar.codeFracc3;
          var requestPrimaMensual = {
            "COD_FRACCIONAMIENTO": code,
            "ImporteAplicarMapfreDolar": "0",
            "NUM_COTIZACION": numberQuote,
            "NUMCOTIZACIONTEMP": 0,
            "NUMERODOCUMENTO": 0,
            "NUM_SECUENCIA": 0,
            "VALOR_CUOTA": 0,
            "VALOR_TOTAL": 0
          }

          hogarFactory.getPrimaMensual(requestPrimaMensual, true).then(function(res) {
            vm.primaMensual = res.Data.VALOR_CUOTA;
          })
        }

        function onInit() {
          vm.calculatePrimaMensual();
        }
      }
    ]).component('hogarCpnteAlarmsQuoting', {
      templateUrl: '/polizas/app/hogar/common/components/alarmsQuoting/alarmsQuoting.html',
      controller: 'hogarCpnteAlarmsQuotingController',
      bindings: {
        data: '=',
        saveQuoteData: '='
      }
    })
})
