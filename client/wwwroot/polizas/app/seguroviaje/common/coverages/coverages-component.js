'use strict';

define([
  'angular'
  ], function(ng) {

  CoveragesComponentController.$inject = ['$scope', '$rootScope', '$timeout'];

   function CoveragesComponentController($scope, $rootScope, $timeout) {
    var vm = this;
    vm.$onInit = onInit;

    function onInit(){
      $scope.$on('coverturas', function(event, value){
        vm.coverturas = value.coverturas
        vm.nameProduct = value.nameProduct
        vm.namePlan = value.namePlan
        vm.prima = value.prima
      })
      vm.coverturaLimit = 7;
      vm.showMoreCoverages = showMoreCoverages;

    }
    // Metodo para ampliar/contraer la parrilla de coverturas
    function showMoreCoverages(){
      vm.coverturaLimit = vm.coverturaLimit == 7 ? 99 : 7;
      $timeout(function(){
        $rootScope.setHeight();
      })
    }
  }
  return ng.module('appSeguroviaje')
    .controller('CoveragesComponentController', CoveragesComponentController)
    .component('coveragesComponent', {
      templateUrl: '/polizas/app/seguroviaje/common/coverages/coverages-component.html',
      controller: 'CoveragesComponentController as vm',
      bindings: {
        submit : '=',
        show : '='
      }
    })
    .directive('coveragesComponent', function ($rootScope) {
      return {
        restrict: 'E',
        link: function ($scope, element, attrs) {

          $rootScope.setHeight = setHeight;

          $(window).resize(function(){
            setHeight()
          })

          // Este metodo sirve para ajustar la altura de las celdas de las parrillas de coverturas, ya que estan maquetadas
          // como listas e intuitivamente no se ajustan sus dimenciones(esto debido a que las parrillas fueron maquetadas
          // pensado en tabs y no como tablas), este metodo funciona para hacer dicho ajuste dinamicamente.
          function setHeight(){
            var vw = $(window).width()
            var coberturaRows = $('.tab-content .tab-pane:nth-child(1)').find('ul li');
            var activeRows = $('.tab-content .tab-pane.active').find('ul li');
            var headHeightActive = $('.tab-content .tab-pane.active').find('.col-coti-head').height();
            $('.tab-content .tab-pane ul li').css({'height' : 'initial'});

            vw < 991 ?  $('.tab-content .tab-pane').css({'padding-top' : headHeightActive + 'px'}) : '';

            $(coberturaRows).each(function(i, liCob){
              $(activeRows).each(function(j, liActive){
                if(i == j){
                  var maxHeight = Math.max($(liCob)[0].offsetHeight, $(liActive)[0].offsetHeight)
                  $(liCob).css({'height' : maxHeight + 'px'})
                  $(liActive).css({'height' : maxHeight + 'px'})
                }
              })
            })
          }
        }
      }
    })
});
