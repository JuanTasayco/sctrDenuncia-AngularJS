(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
  'nsctrNoResultFilterJs',
  'miningSearchPopupJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningMaintenanceAssignationController',
      ['$scope', '$window', '$state', '$timeout', 'mModalAlert', '$uibModal', 'nsctrFactory',
      'nsctrService', 'mModalConfirm',
      function($scope, $window, $state, $timeout, mModalAlert, $uibModal, nsctrFactory,
      nsctrService, mModalConfirm){
        /*########################
        # _loadAutocompletes
        ########################*/
        function _loadAutocompletes(){
          nsctrFactory.common.proxyLookup.ServicesLocationList(false).then(function(response) {
            if (response.operationCode == constants.operationCode.success) $scope.data.allLocations = response.data;
          });
        }
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};

          $scope.data.USER = new nsctrFactory.object.oUser();

          $scope.data.selectedCompany = new nsctrFactory.object.oSelectedItem();
          $scope.data.noResultFilter = new nsctrFactory.object.oNoResultFilter();
          $scope.data.locationsCompany = new nsctrFactory.object.oDataList(constants.paginationType.front);

          $scope.data.SHOW_ADD_LOCATION = false;
          _loadAutocompletes();

          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "MANTENIMIENTO_ASIGNACIONES", "nombreCabecera");
          $scope.segurityAdd = nsctrFactory.validation._filterData(segurity.items, "AGREGAR", "nombreCorto")
          $scope.segurityDelete = nsctrFactory.validation._filterData(segurity.items, "ELIMINAR", "nombreCorto")

        })();
        /*########################
        # fnSearchLocations
        ########################*/
        $scope.fnShowModalSearchCompany = function(preCharge) {
          $scope.searchPopup = {
            type    : nsctr_constants.client.code,
            mainData: {
              flagMiningEnterprise: 'N'
            },
            data    :{}
          };
          var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
                            size: 'lg',
                            template: '<mining-search-popup type="{{searchPopup.type}}" main-data="searchPopup.mainData" data="searchPopup.data"></mining-search-popup>'
                          });
          vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
            function($scope, $uibModalInstance, $uibModal){
              /*########################
              # fnActionButton_modalInsured
              ########################*/
              $scope.$on('fnActionButton_searchPopup', function(event, obj){
                if (obj.action){
                  $uibModalInstance.close(obj);
                }else{
                  $uibModalInstance.dismiss('cancel');
                }
              });
          }];

          $uibModal.open(vOptModal).result.then(function(obj){
            //Action after CloseButton Modal
            if (obj.action == 'I') $scope.data.selectedCompany.setItem(obj.item.enterpriseId, null, obj.item.enterpriseRuc, obj.item.enterpriseSocialReason);
          },function(){
            //Action after CancelButton Modal
          });
        };
        /*########################
        # fnSearchLocations
        ########################*/
        function _clearSearchedLocations(){
          $scope.data.noResultFilter.setNoResultFilter(false, false);
          $scope.data.locationsCompany.setDataList();
        }
        function _searchLocations(){
          var vIdCompany = $scope.data.selectedCompany.id;
          nsctrFactory.mining.proxyAssignments.ServicesGetAllLocationsByEnterprise(vIdCompany, true).then(function(response) {
            if (response.operationCode == constants.operationCode.success) {
              if (response.data.length > 0){
                $scope.data.locationsCompany.setDataList(response.data, response.data.length);
              }else{
                $scope.data.noResultFilter.setNoResult(true);
              }
            }else{
              $scope.data.noResultFilter.setNoResult(true);
            }
          }, function(error){
            $scope.data.noResultFilter.setNoResult(true);
          });
        }
        $scope.fnSearchLocations = function() {
          if ($scope.data.selectedCompany.documentNumber && !$scope.data.SHOW_ADD_LOCATION) {
            $scope.data.SHOW_ADD_LOCATION = true;
            _clearSearchedLocations();
            _searchLocations();
          }
        };
        /*########################
        # fnCleanAll
        ########################*/
        $scope.fnCleanAll = function() {
          $scope.data.SHOW_ADD_LOCATION = false;
          $scope.data.selectedCompany.setItem();
          $scope.data.mLocation = undefined;
          _clearSearchedLocations();
        };
        /*########################
        # fnAutocompleteLocation
        ########################*/
        $scope.fnAutocompleteLocation = function(){
          return $scope.data.allLocations || [];
        };
        /*########################
        # fnAddLocation
        ########################*/
        function _paramsAddLocation(){
          var vParams = {
            EnterpriseId           : $scope.data.selectedCompany.id,
            EnterpriseRuc          : $scope.data.selectedCompany.documentNumber,
            EnterpriseSocialReason : $scope.data.selectedCompany.name,
            LocationId             : $scope.data.mLocation.code,
            UserId                 : $scope.data.USER.name
          };
          return vParams;
        }
        $scope.fnAddLocation = function() {
          if ($scope.data.mLocation){
            mModalConfirm.confirmInfo('¿Está seguro que desea agregar la siguiente locación?', 'AGREGAR', 'ACEPTAR').then(function(response){
              var vParams = _paramsAddLocation();
              nsctrFactory.mining.proxyAssignments.ServicesAddLocationEnterprise(vParams, true).then(function(response){
                if (response.operationCode == constants.operationCode.success) {
                  $scope.data.selectedCompany.setId(response.data.enterpriseId);
                  $scope.data.mLocation = undefined;
                  _clearSearchedLocations();
                  _searchLocations();
                } else {
                  mModalAlert.showWarning(response.message, 'ALERTA');
                }
              }, function(error){
                mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
              });
            }, function(otherOptions){
              return false;
            });
          }
        };
        /*########################
        # fnDeleteLocation
        ########################*/
        function _paramsDeleteLocation(item){
          var vParams = {
            idLocation: item.locationId,
            idCompany: $scope.data.selectedCompany.id
          }
          return vParams;
        }
        $scope.fnDeleteLocation = function(item, index) {
          mModalConfirm.confirmWarning('¿Está seguro que desea eliminar la siguiente locación asignada?', 'ELIMINAR', 'ACEPTAR').then(function(response) {
            var vParams = _paramsDeleteLocation(item);
            nsctrFactory.mining.proxyAssignments.ServicesDeleteLocationEnterprise(vParams.idLocation, vParams.idCompany, true).then(function(response) {
              if (response.operationCode == constants.operationCode.success) {
                $scope.data.locationsCompany.list.splice(index, 1);
                var vNoResult = $scope.data.locationsCompany.list.length == 0;
                $scope.data.noResultFilter.setNoResult(vNoResult);
              } else {
                mModalAlert.showWarning(response.message, 'ALERTA');
              }
            }, function(error){
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
            });
          }, function(otherOptions){
            return false;
          });
        };

    }]);

  });
