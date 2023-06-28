/*global angular */
angular.module('i18nInterceptor', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.i18nInterceptor
     * @description
     * This service is meant to be used as a `$http` interceptor.
     *
     * This interceptor affixes the language/locale to some resources so GAIA internationalization works as intended.
     *
     * To use this interceptor in your application you only have to add this service to the `$httpProvider.interceptor` Array of your application as follows:
     *
     *  ```js
     *  var appModule = angular.module('myAppName', ['gaiafrontend']);
     *  appModule
     *     .config(['$httpProvider', function ($httpProvider) {
     *         $httpProvider.interceptors.push('i18nInterceptor');
     *     ]);
     *  ```
     */
    .factory('i18nInterceptor', ['Language', function (Language) {
        function isDictionaryRequest(config) {
            var jsonRegExp = new RegExp('messages\\.json(\\?.*)?', 'g');
            return config.method === 'GET' && jsonRegExp.test(config.url);
        }

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

        function affixLanguage(config) {
            var urlRegExp = new RegExp('(.*\\/)*(.*)(\\..*$)'),
                urlParts = config.url.match(urlRegExp),
                filePath = urlParts[1],
                fileName = urlParts[2],
                extension = urlParts[3],
                language = Language.get(),
                languageId = language.languageId,
                countryId = language.countryId,
                languageAffix = '';

                if (languageId) {
                    languageAffix += '_' + languageId;
                }

                if (countryId) {
                    languageAffix += '-' + countryId;
                }

            config.url = filePath + fileName + languageAffix + extension;
        }

        return {
            request: function(config) {
                if (isDictionaryRequest(config) || (isHtmlRequest(config) && !isVendorTpl(config))) {
                    affixLanguage(config);
                }

                return config;
            }
        };
    }]);
