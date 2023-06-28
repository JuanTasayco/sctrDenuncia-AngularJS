'use strict';

define(['angular', 'constants', '/scripts/mpf-main-controls/components/alarm/service/alarmFactory.js'],
  function(angular, constants, factory) {
  var appControls = angular.module('mapfre.controls');

  appControls.controller('ctrlAlarm', ['$scope', 'alarmFactory', '$window', '$state',
    function($scope, alarmFactory, $window, $state) {

      var _self = this;
      _self.data = {};

      alarmFactory.getAlarmType().then(function(res) {
        if (res.OperationCode == constants.operationCode.success) {
          _self.data.alarmTypes = res.Data;
          updateAlarm();
        }
      });

      _self.getComunicationTypes = function(alarmType) {
        if (alarmType.Value) {
          alarmFactory.getComunicationType(0, alarmType.Value).then(function(res) {
            if (res.OperationCode == constants.operationCode.success) {
              _self.data.comunicationTypes = res.Data;
            }
          })
        }
      }

      _self.getPlanTypes = function(comunicationType) {

        if (_self.data.mTipoAlarma.Value == 'S') {
          alarmFactory.getPackageType(comunicationType.Codigo, false).then(function(res) {
            if (res.OperationCode == constants.operationCode.success) {
              _self.data.planTypes = res.Data;
            }
          })
        }
      }

      function updateAlarm () {
        if (!_self.data.mTipoAlarma) {
          _self.data.mTipoAlarma = {};
        }
        if (_self.producto && _self.producto.codProd === 129) {
          _self.data.mTipoAlarma.Value = "S";
          _self.data.selectedAlarmType = true;
          _self.getComunicationTypes(_self.data.mTipoAlarma);
        } else if (_self.producto && _self.producto.codProd === 130) {
          _self.data.mTipoAlarma.Value = "N";
          _self.data.selectedAlarmType = true;
          _self.getComunicationTypes(_self.data.mTipoAlarma);
        } else {
          _self.data.mTipoAlarma = {};
          _self.data.selectedAlarmType = false;
        }
      }

    }
  ]).component('mpfAlarm', {
      templateUrl: '/scripts/mpf-main-controls/components/alarm/component/alarm.html',
      controller: 'ctrlAlarm',
      bindings: {
        data: '=',
        producto:  '='
        // isValid: '=?',
        // setter: '=?',
        // clean: '=?',
        // blockDepartament: '=?',
        // blockProvincia: '=?',
        // blockDistrito: '=?'
      }
    });
});
