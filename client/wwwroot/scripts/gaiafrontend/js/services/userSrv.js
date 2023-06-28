/*TODO: REVIEW */
/*global angular, _ */
angular.module('userSrv', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.userSrv
     * @description
     * This service retrieves and holds the current user information.
     */
    .factory('UserSrv', ['$q', 'HttpSrv', 'Language',
        function ($q, HttpSrv, Language) {
            var userInfoUrl = 'api/userinfo',
                user = {
                    info: {}
                };

            function setInfo(info) {
                if (info.applicationData.language) {
                    Language.set(info.applicationData.language);
                }
                return _.extend(user.info, info);
            }

            function requestInfo() {
                return HttpSrv.get(userInfoUrl);
            }

            function reject(deferred) {
                return function(error) {
                    return deferred.reject(error.errorData || error);
                };
            }

            function saveUserInfo(deferred) {
                return function(info) {
                    return deferred.resolve(setInfo(info));
                };
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.userSrv
             * @name gaiafrontend.service.userSrv#getInfo
             * @param {boolean} force Forces the service to retrieve again the user information instead of return the saved info.
             * @return {promise} It will pass the requested user info object to the success callback.
             * @description
             * This methods retrieves the current user info.
             */
            function getInfo(force) {
                var deferred = $q.defer();

                if (force || _.isEmpty(user.info)) {
                    requestInfo()
                        .then(saveUserInfo(deferred), reject(deferred));
                } else {
                    deferred.resolve(user.info);
                }

                return deferred.promise;
            }

            return _.extend(user, {
                getInfo: getInfo
            });
        }]);
