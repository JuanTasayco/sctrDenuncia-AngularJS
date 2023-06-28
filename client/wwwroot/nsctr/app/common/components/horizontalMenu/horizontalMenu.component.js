'use strict';

define([
  'angular', 'constants',
  'nsctrFactoryJs', 'nsctrServiceJs'
], function(angular, constants){

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrHorizontalMenuController',
    ['$scope', '$state', 'nsctrFactory', 'nsctrService',
    function($scope, $state, nsctrFactory, nsctrService){
      /*#########################
      # _self
      #########################*/
      var _self = this;
      /*#########################
      # _activeCurrentMenu
      #########################*/
      function _activeCurrentMenu() {
        angular.forEach(_self.horizontalMenu, function(menu) {
          menu.actived = menu.activeMenu === $state.current.activeMenu;
        });
      }
      /*#########################
      # $onInit
      #########################*/
      _self.$onInit = function(){

        _self.MODULE = $state.current.module;

        nsctrFactory.menu.proxyMenu.CSGetSubMenu(_self.MODULE.appCode, true).then(function(response){
          _self.horizontalMenu = nsctrFactory.menu.generateMenu(_self.MODULE, response.data || response);

          if (_self.horizontalMenu.length < 7) {
            _self.MORE_OPTIONS = false;
            _self.LIMIT_MENU = 6;
          } else {
            _self.MORE_OPTIONS = true;
            _self.LIMIT_MENU = 5;
          }
          _activeCurrentMenu();
        });

      };
      _self.fnGoPage = function(item) {
        if (item.state) $state.go(item.state, {});
      }
      /*#########################
      # $stateChangeSuccess
      #########################*/
      $scope.$on('$stateChangeSuccess', function() {
        _activeCurrentMenu();
      });

  }]).component('nsctrHorizontalMenu',{
    templateUrl: '/nsctr/app/common/components/horizontalMenu/horizontalMenu.component.html',
    controller: 'nsctrHorizontalMenuController',
    bindings: {
      data: '=?'
    }
  }).directive('mHorizontalMenu',
    ['$document', '$window', '$timeout', '$state',
    function($document, $window, $timeout, $state) {
      return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, element, attrs){

          function _toggleMenu(){
            $('.gHorizontalMenu__responsive').stop(false).slideToggle(function(){
              $('body').toggleClass('g-menu__body', $(this).is(':visible'));
            });
          }
          scope.fnOpenMenuResponsive = function() {
            _toggleMenu();
          };
          function _closeMenu(){
            $('.gHorizontalMenu__responsive').find('.openSubMenu').removeClass('openSubMenu');
            $('.gHorizontalMenu__responsive .sbm-main').hide();
            _toggleMenu();
          }
          scope.fnGoPage = function($e, item){
            if ($e) {
              $e.preventDefault();
              $e.stopPropagation();
            }
            if (item.menu.length > 0){
              var vItem = $($e.currentTarget).toggleClass('openSubMenu');
              if (vItem.hasClass('openSubMenu')){
                $($e.currentTarget).find('.sbm-main').eq(0).slideDown('slow');
              }else{
                $($e.currentTarget).find('.sbm-main').slideUp('slow');
              }
            }else{
              $state.go(item.state, {});
              _closeMenu();
            }

          };

        }
      };
  }]);
});
