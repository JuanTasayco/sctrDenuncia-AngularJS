'use strict';

define(['angular', 'lodash'], function (ng, _) {
  ReGastosCuracionModalController.$inject = ['reFactory', '$log', '$window', 'reServices'];

  function ReGastosCuracionModalController(reFactory, $log, $window, reServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.cerrar = cerrar;
    vm.aceptar = aceptar;
    vm.cleanCompensation = cleanCompensation;
    vm.setDestinatario = setDestinatario;

    function onInit() {
      vm.isDisabledEndDate = !vm.isCurrentEdit;
      vm.isEditFlow = vm.isCurrentEdit || false;

      _setLookupSelect();
    }

    function onChanges(changes) {
      if (changes.frmData) {
        vm.frmCoverage = _.assign({}, vm.frmCoverage, _setInitForm(vm.frmData));
        vm.docNumMaxLength = reServices.funDocNumMaxLength(vm.frmData.documentType);
      }
    }

    function cleanCompensation() {
      _mapInitForm();
    }

    function cerrar() {
      vm.closeModal();
    }

    function aceptar() {
      if (vm.frmModal.$invalid) {
        vm.frmModal.markAsPristine();
        return void 0;
      }

      _savePreLiquidation();
    }

    function setDestinatario() {
      var lastName = vm.frmCoverage.lastName || '';
      var motherLastName = vm.frmCoverage.motherLastName || '';
      var names = vm.frmCoverage.names || '';
      vm.frmCoverage.destinatario = lastName + ' ' + motherLastName + ' ' + names;
    }

    // privates

    function _mapInitForm(frmData) {
      vm.isDisabledEndDate = true;
      vm.isEditFlow = false;
      vm.frmCoverage = _.assign({}, frmData, {
        kindPerson: {
          codeField: frmData.kindOfPerson
        },
        documentType: {
          codeField: frmData.documentType
        },
        liquidationType: {
          codeField: frmData.liquidationType
        },
        names: frmData.firstName,
        destinatario: frmData.fullName
      });
    }

    function _setInitForm(frm) {
      var names = frm.firstName + ' ' + (frm.secondName || '');

      return _.assign({}, {
        kindPerson: {
          codeField: frm.kindOfPerson || 'N'
        },
        documentNumber: frm.documentNumber,
        documentType: {
          codeField: frm.documentType
        },
        liquidationType: {
          codeField: frm.liquidationType || 'N'
        },
        names: frm.firstName,
        destinatario: frm.fullName,
        lastName: frm.lastName,
        motherLastName: frm.motherLastName,
        destinatario: frm.lastName + ' ' + frm.motherLastName + ' ' + names
      })
    }

    function _setLookupSelect() {
      var tableNameKindPerson = 'KinfOfPerson';
      var tableNameBeneficiary = 'LiquidationType';
      var tableNameDocumentType = 'DocumentType';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.kindPersonList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameKindPerson;
      });
      vm.liquidationTypeList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameBeneficiary;
      });
      vm.documentTypeList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameDocumentType;
      });
    }

    function _savePreLiquidation() {
      var req = {
        anio: vm.documentLiquidation.anio,
        documentControlNumber: vm.documentLiquidation.documentControlNumber,
        documentNumber: vm.frmCoverage.documentNumber,
        documentType: vm.frmCoverage.documentType.codeField,
        firstName: vm.frmCoverage.names,
        fullName: vm.frmCoverage.destinatario,
        idAffiliate: vm.idAfiliate,
        idCustomer: vm.idCustomer,
        kindOfPerson: vm.frmCoverage.kindPerson.codeField,
        lastName: vm.frmCoverage.lastName,
        liquidationType: vm.frmCoverage.liquidationType.codeField,
        motherLastName: vm.frmCoverage.motherLastName,
        treatmentBeginDate: vm.sinisterDate
      }

      var serviceName = vm.isConnectedDb ? 'SavePreLiquidation' : '';

      vm.callSave({
        request: req,
        serviceName: ''
      });

      vm.closeModal({
        status: 'ok'
      })
    }

    vm.showNaturalPerson = function (item) {
      vm.frmCoverage.documentNumber = '';
      vm.docNumMaxLength = reServices.funDocNumMaxLength(item.codeField);
    };

  }

  return ng
    .module('appReembolso')
    .controller('ReGastosCuracionModalController', ReGastosCuracionModalController)
    .component('reGastosCuracionModal', {
      templateUrl: '/reembolso/app/components/solicitud/steps/coverages/coverages-modal-form/gastos-curacion-modal/gastos-curacion-modal.html',
      controller: 'ReGastosCuracionModalController as $ctrl',
      bindings: {
        callSave: '<',
        closeModal: '<',
        documentLiquidation: '<',
        frmData: '<',
        idAfiliate: '<',
        idCustomer: '<',
        isConnectedDb: '<',
        isCurrentEdit: '<?',
        sinisterDate: '<'
      }
    })
})
