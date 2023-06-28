define([
  'angular', 'lodash', 'constants', 'constantsSepelios', 'mpfPersonComponent'
], function (angular, _, constants, constantsSepelios) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('cotizacionSepelioStep1Controller', cotizacionSepelioStep1Controller);

  cotizacionSepelioStep1Controller.$inject = ['$scope', '$state', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'campoSantoFactory', 'campoSantoService', '$q'];

  function cotizacionSepelioStep1Controller($scope, $state, mModalAlert, mpSpin, $uibModal, mModalConfirm, campoSantoFactory, campoSantoService, $q) {
    $scope.cntsSepelios = constantsSepelios
    $scope.showNecesidad = true;
    $scope.inputProductoDisable = true;
    $scope.productoPrecio = 0;
    $scope.productoPrecioDescuento = 0;
    $scope.descuento = 0;
    $scope.validateSection = false;
    $scope.combo = {
      camposanto: [],
      modalidad: [],
      tipoContrato: [],
      producto: []
    }
    $scope.modelo = {};
    $scope.modelo.directo = false;
    $scope.prospecto = {};
    $scope.exFaxCamposanto = {};
    $scope.appCode = 'FUNERARIAS';
    $scope.formCode = 'COT-FUN-CN';

    (function load_cotizacionSepelioStep1Controller() {
      $scope.modelo.estudioSuperior = "0";
      $scope.modelo.auto = 0;
      $scope.modelo.descuento = 0;
      $scope.showNecesidad = true;
      $scope.inputProductoDisable = true;
      $scope.productoPrecio = 0;
      $scope.productoPrecioDescuento = 0;
      $scope.descuento = 0;
      $scope.btnguardadoParcialDisable = false;
      $scope.btngenerarCotizacionDisable = false;
      $scope.btngenerarEvaluacionDisable = false;
      $scope.TipoFinancimiento = 'CONTADO';
      $scope.modelo.idTipoFinanciamiento = "TIPO_1";
      $scope.disabledAgrupamiento = true;
      $scope.userRoot = campoSantoFactory.userRoot();
      $scope.NecesidadRamo = { "400": 'Necesidad Inmediata', "401": ' Necesidad Futura' };
      $scope.disabledAll = false;
      
      $scope.$on('personForm', function (event, data) {
        if (data.contratante) {
          $scope.contractorValid = data.valid;
          $scope.personData = data.contratante;
        }
      });
      _continuarProspecto();

    })();

    $scope.$on('changingStep', function(ib,e){
      e.cancel = true;
    });

    function _getClaims() {
      var deferred = $q.defer();
      campoSantoFactory.getClaims().then(function (response) {
        $scope.modelo.claims = response;
        $scope.modelo.claims = {
          codigoUsuario: $scope.modelo.claims[2].value.toUpperCase(),
          rolUsuario: $scope.modelo.claims[12].value,
          nombreAgente: $scope.modelo.claims[6].value.toUpperCase(),
          codigoAgente: $scope.modelo.claims[7].value
        }

        
          $scope.modelo.idPago = $scope.TipoFinancimiento ;
        var nombreAgente;
        if ($scope.modelo.claims.nombreAgente.indexOf(" >>> ") !== -1)
          nombreAgente = getFormatNombreAgente($scope.modelo.claims.nombreAgente);
        else nombreAgente = $scope.modelo.claims.nombreAgente;

        $scope.mAgente = {
          codigoAgente: $scope.modelo.claims.codigoAgente,
          codigoNombre: $scope.modelo.claims.codigoAgente + " >>> " + nombreAgente,
          importeAplicarMapfreDolar: 0,
          mcamapfreDolar: "",
          codigoEstadoCivil: 0,
          codigoUsuario: $scope.modelo.claims.codigoUsuario,
          rolUsuario: $scope.modelo.claims.rolUsuario
        }

        deferred.resolve($scope.modelo.claims);
      }, function (error) {
        deferred.reject(error.statusText);
      });
      return deferred.promise;
    }

    $scope.goFormCotizacion = function (codRamo) {
      $scope.showNecesidad = false;
      $scope.TipoNecesidad = $scope.NecesidadRamo[codRamo];
      $scope.codRamo = codRamo;
      _listarCombos();
      $scope.changeTipoFinanciamiento('CONTADO')
    }

    function _continuarProspecto() {
      var dataProspecto = campoSantoFactory.getdataProspecto();
      if (dataProspecto){
        $scope.prospecto = dataProspecto;
        loadDataTemporal();
      }else if (campoSantoFactory.getidCotizacion() !== null) {
        campoSantoService.getCotizacion(campoSantoFactory.getidCotizacion())
          .then(function (response) {
            $scope.prospecto = response.Data;
            loadDataTemporal();
          })
          .catch(function () {
            $scope.showNecesidad = true;
          })
      }
      else {
        $scope.prospecto = null;
        _getClaims();
      }
    }

    function loadDataTemporal(){
            $scope.showNecesidad = false;
            $scope.codRamo = $scope.prospecto.idRamo;
            $scope.modelo.camposanto ={
              Codigo : $scope.prospecto.idCampoSanto
            }
            $scope.modelo.tipoContrato ={
              Codigo : $scope.prospecto.idTipoProducto
            }
            $scope.TipoNecesidad = $scope.NecesidadRamo[$scope.codRamo];
            $scope.TipoFinancimiento = $scope.prospecto.idPago;
            $scope.modelo.TipoFinancimiento = $scope.prospecto.idPago;

            _listarCombos();
            _setComboContinuarPropescto();        
    }

    function _setComboContinuarPropescto() {
      $scope.personData = {};
      $scope.personData.ignoreEquifax = true;
      $scope.modelo.camposanto = { Codigo: $scope.prospecto.idCampoSanto };
      $scope.modelo.tipoContrato = { Codigo: $scope.prospecto.idTipoProducto };
      $scope.modelo.modalidad = { Codigo: $scope.prospecto.idModalidad };
      $scope.modelo.producto = { Codigo: $scope.prospecto.idProducto };
      $scope.productoPrecio = parseFloat($scope.prospecto.costoTotal).toFixed(2);
      $scope.modelo.descuento = $scope.prospecto.descuento;
      $scope.modelo.cuotaInicial = $scope.prospecto.cuotaInicial;
      $scope.modelo.auto = $scope.prospecto.idAuto;
      $scope.modelo.cuotas = { Codigo: $scope.prospecto.idFraccionamiento,NumeroCuota: $scope.prospecto.numeroCuotas};
      $scope.modelo.estudioSuperior = $scope.prospecto.estudiosSuperiores;
      $scope.prospecto.idGradoEducacion ? $scope.modelo.gradoInstruccion = { Codigo: $scope.prospecto.idGradoEducacion } : null;
      $scope.productoPrecioDescuento = parseFloat($scope.prospecto.costoFinal).toFixed(2);
      $scope.personData.documentNumber = $scope.prospecto.numDocumento
      $scope.personData.documentType = { Codigo: $scope.prospecto.idDocumento }
      $scope.personData.ApellidoMaterno = $scope.prospecto.materno || null
      $scope.personData.ApellidoPaterno = $scope.prospecto.paterno || null
      $scope.personData.Nombre = $scope.prospecto.nombre || null
      $scope.personData.CorreoElectronico = $scope.prospecto.correoElectronico
      $scope.personData.Telefono = $scope.prospecto.celular1
      $scope.personData.Telefono2 = $scope.prospecto.celular2;
      $scope.personData.FechaNacimiento = $scope.prospecto.idDocumento != "RUC" ? campoSantoFactory.formatearFecha($scope.prospecto.fechaNacimiento) : null;
      $scope.validateSection = $scope.TipoFinancimiento === 'FINANCIADO' && $scope.prospecto.idDocumento !== "RUC" ? true : false
      $scope.prospecto.idEstadoCivil ? $scope.personData.civilState = { Codigo: $scope.prospecto.idEstadoCivil } : null;
      $scope.personData.Ubigeo = {
        CodigoDepartamento: $scope.prospecto.idDepartamento >= 0 ? $scope.prospecto.idDepartamento : null,
        CodigoProvincia: $scope.prospecto.idProvincia >= 0 ? $scope.prospecto.idProvincia : null,
        CodigoDistrito: $scope.prospecto.idDistrito >= 0 ? $scope.prospecto.idDistrito : null
      }
      $scope.mAgente = {
        codigoAgente: $scope.prospecto.idAgente,
        codigoNombre: $scope.prospecto.idAgente + " >>> " + getFormatNombreAgente($scope.prospecto.nombreAgente),
        importeAplicarMapfreDolar: 0,
        mcamapfreDolar: "",
        codigoEstadoCivil: 0,
      }
      $scope.personData.Direccion = $scope.prospecto.direccion;
      $scope.personData.ageRange = { Codigo: $scope.prospecto.idRangoEdad };
      $scope.inputProductoDisable = false;
      $scope.idPrima = $scope.prospecto.idPrima || 1;
      _getProductoSource();
      $scope.modelo.producto = { Codigo: $scope.prospecto.idProducto };
      $scope.modelo.estadoCotizacion = $scope.prospecto.estado;
      $scope.modelo.contratoRelacionado = $scope.prospecto.NumeroContratoRelacionado;
      $scope.showContratoRelacionado =  $scope.modelo.contratoRelacionado ?  true : false;
      $scope.disabledAll = $scope.prospecto.estado === "APROBADO" ? true : false;
    }

    function _listarCombos() {
      _getCampoSanto();
      _getTipoContrato();
      _getModalidad();
      _getProxyGradoIntruccion();
      _getProxyEdad();
      _getCategoria();
      _TipologiaFinanciamiento();
      _getCuotas();
    }


    function _getCampoSanto() {
      campoSantoService.getProxyCamposanto($scope.codRamo).then(function (response) {
        $scope.combo.camposanto = response.Data;
      });
    }

    function _getTipoContrato() {
      campoSantoService.getProxyTipoContrato($scope.codRamo).then(function (response) {
        $scope.combo.tipoContrato = response.Data;
      });
    }

    $scope.getProducto = function () {
      $scope.idPrima = $scope.modelo.cuotas ? $scope.modelo.cuotas.IdPrima : 1;
      if($scope.modelo.modalidad && $scope.modelo.tipoContrato && $scope.modelo.camposanto){
        if ($scope.modelo.modalidad.Codigo && $scope.modelo.tipoContrato.Codigo && $scope.modelo.camposanto.Codigo) {
        $scope.combo = {
          producto: []
        }
        if ($scope.codRamo == 401 && $scope.modelo.tipoContrato.Codigo == "2") {
          if ($scope.modelo.contratoRelacionado) {
            _getProductoSource();
            $scope.inputProductoDisable = false
          }
        }
        else {
          _getProductoSource()
          $scope.inputProductoDisable = false
        }
        }
      }
      else {
        $scope.inputProductoDisable = true;
      }
    }

    $scope.isAmpliacion = function () {
      if($scope.modelo.tipoContrato){
        $scope.modelo.tipoContrato.Codigo == "2" && $scope.codRamo == "401" ? $scope.showContratoRelacionado = true : $scope.showContratoRelacionado = false;
      }
    }
    $scope.modalidadList =  function () {
      _getModalidad();
    }

    function _getModalidad() {
      if($scope.modelo.tipoContrato && $scope.modelo.tipoContrato.Codigo && $scope.modelo.camposanto && $scope.modelo.camposanto.Codigo){
        campoSantoService.getProxyModalidad($scope.codRamo,$scope.modelo.tipoContrato.Codigo,$scope.modelo.camposanto.Codigo).then(function (response) {
          $scope.combo.modalidad = response.Data;
        });
      }
    }

    function _getProductoSource() {
      campoSantoService.getProxyProducto($scope.codRamo, $scope.modelo.modalidad.Codigo, $scope.modelo.camposanto.Codigo, $scope.idPrima, $scope.modelo.tipoContrato.Codigo, $scope.modelo.contratoRelacionado).then(function (response) {
        $scope.combo.producto = angular.copy(response.Data);
        $scope.combo.producto = $scope.combo.producto.map(function name(producto) {
          producto.Precio = parseFloat(producto.Precio).toFixed(2);
          return producto
        })
        if ($scope.TipoFinancimiento === 'FINANCIADO') {
          if ($scope.modelo.cuotas.Codigo) {
            if ($scope.combo.producto.length === 0) {
              mModalAlert.showWarning("La cuota seleccionada no tiene un producto asignado, por favor seleccionar otra cuota.", "");
            }
          }
        }
      });
    }

    function _getProxyGradoIntruccion() {
      campoSantoService.getProxyGradoIntruccion().then(function (response) {
        $scope.gradoInstruccion = response.Data;
      });
    }

    function _getProxyEdad() {
      campoSantoService.getProxyEdad().then(function (response) {
        $scope.edad = response.Data;
      });
    }

    function _TipologiaFinanciamiento() {
      campoSantoService.getTipologiaFinanciamiento().then(function (response) {
        $scope.tipologiaFinanciamiento = response.Data;
      });
    }

    function _getCategoria() {
      campoSantoService.getCategoriaProducto().then(function (response) {
        $scope.categoria = response.Data;
      });
    }
    function _getCuotas() {
      campoSantoService.getFraccionamiento($scope.codRamo).then(function (response) {
        $scope.cuotas = response.Data;
      });
    }
    function _getIDTipoFinanciamiento() {
      var cuotas = $scope.modelo.cuotas ? $scope.modelo.cuotas.NumeroCuota : 1;
      $scope.modelo.idTipoFinanciamiento = campoSantoFactory.getIDTipoFinanciamiento(cuotas);
    }

    function _validarLimaMetropolitana() {
      $scope.modelo.limaMetropolitana = "1";
      $scope.modelo.zona = "7";
      if ($scope.personData) {
        if (($scope.personData.Department.Codigo == 15 || $scope.personData.Department.Codigo == 7) && ($scope.personData.Province.Codigo == 128 || $scope.personData.Province.Codigo == 67)) {
          if ($scope.personData.District) {
            var DistrictList = constantsSepelios.District;
            var distrito = DistrictList.filter(function (x) { return $scope.personData.District.Descripcion.replace(/\s+/g, '') == x.distrito.replace(/\s+/g, '') });
            distrito ? $scope.modelo.limaMetropolitana = "0" : $scope.modelo.limaMetropolitana = "1";
            var zonas = { "MODERNA": "0", "ANTIGUA": "1", "ESTE": "2", "NORTE": "3", "SUR": "4", "PERIFERIA": "5", "CALLAO": "6" }
            $scope.modelo.zona = zonas[distrito[0].zona];
          }
        }
      }
    }

    function _getIdRangoEdad() {
      if ($scope.personData) {
        if ($scope.personData.year && !$scope.personData.year.selectedEmpty) {
          var dateString = $scope.personData.year.Descripcion + '-' + $scope.personData.month.Descripcion + '-' + $scope.personData.day.Descripcion;
          $scope.modelo.fechaNacimiento = dateString;
          var today = new Date();
          var age = today.getFullYear() - parseInt($scope.personData.year.Descripcion);
          var m = (today.getMonth() + 1) - parseInt($scope.personData.month.Descripcion);
          if (m < 0 || (m === 0 && today.getDate() < parseInt($scope.personData.day.Descripcion))) {
            age--;
          }
          if (age >= 0 && age <= 17) { $scope.modelo.idrangoedad = "1" }
          else if (age >= 18 && age <= 40) { $scope.modelo.idrangoedad = "2" }
          else if (age >= 41 && age <= 60) { $scope.modelo.idrangoedad = "3" }
          else if (age >= 61 && age <= 80) { $scope.modelo.idrangoedad = "4" }
          else {
            $scope.modelo.idrangoedad = "5";
          }
        }
      }
    }

    $scope.descuentoProducto = function () {
      if ($scope.modelo.descuento > 0) {
        $scope.modelo.descuento = $scope.modelo.descuento <= 100 ? $scope.modelo.descuento : 100;
        $scope.productoPrecioDescuento = ($scope.productoPrecio - ($scope.modelo.descuento * $scope.productoPrecio) / 100).toFixed(2);
      }
      else {
        $scope.productoPrecioDescuento = $scope.productoPrecio
      }
    }

    $scope.backSeleccionarRamo = function () {
      $scope.showNecesidad = true;
      campoSantoFactory.setidCotizacion(null);
      campoSantoFactory.setdataProspecto(null);
    }

    $scope.selectProducto = function (precio) {
      $scope.productoPrecioDescuento = precio;
      $scope.productoPrecio = precio;
    }

    $scope.changeTipoFinanciamiento = function (tipo) {
      if (!$scope.disabledAll) {

        $scope.combo = {
          producto: []
        }

        $scope.modelo.camposanto = { Codigo: null };
        $scope.modelo.tipoContrato = { Codigo: null };
        $scope.modelo.modalidad = { Codigo: null };
        $scope.modelo.producto = { Codigo: null };
        $scope.modelo.cuotas = null;
        $scope.modelo.descuento = 0;
        $scope.modelo.productoPrecio = 0;
        $scope.modelo.productoPrecioDescuento = 0;

        if (tipo === 'CONTADO') {
          $scope.TipoFinancimiento = 'CONTADO'
          $scope.modelo.idPago = tipo;
          $scope.modelo.idTipoFinanciamiento = "TIPO_1"
          $scope.validateSection = false;
          return;
        }

        if (tipo === 'FINANCIADO') {
          $scope.TipoFinancimiento = 'FINANCIADO'
          $scope.modelo.idPago = tipo;
          $scope.validateSection = true;
          return;
        }

        if (tipo === 'DIRECTO') {
          $scope.modelo.directo = !$scope.modelo.directo;
          $scope.TipoFinancimiento = 'DIRECTO'
          $scope.modelo.idPago = tipo;
          $scope.validateSection = true;
          return;
        }
       
       
      }
    }

    function _goToSimulador(step) {
      $scope.modelo.ramo = $scope.codRamo
      $scope.modelo.personData = $scope.personData;
      $scope.modelo.idCotizacion = $scope.prospecto ? $scope.prospecto.idCotizacion : null;

      if($scope.prospecto !== null ){
        $scope.modelo.estadocivil = $scope.prospecto ? $scope.prospecto.idEstadoCivil : null;
        $scope.modelo.fechaNacimiento = $scope.prospecto ? $scope.prospecto.fechaNacimiento : null;
        $scope.modelo.idrangoedad = $scope.prospecto ? $scope.prospecto.idRangoEdad : null;
        $scope.modelo.step = step;
        $scope.modelo.simulacion = {
          descuento : $scope.prospecto ? $scope.prospecto.descuento : null,
          cuotaInicial : $scope.prospecto ? $scope.prospecto.cuotaInicial : null,
          precioProducto : $scope.prospecto ? $scope.prospecto.precioProducto : null,
          step: 2,
          estado: $scope.TipoFinancimiento === 'DIRECTO' ? "PRE-EMITIDO" : "COTIZADO",
        }
      }
      $scope.modelo.claims = {
        codigoAgente :  $scope.mAgente ? $scope.mAgente.codigoAgente : null,
        nombreAgente :  $scope.mAgente ? getFormatNombreAgente($scope.mAgente.codigoNombre) : null,
      }
      setDataTemporal();
      campoSantoFactory.setdataDetalleSimulacion($scope.modelo);
      campoSantoFactory.setComponenteView('simulador-cotizacion');
      
      $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: 2 }, { reload: true, inherit: false });
    }

    function getFormatNombreAgente(nombreAgente){
      var parts = nombreAgente.split(" >>> ");
      if (parts.length > 1) return parts[1];
      else return parts[0] ;
    }

    function _setDataByType() {
      if ($scope.personExFax.documentType) {
        $scope.validateSection = ($scope.TipoFinancimiento === 'FINANCIADO' || $scope.TipoFinancimiento === 'DIRECTO') && $scope.personExFax.documentType.Codigo !== "RUC" ? true : false;
      }
      if ($scope.prospecto){
      $scope.prospecto.numDocumento && !$scope.personData.documentNumber ? $scope.personData.documentNumber = $scope.prospecto.numDocumento : null
      $scope.prospecto.idDocumento && !$scope.personData.documentType ? $scope.personData.documentType = { Codigo: $scope.prospecto.idDocumento } : null
      }
      if ($scope.personExFax && $scope.personExFax.documentType && $scope.personExFax.documentType.Codigo == "DNI") {
        campoSantoService.informacionEquifaxCamposanto($scope.personExFax.documentNumber).then(function (response) {
          $scope.exFaxCamposanto = response.Data;
          if ($scope.exFaxCamposanto.estadocivil) {
            var estadocivil = { "SOLTERO": 1, "CASADO": 2, "VIUDO": 3 };
            $scope.modelo.estadocivil = estadocivil[$scope.exFaxCamposanto.estadocivil.toUpperCase()];
            if ($scope.personData) {
              if ($scope.personData.civilState && !$scope.personData.civilState.selectedEmpty) {
                $scope.modelo.estadocivil = $scope.personData.civilState.Codigo
              }
              else {
                $scope.modelo.estadocivil = $scope.modelo.estadocivil;
                $scope.personData.civilState = { Codigo: $scope.modelo.estadocivil };
              }
            }
          }

          var calificacion = { "NORMAL": "0", "CPP": "1", "DEFICIENTE": "2", "DUDOSO": "3", "PERDIDA": "4" };
          $scope.modelo.idCalificacion = calificacion[$scope.exFaxCamposanto.calificacion] || null;

          var score = { "BAJO": "0", "MEDIO BAJO": "1", "MODERADO": "2", "MEDIO ALTO": "3", "ALTO": "4" };
          $scope.modelo.score = score[$scope.exFaxCamposanto.score] || null;
          $scope.modelo.deuda_total >= 10000 ? $scope.modelo.idDeuda = "0" : $scope.modelo.idDeuda = "1";
          $scope.modelo.disponible_tc = parseFloat($scope.exFaxCamposanto.disponible_tc);
          $scope.modelo.disponible_tc >= 10000 ? $scope.modelo.idLineaCredito = "0" : $scope.modelo.idLineaCredito = "1";

        });
      }
    }

    $scope.getDataContratante = function (data) {
      if ($scope.personData) {
        $scope.personData.ignoreEquifax = data.ignoreEquifax !== '' ? $scope.personData && $scope.personData.ignoreEquifax : false;
      }
      $scope.personExFax = data;
      _setDataByType();
    }

    $scope.saveAgent = function (mAgente) {
      $scope.mAgente.codigoAgente = mAgente.codigoAgente;
      $scope.mAgente.codigoNombre = getFormatNombreAgente(mAgente.codigoNombre);
    }

    $scope.goSimulador = function (tipoPago) {
      $scope.$broadcast('submitForm', true);
      $scope.frmCamposanto.markAsPristine();
      if ($scope.frmCamposanto.$valid) {
        if (tipoPago === 'DIRECTO'){
          $scope.guardadoParcial(false, true);
        }else{
          $scope.guardadoParcial(true, true);
      }
      }

    }
    function _modeloCotizacion() {
      return {
        "idCotizacion": $scope.prospecto ? $scope.prospecto.idCotizacion : 0,
        "idDocumento": $scope.personData.documentType.Codigo,
        "numDocumento": $scope.personData.documentNumber || null,
        "nombre": $scope.personData.Nombre || null,
        "paterno": $scope.personData.ApellidoPaterno || null,
        "materno": $scope.personData.ApellidoMaterno || null,
        "fechaNacimiento": campoSantoFactory.formatearFechaNacimiento($scope.modelo.fechaNacimiento),
        "idEstadoCivil": $scope.personData.civilState ? $scope.personData.civilState.Codigo : null,
        "idRamo": $scope.codRamo,
        "idCampoSanto": $scope.modelo.camposanto ? $scope.modelo.camposanto.Codigo : null,
        "idTipoProducto": $scope.modelo.tipoContrato ? $scope.modelo.tipoContrato.Codigo : null,
        "idModalidad": $scope.modelo.modalidad ? $scope.modelo.modalidad.Codigo : null,
        "idProducto": $scope.modelo.producto ? $scope.modelo.producto.Codigo : null,
        "correoElectronico": $scope.personData.CorreoElectronico || null,
        "celular1": $scope.personData.Telefono || null,
        "celular2": $scope.personData.Telefono2 || null,
        "direccion": $scope.personData.Direccion || null,
        "idRangoEdad": $scope.modelo.idrangoedad || null,
        "idDepartamento": $scope.personData.Department ? $scope.personData.Department.Codigo : null,
        "idProvincia": $scope.personData.Province ? $scope.personData.Province.Codigo : null,
        "idDistrito": $scope.personData.District ? $scope.personData.District.Codigo : null,
        "costoTotal": $scope.productoPrecio,
        "costoFinal": $scope.productoPrecioDescuento,
        "cuotaInicial": 0,
        "descuento": $scope.modelo.descuento,
        "idAgente": $scope.mAgente.codigoAgente,
        "nombreAgente": $scope.mAgente.codigoNombre,
        "idCategoria": null,
        "idMotivo": null,
        "textoMotivo": null
      }
    }

    $scope.guardadoParcial = function (isAprobado, irSimulador) {
      $scope.$broadcast('submitForm', true);
      $scope.frmCamposanto.markAsPristine();
      if ($scope.frmCamposanto.$valid) {
        $scope.btngenerarCotizacionDisable = true;
        $scope.frmCamposanto.markAsPristine();
        _getIdRangoEdad();
        _getIDTipoFinanciamiento();
        $scope.btnguardadoParcialDisable = true;
        var guardadoParcial = {
          "numeroCuotas": $scope.modelo.cuotas ? $scope.modelo.cuotas.NumeroCuota : 1,
          "idTipoFinanciamiento": $scope.modelo.idTipoFinanciamiento || null,
          "estudiosSuperiores": $scope.modelo.estudioSuperior,
          "estado": isAprobado ? "APROBADO" : "PROSPECTO",
          "idGradoEducacion": $scope.modelo.gradoInstruccion ? $scope.modelo.gradoInstruccion.Codigo : null,
          "idAuto": $scope.modelo.auto,
          "idPago": $scope.TipoFinancimiento.toUpperCase() || null,
          "idFraccionamiento": $scope.modelo.cuotas ? $scope.modelo.cuotas.Codigo : null,
          "NumeroContratoRelacionado" : $scope.modelo.contratoRelacionado || null
        }
        var dataGuardadoParcial = angular.extend({}, _modeloCotizacion(), guardadoParcial);
        campoSantoService.guardarOperacion(dataGuardadoParcial, 1)
          .then(function (response) {
            if (response.OperationCode === 200) {
              campoSantoFactory.setidCotizacion(response.Data.idCotizacion);
              if (irSimulador) {
                _goToSimulador(1);
              }else{
              mModalAlert.showSuccess("Se guardo correctamente", "Cotizacion Guardada")
                .then(function (r2) {
                  if (r2) $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
                })
              }
            }
            else {
              mModalAlert.showWarning((response.Data || response.Data.Message) ? response.Data.Message : response.Data, "")
              $scope.btnguardadoParcialDisable = false;
            }
          })
          .catch(function () {
            mModalAlert.showWarning("Error al generar la cotizacion", "")
            $scope.btnguardadoParcialDisable = false;
          });
      }
    }

    $scope.generarCotizacion = function () {
      $scope.$broadcast('submitForm', true);
      $scope.frmCamposanto.markAsPristine();
      if ($scope.frmCamposanto.$valid) {
        $scope.btngenerarCotizacionDisable = true;
        _getIdRangoEdad();
        _getIDTipoFinanciamiento();
        var dataCotizacion = {
          "numeroCuotas": 1,
          "idTipoFinanciamiento": "TIPO_1",
          "estudiosSuperiores": null,
          "estado" : "COTIZADO",
          "idGradoEducacion": null,
          "idAuto": null,
          "idPago": $scope.TipoFinancimiento.toUpperCase(),
          "idCategoria": null,
          "idFraccionamiento": 10001,
          "NumeroContratoRelacionado" : $scope.modelo.contratoRelacionado || null
        }
        
        var requestCotizacion = angular.extend({}, _modeloCotizacion(), dataCotizacion);
        mModalConfirm
          .confirmWarning("¿Esta seguro de cotizar el contrato?", "")
          .then(function (r) {
            if (r) {
              campoSantoService.guardarOperacion(requestCotizacion, 1).then(function (response) {
                if (response.OperationCode == 200) {
                

                  mModalAlert.showSuccess("Contrato cotizado correctamente", "NUEVA COTIZACION CREADA")
                  .then(function (r2) {
                    if($scope.TipoFinancimiento === 'DIRECTO' ){

                       campoSantoFactory.setidCotizacion(response.Data.idCotizacion);
                       _goToSimulador(1);
                       return;
                     }  

                    if (r2) {
                      campoSantoFactory.setComponenteView('detalle-cotizacion-contado');
                      campoSantoFactory.setidCotizacion(response.Data.idCotizacion);
                      $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: 2 }, { reload: true, inherit: false });
                    }
                  });         
                }
                else {
                  mModalAlert.showWarning(response.Data.Message || response.Data, "");
                  $scope.btngenerarCotizacionDisable = false;
                }
              })
                .catch(function () {
                  mModalAlert.showWarning("Error al generar la cotizacion", "");
                  $scope.btngenerarCotizacionDisable = false;
                })
            }
            else {
              $scope.btngenerarCotizacionDisable = false;
            }
          })
          .catch(function () {
            $scope.btngenerarCotizacionDisable = false;
          })
      }
    }

    $scope.generarEvaluacion = function () {
      $scope.$broadcast('submitForm', true);
      $scope.frmCamposanto.markAsPristine();
      if ($scope.frmCamposanto.$valid) {
        _getIdRangoEdad();
        _validarLimaMetropolitana();
        _getIDTipoFinanciamiento();
        $scope.btngenerarEvaluacionDisable = false;
        var data = {
          "idScore": $scope.modelo.score,
          "idCalificacion": $scope.modelo.idCalificacion,
          "idLima": $scope.modelo.limaMetropolitana,
          "idNivelEstudios": $scope.modelo.estudioSuperior,
          "idLineaCredito": $scope.modelo.idLineaCredito,
          "idDeuda": $scope.modelo.idDeuda,
          "idEstadoCivil": $scope.personData.civilState ? String($scope.personData.civilState.Codigo) : null,
          "idRango": $scope.modelo.idrangoedad,
          "idZona": $scope.modelo.zona,
          "idAuto": String($scope.modelo.auto),
          "idRamo": parseInt($scope.codRamo),
          "idCampoSanto": parseInt($scope.modelo.camposanto.Codigo),
          "idModalidad": parseInt($scope.modelo.modalidad.Codigo),
          "idTipoProducto": parseInt($scope.modelo.tipoContrato.Codigo),
          "idProducto": $scope.modelo.producto.Codigo,
          "idFraccionamiento": $scope.modelo.cuotas.Codigo,
          "fechaNacimiento" : campoSantoFactory.formatearFechaNacimiento($scope.modelo.fechaNacimiento)
        }
        campoSantoService.generarEvelacuion(data).then(function (response) {
          if (response.Califica === 1) {
            mModalAlert.showSuccess("Cliente califica con éxito", "")
              .then(function () { 
                _goToSimulador(1);
              });
          }
          else if (response.Califica == 2) {
            mModalConfirm
              .confirmWarning("VER ALTERNATIVAS", "Cliente no califica para el producto elegido")
              .then(function (r2) {
                if (r2) {
                  var dataCorreoExepcional = {
                    tipoContrato: $scope.modelo.tipoContrato,
                    productoPrecio: $scope.modelo.producto.Precio,
                    camposanto: $scope.modelo.camposanto.Codigo,
                    idCategoria: response.CategoriaProducto
                  }
                  $scope.modelo.ramo = $scope.codRamo;
                  $scope.modelo.personData = $scope.personData;
                  $scope.modelo.idCotizacion = $scope.prospecto ? $scope.prospecto.idCotizacion : null;
                  $scope.modelo.claims = {
                    codigoAgente :  $scope.mAgente ? $scope.mAgente.codigoAgente : null,
                    nombreAgente :  $scope.mAgente ? getFormatNombreAgente($scope.mAgente.codigoNombre) : null,
                  }
                  setDataTemporal();
                  campoSantoFactory.setdataDetalleSimulacion($scope.modelo);
                  campoSantoFactory.setdataAlternativas(response.Data);
                  campoSantoFactory.setdataCorreoExepcional(dataCorreoExepcional);
                  campoSantoFactory.setComponenteView('cotizacion-alternativas');
                  campoSantoFactory.setDataEvaluarAlternativas(data);
                  $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: 2 }, { reload: true, inherit: false });
                }
                else {
                  $scope.btngenerarCotizacionDisable = false;
                }
              });
          }
          else {
            mModalAlert.showWarning(response.Data.Message || response.Data, "")
              .then(function () {
              });
          }             
        }).catch(function (error) {
          mModalAlert.showWarning(error.Data, error.Message);
        });
      }
    }

    function setDataTemporal(){
      var fianciado = {
        "numeroCuotas": $scope.modelo.cuotas ? $scope.modelo.cuotas.NumeroCuota : null,
        "idTipoFinanciamiento": $scope.modelo.idTipoFinanciamiento || null,
        "estudiosSuperiores": $scope.modelo.estudioSuperior,
        "estado": $scope.disabledAll ? "APROBADO" : "SOLICITADO",
        "idGradoEducacion": $scope.modelo.gradoInstruccion ? $scope.modelo.gradoInstruccion.Codigo : null,
        "idAuto": $scope.modelo.auto,
        "idPago": $scope.TipoFinancimiento.toUpperCase() || null,
        "idFraccionamiento": $scope.modelo.cuotas ? $scope.modelo.cuotas.Codigo : null,
        "cuotaInicial": $scope.prospecto ? $scope.prospecto.cuotaInicial : 0
      }
      var dataFinanciadoExepcional = angular.extend({}, _modeloCotizacion(), fianciado);
      campoSantoFactory.setdataProspecto(dataFinanciadoExepcional);
    }

    $scope.showModalAgrupamiento = function (categoria, productoAgrupamiento, tipologiaFinanciamiento, codRamo) {
      var vModalProof = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        result: true,
        size: 'lg',
        templateUrl: 'app/sepelio/popup/controller/popupAgrupamiento.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function ($scope, $uibModalInstance, $uibModal, $timeout) {
            var vm = this;
            $scope.pagination = {
              currentPage: 1,
              maxSize: 6,
              totalItems: 0,
              items: productoAgrupamiento ? productoAgrupamiento.Lista : null,
              noSearch: true,
              noResult: false
            };

            $scope.params = {
              CodigoRamo: 400,
              camposanto: null,
              codProducto: null,
              producto: null,
              categoria: "TIPO_A"
            }


            vm.$onInit = function () {
              $scope.model = {};
              $scope.categoria = categoria;
              $scope.model.categoria = null;
              $scope.tipologiaFinanciamientoList = tipologiaFinanciamiento;
              $scope.ramo = [
                {
                  Codigo: $scope.cntsSepelios.RAMOS.NI,
                  Text:  $scope.cntsSepelios.RAMOS.NI_TEXT,
                },
                {
                  Codigo: $scope.cntsSepelios.RAMOS.NF,
                  Text:  $scope.cntsSepelios.RAMOS.NF_TEXT,
                }];
              $scope.model.ramo = null;
            }

            $scope.pageChanged = function (currentPage) {
              $scope.pagination.currentPage = currentPage;
              _productoAgrupamiento($scope.params.CodigoRamo, $scope.params.camposanto, $scope.params.codProducto, $scope.params.producto, $scope.params.categoria);
            }

            function _productoAgrupamiento(CodigoRamo, camposanto, codProducto, producto, categoria) {
              campoSantoService.productoAgrupamiento(CodigoRamo, camposanto, codProducto, producto, categoria,
                $scope.pagination.maxSize, $scope.pagination.currentPage)
                .then(function (response) {
                  $scope.tipoProductoList = response.Data.Lista;
                  $scope.pagination.noSearch = false;
                  $scope.pagination.totalItems = response.Data.Lista.length > 0 ? response.Data.CantidadTotalPaginas * 10 : 0;
                  $scope.pagination.items = response.Data.Lista;
                  $scope.pagination.noResult = response.Data.Lista.length === 0;
                });
            }
            $scope.Buscar = function () {
              if (_validateForm()){
                _setearData();
                $scope.pagination.currentPage = 1;
                _productoAgrupamiento($scope.params.CodigoRamo, $scope.params.camposanto, $scope.params.codProducto, $scope.params.producto, $scope.params.categoria);
              }
            }

            function _setearData() {
              $scope.params = {
                CodigoRamo: $scope.model.ramo.Codigo,
                camposanto: $scope.model.camposanto,
                codProducto: $scope.model.codProducto,
                producto: $scope.model.producto,
                categoria: $scope.model.categoria.Codigo
              }
            }
            $scope.Limpiar = function () {
              $scope.model = {};
              $scope.pagination.noSearch = true;
              $scope.tipoProductoList = [];
              $scope.pagination.noResult = false;
              $scope.pagination.totalItems = 0;
              $scope.pagination.currentPage = 1;
            }

            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.validControlForm = function (controlName) {
              return $scope.frm && campoSantoFactory.validControlForm($scope.frm, controlName);
            }
            function _validateForm() {
              $scope.frm.markAsPristine();
              return $scope.frm.$valid;
            }

            vModalProof.result.then(function (response) {
            });
          }]
      });
    }
  }
});
