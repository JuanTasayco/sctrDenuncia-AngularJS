/* global angular */
angular.module('mpDefaultValuesList', [])
    .directive('mpDefaultValuesList', ['$parse', '$compile', 'Utils', function ($parse, $compile, Utils) {
        return {
            template: function (element, attrs) {
                function createCodeElement() {
                    var codeElement = angular.element('<input class="form-control"></input>'),
                        codeAttributes = $parse(attrs.mpDefaultValuesListCodeAttributes)(element.scope());

                    angular.forEach(codeAttributes, function (value, attr) {
                        codeElement.attr(Utils.string.toHyphens(attr), value);
                    });

                    return codeElement;
                }

                function createCodeWrapperElement() {
                    var codeWrapperElement = angular.element('<div></div>'),
                        codeAttributes = $parse(attrs.mpDefaultValuesListCodeAttributes)(element.scope());

                    if (codeAttributes && codeAttributes.type === 'hidden') codeWrapperElement.addClass('ng-hidden');
                    else codeWrapperElement.addClass('col-sm-2');

                    return codeWrapperElement;
                }

                function createDescElement() {
                    var descElement = angular.element('<input class="form-control"></input>'),
                        descAttributes = $parse(attrs.mpDefaultValuesListDescAttributes)(element.scope());

                    angular.forEach(descAttributes, function (value, attr) {
                        descElement.attr(Utils.string.toHyphens(attr), value);
                    });

                    return descElement;
                }

                function createValuesListWrapperElement() {
                    return angular.element('<span class="input-group-btn"></span>');
                }

                function createDescWrapperElement() {
                    var descWrapperElement = angular.element('<div class="validable input-group"></div>'),
                        codeAttributes = $parse(attrs.mpDefaultValuesListCodeAttributes)(element.scope());

                    if (codeAttributes && codeAttributes.type === 'hidden') descWrapperElement.addClass('col-sm-12');
                    else descWrapperElement.addClass('col-sm-10');

                    return descWrapperElement;
                }

                return angular.element('<div></div>')
                        .append(
                            createCodeWrapperElement().append(createCodeElement())
                        ).append(
                            createDescWrapperElement().append(createDescElement()).append(createValuesListWrapperElement())
                        ).html();
            },
            link: function (scope, element, attrs) {
                var valuesListAttributes = scope.$eval(attrs.mpDefaultValuesListButtonAttributes),
                    map = $parse(attrs.mpDefaultValuesListMap)(),
                    childScope = scope.$new();

                function createValuesList() {
                    var valuesListElement = angular.element('<button></button>');

                    angular.forEach(valuesListAttributes, function (value, attr) {
                        valuesListElement.attr(Utils.string.toHyphens(attr), value)
                    });

                    valuesListElement.attr('mp-values-list', attrs.mpDefaultValuesList);
                    valuesListElement.attr('mp-values-list-model', 'model');
                    valuesListElement.attr('mp-values-list-config', 'config');
                    valuesListElement.attr('mp-values-list-filter', 'filter($scope)');

                    return valuesListElement;
                }

                childScope.$watch('model', function (valuesListModel) {
                    if (!_.isEmpty(valuesListModel)) {
                        angular.forEach(map, function (valueExpression, keyExpression) {
                            var configValueExpression = $parse(valueExpression)(childScope.config);
                            $parse(keyExpression).assign(scope, $parse(configValueExpression || valueExpression)(childScope.model));
                        });
                    }
                });

                element.find('.input-group > span.input-group-btn').append($compile(createValuesList())(childScope));

                childScope.filter = function (valuesListScope) {
                    valuesListScope.model = {};

                    angular.forEach(map, function (valueExpression, keyExpression) {
                        var configValueExpression = $parse(valueExpression)(valuesListScope.config);
                        $parse(configValueExpression || valueExpression).assign(valuesListScope.model, $parse(keyExpression)(scope));
                    });
                };
            }
        };
    }]);
