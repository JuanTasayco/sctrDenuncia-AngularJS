/*global angular */
angular.module('closeable', ['ui.bootstrap'])
    .config(['$provide', function ($provide) {
        $provide.decorator('tabsetDirective', function ($delegate, $controller) {
            var tabsetDirective = $delegate[0],
                controllerName = tabsetDirective.controller;

            tabsetDirective.controller = function ($scope) {
                var ctrl = this;

                angular.extend(this, $controller(controllerName, {$scope: $scope}));
                ctrl.removeTab = function removeTab(tab) {
                    var index = ctrl.tabs.indexOf(tab),
                        newActiveIndex;
                    //Select a new tab if the tab to be removed is selected
                    if (tab.active && ctrl.tabs.length > 1) {
                        //If this is the last tab, select the previous tab. else, the next tab.
                        newActiveIndex = index === ctrl.tabs.length - 1 ? index - 1 : index + 1;
                        ctrl.tabs[newActiveIndex].active = true;
                    }
                    ctrl.tabs.splice(index, 1);
                };
            };

            return $delegate;
        });

        $provide.decorator('tabDirective', function ($delegate, $parse) {
            var tabDirective = $delegate[0],
                compile = tabDirective.compile;

            angular.extend(tabDirective.scope, {
                onClose: '&close'
            });

            tabDirective.compile = function () {
                var postLink = compile.apply(this, arguments);

                return function (scope, elm, attrs, tabsetCtrl) {
                    var removeTab,
                        closeButton;

                    postLink.apply(this, arguments);

                    // IE8 FIX. A different attribute from 'disabled' is needed for this to work as intended.
                    if (attrs.tabDisabled) {
                        scope.$parent.$watch($parse(attrs.tabDisabled), function(value) {
                            scope.disabled = !!value;
                        });
                    }

                    if (angular.isDefined(attrs.close) || angular.isDefined(attrs.closeable)) {
                        removeTab = function () {
                            if (scope.disabled) return;

                            scope.$apply(function () {
                                if (angular.isDefined(attrs.closeable)) {
                                    tabsetCtrl.removeTab(scope);
                                    scope.headingElement = false;
                                }

                                if (angular.isDefined(attrs.close)) {
                                    scope.onClose();
                                }
                            });
                        };

                        closeButton = angular.element('<button class="close-tab"></button>')
                            .on('click', removeTab)
                            .on('$destroy', function () {
                                closeButton.off('click', removeTab);
                            });
                        elm.append(closeButton);
                    }
                };
            };

            return $delegate;
        });

        $provide.decorator('tabHeadingTranscludeDirective', function ($delegate) {
            var tabHeadingTranscludeDirective = $delegate[0],
                compile = tabHeadingTranscludeDirective.compile;

            tabHeadingTranscludeDirective.compile = function () {
                var postLink = compile.apply(this, arguments);

                return function (scope, elm) {
                    postLink.apply(this, arguments);

                    scope.$watch('headingElement', function updateHeadingElement(heading) {
                        if (heading) {
                            elm.empty();
                            elm.append(heading);
                        } else if (heading === false) {
                            elm.siblings('.close-tab').remove();
                            elm.remove();
                        }
                    });
                };
            };

            return $delegate;
        });

        $provide.decorator('tabContentTranscludeDirective', function ($delegate) {
            var tabContentTranscludeDirective = $delegate[0];

            function isTabHeading(node) {
                return node.tagName &&  (
                    node.hasAttribute('tab-heading') ||
                    node.hasAttribute('data-tab-heading') ||
                    node.tagName.toLowerCase() === 'tab-heading' ||
                    node.tagName.toLowerCase() === 'data-tab-heading'
                );
            }

            tabContentTranscludeDirective.compile = function () {
                return function (scope, elm, attrs) {

                    var tab = scope.$eval(attrs.tabContentTransclude);

                    //Now our tab is ready to be transcluded: both the tab heading area
                    //and the tab content area are loaded.  Transclude 'em both.
                    tab.$transcludeFn(tab.$parent, function(contents) {
                        angular.forEach(contents, function(node) {
                            if (isTabHeading(node)) {
                                //Let tabHeadingTransclude know.
                                tab.headingElement = node;
                            } else {
                                elm.append(node);
                            }
                        });
                    });
                };
            };

            return $delegate;
        });
    }]);
