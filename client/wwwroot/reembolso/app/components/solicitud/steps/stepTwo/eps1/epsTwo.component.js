'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function(ng, _, ReembolsoActions, reConstants) {
  ReEpsTwoController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    '$window',
    'mModalAlert',
    '$log'
  ];

  function ReEpsTwoController($scope, reFactory, reServices, $ngRedux, $uibModal, $state, $window, mModalAlert, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.formatDateToSlash = formatDateToSlash;
    vm.editComprobante = editComprobante;
    vm.addComprobante = addComprobante;
    vm.cancelComprobante = cancelComprobante;
    vm.showAddComprobanteSection = showAddComprobanteSection;
    vm.listFile = listFile;
    vm.onBlurRuc = onBlurRuc;
    vm.getProcedureList = getProcedureList;
    vm.getSumTotalList = getSumTotalList;
    vm.getDocumentNumberIsValid = getDocumentNumberIsValid;
    vm.continuerToStepThree = continuerToStepThree;
    vm.goToStepOne = goToStepOne;

    function onInit() {
      try {
        actionsRedux = $ngRedux.connect(mapStateToThis, ReembolsoActions)(vm);
      } catch (err) {
        $state.go('.', {
          step: 1
        });
      }
      _validateInit();
      _setLookupSelect();

      vm.codeUploadFile = reConstants.codeUploadFile.pagoComprobantes;
      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
      vm.isEditComprobante = false;
      vm.procedureListArr = [];
      vm.listFileLength = [];
      vm.docNumMaxLength = 11;
    }

    function onDestroy() {
      actionsRedux();
    }

    function goToStepOne() {
      $state.go('.', {
        step: 1
      });
    }

    function mapStateToThis(state) {
      _getDocumentTypeList();
      return {
        solicitud: ng.copy(state.solicitud),
        comprobantesListValid: state.solicitud.comprobantesList ? ng.copy(state.solicitud.comprobantesList) : []
      };
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }

    function editComprobante(item) {
      vm.isVisibleAddSectionComprobante = true;
      vm.showAddComprobanteBtn = false;
      vm.isEditComprobante = true;
      vm.invoiceItemNumberDocument = item.invoiceItemNumber;

      vm.frmComprobanteData = {
        rucNumber: item.rucNumber + '',
        rucDescription: item.rucDescription,
        documentType: {
          documentTypeReceived: item.documentType.documentTypeReceived,
          documentNameReceived: item.documentType.documentNameReceived
        },
        documentNumber: item.documentSerialNumber
          ? _formatComprobante(item.documentSerialNumber, item.documentNumberWithoutSerie)
          : item.documentNumber,
        date: new reFactory.common.DatePicker(new Date(item.providerDocumentDate || item.date.model)),
        invoiceItemNumber: item.invoiceItemNumber,
        index: item.index,
        serial: item.serial,
        documentComplete: item.documentComplete
      };

      vm.proceduresList = _mapProcedureEdit(item.preLiquidationProcedureDtos || item.procedimientos);
      vm.procedureListArr = ng.copy(vm.proceduresList);
    }

    function addComprobante() {
      if (vm.frmComprobante.$invalid) {
        vm.frmComprobante.markAsPristine();
        return void 0;
      }

      if (
        new Date(new Date(vm.frmComprobanteData.date.model).setHours(23, 59, 59, 999)) <
          new Date(new Date(vm.solicitud.treatment.date).setHours(23, 59, 59, 999)) ||
        new Date(new Date(vm.frmComprobanteData.date.model).setHours(23, 59, 59, 999)) >
          new Date(new Date().setHours(23, 59, 59, 999))
      ) {
        mModalAlert.showError('Fecha de documento no debe ser anterior a la fecha de inicio de tratamiento', 'Error');
        return void 0;
      }

      if (!(vm.procedureListArr.length > 0)) {
        vm.hasProcedureError = true;
        mModalAlert.showError('Debes elegir un procedimiento', 'Error');
        return void 0;
      }

      _saveComprobanteDisconnected();
    }

    function getDocumentNumberIsValid() {
      vm.invoicePreLiquidationDocumentExistsCriteria = {
        Sequence: vm.frmComprobanteData.serial ? vm.frmComprobanteData.serial.toUpperCase() : null,
        DocumentValue: vm.frmComprobanteData.documentNumber,
        DocumentType: vm.frmComprobanteData.documentType.documentTypeReceived,
        RucNumber: vm.frmComprobanteData.rucNumber
      };

      reFactory.solicitud
        .GetDocumentNumberIsValid(vm.invoicePreLiquidationDocumentExistsCriteria)
        .then(function(res) {
          if (!res.isValid) {
            var message = '';
            ng.forEach(res.brokenRulesCollection, function(error) {
              message += error.description + ' ';
            });
            mModalAlert.showError(message, 'Error');
            return void 0;
          } else {
            vm.frmComprobanteData.serial = res.data.sequence;
            vm.frmComprobanteData.documentComplete = res.data.documentComplete;
            vm.frmComprobanteData.documentNumber = res.data.documentValue;
          }
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function cancelComprobante() {
      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
    }

    function showAddComprobanteSection() {
      vm.isVisibleAddSectionComprobante = true;
      vm.showAddComprobanteBtn = false;
      vm.isEditComprobante = false;
      vm.hasProcedureError = false;
      vm.invoiceItemNumberDocument = 0;

      vm.frmComprobanteData = {
        date: new reFactory.common.DatePicker()
      };

      if (!vm.isVoidComprobantesList && vm.comprobantesListValid.length >= 1) {
        vm.proceduresList = [];
        vm.procedureListArr = [];
      }

      vm.isVoidComprobantesList = false;
    }

    function getProcedureList(list) {
      vm.procedureListArr = list;
    }

    function getSumTotalList(sum) {
      vm.sumTotalList = sum;
      vm.disabledAddButtonComprobante = vm.sumTotalList >= vm.solicitud.solicitudData.totalComprobantesImport;
    }

    function listFile(arr) {
      vm.listFileLength = arr.length;
    }

    function onBlurRuc() {
      if (vm.frmComprobanteData.rucNumber) {
        var inputRuc = vm.frmComprobanteData.rucNumber ? vm.frmComprobanteData.rucNumber + '' : '';

        if (inputRuc.length !== 11) {
          mModalAlert.showError('Elige un número de RUC válido', 'Error');
        } else {
          _getRazonSocial(inputRuc);
        }
      }
    }

    function continuerToStepThree() {
      var list = ng.copy(vm.comprobantesListValid);
      _validateToContinueStepThree(list);
    }

    // privates

    // validation

    function _validateInit() {
      if (vm.solicitud) {
        // vm.solicitud.additionalData = {
        //   identificatorImageCode: vm.solicitud.additionalData.identificatorImageCode
        // };
      } else {
        $state.go('.', {
          step: 1
        });
      }
    }

    function _validateToContinueStepThree(comprobantesList) {
      if (vm.sumTotalList !== vm.solicitud.treatment.amountProvider) {
        mModalAlert.showError(
          'La suma total de comprobantes no es igual al importe total declarado: S/ ' +
            vm.solicitud.treatment.amountProvider,
          'Error'
        );
        return void 0;
      }

      $state.go('.', {
        step: 3
      });
    }

    // modals

    function _showCreateCompanyModal(ruc) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        template: '<re-create-company-modal close="close($event)" ruc="ruc"></re-create-company-modal>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.ruc = ruc;
            scope.close = function(ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _getRazonSocial(criteria) {
      vm.frmComprobanteData.date = new reFactory.common.DatePicker();
      reFactory.solicitud
        .GetRazSocialByRuc(criteria)
        .then(function(res) {
          if (res.isValid) {
            vm.frmComprobanteData.rucDescription = res.data.rucDescription;
          } else {
            $log.info(res);
            _showCreateCompanyModal(criteria).result.then(function(res) {
              vm.frmComprobanteData.rucDescription = res.razonSocial;
            });
          }
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function _saveComprobanteDisconnected() {
      var comprobante = _.assign({}, vm.frmComprobanteData, {
        invoiceItemNumber: vm.isEditComprobante
          ? vm.frmComprobanteData.invoiceItemNumber
          : vm.comprobantesListValid.length + 1,
        index: vm.isEditComprobante ? vm.frmComprobanteData.index : vm.comprobantesListValid.length + 1,
        procedimientos: ng.copy(vm.procedureListArr),
        invoiceTotalValue: reServices.sumProperty(vm.procedureListArr, 'importe')
      });

      vm.isEditComprobante ? vm.reduxEditComprobante(comprobante) : vm.reduxAddComprobante(comprobante);

      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
      vm.showContinueBtn = true;
    }

    function _setLookupSelect() {
      var tableNameDocumentType = 'DocumentReceived';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.documentTypeList = _.filter(lookUpsData, function(item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }

    function _formatComprobante(serial, number) {
      var zeroNumbers = '';
      if (number.length < 8) {
        var iterationsNumber = 8 - number.length;

        for (var i = 0; i < iterationsNumber; i++) {
          zeroNumbers += '0';
        }
      }

      return serial + '-' + zeroNumbers + number;
    }

    function _mapProcedureEdit(arrProcedures) {
      return _.map(arrProcedures, function(item) {
        return _.assign(
          {},
          {
            code: item.code,
            description: item.description,
            diagnostic: ng.copy(item.diagnostic),
            importe: item.saleValue || item.importe,
            invoiceProcedureItemNumber: item.invoiceProcedureItemNumber,
            selected: true,
            treatmentDate: new reFactory.common.DatePicker(
              new Date(item.treatmentBeginDate || item.treatmentDate.model)
            )
          }
        );
      });
    }

    function _getDocumentTypeList() {
      reFactory.solicitud
        .GetAllDocumentsReceivedType()
        .then(function(res) {
          vm.documentTypeList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReEpsTwoController', ReEpsTwoController)
    .component('reEpsTwo', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepTwo/eps/epsTwo.html',
      controller: 'ReEpsTwoController as $ctrl',
      binding: {}
    });
});
