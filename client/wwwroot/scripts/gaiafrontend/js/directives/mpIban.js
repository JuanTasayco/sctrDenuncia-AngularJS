/*global angular, _*/
angular.module('mpIban', [])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpIban
        * @description
        * This component has been migrated to "GAIA Site"
        * There you will find its documentation and several examples.
        * "GAIA Site" is an application created by the Architecture Area to learn and play with GAIA. Is available in RAS. Direct links are available below in this page.
        * @example
        <doc:example>
             <doc:source>
             label GAIA site direct links are:
             a(href='https://wportalinterno.es.mapfre.net/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Intranet /
             a(href='https://wportalinterno.mapfre.com/com.ibm.ram.repository.web/faces/_rlvid.jsp?_rap=!assetDetails&_rvip=/home.jsp&guid=13A33828-B921-8DC5-DEDA-8B8D7C0EBC81') Internet
             </doc:source>
        </doc:example>
    */
    .factory('IBANSrv', function() {
        var accountLengths = {
            'AL': 28, //Albania
            'AD': 24, //Andorra
            'AT': 20, //Austria
            'AZ': 28, //Azerbaijan
            'BH': 22, //Bahrain
            'BE': 16, //Belgium
            'BA': 20, //Bosnia and Herzegovina
            'BR': 29, //Brazil
            'BG': 22, //Bulgaria
            'BF': 24, //Burkina Faso
            'CR': 21, //Costa Rica
            'HR': 21, //Croatia
            'CY': 28, //Cyprus
            'CZ': 24, //Czech Republic
            'DK': 18, //Denmark
            'DO': 28, //Dominican Republic
            'EE': 20, //Estonia
            'FO': 18, //Faroe Islands[Note 4]
            'FI': 18, //Finland
            'FR': 27, //France[Note 5]
            'GE': 22, //Georgia
            'DE': 22, //Germany
            'GI': 23, //Gibraltar
            'GR': 27, //Greece
            'GL': 18, //Greenland[Note 4]
            'GT': 28, //Guatemala
            'HU': 28, //Hungary
            'IS': 26, //Iceland
            'IE': 22, //Ireland
            'IL': 23, //Israel
            'IT': 27, //Italy
            'KZ': 20, //Kazakhstan
            'KW': 30, //Kuwait
            'LV': 21, //Latvia
            'LB': 28, //Lebanon
            'LI': 21, //Liechtenstein
            'LT': 20, //Lithuania
            'LU': 20, //Luxembourg
            'MK': 19, //Macedonia
            'MT': 31, //Malta
            'MR': 27, //Mauritania
            'MU': 30, //Mauritius
            'MC': 27, //Monaco
            'MD': 24, //Moldova
            'ME': 22, //Montenegro
            'NL': 18, //Netherlands[Note 6]
            'NO': 15, //Norway
            'PK': 24, //Pakistan
            'PS': 29, //Palestinian
            'PL': 28, //Poland
            'PT': 25, //Portugal
            'QA': 29, //Qatar
            'RO': 24, //Romania
            'SM': 27, //San Marino
            'SA': 24, //Saudi Arabia
            'RS': 22, //Serbia
            'SK': 24, //Slovakia
            'SI': 19, //Slovenia
            'ES': 24, //Spain
            'SE': 24, //Sweden
            'CH': 21, //Switzerland
            'TN': 24, //Tunisia
            'TR': 26, //Turkey
            'AE': 23, //United Arab Emirates
            'GB': 22, //United Kingdom[Note 7]
            'VG': 24 //Virgin Islands, British
        };

        function char2Digits(ch) {
            var upp = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                i;
            for (i = 0; i < upp.length; i = i + 1) {
                if (ch === upp.charAt(i)) {
                    return i + 10;
                }
            }
        }

        function calcularIBAN(ncuenta, cpais) {
            if (cpais.length !== 2) {
                return '';
            } else {
                var aux, csiguientes, tmp;
                ncuenta = ncuenta + (cpais.charCodeAt(0) - 55).toString() + (cpais.charCodeAt(1) - 55).toString() + '00';
                tmp = parseInt(ncuenta.substring(0, 9), 10) % 97;
                if (tmp < 10) {
                    aux = '0';
                } else {
                    aux = '';
                }
                aux = aux + tmp.toString();
                ncuenta = ncuenta.substring(9);
                while (ncuenta !== '') {
                    if (parseInt(aux, 10) < 10) {
                        csiguientes = 8;
                    } else {
                        csiguientes = 7;
                    }
                    if (ncuenta.length < csiguientes) {
                        aux = aux + ncuenta;
                        ncuenta = '';
                    } else {
                        aux = aux + ncuenta.substring(0, csiguientes);
                        ncuenta = ncuenta.substring(csiguientes);
                    }
                    tmp = parseInt(aux, 10) % 97;
                    if (tmp < 10) {
                        aux = '0';
                    } else {
                        aux = '';
                    }
                    aux = aux + tmp.toString();
                }
                tmp = 98 - parseInt(aux, 10);
                if (tmp < 10) {
                    return '0' + tmp.toString();
                } else {
                    return tmp.toString();
                }
            }
        }

        function string2Digits(str) {
            var result = '',
                strArray = str.split('');

            _.each(strArray, function(ch) {
                if ('0' <= ch && ch <= '9') {
                    result += ch;
                } else {
                    result += char2Digits(ch);
                }
            });

            return result;
        }

        function m97(digits) {
            var m = 0,
                digitsArray = digits.split('');

            _.each(digitsArray, function(digit) {
                m = (m * 10 + parseInt(digit, 10)) % 97;
            });

            return m;
        }

        function getIbanLength(country) {
            return accountLengths[country];
        }

        function checkIbanDigits(iban) {
            var countryCode = iban.substring(0, 2),
                checkDigits = iban.substring(2, 4),
                accountCode = iban.substring(4),
                digits = '',
                check;
            digits += string2Digits(accountCode);
            digits += string2Digits(countryCode);
            digits += checkDigits;
            check = 98 - m97(digits);
            return (check === 97);
        }

        function correctLength(value, countryCode) {
            if (typeof accountLengths[countryCode] === 'undefined') {
                return false;
            }

            return (value.length === accountLengths[countryCode]);
        }

        function isIbanRequired(value) {
            var countryCode = value.substring(0, 2);

            return value.toUpperCase() === countryCode.toUpperCase() ? false : true;
        }

        function checkIban(value) {
            var valid,
                countryCode = value.substring(0, 2);

            value = value.toUpperCase();
            if (!isIbanRequired(value)) {
                valid = true;
            } else if (!correctLength(value, countryCode)) {
                valid = false;
            } else {
                valid = checkIbanDigits(value);
            }
            return valid;
        }

        function checkAccountLengths(country, format) {
            var sum = 0;
            _.each(format, function(digit) {
                sum += digit;
            });
            return sum === accountLengths[country];
        }

        function calculatePlaceholder(size) {
            var placeholder = '',
                i;
            for (i = 1; i <= size; i = i + 1) {
                placeholder = placeholder + '0';
            }
            return placeholder;
        }

        function generateIbanField(country, format) {
            var ibanParts = [],
                positions = [],
                ibanLength = accountLengths[country],
                fieldsWithSize4 = (ibanLength / 4) - 1,
                otherFieldSize = ibanLength % 4,
                // otherFieldPlaceholder,
                i;

            if (_.isUndefined(format)) {
                positions.push(2); // Country
                positions.push(2); // IBAN code

                for (i = 1; i <= fieldsWithSize4; i = i + 1) {
                    positions.push(4);
                }

                if (otherFieldSize) {
                    positions.push(otherFieldSize);
                }

            } else {
                positions = format;
            }
/*
            ibanParts.push({
                size: 2,
                placeholder: '',
                value: country
            });
*/
            if (checkAccountLengths(country, positions)) {
                //positions = _.rest(positions);

                for (i = 0; i < positions.length; i = i + 1) {
                    ibanParts.push({
                        size: positions[i],
                        placeholder: calculatePlaceholder(positions[i]),
                        value: ''
                    });
                    if (i === 0){
                        ibanParts[i].value = country;
                    }
                }
            }

            return ibanParts;
        }

        function joinIbanParts(parts) {
            var ibanComplete = _.reduce(parts, function(acc, part) {
                return acc + part.value;
            }, '');

            return ibanComplete;
        }

        return {
            checkIban: checkIban,
            calcularIBAN: calcularIBAN,
            isIbanRequired: isIbanRequired,
            generateIbanField: generateIbanField,
            joinIbanParts: joinIbanParts,
            getIbanLength: _.memoize(getIbanLength)

        };
    })
    .directive('mpIban', ['IBANSrv', '$timeout', function(IBANSrv, $timeout) {
        return {
            restrict: 'A',
            templateUrl: 'gaiafrontend/html/iban.html',
            scope: {
                mpIban: '=',
                mpIbanAutoCalculatedDC: '=',
                mpIbanFormat: '=',
                mpName: '@name',
                mpDisabled: '='
            },
            require: '?ngModel',
            link: function(scope, element, attrs, controller) {

                var iban,
                    maxlength,
                    isRequired = attrs.required || false;

                function keyUpHandler(e) {
                    var target = e.target || e.srcElement,
                        keyCode = e.which || e.keyCode;
                    maxlength = angular.element(target).attr('maxlength');
                    if (keyCode !== 9 && keyCode !== 16 && !e.shiftKey) {
                        if (angular.element(target).val().length === (parseInt(maxlength, 10))) {
                            angular.element(target).parent().next('.form-group').find('input').focus();
                        }
                    }
                }

                function addRequiredProperty() {
                    var input = angular.element(element.find('input'));

                    if (isRequired) {
                        input.attr('aria-required', true);
                        input.prop('required', true);
                    }
                }

                function isPristineObject(element) {
                    var isPristine = true,
                        ibanInputs = angular.element(element.find('input'));
                    _.each(ibanInputs, function(item) {
                        isPristine = isPristine && angular.element(item).hasClass('ng-pristine');
                    });
                    return isPristine;
                }

                function assignDCValue(DC) {
                    if (scope.ibanParts[0].size === 2) {
                        scope.ibanParts[1].value = DC;
                    } else {
                        scope.ibanParts[0].value = scope.mpIban + DC;
                    }
                }

                scope.$watch('mpIban', function() {
                    scope.ibanParts = '';
                    scope.ibanParts = IBANSrv.generateIbanField(scope.mpIban, scope.mpIbanFormat);
                    $timeout(function() {
                        addRequiredProperty();
                        element.find('input').on('keyup', keyUpHandler);
                    });
                }, true);

                scope.$watch('ibanParts', function(newValue) {
                    if (newValue && !isPristineObject(element)) {
                        iban = IBANSrv.joinIbanParts(newValue);
                        controller.$setViewValue(iban);
                        controller.$setValidity('iban', IBANSrv.checkIban(iban));
                        if (isRequired) {
                            controller.$setValidity('required', IBANSrv.isIbanRequired(iban));
                        }
                        scope.model = iban;
                    }

                }, true);

                scope.$on('destroy', function() {
                    element.find('input').off('keyup', keyUpHandler);
                });

                controller.$render = function() {
                    scope.model = controller.$viewValue || '';
                };

                scope.$watch('model', function(newValue) {
                    var DC, cuenta, start;
                    var cccLength = 0;
                    var length = 4;
                    var mpIbanAutoCalculatedDC = scope.mpIbanAutoCalculatedDC;
                    if(scope.mpIbanFormat && scope.mpIbanFormat[0] === 4){
                        mpIbanAutoCalculatedDC = true;
                    }
                    if (scope.ibanParts[0].size === 2) {
                        start = 2;
                    } else {
                        start = 1;
                    }
                    _.each(scope.ibanParts.slice(start, scope.ibanParts.length), function(part) {
                        cccLength += part.value.length;
                    });

                    if (newValue === '') {
                        newValue = scope.mpIban;
                    }
                    if (newValue.length === IBANSrv.getIbanLength(scope.mpIban) && cccLength + 4 === IBANSrv.getIbanLength(scope.mpIban) && mpIbanAutoCalculatedDC) {
                        cuenta = newValue.substring(4, newValue.length);
                        DC = IBANSrv.calcularIBAN(cuenta, scope.mpIban);
                        assignDCValue(DC);
                    } else if (mpIbanAutoCalculatedDC){
                        assignDCValue('xx')
                    }
                    if (newValue.length === IBANSrv.getIbanLength(scope.mpIban)) {
                        if (_.isUndefined(DC)) {
                            DC = newValue.substring(2, 4);
                        }
                        assignDCValue(DC);
                        _.each(scope.ibanParts.slice(start, scope.ibanParts.length), function(part) {
                            part.value = newValue.substr(length, part.size);
                            length = length + part.size;
                        });
                    }
                }, true);
            }
        };
    }])
    .directive('numbersOnly',
        function() {
            return {
                require: 'ngModel',
                link: function(scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            };
        });
