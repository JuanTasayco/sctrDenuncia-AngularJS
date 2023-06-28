'use strict';

define(['angular', 'jquery', 'coreConstants', 'system'], function(ng, $, coreConstants, system) {
  var folder = system.apps.ap.location;

  CarouselComponent.$inject = ['$scope', '$timeout'];
  function CarouselComponent($scope, $timeout) {
    var vm = this;
    var watchItems, owlCarousel;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    function onInit() {
      _watcherItems();
    }

    function onDestroy() {
      watchItems();
      owlCarousel.trigger('destroy.owl.carousel');
    }

    function _watcherItems() {
      watchItems = $scope.$watch('$ctrl.items', function(nv, ov) {
        if (!nv) {
          return void 0;
        }
        _initOwlCarousel();
      });
    }

    function _initOwlCarousel() {
      // HACK: wait for dom
      $timeout(function() {
        // HACK: error with ng.element
        // eslint-disable-next-line angular/angularelement
        owlCarousel = $('.owl-carousel');
        owlCarousel.owlCarousel({
          dots: false,
          items: 1,
          lazyLoad: true,
          loop: true,
          nav: true
        });
      });
    }
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('CarouselComponent', CarouselComponent)
    .component('apCarousel', {
      templateUrl: folder + '/app/carousel-tray/components/carousel/carousel.component.html',
      controller: 'CarouselComponent',
      bindings: {
        items: '=?'
      }
    });
});
