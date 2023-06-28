'use strict';

define(['angular', 'lodash', 'constants'], function (ng, _, constants) {
  ReAccidentalDeathModalController.$inject = ['reFactory', '$log', '$window', '$q', 'reServices'];

  function ReAccidentalDeathModalController(reFactory, $log, $window, $q, reServices) {
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
    vm.showNaturalPerson = showNaturalPerson;

    function onInit() {
      vm.isEditFlow = vm.isCurrentEdit || false;
      //vm.callList('GetAccidentalDeathList');

      _setLookupSelect();
      _serviceTemplate();

      vm.frmCoverage = vm.isEditFlow ? _.assign({}, _mapEditForm(vm.frmData)) : _.assign({}, {
        birthDate: new reFactory.common.DatePicker()
      });
      vm.frmCoverage.preferentialSequenceNumber = 1;
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
        serviceName: vm.isEditFlow ? 'UpdateAccidentalDeath' : 'SaveAccidentalDeath'
      }
      _mapInitForm();
      vm.frmModal.$setPristine();
      vm.callSave(serviceData);
    }

    function calculationCompensation() {
      var serviceData = {
        request: vm.isConnectedDb && (vm.documentLiquidationData && vm.documentLiquidationData.documentControlNumber) ? _mapRequestCalculationConnected() : _mapRequestCalculationDisconnected(),
        serviceName: vm.isConnectedDb && (vm.documentLiquidationData && vm.documentLiquidationData.documentControlNumber) ?
          'CalculationForAccidentalDeath' : 'CalculationForAccidentalDeathOff'
      }
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
      }
      vm.callDelete(data);
    }

    function editCompensation(item) {
      vm.isEditFlow = true;
      vm.frmCoverage = _mapEditForm(item);
      vm.docNumMaxLength = reServices.funDocNumMaxLength(item.documentType);
    }

    function cerrar() {
      vm.closeModal();
    }

    function aceptar() {
      vm.closeModal({
        status: 'ok'
      })
    }

    function showNaturalPerson(item) {
      vm.frmCoverage.documentNumber = '';
      vm.docNumMaxLength = reServices.funDocNumMaxLength(item.codeField);
    }

    // privates

    function _mapInitForm(frmData) {
      vm.isEditFlow = false;
      vm.frmCoverage = _.assign({}, frmData, {
        birthDate: _.keys(frmData).length > 0 ?
          new reFactory.common.DatePicker(new Date(frmData.birthDate)) : new reFactory.common.DatePicker()
      })
    }

    function _mapRequestCalculationConnected() {
      return _.assign({}, {
        pctngBeneficiaryParticipation: vm.frmCoverage.pctngBeneficiaryParticipation,
        compensationCorrelativeNumber: vm.frmCoverage.compensationCorrelativeNumber || 0,
      })
    }

    function _mapRequestCalculationDisconnected() {
      if (vm.compensationList.length < 1) {
        return {
          permanentDisabilityPercentages: [{
            pctngBeneficiaryParticipation: vm.frmCoverage.pctngBeneficiaryParticipation,
            index: 1,
            selected: true
          }]
        }
      } else {
        var arrItems = _.map(vm.compensationList, function (item) {
          return {
            pctngBeneficiaryParticipation: vm.frmCoverage.index === item.index ?
              vm.frmCoverage.pctngBeneficiaryParticipation : item.pctngBeneficiaryParticipation,
            index: item.index,
            selected: vm.frmCoverage.index === item.index
          }
        });

        return {
          permanentDisabilityPercentages: vm.isEditFlow ? arrItems : arrItems.concat({
            pctngBeneficiaryParticipation: vm.frmCoverage.pctngBeneficiaryParticipation,
            index: vm.compensationList[vm.compensationList.length - 1].index + 1,
            selected: true
          })
        };
      }
    }

    function _mapRequestAdd(frm) {
      return _.assign({}, {
        benefitImport: frm.benefitImport,
        birthdate: frm.birthDate.model,
        compensationCorrelativeNumber: frm.compensationCorrelativeNumber || null,
        documentNumber: frm.documentNumber,
        documentType: frm.documentType.codeField,
        index: frm.index || null,
        lastName: frm.lastName,
        motherLastName: frm.motherLastName,
        names: frm.names,
        pctngBeneficiaryParticipation: frm.pctngBeneficiaryParticipation,
        relationshipCodeOfBeneficiary: frm.parentesco.codeField,
        sex: frm.sex.codeField,
      })
    }

    function _mapEditForm(data) {
      return _.assign({}, {
        benefitImport: data.benefitImport,
        birthDate: new reFactory.common.DatePicker(new Date(data.birthdate)),
        compensationCorrelativeNumber: data.compensationCorrelativeNumber,
        documentNumber: data.documentNumber,
        documentType: {
          codeField: data.documentType
        },
        index: data.index || null,
        lastName: data.lastName,
        motherLastName: data.motherLastName,
        names: data.names,
        parentesco: {
          codeField: data.relationshipCodeOfBeneficiary
        },
        pctngBeneficiaryParticipation: data.pctngBeneficiaryParticipation,
        sex: {
          codeField: data.sex
        }
      })
    }

    function _setLookupSelect() {
      var tableNameSex = 'Sex';
      var tableNameBeneficiary = 'Beneficiary';
      var tableNameDocumentType = 'DocumentType';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.sexList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameSex;
      });
      vm.parentescoList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameBeneficiary;
      });
      vm.documentTypeList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }

    function _serviceTemplate() {
      reFactory.solicitud.GetAccidentalDeathModalTemplate()
        .then(function (res) {
          vm.htmlTemplate = res.isValid ? res.data : '<div>No Template</div>';
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

  }

  return ng
    .module('appReembolso')
    .controller('ReAccidentalDeathModalController', ReAccidentalDeathModalController)
    .component('reAccidentalDeathModal', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/muerte-accidental-modal/muerte-accidental-modal.html',
      controller: 'ReAccidentalDeathModalController as $ctrl',
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
        documentLiquidationData: '<'
      }
    })
})
