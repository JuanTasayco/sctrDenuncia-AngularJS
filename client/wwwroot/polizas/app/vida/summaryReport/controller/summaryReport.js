(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
'/polizas/app/vida/proxy/vidaFactory.js'], 
function(angular, constants, helper){

  var appAutos = angular.module('appAutos');

  appAutos.controller('vidaSummaryReportController', 
    ['$scope', '$window', '$state', 'vidaFactory', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimClaims', 'oimPrincipal', '$filter', '$sce', '$q', 'mpSpin', 
    function($scope, $window, $state, vidaFactory, $timeout, $uibModal, mModalAlert, mModalConfirm, oimClaims, oimPrincipal, $filter, $sce, $q, mpSpin){
  
      (function onLoad(){
        $scope.mainStep = $scope.mainStep || {};

        $scope.filterDate = $filter('date');

        settingsVigencia();

        //https://mxperu.atlassian.net/browse/OIM-609
        $scope.mainStep.pdfURLSummaryEquipment = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/Vida/resumenequipo');
        //https://mxperu.atlassian.net/browse/OIM-610
        const opcMenu = localStorage.getItem('currentBreadcrumb');
        $scope.mainStep.pdfURLSummaryAgent = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/Vida/resumenagente' + '?COD_OBJETO=.&OPC_MENU='+ opcMenu);

        _filter('1');

      })();

      function settingsVigencia(){

        $scope.today = function() {
          var _today = new Date(); 
          if (typeof $scope.mainStep.mDesdeFilter == 'undefined') $scope.mainStep.mDesdeFilter = new Date();
          if (typeof $scope.mainStep.mHastaFilter == 'undefined') $scope.mainStep.mHastaFilter = new Date();
        };
        $scope.today();

        $scope.inlineOptions = {
          //customClass: getDayClass,
          minDate: new Date(),
          showWeeks: true
        };

        $scope.dateOptions = {
          //dateDisabled: disabled,
          // dateDisabled: function(data){
          //   // debugger;
          //   var date = data.date;
          //   var _today = new Date(); _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
          //   return  date < _today;
          // },
          formatYear: 'yy',
          minDate: new Date(),
          startingDay: 1
        };

        // Disable weekend selection
        // function disabled(data) {
        //   var date = data.date,
        //   mode = data.mode;
        //   return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        // }

        $scope.toggleMin = function() {
          $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
          $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openDesdeFilter = function() {
          $scope.popupDesdeFilter.opened = true;
        };
        $scope.openHastaFilter = function() {
          $scope.popupHastaFilter.opened = true;
        };

        $scope.setDate = function(year, month, day) {
          $scope.dt = new Date(year, month, day);
        };

        $scope.format = constants.formats.dateFormat;
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popupDesdeFilter = {
          opened: false
        };
        $scope.popupHastaFilter = {
          opened: false
        };
      }

      function _buildGestor(value){
        var data = {
          NombreGestor: value.toUpperCase(),
          CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode, //'9999', //deberia incluirse en el claims
          CodigoAgente: oimClaims.agentID, //'1295',
          RolUsuario: oimPrincipal.get_role() //'ADMIN'
        }
        return data;
      }

      $scope.searchGestor = function(value){
        var params = _buildGestor(value);
        return vidaFactory.getGestor(params, false);
      }

      function _buildAgent(value){
        var data = {
          CodigoNombre: value.toUpperCase(),
          CodigoGestor: (typeof $scope.mainStep.mGestorFilter == 'undefined') ? '0' : $scope.mainStep.mGestorFilter.codigo,
          CodigoOficina: (oimPrincipal.isAdmin()) ? '0' : oimClaims.officeCode, //'9999', //deberia incluirse en el claims
          McaGestSel: 'S',
          RolUsuario: oimPrincipal.get_role()
        }
        return data;
      }

      $scope.searchAgent = function(value){
        var params = _buildAgent(value);
        return vidaFactory.getAgent(params, false);
      }

      // $scope.clearAgent = function(){
      //   $scope.mainStep.mAgenteFilter = {};
      //   debugger;
      // };


      function _buildSummaryEquipment(){
        var data = {
          CodigoGestor: (typeof $scope.mainStep.mGestorFilter == 'undefined') ? '0' : $scope.mainStep.mGestorFilter.codigo,
          CodigoAgente: (typeof $scope.mainStep.mAgenteFilter == 'undefined') ? oimClaims.agentID : $scope.mainStep.mAgenteFilter.codigoAgente, //oimClaims.agentID, //1295,
          FechaIncio: $scope.filterDate($scope.mainStep.mDesdeFilter, constants.formats.dateFormat),
          FechaFin: $scope.filterDate($scope.mainStep.mHastaFilter, constants.formats.dateFormat),
          NumeroDocumento: (typeof $scope.mainStep.mDniRucFilter == 'undefined') ? '' : $scope.mainStep.mDniRucFilter
        }
        return data;
      }

      function _filterSummaryEquipment(){
        var params = _buildSummaryEquipment();
        return vidaFactory.filterSummaryEquipment(params);
        // // mpSpin.start(true);
        // $scope.noResult = false;
        // var params = _buildSummaryEquipment();
        // vidaFactory.filterSummaryEquipment(params, true).then(function(response){
        //   if (response.OperationCode == constants.operationCode.success){
        //     $scope.itemsEquipment = response.Data;
        //     // console.log(JSON.stringify(response.Data));
        //   }else{
        //     // mpSpin.end();
        //     $scope.noResult = true;
        //     // mModalAlert.showError(response.Message, 'Error');
        //   }
        // }, function(error){
        //   $scope.noResult = true;
        //   // mpSpin.end();
        //   // console.log('error');
        // }, function(defaultError){
        //   $scope.noResult = true;
        //   // mpSpin.end();
        //   // console.log('errorDefault');
        // });
      }

      function _buildSummaryAgent(currentPage){
        var data = {
          CodigoGestor: (typeof $scope.mainStep.mGestorFilter == 'undefined') ? '0' : $scope.mainStep.mGestorFilter.codigo, //'0',
          CodigoAgente: (typeof $scope.mainStep.mAgenteFilter == 'undefined') ? oimClaims.agentID : $scope.mainStep.mAgenteFilter.codigoAgente, //'1295',
          FechaIncio: $scope.filterDate($scope.mainStep.mDesdeFilter, constants.formats.dateFormat), //'01/01/2012',
          FechaFin: $scope.filterDate($scope.mainStep.mHastaFilter, constants.formats.dateFormat), //'15/02/2017',
          NumeroDocumento: (typeof $scope.mainStep.mDniRucFilter == 'undefined') ? '' : $scope.mainStep.mDniRucFilter, //'',
          CantidadFilasPorPagina: '10',
          PaginaActual: currentPage //'1'
        }
        return data;
      }

      function _filterSummaryAgent(optionReturn, currentPage){
        var params = _buildSummaryAgent(currentPage);
        if (optionReturn){
          return vidaFactory.filterSummaryAgent(params);
        }else{
          vidaFactory.filterSummaryAgent(params, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
              $scope.itemsAgent = response.Data.Lista;
              // console.log(JSON.stringify(response.Data));
            }
            // }else{
              // mModalAlert.showError(response.Message, 'Error');
              // $scope.noResult = true;
            // }
          }, function(error){
            // $scope.noResult = true;
            // console.log('error');
          }, function(defaultError){
            // $scope.noResult = true;
            // console.log('errorDefault');
          });
        }
      }

      function _filter(currentPage){
        mpSpin.start();
        $scope.noResult = false;
        $scope.itemsEquipment = [];
        $q.all([_filterSummaryEquipment(), _filterSummaryAgent(true, currentPage)]).then(function(data) {
          var vSummaryEquipment = data[0];
          var vSummaryAgent = data[1];
          if (vSummaryEquipment.OperationCode == constants.operationCode.success){
            // $scope.itemsEquipment = vSummaryEquipment.Data;
            $scope.itemsEquipment.push(vSummaryEquipment.Data);
            if (vSummaryAgent.OperationCode == constants.operationCode.success){
              $scope.totalItems = parseInt(vSummaryAgent.Data.CantidadTotalPaginas) * 10;
              $scope.itemsAgent = vSummaryAgent.Data.Lista;
            }
          }else{
            $scope.noResult = true;
          }
          mpSpin.end();
        }, function(error){
          $scope.noResult = true;
          mpSpin.end();
          // console.log('error');
        }, function(defaultError){
          $scope.noResult = true;
          mpSpin.end();
          // console.log('errorDefault');
        });
      }
      function _clearFilterResult(){
        $scope.totalItems = 0;
        $scope.itemsEquipment = [];
        $scope.itemsAgent = [];
      }
      /*########################
      # Filter
      ########################*/
      $scope.filter = function(currentPage){
        $scope.mainStep.mPagination = currentPage;
        _clearFilterResult();
        _filter(currentPage)
        // _filterSummaryEquipment();
        // $scope.mainStep.mPagination = currentPage;
        // _filterSummaryAgent(currentPage);
      }

      /*########################
      # _clearFilter
      ########################*/
      function _clearFilter(){
        $scope.mainStep.mGestorFilter = undefined;
        $scope.mainStep.mAgenteFilter = undefined;
        $scope.mainStep.mDesdeFilter = new Date();
        $scope.mainStep.mHastaFilter = new Date();
        $scope.mainStep.mDniRucFilter = '';
      }
      $scope.clearFilter = function(){
        _clearFilter();
      }

      /*########################
      # Filter x page
      ########################*/
      $scope.pageChanged = function(page){
        _filterSummaryAgent(false, page);
      }


      /*#########################
      # downloadPDF
      #########################*/
      $scope.downloadPDFEquipment = function(){
        $scope.mainStep.pdfSummaryEquipment = _buildSummaryEquipment();
        $window.setTimeout(function(){
          document.getElementById('frmDownloadPDFSummaryEquipment').submit();
        });
      }
      $scope.downloadPDFAgent = function(){
        $scope.mainStep.pdfSummaryAgent = _buildSummaryAgent('1');
        $window.setTimeout(function(){
          document.getElementById('frmDownloadPDFSummaryAgent').submit();
        });
      }


      
  }]);
  // }]).factory('loaderHogarHomeController', ['hogarFactory', '$q', function(hogarFactory, $q){
  //   var claims;

  //   //Claims
  //   function getClaims(){
  //    var deferred = $q.defer();
  //     hogarFactory.getClaims().then(function(response){
  //       claims = response;
  //       deferred.resolve(claims);
  //     }, function (error){
  //       deferred.reject(error.statusText);
  //     });
  //     return deferred.promise; 
  //   }

  //   return {
  //     getClaims: function(){
  //       if(claims) return $q.resolve(claims);
  //       return getClaims();
  //     }
  //   }

  // }])

});