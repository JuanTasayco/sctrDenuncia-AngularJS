/*global angular */
angular.module('mpOptionsList', ['mgcrea.ngStrap'])
    .constant('OptionsListConfig', {
        url: 'api/nwt/trn/optVal'
    })
    .factory('OptionsListSrv', ['HttpSrv', 'OptionsListConfig', function (HttpSrv, OptionsListConfig) {
        return {
            get: function getOptionsList(data) {
                return HttpSrv.post(OptionsListConfig.url, data);
            }
        };
    }])
    /**
        * @doc-component directive
        * @name gaiafrontend.directive.mpOptionsList
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
    .directive('mpOptionsList', ['$parse', '$parseOptions', 'OptionsListSrv', function ($parse, $parseOptions, OptionsListSrv) {
        var typeRegExp = /(input)?\s*?\+?\s*?(typeahead|select)/;

        return {
            compile: function(cElement, cAttributes) {
                var match = cAttributes.mpOptionsList.match(typeRegExp),
                    input = match && match[1], // null | undefined | 'input'
                    type = match && match[2], // null | 'select' | 'typeahead'
                    descriptionElement,
                    descriptionCaretElement;

                function generateCodeOptionsExpression() {
                    var parsedOptions = $parseOptions(cAttributes.mpOptionsListOptions),
                        value = parsedOptions.$match[1],
                        iterator = parsedOptions.$match[4],
                        collection = parsedOptions.$match[7];

                    return value + ' as ' + value + ' for ' + iterator + ' in ' + collection;
                }

                function createTypeaheadCodeElement() {
                    var codeElement = angular.element('<input class="form-control" autocomplete="off"></input>'),
                        options = cAttributes.mpOptionsListCodeOptions || generateCodeOptionsExpression(),
                        attributes = cAttributes.mpOptionsListCodeAttributes,
                        attributesObject = $parse(attributes)();

                    attributesObject.dataFilter = attributesObject.dataFilter || 'filterByPath:"' + $parseOptions(options).$match[2] + '"';

                    codeElement
                        .attr('mp-typeahead', 'mp-typeahead')
                        .attr('mp-typeahead-model', cAttributes.mpOptionsListModel)
                        .attr('mp-typeahead-options', options)
                        .attr('mp-typeahead-attributes', JSON.stringify(attributesObject));

                    return codeElement;
                }

                function createCodeWrapperElement() {
                    var codeWrapperElement = angular.element('<div>'),
                        codeAttributes = input && cAttributes.mpOptionsListCodeAttributes ? $parse(cAttributes.mpOptionsListCodeAttributes)() : undefined;

                    if (input) {
                        codeWrapperElement
                            .addClass(!codeAttributes || codeAttributes.type === 'hidden' ? 'hidden' : 'col-sm-2')
                            .append(createTypeaheadCodeElement());
                    }

                    return codeWrapperElement;
                }

                function createSelectDescriptionElement() {
                    var descriptionElement = angular.element('<select class="form-control"></select>');

                    descriptionElement
                        .attr('mp-select', 'mp-select')
                        .attr('mp-select-model', cAttributes.mpOptionsListModel)
                        .attr('mp-select-options', cAttributes.mpOptionsListDescriptionOptions || cAttributes.mpOptionsListOptions)
                        .attr('mp-select-config', '{placeholder: "' + (cAttributes.mpOptionsListDefaultOption || '') + '"}')
                        .attr('mp-select-attributes', cAttributes.mpOptionsListDescriptionAttributes);

                    return descriptionElement;
                }

                function createTypeaheadDescriptionElement() {
                    var descriptionElement = angular.element('<input type="text" class="form-control" autocomplete="off"></input>'),
                        options = cAttributes.mpOptionsListDescriptionOptions || cAttributes.mpOptionsListOptions,
                        attributes = cAttributes.mpOptionsListDescriptionAttributes,
                        attributesObject = $parse(attributes)();

                    attributesObject.dataFilter = attributesObject.dataFilter || 'filterByPath:"' + $parseOptions(options).$match[2] + '"';

                    descriptionElement
                        .attr('mp-typeahead', 'mp-typeahead')
                        .attr('mp-typeahead-model', cAttributes.mpOptionsListModel)
                        .attr('mp-typeahead-options', options)
                        .attr('mp-typeahead-attributes', JSON.stringify(attributesObject))
                        .attr('placeholder', cAttributes.mpOptionsListDefaultOption || '');

                    return descriptionElement;
                }

                function createTypeaheadDescriptionCaretElement() {
                    var descriptionAttributes = $parse(cAttributes.mpOptionsListDescriptionAttributes)();
                    return angular.element('<a class="combobox-show-all-button" ng-class="{\'not-allowed\': ' + (descriptionAttributes.disabled || descriptionAttributes.ngDisabled) + '}"></a>')
                        .attr('tabIndex', -1)
                        .attr('title', 'Show all items');
                }

                function createDescriptionWrapperElement() {
                    var descriptionWrapperElement = angular.element('<div class="validable"></div>'),
                        codeAttributes = input && cAttributes.mpOptionsListCodeAttributes ? $parse(cAttributes.mpOptionsListCodeAttributes)() : undefined;

                    descriptionWrapperElement.addClass(!codeAttributes || codeAttributes.type === 'hidden' ? 'col-sm-12' : 'col-sm-10');

                    if (type === 'select') {
                        descriptionWrapperElement
                            .append(createSelectDescriptionElement());
                    } else {
                        descriptionElement = createTypeaheadDescriptionElement();
                        descriptionCaretElement = createTypeaheadDescriptionCaretElement();
                        descriptionWrapperElement
                            .append(descriptionElement)
                            .append(descriptionCaretElement);

                    }

                    return descriptionWrapperElement;
                }

                if (cElement.contents().length) {
                    cElement.empty();
                }

                cElement
                    .append(createCodeWrapperElement())
                    .append(createDescriptionWrapperElement())

                return function postLink (scope, lElement, lAttributes) {
                    var caretElement = lElement.find('a'),
                        unListenCaretElement;

                    if (angular.isDefined(lAttributes.mpOptionsListData)) {
                        scope.$watch(lAttributes.mpOptionsListData, function (data) {
                            if (!data) return;
                            var collectionName = $parseOptions(lAttributes.mpOptionsListOptions || lAttributes.mpOptionsListDescriptionOptions).$match[7];
                            OptionsListSrv.get(data)
                                .then(function (list) {
                                    $parse(collectionName).assign(scope, list.data);
                                }, function () {
                                    $parse(collectionName).assign(scope, []);
                                })
                        });
                    }

                    function listen(element, event, listener) {
                        element.on(event, listener);
                        return function() {
                            element.off(event, listener);
                        }
                    }

                    function whenClickOnCaret() {
                        if (!caretElement.siblings('.typeahead.dropdown-menu').length) {
                            caretElement.siblings().focus();
                        }
                    }

                    unListenCaretElement = listen(caretElement, 'click', whenClickOnCaret)
                    lElement.on('$destroy', function() {
                        unListenCaretElement();
                    });
                };
            }
        };
    }]);
