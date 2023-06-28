/*global angular */
angular.module('objectDefSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.ObjectDefSrv
     * @description
     * NewTronian applications service now deprecated.
     */
    .factory('ObjectDefSrv', ['HttpSrv', '$q',
        function(HttpSrv, $q) {
            var objectDefSrvBaseUrl = '../api/objectdef/',
                objectDefinitions = {};

            function resolveObjectDefinition(deferred, objectName) {
                deferred.resolve(angular.copy(objectDefinitions[objectName]));
            }

            function saveAndResolveObjectDefinition(deferred, objectName) {
                return function(objectDefinition) {
                    objectDefinitions[objectName] = objectDefinition;
                    deferred.resolve(angular.copy(objectDefinitions[objectName]));
                };
            }

            function retireveObjectDefinition(deferred, objectName) {
                HttpSrv.get(objectDefSrvBaseUrl + objectName)
                    .then(saveAndResolveObjectDefinition(deferred, objectName), deferred.reject);
            }

            function newObject(objectName) {
                var deferred = $q.defer();

                if (objectDefinitions[objectName]) {
                    resolveObjectDefinition(deferred, objectName);
                } else {
                    retireveObjectDefinition(deferred, objectName);
                }

                return deferred.promise;
            }

            return {
                newObject: newObject
            };
        }]);
