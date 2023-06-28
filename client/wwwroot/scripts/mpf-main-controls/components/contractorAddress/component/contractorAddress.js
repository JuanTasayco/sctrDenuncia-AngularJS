'use strict';

define([
  'angular', 'constants',
  '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js',
  '/scripts/mpf-main-controls/components/contractorAddress/service/contractorAddressFactory.js'
], function (angular, constants, factory) {

  var appControls = angular.module('mapfre.controls');

  appControls.controller('ctrlContractorAddress', ['$scope', 'contractorAddressFactory', '$window', '$state', function ($scope, contractorAddressFactory, $window, $state) {

    var _self = this;

    _self.data = !_self.data ? {} : _self.data;
    $scope.title = "Dirección";

    if (angular.isUndefined(_self.formName)) {
      _self.formName = 'frmDireccion'
    }
    $scope.$watch(_self.formName, function () {
      $scope.currentForm = $scope[_self.formName];
    }, true)

    _self.data.ubigeoData = _self.data.ubigeoData ? _self.data.ubigeoData : {};

    _self.isValid = _self.isValid ? _self.isValid : {};

    if (_self.maxLengthVia) {
      _self.viaMaxlength = _self.maxLengthVia;
    } else {
      _self.viaMaxlength = window.location.pathname == "/polizas/" ? 25 : 40;
    }

    if ($state.current.appCode == constants.module.polizas.soat.description)
      _self.isSOAT = true;
    else
      _self.isSOAT = false;

    _setAllFieldsRequired(_self.allFieldsRequired);

    function _setAllFieldsRequired(bAllFieldsRequired) {
      $scope.fieldsRequiredDefault = {};
      $scope.fieldsNoRequiredDefault = {};
      if (typeof bAllFieldsRequired == 'undefined') {
        $scope.fieldsRequiredDefault.string = 'required';
        $scope.fieldsRequiredDefault.boolean = true;
        $scope.fieldsNoRequiredDefault.boolean = false;
        $scope.numeroRequired = $scope.fieldsNoRequiredDefault.boolean;
        $scope.interiorRequired = $scope.fieldsNoRequiredDefault.boolean;
        $scope.zonaRequired = $scope.fieldsNoRequiredDefault.boolean;
      } else {
        $scope.fieldsRequiredDefault.string = '';
        $scope.fieldsRequiredDefault.boolean = bAllFieldsRequired;
        $scope.fieldsNoRequiredDefault.boolean = bAllFieldsRequired;
        $scope.numeroRequired = bAllFieldsRequired;
        $scope.interiorRequired = bAllFieldsRequired;
        $scope.zonaRequired = bAllFieldsRequired;
      }
    }

    $scope.$watch('$ctrl.setter', function () {
      _self.setterUbigeo = _self.setter;
    })
    $scope.$watch('$ctrl.clean', function () {
      _self.cleanUbigeo = _self.clean;
    })

    _self.ubigeoValid = _self.ubigeoValid ? _self.ubigeoValid : {};
    // var arrayEmpty = [];
    _self.isValid.func = function () {
      $scope.currentForm.markAsPristine();
      return $scope.currentForm.$valid &
        (!_self.ubigeoValid || _self.ubigeoValid.func());
    }

    $scope._interiorRequired = function () {
      var r = true;
      if ((typeof _self.data.mNumeroInterior == 'undefined') || (_self.data.mNumeroInterior === '')) {
        r = false;
        if ((typeof _self.data.mTipoInterior == 'undefined') || (_self.data.mTipoInterior.Codigo == null || _self.data.mTipoInterior.Codigo == "")) {
        }
      }
      if (!_self.interiorRequired)
        $scope.interiorRequired = r;
      else
        $scope.interiorRequired = true;
    }
    $scope.$watch('$ctrl.data.mNumeroInterior', function (n, o) {
      var r = true;
      if ((typeof _self.data.mTipoInterior == 'undefined') || (_self.data.mTipoInterior.Codigo == null || _self.data.mTipoInterior.Codigo == "")) {
        if ((typeof n == 'undefined') || (n === '')) {
          r = false;
        }
      }
      if (!_self.interiorRequired)
        $scope.interiorRequired = r;
      else
        $scope.interiorRequired = true;
    })

    $scope._numeroRequired = function () {
      var r = true;
      if ((typeof _self.data.mNumeroDireccion == 'undefined') || (_self.data.mNumeroDireccion === '')) {
        r = false;
        if ((typeof _self.data.mTipoNumero == 'undefined') || (_self.data.mTipoNumero.Codigo == null || _self.data.mTipoNumero.Codigo == "")) {
        }
      }
      if (!_self.numeroRequired)
        $scope.numeroRequired = r;
      else
        $scope.numeroRequired = true;
    }
    $scope.$watch('$ctrl.data.mNumeroDireccion', function (n, o) {
      var r = true;
      if ((typeof _self.data.mTipoNumero == 'undefined') || (_self.data.mTipoNumero.Codigo == null || _self.data.mTipoNumero.Codigo == "")) {
        if ((typeof n == 'undefined') || (n === '')) {
          r = false;
        }
      }
      if (!_self.numeroRequired)
        $scope.numeroRequired = r;
      else
        $scope.numeroRequired = true;
    })

    function initVar() {
      $scope.showTitle = typeof(_self.showTitle) != 'undefined' ? _self.showTitle : true;
    }

    function loadData() {
      contractorAddressFactory.getTypeVias().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          _self.typeViaData = response.Data;
        }
      });

      contractorAddressFactory.getTypeNumbers().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          _self.typeNumberData = response.Data;
        }
      });

      contractorAddressFactory.getTypeInteriors().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          _self.typeInteriorData = response.Data;
        }
      });

      contractorAddressFactory.getTypeZones().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          _self.typeZoneData = response.Data;
        }
      });
    }

    $scope.title = _self.title ? _self.title : $scope.title;
    initVar();
    loadData();

  }]).component('mpfContractorAddress', {
    templateUrl: '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.html',
    controller: 'ctrlContractorAddress',
    bindings: {
      data: '=',
      isValid: '=',
      setterUbigeo: "=",
      cleanUbigeo: '=',
      blockDepartament: '=?',
      blockProvincia: '=?',
      showTitle: '=?',
      interiorRequired: '=?',
      disabledFieldsBeneficiary: '=?',
      numeroRequired: '=?',
      blockDistrito: '=?',
      formName: '@',
      maxLengthNumero: '=?',
      title: '@',
      allFieldsRequired: '=?',
      maxLengthVia: '=?'
    }
  })
});
