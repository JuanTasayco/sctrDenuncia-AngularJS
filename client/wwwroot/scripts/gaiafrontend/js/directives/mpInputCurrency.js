/*TODO: REVIEW*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpInputCurrency
 * @param {string} mp-input-currency Not used.
 * @param {string} mp-input-currency-iso ISO currency code.
 * @param {integer} mp-input-currency-decimals Define the number of decimal places.
 * @param {string} mp-input-currency-group-sep Define the thousands separator.
 * @param {string} mp-input-currency-decimal-sep Define the decimals separator.
 * @description
 * This input will be used for currency data entry. Restrict data entry to numeric and decimal separator only.
 * When you lose focus apply automatic formatting element data currency on adding the thousands separator and filling decimal places with zeros.
 * This component is DEPRECATED. Please use mpNumber instead.
 */
/*global angular */
angular.module('mpInputCurrency', [])
    .directive('mpInputCurrency', ['$locale', 'UserSrv',
        function($locale, UserSrv) {
            return {
                require: '?ngModel',
                link: function(scope, elm, attrs, ctrl) {
                    var decimalSep = attrs.mpInputCurrencyDecimalSep,
                        groupSep = attrs.mpInputCurrencyGroupSep,
                        numDecimals = attrs.mpInputCurrencyDecimals,
                        currency = attrs.mpInputCurrencyIso,
                        removeDecimalSepRegExp,
                        removeInvalidCharsRegExp;

                    function formatNumber(numberString) {
                        numberString = numberString || '';

                        var num = numberString.split(decimalSep)[0],
                            decimal = numberString.split(decimalSep)[1],
                            chain = '',
                            aux,
                            count = 1,
                            m,
                            formattedNumber;

                        if (num < 0) {
                            aux = 1;
                        } else {
                            aux = 0;
                        }

                        num = num.toString();

                        for (m = num.length - 1; m >= 0; m = m - 1) {

                            chain = num.charAt(m) + chain;

                            if (count % 3 === 0 && m > aux) {
                                chain = groupSep + chain;
                            }


                            if (count === 3) {
                                count = 1;
                            } else {
                                count = count + 1;
                            }

                        }

                        // chain = chain.replace(/.,/, ",");

                        if (decimal !== undefined) {
                            formattedNumber = chain.concat(decimalSep + decimal);
                        } else {
                            formattedNumber = chain;
                        }

                        return formattedNumber;
                    }

                    function removeDecimalSep(numberString) {
                        return numberString.replace(removeDecimalSepRegExp, '');
                    }

                    function removeInvalidChars(numberString) {
                        return numberString.replace(removeInvalidCharsRegExp, '');
                    }

                    function formatDecimalPart(numberString) {
                        var position = numberString.indexOf(decimalSep),
                            part1,
                            part2;

                        if (position !== -1) {
                            numberString = removeDecimalSep(numberString);
                            part1 = numberString.slice(0, position);
                            part2 = numberString.slice(position, numberString.length);

                            numberString = part1.concat(decimalSep);
                            numberString = numberString.concat(part2);
                        }

                        return numberString;
                    }

                    function addZerosToDecimalPart(numberString) {
                        if (numberString !== '') {
                            var position = numberString.indexOf(decimalSep),
                                integerPart,
                                decimalPart,
                                i,
                                len;

                            if (position === -1) {
                                position = numberString.length;
                            }

                            numberString = removeDecimalSep(numberString);
                            integerPart = numberString.slice(0, position);
                            decimalPart = numberString.slice(position, numberString.length);

                            if (decimalPart.length < numDecimals) {
                                for (i = 0, len = numDecimals - decimalPart.length; i < len; i = i + 1) {
                                    decimalPart = decimalPart + '0';
                                }
                            }

                            numberString = integerPart.concat(decimalSep);
                            numberString = numberString.concat(decimalPart);

                            return numberString;
                        }

                        return numberString;
                    }

                    function fromModelToView(numberString) {
                        if (numberString) {
                            return numberString;
                        }
                    }

                    function fromViewToModel(numberString) {
                        numberString = removeInvalidChars(numberString);
                        numberString = formatDecimalPart(numberString);

                        ctrl.$viewValue = fromModelToView(numberString); // we need that fromModelToView to be executed even if the model doesn`t change
                        ctrl.$render();

                        return numberString;
                    }

                    function updateRegExps() {
                        removeDecimalSepRegExp = new RegExp('[' + decimalSep + ']', 'gi');
                        removeInvalidCharsRegExp = new RegExp('[^0-9' + decimalSep + ']', 'gi');
                    }

                    scope.userInfo = UserSrv.info;
                    updateRegExps();

                    if (!decimalSep) {
                        scope.$watch('userInfo.applicationData.formattingAndMask.decimalSeparator', function (userInfoDecimalSep) {
                            decimalSep = userInfoDecimalSep || $locale.NUMBER_FORMATS.DECIMAL_SEP;
                            updateRegExps();
                        });
                    }

                    if (!groupSep) {
                        scope.$watch('userInfo.applicationData.formattingAndMask.groupSeparator', function (userInfoGroupSep) {
                            groupSep = userInfoGroupSep || $locale.NUMBER_FORMATS.GROUP_SEP;
                        });
                    }

                    if (!numDecimals) {
                        scope.$watch('userInfo.applicationData.formattingAndMask.decimalLength', function (userInfoDecimalLength) {
                            numDecimals = userInfoDecimalLength || 2;
                        });
                    }

                    if (!currency) {
                        scope.$watch('userInfo.applicationData.formattingAndMask.isoCurrency', function (userInfoIsoCurrency) {
                            currency = userInfoIsoCurrency || 'EUR';
                            scope.currency = currency;
                        });
                    }
                    scope.currency = currency;

                    ctrl.$parsers.push(fromViewToModel);
                    ctrl.$formatters.push(fromModelToView);


                    elm.on('focus', function() {
                        elm.val(ctrl.$modelValue);
                        this.selectionStart = this.selectionEnd = this.value.length;
                    });

                    elm.on('focusout', function() {
                        elm.val(addZerosToDecimalPart(formatNumber(ctrl.$modelValue)));
                    });
                }
            };
        }]);
