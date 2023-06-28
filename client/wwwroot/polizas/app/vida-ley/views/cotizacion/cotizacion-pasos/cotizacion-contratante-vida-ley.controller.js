define([
  'angular', 'lodash', 'constants', 'constantsVidaLey', 'mpfPersonConstants', 'mpfPersonDirective', 'mpfModalConfirmationSteps', 'mpfPersonComponent'
], function (angular, _, constants, constantsVidaLey, personConstants) {
  'use strict';

  angular
    .module(constants.module.polizas.vidaLey.moduleName)
    .controller('cotizacionContratanteVidaLeyController', CotizacionContratanteVidaLeyController);

  CotizacionContratanteVidaLeyController.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'vidaLeyService', 'vidaLeyFactory', 'proxyGeneral', 'mModalConfirm'];

  function CotizacionContratanteVidaLeyController($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, vidaLeyService, vidaLeyFactory, proxyGeneral, mModalConfirm) {
    var vm = this;

    vm.cotizacion = {}
    vm.contratante = {};
    $scope.dataContractor = {};
    vm.duracionDeclaracionSeguro = {};
    vm.tiposDocumento = [];
    vm.validadores = {
      maxNumeroDoc: 0,
      minNumeroDoc: 0,
      typeNumeroDoc: 'onlyNumber',
      typeNumeroDocDisabled: true
    }
    vm.formService = constantsVidaLey.VALIDATORS.CONTRATANTE;

    vm.companyCode = constants.module.polizas.accidentes.companyCode;
    vm.appCode = personConstants.aplications.VIDA_LEY;
    vm.formCode = personConstants.forms.COT_VIDALEY_CN;
    vm.personData = {};
    vm.currentStep = null;

    vm.desactivarControl = DesactivarControl;
    vm.validControlForm = ValidControlForm;
    vm.cambioTipoDocumento = CambioTipoDocumento;
    vm.buscarContratante = BuscarContratante;
    vm.activeBotonSiguiente = ActiveBotonSiguiente;
    vm.showModalConfirmation = ShowModalConfirmation;
    vm.stepDisabled = StepDisabled;
    vm.getValidations = GetValidations;
    vm.checkRequired = CheckRequired;

    (function load_CotizacionContratanteVidaLeyController() {
      _loadDocumentTypes();
      vm.contratante = vidaLeyFactory.cotizacion.contratante;
      vm.currentStep = $state.params.step;
      $scope.$on('personForm', function (event, data) {
        if (data.contractor) {
          $scope.contractorValid = data.valid;
          $scope.dataContractor = data.contractor;
          setFormData("dataContractor2", "contractorAddress", data.compContratante, data.legalPerson);
        }
      });

      vm.cotizacion = vidaLeyFactory.cotizacion;

      if (vm.cotizacion && vm.cotizacion.numDoc) {
        _getCotizacion(vm.cotizacion.numDoc)
      }

      if (vm.cotizacion.esMayorDe1Mes) {
        _showMensajeVigencia();
      }

    })();

    function _showMensajeVigencia() {
      mModalAlert.showWarning('', 'Debe actualizar la fecha de vigencia para continuar con la cotización');
    }

    function _getCotizacion(documentId) {
      vidaLeyService.getCotizacion(documentId)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            _getActivity(response.Data.Actividad.CodActividad);
            $scope.dataContractor = vidaLeyFactory.getPersonData(response.Data);
          }
        });
    }

    function _getActivity(actividad) {
      $scope.agente = vidaLeyFactory.cotizacion.modelo.agente;
      vidaLeyService.getListActividadesEconomicas(actividad, '', '', parseInt($scope.agente.codigoAgente), 1, 20, true)
        .then(function (response) {
          if (response.Data && response.Data.ListActEconomica) {
            $scope.mActEco = response.Data.ListActEconomica[0];
            getClausula();
          }
        });
    }

    $scope.getDataContractor = function (data) {
      $scope.dataContractor = data;
    }

    function DesactivarControl() {
      return vm.contratante && vm.contratante.mTipoDocumento && vm.contratante.mTipoDocumento.Codigo == null
    }

    function ValidControlForm(form, controlName) {
      return vidaLeyFactory.validControlForm(form, controlName);
    }

    function CambioTipoDocumento(tipoDocumento) {
      if (angular.isUndefined(tipoDocumento)) {
        _resetContratante(true, true);
        return;
      } else {
        vm.contratante.tipoDocumento = tipoDocumento.Codigo;
        _resetContratante(false, true);
      }
    }

    function BuscarContratante() {
      if (vidaLeyFactory.getValidParametrosBuscarPersona(vm.contratante.tipoDocumento, vm.contratante.numeroDocumento, vm.validadores)) {
        _loadContratanteInfo();
      }
    }

    function ActiveBotonSiguiente() {
      var contratante = $scope.dataContractor;
      return vidaLeyFactory.validStepContratanteNew(contratante, $scope.mActEco);
    }

    function _opcionesCotizacionRechazoAutomatico(codigo, mensaje) {
      const codigosRechazados = constantsVidaLey.CODIGOS_RECHAZO;
      if (codigosRechazados.indexOf(codigo) !== -1) {
        mModalAlert.showWarning('', mensaje)
          .then(function () {
            $state.go('homePolizaVidaLey');
          });
      } else {
        mModalAlert.showWarning('', 'Codigo validacion no encontrado');
      }
    }

    function _cotizacionRechazoAutomatico() {
      var params = {
        'codigoAplicacion': 'EMISA',
        "TipoRol": vidaLeyFactory.getUserActualRole(),
        "tipoValidacion": []
      };

      if (vm.cotizacion && vm.cotizacion.numDoc) {
        params.tipoValidacion = ["CVS", "CVA"]
      }

      vidaLeyService.validacionContratante($scope.dataContractor.documentType.Codigo + '-' + $scope.dataContractor.documentNumber, params)
        .then(function (response) {

          if (response.OperationCode === constants.operationCode.success) {
            const codigo = response.Data.Codigo;
            const mensaje = response.Data.Mensaje;
            if (codigo === '0' || codigo === '9834') {
              if (codigo === '9834') {
                mModalAlert.showInfo('', "Cliente deficitario").then(
                  function () {
                    continueConfirmation();
                    return;
                  }
                );
              }
              continueConfirmation();
            } else {
              _opcionesCotizacionRechazoAutomatico(codigo, mensaje);
            }

          }
        })
        .catch(function (error) {

        });
    }

    function ShowModalConfirmation() {

      if (vm.cotizacion.esMayorDe1Mes) {
        if (_vigenciaActualizada()) {
          return;
        }
      }

      if (!_submitForm()) {
        return;
      }

      if ($scope.mActEco.conClausula) {
        mModalConfirm
          .confirmInfo('', '¿Acepta las cláusulas de la actividad seleccionada?')
          .then(function () {
            _aceptarClausulas();
          }).catch(function () {
          });
      } else {
        _aceptarClausulas();
      }
    }

    function _submitForm() {
      $scope.$broadcast('submitForm', true);
      $scope.frmContratante.markAsPristine();
      return vm.activeBotonSiguiente();
    }

    function _aceptarClausulas() {
      _cotizacionRechazoAutomatico();
    }

    function continueConfirmation() {
      if (vm.stepDisabled() && !vm.cotizacion.numDoc) {
        _goStepPoliza();
        return;
      }

      if (_validationForm()) {
        $scope.dataConfirmation = {
          save: false,
          title: '¿Estás seguro que quieres guardar los datos?',
          subTitle: 'Recuerda que una vez guardados los datos no podrás hacer cambios',
          lblClose: 'Seguir editando',
          lblSave: 'Guardar y continuar'
        };

        if (vm.cotizacion && vm.cotizacion.numDoc) {
          $scope.dataConfirmation.title = '¿Estás seguro que quieres actualizar los datos?';
          $scope.dataConfirmation.lblSave = 'Actualizar y continuar'
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
              (vm.cotizacion && vm.cotizacion.numDoc) ? _grabarCotizacionContratante(constantsVidaLey.STEPS.COTIZACION.CONTRATANTE_UPDATE, true) : _grabarCotizacionContratante(constantsVidaLey.STEPS.COTIZACION.CONTRATANTE, false);
            }
          });
          $scope.$on('$destroy', function () { dataConfirmationWatch(); });
        }, function () { });
      } else {
        mModalAlert.showWarning('Observación', 'Debe llenar todos los datos obligatorios.');
      }
    }

    function StepDisabled() {
      return vidaLeyFactory.getCompleteStepQuote(constantsVidaLey.STEPS.COTIZACION.CONTRATANTE)
    }

    function GetValidations(controlCode) {
      var findControl = _findControlObject(controlCode);
      return findControl ? findControl.Validations : {};
    }

    function CheckRequired(controlCode) {
      var controlObject = _findControlObject(controlCode)
      if (controlObject) {
        var findRequired = _.find(controlObject.Validations, function (item) { return item.Type === 'REQUIRED' });
        return findRequired ? true : false;
      }
      return false;
    }

    function _grabarCotizacionContratante(stepType, update) {
      if (_validationForm()) {
        vidaLeyFactory.setParametrosContratante($scope.dataContractor);
        vidaLeyFactory.setActivity($scope.mActEco, vm.clausulaAutomatica);

        vidaLeyService.grabarCotizacion(stepType, vidaLeyFactory.getParametrosContratante(update, $scope.dataContractor.documentNumber))
          .then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              vidaLeyFactory.setRespuestaContratante(response.Data, $scope.mActEco.TipActividad);
              vidaLeyFactory.setCompleteStep(constantsVidaLey.STEPS.COTIZACION.CONTRATANTE);
              _goStepPoliza();
            } else {
              mModalAlert.showWarning(response.Message, "Advertencia!")
            }
          })
          .catch(function (error) {
            mModalAlert.showError(error.Data.Message, "¡Error!")
          });
      }
    }

    function _findControlObject(controlCode) {
      return !angular.isUndefined(vm.formService) && _.find(vm.formService.Controls, function (item) { return item.Code === controlCode });
    }

    function _loadDocumentTypes() {
      vidaLeyService.getDocumentTypes(true).then(function (response) {
        vm.tiposDocumento = response.Data;
        vm.contratante.mTipoDocumento = response.Data.find(function (tipo) { return tipo.Codigo === vm.contratante.tipoDocumento });
      });
    }

    function _setValidadores(tipoDocumento) {
      if (!!tipoDocumento) {
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, tipoDocumento, 1);
        vm.validadores.maxNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        vm.validadores.minNumeroDoc = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        vm.validadores.typeNumeroDoc = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        vm.validadores.typeNumeroDocDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
      }
    }

    function _resetContratante(cleanTipo, cleanNumero) {
      if (cleanTipo) {
        vm.contratante.mTipoDocumento = (void 0)
        vm.contratante.tipoDocumento = '';
      }
      if (cleanNumero) vm.contratante.numeroDocumento = '';
      vm.contratante.nombreCompleto = '';
      vm.contratante.telefono = '';
      vm.contratante.correo = '';
    }

    function _loadContratanteInfo() {
      mpSpin.start();
      vidaLeyService.getDatosPersona(vm.contratante.tipoDocumento, vm.contratante.numeroDocumento)
        .then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.contratante.nombreCompleto = (response.Data.Nombre + ' ' + response.Data.ApellidoPaterno + ' ' + response.Data.ApellidoMaterno).trim();
            vm.contratante.correo = response.Data.CorreoElectronico;
            vm.contratante.telefono = response.Data.Telefono;
          } else {
            _resetContratante(false, false);
          }
          mpSpin.end();
        })
        .catch(function (error) {
          mpSpin.end();

        });
    }

    function _validationForm() {
      $scope.frmContratante.personForm.markAsPristine();
      return true;
    }

    function _goStepPoliza() {
      $state.go(constantsVidaLey.ROUTES.COTIZACION_STEPS.url, { step: constantsVidaLey.STEPS.COTIZACION.POLIZA });
    }

    $scope.showModalActivities = function () {
      var vModal = $uibModal.open({
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mng-Search-Activity hiden-period="true" on-activity="selectActivity($event)" on-close="closeModal()" type-periodo="typePeriodo"></mng-Search-Activity>',
        controller: ['$scope', '$uibModalInstance', '$uibModal',
          function ($scope, $uibModalInstance) {
            $scope.typePeriodo = { codigo: 'PN' }
            $scope.selectActivity = function (event) {
              $uibModalInstance.close(event);
            }
            $scope.closeModal = function () {
              $uibModalInstance.close({});
            };
          }]
      });
      vModal.result.then(function (response) {
        if (response.selectedItem) {
          $scope.arrayExample = [];
          $scope.subactividad = undefined;
          $scope.selectActividadEco(response.selectedItem);
        }
      });
    };

    $scope.selectActividadEco = function (selection) {
      $scope.mActEco = selection;

      if ($scope.mActEco.TipActividad == 'A' || $scope.mActEco.TipActividad == 'S') {
        getClausula();
      }
    };

    function getClausula() {
      vidaLeyService.getClausula($scope.mActEco.CodCiiu)
        .then(function (response) {
          vm.clausulaAutomatica = response.Data;
          if (response.Data && response.Data.CIIU && response.Data.Detalle) {
            $scope.mActEco.conClausula = true;
          } else {
            $scope.mActEco.conClausula = false;
          }
        });
    }

    vm.isEmpty = function (value) {
      return !value;
    }

    function _vigenciaActualizada() {
      var diffDays = mainServices.date.fnDiff(vm.cotizacion.FecReg, new Date(), 'D')
      return diffDays <= 30;
    }

  }

});
