'use strict'

define(['angular', 'constants', 'lodash'], function (angular, constants, _) {
  MfaFactory.$inject = ['$q', '$cookies', 'localStorageFactory', 'oimProxyLogin', 'httpData'];
  function MfaFactory($q, $cookies, localStorageFactory, oimProxyLogin, httpData) {
    function _getConfig() {
      return {
        headers: {
          Authorization: 'Bearer ' + localStorageFactory.getItem('jwtFirstToken', false)
        }
      };
    }

    function _getReqCommon() {
      var profile = localStorageFactory.getItem('profile', false);

      return {
        functionalityCode: '68d25e88b7844e56983850dda4e270e0',
        applicationCode : '1df288de5ea84eca9517f375b0974ee7', // INFO: Hardcode for problems with the constant 'constants.ORIGIN_SYSTEMS.oim.mfaCode' in deploy
        deviceCode: $cookies.get('deviceCode'),
        userName: profile.username,
        groupTypeId: profile.groupType
      };
    }

    function getModalities(showSpin) {
      var reqCommon = _getReqCommon();
      var deferred = $q.defer();
      httpData.post(
        oimProxyLogin.endpoint + 'api/mfa/authenticators/application/' + reqCommon.applicationCode + '/searchModalities',
        {
          deviceCode: reqCommon.deviceCode,
          groupTypeId: reqCommon.groupTypeId
        },
        _getConfig(),
        showSpin
      ).then(function (res) {
        if (res.operationCode === constants.operationCode.success) {
          deferred.resolve(res.data);
        } else {
          deferred.reject(res);
        }
      }, function (err) {
        deferred.reject(err.statusText);
      });

      return deferred.promise;
    }

    function getModalityByCode(code, showSpin) {
      var deferred = $q.defer();
      getModalities(showSpin)
        .then(function(resModalities) {
          var modality = _.find(resModalities, function(item) { return item.modalityCode === code; });
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

    function parseModalityByView(modality, view) {
      var isViewAuthVerify = view === 'auth-verify';
      var fields = isViewAuthVerify ? ['TXT_CORREO', 'TXT_SMS'] : ['TXT_CORREO_VALIDAR', 'TXT_SMS_VALIDAR'];

      return {
        icon: _isEmailModality(modality) ? 'ico-mapfre-361-myd-mail' : 'ico-general-user_contact',
        code: modality.modalityCode,
        value: _.find(modality.detail, function(item) {
          return _.include(fields,item.field);
        }).value
      };
    }

    function sendCode(modalityCode, showSpin) {
      var bodySendCode = Object.assign(_getReqCommon(), {
        modalityCode: modalityCode
      });

      return httpData.post(
        oimProxyLogin.endpoint + 'api/mfa/authenticators/request',
        bodySendCode,
        _getConfig(),
        showSpin
      );
    }

    function checkCode(reqCheckCode, showSpin) {
      var bodyCheckCode = Object.assign(_getReqCommon(), reqCheckCode);

      return httpData.post(
        oimProxyLogin.endpoint + 'api/mfa/authenticators/request/validate',
        bodyCheckCode,
        _getConfig(),
        showSpin
      );
    }

    return {
      getModalities: getModalities,
      getModalityByCode: getModalityByCode,
      parseModalityByView: parseModalityByView,
      sendCode: sendCode,
      checkCode: checkCode
    };
  }

  return angular
    .module('appLogin')
    .factory('MfaFactory', MfaFactory);
});
