define([
  'angular', 'constants',
  '/polizas/app/autos/autosDocs/service/automovilDocsFactory.js'
], function(angular, constants){

  var appAutos = angular.module('appAutos');

  appAutos.controller('automovilDocsController', ['$scope', '$window', '$state', 'automovilDocsFactory', 'mpSpin', 'mModalAlert', function($scope, $window, $state, automovilDocsFactory, mpSpin, mModalAlert){

    document.title = 'OIM - Pólizas Autos - Cotizaciones autos';

    $scope.mConsultaDesde = new Date();
    $scope.consultaHasta = new Date();

    $scope.mismoDia=true;

    $scope.dateOptions = {
      initDate: new Date(),
      maxDate: new Date()
    };

    $scope.dateOptions2 = {
      initDate: $scope.mConsultaDesde,//new Date(),//mConsultaDesde,
      minDate: new Date(),
      maxDate: new Date()
    };

    $scope.$watch('mConsultaDesde', function(nv)
    {
      $scope.dateOptions2.minDate = $scope.mConsultaDesde;
    });

    $scope.errorCotizacionesVigentes = [];
    $scope.pgDocsAutos = { title: 'Cotizaciones auto', message: ''};

    $scope.filtrarPor = [
      {id: 'FECHA_REGISTRO', label: 'Fecha'},
      {id: 'NUMERO_DOCUMENTO', label: 'Nro. Cotización'}
    ];

    $scope.gLblProductoDocumentos = {
      label:'Filtrar por producto',
      required: false,
      error1: '* Este campo es obligatorio',
      defaultValue: '- Selecciona producto -'
    };

    $scope.datosConsulta = [
      { label: 'Producto cotizado',
        required: false,
        error1: 'Error lorem ipsum error lorem ipsum'
      },
      { label: 'Contratante',
        required: false,
        error1: 'Error lorem ipsum error lorem ipsum'
      },
      { label:'Ordenar por',
        required: false,
        error1: '* Este campo es obligatorio',
        defaultValue: '- Seleccione -'
      }
    ];

    $scope.searchOptions = {};

    $scope.searchOptions.filterNumbers = {
      'filterIni': 10
    }
    $scope.searchOptions.limitRow = $scope.searchOptions.filterNumbers.filterIni;   // Máximo número de registros por página

    $scope.searchOptions.pageLimit = 5;
    $scope.searchOptions.pageIni = {number:1, active:true};
    $scope.searchOptions.pageLast = $scope.searchOptions.pageLimit;

    /*########################
    # Calendar
    ########################*/
    $scope.inputCalendar = [
      { label: 'Desde',
        required: false,
        error1: '* Este campo es obligatorio',
        datepickerPopup: 'dd-MM-yyyy'
      },
      { label: 'Hasta',
        required: false,
        error1: '* Este campo es obligatorio',
        datepickerPopup: 'dd-MM-yyyy'
      }
    ];
    $scope.consultaDesde = $scope.inputCalendar[0];
    $scope.consultaHasta = $scope.inputCalendar[1];

    $scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];
    $scope.dt = new Date();
    $scope.hoy = formatearFecha($scope.dt);

    $scope.popup1 = {
        opened: false
    };
    $scope.popup2 = {
        opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.productoCotizado = $scope.datosConsulta[0];
    $scope.contratanteDocumentos = $scope.datosConsulta[1];
    $scope.filtrarDocumentos = $scope.datosConsulta[2];

    automovilDocsFactory.getClaims().then(function(response){
      if (response){
        $scope.codigoUsuario = response[2].value.toUpperCase();
        buscarCotizacion('', $scope.hoy, $scope.hoy, 1);
        $scope.showPages = true;
      }else {
        $scope.errorCotizacionesVigentes.value = true;
        $scope.errorCotizacionesVigentes.description = response.statusText;
      }
    }, function(error){
      console.log('error');
    });

    $scope.validationForm = function () {
      return $scope.frmDocs.$valid && !$scope.frmDocs.$pristine;
    };

    $scope.listarCotizacionesVigentes = function(nombre, desde, hasta, page){
      if(page==null){page=$scope.currentPage;}
      if($scope.currentPage != page){
        $scope.searchOptions.pageActive = {number:page, active:true};
        if(((desde instanceof Date) && (hasta instanceof Date))) {
          $scope.lastPage = page + 1;
          buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
        }else{
          buscarCotizacion(nombre, formatearFecha(desde), $scope.hoy, page);
        }
      }else{
        buscarCotizacion(nombre, $scope.hoy, $scope.hoy, page);
      }
    };

    $scope.consultaDocumentosPrev = function(nombre, desde, hasta, page){
      if($scope.currentPage != page && page >0){
        if(page>=0){
          $scope.lastPage = page - 1;
          $scope.searchOptions.pageActive = {number:page, active:true};
          if(((desde instanceof Date) && (hasta instanceof Date))) {
            buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
          }else{
            buscarCotizacion(nombre, $scope.hoy, $scope.hoy, page);
          }
        }
      }

    }
    $scope.consultaDocumentosNext = function(nombre, desde, hasta, page){
      if($scope.currentPage != page){
        if(page<$scope.CantidadTotalPaginas){
          $scope.lastPage = page - 1;
          $scope.searchOptions.pageActive = {number:page, active:true};
          if(((desde instanceof Date) && (hasta instanceof Date))) {
            buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
          }else{
            buscarCotizacion(nombre, $scope.hoy, $scope.hoy, page);
          }
        }
      }

    }

    $scope.consultaDocumentosIni = function(nombre, desde, hasta){
      if(((desde instanceof Date) && (hasta instanceof Date))) {
        buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), 1);
      }else{
        buscarCotizacion(nombre, $scope.hoy, $scope.hoy, 1);
      }
    }

    $scope.consultaDocumentosFin = function(nombre, desde, hasta){
      if(((desde instanceof Date) && (hasta instanceof Date))) {
        buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), 1);
      }else{
        buscarCotizacion(nombre, $scope.hoy, $scope.hoy, $scope.CantidadTotalPaginas);
      }
    }

    $scope.buscarCoti = function(nroDocumento){
      var key = 'documentosCotizacion';
      automovilDocsFactory.addVariableSession(key, nroDocumento);
      $state.go('cotizacionGuardadaAutos', {documentosCotizacion: nroDocumento}); // Redireccionamiento
    };

    function formatearFecha(fecha){
      if(fecha instanceof Date){
        var today = fecha;
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        if(dd === 32){
          dd = 1;
          mm = today.getMonth()+2;
        }


        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        return today = dd+'/'+mm+'/'+yyyy;
      }
    }

    function buscarCotizacion(nombre, desde, hasta, page){
        $scope.desde=desde;
        $scope.hasta=hasta;
        if(page<$scope.CantidadTotalPaginas){
          $scope.currentPage = page;
        }
        if(nombre==null){nombre='';}
        if(desde===hasta){$scope.mismoDia=true;}else{$scope.mismoDia=false;}
        if($scope.mFiltroResultado.id==null){var filtro = "NUMERO_DOCUMENTO";}

        var paramsCotizacionesVigentes = {
          FechaInicio: desde,//'24/10/2016', //desde,
          FechaFinal: hasta,//'24/10/2016', //hasta,
          NombreContratante: nombre.toUpperCase(),
          CodigoUsuario: $scope.codigoUsuario,
          CantidadFilasPorPagina : 10,
          PaginaActual : page,//0,
          ColumnaOrden : filtro//$scope.mFiltroResultado.id//"NUMERO_DOCUMENTO" //
        }

        mpSpin.start();
        automovilDocsFactory.getCotizaciones(paramsCotizacionesVigentes).then(function(response){
          mpSpin.end();
          if (response.OperationCode == constants.operationCode.success){
            $scope.CantidadTotalPaginas = response.Data.CantidadTotalPaginas; //empezando en 0
            $scope.CantidadTotalFilas = response.Data.CantidadTotalFilas;

            $scope.Lista = response.Data.Lista;

            if($scope.CantidadTotalFilas==null || $scope.CantidadTotalFilas==0){$scope.showCotizaciones = false;$scope.vacio=true;}else{$scope.showCotizaciones = true;$scope.vacio=false;}

          }else {
            $scope.errorCotizacionesVigentes.value = true;
            $scope.errorCotizacionesVigentes.description = response.Message;
          }
        }, function(error){
          mpSpin.end();
          console.log('Error en getCotizaciones: ' + error);
        });
    }

    $scope.getNumber = function(num) {
      if(num==0 || num==null){$scope.showCotizaciones = false;}else{
        $scope.showCotizaciones = true;
        return new Array(num);
      }
    }

  }])
  .factory('loaderCarDocs', ['automovilDocsFactory', '$q', function(automovilDocsFactory, $q){
    var products;

    //Products
    function getProducts(params){
      var deferred = $q.defer();
      automovilDocsFactory.getProducts(params).then(function(response){
        products = response.Data;
        deferred.resolve(response.Data);
      }, function (error){
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    return {
      getProducts: function(params){
        if (params){
          if(products) return $q.resolve(products);
          return getProducts(params);
        }
      }
    }

  }])
  .filter('startEnd', function() {
    return function(input, start, end) {
      if(input) {
          end = end + 1; //parse to int
          return input.slice(start,end);
      }
      return [];
    }
  })
});
