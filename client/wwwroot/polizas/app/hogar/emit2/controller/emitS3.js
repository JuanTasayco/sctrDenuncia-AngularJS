(function($root, deps, action) {
  define(deps, action);
})(
  this,
  [
    'angular',
    'constants',
    '/polizas/app/hogar/proxy/hogarFactory.js',
    '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js',
    'polizasFactory'
  ],
  function(angular, constants) {
    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarEmitt3Controller', [
      '$scope',
      '$state',
      'hogarFactory',
      'mModalAlert',
      '$filter',
      'polizasFactory',
      'oimAbstractFactory',
      'proxyGeneral',
      function($scope, $state, hogarFactory, mModalAlert, $filter, polizasFactory, oimAbstractFactory, proxyGeneral) {
        (function onLoad() {
          $scope.mainStep = $scope.mainStep || {};
          $scope.firstStep = $scope.firstStep || {};
          $scope.secondStep = $scope.secondStep || {};
          $scope.thirdStep = $scope.thirdStep || {};
          $scope.thirdStep = $state.params;

          if ($scope.thirdStep.paramsHogarEmit) {
            $scope.constants = $scope.constants || {};
            $scope.filters = $scope.filters || {};
            $scope.functions = $scope.functions || {};
            $scope.mBusquedaEndosatario = '1';
            $scope.btnEndosatario = 'Buscar';
            $scope.thirdStep.dataStepOne = $state.params.paramsHogarEmit.dataStepOne;
            $scope.thirdStep.dataStepTwo = $state.params.paramsHogarEmit.dataStepTwo;
            $scope.valorTotalPrima = $scope.thirdStep.dataStepOne.Hogar.ImporteTotal;
            $scope.mMapfreDolar = $scope.thirdStep.dataStepOne.Contratante.ImporteAplicarMapfreDolar || 0;
          } else {
            $state.go('hogarEmitt1', {
              numDocument: $scope.thirdStep.numDocument
            });
          }

          getEncuesta();
        })();
        $scope.montoValido = false;
        $scope.thirdStep.filterDate = $filter('date');
        $scope.thirdStep.FORMAT_DATE = constants.formats.dateFormat;

        var paramsMDolar = {
          CodigoMoneda: 2,
          Fecha: $scope.thirdStep.filterDate(new Date(), $scope.thirdStep.FORMAT_DATE)
        };

        var fechaNacimientoAño = $scope.thirdStep.paramsHogarEmit.contractorData.mYear.id
          ? $scope.thirdStep.paramsHogarEmit.contractorData.mYear.id
          : '';
        var fechaNacimientoMes = $scope.thirdStep.paramsHogarEmit.contractorData.mMonth.id
          ? $scope.thirdStep.paramsHogarEmit.contractorData.mMonth.id
          : '';
        var fechaNacimientoDia = $scope.thirdStep.paramsHogarEmit.contractorData.mDay.id
          ? $scope.thirdStep.paramsHogarEmit.contractorData.mDay.id
          : '';

        hogarFactory
          .getFinancingType($scope.thirdStep.dataStepOne.Hogar.CodigoModalidad, true)
          .then(function(response) {
            if (response.OperationCode == constants.operationCode.success) {
              $scope.tipoFinancData = response.Data;
            }
          });

        hogarFactory.getEndorsee().then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            $scope.nombreEndosatarioData = response.Data;
          }
        });

        hogarFactory.getTipoCambio(paramsMDolar, true).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            $scope.tipoCambio = response.Data;
            calculateMapfreDollars($scope.tipoCambio);
          }
        });

        function getEncuesta(){
          var codCia = constants.module.polizas.hogar.codeCompany;
          var codeRamo = constants.module.polizas.hogar.codeRamo;
    
          proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
            if(response.OperationCode == constants.operationCode.success){
            if (Object.keys(response.Data.Pregunta).length > 0){
              $scope.encuesta = response.Data;
              $scope.encuesta.CodigoCompania = codCia;
              $scope.encuesta.CodigoRamo = codeRamo;
            }else{
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
            }
          }, function(error){
            console.log('Error en getEncuesta: ' + error);
          })
        }

        function calculateMapfreDollars(tipoCambio) {
          if ($scope.mMapfreDolar > 0) {
            $scope.mapfreSoles = $scope.mMapfreDolar * tipoCambio;
            $scope.valorTotalPrima = $scope.thirdStep.dataStepOne.Hogar.ImporteTotal - $scope.mapfreSoles;
          }
        }

        function formatDate(date) {
          var format = date.slice(0, 10);
          return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
        }

        function _evalMcaFisico(numDocument) {
          var firstNumbers = numDocument.slice(0, 2);
          return firstNumbers == '10' ? 'S' : 'N';
        }

        $scope.addMapfreDollar = function(val) {
          if (val > $scope.thirdStep.paramsHogarEmit.contractorData.SaldoMapfreDolar) {
            $scope.mapfreSoles = $scope.mMapfreDolar * $scope.tipoCambio;
            $scope.montoValido = true;
          } else {
            $scope.mapfreSoles = $scope.mMapfreDolar * $scope.tipoCambio;
            $scope.montoValido = false;
          }

          $scope.valorTotalPrima = $scope.thirdStep.dataStepOne.Hogar.ImporteTotal - $scope.mapfreSoles;
        };

        $scope.buscarEndosatario = function(ruc) {
          hogarFactory.getEndosatarioByRuc(ruc, true).then(function(response) {
            if (response.OperationCode == constants.operationCode.success) {
              if ($scope.btnEndosatario.toLowerCase() !== 'cambiar') {
                $scope.nombreEndosatario = response.Data.Descripcion;
                $scope.codigoEndosatario = response.Data.Codigo;
                $scope.endosatarioEcontrado = true;
                $scope.noExisteEndosatario = false;
                $scope.btnEndosatario = 'Cambiar';
              } else {
                $scope.endosatarioEcontrado = false;
                $scope.btnEndosatario = 'Buscar';
                $scope.mRucEndosatario = '';
              }
            } else {
              $scope.noExisteEndosatario = true;
              $scope.endosatarioEcontrado = false;
              $scope.btnEndosatario = 'Buscar';
            }
          });
        };

        $scope.emitirPoliza = function() {
          var requestEmit = {
            PorDctoIntgPlaza: $scope.thirdStep.dataStepTwo.PorDctoIntgPlaza || 0,
            MarcaPorDctoIntegralidad: $scope.thirdStep.dataStepTwo.DctoIntegralidad ? 'S' : 'N',
            CodigoCompania: 1,
            CodigoTipoEntidad: 1,
            TipoEmision: 5,
            MCAEndosatario: 'N',
            Inspeccion: {
              NumeroInspeccionTRON: ''
            },
            Inspector: {
              Nombre: '',
              ApellidoPaterno: '',
              Telefono: 0,
              Telefono2: 0,
              Observacion: ''
            },
            Documento: {
              CodigoSistema: oimAbstractFactory.getOrigin(),
              NumeroDocumento: 0,
              NumeroAnterior: $scope.thirdStep.dataStepOne.NumeroDocumento, // REQUERIDO NUMOER COIZACION
              CodigoAgente: $scope.thirdStep.dataStepOne.Agente.CodigoAgente,
              CodigoEstado: 1,
              CodigoMoneda: $scope.thirdStep.dataStepOne.CodigoMoneda,
              CodigoProceso: 2,
              CodigoProducto: 65,
              CodigoUsuario: $scope.thirdStep.dataStepOne.CodigoUsuario,
              CodigoUsuarioRED: $scope.thirdStep.dataStepOne.CodigoUsuarioRED,
              EstadoEmision: '',
              FechaRegistro: '23/02/2018',
              FlagDocumento: '',
              IpDocumento: '::1',
              MarcaAsistencia: '',
              McaAsegNuevo: 'N',
              MontoPrima: '0',
              NombreDocumento: '',
              NumeroPlaca: 'ODS001',
              NumeroTicket: '',
              RutaDocumento: '',
              Ubigeo: {
                CodigoDistrito: '',
                CodigoDepartamento: '',
                CodigoProvincia: ''
              }
            },
            Poliza: {
              CodigoCompania: 1,
              CodigoTipoEntidad: 1,
              CodigoAgente: $scope.thirdStep.dataStepOne.Agente.CodigoAgente, // REQUERIDO
              CodigoFinanciamiento: $scope.mTipoFinanc.Codigo, // REQUERIDO
              FinVigencia: $scope.thirdStep.dataStepOne.finVigencia, // REQUERIDO
              InicioVigencia: formatDate(JSON.parse(JSON.stringify($scope.thirdStep.dataStepOne.mInicioVigencia))), // REQUERIDO
              MarcaPolizaManual: 'N',
              ModalidadPrimeraCuota: '',
              NumeroCertificadoSoat: '',
              NumeroPolizaManual: '',
              PolizaGrupo: $scope.thirdStep.dataStepOne.PolizaGrupo, // REQUERIDO
              PorcentajeDescuentoComercial: 0, // REQUERIDO
              PorcentajeDescuentoAgente: 0, // REQUERIDO
              Modalidad: {
                CodigoModalidad: $scope.thirdStep.dataStepOne.Hogar.CodigoModalidad, // REQUERIDO
                NombreModalidad: $scope.thirdStep.dataStepOne.Hogar.NombreModalidad
              }
            },
            Contratante: {
              MCAExistencia: '',
              Agente: {
                CodigoAgente: $scope.thirdStep.paramsHogarEmit.dataStepOne.Agente.CodigoAgente
              },
              ActividadEconomica: {
                Codigo: ($scope.thirdStep.paramsHogarEmit.contractorData.mActividadEconomica && $scope.thirdStep.paramsHogarEmit.contractorData.mActividadEconomica.Codigo)
                  ? $scope.thirdStep.paramsHogarEmit.contractorData.mActividadEconomica.Codigo
                  : ''
              },
              Sexo: $scope.thirdStep.paramsHogarEmit.contractorData.Sexo, // REQUERIDO
              Profesion: {
                Codigo: $scope.thirdStep.paramsHogarEmit.contractorData.mProfesion
                  ? $scope.thirdStep.paramsHogarEmit.contractorData.mProfesion.Codigo
                    ? $scope.thirdStep.paramsHogarEmit.contractorData.mProfesion.Codigo
                    : '1'
                  : '1' // REQUERIDO
              },
              ImporteAplicarMapfreDolar: $scope.mMapfreDolar ? $scope.mMapfreDolar : 0, // REQUERIDO
              FechaNacimiento: fechaNacimientoDia + '/' + fechaNacimientoMes + '/' + fechaNacimientoAño,
              CodigoAbonado: $scope.thirdStep.paramsHogarEmit.contractorData.mAbonado || '',
              Ubigeo: {
                CodigoDistrito: $scope.thirdStep.paramsHogarEmit.contractorAddressData.ubigeoData.mDistrito.Codigo, // REQUERIDO
                CodigoDepartamento:
                  $scope.thirdStep.paramsHogarEmit.contractorAddressData.ubigeoData.mDepartamento.Codigo, // REQUERIDO
                CodigoProvincia: $scope.thirdStep.paramsHogarEmit.contractorAddressData.ubigeoData.mProvincia.Codigo, // REQUERIDO
                CodigoVia: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mTipoVia.Codigo, // REQUERIDO
                NombreVia: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mNombreVia, // REQUERIDO
                CodigoNumero: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mTipoNumero.Codigo, // REQUERIDO
                TextoNumero: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mNumeroDireccion, // REQUERIDO
                CodigoInterior: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mTipoInterior.Codigo, // REQUERIDO
                TextoInterior: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mNumeroInterior, // REQUERIDO
                CodigoZona: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mTipoZona.Codigo, // REQUERIDO
                TextoZona: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mNombreZona, // REQUERIDO
                Referencia: $scope.thirdStep.paramsHogarEmit.contractorAddressData.mDirReferencias // REQUERIDO
              },
              CodigoEstadoCivil: $scope.thirdStep.paramsHogarEmit.contractorData.value
                ? $scope.thirdStep.paramsHogarEmit.contractorData.value.CodigoEstadoCivil
                : '', // REQUERIDO
              Direccion: $scope.thirdStep.paramsHogarEmit.contractorData.value
                ? $scope.thirdStep.paramsHogarEmit.contractorData.value.Direccion
                : '',
              MCAFisico: _evalMcaFisico($scope.thirdStep.paramsHogarEmit.contractorData.mNumeroDocumento), // REQUERIDO
              Nombre: $scope.thirdStep.paramsHogarEmit.contractorData.mNomContratante
                ? $scope.thirdStep.paramsHogarEmit.contractorData.mNomContratante
                : $scope.thirdStep.paramsHogarEmit.contractorData.mRazonSocial, // REQUERIDO
              ApellidoPaterno: $scope.thirdStep.paramsHogarEmit.contractorData.mApePatContratante
                ? $scope.thirdStep.paramsHogarEmit.contractorData.mApePatContratante
                : '', // REQUERIDO
              ApellidoMaterno: $scope.thirdStep.paramsHogarEmit.contractorData.mApeMatContratante
                ? $scope.thirdStep.paramsHogarEmit.contractorData.mApeMatContratante
                : '', // REQUERIDO
              TipoDocumento: $scope.thirdStep.paramsHogarEmit.contractorData.mTipoDocumento.Codigo, // REQUERIDO
              CodigoDocumento: $scope.thirdStep.paramsHogarEmit.contractorData.mNumeroDocumento, // REQUERIDO
              ImporteMapfreDolar: $scope.thirdStep.paramsHogarEmit.contractorData.SaldoMapfreDolar
                ? $scope.thirdStep.paramsHogarEmit.contractorData.SaldoMapfreDolar
                : 0,
              CorreoElectronico: $scope.thirdStep.paramsHogarEmit.contractorData.mCorreoElectronico, // REQUERIDO
              Telefono: $scope.thirdStep.paramsHogarEmit.contractorData.mTelefonoFijo, // REQUERIDO
              Telefono2: $scope.thirdStep.paramsHogarEmit.contractorData.mTelefonoCelular, // REQUERIDO
              MCAMapfreDolar: $scope.mMapfreDolar > 0 ? 'S' : 'N' // REQUERIDO
            },
            Endosatario: {
              SumaEndosatario: $scope.thirdStep.dataStepOne.Endosatario.SumaEndosatario,
              TipoDocumento: $scope.mBusquedaEndosatario == '1' ? '' : 'RUC',
              CodigoDocumento:
                $scope.mBusquedaEndosatario == '1'
                  ? ''
                  : $scope.mBusquedaEndosatario == '2'
                  ? $scope.mRucEndosatario
                  : $scope.mNombreEndosatario.Codigo
            },
            Hogar: {
              CodigoCategoria: $scope.thirdStep.dataStepOne.Hogar.CodigoCategoria,
              NombreCategoria: $scope.thirdStep.dataStepOne.Hogar.NombreCategoria,
              AnioInmueble: $scope.thirdStep.dataStepOne.Hogar.AnioInmueble, // REQUERIDO
              FlagEdificacionValor: $scope.thirdStep.dataStepOne.Hogar.FlagEdificacionValor,
              FlagContenidoValor: $scope.thirdStep.dataStepOne.Hogar.FlagContenidoValor,
              FlagContrataRobo: $scope.thirdStep.dataStepOne.Hogar.FlagContrataRobo,
              CodigoAlarmaMonitoreo: $scope.thirdStep.dataStepOne.Hogar.CodigoAlarmaMonitoreo, // REQUERIDO
              NombreAlarmaMonitoreo: $scope.thirdStep.dataStepOne.Hogar.NombreAlarmaMonitoreo,
              FlagFinanciar: $scope.thirdStep.dataStepOne.Hogar.FlagFinanciar,
              DsctoComercial: $scope.thirdStep.dataStepOne.Hogar.DsctoComercial,
              FlagTipoComunicacion: $scope.thirdStep.dataStepOne.Hogar.FlagTipoComunicacion, // REQUERIDO
              FlagAlarmaMonitoreo: $scope.thirdStep.dataStepOne.Hogar.FlagAlarmaMonitoreo, // REQUERIDO
              FlagPulsadorMedico: $scope.thirdStep.dataStepOne.Hogar.FlagPulsadorMedico, // REQUERIDO
              FlagVideoWeb: $scope.thirdStep.dataStepOne.Hogar.FlagVideoWeb, // REQUERIDO
              ImporteRecargo: $scope.thirdStep.dataStepOne.Hogar.ImporteRecargo,
              ImporteImpuesto: $scope.thirdStep.dataStepOne.Hogar.ImporteImpuesto,
              ImporteNeta: $scope.thirdStep.dataStepOne.Hogar.ImporteNeta,
              ImporteTotal: $scope.thirdStep.dataStepOne.Hogar.ImporteTotal,
              NumeroPisoPredio: $scope.thirdStep.dataStepOne.Hogar.NumeroPisoPredio, // REQUERIDO
              NumeroSotanoPredio: $scope.thirdStep.dataStepOne.Hogar.NumeroSotanoPredio, // REQUERIDO
              NombreTipoComunicacion: $scope.thirdStep.dataStepOne.Hogar.NombreTipoComunicacion,
              NombreTipoPlan: $scope.thirdStep.dataStepOne.Hogar.NombreTipoPlan,
              DireccionInmueble: $scope.thirdStep.dataStepOne.direccionInmueble,
              CodigoTipoInmueble: $scope.thirdStep.dataStepOne.tipoInmueble.Codigo,
              CodigoMaterialConstruccion: $scope.thirdStep.dataStepOne.codigoMaterial.Codigo,
              NombreMaterialConstruccion: $scope.thirdStep.dataStepOne.codigoMaterial.Descripcion,
              McaKitSmart: $scope.thirdStep.dataStepOne.Hogar.McaKitSmart,
              ProductoHogar: {
                CodigoProducto: 30
              },
              ValoresDeclarados: {
                ValorEdificacion: $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.ValorEdificacion,
                ValorContenido: $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.ValorContenido, // REQUERIDO
                ValorObjetosValiosos: $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.ValorObjetosValiosos, // REQUERIDO
                ImporteContenidoRobo: $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.ImporteContenidoRobo, // REQUERIDO
                ImporteObjetosValiososRobo:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.ImporteObjetosValiososRobo, // REQUERIDO
                FlagContrataTerremotoContenido:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataTerremotoContenido, // REQUERIDO
                FlagContrataTerremotoEdificacion:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataTerremotoEdificacion, // REQUERIDO
                FlagContrataTerremotoObjetosValiosos:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataTerremotoObjetosValiosos, // REQUERIDO
                FlagContrataIncendioContenido:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataIncendioContenido,
                FlagContrataIncendioEdificacion:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataIncendioEdificacion,
                FlagContrataIncendioObjetosValiosos:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataIncendioObjetosValiosos,
                FlagContrataRoboContenido:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataRoboContenido,
                FlagContrataRoboObjetosValiosos:
                  $scope.thirdStep.dataStepOne.Hogar.ValoresDeclarados.FlagContrataRoboObjetosValiosos
              },
              CoberturaAdicional: {
                DesaparicionMisteriosa: $scope.thirdStep.dataStepOne.Hogar.CoberturaAdicional.DesaparicionMisteriosa, // REQUERIDO
                DeshonestidadEmpleado: $scope.thirdStep.dataStepOne.Hogar.CoberturaAdicional.DeshonestidadEmpleado // REQUERIDO
              }
            }
          };

          $scope.frmThirdStep.markAsPristine();

          if ($scope.frmThirdStep.$valid) {
            if (!$scope.montoValido) {
              $scope.thirdStep.paramsHogarEmit.dataStepOne.financiamiento = $scope.mTipoFinanc;
              $scope.thirdStep.paramsHogarEmit.dataStepOne.Endosatario = {
                TipoDocumento: $scope.mBusquedaEndosatario == '1' ? '' : 'RUC',
                CodigoDocumento:
                  $scope.mBusquedaEndosatario == '1'
                    ? ''
                    : $scope.mBusquedaEndosatario == '2'
                    ? $scope.mRucEndosatario
                    : $scope.mNombreEndosatario.Codigo
              };

              requestEmit = polizasFactory.setReferidoNumber(requestEmit);
              hogarFactory.saveEmission(requestEmit, true).then(function(response) {
                if (response.OperationCode == constants.operationCode.success) {
                  var NumeroDocumento = response.Data.Documento.NumeroDocumento;
                  if($scope.encuesta.mostrar == 1){
                    $scope.encuesta.numOperacion = NumeroDocumento;
                    $state.go('hogarEmittResumen', {numDocument: NumeroDocumento, encuesta: $scope.encuesta});
                  }else{
                    $state.go('hogarEmittResumen', {
                      numDocument: NumeroDocumento
                    });
                  }
                } else {
                  mModalAlert.showInfo('', response.Message);
                }
              });
            }
          }
        };
      }
    ]);
  }
);
