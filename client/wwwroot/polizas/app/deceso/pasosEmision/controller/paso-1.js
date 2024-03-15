'use strict';

define(['angular', 'constants', 'helper', 'mpfPersonConstants', 'mpfPersonComponent', 'decesoFactory', 'saludFactory', 'modalSendEmail'], function(
  angular, constants, helper) {

    decesoEmision1Controller.$inject = [
    '$scope', '$timeout', '$window', '$state', '$uibModal', 'mModalAlert', 'mainServices', 'decesoFactory', 'saludFactory', '$stateParams', 'oimAbstractFactory', 'mpSpin', '$filter', 'decesoAuthorize'
  ];

  function decesoEmision1Controller($scope, $timeout, $window, $state, $uibModal, mModalAlert, mainServices, decesoFactory, saludFactory, $stateParams, oimAbstractFactory, mpSpin, $filter, decesoAuthorize ) {
    var vm = this;
    $scope.formVida = {};
    $scope.firstStep = {}
    $scope.data = {};
    $scope.format = constants.formats.dateFormat;
    $scope.vigenciaMon = 12;
    $scope.data.fechaActual = new Date();
    $scope.data.fechaVencimiento = new Date(new Date().setYear($scope.data.fechaActual.getFullYear() + 1));
    $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;
    $scope.validadores = {
      minStartDate: null,
      maxEndDate: null,
    }

    function changedateValidate(date, number){
      $scope.data.fechaActual = new Date(date.setDate(number));
      if (validarFechas($scope.data.fechaActual)){
        if (_.find([8, 15, 22, 30], function (key) { return key === $scope.data.fechaActual.getDate() })){
          if ($scope.vigenciaMon){
            $scope.data.fechaVencimiento = new Date(new Date($scope.data.fechaActual).setMonth($scope.data.fechaActual.getMonth() + $scope.vigenciaMon  ));
          }
        }else{
          $scope.onFechaActualChanged($scope.data.fechaActual);
        }
      }else{
        $scope.onFechaActualChanged(new Date());
      }
    }
    function validarFechas(date){
      var dateVal = date
      var minDate = new Date();
      var maxDate = new Date();
      $scope.validadores.maxEndDate = maxDate.setDate(maxDate.getDate() + 30);
      $scope.validadores.minStartDate = minDate;
      if(!(dateVal >= $scope.validadores.minStartDate && dateVal <= $scope.validadores.maxEndDate)) {
        return false
      }
      return true;

    }

    $scope.validate = function(itemName){
      return decesoAuthorize.menuItem($scope.codeModule, itemName);
    }
    $scope.onFechaActualChanged = function(date){

      var datecon = date
      var dateVal = date
      var minDate = new Date();
      var maxDate = new Date();
      $scope.validadores.maxEndDate = maxDate.setDate(maxDate.getDate() + 30);
      $scope.validadores.minStartDate = minDate
      if(!(date >= $scope.validadores.minStartDate && date <= $scope.validadores.maxEndDate)) {
        $scope.data.fechaActual = minDate;
        dateVal = minDate;
      }

      var dayDate = dateVal.getDate()
      if(dayDate > 30){
        changedateValidate(dateVal, 39)
      }
      else if(dayDate <= 8 ){
        changedateValidate(dateVal, 8)
      }else if (dayDate <= 15){
        changedateValidate(dateVal, 15)
      }else if (dayDate <= 22){
        changedateValidate(dateVal, 22)
      }else{
        changedateValidate(dateVal, 30)
      }
    }

    vm.$onInit = function () {
      
      $scope.verDetalleStyle = {
        'position': 'absolute',
        'top': '5px',
        'right': '15px',
        'font-size': '13px',
        'text-decoration': 'none'
      };
      $scope.isMyDream = oimAbstractFactory.isMyDream();
      $scope.isMobile = helper.isMobile();
      saludFactory.getDocumentType(false).then(function(res) {
        if (res.OperationCode === 200) {
          $scope.tiposDeDocumentos = res.Data;
          
        } else {
          console.log("error");
        }
        
      })

      $scope.numeroDocumento = $stateParams.quotationNumber;
      searchInfo($stateParams.quotationNumber);
    };

    function searchInfo(numDoc) {
      mainServices.fnReturnSeveralPromise([
        decesoFactory.ObtenerCotizacion(numDoc, true),
        decesoFactory.ListarRamo(false),
        decesoFactory.ListaMedioPago(false),
      ], true).then(function (response) {
        $scope.firstStep = response[0].Data;
        $scope.asegurados = angular.copy(response[0].Data.Asegurados);
        $scope.contratante = angular.copy(response[0].Data.Contratante);             
        $scope.productos = response[1].Data; 

        $scope.firstStep.FechaInicioBkp = angular.copy($scope.firstStep.FechaInicio);
        var dateParts = $scope.firstStep.FechaInicio.split("/");
        var dateObject = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // month is 0-based
        $scope.data.fechaInit = dateObject;
        $scope.data.fechaActual = dateObject;

        $scope.firstStep.FechaFinBkp = angular.copy($scope.firstStep.FechaFin);
        var dateParts1 = $scope.firstStep.FechaFin.split("/");
        var dateObject1 = new Date(dateParts1[2], dateParts1[1] - 1, dateParts1[0]); // month is 0-based

        decesoFactory.ListaMedioPago($scope.firstStep.Modalidad.CodigoModalidad, false)
        then(function (response) {
          if (response.OperationCode != constants.operationCode.success) {
            return;
          }

          $scope.medioPagos = response.Data;
        })
        .catch(function (error) {
        });

        decesoFactory.FechaVigencia($scope.firstStep.Ramo.CodigoRamo, $scope.firstStep.PolizaGrupo.NumeroPolizaGrupo, $scope.firstStep.Modalidad.CodigoModalidad, false).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            $scope.vigenciaMon = parseInt(response.Data)
            $scope.data.fechaVencimiento = new Date(new Date($scope.data.fechaActual).setMonth(dateObject.getMonth() + $scope.vigenciaMon  ));
            }
        })
        .catch(function(error) {
        });

        $scope.onFechaActualChanged($scope.data.fechaActual)

        $scope.numQuotation = $scope.firstStep.NumeroCotizacion;
        $scope.numQuotation = $scope.firstStep.NumeroCotizacion;
        $scope.cuotas = $scope.firstStep.Cuotas;
        $scope.primaListFirstTable = $scope.firstStep.Primas;
        $timeout(function(){
          _formatearData();
        },1);
      }, function (error) {
        $scope.productos = [];
        $scope.medioPagos = [];
      });   

      
    }

    $scope.cambiarFecNacAsegurado = function (index) {
      $scope.firstStep.Asegurados[index].Edad = _difAnos(new Date(), $scope.firstStep.Asegurados[index].FechaNacimiento);
    }
    function _cambiarFormatoFechaDate(fecha) {
      if (!angular.isDate(fecha)) {
        var fechas = fecha.split('/');
        return new Date(fechas[1] + '/' + fechas[0] + '/' + fechas[2]);
      }else{
        return fecha;
      }
    }
    function _cambiarFormatoDatetime(fecha) {
      var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
      return fechaModificada;
    }
    function _difAnos(dt2, dt1) {
      var diferencia =(dt2.getTime() - dt1.getTime()) / 1000;
      diferencia /= (60 * 60 * 24);
      return Math.floor(diferencia/365.25);
    }

    function _createObjectComponent(name, data){
      $scope.firstStep[name].TipoDocumento = data.TipoDocumento.Codigo;
      $scope.firstStep[name].NumeroDocumento = data.NumeroDocumento;
      $scope.firstStep[name].Nombre = data.Nombre;
      $scope.firstStep[name].ApellidoPaterno = data.ApellidoPaterno;
      $scope.firstStep[name].ApellidoMaterno = data.ApellidoMaterno;
      $scope.firstStep[name].FechaNacimiento = _cambiarFormatoDatetime(data.FechaNacimiento);
      $scope.firstStep[name].Sexo = data.Sexo ? data.Sexo.Codigo : "";
      $scope.firstStep[name].NombreEmpresa = data.NombreEmpresa;
      $scope.firstStep[name].Telefono = data.TelefonoCasa;
      $scope.firstStep[name].Telefono2 = data.TelefonoMovil;
      $scope.firstStep[name].CorreoElectronico = data.Correo;
      $scope.firstStep[name].Profesion = {Codigo: data.CodProfesion};
      $scope.firstStep[name].Ubigeo = {
        CodigoPaisResidencia: data.Nacionalidad,
        CodigoPaisNatal: data.Nacionalidad,
        CodigoDepartamento: data.Direccion.CodDepartamento,
        CodigoProvincia: data.Direccion.CodProvincia,
        CodigoDistrito: data.Direccion.CodDistrito,
        NombreVia: data.Direccion.NomDomicilio,
        CodigoVia: data.Direccion.TipDomicilio,
        CodigoNumero: data.Direccion.TipNumero,
        TextoNumero: data.Direccion.DescNumero,
        CodigoInterior: data.Direccion.TipInterior,
        TextoInterior: data.Direccion.NroInterior,
        CodigoZona: data.Direccion.TipZona,
        TextoZona: data.Direccion.NomZona,
        Referencia: data.Direccion.RefDireccion,
      };
      
      if(data.EstadoCivil){
        $scope.firstStep[name].civilState = {
          Codigo: data.EstadoCivil.CodigoEstadoCivil
        };
      }
      
      $scope.firstStep[name].ignoreEquifax = true;
    }


    function _formatearData() {
      $scope.firstStep.ContratantePerson = {};
      $scope.firstStep.TitularPerson = {};
      var keyTitular = '';

      $scope.firstStep.Asegurados.forEach(function (asegurado, key) {
        asegurado.FechaNacimiento = _cambiarFormatoFechaDate(asegurado.FechaNacimiento);
        asegurado.Edad = _difAnos(new Date(), asegurado.FechaNacimiento);
        if (angular.isObject(asegurado.EstadoCivil) && asegurado.EstadoCivil)
          asegurado.EstadoCivil = { CodigoEstadoCivil: asegurado.EstadoCivil.Codigo }
        if (asegurado.TipoAsegurado.Codigo === 'TI') {
          keyTitular = key;
        }
        if (!angular.isUndefined(asegurado.Ubigeo)) {            
          asegurado.Pais = {
            Codigo: asegurado.Ubigeo.CodigoPaisNatal
          }
        } else {
          asegurado.Pais = {
            Codigo: 'PE'
          }
        }
      });
      $scope.firstStep.Titular = $scope.firstStep.Asegurados.splice(keyTitular, 1)[0];

      if (angular.isObject($scope.firstStep.Contratante)) {
        /* $scope.firstStep.Contratante.Pais = {
          Codigo: $scope.firstStep.Contratante.Ubigeo.CodigoPaisNatal
        } */
        $scope.firstStep.Contratante.FechaNacimiento = _cambiarFormatoFechaDate($scope.firstStep.Contratante.FechaNacimiento);
        $scope.firstStep.Contratante.EstadoCivil = {
          CodigoEstadoCivil: $scope.firstStep.Contratante.EstadoCivil.Codigo
        }
      } else {
        $scope.firstStep.Contratante = {
          TipoDocumento: $scope.firstStep.Titular.TipoDocumento,
          NumeroDocumento: $scope.firstStep.Titular.NumeroDocumento,
          ApellidoMaterno: $scope.firstStep.Titular.ApellidoMaterno,
          ApellidoPaterno: $scope.firstStep.Titular.ApellidoPaterno,
          Nombre: $scope.firstStep.Titular.Nombre,
          Sexo: $scope.firstStep.Titular.Sexo,
          FechaNacimiento: $scope.firstStep.Titular.FechaNacimiento,
        }
      }

      _createObjectComponent("ContratantePerson", $scope.firstStep.Contratante);
      _createObjectComponent("TitularPerson", $scope.firstStep.Titular);

      
      //$scope.valcheck.val = ($scope.firstStep.Titular.NumeroDocumento == $scope.firstStep.Contratante.NumeroDocumento && !!$scope.firstStep.MotivoSolicitud.NumeroPolizaMigracion);
    }
    function formatDate(date) {
      var format = date.slice(0, 10);
      return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
    }

    $scope.guardar = function () {
      $scope.firstStep.Contratante.FechaNacimientojs = formatDate(JSON.parse(JSON.stringify($scope.firstStep.Contratante.FechaNacimiento)));
      $scope.firstStep.Contratante.FechaNacimientojs = formatDate(JSON.parse(JSON.stringify($scope.firstStep.Contratante.FechaNacimientojs)));
      $scope.firstStep.FechaInicio = formatDate(JSON.parse(JSON.stringify($scope.data.fechaActual)));
      $scope.firstStep.FechaFin = formatDate(JSON.parse(JSON.stringify($scope.data.fechaVencimiento)));
      decesoFactory.setPasos($scope.firstStep);
      $state.go('.', {
        step: 2
      });
    }

  }
  return angular.module('appDeceso')
    .controller('decesoEmision1Controller', decesoEmision1Controller)
});

