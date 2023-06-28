/*TODO: Review. See current angular-translate project (https://github.com/angular-translate/angular-translate). It now supports asynchronous loading */
/*global angular */
angular.module('i18n', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.i18n
     * @description
     * This service manages the dictionary used by Pascal Precht 'translate' filter.
     *
     * It is used by the framework when navigating to a state with a 'dictionary' property defined in its state object (or in any of its parent states).
     */
    .provider('i18n', function () {
        var translateProvider = {};

        function setTranslateProviderTranslations(translations) {
            translateProvider.translations = translations;
        }

        return {
            setTranslateProviderTranslations: setTranslateProviderTranslations,
            $get: ['Language', '$q', 'HttpSrv', function (Language, $q, HttpSrv) {
                function setDictionary(dictionary) {
                    var lang = Language.get().languageId;
                    translateProvider.translations(lang, dictionary);
                }

                /**
                 * @doc-component method
                 * @methodOf gaiafrontend.service.i18n
                 * @name gaiafrontend.service.i18n#getDictionary
                 * @param {string} url Url to the JSON dictionary.
                 * @return {promise} It will pass the requested dictionary object to the success callback.
                 * @description
                 * This method obtains the requested dictionary JSON.
                 * If succeeds it will be registered in $translateProvider.
                 */
                function getDictionary() {
                    var urls = Array.prototype.slice.call(arguments),
                        deferred = $q.defer();

                    if (urls.length) {
                        var dictionaryPromises = _.map(urls, function (url) {
                            return HttpSrv.get(url);
                        })

                        $q.all(dictionaryPromises)
                            .then(function (dictionaries) {
                                var dictionary = angular.extend.apply(null, Array.prototype.concat({}, dictionaries));
                                setDictionary(dictionary);
                                deferred.resolve(dictionary);
                            }, deferred.reject);
                    }

                    return deferred.promise;
                }

                return {
                    getDictionary: getDictionary
                };
            }]
        };
    });
