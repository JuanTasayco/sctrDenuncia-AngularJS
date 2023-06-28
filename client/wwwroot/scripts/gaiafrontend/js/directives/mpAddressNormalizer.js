/*global angular, _ */
/*jshint camelcase: false */
/*TODO: Refactor!! Clean code!! */
angular.module('mpAddressNormalizer', [])
    .constant('PROVINCIA', {
        '1': 'ARABA/ALAVA',
        '2': 'ALBACETE',
        '3': 'ALICANTE-ALACANT',
        '4': 'ALMERIA',
        '5': 'AVILA',
        '6': 'BADAJOZ',
        '7': 'ILLES BALEARS',
        '8': 'BARCELONA',
        '9': 'BURGOS',
        '10': 'CACERES',
        '11': 'CADIZ',
        '12': 'CASTELLON-CASTELLO',
        '13': 'CIUDAD REAL',
        '14': 'CORDOBA',
        '15': 'A CORUÑA',
        '16': 'CUENCA',
        '17': 'GIRONA',
        '18': 'GRANADA',
        '19': 'GUADALAJARA',
        '20': 'GIPUZKOA',
        '21': 'HUELVA',
        '22': 'HUESCA',
        '23': 'JAEN',
        '24': 'LEON',
        '25': 'LLEIDA',
        '26': 'LA RIOJA',
        '27': 'LUGO',
        '28': 'MADRID',
        '29': 'MALAGA',
        '30': 'MURCIA',
        '31': 'NAVARRA',
        '32': 'OURENSE',
        '33': 'ASTURIAS',
        '34': 'PALENCIA',
        '35': 'LAS PALMAS',
        '36': 'PONTEVEDRA',
        '37': 'SALAMANCA',
        '38': 'SANTA CRUZ DE TENERIFE',
        '39': 'CANTABRIA',
        '40': 'SEGOVIA',
        '41': 'SEVILLA',
        '42': 'SORIA',
        '43': 'TARRAGONA',
        '44': 'TERUEL',
        '45': 'TOLEDO',
        '46': 'VALENCIA',
        '47': 'VALLADOLID',
        '48': 'BIZKAIA',
        '49': 'ZAMORA',
        '50': 'ZARAGOZA',
        '51': 'CEUTA',
        '52': 'MELILLA'
    })
    .constant('TIPO_VIA', [
        {
            'code': 'ACC',
            'desc': 'ACCESO'
        }, {
            'code': 'ACE',
            'desc': 'ACERA'
        }, {
            'code': 'ACQ',
            'desc': 'ACEQUIA'
        }, {
            'code': 'AFU',
            'desc': 'AFUERA'
        }, {
            'code': 'AGR',
            'desc': 'AGRUPACIÓN'
        }, {
            'code': 'AL',
            'desc': 'ALAMEDA'
        }, {
            'code': 'AP',
            'desc': 'APARTAMENTO'
        }, {
            'code': 'APE',
            'desc': 'APARTADO POSTAL EXTRANJERO'
        }, {
            'code': 'APN',
            'desc': 'APARTADO POSTAL NACIONAL'
        }, {
            'code': 'AR',
            'desc': 'ARRABALES'
        }, {
            'code': 'ARR',
            'desc': 'ARRABAL'
        }, {
            'code': 'AUT',
            'desc': 'AUTOPISTA'
        }, {
            'code': 'AUT',
            'desc': 'AUTOVÍA'
        }, {
            'code': 'AVD',
            'desc': 'AVENIDA'
        }, {
            'code': 'BCO',
            'desc': 'BARRANCO'
        }, {
            'code': 'BDA',
            'desc': 'BARRIADA'
        }, {
            'code': 'BL',
            'desc': 'BLOQUE'
        }, {
            'code': 'BO',
            'desc': 'BARRIO'
        }, {
            'code': 'CAS',
            'desc': 'CASA'
        }, {
            'code': 'CAS',
            'desc': 'CASAS'
        }, {
            'code': 'CAS',
            'desc': 'CASETA'
        }, {
            'code': 'CAS',
            'desc': 'CASILLA'
        }, {
            'code': 'CAS',
            'desc': 'CASERÍO'
        }, {
            'code': 'CH',
            'desc': 'CHALET'
        }, {
            'code': 'CJN',
            'desc': 'CALLEJA'
        }, {
            'code': 'CJN',
            'desc': 'CALLEJÓN'
        }, {
            'code': 'CJT',
            'desc': 'CONJUNTO'
        }, {
            'code': 'CL',
            'desc': 'CALLE'
        }, {
            'code': 'CM',
            'desc': 'CAMINO'
        }, {
            'code': 'COL',
            'desc': 'COLONIA'
        }, {
            'code': 'COM',
            'desc': 'COMPLEJO'
        }, {
            'code': 'COO',
            'desc': 'COOPERATIVA'
        }, {
            'code': 'CRA',
            'desc': 'CARRETERA'
        }, {
            'code': 'CRA',
            'desc': 'CARRIL'
        }, {
            'code': 'CRA',
            'desc': 'CORREDERA'
        }, {
            'code': 'CTA',
            'desc': 'CUESTA'
        }, {
            'code': 'CTJ',
            'desc': 'CORTIJO'
        }, {
            'code': 'DIS',
            'desc': 'DISEMINADO'
        }, {
            'code': 'DIS',
            'desc': 'DISEMINADOS'
        }, {
            'code': 'EDF',
            'desc': 'EDIFICIO'
        }, {
            'code': 'ENT',
            'desc': 'ENTRADA'
        }, {
            'code': 'FCA',
            'desc': 'FINCA'
        }, {
            'code': 'GPO',
            'desc': 'GRUPO'
        }, {
            'code': 'GPO',
            'desc': 'GRUPOS'
        }, {
            'code': 'GTA',
            'desc': 'GLORIETA'
        }, {
            'code': 'GV',
            'desc': 'GRAN VIA'
        }, {
            'code': 'LUG',
            'desc': 'LUGAR'
        }, {
            'code': 'MAS',
            'desc': 'MASÍA'
        }, {
            'code': 'MC',
            'desc': 'MERCADO'
        }, {
            'code': 'MLE',
            'desc': 'MUELLE'
        }, {
            'code': 'MN',
            'desc': 'MUNICIPIO'
        }, {
            'code': 'MZ',
            'desc': 'MANZANA'
        }, {
            'code': 'NUC',
            'desc': 'NUCLEO'
        }, {
            'code': 'PAT',
            'desc': 'PATIO'
        }, {
            'code': 'PDA',
            'desc': 'PARTIDA'
        }, {
            'code': 'PJE',
            'desc': 'PASAJE'
        }, {
            'code': 'PJE',
            'desc': 'PARAJE'
        }, {
            'code': 'POB',
            'desc': 'POBLADO'
        }, {
            'code': 'POB',
            'desc': 'POBLACIÓN'
        }, {
            'code': 'POL',
            'desc': 'POLÍGONO'
        }, {
            'code': 'PQE',
            'desc': 'PARQUE'
        }, {
            'code': 'PRL',
            'desc': 'PROLONGACIÓN'
        }, {
            'code': 'PSO',
            'desc': 'PASEO'
        }, {
            'code': 'PSO',
            'desc': 'PASILLO'
        }, {
            'code': 'PSO',
            'desc': 'PASADIZO'
        }, {
            'code': 'PZA',
            'desc': 'PLAZA'
        }, {
            'code': 'PZL',
            'desc': 'PLACETA'
        }, {
            'code': 'PZL',
            'desc': 'PLAZUELA'
        }, {
            'code': 'PZL',
            'desc': 'PLAZOLETA'
        }, {
            'code': 'RAM',
            'desc': 'RAMBLA'
        }, {
            'code': 'RDA',
            'desc': 'RONDA'
        }, {
            'code': 'ROT',
            'desc': 'ROTONDA'
        }, {
            'code': 'RSD',
            'desc': 'RESIDENCIA'
        }, {
            'code': 'RSD',
            'desc': 'RESIDENCIAL'
        }, {
            'code': 'SD',
            'desc': 'SIN DEFINIR'
        }, {
            'code': 'SDA',
            'desc': 'PUJADA'
        }, {
            'code': 'SDA',
            'desc': 'SENDA'
        }, {
            'code': 'SDA',
            'desc': 'SENDERA'
        }, {
            'code': 'SDA',
            'desc': 'SUBIDA'
        }, {
            'code': 'SDA',
            'desc': 'SENDERO'
        }, {
            'code': 'SDA',
            'desc': 'SENDILLA'
        }, {
            'code': 'TRV',
            'desc': 'TRAVESÍA'
        }, {
            'code': 'URB',
            'desc': 'URBANIZACIÓN'
        }, {
            'code': 'VIA',
            'desc': 'VIA'
        }, {
            'code': 'ZNA',
            'desc': 'ZONA'
        }
    ])
    .constant('TIPO_VIA_DEYDE', [
        {
            'code': 'ACC',
            'desc': 'ACCESO'
        }, {
            'code': 'ACE',
            'desc': 'ACERA'
        }, {
            'code': 'ACQ',
            'desc': 'ACEQUIA'
        }, {
            'code': 'AFU',
            'desc': 'AFUERA'
        }, {
            'code': 'AGR',
            'desc': 'AGRUPACION'
        }, {
            'code': 'AL',
            'desc': 'ALAMEDA'
        }, {
            'code': 'AP',
            'desc': 'APARTAMENTO'
        }, {
            'code': 'APE',
            'desc': 'APARTADO DE CORREOS EXTRANJERO'
        }, {
            'code': 'APN',
            'desc': 'APARTADO DE CORREOS'
        }, {
            'code': 'APN',
            'desc': 'APARTADO DE CORREOS NACIONAL'
        }, {
            'code': 'ARR',
            'desc': 'RAVAL'
        }, {
            'code': 'ARR',
            'desc': 'ARRBL'
        }, {
            'code': 'AUT',
            'desc': 'AUT'
        }, {
            'code': 'AVD',
            'desc': 'AVDA'
        }, {
            'code': 'BCO',
            'desc': 'BRNCO'
        }, {
            'code': 'BDA',
            'desc': 'BDA'
        }, {
            'code': 'BDA',
            'desc': 'BJDA'
        }, {
            'code': 'BDA',
            'desc': 'BXDA'
        }, {
            'code': 'BL',
            'desc': 'BLQ'
        }, {
            'code': 'BO',
            'desc': 'BARRI'
        }, {
            'code': 'BO',
            'desc': 'BO'
        }, {
            'code': 'CAS',
            'desc': 'CSRIO'
        }, {
            'code': 'CAS',
            'desc': 'CAS'
        }, {
            'code': 'CH',
            'desc': 'CHALET'
        }, {
            'code': 'CJN',
            'desc': 'CRO'
        }, {
            'code': 'CJN',
            'desc': 'CXON'
        }, {
            'code': 'CJN',
            'desc': 'RUELA'
        }, {
            'code': 'CJN',
            'desc': 'CJA'
        }, {
            'code': 'CJN',
            'desc': 'CJON'
        }, {
            'code': 'CJT',
            'desc': 'CJTO'
        }, {
            'code': 'CL',
            'desc': 'CLLZO'
        }, {
            'code': 'CL',
            'desc': 'KALE'
        }, {
            'code': 'CL',
            'desc': 'PAGO'
        }, {
            'code': 'CL',
            'desc': 'RIERA'
        }, {
            'code': 'CL',
            'desc': 'RUA'
        }, {
            'code': 'CL',
            'desc': 'TRANS'
        }, {
            'code': 'CL',
            'desc': 'TSRA'
        }, {
            'code': 'CL',
            'desc': 'VENAT'
        }, {
            'code': 'CL',
            'desc': 'VREDA'
        }, {
            'code': 'CL',
            'desc': 'ALDEA'
        }, {
            'code': 'CM',
            'desc': 'CMNO'
        }, {
            'code': 'CM',
            'desc': 'CMÑO'
        }, {
            'code': 'CM',
            'desc': 'CAMI'
        }, {
            'code': 'COL',
            'desc': 'CNIA'
        }, {
            'code': 'COM',
            'desc': 'COMPLEJO'
        }, {
            'code': 'COO',
            'desc': 'COOPERATIVA'
        }, {
            'code': 'CRA',
            'desc': 'CRA'
        }, {
            'code': 'CRA',
            'desc': 'CRRIL'
        }, {
            'code': 'CRA',
            'desc': 'ESTDA'
        }, {
            'code': 'CTA',
            'desc': 'CSTA'
        }, {
            'code': 'CTJ',
            'desc': 'CTJO'
        }, {
            'code': 'DIS',
            'desc': 'EXTR'
        }, {
            'code': 'EDF',
            'desc': 'EDIF'
        }, {
            'code': 'ENT',
            'desc': 'ENTRADA'
        }, {
            'code': 'FCA',
            'desc': 'FINCA'
        }, {
            'code': 'GPO',
            'desc': 'GRUP'
        }, {
            'code': 'GPO',
            'desc': 'GRUPO'
        }, {
            'code': 'GTA',
            'desc': 'GLTA'
        }, {
            'code': 'GV',
            'desc': 'GRAN VIA'
        }, {
            'code': 'LUG',
            'desc': 'LLOC'
        }, {
            'code': 'LUG',
            'desc': 'LUGAR'
        }, {
            'code': 'MAS',
            'desc': 'MASIA'
        }, {
            'code': 'MAS',
            'desc': 'MASO'
        }, {
            'code': 'MC',
            'desc': 'MERCADO'
        }, {
            'code': 'MLE',
            'desc': 'MUELLE'
        }, {
            'code': 'MN',
            'desc': 'MUNICIPIO'
        }, {
            'code': 'MZ',
            'desc': 'MANZANA'
        }, {
            'code': 'NUC',
            'desc': 'NUCLEO'
        }, {
            'code': 'PAT',
            'desc': 'PATIO'
        }, {
            'code': 'PDA',
            'desc': 'PTDA'
        }, {
            'code': 'PJE',
            'desc': 'PJE'
        }, {
            'code': 'PJE',
            'desc': 'PRJE'
        }, {
            'code': 'PJE',
            'desc': 'PSAXE'
        }, {
            'code': 'PJE',
            'desc': 'PTGE'
        }, {
            'code': 'POB',
            'desc': 'PBDO'
        }, {
            'code': 'POL',
            'desc': 'POLIG'
        }, {
            'code': 'PQE',
            'desc': 'PARC'
        }, {
            'code': 'PQE',
            'desc': 'PQUE'
        }, {
            'code': 'PRL',
            'desc': 'PROL'
        }, {
            'code': 'PSO',
            'desc': 'PASEO'
        }, {
            'code': 'PSO',
            'desc': 'PSEIG'
        }, {
            'code': 'PZA',
            'desc': 'PLAZA'
        }, {
            'code': 'PZA',
            'desc': 'PLAÇA'
        }, {
            'code': 'PZA',
            'desc': 'PRAZA'
        }, {
            'code': 'PZL',
            'desc': 'PCTA'
        }, {
            'code': 'PZL',
            'desc': 'PZLA'
        }, {
            'code': 'PZL',
            'desc': 'PZTA'
        }, {
            'code': 'RAM',
            'desc': 'RBLA'
        }, {
            'code': 'RDA',
            'desc': 'RONDA'
        }, {
            'code': 'ROT',
            'desc': 'ROTONDA'
        }, {
            'code': 'RSD',
            'desc': 'RESID'
        }, {
            'code': 'SD',
            'desc': 'SIN DEFINIR'
        }, {
            'code': 'SDA',
            'desc': 'PJDA'
        }, {
            'code': 'SDA',
            'desc': 'SBIDA'
        }, {
            'code': 'SDA',
            'desc': 'SENDA'
        }, {
            'code': 'TRV',
            'desc': 'TRAV'
        }, {
            'code': 'URB',
            'desc': 'URB'
        }, {
            'code': 'VIA',
            'desc': 'VIA'
        }, {
            'code': 'ZNA',
            'desc': 'ZONA'
        }
    ])
    .factory('addressNormalizerModalGrid', ['$filter',
        function($filter) {
            return {
                getOptions: function() {
                    var options = {
                        'datatype': 'local',
                        'multiselect': true,
                        'height': 'auto',
                        'colNames': [
                            $filter('translate')('mpAddressNormalizer.property'),
                            $filter('translate')('mpAddressNormalizer.field'),
                            $filter('translate')('mpAddressNormalizer.initialValue'),
                            $filter('translate')('mpAddressNormalizer.normalizedValue')
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
                        'emptyrecords': $filter('translate')('mpAddressNormalizer.no_records_found')
                    };

                    return options;
                }
            };
        }
    ])
    .controller('AddressNormalizerModalCtrl', ['$scope', '$parse', '$filter', '$modalInstance', 'PROVINCIA', 'addressNormalizerModalGrid', 'modelBeforeNormalization', 'modelAfterLastSuggestionsApplied', 'normalization',
        function($scope, $parse, $filter, $modalInstance, PROVINCIA, addressNormalizerModalGrid, modelBeforeNormalization, modelAfterLastSuggestionsApplied, normalization) {

            function createAddressNormalizerModalGridData() {
                var gridData = [];

                if (normalization.tipoVia) {
                    gridData.push({
                        property: 'tipoVia',
                        field: $filter('translate')('mpAddressNormalizer.tipoVia'),
                        initialValue: modelBeforeNormalization.tipoVia,
                        normalizedValue: normalization.tipoVia
                    });
                }

                if (normalization.nombreVia) {
                    gridData.push({
                        property: 'nombreVia',
                        field: $filter('translate')('mpAddressNormalizer.nombre_via'),
                        initialValue: modelBeforeNormalization.nombreVia,
                        normalizedValue: normalization.nombreVia
                    });
                }

                if (normalization.numVia) {
                    gridData.push({
                        property: 'numVia',
                        field: $filter('translate')('mpAddressNormalizer.num_via'),
                        initialValue: modelBeforeNormalization.numVia,
                        normalizedValue: normalization.numVia
                    });
                }

                if (normalization.restoVia) {
                    gridData.push({
                        property: 'restoVia',
                        field: $filter('translate')('mpAddressNormalizer.resto_via'),
                        initialValue: modelBeforeNormalization.restoVia,
                        normalizedValue: normalization.restoVia
                    });
                }

                if (normalization.codigoPostal) {
                    gridData.push({
                        property: 'codigoPostal',
                        field: $filter('translate')('mpAddressNormalizer.codigoPostal'),
                        initialValue: modelBeforeNormalization.codigoPostal,
                        normalizedValue: normalization.codigoPostal
                    });
                }

                if (normalization.poblacion) {
                    gridData.push({
                        property: 'poblacion',
                        field: $filter('translate')('mpAddressNormalizer.poblacion'),
                        initialValue: modelBeforeNormalization.poblacion,
                        normalizedValue: normalization.poblacion
                    });
                }

                if (modelBeforeNormalization.provincia && normalization.provincia) {
                    gridData.push({
                        property: 'provincia',
                        field: $filter('translate')('mpAddressNormalizer.provincia'),
                        initialValue: PROVINCIA[modelBeforeNormalization.provincia] || '',
                        normalizedValue: PROVINCIA[normalization.provincia] || ''
                    });
                }

                return gridData;
            }

            $scope.grid = {
                data: createAddressNormalizerModalGridData(modelBeforeNormalization, normalization),
                options: addressNormalizerModalGrid.getOptions(),
                model: []
            };

            $scope.$on('addressNormalizerGridSet', function() {
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
        }
    ])
    .factory('AddressNormalizerSrv', ['$q', 'HttpSrv',
        function($q, HttpSrv) {
            var addressUrl = 'api/normalize/address';

            function normalize(stringToNormalize) {
                var defer = $q.defer();

                HttpSrv.post(addressUrl, {
                    data: {
                        address: stringToNormalize
                    }
                })
                    .then(function(data) {
                        var obj = {};

                        angular.forEach(data, function(value, key) {
                            obj[key] = angular.isString(value) ? value.replace(/^\s+|\s+$/g, '') : value;
                        });

                        defer.resolve(obj);
                    }, defer.reject);

                return defer.promise;
            }

            return {
                normalize: normalize
            };
        }
    ])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpAddressNormalizer
     * @param {expression} mp-address-normalizer The result of the expression must be an object. The object will map internal variables with model variables.
     * @param {expression=} mp-address-normalizer-options The result of the expression must be an object. This object will configure the directive behaviour.
     * @description
     *
     * This directive allows you to normalize address information.
     *
     * The keys in the object map passed as mp-address-normalizer will be the internal variable names and its values will be the model expression they will be bound to.
     * These are all the internal variables that can be mapped:
     *
     * - `tipoVia` - (REQUIRED) Street type.
     * - `nombreVia` - (REQUIRED) Street name.
     * - `numVia` - (REQUIRED) Building number.
     * - `codigoPostal` - (REQUIRED) Postal code.
     * - `poblacion` - (REQUIRED) City name.
     * - `piso` - Floor.
     * - `puerta` - Door.
     * - `escalera` - ...
     * - `portal` - ...
     * - `restoVia` - Additional information for the address.
     * - `provincia` - State.
     * - `tip_situ_val` - Current situation of the normalization. Its values are: null (not normalized), '1' (normalization accepted) and '2' (normalization rejected)
     * - `normalize` - Method to request normalization.
     * - `openModal` - Method to open a model with the normalization response.
     * - `applyNormalization` - Method to apply normalization to the model.
     *
     * The `normalize` method will use `tipoVia`, `nombreVia`, `numVia`, `codigoPostal` and `poblacion` model values to request normalization.
     * It will return a promise. This promise will be resolved with normalization model.
     *
     * The `openModal` method will use normalization model as argument and will apply the normalization itself.
     *
     * The `applyNormalization` method will use normalizations to apply model and the normalization response model as arguments.
     *
     * These are all the available options for directive configuration:
     *
     * - `hide` - If truthy the directive will not render any DOM element. Defaults to falsy.
     * - `extendedInfo` - If truthy the directive will render `piso`, `puerta`, `escalera` and `portal` input elements. Defaults to falsy.
     * - `warn` - If truthy the directive will render an information icon with the current situation of the normalization when normalized at least once. If normalizable it can be clicked to open a modal window to manage normalization.
     * - `onBlur` - AngularJS expression to evaluate (usually normalization method) when `blur` event is triggered by the las `input` element visible (`apellido2` when physical person and `nombre` when corporate name).
     * - `sizes` - Object to extend default input length to capture by the directive.
     *     - `pais` defaults to 3 characters.
     *     - `tipoVia` defaults to 3 characters.
     *     - `nombreVia` defaults to 50 characters.
     *     - `numVia` defaults to 15 character.
     *     - `restoVia` defaults to 150 character.
     *     - `codigoPostal` defaults to 15 character.
     *     - `poblacion` defaults to 6 character.
     *     - `provincia` defaults to 5 character.
     *
     * If we desire to normalize an address when focusing out the input and then display suggestions in a modal after clicking the icon
     * this could be the mapping object...
     *
     *  ```js
     *  {
     *      'tipoVia': 'addressModel.tipoVia',
     *      'nombreVia': 'addressModel.nombreVia',
     *      'numVia': 'addressModel.numVia',
     *      'restoVia': 'addressModel.restoVia',
     *      'codigoPostal': 'addressModel.codigoPostal',
     *      'poblacion': 'addressModel.poblacion',
     *      'provincia': 'addressModel.provincia',
     *      'tip_situ_val': 'addressModel.normalizationStatus',
     *      'normalize': 'addressModel.requestAddressNormalization'
     *  }
     *  ```
     *
     * ... and this could be the options object.
     *
     *  ```js
     *  {
     *      'warn': true,
     *      'onBlur': 'addressModel.requestAddressNormalization()'
     *  }
     *  ```
     * Given these objects, the directive invocation will result in something like this:
     *
     *  ```js
     *  div(mp-address-normalizer='{'tipoVia': 'addressModel.tipoVia', 'nombreVia': 'addressModel.nombreVia', 'numVia': 'addressModel.numVia', 'restoVia': 'addressModel.restoVia', 'codigoPostal': 'addressModel.codigoPostal', 'poblacion': 'addressModel.poblacion', 'provincia': 'addressModel.provincia', 'tip_situ_val': 'addressModel.normalizationStatus', 'normalize': 'addressModel.requestAddressNormalization'}', mp-address-normalizer-options='{'warn': true, 'onBlur': 'addressModel.requestAddressNormalization()'}')
     *  ```
     *
     * @example
       <doc:example module='mpAddressNormalizer'>
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
    .directive('mpAddressNormalizer', ['$parse', '$q', '$filter', '$modal', 'Utils', 'PROVINCIA', 'TIPO_VIA', 'TIPO_VIA_DEYDE', 'AddressNormalizerSrv', 'Events',
        function($parse, $q, $filter, $modal, Utils, PROVINCIA, TIPO_VIA, TIPO_VIA_DEYDE, AddressNormalizerSrv, Events) {
            var defaultOptions = {
                    sizes: {
                        pais: 3, // CDC
                        tipoVia: 3, // CDC
                        nombreVia: 50, // CDC
                        numVia: 15, // CDC
                        restoVia: 150, // CDC
                        codigoPostal: 15, // CDC
                        poblacion: 60, // CDC
                        municipio: 40, // batch
                        provincia: 5, // CDC
                        varPob: 7, // batch
                        mujPob: 7, // batch
                        indica: 1, // batch
                        infia: 1 // batch
                    }
                },
                NO_NORMALIZADO = null,
                NORMALIZACION_RECHAZADA = '0',
                NORMALIZACION_ACEPTADA = '1';

            function validate(normalizationMap) {
                if (!angular.isObject(normalizationMap)) {
                    throw new Error('[mp-address-normalizer] must be an object');
                }

                if (!normalizationMap.tipoVia) {
                    throw new Error('[mp-address-normalizer] object must own \'tipoVia\' property');
                }

                if (!normalizationMap.nombreVia) {
                    throw new Error('[mp-address-normalizer] object must own \'nombreVia\' property');
                }

                if (!normalizationMap.numVia) {
                    throw new Error('[mp-address-normalizer] object must own \'numVia\' property');
                }

                if (!normalizationMap.codigoPostal) {
                    throw new Error('[mp-address-normalizer] object must own \'codigoPostal\' property');
                }

                if (!normalizationMap.poblacion) {
                    throw new Error('[mp-address-normalizer] object must own \'poblacion\' property');
                }
            }

            return {
                // scope: true, // because of ngInit in createAddressNormalizerSelectControlElement
                transclude: true,
                require: '^form',
                compile: function(cElement, cAttributes) {
                    var PAIS = {
                            'ESP': $filter('translate')('mpAddressNormalizer.espana')
                        },
                        PAIS_DEFAULT_VALUE = 'ESP',
                        normalizationMap = $parse(cAttributes.mpAddressNormalizer)(),
                        options = angular.extend(angular.copy(defaultOptions), $parse(cAttributes.mpAddressNormalizerOptions)());

                    function createAddressNormalizerInputControlElement(colSize, colOffset, labelSize, controlSize, labelText, ngModelExpression, maxlength, mpType, onBlurFn) {
                        var wrapper = angular.element('<div class="col-md-' + colSize + (colOffset ? ' col-md-offset-' + colOffset : '') + '"></div>'),
                            formGroup = angular.element('<div class="form-group"></div>'),
                            label = angular.element('<label class="col-sm-' + labelSize + ' control-label" for="' + ngModelExpression + '">' + labelText + '</label>'),
                            inputWrapper = angular.element('<div class="validable col-sm-' + controlSize + '"></div>'),
                            input = angular.element('<input type="text"' + (mpType ? ' mp-type="' + mpType + '"' : '') + ' id="' + ngModelExpression + '" name="' + ngModelExpression + '" maxlength="' + maxlength + '" class="form-control" mp-to-upper-case="" ng-model="' + ngModelExpression + '"' + (onBlurFn ? ' ng-blur="' + onBlurFn + '"' : '') + '></input>');

                        inputWrapper.append(input);
                        formGroup.append(label).append(inputWrapper);
                        wrapper.append(formGroup);

                        return wrapper;
                    }

                    // ngOptions expression model MUST be an scope variable if we want to save an object in the model and still display selected option properly
                    function createAddressNormalizerSelectControlElement(colSize, colOffset, labelSize, controlSize, labelText, ngModelExpression, ngInitExpression, ngOptionsExpression, onBlurFn) {
                        var wrapper = angular.element('<div class="col-md-' + colSize + (colOffset ? ' col-md-offset-' + colOffset : '') + '"></div>'),
                            formGroup = angular.element('<div class="form-group"></div>'),
                            label = angular.element('<label class="col-sm-' + labelSize + ' control-label" for="' + ngModelExpression + '">' + labelText + '</label>'),
                            inputWrapper = angular.element('<div class="validable col-sm-' + controlSize + '" ng-init="' + ngInitExpression + '"></div>'),
                            input = angular.element('<select id="' + ngModelExpression + '" name="' + ngModelExpression + '" class="form-control" mp-to-upper-case="" ng-model="' + ngModelExpression + '" ng-options="' + ngOptionsExpression + '"' + (onBlurFn ? ' ng-blur="' + onBlurFn + '"' : '') + '><option value="" selected="selected">' + $filter('translate')('select') + '</option></input>');

                        inputWrapper.append(input);
                        formGroup.append(label).append(inputWrapper);
                        wrapper.append(formGroup);

                        return wrapper;
                    }

                    function createAddressNormalizerWarnElement() {
                        var wrapper = angular.element('<div class="col-md-4 col-md-offset-1"></div>'),
                            img = angular.element('<img class="contact-normalizer-warn-img" src="gaiafrontend/img/icon/icon-detail.png"></img>'),
                            anchor = angular.element('<a class="contact-normalizer-warn-anchor" style="vertical-align: bottom; margin-left: 10px;">' + $filter('translate')('mpAddressNormalizer.results_suggested') + '</a>');

                        wrapper.append(img).append(anchor);

                        return wrapper;
                    }

                    function prepareDOM() {
                        var row = function() {
                                return angular.element('<div class="row"></div>');
                            },
                            paisElement = createAddressNormalizerSelectControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.pais'), normalizationMap.pais, '$PAIS=' + angular.toJson(PAIS).replace(/\"/g, '\''), 'code as desc for (code, desc) in $PAIS'),
                            tipoViaElement = createAddressNormalizerSelectControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.tipoVia'), normalizationMap.tipoVia, '$TIPO_VIA=' + angular.toJson(TIPO_VIA).replace(/\"/g, '\''), 'tipo as tipo.desc for tipo in $TIPO_VIA track by tipo.code', options.onBlur),
                            nombreViaElement = createAddressNormalizerInputControlElement(6, 0, 2, 10, $filter('translate')('mpAddressNormalizer.nombreVia'), normalizationMap.nombreVia, options.sizes.nombreVia || defaultOptions.sizes.nombreVia, null, options.onBlur),
                            numViaElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.numVia'), normalizationMap.numVia, options.sizes.numVia || defaultOptions.sizes.numVia, null, options.onBlur),
                            pisoElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.piso'), normalizationMap.piso, options.sizes.piso || defaultOptions.sizes.piso),
                            puertaElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.puerta'), normalizationMap.puerta, options.sizes.puerta || defaultOptions.sizes.puerta),
                            escaleraElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.escalera'), normalizationMap.escalera, options.sizes.escalera || defaultOptions.sizes.escalera),
                            portalElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.portal'), normalizationMap.portal, options.sizes.portal || defaultOptions.sizes.portal),
                            restoViaElement = createAddressNormalizerInputControlElement(12, 0, 1, 11, $filter('translate')('mpAddressNormalizer.restoVia'), normalizationMap.restoVia, options.sizes.restoVia || defaultOptions.sizes.restoVia),
                            codigoPostalElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.codigoPostal'), normalizationMap.codigoPostal, options.sizes.codigoPostal || defaultOptions.sizes.codigoPostal, 'number', options.onBlur),
                            poblacionElement = createAddressNormalizerInputControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.poblacion'), normalizationMap.poblacion, options.sizes.poblacion || defaultOptions.sizes.poblacion, null, options.onBlur),
                            provinciaElement = createAddressNormalizerSelectControlElement(3, 0, 4, 8, $filter('translate')('mpAddressNormalizer.provincia'), normalizationMap.provincia, '$PROVINCIA=' + angular.toJson(PROVINCIA).replace(/\"/g, '\''), 'code as desc for (code, desc) in $PROVINCIA'),
                            warnElement,
                            helpBlockElement;

                        cElement.append(row()
                            .append(paisElement));

                        cElement.append(row()
                            .append(tipoViaElement)
                            .append(nombreViaElement)
                            .append(numViaElement));

                        if (options.extendedInfo) {
                            cElement.append(row()
                                .append(pisoElement)
                                .append(puertaElement)
                                .append(escaleraElement)
                                .append(portalElement));
                        }

                        cElement.append(row()
                            .append(restoViaElement));

                        cElement.append(row()
                            .append(codigoPostalElement)
                            .append(poblacionElement)
                            .append(normalizationMap.provincia ? provinciaElement : undefined));

                        if (options.warn) {
                            warnElement = createAddressNormalizerWarnElement();

                            cElement.append(row()
                                .append(warnElement)
                                .hide());
                        }

                        helpBlockElement = angular.element('<div class="form-group"><div class="col-md-offset-1"><p class="help-block">' + $filter('translate')('mpAddressNormalizer.low_quality') +'</p></div></div>');

                        cElement.append(row()
                            .append(helpBlockElement)
                            .hide());
                    }

                    if (!options.hide && !cElement.contents().length) {
                        prepareDOM();
                    }

                    return function (scope, element, attributes, formCtrl, transcludeFn) {
                        var normalizationMap = $parse(attributes.mpAddressNormalizer)(),
                            options = angular.extend(angular.copy(defaultOptions), $parse(attributes.mpAddressNormalizerOptions)()),
                            normalizing,
                            normalizationStatus,
                            lastNormalization,
                            modelBeforeNormalization = {},
                            modelAfterLastSuggestionsApplied = {},
                            paisFormControl,
                            tipoViaFormControl,
                            nombreViaFormControl,
                            numViaFormControl,
                            pisoFormControl,
                            puertaFormControl,
                            escaleraFormControl,
                            portalFormControl,
                            restoViaFormControl,
                            codigoPostalFormControl,
                            poblacionFormControl,
                            provinciaFormControl,
                            deregisterLastNormalizationWatcher,
                            deregisterWarnElementOnClickListener,
                            deregisterControlWatcher,
                            deregisterPaisWatcher;

                        function saveNormalizationStatus(status) {
                            normalizationStatus = status; // NO_NORMALIZADO | NORMALIZACION_RECHAZADA | NORMALIZACION_ACEPTADA
                            if (normalizationMap.tip_situ_val) {
                                $parse(normalizationMap.tip_situ_val).assign(scope, status);
                            }
                        }

                        function createAddressNormalizerInputString() {
                            var addressNormalizerInputString = '';

                            addressNormalizerInputString += (($parse(normalizationMap.tipoVia)(scope) || {}).code || '').substring(0, options.sizes.tipoVia);
                            addressNormalizerInputString += ' ' + ($parse(normalizationMap.nombreVia)(scope) || '').substring(0, options.sizes.nombreVia);
                            addressNormalizerInputString += ' ' + ($parse(normalizationMap.numVia)(scope) || '').substring(0, options.sizes.numVia);
                            addressNormalizerInputString += ' ' + ($parse(normalizationMap.codigoPostal)(scope).toString() || '').substring(0, options.sizes.codigoPostal);
                            addressNormalizerInputString += ' ' + ($parse(normalizationMap.poblacion)(scope) || '').substring(0, options.sizes.poblacion);

                            return Utils.string.trim(Utils.string.replaceDiacritics(addressNormalizerInputString));
                        }

                        function setFormControlsDisablePropTo(value) {
                            paisFormControl.prop('disabled', value);
                            tipoViaFormControl.prop('disabled', value);
                            nombreViaFormControl.prop('disabled', value);
                            numViaFormControl.prop('disabled', value);
                            pisoFormControl.prop('disabled', value);
                            puertaFormControl.prop('disabled', value);
                            escaleraFormControl.prop('disabled', value);
                            portalFormControl.prop('disabled', value);
                            restoViaFormControl.prop('disabled', value);
                            codigoPostalFormControl.prop('disabled', value);
                            poblacionFormControl.prop('disabled', value);
                            provinciaFormControl.prop('disabled', value);
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

                            if (property === 'tipoVia') {
                                // We need to reference TIPO_VIA so the select value will diplay properly
                                scope.$eval(normalizationMap[property] + '=$TIPO_VIA[' + _.findIndex(TIPO_VIA, function(via) {
                                    return via.code === value.code && via.desc === value.desc;
                                }) + ']');
                            } else if (normalizationMap[property]) {
                                var size = options.sizes[property] || defaultOptions.sizes[property];

                                if (!size) {
                                    $parse(normalizationMap[property]).assign(scope, value);
                                } else {
                                    if (value.toString().length <= size) {
                                        $parse(normalizationMap[property]).assign(scope, value);
                                    }
                                }
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

                        function openAddressNormalizationModal(normalization) {
                            var modalOptions = {
                                size: 'lg',
                                backdrop: 'static',
                                keyboard: false,
                                scope: scope,
                                templateUrl: 'gaiafrontend/html/mpAddressNormalizerModal.html',
                                controller: 'AddressNormalizerModalCtrl',
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
                            $parse(normalizationMap.openModal).assign(scope, openAddressNormalizationModal);
                        }

                        function getMainControlsObject() {
                            var mainControlsObject = {};

                            angular.forEach(_.keys(normalizationMap), function(property) {
                                if (property === 'tipoVia' || property === 'nombreVia' || property === 'numVia' || property === 'codigoPostal' || property === 'poblacion') {
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
                                    if ((normalizationPropertyName === 'tipoVia' || normalizationPropertyName === 'nombreVia' || normalizationPropertyName === 'numVia' || normalizationPropertyName === 'codigoPostal' || normalizationPropertyName === 'poblacion') && $parse(normalizationExpression)(scope) !== modelAfterLastSuggestionsApplied[normalizationPropertyName]) {
                                        modelValueHasChanged = true;
                                    }
                                });
                            }

                            return modelValueHasChanged;
                        }

                        function isNormalizable() {
                            return $parse(normalizationMap.pais)(scope) === PAIS_DEFAULT_VALUE && (normalizationStatus === NO_NORMALIZADO || hasModelChangedSinceLastNormalizationWasApplied());
                        }

                        function getTipoViaDeYdeCodeFromDesc(desc) {
                            return (_.find(TIPO_VIA_DEYDE, function(via) {
                                return via.desc === desc;
                            }) || {}).code || '';
                        }

                        function getProvinciaCodeFromDesc(desc) {
                            return _.findKey(PROVINCIA, function(dsc) {
                                return dsc === desc;
                            }) || '';
                        }

                        function removePaddingZeros(num) {
                            num = parseInt(num, 10);

                            if (isNaN(num)) {
                                return num;
                            }

                            return num.toString();
                        }

                        function parseNormalization(normalization) {
                            var normalizationsToApply = {},
                                parsedModel = {
                                    pais: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.pais)(scope))),
                                    tipoVia: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.tipoVia)(scope))),
                                    nombreVia: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.nombreVia)(scope))),
                                    numVia: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.numVia)(scope))),
                                    restoVia: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.restoVia)(scope) || '')),
                                    codigoPostal: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.codigoPostal)(scope))),
                                    poblacion: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.poblacion)(scope))),
                                    provincia: Utils.string.trim(Utils.string.replaceDiacritics($parse(normalizationMap.provincia)(scope) || ''))
                                },
                                parsedNormalization = {
                                    pais: Utils.string.trim(normalization.pais),
                                    tipoVia: Utils.string.trim(getTipoViaDeYdeCodeFromDesc(normalization.tipoVia)),
                                    nombreVia: Utils.string.trim(normalization.nombreVia),
                                    numVia: Utils.string.trim(removePaddingZeros(normalization.numVia)),
                                    restoVia: Utils.string.trim(normalization.restoVia),
                                    codigoPostal: +Utils.string.trim(normalization.codigoPostal), // plus sign to parse to integer
                                    poblacion: Utils.string.trim(normalization.poblacion),
                                    provincia: Utils.string.trim(getProvinciaCodeFromDesc(normalization.provincia)),
                                    varPob: Utils.string.trim(normalization.varPob),
                                    mujPob: Utils.string.trim(normalization.mujPob),
                                    indica: Utils.string.trim(normalization.indica),
                                    infia: Utils.string.trim(normalization.infia),
                                    interno: Utils.string.trim(normalization.interno)
                                };

                            if (parsedNormalization.pais && !angular.equals(parsedModel.pais, parsedNormalization.pais)) {
                                normalizationsToApply.pais = parsedNormalization.pais;
                            }

                            if (parsedModel.tipoVia && parsedModel.tipoVia.code && parsedNormalization.tipoVia && !angular.equals(parsedModel.tipoVia.code, parsedNormalization.tipoVia)) {
                                normalizationsToApply.tipoVia = parsedNormalization.tipoVia;
                            }

                            if (parsedModel.nombreVia && parsedNormalization.nombreVia && !angular.equals(parsedModel.nombreVia, parsedNormalization.nombreVia)) {
                                normalizationsToApply.nombreVia = parsedNormalization.nombreVia;
                            }

                            if (parsedModel.numVia && parsedNormalization.numVia && !angular.equals(parsedModel.numVia, parsedNormalization.numVia)) {
                                normalizationsToApply.numVia = parsedNormalization.numVia;
                            }

                            if (parsedNormalization.restoVia && !angular.equals(parsedModel.restoVia, parsedNormalization.restoVia)) {
                                normalizationsToApply.restoVia = parsedNormalization.restoVia;
                            }

                            if (parsedModel.codigoPostal && parsedNormalization.codigoPostal && !angular.equals(parsedModel.codigoPostal, parsedNormalization.codigoPostal)) {
                                normalizationsToApply.codigoPostal = parsedNormalization.codigoPostal;
                            }

                            if (parsedModel.poblacion && parsedNormalization.poblacion && !angular.equals(parsedModel.poblacion, parsedNormalization.poblacion)) {
                                normalizationsToApply.poblacion = parsedNormalization.poblacion;
                            }

                            if (parsedNormalization.provincia && !angular.equals(parsedModel.provincia, parsedNormalization.provincia)) {
                                normalizationsToApply.provincia = parsedNormalization.provincia;
                            }

                            normalizationsToApply.varPob = parsedNormalization.varPob;
                            normalizationsToApply.mujPob = parsedNormalization.mujPob;
                            normalizationsToApply.indica = parsedNormalization.indica;
                            normalizationsToApply.infia = parsedNormalization.infia;
                            normalizationsToApply.interno = parsedNormalization.interno;

                            return normalizationsToApply;
                        }

                        function displayNonReliableNormalizationAlert(display) {
                            var helpBlockRow = element.find('.help-block').closest('.row').show();

                            if (display) {
                                helpBlockRow.show();
                            } else {
                                helpBlockRow.hide();
                            }
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
                            AddressNormalizerSrv.normalize(createAddressNormalizerInputString())
                                .then(function(normalization) {
                                    var normalizationsToApply = parseNormalization(normalization);
                                    setMainControlsPristine();
                                    displayNonReliableNormalizationAlert(+normalization.infia < 6);
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

                            function onClickFn(event) {
                                openAddressNormalizationModal(lastNormalization);
                                event.preventDefault();
                            }

                            function preventDefaultFn(event) {
                                event.preventDefault();
                            }

                            warnElements.off('click', onClickFn);
                            warnElements.on('click', onClickFn);

                            return function() {
                                warnElements.off('click', preventDefaultFn);
                                warnElements.on('click', preventDefaultFn);
                            };
                        }

                        function hasAnyMainControlBeenNormalized(lastNormalization) {
                            var mainControlsObject = getMainControlsObject(),
                                anyMainControlHasBeenNormalized = false;

                            angular.forEach(lastNormalization, function(value, property) {
                                if (mainControlsObject[property]) {
                                    anyMainControlHasBeenNormalized = true;
                                }
                            });

                            return anyMainControlHasBeenNormalized;
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
                                if (hasAnyMainControlBeenNormalized(lastNormalization) || (lastNormalization.provincia && modelAfterLastSuggestionsApplied.provincia && !angular.equals(modelAfterLastSuggestionsApplied.provincia, lastNormalization.provincia))) {
                                    warnRow.show();
                                } else {
                                    warnRow.hide();
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
                                    saveNormalizationStatus(NORMALIZACION_RECHAZADA);
                                } else if (!hasModelChangedSinceLastNormalizationWasApplied && normalizationStatus === NORMALIZACION_RECHAZADA) {
                                    saveNormalizationStatus(NORMALIZACION_ACEPTADA);
                                }
                            });
                        }

                        function watchPaisChanges() {
                            return scope.$watch(normalizationMap.pais, function(pais) {
                                if (pais === PAIS_DEFAULT_VALUE) {
                                    codigoPostalFormControl.attr('maxlength', 5);
                                } else {
                                    codigoPostalFormControl.attr('maxlength', options.sizes.codigoPostal || defaultOptions.sizes.codigoPostal);
                                }
                            });
                        }

                        function deregisterWarnWatchersAndEventListeners() {
                            deregisterLastNormalizationWatcher();
                            deregisterWarnElementOnClickListener();
                        }

                        function deregisterWatchersAndEventListeners() {
                            deregisterControlWatcher();
                            deregisterPaisWatcher();
                        }

                        function watchWarnChangesAndListenEvents() {
                            deregisterLastNormalizationWatcher = watchLastNormalization();
                            deregisterWarnElementOnClickListener = listenWarnElementOnClick();
                        }

                        function watchChangesAndListenEvents() {
                            deregisterControlWatcher = watchControlChanges();
                            deregisterPaisWatcher = watchPaisChanges();
                        }

                        function watchAndListen() {
                            if (options.warn) {
                                watchWarnChangesAndListenEvents();
                            }

                            watchChangesAndListenEvents();
                        }

                        function stopWatchingAndListening() {
                            if (options.warn) {
                                deregisterWarnWatchersAndEventListeners();
                            }

                            deregisterWatchersAndEventListeners();
                        }

                        validate(normalizationMap);

                        transcludeFn(scope, function (clone) {
                            element.append(clone);
                        });

                        saveNormalizationStatus(NO_NORMALIZADO);

                        $parse(normalizationMap.pais).assign(scope, PAIS_DEFAULT_VALUE);

                        paisFormControl = element.find('[ng-model="' + normalizationMap.pais + '"]');
                        tipoViaFormControl = element.find('[ng-model="' + normalizationMap.tipoVia + '"]');
                        nombreViaFormControl = element.find('[ng-model="' + normalizationMap.nombreVia + '"]');
                        numViaFormControl = element.find('[ng-model="' + normalizationMap.numVia + '"]');
                        pisoFormControl = element.find('[ng-model="' + normalizationMap.piso + '"]');
                        puertaFormControl = element.find('[ng-model="' + normalizationMap.puerta + '"]');
                        escaleraFormControl = element.find('[ng-model="' + normalizationMap.escalera + '"]');
                        portalFormControl = element.find('[ng-model="' + normalizationMap.portal + '"]');
                        restoViaFormControl = element.find('[ng-model="' + normalizationMap.restoVia + '"]');
                        codigoPostalFormControl = element.find('[ng-model="' + normalizationMap.codigoPostal + '"]');
                        poblacionFormControl = element.find('[ng-model="' + normalizationMap.poblacion + '"]');
                        provinciaFormControl = element.find('[ng-model="' + normalizationMap.provincia + '"]');

                        watchAndListen();

                        element.on('$destroy', stopWatchingAndListening);
                    };
                }
            };
        }
    ]);
