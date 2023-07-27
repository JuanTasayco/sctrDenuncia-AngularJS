'use strict'

define(['angular', 'constants', 'lodash'], function (angular, constants, lodash) {
  MfaFactory.$inject = ['proxyMfa', '$q'];
  function MfaFactory(proxyMfa, $q) {
    var modalities = null;
    var resModalities = {
      "message": "Process executed successfully",
      "timestamp": 1690498378127,
      "operationCode": 200,
      "data": [
          {
              "modalityCode": "79d9b9dfa274440590a62b6357977c46",
              "detail": [
                  {
                      "field": "TXT_CORREO",
                      "value": "Enviar por <b>correo electrónico</b> a: <br><b>eri**@multiplica.com</b>"
                  },
                  {
                      "field": "TXT_CORREO_VALIDAR",
                      "value": "Hemos enviado un <b>correo electrónico</b> a: <b>eri**@multiplica.com</b>"
                  }
              ]
          },
          {
              "modalityCode": "fe6d97c0288942b491d68f6183d01a8c",
              "detail": [
                  {
                      "field": "TXT_SMS",
                      "value": "Enviar por <b>mensaje de texto</b> al: <br><b>*******47</b>"
                  },
                  {
                      "field": "TXT_SMS_VALIDAR",
                      "value": "Hemos enviado un <b>mensaje de texto</b> al: <b>*******47</b>"
                  }
              ]
          }
      ]
    };

    function _modalities(applicationSeachModelRequest, showSpin) {
      if (modalities) {
        return $q.resolve(modalities);
      }

      /*var deferred = $q.defer();
      proxyMfa.ApplicacionSearchModalities(constants.ORIGIN_SYSTEMS.oim.mfaCode, applicationSeachModelRequest, showSpin)
        .then(function (res) {
          modalities = res.data;
          deferred.resolve(modalities);
        }, function (err) {
          deferred.reject(err.statusText);
        });*/
      var deferred = $q.defer();
      deferred.resolve(resModalities);

      return deferred.promise;
    }

    function _modalityByCode(code, applicationSeachModelRequest) {
      _modalities(applicationSeachModelRequest, showSpin)
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

    return {
      modalities: _modalities,
      modalityByCode: _modalityByCode,
      parseModalityByView: _parseModalityByView,
    };
  }

  return angular
    .module('appLogin')
    .factory('MfaFactory', MfaFactory);
});
