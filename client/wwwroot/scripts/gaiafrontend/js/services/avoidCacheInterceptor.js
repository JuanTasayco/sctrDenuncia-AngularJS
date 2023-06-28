/*global angular */
angular.module('avoidCacheInterceptor', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.avoidCacheInterceptor
     * @description
     * This service has been migrated to "GAIA Site"
     * There you will find its documentation and several examples.
     * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
     */
    .factory('avoidCacheInterceptor', ['Utils', function (Utils) {

        function isHtmlRequest(config) {
            var htmlRegExp = new RegExp('\\.html(\\?.*)?', 'g');
            return config.method === 'GET' && htmlRegExp.test(config.url);
        }

        function isVendorTpl(config) {
            // ui.bootstrap templates pattern: template/*/*.html
            // mgcrea.ngStrap templates pattern: */*.tpl.html
            var tplRegExp = new RegExp('(template\\/.*\\/.*\\.html|.*\\/.*\\.tpl\\.html)(\\?.*)?');
            return config.method === 'GET' && tplRegExp.test(config.url);
        }

        function avoidCache(config) {
            config.cache = false;
            // HTTP 1.1
            config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
            // HTTP 1.0
            config.headers.Pragma = 'no-cache';
            // Proxies
            config.headers.Expires = '0';
            // IE8
            if (Utils.platform.isIE8()) {
                var cacheBuster = new Date().getTime();
                config.url = config.url.replace(/[?|&]cacheBuster=\d+/,'');
                config.url += config.url.indexOf('?') === -1 ? '?' : '&'; // Some url's already have '?' attached
                config.url += 'cacheBuster=' + cacheBuster;
            }
        }

        return {
            request: function(config) {
                if ((isHtmlRequest(config) && !isVendorTpl(config))) {
                    avoidCache(config);
                }
                return config;
            }
        };
    }]);
