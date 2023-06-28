(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrFactoryJs', 'nsctrServiceJs',
  'nsctrTypeLoadJs',
  'nsctrModalReniecListJs'
  ],function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('regularReplacePayrollController',
      ['$scope', '$window', '$state', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm',
      'nsctrFactory', '$stateParams', 'mainServices', 'nsctrService', '$filter', '$location', '$anchorScroll',
      function($scope, $window, $state, $timeout, $uibModal, mModalAlert, mModalConfirm,
      nsctrFactory, $stateParams, mainServices, nsctrService, $filter, $location, $anchorScroll){
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};
          $scope.data.MODULE = $scope.data.MODULE || $state.current.module;
          $scope.data.VALID_PAGE = $scope.data.VALID_PAGE || nsctrService.fnValidatePage();

          if ($scope.data.VALID_PAGE){
            $scope.data.STATE_PARAMS = $scope.data.STATE_PARAMS || new nsctrFactory.object.oStateParams();
            $scope.data.payrollList = $scope.data.payrollList || new nsctrFactory.object.oDataList(constants.paginationType.front);
            $scope.data.mPagination = $scope.data.mPagination || new nsctrFactory.object.oPagination();

            $scope.data.CURRENCY_TYPES = $scope.data.CURRENCY_TYPES || constants.currencyType;
            $scope.data.TYPE_LOAD = $scope.data.TYPE_LOAD || nsctr_constants.typeLoad;
            $scope.data.ADD_ROWS = $scope.data.ADD_ROWS || 'AR';
            $scope.data.MAX_NUM_WORKERS = $scope.data.MAX_NUM_WORKERS || 10;
            $scope.data.TIMER = $scope.data.TIMER || 'timer';

            $scope.data.fnFilterDate = $scope.data.fnFilterDate || $filter('date');

          }else{
            $state.go('regularSearchClient', {});
          }

        })();
        /*########################
        # fnGoProofs
        ########################*/
        $scope.fnGoProofs = function(){
          $state.go('regularProofs', {
            client: $scope.data.STATE_PARAMS['client'],
            selectedApplications: $scope.data.STATE_PARAMS['selectedApplications']
          });
        };
        /*########################
        # inclusionS1.fnValidateRisks
        ########################*/
        $scope.data.fnValidateRisks = function(clickButton){
          var vParamsReplacePayroll = $scope.data.STATE_PARAMS['paramsReplacePayroll'],
              vMaxNumberworkers = true,
              IsAllCheckboxSelected = vParamsReplacePayroll.IsAllCheckboxSelected,
              vNumberWorkers = (IsAllCheckboxSelected)
                                ? vParamsReplacePayroll.SelectedEmployeeListActive
                                : vParamsReplacePayroll.SelectedEmployeeList.length;

          if ($scope.data.TYPE_LOAD.individual.code == clickButton){ //CLICK BUTTON INDIVIDUAL_LOAD
            if (vNumberWorkers > $scope.data.MAX_NUM_WORKERS){
              vMaxNumberworkers = false;
              mModalAlert.showWarning('Debes cargar la planilla en un excel porque el nro. de trabajadores exceden a 10', 'ALERTA');
            }
          } else if ($scope.data.ADD_ROWS == clickButton){ //CLICK BUTTON ADD_ROWS
            if (vNumberWorkers > $scope.data.MAX_NUM_WORKERS){
              mModalConfirm.confirmWarning(
              'Debes cargar la planilla de trabajadores en un excel ahora que el nro. de trabajadores exceden a 10.<br>' +
              'Si eliges la opción de cargar excel se perderán los datos ingresados individualmente.',
              'ALERTA',
              'CARGAR EXCEL')
              .then(function(response){
                $timeout(function(){
                  $scope.data.replacePayroll.tabPayroll = $scope.data.TYPE_LOAD.massive.code;
                }, 0);
              }, function(error){
                vMaxNumberworkers = false;
              }, function(defaultError){
                vMaxNumberworkers = false;
              });
            }
          }
          return {
            validate: vMaxNumberworkers,
            numberWorkers: vNumberWorkers
          };
        }
        /*########################
        # fnShowPayroll
        ########################*/
        function _paramsIndividualLoad(tabPayroll){
          var vParams = $scope.data.STATE_PARAMS['paramsReplacePayroll'],
              vUploadedReplaceEmployeesList = [];

          if ($scope.data.TYPE_LOAD.individual.code == tabPayroll){
            var vItemWorkers = $scope.data.replacePayroll.itemWorkers;
            vUploadedReplaceEmployeesList = vItemWorkers.map(function(value1, key1) {
              var vWorker = {
                Row:            (key1 + 1),
                DocumentType:   value1.mTipoDocumento.typeId,
                DocumentNumber: value1.mNroDocumento.model,
                FathersSurname: value1.mApellidoPaterno || '',
                MothersSurname: value1.mApellidoMaterno || '',
                Name:           value1.mNombres || '',
                FullName:       value1.mNombreCompleto || '',
                BirthDate:      (value1.mFechaNacimiento.model)
                                  ? $scope.data.fnFilterDate(value1.mFechaNacimiento.model, constants.formats.dateFormat)
                                  : '',
                Salary:         value1.mSueldo
              };
              return vWorker;
            });
          }
          vParams.UploadedReplaceEmployeesList = vUploadedReplaceEmployeesList;
          return vParams;
        }
        function _paramsMassiveLoad(tabPayroll){
          var vParamsIndividualLoad = JSON.stringify(_paramsIndividualLoad(tabPayroll)),
              vFile = $scope.data.replacePayroll.fmImportarPlanilla || {},
              vParams = {
                PayrollJson :     vParamsIndividualLoad,
                FieldNameHere :   vFile[0]
              };
          return vParams;
        }
        function _paramsShowPayroll(tabPayroll){
          var vParams = ($scope.data.TYPE_LOAD.individual.code == tabPayroll)
                          ? _paramsIndividualLoad(tabPayroll)
                          : _paramsMassiveLoad(tabPayroll);
          return vParams;
        }
        function _validateForm(tabPayroll){
          var vValidateReplacePayroll = $scope.data.replacePayroll.fnValidate(tabPayroll);
          return vValidateReplacePayroll;
        }
        function _clearShowedPayroll(){
          $scope.data.paramsReplacePayroll = {};
          $scope.data.payrollList.setDataList();
          $scope.data.mPagination.setTotalItems(0);
          $scope.data.mPagination.setCurrentPage(1);
        }
        function _showPayroll(data){
          var vParamsReplacePayroll = data.data,
              vDataList = data.data.uploadedReplaceEmployeesList;

          $scope.data.paramsReplacePayroll = vParamsReplacePayroll;
          $scope.data.payrollList.setDataList(vDataList, vDataList.length);
          $scope.data.mPagination.setTotalItems($scope.data.payrollList.totalItemsPagination);
          $location.hash('iPayrollList');
          $anchorScroll();
        }
        $scope.fnShowPayroll = function(){
          _clearShowedPayroll();
          var vTabPayroll = $scope.data.replacePayroll.tabPayroll;
          if (_validateForm(vTabPayroll)){
            var vParams = _paramsShowPayroll(vTabPayroll);
            nsctrFactory.common.proxyDeclarationAdmin.CSRecoverPayrollAdmin_Replace_Step2_Upload(vTabPayroll, vParams, true).then(function(response){
              var vData = response.data;

              switch(response.operationCode){
                case constants.operationCode.success:
                  _showPayroll(vData);
                  break;
                case constants.operationCode.code901:
                  var vErrorList = {
                    reniecList:             vData.employeeResponseMessagesList.length > 0,
                    employeeInPayrollList:  (vData.employeeInPayrollList.message !== null),
                    simpleErrorMessage:     (vData.simpleErrorMessage !== '')
                  };
                  //modalReniecList
                  $scope.reniecList = {
                    mainData:{
                      reniecList: vData.employeeResponseMessagesList
                    },
                    data:{}
                  };
                  var vConfigModalReniec = nsctrService.fnDefaultModalOptions($scope, {
                                      template: '<nsctr-modal-reniec-list main-data="reniecList.mainData" data="reniecList.data"></nsctr-modal-reniec-list>'
                                    }, true, true);
                  vConfigModalReniec.controller = ['$scope', '$uibModalInstance', '$uibModal',
                    function($scope, $uibModalInstance, $uibModal){
                      /*########################
                      # fnActionButton_modalReniecList
                      ########################*/
                      $scope.$on('fnActionButton_modalReniecList', function(event, action){
                        $uibModalInstance.close(action);
                      });
                  }];
                  //
                  var uibModalAlerts = {
                        employeeInPayrollList: {
                          scope: $scope,
                        }
                      },
                      vModals = {
                        employeeInPayrollList: {
                          showIcon: 'warning',
                          title: 'Reemplazo de Planilla',
                          content: vData.employeeInPayrollList.message,
                          templateContent: 'tplEmployeeInPayrollList.html',
                          showCancelButton: false
                        }
                      };

                  $scope.employeeInPayrollList = vData.employeeInPayrollList;

                  if (vErrorList['reniecList']){
                    $uibModal.open(vConfigModalReniec).result.then(function(action){
                      if (action == 'A'){
                        if (vErrorList['employeeInPayrollList']){
                          mainServices.fnShowModal(uibModalAlerts.employeeInPayrollList, vModals.employeeInPayrollList);
                        }else if(vErrorList['simpleErrorMessage']){
                          mModalAlert.showWarning(vData.simpleErrorMessage, 'Reemplazo de Planilla');
                        }else{
                          _showPayroll(vData);
                        }
                      }
                    });
                  }else if(vErrorList['employeeInPayrollList']){
                    mainServices.fnShowModal(uibModalAlerts.employeeInPayrollList, vModals.employeeInPayrollList);
                  }else{
                    mModalAlert.showWarning(vData.simpleErrorMessage, 'Reemplazo de Planilla');
                  }
                  break;
                default: //900
                  var vError = nsctrService.fnHtmlErrorLoadFile(vData.errorMessages);
                  mModalAlert.showError(vError, 'DATOS DE LA PLANILLA ERRONEOS');
              }
            }, function(error){
              // console.log('error');
            }, function(defaultError){
              // console.log('errorDefault');
            });
          }
        }
        /*########################
        # fnChangePage
        ########################*/
        $scope.fnChangePage = function(){
          $scope.data.payrollList.setDataListByPage($scope.data.mPagination.currentPage);
        }
        /*########################
        # fnReplacePayroll
        ########################*/
        $scope.fnReplacePayroll = function(){
          var vParams = $scope.data.paramsReplacePayroll;
          mModalConfirm.confirmInfo(
            '¿Está seguro que quiere reemplazar la planilla?',
            'REEMPLAZAR PLANILLA',
            'REEMPLAZAR').then(function(response){
              if (response){
                nsctrFactory.common.proxyDeclarationAdmin.RecoverPayrollAdmin_Replace_Step3_SaveReplace(vParams, true).then(function(response){
                  if (response.operationCode == constants.operationCode.success){
                    mModalAlert.showSuccess('Planilla reemplazada exitosamente', '', null, 2000).then(function(ok){
                      $scope.fnGoProofs();
                    }, function(resOtherOptions){
                      if ($scope.data.TIMER == resOtherOptions) $scope.fnGoProofs();
                    });
                  }else{
                    vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                    mModalAlert.showError(vError,'ERROR REEMPLAZAR');
                  }
                }, function(error){
                  // console.log('error');
                }, function(defaultError){
                  // console.log('errorDefault');
                });
              }
          }, function(otherOptions){
            return false;
          });
        }
    }])

  });
