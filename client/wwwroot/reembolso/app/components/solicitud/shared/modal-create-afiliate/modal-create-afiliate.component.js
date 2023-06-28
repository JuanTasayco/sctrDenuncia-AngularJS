'use strict';

define(['angular', 'lodash', 'constants', 'ReembolsoActions'], function (ng, _, constants, ReembolsoActions) {
  ModalCreateAfiliateController.$inject = ['reFactory', '$q', 'mModalAlert', '$ngRedux', '$log', '$window'];

  function ModalCreateAfiliateController(reFactory, $q, mModalAlert, $ngRedux, $log, $window) {
    var actionsRedux;
    var vm = this;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.cerrar = cerrar;
    vm.sendBeneficiary = sendBeneficiary;
    vm.changeDepartment = changeDepartment;
    vm.changeProvince = changeProvince;

    // functions declaration

    function onInit() {
      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      vm.beneficiary = vm.modalAfiliateData.afiliate ?
        _beneficiaryFormData(vm.modalAfiliateData.afiliate) :
        _.assign({}, {
          birthdate: new reFactory.common.DatePicker()
        });

      vm.beneficiary.birthdate.setMaxDate(new Date());

      _getDocumentTypeList();
      _getDepartmentList();
      _setLookupSelect();
      _getBenefitList();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        solicitud: state.solicitud
      };
    }

    function sendBeneficiary() {
      if (vm.frmModal.$invalid) {
        vm.frmModal.markAsPristine();
        vm.beneficiary.birthdate.model > new Date() &&
          mModalAlert.showError('No puede elegir una fecha mayor a la actual', 'Error');

        return void 0;
      }

      _existDocumentNumber() ?
        mModalAlert.showError('El número de documento ingresado ya existe.', 'Error') :
        _saveBeneficiary();
    }

    function changeDepartment() {
      reFactory.solicitud
        .GetProvinceList(vm.beneficiary.department.departmentCode)
        .then(function (res) {
          vm.provinceList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function changeProvince() {
      reFactory.solicitud
        .GetDistrictList(vm.beneficiary.department.departmentCode, vm.beneficiary.province.idProvince)
        .then(function (res) {
          vm.districtList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function cerrar() {
      vm.close(void 0);
    }

    // private

    function _beneficiaryFormData(objData) {
      var objForm = _.assign(objData, {
        birthdate: _fromStringToDate(objData.birthdate),
        sex: {
          codeField: objData.sex
        },
        documentType: {
          idDocumentType: objData.idDocumentType
        }
      });

      return _.assign({}, objForm);
    }

    function _fromStringToDate(stringDate) {
      var date = _reverseDate(stringDate);
      return new reFactory.common.DatePicker(new Date(date));
    }

    function _reverseDate(stringDate) {
      var arrDate = stringDate.split('/').reverse();
      var formatDate = arrDate.join('/');
      return formatDate;
    }

    function _setLookupSelect() {
      var tableNameSex = 'Sex';
      var tableNameInjury = 'InjuryType';
      var tableNameInjured = 'InjuredType';
      var lookUpsData = ng.fromJson($window.sessionStorage['lookups']);

      vm.sexList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameSex;
      });
      vm.injuryTypeList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameInjury;
      });
      vm.injuredTypeList = _.filter(lookUpsData, function (item) {
        return item.tableNameField === tableNameInjured;
      });
    }

    function _mapBeneficiaryData(formData) {
      return _.assign({}, {
        attentionType: formData.benefit && formData.benefit.code,
        birthdate: formData.birthdate.model,
        departmentCode: formData.department && formData.department.departmentCode,
        documentNumber: formData.documentNumber,
        documentType: formData.documentType.idDocumentType,
        firstName: formData.firstName.toUpperCase(),
        fullName: _getFullNameBeneficiary(formData),
        idDistrict: formData.district && formData.district.idDistrict,
        idProvince: formData.province && formData.province.idProvince,
        injuredType: formData.injuredType && formData.injuredType.codeField,
        injuryType: formData.injuryType && formData.injuryType.codeField,
        lastName: formData.lastName.toUpperCase(),
        motherLastName: formData.motherLastName.toUpperCase(),
        secondName: (formData.secondName || '').toUpperCase(),
        sex: formData.sex.codeField,
      });
    }

    function _existDocumentNumber() {
      var objAfiliate = _.find(vm.modalAfiliateData.beneficiaryList, function (item) {
        return item.documentNumber === vm.beneficiary.documentNumber;
      });
      return _.keys(objAfiliate).length > 0;
    }

    function _getDocumentTypeList() {
      reFactory.solicitud
        .GetDocumentsType()
        .then(function (res) {
          vm.documentTypeList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getDepartmentList() {
      reFactory.solicitud
        .GetDepartmentList()
        .then(function (res) {
          vm.departmentList = res.isValid ? res.data : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getBenefitList() {
      reFactory.solicitud
        .GetBenefitList()
        .then(function (res) {
          vm.benefitList = res.operationCode === constants.operationCode.success ? res.data.items : [];
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getFullNameBeneficiary(data) {
      return data.firstName.toUpperCase() + ' ' +
        (data.secondName || '').toUpperCase() + ' ' +
        data.lastName.toUpperCase() + ' ' + data.motherLastName.toUpperCase()
    }

    function _saveBeneficiary() {
      vm.solicitud.additionalData && vm.solicitud.additionalData.isCallToDb ?
        _saveBeneficiaryConnected() :
        _saveBeneficiaryDisconnected();
    }

    function _saveBeneficiaryConnected() {
      var request = _.assign({}, _mapBeneficiaryData(vm.beneficiary), {
        anio: vm.solicitud.additionalData.sinisterAnio,
        customerContractNumber: vm.solicitud.solicitudData.contractNumber,
        documentControlNumber: vm.solicitud.additionalData.documentControlNumber,
        idCompany: vm.solicitud.company.id,
        idCustomer: vm.solicitud.solicitudData.client.id,
        sinisterDate: vm.solicitud.additionalData.sinisterDate
      });

      reFactory.solicitud
        .SaveSinisterBeneficiary(request)
        .then(function (res) {
          $log.info(res);
          vm.close({
            $event: {
              data: _mapBeneficiaryData(vm.beneficiary),
              status: 'ok'
            }
          });
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _saveBeneficiaryDisconnected() {
      vm.close({
        $event: {
          data: _mapBeneficiaryData(vm.beneficiary),
          status: 'ok'
        }
      });
    }

    function funDocNumMaxLength(documentType) {
      //MaxLength documentType
      switch (documentType) {
        case constants.documentTypes.dni.Codigo:
          vm.docNumMaxLength = 8;
          break;
        case constants.documentTypes.ruc.Codigo:
          vm.docNumMaxLength = 11;
          break;
        default:
      }
    }

    vm.showNaturalPerson = function (item) {
      vm.beneficiary.documentNumber = '';
      funDocNumMaxLength(item.initials);
    };

  }

  return ng
    .module('appReembolso')
    .controller('ModalCreateAfiliateController', ModalCreateAfiliateController)
    .component('reModalCreateAfiliate', {
      templateUrl: '/reembolso/app/components/solicitud/shared/modal-create-afiliate/modal-create-afiliate.html',
      controller: 'ModalCreateAfiliateController',
      bindings: {
        close: '&?',
        namelbl: '=',
        modalAfiliateData: '<',
        isSoat: '<'
      }
    });
});
