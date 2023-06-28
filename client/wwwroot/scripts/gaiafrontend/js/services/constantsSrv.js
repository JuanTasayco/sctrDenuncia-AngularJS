/*global angular */
angular.module('constantsSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.ConstantsSrv
     * @description
     * NewTronian applications service now deprecated.
     */
    .factory('ConstantsSrv', ['HttpSrv', '$q',
        function(HttpSrv, $q) {
            var constantDefSrvBaseUrl = '../api/constantsdef/',
                constants = {};

            function resolveConstant(deferred, constantName) {
                deferred.resolve(constants[constantName]);
            }

            function saveAndResolveConstant(deferred, constantName) {
                return function(constant) {
                    constants[constantName] = constant;
                    deferred.resolve(constants[constantName]);
                };
            }

            function retrieveConstant(deferred, constantName) {
                HttpSrv.get(constantDefSrvBaseUrl + constantName)
                    .then(saveAndResolveConstant(deferred, constantName), deferred.reject);
            }

            function getConstant(constantName) {
                var deferred = $q.defer();

                if (constants[constantName]) {
                    resolveConstant(deferred, constantName);
                } else {
                    retrieveConstant(deferred, constantName);
                }

                return deferred.promise;
            }

            return {
                get: getConstant
            };
        }]);
