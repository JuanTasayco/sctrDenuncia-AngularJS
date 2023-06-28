/*global angular, nextUid */
/* jshint es3: false */
angular.module('mpType', [])
    // This directive is a copy&paste from the AngularJS input directive.
    // Created because IE8 do not support some HTML5 input types.
    .directive('mpType', ['$sniffer', '$browser',
        function($sniffer, $browser) {
            var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
                EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,
                NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,
                inputType;
            function int(str) {
                return parseInt(str, 10);
            }

            function isWindow(obj) {
                return obj && obj.document && obj.location && obj.alert && obj.setInterval;
            }

            function isScope(obj) {
                return obj && obj.$evalAsync && obj.$watch;
            }

            function toJsonReplacer(key, value) {
                var val = value;

                if (typeof key === 'string' && key.charAt(0) === '$') {
                    val = undefined;
                } else if (isWindow(value)) {
                    val = '$WINDOW';
                } else if (value && document === value) {
                    val = '$DOCUMENT';
                } else if (isScope(value)) {
                    val = '$SCOPE';
                }

                return val;
            }

            function toJson(obj, pretty) {
                if (typeof obj === 'undefined') return undefined;
                return JSON.stringify(obj, toJsonReplacer, pretty ? '  ' : null);
            }

            function minErr(module) {
                return function() {
                    var code = arguments[0],
                        prefix = '[' + (module ? module + ':' : '') + code + '] ',
                        template = arguments[1],
                        templateArgs = arguments,
                        stringify = function(obj) {
                            if (typeof obj === 'function') {
                                return obj.toString().replace(/ \{[\s\S]*$/, '');
                            } else if (typeof obj === 'undefined') {
                                return 'undefined';
                            } else if (typeof obj !== 'string') {
                                return JSON.stringify(obj);
                            }
                            return obj;
                        },
                        message, i;

                    message = prefix + template.replace(/\{\d+\}/g, function(match) {
                        var index = +match.slice(1, -1),
                            arg;

                        if (index + 2 < templateArgs.length) {
                            arg = templateArgs[index + 2];
                            if (typeof arg === 'function') {
                                return arg.toString().replace(/ ?\{[\s\S]*$/, '');
                            } else if (typeof arg === 'undefined') {
                                return 'undefined';
                            } else if (typeof arg !== 'string') {
                                return toJson(arg);
                            }
                            return arg;
                        }
                        return match;
                    });

                    message = message + '\nhttp://errors.angularjs.org/1.2.16/' +
                        (module ? module + '/' : '') + code;
                    for (i = 2; i < arguments.length; i++) {
                        message = message + (i === 2 ? '?' : '&') + 'p' + (i - 2) + '=' +
                            encodeURIComponent(stringify(arguments[i]));
                    }

                    return new Error(message);
                };
            }

            function isObject(value) {
                return angular.isObject(value);
            }

            function isString(value) {
                return angular.isString(value);
            }

            function isNumber(value) {
                return angular.isNumber(value);
            }

            function isUndefined(value) {
                return typeof value === 'undefined';
            }

            function lowercase(string) {
                return isString(string) ? string.toLowerCase() : string;
            }

            function startingTag(element) {
                element = angular.element(element).clone();
                try {
                    // turns out IE does not let you set .html() on elements which
                    // are not allowed to have children. So we just ignore it.
                    element.empty();
                } catch (e) {}
                // As Per DOM Standards
                var TEXT_NODE = 3;
                var elemHtml = angular.element('<div>').append(element).html();
                try {
                    return element[0].nodeType === TEXT_NODE ? lowercase(elemHtml) :
                        elemHtml.
                    match(/^(<[^>]+>)/)[1].
                    replace(/^<([\w\-]+)/, function(match, nodeName) {
                        return '<' + lowercase(nodeName);
                    });
                } catch (e) {
                    return lowercase(elemHtml);
                }

            }

            var trim = (function() {
                // native trim is way faster: http://jsperf.com/angular-trim-test
                // but IE doesn't have it... :-(
                // TODO: we should move this into IE/ES5 polyfill
                if (!String.prototype.trim) {
                    return function(value) {
                        return isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
                    };
                }
                return function(value) {
                    return isString(value) ? value.trim() : value;
                };
            })();

            function toBoolean(value) {
                if (typeof value === 'function') {
                    value = true;
                } else if (value && value.length !== 0) {
                    var v = lowercase('' + value);
                    value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
                } else {
                    value = false;
                }
                return value;
            }

            function validate(ctrl, validatorName, validity, value) {
                ctrl.$setValidity(validatorName, validity);
                return validity ? value : undefined;
            }

            function addNativeHtml5Validators(ctrl, validatorName, element) {
                var validity = element.prop('validity');
                if (isObject(validity)) {
                    var validator = function(value) {
                        // Don't overwrite previous validation, don't consider valueMissing to apply (ng-required can
                        // perform the required validation)
                        if (!ctrl.$error[validatorName] && (validity.badInput || validity.customError ||
                                validity.typeMismatch) && !validity.valueMissing) {
                            ctrl.$setValidity(validatorName, false);
                            return;
                        }
                        return value;
                    };
                    ctrl.$parsers.push(validator);
                }
            }

            function textInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                var validity = element.prop('validity');
                // In composition mode, users are still inputing intermediate text buffer,
                // hold the listener until composition is done.
                // More about composition events: https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent
                if (!$sniffer.android) {
                    var composing = false;

                    element.on('compositionstart', function() {
                        composing = true;
                    });

                    element.on('compositionend', function() {
                        composing = false;
                        listener();
                    });
                }

                var listener = function() {
                    if (composing) return;
                    var value = element.val();

                    // By default we will trim the value
                    // If the attribute ng-trim exists we will avoid trimming
                    // e.g. <input ng-model="foo" ng-trim="false">
                    if (toBoolean(attr.ngTrim || 'T')) {
                        value = trim(value);
                    }

                    if (ctrl.$viewValue !== value ||
                        // If the value is still empty/falsy, and there is no `required` error, run validators
                        // again. This enables HTML5 constraint validation errors to affect Angular validation
                        // even when the first character entered causes an error.
                        (validity && value === '' && !validity.valueMissing)) {
                        if (scope.$$phase) {
                            ctrl.$setViewValue(value);
                        } else {
                            scope.$apply(function() {
                                ctrl.$setViewValue(value);
                            });
                        }
                    }
                };

                // if the browser does support "input" event, we are fine - except on IE9 which doesn't fire the
                // input event on backspace, delete or cut
                if ($sniffer.hasEvent('input')) {
                    element.on('input', listener);
                } else {
                    var timeout;

                    var deferListener = function() {
                        if (!timeout) {
                            timeout = $browser.defer(function() {
                                listener();
                                timeout = null;
                            });
                        }
                    };

                    element.on('keydown', function(event) {
                        var key = event.keyCode;

                        // ignore
                        //    command            modifiers                   arrows
                        if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) return;

                        deferListener();
                    });

                    // if user modifies input value using context menu in IE, we need "paste" and "cut" events to catch it
                    if ($sniffer.hasEvent('paste')) {
                        element.on('paste cut', deferListener);
                    }
                }

                // if user paste into input using mouse on older browser
                // or form autocomplete on newer browser, we need "change" event to catch it
                element.on('change', listener);

                ctrl.$render = function() {
                    element.val(ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue);
                };

                // pattern validator
                var pattern = attr.ngPattern,
                    patternValidator,
                    match;

                if (pattern) {
                    var validateRegex = function(regexp, value) {
                        return validate(ctrl, 'pattern', ctrl.$isEmpty(value) || regexp.test(value), value);
                    };
                    match = pattern.match(/^\/(.*)\/([gim]*)$/);
                    if (match) {
                        pattern = new RegExp(match[1], match[2]);
                        patternValidator = function(value) {
                            return validateRegex(pattern, value);
                        };
                    } else {
                        patternValidator = function(value) {
                            var patternObj = scope.$eval(pattern);

                            if (!patternObj || !patternObj.test) {
                                throw minErr('ngPattern')('noregexp',
                                    'Expected {0} to be a RegExp but was {1}. Element: {2}', pattern,
                                    patternObj, startingTag(element));
                            }
                            return validateRegex(patternObj, value);
                        };
                    }

                    ctrl.$formatters.push(patternValidator);
                    ctrl.$parsers.push(patternValidator);
                }

                // min length validator
                if (attr.ngMinlength) {
                    var minlength = int(attr.ngMinlength);
                    var minLengthValidator = function(value) {
                        return validate(ctrl, 'minlength', ctrl.$isEmpty(value) || value.length >= minlength, value);
                    };

                    ctrl.$parsers.push(minLengthValidator);
                    ctrl.$formatters.push(minLengthValidator);
                }

                // max length validator
                if (attr.ngMaxlength) {
                    var maxlength = int(attr.ngMaxlength);
                    var maxLengthValidator = function(value) {
                        return validate(ctrl, 'maxlength', ctrl.$isEmpty(value) || value.length <= maxlength, value);
                    };

                    ctrl.$parsers.push(maxLengthValidator);
                    ctrl.$formatters.push(maxLengthValidator);
                }
            }

            function numberInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                textInputType(scope, element, attr, ctrl, $sniffer, $browser);

                ctrl.$parsers.push(function(value) {
                    var empty = ctrl.$isEmpty(value);
                    if (empty || NUMBER_REGEXP.test(value)) {
                        ctrl.$setValidity('number', true);
                        return value === '' ? null : (empty ? value : parseFloat(value));
                    } else {
                        ctrl.$setValidity('number', false);
                        return undefined;
                    }
                });

                addNativeHtml5Validators(ctrl, 'number', element);

                ctrl.$formatters.push(function(value) {
                    return ctrl.$isEmpty(value) ? '' : '' + value;
                });

                if (attr.min) {
                    var minValidator = function(value) {
                        var min = parseFloat(attr.min);
                        return validate(ctrl, 'min', ctrl.$isEmpty(value) || value >= min, value);
                    };

                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                }

                if (attr.max) {
                    var maxValidator = function(value) {
                        var max = parseFloat(attr.max);
                        return validate(ctrl, 'max', ctrl.$isEmpty(value) || value <= max, value);
                    };

                    ctrl.$parsers.push(maxValidator);
                    ctrl.$formatters.push(maxValidator);
                }

                ctrl.$formatters.push(function(value) {
                    return validate(ctrl, 'number', ctrl.$isEmpty(value) || isNumber(value), value);
                });
            }

            function urlInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                textInputType(scope, element, attr, ctrl, $sniffer, $browser);

                var urlValidator = function(value) {
                    return validate(ctrl, 'url', ctrl.$isEmpty(value) || URL_REGEXP.test(value), value);
                };

                ctrl.$formatters.push(urlValidator);
                ctrl.$parsers.push(urlValidator);
            }

            function emailInputType(scope, element, attr, ctrl, $sniffer, $browser) {
                textInputType(scope, element, attr, ctrl, $sniffer, $browser);

                var emailValidator = function(value) {
                    return validate(ctrl, 'email', ctrl.$isEmpty(value) || EMAIL_REGEXP.test(value), value);
                };

                ctrl.$formatters.push(emailValidator);
                ctrl.$parsers.push(emailValidator);
            }

            function radioInputType(scope, element, attr, ctrl) {
                // make the name unique, if not defined
                if (isUndefined(attr.name)) {
                    element.attr('name', nextUid());
                }

                element.on('click', function() {
                    if (element[0].checked) {
                        scope.$apply(function() {
                            ctrl.$setViewValue(attr.value);
                        });
                    }
                });

                ctrl.$render = function() {
                    var value = attr.value;
                    element[0].checked = (value === ctrl.$viewValue);
                };

                attr.$observe('value', ctrl.$render);
            }

            function checkboxInputType(scope, element, attr, ctrl) {
                var trueValue = attr.ngTrueValue,
                    falseValue = attr.ngFalseValue;

                if (!isString(trueValue)) trueValue = true;
                if (!isString(falseValue)) falseValue = false;

                element.on('click', function() {
                    scope.$apply(function() {
                        ctrl.$setViewValue(element[0].checked);
                    });
                });

                ctrl.$render = function() {
                    element[0].checked = ctrl.$viewValue;
                };

                // Override the standard `$isEmpty` because a value of `false` means empty in a checkbox.
                ctrl.$isEmpty = function(value) {
                    return value !== trueValue;
                };

                ctrl.$formatters.push(function(value) {
                    return value === trueValue;
                });

                ctrl.$parsers.push(function(value) {
                    return value ? trueValue : falseValue;
                });
            }

            inputType = {
                'text': textInputType,
                'number': numberInputType,
                'url': urlInputType,
                'email': emailInputType,
                'radio': radioInputType,
                'checkbox': checkboxInputType,
                'hidden': angular.noop,
                'button': angular.noop,
                'submit': angular.noop,
                'reset': angular.noop,
                'file': angular.noop
            };

            return {
                require: '?ngModel',
                link: function(scope, element, attributes, ngModelCtrl) {
                    if (ngModelCtrl) {
                        (inputType[lowercase(attributes.mpType)] || inputType.text)(scope, element, attributes, ngModelCtrl, $sniffer, $browser);
                    }
                }
            };
        }
    ]);
/* jshint es3: true */
