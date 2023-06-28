(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
  'nsctrServiceJs', 'nsctrFactoryJs',
  'nsctrNoResultFilterJs'],
  function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('nsctrSearchProvisionalCoverageController',
      ['$scope', '$window', '$state', '$timeout', '$filter', 'mainServices', 'nsctrService', 'nsctrFactory',
      'mModalConfirm', 'mModalAlert', '$stateParams', 'gaService',
      function($scope, $window, $state, $timeout, $filter, mainServices, nsctrService, nsctrFactory,
      mModalConfirm, mModalAlert, $stateParams, gaService){
        /*########################
        # _self
        ########################*/
        var _self = this;
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

          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+_self.MODULE.appCode)), "COBERTURA_PROVISIONAL", "nombreCabecera");
          _self.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto");
          _self.segurityConstancy = nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_CONSTANCIA", "nombreCorto");
          _self.segurityPayroll = nsctrFactory.validation._filterData(segurity.items, "DESCARGAR_PLANILLA", "nombreCorto");
          _self.segurityConstancyDelete = nsctrFactory.validation._filterData(segurity.items, "ELIMINAR_CONSTANCIA", "nombreCorto");

          _self.data.mNroDocumento = new nsctrFactory.object.oDocumentNumber();
          _self.data.mInicioCobertura = new nsctrFactory.object.oDatePicker();
          _self.data.mFinCobertura = new nsctrFactory.object.oDatePicker();
          _self.data.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
          _self.data.dataList = new nsctrFactory.object.oDataList();
          _self.data.mPagination = new nsctrFactory.object.oPagination();

          _self.fnFilterDate = $filter('date');

          _loadList();

          if ($stateParams['isBack']) {
            _clearSearchedProvisionalCoverage()
            _searchProvisionalCoverage();
          }

        };
        /*########################
        # fnGoProvisionalCoverage
        ########################*/
        _self.fnGoProvisionalCoverage = function(){
          vStateName = _self.MODULE.prefixState + 'ProvisionalCoverage';
          $state.go(vStateName, {});
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
        /*#########################
        # fnSearchProvisionalCoverage
        #########################*/
        function _validateSearchProvisionalCoverage(){
          $scope.frmSearchProvisionalCoverage.markAsPristine();
          return $scope.frmSearchProvisionalCoverage.$valid;
        }
        function _clearSearchedProvisionalCoverage(isPagination){
          _self.data.noResultFilter.setNoResultFilter(false, false);
          _self.data.dataList.setDataList();
          _self.data.mPagination.setTotalItems(0);
          if (!isPagination) _self.data.mPagination.setCurrentPage(1);
        }

        function _paramSearchProvisionalCoverage(){
          var vParams = {
            NSCTRSystemType           : _self.MODULE.code,
            provitionalCoverageNumber : '',
            clientDocumentNumber      : _self.data.mNroDocumento.model || '',
            clientName                : _self.data.mClientName || '',
            startDate                 : (_self.data.mInicioCobertura.model)
                                          ? _self.fnFilterDate(_self.data.mInicioCobertura.model, constants.formats.dateFormat)
                                          : '',
            endDate                   : (_self.data.mFinCobertura.model)
                                          ? _self.fnFilterDate(_self.data.mFinCobertura.model, constants.formats.dateFormat)
                                          : '',
            status                    : '',
            rowByPage                 : '10',
            currentPage               : _self.data.mPagination.currentPage,
            orderBy                   : ''
          };
          return vParams;
        }
        function _searchProvisionalCoverage(){
          var vParams = _paramSearchProvisionalCoverage();
          nsctrFactory.common.proxyCoverage.ServicesListPagingCoverage(vParams, true).then(function(response){
            if (response.operationCode == constants.operationCode.success){
              if (response.data.list){
                _self.data.dataList.setDataList(response.data.list, response.data.totalRows, response.data.totalRowsActive, response.data.totalPages);
                _self.data.mPagination.setTotalItems(_self.data.dataList.totalItemsPagination);
              }else{
                _self.data.noResultFilter.setNoResult(true);
              }
            }else{
              _self.data.noResultFilter.setNoResult(true);
            }
          }, function(error){
            _self.data.noResultFilter.setNoResult(true);
          });
        }
        _self.fnSearchProvisionalCoverage = function(){
          var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
          if (_validateSearchProvisionalCoverage()){
            _clearSearchedProvisionalCoverage();
            _searchProvisionalCoverage();
            var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
            gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Botón Buscar', gaLabel: 'Botón: Botón Buscar', gaValue: 'Periodo Regular' });
          }
        };
        /*#########################
        # fnClearSearchInsured
        #########################*/
        function _clearProvisionalCoverageSearcher(){
          _self.data.mTipoDoc = {
            typeId: null
          };
          _self.data.mNroDocumento.setModel('');
          _self.data.mNroDocumento.setFieldsToValidate(null);
          _self.data.mClientName = '';
          _self.data.mInicioCobertura.setModel(null);
          _self.data.mFinCobertura.setModel(null);
        }
        _self.fnClearSearchProvisionalCoverage = function(){
          _clearProvisionalCoverageSearcher();
          _clearSearchedProvisionalCoverage();
          _searchProvisionalCoverage();
        };
        /*########################
        # fnChangePage
        ########################*/
        _self.fnChangePage = function(){
          _clearSearchedProvisionalCoverage(true);
          _searchProvisionalCoverage();
        };
        /*########################
        # fnDownloadExcel
        ########################*/
        function _executeFrmDownloadExcel(){
          $timeout(function(){
            document.getElementById('iFrmDownloadExcel').submit();
          }, 0);
        }
        function _paramsDownloadExcel(item){
          var vParams = {
            provitionalCoverageId     : item.provitionalCoverageId,
            ProvitionalCoverageNumber : item.provitionalCoverageNumber,
            clientDocumentNumber      : item.clientDocumentNumber,
            clientName                : item.clientName,
            startDate                 : item.startDate,
            endDate                   : item.endDate,
            status                    : item.status,
            emissionDate              : item.emissionDate,
            emissionUser              : item.emissionUser
          }
          return vParams;
        }
        _self.fnDownloadExcel = function(item){
          var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
          var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
          gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + ' - Click Cobertura Provisional XLS', gaLabel: 'Botón: descarga XLS', gaValue: 'Periodo Regular' });
          _self.data.downloadExcelURL = nsctrFactory.common.proxyCoverage.CSServicesExportProvisionalToExcel();
          _self.data.downloadExcelParams = _paramsDownloadExcel(item);
          _executeFrmDownloadExcel();          
        };
        /*########################
        # fnDownloadPDF
        ########################*/
        _self.fnDownloadPDF = function(idCoverage){
          nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(idCoverage,true).then(function (response) {
            mainServices.fnDownloadFileBase64(response.data, "pdf",'Constancia_'+idCoverage , false);
          }) 
        };
        /*########################
        # fnAnnulProvisionalCoverage
        ########################*/
        _self.fnAnnulProvisionalCoverage = function(item){
          var vItemCoverage = item;
          mModalConfirm.confirmWarning(
            '¿Estás seguro de eliminar esta cobertura?',
            'ELIMINAR COBERTURA',
            'ELIMINAR')
            .then(function(response){
              if (response) {
                nsctrFactory.common.proxyCoverage.ServicesDeleteProvisionalConstancy(vItemCoverage.provitionalCoverageId, true).then(function(response){
                  if (response.operationCode == constants.operationCode.success){
                    mModalAlert.showSuccess('Cobertura provisional eliminada', '').then(function(ok){
                      _clearSearchedProvisionalCoverage(true);
                      _searchProvisionalCoverage();
                    });
                  } else {
                    mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
                  }
                }, function(error){
                  mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
                });
              }
          }, function(otherOptions){
            return false;
          });
        }


    }]).component('nsctrSearchProvisionalCoverage',{
      templateUrl: '/nsctr/app/common/components/searchProvisionalCoverage/searchProvisionalCoverage.component.html',
      controller: 'nsctrSearchProvisionalCoverageController',
      bindings: {
        mainData: '=?',
        data: '=?'
      }
    });

  });
