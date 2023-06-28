/**
* @doc-component directive
* @name gaiafrontend.directive.mpCarouselNavigator
* @param {object} mp-carousel-navigator-options           An object with the options to configure the carousel; posible options are: **visibleItems** and **responsive**. Further info look below
* @param {expression=} is-closed Allows Allows open or close the component since beginning.
*
* Is necessary to add the visibility options of the carousel in the controller. In visible items, is necesary to add the maximum number of items in screen. The parameter "visibleItems" must be equal to the paramter "items" for resolution of 1400, them, we can add the number of items we want to see in each resolution.
* **Items** from the array **mp-carousel-navigator-items** must have the following properties
*
* @param {[objects]} mp-carousel-navigator-items          An array with the items that the carousel will display.
*
* - `name`          : Text to display in the link.
* - `imgSrc`        : Default image in the link.
* - `imgActive`     : Image in active state.
* - `afterClickFn`  : A callback function that's is going to be called after a item is been marked as active ( if you plan to use is as a navigator, you may call the state service to change the current state path)
*   It receives the following as parameters `(event, currentActiveItem, OwlPluginInstance)`.
*
* @param {Number} mp-carousel-navigator-active-item-index - This variable / `ngModel` is binded to the current active item index. It will change if the you select a new item in the carousel
* , and it will change the carousel current active item if it's changed programmaticly triggering the `afterClickFn`
* Like the JavaScript onchange event which only triggers at the end of a change (usually, when the user leaves the form element or presses the return key).
*
* @description
* Component mp-carousel-navigator is a responsive, mobile featured (swipe, etc...) and fully customizable.
* @example
  <doc:example module="mpCarouselNavigator">
    <doc:source>
    script
        function MyCtrl($scope) {
            'use strict';
            $scope.items = [
                {
                    name        : 'Agrupaciones'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-agrupaciones.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-agrupaciones-big.png'
                    , afterClickFn : function() { console.log('Agrupaciones'); }
                }, {
                    name           : 'Selección'
                    , imgSrc       : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-seleccion.png'
                    , imgActive    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-seleccion-big.png'
                    , afterClickFn : function() { console.log('Selección'); }
                }, {
                    name        : 'Datos anulación'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-anulaciones.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-anulaciones-big.png'
                    , afterClickFn : function() { console.log('Datos anulación'); }
                }, {
                    name        : 'Coaseguro'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-coaseguro.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-coaseguro-big.png'
                    , afterClickFn : function() { console.log( 'Coaseguro'); }
                }, {
                    name        : 'Garantías del contrato'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-garantias.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-garantias-big.png'
                    , afterClickFn : function() { console.log( 'Garantías del contrato'); }
                }, {
                    name        : 'Grupos'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-grupo.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-grupo-big.png'
                    , afterClickFn : function() { console.log( 'Grupos'); }
                }, {
                    name        : 'Movilizaciones'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-movilizaciones.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-movilizaciones-big.png'
                    , afterClickFn : function() { console.log( 'Movilizaciones'); }
                }, {
                    name        : 'Prestaciones y rescates'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-prestaciones.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-prestaciones-big.png'
                    , afterClickFn : function() { console.log( 'Prestaciones y rescates'); }
                }, {
                    name        : 'Productores'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-productores.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-productores-big.png'
                    , afterClickFn : function() { console.log( 'Productores'); }
                }, {
                    name        : 'Reajustes'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-reajustes.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-reajustes-big.png'
                    , afterClickFn : function() { console.log( 'Reajustes'); }
                }, {
                    name        : 'Renovación'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-renovacion.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-renovacion-big.png'
                    , afterClickFn : function() { console.log( 'Renovación'); }
                }, {
                    name        : 'Selección'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-seleccion.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-seleccion-big.png'
                    , afterClickFn : function() { console.log( 'Selección'); }
                }, {
                    name        : 'Textos'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-texto.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-texto-big.png'
                    , afterClickFn : function() { console.log( 'Textos'); }
                }, {
                    name        : 'Tomador'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-tomador.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-tomador-big.png'
                    , afterClickFn : function() { console.log( 'Tomador'); }
                }, {
                    name        : 'Primas y recibos'
                    , imgSrc    : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-primas-recibos.png'
                    , imgActive : '/gaiafrontend/img/ico-navbar-bottom/mp-ico-primas-recibos-big.png'
                    , afterClickFn : function() { console.log( 'Primas y recibos'); }
                }
            ];
            $scope.options = {
                visibleItems: 9
                , responsive : {
                    0 : {
                      items:1
                    }
                    , 480:{
                      items:3
                    }
                    , 768:{
                      items:5
                    }
                    , 1028:{
                      items:7
                    }
                    , 1400:{
                      items:9
                    }
                }
            };

            $scope.to = function(ix) {
                $scope.activeItemIndex = ix;
                $scope.test = ix;
            };
        }
        MyCtrl.$inject = ["$scope"];

    div(ng-controller="MyCtrl")
        button(ng-click="to(2)") @@carousel_navigator_go_to 2
        button(ng-click="to(3)") @@carousel_navigator_go_to 3
        button(ng-click="to(9)") @@carousel_navigator_go_to 9
        button(ng-click="to(0)") @@carousel_navigator_go_to 0

        p @@carousel_navigator_change_input_text <input ng-init="activeItemIndex = 1" ng-model="activeItemIndex" />
        div(mp-carousel-navigator, mp-carousel-navigator-active-item-index="activeItemIndex", mp-carousel-navigator-options="options", mp-carousel-navigator-items="items")
    </doc:source>
  </doc:example>
*/
/*global angular, _*/
/*jshint laxcomma: true*/
angular.module('mpCarouselNavigator', []).directive('mpCarouselNavigator', ['$parse', '$timeout', 'Loader',
    function($parse, $timeout, Loader) {
        var loadPlugin = Loader.load;
        return {
            replace: true,
            templateUrl: 'gaiafrontend/html/carouselNavigator.html',
            link: function(scope, elem, attrs) {
                var items,
                    options,
                    jQitems,
                    jQinnerArrows,
                    jQoutterArrows,
                    itemsLength,
                    jQtoggleOpen,
                    isClosed = attrs.isClosed,
                    owl,
                    activeItemIndex = 0,
                    activeItemIndexSetter,
                    unWatchMpCarouselNavigatorActiveItemIndex,
                    unWatchMpCarouselNavigatorItems,
                    rendered = false,
                    unWatchMpCarouselNavigatorOptions;

                function onDestroy() {
                    // TODO: REVIEW! THESE OFF-EVENTs ARE NOT WORKING
                    jQtoggleOpen.off('click');
                    jQoutterArrows.next.off('click');
                    jQoutterArrows.prev.off('click');
                    jQinnerArrows.next.off('click');
                    jQinnerArrows.prev.off('click');
                    jQitems.off('changed.owl.carousel');
                    elem.off('click');
                    elem.off('changed.owl.carousel');
                    jQitems.off('initialized.owl.carousel');
                    jQitems.off('refreshed.owl.carousel');

                    unWatchMpCarouselNavigatorActiveItemIndex();
                    if (_.isFunction(unWatchMpCarouselNavigatorItems)) {
                        unWatchMpCarouselNavigatorItems();
                    }
                    if (_.isFunction(unWatchMpCarouselNavigatorOptions)) {
                        unWatchMpCarouselNavigatorOptions();
                    }
                    if (rendered) {
                        owl.trigger('destroy.owl.carousel');
                        rendered = false;
                    }
                }

                function itemOnClickFn(e) {
                    var activeItem = items[activeItemIndex];
                    if (activeItem && activeItem.afterClickFn && _.isFunction(activeItem.afterClickFn)) {
                        activeItem.afterClickFn.apply(this, arguments);
                    }
                    e.stopImmediatePropagation();
                }

                function getIndex(newActiveItem) {
                    var ix;
                    if (newActiveItem !== undefined) {
                        ix = Number(newActiveItem);
                        ix = (_.isNaN(newActiveItem) ? 0 : newActiveItem);
                    } else {
                        ix = activeItemIndex;
                    }
                    if (ix < 0) {
                        ix += itemsLength;
                    }
                    ix = ix % itemsLength;
                    return ix;
                }

                function updateActiveIndex() {
                    activeItemIndex = getIndex();
                    if (!scope.$$phase) {
                        scope.$apply(function() {
                            activeItemIndexSetter(scope, activeItemIndex);
                        });
                    }
                }

                function attachOnClickToItems(e) {
                    jQitems.find('[data-owlix]').on('click', function(event) {
                        var ix = angular.element(this).data('owlix');
                        activeItemIndex = ix;
                        updateActiveIndex();
                        event.stopImmediatePropagation();
                    });
                    e.stopImmediatePropagation();
                }

                function getOwlCarouselOptions() {
                    return {
                        items: options.visibleItems || 9,
                        loop: (typeof options.infiniteLoop === 'boolean' ? options.infiniteLoop : true),
                        center: true,
                        margin: 10,
                        //, callbacks     : true
                        responsive: options.responsive || {},
                        dots: false,
                        video: false,
                        mouseDrag: false,
                        touchDrag: false
                        //, onChanged     : onChangedFn
                        //, onInitialized : function() {
                        //attachOnClickToItems();
                        //}
                    };
                }

                function moveTo(ix, jump) {
                    var speed = (jump === undefined ? 300 : 0);
                    ix = (_.isNaN(ix) ? 0 : ix);
                    owl.trigger('to.owl.carousel', ix, speed);
                }

                function watchActiveItemIndex(newActiveItem) {
                    activeItemIndex = getIndex(newActiveItem);
                    moveTo(activeItemIndex);
                }

                function moveNext(event) {
                    activeItemIndex = getIndex(activeItemIndex + 1);
                    updateActiveIndex();
                    event.stopImmediatePropagation();
                }

                function movePrev(event) {
                    activeItemIndex = getIndex(activeItemIndex - 1);
                    updateActiveIndex();
                    event.stopImmediatePropagation();
                }

                function carouselVisibility(value) {
                    if (value) {
                        elem.removeClass('open');
                    } else {
                        elem.addClass('open');
                    }
                }

                function addExtraEvents() {
                    function onPrev(event) {
                        movePrev(event);
                    }
                    function onNext(event) {
                        moveNext(event);
                    }
                    function onOpen() {
                        isClosed = !isClosed;
                        carouselVisibility(isClosed);
                    }
                    if (!rendered) {
                        jQoutterArrows.prev.on('click', onPrev);
                        jQoutterArrows.next.on('click', onNext);
                        jQinnerArrows.prev.on('click', onPrev);
                        jQinnerArrows.next.on('click', onNext);
                        jQtoggleOpen.on('click', onOpen);
                        elem.on('changed.owl.carousel', itemOnClickFn);
                        jQitems.on('refreshed.owl.carousel', attachOnClickToItems);

                        unWatchMpCarouselNavigatorActiveItemIndex = scope.$watch(attrs.mpCarouselNavigatorActiveItemIndex, watchActiveItemIndex);
                    }
                }

                function initializePlugin() {
                    if (!rendered) {
                        // owl.carousel requires to attach initialized event before initializePlugin.
                        jQitems.on('initialized.owl.carousel', attachOnClickToItems);
                        owl = jQitems.owlCarousel(getOwlCarouselOptions());
                        activeItemIndex = activeItemIndex || 0;
                    }
                    moveTo(activeItemIndex, true);
                    // rendered = true;
                }

                function generateItemA(item) {
                    var imgEl, spanEl,
                        aEl = angular.element('<a></a>');

                    if (item.imgSrc) {
                        imgEl = angular.element('<img />');
                        imgEl.addClass('default');
                        imgEl.attr('src', item.imgSrc);
                        aEl.append(imgEl);
                    }
                    if (item.imgActive) {
                        imgEl = angular.element('<img />');
                        imgEl.addClass('big');
                        imgEl.attr('src', item.imgActive);
                        aEl.append(imgEl);
                    }
                    if (item.name) {
                        spanEl = angular.element('<span>');
                        spanEl.addClass('text');
                        spanEl.text(item.name);
                        aEl.append(spanEl);
                    }

                    return aEl;
                }

                function generateItem(item, ix) {
                    var el = angular.element('<div></div>');

                    el.attr('data-owlix', ix);
                    el.append(generateItemA(item, ix));
                    //generateItemAClick(el, item, ix);

                    return el;
                }

                function generateItems() {
                    angular.forEach(items, function(item, ix) {
                        jQitems.append(generateItem(item, ix));
                    });
                }

                function initializeElements() {
                    options = $parse(attrs.mpCarouselNavigatorOptions)(scope);
                    items = $parse(attrs.mpCarouselNavigatorItems)(scope);
                    itemsLength = (items ? (items.length || 0) : 0);
                    activeItemIndex = $parse(attrs.mpCarouselNavigatorActiveItemIndex)(scope);
                    activeItemIndexSetter = $parse(attrs.mpCarouselNavigatorActiveItemIndex).assign;
                    jQitems = elem.find('.mp-owl-carousel');
                    jQtoggleOpen = elem.find('.mp-toggle');
                    jQoutterArrows = {
                        prev: elem.find('.mp-arrows-outter').find('.prev'),
                        next: elem.find('.mp-arrows-outter').find('.next')
                    };
                    jQinnerArrows = {
                        prev: elem.find('a.inner.prev'),
                        next: elem.find('a.inner.next')
                    };
                }

                function hasItemsToRender() {
                    return (itemsLength > 0);
                }

                function paint() {
                    generateItems();
                    initializePlugin();
                    addExtraEvents();
                    rendered = true;
                    elem.on('$destroy', onDestroy);
                }

                function watchItemsAndOptions() {
                    unWatchMpCarouselNavigatorItems = scope.$watch(attrs.mpCarouselNavigatorItems, function() {
                        items = $parse(attrs.mpCarouselNavigatorItems)(scope);
                        itemsLength = (items ? (items.length || 0) : 0);
                        if (hasItemsToRender()) {
                            paint();
                        }
                    }, true);
                    unWatchMpCarouselNavigatorOptions = scope.$watch(attrs.mpCarouselNavigatorOptions, function() {
                        options = $parse(attrs.mpCarouselNavigatorOptions)(scope);
                        if (hasItemsToRender()) {
                            paint();
                        }
                    }, true);

                    isClosed = !!$parse(attrs.isClosed)(scope);
                    carouselVisibility(isClosed);
                }

                function main() {
                    initializeElements();
                    if (hasItemsToRender()) {
                        paint();
                    }
                    watchItemsAndOptions();
                }

                loadPlugin('owl.carousel.tweaked.js').then(main);
            }
        };
    }
    ]);
