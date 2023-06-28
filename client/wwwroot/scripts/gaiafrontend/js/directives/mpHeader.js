/*global angular */
angular.module('mpHeader', [])
/**
    * @doc-component directive
    * @name gaiafrontend.directive.mpHeader
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
    .directive('mpHeader', ['Utils', function(Utils) {
        return {
            replace: true,
            transclude: true,
            templateUrl: 'gaiafrontend/html/header.html',
            compile: function(elem, attrs) {
                var mpNavBar,
                    header = angular.element('#mp-header');

                if (attrs.hasOwnProperty('mpHeaderMenu')) {
                    mpNavBar = angular.element('<div>');
                    mpNavBar.attr('mp-navbar', attrs.mpHeaderMenu);
                    mpNavBar.attr('mp-navbar-options', '{showOnClick: true}');
                    elem.find('#mp-header').prepend(mpNavBar);
                }

                if (attrs.hasOwnProperty('mpHeaderMenuFilter')) {
                    mpNavBar = angular.element('<div>');
                    mpNavBar.attr('mp-navbar-filter', attrs.mpHeaderMenuFilter);
                    elem.find('#mp-header').prepend(mpNavBar);
                }

                elem.find('#mp-header .navbar-brand-group span.navbar-app').html(attrs.mpHeader);


                angular.element('button.navbar-toggle').on('click', function(event) {
                    if (Utils.platform.isIE8()) {
                        if (header.height() > 1) {
                            event.stopPropagation();
                            headerAnimate();
                            header.toggleClass('in');
                        }
                    }
                });

                angular.element('div.app-content-container').on('click', function() {
                    if (header.hasClass('in')) {
                        header.toggleClass('in');
                        headerAnimate();
                    }
                });

                function headerAnimate() {
                    header.animate({
                        height: '1px'
                    }, 'fast');
                }

                return function(scope, elem, attrs) {
                    scope.title = attrs.mpHeader;

                    function hasNoNavbars() {
                        return elem.find('[class^="navbar-"]').length === 5 && elem.find('[mp-navbar]').length === 0;
                    }

                    if (hasNoNavbars()) {
                        elem.find('.navbar-header').remove();
                    }
                };
            }
        };
    }]);
