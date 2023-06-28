/*TODO: REVIEW*/
/**
 * @doc-component filter
 * @name gaiafrontend.filter.formatNumber
 * @description
 * This filter formats the number from the input.
 * @example
   <doc:example module="FormatNumber">
    <doc:source>
    input(ng-model="input", placeholder="Escribe para aplicar filtro")
    pre {{input | formatNumber}}
    </doc:source>
   </doc:example>
 */
/*global angular */
angular.module('formatNumber', [])
    .filter('formatNumber', ['$locale', 'UserSrv',
        function($locale, UserSrv) {
            return function(input) {
                var userInfo = UserSrv.info,
                    decimalSep,
                    groupSep;

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

                return formatNumber(input);
            };
        }]);
