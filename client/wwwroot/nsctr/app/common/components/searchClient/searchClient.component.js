'use strict';

define([
  'angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrRolesJs',
  'nsctrServiceJs',
  'nsctrFactoryJs',
  'nsctrColFilterJs',
  'nsctrNoResultFilterJs'
], function(angular, constants, nsctr_constants) {
  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrSearchClientController',
    ['$scope', '$window', '$state', '$timeout', 'nsctrFactory', 'nsctrService', 'mainServices',
    '$anchorScroll', 'mModalAlert', 'proxyClient', 'gaService',
    function($scope, $window, $state, $timeout, nsctrFactory, nsctrService, mainServices,
    $anchorScroll, mModalAlert, proxyClient, gaService) {
      /*########################
      # _self
      ########################*/
      var _self = this;
      _self.message = "No hay resultados para los filtros escogidos. Intente nuevamente."
      /*########################
      # fnFilter
      ########################*/
      function _clearFilteredClients(isPagination){
        _self.data.dataList.setDataList();
        _self.data.mPagination.setTotalItems(0);
        if (!isPagination) _self.data.mPagination.setCurrentPage(1);
      }
      function _paramsServicesPagingClient(params){
        params.currentPage = _self.data.mPagination.currentPage;
        return params;
      }
      function _filterClients(params){
        _self.noResultFilter.setNoResultFilter(false, false);
        var vParams = _paramsServicesPagingClient(params);
        proxyClient.ServicesPagingClient(vParams, true).then(function(response) {
          if (response.operationCode === constants.operationCode.success) {
            if (response.data.list.length > 0) {
              _self.data.dataList.setDataList(response.data.list, response.data.totalRows, 0, response.data.totalPages);
              _self.data.mPagination.setTotalItems(_self.data.dataList.totalItemsPagination);
              $anchorScroll();
            }else{
              _self.message = response.message;
              _self.noResultFilter.setNoResult(true);
            }
          }else{
            _self.message = response.message;
            _self.noResultFilter.setNoResult(true);
          }
        }, function() {
          _self.message = response.message;
          _self.noResultFilter.setNoResult(true);
        });
      }
      $scope.$on('fnFilter_colFilter', function(event, params) {
        _self.PARAMS_COL_FILTER = params;
        _clearFilteredClients();
        _filterClients(params);
      });
      /*########################
      # fnChangePage
      ########################*/
      _self.fnChangePage = function(){
        _clearFilteredClients(true);
        _filterClients(_self.PARAMS_COL_FILTER);
      };
      /*########################
      # fnClearFilter
      ########################*/
      $scope.$on('fnClearFilter_colFilter', function() {
        _self.PARAMS_COL_FILTER = {};
        _clearFilteredClients();
        _self.noResultFilter.setNoResultFilter(true, false);
      });
      /*########################
      # fnGoToClient
      ########################*/
      _self.fnGoToClient = function(client) {
        proxyClient.ServicesClientValid(client.documentType, client.documentNumber, _self.MODULE.code, true)
          .then(function(res) {
            if (res.operationCode === constants.operationCode.code900) {
              mModalAlert.showError(res.message, 'ERROR');

              return false;
            }

            var vColFilter = _self.data.colFilter;
            var vStateName = _self.MODULE.prefixState + 'Client';
            $state.go(vStateName, {
              client: client,
              policyNumber: vColFilter.mNumPolizaFilter || null
            });
          });

        var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();

        var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
        gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Seleccionar', gaLabel: 'Botón: Seleccionar', gaValue: 'Periodo Regular' });
      }
      /*########################
      # $onInit
      ########################*/
      function onInit() {
        _self.data = _self.data || {};
        _self.MODULE = $state.current.module;

        _self.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
        _self.data.dataList = new nsctrFactory.object.oDataList();
        _self.data.mPagination = new nsctrFactory.object.oPagination();

        _self.STATE = nsctr_constants.state;
      }

      _self.$onInit = onInit;

      $scope.fnShowNaturalRucPerson = function(item){
        return mainServices.fnShowNaturalRucPerson(item.documentType, item.documentNumber);
      };

  }]).component('nsctrSearchClient', {
    templateUrl: function($state, $element, $attrs) {
      var vCurrentModule = $state.current.module,
          vTemplate = (vCurrentModule.code == nsctr_constants.mining.code)
                        ? vCurrentModule.prefixState
                        : 'searchClient';
      return '/nsctr/app/common/components/searchClient/' + vTemplate + '.component.html';
    },
    controller: 'nsctrSearchClientController'
  });
});
