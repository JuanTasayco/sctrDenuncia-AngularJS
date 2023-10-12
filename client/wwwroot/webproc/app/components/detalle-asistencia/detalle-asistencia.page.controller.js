'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'helper', 'wpConstant'], function(
  ng,
  _,
  AsistenciaActions,
  helper,
  wpConstant
) {
  DetalleAsistenciaPageController.$inject = [
    '$interval',
    '$log',
    '$scope',
    '$state',
    '$timeout',
    '$uibModal',
    'dataAsistencia',
    'lookups',
    'carTypes',
    'carBrands',
    'carTypesUse',
    'nivelDanho',
    'tipoDanho',
    'talleres',
    'wpFactory',
    '$ngRedux',
    'mModalAlert'
  ];
  function DetalleAsistenciaPageController(
    $interval,
    $log,
    $scope,
    $state,
    $timeout,
    $uibModal,
    dataAsistencia,
    lookups,
    carTypes,
    carBrands,
    carTypesUse,
    nivelDanho,
    tipoDanho,
    talleres,
    wpFactory,
    $ngRedux,
    mModalAlert
  ) {
    var vm = this;
    var saveIntervalPromise, actionsRedux, oldFrm, idMongo, fromNewToPendiente;
    var frmInvestigacion = {};
    var canSaveAgain = true;
    var firstAutoSave = true;
    vm.$onInit = onInit;
    vm.anular = anular;
    vm.desestimar = desestimar;
    vm.guardar = guardar;
    vm.autoSave = autoSave;
    vm.investigar = investigar;
    vm.terminar = terminar;

    // declaracion

    // TIP: vm.$onDestroy no es lanzado.
    // más info: https://github.com/angular/angular.js/issues/15073
    $scope.$on('$destroy', function sod() {
      vm.rdxExitAssistance();
      $interval.cancel(saveIntervalPromise);
      actionsRedux();
    });

    function onInit() {
      var statusGeneral = {};
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      wpFactory.setNroAsistencia(+$state.params.nroAsistencia);
      var ultimaDataDeAsistencia = _getDataAsistencia();
      wpFactory.setSiniestroNro(ultimaDataDeAsistencia.codigoSiniestro);
      vm.infoAsistencia = _.assign({}, ng.copy($state.params), {
        codigoSiniestro: ultimaDataDeAsistencia.codigoSiniestro,
        numeroPoliza: ultimaDataDeAsistencia.numeroPoliza,
        estadoSiniestro: ultimaDataDeAsistencia.estadoSiniestro,
        role: wpFactory.getRole().roleCode
      });
      vm.autoSaveStatus = {
        isSaving: false,
        isSaved: false
      };
      vm.rdxDetalleUpdate(ultimaDataDeAsistencia);
      _setBlockByState();

      $timeout(function() {
        // seteamos el oldFrm luego que los combos se hayan formateado. Asi no lanzara el autosave antes
        oldFrm = wpFactory.help.buildReq(vm.detalleAsistencia);
      }, 2000);

      // solo mongo manda el campo statusInfo
      if (vm.detalleAsistencia.statusInfo) {
        if (ng.isUndefined(vm.detalleAsistencia.statusInfo.general)) {
          statusGeneral = {general: wpFactory.validFrmGeneral(vm.detalleAsistencia)};
        }
      } else {
        statusGeneral = {general: wpFactory.validFrmGeneral(vm.detalleAsistencia)};
      }
      if (_isPendienteOrGenerado()) {
        statusGeneral = ng.extend({}, statusGeneral, {
          conductor: wpFactory.validFrmConductor(vm.detalleAsistencia),
          vehiculo: wpFactory.validFrmVehiculo(vm.detalleAsistencia),
          siniestro: wpFactory.validFrmSiniestro(vm.detalleAsistencia)
        });
        vm.rdxFrmRequire(true);
      }

      vm.rdxFrmsValidate(ng.extend({}, vm.detalleAsistencia.statusInfo, statusGeneral));
      _setLookups();
      _isPendienteOrAbierto();
    }

    function mapStateToThis(state) {
      return {
        detalleAsistencia: _.merge({}, state.detalle),
        frmStatus: state.frmStatus,
        frmsValidationStates: state.frmsValidationStates,
        isFrmRequire: state.frmStatus.require
      };
    }

    function _setBlockByState() {
      if (/generado/i.test(vm.detalleAsistencia.estadoSiniestro)) {
        vm.rdxBlockByGenerado(true);
      } else if (/anulado/i.test(vm.detalleAsistencia.estadoSiniestro)) {
        vm.rdxBlockByAnulado(true);
      }
    }

    function _isPendienteOrAbierto() {
      return (
        /pendiente/i.test(vm.detalleAsistencia.estadoSiniestro) || /abierto/i.test(vm.detalleAsistencia.estadoSiniestro)
      );
    }

    function _isDifferentToPendiente() {
      return !/pendiente/i.test(vm.detalleAsistencia.estadoSiniestro);
    }

    function _isPendienteOrGenerado() {
      return (
        /pendiente/i.test(vm.detalleAsistencia.estadoSiniestro) ||
        /generado/i.test(vm.detalleAsistencia.estadoSiniestro)
      );
    }

    function _getDataAsistencia() {
      if (/ABIERTO/i.test(dataAsistencia.estadoSiniestro) && !+dataAsistencia.codigoTipoSiniestro) {
        dataAsistencia.codigoTipoSiniestro = 2;
      }
      if (vm.infoAsistencia !=null)
      dataAsistencia.codigoSiniestro =vm.infoAsistencia.codigoSiniestro;

      dataAsistencia.codigoTipoVia = dataAsistencia.codigoTipoVia && dataAsistencia.codigoTipoVia.trim();
      // HACK: seteo de obj conductor para que mongo no lance error y tab conductor
      _.keys(dataAsistencia.conductor).length || (dataAsistencia.conductor = {});
      dataAsistencia.conductor.edadCondutor =
        dataAsistencia.conductor.edadCondutor ||
        wpFactory.help.calcularEdad(dataAsistencia.conductor.fchNacimientoConductor);
      if (ng.isUndefined(dataAsistencia.conductor.codigoLesionConductor)) {
        dataAsistencia.conductor.codigoLesionConductor = 0;
      }
      if (dataAsistencia.statusInfo) {
        dataAsistencia.statusInfo = wpFactory.help.convertStringToBoolean(dataAsistencia.statusInfo);
      }
      dataAsistencia.numeroDocumentoCliente = dataAsistencia.numeroDocumentoCliente || 1;
      ng.isUndefined(dataAsistencia.codigoRelacionAsegurado) && (dataAsistencia.codigoRelacionAsegurado = '0');
      if (helper.hasPath(dataAsistencia, 'conductor.dniConductor')) {
        dataAsistencia.conductor.dniConductor = wpFactory.help.padLeft(dataAsistencia.conductor.dniConductor, 8);
      }

      if (dataAsistencia.peatonesTercero && dataAsistencia.peatonesTercero.length) {
        dataAsistencia.peatonesTercero = _.map(dataAsistencia.peatonesTercero, function mpF(item) {
          var newDni = item.dniPeaton ? wpFactory.help.padLeft(item.dniPeaton, 8) : {};
          return ng.extend({}, item, newDni);
        });
      }

      if (dataAsistencia.conductorTercero && dataAsistencia.conductorTercero.length) {
        dataAsistencia.conductorTercero = _.map(dataAsistencia.conductorTercero, function mpF(item) {
          var currentDni = item.ocupanteTercero && item.ocupanteTercero.dniConductor;
          var newDni = currentDni ? wpFactory.help.padLeft(currentDni, 8) : {};
          return ng.extend({}, item, newDni);
        });
      }

      return _.merge({}, wpFactory.help.getObjWithHoursFormat5Characters(dataAsistencia), {
        codigoInterno: wpFactory.getNroAsistencia(),
        estadoSiniestro: dataAsistencia.estadoSiniestro || 'ABIERTO',
        usuarioRegistro: wpFactory.getCurrentUser().loginUserName
      });
    }

    function _setLookups() {
      wpFactory.myLookup.setLookups(lookups);
      wpFactory.myLookup.setCarTypes(carTypes);
      wpFactory.myLookup.setCarTypesUse(carTypesUse);
      wpFactory.myLookup.setCarBrands(carBrands);
      wpFactory.myLookup.setNivelDanho(nivelDanho);
      wpFactory.myLookup.setTipoDanho(tipoDanho);
      wpFactory.myLookup.setTalleres(talleres);
    }

    function _updateOldFrm() {
      oldFrm = wpFactory.help.buildReq(vm.detalleAsistencia);
    }

    function autoSave() {
        var request = wpFactory.help.buildReq(vm.detalleAsistencia);
        if (canSaveAgain && wpFactory.help.isObjDifferent(oldFrm, request)) {
          oldFrm = ng.copy(request);
          _showMsgAutoSaveSaving();
          fireAutoSave(request);
        }
    }

    function _offAutoSave() {
      canSaveAgain = false;
    }

    function _onAutoSave() {
      canSaveAgain = true;
    }

    function fireAutoSave(frm) {
      if (!canSaveAgain) {
        return void 0;
      }
      _offAutoSave();
      var dataAutoSave = {
        autoGuardado: true,
        currentUser: wpFactory.getCurrentUser().loginUserName,
        statusInfo: vm.frmsValidationStates
      };
      idMongo && (dataAutoSave._id = idMongo);
      fromNewToPendiente && (dataAutoSave.estadoSiniestro = 'PENDIENTE');
      if(vm.infoAsistencia != null && frm.codigoSiniestro == 0) frm.codigoSiniestro = vm.infoAsistencia.codigoSiniestro;

      var detalleAsistencia = _.merge({}, frm, dataAutoSave);
      wpFactory.siniestro
        .Save(detalleAsistencia, false)
        .then(function asRPrFn(resp) {
          if (_isBlockedByOtherUser(detalleAsistencia, resp)) {
            vm.autoSaveStatus.isSaving = false;
            vm.infoAsistencia.userForeign = resp.data;
            _showMsgAutoSaveOverwrite();
            return void 0;
          }
          vm.autoSaveStatus.isSaving = false;
          vm.autoSaveStatus.isSaved = true;
          _onAutoSave();
          firstAutoSave && resp.data !== '000' && (idMongo = resp.data);
          firstAutoSave = false;
          _showMsgAutoSaveCompleted();
        })
        .catch(function asEPrFn(err) {
          _onAutoSave();
          vm.autoSaveStatus.isSaving = false;
          vm.autoSaveStatus.isSaved = false;
          $log.error('Falló el Autosave', err.data.message);
        });
    }

    function _updateFrmOld(request) {
      if (wpFactory.help.isObjDifferent(oldFrm, request)) {
        oldFrm = ng.copy(request);
      }
    }

    function _buildReqSave(obj) {
      obj = obj || {};
      var request = wpFactory.help.buildReq(vm.detalleAsistencia);

      return ng.extend({}, request, obj, {
        autoGuardado: false,
        _id: vm.detalleAsistencia._id || idMongo
      });
    }

    function _isBlockedByOtherUser(asistencia, resp) {
      return (
        asistencia._id &&
        resp.data !== '000' &&
        resp.data.toUpperCase() !== wpFactory.getCurrentUser().loginUserName.toUpperCase()
      );
    }

    function _showMsgAutoSaveSaving() {
      vm.autoSaveStatus.isSaving = true;
      vm.autoSaveStatus.txt = 'Guardando borrador...';
      vm.autoSaveStatus.icoCls = 'is-saving ico-mapfre_183_refresh';
    }

    function _showMsgAutoSaveCompleted() {
      if (vm.autoSaveStatus.isSaved) {
        vm.autoSaveStatus.txt = 'Cambios autoguardados';
        vm.autoSaveStatus.icoCls = 'is-saved ico-mapfre_184_circleCheck';
        $timeout(function() {
          vm.autoSaveStatus.isSaved = false;
        }, 2000);
      }
    }

    function _showMsgAutoSaveOverwrite() {
      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Continuar',
        subtitulo: 'Esta asistencia está siendo editada por <b>' + vm.infoAsistencia.userForeign + '</b>',
        titulo: '¿Está seguro de sobreescribir los cambios?'
      };

      _showModalConfirm(textos)
        .result.then(function caScFn() {
          vm.infoAsistencia.userForeign = null;
          _onAutoSave();
          fireAutoSave(ng.extend({}, oldFrm, {overWrite: true}));
        })
        .catch(function smcCPr() {
          mModalAlert.showWarning(
            'Para poder volver a editar, vuelva a consultar la asistencia',
            'Asistencia bloqueada'
          );
        });
    }

    function _goBandejaWithNroAsistencia() {
      $state.go('bandeja', {assistanceNumber: wpFactory.getNroAsistencia()});
    }

    function _getIncompleteFrms(objFrm) {
      var frmsToComplete = {};
      _.each(objFrm, function mfvs(value, key) {
        value || (frmsToComplete[key] = value);
      });

      return frmsToComplete;
    }

    function _isFrmInvalid(objValidationStateFrm) {
      return _.some(objValidationStateFrm, function(status) {
        return status === false;
      });
    }

    function _showGoModalIncompleteFrm(incompleteFrms) {
      mModalAlert
        .showWarning(
          'Verifica que hayas completado los campos obligatorios de: ' + _.keys(incompleteFrms).join(', '),
          'Falta completar'
        )
        .then(function msGuardarPr() {
          var currentState = $state.current.name;
          var beInCurrentState = _.some(_.keys(incompleteFrms), function(item) {
            return _.contains(currentState, item);
          });
          beInCurrentState || $state.go('detalleAsistencia.' + _.keys(incompleteFrms)[0]);
        });
    }

    function anular() {
      _offAutoSave();
      vm.rdxFrmRequire(true);
      if (!_isPendienteOrGenerado()) {
        _onAutoSave();
        return void mModalAlert.showWarning(
          'El estado de la asistencia debe estar en PENDIENTE o GENERADO.',
          'Aún no se puede Anular'
        );
      }

      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Anular',
        subtitulo: 'Los cambios se guardarán en el sistema y se anulará la asistencia',
        titulo: '¿Está seguro de Anular la Asistencia?'
      };

      var request = _buildReqSave({estadoSiniestro: 'ANULADO'});

      _showModalConfirm(textos)
        .result.then(function caScFn() {
          // TODO: validar q validacion hay en la antigua
          if (!vm.frmsValidationStates.general) {
            _onAutoSave();
            return void mModalAlert.showWarning('Los campos de Datos Generales son obligatorios', 'Falta completar');
          }

          wpFactory.siniestro
            .Save(request, true)
            .then(function aSPr() {
              mModalAlert.showSuccess('Realizado con éxito', 'Asistencia Anulada').then(function msAnularPr() {
                _goBandejaWithNroAsistencia();
              });
            })
            .catch(function aEPr(err) {
              _onAutoSave();
              mModalAlert.showError('Ocurrió un error al anular', 'Error');
              $log.error('Falló el anular asistencia', err.data);
            });
        })
        .catch(function() {
          _onAutoSave();
        });
    }

    function desestimar() {
      _offAutoSave();
      vm.rdxFrmRequire(true);
      if (_isDifferentToPendiente()) {
        _onAutoSave();
        return void mModalAlert.showWarning(
          'El estado de la asistencia debe estar en PENDIENTE.',
          'Aún no se puede desestimar'
        );
      }

      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Desistir',
        titulo: '¿Está seguro que el cliente desea desistir de la Asistencia?'
      };

      var incompleteFrms = _getIncompleteFrms(vm.frmsValidationStates);
      var request = _buildReqSave({estadoSiniestro: 'GENERADO'});

      _showModalConfirm(textos)
        .result.then(function cdScFn() {
          if (_isFrmInvalid(vm.frmsValidationStates)) {
            _onAutoSave();
            return void _showGoModalIncompleteFrm(incompleteFrms);
          }

          wpFactory.siniestro
            .GeneratorCaseFile(true, request)
            .then(function aSPr() {
              _updateFrmOld(request);
              mModalAlert.showSuccess('Realizado con éxito', 'Desistimiento').then(function msAnularPr() {
                _goBandejaWithNroAsistencia();
              });
            })
            .catch(function aEPr(err) {
              _onAutoSave();
              mModalAlert.showError('Ocurrió un error al poner en desistimiento', 'Error');
              $log.error('Falló el desestimar asistencia', err.data);
            });
        })
        .catch(function() {
          _onAutoSave();
        });
    }

    function guardar() {
      if (localStorage.getItem('msg')) {
        mModalAlert
          .showWarning(localStorage.getItem('msg'), 'No se pudo generar Código de Siniestro');
      }
      _offAutoSave();
      vm.rdxFrmRequire(true);
      var estadoSiniestro = vm.detalleAsistencia.estadoSiniestro;
      if (!vm.frmsValidationStates.general) {
        _onAutoSave();
        return void mModalAlert
          .showWarning('Los campos de Datos Generales son obligatorios', 'Falta completar')
          .then(function msAnularPr() {
            $state.go('detalleAsistencia.generales');
          });
      }

      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Guardar',
        subtitulo: 'Los cambios se guardarán en el sistema',
        titulo: '¿Está seguro de guardar los cambios?'
      };

      var incompleteFrms = _getIncompleteFrms(vm.frmsValidationStates);
      var estadoReq = _isPendienteOrAbierto() ? {estadoSiniestro: 'PENDIENTE'} : {};
      var request = _buildReqSave(estadoReq);

      _showModalConfirm(textos)
        .result.then(function cgScFn() {
          if (_isFrmInvalid(vm.frmsValidationStates)) {
            _onAutoSave();
            return void _showGoModalIncompleteFrm(incompleteFrms);
          }

          wpFactory.siniestro
            .Save(request, true)
            .then(function aSPr() {
              _updateFrmOld(ng.extend({}, request, {autoGuardado: true}));
              vm.rdxFrmSaved(true);
              if (estadoSiniestro === 'ABIERTO') {
                vm.rdxDetalleUpdate({estadoSiniestro: 'PENDIENTE'});
                vm.infoAsistencia.estadoSiniestro = 'PENDIENTE';
                fromNewToPendiente = true;
              }
              _updateOldFrm();
              _onAutoSave();

              if (!_getDataAsistencia().codigoSiniestro) {
                mModalAlert.showSuccess(
                  'No se puede continuar, esta asistencia no tiene un siniestro aperturado',
                  'Advertencia'
                );
              }
            })
            .catch(function aEPr(err) {
              _onAutoSave();
              $log.error('Falló el guardar asistencia', err.data);
              var msgError = ''
              if (err.data && err.data.data && err.data.data.message) {
                msgError = err.data.data.message
              }
              mModalAlert.showError('Ocurrió un error al guardar <br><b>' + err.data.message + '</b>' + '<br><b>' + msgError + '</b>', 'Error');
            });
        })
        .catch(function() {
          _onAutoSave();
        });
    }

    function investigar() {
      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Poner a investigación',
        titulo: '¿Está seguro de poner en investigación la Asistencia?'
      };
      _showModalInvestigar(textos).result.then(function ctScFn(resp) {
        frmInvestigacion.motivoInvestigacion = resp.motivoInvestigacion.codigoParametro;
        frmInvestigacion.comentarioInvestigacion = resp.comentarioInvestigacion;
        vm.rdxDetalleUpdate(frmInvestigacion);
      });
    }

    function terminar() {
      var body_get = {
        "assistanceNumber": vm.detalleAsistencia.codigoInterno,
        "carPlate": vm.detalleAsistencia.placaVehiculo,
        "lastName": vm.detalleAsistencia.conductor.paternoConductor,
        "district": vm.detalleAsistencia.codigoDistrito,
        "documentNumber": vm.detalleAsistencia.conductor.dniConductor,
        "name": vm.detalleAsistencia.conductor.nombreConductor,
        "province": vm.detalleAsistencia.codigoProvincia,
        "sinisterAddress": vm.detalleAsistencia.nombreVia
      }

      wpFactory.siniestro
        .GetExistingSinister(body_get)
        .then(function (value) {
          mModalAlert.showWarning(
            '<b>' + value.data.descripcion + '</b>',
            'Mensaje'
          );
        })
        .catch(function (e) {

        });
      _offAutoSave();
      vm.rdxFrmRequire(true);
      if (!_isPendienteOrGenerado()) {
        _onAutoSave();
        return void mModalAlert.showWarning(
          'El estado de la asistencia debe estar en PENDIENTE o GENERADO.',
          'Aún no se puede Terminar'
        );
      }

      var textos = {
        btnCancel: 'Cancelar',
        btnOk: 'Terminar',
        subtitulo: 'Los cambios se guardarán en el sistema y se generarán los expedientes respectivos.' +
        (_getDataAsistencia().codigoSiniestro ? '' : '<br><b>Se está intentando terminar una asistencia sin siniestro generado, por favor comunicarse con un ejecutivo de siniestros.</b>'),
        titulo: '¿Estás seguro de terminar la Asistencia?'
      };

      var incompleteFrms = _getIncompleteFrms(vm.frmsValidationStates);
      var request = _buildReqSave({estadoSiniestro: 'GENERADO'});
      if(vm.infoAsistencia != null && request.codigoSiniestro == 0) request.codigoSiniestro = vm.infoAsistencia.codigoSiniestro;

      _showModalConfirm(textos)
        .result.then(function ctScFn() {
          if (_isFrmInvalid(vm.frmsValidationStates)) {
            _onAutoSave();
            return void _showGoModalIncompleteFrm(incompleteFrms);
          }

          wpFactory.siniestro
            .GeneratorCaseFile(false, request)
            .then(function aSPr(data) {
              var aux_data = data.success
              var aux_message = !data ? '' : data.message
              if (aux_data) {
                mModalAlert.showError(
                  aux_message,
                  'Aún no se puede Terminar'
                );
              } else {
                mModalAlert.showSuccess('Realizado con éxito', 'Asistencia Generada').then(function msTerminarPr() {
                  _goBandejaWithNroAsistencia();
                });
              }})
            .catch(function aEPr(err) {
              _onAutoSave();
              mModalAlert.showError('Ocurrió un error al terminar <br><b>' + err.data.message + '</b>', 'Error');
              $log.error('Falló el terminar asistencia', err.data);
            });
        })
        .catch(function() {
          _onAutoSave();
        });
    }

    function _showModalConfirm(textos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-confirm close="close(status)" textos="textos"></wp-modal-confirm>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(type) {
              type && type === 'ok' ? $uibModalInstance.close() : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
          }
        ]
      });
    }

    function _showModalInvestigar(textos) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<wp-modal-investigar close="close($event)" textos="textos" datos="datos"></wp-modal-investigar>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.close = function(ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
            scope.textos = textos;
            scope.datos = frmInvestigacion;
          }
        ]
      });
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('DetalleAsistenciaPageController', DetalleAsistenciaPageController)
    .controller('DatosGeneralesPageController', function() {})
    .controller('ConductorOcupantePageController', function() {})
    .controller('VehiculoPageController', function() {})
    .controller('TercerosPageController', function() {})
    .controller('DetalleSiniestroPageController', function() {})
    .controller('ConsolidadoPageController', function() {})
    .controller('TalleresPageController', function() {});
});
