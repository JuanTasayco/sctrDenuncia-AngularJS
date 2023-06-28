'use strict';

define(['angular', 'lodash', 'constants'], function(ng, _, constants) {
  RePermanentDisabilityModalController.$inject = ['reFactory', '$log', '$window', '$q', 'reServices', 'mModalAlert'];

  function RePermanentDisabilityModalController(reFactory, $log, $window, $q, reServices, mModalAlert) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.cerrar = cerrar;
    vm.aceptar = aceptar;
    vm.addCompensation = addCompensation;
    vm.calculationCompensation = calculationCompensation;
    vm.deleteCompensation = deleteCompensation;
    vm.editCompensation = editCompensation;
    vm.cleanCompensation = cleanCompensation;
    vm.getDiagnosticList = getDiagnosticList;

    function onInit() {
      vm.isEditFlow = vm.isCurrentEdit || false;

      _getSpecialityList();
      _getParentescoList();
      _setLookupSelect();

      vm.frmCoverage = vm.isEditFlow
        ? _.assign({}, _mapEditForm(vm.frmData))
        : _.assign(
            {},
            {
              birthDate: new reFactory.common.DatePicker(),
              diagnostic: vm.diagnostic
            }
          );
      vm.frmCoverage.referenceSecuence = 1;
    }

    function onChanges(changes) {
      if (changes.frmData) {
        vm.frmCoverage = _.assign({}, vm.frmCoverage, vm.frmData, {
          benefitImport: vm.frmData.benefitImport || ''
        });
      }
    }

    function cleanCompensation() {
      _mapInitForm();
    }

    function addCompensation() {
      if (vm.frmModal.$invalid) {
        vm.frmModal.markAsPristine();
        return void 0;
      }

      var serviceData = {
        request: _mapRequestAdd(vm.frmCoverage),
        serviceName: vm.isEditFlow ? 'UpdatePermanentDisability' : 'SavePermanentDisability'
      };
      _mapInitForm();
      vm.frmModal.$setPristine();
      vm.callSave(serviceData);
    }

    function calculationCompensation() {
      var serviceData = {
        request:
          vm.isConnectedDb && vm.documentLiquidationData && vm.documentLiquidationData.documentControlNumber
            ? _mapRequestCalculationConnected()
            : _mapRequestCalculationDisconnected(),
        serviceName:
          vm.isConnectedDb && vm.documentLiquidationData && vm.documentLiquidationData.documentControlNumber
            ? 'CalculationForPermanentDisability'
            : 'CalculationForPermanentDisabilityOff'
      };
      vm.callCalculation(serviceData);
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
      vm.callDelete(data);
    }

    function editCompensation(item) {
      vm.isEditFlow = true;
      vm.frmCoverage = _mapEditForm(item);
    }

    function cerrar() {
      vm.closeModal();
    }

    function aceptar() {
      vm.closeModal({
        status: 'ok'
      });
    }

    // privates

    function _mapInitForm(frmData) {
      vm.isEditFlow = false;
      vm.frmCoverage = _.assign({}, frmData, {
        birthDate:
          _.keys(frmData).length > 0
            ? new reFactory.common.DatePicker(new Date(frmData.birthDate))
            : new reFactory.common.DatePicker(),
        diagnostic: vm.diagnostic
      });
    }

    function _mapRequestCalculationConnected() {
      return _.assign(
        {},
        {
          pctngBeneficiaryParticipation: vm.frmCoverage.pctngBeneficiaryParticipation,
          compensationCorrelativeNumber: vm.frmCoverage.compensationCorrelativeNumber || 0
        }
      );
    }

    function _mapRequestCalculationDisconnected() {
      if (vm.compensationList.length < 1) {
        return {
          permanentDisabilityPercentages: [
            {
              pctngBeneficiaryParticipation: vm.frmCoverage.pctngBeneficiaryParticipation,
              index: 1,
              selected: true
            }
          ]
        };
      } else {
        var arrItems = _.map(vm.compensationList, function(item) {
          return {
            pctngBeneficiaryParticipation:
              vm.frmCoverage.index === item.index
                ? vm.frmCoverage.pctngBeneficiaryParticipation
                : item.pctngBeneficiaryParticipation,
            index: item.index,
            selected: vm.frmCoverage.index === item.index
          };
        });

        return {
          permanentDisabilityPercentages: vm.isEditFlow
            ? arrItems
            : arrItems.concat({
                pctngBeneficiaryParticipation: vm.frmCoverage.pctngBeneficiaryParticipation,
                index: vm.compensationList[vm.compensationList.length - 1].index + 1,
                selected: true
              })
        };
      }
    }

    function _mapRequestAdd(frm) {
      return _.assign(
        {},
        {
          benefitImport: frm.benefitImport,
          birthdate: frm.birthDate.model,
          compensationCorrelativeNumber: frm.compensationCorrelativeNumber || null,
          diagnosticCode: frm.diagnostic.code,
          documentNumber: frm.documentNumber,
          documentType: frm.documentType.codeField,
          index: frm.index || null,
          lastName: frm.lastName,
          medicalSpecialityId: frm.specialty.idSpecialty,
          motherLastName: frm.motherLastName,
          names: frm.names,
          pctngBeneficiaryParticipation: frm.pctngBeneficiaryParticipation,
          relationshipCodeOfBeneficiary: frm.parentesco.idBeneficiary,
          sex: frm.sex.codeField,
          treatingDoctor: frm.treatingDoctor
        }
      );
    }

    function _mapEditForm(data) {
      return _.assign(
        {},
        {
          benefitImport: data.benefitImport,
          birthDate: new reFactory.common.DatePicker(new Date(data.birthdate)),
          compensationCorrelativeNumber: data.compensationCorrelativeNumber,
          diagnostic: {
            item: data.diagnosticCode
          },
          documentNumber: data.documentNumber,
          documentType: {
            codeField: data.documentType
          },
          index: data.index || null,
          lastName: data.lastName,
          motherLastName: data.motherLastName,
          names: data.names,
          parentesco: {
            idBeneficiary: data.relationshipCodeOfBeneficiary
          },
          pctngBeneficiaryParticipation: data.pctngBeneficiaryParticipation,
          sex: {
            codeField: data.sex
          },
          specialty: {
            idSpecialty: data.medicalSpecialityId
          },
          treatingDoctor: data.treatingDoctor
        }
      );
    }

    function _setLookupSelect() {
      var tableNameSex = 'Sex';
      var tableNameDocumentType = 'DocumentType';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.sexList = _.filter(lookUpsData, function(item) {
        return item.tableNameField === tableNameSex;
      });
      vm.documentTypeList = _.filter(lookUpsData, function(item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }

    function _getSpecialityList() {
      reFactory.solicitud
        .GetSpecialtyList()
        .then(function(res) {
          vm.specialtyList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getParentescoList() {
      reFactory.solicitud
        .GetBeneficiaryList()
        .then(function(res) {
          vm.parentescoList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function getDiagnosticList(input) {
      if (input && input.length >= 3) {
        var criteria = {
          diagnosticName: input.toUpperCase()
        };

        var defer = $q.defer();
        reFactory.solicitud.GetDiagnosticList(criteria).then(
          function(res) {
            defer.resolve(res.data.items);
          },
          function(err) {
            mModalAlert.showError(err.data.message, 'Error');
          }
        );

        return defer.promise;
      }
    }
    vm.showNaturalPerson = function(item) {
      vm.frmCoverage.documentNumber = '';
      vm.docNumMaxLength = reServices.funDocNumMaxLength(item.codeField);
    };
  }

  return ng
    .module('appReembolso')
    .controller('RePermanentDisabilityModalController', RePermanentDisabilityModalController)
    .component('rePermanentDisabilityModal', {
      templateUrl:
        '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/invalidez-permanente-modal/invalidez-permanente-modal.html',
      controller: 'RePermanentDisabilityModalController as $ctrl',
      bindings: {
        callCalculation: '<',
        callDelete: '<',
        callList: '<',
        callSave: '<',
        closeModal: '<',
        compensationList: '<',
        frmData: '<',
        isConnectedDb: '<',
        isCurrentEdit: '<?',
        documentLiquidationData: '<?',
        diagnostic: '<?'
      }
    });
});
