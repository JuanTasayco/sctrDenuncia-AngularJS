/*global angular, _*/
angular.module('mpAutoCompleteCity', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.autoCompleteCitySrv
     * @description
     * This service has been migrated to "GAIA Site"
     * There you will find its documentation and several examples.
     * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
     */
    .factory('AutoCompleteCitySrv', ['$q', 'HttpSrv', function ($q, HttpSrv) {
            var url = 'api/autocomplete/city/:postalCode',
                cache = {};

            function AutoCompleteCityFactory() {
                var abortLastRequest = angular.noop;

                function isCityInCache(cache, city) {
                    return !!_.find(cache, function(cityCache) {
                        return cityCache.poblacion === city
                    })
                }

                this.get = function get(postalCode, city) {
                    var deferred = $q.defer(),
                        aborter = $q.defer();

                    if (postalCode && city && !isCityInCache(cache, city)) {
                        abortLastRequest();
                        abortLastRequest = function () {
                            aborter.resolve();
                        };

                        HttpSrv.get(url, {postalCode: postalCode}, {params: {city: city}}, {timeout: aborter.promise})
                            .then(function (data) {
                                deferred.resolve(data);
                                cache = data.cities;
                            }, function () {
                                deferred.resolve({cities: []});
                            });
                    } else {
                        deferred.resolve({cities: []});
                    }
                    return deferred.promise;
                };
            }
            return AutoCompleteCityFactory;
        }])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpAutoCompleteCity
     * @param {expression} mpAutoCompleteCityModel Model that stores the locality
     * @param {expression} mpAutoCompleteCityPostalCode Postal/Zip code required for service call
     * @description
     * Input that allows auto complete locality.
     * @example
       <doc:example module="mpAutoCompleteCity">
        <doc:source>
        label The example is currently unavailable. If you want to try this component out, you can visit:
        a(href='http://vles044273-008:8081/issuestracker/login.html#/') Issuestracker
        h2 Log in
        h4 User: UGAIA1
        h4 Password: UGAIA1
        h4 Navigate to Normalizations submenu.
        </doc:source>
       </doc:example>
     */
    .directive('mpAutoCompleteCity', ['$compile', 'AutoCompleteCitySrv', function ($compile, AutoCompleteCitySrv) {
        return {
            priority: 9999,
            terminal: true,
            scope: true,
            require: '^form',
            link: function (scope, element, attrs, formCtrl) {
                attrs.$set('bsTypeahead', attrs.mpAutoCompleteCity);
                attrs.$set('ngModel', attrs.mpAutoCompleteCityModel);
                attrs.$set('ngOptions', 'city.poblacion as city.poblacion for city in getCities(' + attrs.mpAutoCompleteCityPostalCode + ', $viewValue)');
                angular.forEach(attrs.$attr, function (attr) {
                    if (attr.indexOf('mp-auto-complete-city') > -1) {
                        element.removeAttr(attr);
                    }
                });
                $compile(element)(scope);

                var suggester = new AutoCompleteCitySrv(),
                    cache = {};

                scope.getCities = function (postalCode, city) {
                    if (formCtrl[attrs.name].$valid) {
                        return suggester.get(postalCode, city)
                            .then(function(res) {
                                angular.forEach(res.cities, function (city) {
                                    cache[city.poblacion] = city.identificador;
                                });
                                return res.cities;
                            });
                    }
                };
                scope.$watch(attrs.ngModel, function (poblacion) {
                    if (poblacion) {
                        scope[attrs.mpAutoCompleteCityId] = cache[poblacion];
                        cache = {};
                    }
                });
            }
        };
    }]);
