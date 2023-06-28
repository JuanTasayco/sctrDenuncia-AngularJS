define(['angular', 'spin', 'system', 'lodash', 'directiveUtils'],
  function(angular, Spinner, system, _, directiveUtils) {
    var appControls = angular.module("mapfre.controls", ['oim.directives.templates']);
    appControls
      .directive('mpfInput', function($parse, truncatorInputFactory, $timeout, $interval, $compile) {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          scope: {
            labelData: '=label',
            model: '=ngModel',
            ngDisabled: '=',
            ngMinlength: "=",
            ngMaxlength: "=",
            trnLength: "=",
            name: "@",
            ngBlur: "&",
            ngFocus: "&",
            trigger: '=focussMe',
            ngChange: '&',
            disabledViewModel: "=",
            isHorz: "=?",
            txtPlaceholder: "=?"
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-input.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            var input = $('input', element)
            if (attrs.focussMe) {

              var seed = null

              function focusable() {

                if (input.focus) {
                  input.focus();
                  if (seed) {
                    clearInterval(seed)
                  }
                }
                scope.trigger = false;
              }
              seed = window.setTimeout(focusable, 10)
            }


            function applyTrunc() {
              var fnPattern = $parse(attrs.ngPattern);

              var reg = fnPattern(scope.$parent, {});

              if (reg && (attrs.ignoreTrunc !== true && attrs.ignoreTrunc !== 'true')) {
                var patt = new RegExp(reg);
                var truncator = new truncatorInputFactory(element.find('input'), function(value) {
                  return !patt.test(value);
                });
              }
            }
            applyTrunc();

            scope.isHorz = scope.isHorz || false;
            scope.txtPlaceholder = scope.txtPlaceholder || '';

            scope.focused = false; //scope.trigger;

            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            }


            scope.isEmpty = function() {
              // var vIsEmpty = (element.find('input').val()) ? element.find('input').val().length == 0 : true;
              // return vIsEmpty;
              return element.find('input').val().length == 0;
            }

            function change(e) {
              scope.focused = e.type === 'focus';
              setTimeout(function() {
                scope.$apply('focused');
              }, 100);
            }
            element.find('input').on('blur', change)
            element.find('input').on('focus', change)

            function c(event) {
              ngModelCtrl.$pristine = false;
            }
            element.find('input').on('keypress', c);
            element.find('input').on('focus', c);

            //Setter el valor al change del input
            scope._ngChange = function() {
              if (ngModelCtrl.$valid && !scope.disabledViewModel)
                ngModelCtrl.$setViewValue(scope.model);

              ngModelCtrl.$render();
            }

          }
        };
      })
      .directive('mpfInputHorz', function($parse, truncatorInputFactory, $timeout, $interval) {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          scope: {
            labelData: '=label',
            model: '=ngModel',
            ngDisabled: '=',
            ngMinlength: "=",
            ngMaxlength: "=",
            trnLength: "=",
            name: "@",
            ngBlur: "&",
            ngFocus: "&",
            trigger: '=focussMe',
            ngChange: '&',
            disabledViewModel: "="
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-input-horz.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            var input = $('input', element)
            if (attrs.focussMe) {

              var seed = null

              function focusable() {

                if (input.focus) {
                  input.focus();
                  if (seed) {
                    clearInterval(seed)
                  }
                }
                scope.trigger = false;
              }

              seed = window.setTimeout(focusable, 10)
            }


            function applyTrunc() {
              var fnPattern = $parse(attrs.ngPattern);

              var reg = fnPattern(scope.$parent, {});

              if (reg && (attrs.ignoreTrunc !== true && attrs.ignoreTrunc !== 'true')) {
                var patt = new RegExp(reg);
                var truncator = new truncatorInputFactory(element.find('input'), function(value) {
                  return !patt.test(value);
                });
              }
            }
            applyTrunc();

            scope.focused = false; //scope.trigger;

            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            }


            scope.isEmpty = function() {
              return element.find('input').val().length == 0
            }

            function change(e) {
              scope.focused = e.type === 'focus';
              setTimeout(function() {
                scope.$apply('focused');
              }, 100);
            }
            element.find('input').on('blur', change)
            element.find('input').on('focus', change)

            function c(event) {
              ngModelCtrl.$pristine = false;
            }
            element.find('input').on('keypress', c);
            element.find('input').on('focus', c);

            //Setter el valor al change del input
            scope._ngChange = function() {
              if (ngModelCtrl.$valid && !scope.disabledViewModel)
                ngModelCtrl.$setViewValue(scope.model);



              ngModelCtrl.$render();
            }

          }
        };
      })
      /*######################################
      # Select
      ######################################*/
      .directive("mpfSelect", ['$q', '$parse', function($q, $parse) {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          templateUrl: '/scripts/mpf-main-controls/html/mpf-select.html',
          scope: {
            mDataSource: "=",
            textField: "@",
            valueField: "@",
            mEmptyOption: "=",
            ngModel: "=",
            ngChange: '&',
            labelData: '=label',
            ngDisabled: "=",
            trigger: '=focussMe',
            isHorz: '=?'
          },
          link: function(scope, element, attrs, ngModelCtrl) {
            

            var input = $('select', element)
            if (scope.trigger) {
              var seed = null

              function focusable() {

                if (input.focus) {
                  input.focus();
                  if (seed) {
                    clearInterval(seed)
                  }
                }
                scope.trigger = false;
              }

              seed = window.setTimeout(focusable, 10)
            }

            scope.isHorz = scope.isHorz || false;

            scope.textField = scope.textField || 'Descripcion'
            scope.valueField = scope.valueField || 'Codigo'
            scope.resolveTextField = function() {

              return scope.textField || (scope.data.length > 1 ? (scope.data[1]['descripcion'] ? 'descripcion' : 'Descripcion') : undefined)
            }
            scope.resolveValueField = function() {

              return scope.valueField || (scope.data.length > 1 ? (scope.data[1]['codigo'] ? 'codigo' : 'Codigo') : undefined)
            }

            element.find('select').on("change", function() {
              ngModelCtrl.$pristine = false;
            })

            function getText() {
              var text = null

              if (angular.isString(scope.mEmptyOption.text)) {

                text = scope.mEmptyOption.text;
              } else if (angular.isObject(scope.mEmptyOption)) {
                if (scope.mEmptyOption.enterData)
                  text = "--Seleccione--";
                else if (scope.mEmptyOption.required)
                  text = "--requerido--";
              }
              return text;
            }

            function _getData(data) {

              if (data != null) {
                if (scope.mEmptyOption) {
                  var text = getText();

                  if (text) {
                    var v = {};
                    v[scope.textField] = text
                    v[scope.valueField] = null;
                    v["selectedEmpty"] = true;
                    v.toString = function() {
                      return "";
                    }
                    if (data.length > 0 && data[0][scope.valueField] !== null)
                      return [v].concat(data)
                  }
                }
              }

              return data;
            }

            function setFirst(dat) {

              if (!scope.ngModel && scope.data && scope.data.length) scope.ngModel = scope.data[0];

            }
            scope.resolveText = function(item) {
              if (scope.textField === scope.valueField && item[scope.valueField] === null) {
                return getText();
              }
              return item[scope.resolveTextField()]
            }
            scope._ngChange = function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            }
            element.find('select').on('change', function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            })
            scope.data = [];
            scope.checkModelValidity = function(mDataSource) {
              if (typeof(mDataSource) == "undefined" || !mDataSource) return false;
              return true;
            };

            function loadData() {
              if (scope.mDataSource !== undefined && scope.mDataSource !== null) {
                if (angular.isArray(scope.mDataSource)) {

                  scope.mDataSource = _getData(scope.mDataSource);
                  scope.data = scope.mDataSource;
                  setObject();
                  setFirst();
                } else {
                  $q.when(scope.mDataSource, function(response) {
                    var d = _getData(response.data || response.Data)
                    scope.data = (d ? (d.data || d.Data) : null) || d;
                    setObject();
                    setFirst();
                  }, function(reponse) {});
                }
              }
            }

            loadData();

            function setObject() {
              if (angular.isArray(scope.data) && scope.ngModel) {
                var item = null;
                angular.forEach(scope.data, function(o) {
                  if (!item && o[scope.valueField] == scope.ngModel[scope.valueField])
                    item = o;
                });
                if (item != scope.ngModel && item)
                  scope.ngModel = item;
              }
            }

            scope.$watch('ngModel', function(n, o) {
              if (scope.ngModel) {
                var setInData = scope.ngModel[scope.textField] === undefined && scope.ngModel[scope.textField] !== null && scope.ngModel[scope.valueField] != null;
                if (setInData) {
                  setObject()
                }
              } else {
                setFirst();
              }
            });
            /*
            scope.$watch('data', function(n,o){
                if (setInData)
                  $scope.ngModel[$scope.textField]
            })*/
            scope.$watch('mDataSource', function() {
              loadData();
            });

            if (attrs.ngRequired) {
              ngModelCtrl.$validators.required = function(modelValue, viewValue) {
                var valModel = modelValue || viewValue;
                var isEnabledRequired = $parse(attrs.ngRequired)(scope.$parent, {});
                return !isEnabledRequired || (!helper.isEmptyObject(valModel) && valModel.selectedEmpty !== true);
              };
            }


          }
        }
      }])
      /*######################################
      # Select Placeholder
      ######################################*/
      .directive("mpfSelectPlaceholder", ['$q', '$parse', function($q, $parse) {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          templateUrl: '/scripts/mpf-main-controls/html/mpf-select-placeholder.html',
          scope: {
            mDataSource: "=",
            textField: "@",
            valueField: "@",
            mEmptyOption: "=",
            ngModel: "=",
            ngChange: '&',
            labelData: '=label',
            ngDisabled: "=",
            trigger: '=focussMe',
            isHorz: '=?'
          },
          link: function(scope, element, attrs, ngModelCtrl) {
            var input = $('select', element)
            if (attrs.focussMe) {
              var seed = null

              function focusable() {

                if (input.focus) {
                  input.focus();
                  if (seed) {
                    clearInterval(seed)
                  }
                }
                scope.trigger = false;
              }

              seed = window.setTimeout(focusable, 10)
            }

            scope.isHorz = scope.isHorz || false;

            scope.textField = scope.textField || 'Descripcion'
            scope.valueField = scope.valueField || 'Codigo'

            scope.resolveTextField = function() {

              return scope.textField || (scope.data.length > 1 ? (scope.data[1]['descripcion'] ? 'descripcion' : 'Descripcion') : undefined)
            }

            scope.resolveValueField = function() {

              return scope.valueField || (scope.data.length > 1 ? (scope.data[1]['codigo'] ? 'codigo' : 'Codigo') : undefined)
            }

            element.find('select').on("change", function() {
              ngModelCtrl.$pristine = false;
            })

            function getText() {
              var text = null

              if (angular.isString(scope.mEmptyOption.text)) {
                text = scope.mEmptyOption.text;
              } else if (angular.isObject(scope.mEmptyOption)) {
                if (scope.mEmptyOption.enterData)
                  text = " ";
                else if (scope.mEmptyOption.required)
                  text = " ";
              }
              return text;
            }

            function _getData(data) {

              if (data != null) {
                if (scope.mEmptyOption) {
                  var text = getText();

                  if (text) {
                    var v = {};
                    v[scope.textField] = text
                    v[scope.valueField] = null;
                    v["selectedEmpty"] = true;
                    v.toString = function() {
                      return "";
                    }
                    if (data.length > 0 && data[0][scope.valueField] !== null)
                      return [v].concat(data)
                    if (data.length == 0)
                      return [v].concat(data)
                  }
                }
              }

              return data;
            }

            function setFirst(dat) {

              if (!scope.ngModel && scope.data && scope.data.length) scope.ngModel = scope.data[0];

            }
            scope.resolveText = function(item) {
              if (scope.textField === scope.valueField && item[scope.valueField] === null) {
                return getText();
              }
              return item[scope.resolveTextField()]
            }
            scope._ngChange = function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            }
            element.find('select').on('change', function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            })
            scope.data = [];
            scope.checkModelValidity = function(mDataSource) {
              if (typeof(mDataSource) == "undefined" || !mDataSource) return false;
              return true;
            };

            function loadData() {
              if (scope.mDataSource !== undefined && scope.mDataSource !== null) {
                if (angular.isArray(scope.mDataSource)) {

                  scope.mDataSource = _getData(scope.mDataSource);
                  scope.data = scope.mDataSource;
                  setObject();
                  setFirst();
                } else {
                  $q.when(scope.mDataSource, function(response) {
                    var d = _getData(response.data || response.Data)
                    scope.data = (d ? (d.data || d.Data) : null) || d;
                    setObject();
                    setFirst();
                  }, function(reponse) {});
                }
              }
            }

            loadData();

            function setObject() {
              if (angular.isArray(scope.data) && scope.ngModel) {
                var item = null;
                angular.forEach(scope.data, function(o) {
                  if (!item && o[scope.valueField] == scope.ngModel[scope.valueField])
                    item = o;
                });
                if (item != scope.ngModel && item)
                  scope.ngModel = item;
              }
            }

            scope.$watch('ngModel', function(n, o) {
              if (scope.ngModel) {
                var setInData = scope.ngModel[scope.textField] === undefined && scope.ngModel[scope.textField] !== null && scope.ngModel[scope.valueField] != null;
                if (setInData) {
                  setObject()
                }
              } else {
                setFirst();
              }
            });

            scope.$watch('mDataSource', function() {
              loadData();
            });

            if (attrs.ngRequired) {
              ngModelCtrl.$validators.required = function(modelValue, viewValue) {
                var valModel = modelValue || viewValue;
                var isEnabledRequired = $parse(attrs.ngRequired)(scope.$parent, {});
                return !isEnabledRequired || (!helper.isEmptyObject(valModel) && valModel.selectedEmpty !== true);
              };
            }

            scope.isEmpty = function() {
              var noHasModelData = (scope.ngModel === undefined || scope.ngModel === null || scope.ngModel[scope.valueField] === null);
              var hasDefaultValue = angular.isString(scope.mEmptyOption.text);
              return noHasModelData && !hasDefaultValue;
            };

          }
        }
      }])
      .directive("mpfSelectHorz", ['$q', '$parse', function($q, $parse) {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          templateUrl: '/scripts/mpf-main-controls/html/mpf-select-horz.html',
          scope: {
            mDataSource: "=",
            textField: "@",
            valueField: "@",
            mEmptyOption: "=",
            ngModel: "=",
            ngChange: '&',
            labelData: '=label',
            ngDisabled: "=",
            trigger: '=focussMe'
          },
          link: function(scope, element, attrs, ngModelCtrl) {


            var input = $('select', element)
            if (attrs.focussMe) {

              var seed = null

              function focusable() {

                if (input.focus) {
                  input.focus();
                  if (seed) {
                    clearInterval(seed)
                  }
                }
                scope.trigger = false;
              }

              seed = window.setTimeout(focusable, 10)
            }

            scope.textField = scope.textField || 'Descripcion'
            scope.valueField = scope.valueField || 'Codigo'
            scope.resolveTextField = function() {

              return scope.textField || (scope.data.length > 1 ? (scope.data[1]['descripcion'] ? 'descripcion' : 'Descripcion') : undefined)
            }
            scope.resolveValueField = function() {

              return scope.valueField || (scope.data.length > 1 ? (scope.data[1]['codigo'] ? 'codigo' : 'Codigo') : undefined)
            }

            element.find('select').on("change", function() {
              ngModelCtrl.$pristine = false;
            })

            function getText() {
              var text = null

              if (angular.isString(scope.mEmptyOption.text)) {

                text = scope.mEmptyOption.text;
              } else if (angular.isObject(scope.mEmptyOption)) {
                if (scope.mEmptyOption.enterData)
                  text = "--Seleccione--";
                else if (scope.mEmptyOption.required)
                  text = "--requerido--";
              }
              return text;
            }

            function _getData(data) {

              if (data != null) {
                if (scope.mEmptyOption) {
                  var text = getText();

                  if (text) {
                    var v = {};
                    v[scope.textField] = text
                    v[scope.valueField] = null;
                    v["selectedEmpty"] = true;
                    v.toString = function() { return ""; }
                    if (data.length > 0 && data[0][scope.valueField] !== null)
                      return [v].concat(data)
                  }
                }
              }

              return data;
            }

            function setFirst(dat) {

              if (!scope.ngModel && scope.data && scope.data.length) scope.ngModel = scope.data[0];

            }
            scope.resolveText = function(item) {
              if (scope.textField === scope.valueField && item[scope.valueField] === null) {
                return getText();
              }
              return item[scope.resolveTextField()]
            }
            scope._ngChange = function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            }
            element.find('select').on('change', function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            })
            scope.data = [];
            scope.checkModelValidity = function(mDataSource) {
              if (typeof(mDataSource) == "undefined" || !mDataSource) return false;
              return true;
            };

            function loadData() {
              if (scope.mDataSource !== undefined && scope.mDataSource !== null) {
                if (angular.isArray(scope.mDataSource)) {

                  scope.mDataSource = _getData(scope.mDataSource);
                  scope.data = scope.mDataSource;
                  setObject();
                  setFirst();
                } else {
                  $q.when(scope.mDataSource, function(response) {
                    var d = _getData(response.data || response.Data)
                    scope.data = (d ? (d.data || d.Data) : null) || d;
                    setObject();
                    setFirst();
                  }, function(reponse) {});
                }
              }
            }

            loadData();

            function setObject() {
              if (angular.isArray(scope.data) && scope.ngModel) {
                var item = null;
                angular.forEach(scope.data, function(o) {
                  if (!item && o[scope.valueField] == scope.ngModel[scope.valueField])
                    item = o;
                });
                if (item != scope.ngModel && item)
                  scope.ngModel = item;
              }
            }

            scope.$watch('ngModel', function(n, o) {
              if (scope.ngModel) {
                var setInData = scope.ngModel[scope.textField] === undefined && scope.ngModel[scope.textField] !== null && scope.ngModel[scope.valueField] != null;
                if (setInData) {
                  setObject()
                }
              } else {
                setFirst();
              }
            });
            /*
            scope.$watch('data', function(n,o){
              if (setInData)
                $scope.ngModel[$scope.textField]
            })*/
            scope.$watch('mDataSource', function() {
              loadData();
            });

            if (attrs.ngRequired) {
              ngModelCtrl.$validators.required = function(modelValue, viewValue) {
                var valModel = modelValue || viewValue;
                var isEnabledRequired = $parse(attrs.ngRequired)(scope.$parent, {});
                return !isEnabledRequired || (!helper.isEmptyObject(valModel) && valModel.selectedEmpty !== true);
              };
            }

          }
        }
      }])
      .directive('mpfPassword', function() {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          scope: {
            labelData: '=label',
            model: '=ngModel',
            disabled: '@'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-password.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            function c(event) {
              ngModelCtrl.$pristine = false;
            }
            element.find('input').on('keypress', c);
            element.find('input').on('focus', c)
          }
        };
      })
      .directive("mSelect", ['$q', function($q) {
        return {
          restrict: 'E',
          require: "^ngModel",
          templateUrl: '/scripts/mpf-main-controls/html/mp-select.html',

          scope: {
            mDataSource: "=",
            textField: "@",
            valueField: "@",
            mEmptyOption: "=",
            ngModel: "=",
            ngChange: '&',
            labelData: '=label',
            ngDisabled: "="
          },
          link: function(scope, element, attrs, ngModelCtrl) {

            element.find('select').on("change", function() {
              //ngModelCtrl.$pristine = false;
            })

            function _getData(data) {

              if (scope.mEmptyOption) {
                var text = null
                if (angular.isString(scope.mEmptyOption.text))
                  text = scope.mEmptyOption.text;
                else if (angular.isObject(scope.mEmptyOption)) {
                  if (scope.mEmptyOption.enterData)
                    text = "--Seleccione--";
                  else if (scope.mEmptyOption.required)
                    text = "--requerido--";
                }
                if (text) {
                  var v = {};
                  v[scope.textField] = text
                  v[scope.valueField] = null;
                  v["selectedEmpty"] = true;
                  v.toString = function() {
                    return "";
                  }
                  if (data && data.length > 0 && data[0][scope.valueField] !== null)
                    return [v].concat(data)
                }
              }

              return data;

            }

            function setFirst(dat) {

              if (!scope.ngModel && scope.data && scope.data.length) scope.ngModel = scope.data[0];
            }
            scope._ngChange = function() {
              ngModelCtrl.$setViewValue(scope.ngModel)
            }

            scope.data = [];

            function loadData() {
              if (scope.mDataSource !== undefined && scope.mDataSource !== null) {
                if (angular.isArray(scope.mDataSource)) {
                  scope.mDataSource = _getData(scope.mDataSource);
                  scope.data = scope.mDataSource;
                  setFirst();
                } else {
                  $q.when(scope.mDataSource, function(response) {
                    scope.data = _getData(response.data);
                    setFirst();
                  }, function(reponse) {

                  });
                }
              }
            }
            loadData();
            scope.$watch('mDataSource', function() {
              loadData();
            });
          }
        }
      }])
      /*######################################
      # Validation
      ######################################*/
      .directive('mpfValidation', function($compile, $parse, truncatorInputFactory) {
        function link($scope, element, attrs, requirements) {
          var ngModel = requirements[0];
            var ngForm = requirements[1];
            //ArrayValidation
            var arrayValidation = attrs.mpfValidation.split(",");
            /*######################
            # mpfValidationDisabled
            #######################*/
            var arrayValidationDisabled;
            if (attrs.mpfValidationDisabled) arrayValidationDisabled = attrs.mpfValidationDisabled.split(",");
            attrs.$observe('mpfValidationDisabled', function(nV, oV) {
              arrayValidationDisabled = nV.split(",");
            });
            /*#####################*/

            if (arrayValidation[0] !== '') {
              //ArrayRegex
              var regex = {
                phone: { reg: /^([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9 \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)$/, isTruncable: false },
                email: { reg: /^([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)[._-]?@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}\.?)([a-zA-Z0-9]*)$/i, isTruncable: false },
                url:   { reg: /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i, isTruncable: false },
                moreOneEmail: { reg: /^([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}\.?)([a-zA-Z0-9]*)$/i, isTruncable: false },
                integer: { reg: /^[\-\+]?\d+$/, isTruncable: true },
                number: { reg: /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/, isTruncable: true }, // Number, including positive, negative, and floating decimal. credit: orefalo
                number2: { reg: /^([0-9]{1,3})((\.?)([0-9]{1,2})?)$/, isTruncable: true }, // Number, including positive, negative, and floating decimal. credit: orefalo
                numberFixed2: { reg: /^([0-9]+)((\.?)([0-9]{1,2})?)$/, isTruncable: true },
                date: { reg: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/, isTruncable: false },
                onlyNumber: { reg: /^[0-9\ ]+$/, isTruncable: true },
                onlyNumberNoSpace: { reg: /^[0-9]+$/, isTruncable: true },
                slashNumber: { reg: /^[0-9\/\ ]+$/, isTruncable: true },
                documentNumberGCW: { reg: /^[0-9\/\/\- ]+$/, isTruncable: true },
                onlyNumberDecimal: { reg: /^[0-9\ \.]+$/, isTruncable: true },
                placas: { reg: /^[\w]+$/, isTruncable: true },
                onlyLetter: { reg: /^[a-zA-Z\ \'ñÑáéíóúÁÉÍÓÚ\.\/]+$/, isTruncable: true },
                onlyLetterNumber: { reg: /^[0-9a-zA-Z\ \.ñÑáéíóúÁÉÍÓÚ]+$/, isTruncable: true },
                alfanumerico: { reg: /^[0-9a-zA-Z]+$/, isTruncable: true },
                alfanumericoEspacio: { reg: /^[0-9a-zA-Z\ ]+$/, isTruncable: true },
                onlyLetterNumberGuion: { reg: /^[0-9a-zA-Z\ \/\-\_\.ñÑáéíóúÁÉÍÓÚ]+$/, isTruncable: true },
                onlyLetterNumCaracteres: { reg: /^[0-9a-zA-Z\ \.\°\*\+\:ñÑáéíóúÁÉÍÓÚ]+$/, isTruncable: true },
                onlyDecimal: { reg: /^[0-9\,]*([.]?\d{0,2})?$/, isTruncable: true },
                onlyDecimalDescuento: { reg: /^(\d+)?([.]?\d{0,2})?$/, isTruncable: true },
                percent: { reg: /^(100|[1-9][0-9]|[0-9])$/, isTruncable: true },
                placaNumber: { reg: /^\w{5,6}[^`'ʼʻ’]$/, isTruncable: true },
                // TODO: extraer esta validacion
                tasaMercaderia: { reg: /^(0\.([\d]{1,2})?|0)$/, isTruncable: true },
                porcentajeSobreseguro: { reg: /^(0|[1-9]|1[0-9]|20)$/, isTruncable: false },
                valDocumentNumber: { reg: /^[0-9\ \/\-]+$/, isTruncable: true },
                notNumber: { reg: /^([^0-9]*)$/, isTruncable: false },
                edad: { reg: /^[0-9]{1,3}$/, isTruncable: false },
                fono2: { reg: /^(\+)?[0-9\(\)\-\*]*$/, isTruncable: true },
                fono3: { reg: /^[0-9]{7,9}$/, isTruncable: false },
                fono4: { reg: /^(\+)?[0-9\(\)\-\*]{7,}$/, isTruncable: true },
                motor: { reg: /^[^ioOI]{8,}$/, isTruncable: false }
              };

              var isRequired = typeof(attrs.ngRequired) != 'undefined';
              function isEmpty(valModel) {
                if (angular.isObject(valModel))
                  return valModel.selectedEmpty;
                return (valModel === "" || valModel === undefined || valModel === null || valModel === "null");
              }

              if (attrs.ngValuemin && attrs.ngValuemax) {
                $scope.rangeMin = $parse(attrs.ngValuemin)($scope);
                $scope.rangeMax = $parse(attrs.ngValuemax)($scope);
                arrayValidation.push("rangeTasa");
              }


              angular.forEach(arrayValidation, function(value, key) {
                var optValidate = value.replace(/\s+/g, ''); //Elimino espacios
                if (optValidate !== 'required' && optValidate !== 'mpfrequired') {
                  ngModel.$validators[optValidate] = function test(modelValue, viewValue) {
                    var valModel = viewValue || modelValue;
                    var value = false;
                    if (isRequired) {
                      // debugger;
                      value = $parse(attrs.ngRequired)($scope, {})
                    }

                    if (optValidate === 'moreOneEmail') {
                      if (!valModel) return true;
                      var arrayEmails = valModel.trim().split(',');
                      var arrayFiltrado = _.drop(arrayEmails, '');
                      var arrayLength = arrayEmails.length;
                      var i;
                      if (arrayLength === 0) {
                        return false;
                      }

                      for (i = 0; i < arrayLength; i++) {
                        var email = arrayEmails[i].trim();
                        var validacionEmail = email && (email === ',' || regex[optValidate].reg.test(email));
                        if (!validacionEmail && email != '') {
                          return false;
                        }
                      }

                      return true;
                    }

                    if (!value && isEmpty(valModel)) {
                      return true;
                    }
                    if (optValidate == "rangeTasa") {
                      var fValue = parseFloat(valModel);
                      return fValue >= $scope.rangeMin &&
                        fValue <= $scope.rangeMax;
                    }

                    /*######################
                    # mpfValidationDisabled
                    #######################*/
                    var vCountValidationDisabled = 0;
                    if (arrayValidationDisabled){
                      angular.forEach(arrayValidationDisabled, function(value2, key2){
                        if (optValidate == value2) vCountValidationDisabled++;
                      })
                    }
                    if (vCountValidationDisabled > 0) return true;
                    /*#####################*/

                    return regex[optValidate].reg.test(valModel);
                  }
                } else {
                  isRequired = true;
                  if (!attrs.ngRequired) {
                    ngModel.$validators.required = function test(modelValue, viewValue) {
                      var valModel = modelValue || viewValue;
                      if (angular.isObject(valModel))
                        return !helper.isEmptyObject(valModel) && valModel.selectedEmpty !== true;
                      return (valModel !== "" && valModel !== undefined && valModel !== null && valModel !== "null");
                    }
                  }
                }
              });

              var el = element[0].tagName == "INPUT" ? element : element.find('input');

              var truncator = new truncatorInputFactory(el, function(value) {
                for (var val in arrayValidation) {
                  var optValidate = arrayValidation[val].replace(/\s+/g, ''); //Elimino espacios
                  /*######################
                  # mpfValidationDisabled
                  #######################*/
                  var vEval = true;
                  if (arrayValidationDisabled){
                    var vCountEval = 0;
                    angular.forEach(arrayValidationDisabled, function(value2, key2){
                      if (optValidate !== value2) vCountEval++;
                    });
                    vEval = (vCountEval >= arrayValidationDisabled.length);
                  }
                  /*#####################*/
                  if (vEval){
                    if (attrs.ngTrim && value) { value = value.trim(); }
                    if (regex[optValidate] && regex[optValidate].isTruncable && !regex[optValidate].reg.test(value)) return true;
                  }
                }
                return false;
              });

              //si tiene add-messages se ponen dinamicamente los mensajes
              if (typeof attrs.addMessages != "undefined" && ngForm != null && attrs.name) {
                // TODO: como personalizar los mensajes
                var aMessages = {
                  phone: 'Ingresa un telefono valido',
                  email: 'Ingresa un correo valido',
                  integer: 'Ingresa un número valido',
                  number: 'Ingresa un número valido',
                  number2: 'Ingresa un número valido',
                  date: 'Ingresa una fecha valida',
                  onlyNumber: 'Solo es permitido números',
                  onlyLetter: 'Solo es permitido letras',
                  onlyLetterNumber: 'Solo es permitido letras y números',
                  required: 'Este campo es requerido',
                  percent: 'Este campos solo admite valores entre 0 y 100',
                  // TODO: extraer este mensaje
                  tasaMercaderia: 'Los valores admitidos van entre 0.01 y 0.99',
                  porcentajeSobreseguro: 'El valor debe estar entre 0 y 20',
                  pattern: 'no cumple con el formato solicitado'
                };

                var addRequired = true;
                var nameMessage = ngForm.$name + '.' + attrs.name + '.$error';
                var nameMessageValidation = ngForm.$name + '.' + attrs.name + '.$pristine';
                var eMessages = "<div class='g-error' ng-messages='" + nameMessage + "' ng-messages-multiple ng-show='!" + nameMessageValidation + "'>";
                angular.forEach(arrayValidation, function(value, key) {
                  var optValidate = value.replace(/\s+/g, ''); //Elimino espacios
                  var tMessage = '';

                  if (optValidate == "rangeTasa") {
                    tMessage = "El valor debe estar entre " + $scope.rangeMin + " y " + $scope.rangeMax;
                  } else {
                    tMessage = (aMessages[optValidate] || '');
                  }

                  eMessages += '<div ng-message="' + optValidate + '" class="invalid">' + tMessage + '</div>';
                  if (optValidate == "required") {
                    addRequired = false;
                  }
                });

                if (addRequired) {
                  eMessages += '<div ng-message="required" class="invalid">' + (aMessages['required'] || '') + '</div>';
                }

                eMessages += '<div ng-message="pattern" class="invalid">' + (aMessages['pattern'] || '') + '</div>';

                eMessages += "</div>"
                var oMessages = $(eMessages);
                element.after(oMessages);
                element.removeAttr("add-messages");

                function findClosestScopeForNgForm(scope, ngName) {
                  var bComp = false;
                  var name = "";
                  var subName = "";
                  if (ngName.indexOf(".") > 0) {
                    //multi part control
                    var comp = ngName.split(".");
                    name = comp[0];
                    subName = comp[1];
                    bComp = true
                  } else {
                    name = ngName;
                  }

                  if ((bComp && scope[name] && scope[name][subName]) || scope[name]) {
                    return scope;
                  } else {
                    return findClosestScopeForNgForm(scope.$parent, ngName)
                  }
                }

                $compile(oMessages)(findClosestScopeForNgForm($scope, ngForm.$name));
              }
            } //if (arrayValidation !== ''){
        }
        return {
          restrict: 'A',
          require: ['?ngModel', '^form'],
          //----------------------------------------------
          link: function($scope, element, attrs, requirements) {
            attrs.$observe('mpfValidation', function(nV, oV) {
              if (nV) {
                link($scope, element, attrs, requirements)
              }
            });
          }
        };
      })
      /*######################################
      # CheckBox
      ######################################*/
      .directive('mpfCheckbox', function($parse) {
        return {
          restrict: 'E',
          replace: true,
          require: '^ngModel',
          scope: {
            labelData: '@label',
            // checkData: '=info',
            ngModel: '='
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-checkbox.html',
          link: function($scope, element, attrs, ngModelCtrl) {
            var fn = $parse(attrs.ngClick);
            var fnd = $parse(attrs.ngDisabled);
            var fnTrue = $parse(attrs.ngTrueValue);
            var fnFalse = $parse(attrs.ngFalseValue);

            // $scope.$parent.$watch(attrs.ngModel, function(n, o) {
            // $scope.$watch(attrs.ngModel, function(n, o) {
            $scope.$watch('ngModel', function(n, o) {
              if (n != o)
                $scope._ngModel = getValue(n);
            })

            function disabled() {
              return fnd($scope.$parent, {});
            }
            $scope.isDisabled = disabled;
            $scope._ngModel = (fnTrue($scope.$parent, {}) || true) === $scope.ngModel
            bindValue();
            /* ngModelCtrl.$setPristine(true); => Debe ir siempre despues de => bindValue()
            para que la primera vez que carge setee el pristine a true,
            dado la funcion bindValue() cambia el valor a false */
            ngModelCtrl.$setPristine(true);

            function getValue(v) {
              var vtrue = fnTrue($scope.$parent, {}) || true
              var vfalse = fnFalse($scope.$parent, {}) || false
              if (v == vtrue)
                return true;
              if (v == vfalse)
                return false;
            }

            function bindValue() {
              if ($scope._ngModel)
                ngModelCtrl.$setViewValue(fnTrue($scope.$parent, {}) || true);
              else
                ngModelCtrl.$setViewValue(fnFalse($scope.$parent, {}) || false);
            }
            $scope._click = function($event) {
              bindValue()

              fn($scope.$parent, {
                $event: $event
              });
            }
            var input = element.find('input');
            $(input).change(function($e) {
            // $(input).bind('change click', function($e){
              // if (navigator.appVersion.indexOf("Win")!=-1){
              //   bindValue();
              // }
              // bindValue();
              var fn = $parse(attrs.domChange);
              fn($scope.$parent, {
                $event: $e
              });
            })

            if (attrs.ngRequired){
              ngModelCtrl.$validators.required = function(modelValue, viewValue) {
                var vReturn = !attrs.required || (attrs.required && viewValue);
                return vReturn;
              };
            }

          }
        };
      })
      /*######################################
      # Radio
      ######################################*/
      // NO USAR
      .directive('mpfRadio', function() {
        return {
          restrict: 'E',
          replace: true,
          scope: {
            labelData: '=label',
            radioData: '=info',
            model: '=ngModel',
            function: '&'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-radio.html'
        };
      })
      //
      // USAR
      .directive('mRadio', function() {
        return {
          restrict: 'E',
          replace: true,
          require: '^ngModel',
          scope: {
            function: '&',
            isInputBoolean: '=?',
            labelData: '=label',
            ngDisabled: '=',
            ngModel: '=',
            value: '@'
          },
          templateUrl: '/scripts/mpf-main-controls/html/m-radio.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            if (scope.isInputBoolean) {
              if (!angular.isUndefined(scope.ngModel)) {
                if (scope.isInputBoolean) {
                  scope.ngModel = (scope.ngModel + '' === 'true') ? true : false;
                } else {
                  scope.ngModel = scope.ngModel + '';
                }
              }
            }

            element.on('click', function() {
              if (scope.getDisabled()) {
                return;
              }
              _setModel();
              ngModelCtrl.$setViewValue(scope.ngModel);
            });

            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            }

            function _setModel() {
              if (scope.isInputBoolean) {
                scope.ngModel = (scope.value === 'true') ? true : false;
              } else {
                scope.ngModel = scope.value;
              }
            }
          }
        };
      })
      //
      /*######################################
      # enterKey
      ######################################*/
      .directive('enterKey', function() {
        return function(scope, element, attrs) {
          element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
              scope.$apply(function() {
                scope.$eval(attrs.myEnter);
              });
              event.preventDefault();
            }
          });
        };
      })
      /*######################################
      # TextArea
      ######################################*/
      .directive('mpfTextarea', ['$timeout', function($timeout) {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          scope: {
            labelData: '=label',
            model: '=ngModel',
            ngDisabled: '=',
            ngMaxlength: "="
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-textarea.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            function c(event) {
              ngModelCtrl.$pristine = false;
            }
            element.find('textarea').on('keypress', c);
            element.find('textarea').on('focus', c);
            function _autoHeight(objThis){
              objThis.style.height = "1px";
              objThis.style.height = (19 + objThis.scrollHeight) + "px";
            }
            element.find('textarea').on('keyup', function() {
              _autoHeight(this);
            });
            function init(){
              var valueText = ngModelCtrl.$viewValue;
              var vTextArea = element.find('textarea')[0];
              if ( valueText && (valueText.length >= 180 || valueText.replace(/\n$/gm, '').split(/\n/).length > 2) ) {
                vTextArea.style.height = (19 + vTextArea.scrollHeight) + "px";
              }
            }
            $timeout(init, 3000);
            scope.$watch('model', function(newValue, oldValue) {
              if (newValue)
                init();
            }, true);
          }
        };
      }])
      /*######################################
      # Title
      ######################################*/
      .directive('pageTitle', function() {
        return {
          restrict: 'E',
          scope: {
            info: '='
          },
          templateUrl: '/scripts/mpf-main-controls/html/title.html',
        };
      })
      /*######################################
      # Date
      ######################################*/
      .directive('mpfDate', function() {
        return {
          restrict: 'E',
          scope: {
            labelData: '=label',
            selectData: '=info',
            modelDay: '=modelDay',
            modelMonth: '=modelMonth',
            modelYear: '=modelYear',
            validate: '@',
            disabled: '@'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-date.html'
        };
      })
      /*######################################
      # DateSelect
      ######################################*/
      .directive('mpfDateselect', function() {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          scope: {
            labelData: '=label',
            model: '=ngModel',
            name: '@ngName',
            minDate: '=ngMindate',
            maxDate: '=ngMaxdate'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-dateselect.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            scope.$watch('minDate.fDay', function(value) {
              if (value) {
                recalCalculateData();
              }
            });
            scope.$watch('minDate.fMonth', function(value) {
              if (value) {
                recalCalculateData();
              }
            });
            scope.$watch('minDate.fYear', function(value) {
              if (value) {
                recalCalculateData();
              }
            });

            scope.$watch('maxDate.fDay', function(value) {
              if (value) {
                recalCalculateData();
              }
            });
            scope.$watch('maxDate.fMonth', function(value) {
              if (value) {
                recalCalculateData();
              }
            });
            scope.$watch('maxDate.fYear', function(value) {
              if (value) {
                recalCalculateData();
              }
            });


            function getDays(month, year, min, max) {
              var arrayDay = [];
              var objDay = {};
              var days = 31;
              var start = min ? min : 1;
              if (month && year) {
                days = 32 - new Date(year, month, 32).getDate();
              }
              if (max && days > max) {
                days = max;
              }

              var description = '';
              for (var i = start; i <= days; i++) {
                description = ('0' + i).slice(-2);
                objDay = {
                  id: i,
                  description: description
                };
                arrayDay.push(objDay);
              }
              return arrayDay;
            }

            function getMonths(min, max) {
              var arrayMonth = [];
              var objMonth = {};
              var months = max ? max : 12;
              var startMonth = min ? min : 1;
              var description = '';
              for (var i = startMonth; i <= months; i++) {
                description = ('0' + i).slice(-2);
                objMonth = {
                  id: i,
                  description: description
                };
                arrayMonth.push(objMonth);
              }
              return arrayMonth;
            }

            function getYears(min, max) {
              var thisYear = new Date().getFullYear();
              var firstYear = thisYear - 1;
              if (min) {
                firstYear = min;
              }

              thisYear = max ? max : (thisYear + 1);

              var arrayYear = [];
              var objYear = {};
              for (var i = firstYear; i <= thisYear; i++) {
                objYear = {
                  id: i,
                  description: i
                };
                arrayYear.push(objYear);
              }
              return arrayYear;
            }

            function recalCalculateData() {
              if (scope.minDate && scope.maxDate) {
                if (angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty &&
                  angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty) {

                  scope.yearData = getYears(scope.minDate.fYear.id, scope.maxDate.fYear.id);
                  scope.monthData = getMonths(scope.minDate.fMonth.id, scope.maxDate.fMonth.id);
                  scope.dayData = getDays(scope.minDate.fMonth.id - 1, scope.yearData[0].id, scope.minDate.fDay.id + 1, scope.maxDate.fDay.id + 1);
                }
              } else if (scope.minDate) {
                if (angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty) {

                  //all data is set
                  scope.yearData = getYears(scope.minDate.fYear.id);
                  scope.monthData = getMonths(scope.minDate.fMonth.id);
                  scope.dayData = getDays(scope.minDate.fMonth.id - 1, scope.yearData[0].id, scope.minDate.fDay.id + 1);
                }
              } else if (scope.maxDate) {
                if (angular.isObject(scope.maxDate) &&
                  !scope.maxDate.fDay.selectedEmpty &&
                  !scope.maxDate.fMonth.selectedEmpty &&
                  !scope.maxDate.fYear.selectedEmpty) {


                  scope.yearData = getYears(null, scope.maxDate.fYear.id);
                  scope.monthData = getMonths(null, scope.maxDate.fMonth.id);
                  scope.dayData = getDays(scope.maxDate.fMonth.id - 1, scope.yearData[0].id, null, scope.maxDate.fDay.id + 1);
                }
              }
            }

            scope.dayData = getDays();

            scope.monthData = getMonths();

            scope.yearData = getYears();

            scope.onMonthChange = function() {
              if (!scope.model.fMonth || scope.model.fMonth.selectedEmpty) return;

              var year = scope.model.fYear.id || scope.yearData[1].id;
              if (scope.minDate && scope.maxDate) {
                if (angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty &&
                  angular.isObject(scope.maxDate) &&
                  !scope.maxDate.fDay.selectedEmpty &&
                  !scope.maxDate.fMonth.selectedEmpty &&
                  !scope.maxDate.fYear.selectedEmpty) {

                  if (scope.model.fYear.id == scope.minDate.fYear.id &&
                    scope.model.fMonth.id == scope.minDate.fMonth.id &&
                    scope.model.fYear.id == scope.maxDate.fYear.id &&
                    scope.model.fMonth.id == scope.maxDate.fMonth.id) {
                    scope.dayData = getDays(scope.minDate.fMonth.id - 1, year, scope.minDate.fDay.id + 1, scope.maxDate.fDay.id + 1);
                  } else if (scope.model.fYear.id == scope.minDate.fYear.id &&
                    scope.model.fMonth.id == scope.minDate.fMonth.id) {
                    scope.dayData = getDays(scope.minDate.fMonth.id - 1, year, scope.minDate.fDay.id + 1)
                  } else if (scope.model.fYear.id == scope.maxDate.fYear.id &&
                    scope.model.fMonth.id == scope.maxDate.fMonth.id) {
                    scope.dayData = getDays(scope.maxDate.fMonth.id - 1, year, null, scope.maxDate.fDay.id + 1);
                  } else {
                    scope.dayData = getDays(scope.model.fMonth.id - 1, year);
                  }
                }
              } else if (scope.minDate) {
                if (angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty) {

                  if (scope.model.fYear.id > scope.minDate.fYear.id ||
                    scope.model.fMonth.id > scope.minDate.fMonth.id) {
                    scope.dayData = getDays(scope.model.fMonth.id - 1, year);
                  } else {
                    scope.dayData = getDays(scope.minDate.fMonth.id - 1, year, scope.minDate.fDay.id + 1);
                  }
                }
              } else if (scope.maxDate) {
                if (angular.isObject(scope.maxDate) &&
                  !scope.maxDate.fDay.selectedEmpty &&
                  !scope.maxDate.fMonth.selectedEmpty &&
                  !scope.maxDate.fYear.selectedEmpty) {

                  if (scope.model.fYear.id < scope.maxDate.fYear.id ||
                    scope.model.fMonth.id < scope.maxDate.fMonth.id) {
                    scope.dayData = getDays(scope.model.fMonth.id - 1, year);
                  } else {
                    scope.dayData = getDays(scope.maxDate.fMonth.id - 1, year, null, scope.maxDate.fDay.id + 1);
                  }
                }
              } else {
                scope.dayData = getDays(scope.model.fMonth.id - 1, year);
              }
            }

            scope.onYearChange = function() {
              if (!scope.model.fYear || scope.model.fYear.selectedEmpty) return;

              if (scope.minDate && scope.maxDate) {
                if (angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty &&
                  angular.isObject(scope.maxDate) &&
                  !scope.maxDate.fDay.selectedEmpty &&
                  !scope.maxDate.fMonth.selectedEmpty &&
                  !scope.maxDate.fYear.selectedEmpty) {

                  if (scope.model.fYear.id == scope.minDate.fYear.id &&
                    scope.model.fYear.id == scope.maxDate.fYear.id) {
                    scope.monthData = getMonths(scope.minDate.fMonth.id, scope.maxDate.fMonth.id);
                  } else if (scope.model.fYear.id == scope.minDate.fYear.id) {
                    scope.monthData = getMonths(scope.minDate.fMonth.id)
                  } else if (scope.model.fYear.id == scope.maxDate.fYear.id) {
                    scope.monthData = getMonths(null, scope.maxDate.fMonth.id);
                  } else {
                    scope.monthData = getMonths();
                  }
                }
              } else if (scope.minDate) {
                if (angular.isObject(scope.minDate) &&
                  !scope.minDate.fDay.selectedEmpty &&
                  !scope.minDate.fMonth.selectedEmpty &&
                  !scope.minDate.fYear.selectedEmpty) {

                  if (scope.model.fYear.id > scope.minDate.fYear.id) {
                    scope.monthData = getMonths();
                  } else {
                    scope.monthData = getMonths(scope.minDate.fMonth.id);
                  }
                }
              } else if (scope.maxDate) {
                if (angular.isObject(scope.maxDate) &&
                  !scope.maxDate.fDay.selectedEmpty &&
                  !scope.maxDate.fMonth.selectedEmpty &&
                  !scope.maxDate.fYear.selectedEmpty) {

                  if (scope.model.fYear.id < scope.maxDate.fYear.id) {
                    scope.monthData = getMonths();
                  } else {
                    scope.monthData = getMonths(null, scope.maxDate.fMonth.id);
                  }
                }
              }
            }
          }
        }
      })
      /*######################################
      # DateRangePicker
      ######################################*/
      .directive('mpfDaterangepicker', function($filter) {
        return {
          restrict: 'E',
          replace: true,
          require: '^?ngModel',
          scope: {
            label: '=?',
            model: '=?ngModel',
            format: '=?',
            minDate: '=?',
            maxDate: '=?',
            name: '@?',
            ngDisabled: '=',
            ngRequired: '=?',
            readonly: '<?',
            rangeDate: '=?'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-daterangepicker.html',
          link: function (scope, element, attrs, ngModelCtrl) {
            scope.dateStartIsOpen = false;
            scope.dateEndIsOpen = false;
            scope.startFocused = false;
            scope.endFocused = false;
            scope.readonly === undefined && (scope.readonly = true);
            scope.rangeDate = scope.rangeDate ? scope.rangeDate : 1;
            scope.mask = constants.formats.dateFormatMask;
            scope.pattern = constants.formats.dateFormatRegex;

            scope.dateStartOptions = {
              formatYear: 'yy',
              startingDay: 1,
              showWeeks: false
            };

            scope.dateEndOptions = {
              formatYear: 'yy',
              startingDay: 1,
              showWeeks: false
            };

            if (scope.minDate) {
              scope.dateStartOptions.minDate = scope.minDate.start;
              scope.dateEndOptions.minDate = scope.minDate.end;
            }

            if (scope.maxDate) {
              scope.dateStartOptions.maxDate = scope.maxDate.start;
              scope.dateEndOptions.maxDate = scope.maxDate.end;
            }

            if(scope.model && scope.model[0] !== null){
              scope.modelStartDate = new Date(scope.model[0]);
              scope.modelEndDate = new Date(scope.model[1]);

              var tmpStartDate = angular.copy(scope.modelStartDate);
              var maxEndDate = new Date(tmpStartDate.setMonth(tmpStartDate.getMonth() + scope.rangeDate));
              maxEndDate.setDate(maxEndDate.getDate() - 1);
              var today = new Date();
              scope.dateEndOptions.maxDate = today < maxEndDate ? today : maxEndDate;
              scope.dateEndOptions.minDate = scope.modelStartDate;
            }

            scope.startDateOnOpen = function() {
              scope.dateStartIsOpen = true;
            };

            scope.endDateOnOpen = function() {
              if(scope.modelStartDate) scope.dateEndIsOpen = true;
            };

            scope.dateStartIsEmpty = function() {
              return scope.modelStartDate === undefined;
            };

            scope.dateEndIsEmpty = function() {
              return scope.modelEndDate === undefined;
            };

            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            };

            scope.$watch('model', function(n, o) {
              if (scope.model[0] === null) {
                scope.modelStartDate = undefined;
                if(scope.minDate) scope.dateStartOptions.minDate = scope.minDate.start;
                else scope.dateStartOptions.minDate = null;
                if(scope.maxDate) scope.dateStartOptions.maxDate = scope.maxDate.start;
                else scope.dateStartOptions.maxDate = null;
              }

              if (scope.model[1] === null) {
                scope.modelEndDate = undefined;
                if(scope.minDate) scope.dateEndOptions.minDate = scope.minDate.end;
                else scope.dateEndOptions.minDate = null;
                if(scope.maxDate) scope.dateEndOptions.maxDate = scope.maxDate.end;
                else scope.dateEndOptions.maxDate = null;
              }
            });

            scope._ngChangeStartDate = function() {
              var tmpStartDate = angular.copy(scope.modelStartDate);
              var maxEndDate = new Date(tmpStartDate.setMonth(tmpStartDate.getMonth() + parseInt(scope.rangeDate)));
              maxEndDate.setDate(maxEndDate.getDate() - 1);
              var today = new Date();
              scope.dateEndOptions.maxDate = today < maxEndDate ? today : maxEndDate;
              scope.dateEndOptions.minDate = scope.modelStartDate;
              scope.model[0] = scope.modelStartDate.toISOString();
                scope.modelEndDate = today < maxEndDate ? today : maxEndDate;
                scope.model[1] = scope.modelEndDate.toISOString();
            };

            scope._ngChangeEndDate = function() {
              scope.model[1] = scope.modelEndDate.toISOString();
            };
          }
        };
      })
      /*######################################
      # DatePicker
      ######################################*/
      .directive('mpfDatepicker', function() {
        return {
          restrict: 'E',
          replace: true,
          require: '^?ngModel',
          scope: {
            labelData: '=label',
            model: '=?ngModel',
            format: '=?',
            minDate: '=mindate',
            maxDate: '=maxdate',
            name: '@?',
            ngChange: '&',
            ngDisabled: '=',
            ngRequired: '=?',
            setModelByThisData: '=?',
            parsearToDate: '=?',
            setMinToday: '<?',
            setMaxToday: '<?',
            maxdateAsInit: '=?',
            readonly: '<?',
            nomargin: '=?'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-datepicker.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            scope.readonly === undefined && (scope.readonly = true);
            scope.altInputFormats = ['M!/d!/yyyy'];
            scope.mask = constants.formats.dateFormatMask;
            scope.pattern = constants.formats.dateFormatRegex;
            if (scope.parsearToDate) {
              scope.setModelByThisData && (scope.model = new Date(scope.setModelByThisData));
            }
            scope.isOpen = false;
            scope.onOpen = function() {
              scope.isOpen = true;
            };
            scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1,
              showWeeks: false,
              initDate : new Date()
            };

            var onDestroyMinDateWatch = scope.$watch('minDate', function(value) {
              value && (scope.dateOptions.minDate = value);
            });

            var onDestroyMaxDateWatch = scope.$watch('maxDate', function(value) {
              value && (scope.dateOptions.maxDate = value);
            });

            scope.setMinToday && (scope.dateOptions.minDate = new Date());
            scope.setMaxToday && (scope.dateOptions.maxDate = new Date());
            if (scope.maxDate) {
              scope.dateOptions.maxDate = angular.copy(scope.maxDate)

              if(scope.maxdateAsInit == true){
                scope.dateOptions.initDate = angular.copy(scope.maxDate)
              }
            }
            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            };
            scope._ngchange = function() {
              scope.setModelByThisData = scope.model;
              ngModelCtrl.$setViewValue(scope.model);
            };
            scope.$on('$destroy', function() {
              onDestroyMinDateWatch();
              onDestroyMaxDateWatch();
            });
          }
        };
      })
      .directive('mpfDatepickerHorz', function() {
        return {
          restrict: 'E',
          replace: true,
          require: "^ngModel",
          scope: {
            labelData: '=label',
            model: '=ngModel',
            format: '=',
            minDate: '=mindate',
            maxDate: '=maxdate',
            ngChange: '&',
            ngDisabled: '='
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-datepicker-horz.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            scope.altInputFormats = ['M!/d!/yyyy'];

            scope.mask = constants.formats.dateFormatMask;
            scope.pattern = constants.formats.dateFormatRegex;

            scope.isOpen = false;
            scope.onOpen = function() {
              scope.isOpen = true;
            };
            scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1
            };

            if (scope.minDate) {
              scope.dateOptions.minDate = scope.minDate;
            }
            if (scope.maxDate) {
              scope.dateOptions.maxDate = scope.maxDate = scope.maxDate;
            }
            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            }
            scope._ngchange = function() {
              ngModelCtrl.$setViewValue(scope.model);
            }
          }
        };
      })
      .directive('mAlert', ['serviceAlert', function(serviceAlert) {
        return {
          restrict: 'E',
          scope: {
            options: "=optionsAlert"
          },
          templateUrl: '/scripts/mpf-main-controls/html/m-Alert.html',
          link: function($scope, e, a, c) {

          }
        }
      }])
      .factory('serviceAlert', [function() {

        var fac = {}
        fac.set$scope = function($scope) {
          fac.$scope = $scope;
        }
        fac.types = {
          info: 'info',
          warning: 'warning',
          error: 'error'
        }
        fac.show = function(n, m, t) {

          var propDefault = "optionsAlert";
          var prop, message, type;
          var o = {};

          if (angular.isString(n)) {
            prop = n ? n : propDefault;
            message = m;
            type = t;
          } else if (angular.isObject(n)) {
            prop = n.propName ? n.propName : propDefault;
            message = n.message ? n.message : n;
            type = t ? t : n.type;
          } else if (!n) {
            prop = propDefault;
            message = m;
            type = t;
          }

          fac.$scope[prop] = {
            message: message,
            type: type
          }
        }
        fac.showInfo = function(n, m) {
          fac.show(n, m, fac.types.info);
        }
        fac.showWarning = function(n, m) {
          fac.show(n, m, fac.types.warning);
        }
        fac.showError = function(n, m) {
          fac.show(n, m, fac.types.error);
        }

        return fac;
      }])
      .directive("wizardStairs", function($state, $rootScope, $parse, $timeout) {
        return {
          restrict: 'E',
          scope: {
            stairs: "=",
            currentStep: "=?"
          },
          templateUrl: '/scripts/mpf-main-controls/html/m-WizardStairs.html',
          //link: link
          compile: function(compElemnt, compAttrib) {
            var steping = compAttrib.steping;
            var fn = steping ? $parse(steping) : (function() {
              return false;
            });
            return {
              pre: function() {},
              post: function link(scope, element, attrs, ngModelCtrl) {

                function extend() {

                  var _default = {
                    steps: [],
                    stateName: '.steps',
                    stateParameter: 'step'
                  }
                  if (angular.isArray(scope.stairs)) {
                    scope.localSetting = angular.extend(_default, {
                      steps: scope.stairs
                    });
                  } else if (angular.isObject(scope.stairs)) {
                    scope.localSetting = angular.extend(_default, scope.stairs)
                  }
                }

                function funcBinding() {
                  scope.setStyleOffset = function($first, item) {
                    return $first ? null : {
                      'margin-left': scope.col_offset.toString() + '%'
                    }
                  }

                  scope.setStyleCol = function($first, item) {
                    return {
                      'width': scope.col.toString() + '%'
                    }
                  }

                  scope.getStepNumber = function(item) {
                    return item.step ? item.step : scope.localSetting.steps.indexOf(item) + 1
                  }

                  scope.getStepLine = function(item) {
                    return (item.step ? item.step : scope.localSetting.steps.indexOf(item) + 1)
                  }

                  scope.getSref = function(item) {
                    return item.sref ? item.sref : scope.localSetting.stateName + "({" + scope.localSetting.stateParameter + ":" + scope.getStepNumber(item) + "})";
                  }

                  scope.lines = getLines();
                }
                extend();

                var unit = 1 / 12,
                  unitDec = 10,
                  one = 1,
                  byStep = 2,
                  perc = 100,
                  fixChrome = 0.01;

                var lines = scope.localSetting.steps.length;

                scope.col = ((unit * unitDec) / (lines - one)) * perc;
                scope.col_offset = ((unit * (unitDec - (lines * byStep - byStep))) / (lines - one)) * perc;
                var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                if (isChrome) {
                  scope.col = scope.col - fixChrome
                  scope.col_offset = scope.col_offset - fixChrome
                }

                funcBinding();

                function getLines() {
                  var lines = []
                  for (var x = 0; x < scope.localSetting.steps.length; x++) {
                    if (scope.localSetting.steps[x] && x + 1 < scope.localSetting.steps.length) {
                      lines.push({
                        preview: scope.localSetting.steps[x],
                        next: scope.localSetting.steps[x + 1]
                      });
                    }
                  }
                  return lines;
                }
                $timeout(function() {
                  element.querySelectorAll('a, .g-circle').on('click', function(e) {
                    var elementClickable = angular.element(this);

                    var call = function() {
                      if (!fn(scope.$parent, {
                        $event: e,
                        $stepToGo: elementClickable.attr("step")
                      })) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        return false;
                      }
                    }
                    var r = $rootScope.$$phase ? scope.$evalAsync(call) : scope.$apply(call);
                  });
                })
              }
            }
          }
        }
      })
      .directive("bsLimit", [function() {
        return {
          restrict: "A",
          link: function(scope, elem, attrs) {
            angular.element(elem).on("keypress", function(e) {
              var limit = parseInt(attrs.bsLimit);
              var browse = system.currentBrowser()
              if (this.selectionEnd - this.selectionStart == 0 && this.value.length == limit)
                if (browse != 'Firefox' && e.key !== 'Backspace')
                  e.preventDefault();
            });
          }
        }
      }])
      .directive('uiSelectRequired', function() {
        return {
          require: 'ngModel',
          link: function(scope, element, attr, ctrl) {
            ctrl.$validators.uiSelectRequired = function(modelValue, viewValue) {

              if (attr.uiSelectRequired) {
                var isRequired = scope.$eval(attr.uiSelectRequired)
                if (isRequired == false)
                  return true;
              }
              var determineVal;
              if (angular.isArray(modelValue)) {
                determineVal = modelValue;
              } else if (angular.isArray(viewValue)) {
                determineVal = viewValue;
              } else if (angular.isObject(modelValue)) {
                determineVal = angular.equals(modelValue, {}) ? [] : ['true'];
              } else if (angular.isObject(viewValue)) {
                determineVal = angular.equals(viewValue, {}) ? [] : ['true'];
              } else {
                return false;
              }
              return determineVal.length > 0;
            };
          }
        };
      })
      .directive('templateSeek', function($parse, $compile) {
        return {
          link: function($scope, $element, $attrs, controller, $transclude) {
            if ($transclude) {
              var innerScope = $scope.$new();
              $transclude(innerScope, function(clone) {
                $element.empty();
                $element.append(clone);
                $element.on('$destroy', function() {
                  innerScope.$destroy();
                });
              });
            }
          }
        };
      })
      /*######################################
      # Data Seeker Placeholder
      ######################################*/
      .directive('mpfDataSeekerPlaceholder',
        ['$parse', '$interpolate', '$timeout', '$q', '$injector', '$filter',
        function($parse, $interpolate, $timeout, $q, $injector, $filter) {
          return {
            restrict: 'EA',
            require: '^ngModel',
            transclude: true,
            templateUrl: '/scripts/mpf-main-controls/html/data-seeker-placeholder.html',
            scope: {
              ngModel: "=",
              isHorz: "=?",
              ngDisabled: '='
            },
            compile: function(cElement, cAttrs, ctrl, trans) {

              function extend(layout) {
                var _default = {
                  label: "",
                  placeholder: "Busque o seleccione un elemento ...",
                  matchField: null,
                  enableDataCamelCase: true,
                  lenSearching: 2
                }

                if (angular.isString(layout)) {
                  var items = layout.split('.')
                  if (items.length >= 2) {
                    var constantName = items[0];

                    statements = items.splice(1, items.length - 1).join(".");

                    var constant = $injector.get(constantName);

                    return angular.extend(_default, angular.fromJson($interpolate("{{" + statements + "}}")(constant)));
                  }
                }
                if (angular.isObject(layout))
                  return angular.extend(_default, layout);
              }

              return {

                post: function(scope, element, attrs, ngModelCtrl, $transclude) {

                  var fnbehavior = $parse(attrs.behavior)
                  var typeData = undefined;
                  var fndatasource = $parse(attrs.mDataSource)

                  scope.behavior = extend(fnbehavior(scope.$parent, {}));

                  scope.changeModel = function(v) {
                    if (ngModelCtrl) ngModelCtrl.$setViewValue(scope.$$childHead.ngModel)
                  }
                  scope.getName = function() {
                    return attrs.name;
                  }

                  scope.$watch('ngModel', function(val) {
                    if (!val) {
                      //clean selection
                      if (scope.$$childHead.$select)
                        scope.$$childHead.$select.selected = void(0);
                    }
                  });

                  var seed = undefined;
                  var loading = false;

                  function isPromise(promise) {
                    return angular.isObject(promise) && angular.isFunction(promise.then) && angular.isObject(promise.$$state);
                  }

                  function getData(d, prop) {
                    for (var name in d) {
                      if (name.toLowerCase() == prop.toLowerCase())
                        return d[name];
                    }
                    return undefined;
                  }

                  function _showLoading(value) {
                    loading = value;
                    $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
                  }

                  function resolveData(input) {
                    function showLoading(value) {
                      loading = value;
                      $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
                    }

                    promise = null;
                    var data = fndatasource(scope.$parent, {
                      $inputNeed: input
                    });
                    if (data) {
                      if (angular.isArray(data)) {
                        var vData = $filter('filter')(data, input);
                        scope.data = vData;
                        typeData = 'Array';
                        loading = false;
                        _showLoading(false);
                      } else if (isPromise(data)) {
                        promise = data
                        typeData = 'Promise';

                      } else if (angular.isObject(data)) {
                        typeData = 'Promise';

                        var inventory = data.moduleName ? $injector([data.moduleName]) : $injector;

                        var factory = inventory.get(data.factoryName)

                        promise = factory[data.methodName](input)
                      } else if (angular.isString(data)) {
                        typeData = 'Promise';
                        var items = data.split('.')
                        if (items.length >= 2) {
                          methodName = items[items.length - 1]
                          factoryName = items.splice(0, items.length - 1).join('.');
                          var factory = $injector.get(factoryName);
                          promise = factory[methodName](input)
                        }

                      } else if (angular.isFunction(data)) {
                        promise = data(input);
                      }

                      if (promise) {

                        showLoading(true);

                        $q.when(promise,
                          function success(response) {
                            scope.data = helper.clone(getData(response, 'data'), scope.behavior.enableDataCamelCase) || response;
                            showLoading(false);

                          },
                          function error(response) {
                            showLoading(false);
                          },
                          function _finally(response) {
                            showLoading(false);
                          });
                      }
                    }else{
                      _showLoading(false);
                    }
                  }

                  function cancelSearch() {
                    if (seed) $timeout.cancel(seed);
                    scope.data = [];
                    loading = false;
                    seed = undefined;
                    _showLoading(false);
                  }

                  scope.search = function(wilcar) {
                    if (wilcar && wilcar.length >= scope.behavior.lenSearching) {
                      if (seed) cancelSearch();
                      _showLoading(true);
                      seed = $timeout(function() {
                        resolveData(wilcar);
                      }, 500);
                    } else {
                      cancelSearch();
                    }
                  }
                  $timeout(function() {
                    $(element).find('.ui-select-match').click(function() {
                      var $this = this
                      $timeout(function() {
                        $('input[type=search]', element).focus();
                      }, 200);

                    })
                  }, 1000)

                  scope.getDisabled = function() {
                    return !!scope.ngDisabled;
                  }

                  scope.isEmpty = function() {
                    var noHasModelData = (scope.ngModel === undefined || scope.ngModel === null || scope.ngModel[scope.valueField] === null);
                    return noHasModelData;
                  };

                  scope.cleanData = function() {
                    scope.ngModel = null;
                  }

                }
              }
            }
          }
      }])
      /*######################################
      # Data Seeker x
      ######################################*/
      .directive('mpfDataSeekerX',
        ['$parse', '$interpolate', '$timeout', '$q', '$injector', '$filter',
          function ($parse, $interpolate, $timeout, $q, $injector, $filter) {
          return {
            restrict: 'EA',
            require: '^ngModel',
            transclude: true,
              templateUrl: '/scripts/mpf-main-controls/html/data-seeker-x.html',
            scope: {
              ngModel: "=",
              isHorz: "=?",
              ngDisabled: '='
            },
              compile: function (cElement, cAttrs, ctrl, trans) {

              function extend(layout) {
                var _default = {
                  label: "",
                  required: false,
                  placeholder: "Busque o seleccione un elemento ...",
                  matchField: null,
                  enableDataCamelCase: true,
                  lenSearching: 2
                }

                if (angular.isString(layout)) {
                  var items = layout.split('.')
                  if (items.length >= 2) {
                    var constantName = items[0];

                    statements = items.splice(1, items.length - 1).join(".");

                    var constant = $injector.get(constantName);

                    return angular.extend(_default, angular.fromJson($interpolate("{{" + statements + "}}")(constant)));
                  }
                }
                if (angular.isObject(layout))
                  return angular.extend(_default, layout);
              }

              return {

                  post: function (scope, element, attrs, ngModelCtrl, $transclude) {

                  var fnbehavior = $parse(attrs.behavior)
                  var typeData = undefined;
                  var fndatasource = $parse(attrs.mDataSource)

                  scope.behavior = extend(fnbehavior(scope.$parent, {}));

                    scope.changeModel = function (v) {
                    if (ngModelCtrl) ngModelCtrl.$setViewValue(scope.$$childHead.ngModel)
                  }
                    scope.getName = function () {
                    return attrs.name;
                  }

                    scope.$watch('ngModel', function (val) {
                    if (!val) {
                      //clean selection
                      if (scope.$$childHead.$select)
                          scope.$$childHead.$select.selected = void (0);
                    }
                  });

                  var seed = undefined;
                  var loading = false;

                  function isPromise(promise) {
                    return angular.isObject(promise) && angular.isFunction(promise.then) && angular.isObject(promise.$$state);
                  }

                  function getData(d, prop) {
                    for (var name in d) {
                      if (name.toLowerCase() == prop.toLowerCase())
                        return d[name];
                    }
                    return undefined;
                  }

                  function _showLoading(value) {
                    loading = value;
                    $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
                  }

                  function resolveData(input) {
                    function showLoading(value) {
                      loading = value;
                      $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
                    }

                    promise = null;
                    var data = fndatasource(scope.$parent, {
                      $inputNeed: input
                    });
                    if (data) {
                      if (angular.isArray(data)) {
                        var vData = $filter('filter')(data, input);
                        scope.data = vData;
                        typeData = 'Array';
                        loading = false;
                        _showLoading(false);
                      } else if (isPromise(data)) {
                        promise = data
                        typeData = 'Promise';

                      } else if (angular.isObject(data)) {
                        typeData = 'Promise';

                        var inventory = data.moduleName ? $injector([data.moduleName]) : $injector;

                        var factory = inventory.get(data.factoryName)

                        promise = factory[data.methodName](input)
                      } else if (angular.isString(data)) {
                        typeData = 'Promise';
                        var items = data.split('.')
                        if (items.length >= 2) {
                          methodName = items[items.length - 1]
                          factoryName = items.splice(0, items.length - 1).join('.');
                          var factory = $injector.get(factoryName);
                          promise = factory[methodName](input)
                        }

                      } else if (angular.isFunction(data)) {
                        promise = data(input);
                      }

                      if (promise) {

                        showLoading(true);

                        $q.when(promise,
                          function success(response) {
                            scope.data = helper.clone(getData(response, 'data'), scope.behavior.enableDataCamelCase) || response;
                            showLoading(false);

                          },
                          function error(response) {
                            showLoading(false);
                          },
                          function _finally(response) {
                            showLoading(false);
                          });
                      }
                      } else {
                      _showLoading(false);
                    }
                  }

                  function cancelSearch() {
                    if (seed) $timeout.cancel(seed);
                    scope.data = [];
                    loading = false;
                    seed = undefined;
                    _showLoading(false);
                  }

                    scope.search = function (wilcar) {
                    if (wilcar && wilcar.length >= scope.behavior.lenSearching) {
                      if (seed) cancelSearch();
                      _showLoading(true);
                        seed = $timeout(function () {
                        resolveData(wilcar);
                      }, 500);
                    } else {
                      cancelSearch();
                    }
                  }
                    $timeout(function () {
                      $(element).find('.ui-select-match').click(function () {
                      var $this = this
                        $timeout(function () {
                        $('input[type=search]', element).focus();
                      }, 200);

                    })
                  }, 1000)

                    scope.getDisabled = function () {
                    return !!scope.ngDisabled;
                  }

                    scope.isEmpty = function () {
                      var noHasModelData = (scope.ngModel === undefined || scope.ngModel === null || scope.ngModel[scope.valueField] === null);
                      return noHasModelData;
                    };

                    // scope.cleanData = function () {
                    //   scope.ngModel = null;
                    // }

                }
              }
            }
          }
      }])
      .directive('mpDataSeeker',
        ['$parse', '$interpolate', '$timeout', '$q', '$injector', '$filter',
        function($parse, $interpolate, $timeout, $q, $injector, $filter) {
        return {
          restrict: 'EA',
          require: '^ngModel',
          transclude: true,
            templateUrl: '/scripts/mpf-main-controls/html/data-seeker.html',
          scope: {
              ngModel: "=",
              isHorz: "=?",
              ngDisabled: '=',
              ngChangeText: '='
          },
          compile: function(cElement, cAttrs, ctrl, trans) {

            function extend(layout) {
              var _default = {
                label: "",
                placeholder: "Busque o seleccione un elemento ...",
                matchField: null,
                enableDataCamelCase: true,
                lenSearching: 2
              }

              if (angular.isString(layout)) {
                var items = layout.split('.')
                if (items.length >= 2) {
                  var constantName = items[0];

                  statements = items.splice(1, items.length - 1).join(".");

                  var constant = $injector.get(constantName);

                  return angular.extend(_default, angular.fromJson($interpolate("{{" + statements + "}}")(constant)));
                }
              }
              if (angular.isObject(layout))
                return angular.extend(_default, layout);
            }

            return {

              post: function(scope, element, attrs, ngModelCtrl, $transclude) {


                var fnbehavior = $parse(attrs.behavior)
                var typeData = undefined;
                var fndatasource = $parse(attrs.mDataSource)

                scope.behavior = extend(fnbehavior(scope.$parent, {}));

                scope.changeModel = function(v) {
                  if (ngModelCtrl) ngModelCtrl.$setViewValue(scope.$$childHead.ngModel)
                }
                scope.getName = function() {
                  return attrs.name;
                }

                scope.$watch('ngModel', function(val) {
                  if (!val) {
                    //clean selection
                      if (scope.$$childHead.$select) {
                    scope.$$childHead.$select.selected = void(0);
                  }
                  } else {
                    if (scope.$$childHead.$select) {
                      scope.$$childHead.$select.selected = val;
                    }
                  }
                });

                var seed = undefined;
                var loading = false;

                function isPromise(promise) {
                  return angular.isObject(promise) && angular.isFunction(promise.then) && angular.isObject(promise.$$state);
                }

                function getData(d, prop) {
                  for (var name in d) {
                    if (name.toLowerCase() == prop.toLowerCase())
                      return d[name];
                  }
                  return undefined;
                }

                  function _showLoading(value) {
                    loading = value;
                    $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
                  }

                function resolveData(input) {
                  function showLoading(value) {
                    loading = value;
                    $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
                  }

                  promise = null;
                    var data = fndatasource(scope.$parent, {
                      $inputNeed: input
                    });
                  if (data) {
                    if (angular.isArray(data)) {
                        var vData = $filter('filter')(data, input);
                        scope.data = vData;
                      typeData = 'Array';
                      loading = false;
                        _showLoading(false);
                    } else if (isPromise(data)) {
                      promise = data
                      typeData = 'Promise';

                    } else if (angular.isObject(data)) {
                      typeData = 'Promise';

                      var inventory = data.moduleName ? $injector([data.moduleName]) : $injector;

                      var factory = inventory.get(data.factoryName)

                      promise = factory[data.methodName](input)
                    } else if (angular.isString(data)) {
                      typeData = 'Promise';
                      var items = data.split('.')
                      if (items.length >= 2) {
                        methodName = items[items.length - 1]
                        factoryName = items.splice(0, items.length - 1).join('.');
                        var factory = $injector.get(factoryName);
                        promise = factory[methodName](input)
                      }

                    } else if (angular.isFunction(data)) {
                      promise = data(input);
                    }

                    if (promise) {

                      showLoading(true);

                      $q.when(promise,
                        function success(response) {
                          scope.data = helper.clone(getData(response, 'data'), scope.behavior.enableDataCamelCase) || response;
                          showLoading(false);

                        },
                        function error(response) {
                          showLoading(false);
                        },
                        function _finally(response) {
                          showLoading(false);
                        });
                    }
                    }else{
                      _showLoading(false);
                  }
                }

                function cancelSearch() {
                  if (seed) $timeout.cancel(seed);
                  scope.data = [];
                  loading = false;
                  seed = undefined;
                    _showLoading(false);
                }

                scope.search = function(wilcar) {
                  if (scope.ngChangeText) scope.ngChangeText(wilcar, searchSetup, cancelSearch);
                  else if (wilcar && wilcar.length >= scope.behavior.lenSearching) {
                    searchSetup(wilcar);
                    } else {
                      cancelSearch();
                    }
                }
                
                function searchSetup(wilcar){
                    if (seed) cancelSearch();
                      _showLoading(true);
                    seed = $timeout(function() {
                      resolveData(wilcar);
                    }, 500);
                }

                $timeout(function() {
                  $(element).find('.ui-select-match').click(function() {
                    var $this = this
                    $timeout(function() {
                      $('input[type=search]', element).focus();
                    }, 200);

                  })
                }, 1000)

                  scope.getDisabled = function() {
                    return !!scope.ngDisabled;
                  }

              }
            }
          }
        }
      }])
      .directive('mpDataSeekerHorz', ['$parse', '$interpolate', '$timeout', '$q', '$injector', function($parse, $interpolate, $timeout, $q, $injector) {
              return {
          restrict: 'EA',
          require: '^ngModel',
          transclude: true,
          templateUrl: '/scripts/mpf-main-controls/html/data-seeker-horz.html',
          scope: {
            ngModel: "="
          },
          compile: function(cElement, cAttrs, ctrl, trans) {
            function extend(layout) {
              var _default = {
                label: "",
                placeholder: "Busque o seleccione un elemento ...",
                matchField: null,
                enableDataCamelCase: true,
                lenSearching: 2
              }

              if (angular.isString(layout)) {
                var items = layout.split('.')
                if (items.length >= 2) {
                  var constantName = items[0];

                  statements = items.splice(1, items.length - 1).join(".");

                  var constant = $injector.get(constantName);

                  return angular.extend(_default, angular.fromJson($interpolate("{{" + statements + "}}")(constant)));
            }
            }
              if (angular.isObject(layout))
                return angular.extend(_default, layout);
          }

            return {

              post: function(scope, element, attrs, ngModelCtrl, $transclude) {


                var fnbehavior = $parse(attrs.behavior)
                var typeData = undefined;
                var fndatasource = $parse(attrs.mDataSource)

                scope.behavior = extend(fnbehavior(scope.$parent, {}));


                scope.changeModel = function(v) {
                  if (ngModelCtrl) ngModelCtrl.$setViewValue(scope.$$childHead.ngModel)
            }
                scope.getName = function() {
                  return attrs.name;
          }

                scope.$watch('ngModel', function(val) {
                  if (!val) {
                    //clean selection
                    scope.$$childHead.$select.selected = void(0);
              }
          });

                var seed = undefined;
                var loading = false;

                function isPromise(promise) {
                  return angular.isObject(promise) && angular.isFunction(promise.then) && angular.isObject(promise.$$state);
                }

                function getData(d, prop) {
                  for (var name in d) {
                    if (name.toLowerCase() == prop.toLowerCase())
                      return d[name];
                }
                  return undefined;
              }

                function resolveData(input) {
                  function showLoading(value) {
                    loading = value;
                    $('input.ui-select-search', element)[loading ? 'addClass' : 'removeClass']('select2-active');
              }

                  promise = null;
                  var data = fndatasource(scope.$parent, { $inputNeed: input });
                  if (data) {
                    if (angular.isArray(data)) {
                      scope.data = data;
                      typeData = 'Array';
                      loading = false;
                    } else if (isPromise(data)) {
                      promise = data
                      typeData = 'Promise';

                    } else if (angular.isObject(data)) {
                      typeData = 'Promise';

                      var inventory = data.moduleName ? $injector([data.moduleName]) : $injector;

                      var factory = inventory.get(data.factoryName)

                      promise = factory[data.methodName](input)
                    } else if (angular.isString(data)) {
                      typeData = 'Promise';
                      var items = data.split('.')
                      if (items.length >= 2) {
                        methodName = items[items.length - 1]
                        factoryName = items.splice(0, items.length - 1).join('.');
                        var factory = $injector.get(factoryName);
                        promise = factory[methodName](input)
              }

                    } else if (angular.isFunction(data)) {
                      promise = data(input);
            }

                    if (promise) {

                      showLoading(true);

                      $q.when(promise,
                        function success(response) {
                          scope.data = helper.clone(getData(response, 'data'), scope.behavior.enableDataCamelCase) || response;
                          showLoading(false);

                        },
                        function error(response) {
                          showLoading(false);
                        },
                        function _finally(response) {
                          showLoading(false);
                        });
                    }
                  }
                }

                function cancelSearch() {
                  if (seed) $timeout.cancel(seed);
                  scope.data = [];
                  loading = false;
                  seed = undefined;
            }
                scope.search = function(wilcar) {
                  if (wilcar && wilcar.length >= scope.behavior.lenSearching) {
                    if (seed) cancelSearch();
                    seed = $timeout(function() {
                      resolveData(wilcar);
                    }, 500);
                  } else cancelSearch();
            }
                $timeout(function() {
                  $(element).find('.ui-select-match').click(function() {
                    var $this = this
                    $timeout(function() {
                      $('input[type=search]', element).focus();
                    }, 200);

                  })
                }, 1000)

              }
            }
          }
        }
      }])
      .factory('truncatorInputFactory', function() {
        return function(input, target, handlerTrunck) {
          function promiseValue(domInput, insertValue) {
            if ('selectionStart' in domInput && 'selectionEnd' in domInput) {
              var lValue = domInput.value.substring(0, domInput.selectionStart)
              var rValue = domInput.value.substring(domInput.selectionEnd, domInput.value.length)
              return {
                value: lValue + insertValue + rValue,
                support: true
              }
            }
            return {
              value: insertValue,
              support: false
            }
          }

          function handler($e, value) {
            /*var r = promiseValue(this, value);
            var evaluation = target(r.value)
            var valid =  r.support && (target(r.value))
            if (r.support && (target(r.value))) {
                $e.preventDefault();
                handlerTrunck
            }*/
            var r = promiseValue(this, value);
            var evaluation = target(r.value)
            var valid = r.support && evaluation
            if (valid) {
              $e.preventDefault();
            }
            if (angular.isFunction(handlerTrunck)) {
              handlerTrunck({
                isSuccess: !evaluation,
                isSupported: r.support,
                value: r.value
              })
            }
          }

          function handlerPaste($e) {
            var clipboard = $e.clipboardData || ($e.originalEvent && $e.originalEvent.clipboardData ? $e.originalEvent.clipboardData : window.clipboardData)
            var argument = system.currentBrowser() === 'IE' ? 'text' : 'text/plain'
            var value = clipboard.getData(argument)
            handler.call(this, $e, value)
            }

          function getContition() {
            var browse = system.currentBrowser()

            function _default($e) {

              var altGr = browse == 'IE' ? $e.altKey && $e.ctrlKey : false
              $e.key = $e.key || $e.char || String.fromCharCode($e.keyCode || $e.keyCode || $e.charCode);
              return $e.key !== 'Backspace' &&
                $e.key !== 'ArrowLeft' &&
                $e.key !== 'Tab' &&
                $e.key !== 'ArrowRight' &&
                (!$e.ctrlKey || altGr) &&
                !($e.shiftKey && $e.key === 'Insert');
            }
            var conditions = {
              Chrome: function($e) {
                var altGr = $e.altKey && $e.ctrlKey
                $e.key = $e.key || $e.char || String.fromCharCode($e.keyCode || $e.keyCode || $e.charCode);
                return (!$e.ctrlKey || altGr) && (!$e.shiftKey || ($e.keyCode != 9 && $e.keyCode != 8));
              },
              Safari: function($e) {
                return _default($e)
              }

            }
            return conditions[browse] || _default;
          }

          function handlerKey($e) {
            var action = getContition();
            if (action($e))
              handler.call(this, $e, $e.key)
            else {
              if (angular.isFunction(handlerTrunck)) {
                handlerTrunck({
                  isSuccess: true,
                  value: $e.srcElement ? $e.srcElement.value : undefined
                });
              }
            }
            }
          input.on('paste', handlerPaste);
          input.on('keypress', handlerKey);

          input.on('keydown', function($e) {
            if ($e.key === 'Backspace')
              if (angular.isFunction(handlerTrunck)) {
                handlerTrunck({
                  isSuccess: true,
                  value: $e.srcElement ? $e.srcElement.value : undefined
                });
              }
              });

          if (navigator.platform == 'MacIntel') {
            input.on('keydown', function($e) {

              var $this = this;

              function cln() {
                while ($this.value.indexOf("'") != -1 ||
                $this.value.indexOf("˜") != -1 ||
                $this.value.indexOf("`") != -1 ||
                $this.value.indexOf("^") != -1 ||
                $this.value.indexOf("ˆ") != -1 ||
                $this.value.indexOf("\"") != -1) {
                  $this.value = $this.value.replace("'", "")
                  $this.value = $this.value.replace("˜", "")
                  $this.value = $this.value.replace("`", "")
                  $this.value = $this.value.replace("^", "")
                  $this.value = $this.value.replace("ˆ", "")
                  $this.value = $this.value.replace("\"", "")
                }
              }
              if ($e.key == 'Dead') { //|| $e.keyCode==16){

                console.log("dirting")
                this.isDirty = true;
                cln();
                window.setTimeout(cln, 1);
              } else if (this.isDirty && $e.keyCode == 229) {
                var $this = this;
              window.setTimeout(function() {
                  $this.value = $this.value.replace($e.key, "");
                }, 1);
                cln();
                window.setTimeout(cln, 1);
              }
            });
          }
                }
              })
      .directive('mNumericTextbox', function($parse, $timeout, mFuncRange, truncatorInputFactory) {
        var defaults = {
          default: {
            decimalSeparator: '.',
            millarSeparator: ',',
            millonSeparator: "'",
            precision: 16,
            scale: 2
          },
          int: {
            code: 'INT',
            scale: 0,
          },
          short: {
            code: 'SHORT',
            scale: 0,
            precision: 7,
            max: 34562
          },
          currencyPE: {
            code: 1,
            simbol: {
              value: 'S/ ',
              align: 'left'
            }
          },
          currencyUS: {
            code: 2,
            simbol: {
              value: '$ ',
              align: 'left'
            }
          },
          percent: {
            code: '%',
            scale: 4,
            simbol: {
              value: ' %',
              align: 'rigth'
              }
                }
              }
        return {
          require: '^ngModel',
          restrict: 'E',
          templateUrl: function(elem, attr) {

            if (!attr.label) {
              if (!attr.warpControl) {
                return '/scripts/mpf-main-controls/html/m-NumericTexboxUw.html'
              }
              return '/scripts/mpf-main-controls/html/m-NumericTexboxW.html'
            }
            return '/scripts/mpf-main-controls/html/m-NumericTexbox.html'
          },
          scope: {
            ngModel: "=",
            labelData: "=label",
            toolTipTruncked: "="
          },
          link: function(scope, element, attr, ctrl) {
            scope.popoverOpen = false;
            if (attr.class)
              element.find('div').addClass(attr.class);

            var fn = $parse(attr.options);

            function buildOptions() {
              var exOptions = fn(scope.$parent, {});

              if (angular.isString(exOptions) || angular.isNumber(exOptions)) {
                var o;
                angular.forEach(defaults, function(item) {
                  if (item.code == exOptions) o = item;
            });
                return angular.extend({}, defaults.default, o);
              }
              return angular.extend({}, defaults.default, exOptions);
            }


            var isDecimal, lengthInt, reg, regnumber, options;

            function disabled() {

              if (attr.ngDisabled)

                return $parse(attr.ngDisabled)(scope.$parent, {})

              return false

            }
            scope.isDisabled = disabled;

            function updateSetting() {
              options = buildOptions();
              isDecimal = options.scale > 0;
              lengthInt = options.precision - options.scale;
              reg = isDecimal ? "^(\\d{1," + lengthInt + "}(\\" + options.decimalSeparator + "\\d{0," + options.scale + "}){0,1})$" : "^(\\d{1," + lengthInt + "})$";
              regnumber = new RegExp(reg, 'i');
            }
            updateSetting();
            scope.$watch('ngModel', function() {
              inputPlace.val(valueFormat());
            })
            scope.$watch(function() {
              return fn(scope.$parent, {});
            }, function(newValue) {
              updateSetting();
              inputPlace.val(valueFormat());
            });
            var seed = null
            scope.changing = function() {
              var value = !scope.ngModel && scope.ngModel != 0 ? null : scope.ngModel;
              if (/(\.0*)$/.test(value))
                ctrl.$setViewValue(value);
              else
                ctrl.$setViewValue(parseFloat(value));
              //scope.ngModel = value
            }
            var input = $('input[ng-model]', element);
            var inputPlace = $('input[placeholder]', element);



            function validate(value) {

              var val = $parse(attr.mRange)(scope.$parent, {});
              return (val !== undefined || val !== null || val !== "") && mFuncRange.validateMax(val, value)
          }

            $(input).change(function($e) {
              var fn = $parse(attr.domChange)
              fn(scope.$parent, {
                $event: $e
              });
      })

            var truncator = new truncatorInputFactory(input, function(value) {
              //Se agrego para aceptar el punto del teclado numerico en IE11
              var vBrowser = system.currentBrowser();
              if (vBrowser == 'IE' && isDecimal) value = value.replace('Del', '.');
              //
              return (!validate(value) || !regnumber.test(value));
            }, function truncked(args) {
              var fn = $parse(attr.mTruncked);
              fn(scope.$parent, {
                $args: args
              })
              window.setTimeout(function() {
                if (scope.toolTipTruncked) {
                  scope.popoverOpen = !args.isSuccess;
                  scope.$parent.$apply();
                  scope.$apply();
                }

            })
              scope.$parent.$apply();
            });

            function valueFormat() {
              if (scope.ngModel === undefined || scope.ngModel === null || scope.ngModel.length === 0) return "";
              var value = ""
              var items = (angular.isNumber(scope.ngModel) && !isNaN(scope.ngModel) ? scope.ngModel.toString() : ((isNaN(scope.ngModel) ? "" : scope.ngModel) || "")).split(options.decimalSeparator);
              var intValue = items[0];
              var millar = ""
              var countM = 0;
              for (var x = intValue.length - 1; x >= 0; x--) {
                millar = intValue[x] + millar;
                if (millar.length === 3 && x - 1 !== -1) {
                  if (countM == 1) value = (options.millonSeparator || options.millarSeparator) + millar + value
                  else value = options.millarSeparator + millar + value
                  millar = "";
                  countM++;
                } else if (x - 1 === -1)
                  value = millar + value
              }

              if (isDecimal) {
                value = (value.length == 0 ? "0" : value);

                var opt = buildOptions();
                var notJoin = opt.sinCeros;

                if(!notJoin){
                  if (items.length >= 2) value = value + options.decimalSeparator + items[1] + Array((options.scale + 1) - items[1].length).join('0');
                  else value = value + options.decimalSeparator + Array(options.scale + 1).join('0');
                }else{
                  if (items.length >= 2) value = value + options.decimalSeparator + items[1];
                  else value = value;// + options.decimalSeparator + Array(options.scale + 1);
                }
              }
              if (angular.isObject(options.simbol)) {
                if (options.simbol.align === 'left') value = options.simbol.value + value;
                if (options.simbol.align === 'rigth') value = value + options.simbol.value;
              }
              return value;
            }


            function c(event) {
              ctrl.$pristine = false;
            }
            element.find('input').on('keypress', c);
            element.find('input').on('focus', c);

            input.on('click', function(e) {
              e.preventDefault();
            });
            inputPlace.on('click', function(e) {
              e.preventDefault();
              });
            input.on('blur', function($event) {
              modeEdit(false);
              scope.popoverOpen = false;
              var val = parseFloat(scope.ngModel)
              ctrl.$setViewValue(isNaN(val) ? scope.ngModel : val);
            });
            inputPlace.on('focus', function($event) {
              modeEdit(true);
            });

            function modeEdit(value) {
              inputPlace.css({
                display: value ? 'none' : 'inline'
              });
              input.css({
                display: value ? 'inline' : 'none'
            });
              if (value) input.focus();
              else inputPlace.val(valueFormat());
              scope.focused = value
              scope.$apply('focused');
              }


                }
              }
      })
      .directive('mNumericTextboxHorz', function($parse, $timeout, mFuncRange, truncatorInputFactory) {
        var defaults = {
          default: {
            decimalSeparator: '.',
            millarSeparator: ',',
            millonSeparator: "'",
            precision: 16,
            scale: 2
          },
          int: {
            code: 'INT',
            scale: 0,
          },
          short: {
            code: 'SHORT',
            scale: 0,
            precision: 7,
            max: 34562
          },
          currencyPE: {
            code: 1,
            simbol: {
              value: 'S/. ',
              align: 'left'
            }
          },
          currencyUS: {
            code: 2,
            simbol: {
              value: '$ ',
              align: 'left'
            }
          },
          percent: {
            code: '%',
            scale: 4,
            simbol: {
              value: ' %',
              align: 'rigth'
            }
              }
            }
        return {
          require: '^ngModel',
          restrict: 'E',
          templateUrl: '/scripts/mpf-main-controls/html/m-NumericTexbox-horz.html',
          scope: {
            ngModel: "=",
            labelData: "=label",
            toolTipTruncked: "="
          },
          link: function(scope, element, attr, ctrl) {
            scope.popoverOpen = false;
            if (attr.class)
              element.find('div').addClass(attr.class);

            var fn = $parse(attr.options);

            function buildOptions() {
              var exOptions = fn(scope.$parent, {});

              if (angular.isString(exOptions) || angular.isNumber(exOptions)) {
                var o;
                angular.forEach(defaults, function(item) {
                  if (item.code == exOptions) o = item;
                });
                return angular.extend({}, defaults.default, o);
              }
              return angular.extend({}, defaults.default, exOptions);
            }


            var isDecimal, lengthInt, reg, regnumber, options;

            function disabled() {

              if (attr.ngDisabled)

                return $parse(attr.ngDisabled)(scope.$parent, {})

              return false

            }
            scope.isDisabled = disabled;

            function updateSetting() {
              options = buildOptions();
              isDecimal = options.scale > 0;
              lengthInt = options.precision - options.scale;
              reg = isDecimal ? "^(\\d{1," + lengthInt + "}(\\" + options.decimalSeparator + "\\d{0," + options.scale + "}){0,1})$" : "^(\\d{1," + lengthInt + "})$";
              regnumber = new RegExp(reg);
            }
            updateSetting();
            scope.$watch('ngModel', function() {
              inputPlace.val(valueFormat());
            })
            scope.$watch(function() {
              return fn(scope.$parent, {});
            }, function(newValue) {
              updateSetting();
              inputPlace.val(valueFormat());
            });
            var seed = null
            scope.changing = function() {
              var value = !scope.ngModel && scope.ngModel != 0 ? null : scope.ngModel;
              if (/(\.0*)$/.test(value))
                ctrl.$setViewValue(value);
              else
                ctrl.$setViewValue(parseFloat(value));
              //scope.ngModel = value
            }
            var input = $('input[ng-model]', element);
            var inputPlace = $('input[placeholder]', element);



            function validate(value) {

              var val = $parse(attr.mRange)(scope.$parent, {});
              return (val !== undefined || val !== null || val !== "") && mFuncRange.validateMax(val, value)
            }

            $(input).change(function($e) {
              var fn = $parse(attr.domChange)
              fn(scope.$parent, {
                $event: $e
            });
            })

            var truncator = new truncatorInputFactory(input, function(value) {
              return (!validate(value) || !regnumber.test(value))
            }, function truncked(args) {
              var fn = $parse(attr.mTruncked);
              fn(scope.$parent, {
                $args: args
      })
              window.setTimeout(function() {
                if (scope.toolTipTruncked) {
                  scope.popoverOpen = !args.isSuccess;
                  scope.$parent.$apply();
                  scope.$apply();
                }

              })
              scope.$parent.$apply();
            });

            function valueFormat() {
              if (scope.ngModel === undefined || scope.ngModel === null || scope.ngModel.length === 0) return "";
              var value = ""
              var items = (angular.isNumber(scope.ngModel) && !isNaN(scope.ngModel) ? scope.ngModel.toString() : ((isNaN(scope.ngModel) ? "" : scope.ngModel) || "")).split(options.decimalSeparator);
              var intValue = items[0];
              var millar = ""
              var countM = 0;
              for (var x = intValue.length - 1; x >= 0; x--) {
                millar = intValue[x] + millar;
                if (millar.length === 3 && x - 1 !== -1) {
                  if (countM == 1) value = (options.millonSeparator || options.millarSeparator) + millar + value
                  else value = options.millarSeparator + millar + value
                  millar = "";
                  countM++;
                } else if (x - 1 === -1)
                  value = millar + value
              }

              if (isDecimal) {
                value = (value.length == 0 ? "0" : value);

                var opt = buildOptions();
                var notJoin = opt.sinCeros;

                if(!notJoin){
                  if (items.length >= 2) value = value + options.decimalSeparator + items[1] + Array((options.scale + 1) - items[1].length).join('0');
                  else value = value + options.decimalSeparator + Array(options.scale + 1).join('0');
                }else{
                  if (items.length >= 2) value = value + options.decimalSeparator + items[1];
                  else value = value;// + options.decimalSeparator + Array(options.scale + 1);
            }
          }
              if (angular.isObject(options.simbol)) {
                if (options.simbol.align === 'left') value = options.simbol.value + value;
                if (options.simbol.align === 'rigth') value = value + options.simbol.value;
              }
              return value;
        }


            input.on('change', function() {
              ctrl.$pristine = false;
      })
            input.on('click', function(e) {
              e.preventDefault();
            });
            inputPlace.on('click', function(e) {
              e.preventDefault();
            });
            input.on('blur', function($event) {
              modeEdit(false);
              scope.popoverOpen = false;
              var val = parseFloat(scope.ngModel)
              ctrl.$setViewValue(isNaN(val) ? scope.ngModel : val);
            });
            inputPlace.on('focus', function($event) {
              modeEdit(true);
            });

            function modeEdit(value) {
              inputPlace.css({
                display: value ? 'none' : 'inline'
              });
              input.css({
                display: value ? 'inline' : 'none'
              });
              if (value) input.focus();
              else inputPlace.val(valueFormat());
              scope.focused = value
              $timeout(function(){
                scope.$apply('focused');
              }, 1);
        }
          }
        }
          })
      .directive('mMax', function($parse) {
        return {
          require: 'ngModel',
          link: function(scope, element, attr, ctrl) {
            ctrl.$validators.mMax = function(modelValue, viewValue) {
              var val = parseFloat(scope.$eval(attr.mMax));

              return isNaN(val) && val >= parseFloat(modelValue);
          }
          }
        }
      })
      .directive('mMin', function($parse) {
        return {
          require: 'ngModel',
          link: function(scope, element, attr, ctrl) {
            ctrl.$validators.mMax = function(modelValue, viewValue) {
              var val = parseFloat(scope.$eval(attr.mMax));

              return isNaN(val) && val <= parseFloat(modelValue);
              }
                  }
                  }
      })
      .directive('mRange', function($parse, mFuncRange) {
        return {
          require: 'ngModel',
          link: function(scope, element, attr, ctrl) {
            ctrl.$validators.mRange = function(modelValue, viewValue) {
              if (attr.name == 'nCIIValorContenido')
                var aaa = 1;
              var val = scope.$eval(attr.mRange);
              var v = !modelValue ? modelValue : viewValue

              return mFuncRange.validate(val, v)
            }
            ctrl.validationForm = function() {
              if (attr.name == 'nCIIValorContenido')
                var aaa = 1;
              ctrl.$setValidity('mRange', ctrl.$validators.mRange(ctrl.$modelValue, ctrl.$viewValue), ctrl)
              }
            scope.$watch(function() {
              var val = scope.$eval(attr.mRange);
              if (angular.isObject(val))
                return val.min
            }, function() {
              ctrl.validationForm();
            })

          }
        }
      })
      .factory('mFuncRange', function() {
        function isVoid(n) {

          return isNaN(n) || n == undefined || n == null;
        }

        function getRange(val) {
          if (angular.isObject(val))
            return {
              max: val.max,
              min: val.min
            };
          else if (angular.isNumber(val))
            return {
              max: parseFloat(val)
            };
          else if (angular.isString(val)) {
            var values = val.split(',');
            if (values.length == 1)
              return {
                max: parseFloat(values[0])
              };
            else(values.length >= 2)
        return {
              max: parseFloat(values[1]),
              min: parseFloat(values[0])
            };
          }
          return {};
        }

        function validateMax(rangeValue, value, val) {
          return validate(rangeValue, value, function(s, val) {
            var max = angular.isFunction(s.max) ? s.max(val) : s.max;
            return max >= val || isVoid(max);
          })
        }

        function validateMin(rangeValue, value, val) {
          return validate(rangeValue, value, function(s, val) {
            var min = angular.isFunction(s.min) ? s.min(val) : s.min;
            return min <= val || isVoid(min);
          })
        }

        function validate(rangeValue, value, compare) {
          var setting = getRange(rangeValue)
          var v = value == "" || value == undefined || value == null ? 0 : parseFloat(value);

          compare = compare || function(s, val) {
            var max = angular.isFunction(s.max) ? s.max(val) : s.max;
            var min = angular.isFunction(s.min) ? s.min(val) : s.min;
            return (max >= val || isVoid(max)) &&
              (min <= val || isVoid(min))
          }
          v = isNaN(v) ? 0 : v;
          if (!isNaN(v) && setting) {
            return compare(setting, v);
          }
          return true;
        }
        return {
          getRange: getRange,
          validate: validate,
          validateMax: validateMax,
          validateMin: validateMin
          }
      })
      .directive('mBindPromise', function($filter, $parse, $interpolate) {
        return {
          require: 'ngModel',
          link: function(scope, element, attr, ctrl) {
            var canceled = [];

            function updateValue(nvalue) {
              var fn = $parse(attr.mBindPromise),
                options = fn(scope, {});

              if (!nvalue) {
                element.html(options.caption || "" + 'esperando...');
                return;
            }

              element.html((options.caption || "") + 'calculando...')
              if (nvalue.then) {

                canceled.push(false)
                var index = canceled.length - 1;
                nvalue.then(function(response) {
                  if (canceled[index]) {
                    canceled[index] = true;
                    console.log('Arrinved cancel: ' + index.toString())
                    return;
                  }
                  console.log('Arrinved!!: ' + index.toString())
                  try {
                    var value = angular.fromJson($interpolate("{{" + options.fieldExpression + "}}")(response))
                    var simb = !options.typeMoney || options.typeMoney == 1 ?
                      'S/. ' : '$ '
                    var valor = $filter('currency')(value, simb)
                    element.html((options.caption || "") + valor)
                  } catch (e) {
                    element.html((options.caption || "") + '¡Error!');
                  }
                });
              }
            }
            scope.$watch(attr.ngModel, function(nvalue, ovalue) {

              if (nvalue && nvalue != ovalue) {
                if (canceled.length > 0) {
                  console.log('cancel ' + (canceled.length - 1).toString())
                  if (!canceled[canceled.length - 1])
                    canceled[canceled.length - 1] = true
                };
                updateValue(nvalue);
              }
            });
            updateValue($parse(attr.ngModel)(scope, {}));
          }
        }
      })
      .directive('fileModel', ['$parse', function($parse) {
          return {
          restrict: 'A',
            link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            // debugger;
            element.bind('change', function() {
              scope.$apply(function() {
                //modelSetter(scope, element[0].files[0]);
                modelSetter(scope, element[0].files);
              });

            });
                }
        };
      }])
      .directive('mSpinPanel', function($parse) {
        return {
          link: function(scope, element, attrs) {
            var opts = {
              lines: 13,
              length: 20,
              width: 10,
              radius: 30,
              scale: 0.25,
              corners: 1,
              rotate: 0,
              direction: 1,
              color: '#000',
              speed: 1.5,
              trail: 56,
              shadow: false,
              hwaccel: false,
              className: 'spinner',
              zIndex: 2e9,
              top: '50%',
              left: '50%'
            };
            var background = null;

            function cleanBackground() {
              var data = element.data()
              if (data.spinner) {
                data.spinner.stop();
                delete data.spinner;

              }
              if (background) {
                angular.element(background).remove();
                background = null;
              }
            }

            function getLoyout() {
              var position = {
                left: element.prop("offsetLeft"),
                top: element.prop("offsetTop")
              }
              var dimension = {
                height: element.prop("offsetHeight"),
                width: element.prop("offsetWidth")
              }
              return {
                position: position,
                dimension: dimension
              };
            }

            function applyDimension() {
              if (!!background === true) {
                var loyout = getLoyout();
                angular.element(background).css({
                  width: loyout.dimension.width + 'px',
                  height: loyout.dimension.height + 'px',
                  top: loyout.position.top - $(window).scrollTop() + 'px',
                  left: loyout.position.left - $(window).scrollLeft() + 'px',
                  "background-color": "rgba(0, 0, 0, 0.3)",
                  position: "fixed",
                  "z-index": opts.zIndex
                })
              }
            }

            function showSpin() {

              if (!!background === false) {
                var loyout = getLoyout();
                background = document.createElement('div');

                var data = element.data()
                document.body.appendChild(background);
                applyDimension();
                data.spinner = new Spinner(angular.extend({
                  color: element.css('color')
                }, opts)).spin(background);
              }



            }
            window.setInterval(applyDimension, 50);
            $(window).scroll(function() {
              applyDimension();
            })
            scope.$watch(attrs.mSpinPanel, function(n, o) {
              if (n != o) {

                if (!!n === true) showSpin();
                else cleanBackground()

              }
            })
          }
                  }
      })
      .directive('mBreadCrumbs', ['$state', '$parse', '$rootScope', '$stateParams', '$window',
        function($state, $parse, $rootScope, $stateParams, $window) {
          return {
            templateUrl: '/scripts/mpf-main-controls/html/m-bread-crumbs.html',
            link: function(scope, element, attrs) {
              function getAppName() {
                var path = window.location.pathname;
                var app = _.find(system.apps, function predicate(x) {
                  if((x.location).toLowerCase().indexOf("referencia") !== -1) {
                    return !!x.code === true && !!x.location === true && ((x.location || '').toLowerCase().indexOf(path.toLowerCase()) !== -1);
                  } else {
                    return !!x.code === true && !!x.location === true && ((x.location || '').toLowerCase().indexOf(path.toLowerCase()) !== -1 ||
                    path.toLowerCase().indexOf((x.location || '').toLowerCase()) !== -1);
                  }
                })
                if (app && path != '/') return app;
                else return undefined;
              }

              function setCurrentBreadcrumb(items) {
                var steps = [];
                angular.forEach(items, function(item) {
                  if (item.description) steps.push(item.description);
                });
                $window.localStorage.setItem('currentBreadcrumb', steps.join('|'));
                if (!steps.length) { $window.localStorage.removeItem('currentBreadcrumb'); }
              }

              function Populate(items) {
                var first = getAppName();
                if (first) {
                  items.push({
                    description: first.menuName,
                    href: first.location
                  });
                }
                return items;
              }
              $rootScope.$on('$stateChangeSuccess', function(event, state) {
                var current = {
                  breads: state.breads,
                  description: state.description,
                  state: state.name
                }
                directiveApply(current);
              });

              function directiveApply(current) {
                current = current || {
                  breads: $state.$current.self.breads,
                  description: $state.$current.self.description,
                  state: $state.$current.self.name
                }


                var othersItems = $parse(attrs.mBreadCrumbs)(scope, {});

                var items = Populate([]);

                setTimeout(function() { setCurrentBreadcrumb(items) });

                if (items.length > 0)
                  angular.forEach(othersItems, function(value) { items.push(value) });

                angular.forEach(current.breads, function(bread) {
                  var vBread = _getBread(bread);
                  if (vBread){
                    items.push({
                      description: vBread.description,
                      state: vBread.state
                    });
                  }
                });
                items.push(current);
                scope.crumbs = items;
              }
              directiveApply();


              function _getBread(bread) {
                var vBread = null;
                var vState;
                if (angular.isString(bread)) {
                  vState = $state.get(bread);
                  vBread = {
                    description:  vState.description,
                    state:        bread
                  };
                } else if (angular.isObject(bread)) {
                  vState = $state.get(bread.nameRoute);
                  var vStateParams = {};
                  angular.forEach(bread.nameStateParams, function(nameStateParam) {
                    if ($stateParams[nameStateParam]) vStateParams[nameStateParam] = $stateParams[nameStateParam];
                  });
                  if (Object.keys(vStateParams).length > 0) {
                    var vUiSref = bread.nameRoute + '(' + JSON.stringify(vStateParams) + ')';
                    vBread = {
                      description:  vState.description,
                      state:        vUiSref
                    };
                  }
                }
                return vBread;
              }
            }
          }
        }])
      .filter('calculateAge', function() {
        return function(input) {
          if (!input) {
            return 0;
              }
          if (typeof input.getMonth !== 'function') {
            return 0;
            }
          var one_day = 1000 * 60 * 60 * 24;
          var today = new Date();

          var diff = today.getTime() - input.getTime();
          var edad = Math.round((diff / one_day) / 365, 2);

          return edad;
        }
      })
      .filter('calculateActuarialAge', function() {
        return function(input) {
          if (!input) {
            return 0;
              }
          if (typeof input.getMonth !== 'function') {
            return 0;
            }

            var edad = directiveUtils.monthsBetween(new Date(), input)/12;
            var edad_precisa = Math.trunc(angular.copy(edad));

            if (directiveUtils.truncateDecimalsTo(edad_precisa - edad, 4) > .5000) {
              edad+=1;
            }

          return Math.round(edad);
        }
      })
      .directive('scrollPosition', function($interval, $rootScope) {
        return {
          restrict: 'A',
          // scope: {
          // scroll: '=scrollPosition'
          // },
          link: function(scope, element, attrs) {
            var vSteps = $('#g-steps').offset(); //document.getElementById('g-steps');
            var vStepsHeight = $('#g-steps').outerHeight();
            var vNewTop = vSteps.top;
            var windowEl = $(window); //angular.element($window);
            var handler = function() {
              scope.scroll = windowEl.scrollTop() >= vNewTop;
              (scope.scroll) ? $('#main-content').css('padding-top', vStepsHeight + 30 + 'px'): $('#main-content').css('padding-top', '0px');
            }
            windowEl.on('scroll', scope.$apply.bind(scope, handler));
            handler();

            function _offset(el) {
              var rect = el.getBoundingClientRect(),
                scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
              }
            }

            var vActiveElement, vActiveElementTop, vNewScrollTop;
            $rootScope.$on('newPositionScroll', function(event, activeElement) {
              vActiveElement = activeElement[0];
              // console.log(activeElement[0].tagName);
              if (typeof vActiveElement !== 'undefined') {
                var vActiveElementOffset = _offset(vActiveElement);
                var vActiveElementTop = vActiveElementOffset.top - windowEl.scrollTop();
                // vActiveElementTop = vActiveElement.getBoundingClientRect().top - windowEl.scrollTop();
                if (vActiveElementTop < vStepsHeight) {
                  vNewScrollTop = vStepsHeight - vActiveElementTop;
                  vNewScrollTop = (windowEl.scrollTop() - vNewScrollTop) - 30;
                  windowEl.scrollTop(vNewScrollTop);
                }
              }
            });
          }
        };
      })
      .directive('scrollInit', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var windowEl = $(window);
            windowEl.scrollTop(0);
          }
        };
      })
      .directive('showFilter', ['$window', '$timeout', function($window, $timeout) {
        // Runs during compile
        return {
          restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
          link: function(scope, element, attrs) {
            // console.log('Llamando directiva... ');
            var w = angular.element($window);

            function showFilterBox() {
              // console.log($window.innerWidth);
              scope.isFilterVisible = false;
              var isDesktop = $window.innerWidth > 991;
              var heightDevice = $window.innerHeight;
              if (isDesktop) {
                element.css('top', 'auto');
              } else {
                element.css('top', heightDevice - 70 + 'px');
              }
              scope.toggleFilter = function() {
                // console.log('Activando filtro... ');
                var isDesktop = $window.innerWidth > 991;
                if (isDesktop) {
                  document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                  return;
                } else {
                  scope.isFilterVisible = !scope.isFilterVisible;
                  if (scope.isFilterVisible) {
                    document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
                  } else {
                    document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                  }
                }
              }
            }

            $timeout(init, false);

            function init() {
              showFilterBox();
            }

            // **************************************************
            // Script cuando pasa de portrait a layout en Tablet
            // **************************************************
            w.bind('resize', function() {
              // console.log('Resize... ', $window.innerWidth, scope.isFilterVisible);
              var isDesktop = $window.innerWidth > 991;
              var heightDevice = $window.innerHeight;
              if (isDesktop) {
                // console.log('Es desktop... ');
                // scope.isFilterVisible = false;
                element.css('top', 'auto');
                document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                return;
              } else {
                element.css('top', heightDevice - 70 + 'px');
                if (scope.isFilterVisible) {
                  document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
                }
              }
            });
          }
        };
      }])
      .directive('tblOim', ['$window', '$timeout', function($window,$timeout){
        // Runs during compile
        return {
          restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
          link: function($scope, iElm, iAttrs, controller) {
            // console.log(iElm[0]);
            var tblHead = iElm[0].getElementsByClassName('tbl-header'); //console.log(tblBody[0]);
            // console.log(navigator);
            if (navigator.appVersion.indexOf("Win")!=-1){
              // console.log('Hay scrollbar');
              // tblHead[0].setAttribute("class", "tbl-header clearfix tbl-has-scrollbar");
            }
            // var result = $timeout(init, true);
            // function init() {
            //  var tblBody = iElm[0].getElementsByClassName('tbl-body'); //console.log(tblBody[0]);
            //  var tblBodyRows = iElm[0].getElementsByClassName('tbl-row'); //console.log(tblBodyRows);
            //  var widthTblBody = tblBody[0].offsetWidth; //console.log(widthTblBody);
            //  var widthTblBodyRow = tblBodyRows[0].offsetWidth; //console.log(widthTblBodyRow);
            //  var diffWidth = widthTblBody - widthTblBodyRow;
            //  if ( diffWidth > 15 ) {
            //      // console.log('Hay scrollbar');
            //      tblHead[0].setAttribute("class", "tbl-header clearfix tbl-has-scrollbar")
            //  }
            //  console.log(iElm[0].scrollHeight, iElm[0].scrollHeight < 517);
            //  return iElm[0].scrollHeight < 517;
            // }
          }
        };
      }])
      .directive('tblOimTopbar', ['$window', function($window){
        // Runs during compile
        return {
          restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
          link: function($scope, iElm, iAttrs, controller) {
            $scope.showFilterTopbar = false;
            }
          };
      }])
      .directive('heightRow', function($timeout, $window){
        return {
          link: link,
          restrict: 'A'
        };
        function link(scope, element, attrs){
          function setHeightRow(){
            scope.widthWindow = $window.innerWidth;
            scope.rowHeight = 0;
            var liArray = element.find('li');
            if (scope.widthWindow > 992) {
              angular.forEach(liArray, function(value,key){
                if ( value.offsetHeight > scope.rowHeight ) scope.rowHeight = value.offsetHeight;
              });
              element.find('li').css('height', scope.rowHeight + 'px');
            }
          }
          $timeout(init, false);
          function init(){ setHeightRow(); }
          function onResize(){ setHeightRow(); }
        }
      })
      .directive('topMenu', ['$document', '$window', function($document, $window) {
        return {
          link: link,
          restrict: 'A' // E = Element, A = Attribute, C = Class, M = Comment
        };
        function link(scope, element, attrs) {
          scope.isPopupVisible = false;
          scope.showSubMenu = false;
          scope.showSubMenuMore = false;
          var body = $document.find('body');
          var widthWindow = $window.innerWidth;
          var heightWindow = $window.innerHeight;
          var heigthMenu = heightWindow - 100 + 'px';
          if (widthWindow < 768) {
            scope.mnStyle = {height: heigthMenu};
          }
          scope.showTopMenu = function() {
            scope.isPopupVisible = !scope.isPopupVisible;
            if (!scope.isPopupVisible) {
              body.removeClass('g-menu__body');
              document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
            }
          };
          scope.$on('$stateChangeSuccess', function() {
            scope.isPopupVisible = false;
            scope.showSubMenu = false;
            scope.showSubMenuMore = false;
            body.removeClass('g-menu__body');
          });
        }
      }])
      .directive('tabsResponsive', ['$document', '$window', '$timeout', function($document, $window, $timeout){
        // Runs during compile
        return {
          restrict: 'C', // E = Element, A = Attribute, C = Class, M = Comment
          link: link
        };
        function link(scope, element, attrs) {
          scope.showTabs = false;
          scope.tabsFalse = function(){
            scope.showTabs = false;
          }
        }
      }])
      .directive('fixedSection', function($window) {
        return {
          link: link,
          restrict: 'A'
        };

        function link(scope, element, attrs) {
          // console.log('Sección fija... ');
          scope.widthWindow = $window.innerWidth;
          if (scope.widthWindow > 991) {
            scope.heightScroll = 152;
          } else {
            if (scope.widthWindow > 761 && scope.widthWindow <= 991) {
              scope.heightScroll = 153;
            } else {
              scope.heightScroll = 56;
            }
          }
          angular.element($window).bind('scroll', function() {
            // console.log('Scrolling... ', this.pageYOffset, scope.heightScroll);
            if (this.pageYOffset >= scope.heightScroll) {
              scope.boolChangeClass = true;
            } else {
              scope.boolChangeClass = false;
            }
            scope.$apply();
          });
        }
      })
      .filter('capitalize', function() {
        return function(input) {
          var reg = /([^\W_]+[^\s-]*) */g;
          return (!!input) ? input.replace(reg, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }) : '';
        }
      })
      .filter('formatZeroBefore', function() {
        return function(input) {
          var n = (input || '').toString();
          return n.replace(/^(\d)$/, '0$1');
                }
      })
      /*######################################
        # Radio Button as Panel
        ######################################*/
      .directive('mpfRadioPanel', function() {
        return {
          restrict: 'E',
          replace: true,
          require: '^ngModel',
          scope: {
            function: '&',
            isInputBoolean: '=?',
            labelData: '=label',
            ngDisabled: '=',
            ngModel: '=',
            value: '@',
            icon:'='
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-radio-panel.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            var spanIco = element[0].getElementsByClassName('g-radio-panel__ico');
            spanIco[0].classList.add(scope.icon);

            if (scope.isInputBoolean) {
              if (!angular.isUndefined(scope.ngModel)) {
                if (scope.isInputBoolean) {
                  scope.ngModel = (scope.ngModel + '' === 'true') ? true : false;
                } else {
                  scope.ngModel = scope.ngModel + '';
              }
            }
            }

            element.on('click', function() {
              if (scope.getDisabled()) {
                return;
              }
              _setModel();
              ngModelCtrl.$setViewValue(scope.ngModel);
            });

            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            }

            function _setModel() {
              if (scope.isInputBoolean) {
                scope.ngModel = (scope.value === 'true') ? true : false;
              } else {
                scope.ngModel = scope.value;
              }
            }
          }
        };
      })
      /*######################################
      # mpfValidateDate
      ######################################*/
      .directive('mpfValidateDate', function($compile, $parse, $filter) {
        return {
          restrict: 'A',
          require: ['?ngModel', '^form'],
          link: function($scope, element, attrs, requirements) {
            var ngModel = requirements[0],
                ngForm = requirements[1],
                vArrayValidation = $scope.$eval(attrs.mpfValidateDate);

            function _formatDate(date){
              var vDate, vFormatDate;
              if (typeof date == 'string'){
                vDate = date.replace(/\s+/g, '').split('/');
              }else{
                vDate = $filter('date')(date, 'dd/MM/yyyy').replace(/\s+/g, '').split('/');
              }
              vFormatDate = new Date(vDate[2],vDate[1]-1, vDate[0]);
              return vFormatDate;
            }
            angular.forEach(vArrayValidation, function(value, key) {
              var optValidate = key;//.replace(/\s+/g, ''); //Elimino espacios
              ngModel.$validators[optValidate] = function test(modelValue, viewValue) {
                var valModel = modelValue || viewValue;
                switch (optValidate){
                  case 'range':
                    var vMinDate = _formatDate(value.minDate),
                        vMaxDate = _formatDate(value.maxDate);
                    return (valModel >= vMinDate && valModel <= vMaxDate);
                    break;
                  case 'minDate':
                    var vMinDate = _formatDate(value);
                    return (valModel >= vMinDate);
                    break;
                  case 'maxDate':
                    var vMaxDate = _formatDate(value);
                    return (valModel <= vMaxDate);
                    break;
                }
              }
            });
          }
        };
      })
      /*######################################
      # Radio Button as Button
      ######################################*/
      .directive('mpfRadioButton', function() {
        return {
          restrict: 'E',
          replace: true,
          require: '^ngModel',
          scope: {
            function: '&',
            isInputBoolean: '=?',
            labelData: '=label',
            ngDisabled: '=',
            ngModel: '=',
            value: '@'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-radio-button.html',
          link: function(scope, element, attrs, ngModelCtrl) {
            if (scope.isInputBoolean) {
              if (!angular.isUndefined(scope.ngModel)) {
                if (scope.isInputBoolean) {
                  scope.ngModel = (scope.ngModel + '' === 'true') ? true : false;
                } else {
                  scope.ngModel = scope.ngModel + '';
                }
              }
            }

            element.on('click', function() {
              if (scope.getDisabled()) {
                return;
              }
              _setModel();
              ngModelCtrl.$setViewValue(scope.ngModel);
            });

            scope.getDisabled = function() {
              return !!scope.ngDisabled;
            }

            function _setModel() {
              if (scope.isInputBoolean) {
                scope.ngModel = (scope.value === 'true') ? true : false;
              } else {
                scope.ngModel = scope.value;
              }
            }
          }
        };
      })
      /*######################################
      # CheckBox Toggle
      ######################################*/
      .directive('mpfCheckboxToggle', function($parse) {
        return {
          restrict: 'E',
          replace: true,
          require: '^ngModel',
          scope: {
            labelData: '@label',
            // checkData: '=info',
            ngModel: '='
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-checkbox-toggle.html',
          link: function($scope, element, attrs, ngModelCtrl) {
            var fn = $parse(attrs.ngClick);
            var fnd = $parse(attrs.ngDisabled);
            var fnTrue = $parse(attrs.ngTrueValue);
            var fnFalse = $parse(attrs.ngFalseValue);

            $scope.$watch('ngModel', function(n, o) {
              if (n != o)
                $scope._ngModel = getValue(n);
            })

            function disabled() {
              return fnd($scope.$parent, {});
            }
            $scope.isDisabled = disabled;
            $scope._ngModel = (fnTrue($scope.$parent, {}) || true) === $scope.ngModel
            bindValue();

            function getValue(v) {
              var vtrue = fnTrue($scope.$parent, {}) || true
              var vfalse = fnFalse($scope.$parent, {}) || false
              if (v == vtrue)
                return true;
              if (v == vfalse)
                return false;
            }

            function bindValue() {
              if ($scope._ngModel)
                ngModelCtrl.$setViewValue(fnTrue($scope.$parent, {}) || true);
              else
                ngModelCtrl.$setViewValue(fnFalse($scope.$parent, {}) || false);
            }
            $scope._click = function($event) {
              bindValue()

              fn($scope.$parent, {
                $event: $event
              });
            }
            var input = element.find('input');
            $(input).change(function($e) {
              var fn = $parse(attrs.domChange);
              fn($scope.$parent, {
                $event: $e
              });
            })

            function cryptoRandom(){
              var array = new Uint32Array(1);
                max = Math.pow(2, 32);
                randomValue = window.crypto.getRandomValues(array)[0] / max;
            
                return randomValue;
            }

            function generateID(length) {
              var text = ""
              const possible = "abcdefghijklmnopqrstuvwxyz0123456789"
              for(var i = 0; i < length; i++)  {
                text += possible.charAt(Math.floor(cryptoRandom() * possible.length))
              }
              return text;
            }
            $scope.idToggle = 'id_' + generateID(10);
          }
        };
      })

      .directive('customOnChange', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', function(event) {
              var files = event.target.files;
              onChangeFunc(files);
            });

            element.bind('click', function() {
              element.val('');
            });
          }
        };
      })

      .directive('mpfSelectMultiple', function($parse) {
        function link (scope, element, attrs, ngModelCtrl) {
          scope._ngModel = [];
          scope.ngModelText = '';
          scope.dataList = [];
          scope.isActive = false;

          function _hasNgModel() {
            return !!scope._ngModel.length;
          }

          function _hasDataList() {
            return !!scope.dataList.length;
          }

          function _setDataList() {
            if (_hasNgModel() && _hasDataList()) {
              function _findDataList(model, item) {
                return model[scope.valueField] === item[scope.valueField];
              }

              scope._ngModel = _.map(scope._ngModel, function(model) {
                var item = _.find(scope.dataList, _findDataList.bind(this, model));
                item.checked = !!item;

                return (item.checked) ? item : model;
              });

              _setViewValue(scope._ngModel);
            }
          }

          function _setViewValue(value) {
            !scope.isSetViewValue && (scope.isSetViewValue = true);
            scope.ngModelText = _.map(value, function(val) { return val[scope.textField]; }).join(', ');
            ngModelCtrl.$setViewValue(value);
            ngModelCtrl.$render();
          }

          var wNgModel = scope.$watch('ngModel', function(newVal) {
            var _ngModel = angular.isArray(newVal) ? newVal : [];
            // INFO: Setea el dataList y actualiza el setViewValue, solo cuando el model es distinto del anterior
            if (scope._ngModel !== _ngModel) {
              scope._ngModel = _ngModel;
              _setDataList();
            }
          });

          var wDatasource = scope.$watch('datasource', function(newVal) {
            scope.dataList = newVal || scope.dataList;
            _setDataList();
          });

          scope.toggleList = function() {
            scope.isActive = !scope.isActive;
          }

          scope.changeCheck = function(checked, item) {
            if (checked) {
              scope._ngModel.push(item);
            } else {
              var index = scope._ngModel.indexOf(item);
              scope._ngModel.splice(index, 1);
            }
            _setViewValue(scope._ngModel);
            scope.checkedChange({checkedItem: item});
          }

          scope.$on('$destroy', function() {
            wNgModel();
            wDatasource();
          });
        }

        return {
          restrict: 'E',
          replace: true,
          require: '^ngModel',
          scope: {
            ngModel: '=',
            labelData: '<label',
            placeholder: '<',
            datasource: '<',
            valueField: '<',
            textField: '<',
            checkedChange: '&'
          },
          templateUrl: '/scripts/mpf-main-controls/html/mpf-select-multiple.html',
          link: link
        };
      })
      .directive('mInputCurrency', function()  {
        return {
          restrict: 'A',
          link: function($scope, element, attrs) {
            var input = $('input[ng-model]', element);
            function formatNumberToMiles(n) {
              return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            function formatCurrency(blur) {
              var inputVal = input.val();
              if (inputVal === "") { return; }
              if (inputVal.indexOf(".") >= 0) {
                if (blur === "blur") {
                var decimalPos = inputVal.indexOf(".");
                var leftSide = inputVal.substring(0, decimalPos);
                var rightSide = inputVal.substring(decimalPos);
                leftSide = formatNumberToMiles(leftSide);
                rightSide = formatNumberToMiles(rightSide);
                rightSide += "00";
                rightSide = rightSide.substring(0, 2);
                inputVal = leftSide + "." + rightSide;
              }
              } else {
                inputVal = formatNumberToMiles(inputVal);
                if (blur === "blur") {
                  inputVal += ".00";
                }
              }
              input.val(inputVal);
            }
            setTimeout(function() {
              formatCurrency("blur")
            }, 500);
            
            element.find('input').on('keyup', function(){
              formatCurrency(null)
            });
            element.find('input').on('blur', function(){
              formatCurrency("blur")
            });
          }
        };
      })

      String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
      };
  });
