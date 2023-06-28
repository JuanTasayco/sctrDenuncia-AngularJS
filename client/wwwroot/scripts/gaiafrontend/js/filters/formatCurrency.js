/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.formatCurrency
 * @description
 * This filter applys to the input to convert to proper currency
 * @example
   <doc:example module="FormatCurrency">
    <doc:source>
    input(ng-model="input", placeholder="Escribe para aplicar filtro")
    pre {{input | formatCurrency}}
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('formatCurrency', [])
    .filter('formatCurrency', ['$locale', 'UserSrv',
        function($locale, UserSrv) {
            return function(input) {
                var userInfo = UserSrv.info,
                    decimalSep,
                    groupSep,
                    numDecimals,
                    removeDecimalSepRegExp;

                function updateRegExp() {
                    removeDecimalSepRegExp = new RegExp('[' + decimalSep + ']', 'gi');
                }

                function updateSeparators() {
                    if (userInfo && userInfo.applicationData && userInfo.applicationData.formattingAndMask && userInfo.applicationData.formattingAndMask.decimalSeparator) {
                        decimalSep = userInfo.applicationData.formattingAndMask.decimalSeparator;
                    } else {
                        decimalSep = $locale.NUMBER_FORMATS.DECIMAL_SEP;
                    }

                    if (userInfo && userInfo.applicationData && userInfo.applicationData.formattingAndMask && userInfo.applicationData.formattingAndMask.groupSeparator) {
                        groupSep = userInfo.applicationData.formattingAndMask.groupSeparator;
                    } else {
                        groupSep = $locale.NUMBER_FORMATS.GROUP_SEP;
                    }

                    if (userInfo && userInfo.applicationData && userInfo.applicationData.formattingAndMask && userInfo.applicationData.formattingAndMask.decimalLength) {
                        numDecimals = userInfo.applicationData.formattingAndMask.decimalLength;
                    } else {
                        numDecimals = 2;
                    }
                    updateRegExp();
                }

                function formatNumber(numberString) {
                    numberString = numberString || '';
                    updateSeparators();

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

                return addZerosToDecimalPart(formatNumber(input));
            };
        }]);
