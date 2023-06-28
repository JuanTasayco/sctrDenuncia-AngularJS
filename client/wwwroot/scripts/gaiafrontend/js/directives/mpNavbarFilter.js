angular.module('mpNavbarFilter', [])
    .directive('mpNavbarFilter', ['$compile', '$parse',
        function($compile, $parse) {
            return {
                templateUrl: 'gaiafrontend/html/navbarFilter.html',
                link: function(scope, element, attrs) {
                    var searchIconContainer = element.find('.input-group-addon'),
                        searchIcon = element.find('span .glyphicon-search'),
                        arrowIcon = element.find('span .glyphicon-chevron-left'),
                        searchBox = element.find('input'),
                        itemContainer = element.find('.item-container'),
                        documentElem = angular.element(document);

                    scope.items = $parse(attrs.mpNavbarFilter)(scope);

                    function createMenuItemLink(item) {
                        var itemLink = angular.element('<a></a>')

                        if (item.disabled) {
                            itemLink.addClass('disabled');
                        }

                        if (item.text) {
                            itemLink.text(item.text);
                        }

                        if (item.click) {
                            itemLink.attr('ng-click', item.click);
                        }

                        if (item.link) {
                            itemLink.attr('href', item.link);
                        } else {
                            // Prevent navigation
                            itemLink.on('click', function(event) {
                                event.preventDefault();
                            });
                        }
                        return itemLink;
                    }

                    function createSubMenuItem(item) {
                        var items = item.list.length > 1 ? item.list : item.list[0].list,
                            subItems = [];

                        angular.forEach(items, function(item) {
                            subItems.push(item)
                        });

                        return subItems;
                    }

                    scope.createMenuItem = function(item) {
                        var menuItem = angular.element('<li>');

                        if (item['class']) {
                            menuItem.attr('ng-class', item['class']);
                        }

                        if (item.divider) {
                            menuItem.addClass('divider');
                            return menuItem;
                        }

                        if (item.header) {
                            menuItem.addClass('dropdown-header');
                            menuItem.text(item.text || '');
                            return menuItem;
                        }

                        menuItem.append(createMenuItemLink(item));

                        if (item.list) {
                            angular.forEach(createSubMenuItem(item), function(item) {
                                menuItem.append(createMenuItemLink(item));
                            });
                        }

                        return menuItem.html();
                    }

                    function unlisten(element, event, listener) {
                        element.off(event, listener);
                        element = null;
                    }

                    function listen(element, event, listener) {
                        element.on(event, listener);
                        return function() {
                            unlisten(element, event, listener);
                        }
                    }

                    function manageSearchBoxStyles() {
                        searchIconContainer.toggleClass('position');
                        searchIcon.toggleClass('display');
                        arrowIcon.toggleClass('display');
                        searchBox.toggleClass('active');
                    }

                    function hideSearchBox() {
                        searchIconContainer.removeClass('position');
                        searchIcon.removeClass('display');
                        arrowIcon.addClass('display');
                        searchBox.removeClass('active');
                    }

                    function manageItemsContainerStyles() {
                        if(searchBox.val().length > 0) {
                            itemContainer.addClass('open');
                        }
                        if(searchBox.val().length === 0) {
                            itemContainer.removeClass('open');
                        }
                    }

                    var listenerForSearchBox = listen(searchBox, 'input', manageItemsContainerStyles),
                        listenerForShowItemsContainer = listen(searchBox, 'focus', manageItemsContainerStyles),
                        listenerForSearchIcon = listen(searchIconContainer, 'click', function () {
                            manageSearchBoxStyles();
                            if (searchBox.hasClass('active')) {
                                searchBox.focus();
                            }
                            if (searchBox.hasClass('active') && searchBox.val().length > 0) {
                                itemContainer.addClass('open');
                            }
                        }),
                        listenerForHideItemsContainer = listen(documentElem, 'click', function (event) {
                            if (event.target !== searchBox[0]) {
                                itemContainer.removeClass('open');
                            }
                        }),
                        watcherForItmesContainer = scope.$watch(function () {
                            return element.find('[mp-navbar]').data('smartmenus');
                            }, function (smartmenus) {
                                if (smartmenus) {
                                    var oldMenuShow = smartmenus.menuShow;
                                    // Sobreescribe el metodo menuShow del plugin smartmenus
                                    smartmenus.menuShow = function ($sub) {
                                        oldMenuShow.call(element.find('[mp-navbar]').data('smartmenus'), $sub);
                                        itemContainer.removeClass('open');
                                    };
                                    watcherForItmesContainer();
                                }
                            });

                    scope.$on('$stateChangeSuccess', function() {
                        hideSearchBox();
                        searchBox.val('');
                    });

                    element.on('$destroy', function() {
                        listenerForSearchIcon();
                        listenerForSearchBox();
                        listenerForShowItemsContainer();
                        listenerForHideItemsContainer();
                    });
                }
            }
        }
    ])
    .filter('navbarFilter', function() {
        return function(items, search) {
            var results= [];
            if(!search || search === '') {
                return items;
            }
            (function filter (items, collection) {
                collection.push.apply(collection, _.filter(items, function (item) {
                    if (item.list) filter(item.list, collection);
                    return item.text && item.text.toLowerCase().search(search.toLowerCase()) >= 0;
                }));
            }(items, results));
            return results;
        }
    })
