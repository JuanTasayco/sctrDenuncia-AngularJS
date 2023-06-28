/*global angular, sessionStorage */
angular.module('sessionStorageSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.sessionStorage
     * @description
     * This service allows manage sessionStorage
     */
    .factory('SessionStorageSrv', ['$location', function ($location) {

         /**
         * @doc-component method
         * @methodOf gaiafrontend.service.sessionStorage
         * @name gaiafrontend.service.sessionStorage#get
         * @param {string} key The identifier we want recover from sessionStorage.
         * @return {object} object that matches key parameter.
         * @description
         * This method recover the property key from sessionStorage
         */
        function get(key) {
            return JSON.parse(sessionStorage.getItem(key));
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.sessionStorage
         * @name gaiafrontend.service.sessionStorage#set
         * @param {string} key The identifier we want to save in sessionStorage.
         * @param {object} object The object we want to save.
         * @return {object} object with boolean result, and error message if it happens.
         * {
         *      result: "true/false",
         *      message: "message"
         * }
         * @description
         * This method save the object in the property key in sessionStorage
         */
        function set(key, object) {
            //sessionStorage.setItem(key, JSON.stringify(object));

            try {
                sessionStorage.setItem(key, JSON.stringify(object));
                return {result: true, message: 'success'};
            } catch (e) {
                return {result: false, message: e.message};
            }
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.sessionStorage
         * @name gaiafrontend.service.sessionStorage#removeItem
         * @param {string} key The identifier we want remove in sessionStorage.
         * @description
         * This method removes the property key in sessionStorage
         */
        function removeItem(key) {
            sessionStorage.removeItem(key);
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.sessionStorage
         * @name gaiafrontend.service.sessionStorage#getKey
         * @return {string} string contains absolut app URL.
         * @description
         * This method obtains the key to save data
         */
        function getKey() {
            return $location.absUrl();
        }


        /* Disabled
            function clear() {
                return sessionStorage.clear();
            }
        */

        return {
            get: get,
            set: set,
            removeItem: removeItem,
            getKey: getKey
        };
    }]);
