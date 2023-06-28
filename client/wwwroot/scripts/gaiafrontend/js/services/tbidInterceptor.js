/*global angular*/
(function () {
    'use strict';

    var CREATING_TAB_ERROR = 'There was an error during TBID creation and the application cannot be initialized.';

    var TBID = {
        header: 'X-TBID',
        api: 'api/tab'
    };

    function getSearchPart(location) {
        var search = location.search || location.hash;
        return search.split('?')[1] || '';
    }

    function tryDecodeURIComponent(value) {
        try {
            return decodeURIComponent(value);
        } catch (ignore) {}
    }

    function parseSearchPart(search) {
        var obj = {},
            keyValueArray, key;

        angular.forEach((search || '').split('&'), function (keyValue) {
            if (keyValue) {
                keyValueArray = keyValue.split('=');
                key = tryDecodeURIComponent(keyValueArray[0]);
                if (angular.isDefined(key)) {
                    var val = angular.isDefined(keyValueArray[1]) ? tryDecodeURIComponent(keyValueArray[1]) : true;
                    if (!obj[key]) obj[key] = val;
                    else if (angular.isArray(obj[key])) obj[key].push(val);
                    else obj[key] = [obj[key], val];
                }
            }
        });

        return obj;
    }

    function TbidProvider() {
        var Tbid = this;

        Tbid.header = {
            get: function () {
                return TBID.header;
            },
            set: function (header) {
                if (header) {
                    TBID.header = header;
                    return;
                }
            }
        }

        Tbid.api = {
            get: function () {
                return TBID.api;
            },
            set: function (api) {
                if (api) {
                    TBID.api = api;
                    return;
                }
            }
        }

        Tbid.$get = ['$q', 'HttpSrv', 'SessionStorageSrv', function tbidFactory($q, Http, SessionStorage) {
            function currentTbidInfo(tbidInfo) {
                if (tbidInfo) return SessionStorage.set(Tbid.header.get(), tbidInfo);
                return SessionStorage.get(Tbid.header.get());
            }

            function getTbid(tbid) {
                return Http.get(Tbid.api.get() + '/:tbid', {tbid: tbid});
            }

            function postTbid() {
                return Http.post(Tbid.api.get());
            }

            function saveTbidInfo(deferred) {
                return function saveTbidInfo(tbidInfo) {
                    if (tbidInfo) currentTbidInfo(tbidInfo);
                    deferred.resolve(tbidInfo);
                };
            }

            function readTbid(tbid) {
                var deferred = $q.defer();
                getTbid(tbid).then(saveTbidInfo(deferred), deferred.reject);
                return deferred.promise;
            }

            function deleteTbid(tbid) {
                var req = new XMLHttpRequest();
                req.open('DELETE', TBID.api + '/' + tbid, false); // Sync
                req.send(null);
                SessionStorage.removeItem(TBID.header)
            }

            function createTbid() {
                var deferred = $q.defer();
                postTbid().then(saveTbidInfo(deferred), deferred.reject);
                return deferred.promise;
            }

            function init() {
                var deferred = $q.defer(),
                    tbidInfo = currentTbidInfo(),
                    tbid = parseSearchPart(getSearchPart(window.location)).tbid;

                // Prioritize tbidInfo saved in SessionStorage
                if (tbidInfo) deferred.resolve(tbidInfo);
                // Get tbidInfo provided via search-param
                else if (tbid) readTbid(tbid).then(deferred.resolve, deferred.reject);
                // Create a new tbid
                else createTbid().then(deferred.resolve, deferred.reject);

                return deferred.promise;
            }

            return {
                header: Tbid.header,
                api: Tbid.api,
                create: createTbid,
                read: readTbid,
                deleteTbid: deleteTbid,
                current: currentTbidInfo,
                init: init
            };
        }];
    }

    /**
     * @doc-component service
     * @name gaiafrontend.service.tbidInterceptor
     * @description
     * This interceptor implements and manages the TBID functionality for GAIA applications.
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['$httpProvider', function ($httpProvider) {
     *         $httpProvider.interceptors.push('TbidInterceptor');
     *     ]);
     *  ```
     */

    function TbidInterceptorProvider(TbidProvider) {
        this.$get = ['SessionStorageSrv', function TbidInterceptor(SessionStorage) {
            return {
                request: function tbidRequestInterceptor(config) {
                    var header = TbidProvider.header.get(),
                        tbidInfo = SessionStorage.get(header);

                    if (tbidInfo && tbidInfo.tbid)
                        config.headers[header] = tbidInfo.tbid;

                    return config;
                }
            };
        }];
    }

    function bootstrap(name) {
        angular.element(document).ready(function () {
            var searchObj = parseSearchPart(getSearchPart(window.location)),
                Http = angular.injector(['httpSrv', 'ng']).get('HttpSrv'),
                tbidInfo = {};

            function createTbid() {
                return Http.post(TBID.api);
            }

            function readTbid(tbid) {
                return Http.get(TBID.api + '/:tbid', {tbid: tbid});
            }

            function deleteTbid(tbid) {
                //TODO no llamar cuando la sesion haya caído.
                var sessionCounterDigits = angular.element('strong', angular.element('.sessionContainer'));

                if(sessionCounterDigits.text() !== "0" ){
                    var req = new XMLHttpRequest();
                    req.open('DELETE', TBID.api + '/' + tbid, false); // Sync
                    req.send(null);
                    sessionStorage.removeItem(TBID.header);
                }
            }

            function success(response) {
                angular.extend(tbidInfo, response);
                window.sessionStorage.setItem(TBID.header, JSON.stringify(tbidInfo));
                angular.bootstrap(document, [name]);
            }

            function error() {
                window.alert(CREATING_TAB_ERROR);
            }

            if (searchObj.tbid) {
                readTbid(searchObj.tbid).then(success, error);
            } else {
                createTbid().then(function (response) {
                    success(response);
                    window.onbeforeunload = function () {
                        deleteTbid(tbidInfo.tbid);
                    };
                }, error)
            }
        });
    }

    angular.module('tbidInterceptor', [])
        .provider('Tbid', TbidProvider)
        .provider('TbidInterceptor', TbidInterceptorProvider)
        .bootstrap = bootstrap;
}());
