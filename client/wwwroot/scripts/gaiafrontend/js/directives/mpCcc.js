/*global angular, _*/
angular.module('mpCcc', [])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpCcc
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

    .factory('CCCSrv', function () {

        var pesos = [1, 2, 4, 8, 5, 10, 9, 7, 3, 6],
            DC_NO_INFORMADO = '**';

        function checkCCC(ccc, optionalDC) {
            function correctLengths(cc1, cc2, dc) {
                return (cc1.match(/^\d{8}$/) && cc2.match(/^\d{10}$/) && (dc.match(/^\d{2}$/) || dc.match(/^\*\*$/)));
            }

            function checkEmptyDC(dc) {
                return optionalDC && dc === DC_NO_INFORMADO;
            }

            function calculateDC(cc) {
                var i,
                    dc = 0,
                    lengthDif = pesos.length - cc.length;
                for (i = cc.length - 1; i >= 0; i -= 1) {
                    dc += pesos[i + lengthDif] * cc.charAt(i);
                }
                dc = 11 - (dc % 11);
                if (11 === dc) {
                    dc = 0;
                } else if (10 === dc) {
                    dc = 1;
                }
                return dc;
            }

            function checkDC(entidad, oficina, dc, numcuenta) {
                var cc1 = entidad + oficina,
                    cc2 = numcuenta,
                    dc1,
                    dc2;
                if (!correctLengths(cc1, cc2, dc)) {
                    return false;
                }
                if (checkEmptyDC(dc)) {
                    return true;
                }
                dc1 = calculateDC(cc1);
                dc2 = calculateDC(cc2);
                return ((10 * dc1 + dc2) === parseInt(dc, 10));
            }

            return checkDC(ccc.bankCode || '', ccc.branchCode || '', ccc.checkDigits || DC_NO_INFORMADO, ccc.accountNumber || '');
        }

        return {
            checkCCC: checkCCC
        };
    })
    .directive('mpCcc', ['CCCSrv',
        function (CCCSrv) {
            return {
                restrict: 'A',
                templateUrl: 'gaiafrontend/html/ccc.html',
                replace: true,
                scope: {
                    mpLabels: '@',
                    mpDcOptional: '@'
                },
                require: '?ngModel',
                link: function(scope, element, attrs, ngModelCtrl) {
                    var maxlength,
                        isRequired = attrs.required || false;

                    scope.singleField = attrs.mpSingleField ? true : false;

                    scope.model = {};


                    if (scope.singleField) {
                        scope.cccSingleField = attrs.mpCcc + 'CCC';
                    } else {
                        scope.bankCodeLabel = attrs.mpCcc + 'BankCode';
                        scope.branchCodeLabel = attrs.mpCcc + 'BranchCode';
                        scope.checkDigitsLabel = attrs.mpCcc + 'CheckDigits';
                        scope.accountNumberLabel = attrs.mpCcc + 'AccountNumber';
                    }

                    function isPristineObject(element) {
                        var isPristine = true;
                        isPristine = isPristine && element.hasClass('ng-pristine');
                        return isPristine;
                    }

                    function isEmptyObject(ccc) {
                        var empty = true;
                        angular.forEach(ccc, function(value) {
                            empty = empty && _.isEmpty(value);
                        });
                        return empty;
                    }

                    function joinModelStructure() {
                        var model = scope.model,
                            account = model.bankCode + model.branchCode + model.checkDigits + model.accountNumber;

                        return account;
                    }

                    function buildModelStructure() {
                        var cuenta = scope.model.cccSingleField === '' ? '' :  scope.model.cccSingleField || joinModelStructure();
                        scope.model = angular.extend(scope.model, {
                            bankCode: cuenta.substr(0, 4),
                            branchCode: cuenta.substr(4, 4),
                            checkDigits: cuenta.substr(8, 2),
                            accountNumber: cuenta.substr(10, 10)
                        });

                    }

                    function addFormatters() {
                        var toModel = function (modelValue) {
                            return modelValue;
                        };
                        var toView = function (viewValue) {
                            var model = _.pick(viewValue, ['bankCode', 'branchCode', 'checkDigits' , 'accountNumber']);
                            ngModelCtrl.$viewValue = viewValue;
                            ngModelCtrl.$render();
                            return model;
                        };

                        ngModelCtrl.$formatters.push(toModel);
                        ngModelCtrl.$parsers.push(toView);
                    }

                    scope.$watch('model', function(newValue) {
                        if (newValue) {
                            ngModelCtrl.$dirtify();
                        }

                        if (newValue && !isPristineObject(element)) {
                            ngModelCtrl.$setViewValue(newValue);
                            if (scope.singleField) {
                                buildModelStructure();
                            }

                            if (scope.mpDcOptional === 'true') {
                                ngModelCtrl.$setValidity('ccc', CCCSrv.checkCCC(scope.model, true));
                            } else {
                                ngModelCtrl.$setValidity('ccc', CCCSrv.checkCCC(scope.model));
                            }

                            if (isEmptyObject(newValue)) {
                                if (isRequired) {
                                    ngModelCtrl.$setValidity('required', false);
                                }
                                ngModelCtrl.$setValidity('ccc', true);
                            }
                        }
                    }, true);

                    if (ngModelCtrl) {
                        ngModelCtrl.$render = function() {
                            scope.model = ngModelCtrl.$viewValue || '';
                            if (scope.singleField && (scope.model.bankCode || scope.model.branchCode|| scope.model.accountNumber|| scope.model.checkDigits)) {
                                buildModelStructure();
                                angular.extend(scope.model, {cccSingleField: joinModelStructure()});
                            }
                        };
                    }

                    function interaction(element, attrs) {
                        var input = angular.element(element.find('input')),
                            isDcOptional = attrs.mpDcOptional;

                        if (isRequired) {
                            if (isDcOptional === 'true') {
                                angular.element(input[0]).attr('aria-required', true);
                                angular.element(input[1]).attr('aria-required', true);
                                angular.element(input[3]).attr('aria-required', true);
                                angular.element(input[0]).prop('required', true);
                                angular.element(input[1]).prop('required', true);
                                angular.element(input[3]).prop('required', true);
                            } else {
                                input.attr('aria-required', true);
                                input.prop('required', true);
                            }
                        }
                    }

                    interaction(element, attrs);

                    function keyUpHandler(e) {
                        var target = e.target || e.srcElement,
                            keyCode = e.which || e.keyCode;
                        maxlength = angular.element(target).attr('maxlength');
                        if (keyCode !== 9 && keyCode !== 16 && !e.shiftKey) {
                            if (angular.element(target).val().length === (parseInt(maxlength, 10))) {
                                angular.element(target).parent().next().find('input').focus();
                            }
                        }
                    }

                    element.find('input').on('keyup', keyUpHandler);

                    scope.$on('destroy', function () {
                        element.find('input').off('keyup', keyUpHandler);
                    });

                    addFormatters();

                }
            };
        }])

    .directive('numbersOnly',
        function() {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
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
