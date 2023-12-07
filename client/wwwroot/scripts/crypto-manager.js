'use strict'

define([
  'angular', 'crypto-js', 'lodash',
], function (angular, CryptoJS, _) {

  var lengthKey = 32;

  function _parseToString(val) {
    return typeof val === 'string' ? val : JSON.stringify(val);
  }

  function _encrypter(text, key) {
    var iv = CryptoJS.enc.Utf8.parse([4, 1, 15, 16, 2, 9, 3, 13, 5, 10, 6, 11, 8, 12, 7, 14]);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse('xxxxxxxxxxxxxxxx'+text), CryptoJS.enc.Utf8.parse(key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  function _normalizer(baseString, toDo) {
    if (toDo) {
      baseString = baseString.replace(/\+/g, "_");
      baseString = baseString.replace(/\//g, "-");
    } else {
      baseString = baseString.replace(/_/g, "+");
      baseString = baseString.replace(/-/g, "/");
    }
    return baseString;
  }

  function _getProfile(){
    return JSON.parse(localStorage.getItem('evoProfile'));
  }

  EncrypterFactory.$inject = ['$window'];

  function EncrypterFactory($window) {

    var key;

    function handler(obj) {
      return _normalizer(_encrypter(_parseToString(obj), key), true);
    }

    function loadDefaultKey(){
      var profile = _getProfile();
      var value = profile.personId + profile.loginUserName + profile.aud;
      if (value.length <= lengthKey){
        value = value + Array(lengthKey - value.length + 1).join("#");
      }else{
        value = value.substring(0, lengthKey);
      }
      setKey(value);
    }

    function setKey(value){
      key = value;
    }

    return {
      handler: handler,
      loadDefaultKey: loadDefaultKey,
      setKey: setKey
    };

  }

  angular
    .module('crypto.manager', [])
    .factory('encrypterFactory', EncrypterFactory);

});
