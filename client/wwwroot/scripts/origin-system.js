'use strict'

define([
  'angular', 'constants', 'lodash', 'storageManager'
], function (angular, constants, _) {

  OriginSystemFactory.$inject = ['$window', 'localStorageFactory'];

  function OriginSystemFactory($window, localStorageFactory) {

    var ORIGIN_SYSTEMS = constants.ORIGIN_SYSTEMS;
    var STORAGE_KEYS = constants.STORAGE_KEYS;

    function setOriginSystem(originSystem) {
      var newOriginSystem = (originSystem.origin)
        ? angular.extend({}, originSystem, _getOriginSystem(originSystem.origin))
        : ORIGIN_SYSTEMS.oim;

      localStorageFactory.setItem(STORAGE_KEYS.originSystem, newOriginSystem);
    }

    function getOriginSystem() {
      console.log(localStorageFactory.getItem(STORAGE_KEYS.originSystem));
      return localStorageFactory.getItem(STORAGE_KEYS.originSystem);
    }

    function _getOriginSystem(originSystemCode) {
      originSystemCode = originSystemCode || '';
      return _.find(ORIGIN_SYSTEMS, function(system) {
        return system.code === originSystemCode;
      }) || {};
    }

    function setTitle(title) {
      title = title || '';
      $window.document.title = title;
    }

    function setIcon(icon) {
      icon = icon || '';
      var linkIcon = $window.document.querySelector('link[rel*="icon"]');
      linkIcon.href = icon;
    }

    function setBodyClass(className) {
      className = className || '';
      var body = angular.element($window.document.body);
      body.addClass(className);
    }

    function setOriginSystemConfig(title) {
      title = title || '';
      var originSystem = angular.extend({}, getOriginSystem(), ORIGIN_SYSTEMS.oim);
      var newTitle = [originSystem.title , title].join(' - ');
      setTitle(newTitle);
      setIcon(originSystem.icon);
      setBodyClass(originSystem.bodyClass);
    }

    function isOriginSystem(originSystemCode) {
      if(getOriginSystem()) {

        return originSystemCode === getOriginSystem().code;
      } 
      return false;
    }

    return {
      setOriginSystem: setOriginSystem,
      getOriginSystem: getOriginSystem,
      setTitle: setTitle,
      setIcon: setIcon,
      setBodyClass: setBodyClass,
      setOriginSystemConfig: setOriginSystemConfig,
      isOriginSystem: isOriginSystem
    };

  }

  angular
    .module('origin.system', ['storage.manager'])
    .factory('originSystemFactory', OriginSystemFactory);

});
