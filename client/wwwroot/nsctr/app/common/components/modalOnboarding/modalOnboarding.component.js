'use strict';

define([
  'angular', 'constants',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
], function(angular, constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrModalOnboardingController',
    ['$scope', 'mainServices', 'nsctrFactory', 'nsctrService', 'nsctrRoles', '$timeout', 'mpSpin',
    function($scope, mainServices, nsctrFactory, nsctrService, nsctrRoles, $timeout, mpSpin){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # $onInit
      ########################*/
      function _initSlider(){
        mpSpin.start();
        _self.active = 0;
        _self.myInterval = 3000;
        _self.noWrapSlider = true; //true detenido / false loop automatic
        $timeout(function() {
          _self.SHOW_MENU = false;
          mpSpin.end();
        }, 300);
      }
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        _self.firstSlider = _self.firstSlider || {};
        _self.secondSlider = _self.secondSlider || {};

        _self.USER = new nsctrFactory.object.oUser();

        if (_self.USER.isAdmin){
          _self.SHOW_MENU = true;
        }else{
          _self.slider = _self.firstSlider;
          _initSlider();
        }
      };
      /*#########################
      # fnCloseModal
      #########################*/
      function _closeModal(){
        $scope.$emit('fnCloseModalOnboarding');
      }
      _self.fnCloseModal = function(){
        _closeModal();
      };
      /*#########################
      # fnClickSlider
      #########################*/
      _self.fnClickSlider = function(newSlider){
        _self.slider = (newSlider === 'DI')
                          ? _self.firstSlider
                          : _self.secondSlider;
        _initSlider();
      };
      /*#########################
      # fnGoNext
      #########################*/
      _self.fnGoNextFinish = function(isLast){
        if (isLast){
          if (_self.USER.isAdmin){
            _self.SHOW_MENU = true;
          }else{
            _closeModal();
          }
        }else{
          _self.fnGoNext();
        }
      };


  }]).component('nsctrModalOnboarding',{
    templateUrl: '/nsctr/app/common/components/modalOnboarding/modalOnboarding.component.html',
    controller: 'nsctrModalOnboardingController',
    bindings: {
      firstSlider: '=',
      secondSlider: '='
    }
  }).directive('onboardingControls', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var sliderScope = element.isolateScope();
        scope.$ctrl.fnGoPrev = function() {
          sliderScope.prev();
        };
        scope.$ctrl.fnGoNext = function() {
          sliderScope.next();
        };
      }
    };
  });
});