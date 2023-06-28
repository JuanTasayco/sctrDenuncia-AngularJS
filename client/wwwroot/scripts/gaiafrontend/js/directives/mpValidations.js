/*global angular, _ */
angular.module('mpValidations', [])
    .constant('VALIDATIONS', [
        'required',
        'minlength',
        'maxlength',
        'type',
        'number',
        'min',
        'max',
        'url',
        'email',
        'pattern',
        'iban',
        'ccc',
        'date',
        'document'//,
        // 'past',
        // 'future',
        // 'digits',
        // 'decimalMin',
        // 'decimalMax'
    ])
    .constant('VALIDATION_ATTRIBUTES', [
        'required',
        'ng-required',
        'ng-minlength',
        'ng-maxlength',
        'ng-pattern',
        'mp-type',
        'min',
        'max'
    ])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpValidations
     * @param {string} mp-validations A JSON with the validations to apply to the form.
     * @param {string} mp-validations-model The model of the `form`. The one is going to be sent. The directive will create a 'gaiaFormName' property with the form name.
     * @param {string=} mp-validations-watch Angular expression we want to watch. When this expression changes its value the `form` is re-compiled applying the new value as validations to the `form`.
     * @description
     * This directive is used to validate forms and display input errors.
     * The form must have a `name` attribute. The inputs we want to validate must have a `name` aswell and its value must be the path of its `ngModel` from `mpValidationsModel`.
     * @example
       <doc:example module="mpValidations">
        <doc:source>
        validations = {"name":{"notNull":true},"secondLastName":{"notNull":true,"size":{"min":3,"max":10}}}
        div(ng-controller="UserController")
            button.btn.btn-danger(type="button", ng-click="changeValidation()") Change validation
            form.form-horizontal(name='userForm', mp-validations-model='user', mp-validations=JSON.stringify(validations), mp-validations-watch="validationsWatch")
                h3 User info
                .control-group
                    label.control-label(for="name") Name
                    .controls
                        input#name(type="text", name="name", ng-model="user.name", placeholder="John")
                .control-group
                    label.control-label(for="secondLastName") Last name
                    .controls
                        input#secondLastName(type="text", name="secondLastName", ng-model="user.secondLastName", placeholder="Doe")
                .form-actions
                    button.btn.btn-danger(type="button", ng-disabled="!userForm.$valid", ng-click="updateUserInfo()") Update
                h3 Model sent
                .control-group
                    pre(ng-bind="userModelSent | json")
            script
                function UserController($scope) {
                    var flag = true;

                    $scope.changeValidation = function() {
                        var originalValidation = {
                            "name": {
                                "notNull": true
                            },
                            "secondLastName": {
                                "notNull": true,
                                "size": {
                                    "min": 3,
                                    "max": 10
                                }
                            }
                        }, newValidation = {
                            "name": {},
                            "secondLastName": {
                                "notNull": true
                            }
                        };

                        flag = !flag;

                        $scope.validationsWatch = flag ? originalValidation : newValidation;
                    }

                    $scope.updateUserInfo = function() {
                        $scope.userModelSent = angular.copy($scope.user);
                    }
                }

                UserController.$inject = ['$scope'];
        </doc:source>
       </doc:example>
     */
    .directive('mpValidations', ['$parse', '$compile', 'VALIDATION_ATTRIBUTES',
        function($parse, $compile, VALIDATION_ATTRIBUTES) {
            var oldValidations;

            function addFormControlValidation(formControl, validation) {
                if (validation.notNull) {
                    formControl.attr('required', true);
                }

                if (validation.size) {
                    if (validation.size.min) {
                        formControl.prop('type', 'text');
                        formControl.attr('ng-minlength', validation.size.min);
                    }
                    if (validation.size.max) {
                        formControl.prop('type', 'text');
                        formControl.attr('ng-maxlength', validation.size.max);
                    }
                }

                if (validation.email) {
                    formControl.prop('type', 'text');
                    formControl.attr('mp-type', 'email');
                }

                if (validation.url) {
                    formControl.prop('type', 'text');
                    formControl.attr('mp-type', 'url');
                }

                if (validation.pattern) {
                    if (validation.pattern.regexp) {
                        formControl.prop('type', 'text');
                        formControl.attr('ng-pattern', validation.pattern.regexp);
                    }
                }

                if (validation.min) {
                    formControl.prop('type', 'text');
                    formControl.attr('mp-type', 'number');
                    formControl.attr('min', validation.min.value);
                }

                if (validation.max) {
                    formControl.prop('type', 'text');
                    formControl.attr('mp-type', 'number');
                    formControl.attr('max', validation.max.value);
                }

                // if (validation.past) {
                //     formControl.attr('past', true);
                // }

                // if (validation.future) {
                //     formControl.attr('future', true);
                // }

                // if (validation.digits) {
                //     formControl.attr('ng-pattern', new RegExp('^-?[0-9]+(.[0-9]+)?$'));
                // }

                // if (validation.decimalMin) {
                //     formControl.attr('min', parseInt(validation.decimalMin.value, 10));
                // }

                // if (validation.decimalMax) {
                //     formControl.attr('max', parseInt(validation.decimalMax.value, 10));
                // }
            }

            function addFormValidations(form, validations) {
                angular.forEach(validations, function(validation, formControlName) {
                    // Look for name+'Code' and name+'Desc' controls because of mpOptionsList
                    var formControl = form.find('[name="' + formControlName + '"], [name="' + formControlName + 'Code"], [name="' + formControlName + 'Desc"]');

                    if (formControl.length) {
                        addFormControlValidation(angular.element(formControl), validation);
                    }
                });
            }

            function removeFormControlValidations(formControl) {
                angular.forEach(VALIDATION_ATTRIBUTES, function(attribute) {
                    if (!_.isUndefined(formControl.attr(attribute))) {
                        formControl.removeAttr(attribute);
                    }
                });
            }

            function removeAllFormValidations(form) {
                var formControls = form.find('[ng-model]');

                angular.forEach(formControls, function(formControl) {
                    removeFormControlValidations(angular.element(formControl));
                });
            }

            return {
                restrict: 'A',
                require: '?form',
                compile: function(cElem) {
                    if (oldValidations) {
                        addFormValidations(cElem, oldValidations);
                    }

                    cElem.html(cElem.html());
                    return function(scope, lElem, lAttrs, formCtrl) {
                        var validations = lAttrs.mpValidations,
                            model = lAttrs.mpValidationsModel,
                            formName = lAttrs.name;

                        function manageValidations(newValidations) {
                            if (!_.isEqual(newValidations, oldValidations)) {
                                oldValidations = newValidations;
                                removeAllFormValidations(lElem);
                                $compile(lElem)(scope);
                            }
                        }

                        function watchFormValidations() {
                            return scope.$watch(function() {
                                return $parse(validations)(scope);
                            }, manageValidations, true);
                        }

                        function watchFormModel() {
                            return scope.$watch(model, function(newModel) {
                                if (newModel) {
                                    newModel.gaiaFormName = formName;
                                }
                            }, true);
                        }

                        formCtrl['$' + formName + 'ValidationsWatcher'] = formCtrl['$' + formName + 'ValidationsWatcher'] || watchFormValidations();

                        formCtrl['$' + formName + 'ModelWatcher'] = formCtrl['$' + formName + 'ModelWatcher'] || watchFormModel();
                    };
                }
            };
        }]);
