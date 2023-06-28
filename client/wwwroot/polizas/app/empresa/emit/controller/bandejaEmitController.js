define([
  'angular', 
  'constants',
  '/polizas/app/empresa/factory/empresasFactory.js',
], function(angular, constants){

  var appAutos = angular.module('appAutos');

  appAutos.controller('bandejaEmitController', [
  	'$scope', 
  	'$window', 
  	'$state', 
  	'mpSpin',
  	'empresasFactory',
    '$timeout',
    'mModalAlert',
    '$uibModal',
    'MxPaginador',
  	function(
  		$scope, 
  		$window, 
  		$state, 
  		mpSpin,
  		empresasFactory,
      $timeout,
      mModalAlert,
      $uibModal,
      MxPaginador
  		){

  		var page;

    (function onLoad(){

    	$scope.data = $scope.data || {};

      //usuario 
      var profile = empresasFactory.getProfile();
      $scope.username = profile.username;

    	//Productos
    	$scope.tipoProductoData = empresasFactory.getProductsList(1);
      $scope.data.mProductoFilter = $scope.data.mProductoFilter || {};

    	//Fechas
    	$scope.data.mConsultaDesde = $scope.data.mConsultaDesde || new Date();
    	$scope.data.mConsultaHasta = $scope.data.mConsultaHasta || new Date();
    	$scope.format = "dd/MM/yyyy";

      //items
      $scope.data.mListEmit = $scope.data.mListEmit || [];
      $scope.noResults = false;

      //paginador
      $scope.itemsXPagina = 10;
      $scope.itemsXTanda = $scope.itemsXPagina * 10;
      $scope.msgVacio = 'No hay resultados para la búsqueda realizada. Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina($scope.itemsXPagina);
      
    })();

    $scope.pageChanged = pageChanged;
    $scope.search = search;
    $scope.cleaner = cleaner;
    $scope.viewDetails = viewDetails;
    
    $timeout(function(){
      search();
    }, 1000);

    //calendarios
    $scope.openDateStart = function(){
    	$scope.popupStart.opened = true;
    }

    function _calendarStart(){
    	$scope.todayStart = function(){
    		$scope.data.mConsultaDesde = new Date();
    	}
	    $scope.todayStart();

	    $scope.inlineOptions = {
	    	minDate: new Date(),
	    	showWeeks: true
	    };

	    $scope.dateOptionsStart = {
	    	formatYear: 'yy',
	    	maxDate: new Date(2050, 5, 22),
	    	minDate: new Date(),
	    	startingDay: 1
	    }

	    $scope.toggleMinStart = function(){
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsStart.minDate = $scope.inlineOptions.minDate;
	    };
	    $scope.toggleMinStart();

	    $scope.openDateStart = function(){
	    	$scope.popupStart.opened = true;
	    };

      $scope.formatDate = constants.formats.dateFormat;
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupStart = {
        opened: false
      };

	  }

    function _calendarEnd(){
    	$scope.todayEnd = function(){
    		$scope.data.mConsultaHasta = new Date();
    	}
	    $scope.todayEnd();

	    $scope.inlineOptions = {
	    	minDate: new Date(),
	    	showWeeks: true
	    };

      $scope.dateOptionsEnd = {
        formatYear: 'yy',
        maxDate: new Date(2050, 5, 22),
        minDate: new Date(),
        startingDay: 1
      }

      //setea fecha inicial segun se eliga en el datepicker
      //para limitar la fecha final
      $scope.$watch('data.mConsultaDesde', function(){
        $scope.dateOptionsEnd.minDate = $scope.data.mConsultaDesde;
      });

	    $scope.toggleMinEnd = function(){
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptionsEnd.minDate = $scope.inlineOptions.minDate;
	    };
	    $scope.toggleMinEnd();

	    $scope.openDateEnd = function(){
	    	$scope.popupEnd.opened = true;
	    };    

      $scope.formatDate = constants.formats.dateFormat;
      $scope.mask = constants.formats.dateFormatMask;
      $scope.pattern = constants.formats.dateFormatRegex;

      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popupEnd = {
        opened: false
      };

	  }

    function pageChanged(event){
      var strCodProd = ($scope.data.mProductoFilter.codProd == null) ? 0 : $scope.data.mProductoFilter.codProd;
      var strCont = (angular.isUndefined($scope.data.mContratante) || $scope.data.mContratante == "") ? "" : $scope.data.mContratante;
      var fechaIni = String(empresasFactory.formatDate($scope.data.mConsultaDesde));
      var fechaFin = String(empresasFactory.formatDate($scope.data.mConsultaHasta));

      var params = {
        contratante: strCont.toUpperCase(),
        fechaInicio: fechaIni,
        fechaFin: fechaFin,
        codigoProducto: strCodProd,
        codigoUsuario: $scope.username,
        cantidadFilasPorPagina: $scope.itemsXPagina
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
      params.paginaActual = nroTanda;
      searchBandeja(params);
      }, setLstCurrentPage);
    }

    function search(){

      $scope.paginaActual = 1;

      if(empresasFactory.daysDiff($scope.data.mConsultaDesde, $scope.data.mConsultaHasta) >= 0){

        var strCodProd = ($scope.data.mProductoFilter.codProd == null) ? 0 : $scope.data.mProductoFilter.codProd;

        var strCont = (angular.isUndefined($scope.data.mContratante) || $scope.data.mContratante == "") ? "" : $scope.data.mContratante;
        
        var fechaIni = String(empresasFactory.formatDate($scope.data.mConsultaDesde));
        var fechaFin = String(empresasFactory.formatDate($scope.data.mConsultaHasta));

        var params = {
          contratante: strCont.toUpperCase(),
          fechaInicio: fechaIni,
          fechaFin: fechaFin,
          codigoProducto: strCodProd,
          codigoUsuario: $scope.username,
          cantidadFilasPorPagina: $scope.itemsXPagina,
          paginaActual: 1
        };
        page.setCurrentTanda($scope.paginaActual);
        searchBandeja(params);
      }else{
          mModalAlert.showWarning("La fecha final no debe ser mayor a la fecha inicial", "Emisión de Polizas");
      }
    }

    function searchBandeja(params){
      empresasFactory.getListEmit(params).then(
      function(response){
        if(response){
          if(response.Data){
            $scope.data.mListEmit = response.Data.Lista;
            $scope.data.numItems = response.Data.CantidadTotalFilas;
            if($scope.data.numItems > 0)
              $scope.noResults = false;
            else            
              $scope.noResults = true;
          }else{
            $scope.data.mListEmit = [];
            $scope.noResults = true;
          }
        }
        page.setNroTotalRegistros($scope.data.numItems).setDataActual($scope.data.mListEmit).setConfiguracionTanda();
        setLstCurrentPage();
      }, 
      function(error){
        mModalAlert.showWarning("Ha ocurrido un error al intentar obtener la lista de polizas.", "Emisión de Polizas");
      });
    }

    function setLstCurrentPage() {
      $scope.data.mListEmit = page.getItemsDePagina();
    }

    function cleaner(){
      $scope.data.mListEmit = [];
      $scope.noResults = false;
      $scope.data.mProductoFilter.codProd = null;
      $scope.data.mContratante = "";
    }

    function viewDetails(val){
      $state.go('emitResumen', {numDoc: val}, {reload: false, inherit: true});
    }

    _calendarStart();
    _calendarEnd();
  }]);

});
