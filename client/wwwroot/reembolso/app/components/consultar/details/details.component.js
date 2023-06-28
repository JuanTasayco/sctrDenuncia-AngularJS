'use strict';

define(['angular', 'ReembolsoActions', 'lodash', 'reConstants'], function (ng, ReembolsoActions, _, reConstants) {
  InitDetailReembolsoController.$inject = [
    'reFactory',
    '$ngRedux',
    '$uibModal',
    '$state',
    '$window',
    'reServices',
    '$log',
    'mModalAlert'
  ];

  function InitDetailReembolsoController(
    reFactory,
    $ngRedux,
    $uibModal,
    $state,
    $window,
    reServices,
    $log,
    mModalAlert
  ) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.fnModalCombrobante = eventModalCombrobante;
    vm.proceduresNameList = proceduresNameList;
    vm.listFile = listFile;
    vm.formatDate = formatDate;
    vm.formatComprobante = formatComprobante;
    vm.mapNameProcedures = mapNameProcedures;
    vm.raiseObservation = raiseObservation;
    vm.backToBandeja = backToBandeja;
    vm.editItem = editItem;
    vm.cancelComprobante = cancelComprobante;

    // function declaration

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      var data = $state.params.data || ng.fromJson($window.sessionStorage['consulta'])['data'];
      vm.editDetail = $state.params.edit || ng.fromJson($window.sessionStorage['consulta'])['edit'];
      vm.documentData = ng.copy(data);
      vm.codeUploadFile = reConstants.codeUploadFile.pagoComprobantes;
      vm.codeUploadFileOtrosAdjuntos = reConstants.codeUploadFile.otrosAdjuntos;
      vm.codeUploadFileObservados = reConstants.codeUploadFile.siniestroObservado;
      vm.observaciones = '';

      vm.documentData.documentStatusDescription === 'OBSERVADO' ?
        _getDetailsDataObservated(vm.documentData) :
        _getDetailsDataRegular(vm.documentData);
      
        vm.documentData.documentStatusDescription === 'OBSERVADO' && _getMediaSequence();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        consultar: state
      };
    }

    function eventModalCombrobante() {
      var vModalProof = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        templateUrl: 'app/components/detail/popup/controller/popupEditarComprobanteDetail.html',
        controller: [
          '$uibModalInstance',
          function ($uibModalInstance) {
            var vm = this;
            vm.closeModal = function () {
              $uibModalInstance.close();
            };
          }
        ],
        controllerAs: 'vm'
      });
      vModalProof.result.then(
        function () {},
        function () {}
      );
    }

    function proceduresNameList(proceduresList) {
      return _getProceduresNameList(proceduresList);
    }

    function listFile(data) {
      vm.listFileObservated = data.length;
    }

    function formatDate(date) {
      return reServices.formatDateToSlash(date);
    }

    function raiseObservation() {
      reFactory.solicitud
        .UploadObservation({
          anio: vm.detailData.documentObservedRequestDto.anio,
          documentControlNumber: vm.detailData.documentObservedRequestDto.documentControlNumber
        })
        .then(function(res) {
          res.isValid && $window.history.back();
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function backToBandeja() {
      $window.history.back();
    }

    function formatComprobante(serial, number) {
      var zeroNumbers = '';
      if (number.length < 8) {
        var iterationsNumber = 8 - number.length;

        for (var i = 0; i < iterationsNumber; i++) {
          zeroNumbers += '0'
        }
      }

      return serial + '-' + zeroNumbers + number;
    }

    function mapNameProcedures(arrProcedures) {
      var arr = _.map(arrProcedures, function (item) {
        return item.diagnosticDto ? item.diagnosticDto.code : item.diagnostic.code;
      });

      return arr.toString();
    }

    function editItem(item) {
      _setLookupSelect();
      vm.showComprobantes = true;
      vm.frmComprobanteData = _.assign({}, item, {
        documentType: {
          codeField: item.documentTypeReceived
        },
        date: new reFactory.common.DatePicker(new Date(item.providerDocumentDate)),
      });

      vm.proceduresList = _mapProcedureEdit(item.preLiquidationProcedureDtos || item.procedimientos);
    }

    function cancelComprobante() {
      vm.showComprobantes = false;
    }

    // privates

    function _validateInit() {
      $state.params.detailsObserved ? _getDetailsDataObservated() : $state.go('consultar.init');
    }

    function _getMediaSequence() {
      var request = {
        anio: vm.documentData.anio,
        benefitCode: vm.documentData.benefitCode,
        documentControlNumber: vm.documentData.documentControlNumber,
        idAffiliate: vm.documentData.idAffiliate,
        sinisterNumber: vm.documentData.sinisterNumber,
        policyNumber: vm.documentData.policyNumber
      };

      reFactory.solicitud
        .GetNextMedia(request)
        .then(function (res) {
          var identificatorImageCode = res.isValid ? res.data : null;
          vm.additionalData = {
            sinisterNumber: vm.documentData.sinisterNumber,
            policyNumber: vm.documentData.policyNumber,
            identificatorImageCode: identificatorImageCode
          }
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function _getDetailsDataObservated(request) {
      var req = {
        productCode: request.productCode,
        receptionDocumentDate: request.receptionDocumentDate,
        idAffiliate: request.idAffiliate,
        benefitCode: request.benefitCode,
        idCompany: request.idCompany,
        anio: request.anio,
        documentControlNumber: request.documentControlNumber
      };

      reFactory.solicitud
        .GetDocumentObservedDetail(req)
        .then(function (res) {
          if (res.isValid) {
            vm.detailData = res.data;
            vm.detailsObserved = res.isValid ? res.data : {};
            vm.requestData = _.assign({}, vm.requestData, vm.detailsObserved.documentObservedRequestDto);
            // vm.sumTotal = reServices.sumProperty(vm.detailsObserved.invoicePreLiquidationDtos, 'invoiceTotalValue');
            // vm.fileData = _getFileData(vm.detailsObserved, request);
          }
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function _getDetailsDataRegular(request) {
      var req = {
        productCode: request.productCode,
        receptionDocumentDate: request.receptionDocumentDate,
        idAffiliate: request.idAffiliate,
        benefitCode: request.benefitCode,
        idCompany: request.idCompany,
        anio: request.anio,
        documentControlNumber: request.documentControlNumber
      };

      reFactory.solicitud.GetRefundTrayDetailDocumentBy(req)
        .then(function(res) {
          if (res.isValid) {
            vm.detailData = res.data;
            vm.sumImporte = reServices.sumProperty(vm.detailData.invoicePreLiquidationDtos, 'invoiceTotalValue');
          }
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function _getProceduresNameList(proceduresList) {
      var proceduresName = '';

      _.forEach(proceduresList, function (procedure) {
        proceduresName += procedure.procedureDto.description + '/'
      })

      return proceduresName;
    }

    function _setLookupSelect() {
      var tableNameDocumentType = 'DocumentReceived';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.documentTypeList = _.filter(lookUpsData, function(item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }

    function _getFileData(data, extraData) {
      return _.assign({}, {
        additionalData: {
          documentControlNumber: extraData.documentControlNumber,
          identificatorImageCode: data.filePowerEpsDtos[0].filePowerSq,
          policyNumber: data.filePowerEpsDtos[0].policyNumber,
          sinisterAnio: extraData.anio,
          sinisterNumber: data.filePowerEpsDtos[0].sinisterNumber,
        },
        benefitCode: extraData.benefitCode,
        codeFileType: data.filePowerEpsDtos[0].codeFileType,
        idAffiliate: data.filePowerEpsDtos[0].idAffiliate,
        idCompany: data.filePowerEpsDtos[0].companyCod,
        productCode: data.filePowerEpsDtos[0].productCode,
        invoiceItemNumber: data.filePowerEpsDtos[0].invoiceItemNumber
      })
    }

    function _mapProcedureEdit(arrProcedures) {
      return _.map(arrProcedures, function(item) {
        return _.assign(
          {},
          {
            code: item.procedureDto.code,
            description: item.procedureDto.description,
            diagnostic: {
              codeName: item.diagnosticDto.codeAndDescription,
              code: item.diagnosticDto.code,
              name: item.diagnosticDto.longDescription
            },
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
  }

  return ng
    .module('appReembolso')
    .controller('InitDetailReembolsoController', InitDetailReembolsoController)
    .component('reInitDetailReembolso', {
      templateUrl: '/reembolso/app/components/consultar/details/details.html',
      controller: 'InitDetailReembolsoController',
      bindings: {}
    });
});
