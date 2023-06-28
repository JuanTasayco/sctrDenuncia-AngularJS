/*global angular */
/*DEPRECATED*/
/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpInputNumber
 * @description
 * DEPRECATED
 * Use mpNumber instead
 */
angular.module('mpInputNumber', []).directive('mpInputNumber', ['$locale', 'UserSrv',
    function($locale, UserSrv) {
        return {
            require: '?ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var decimalSep = attrs.mpInputNumberDecimalSep,
                    groupSep = attrs.mpInputNumberGroupSep,
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

                ctrl.$parsers.push(fromViewToModel);
                ctrl.$formatters.push(fromModelToView);


                elm.on('focus', function() {
                    elm.val(ctrl.$modelValue);
                });

                elm.on('focusout', function() {
                    elm.val(formatNumber(ctrl.$modelValue));
                });
            }
        };
    }]);
