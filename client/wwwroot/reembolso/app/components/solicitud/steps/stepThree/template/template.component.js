'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function (ng, _, ReembolsoActions, reConstants) {
  ReTemplateStepThreeController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    'mModalAlert',
    '$log'
  ];

  function ReTemplateStepThreeController(
    $scope,
    reFactory,
    reServices,
    $ngRedux,
    $uibModal,
    $state,
    mModalAlert,
    $log
  ) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.editComprobanteStepThree = editComprobanteStepThree;
    vm.goToStepOne = goToStepOne;
    vm.getSumTotalList = getSumTotalList;
    vm.solicitude = solicitude;

    vm.formatDateToSlash = formatDateToSlash;
    vm.listFile = listFile;

    function onInit() {
      try {
        actionsRedux = $ngRedux.connect(
          mapStateToThis,
          ReembolsoActions
        )(vm);

        _validateInit();
        _serviceDisclaimer();
        vm.codeUploadFile = reConstants.codeUploadFile.otrosAdjuntos;
      } catch (err) {
        $state.go('solicitud.init');
      }
    }

    function _validateInit() {
      if (!vm.solicitud) {
        $state.go('solicitud.init');
      }

      if (vm.currentFlow.salud || vm.currentFlow.sctr) {
        if (!vm.comprobantesList || vm.comprobantesList.length === 0) {
          $state.go('.', {
            step: 2
          })
        }
      }
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        comprobantesList: state.solicitud.comprobantesList ?
          ng.copy(state.solicitud.comprobantesList) : [],
        solicitud: ng.copy(state.solicitud)
      };
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }

    function editComprobanteStepThree() {
      $state.go('.', {
        step: 2
      })
    }

    function listFile(arr) {
      vm.listFileLength = arr.length;
    }

    function goToStepOne() {
      $state.go('.', {
        step: 1
      })
    }

    function getSumTotalList(sum) {
      vm.sumTotalList = sum;
    }

    function solicitude() {
      var requestService;

      if (vm.currentFlow.personalAccidents) {
        requestService = _mapFinishRequestPersonalAccidents();
      } else if (vm.currentFlow.medicalAssistance) {
        requestService = _mapFinishRequestMedicalAssistance();
      } else if (vm.currentFlow.salud || vm.currentFlow.sctr) {
        requestService = _mapRequestSalud();
      }

      vm.onSolicitude(requestService);
    }

    // privates

    function _serviceDisclaimer() {
      var service = _getServiceNameTemplate();
      reFactory.solicitud[service]()
        .then(function(res) {
          vm.htmlTemplate = res.isValid ? res.data : '<div>No Template</div>';
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

    function _getServiceNameTemplate() {
      var serviceName;

      if (vm.solicitud.company.id === reConstants.products.medicalAssistance.companyCode && vm.solicitud.product.code === reConstants.products.medicalAssistance.productCode) {
        serviceName = 'GetMedicalAssistanceTemplate';
      } else if (vm.solicitud.company.id === reConstants.products.salud.companyCode && vm.solicitud.product.code === reConstants.products.salud.productCode) {
        serviceName = 'GetRegularHealthTemplate';
      } else if (vm.solicitud.company.id === reConstants.products.sctr.companyCode && vm.solicitud.product.code === reConstants.products.sctr.productCode) {
        serviceName = 'GetSctrTemplate';
      } else if (vm.solicitud.company.id === reConstants.products.personalAccidents.companyCode && vm.solicitud.product.code === reConstants.products.personalAccidents.productCode) {
        serviceName = 'GetPersonalAccidentsTemplate';
      }

      return serviceName;
    }

    // medicalAssistanceRequest
    function _mapFinishRequestMedicalAssistance() {
      var objExtraReqToDocument = {
        startDateValAffiliation: vm.solicitud.additionalData.treatmentDate
      };

      return _.assign({}, _mapBaseRequest(objExtraReqToDocument), {
        rqSinisterTronDto: {
          idCause: vm.solicitud.solicitudData.benefit.idCause,
          idConsequence: vm.solicitud.solicitudData.benefit.idConsequence,
          expedientType: vm.solicitud.solicitudData.benefit.expedientType,
          policyNumber: vm.solicitud.additionalData.policyNumber
        }
      });
    }

    // personalAccidentsRequest
    function _mapFinishRequestPersonalAccidents() {
      var objExtraReqToDocument = {
        beneficiaryCorrelativeNumber: vm.solicitud.solicitudData.beneficiaryCorrelativeNumber,
        expedientType: vm.solicitud.solicitudData.benefit.expedientType,
        idCommercialOffice: vm.solicitud.solicitudData.idCommercialOffice,
        sinisterDate: vm.solicitud.additionalData.sinisterDate,
        sinisterNumberRef: vm.solicitud.solicitudData.sinisterNumberRef
      };

      return _.assign({}, _mapBaseRequest(objExtraReqToDocument), {
        policyNumber: vm.solicitud.additionalData.policyNumber,
        idAffiliateTemporary: vm.solicitud.additionalData.idAffiliateTemporary
      });
    }

    function _mapBaseRequest(objProductDocument) {
      return _.assign({}, {
        benefitCode: vm.solicitud.solicitudData.benefit.benefitCode,
        filePowerSq: vm.solicitud.additionalData.identificatorImageCode,
        rqDocumentDto: _mapDocumentDto(objProductDocument),
        rqInvoicePreLiquidationDto: _mapInvoiceItems()
      })
    }

    function _mapDocumentDto(objProductDocument) {
      return _.assign({}, objProductDocument, {
        amountDocumentProvider: vm.solicitud.solicitudData.totalComprobantesImport,
        idAffiliate: vm.solicitud.afiliate.idAffiliate,
        idCustomer: vm.solicitud.solicitudData.client.id,
        customerContractNumber: vm.solicitud.solicitudData.contractNumber.id || vm.solicitud.solicitudData.contractNumber,
        idPlan: vm.solicitud.solicitudData.plan.id,
        idRelationship: vm.solicitud.solicitudData.relationship.id,
        idAffiliateVinculation: vm.solicitud.solicitudData.afiliateTitular.id,
        idCompany: vm.solicitud.company.id,
        idBroker: vm.solicitud.solicitudData.idBroker
      })
    }

    function _mapInvoiceItems() {
      return _.map(vm.comprobantesList, function (comprobante) {
        return _.assign({}, {
          invoiceItemNumber: comprobante.invoiceItemNumber,
          // idCompany: (vm.currentFlow.salud || vm.currentFlow.sctr) ? vm.solicitud.company.id : null,
          idCompany: vm.solicitud.company.id,
          rucNumber: comprobante.rucNumber,
          rucDescription: comprobante.rucDescription,
          documentTypeReceived: (vm.currentFlow.salud || vm.currentFlow.sctr) ? comprobante.documentType.codeField : comprobante.documentType.codeField,
          providerDocumentDate: comprobante.date.model,
          invoiceSaleValue: comprobante.invoiceTotalValue,
          documentNumberReceived: comprobante.documentSerialNumber + comprobante.documentNumberWithoutSerie,
          invoiceTotalValue: comprobante.invoiceTotalValue,
          rqPreLiquidationProcedureDtos: _.map(comprobante.procedimientos, function (procedure) {
            return _.assign({}, {
              invoiceProcedureItemNumber: procedure.invoiceProcedureItemNumber,
              procedureCode: procedure.code,
              saleValue: procedure.importe,
              diagnosticCode: procedure.diagnostic.code,
              treatmentBeginDate: procedure.treatmentDate.model,
              rqPreLiquidationMedicineDtos: _.map(procedure.farmacos, function (farmaco) {
                return _.assign({}, {
                  invoiceItemNumber: comprobante.invoiceItemNumber,
                  invoiceProcedureItemNumber: procedure.invoiceProcedureItemNumber,
                  invoiceMedicamentItemNumber: farmaco.code,
                  saleValue: farmaco.import
                })
              })
            })
          })
        })
      });
    }

    function _mapRequestSalud() {
      return _.assign({}, _mapFinishSaludRequestDisconnected(), {
        rqInvoicePreLiquidationDtos: _mapInvoiceItems(),
        filePowerSq: vm.solicitud.additionalData.identificatorImageCode
      })
    }

    function _mapFinishSaludRequestDisconnected() {
      return _.assign({}, {
        rqDocumentDto: {
          treatmentDate: vm.solicitud.treatment.date,
          idAffiliate: vm.solicitud.solicitudData.afiliate.id,
          beneficiaryCompensationCode: vm.solicitud.solicitudData.benefit.code,
          idCompany: vm.solicitud.company.id,
          amount: vm.solicitud.treatment.amountProvider,
          productCode: vm.solicitud.product.code,
          idPlan: vm.solicitud.solicitudData.plan.idPlan,
          idClient: vm.solicitud.solicitudData.idClient,
          idContract: vm.solicitud.solicitudData.contractNumber,
          idAffiliateLinked: vm.solicitud.solicitudData.idAffiliateLinked,
          idRelationship: vm.solicitud.solicitudData.relationship.idRelationship
        }
      })
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReTemplateStepThreeController', ReTemplateStepThreeController)
    .component('reTemplateStepThree', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepThree/template/template.html',
      controller: 'ReTemplateStepThreeController',
      bindings: {
        currentFlow: '<',
        onSolicitude: '<'
      }
    });
});
