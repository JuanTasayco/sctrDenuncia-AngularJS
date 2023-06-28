define([
  'angular', 'constants', 'constantsVidaLey'
], function (angular, constants, constantsVidaLey) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('cotizacionResultadosVidaLeyController', CotizacionResultadosVidaLeyController);

  CotizacionResultadosVidaLeyController.$inject = ['$state', 'mModalAlert', 'vidaLeyService', 'vidaLeyFactory', 'vidaLeyGeneralFactory', '$window', '$timeout', '$scope', '$q', 'oimClaims', 'oimPrincipal', 'proxySctr', 'proxyGeneral', '$uibModal', '$sce'];

  function CotizacionResultadosVidaLeyController($state, mModalAlert, vidaLeyService, vidaLeyFactory, vidaLeyGeneralFactory, $window, $timeout, $scope, $q, oimClaims, oimPrincipal, proxySctr, proxyGeneral, $uibModal, $sce) {
    var vm = this;

    vm.cotizacion = {};
    vm.currency = constantsVidaLey.SIMBOLO_MONEDA;
    vm.viewGuardarCotizacion = true;
    vm.currentStep = null;
    vm.hideButtonAjustRequest = true;

    vm.grabarCotizacionResultados = GrabarCotizacionResultados;
    vm.solicitarEvaluacionTasa = SolicitarEvaluacionTasa;
    vm.rechazarTasa = RechazarTasa;
    vm.rechazarSolicitud = RechazarSolicitud;
    vm.aceptarSolicitud = AceptarSolicitud;
    vm.roundTasa = RoundTasa;
    vm.isAgent = isAgent;
    vm.isSuscriptor = isSuscriptor;
    vm.esSolicitudAtendida = esSolicitudAtendida;
    vm.esNuevaSolicitud = esNuevaSolicitud;

    $scope.encuesta = {};
    $scope.encuesta.mostrar = 0;

    (function load_CotizacionResultadosVidaLeyController() {

      if (!vidaLeyFactory.cotizacion.step['2'] || !vidaLeyFactory.cotizacion.step['3']) {
        $state.go('.', { step: 3 });
        return;
      }
      vm.getTotalTrabajadores = GetTotalTrabajadores;
      vm.getTotalPlanilla = GetTotalPlanilla;
      vm.currentStep = $state.params.step;
      vm.cotizacion = vidaLeyFactory.cotizacion;
      vm.rol = vidaLeyFactory.getCurrentUserPermissions(oimClaims.rolesCode);
      vm.clausulaAutomatica = vidaLeyFactory.getClausulaAutomatica();

      if (vm.clausulaAutomatica === '') {
        if (vm.cotizacion.responseContratante) {
          vm.clausulaAutomatica = vm.cotizacion.responseContratante.actividad;
        }
      }

      if (vm.cotizacion && vm.cotizacion.numDoc) {
          listarMensajes();
        if (vm.cotizacion.codEstado) {
          _getRiesgosCotizacion(vm.cotizacion.numDoc);
          _getActivity(vm.cotizacion.codActividad);
        }
      }

      if (vm.cotizacion.responseContratante && vm.cotizacion.responseContratante.actividad.tipActividad === "S") {
        vm.showButton = false;
        vm.isActivityManaged = true;
        if (isAgent() && vm.cotizacion.codEstado !== 'SR' && vm.cotizacion.codEstado !== 'SA') {
          _showModalActividadGestionada(true);
        }
      }

      consultarTipoCliente();

      // Si es agente
      if (isAgent()) {
        // Si ya el adm o sus acepto o rechazo la cotizacion)
        if (vm.cotizacion.codEstado === 'SR' || vm.cotizacion.codEstado === 'SA' || vm.cotizacion.codEstado === 'AC') {
          //Llamamos a GetParametrosCalcularPrima con la tasa en undefined
          getCotizarPrimas();
        } else {
          if (isActivityManaged() || isDeficitClient()) {
            //No Llamamos a GetParametrosCalcularPrima pero mostramos el modal _showModalActividadGestionada
            if (isActivityManaged()) {
              _showModalActividadGestionada(true);
            } else {
              _showModalActividadGestionada(false);
            }
          } else {
            //Llamamos a GetParametrosCalcularPrima con la tasa en undefined
            getCotizarPrimas();
          }
        }
      }

      // Si es adm o sus
      if (isSuscriptor()) {
        // Tiene actividad gestionada o cliente deficitario
        if (isActivityManaged() || isDeficitClient()) {
          //No Llamamos a GetParametrosCalcularPrima
          // Modificamos la llamada al servicio con codigo estado SA con la tasa que ingresa el suscriptor, para que invoque el servicio GetParametrosCalcularPrima con POST
          vm.flujoAlternoSuscriptor = true;
        } else {
          //Llamamos a GetParametrosCalcularPrima con la tasa en undefined
          getCotizarPrimas();
        }
      }
      _showButtonAjustRequest();
    })();

    function getCotizarPrimas() {
      if (vidaLeyFactory.validStepResultados()) {
        $timeout(function () {          
          if (vm.cotizacion && vm.cotizacion.codEstado != "SA" && (vm.cotizacion.codEstado != "ST" ||vm.cotizacion.codEstado == "ST" && vm.cotizacion.NumCotizacion == null)) {
            vidaLeyService.getCotizarPrimas(vidaLeyFactory.getParametrosCalcularPrima())
              .then(function (response) {
                vm.showButton = true;
                vm.NumCotizacion = response.Cotizacion.NumCotizacion;
                if (response.CodError === '0') {
                  vm.riesgosDesglose = response.Cotizacion.RiesgosDesglose;
                }
                if (vm.COTI_NRO_ASEGURADOS && vm.totalTrabajadores < parseInt(vm.COTI_NRO_ASEGURADOS[0].ValTexto)) {
                  vm.hideButtonAjustRequest = false;
                }
                vm.viewGuardarCotizacion = response.CodError === '0' || (response.CodError === '9' && vm.cotizacion.codEstado === 'SA') || (vm.isActivityManaged && vm.cotizacion.codEstado === 'SA');
                if (!!response.DescError && response.CodError !== '0' && response.CodError !== '9') {
                  mModalAlert.showError(response.DescError, "Error")
                }
                if (!!response.DescError && response.CodError === '9' && vm.cotizacion.codEstado === 'SO') {
                  mModalAlert.showError(response.DescError, "Error")
                }
                if (response.CodError === '0') {
                  vm.riesgos = response.Cotizacion.RiesgosDesglose;
                  vidaLeyFactory.setCalcularPrima(response);
                }
              }, function (error) {
              });
          }else {
            vm.showButton = true;
            if (vm.COTI_NRO_ASEGURADOS && vm.totalTrabajadores < parseInt(vm.COTI_NRO_ASEGURADOS[0].ValTexto)) {
              vm.hideButtonAjustRequest = false;
            }
          }
        }, 1000);
      }
    }

    function consultarTipoCliente() {
      var params = {
        'codigoAplicacion': 'EMISA',
        "TipoRol": vidaLeyFactory.getUserActualRole(),
        "tipoValidacion": []
      };

      if(vm.cotizacion && vm.cotizacion.codEstado === 'AC') {
        params.tipoValidacion = ["CVS", "CVA"]
      }

      vidaLeyService.isDeficit(vm.cotizacion.contratante.tipoDocumento + '-' + vm.cotizacion.contratante.numeroDocumento, params)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            if (response.Data.Codigo === '9834') {
              vm.showButton = false;
              vm.isDeficitClient = true;
              if (isAgent() && vm.cotizacion.codEstado !== 'SR' && vm.cotizacion.codEstado !== 'SA') {
                _showModalActividadGestionada(false);
              }
            }
          }
        })
        .catch(function (error) {
          return false;
        });
    }

    function isAgent() {
      return vm.rol === "AGT" || vm.rol === "EAC" || vm.rol === "BRK" || (vm.rol === "ADM" && vm.cotizacion.codEstado !== "ST");
    }

    function isSuscriptor() {
      return vm.rol === "SUS" || (vm.rol === "ADM" && vm.cotizacion.codEstado === "ST");
    }

    function esSolicitudAtendida() {
      return vm.cotizacion.codEstado === "SA";
    }

    function esNuevaSolicitud() {
      return vm.cotizacion.codEstado === "SO";
    }

    function GrabarCotizacionResultados() {
      if (vidaLeyFactory.validStepResultados()) {
        _isFraudulent();
      }
    }

    function SolicitarEvaluacionTasa() {
      if (vidaLeyFactory.validStepResultados()) {
        vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.SOLICITUDTASA, vidaLeyFactory.getParametrosGrabarCotizacion("ST"))
          .then(function (response) {
            vidaLeyFactory.clearCotizacion();
            mModalAlert.showInfo("Se ha enviado la solicitud a evaluación", "EVALUACIÓN DE TASA").then(
              function () {
                $state.go("homePolizaVidaLey");
              }
            );
          })
          .catch(function (error) {
            mModalAlert.showError(error.Message, "¡Error!")
          });
      }
    }

    function RechazarTasa() {
      if (vidaLeyFactory.validStepResultados()) {
        vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.RECHAZARTASA, vidaLeyFactory.getParametrosGrabarCotizacion("CR"))
          .then(function (response) {
            vidaLeyFactory.clearCotizacion();
            mModalAlert.showInfo("Se ha rechazado la tasa", "COTIZACION RECHAZADA").then(
              function () {
                $state.go("homePolizaVidaLey");
              }
            );
          })
          .catch(function (error) {
            mModalAlert.showError(error.Message, "¡Error!")
          });
      }
    }

    function RechazarSolicitud() {
      if (vidaLeyFactory.validStepResultados()) {
        vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.RECHAZARSOLICITUD, vidaLeyFactory.getParametrosSolicitudRechazada('SR'))
          .then(function (response) {
            vidaLeyFactory.clearCotizacion();
            mModalAlert.showInfo("Se ha rechazado la solicitud", "COTIZACION RECHAZADA").then(
              function () {
                $state.go("homePolizaVidaLey");
              }
            );
          })
          .catch(function (error) {
            mModalAlert.showError(error.Message, "¡Error!")
          });
      }
    }

    function AceptarSolicitud() {
      if (vidaLeyFactory.validStepResultados() && _validationForm()) {
        (isActivityManaged() || isDeficitClient()) ? _reCalcularPrimaFlujoAlterno() : _reCalcularPrima();
      }
    }

    function _reCalcularPrimaFlujoAlterno() {
      vidaLeyService.getCotizarPrimas(vidaLeyFactory.getParametrosCalcularPrimaFlujoAlterno(vm.riesgos))
        .then(function (response) {
          if (response.CodError === '0') {
            vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.ACEPTARSOLICITUD, vidaLeyFactory.getParametrosSolicitudAceptada('SA', vm.clausulaManual, vm.riesgos, response.Cotizacion.NumCotizacion))
              .then(function (response) {
                vidaLeyFactory.clearCotizacion();
                mModalAlert.showInfo("Se ha aceptado la solicitud", "COTIZACION ACEPTADA").then(
                  function () {
                    $state.go("homePolizaVidaLey");
                  }
                );
              })
              .catch(function (error) {
                mModalAlert.showError(error.Message, "¡Error!")
              });
          } else {
            mModalAlert.showError(response.DescError, "¡Error!")
          }
          if (!!response.DescError && response.CodError === '1') {
            mModalAlert.showError(response.DescError, "¡Error!")
          }
        });
    }

    function _reCalcularPrima() {
      vidaLeyService.recalcularPrimas(vm.cotizacion.numDoc, vidaLeyFactory.getParametrosReCalcularPrima(vm.NumCotizacion, vm.riesgos))
        .then(function (response) {
          vm.viewGuardarCotizacion = response.CodError === '0';
          if (!!response.DescError && response.CodError !== '0') {
            mModalAlert.showError(response.DescError, "¡Error!")
          }
          if (response.CodError === '0') {
            vidaLeyFactory.setCalcularPrima(response);
            vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.ACEPTARSOLICITUD, vidaLeyFactory.getParametrosSolicitudAceptada2('SA', vm.clausulaManual, vm.riesgos, vm.NumCotizacion, response.Cotizacion.ConceptosDesglose.ImpPneta))
              .then(function (response) {
                vidaLeyFactory.clearCotizacion();
                mModalAlert.showInfo("Se ha aceptado la solicitud", "COTIZACION ACEPTADA").then(
                  function () {
                    $state.go("homePolizaVidaLey");
                  }
                );
              })
              .catch(function (error) {
                mModalAlert.showError(error.Message, "¡Error!")
              });
          }
        });
    }

   getEncuesta();

    function getEncuesta() {
      var codCia = constants.module.polizas.vidaLey.companyCode;
      var codeRamo = constants.module.polizas.vidaLey.codeRamo;

      try {
        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function (response) {
          if (response.OperationCode == constants.operationCode.success) {
            if (Object.keys(response.Data.Pregunta).length > 0) {
              $scope.encuesta = response.Data;
              $scope.encuesta.CodigoCompania = codCia;
              $scope.encuesta.CodigoRamo = codeRamo;
            } else {
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
          }
        }, function (error) {

        })
      } catch (e) {
        console.error('Error en getEncuesta: ' + e);
      }
    }

    function GetTotalTrabajadores() {
      if (vm.riesgos) {
        vm.totalTrabajadores = vm.riesgos
          .reduce(function (total, riesgo) {
            if (riesgo.CantTrabajadores) {
              return total + riesgo.CantTrabajadores;
            }
            return total + riesgo.NumAsegurados;
          }, 0) || 0;

        return vm.totalTrabajadores;
      } else {
        return 0;
      }
    }

    function GetTotalPlanilla() {
      if (vm.riesgos) {
        return vm.riesgos
          .reduce(function (total, riesgo) {
            if (riesgo.ImportePlanillaTopado) {
              return total + riesgo.ImportePlanillaTopado;
            }
            if (riesgo.ImportePlanilla) {
              return total + riesgo.ImportePlanilla;
            }            
            if (riesgo.ImportePlanillaReal) {
              return total + riesgo.ImportePlanillaReal;
            }
            return total + riesgo.ImpPlanilla;
          }, 0) || 0;
      } else {
        return 0;
      }
    }

    function RoundTasa(tasa) {
      return vidaLeyGeneralFactory.roundUp(tasa);
    }

    $scope.uploadFile = function () {
      $scope.mAgente = '0';
      if (!$scope.mComment) return;

      var file = null;

      if (!(typeof $scope.myFile == 'undefined')) {
        file = $scope.myFile;

      }

      if (!(typeof $scope.mComment == 'undefined')) {

        var paramsFile = {
          numeroSolicitud: vm.cotizacion.numDoc,
          rolOrigen: oimPrincipal.get_role('EMISAVIDALEY'),
          usuarioOrigen: oimClaims.loginUserName.toUpperCase(),
          usuarioDestino: oimClaims.loginUserName.toUpperCase(),
          asunto: 'MESSAGE: ' + new Date(),
          mensaje: $scope.mComment
        };

        vidaLeyService.uploadFileToUrl(file, paramsFile);
        $timeout(function () {
          listarMensajes();
          $scope.mComment = '';
          $scope.myFile = undefined;
        }, 2000);
      }

    };

    $scope.deleteFile = function (index) {
      $scope.myFile = $.map($scope.myFile, function (myFile) { return myFile; })

      if ((index) > -1) {
        $scope.myFile.splice((index), 1);
      }
    }

    $scope.getAdjunto = function (adjunto) {
      $scope.adjData = {
        NumeroSolicitud: parseInt(vm.cotizacion.numDoc),
        ArchivoAdjunto: adjunto
      };
      $window.setTimeout(function () {
        document.getElementById('frmDownloadADJ').submit();
      });
    }

    $scope.adjURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/mensaje/archivo');

    function runIntoPromise(action) {
      var defferd = $q.defer();
      if (angular.isFunction(action))
        action(defferd);
      return defferd.promise;
    }
    function listarMensajes() {
      return runIntoPromise(function (deffer) {
        if (!vm.cotizacion.numDoc) return $q.resolve({})
        proxySctr.GetListMensaje(vm.cotizacion.numDoc, true).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            $scope.mensajes = response.Data;
            $scope.chatNumber = $scope.mensajes.length;
          }
          deffer.resolve(response);
        }, function (response) {
          deffer.reject(response);
        });
      })
    }

    function _isFraudulent() {
      var params = {
        "codigoAplicacion": "EMISA",
        "TipoRol": vidaLeyFactory.getUserActualRole(),
        "tipoValidacion": []
      };
      
      if(vm.cotizacion && vm.cotizacion.codEstado === 'AC') {
        params.tipoValidacion = ["CVS", "CVA"]
      }

      vidaLeyService.validacionContratante(vm.cotizacion.contratante.tipoDocumento + '-' + vm.cotizacion.contratante.numeroDocumento, params)
        .then(function (response) {

          if (response.OperationCode === constants.operationCode.success) {
            if (response.Data.Codigo === '43') {
              mModalAlert.showWarning('', response.Data.Mensaje)
                .then(function () {
                  $state.go('homePolizaVidaLey');
                })
            } else {
              continueConfirmation();
            }
          }

        })
        .catch(function (error) {

        });
    }

    function continueConfirmation() {
      vidaLeyService.grabarCotizacion(constantsVidaLey.STEPS.COTIZACION.RESULTADOS, vidaLeyFactory.getParametrosGrabarCotizacion("RE", vm.NumCotizacion || vm.cotizacion.NumCotizacion))
        .then(function (response) {
          vidaLeyFactory.clearCotizacion();

          if ($scope.encuesta && $scope.encuesta.mostrar == 1) {
            $scope.encuesta.numOperacion = response.NumDoc;
            $state.go(constantsVidaLey.ROUTES.RESUMEN.url, { documentoId: response.NumDoc, encuesta: $scope.encuesta });
          } else {
            $state.go(constantsVidaLey.ROUTES.RESUMEN.url, { documentoId: response.NumDoc });
          }
        })
        .catch(function (error) {
          mModalAlert.showError(error.Message, "¡Error!")
        });
    }

    function _getRiesgosCotizacion(documentId) {
      vidaLeyService.getCotizacion(documentId)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.NumCotizacion = response.Data.Principal.NumCotizacion || vm.NumCotizacion;
            vm.cotizacion.totalPrimaNeta = response.Data.Principal.PrimaNeta;
            vm.cotizacion.codEstado = response.Data.Principal.CodEstado || vm.cotizacion.codEstado;
            vidaLeyFactory.cotizacion.NumCotizacion = vm.NumCotizacion
            vidaLeyFactory.cotizacion.totalPrimaNeta = vm.cotizacion.totalPrimaNeta
            vm.riesgos = response.Data.Riesgos;
          }
        });
    }

    function _showModalActividadGestionada(isActividadGestionada) {
      $scope.dataConfirmation = {
        save: false,
        title: 'La solicitud de cotización requiere una evaluación del suscriptor, ¿desea solicitar la evaluación de tasa?',
        subTitle: '',
        lblClose: 'No',
        lblSave: 'Si'
      };
      if (isActividadGestionada) {
        $scope.dataConfirmation.title = 'La solicitud de cotización requiere una evaluación del suscriptor por la actividad económica. ¿Desea solicitar la evaluación de tasa ?'
      } else {
        $scope.dataConfirmation.title = 'La solicitud de cotización requiere una evaluación del suscriptor porque el cliente presenta riesgos. ¿Desea solicitar la evaluación de tasa ? ';
      }

      var vModalSteps = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalSteps.result.then(function () {
        var dataConfirmationWatch = $scope.$watch('dataConfirmation', function (value) {
          if (value.save) {
            SolicitarEvaluacionTasa();
          } else {
            $state.go('homePolizaVidaLey');
          }
        });
        $scope.$on('$destroy', function () { dataConfirmationWatch(); });
      }, function () { });

    }

    function _showButtonAjustRequest() {
      if (isAgent()) {
        vidaLeyService.getListParametros()
          .then(function (response) {
            vm.COTI_NRO_ASEGURADOS = response.filter(function (item) {
              return item.CodTexto === constantsVidaLey.PARAMETERS.COTI_NRO_ASEGURADOS
            });

            if (GetTotalTrabajadores() < parseInt(vm.COTI_NRO_ASEGURADOS[0].ValTexto)) {
              vm.hideButtonAjustRequest = false;
            }
          })
          .catch(function (error) {
            mModalAlert.showError(error, "¡Error!")
          });
      }
    }

    function _getActivity(actividad) {
      vm.agente = vidaLeyFactory.cotizacion.modelo.agente;
      vidaLeyService.getListActividadesEconomicas(actividad, '', '',parseInt(vm.agente.codigoAgente), 1, 20, true)
        .then(function (response) {
          if (response.Data && response.Data.ListActEconomica) {
            if (response.Data.ListActEconomica[0].TipActividad === "S") {
              vm.showButton = false;
              vm.isActivityManaged = true;
              if (isAgent() && vm.cotizacion.codEstado !== 'SR' && vm.cotizacion.codEstado !== 'SA') {
                _showModalActividadGestionada(true);
              }
            }
          }
        });
    }

    function isActivityManaged() {
      return vm.isActivityManaged;
    }

    function isDeficitClient() {
      return vm.isDeficitClient;
    }

    function _validationForm() {
      $scope.frmSecondStep.markAsPristine();
      return $scope.frmSecondStep.$valid;
    }
    vm.formHasError = function (value) {
      return !_.isEmpty(value);
    }

  }

});
