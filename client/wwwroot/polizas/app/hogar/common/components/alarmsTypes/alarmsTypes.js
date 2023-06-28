'use strict';

define(['angular', 'constants'],
  function(angular, constants) {
    var appAutos = angular.module('appAutos');

    appAutos.controller('hogarCpnteAlarmsTypeController', ['$scope', '$uibModal', 'hogarFactory',
      function($scope, $uibModal, hogarFactory) {
        var vm = this;
        vm.data = {};
        vm.$onInit = onInit;
        vm.showAlarms = vm.showAlarms;
        vm.changeAlarmService = changeAlarmService;
        vm.changeKitSmart = changeKitSmart;
        vm.emitAlarmsData = emitAlarmsData;
        vm.setModalityCode = setModalityCode;
        vm.validateDescuento = validateDescuento;

        hogarFactory.getComunicationType(constants.module.polizas.hogar.codeCia, constants.module.polizas.hogar.codeRamo, true).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) vm.tipoComunicacionData = response.Data;
        })

        /*#########################
        # Public methods
        #########################*/
        function changeAlarmService(val) {
          vm.data.mKitSmart = val == '1' ? '1' : '2';
          vm.data.mVideoWeb = val == '1' ? '1' : '2';
          vm.data.mLlaveroImagen = val == '1' ? '1' : '2';
          vm.selectableKitSmart = val == '1' ? true : false;
          vm.requireComunicationType = val == '1' ? true : false;
          vm.selectableLlaveroImagen = val == '1' ? true : false;
          vm.selectableVideoWeb = val == '1' ? true : false;
          vm.data.mTipoComunicacion = val == '1' ? vm.data.mTipoComunicacion : {'Codigo': null, 'Descripcion': ''};

          vm.emitAlarmsData();
        }

        function changeKitSmart(val) {
          vm.data.mVideoWeb = val == '1' ? '1' : '2';
          vm.selectableVideoWeb = val == '1' ? true : false;

          vm.emitAlarmsData();
        }

        function setModalityCode() {
          if (vm.codeModality) {
            _alarmsService(vm.codeModality);
          } else {
            $scope.$on('fnChangeModalityCode', function(event, modality) {
              _alarmsService(modality.Codigo);
            })
          }
        }

        function emitAlarmsData() {
          $scope.$emit('fnSendAlarmsData', vm.data, true);
        }

        function validateDescuento() {
          vm.data.errorDescCommercial = vm.data.mDescuentoComercial > 10 ? true : false;
        }

        /*#########################
        # Private methods
        #########################*/
        function _alarmsService (codModality) {
          var code = parseInt(codModality);
          switch (code) {
            case 0: // Comparativo
              vm.showAlarms = false;
              vm.data.mTipoComunicacion = {Codigo: null, Descripcion: ''};
              break;

            case 6: // Nuevo Mapfre 24
              vm.showAlarms = true;
              vm.data.mTipoComunicacion = vm.codeModality ? {Codigo: '1', Descripcion: 'BASICO/WIFI'} : {Codigo: null, Descripcion: ''};
              vm.data.mServiceAlarma = "1";
              vm.data.mKitSmart = "2";
              vm.data.mVideoWeb = "2";
              vm.data.mLlaveroImagen = "2";
              vm.selectableAlarma = false;
              vm.selectableKitSmart = false;
              vm.selectableVideoWeb = false;
              vm.selectableLlaveroImagen = true;
              vm.requireComunicationType = true;
              break;

            case 30: // Smart 24
              vm.showAlarms = true;
              vm.data.mTipoComunicacion = vm.codeModality ? {Codigo: '1', Descripcion: 'BASICO/WIFI'} : {Codigo: null, Descripcion: ''};
              vm.data.mServiceAlarma = "1";
              vm.data.mKitSmart = "1";
              vm.data.mVideoWeb = "2";
              vm.data.mLlaveroImagen = "2";
              vm.selectableAlarma = false;
              vm.selectableKitSmart = false;
              vm.selectableVideoWeb = true;
              vm.selectableLlaveroImagen = true;
              vm.requireComunicationType = true;
              break;

            case 31: // Ideal
              vm.showAlarms = true;
              vm.data.mTipoComunicacion = {Codigo: null, Descripcion: ''};
              vm.data.mServiceAlarma = "2";
              vm.data.mKitSmart = "2";
              vm.data.mVideoWeb = "2";
              vm.data.mLlaveroImagen = "2";
              vm.selectableAlarma = true;
              vm.selectableKitSmart = false;
              vm.selectableVideoWeb = false;
              vm.requireComunicationType = false;
              vm.selectableLlaveroImagen = false;
              break;

            default:
              vm.showAlarms = false;
          }

          $scope.$emit('fnSendAlarmsData', vm.data);
        }

        function onInit() {
          vm.setModalityCode();
        }
      }
    ]).component('hogarCpnteAlarmsType', {
      templateUrl: '/polizas/app/hogar/common/components/alarmsTypes/alarmsTypes.html',
      controller: 'hogarCpnteAlarmsTypeController',
      bindings: {
        codeModality: '@?',
        showAlarms: '@?',
        title: '@'
      }
    })
})
