/*global angular, _ */
angular.module('errorInterceptor', [])
    .constant('ErrorSrvConfig', {
        loginUrl: window.location.pathname
    })
    /**
     * @doc-component service
     * @name gaiafrontend.service.errorSrv
     * @description
     * This service manages $http error responses.
     * It wraps `AlertsSrv` implementation to create error alerts inside `mp-alerts` element from response objects.
     */
    .provider('ErrorSrv', function () {
        var ignoredUrls = ['api/register-event'];

        return {
            ignore: function (urlsArray) {
                Array.prototype.push.apply(ignoredUrls, urlsArray);
            },
            $get: ['$rootScope', 'AlertsSrv', 'Events', '$window', 'ErrorSrvConfig', function ($rootScope, AlertsSrv, Events, $window, ErrorSrvConfig) {
               /**
                * @doc-component method
                * @methodOf gaiafrontend.service.errorSrv
                * @name gaiafrontend.service.errorSrv#getErrorData
                * @param {object} response The response object.
                * @return {object} The `errorData` property of the response body.
                */
                function getErrorData(response) {
                    return response.errorData || (response.data && response.data.errorData);
                }

               /**
                * @doc-component method
                * @methodOf gaiafrontend.service.errorSrv
                * @name gaiafrontend.service.errorSrv#hasErrorData
                * @param {object} response The response object.
                * @return {boolean} `true` if an `errorData` property is defined in the response body. `false` if it is not.
                */
                function hasErrorData(response) {
                    return !!getErrorData(response);
                }

                function createAlert(title, description, errors) {
                    var alert = new AlertsSrv.Alert(title, description);

                    angular.forEach(errors, function (error) {
                        alert.addError(error.description, error.form, error.formControl);
                    });

                    return alert;
                }

                function createErrorsFrom(bindingErrors) {
                    var errors = [];

                    angular.forEach(bindingErrors, function (bindingError) {
                        errors.push({
                            form: bindingError.objectName,
                            formControl: bindingError.field,
                            description: bindingError.defaultMessage
                        });
                    });

                    return errors;
                }

                function broadCastBindingErrors(errorDataItem) {
                    angular.forEach(errorDataItem.bindingErrors, function (bindingError) {
                        $rootScope.$broadcast(Events.$formControlError(bindingError.objectName + bindingError.field), {
                            server: bindingError.defaultMessage
                        });
                    });
                }

                function displayErrorData(response) {
                    var errorData = getErrorData(response);

                    angular.forEach(errorData, function (errorDataItem) {
                        broadCastBindingErrors(errorDataItem);
                        AlertsSrv.error(createAlert('Error ' + errorDataItem.status, errorDataItem.errorMessage || 'An error has occurred. Click on the plus sign at the corner to see the details.', createErrorsFrom(errorDataItem.bindingErrors)), response);
                    });
                }

                function isAborted(response) {
                    return response.status === 0 && response.data === null && _.isEmpty(response.headers());
                }

               /**
                * @doc-component method
                * @methodOf gaiafrontend.service.errorSrv
                * @name gaiafrontend.service.errorSrv#display
                * @param {object} response The response object.
                * @description
                * This method adds a new error alert in `mp-alerts` element. To display a custom error it has to have `errorData` format.
                */
                function display(response) {
                    if (_.contains(ignoredUrls, response.config && response.config.url) || isAborted(response)) {
                        return;
                    }

                    var errorData = getErrorData(response);

                    if (errorData && errorData.length) {
                        displayErrorData(response);
                    } else if (response.status === 401) {
                        $window.location.href = ErrorSrvConfig.loginUrl;
                    } else {
                        AlertsSrv.error(createAlert('Error ' + response.status, 'An unexpected error has occurred. Click on the plus sign at the corner to see the details.'), response);
                    }
                }

                return {
                    getErrorData: getErrorData,
                    hasErrorData: hasErrorData,
                    display: display
                };
            }]
        };
    })
    /**
     * @doc-component service
     * @name gaiafrontend.service.errorInterceptor
     * @description
     * This service is meant to be used as a `$http` interceptor.
     *
     * This interceptor manages GAIA response errors with `ErrorSrv`. It works in conjunction with `mpAlert` directive. This interceptor uses `AlertsSrv` to add errors to `mp-alerts` element.
     *
     * To use this interceptor in your application you only have to add this service to the `$httpProvider.interceptors` Array of your application like follows:
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['$httpProvider', function ($httpProvider) {
     *         $httpProvider.interceptors.push('ErrorInterceptor');
     *     ]);
     *  ```
     *
     * If we need `ErrorInterceptor` to ignore response errors from spcific URLs we only have to add these URLs like this:
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['ErrorSrvProvider', function (ErrorSrvProvider) {
     *         ErrorSrvProvider.ignore(['url/to/ignore']);
     *     ]);
     *  ```
     */
    .factory('ErrorInterceptor', ['ErrorSrv', '$q', function (ErrorSrv, $q) {
        function responseErrorInterceptor(rejection) {
            ErrorSrv.display(rejection);
            return $q.reject(rejection);
        }

        function responseInterceptor(response) {
            if (ErrorSrv.hasErrorData(response)) {
                return responseErrorInterceptor(response);
            }

            return response;
        }

        return {
            response: responseInterceptor,
            responseError: responseErrorInterceptor
        };
    }])
