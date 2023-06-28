(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'nsctrTypeLoadJs',
  'nsctrModalReniecListJs',
  'nsctrWorkersList'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('nsctrProvisionalCoverageController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'mainServices', 'nsctrService', 'nsctrFactory',
        'oimPrincipal', 'mModalAlert', 'mModalConfirm', '$uibModal',
        function($scope, $window, $state, $timeout, $filter, mainServices, nsctrService, nsctrFactory,
          oimPrincipal, mModalAlert, mModalConfirm, $uibModal){
          /*########################
          # _self
          ########################*/
          var _self = this;
          _self.movementNumber = "";
          _self.validateProcess = false
          _self.dataS1 =  {};
          /*########################
          # _loadList
          ########################*/
          function _loadList(){
            _self.data.documentTypeData = _self.data.documentTypeData || nsctrFactory.common.proxyLookup.ServicesListDocumentType(nsctr_constants.client.code, _self.MODULE.code, true);
          }
          /*########################
          # $onInit
          ########################*/
          _self.$onInit = function(){

            _self.mainData = _self.mainData || {};
            _self.data = _self.data || {};

            _self.MODULE = $state.current.module;
            _self.USER = new nsctrFactory.object.oUser();

            _self.data.mNroDocumento = new nsctrFactory.object.oDocumentNumber();
            _self.data.mInicioCobertura = new nsctrFactory.object.oDatePicker();
            _self.data.mFinCobertura = new nsctrFactory.object.oDatePicker();

            _self.data.TYPE_LOAD = _self.data.TYPE_LOAD || nsctr_constants.typeLoad;

            _self.fnFilterDate = $filter('date');

            _loadList();

          };
          /*########################
          # fnGoSearchProvisionalCoverage
          ########################*/
          function _goSearchProvisionalCoverage(params){
            var vStateName = _self.MODULE.prefixState + 'SearchProvisionalCoverage',
              vParams = params || {};
            $state.go(vStateName, vParams);
          }
          _self.fnGoSearchProvisionalCoverage = function(){
            _goSearchProvisionalCoverage();
          };
          /*########################
          # fnChangeDocumentType
          ########################*/
          _self.fnChangeDocumentType = function(documentType){
            var vDocumentType = (documentType)
              ? documentType.typeId
              : null;

            _self.data.mNroDocumento.setFieldsToValidate(vDocumentType);
          };
          /*########################
          # fnChangeCalendar
          ########################*/
          _self.fnChangeCalendar = function(){
            _self.data.mFinCobertura.setMinDate(_self.data.mFinCobertura.model);
            if (_self.data.mFinCobertura.model < _self.data.mInicioCobertura.model){
              _self.data.mFinCobertura.setModel(_self.data.mInicioCobertura.model);
            }
          };
          /*########################
          # fnSave
          ########################*/
          function _validateReplacePayroll(tabPayroll){
            return _self.data.replacePayroll.fnValidate(tabPayroll);
          }
          function _validateForm(tabPayroll){
            $scope.frmProvisionalCoverage.markAsPristine();
            var vValidateReplacePayroll = _validateReplacePayroll(tabPayroll);
            return $scope.frmProvisionalCoverage.$valid && vValidateReplacePayroll;
          }
          function _getEmployeesList(){
            var vItemWorkers = _self.data.replacePayroll.itemWorkers || [],
              vEmployeesList = vItemWorkers.map(function(value1, key1){
                var vWorker = {
                  DocumentType :value1.mTipoDocumento.typeId,
                  risktype :value1.mTipoRiesgo ? value1.mTipoRiesgo.name : '',
                  DocumentNumber : value1.mNroDocumento.model,
                  Name : value1.mNombres || '',
                  FathersSurname : value1.mApellidoPaterno || '',
                  MothersSurname : value1.mApellidoMaterno || '',
                  FullName : value1.mNombreCompleto || '',
                  BirthDay : (value1.mFechaNacimiento.model)
                    ? _self.fnFilterDate(value1.mFechaNacimiento.model, constants.formats.dateFormat)
                    : '',
                  Occupation: value1.mOcupacion || '',
                  Salary : value1.mSueldo
                };
                return vWorker;
              });
            return vEmployeesList;
          }
          function _paramsIndividual(ShowInsured) {
            var vCoverageDate = {
              start: _self.fnFilterDate(_self.data.mInicioCobertura.model, constants.formats.dateFormat),
              end: _self.fnFilterDate(_self.data.mFinCobertura.model, constants.formats.dateFormat)
            },
              vParams = {
                NSCTRSystemType: _self.MODULE.code,
                ShowInsured: ShowInsured,
                movementNumber: _self.movementNumber,
                ClientDocumentType: _self.data.mTipoDocumento.typeId,
                ClientDocumentNumber: _self.data.mNroDocumento.model,
                ClientName: _self.data.mClientName,
                emissionUser: _self.USER.name,
                StartDate: vCoverageDate.start,
                EndDate: vCoverageDate.end,
                Employee: _getEmployeesList()
              };
            return vParams;
          }
          function _paramsMassive(ShowInsured){
            var vParamsIndividual = JSON.stringify(_paramsIndividual(ShowInsured)),
              vFile = _self.data.replacePayroll.fmImportarPlanilla || {},
              vParams = {
                CoverageJson: vParamsIndividual,
                FieldNameHere: vFile[0]
              };
            return vParams;
          }
          function _downloadPDF(provitionalCoverageId){
            mModalAlert.showSuccess('Cobertura provisional creada exitosamente','', null, null, 'DESCARGAR CONSTANCIA').then(function(download){
              nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(provitionalCoverageId,true).then(function (response) {
                mainServices.fnDownloadFileBase64(response.data, "pdf",'Contancia_' + provitionalCoverageId, false);
              })
              _goSearchProvisionalCoverage({isBack:true});
            });
          }
          _self.fnSave = function () {
            var vTabPayroll = _self.data.replacePayroll.tabPayroll;
            var ShowInsured = false;
            if (_validateForm(vTabPayroll)) {
                if(_self.validateProcess){
                mModalConfirm.confirmInfo(
                  '¿Está seguro que quiere crear la siguiente cobertura provisional?',
                  'COBERTURA PROVISIONAL',
                  'CREAR COBERTURA')
                  .then(function(response){
                    if (response){
                      var vParams = (_self.data.TYPE_LOAD.massive.code == vTabPayroll)
                        ? _paramsMassive(ShowInsured)
                        : _paramsIndividual(ShowInsured);
                      nsctrFactory.common.proxyCoverage.CSServicesSaveProvisionalCoverage(vTabPayroll, vParams, true).then(function(response){
                        var provitionalCoverageId = response.data.data.provitionalCoverageId;
                        switch (response.operationCode ){
                          case constants.operationCode.success:
                            _downloadPDF(provitionalCoverageId);
                            break;
                          case constants.operationCode.code901:
                            _self.reniecList = {
                              mainData:{
                                reniecList: response.data.employeeResponseMessagesList
                              },
                              data:{}
                            };
                            var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                              template: '<nsctr-modal-reniec-list main-data="$ctrl.reniecList.mainData" data="$ctrl.reniecList.data"></nsctr-modal-reniec-list>'
                            });
                            vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
                              function($scope, $uibModalInstance, $uibModal){
                                /*########################
                                # fnActionButton
                                ########################*/
                                $scope.$on('fnActionButton_modalReniecList', function(event, action){
                                  $uibModalInstance.close();
                                  switch (action){
                                    case 'C':
                                      // $uibModalInstance.dismiss('cancel');
                                      break;
                                    case 'E':
                                      // $uibModalInstance.close();
                                      break;
                                    case 'A':
                                      // $uibModalInstance.close();
                                      _downloadPDF(provitionalCoverageId);
                                      break;
                                  }
                                });
                              }];
                            $uibModal.open(vConfigModal).result.then(function(){
                              //Action after CloseButton Modal
                            },function(){
                              //Action after CancelButton Modal
                            });
                            break;
                          default:
                            var vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                            mModalAlert.showError(vError,'DATOS ERRONEOS');
                        }
                      }, function(error){
                        mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
                      });
                    }
                  });
              }        
          }
          }
          _self.fnProcessExcell = function () {
            var vTabPayroll = _self.data.replacePayroll.tabPayroll;
            var ShowInsured = true;
            if (_validateForm(vTabPayroll)) {
                var vParams = (_self.data.TYPE_LOAD.massive.code == vTabPayroll)
                  ? _paramsMassive(ShowInsured)
                  : _paramsIndividual(ShowInsured);
                nsctrFactory.common.proxyCoverage.CSServicesSaveProvisionalCoverage(vTabPayroll, vParams, true).then(function (response) {
                  switch (response.operationCode) {
                    case constants.operationCode.success:
                      _self.dataS1 = response.data;
                      _self.movementNumber = response.data.data.movementNumber;
                      _self.validateProcess= true
                      break;
                    case constants.operationCode.code901:
                      _self.reniecList = {
                        mainData: {
                          reniecList: response.data.employeeResponseMessagesList
                        },
                        data: {}
                      };
                      var vConfigModal = nsctrService.fnDefaultModalOptions($scope, {
                        template: '<nsctr-modal-reniec-list main-data="$ctrl.reniecList.mainData" data="$ctrl.reniecList.data"></nsctr-modal-reniec-list>'
                      });
                      vConfigModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
                        function ($scope, $uibModalInstance, $uibModal) {
                          /*########################
                          # fnActionButton
                          ########################*/
                          $scope.$on('fnActionButton_modalReniecList', function (event, action) {
                            $uibModalInstance.close();
                            _self.dataS1 = response.data;
                            _self.movementNumber = response.data.data.movementNumber;
                            _self.validateProcess= true
                          });
                        }];
                      $uibModal.open(vConfigModal).result.then(function () {
                        //Action after CloseButton Modal
                      }, function () {
                        //Action after CancelButton Modal
                      });
                      break;
                    default:
                      var vError = nsctrService.fnHtmlErrorLoadFile(response.data.errorMessages);
                      mModalAlert.showError(vError, 'DATOS ERRONEOS');
                  }
                });
              }
          }

        }]).component('nsctrProvisionalCoverage',{
          templateUrl: '/nsctr/app/common/components/provisionalCoverage/provisionalCoverage.component.html',
          controller: 'nsctrProvisionalCoverageController',
          bindings: {
            mainData: '=?',
            data: '=?'
          }
        });
  });
