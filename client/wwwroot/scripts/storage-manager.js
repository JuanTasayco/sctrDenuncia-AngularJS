'use strict'

define([
  'angular', 'crypto-js', 'lodash',
], function (angular, CryptoJS, _) {

  function _isUndefined(val) {
    return typeof val === 'undefined';
  }

  function _parseToString(val) {
    return typeof val === 'string' ? val : JSON.stringify(val);
  }

  function _encrypt(value, key) {
    return CryptoJS.AES.encrypt(value, key).toString();
  }

  function _decrypt(value, key) {
    return value ? CryptoJS.enc.Utf8.stringify(CryptoJS.AES.decrypt(value, key)) : value;
  }

  LocalStorageFactory.$inject = ['$window'];

  function LocalStorageFactory($window) {

    function getItem(key, decrypt) {
      decrypt = _isUndefined(decrypt) ? true : decrypt;
      const item = decrypt ? _decrypt($window.localStorage.getItem(key), key) : $window.localStorage.getItem(key);

      try {
        return JSON.parse(item);
      } catch (error) {
        return item;
      }
    }

    function removeItem(key) {
      $window.localStorage.removeItem(key);
    }

    function setItem(key, data, encrypt) {
      encrypt = _isUndefined(encrypt) ? true : encrypt;
      const item = encrypt ? _encrypt(_parseToString(data), key) : _parseToString(data);

      $window.localStorage.setItem(key, item);
    }

    function _clear(keys) {
      if (keys) {
        angular.forEach(keys, function(key) {
          $window.localStorage.removeItem(key);
        });
      } else {
        $window.localStorage.clear();
      }
    }

    function _clearOmit(keys) {
      _.chain(Object.keys($window.localStorage))
        .filter(function(key) {
          return !_.contains(keys, key);
        })
        .forEach(function(key) {
          $window.localStorage.removeItem(key);
        });
    }

    function clear(keys, hasOmitKeys) {
      hasOmitKeys = hasOmitKeys || false;
      if (hasOmitKeys) {
        _clearOmit(keys);
      } else {
        _clear(keys);
      }
    }

    return {
      getItem: getItem,
      removeItem: removeItem,
      setItem: setItem,
      clear: clear
    };

  }

  SessionStorageFactory.$inject = ['$window'];

  function SessionStorageFactory($window) {

    function getItem(key, decrypt) {
      decrypt = _isUndefined(decrypt) ? true : decrypt;
      const item = decrypt ? _decrypt($window.sessionStorage.getItem(key), key) : $window.sessionStorage.getItem(key);

      try {
        return JSON.parse(item);
      } catch (error) {
        return item;
      }
    }

    function removeItem(key) {
      $window.sessionStorage.removeItem(key);
    }

    function setItem(key, data, encrypt) {
      encrypt = _isUndefined(encrypt) ? true : encrypt;
      const item = encrypt ? _encrypt(_parseToString(data), key) : _parseToString(data);

      $window.sessionStorage.setItem(key, item);
    }

    function _clear(keys) {
      if (keys) {
        angular.forEach(keys, function(key) {
          $window.sessionStorage.removeItem(key);
        });
      } else {
        $window.sessionStorage.clear();
      }
    }

    function _clearOmit(keys) {
      _.chain(Object.keys($window.sessionStorage))
        .filter(function(key) {
          return !_.contains(keys, key);
        })
        .forEach(function(key) {
          $window.sessionStorage.removeItem(key);
        });
    }

    function clear(keys, hasOmitKeys) {
      hasOmitKeys = hasOmitKeys || false;
      if (hasOmitKeys) {
        _clearOmit(keys);
      } else {
        _clear(keys);
      }
    }

    return {
      getItem: getItem,
      removeItem: removeItem,
      setItem: setItem,
      clear: clear
    };

  }

  angular
    .module('storage.manager', [])
    .factory('localStorageFactory', LocalStorageFactory)
    .factory('sessionStorageFactory', SessionStorageFactory);

});
