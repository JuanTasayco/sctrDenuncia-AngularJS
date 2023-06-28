/*global angular, localStorage */
angular.module('localStorageSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.localStorageSrv
     * @description
     * This service allows manage localStorage
     */
    .factory('LocalStorageSrv', ['$location', function ($location) {

         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.localStorageSrv
         * @name gaiafrontend.service.localStorageSrv#get
         * @param {string} key The identifier we want recover from localStorage.
         * @return {object} object that matches key parameter.
         * @description
         * This method recover the property key from localStorage
         */
        function get(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.localStorageSrv
         * @name gaiafrontend.service.localStorageSrv#set
         * @param {string} key The identifier we want to save in localStorage.
         * @param {object} object The object we want to save.
         * @return {object} object with boolean result, and error message if it happens.
         * {
         *      result: "true/false",
         *      message: "message"
         * }
         * @description
         * This method save the object in the property key in localStorage
         */
        function set(key, object) {
            //localStorage.setItem(key, JSON.stringify(object));

            try {
                localStorage.setItem(key, JSON.stringify(object));
                return {result: true, message: 'success'};
            } catch (e) {
                return {result: false, message: e.message};
            }
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.localStorageSrv
         * @name gaiafrontend.service.localStorageSrv#removeItem
         * @param {string} key The identifier we want remove in localStorage.
         * @description
         * This method removes the property key in localStorage
         */
        function removeItem(key) {
            localStorage.removeItem(key);
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.localStorageSrv
         * @name gaiafrontend.service.localStorageSrv#getKey
         * @return {string} string contains absolut app URL.
         * @description
         * This method obtains the key to save data
         */
        function getKey() {
            return $location.absUrl();
        }


        /* Disabled
            function clear() {
                return localStorage.clear();
            }
        */

        return {
            get: get,
            set: set,
            removeItem: removeItem,
            getKey: getKey
        };
    }]);
