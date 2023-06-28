/*global angular, _ */
angular.module('language', [])
    .constant('LanguageConfig', {
        COOKIE_NAME: 'gaiaLanguage',
        // WARNING! Any change made in LanguageConfig.supportedLanguages involve changes in gaiafrontend/js/vendor/components/i18n folder (in angular-locale files).
        supportedLanguages: ['en','es','pt','tr','fr','it','el','de','zh','nl','ar','sv','ru']
    })
    /**
     * @doc-component service
     * @name gaiafrontend.service.language
     * @description
     * This service manages the application language. A lot of services dependes on `Language`.
     */
    .factory('Language', ['$window', '$locale', '$rootScope', '$timeout', '$translate', 'CookieSrv', 'LanguageConfig', 'Events', 'Loader',
        function($window, $locale, $rootScope, $timeout, $translate, CookieSrv, LanguageConfig, Events, Loader) {
            // userLanguage is for IE8
            var browsersLanguage = $window.navigator.language || $window.navigator.userLanguage,
                initialLanguage = CookieSrv.getCookie(LanguageConfig.COOKIE_NAME) || browsersLanguage,
                supportedLanguages = angular.isDefined($window.gaiaapplication) ? $window.gaiaapplication.languages.toLowerCase().split(',') : LanguageConfig.supportedLanguages,
                languageRegExp = /([A-Za-z]{2,3})-?([A-Za-z]{2,3})?/,
                locale = {
                    languageId: '',
                    countryId: ''
                };

            function isLanguageSupported(supportedLanguages, language) {
                return _.find(supportedLanguages, function (supportedLanguage) {
                    return supportedLanguage === language;
                });
            }

            function estimateLanguage (language) {
                var matches = language.match(languageRegExp);
                if (isLanguageSupported(supportedLanguages, matches[1])) {
                    return matches[1];
                } else {
                    return supportedLanguages[0];
                }
            }

            function saveLocale(languageId, countryId) {
                var baseUrl = 'i18n/angular-locale_languageId-countryId.js',
                    localeString = countryId ? languageId + '-' + countryId : languageId;

                if (languageId === locale.languageId && countryId === locale.countryId) {
                    return;
                }

                if (!isLanguageSupported(supportedLanguages, localeString)) {
                    languageId = estimateLanguage(localeString);
                    countryId = '';
                    localeString = languageId;
                }

                // Save in locale object the currant language
                locale.languageId = languageId;
                locale.countryId = countryId;
                // Tell translate filter which language to use
                $translate.uses(localeString);
                // Set a cookie with the current language
                CookieSrv.setCookie(LanguageConfig.COOKIE_NAME, localeString);
                // Retrieve the angular-locale file
                Loader.load(baseUrl.replace('languageId', languageId).replace('-countryId', countryId ? '-' + countryId : ''))
                    .then(function() {
                        // replace the current $locale
                        angular.extend($locale, angular.injector(['ngLocale']).get('$locale'));
                        // Notify the application that the current language has been changed
                        $rootScope.$emit(Events.$languageChanged);
                    });
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.language
             * @name gaiafrontend.service.language#set
             * @param {string} language Language to be set as locale. The language set might be in one of the following formats: 'languageId' or 'languageId-countryId'.
             * @description
             * This method sets the web application locale object.
             * If the language we are trying to set is not available it will be set in english ('en').
             * A cookie `LanguageConfig.COOKIE_NAME` is set with the current locale.
             * An event `Events.$languageChanged` is emitted every time the method is called.
             */
            function setLanguage(language) {
                var matches = language.match(languageRegExp),
                    languageId = (matches[1] || supportedLanguages[0]).toLowerCase(),
                    countryId = (matches[2] || '').toLowerCase();

                saveLocale(languageId, countryId);
            }

            /**
             * @doc-component method
             * @methodOf gaiafrontend.service.language
             * @name gaiafrontend.service.language#get
             * @return {object} Current locale object
             * @description
             * This method obtains the web application locale object.
             */

            function getLanguage() {
                return locale;
            }

            // Defaults locale object with language-cookie > browser language
            setLanguage(initialLanguage);

            return {
                set: setLanguage,
                get: getLanguage,
                /*TODO: DEPRECATE */
                LANGUAGE_CHANGED_EVENT: Events.$languageChanged
            };
        }]);
