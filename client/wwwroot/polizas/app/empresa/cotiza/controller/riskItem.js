(function($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'constants', 'helper', 'system'], function(angular, constants, helper, system) {
    var appAutos = angular.module("appAutos");
    appAutos.controller("riskItemController", ['$scope', 'conventionsCompany', '$injector', '$rootScope', '$timeout', 'proxyCotizacion', '$element', '$attrs', 'rickItemChanger', 'mModalAlert', '$filter', function($scope, conventionsCompany, $injector, $rootScope, $timeout, proxyCotizacion, $element, $attrs, rickItemChanger, mModalAlert, $filter) {

      $scope.status = {
        isCustomHeaderOpen: false,
        isFirstOpen: true,
        isFirstDisabled: false
      };

      var calculations = {
        'conventionOne': function(convention) {
            if (convention.withoutCheck || convention.mCheckConvenio) {
              var result = 0;
              var isArray = angular.isArray(convention.propertiesCalc)
              angular.forEach(convention.propertiesCalc, function(prop, index) {
                  var field = isArray ? prop : index;
                  var value = parseFloat(convention.data[field])
                  if (!isArray && prop.ignore === true) value = 0;
                  result += isNaN(value) ? 0 : value
              })
              convention.data.total = result;
              convention.validators = convention.validators || {};

              convention.validators.maxTotal = true;
              if (angular.isFunction(convention.maxValueTotal) && convention.maxValueTotal()) convention.validators.maxTotal = convention.data.total <= convention.maxValueTotal();
            }
          }
        }
        var $ctrl = this
        var items = []

        var nFieldName = function() {
          return !$scope.$ctrl.typeMoney || $scope.$ctrl.typeMoney == 1 ? 'codigo' : 'descripcion';
        }
        var fnMax = function(field, limit) {
          var _field = nFieldName();
          return parseFloat(limit[field][0][_field].split(',').join(''));

        }

        function maxByConvenio(current, prop, fieldName, limit, options, msg, index) {
            return function(value) {
                value = value || current.data[fieldName];
                var convention1 = $ctrl.data.conventions[index];
                var result = 0;
                angular.forEach(options, function(f) {
                    var v = parseFloat(convention1.data[f])
                    result += isNaN(v) ? 0 : v;
                })
                current.messages = current.messages || {}
                current.messages[fieldName] = null;
                var valorMaxDefault = fnMax(prop, limit);

                if (result <= valorMaxDefault) {
                    if (value !== undefined && value > result) {
                        current.messages[fieldName] = msg
                    }
                    return result;
                }
                return valorMaxDefault;

            }
        }
        var customFunctions = {
                maxByConvenio: maxByConvenio,
                minTrabajadores: function(fieldMin) {
                    return function(value) {
                        var result = 0;
                        var convention = $ctrl.data.conventions[fieldMin.conventionIndex];
                        angular.forEach(fieldMin.options, function(f) {
                            var v = parseFloat(convention.data[f])
                            result += isNaN(v) ? 0 : v;
                        });
                        return result ? fieldMin.value : NaN
                    }
                }
            }

        angular.forEach($ctrl.data.conventions || helper.clone(conventionsCompany.convetions), function(item) {


          if ($ctrl.lookups && $ctrl.lookups.limits) {
            var limit = $ctrl.lookups.limits['convention' + item.number];

            if (angular.isString(item.fieldMaxTotal) && limit[item.fieldMaxTotal]) {
              item.maxValueTotal = function() {
                return limit[item.fieldMaxTotal][0][nFieldName()]
              };
            }

            if (item.singelField && limit && angular.isObject(limit)) {
              var fnM = function() { return fnMax('maxTotal', limit); }

              if (angular.isObject(item.singelField)) {
                fnM = customFunctions[item.singelField.func](
                  item,
                  'maxTotal',
                  'sumAssured',
                  limit,
                  item.singelField.options,
                  item.singelField.message,
                  item.singelField.conventionIndex)
              }
              item.range = angular.extend({ min: function() { return 1 } }, { max: fnM });

            }
            angular.forEach(item.propertiesCalc, function(prop, index) {

                  item.validators = item.validators || {};

                  var defaultmax = function() { return fnMax(prop.fieldMax, limit); }
                  var defualtmin = NaN;
                  if (angular.isObject(prop)) {

                      if (angular.isObject(prop.fieldMax)) {
                          defaultmax = customFunctions[prop.fieldMax.func]
                              (item,
                                  prop.fieldMax.field,
                                  index, limit,
                                  prop.fieldMax.options,
                                  prop.fieldMax.message,
                                  prop.fieldMax.conventionIndex)
                      }
                      if (prop.fieldMax == null || prop.fieldMax == undefined) defaultmax = NaN

                      if (angular.isNumber(prop.fieldMin)) defualtmin = prop.fieldMin

                      else if (angular.isObject(prop.fieldMin)) {

                          defualtmin = customFunctions[prop.fieldMin.func](prop.fieldMin)
                      }

                      item.validators[index] = { range: angular.extend({ min: defualtmin }, { max: defaultmax }) }

                      if (angular.isObject(prop.warning)) {
                          item.warning = item.warning || {};
                          item.warning[index] = {
                              showWarning: function(value) {
                                  item.warning[index].isValid = value > fnMax(prop.warning.fieldMax, limit);
                                  return item.warning[index].isValid
                              }
                          }

                      }


                  }
            });
          }
          items.push(item);
        });

        $ctrl.data.conventions = $ctrl.data.conventions || items;
        angular.forEach($ctrl.data.conventions, function(item) {
            var addData = $ctrl.addtionalData()
            item.data = item.data || {};
            item.data[item.prop] = item.data[item.prop] || {};
            item.requireSubvalidation = (item.number == 1 ||
                item.number == 2 ||
                item.number == 5) && addData && addData.esRiesgoso

            item.description = 'Riesgo sujeto a evaluación de suscripción';
            var limit = $ctrl.lookups.limits['convention' + item.number];

            if (angular.isString(item.fieldMaxTotal) && limit[item.fieldMaxTotal]) {
                item.maxValueTotal = function() {
                    return limit[item.fieldMaxTotal][0][nFieldName()]
                };
            }
        });


        if ($ctrl.lookups) {
            $ctrl.tiposLocal = $ctrl.lookups.tiposLocal;
            $ctrl.categoriasConstruccion = $ctrl.lookups.categoriasConstruccion;
            $ctrl.alarmasMonitoreo = $ctrl.lookups.alarmasMonitoreo;
        }

        function buildData() {

            var ubigeo = $ctrl.data.ubigeoData;
            var data = $ctrl.data;

            var empresa = {
                ubigeo: {
                    codigoDepartamento: ubigeo.mDepartamento.Codigo,
                    nombreDepartamento: ubigeo.mDepartamento.Descripcion,
                    codigoProvincia: Array(4 - ubigeo.mProvincia.Codigo.length).join('0') + ubigeo.mProvincia.Codigo,
                    nombreProvincia: ubigeo.mProvincia.Descripcion,
                    codigoDistrito: Array(5 - ubigeo.mDistrito.Codigo.length).join('0') + ubigeo.mDistrito.Codigo,
                    nombreDistrito: ubigeo.mDistrito.Descripcion
                },
                codigoTipoLocal: data.mTipoLocal.codigo,
                codigoCategoria: data.mCategoriaLocal.codigo,
                codigoAlarmaMonitoreo: data.mAlarmaMon.codigo,
                tipoLocal: data.mTipoLocal,
                categoria: data.mCategoriaLocal,
                alarmaMonitoreo: data.mAlarmaMon
            }
            var sujetoEvaluacionCount = 0;
            angular.forEach($ctrl.data.conventions, function(convention) {
                if (convention.warning) {
                    angular.forEach(convention.warning,
                        function(war, prop) {
                            if (war.isValid) sujetoEvaluacionCount++
                        });
                }
                if (convention.propertiesCalc) {
                    angular.forEach(convention.propertiesCalc, function(prop, index) {
                        if (prop.mapProperty) {
                            empresa[prop.mapProperty] = !(convention.mCheckConvenio || convention.withoutCheck) ||
                                convention.data[index] == null ||
                                convention.data[index] == undefined ? 0 : convention.data[index];
                        }
                    });
                }
                if (convention.singelField) {
                    empresa[convention.mapProperty] = !convention.mCheckConvenio ||
                        isNaN(convention.data["sumAssured"]) || convention.data["sumAssured"] == null ||
                        convention.data["sumAssured"] == undefined ? 0 : convention.data["sumAssured"];
                }
                if (convention.number === 1 || convention.number === 2) {
                    empresa["valorTotalConvenio" + convention.number] = convention.data.total
                }
            });

            empresa.sujetoEvaluacionCount = sujetoEvaluacionCount;

            return empresa
        }

        function calcPrima(marked) {
            var validForms = true;
            var x = 0;
            var total = 0;
            var isDisplayed = false
            for (; x < $ctrl.data.conventions.length && validForms; x++) {
                var convention = $ctrl.data.conventions[x];

                if (convention.mCheckConvenio || convention.withoutCheck) {

                    var ts = parseFloat(convention.data.total || convention.data.sumAssured)
                    total = total + (isNaN(ts) ? 0 : ts);
                }

                if (marked) {
                    if (convention.frmHeader) convention.frmHeader.markAsPristine();
                    if (convention.frmBody) convention.frmBody.markAsPristine();
                    $scope.formRisk.markAsPristine();
                }

                ($scope.ubigeoValid && !$scope.ubigeoValid.func(!marked));

                validForms = (!(convention.mCheckConvenio || convention.withoutCheck) ||
                    (
                        (!convention.frmHeader || (convention.frmHeader.$valid)) &&
                        (!convention.frmBody || (convention.frmBody.$valid)) &&
                        (!convention.fieldMaxTotal || convention.validators.maxTotal === true)
                    ));
                if (!validForms && !isDisplayed) {
                    isDisplayed = convention.isOpen = true
                }
            }
            var limit = $ctrl.lookups.limits['convention1'];
            var valLimit = limit['maxTotal'][0][nFieldName()]
            $scope.limitGeneral = valLimit
            $scope.showMsgGeneral = total > valLimit;

            if (validForms) {
                if (!$scope.formRisk.$valid || ($scope.ubigeoValid && !$scope.ubigeoValid.func(!marked)))
                    return "Datos ingresados incorrectos";
                else if ($ctrl.data.conventions[0].data.total <= 0)
                    return {
                        message: "Es obligatorio contratar el convenio I para continuar",
                        showMessage: true
                    };
                else if ($scope.showMsgGeneral)
                    return "Fuera del rango";
                else {
                    return { success: true, data: buildData() }
                }

            }
            return { convention: x }
        }
        $ctrl.data.calcPrima = calcPrima;
        (function() {

            $ctrl.currencyValue = function(value) {
                return $filter('currency')(value, '') + ' ' + $ctrl.getMoneyName();
            }

            $ctrl.disabledAcordion = function(convetion) {
                convention.includeBody === undefined || (!convention.mCheckConvenio && convention.withoutCheck !== true)
            }

            $ctrl.setOpen = function($event, convention) {

                convention.isOpen = convention.mCheckConvenio && convention.includeBody !== undefined;
                $event.stopPropagation();
                $event.stopImmediatePropagation();

                if (system.typesBrowser().Firefox) {
                    $event.preventDefault();
                    var ckh = $event.currentTarget;
                    $timeout(function() {
                        ckh.checked = !ckh.checked
                    }, 10)
                }


            }
            $ctrl.isContractFirst = function() {
                var convention = $ctrl.data.conventions[0]
                return convention.data.total !== null && convention.data.total !== undefined && convention.data.total > 0;
            }
            $ctrl.getTotal = function(convention) {
                calculations.conventionOne(convention);
                return convention.data.total;
            }
            $ctrl.checkedEquiMovil = function(convention) {

                convention.data.mCVCoberturaAdicional = "";
            }

            $ctrl.changeContent = function(convention) {
                var f = $ctrl.data.conventions[1].frmBody
                f.nCIIValorContenido.validationForm();
            }
            $ctrl.changeRoturaMaq = function() {
                var f = $ctrl.data.conventions[3].frmHeader
                f.nSumAssured.validationForm();
            }
            $ctrl.changeUnicoEE = function() {
                var f = $ctrl.data.conventions[4].frmBody
                f.nCVLimiteUnico.validationForm();
            }
            $ctrl.changePoderCobradores = function(convention) {
                if (!convention.data.mLimitePoderCobradores) convention.data.mTotalCobradores = '';
                convention.frmBody.nTotalCobradores.validationForm();
            }
            $ctrl.changeLimiteUnico = function(convention) {
                if (!convention.data.mCVLimiteUnico) {
                    convention.data.mEquipoMovil = false;
                    convention.data.mCVCoberturaAdicional = "";
                }
                var f = $ctrl.data.conventions[4].frmBody
                f.nCVCoberturaAdicional.validationForm();
            }
            $ctrl.getMoneyName = function() {
                return !$ctrl.typeMoney || $ctrl.typeMoney == 1 ? 'SOLES' : 'DOLARES';
            }
            $ctrl.getMoneySimb = function() {
                return !$ctrl.typeMoney || $ctrl.typeMoney == 1 ? 'S/. ' : '$ ';
            }
            $ctrl.isCheckedMaquinarias = function() {
                var _isChecked = false
                var _numberConv = [3, 4]
                for (var x = 0; x < _numberConv.length && !_isChecked; x++) {
                    if ($ctrl.data.conventions[_numberConv[x]].mCheckConvenio !== undefined)
                        _isChecked = $ctrl.data.conventions[_numberConv[x]].mCheckConvenio;
                }
                return _isChecked;
            }
            $ctrl.rangeMaquinaria = {
                min: function() {
                    var _isChecked = $ctrl.isCheckedMaquinarias();
                    if (_isChecked)
                        return 1;
                    return NaN;
                },
                max: NaN
            }
            $ctrl.calculatePrima = function($event, convention) {
                if (convention.mCheckConvenio || convention.withoutCheck)
                    rickItemChanger.tryCalculate($attrs, $scope, calcPrima);
            }
            $ctrl.$postLink = function() {
                rickItemChanger.detectedChange($element, $attrs, $scope, calcPrima)
            }
            $ctrl.isDisabled = function(convention) {
                !(convention.includeBody !== undefined && (convention.mCheckConvenio || $ctrl.isContractFirst() || convention.withoutCheck))
            }

        })()

    }]).component('riskItem', {
        templateUrl: function($element, $attrs) {
            return '/polizas/app/empresa/cotiza/component/riskItem.html'
        },
        controller: 'riskItemController',
        bindings: {
            data: '=',
            producto: '=',
            lookups: '=?',
            typeMoney: "=?",
            addtionalData: "&"
        }
    }).constant('conventionsCompany', {
        convetions: {
            'convetion1': {
                number: 1,
                romanNumber: 'I',
                title: 'CONVENIO I - INCENDIO, LÍNEAS ALIADAS Y LUCRO CESANTE',
                description: 'Riesgo sujeto a evaluación de suscripción',
                includeBody: 'fireConvention.html',
                prop: 'incendio',
                includeHeader: {

                    templateInput: 'nConventionHeader.html'
                },
                withoutCheck: true,
                propertiesCalc: {
                    "mCIValorTotalEdif": { mapProperty: 'totalEdificacion' },
                    "mCIValorInstalFijas": { mapProperty: 'instalacionesFijas' },
                    "mCIValorContenido": { mapProperty: 'contenido' },
                    "mCIValorMaquinariaEquipo": { mapProperty: 'maquinariaEquipo' },
                    "mCIValorMobiliario": { mapProperty: 'mobiliario' },
                    "mCIValorExistencias": { mapProperty: 'existencias' },
                    "mCIValorCesanteEstable": { mapProperty: 'lucroCesante' },
                    "mTerremoto": { ignore: true, mapProperty: 'mcaContrataTerremoto', typeValue: 'boolean' },
                    "mTerrorismo": { ignore: true, mapProperty: 'mcaContrataTerrorismo', typeValue: 'boolean' }
                },
                fieldMaxTotal: 'maxTotal',

            },
            'convetion2': {
                number: 2,
                romanNumber: 'II',
                title: 'CONVENIO II - ROBO Y/O ASALTO',
                includeBody: 'stoleConvention.html',
                includeHeader: {
                    templateInput: 'nConventionHeader.html'
                },
                propertiesCalc: {
                    "mCIIValorContenido": { mapProperty: "valorContenido", fieldMax: { field: 'maxContenidoMaq', func: 'maxByConvenio', conventionIndex: 0, options: ['mCIValorContenido', 'mCIValorMaquinariaEquipo', 'mCIValorMobiliario', 'mCIValorExistencias'], message: "El valor no puede superar al 100% del contenido declarado en Convenio I" } },
                    "mLimiteCajaChica": { mapProperty: "limiteCajaChica", fieldMax: 'maxCajaChica', warning: { fieldMax: 'msgCajaChica' } },
                    "mLimiteCajaFuerte": { mapProperty: "limiteCajaFuerte", fieldMax: 'maxCajaFuerte', warning: { fieldMax: 'msgCajaFuerte' } },
                    "mLimiteTransitoBancos": { mapProperty: "limiteTransitoBanco", fieldMax: 'maxTransitoBancos', warning: { fieldMax: 'msgTransitoBancos' } },
                    "mLimitePoderCobradores": { mapProperty: "limitePoderCobradores", fieldMax: 'maxPoderCobradores', warning: { fieldMax: 'msgPoderCobradores' } },
                    "mTotalCobradores": { mapProperty: "numeroCobradores", ignore: true, fieldMin: { value: 1, func: "minTrabajadores", options: ['mLimitePoderCobradores'], conventionIndex: 1 } }
                },
                fieldMaxTotal: 'maxTotal'
            },
            'convetion3': {
                number: 3,
                romanNumber: 'III',
                title: 'CONVENIO III - RESPONSABILIDAD CIVIL',
                singelField: true,
                mapProperty: "sumaAseguradaC3"
            },
            'convetion4': {
                includeHeader: {
                    templateInput: 'simpleHeader4.html'
                },
                number: 4,
                romanNumber: 'IV',
                title: 'CONVENIO IV - ROTURA DE MÁQUINA',
                singelField: {
                    func: 'maxByConvenio',
                    conventionIndex: 0,
                    options: ['mCIValorMaquinariaEquipo'],
                    message: "No puede superar el 100% del valor maquinaria equipo del Convenio I"
                },
                mapProperty: "sumaAseguradaC4"
            },
            'convetion5': {
                number: 5,
                romanNumber: 'V',
                title: 'CONVENIO V - EQUIPO ELECTRÓNICO',
                includeBody: 'equipmentConvention.html',
                includeHeader: {
                    templateInput: 'nConventionHeader.html'
                },
                propertiesCalc: {
                    "mCVLimiteUnico": { mapProperty: "limiteUnico", fieldMax: { field: 'maxUnicoEE', func: 'maxByConvenio', conventionIndex: 0, options: ['mCIValorMaquinariaEquipo'], message: "No puede superar el 100% del valor maquinaria equipo del Convenio I" } },
                    "mCVCoberturaAdicional": { mapProperty: "sumaAseguradaC5", fieldMax: { field: 'maxCovAdicional', func: 'maxByConvenio', conventionIndex: 4, options: ['mCVLimiteUnico'] }, warning: { fieldMax: 'msgCovAdicional' } }
                }
            },
            'convetion6': {
                number: 6,
                romanNumber: 'VI',
                title: 'CONVENIO VI - ACCIDENTES PERSONALES',
                singelField: true,
                mapProperty: "sumaAseguradaC6",
                propertiesCalc: {
                    "totalAseg": { mapProperty: "numeroAsegurados" }
                },
                includeHeader: {
                    templateInput: 'personalAcc.html'
                }
            },
            'convetion7': {
                number: 7,
                romanNumber: 'VII',
                title: 'CONVENIO VII - DESHONESTIDAD DE EMPLEADOS',
                singelField: true,
                mapProperty: "sumaAseguradaC7",
            },
            'convetion8': {
                number: 8,
                romanNumber: 'VIII',
                title: 'CONVENIO VIII - TREC - TODO RIESGO EQUIPO CONTRATISTA',
                singelField: true,
                mapProperty: "sumaAseguradaC8",
            },
            'convetion9': {
                number: 9,
                romanNumber: 'IX',
                title: 'CONVENIO IX - CAR - TODO RIESGO DE CONTRATISTA',
                singelField: true,
                mapProperty: "sumaAseguradaC9",
            },
            'convetion10': {
                number: 10,
                romanNumber: 'X',
                title: 'CONVENIO X - EAR - TODO RIESGO DE MONTAJE',
                singelField: true,
                mapProperty: "sumaAseguradaC10",
            }
        }
    }).service('rickItemChanger', function($parse, $timeout, $compile) {
        var $this = this
        this.tryCalculate = function($attrs, $scope, handler) {
            var fn = $parse($attrs.notifySuccess);
            var value = handler()
            if (!(value && value.success === true)) value = undefined;
            fn($scope.$parent, { $companyData: value });
        }
        this.detectedChange = function($element, $attrs, $scope, handler) {
            angular.getTestability($element).whenStable(function() {
                $timeout(function() {
                    $('input[type=text], input[type=checkbox], select', $($element));
                    $('input[type=text], input[type=checkbox], select', $($element)).change(function() {
                        $this.tryCalculate($attrs, $scope, handler);
                    });
                }, 500)
            });


        }
    }).directive('ieRemoveDisabled', function($parse, $timeout) {
        return {
            link: function(scope, element, attrs, ngModelCtrl) {
                var isIE = false || !!document.documentMode
                var isEdge = !isIE && !!window.StyleMedia;
                if (isIE || isEdge) {
                    angular.getTestability(element).whenStable(function() {
                        $timeout(function() {
                            element.find('a').prop('disabled', false)
                        }, 500)
                    })
                }
            }
        }
    });
});
