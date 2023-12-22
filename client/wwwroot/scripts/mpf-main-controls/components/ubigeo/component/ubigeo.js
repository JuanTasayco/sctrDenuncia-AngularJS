'use strict';

define(['angular', 'constants', '/scripts/mpf-main-controls/components/ubigeo/service/ubigeoFactory.js'], function(angular, constants, factory) {

    var appControls = angular.module('mapfre.controls');

    appControls.controller('ctrlUbigeo', ['$scope', 'ubigeoFactory', '$window', '$state', function($scope, ubigeoFactory, $window, $state) {

        var _self = this;

        _self.isValid = _self.isValid ? _self.isValid : {};
        _self.data = _self.data ? _self.data : {};

        _setAllFieldsRequired(_self.allFieldsRequired);

        function _setAllFieldsRequired(bAllFieldsRequired){
          $scope.fieldsRequiredDefault = {};
          // $scope.fieldsNoRequiredDefault = {};
          $scope.fieldsRequiredDefault.string = (bAllFieldsRequired) ? 'required' : '';
          $scope.fieldsRequiredDefault.boolean = bAllFieldsRequired;
          // if (typeof bAllFieldsRequired == 'undefined') {
          //   $scope.fieldsRequiredDefault.string = 'required';
          //   $scope.fieldsRequiredDefault.boolean = true;
          // }else{
          //   $scope.fieldsRequiredDefault.string = '';
          //   $scope.fieldsRequiredDefault.boolean = bAllFieldsRequired;
          // }
        }

        _self.isValid.func = function(ignoreMark) {
            if (!ignoreMark) $scope.frmUbigeo.markAsPristine();
            return $scope.frmUbigeo.$valid;
        }
        ubigeoFactory.getDepartamentos().then(function(response) {
            _self.data.dataDepartamentos = response.Data;
        }, function(error) {
            console.log('error departamento');
        });

        _self.getProvincias = function(idDepartamento) {
            if (!idDepartamento || idDepartamento.Codigo == null) {
                _self.data.dataProvincias = [];
                _self.data.dataDistritos = [];
            } else {
                ubigeoFactory.getProvincias(idDepartamento.Codigo).then(function(response) {
                    _self.data.dataProvincias = response.Data
                }, function(error) {
                    console.log('error provincias');
                });
            }
        };

        _self.getDistritos = function(idProvincia) {
            if (idProvincia == null || idProvincia.Codigo == null) {
                _self.data.dataDistritos = [];
            } else {
                ubigeoFactory.getDistritos(idProvincia.Codigo).then(function(response) {
                    _self.data.dataDistritos = response.Data
                }, function(error) {
                    console.log('error distritos');
                });
            }
        };

        function setUbigeo(codigoDepartamento, codigoProvincia, codigoDistrito) {
            _self.data = {};
            if (codigoDepartamento) {
                _self.data.mDepartamento = { Codigo: codigoDepartamento }
                _self.getProvincias(_self.data.mDepartamento);
                if (codigoProvincia) {
                    _self.data.mProvincia = { Codigo: codigoProvincia }
                    _self.getDistritos(_self.data.mProvincia);
                    if (codigoDistrito) {
                        _self.data.mDistrito = { Codigo: codigoDistrito }
                        
                    }
                } else {
                    clean();
                    _self.blockProvincia = false;
                }
            } else {
                _self.blockDepartament = false;
                // enviamos un codigo inexistente para que limpie los cbos de provincia y distrito
                _self.getProvincias({ Codigo: null });
            }
        }

        function changeDistrict(data) {
            _self.ubigeo = {
                mDepartamento: data.mDepartamento.Codigo,
                mProvincia: data.mProvincia.Codigo,
                mDistrito: data.mDistrito.Codigo
            }
        }

        function clean() {
            _self.data = {};
            _self.data.mDepartamento = { Codigo: null }
            _self.data.mProvincia = { Codigo: null }
            _self.data.mDistrito = { Codigo: null }
            _self.data.dataDistritos = [];
            _self.data.dataProvincias = [];
        }

        _self.setter = setUbigeo;
        _self.clean = clean;
        _self.changeDistrict = changeDistrict;
        _self.$onInit = function() {
            $scope.$watch('$ctrl.ubigeo', function(newUbigeo, oldUbigeo) {
                $scope.$emit('ubigeo', newUbigeo);
            });
        };
    }]).component('mpfUbigeo', {
        templateUrl: '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.html',
        controller: 'ctrlUbigeo',
        bindings: {
            data: '=',
            isValid: '=?',
            setter: '=?',
            clean: "=?",
            blockDepartament: "=?",
            blockProvincia: "=?",
            blockDistrito: "=?",
            allFieldsRequired: '=?',
            ubigeo: '<'
        }
    })
});
