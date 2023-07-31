'use strict'

define(['angular', 'constants', 'lodash', '/login/app/mfa/providers/services/mocks.js'], function (angular, constants, lodash, mocks) {
  MfaFactory.$inject = ['proxyMfa', '$q', '$cookies', 'localStorageFactory'];
  function MfaFactory(proxyMfa, $q, $cookies, localStorageFactory) {
    var modalities = null;

    function _getReqCommon() {
      var profile = localStorageFactory.getItem('profile', false);

      return {
        functionalityCode: '68d25e88b7844e56983850dda4e270e0',
        applicationCode : constants.ORIGIN_SYSTEMS.oim.mfaCode,
        deviceCode: $cookies.get('deviceCode'),
        userName: profile.username
      };
    }

    function _modalities(showSpin) {
      if (modalities) {
        return $q.resolve(modalities);
      }

      /*var reqCommon = _getReqCommon();
      var deferred = $q.defer();
      proxyMfa.ApplicacionSearchModalities(reqCommon.applicationCode, { deviceCode: reqCommon.deviceCode }, showSpin)
        .then(function (res) {
          modalities = res.data;
          deferred.resolve(modalities);
        }, function (err) {
          deferred.reject(err.statusText);
        });*/
      var deferred = $q.defer();
      modalities = mocks.MODALITIES;
      deferred.resolve(modalities);

      return deferred.promise;
    }

    function _modalityByCode(code, showSpin) {
      var deferred = $q.defer();
      _modalities(showSpin)
        .then(function(resModalities) {
          var modality = _.find(resModalities.data, function(item) { return item.modalityCode === code; });
          deferred.resolve(modality);
        }, function (err) {
          deferred.reject(err.statusText);
        });

      return deferred.promise;
    }

    function _isEmailModality(modality) {
      return _.some(modality.detail, function(item) {
        return item.field === 'TXT_CORREO';
      });
    }

    function _parseModalityByView(modality, view) {
      var isViewAuthVerify = view === 'auth-verify';
      var fields = isViewAuthVerify ? ['TXT_CORREO', 'TXT_SMS'] : ['TXT_CORREO_VALIDAR', 'TXT_SMS_VALIDAR'];

      return {
        icon: _isEmailModality(modality) ? 'email' : 'msg',
        code: modality.modalityCode,
        value: _.find(modality.detail, function(item) {
          return _.include(fields,item.field);
        }).value
      };
    }

    function _sendCode(modalityCode, showSpin) {
      var bodySendCode = Object.assign(_getReqCommon(), {
        modalityCode: modalityCode
      });

      return proxyMfa.CreateMessage(bodySendCode, showSpin);
    }

    function _checkCode(reqCheckCode, showSpin) {
      var bodyCheckCode = Object.assign(_getReqCommon(), reqCheckCode);

      return proxyMfa.ValidateMessage(bodyCheckCode, showSpin);
    }



    return {
      modalities: _modalities,
      modalityByCode: _modalityByCode,
      parseModalityByView: _parseModalityByView,
      sendCode: _sendCode,
      checkCode: _checkCode
    };
  }

  return angular
    .module('appLogin')
    .factory('MfaFactory', MfaFactory);
});
