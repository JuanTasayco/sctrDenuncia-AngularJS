/*global angular, _ */
angular.module('ngModel', ['ng', 'mpValidations'])
    .config(['$provide', function($provide) {
        function ngModelDirectiveDecorator($delegate, $compile, $locale, $timeout, $filter, $interpolate, $parse, VALIDATIONS, Events) {
            var ngModelDirective = $delegate[0],
                compile = ngModelDirective.compile;

            ngModelDirective.compile = function() {
                var postLink = compile.apply(this, arguments);

                return function(scope, element, attributes, controllers) {
                    postLink.apply(this, arguments);

                    if (angular.isDefined(attributes.novalidate)) {
                        return;
                    }
                    var ngModelCtrl = controllers[0],
                        formCtrl = controllers[1],
                        ngModelErrors = $parse(attributes.ngModelErrors)(),
                        elementName = ngModelCtrl.$name,
                        formName = formCtrl ? formCtrl.$name : undefined,
                        deregisterOnFocusOutEventListeners,
                        deregisterOnFocusInEventListeners,
                        deregisterOnSetErrorAngularEventListener,
                        deregisterOnFocusAngularEventListener,
                        deregisterOnClickAngularEventListener,
                        deregisterWatcher;

                    // Overwritten here since we cannot access to formCtrl inside ngModelCtrl
                    ngModelCtrl.$dirtify = function() {
                        element.removeClass('ng-pristine').addClass('ng-dirty');
                        ngModelCtrl.$dirty = true;
                        ngModelCtrl.$pristine = false;
                        formCtrl.$setDirty();
                    };

                    function insertErrorElement() {
                        var errorElement = element.next();

                        if (errorElement.is('.error-alert')) errorElement.remove();

                        errorElement = angular.element('<div mp-tooltip-error="' + ngModelCtrl.$name + '"></div>');
                        element.after(errorElement);
                        $compile(errorElement)(scope);
                    }

                    function getErrorType(errors) {
                        var failingErrors = _.pick(errors, function(value) {
                            return value;
                        }), errorType;

                        _.every(failingErrors, function (value, type) {
                            errorType = type;
                            if (_.keys(failingErrors).length > 1 && type === 'required') {
                                errorType = null;
                            }
                            return !errorType;
                        });

                        return errorType;
                    }

                    function manageLabelStyles(required) {
                        var formGroup = element.closest('.form-group');

                        if (required) {
                            formGroup.find('label').eq(0).addClass('required');
                        } else {
                            formGroup.find('label').eq(0).removeClass('required');
                        }
                    }

                    function addErrorStyles(formGroup, style) {
                        formGroup.addClass('has-error');
                        if (style) {
                            formGroup.addClass(style);
                        }
                    }

                    function removeErrorStyles(formGroup, style) {
                        formGroup.removeClass('has-error');
                        if (style) {
                            formGroup.addClass(style);
                        }
                    }

                    function manageErrorStyles(isInvalidAndDirty) {
                        var formGroup = element.closest('.form-group');

                        if (isInvalidAndDirty) {
                            addErrorStyles(formGroup);
                        } else {
                            removeErrorStyles(formGroup);
                        }
                    }

                    function manageErrorText(errors) {
                        var failingErrors = _.pick(errors, function(value) {
                                return value;
                            }),
                            errorText;

                        function getErrorTranslation(literal) {
                            if (!literal) {
                                return '';
                            }

                            return $filter('translate')(literal, {
                                min: attributes.ngMinlength || attributes.min,
                                max: attributes.ngMaxlength || attributes.max
                            });
                        }

                        function getErrorText(errorType) {
                            var errorText = '',
                                errorLiteral;

                            if (errorType) {

                                if (ngModelErrors) {
                                    errorText = ngModelErrors[errorType];
                                }

                                if (!errorText) {
                                    errorLiteral = 'ngModel.' + errorType;
                                    errorText = getErrorTranslation(errorLiteral);

                                    if (errorLiteral === errorText) {
                                        errorLiteral = errorType;
                                        errorText = getErrorTranslation(errorLiteral);
                                    }

                                    if (errorLiteral === errorText) {
                                        errorText = '';
                                    }
                                }
                            }

                            return errorText;
                        }

                        errorText = getErrorText(getErrorType(errors));

                        // $errorText is overwritten only when there are not any custom error faling
                        if (_.union(VALIDATIONS, _.keys(failingErrors)).length === VALIDATIONS.length) {
                            formCtrl[elementName].$errorText = errorText;
                        }
                    }

                    function clearCustomError() {
                        if (!formCtrl[elementName]) return;

                        angular.forEach(formCtrl[elementName].$customError, function(errorText, error) {
                            formCtrl[elementName].$setValidity(error, true);
                        });
                    }

                    function setCustomError(error) {
                        formCtrl[elementName].$customError = error;
                        angular.forEach(error, function(errorText, error) {
                            formCtrl[elementName].$errorText = errorText;
                            formCtrl[elementName].$setValidity(error, false);
                        });
                        ngModelCtrl.$dirtify();
                    }

                    function listenOnSetErrorAngularEvent() {
                        function setError(event, error) {
                            setCustomError(error);
                        }

                        return scope.$on(Events.$formControlError(formName + elementName), setError);
                    }

                    function listenOnFocusAngularEvent() {
                        function focus() {
                            element.focus();
                        }
                        return scope.$on(Events.$formControlFocus(formName + elementName), focus);
                    }

                    function listenOnClicksAngularEvent() {
                        function click() {
                            element.click();
                        }
                        return scope.$on(Events.$formControlClick(formName + elementName), click);
                    }

                    function watchControlAndRequiredAttribute() {
                        // Just one watcher because of performance issues https://trello.com/c/ssgQToEX
                        return scope.$watch(function () {
                            return {
                                invalidAndDirty: formCtrl[elementName] && formCtrl[elementName].$invalid && formCtrl[elementName].$dirty,
                                error: formCtrl[elementName] && formCtrl[elementName].$error,
                                hasRequiredAttribute: attributes.required
                            }
                        }, function (values) {
                            manageErrorStyles(values.invalidAndDirty);
                            manageErrorText(values.error || {});
                            manageLabelStyles(values.hasRequiredAttribute);
                        }, true);
                    }

                    // FIX: Avoid $apply already in progress error
                    // https://docs.angularjs.org/error/$rootScope/inprog?p0=$apply#triggering-events-programmatically
                    function applyLater(fn) {
                        $timeout(fn);
                    }

                    function listenOnFocusOutEvent() {
                        function onFocusOutFn() {
                            applyLater(function() {
                                ngModelCtrl.$dirtify();
                            });
                        }

                        element.on('focusout', onFocusOutFn);
                        return function() {
                            element.off('focusout', onFocusOutFn);
                        };
                    }

                    function listenOnFocusInEvent() {
                        function onFocusInFn() {
                            applyLater(function() {
                                clearCustomError();
                            });
                        }

                        element.on('focusin', onFocusInFn);
                        return function() {
                            element.off('focusin', onFocusInFn);
                        };
                    }

                    function deregisterListenersAndWatchers() {
                        deregisterOnFocusOutEventListeners();
                        deregisterOnFocusInEventListeners();
                        deregisterOnSetErrorAngularEventListener();
                        deregisterOnFocusAngularEventListener();
                        deregisterOnClickAngularEventListener();
                        deregisterWatcher();
                    }

                    function listenEventsAndWatchChanges() {
                        deregisterOnFocusOutEventListeners = listenOnFocusOutEvent();
                        deregisterOnFocusInEventListeners = listenOnFocusInEvent();
                        deregisterOnSetErrorAngularEventListener = listenOnSetErrorAngularEvent();
                        deregisterOnFocusAngularEventListener = listenOnFocusAngularEvent();
                        deregisterOnClickAngularEventListener = listenOnClicksAngularEvent();
                        deregisterWatcher = watchControlAndRequiredAttribute();

                        element.on('$destroy', deregisterListenersAndWatchers);
                    }

                    if (formName && elementName) {
                        insertErrorElement();
                        listenEventsAndWatchChanges();
                    }

                };
            };

            return $delegate;
        }

        ngModelDirectiveDecorator.$inject = ['$delegate', '$compile', '$locale', '$timeout', '$filter', '$interpolate', '$parse', 'VALIDATIONS', 'Events'];

        $provide.decorator('ngModelDirective', ngModelDirectiveDecorator);
    }]);
