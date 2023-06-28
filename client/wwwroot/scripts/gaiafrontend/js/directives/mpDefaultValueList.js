/* global angular */
/*DEPRECATED*/
angular.module('mpDefaultValueList', [])
   /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpDefaultValueList
     * @description
     * DEPRECATED
     * Use mpValuesList instead
     */
    .directive('mpDefaultValueList', ['Utils', '$filter', function (Utils, $filter) {
        return {
            templateUrl: 'gaiafrontend/html/mpDefaultValueList.html',
            require: '^form',
            scope: {
                mpDefaultValueListModel: '=',
                mpDefaultValueListConfig: '=',
                mpDefaultValueListCodeName: '@',
                mpDefaultValueListCodeModel: '=',
                mpDefaultValueListDescName: '@',
                mpDefaultValueListDescModel: '=',
                mpDefaultValueListData: '='
            },
            link: function(scope, element, attrs, formCtrl) {
                // Returns the last sequence of the Nam or Val string
                var getCodeAndName = function(attribute) {
                    return $filter('limitTo')(attribute, attribute.length, (attribute.lastIndexOf('.') + 1));
                }

                // Needed to apply validations properly (to display the tooltip)
                scope[formCtrl.$name] = formCtrl;

                scope.onClick = function () {
                    scope.$parent.$eval(attrs.mpDefaultValueListClick);
                }

                scope.$watch('mpDefaultValueListCodeModel', function (mpDefaultValueListCodeModel) {
                    if (mpDefaultValueListCodeModel && mpDefaultValueListCodeModel.cnf && mpDefaultValueListCodeModel.cnf.fldT && mpDefaultValueListCodeModel.cnf.fldT[getCodeAndName(attrs.mpDefaultValueListCodeModel)]) {
                        scope.mpDefaultValueListCodeRqr = mpDefaultValueListCodeModel.cnf.fldT[getCodeAndName(attrs.mpDefaultValueListCodeModel)].rqr;
                        scope.mpDefaultValueListCodeDis = mpDefaultValueListCodeModel.cnf.fldT[getCodeAndName(attrs.mpDefaultValueListCodeModel)].mdf;
                    }
                }, true);

                scope.$watch('mpDefaultValueListDescModel', function (mpDefaultValueListDescModel) {
                    if (mpDefaultValueListDescModel && mpDefaultValueListDescModel.cnf && mpDefaultValueListDescModel.cnf.fldT && mpDefaultValueListDescModel.cnf.fldT[getCodeAndName(attrs.mpDefaultValueListDescModel)]) {
                        scope.mpDefaultValueListDescRqr = mpDefaultValueListDescModel.cnf.fldT[getCodeAndName(attrs.mpDefaultValueListDescModel)].rqr;
                        scope.mpDefaultValueListDescDis = mpDefaultValueListDescModel.cnf.fldT[getCodeAndName(attrs.mpDefaultValueListDescModel)].mdf;
                    }
                }, true);
            }
        };
    }]);
