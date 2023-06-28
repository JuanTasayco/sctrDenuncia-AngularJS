'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {
  ReSoatTwoController.$inject = ['$scope', 'reFactory', 'reServices', '$ngRedux', '$uibModal', '$state', '$window', 'mModalAlert', '$log'];

  function ReSoatTwoController($scope, reFactory, reServices, $ngRedux, $uibModal, $state, $window, mModalAlert, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.formatDateToSlash = formatDateToSlash;
    vm.editCompensation = editCompensation;
    vm.editComprobante = editComprobante;
    vm.deleteCompensation = deleteCompensation;
    vm.addCompensation = addCompensation;
    vm.addComprobante = addComprobante;
    vm.cancelComprobante = cancelComprobante;
    vm.showAddComprobanteSection = showAddComprobanteSection;
    vm.listFile = listFile;
    vm.onBlurRuc = onBlurRuc;
    vm.getProcedureList = getProcedureList;
    vm.getSumTotalList = getSumTotalList;
    vm.continuerToStepThree = continuerToStepThree;
    vm.goToStepOne = goToStepOne;

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      _validateInit();
      _setLookupSelect();

      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
      vm.isEditComprobante = false;
      vm.procedureListArr = [];
      vm.listFileLength = [];
      vm.listFileToShow = [];
      vm.docNumMaxLength = 11;
      vm.codeUploadFile = reConstants.codeUploadFile.pagoComprobantes;
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        compensationList: state.solicitud.coverageCompensations ?
          ng.copy(state.solicitud.coverageCompensations) : [],
        comprobantesListValid: state.solicitud.comprobantesList ?
          ng.copy(state.solicitud.comprobantesList) : [],
        solicitud: ng.copy(state.solicitud)
      };
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }

    function editCompensation(item) {
      _showCoveragesModalForm(item, true);
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
        documentNumber: item.documentSerialNumber ?
          _formatComprobante(item.documentSerialNumber, item.documentNumberWithoutSerie) : item.documentNumber,
        date: new reFactory.common.DatePicker(new Date(item.providerDocumentDate || item.date.model)),
        invoiceItemNumber: item.invoiceItemNumber,
        index: item.index
      }

      vm.proceduresList = _mapProcedureEdit(item.preLiquidationProcedureDtos || item.procedimientos);
      vm.procedureListArr = ng.copy(vm.proceduresList);
    }

    function deleteCompensation(serviceData) {
      var data = {
        request: {
          compensationCorrelativeNumber: serviceData.compensationCorrelativeNumber,
          compensationStatus: serviceData.compensationStatus,
          index: serviceData.index
        },
        serviceName: serviceData.serviceName
      }

      var request = vm.solicitud.additionalData.isCallToDb &&
        (vm.solicitud.documentLiquidation &&
        vm.solicitud.documentLiquidation.documentControlNumber) ?
        _.assign({}, _mapObjRequest(), data.request) :
        _.assign({}, data.request);

      vm.solicitud.additionalData.isCallToDb &&
        (vm.solicitud.documentLiquidation &&
        vm.solicitud.documentLiquidation.documentControlNumber) ?
        _deleteConnected(data.serviceName, request) :
        _deleteDisconnected(request);
    }

    function addCompensation() {
      if (vm.solicitud.documentLiquidation && vm.solicitud.documentLiquidation.documentControlNumber) {
        return void 0;
      }

      _showCoveragesModalForm();
    }

    function addComprobante() {
      if (vm.frmComprobante.$invalid) {
        vm.frmComprobante.markAsPristine();
        return void 0;
      }

      if (!(vm.procedureListArr.length > 0)) {
        vm.hasProcedureError = true;
        mModalAlert.showError('Debes elegir un procedimiento', 'Error');
        return void 0;
      }

      if (vm.solicitud.documentLiquidation && vm.solicitud.documentLiquidation.documentControlNumber) {
        return void 0;
      }

      _saveComprobanteDisconnected();
    }

    function cancelComprobante() {
      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
    }

    function showAddComprobanteSection() {
      if (vm.solicitud.documentLiquidation && vm.solicitud.documentLiquidation.documentControlNumber) {
        return void 0;
      }

      if (vm.sumTotalList > vm.totalComprobantesImport) {
        return void 0;
      }

      vm.isVisibleAddSectionComprobante = true;
      vm.showAddComprobanteBtn = false;
      vm.isEditComprobante = false;
      vm.invoiceItemNumberDocument = 0;
      vm.hasProcedureError = false;

      vm.frmComprobanteData = _.assign({}, vm.frmComprobanteData, {
        date: new reFactory.common.DatePicker()
      });

      if (!vm.isVoidComprobantesList && vm.comprobantesListValid.length >= 1) {
        vm.proceduresList = [];
        vm.procedureListArr = [];
        vm.frmComprobanteData = {
          date: new reFactory.common.DatePicker()
        };
      }

      vm.frmComprobanteData.date.setMaxDate(new Date());
      vm.isVoidComprobantesList = false;
    }

    function getProcedureList(list) {
      vm.procedureListArr = list;
    }

    function getSumTotalList(sum) {
      vm.sumTotalList = sum;
      vm.disabledAddButtonComprobante = vm.sumTotalList >= vm.totalComprobantesImport;
    }

    function listFile(arr) {
      vm.listFileLength = arr.length;
      vm.listFileToShow = arr;
    }

    function onBlurRuc(ruc) {
      if(ruc) {
        var inputRuc = ruc ? ruc + '' : '';

        if (inputRuc.length !== 11) {
          mModalAlert.showError('Elige un número de RUC válido', 'Error');
        } else {
          _getRazonSocial(inputRuc);
        }
      }
    }

    function goToStepOne() {
      $state.go('.', {
        step: 1
      })
    }

    function continuerToStepThree() {
      var list = (
          vm.solicitud.coverage.code === reConstants.coverages.gastosSepelio ||
          vm.solicitud.coverage.code === reConstants.coverages.gastosCuracion) ?
        ng.copy(vm.comprobantesListValid) : ng.copy(vm.compensationList)

      _validateToContinueStepThree(list);
    }

    // privates

    // validation
    function _validateInit() {
      if (vm.solicitud.solicitudData) {
        _validateRegularCoverages(
          vm.solicitud.additionalData.isCallToDb &&
          (vm.solicitud.documentLiquidation &&
          vm.solicitud.documentLiquidation.documentControlNumber)
        );
        _validateGastosCoverages(
          vm.solicitud.additionalData.isCallToDb &&
          (vm.solicitud.documentLiquidation &&
          vm.solicitud.documentLiquidation.documentControlNumber)
        );
      } else {
        $state.go('solicitud.init');
      }
    }

    function _validateGastosCoverages(isConnectedToDb) {
      if (
        vm.solicitud.coverage.code === reConstants.coverages.gastosSepelio ||
        vm.solicitud.coverage.code === reConstants.coverages.gastosCuracion
      ) {
        vm.totalComprobantesImport = vm.solicitud.documentLiquidation.amountDocumentProvider;
        isConnectedToDb ? _getComprobantesListService() : _getComprobantesListServiceDisconnected();
      }
    }

    function _validateRegularCoverages(isConnectedToDb) {
      if (
        vm.solicitud.coverage.code !== reConstants.coverages.gastosSepelio &&
        vm.solicitud.coverage.code !== reConstants.coverages.gastosCuracion
      ) {
        isConnectedToDb && _getListService();
      }
    }

    function _validateToContinueStepThree(comprobantesList) {
      if (comprobantesList.length < 1) {
        var lblName = (
          vm.solicitud.coverage.code === reConstants.coverages.gastosSepelio ||
          vm.solicitud.coverage.code === reConstants.coverages.gastosCuracion
        ) ? 'comprobante' : 'cobertura'

        mModalAlert.showError('Debes añadir un(a) ' + lblName, 'Error');
        return void 0;
      }

      if (
        vm.solicitud.coverage.code === reConstants.coverages.gastosSepelio ||
        vm.solicitud.coverage.code === reConstants.coverages.gastosCuracion
      ) {

        if (vm.sumTotalList !== vm.totalComprobantesImport) {
          mModalAlert.showError('La suma total de comprobantes no es igual al importe total declarado: S/ ' + vm.totalComprobantesImport, 'Error');
          return void 0;
        }
      }

      $state.go('.', {
        step: 3
      })
    }

    // modals

    function _showCoveragesModalForm(data, edit) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template: '<re-coverages-modal-form close="close" data="data" compensation-list="$ctrl.compensationList" is-current-edit="edit"></re-coverages-modal-form>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function (scope, $uibModalInstance) {
            scope.edit = edit;
            scope.data = data;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

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
          function (scope, $uibModalInstance) {
            scope.ruc = ruc;
            scope.close = function (ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _getServiceListName() {
      switch (vm.solicitud.coverage.code) {
        case '3111  ':
          return 'GetTemporaryDisabilityList'
        case '3110  ':
          return 'GetPermanentDisabilityList'
        case '3109  ':
          return 'GetAccidentalDeathList';
        default:
          return void 0;
      }
    }

    function _getListService() {
      var request = _.assign({}, _mapObjRequest());
      var serviceName = _getServiceListName();
      var service = reFactory.solicitud[serviceName];

      service(request)
        .then(function (res) {
          vm.compensationList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _getComprobantesListService() {
      var request = {
        liquidationCorrelativeNumber: 1,
        sinisterNumberRef: vm.solicitud.additionalData.sinisterNumberRef,
        anio: vm.solicitud.documentLiquidation.anio,
        documentControlNumber: vm.solicitud.documentLiquidation.documentControlNumber
      }

      reFactory.solicitud
        .GetComprobantesList(request)
        .then(function (res) {
          vm.comprobantesList = res.isValid ? res.data : [];
          vm.comprobantesListValid = res.isValid ? _validateComprobantesList() : [];
          vm.frmComprobanteData = res.isValid ? _setComprobanteData() : {}
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _getComprobantesListServiceDisconnected() {
      reFactory.solicitud
        .GetDefaultInvoiceDisconnected()
        .then(function (res) {
          vm.isVoidComprobantesList = true;
          vm.frmComprobanteData = res.isValid ? _.assign({}, {
            rucNumber: res.data.rucNumber + '',
            rucDescription: res.data.rucDescription,
            documentType: {
              codeField: res.data.documentTypeReceived
            },
            documentNumber: res.data.documentNumberReceived,
            date: new reFactory.common.DatePicker(new Date(res.data.providerDocumentDate))
          }) : {
            date: new reFactory.common.DatePicker(new Date(res.data.providerDocumentDate))
          }
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _getRazonSocial(criteria) {
      reFactory.solicitud
        .GetRazSocialByRuc(criteria)
        .then(function (res) {
          if (res.isValid) {
            vm.frmComprobanteData.rucDescription = res.data.rucDescription;
          } else {
            res.brokenRulesCollection.length === 0 ?
              _showCreateCompanyModal(criteria).result.then(function (res) {
                vm.frmComprobanteData.rucDescription = res.razonSocial;
              }) :
              mModalAlert.showError(res.brokenRulesCollection[0].description, 'Error');
          }
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        });
    }

    function _deleteConnected(serviceName, request) {
      var service = reFactory.solicitud[serviceName];
      service(request)
        .then(function () {
          _getListService();
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _deleteDisconnected(request) {
      vm.reduxCoverageCompensationDelete(request.index);
    }

    function _saveComprobante() {
      var request = _mapReqComprobanteService();
      var proceduresPropertyName = vm.isEditComprobante ?
        'preLiquidationProcedureUpdateCriterias' : 'preLiquidationProcedureSaveCriterias';

      request[proceduresPropertyName] = _mapProceduresToSave(vm.procedureListArr);

      var serviceAction = vm.isEditComprobante ?
        reFactory.solicitud['UpdateComprobante'] : reFactory.solicitud['SaveComprobante'];

      serviceAction(request)
        .then(function (res) {
          $log.info(res);
          _getComprobantesListService();
          vm.isVisibleAddSectionComprobante = false;
          vm.showAddComprobanteBtn = true;
          vm.showContinueBtn = true;
        })
        .catch(function (err) {
          $log.error('Servidor', err);
        })
    }

    function _saveComprobanteDisconnected() {
      var comprobante = _.assign({}, vm.frmComprobanteData, {
        invoiceItemNumber: vm.isEditComprobante ?
          vm.frmComprobanteData.invoiceItemNumber : vm.comprobantesListValid.length + 1,
        index: vm.isEditComprobante ? vm.frmComprobanteData.index : vm.comprobantesListValid.length + 1,
        procedimientos: ng.copy(vm.procedureListArr),
        invoiceTotalValue: reServices.sumProperty(vm.procedureListArr, 'importe')
      });

      vm.isEditComprobante ? vm.reduxEditComprobante(comprobante) : vm.reduxAddComprobante(comprobante);

      vm.isVisibleAddSectionComprobante = false;
      vm.showAddComprobanteBtn = true;
      vm.showContinueBtn = true;
    }

    function _validateComprobantesList() {
      var validArr = _.filter(vm.comprobantesList, function (item) {
        return item.invoiceItemNumber !== 0
      });

      vm.enableAddButtonComprobante = validArr.length > 0 && vm.solicitud.documentLiquidation.documentControlNumber;

      return validArr;
    }

    function _setComprobanteData() {
      var element = _.find(vm.comprobantesList, function (item) {
        return item.invoiceItemNumber === 0
      });

      if (_.keys(element).length > 0) {
        vm.isVoidComprobantesList = true;

        return _.assign({}, {
          rucNumber: element.rucNumber + '',
          rucDescription: element.rucDescription,
          documentType: {
            codeField: element.documentTypeReceived
          },
          documentNumber: _formatComprobante(element.documentSerialNumber, element.documentNumberWithoutSerie),
          date: new reFactory.common.DatePicker(new Date(element.providerDocumentDate))
        })
      } else {
        return _.assign({}, {
          date: new reFactory.common.DatePicker()
        })
      }
    }

    function _setLookupSelect() {
      var tableNameDocumentType = 'DocumentReceived';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.documentTypeList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }

    function _formatComprobante(serial, number) {
      var zeroNumbers = '';
      if (number.length < 8) {
        var iterationsNumber = 8 - number.length;

        for (var i = 0; i < iterationsNumber; i++) {
          zeroNumbers += '0'
        }
      }

      return serial + '-' + zeroNumbers + number;
    }

    function _mapProcedureEdit(arrProcedures) {
      var arr = _.map(arrProcedures, function (item) {
        return _.assign({}, {
          code: vm.solicitud.documentLiquidation.documentControlNumber ? item.procedureDto.code : item.code,
          description: vm.solicitud.documentLiquidation.documentControlNumber ? item.procedureDto.description : item.description,
          diagnostic: vm.solicitud.documentLiquidation.documentControlNumber ? {
            codeName: item.diagnosticDto.codeAndDescription,
            code: item.diagnosticDto.code,
            name: item.diagnosticDto.longDescription
          } : ng.copy(item.diagnostic),
          importe: item.saleValue || item.importe,
          invoiceProcedureItemNumber: item.invoiceProcedureItemNumber,
          selected: true,
          treatmentDate: new reFactory.common.DatePicker(new Date(item.treatmentBeginDate || item.treatmentDate.model)),
        })
      })

      return arr;
    }

    function _mapProceduresToSave(arr) {
      var list = _.map(arr, function (item) {
        return _.assign({}, {
          invoiceProcedureItemNumber: item.invoiceProcedureItemNumber,
          procedureCode: item.code,
          saleValue: item.importe,
          diagnosticCode: item.diagnostic.code,
          benefitCode: vm.solicitud.coverage.code,
          treatmentBeginDate: item.treatmentDate.model,
          invoiceItemNumber: vm.invoiceItemNumberDocument >= 1 ?
            vm.invoiceItemNumberDocument : vm.comprobantesListValid.length + 1,
          idAffiliate: vm.solicitud.documentLiquidation.idAffiliate,
          anio: vm.solicitud.documentLiquidation.anio,
          documentControlNumber: vm.solicitud.documentLiquidation.documentControlNumber
        })
      })

      return list;
    }

    function _mapReqComprobanteService() {
      return _.assign({}, {
        rucNumber: vm.frmComprobanteData.rucNumber,
        rucDescription: vm.frmComprobanteData.rucDescription,
        documentTypeReceived: vm.frmComprobanteData.documentType.codeField,
        providerDocumentDate: vm.frmComprobanteData.date.model,
        documentNumberReceived: vm.frmComprobanteData.documentNumber,
        amountDocumentProvider: vm.solicitud.documentLiquidation.amountDocumentProvider,
        invoiceItemNumber: vm.invoiceItemNumberDocument >= 1 ?
          vm.invoiceItemNumberDocument : vm.comprobantesListValid.length + 1,
        anio: vm.solicitud.documentLiquidation.anio,
        documentControlNumber: vm.solicitud.documentLiquidation.documentControlNumber
      })
    }

    function _mapObjRequest() {
      return _.assign({}, {
        sinisterAnio: vm.solicitud.additionalData.sinisterAnio,
        documentControlNumber: vm.solicitud.additionalData.documentControlNumber,
        beneficiaryCorrelativeNumber: vm.solicitud.afiliate.beneficiaryCorrelativeNumber,
        beneficiaryCompensationCode: vm.solicitud.coverage.code
      });
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReSoatTwoController', ReSoatTwoController)
    .component('reSoatTwo', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepTwo/soat/soatTwo.html',
      controller: 'ReSoatTwoController as $ctrl',
      binding: {}
    });
});
