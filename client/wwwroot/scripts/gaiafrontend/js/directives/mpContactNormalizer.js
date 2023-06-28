/*global angular, _ */
/*jshint camelcase: false */
/*TODO: Refactor!! Clean code!! */
angular.module('mpContactNormalizer', [])
    .factory('contactNormalizerModalGrid', ['$filter',
        function($filter) {
            return {
                getOptions: function() {
                    var options = {
                        'datatype': 'local',
                        'multiselect': true,
                        'height': 'auto',
                        'colNames': [
                            $filter('translate')('mpContactNormalizer.property'),
                            $filter('translate')('mpContactNormalizer.field'),
                            $filter('translate')('mpContactNormalizer.initialValue'),
                            $filter('translate')('mpContactNormalizer.normalizedValue')
                        ],
                        'colModel': [{
                            'name': 'property',
                            'index': 'property',
                            'hidden': true
                        }, {
                            'name': 'field',
                            'index': 'field',
                            'align': 'left'
                        }, {
                            'name': 'initialValue',
                            'index': 'initialValue',
                            'align': 'left'
                        }, {
                            'name': 'normalizedValue',
                            'index': 'normalizedValue',
                            'align': 'left'
                        }],
                        'loadonce': true,
                        'mtype': 'GET',
                        'gridview': true,
                        'sortname': 'name',
                        'viewrecords': true,
                        'sortorder': 'asc',
                        'footerrow': false,
                        'autowidth': true,
                        'emptyrecords': $filter('translate')('mpContactNormalizer.no_records_found')
                    };
                    return options;
                }
            };
        }])
    .controller('ContactNormalizerModalCtrl', ['$scope', '$filter', '$modalInstance', 'contactNormalizerModalGrid', 'modelBeforeNormalization', 'modelAfterLastSuggestionsApplied', 'normalization',
        function($scope, $filter, $modalInstance, contactNormalizerModalGrid, modelBeforeNormalization, modelAfterLastSuggestionsApplied, normalization) {
            function createContactNormalizerModalGridData() {
                var gridData = [];

                if (normalization.nombre) {
                    gridData.push({
                        property: 'nombre',
                        field: (!modelBeforeNormalization.apellido1 && !modelBeforeNormalization.apellido2) ? $filter('translate')('mpContactNormalizer.razon_social') : $filter('translate')('mpContactNormalizer.nombre'),
                        initialValue: modelBeforeNormalization.nombre,
                        normalizedValue: normalization.nombre
                    });
                }

                if (normalization.apellido1) {
                    gridData.push({
                        property: 'apellido1',
                        field: $filter('translate')('mpContactNormalizer.apellido1'),
                        initialValue: modelBeforeNormalization.apellido1,
                        normalizedValue: normalization.apellido1
                    });
                }

                if (normalization.apellido2) {
                    gridData.push({
                        property: 'apellido2',
                        field: $filter('translate')('mpContactNormalizer.apellido2'),
                        initialValue: modelBeforeNormalization.apellido2,
                        normalizedValue: normalization.apellido2
                    });
                }

                if (normalization.sexo && modelBeforeNormalization.sexo && !angular.equals(normalization.sexo, modelBeforeNormalization.sexo)) {
                    gridData.push({
                        property: 'sexo',
                        field: $filter('translate')('mpContactNormalizer.sexo'),
                        initialValue: modelBeforeNormalization.sexo || '',
                        normalizedValue: normalization.sexo
                    });
                }

                return gridData;
            }

            $scope.grid = {
                data: createContactNormalizerModalGridData(),
                options: contactNormalizerModalGrid.getOptions(),
                model: []
            };

            $scope.$on('contactNormalizerGridSet', function() {
                $scope.grid.model = _.filter($scope.grid.data, function(item) {
                    return angular.equals(modelAfterLastSuggestionsApplied[item.property], item.normalizedValue);
                });
            });

            function getAcceptedSuggestionsModel() {
                var allSuggestions = _.pluck($scope.grid.data, 'property'),
                    acceptedSuggestions = _.pluck($scope.grid.model, 'property'),
                    rejectedSuggestions = _.difference(allSuggestions, acceptedSuggestions),
                    acceptedSuggestionsModel = {};

                angular.forEach(acceptedSuggestions, function(property) {
                    acceptedSuggestionsModel[property] = normalization[property];
                });

                angular.forEach(rejectedSuggestions, function(property) {
                    acceptedSuggestionsModel[property] = modelBeforeNormalization[property];
                });

                return acceptedSuggestionsModel;
            }
            $scope.accept = function() {
                $modalInstance.close(getAcceptedSuggestionsModel());
            };
        }])
    .factory('ContactNormalizerSrv', ['$q', 'HttpSrv',
        function($q, HttpSrv) {
            var contactUrl = 'api/normalize/contact';

            function normalize(stringToNormalize) {
                var deferred = $q.defer();

                HttpSrv.post(contactUrl, {
                    data: {
                        contact: stringToNormalize
                    }
                }).then(function(data) {
                    var obj = {};

                    angular.forEach(data, function(value, key) {
                        if (key === 'apelldio2') {
                            key = 'apellido2';
                        }
                        obj[key] = angular.isString(value) ? value.replace(/^\s+|\s+$/g, '') : value;
                    });

                    deferred.resolve(obj);
                }, deferred.reject);
                return deferred.promise;
            }
            return {
                normalize: normalize
            };
        }])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpContactNormalizer
     * @param {expression} mp-contact-normalizer The result of the expression must be an object. The object will map internal variables with model variables.
     * @param {expression=} mp-contact-normalizer-options The result of the expression must be an object. This object will configure the directive behaviour.
     * @description
     *
     * This directive allows you to normalize contact information. A contact might be a physical person or a corporation.
     *
     * The keys in the object map passed as mp-contact-normalizer will be the internal variable names and its values will be the model expression they will be bound to.
     * These are all the internal variables that can be mapped:
     *
     * - `nombre` - (REQUIRED) The name of the physical person/corporate name.
     * - `apellido1` - The first surname of the physical person.
     * - `apellido2` - The second surname of the physical person.
     * - `sexo` - The gender of the of the physical person.
     * - `tip_situ_val` - Current situation of the normalization. Its values are: null (not normalized), '1' (normalization accepted) and '2' (normalization rejected)
     * - `normalize` - Method to request normalization.
     * - `openModal` - Method to open a model with the normalization response.
     * - `applyNormalization` - Method to apply normalization to the model.
     *
     * If `apellido1` and `apellido2` are not mapped the directive will display only one input for corporate name.
     * If they both are mapped the directive will display several inputs for physical person.
     *
     * The `normalize` method will use `nombre` model (and `apellido1` model and `apellido2` model when physical person) to request normalization.
     * It will return a promise. This promise will be resolved with normalization model.
     *
     * The `openModal` method will use normalization model as argument and will apply the normalization itself.
     *
     * The `applyNormalization` method will use normalizations to apply model and the normalization response model as arguments.
     *
     * These are all the available options for directive configuration:
     *
     * - `hide` - If truthy the directive will not render any DOM element. Defaults to falsy.
     * - `sexo` - If truthy the directive will render the gender select element. Defaults to falsy.
     * - `warn` - If truthy the directive will render an information icon with the current situation of the normalization when normalized at least once. If normalizable it can be clicked to open a modal window to manage normalization.
     * - `onBlur` - AngularJS expression to evaluate (usually normalization method) when `blur` event is triggered by the las `input` element visible (`apellido2` when physical person and `nombre` when corporate name).
     * - `sizes` - Object to extend default input length to capture by the directive.
     *     - `nombre` defaults to 150 characters.
     *     - `apellido1` defaults to 30 characters.
     *     - `apellido2` defaults to 30 characters.
     *     - `sexo` defaults to 1 character.
     *
     * If we desire to normalize a corporate name when focusing out the input and then display suggestions in a modal after clicking the icon
     * this could be the mapping object...
     *
     *  ```js
     *  {
     *      "nombre": "contactModel.personaJuridica",
     *      "tip_situ_val": "contactModel.normalizationStatus",
     *      "normalize": "contactModel.requestContactNormalization"
     *  }
     *  ```
     *
     * ... and this could be the options object.
     *
     *  ```js
     *  {
     *      "warn": true,
     *      "onBlur": "contactModel.requestContactNormalization()"
     *  }
     *  ```
     * Given these objects, the directive invocation will result in something like this:
     *
     *  ```js
     *  div(mp-contact-normalizer="{'nombre': 'contactModel.personaJuridica', 'tip_situ_val': 'contactModel.normalizationStatus', 'normalize': 'contactModel.requestContactNormalization'}", mp-contact-normalizer-options="{'warn': true, 'onBlur': 'contactModel.requestContactNormalization()'}")
     *  ```
     *
     * The example is currently unavailable. If you want to try this component out, you can visit: [http://vles044273-008:8081/issuestracker/login.html#/](http://vles044273-008:8081/issuestracker/login.html#/) log in (user: UGAIA1 /password: UGAIA1) and navigate to Normalizations submenu.
     *
     * @example
       <doc:example module="mpContactNormalizer">
        <doc:source>
        label The example is currently unavailable. If you want to try this component out, you can visit:
        a(href='http://vles044273-008:8081/issuestracker/login.html#/') Issuestracker
        h2 Log in
        h4 User: UGAIA1
        h4 Password: UGAIA1
        h4 Navigate to Normalizations submenu.
        </doc:source>
       </doc:example>
     */
    .directive('mpContactNormalizer', ['$parse', '$q', '$filter', '$modal', 'Utils', 'ContactNormalizerSrv', 'Events',
        function($parse, $q, $filter, $modal, Utils, ContactNormalizerSrv, Events) {
            var defaultOptions = {
                    sizes: {
                        nombre: 150, // CDC
                        apellido1: 30, // CDC
                        apellido2: 30, // CDC
                        sexo: 1 // CDC
                    }
                },
                NO_NORMALIZADO = null,
                NORMALIZACION_RECHAZADA = '0',
                NORMALIZACION_ACEPTADA = '1';

            function isPersonaFisica(normalizationMap) {
                return normalizationMap.hasOwnProperty('nombre') && normalizationMap.hasOwnProperty('apellido1') && normalizationMap.hasOwnProperty('apellido2');
            }

            function isPersonaJuridica(normalizationMap) {
                return normalizationMap.hasOwnProperty('nombre') && !normalizationMap.hasOwnProperty('apellido1') && !normalizationMap.hasOwnProperty('apellido2');
            }

            function validate(normalizationMap) {
                if (!angular.isObject(normalizationMap)) {
                    throw new Error('[mp-contact-normalizer] must be an object');
                }

                if (!normalizationMap.nombre) {
                    throw new Error('[mp-contact-normalizer] object must own \'nombre\' property');
                }
            }
            return {
                require: '^form',
                compile: function(cElement, cAttributes) {
                    var normalizationMap = $parse(cAttributes.mpContactNormalizer)(),
                        options = angular.extend(angular.copy(defaultOptions), $parse(cAttributes.mpContactNormalizerOptions)());

                    function createContactNormalizerElement(colSize, labelText, ngModelExpression, maxlength, onBlurFn) {
                        var wrapper = angular.element('<div class="col-md-' + colSize + '"></div>'),
                            formGroup = angular.element('<div class="form-group"></div>'),
                            label = angular.element('<label class="col-sm-6 control-label" for="' + ngModelExpression + '">' + labelText + '</label>'),
                            inputWrapper = angular.element('<div class="validable col-sm-6"></div>'),
                            input = angular.element('<input type="text" id="' + ngModelExpression + '" name="' + ngModelExpression + '" maxlength="' + maxlength + '" class="form-control" mp-to-upper-case="" ng-model="' + ngModelExpression + '"' + (onBlurFn ? ' ng-blur="' + onBlurFn + '"' : '') + '></input>');

                        inputWrapper.append(input);
                        formGroup.append(label).append(inputWrapper);
                        wrapper.append(formGroup);

                        return wrapper;
                    }

                    function createContactNormalizerSexoElement(colSize, labelText, ngModelExpression) {
                        var wrapper = angular.element('<div class="col-md-' + colSize + '"></div>'),
                            formGroup = angular.element('<div class="form-group"></div>'),
                            label = angular.element('<label class="col-sm-6 control-label" for="' + ngModelExpression + '">' + labelText + '</label>'),
                            inputWrapper = angular.element('<div class="validable col-sm-6"></div>'),
                            input = angular.element('<select id="' + ngModelExpression + '" name="' + ngModelExpression + '" class="form-control" mp-to-upper-case="" ng-model="' + ngModelExpression + '" ng-options="sexo.code as sexo.description for sexo in [{code: \'V\', description: \'' + $filter('translate')('mpContactNormalizer.varon') + '\'}, {code: \'M\', description: \'' + $filter('translate')('mpContactNormalizer.mujer') + '\'}, {code: \'X\', description: \'' + $filter('translate')('mpContactNormalizer.indeterminado') + '\'}]"><option value="" selected="selected">' + $filter('translate')('select') + '</option></input>');

                        inputWrapper.append(input);
                        formGroup.append(label).append(inputWrapper);
                        wrapper.append(formGroup);

                        return wrapper;
                    }

                    function createContactNormalizerWarnElement(colOffset) {
                        var wrapper = angular.element('<div class="col-md-4 col-md-offset-' + colOffset + '"></div>'),
                            img = angular.element('<img class="contact-normalizer-warn-img" src="gaiafrontend/img/icon/icon-detail.png"></img>'),
                            anchor = angular.element('<a class="contact-normalizer-warn-anchor" style="vertical-align: bottom; margin-left: 10px;">' + $filter('translate')('mpContactNormalizer.results_suggested') + '</a>');

                        wrapper.append(img).append(anchor);

                        return wrapper;
                    }

                    function preparePersonaJuridicaDOM() {
                        var row = angular.element('<div class="row"></div>'),
                            razonSocialElement = createContactNormalizerElement(8, $filter('translate')('mpContactNormalizer.razon_social'), normalizationMap.nombre, options.sizes.nombre || defaultOptions.sizes.nombre, options.onBlur),
                            warnRow,
                            warnElement;

                        row.append(razonSocialElement);
                        cElement.append(row);

                        if (options.warn) {
                            warnRow = angular.element('<div class="row" style="display: none;"></div>');
                            warnElement = createContactNormalizerWarnElement(4);
                            warnRow.append(warnElement);
                            cElement.append(warnRow);
                        }
                    }

                    function preparePersonaFisicaDOM() {
                        var row = angular.element('<div class="row"></div>'),
                            nombreElement = createContactNormalizerElement(4, $filter('translate')('mpContactNormalizer.nombre'), normalizationMap.nombre, options.sizes.nombre || defaultOptions.sizes.nombre, options.onBlur),
                            apellido1Element = createContactNormalizerElement(4, $filter('translate')('mpContactNormalizer.apellido1'), normalizationMap.apellido1, options.sizes.apellido1 || defaultOptions.sizes.apellido1, options.onBlur),
                            apellido2Element = createContactNormalizerElement(4, $filter('translate')('mpContactNormalizer.apellido2'), normalizationMap.apellido2, options.sizes.apellido2 || defaultOptions.sizes.apellido2, options.onBlur),
                            sexoElement = createContactNormalizerSexoElement(4, $filter('translate')('mpContactNormalizer.sexo'), normalizationMap.sexo),
                            warnRow,
                            warnElement;

                        row.append(nombreElement).append(apellido1Element).append(apellido2Element);

                        if (options.sexo) {
                            row.append(sexoElement);
                        }

                        cElement.append(row);

                        if (options.warn) {
                            warnRow = angular.element('<div class="row" style="display: none;"></div>');
                            warnElement = createContactNormalizerWarnElement(2);
                            warnRow.append(warnElement);
                            cElement.append(warnRow);
                        }
                    }
                    if (!options.hide && !cElement.contents().length) {
                        if (isPersonaFisica(normalizationMap)) {
                            preparePersonaFisicaDOM();
                        } else if (isPersonaJuridica(normalizationMap)) {
                            preparePersonaJuridicaDOM();
                        }
                    }
                    return function(scope, element, attributes, formCtrl) {
                        var normalizationMap = $parse(attributes.mpContactNormalizer)(),
                            options = angular.extend(angular.copy(defaultOptions), $parse(attributes.mpContactNormalizerOptions)()),
                            normalizing,
                            normalizationStatus,
                            lastNormalization,
                            modelBeforeNormalization = {},
                            modelAfterLastSuggestionsApplied = {},
                            nombreFormControl,
                            apellido1FormControl,
                            apellido2FormControl,
                            sexoFormControl,
                            deregisterLastNormalizationWatcher,
                            deregisterWarnElementOnClickListener,
                            deregisterControlChangesWatcher;

                        function saveNormalizationStatus(status) {
                            normalizationStatus = status; // NO_NORMALIZADO | NORMALIZACION_RECHAZADA | NORMALIZACION_ACEPTADA
                            if (normalizationMap.tip_situ_val) {
                                $parse(normalizationMap.tip_situ_val).assign(scope, status);
                            }
                        }

                        function createContactNormalizerInputString() {
                            var contactNormalizerInputString = '';

                            contactNormalizerInputString += ($parse(normalizationMap.nombre)(scope) || '').substr(0, options.sizes.nombre);

                            if (normalizationMap.apellido1) {
                                contactNormalizerInputString += ' ' + ($parse(normalizationMap.apellido1)(scope) || '').substr(0, options.sizes.apellido1);
                            }

                            if (normalizationMap.apellido2) {
                                contactNormalizerInputString += ' ' + ($parse(normalizationMap.apellido2)(scope) || '').substr(0, options.sizes.apellido2);
                            }

                            return Utils.string.trim(Utils.string.replaceDiacritics(contactNormalizerInputString));
                        }

                        function setFormControlsDisablePropTo(value) {
                            nombreFormControl.prop('disabled', value);
                            apellido1FormControl.prop('disabled', value);
                            apellido2FormControl.prop('disabled', value);
                            sexoFormControl.prop('disabled', value);
                        }

                        function disableNormalization() {
                            setFormControlsDisablePropTo(true);
                            normalizing = true;
                        }

                        function enableNormalization() {
                            setFormControlsDisablePropTo(false);
                            normalizing = false;
                        }

                        function saveModelAfterLastSuggestionsApplied() {
                            angular.forEach(normalizationMap, function(normalizationExpression, normalizationPropertyName) {
                                modelAfterLastSuggestionsApplied[normalizationPropertyName] = $parse(normalizationExpression)(scope);
                            });
                        }

                        function saveModelBeforeNormalization() {
                            angular.forEach(normalizationMap, function(normalizationExpression, normalizationPropertyName) {
                                modelBeforeNormalization[normalizationPropertyName] = $parse(normalizationExpression)(scope);
                            });
                        }

                        function applySuggestion(value, property) {
                            value = value || '';

                            if (normalizationMap[property] && value.length <= (options.sizes[property] || defaultOptions.sizes[property])) {
                                $parse(normalizationMap[property]).assign(scope, value);
                            }
                        }

                        function applySuggestions(normalizationsToApply) {
                            angular.forEach(normalizationsToApply, applySuggestion);
                            saveModelAfterLastSuggestionsApplied();
                        }

                        function applyNormalization(normalizationsToApply) {
                            saveModelBeforeNormalization();
                            applySuggestions(normalizationsToApply);
                        }
                        if (normalizationMap.applyNormalization) {
                            $parse(normalizationMap.applyNormalization).assign(scope, applyNormalization);
                        }

                        function openContactNormalizationModal(normalization) {
                            var modalOptions = {
                                size: 'lg',
                                backdrop: 'static',
                                keyboard: false,
                                scope: scope,
                                templateUrl: 'gaiafrontend/html/mpContactNormalizerModal.html',
                                controller: 'ContactNormalizerModalCtrl',
                                resolve: {
                                    modelBeforeNormalization: function() {
                                        return modelBeforeNormalization;
                                    },
                                    modelAfterLastSuggestionsApplied: function() {
                                        return modelAfterLastSuggestionsApplied;
                                    },
                                    normalization: function() {
                                        return normalization;
                                    }
                                }
                            };

                            function areThereRejections(changesToRevert) {
                                var thereAreRejections = false;

                                angular.forEach(changesToRevert, function(value, property) {
                                    if (!angular.equals(lastNormalization[property], value)) {
                                        thereAreRejections = true;
                                    }
                                });

                                return thereAreRejections;
                            }

                            return $modal.open(modalOptions).result.then(function(changesToRevert) {
                                applySuggestions(changesToRevert);

                                if (areThereRejections(changesToRevert)) {
                                    saveNormalizationStatus(NORMALIZACION_RECHAZADA);
                                } else {
                                    saveNormalizationStatus(NORMALIZACION_ACEPTADA);
                                }
                            });
                        }
                        if (normalizationMap.openModal) {
                            $parse(normalizationMap.openModal).assign(scope, openContactNormalizationModal);
                        }

                        function getMainControlsObject() {
                            var mainControlsObject = {};

                            angular.forEach(_.keys(normalizationMap), function(property) {
                                if ((property === 'nombre' || property === 'apellido1' || property === 'apellido2')) {
                                    mainControlsObject[property] = formCtrl[normalizationMap[property]];
                                }
                            });

                            return mainControlsObject;
                        }

                        function checkIfAnyControlIsInvalid(mainControlsObject) {
                            var isAnyControlInvalid = false;

                            angular.forEach(mainControlsObject, function(ngModelCtrl) {
                                if (!ngModelCtrl.$modelValue) {
                                    isAnyControlInvalid = true;
                                }
                            });

                            return isAnyControlInvalid;
                        }

                        function checkIfEveryControlIsDirty(mainControlsObject) {
                            var isEveryControlDirty = true;

                            angular.forEach(mainControlsObject, function(ngModelCtrl) {
                                if (!ngModelCtrl.$dirty) {
                                    isEveryControlDirty = false;
                                }
                            });

                            return isEveryControlDirty;
                        }

                        // TODO: Improve performance. Too many loops!
                        function validateControls() {
                            var mainControlsObject = getMainControlsObject(),
                                areControlsInvalid = checkIfAnyControlIsInvalid(mainControlsObject),
                                isEveryMainControlDirty = checkIfEveryControlIsDirty(mainControlsObject);

                            if (areControlsInvalid && isEveryMainControlDirty) {
                                angular.forEach(mainControlsObject, function(ngModelCtrl) {
                                    if (!ngModelCtrl.$modelValue) {
                                        scope.$broadcast(Events.$formControlError(formCtrl.$name + ngModelCtrl.$name), {
                                            normalization: 'Required for normalization.'
                                        });
                                    }
                                });
                            }

                            return !areControlsInvalid;
                        }

                        function hasModelChangedSinceLastNormalizationWasApplied() {
                            var modelValueHasChanged = false;

                            if (!_.isEmpty(modelAfterLastSuggestionsApplied)) {
                                angular.forEach(normalizationMap, function(normalizationExpression, normalizationPropertyName) {
                                    if ((normalizationPropertyName === 'nombre' || normalizationPropertyName === 'apellido1' || normalizationPropertyName === 'apellido2') && $parse(normalizationExpression)(scope) !== modelAfterLastSuggestionsApplied[normalizationPropertyName]) {
                                        modelValueHasChanged = true;
                                    }
                                });
                            }
                            return modelValueHasChanged;
                        }

                        function isNormalizable() {
                            return (normalizationStatus === NO_NORMALIZADO) || hasModelChangedSinceLastNormalizationWasApplied();
                        }

                        function parseNormalization(normalization) {
                            var normalizationsToApply = {},
                                parsedModel = {
                                    nombre: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.nombre)(scope) || '')),
                                    apellido1: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.apellido1)(scope) || '')),
                                    apellido2: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.apellido2)(scope) || '')),
                                    sexo: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.sexo)(scope) || ''))
                                },
                                parsedNormalization = {
                                    nombre: Utils.string.trim(normalization.nombre),
                                    apellido1: Utils.string.trim(normalization.nexosApellido1 + ' ' + normalization.apellido1),
                                    apellido2: Utils.string.trim(normalization.nexosApellido2 + ' ' + normalization.apellido2),
                                    sexo: Utils.string.trim(normalization.sexo)
                                };

                            function validateGenre() {
                                var isValidGenre = true;

                                if (isPersonaFisica(normalizationMap) && parsedNormalization.sexo === 'E') {
                                    isValidGenre = false;
                                } else if (isPersonaJuridica(normalizationMap)) {
                                    if (parsedNormalization.sexo === 'V' || parsedNormalization.sexo === 'M') {
                                        isValidGenre = false;
                                    }
                                }

                                return isValidGenre;
                            }

                            if (parsedModel.nombre && parsedNormalization.nombre && !angular.equals(parsedModel.nombre, parsedNormalization.nombre)) {
                                normalizationsToApply.nombre = parsedNormalization.nombre;
                            }

                            if (parsedModel.apellido1 && parsedNormalization.apellido1 && !angular.equals(parsedModel.apellido1, parsedNormalization.apellido1)) {
                                normalizationsToApply.apellido1 = parsedNormalization.apellido1;
                            }

                            if (parsedModel.apellido2 && parsedNormalization.apellido2 && !angular.equals(parsedModel.apellido2, parsedNormalization.apellido2)) {
                                normalizationsToApply.apellido2 = parsedNormalization.apellido2;
                            }

                            if (parsedNormalization.sexo && !angular.equals(parsedModel.sexo, parsedNormalization.sexo)) {
                                if (validateGenre()) {
                                    normalizationsToApply.sexo = parsedNormalization.sexo;
                                } else {
                                    normalizationsToApply.sexo = parsedModel.sexo;
                                }
                            }

                            return normalizationsToApply;
                        }

                        function setMainControlsPristine() {
                            var mainControlsObject = getMainControlsObject();

                            angular.forEach(mainControlsObject, function(ngModelCtrl) {
                                ngModelCtrl.$setPristine();
                            });
                        }

                        function normalize() {
                            var deferred = $q.defer();

                            if (normalizing) {
                                deferred.reject();
                                return deferred.promise;
                            }

                            if (!validateControls()) {
                                deferred.reject();
                                return deferred.promise;
                            }

                            if (!isNormalizable()) {
                                deferred.reject();
                                return deferred.promise;
                            }

                            disableNormalization();

                            ContactNormalizerSrv.normalize(createContactNormalizerInputString()).then(function(normalization) {
                                var normalizationsToApply = parseNormalization(normalization);
                                setMainControlsPristine();
                                applyNormalization(normalizationsToApply);
                                lastNormalization = normalizationsToApply;
                                saveNormalizationStatus(NORMALIZACION_ACEPTADA);
                                deferred.resolve(normalizationsToApply);
                            }, deferred.reject)['finally'](enableNormalization);
                            return deferred.promise;
                        }

                        if (normalizationMap.normalize) {
                            $parse(normalizationMap.normalize).assign(scope, normalize);
                        }

                        function listenWarnElementOnClick() {
                            var warnElements = element.find('a.contact-normalizer-warn-anchor,img.contact-normalizer-warn-img');

                            warnElements.off('click');
                            warnElements.on('click', function(event) {
                                openContactNormalizationModal(lastNormalization);
                                event.preventDefault();
                            });

                            return function() {
                                warnElements.off('click');
                                warnElements.on('click', function(event) {
                                    event.preventDefault();
                                });
                            };
                        }

                        function updateIncam() {
                            var mainControlsObject = getMainControlsObject(),
                                incam = {};

                            if (normalizationMap.incam) {
                                angular.forEach(mainControlsObject, function(ngModelCtrl, property) {
                                    if (lastNormalization) {
                                        incam[property] = angular.equals(ngModelCtrl.$modelValue, lastNormalization[property]);
                                    } else {
                                        incam[property] = false;
                                    }
                                });

                                $parse(normalizationMap.incam).assign(scope, incam);
                            }
                        }

                        function manageWarnRowVisibility() {
                            var warnRow = element.find('a.contact-normalizer-warn-anchor').closest('.row');

                            if (lastNormalization && !_.isEmpty(lastNormalization)) {
                                // If only gender is normalized and no gender were selected we will not show the pop-up link
                                if (_.keys(lastNormalization).length === 1 && lastNormalization.sexo && !modelBeforeNormalization.sexo && !angular.equals(modelBeforeNormalization.sexo, lastNormalization.sexo)) {
                                    warnRow.hide();
                                } else {
                                    warnRow.show();
                                }
                            } else {
                                warnRow.hide();
                            }
                        }

                        function watchLastNormalization() {
                            return scope.$watch(function() {
                                return lastNormalization;
                            }, function() {
                                updateIncam();
                                manageWarnRowVisibility();
                            });
                        }

                        function watchControlChanges() {
                            return scope.$watch(function() {
                                return hasModelChangedSinceLastNormalizationWasApplied();
                            }, function(hasModelChangedSinceLastNormalizationWasApplied) {

                                updateIncam();

                                if (hasModelChangedSinceLastNormalizationWasApplied && normalizationStatus !== NORMALIZACION_RECHAZADA) {
                                    var warnRow = element.find('a.contact-normalizer-warn-anchor').closest('.row');
                                    saveNormalizationStatus(NORMALIZACION_RECHAZADA);
                                    warnRow.hide();
                                } else if (!hasModelChangedSinceLastNormalizationWasApplied && normalizationStatus === NORMALIZACION_RECHAZADA) {
                                    saveNormalizationStatus(NORMALIZACION_ACEPTADA);
                                }
                            });
                        }

                        function deregisterWatchersAndEventListeners() {
                            deregisterLastNormalizationWatcher();
                            deregisterWarnElementOnClickListener();
                            deregisterControlChangesWatcher();
                        }

                        function watchChangesAndListenEvents() {
                            deregisterLastNormalizationWatcher = watchLastNormalization();
                            deregisterWarnElementOnClickListener = listenWarnElementOnClick();
                            deregisterControlChangesWatcher = watchControlChanges();
                            element.on('$destroy', deregisterWatchersAndEventListeners);
                        }

                        validate(normalizationMap);

                        saveNormalizationStatus(NO_NORMALIZADO);

                        if (isPersonaJuridica(normalizationMap)) {
                            $parse(normalizationMap.sexo).assign(scope, 'E');
                        }

                        nombreFormControl = element.find('[ng-model="' + normalizationMap.nombre + '"]');
                        apellido1FormControl = element.find('[ng-model="' + normalizationMap.apellido1 + '"]');
                        apellido2FormControl = element.find('[ng-model="' + normalizationMap.apellido2 + '"]');
                        sexoFormControl = element.find('[ng-model="' + normalizationMap.sexo + '"]');

                        if (options.warn) {
                            watchChangesAndListenEvents();
                        } else {
                            deregisterControlChangesWatcher = watchControlChanges();
                            element.on('$destroy', function() {
                                deregisterControlChangesWatcher();
                            });
                        }
                    };
                }
            };
        }]);
