/*global angular, _ */
(function() {
    function tabTitle($parse, $filter, $window, Utils) {
        var computedWidth = 0
        return {
            restrict: 'A',
            scope: {
                mpOnClose: '=',
                title: '@',
                ngDisabled: '&'
            },
            controller: ['$scope', function($scope) {

            }],
            link: function(scope, elements, attrs) {
                var closeButton = angular.element("<span class='closeable'></span>"),
                    titleLayer = angular.element('<span class="truncate"></span>'),
                    attrTitle = attrs.title.replace('@@', ''),
                    computedTabs = angular.element('li.tab-title'),
                    width = angular.element('ul.tabSet').width(),
                    finalTabWidth = parseInt(width / computedTabs.length, 10),
                    mediaMatch = window.matchMedia('(max-width: 800px)').matches;

                elements.append(titleLayer);

                scope.$parent.$watch(attrs.ngDisabled, function(newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (elements.hasClass('disabled'))
                            elements.removeClass('disabled');
                        else
                            elements.addClass('disabled')
                    }
                });


                if (_.has(scope.$parent, attrs.title)) {
                    scope.$parent.$watch(attrs.title, function(newValue, oldValue) {
                        //elements.append('<span class="truncate">' + newValue + '</span>');
                        titleLayer.text(newValue);
                        computedWidth += angular.element(elements).width();
                    });
                } else {
                    //elements.html('<span class="truncate">' + $filter('translate')(attrTitle) + '</span>');
                    titleLayer.text($filter('translate')(attrTitle));
                    computedWidth += angular.element(elements).width();
                }

                scope.$parent.$watch(attrs.closeable, function() {
                    if (attrs.closeable === 'true' && !elements.hasClass('disabled')) {
                        elements.append(closeButton);
                    }
                });


                function setTabWidth(elem, computed) {
                    if (!angular.isUndefined(computed)) {
                        elements = elem;
                        computedTabs = computed;
                    }

                    if (computedWidth > width && !mediaMatch) {
                        var finalTabWidth = parseInt(width / computedTabs.length, 10)
                        angular.element(elements).outerWidth(finalTabWidth - 1);
                    }
                }

                function removedTabWidth() {
                    var computedTabs = angular.element('li.tab-title');
                    _.forEach(computedTabs, function(tab) {
                        setTabWidth(tab, computedTabs);
                    });
                }

                scope.tabToRemove = function() {
                    if (elements.hasClass('active')) {
                        var tabSelectable = angular.element("li.tab-title[disabled!='disabled']");
                        tabSelectable.each(function(index, value) {
                            if (!angular.element(value).hasClass('active')) {
                                angular.element(value).trigger('click');
                                return false;
                            }
                        });
                    }
                    if (_.has(attrs, 'mpOnClose'))
                        scope.mpOnClose();

                    elements.next().remove();
                    elements.remove();
                    removedTabWidth();
                };

                closeButton
                    .on('click', function(event) {
                        scope.tabToRemove();
                        event.stopPropagation();
                    })
                    .on('$destroy', function() {
                        closeButton.off('click', scope.tabToRemove);
                    })

                if (Utils.platform.isTactile()) {
                    angular.element(window).on("orientationchange", function(event) {
                        setTabWidth();
                    });
                } else {
                    angular.element(window).on("resize", function(event) {
                        setTabWidth();
                    });
                }

                setTabWidth();
            }
        }
    }
    (angular.module('tabTitle', []))
    .directive('tabTitle', ['$parse', '$filter', '$window', 'Utils', tabTitle])
}());
