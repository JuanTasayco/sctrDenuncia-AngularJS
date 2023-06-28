'user strict';

define([
  'angular',
  'constants',
  'nsctrFactoryJs', 'nsctrServiceJs',
  'nsctrNoResultFilterJs',
  'nsctrSearchedProofsJs',
  'nsctrModalInsuredJs'
], function(angular, constants) {

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrInsuredMovementsController',
    ['$rootScope', '$scope', '$state', '$stateParams', 'mainServices', 'nsctrFactory', 'nsctrService',
    '$window', '$uibModal', '$timeout',
    function($rootScope, $scope, $state, $stateParams, mainServices, nsctrFactory, nsctrService,
    $window, $uibModal, $timeout) {
      /*########################
      # _self
      ########################*/
      var _self = this;
      /*########################
      # fnShowModalInsured
      ########################*/
      function fnShowModalInsured() {
        $scope.modalInsured = {
          showSelects: true,
          mainData: {
            insured: _self.data.insured
          },
          data:{}
        };
        var vConfigModal = nsctrService.fnDefaultModalOptions(
                          $scope, {
                            size: 'lg',
                            template: '<nsctr-modal-insured show-selects="modalInsured.showSelects" main-data="modalInsured.mainData" data="modalInsured.data"></nsctr-modal-insured>'
                          });
        vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
          function($scope, $uibModalInstance, $uibModal){
            /*########################
            # fnActionButton_modalInsured
            ########################*/
            $scope.$on('fnActionButton_modalInsured', function(event, action){
              if (action){
                $uibModalInstance.close(action);
              }else{
                $uibModalInstance.dismiss('cancel');
              }
            });
        }];

        $uibModal.open(vConfigModal).result.then(function(){
          //Action after CloseButton Modal
          _listProofs();
        },function(){
          //Action after CancelButton Modal
        });
      }
      /*########################
      # _listProofs
      ########################*/
      function _paramsProofsList() {
        var data = {
          NSCTRSystemType:      _self.MODULE.code,
          constancyNumber:      '',
          codAseg:              _self.data.insured.codAseg || '',
          documentType:         _self.data.insured.documentType || '',
          documentNumber:       _self.data.insured.documentNumber || '',
          fullName:             _self.data.insured.fullName || '',
          policyNumber:         '',
          receiptNumber:        '0',
          startValidity:        '',
          endValidity:          '',
          clientDocumentType:   '',
          clientDocumentNumber: '',
          clientName:           '',
          rolCode:              _self.USER.role,
          rowByPage:            '10',
          orderBy:              '',
          currentPage:          '1'
        }
        return data;
      }
      function _listProofs(isPagination) {
        var params = _paramsProofsList();
        $timeout(function(){
          $rootScope.$broadcast('fnSearchProofs_searchedProofs', params, isPagination);
        }, 500);

      }
      /*########################
      # onInit
      ########################*/
      function onInit() {

        _self.data = _self.data || {};

        _self.MODULE = $state.current.module;
        _self.VALID_PAGE = _self.VALID_PAGE || nsctrService.fnValidatePage();

        if (_self.VALID_PAGE){
          _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
          _self.USER = new nsctrFactory.object.oUser();

          _self.data.insured = _self.STATE_PARAMS.insured || {};
          _listProofs();
        }else{
          var vStateName = _self.MODULE.prefixState + 'SearchInsured';
          $state.go(vStateName, {});
        }

      }
      /*########################
      # functions
      ########################*/
      _self.$onInit = onInit;
      _self.fnShowModalInsured = fnShowModalInsured;

  }]).component('nsctrInsuredMovements', {
    templateUrl: '/nsctr/app/common/components/insuredMovements/insuredMovements.component.html',
    controller: 'nsctrInsuredMovementsController'
  })

});
