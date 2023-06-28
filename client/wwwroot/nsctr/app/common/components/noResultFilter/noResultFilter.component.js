'use strict';

define([
  'angular', 'constants'
], function(angular, constants){

  angular
    .module('appNsctr')
    .controller('nsctrNoResultFilterController', function(){
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # $onInit
      ########################*/
      _self.$onInit = function(){

        var vType = _self.type || 'filter',
            vTypeText = (vType.toUpperCase() === 'SEARCH')
                      ? 'datos ingresados en la búsqueda'
                      : 'filtros escogidos';
        _self.noResultText = _self.noResultText || 'No hay resultados para los ' + vTypeText + '<br> Intente nuevamente.'

      };

    })
    .component('nsctrNoResultFilter',{
      templateUrl: '/nsctr/app/common/components/noResultFilter/noResultFilter.component.html',
      controller: 'nsctrNoResultFilterController',
      bindings: {
        type: '@?',
        noResultInfo: '=',
        noResult: '=',
        noResultText: '=?',
        message: '=',
      }
    });

});