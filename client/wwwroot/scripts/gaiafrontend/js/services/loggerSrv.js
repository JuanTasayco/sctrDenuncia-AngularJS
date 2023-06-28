/*TODO: Review */
/*global angular, _ */
angular.module('loggerSrv', [])
    .constant('LoggerConfig', {
        monitoringDelay: 60000
    })
    /**
     * @doc-component service
     * @name gaiafrontend.service.loggerSrv
     * @description
     * This service allows you to POST to "api/register-event" any relevant information.
     * This information is logged in the server side.
     */
    .factory('LoggerSrv', ['HttpSrv', 'LoggerConfig', '$timeout', '$window',
        function(HttpSrv, LoggerConfig, $timeout, $window) {
            var registerEventUrl = 'api/register-event',
                firstPerformance = true,
                monitoringPerformance = false,
                monitoringPromise;

            function getErrorItem(responseData, item) {
                var response = responseData.errorData[item];

                return response || '';
            }

            function getErrorMessage(responseData) {
                if (responseData.errorData) {
                    return getErrorItem(responseData, 'errorMessage');
                }
                return 'Unknown error';
            }

            function getErrorCode(responseData) {
                if (responseData.errorData) {
                    return getErrorItem(responseData, 'errorCode');
                }
                return 'Unknown error code';
            }

            function errorMessage(responseData) {
                return {
                    'logLevel': 'ERROR',
                    'errorCode': getErrorCode(responseData),
                    'message': getErrorMessage(responseData),
                    'messageDescription': getErrorMessage(responseData)
                };
            }

            function infoMessage(description, data) {
                return {
                    'logLevel': 'INFO',
                    'message': description,
                    'data': data
                };
            }

            function performanceMessage(performanceObject) {
                var performanceData;

                if (firstPerformance) {
                    firstPerformance = false;
                    performanceData = performanceObject;
                } else {
                    performanceData = _.pick(performanceObject, 'memory');
                }

                return {
                    'logLevel': 'INFO',
                    'performanceInfo': performanceData
                };
            }

            function postLog(message) {
                HttpSrv.post(registerEventUrl, {
                    data: message
                });
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.loggerSrv
             * @name gaiafrontend.service.loggerSrv#error
             * @param {object} responseData response where message error is obtained.
             * @description
             * This method POSTs an error message to "api/register-event".
             */
            function logError(responseData) {
                var message = errorMessage(responseData);
                postLog(message);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.loggerSrv
             * @name gaiafrontend.service.loggerSrv#info
             * @param {object} responseData response where message information is obtained.
             * @description
             * This method POSTs an info message to "api/register-event".
             */
            function logInfo(description, data) {
                var message = infoMessage(description, data);
                postLog(message);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.loggerSrv
             * @name gaiafrontend.service.loggerSrv#performance
             * @description
             * This method POSTs the browser performance (<IE9 not allowed) to "api/register-event".
             */
            function performance() {
                var performanceObject = $window.performance || {}, // In <IE9 window.performance is undefined
                    message = performanceMessage(performanceObject);

                postLog(message);
            }

            function performanceTimeout() {
                performance();
                monitoringPromise = $timeout(performanceTimeout, LoggerConfig.monitoringDelay);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.loggerSrv
             * @name gaiafrontend.service.loggerSrv#monitorPerformance
             * @description
             * This method POSTs the browser performance (<IE9 not allowed) to "api/register-event" every fixed milliseconds.
             * The milliseconds interval can becondifured via `monitoringDelay` property of `LoggerConfig` constant.
             */
            function monitorPerformance(monitor) {
                if (monitor === monitoringPerformance) {
                    return;
                }

                if (monitor) {
                    performanceTimeout();
                } else {
                    $timeout.cancel(monitoringPromise);
                }

                monitoringPerformance = monitor;

            }

            return {
                error: logError,
                log: logInfo,
                monitorPerformance: monitorPerformance,
                performance: performance
            };
        }]);
