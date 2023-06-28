/*global angular, $ */
angular.module('mpNumber', [])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpNumber
     * @description
     *
     * This directive forces the model to be saved as a number if possible.
     *
     * Validation is not executed. If needed you can use `[mp-type="number"]` instead.
     *
     * @example
       <doc:example module="mpNumber">
        <doc:source>
        script
            function MyCtrl($scope) {
                $scope.$watch('model', function (model) {
                    $scope.modelType = typeof model;
                });
            }
            MyCtrl.$inject = ['$scope'];
        div(ng-controller="MyCtrl")
            form(role="form", name="mpNumberForm", novalidate")
                input.form-control(type="text", ng-model="model", mp-number="mp-number")
                span Model type: {{modelType}}
        </doc:source>
       </doc:example>
     */
    .directive('mpNumber', ['$locale', 'UserSrv','$parse', function($locale, UserSrv, $parse) {
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                var config = $parse(attrs.mpNumberConfig)(scope) || {};
                var decimalSep = config.mpNumberDecimalSep,
                    groupSep = config.mpNumberGroupSep,
                    numDecimals = config.mpNumberDecimals,
                    useMaskInNumber = config.mpNumberMask,
                    removeDecimalSepRegExp,
                    removeInvalidCharsRegExp;

                    function formatNumber(numberString) {
                        numberString = numberString || '';
                        numberString = numberString.replace('.', decimalSep);

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
                        if(numberString) {
                            return numberString.replace(removeDecimalSepRegExp, '');
                        }
                    }

                    function removeInvalidChars(numberString) {
                        if(numberString) {
                            if(numberString.substring(0, 1) === '-') {
                                return '-' + numberString.replace(removeInvalidCharsRegExp, '');
                            }
                            else {
                                return numberString.replace(removeInvalidCharsRegExp, '');
                            }
                        }
                    }

                    function formatDecimalPart(numberString) {
                        if(numberString) {
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
                    }

                    function addZerosToDecimalPart(numberString) {
                        if (numberString) {
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
                        var numberString2;
                        if (numberString) {
                            numberString2 = numberString.replace(decimalSep, '.');
                        }

                        ctrl.$viewValue = fromModelToView(numberString); // we need that fromModelToView to be executed even if the model doesn`t change
                        ctrl.$render();

                        if(!useMaskInNumber) {
                            return parseInt(numberString2, 10);
                        }
                        else {
                            return numberString2;
                        }
                    }

                    function updateRegExps() {
                        removeDecimalSepRegExp = new RegExp('[' + decimalSep + ']', 'gi');
                        if(useMaskInNumber) {
                            removeInvalidCharsRegExp = new RegExp('[^0-9' + decimalSep + ']', 'gi');
                        }
                        else {
                            removeInvalidCharsRegExp = new RegExp('[^0-9]', 'gi');
                        }

                    }
                if(useMaskInNumber) {
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

                    ctrl.$parsers.push(fromViewToModel);
                    ctrl.$formatters.push(fromModelToView);

                    if(useMaskInNumber) {
                        elm.on('focus', function() {
                            var valToPutInInput;
                            if(ctrl.$modelValue) {
                                if(ctrl.$modelValue.replace) {
                                    valToPutInInput = ctrl.$modelValue.replace('.', decimalSep);
                                }
                                else {
                                    valToPutInInput = ctrl.$modelValue;
                                }
                            }
                            elm.val(valToPutInInput);
                            this.selectionStart = this.selectionEnd = this.value.length;
                        });

                        elm.on('focusout', function() {
                                elm.val(addZerosToDecimalPart(formatNumber(ctrl.$modelValue)));
                        });
                    }
                }
                else {
                    ctrl.$parsers.push(function(value) {
                        var number = parseFloat(value),
                            empty = ctrl.$isEmpty(number);
                        if(empty) {
                            return;
                        }
                        else {
                            return number;
                        }
                    });
                }
            }
        };
    }]);
