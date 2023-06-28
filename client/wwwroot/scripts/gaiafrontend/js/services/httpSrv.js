/*TODO: WebFlow management */
/*global angular, _ */
angular.module('httpSrv', [])
    .constant('HttpSrvConfig', {
        wrapRequests: 'smart',
        unwrapResponses: true
    })
    /**
     * @doc-component service
     * @name gaiafrontend.service.httpSrv
     * @description
     * This service is meant to be used to communicate with GAIA server side applications.
     *
     * It wraps the original request body with a `data` property and extract the `data` property value from the response body.
     *
     * This behaviour can be modified by changing the `HttpSrvConfig` constant object.
     * You can disable the request wrapping by changing `HttpSrvConfig.wrapRequests` property to `false`.
     * You can disable the response unwrapping by changing `HttpSrvConfig.unwrapResponses` property to `false`.
     *
     * It is recommended to change the default behaviour in the `config` method of the main AngularJS module of the application.
     *
     */
    .factory('HttpSrv', ['$http', '$q', 'HttpSrvConfig',
        function($http, $q, HttpSrvConfig) {
            function getData(obj) {
                var data = angular.copy(obj) || {};

                while (angular.isObject(data) && data.data) {
                    data = data.data;
                }

                return data;
            }

            function includeParamsInUrl(params, url) {
                var finalUrl = url;

                if (params) {
                    _.each(_.keys(params), function(param) {
                        var paramRegExp = new RegExp(':' + param, 'g');

                        finalUrl = finalUrl.replace(paramRegExp, params[param]);
                    });
                }

                return finalUrl;
            }

            function isWebFlow(response) {
                return !!response.flowData;
            }

            function resolve(deferred) {
                return function(response) {
                    if (isWebFlow(response)) {
                        deferred.resolve(response);
                    } else {
                        deferred.resolve(HttpSrvConfig.unwrapResponses === true ? response.data || response : response);
                    }
                };
            }

            function reject(deferred) {
                return function(error) {
                    deferred.reject(error && error.errorData ? error.errorData : error);
                };
            }

            function httpWrapper(method, url, dataOrConfig, config) {
                var deferred = $q.defer();

                $http[method](url, dataOrConfig, config)
                    .success(resolve(deferred))
                    .error(reject(deferred));

                return deferred.promise;
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.httpSrv
             * @name gaiafrontend.service.httpSrv#get
             * @param {string} url Url of the requested resource.
             * @param {object} params Map of variables to replace in an url with placeholders. The url placeholders follow the pattern `:placholder`. For example, if the url is "api/:companyName/:employeeId" and the params object is {companyName: "MAPFRE", employeeId: "123"} the final url will be "api/MAPFRE/123".
             * @param {object} config Object describing the request to be made and how it should be processed. You can see its supported properties [here](https://code.angularjs.org/1.2.16/docs/api/ng/service/$http#usage).
             * @return {promise} An $http promise.
             * @description
             * Shortcut method to perform GET request.
             */
            function httpGet(url, params, config) {
                return httpWrapper('get', includeParamsInUrl(params, url), config);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.httpSrv
             * @name gaiafrontend.service.httpSrv#delete
             * @param {string} url Url of the requested resource.
             * @param {object} params Map of variables to replace in an url with placeholders. The url placeholders follow the pattern `:placholder`. For example, if the url is "api/:companyName/:employeeId" and the params object is {companyName: "MAPFRE", employeeId: "123"} the final url will be "api/MAPFRE/123".
             * @param {object} config Object describing the request to be made and how it should be processed. You can see its supported properties [here](https://code.angularjs.org/1.2.16/docs/api/ng/service/$http#usage).
             * @return {promise} It will pass the requested dictionary object to the success callback.
             * @description
             * Shortcut method to perform DELETE request.
             */
            function httpDelete(url, params, config) {
                return httpWrapper('delete', includeParamsInUrl(params, url), config);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.httpSrv
             * @name gaiafrontend.service.httpSrv#head
             * @param {string} url Url of the requested resource.
             * @param {object} params Map of variables to replace in an url with placeholders. The url placeholders follow the pattern `:placholder`. For example, if the url is "api/:companyName/:employeeId" and the params object is {companyName: "MAPFRE", employeeId: "123"} the final url will be "api/MAPFRE/123".
             * @param {object} config Object describing the request to be made and how it should be processed. You can see its supported properties [here](https://code.angularjs.org/1.2.16/docs/api/ng/service/$http#usage).
             * @return {promise} It will pass the requested dictionary object to the success callback.
             * @description
             * Shortcut method to perform HEAD request.
             */
            function httpHead(url, params, config) {
                return httpWrapper('head', includeParamsInUrl(params, url), config);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.httpSrv
             * @name gaiafrontend.service.httpSrv#jsonp
             * @param {string} url Url of the requested resource.
             * @param {object} params Map of variables to replace in an url with placeholders. The url placeholders follow the pattern `:placholder`. For example, if the url is "api/:companyName/:employeeId" and the params object is {companyName: "MAPFRE", employeeId: "123"} the final url will be "api/MAPFRE/123".
             * @param {object} config Object describing the request to be made and how it should be processed. You can see its supported properties [here](https://code.angularjs.org/1.2.16/docs/api/ng/service/$http#usage).
             * @return {promise} It will pass the requested dictionary object to the success callback.
             * @description
             * Shortcut method to perform JSONP request.
             */
            function httpJsonp(url, params, config) {
                return httpWrapper('jsonp', includeParamsInUrl(params, url), config);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.httpSrv
             * @name gaiafrontend.service.httpSrv#post
             * @param {string} url Url of the requested resource.
             * @param {object} params Map of variables to replace in an url with placeholders. The url placeholders follow the pattern `:placholder`. For example, if the url is "api/:companyName/:employeeId" and the params object is {companyName: "MAPFRE", employeeId: "123"} the final url will be "api/MAPFRE/123".
             * @param {object} config Object describing the request to be made and how it should be processed. You can see its supported properties [here](https://code.angularjs.org/1.2.16/docs/api/ng/service/$http#usage).
             * @return {promise} It will pass the requested dictionary object to the success callback.
             * @description
             * Shortcut method to perform POST request.
             */
            function httpPost(url, data, params, config) {
                return httpWrapper('post', includeParamsInUrl(params, url), HttpSrvConfig.wrapRequests === 'smart' ? {data: getData(data)} : HttpSrvConfig.wrapRequests === true ? {data: data} : data, config);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.httpSrv
             * @name gaiafrontend.service.httpSrv#put
             * @param {string} url Url of the requested resource.
             * @param {object} params Map of variables to replace in an url with placeholders. The url placeholders follow the pattern `:placholder`. For example, if the url is "api/:companyName/:employeeId" and the params object is {companyName: "MAPFRE", employeeId: "123"} the final url will be "api/MAPFRE/123".
             * @param {object} config Object describing the request to be made and how it should be processed. You can see its supported properties [here](https://code.angularjs.org/1.2.16/docs/api/ng/service/$http#usage).
             * @return {promise} It will pass the requested dictionary object to the success callback.
             * @description
             * Shortcut method to perform PUT request.
             */
            function httpPut(url, data, params, config) {
                return httpWrapper('put', includeParamsInUrl(params, url), HttpSrvConfig.wrapRequests === 'smart' ? {data: getData(data)} : HttpSrvConfig.wrapRequests === true ? {data: data} : data, config);
            }

            return {
                get: httpGet,
                'delete': httpDelete,
                head: httpHead,
                jsonp: httpJsonp,
                post: httpPost,
                put: httpPut
            };
        }]);
