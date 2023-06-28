(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'nsctr_constants', 'helper',
'nsctrFactoryJs', 'nsctrServiceJs', 'nsctrRolesJs',
'miningSearchPopupJs',
'nsctrNoResultFilterJs'],
function(angular, constants, nsctr_constants, helper){

    var appNsctr = angular.module('appNsctr');

    appNsctr.controller('miningReportsController',
      ['$scope', '$window', '$state', '$timeout', 'mModalAlert', 'nsctrService', 'nsctrFactory',
      '$uibModal', 'mainServices', '$filter',
      function($scope, $window, $state, $timeout, mModalAlert, nsctrService, nsctrFactory,
      $uibModal, mainServices, $filter){
        /*########################
        # variable
        ########################*/
        var vTODAY = new Date();
        /*########################
        # onLoad
        ########################*/
        (function onLoad(){

          $scope.data = $scope.data || {};

          $scope.CONSTANTS_NSCTR = $scope.CONSTANTS_NSCTR || nsctr_constants;

          $scope.data.selectedCompany = new nsctrFactory.object.oSelectedItem();
          $scope.data.selectedInsured = new nsctrFactory.object.oSelectedItem();

          $scope.data.mFechaInicioReporte = new nsctrFactory.object.oDatePicker(new Date(vTODAY.getFullYear(), 0, 1));
          $scope.data.mFechaFinReporte = new nsctrFactory.object.oDatePicker(new Date());

          $scope.data.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
          $scope.data.dataList = new nsctrFactory.object.oDataList(constants.paginationType.back, 5);
          $scope.data.mPagination = new nsctrFactory.object.oPagination();
          $scope.data.mPagination.setMaxSize($scope.data.dataList.pagination);

          $scope.data.medicList = nsctrFactory.common.proxyLookup.ServicesMedicList(true);
          $scope.data.clinicList = nsctrFactory.common.proxyLookup.ServicesAllClinics(true);
          $scope.data.locationList = nsctrFactory.common.proxyLookup.ServicesLocationList(true);

          $scope.data.filterDate = $filter('date');

          $scope.MODULE = $state.current.module;
          var segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu"+$scope.MODULE.appCode)), "REPORTES_ACCIONES", "nombreCabecera");
          $scope.seguritySearch = nsctrFactory.validation._filterData(segurity.items, "BUSCAR", "nombreCorto")
          $scope.segurityGenerate = nsctrFactory.validation._filterData(segurity.items, "GENERAR", "nombreCorto")
        })();
        /*#########################
        # fnShowModalSearchPopup
        #########################*/
        $scope.fnShowModalSearchPopup = function(type){
          $scope.searchPopup = {
            type: type,
            mainData: {
              flagMiningEnterprise: 'S'
            },
            data:{}
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
            if (obj.action == 'I') {
              if (type == $scope.CONSTANTS_NSCTR.client.code){
                $scope.data.selectedCompany.setItem(obj.item.enterpriseId, null, obj.item.enterpriseRuc, obj.item.enterpriseSocialReason);
              }else{
                $scope.data.selectedInsured.setItem(null, obj.item.documentType, obj.item.documentNumber, obj.item.name);
              }
            }
          },function(){
            //Action after CancelButton Modal
          });
        };
        /*#########################
        # fnCleanSelectedItem
        #########################*/
        $scope.fnCleanEnterprise = function() {
          $scope.data.selectedCompany.setItem();
        };
        $scope.fnCleanInsured = function() {
          $scope.data.selectedInsured.setItem();
        };
        /*########################
        # fnChangeCalendar
        ########################*/
        $scope.fnChangeCalendar = function(){
          $scope.data.mFechaFinReporte.setMinDate($scope.data.mFechaInicioReporte.model);
          if ($scope.data.mFechaInicioReporte.model > $scope.data.mFechaFinReporte.model){
            $scope.data.mFechaFinReporte.setModel($scope.data.mFechaInicioReporte.model);
          }
        };
        /*#########################
        # fnSeachReports
        #########################*/
        function _clearSearchedReports(option){
          var vIsClear = option == 'C';

          $scope.data.noResultFilter.setNoResultFilter(vIsClear, false);
          $scope.data.dataList.setDataList();
          $scope.data.mPagination.setTotalItems(0);
          $scope.data.mPagination.setCurrentPage(1);
        }
        function _paramsSearchReports(){
          var vParams = {
            enterpriseId    : ($scope.data.selectedCompany.id)
                                ? $scope.data.selectedCompany.id
                                : 0,
            enterpriseRuc   : $scope.data.selectedCompany.documentNumber,
            enterpriseName  : $scope.data.selectedCompany.name,
            documentType    : $scope.data.selectedInsured.documentType,
            documentNumber  : $scope.data.selectedInsured.documentNumber,
            medicId         : $scope.data.mMedico.code || 0,
            clinicId        : $scope.data.mClinica.code || 0,
            locationId      : $scope.data.mLocacion.code || 0,
            startDate       : $scope.data.filterDate($scope.data.mFechaInicioReporte.model, constants.formats.dateFormat),
            endDate         : $scope.data.filterDate($scope.data.mFechaFinReporte.model, constants.formats.dateFormat),
            rowByPage       : $scope.data.mPagination.maxSize,
            currentPage     : $scope.data.mPagination.currentPage,
          };
          return vParams;
        }
        function _searchReports() {
          var vParams = _paramsSearchReports();
          nsctrFactory.mining.proxyReports.EvaluationReportPaging(vParams, true).then(function(response) {
            if (response.operationCode == constants.operationCode.success) {
              if (response.data.list.length > 0) {
                $scope.data.dataList.setDataList(response.data.list, response.data.totalRows, 0, response.data.totalPages);
                $scope.data.mPagination.setTotalItems($scope.data.dataList.totalItemsPagination);
              } else {
                $scope.data.noResultFilter.setNoResult(true);
              }
            }else{
              $scope.data.noResultFilter.setNoResult(true);
            }
          }, function(error){
            $scope.data.noResultFilter.setNoResult(true);
          });
        }
        $scope.fnSeachReports = function() {
          _clearSearchedReports('S');
          _searchReports();
        };
        $scope.fnChangePage = function() {
          _searchReports();
        };
        /*#########################
        # fnCleanAll
        #########################*/
        function _clearReportsSearcher(){
          $scope.fnCleanEnterprise();
          $scope.fnCleanInsured();
          $scope.data.mMedico = {code: null};
          $scope.data.mClinica = {code: null};
          $scope.data.mLocacion = {code: null};
          $scope.data.mFechaInicioReporte = new nsctrFactory.object.oDatePicker(new Date(vTODAY.getFullYear(), 0, 1));
          $scope.data.mFechaFinReporte = new nsctrFactory.object.oDatePicker(new Date());
          $scope.data.mFechaFinReporte.setMinDate($scope.data.mFechaInicioReporte.model);
        }
        $scope.fnCleanAll = function() {
          _clearReportsSearcher();
          _clearSearchedReports('C');
        };
        /*#########################
        # fnDownloadReports
        #########################*/
        $scope.fnDownloadReports = function(reportType) {
          const vParams = _paramsSearchReports();
          var totalPages = $scope.data.dataList.totalPages,
              maxPages = 3500;

          if (totalPages > maxPages) {
            mModalAlert.showWarning('No se puede descargar más de ' + maxPages + ' páginas', 'ALERTA');
          } else {
            $scope.data.csServicesDownloadReport =  nsctrFactory.mining.proxyReports.CSDownloadReport(reportType, vParams ).then(function(data){
              mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
              });
            $scope.data.paramsCSServicesDownloadReport = _paramsSearchReports();
          }
        };

    }]);

});