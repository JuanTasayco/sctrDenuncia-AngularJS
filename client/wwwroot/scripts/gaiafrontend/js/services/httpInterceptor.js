/*global angular, _ */
angular.module('httpInterceptor', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.httpInterceptor
     * @description
     * DEPRECATED.
     *
     * See *i18nInterceptor*, *ErrorInterceptor*, *GaiaFormNameInterceptor*, *NwtErrorInterceptor* and *ThemeInterceptor*.
     */
    .provider('HttpInterceptor', function() {
        var UNAUTHORIZED_CODE = 401,
            options = {
                suffixLanguageToHTMLsAndJSONs: false,
                interceptGaiaFormName: false,
                setThemeOnResponse: false,
                redirectWhenUnauthorized: false,
                redirectionUrl: '#/login',
                ignoreErrors: false,
                ignoredUrls: ['api/register-event']
            };

        function setOption(opt, value) {
            options[opt] = value;
        }

        function setOptions(opts) {
            _.extend(options, opts);
        }

        function set(arg1, arg2) {
            if (_.isPlainObject(arg1)) {
                setOptions(arg1);
            } else if (_.isString(arg1) && !_.isUndefined(arg2)) {
                setOption(arg1, arg2);
            }
        }

        return {
            set: set,
            $get: ['$q', '$window', '$rootScope', 'AlertsSrv', 'Theme', 'Language', 'Events',
                function($q, $window, $rootScope, AlertsSrv, Theme, Language, Events) {
                    var cache = {};

                    function isHtmlOrJsonRequest(config) {
                        var method = config.method,
                            url = config.url;

                        return method === 'GET' && (url.indexOf('.html') > -1 || url.indexOf('messages.json') > -1);
                    }

                    function isNotUIBootstrapTpl(config) {
                        return config.url.indexOf('template/') !== 0;
                    }

                    function isNotAngularStrapTpl(config) {
                        var notAngularStrapTpl = true;

                        if (config.url === 'aside/aside.tpl.html' ||
                                config.url === 'alert/alert.tpl.html' ||
                                config.url === 'datepicker/datepicker.tpl.html' ||
                                config.url === 'dropdown/dropdown.tpl.html' ||
                                config.url === 'modal/modal.tpl.html' ||
                                config.url === 'popover/popover.tpl.html' ||
                                config.url === 'select/select.tpl.html' ||
                                config.url === 'tab/tab.tpl.html' ||
                                config.url === 'timepicker/timepicker.tpl.html' ||
                                config.url === 'tooltip/tooltip.tpl.html' ||
                                config.url === 'typeahead/typeahead.tpl.html') {
                            notAngularStrapTpl = false;
                        }

                        return notAngularStrapTpl;
                    }

                    function suffixLanguage(config) {
                        var url = config.url,
                            language = Language.get().languageId,
                            filePath = url.substring(0, url.lastIndexOf('.')),
                            extension = url.substring(url.lastIndexOf('.')),
                            languageSuffix = language ? '_' + language : '';

                        config.url = filePath + languageSuffix + extension;
                    }

                    function findGaiaFormNameObject(data) {
                        var gaiaFormName;

                        _.each(data, function(element) {
                            gaiaFormName = _.isPlainObject(element) && element.gaiaFormName ? element : undefined;
                            return !gaiaFormName;
                        });

                        return gaiaFormName;
                    }

                    function findGaiaFormNameIndex(data) {
                        var gaiaFormNameIndex;

                        _.each(data, function(element, index) {
                            gaiaFormNameIndex = _.isPlainObject(element) && element.gaiaFormName ? index : -1;
                            return gaiaFormNameIndex !== -1 ? false : true;
                        });

                        return gaiaFormNameIndex;
                    }

                    function getGaiaFormName(configData) {
                        var data = configData && configData.data ? configData.data : configData,
                            gaiaFormName;

                        if (_.isArray(data)) {
                            gaiaFormName = (findGaiaFormNameObject(data) || {}).gaiaFormName;
                        } else if (_.isPlainObject(data)) {
                            gaiaFormName = data.gaiaFormName;
                        }

                        return gaiaFormName;
                    }

                    function saveLastGaiaFormSent(url, gaiaFormName) {
                        cache.lastGaiaFormSent = cache.lastGaiaFormSent || {};
                        cache.lastGaiaFormSent.url = url;
                        cache.lastGaiaFormSent.gaiaFormName = gaiaFormName;
                    }

                    function removeGaiaFormName(configData) {
                        var data = configData && configData.data ? configData.data : configData;

                        if (_.isArray(data)) {
                            delete (data[findGaiaFormNameIndex(data)] || {}).gaiaFormName;
                        } else if (_.isPlainObject(data)) {
                            delete data.gaiaFormName;
                        }

                        return data;
                    }

                    function saveAndRemoveGaiaFormName(config, gaiaFormName) {
                        saveLastGaiaFormSent(config.url, gaiaFormName);
                        removeGaiaFormName(config.data);
                    }

                    function retrieveLastGaiaFormSent() {
                        var lastGaiaFormSent = angular.copy(cache.lastGaiaFormSent);
                        delete cache.lastGaiaFormSent;
                        return lastGaiaFormSent;
                    }

                    function defaultErrorData(status) {
                        return {
                            'title': 'Server error',
                            'description': 'An error (' + status + ') has occurred. Please, try again later.'
                        };
                    }

                    function serverValidationErrorData(error) {

                        function parseBindingErrors(bindingErrors) {
                            var parsedBindingErrors = [];

                            angular.forEach(bindingErrors, function (bindingError) {
                                parsedBindingErrors.push({
                                    form: bindingError.objectName,
                                    formControl: bindingError.field,
                                    description: bindingError.defaultMessage
                                });
                            });

                            return parsedBindingErrors;
                        }

                        return {
                            'title': 'Server validation error',
                            'description': error.errorMessage || 'An error has occurred. Please, check the following data:',
                            'errors': parseBindingErrors(error.bindingErrors)
                        };
                    }

                    function displayError(error, response) {
                        var responseUrl = response.config ? response.config.url : '',
                            errorAlertData = {};

                        function urlHasToBeIgnored(url) {
                            return !!_.find(options.ignoredUrls, function (urlToIgnore) {
                                return url.indexOf(urlToIgnore) > -1;
                            });
                        }

                        function isErrorData(error) {
                            return _.isArray(error);
                        }

                        function createErrorDataAlert(error) {
                            var errorData = angular.copy(error);

                            function setValidationErrors(errorData) {
                                _.each(errorData, function(error) {
                                    var lastGaiaFormSent = retrieveLastGaiaFormSent() || {};

                                    function hasValidationErrors(error) {
                                        return !!error.bindingErrors;
                                    }

                                    function setObjectNameProperty(error) {
                                        _.each(error.bindingErrors, function(validationError) {
                                            validationError.objectName = validationError.objectName || (lastGaiaFormSent.url === responseUrl && lastGaiaFormSent.gaiaFormName);
                                        });
                                    }

                                    if (hasValidationErrors(error)) {
                                        setObjectNameProperty(error);
                                    }
                                });
                            }

                            if (options.interceptGaiaFormName) {
                                setValidationErrors(errorData);
                            }

                            return errorData;
                        }

                        if (options.ignoreErrors && urlHasToBeIgnored(responseUrl)) {
                            return;
                        }

                        if (isErrorData(error)) {
                            _.extend(errorAlertData, createErrorDataAlert(error));
                            angular.forEach(errorAlertData, function(error) {
                                angular.forEach(error.bindingErrors, function (bindingError) {
                                    $rootScope.$broadcast(Events.$formControlError(bindingError.objectName + bindingError.field), {
                                        server: bindingError.defaultMessage
                                    });
                                });
                                AlertsSrv.error(serverValidationErrorData(error), response);
                            });
                        } else {
                            _.extend(errorAlertData, error);
                            AlertsSrv.error(serverValidationErrorData(errorAlertData), response);
                        }
                    }

                    function saveDestinationUrlAndRedirectToLogin() {
                        cache.destinationUrl = $window.location.hash;
                        $window.location = options.redirectionUrl;
                    }

                    function getDestinationUrl() {
                        return cache.destinationUrl;
                    }

                    return {
                        getDestinationUrl: getDestinationUrl,
                        request: function(config) {
                            var gaiaFormName = getGaiaFormName(config.data);

                            if (options.suffixLanguageToHTMLsAndJSONs && isHtmlOrJsonRequest(config) && isNotUIBootstrapTpl(config) && isNotAngularStrapTpl(config)) {
                                suffixLanguage(config);
                            }

                            if (options.interceptGaiaFormName && gaiaFormName) {
                                saveAndRemoveGaiaFormName(config, gaiaFormName);
                            }

                            return config;
                        },
                        response: function(response) {
                            var errorData = response.data.errorData,
                                themeId = response.headers('X-User-theme');

                            if (options.setThemeOnResponse && themeId && themeId !== Theme.get()) {
                                Theme.set(themeId);
                            }

                            if (errorData) {
                                displayError(errorData, response);
                                return $q.reject(response);
                            }

                            return response;
                        },
                        responseError: function(rejection) {
                            var status = rejection.status,
                                error = rejection.data && rejection.data.errorData ? rejection.data.errorData : defaultErrorData(status);

                            if (options.redirectWhenUnauthorized && status === UNAUTHORIZED_CODE) {
                                saveDestinationUrlAndRedirectToLogin();
                            } else {
                                displayError(error, rejection);
                            }

                            return $q.reject(rejection);
                        }
                    };
                }]
        };
    });
