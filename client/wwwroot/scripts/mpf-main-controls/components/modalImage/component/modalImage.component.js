'use strict';

define([
  'angular'
], function(ng){

  ctrlModalImage.$inject = ['$interval'];

  function ctrlModalImage($interval) {

    var vm = this;
    var timer;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.counter = 0;
    
    function onInit() {
      timer = $interval(changeImage, 5000);
   }
   
    function onDestroy() {
      $interval.cancel(timer);
   }

   function changeImage() {
    vm.counter += 1;
    if (vm.counter > vm.imagenes.length - 1) {
      vm.counter = 0;
    }
  }
}

  return ng.module('mapfre.controls')
    .controller('CtrlModalImage', ctrlModalImage)
    .component('mpfModalImage', {
      templateUrl: '/scripts/mpf-main-controls/components/modalImage/component/modalImage.component.html',
      controller: 'CtrlModalImage',
      controllerAs: 'vm',
      bindings: {
        close: '&',
        dismiss: '&',
        imagenes: '='
      }
    });
});
