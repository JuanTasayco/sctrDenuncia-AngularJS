define([
  'angular', 'constants',
  '/polizas/app/accidentes/doc/service/accidentesGuardadoFactory.js'
], function(angular, constants){

  var appAccidentes = angular.module('appAccidentes');

  appAccidentes.controller('accidenteDocController', ['$scope', '$window', '$state', 'accidentesGuardadoFactory', 'mpSpin', function($scope, $window, $state, accidentesGuardadoFactory, mpSpin){

    (function onLoad(){
    //cargamos datos del usuario logueado
    $scope.dt = new Date();
    $scope.hoy = formatearFecha($scope.dt);

      accidentesGuardadoFactory.getProductsByRamo(constants.module.polizas.accidentes.companyCode, constants.module.polizas.accidentes.codeRamo, true).then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          $scope.productos = response.Data;
        }else{
          $scope.productos = [];
        }
      }, function(error){
          console.log('error');
      });

      $scope.today = $scope.hoy;
      buscarCotizacion('', $scope.hoy, $scope.hoy, 1);

    })();

    function formatearFecha(fecha){
      if(fecha!=null){
        var fechaC = fecha;
        var dd = fechaC.getDate();
        var mm = fechaC.getMonth()+1; //January is 0!

        var yyyy = fechaC.getFullYear();
        var yyyy2 = yyyy + 1;

         if(dd === 32){
          dd = 1;
          mm = today.getMonth()+2;
        }

        if(dd<10){
            dd='0'+dd
        }
        if(mm<10){
            mm='0'+mm
        }
        $scope.mConsultaHasta = dd+'/'+mm+'/'+yyyy2;
        $scope.mConsultaDesdeF = dd+'/'+mm+'/'+yyyy;
        // $scope.desde = fechaC;
        return fechaC = dd+'/'+mm+'/'+yyyy;
      }
    }

    $scope.errorCotizacionesVigentes = [];
    $scope.pgDocsAccidentes = { title: 'Documentos accidentes', message: ''};

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
    # Filtros
    ########################*/
    $scope.filtrarPor = [
      {id: 1, label: 'Fecha'},
      {id: 2, label: 'Estado'}
    ];

    /*########################
    # Vigencia
    ########################*/
    $scope.mConsultaDesde = new Date();
    $scope.mConsultaHasta = new Date();

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
    $scope.desde = formatearFecha(new Date());

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

    /*########################
    # Validaciones
    ########################*/
    $scope.validationForm = function () {
      return $scope.frmDocs.$valid && !$scope.frmDocs.$pristine;
    };

    /*########################
    # Consultas de docs
    ########################*/
    $scope.listarCotizacionesVigentes = function(nombre, desde, hasta, page){
      //console.log(page);
      if(page==0){page==1;}
      if(page==null){page=$scope.currentPage;}

      //if($scope.currentPage != page){
        $scope.searchOptions.pageActive = {number:page, active:true};
        if(((desde instanceof Date) && (hasta instanceof Date))) {
          $scope.lastPage = page + 1;
          buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
        }else{
          buscarCotizacion(nombre, formatearFecha(desde), $scope.hoy, page);
        }
      // }else{
      //   //buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
      // }
    };

    $scope.consultaDocumentosPrev = function(nombre, desde, hasta, page){

      // console.log(desde);
      // console.log(hasta);


      if($scope.currentPage != page){
        if(page>0){
          $scope.lastPage = page - 1;
          $scope.searchOptions.pageActive = {number:page, active:true};
          if(((desde instanceof Date) && (hasta instanceof Date))) {
            buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
          }else{
            //buscarCotizacion(nombre, $scope.hoy, $scope.hoy, page);
          }
        }
      }

    }
    $scope.consultaDocumentosNext = function(nombre, desde, hasta, page){
      if($scope.currentPage != page){
        if(page<$scope.CantidadTotalPaginas && page>0){
            $scope.lastPage = page + 1;
          $scope.searchOptions.pageActive = {number:page, active:true};
          if(((desde instanceof Date) && (hasta instanceof Date))) {
            buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), page);
          }else{
            //buscarCotizacion(nombre, $scope.hoy, $scope.hoy, page);
          }
        }
      }
    }

    $scope.consultaDocumentosIni = function(nombre, desde, hasta){
      if(((desde instanceof Date) && (hasta instanceof Date))) {
        buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), 1);
      }else{
        //buscarCotizacion(nombre, $scope.hoy, $scope.hoy, 1);
      }
    }

    $scope.consultaDocumentosFin = function(nombre, desde, hasta){
      if(((desde instanceof Date) && (hasta instanceof Date))) {
        buscarCotizacion(nombre, formatearFecha(desde), formatearFecha(hasta), 1);
      }else{
        //buscarCotizacion(nombre, $scope.hoy, $scope.hoy, $scope.CantidadTotalPaginas-1);
      }
    }

    $scope.buscarCoti = function(nroDocumento){
      // var key = 'documentosCotizacion';
      // accidentesGuardadoFactory.addVariableSession(key, nroDocumento);
      //$state.go('getAccidente', {documentosCotizacion: nroDocumento}); // Redireccionamiento
      $state.go('getAccidente', {quotation:nroDocumento}, {reload: true, inherit: false});
    };

    function buscarCotizacion(nombre, desde, hasta, page){
      if(page>0){
                $scope.desde = desde;
        $scope.hasta=hasta;
        if(page<$scope.CantidadTotalPaginas){
          $scope.currentPage = page;
        }
        if(nombre==null){nombre='';}
        if(desde===hasta){$scope.mismoDia=true;}else{$scope.mismoDia=false;}
        if(typeof($scope.mFiltroResultado) === 'undefined' ||
         $scope.mFiltroResultado.id === null){$scope.tipoFiltro=0;}else{$scope.tipoFiltro=$scope.mFiltroResultado.id;}
        //if($scope.mFiltroResultado===null){$scope.mFiltroResultado = {}; $scope.mFiltroResultado.id=0;}

        var paramsCotizacionesVigentes = {
          Contratante: nombre.toUpperCase(),
          FechaInicio: desde,//'24/10/2016', //desde,
          FechaFin: hasta,//'24/10/2016', //hasta,
          // CodigoUsuario: $scope.codigoUsuario,
          ColumnaOrden: 1,//$scope.tipoFiltro, //1 fecha 2 estado 0 numero de cotizacion
          CantidadFilasPorPagina : 10,
          PaginaActual : page,//0,
          // ColumnaOrden : filtro//$scope.mFiltroResultado.id//"NUMERO_DOCUMENTO" //
        }

        mpSpin.start();
        accidentesGuardadoFactory.getCotizaciones(paramsCotizacionesVigentes).then(function(response){
          mpSpin.end();
          if (response.OperationCode == constants.operationCode.success){
            $scope.CantidadTotalPaginas = response.Data.CantidadTotalPaginas; //empezando en 0
            $scope.CantidadTotalFilas = response.Data.CantidadTotalFilas;

            $scope.Lista = response.Data.Lista;
            $scope.showCotizaciones = true;
            if(!$scope.Lista.length>0){$scope.vacio=true;}else{$scope.vacio=false;}
            if($scope.CantidadTotalFilas==null){$scope.showCotizaciones = false;}else{$scope.showCotizaciones = true;}

          }else if (response.Message.length > 0){
            $scope.vacio=false;
            $scope.errorCotizacionesVigentes.value = true;
            $scope.errorCotizacionesVigentes.description = response.Message;
          }else{
            $scope.vacio=false;
          }
        }, function(error){
          mpSpin.end();
          $scope.vacio=false;
          console.log('Error en getCotizaciones: ' + error);
        });
      }
    }

    $scope.getNumber = function(num) {
      if(num==0 || num==null){$scope.showCotizaciones = false;}else{
        $scope.showCotizaciones = true;
        // return new Array(num-1);
        return new Array(num);
      }
    }

    $scope.limpiar = function(){
      $scope.mContratante = '';
      buscarCotizacion('', $scope.hoy, $scope.hoy, 1);
    }

  }]);

  appAccidentes.filter('startEnd', function() {
    return function(input, start, end) {
      if(input) {
          // start = +start; //parse to int
          end = end + 1; //parse to int
          return input.slice(start,end);
      }
      return [];
    }
  })
  .directive('showFilter', ['$window', '$timeout', function($window,$timeout){
    // Runs during compile
    return {
      restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
      link: function(scope, element, attrs) {
        console.log('Llamando directiva... ');
        var w = angular.element($window);

        function showFilterBox(){
          // console.log($window.innerWidth);
          scope.isFilterVisible = false;
          var isDesktop = $window.innerWidth > 991;
          var heightDevice = $window.innerHeight;
          if (isDesktop) {
            element.css('top', 'auto');
          } else {
            element.css('top', heightDevice - 70 + 'px');
          }
          scope.toggleFilter = function(){
            // console.log('Activando filtro... ');
            var isDesktop = $window.innerWidth > 991;
            if (isDesktop) {
              document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
              return;
            } else {
              scope.isFilterVisible = !scope.isFilterVisible;
              if (scope.isFilterVisible) {
                document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
              } else {
                document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
              }
            }
          }
        }

        $timeout(init, false);
        function init(){
          showFilterBox();
        }

        // **************************************************
        // Script cuando pasa de portrait a layout en Tablet
        // **************************************************
        w.bind('resize', function(){
          // console.log('Resize... ', $window.innerWidth, scope.isFilterVisible);
          var isDesktop = $window.innerWidth > 991;
          var heightDevice = $window.innerHeight;
          if (isDesktop) {
            // console.log('Es desktop... ');
            // scope.isFilterVisible = false;
            element.css('top', 'auto');
            document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
            return;
          } else {
            element.css('top', heightDevice - 70 + 'px');
            if (scope.isFilterVisible) {
              document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
            }
          }
        });
      }
    };
  }])
  ;

});
