(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs',
  'nsctrClientInformationJs',
  'miningTypeRegisterJs',
  'nsctrModalReniecListJs',
  'miningCheckFilterJs',
  'nsctrNoResultFilterJs',
  'miningModalWorkerDataJs'
  ],function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningReplacePayrollController',
      ['$rootScope', '$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm',
      'nsctrFactory', '$stateParams', 'mainServices', 'nsctrService', '$filter', '$location', '$anchorScroll',
      'rolesPermission',
      function($rootScope, $scope, $window, $state, $timeout, $uibModal, mModalAlert, mModalConfirm,
      nsctrFactory, $stateParams, mainServices, nsctrService, $filter, $location, $anchorScroll,
      rolesPermission){
        /*########################
        # Variables
        ########################*/
        var fnWatchCheckFilter = function(){};
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.data.MODULE = $scope.data.MODULE || $state.current.module;
          $scope.data.VALID_PAGE = $scope.data.VALID_PAGE || nsctrService.fnValidatePage();

          if ($scope.data.VALID_PAGE){
            $scope.data.STATE_PARAMS = $scope.data.STATE_PARAMS || new nsctrFactory.object.oStateParams();
            $scope.data.USER = $scope.data.USER || new nsctrFactory.object.oUser(rolesPermission);
            $scope.data.noResult = $scope.data.noResult || { filter: new nsctrFactory.object.oNoResultFilter() };
            $scope.data.dataList = $scope.data.dataList || new nsctrFactory.object.oDataListCheckFilter();
            $scope.data.mPagination = $scope.data.mPagination || new nsctrFactory.object.oPagination();

            $scope.data.CURRENCY_TYPES = $scope.data.CURRENCY_TYPES || constants.currencyType;
            $scope.data.TYPE_LOAD = $scope.data.TYPE_LOAD || nsctr_constants.typeLoad;
            $scope.data.ADD_ROWS = $scope.data.ADD_ROWS || 'AR';
            $scope.data.MAX_NUM_WORKERS = $scope.data.MAX_NUM_WORKERS || 10;
            $scope.data.TIMER = $scope.data.TIMER || 'timer';

            $scope.data.fnFilterDate = $scope.data.fnFilterDate || $filter('date');
          }else{
            $state.go('miningSearchClient', {});
          }

        })();
        /*########################
        # fnGoProofs
        ########################*/
        $scope.fnGoProofs = function(){
          $state.go('miningProofs', {
            client                      : $scope.data.STATE_PARAMS['client'],
            selectedApplicationsPolicies: $scope.data.STATE_PARAMS['selectedApplicationsPolicies'],
            selectedApplications        : $scope.data.STATE_PARAMS['selectedApplications']
          });
        };
        /*########################
        # _setCheckFilter
        ########################*/
        function _setCheckFilter(){
          $scope.$broadcast('fnSetCheckFilter_checkFilter');
        }
        /*########################
        # fnProcess
        ########################*/
        function _totalSalary(workersList){
          var vTotal = workersList.reduce(function(previous, current) {
            if (current.mCheck) return previous + parseFloat(current.salary);
            return previous;
          }, 0);
          return vTotal;
        }

        function _clearShowPayroll(){
          $scope.data.PARAMS_REPLACE_PAYROLL = {};
          $scope.data.dataList.setDataList();
        }
        function _paramsShowPayroll(params){
          var vParams = params,
              vParamsReplacePayroll = $scope.data.STATE_PARAMS['paramsReplacePayroll'];

          function _generateRisks(data, keyValue){
            var vRisks = '';
            if (!data.IsAllCheckboxSelected){
              var vGroup = new jinqJs()
                          .from(data.SelectedEmployeeList)
                          .distinct(keyValue)
                          .where(function(row, index){
                            return row[keyValue] !== '0';
                          })
                          .orderBy([{field:keyValue}])
                          .select();
              var vLastIndex = (vGroup.length - 1);

              angular.forEach(vGroup, function(elem, key){
                var vIsLast = key == vLastIndex,
                    vBarra = (vIsLast) ? '' : '|';

                vRisks += '[' + elem[keyValue].toString() +']' + vBarra;
              });
            }
            return vRisks;
          }
          vParams.PayrollJson = JSON.stringify(vParamsReplacePayroll);
          vParams.PensionRisks = _generateRisks(vParamsReplacePayroll, 'pensionRisk');
          vParams.HealthRisks = _generateRisks(vParamsReplacePayroll, 'healthRisk');

          return vParams;
        }
        function _showPayroll(params) {
          var vParams = _paramsShowPayroll(params),
              vError;

          _clearShowPayroll();
          nsctrFactory.mining.proxyMiningGenerateInclusionMain.CSMining_Step1_ListaAptoPadron(vParams, true)
            .then(function(response) {
              switch(response.operationCode) {
                case constants.operationCode.success:
                  $scope.data.mCheckAll = true;
                  fnWatchCheckFilter = $scope.$watch('data.checkFilter.checkList', function(newValue, oldValue){
                    var vCheckList = newValue || $scope.data.checkFilter.checkList;
                    $scope.data.PARAMS_REPLACE_PAYROLL = response.objReplace.data; //PARAMS_REPLACE_PAYROLL
                    $scope.data.dataList.setDisabledItems(true);
                    $scope.data.dataList.setDataList(response.data.data, vCheckList, 'able', $scope.data.USER.permissions);
                    $location.hash('iPayrollList');
                    $anchorScroll();
                  });
                  break;
                case constants.operationCode.code901:
                  $scope.reniecList = {
                    mainData: {
                      reniecList: response.objReplace.employeeResponseMessagesList
                    },
                    data: {}
                  };
                  var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                    template: '<nsctr-modal-reniec-list main-data="reniecList.mainData" data="reniecList.data"></nsctr-modal-reniec-list>',
                    windowClass : "g-modal-overlap "
                  });
                  vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
                    function ($scope, $uibModalInstance, $uibModal) {
                      $scope.$on('fnActionButton_modalReniecList', function(event, action){
                        $uibModalInstance.close();
                        if(action==='A'){
                          fnWatchCheckFilter = $scope.$watch('data.checkFilter.checkList', function(newValue, oldValue){
                            var vCheckList = newValue || $scope.data.checkFilter.checkList;
                            $scope.data.PARAMS_REPLACE_PAYROLL = response.objReplace.data; //PARAMS_REPLACE_PAYROLL
                            $scope.data.dataList.setDisabledItems(true);
                            $scope.data.dataList.setDataList(response.data.data, vCheckList, 'able', $scope.data.USER.permissions);
                            $location.hash('iPayrollList');
                            $anchorScroll();
                          });
                          $scope.dataMovementNumber = response.objReplace.data.declaration.session.movementNumber;
                        }
  
                      });
                    }];
                    $uibModal.open(vConfigModal); 
                default: //900
                var msjerros = response.data.errorMessages.length>0 ? response.data.errorMessages : response.objReplace.errorMessages;
                vError = nsctrService.fnHtmlErrorLoadFile(msjerros);
                mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
                break;
              }
            });
        }
        $scope.fnShowPayroll = function(){
          $scope.$broadcast('fnParamsRequest_typeRegister');
        };
        /*########################
        # fnFromTypeRegister
        ########################*/
        $scope.$on('fnSendParams_typeRegister', function(event, valid, activeTab, params){
          if (valid){
            _setCheckFilter();
            _showPayroll(params);
          }
        });
        /*########################
        # fnCheckFilter
        ########################*/
        $scope.fnCheckFilter = function() {
          $scope.data.dataList.setDataListByCheckFilter($scope.data.checkFilter.checkList)
            .then(function(response) {
              $scope.data.noResult.filter.setNoResult(!response.length);
            });
        };
        /*########################
        # fnReplacePayroll
        ########################*/
        function _paramsReplacePayroll(){
          var vParams = $scope.data.PARAMS_REPLACE_PAYROLL,
              vUploadedReplaceEmployeesList = $scope.data.dataList.allList.filter(function(elem, key){
                return elem.mCheck;
              });
          vParams.uploadedReplaceEmployeesList = vUploadedReplaceEmployeesList;

          return vParams;
        }
        $scope.fnReplacePayroll = function(){
          var vParams = _paramsReplacePayroll();
          mModalConfirm.confirmInfo(
            '¿Está seguro que quiere reemplazar la planilla?',
            'REEMPLAZAR PLANILLA',
            'REEMPLAZAR').then(function(response){
              if (response){
                nsctrFactory.common.proxyDeclarationAdmin.RecoverPayrollAdmin_Replace_Step3_SaveReplaceForMining(vParams, true).then(function(response){
                  if (response.operationCode == constants.operationCode.success){
                    mModalAlert.showSuccess('Planilla reemplazada exitosamente', '', null, 2000).then(function(ok){
                      $scope.fnGoProofs();
                    }, function(resOtherOptions){
                      if ($scope.data.TIMER == resOtherOptions) $scope.fnGoProofs();
                    });
                  }
                  else{
                    vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                    mModalAlert.showError(vError,'ERROR REEMPLAZAR');
                  }
                }, function(error){
                  mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
                });
              }
          }, function(otherOptions){
            return false;
          });
        };
        /*#######################
        # fnShowModalWorkerData
        #######################*/
        $scope.fnShowModalWorkerData = function(item){
          $scope.modalWorkerData = {
            constants: {
              module: $scope.data.MODULE,
              user: $scope.data.USER
            },
            mainData: item,
            data:{}
          };
          var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
                            size: 'lg',
                            template: '<mining-modal-worker-data main-data="modalWorkerData.mainData" constants="modalWorkerData.constants"></mining-modal-worker-data>'
                          });
          vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
            function($scope, $uibModalInstance, $uibModal){
              /*########################
              # fnCloseModal_modalManualProof
              ########################*/
              $scope.$on('fnCloseModal_modalWorkerData', function(isClose) {
                if (isClose){
                  $uibModalInstance.close();
                }else{
                  $uibModalInstance.dismiss('cancel');
                }
              });
          }];

          $uibModal.open(vOptModal);
        }

        /*#######################
        # DESTROY_EVENTS
        #######################*/
        $scope.$on('$destroy', function(){
          fnWatchCheckFilter();
        });
    }])

  });
