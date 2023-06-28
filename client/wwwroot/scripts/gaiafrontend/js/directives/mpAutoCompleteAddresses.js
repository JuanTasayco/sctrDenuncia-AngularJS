/*global angular, _ */
angular.module('mpAutoCompleteAddresses', [])
    /**
     * @doc-component service
     * @name gaiafrontend.service.autoCompleteAddressesFactory
     * @description
     * This service has been migrated to "GAIA Site"
     * There you will find its documentation and several examples.
     * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
     */
    .factory('AutoCompleteAddressesFactory', ['$q', 'HttpSrv', function ($q, HttpSrv) {
        var url = 'api/autocomplete/address',
            cache = {};

        function AutoCompleteAddressesFactory() {
            var abortLastRequest = angular.noop;

            function isCityInCache(cache, address) {
                return !!_.find(cache, function(cityCache) {
                    return cityCache.nombreVia === address
                })
            }

            this.post = function post(address, postalCode, city) {
                var deferred = $q.defer(),
                    aborter = $q.defer();

                if (address && postalCode && !isCityInCache(cache, address)) {
                    abortLastRequest();
                    abortLastRequest = function () {
                        aborter.resolve();
                    };

                    HttpSrv.post(url, {address: address, postalCode: postalCode, city: city || null}, null, {timeout: aborter.promise})
                        .then(function (data) {
                            deferred.resolve(data);
                            cache = data.addresses;
                        }, function () {
                            deferred.resolve({addresses: []});
                        });
                } else {
                    deferred.resolve({addresses: []});
                }

                return deferred.promise;
            };
        }

        return AutoCompleteAddressesFactory;
    }])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpAutoCompleteAddresses
     * @param {expression} mpAutoCompleteAddressesModel Model that stores the address
     * @param {expression} mpAutoCompleteAddressesPostalCode Postal/Zip code required for service call
     * @param {expression} mpAutoCompleteAddressesCityCode City code optional for service call
     * @description
     * Input that allows auto complete addresses.
     * @example
       <doc:example module="mpAutoCompleteAddresses">
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
    .directive('mpAutoCompleteAddresses', ['$compile', 'AutoCompleteAddressesFactory', function ($compile, AutoCompleteAddressesFactory) {
        return {
            priority: 9999,
            terminal: true,
            scope: true,
            require: '^form',
            link: function (scope, element, attrs, formCtrl) {
                attrs.$set('bsTypeahead', attrs.mpAutoCompleteAddresses);
                attrs.$set('ngModel', attrs.mpAutoCompleteAddressesModel);
                attrs.$set('ngOptions', 'address.nombreVia as address.nombreVia for address in getAddresses($viewValue,' + attrs.mpAutoCompleteAddressesPostalCode + ',' + attrs.mpAutoCompleteAddressesCityCode + ')');
                angular.forEach(attrs.$attr, function (attr) {
                    if (attr.indexOf('mp-auto-complete-addresses') > -1) {
                        element.removeAttr(attr);
                    }
                });
                $compile(element)(scope);

                var suggester = new AutoCompleteAddressesFactory();

                scope.getAddresses = function (address, postalCode, city) {
                    if (formCtrl[attrs.name].$valid) {
                        return suggester.post(address, postalCode, city)
                        .then(function(res) {
                            return res.addresses;
                        });
                    }
                };
            }
        };
    }]);
