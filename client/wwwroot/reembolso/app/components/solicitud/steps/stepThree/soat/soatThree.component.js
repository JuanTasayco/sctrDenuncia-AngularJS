'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'reConstants'], function(ng, _, ReembolsoActions, reConstants) {
  ReSoatThreeController.$inject = [
    '$scope',
    'reFactory',
    'reServices',
    '$ngRedux',
    '$uibModal',
    '$state',
    'mModalAlert',
    '$log'
  ];

  function ReSoatThreeController($scope, reFactory, reServices, $ngRedux, $uibModal, $state, mModalAlert, $log) {
    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.formatDateToSlash = formatDateToSlash;
    vm.editCompensation = editCompensation;
    vm.deleteCompensation = deleteCompensation;
    vm.addCompensation = addCompensation;
    vm.editComprobanteStepThree = editComprobanteStepThree;
    vm.solicitude = solicitude;
    vm.listFile = listFile;
    vm.getSumTotalList = getSumTotalList;
    vm.goToStepOne = goToStepOne;

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, ReembolsoActions)(vm);

      vm.codeUploadFile = reConstants.codeUploadFile.otrosAdjuntos;
      vm.listFileToShow = [];

      _validateInit();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        compensationList: state.solicitud.coverageCompensations ? ng.copy(state.solicitud.coverageCompensations) : [],
        comprobantesList: state.solicitud.comprobantesList ? ng.copy(state.solicitud.comprobantesList) : [],
        solicitud: ng.copy(state.solicitud)
      };
    }

    function formatDateToSlash(date) {
      return reServices.formatDateToSlash(date);
    }

    function editCompensation(item) {
      _showCoveragesModalForm(item, true);
    }

    function editComprobanteStepThree() {
      $state.go('.', {
        step: 2
      });
    }

    function deleteCompensation(serviceData) {
      var data = {
        request: {
          compensationCorrelativeNumber: serviceData.compensationCorrelativeNumber,
          compensationStatus: serviceData.compensationStatus,
          index: serviceData.index
        },
        serviceName: serviceData.serviceName
      };

      var request =
        vm.solicitud.additionalData.isCallToDb &&
        vm.solicitud.documentLiquidation &&
        vm.solicitud.documentLiquidation.documentControlNumber
          ? _.assign({}, _mapObjRequest(), data.request)
          : _.assign({}, data.request);

      vm.solicitud.additionalData.isCallToDb &&
      vm.solicitud.documentLiquidation &&
      vm.solicitud.documentLiquidation.documentControlNumber
        ? _deleteConnected(data.serviceName, request)
        : _deleteDisconnected(request);
    }

    function addCompensation() {
      if (vm.solicitud.documentLiquidation && vm.solicitud.documentLiquidation.documentControlNumber) {
        return void 0;
      }

      _showCoveragesModalForm();
    }

    function listFile(arr) {
      vm.listFileLength = arr.length;
    }

    function solicitude() {
      if (vm.listFileLength > 0) {
        if (!vm.solicitud.additionalData.isCallToDb) {
          var request;
          var serviceSolicitude;

          switch (vm.solicitud.coverage.code) {
            case '3111  ':
              request = _mapRequestTemporaryDisability(_mapFinishRequestDisconnected);
              serviceSolicitude = 'SaveSolicitudeDisconnectedTemporary';
              break;
            case '3110  ':
              request = _mapRequestPermanentDisability(_mapFinishRequestDisconnected);
              serviceSolicitude = 'SaveSolicitudeDisconnectedPermanent';
              break;
            case '3109  ':
              request = _mapRequestAccidentalDeath(_mapFinishRequestDisconnected);
              serviceSolicitude = 'SaveSolicitudeDisconnectedAccidental';
              break;
            case '3113  ':
              request = _mapRequestSepelio(_mapFinishRequestDisconnected);
              serviceSolicitude = 'SaveSolicitudeDisconnectedSepelio';
              break;
            case '3112  ':
              request = _mapRequestSepelio(_mapFinishRequestDisconnected);
              serviceSolicitude = 'SaveSolicitudeDisconnectedCuracion';
              break;
            default:
              return void 0;
          }

          var service = reFactory.solicitud[serviceSolicitude];
          service(request)
            .then(function(res) {
              _showResponseModal(res);
            })
            .catch(function(err) {
              $log.error('Fallo en el servidor', err);
            });
        } else if (
          vm.solicitud.additionalData.isCallToDb &&
          (vm.solicitud.documentLiquidation === undefined ||
            vm.solicitud.documentLiquidation.documentControlNumber === undefined)
        ) {
          var request;
          var serviceSolicitude;

          switch (vm.solicitud.coverage.code) {
            case '3111  ':
              request = _mapRequestTemporaryDisability(_mapFinishRequestOn);
              serviceSolicitude = 'SaveSolicitudeTemporaryOn';
              break;
            case '3110  ':
              request = _mapRequestPermanentDisability(_mapFinishRequestOn);
              serviceSolicitude = 'SaveSolicitudePermanentOn';
              break;
            case '3109  ':
              request = _mapRequestAccidentalDeath(_mapFinishRequestOn);
              serviceSolicitude = 'SaveSolicitudeAccidentalOn';
              break;
            case '3113  ':
              request = _mapRequestSepelio(_mapFinishRequestOn);
              serviceSolicitude = 'SaveSolicitudeSepelioOn';
              break;
            case '3112  ':
              request = _mapRequestSepelio(_mapFinishRequestOn);
              serviceSolicitude = 'SaveSolicitudeCuracionOn';
              break;
            default:
              return void 0;
          }

          var service = reFactory.solicitud[serviceSolicitude];
          service(request)
            .then(function(res) {
              _showResponseModal(res);
            })
            .catch(function(err) {
              $log.error('Fallo en el servidor', err);
            });
        } else {
          if (
            vm.solicitud.coverage.code === reConstants.coverages.gastosSepelio ||
            vm.solicitud.coverage.code === reConstants.coverages.gastosCuracion
          ) {
            _updateDocumentaryManager();
          } else {
            mModalAlert.showSuccess('¡SOLICITUD DE REEMBOLSO ENVIADA!', '', '').then(function() {
              $state.go('solicitud.init');
            });
          }
        }
      } else {
        mModalAlert.showError('Debes adjuntar por lo menos un archivo', 'Error');
      }
    }

    function getSumTotalList(sum) {
      vm.sumTotalList = sum;
    }

    function goToStepOne() {
      $state.go('.', {
        step: 1
      });
    }

    // privates

    function _validateInit() {
      if (vm.solicitud.coverage) {
        _validateRegularCoverages(
          vm.solicitud.additionalData.isCallToDb &&
            vm.solicitud.documentLiquidation &&
            vm.solicitud.documentLiquidation.documentControlNumber
        );
        _validateGastosCoverages(
          vm.solicitud.additionalData.isCallToDb &&
            vm.solicitud.documentLiquidation &&
            vm.solicitud.documentLiquidation.documentControlNumber
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
        _getServiceListName();
        _getAttachmentsTemplate();
        isConnectedToDb && _getComprobantesListService();
      }
    }

    function _validateRegularCoverages(isConnectedToDb) {
      if (
        vm.solicitud.coverage.code !== reConstants.coverages.gastosSepelio &&
        vm.solicitud.coverage.code !== reConstants.coverages.gastosCuracion
      ) {
        _getServiceListName();
        _getAttachmentsTemplate();
        isConnectedToDb && _getListService();
      }
    }

    function _showResponseModal(response) {
      response.isValid
        ? $uibModal.open({
            backdrop: false,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            templateUrl: '/reembolso/app/components/solicitud/steps/stepThree/response-modal.html',
            controller: [
              '$scope',
              '$uibModalInstance',
              function(scope, $uibModalInstance) {
                scope.title = response.brokenRulesCollection[0].description;
                scope.listData = response.data;
                scope.soatDisclaimer =
                  '"Toda solicitud queda sujeta a revisión y aprobación por el área de Siniestros de SOAT"';
                scope.showDisclaimer = true;
                scope.close = function(ev) {
                  ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
                };
                scope.goToInit = function() {
                  $state.go('solicitud.init');
                };
              }
            ]
          })
        : mModalAlert.showError(response.brokenRulesCollection[0].description, 'Error').then(function(res) {
            res && $state.go('solicitud.init');
          });
    }

    function _getServiceListName() {
      switch (vm.solicitud.coverage.code) {
        case reConstants.coverages.temporaryDisability:
          vm.serviceNameList = 'GetTemporaryDisabilityList';
          vm.serviceNameTemplate = 'GetTemporaryDisabilityTemplate';
          break;
        case reConstants.coverages.permanentDisability:
          vm.serviceNameList = 'GetPermanentDisabilityList';
          vm.serviceNameTemplate = 'GetPermanentDisabilityTemplate';
          break;
        case reConstants.coverages.accidentalDeath:
          vm.serviceNameList = 'GetAccidentalDeathList';
          vm.serviceNameTemplate = 'GetAccidentalDeathTemplate';
          break;
        case reConstants.coverages.gastosSepelio:
          vm.serviceNameTemplate = 'GetGastosSepelioTemplate';
          break;
        case reConstants.coverages.gastosCuracion:
          vm.serviceNameTemplate = 'GetGastosCuracionTemplate';
          break;
        default:
          return void 0;
      }
    }

    function _getListService() {
      var request = _.assign({}, _mapObjRequest());
      var service = reFactory.solicitud[vm.serviceNameList];
      service(request)
        .then(function(res) {
          vm.compensationList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function _getComprobantesListService() {
      var request = {
        liquidationCorrelativeNumber: 1,
        sinisterNumberRef: vm.solicitud.additionalData.sinisterNumberRef,
        anio: vm.solicitud.documentLiquidation.anio,
        documentControlNumber: vm.solicitud.documentLiquidation.documentControlNumber
      };

      reFactory.solicitud
        .GetComprobantesList(request)
        .then(function(res) {
          vm.comprobantesList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function _showCoveragesModalForm(data, edit) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template:
          '<re-coverages-modal-form close="close" data="data" compensation-list="$ctrl.compensationList" is-current-edit="edit"></re-coverages-modal-form>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.edit = edit;
            scope.data = data;
            scope.close = function(ev) {
              ev && ev.status === 'ok' ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _deleteConnected(serviceName, request) {
      var service = reFactory.solicitud[serviceName];
      service(request)
        .then(function() {
          _getListService();
        })
        .catch(function(err) {
          $log.error('Servidor', err);
        });
    }

    function _deleteDisconnected(request) {
      vm.reduxCoverageCompensationDelete(request.index);
    }

    function _getAttachmentsTemplate() {
      var service = reFactory.solicitud[vm.serviceNameTemplate];
      service()
        .then(function(res) {
          vm.htmlTemplate = res.isValid ? res.data : '<div>No Template</div>';
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _updateDocumentaryManager() {
      var request = {
        anio: vm.solicitud.additionalData.sinisterAnio,
        documentControlNumber: vm.solicitud.documentLiquidation.documentControlNumber,
        filePowerSq: vm.solicitud.additionalData.identificatorImageCode
      };

      reFactory.solicitud
        .UploadFileDocumentaryManager(request)
        .then(function(res) {
          mModalAlert.showSuccess('¡SOLICITUD DE REEMBOLSO ENVIADA!', '', '').then(function() {
            $state.go('solicitud.init');
          });
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _mapObjRequest() {
      return _.assign(
        {},
        {
          sinisterAnio: vm.solicitud.additionalData.sinisterAnio,
          documentControlNumber: vm.solicitud.additionalData.documentControlNumber,
          beneficiaryCorrelativeNumber: vm.solicitud.afiliate.beneficiaryCorrelativeNumber,
          beneficiaryCompensationCode: vm.solicitud.coverage.code
        }
      );
    }

    function _mapRequestTemporaryDisability(fnRequestBase) {
      return _.assign({}, fnRequestBase(), {
        rqTemporaryDisabilityDtos: _.map(vm.compensationList, function(item) {
          return _.assign(
            {},
            {
              benefitDateEnd: item.benefitDateEnd,
              benefitDateStart: item.benefitDateStart,
              benefitNumberDays: item.benefitNumberDays,
              compensationAmount: item.compensationAmount,
              salaryMinimun: item.salaryMinimun,
              uitValue: item.uitValue
            }
          );
        })
      });
    }

    function _mapRequestPermanentDisability(fnRequestBase) {
      return _.assign({}, fnRequestBase(), {
        rqPermanentDisabilityDtos: _.map(vm.compensationList, function(item) {
          return _.assign(
            {},
            {
              benefitImport: item.benefitImport,
              birthdate: item.birthdate,
              diagnosticCode: item.diagnosticCode,
              documentNumber: item.documentNumber,
              documentType: item.documentType,
              lastName: item.lastName,
              medicalSpecialityId: item.medicalSpecialityId,
              motherLastName: item.motherLastName,
              names: item.names,
              pctngBeneficiaryParticipation: parseFloat(item.pctngBeneficiaryParticipation),
              relationshipCodeOfBeneficiary: item.relationshipCodeOfBeneficiary,
              sex: item.sex,
              treatingDoctor: item.treatingDoctor
            }
          );
        })
      });
    }

    function _mapRequestAccidentalDeath(fnRequestBase) {
      return _.assign({}, fnRequestBase(), {
        rqAccidentalDeathDtos: _.map(vm.compensationList, function(item) {
          return _.assign(
            {},
            {
              benefitImport: item.benefitImport,
              birthdate: item.birthdate,
              documentNumber: item.documentNumber,
              documentType: item.documentType,
              lastName: item.lastName,
              motherLastName: item.motherLastName,
              names: item.names,
              pctngBeneficiaryParticipation: parseFloat(item.pctngBeneficiaryParticipation),
              relationshipCodeOfBeneficiary: item.relationshipCodeOfBeneficiary,
              sex: item.sex
            }
          );
        })
      });
    }

    function _mapRequestSepelio(fnRequestBase) {
      return _.assign({}, fnRequestBase(), {
        amountDocumentProvider: vm.solicitud.documentLiquidation.amountDocumentProvider,
        rqPreLiquidationDto: {
          kindOfPerson: vm.solicitud.extraBeneficiaryData.kindOfPerson,
          documentType: vm.solicitud.extraBeneficiaryData.documentType,
          documentNumber: vm.solicitud.extraBeneficiaryData.documentNumber,
          lastName: vm.solicitud.extraBeneficiaryData.lastName,
          motherLastName: vm.solicitud.extraBeneficiaryData.motherLastName,
          firstName: vm.solicitud.extraBeneficiaryData.firstName,
          liquidationType: vm.solicitud.extraBeneficiaryData.liquidationType,
          fullName: vm.solicitud.extraBeneficiaryData.fullName
        },
        rqInvoicePreLiquidationDto: _.map(vm.comprobantesList, function(item) {
          return _.assign(
            {},
            {
              invoiceItemNumber: item.invoiceItemNumber,
              rucNumber: item.rucNumber,
              rucDescription: item.rucDescription,
              documentTypeReceived: item.documentType.codeField,
              providerDocumentDate: item.date.model,
              invoiceSaleValue: item.invoiceTotalValue,
              invoiceTotalValue: item.invoiceTotalValue,
              rqPreLiquidationProcedureDtos: _.map(item.procedimientos, function(procedure) {
                return _.assign(
                  {},
                  {
                    invoiceProcedureItemNumber: procedure.invoiceProcedureItemNumber,
                    medicId: 1,
                    procedureCode: procedure.code,
                    qtyProceduresMade: 1,
                    saleValue: procedure.importe,
                    diagnosticCode: procedure.diagnostic.code,
                    benefitCode: vm.solicitud.coverage.code,
                    treatmentBeginDate: procedure.treatmentDate.model
                  }
                );
              })
            }
          );
        })
      });
    }

    function _mapFinishRequestDisconnected() {
      return _.assign(
        {},
        {
          rqDocumentDto: {
            sinisterDate: vm.solicitud.sinister.date,
            liquidationReceptionDocumentDate: vm.solicitud.presentationsDocumentsDate,
            denunciationDate: vm.solicitud.complaint.date,
            idCustomer: vm.solicitud.solicitudData.client.id,
            customerContractNumber: vm.solicitud.solicitudData.contractNumber,
            idCause: vm.solicitud.sinister.causa,
            idPlan: vm.solicitud.solicitudData.plan.id,
            productCode: vm.solicitud.product.code
          },
          rqSinisterTronDto: {
            notificationDate: vm.solicitud.notification.date,
            idConsequence: 0,
            policyNumber: vm.solicitud.additionalData.policyNumber,
            licensePlate: vm.solicitud.additionalData.licensePlate,
            departmentCode: vm.solicitud.sinister.department,
            idProvince: vm.solicitud.sinister.province,
            idDistrict: vm.solicitud.sinister.district,
            idProvider: vm.solicitud.additionalData.idProvider
          },
          rqSinisterBeneficiaryDto: {
            lastName: vm.solicitud.afiliate.lastName,
            motherLastName: vm.solicitud.afiliate.motherLastName,
            firstName: vm.solicitud.afiliate.firstName,
            secondName: vm.solicitud.afiliate.secondName,
            birthdate: vm.solicitud.afiliate.birthdate,
            sex: vm.solicitud.afiliate.sex,
            documentType: vm.solicitud.afiliate.documentType,
            documentNumber: vm.solicitud.afiliate.documentNumber,
            attentionType: vm.solicitud.afiliate.attentionType,
            injuredType: vm.solicitud.afiliate.injuredType,
            injuryType: vm.solicitud.afiliate.injuryType,
            departmentCode: vm.solicitud.afiliate.departmentCode,
            idProvince: vm.solicitud.afiliate.idProvince,
            idDistrict: vm.solicitud.afiliate.idDistrict
          },
          rqSinisterBeneficiaryExtendDto: {
            email: vm.solicitud.notification.email,
            phone: vm.solicitud.notification.cellphone
          },
          beneficiaryCompensationCode: vm.solicitud.coverage.code,
          filePowerSq: vm.solicitud.additionalData.identificatorImageCode
        }
      );
    }

    function _mapFinishRequestOn() {
      return _.assign(
        {},
        {
          rqDocumentOnDto: {
            idCompany: vm.solicitud.company.id,
            sinisterDate: vm.solicitud.sinister.date,
            liquidationReceptionDocumentDate: vm.solicitud.presentationsDocumentsDate,
            idCustomer: vm.solicitud.solicitudData.client.id,
            customerContractNumber: vm.solicitud.solicitudData.contractNumber,
            idPlan: vm.solicitud.solicitudData.plan.id,
            productCode: vm.solicitud.product.code,
            idCause: vm.solicitud.sinister.causa,
            denunciationDate: vm.solicitud.complaint.date,
            sinisterNumberRef: vm.solicitud.additionalData.sinisterNumberRef,
            idMoney: vm.solicitud.afiliate.idMoney,
            expedientType: vm.solicitud.additionalData.expedientType,
            anio: vm.solicitud.afiliate.anio,
            documentControlNumber: vm.solicitud.additionalData.documentControlNumber
          },
          rqSinisterBeneficiaryExtendDto: {
            email: vm.solicitud.notification.email,
            phone: vm.solicitud.notification.cellphone
          },
          rqBeneficiaryAffiliateOnDto: {
            idAffiliate: vm.solicitud.afiliate.idAffiliate,
            correlativeNumber: vm.solicitud.afiliate.correlativeNumber
          },
          sinisterNumber: vm.solicitud.additionalData.sinisterNumber,
          beneficiaryCompensationCode: vm.solicitud.coverage.code,
          diagnosticCode: vm.solicitud.solicitudData.diagnostic.code,
          filePowerSq: vm.solicitud.additionalData.identificatorImageCode
        }
      );
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReSoatThreeController', ReSoatThreeController)
    .component('reSoatThree', {
      templateUrl: '/reembolso/app/components/solicitud/steps/stepThree/soat/soatThree.html',
      controller: 'ReSoatThreeController',
      binding: {}
    });
});
