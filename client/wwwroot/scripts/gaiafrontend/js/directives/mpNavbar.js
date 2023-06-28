/**
 * @doc-component directive
 * @name gaiafrontend.directive.mpNavbar
 * @param {expression} mp-navbar Expression to evaluate. The result of the evaluation can be an array or an object. In case of array the navigation bar will be rendered horizontally. In case of object the navigation bar will be rendered vertically.
 * @param {expression=} mp-navbar-options The result of the expression must be a smartmenus options Object. Visit [smartmenus official docs](http://www.smartmenus.org/docs/ "smartmenus docs") for info.
 * @description
 *
 * The `mpNabvar` directive allows you to display a vertical or horizontal navigation bar (depending on the result of the evaluation of mpNavbar attribute value).
 *
 * This directive uses the following javascript libraries:
 *
 * - To *dropdown* navigation bar items Bootstrap v3.1.1 dropdown jQuery plugin is asynchronously loaded.
 * - To *dropdown* nested navigation bar items SmartMenus v0.9.6 jQuery plugin is asynchronously loaded.
 * - To associate these two plugins an *ad hoc* addon is asynchronously loaded.
 *
 * The navigation bar items are objects with the following properties:
 *
 * - `class`: String expression to eval. The result of the evaluation can be a string representing space delimited class names, an array, or a map of class names to boolean values. In the case of a map, the names of the properties whose values are truthy will be added as css classes to the element. It will be assigned to the `li` as `ng-class`.
 * - `divider`: If truthy the `li` will have `.divider` class and no content.
 * - `header`: If truthy the `li` will have `.dropdown-header` class with `text` property as content.
 * - `disabled`: If truthy the `li` and the `a` will have `.disabled` class.
 * - `text`: String containing the text content of `a` if `header` property is falsy. String containing the text content of `li` if `header` property is truthy.
 * - `link`: String containing the `href` property of `a`. If falsy the `a` will not navigate (link default behaviour is prevented).
 * - `click`: Angular expression to evaluate upon click. It will be assigned to the `a` as `ng-click`.
 * - `list`: Array of navigation bar items.
 *
 * The directive operate in two different ways, depending on which of the two types the expression evaluates to:
 *
 * - If the expression evaluates to an array, each element of the array should be an *item format* object.
 * - If the expression evaluates to an object, it should be an *item format* object.
 *
 * When the expression changes, the previous navigation bar items will be replaced with the new navigation bar items.
 *
 * @example
   <doc:example module="mpNavbar">
    <doc:source>
    json =[{"text":"Google.com","link":"https://www.google.com/"},{"text":"Other search engines","list":[{"header":true,"text":"Microsoft's"},{"text":"Bing","link":"https://www.bing.com/","disabled":true},{"divider":true},{"header":true,"text":"Yahoo!'s"},{"text":"Yahoo!","link":"http://search.yahoo.com/"}]}]
    div(mp-navbar=JSON.stringify(json), mp-navbar-options="{showOnClick: true}")
    </doc:source>
   </doc:example>
 */
/*global angular, _ */
angular.module('mpNavbar', [])
    .directive('mpNavbar', ['$compile', '$parse', '$timeout', 'Loader',
        function($compile, $parse, $timeout, Loader) {
            var loadPlugin = Loader.load,
                bootstrapFile = 'bootstrap.js',
                pluginFile = 'jquery.smartmenus.tweaked.js',
                addOnFile = 'jquery.smartmenus.bootstrap.tweaked.js';

            return {
                templateUrl: 'gaiafrontend/html/navbar.html',
                replace: true,
                link: function(scope, elem, attrs) {

                    function addBehaviour() {
                        elem.bootstrappedSmartmenus($parse(attrs.mpNavbarOptions)(scope) || {});
                    }

                    function createNavbarItem(item) {
                        var navbarItem = angular.element('<li>'),
                            link;

                        if (item['class']) {
                            navbarItem.attr('ng-class', item['class']);
                        }

                        if (item.divider) {
                            navbarItem.addClass('divider');
                            return navbarItem;
                        }

                        if (item.header) {
                            navbarItem.addClass('dropdown-header');
                            navbarItem.text(item.text || '');
                            return navbarItem;
                        }

                        // Link is created only if the navbar item is NOT a header or a divider

                        link = angular.element('<a>');

                        if (item.disabled) {
                            navbarItem.addClass('disabled');
                            link.addClass('disabled');
                        }

                        if (item.text) {
                            link.text(item.text);
                        }

                        if (item.click) {
                            link.attr('ng-click', item.click);
                        }

                        if (item.link) {
                            link.attr('href', item.link);
                        } else {
                            // Prevent navigation
                            link.on('click', function (event) {
                                event.preventDefault();
                            });
                        }

                        navbarItem.append(link);

                        // Subnavbars are created if the navbar item is NOT a header or a divider

                        if (item.list) {
                            navbarItem.append(createSubNavbar(item.list));
                        }

                        return navbarItem;
                    }

                    function forceArray(object) {
                        return [].concat(object);
                    }

                    function createNavbarItems(items) {
                        var navbarItems = [];

                        angular.forEach(forceArray(items), function(item) {
                            navbarItems.push(createNavbarItem(item));
                        });

                        return navbarItems;
                    }

                    function createSubNavbar(items) {
                        var subNavbar = angular.element('<ul class="dropdown-menu">'),
                            navbarItems = createNavbarItems(items);

                        subNavbar.append(navbarItems);

                        return subNavbar;
                    }

                    function prepareNavbar(items) {
                        var alignment;

                        if (_.isArray(items)) {
                            alignment = 'horizontal';
                        } else if (_.isPlainObject(items)) {
                            alignment = 'vertical';
                        }

                        if (alignment) {
                            elem.addClass('navbar-' + alignment);
                        }

                        if (elem.closest('.navbar-collapse').length === 0) {
                            elem.addClass('navbar-external');
                        }
                    }

                    function prepareNavbarContent(items) {
                        elem.html(createNavbarItems(items));
                        $compile(elem.contents())(scope);
                    }

                    function updateNavbar(items) {
                        if (angular.isObject(items)) {
                            prepareNavbar(items);
                            prepareNavbarContent(items);
                            $timeout(addBehaviour, 500);
                        }
                    }

                    function watchNavbarItems() {
                        scope.$watch(attrs.mpNavbar, updateNavbar, true);
                    }

                    function initNavbar() {
                        watchNavbarItems();
                    }

                    loadPlugin(bootstrapFile).then(function() {
                        loadPlugin(pluginFile).then(function() {
                            loadPlugin(addOnFile).then(function(){
                                initNavbar();
                            });
                        });
                    });

                }
            };
        }]);
