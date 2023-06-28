define(['angular', 'mpfPersonConstants', 'mpfPersonFactory'],
  function (angular, personConstants) {
    var appControls = angular.module('mpfPersonDirective', ['ngMessages']);
    appControls
      .directive('mpfGenericValidations', function ($compile, $q, mpfPersonFactory) {
        return {
          restrict: 'A',
          require: ['?ngModel', '^form'],
          link: function (scope, element, attrs, ctrls) {
            var ngModel = ctrls[0];
            var ngForm = ctrls[1];
            var validationsType = personConstants.validationsType;

            var arrayValidation = JSON.parse(attrs.mpfGenericValidations);

            if (arrayValidation.length > 0) {
              angular.forEach(arrayValidation, function (value, key) {
                if (value.Type === validationsType.REQUIRED) {
                  ngModel.$validators[value.Order] = function (modelValue, viewValue) {
                    var valModel = modelValue || viewValue;
                    if (angular.isObject(valModel)) {
                      return angular.isDefined(valModel.selectedEmpty) ? !valModel.selectedEmpty : (!!valModel.Codigo || !!valModel.codigo);
                    }
                    return (valModel !== '' && !angular.isUndefined(valModel) && valModel !== null && valModel !== 'null');
                  }
                }
                if (value.Type === validationsType.PATTERN) {
                  ngModel.$validators[value.Order] = function (modelValue, viewValue) {
                    var valModel = modelValue || viewValue || '';
                    var reg = new RegExp(value.Value);
                    return reg.test(valModel);
                  }
                }
                if (value.Type === validationsType.PROCEDURE || value.Type === validationsType.SERVICE) {
                  ngModel.$asyncValidators[value.Order] = function (modelValue, viewValue) {
                    var valModel = modelValue || viewValue || '';
                    var deferred = $q.defer();
                    if(!valModel.length) {
                      deferred.resolve();
                    }
                    else {
                      var params = {
                        OperationType: (value.Type === validationsType.PROCEDURE) ? 1 : 2,
                        Id: value.Value,
                        Value: valModel
                      };

                      mpfPersonFactory.serviceValid(params)
                        .then(function (response) {
                          if (response.Data.IsValid) {
                            deferred.resolve();
                          }
                          else {
                            deferred.reject();
                          }
                        });
                    }

                    return deferred.promise;
                  }
                }
              });

              var nameMessage = ngForm.$name + '.' + attrs.name + '.$error';
              var nameMessageValidationPristine = ngForm.$name + '.' + attrs.name + '.$pristine';
              var nameMessageValidationSubmitted = ngForm.$name + '.$submitted';
              var eMessages = "<div class='g-error g-absolute' ng-messages='" + nameMessage + "' ng-show='!" + nameMessageValidationPristine + " || " + nameMessageValidationSubmitted + "'>";
              angular.forEach(arrayValidation, function (value, key) {
                eMessages += "<div ng-message='" + value.Order + "' class='invalid'>" + value.Message + "</div>";
              });
              eMessages += "</div>";

              var content = $compile(eMessages)(scope);
              element.after(content);
            }

            element.on('keypress', function(event) {
              var personDocument = attrs.personDocument;
              if (personDocument) {
                var pattern = personDocument === 'onlyNumber' ? /[^0-9]/g : '';
                if (pattern) {
                  setTimeout(function() {
                    ngModel.$setViewValue(ngModel.$modelValue.replace(pattern, ''));
                  })
                }
              }
            })
          }
        };
      })
  });
