'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function(ng, _, ReembolsoActions, reConstants) {
  ReTemplateStepTwoController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    'mModalAlert',
    '$log',
    '$window'
  ];

  function ReTemplateStepTwoController(
    $scope,
    reFactory,
    reServices,
    $ngRedux,
    $uibModal,
    $state,
    mModalAlert,
    $log,
    $window
  ) {
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
    vm.validateImporte = validateImporte;
    vm.goToStepOne = goToStepOne;
    vm.onBlurDocumentSerialNumber = onBlurDocumentSerialNumber;
    vm.onBlurDocumentNumberWithoutSerie = onBlurDocumentNumberWithoutSerie;
    vm.onChangeDate = onChangeDate;

    function onInit() {
      try {
        actionsRedux = $ngRedux.connect(mapStateToThis, ReembolsoActions)(vm);
      } catch (err) {
        $state.go('.', {
          step: 1
        });
      }
      vm.currentFlow = {
        salud: false,
        sctr: false
      };

      _validateInit();

      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
      vm.isEditComprobante = false;
      vm.showErrorDateRange = false;
      vm.procedureListArr = [];
      vm.listFileLength = [];
      vm.docNumMaxLength = 11;
      vm.codeUploadFile = reConstants.codeUploadFile.pagoComprobantes;

      _setLookupSelect();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        comprobantesListValid: state.solicitud.comprobantesList ? ng.copy(state.solicitud.comprobantesList) : [],
        solicitud: ng.copy(state.solicitud)
      };
    }

    function _validateInit() {
      if (vm.solicitud) {
        isEPS(reConstants.products, vm.currentFlow);
      } else {
        $state.go('solicitud.init');
      }
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
          codeField: item.documentTypeReceived || item.documentType.codeField
        },
        documentSerialNumber: item.documentSerialNumber,
        documentNumberWithoutSerie: item.documentNumberWithoutSerie,
        date: new reFactory.common.DatePicker(new Date(item.providerDocumentDate || item.date.model)),
        invoiceItemNumber: item.invoiceItemNumber,
        index: item.index
      };

      vm.proceduresList = _mapProcedureEdit(item.preLiquidationProcedureDtos || item.procedimientos);
      vm.procedureListArr = ng.copy(vm.proceduresList);
    }

    function addComprobante() {
      if (vm.frmComprobante.$invalid) {
        vm.frmComprobante.markAsPristine();

        var dateStepOne = vm.solicitud.additionalData.treatmentDate || vm.solicitud.additionalData.sinisterDate;

        vm.showErrorDateRange =
          vm.frmComprobanteData.date.model < dateStepOne || vm.frmComprobanteData.date.model > new Date();

        return void 0;
      }

      if (!(vm.procedureListArr.length > 0)) {
        vm.hasProcedureError = true;
        mModalAlert.showError('Debes elegir un procedimiento', 'Error');
        return void 0;
      }

      var reqValidateDocumentNumber = {
        sequence: vm.frmComprobanteData.documentSerialNumber,
        documentValue: vm.frmComprobanteData.documentNumberWithoutSerie,
        documentType: vm.frmComprobanteData.documentType.codeField,
        rucNumber: vm.frmComprobanteData.rucNumber
      };

      vm.showErrorDateRange = false;

      _getFormatNumber(_saveComprobanteDisconnected, reqValidateDocumentNumber);
    }

    function cancelComprobante() {
      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
    }

    function showAddComprobanteSection() {
      var sumTotalInvoice = reServices.sumProperty(vm.solicitud.comprobantesList, 'invoiceTotalValue');

      if (vm.solicitud.solicitudData.totalComprobantesImport < sumTotalInvoice) {
        mModalAlert.showError('No puede seguir agregando comprobantes ya que excedió el monto total.', 'Error');
        return void 0;
      }

      vm.isVisibleAddSectionComprobante = true;
      vm.showAddComprobanteBtn = false;
      vm.isEditComprobante = false;
      vm.isVoidComprobantesList = false;
      vm.hasProcedureError = false;
      vm.proceduresList = [];
      vm.procedureListArr = [];
      vm.frmComprobanteData = _mapInitFormComprobante();
    }

    function onChangeDate(date) {
      if (date) {
        var dateStepOne = vm.solicitud.additionalData.treatmentDate || vm.solicitud.additionalData.sinisterDate;

        vm.showErrorDateRange =
          vm.frmComprobanteData.date.model < dateStepOne || vm.frmComprobanteData.date.model > new Date();
      }
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

    function onBlurRuc(ruc) {
      if (ruc) {
        var inputRuc = ruc ? ruc + '' : '';

        if (inputRuc.length !== 11) {
          mModalAlert.showError('Elige un número de RUC válido', 'Error');
        } else {
          _getRazonSocial(inputRuc);
        }
      }
    }

    function onBlurDocumentSerialNumber() {
      if (vm.frmComprobanteData.documentSerialNumber) {
        var reqService = {
          sequence: vm.frmComprobanteData.documentSerialNumber.toUpperCase()
        };
        _getFormatNumber(_setDocumentsValue, reqService, 'documentSerialNumber');
      }
    }

    function onBlurDocumentNumberWithoutSerie() {
      if (vm.frmComprobanteData.documentNumberWithoutSerie) {
        var reqService = {
          documentValue: vm.frmComprobanteData.documentNumberWithoutSerie.toUpperCase()
        };
        _getFormatNumber(_setDocumentsValue, reqService, 'documentNumberWithoutSerie');
      }
    }

    function goToStepOne() {
      $state.go('.', {
        step: 1
      });
    }

    function validateImporte() {
      if (vm.comprobantesListValid < 1) {
        mModalAlert.showError('Debes añadir un comprobante', 'Error');
        return void 0;
      }
      vm.onImporteComprobantes(vm.comprobantesListValid);
    }

    // privates

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
      reFactory.solicitud
        .GetRazSocialByRuc(criteria)
        .then(function(res) {
          if (res.isValid) {
            vm.frmComprobanteData.rucDescription = res.data.rucDescription;
          } else {
            res.brokenRulesCollection.length >= 1
              ? mModalAlert.showError(res.brokenRulesCollection[0].description, '')
              : _showCreateCompanyModal(criteria).result.then(function(res) {
                  vm.frmComprobanteData.rucDescription = res.razonSocial;
                });
          }
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function _getFormatNumber(callback, req, propertyName) {
      reFactory.solicitud
        .GetDocumentNumberValid(req)
        .then(function(res) {
          if (!res.isValid) {
            var message = '';
            ng.forEach(res.brokenRulesCollection, function(error) {
              message += error.description + ' ';
            });
            vm.frmComprobanteData[propertyName] = '';
            mModalAlert.showError(message, 'Error');
            return void 0;
          } else {
            callback(res, propertyName);
          }
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
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

    function _setDocumentsValue(res, propertyName) {
      var arrProperty = _.keys(res.data);
      vm.frmComprobanteData[propertyName] = res.data[arrProperty[0]];
    }

    function _mapInitFormComprobante() {
      return _.assign(
        {},
        {
          documentType: {
            codeField: '2'
          },
          date: _validateTreatmentDate()
        }
      );
    }

    function _validateTreatmentDate() {
      var treatmentDate = vm.solicitud.additionalData.treatmentDate || vm.solicitud.additionalData.sinisterDate;
      var currentDate = new Date();
      var date = new reFactory.common.DatePicker();

      date.setMinDate(treatmentDate);
      date.setMaxDate(currentDate);

      return date;
    }

    function _mapProcedureEdit(arrProcedures) {
      return _.map(arrProcedures, function(item) {
        return _.assign(
          {},
          {
            code: vm.solicitud.additionalData.isCallToDb ? item.procedureDto.code : item.code,
            description: vm.solicitud.additionalData.isCallToDb ? item.procedureDto.description : item.description,
            diagnostic: vm.solicitud.additionalData.isCallToDb
              ? {
                  codeName: item.diagnosticDto.codeAndDescription,
                  code: item.diagnosticDto.code,
                  name: item.diagnosticDto.longDescription
                }
              : ng.copy(item.diagnostic),
            farmacos: item.farmacos,
            importe: item.saleValue || item.importe,
            invoiceProcedureItemNumber: item.invoiceProcedureItemNumber,
            procedureGroupCode: item.procedureGroupCode,
            selected: true,
            treatmentDate: new reFactory.common.DatePicker(
              new Date(item.treatmentBeginDate || item.treatmentDate.model)
            )
          }
        );
      });
    }

    function isEPS(products, currentFlow) {
      if (vm.solicitud.company && vm.solicitud.product) {
        currentFlow.salud =
          vm.solicitud.company.id === products.salud.companyCode &&
          vm.solicitud.product.code === products.salud.productCode;

        currentFlow.sctr =
          vm.solicitud.company.id === products.sctr.companyCode &&
          vm.solicitud.product.code === products.sctr.productCode;

        // if (currentFlow.salud || currentFlow.sctr) {
        //   vm.solicitud.additionalData = {
        //     policyNumber: vm.solicitud.policyNumber,
        //     documentControlNumber: null,
        //     identificatorImageCode: vm.solicitud.documentControlNumber
        //   };
        // }
      }
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReTemplateStepTwoController', ReTemplateStepTwoController)
    .component('reTemplateStepTwo', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepTwo/template/template.html',
      controller: 'ReTemplateStepTwoController',
      bindings: {
        onImporteComprobantes: '<'
      }
    });
});
