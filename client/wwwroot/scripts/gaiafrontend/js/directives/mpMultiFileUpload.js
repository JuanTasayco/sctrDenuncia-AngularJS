/* global angular, ss*/
angular.module('mpMultiFileUpload', [])
    .constant('MPMULTIFILEUPLOADCONFIG', {})
    /**
     * @doc-component service
     * @name gaiafrontend.service.mpMultiFileUploadSrv
     * @description
     * This service is meant to be used to communicate with GAIA file upload API.
     *
     * This behaviour can be modified by changing the `mpMultiFileUploadConfig` constant object.
     *
     * It is recommended to change the default behaviour in the `config` method of the main AngularJS module of the application.
     *
     */
    .factory('mpMultiFileUploadSrv', ['HttpSrv', function (HttpSrv) {
        var config = {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        };
        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.mpMultiFileUploadSrv
         * @name gaiafrontend.service.mpMultiFileUploadSrv#getConfig
         * @return {object} Return the config file from server.
         * @description
         * This methods retrieves a config file from server.
         */
        function getConfig() {
                return HttpSrv.get('api/files/configuration');
            }
            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.mpMultiFileUploadSrv
             * @name gaiafrontend.service.mpMultiFileUploadSrv#getFiles
             * @param {string} url Url server.
             * @return {promise} An $http promise.
             * @description
             * This methods retrieves all files from the server.
             */
        function getFiles(url) {
                return HttpSrv.get(url);
            }
            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.mpMultiFileUploadSrv
             * @name gaiafrontend.service.mpMultiFileUploadSrv#getFile
             * @param {string} url Url server.
             * @param {string} filename Filename.
             * @return {promise} An $http promise.
             * @description
             * This methods retrieves one file from the server.
             */
        function getFile(url, filename) {
                return HttpSrv.get(url + '/:filename', {
                    filename: filename
                }, config);
            }
            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.mpMultiFileUploadSrv
             * @name gaiafrontend.service.mpMultiFileUploadSrv#removeFile
             * @param {string} url Url server.
             * @param {string} filename Filename.
             * @return {promise} An $http promise.
             * @description
             * This methods remove one file from the server.
             */
        function removeFile(url, filename) {
            // AngularJS strips the Content-Type header if data property is undefined
            config.data = {};
            return HttpSrv['delete'](url + '/:filename', {
                filename: filename
            }, config);
        }

        return {
            getConfig: getConfig,
            getFiles: getFiles,
            getFile: getFile,
            removeFile: removeFile
        }
        }
    ])

.controller('MpMultiFileUploadCtrl', ['$scope', '$modal', '$filter', 'mpMultiFileUploadSrv',
        function($scope, $modal, $filter, mpMultiFileUploadSrv) {

            function generateTemplate (type, size, collection, filename) {
                var template;

                switch (type) {
                  case 'preview':
                    template = '<div class="modal-container modal-container-file">' +
                        '<div class="modal-body">' +
                        '<iframe ng-show="!extensionError && !sizeError" ng-src="api/files/' + encodeURI(collection) + '/' + encodeURI(filename) + '"></iframe>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-navigation" ng-click="accept()">' + $filter('translate')('mpMultiFileUpload.accept') + '</button>' +
                        '</div>' +
                        '</div>';
                    break;
                  case 'confirm':
                    template = '<div class="modal-container modal-container-file">' +
                        '<div class="modal-body">' +
                        '<span class="question">' + $filter('translate')('mpMultiFileUpload.question') + '</span>' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button type="button" class="btn btn-navigation" ng-click="accept()">' + $filter('translate')('mpMultiFileUpload.accept') + '</button>' +
                        '<button type="button" class="btn btn-navigation" ng-click="cancel()">' + $filter('translate')('mpMultiFileUpload.cancel') + '</button>' +
                        '</div>' +
                        '</div>';
                    break;
                }
                return template;
            }

            this.openModal = function (type, size, collection, filename) {
                return $modal.open({
                    template: generateTemplate(type, size, collection, filename),
                    size: size,
                    windowClass: 'modal-content-file',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', '$rootScope',
                        function($scope, $modalInstance, $rootScope) {
                            $scope.cancel = function() {
                                $modalInstance.dismiss();
                            };
                            $scope.accept = function () {
                                $modalInstance.close('yes');
                            };
                            var unRegisterModalStateEvent = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                                $modalInstance.dismiss();
                                });

                            $scope.$on('$destroy', function() {
                                unRegisterModalStateEvent();
                            });
                        }
                    ]
                }).result;
            }
            this.removeFile = function(url, filename, $index) {
                mpMultiFileUploadSrv.removeFile(url, filename);
                $scope.serverInfo.files.splice($index, 1);
            }
            this.removeAllFiles = function(url, filename) {
                mpMultiFileUploadSrv.removeFile(url, filename);
            }
        }
    ])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpMultiFileUpload
     * @example
       <doc:example module="mpMultiFileUpload">
        <doc:source>
        label The example is currently unavailable. If you want to try this component out, you can visit:
        a(href='http://vles044273-008:8081/issuestracker/login.html#/') Issuestracker
        h2 Log in
        h4 User: UGAIA1
        h4 Password: UGAIA1
        h4 Navigate to mpMultiFileUpload submenu.
        </doc:source>
       </doc:example>
     */
    .directive('mpMultiFileUpload', ['MPMULTIFILEUPLOADCONFIG', 'Loader', '$timeout', 'mpMultiFileUploadSrv', '$q', 'Utils', '$filter', 'CookieSrv',
        function (MPMULTIFILEUPLOADCONFIG, Loader, $timeout, mpMultiFileUploadSrv, $q, Utils, $filter, CookieSrv) {
            return {
                templateUrl: 'gaiafrontend/html/multiFileUpload.html',
                scope: {
                    config: '=mpMultiFileUploadConfig',
                    serverInfo: '=?mpMultiFileUploadInfo',
                    mpMultiFileUpload: '@mpMultiFileUpload'
                },
                require: '^mpMultiFileUpload',
                controller: 'MpMultiFileUploadCtrl',
                link: function(scope, element, attrs, MpMultiFileUploadCtrl) {
                    var accordionContainer = element.find('.mp-multi-file-upload-accordion'),
                        filesContainer = element.find('.files'),
                        filesOptions = element.find('.files-options'),
                        uploadIcon = element.find('.glyphicon-cloud-upload'),
                        spinnerIcon = element.find('.spinner-load'),
                        spinnerIconIE8 = element.find('.glyphicon-refresh'),
                        errorContainer = element.find('.error-container'),
                        removeAllButton = element.find('.btn-delete-upload-items'),
                        collection = attrs.mpMultiFileUpload,
                        mpMultiFileUploadInfo = attrs.mpMultiFileUploadInfo,
                        configuration,
                        serverConfigForErrors,
                        customHeadersConfig,
                        config = {
                            button: 'upload-btn-' + collection,
                            name: 'file',
                            multipart: true,
                            url: 'api/files/' + collection,
                            encodeCustomHeaders: false,
                            startXHR: function() {
                                animateSpinner();
                            },
                            onComplete: function() {
                                hideErrors();
                                animateSpinner();
                                getFiles();
                            },
                            startNonXHR: function() {
                                animateSpinner();
                                getFiles();
                            },
                            onError: function(filename, errorType, status) {
                                manageErrors(status);
                                animateSpinner();
                                closeAccordion()
                                showErrors();
                            },
                            onSizeError: function() {
                                manageErrors('size');
                                closeAccordion()
                                showErrors();
                            }
                        };

                    function animateSpinner() {
                        if (!Utils.platform.isIE8()) {
                            uploadIcon.toggleClass('display');
                            spinnerIcon.toggleClass('display');
                        } else {
                            uploadIcon.toggleClass('display');
                            spinnerIconIE8.toggleClass('displayIE8');
                        }
                    }

                    function openAccordion() {
                        filesContainer.toggleClass('closed');
                        filesOptions.toggleClass('closed');
                    }

                    function closeAccordion() {
                        filesContainer.addClass('closed');
                        filesOptions.addClass('closed');
                    }

                    function getFiles() {
                        mpMultiFileUploadSrv.getFiles(config.url)
                            .then(function(res) {
                                scope.serverInfo.files = res;
                                $timeout(function() {
                                    var removeButton = element.find('.glyphicon-remove-circle'),
                                        openButton = element.find('.glyphicon-eye-open');
                                    desregisterListeners(removeButton, openButton);
                                    registerListeners(removeButton, openButton);
                                })
                            });
                    }

                    function removeFile(event) {
                        var targetScope = angular.element(event.target).scope();
                        MpMultiFileUploadCtrl.removeFile(config.url, encodeURI(targetScope.file.name), targetScope.$index);
                    }

                    function removeAllFiles() {
                        MpMultiFileUploadCtrl.openModal('confirm', 'sm')
                            .then(function (data) {
                                if(data === 'yes') {
                                    angular.forEach(scope.serverInfo.files, function(file) {
                                        MpMultiFileUploadCtrl.removeAllFiles(config.url, file.name);
                                    });
                                    scope.serverInfo.files = [];
                                }
                            });
                    }

                    function openFile(event) {
                        var targetScope = angular.element(event.target).scope();
                        MpMultiFileUploadCtrl.openModal('preview', 'lg', collection, targetScope.file.name);
                    }

                    function showErrors() {
                        errorContainer.removeClass('display');
                        accordionContainer.removeClass('col-sm-10');
                        accordionContainer.addClass('col-sm-8');
                    }


                    function hideErrors() {
                        errorContainer.addClass('display');
                        accordionContainer.addClass('col-sm-10');
                        accordionContainer.removeClass('col-sm-8');
                    }

                    function manageErrors(status) {
                        var typeError;

                        switch (status) {
                          case 412:
                          case 'extension':
                            typeError = 'extension';
                            break;
                          case 413:
                          case 'size':
                            typeError = 'size';
                            break;
                          default:
                            typeError = 'genericError';
                        }
                        scope.$apply(function() {
                            scope.errormsg = $filter('translate')('mpMultiFileUpload.' + typeError);
                        });
                    }

                    function unlisten(element, event, listener) {
                        element.off(event, listener);
                    }

                    function listen(element, event, listener) {
                        element.on(event, listener);
                        return function() {
                            unlisten(element, event, listener);
                        }
                    }

                    function registerListeners(removeButton, openButton) {
                        var unlistenAccordionOnClick = listen(accordionContainer, 'click', openAccordion),
                            unlistenRemoveOnClick = listen(removeButton, 'click', removeFile),
                            unlistenOpenOnClick = listen(openButton, 'click', openFile),
                            unlistenRemoveAllFilesOnClick = listen(removeAllButton, 'click', removeAllFiles);

                        element.on('$destroy', function() {
                            unlistenAccordionOnClick();
                            unlistenRemoveOnClick();
                            unlistenOpenOnClick();
                            unlistenRemoveAllFilesOnClick();
                        });
                    }

                    function desregisterListeners(removeButton, openButton) {
                        unlisten(removeButton, 'click', removeFile);
                        unlisten(openButton, 'click', openFile);
                        unlisten(accordionContainer, 'click', openAccordion);
                        unlisten(removeAllButton, 'click', removeAllFiles);
                    }

                    function generateConfig() {
                        var deferred = $q.defer(),
                            xsrfToken = CookieSrv.getCookie('XSRF-TOKEN');

                        mpMultiFileUploadSrv.getConfig()
                            .then(function (data) {

                                if(mpMultiFileUploadInfo) {
                                    scope.serverInfo = data;
                                }

                                serverConfigForErrors = {
                                    maxSize: data.maxUploadSize / 1024
                                }

                                customHeadersConfig = {
                                    customHeaders: {
                                        'x-custom-encoding':'UTF-8',
                                        'X-XSRF-TOKEN': xsrfToken
                                    }
                                }

                                configuration = angular.extend({}, MPMULTIFILEUPLOADCONFIG, scope.config, config, serverConfigForErrors, customHeadersConfig);
                                deferred.resolve(configuration);
                            });

                        return deferred.promise;
                    }

                    function createSimpleUpload(configuration) {
                        return new ss.SimpleUpload(configuration);
                    }

                    // https://www.lpology.com/code/ajaxuploader/docs.php
                    Loader.load('jquery.simpleFileupload.js')
                        .then(generateConfig)
                        .then(createSimpleUpload)
                        .then(getFiles);
                }
            }
        }
    ]);
