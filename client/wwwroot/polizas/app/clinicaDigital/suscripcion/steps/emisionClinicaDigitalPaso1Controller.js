'use strict';

define(['angular', 'constants', 'lodash', 'mpfPersonConstants', 'saludFactory', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js', 'saludSuscripcionFactory', 'constantsSalud', 'mpfPersonComponent'], function(ng, constants, _, personConstants) {

  emisionClinicDigitalPaso1Controller.$inject = [
    '$scope'
    , '$stateParams'
    , 'saludLists'
    , 'saludFactory'
    , 'saludSuscripcionFactory'
    , '$state'
    , 'mModalAlert'
    , 'mainServices'
    , '$filter'
    , 'oimPrincipal'];

  function emisionClinicDigitalPaso1Controller(
    $scope
    , $stateParams
    , saludLists
    , saludFactory
    , saludSuscripcionFactory
    , $state
    , mModalAlert
    , mainServices
    , $filter
    , oimPrincipal) {
      var vm = this;
      $scope.blockAll = false
      $scope.blockCP = false
      vm.$onInit = function () {
        $scope.valcheck = {
          val: false
        }
        $scope.oneAtATime = false;
        $scope.status = {
          open1: false,
          open2: false,
          open3: false
        };

        $scope.sexCode = constantsSalud.sexCodes;
        $scope.firstStep = {};
        $scope.ubigeos = $scope.ubigeos || {};
        $scope.formData = {
          dependientes: [],
        };
        $scope.popup1DatePicker = { opened: false };
        $scope.popup2DatePicker = { opened: false };
        $scope.popup3DatePicker = { opened: false };
        $scope.popup4DatePicker = { opened: false };
        $scope.popup5DatePicker = { opened: false };
        $scope.optOtroSeguro = '';
        $scope.optDisabled = false;
        $scope.ubigeoContratanteValid = $scope.ubigeoContratanteValid ? $scope.ubigeoContratanteValid : {};
        $scope.ubigeoTitularValid = $scope.ubigeoTitularValid ? $scope.ubigeoTitularValid : {};
        $scope.format = constants.formats.dateFormat;
        $scope.maxLengthPolicyNumber = 13;
        

        if (saludLists){
          $scope.tiposDeDocumentos = saludLists[0].Data;
          $scope.sexo = saludLists[1].Data;
          $scope.estadosCiviles = saludLists[2].Data;
          $scope.paises = saludLists[3].Data;
        }

        _getSuscripcionInfo($stateParams.quotationNumber, true);

        $scope.appCode = 'CLINICA_DIGITAL'//personConstants.aplications.SALUD;
        $scope.formCodeCN = 'EMI-CLI-CN'//ersonConstapnts.forms.EMI_VIDA_CN //'EMI-SAL-CN' //personConstants.forms.EMI_SAL_CN;
        $scope.formCodeTI = 'EMI-CLI-ASE-TI'//personConstants.forms.EMI_VIDA_ASE; //'EMI-SAL-ASE-TIT' //personConstants.forms.EMI_SAL_ASE_TIT;
        $scope.contratanteValid = false;
        $scope.titularValid = false;
        $scope.firstStep.ContratantePerson = {};
        $scope.firstStep.TitularPerson = {};

        $scope.$on('personForm', function(event, data) {
          if(data.datosContratante){
            $scope.contratanteValid = data.valid;
            setFormData('Contratante', data.datosContratante);
          }
          if(data.datosTitular){
            $scope.titularValid = data.valid;
            setFormData('Titular', data.datosTitular);
          }
        });

      };

      $scope.getData = function (data) {
        if (data.toRequest) {
          $scope.firstStep.ContratantePerson.TipoDocumento = data.data.documentType.Codigo;
          $scope.firstStep.ContratantePerson.NumeroDocumento = data.data.documentNumber;
          $scope.firstStep.ContratantePerson.Nombre = data.data.Nombre;
          $scope.firstStep.ContratantePerson.ApellidoPaterno = data.data.ApellidoPaterno;
          $scope.firstStep.ContratantePerson.ApellidoMaterno = data.data.ApellidoMaterno;
          $scope.firstStep.ContratantePerson.FechaNacimiento = _cambiarFormatoDatetime(new Date(data.data.year.Codigo, data.data.month.Codigo - 1, data.data.day.Codigo));
          $scope.firstStep.ContratantePerson.civilState = data.data.civilState;
          $scope.firstStep.ContratantePerson.nationality = data.data.nationality;
          $scope.firstStep.ContratantePerson.Sexo = data.data.Sexo;
          $scope.firstStep.ContratantePerson.Profesion = data.data.Profesion;
          $scope.firstStep.ContratantePerson.Ocupacion = data.data.Ocupacion;
          $scope.firstStep.ContratantePerson.Telefono = data.data.Telefono;
          $scope.firstStep.ContratantePerson.Telefono2 = data.data.Telefono2;          
          $scope.firstStep.ContratantePerson.CorreoElectronico = data.data.CorreoElectronico;
          $scope.firstStep.ContratantePerson.TelefonoOficina = data.data.TelefonoOficina;
          $scope.firstStep.ContratantePerson.Via = data.data.Via;
          $scope.firstStep.ContratantePerson.Zone = data.data.Zone;
          $scope.firstStep.ContratantePerson.TextoZona = data.data.TextoZona;
          $scope.firstStep.ContratantePerson.NombreVia = data.data.NombreVia;
          $scope.firstStep.ContratantePerson.NumberType = data.data.NumberType;
          $scope.firstStep.ContratantePerson.TextoNumero = data.data.TextoNumero;
          $scope.firstStep.ContratantePerson.Inside = data.data.Inside;
          $scope.firstStep.ContratantePerson.TextoInterior = data.data.TextoInterior;
          $scope.firstStep.ContratantePerson.Referencia = data.data.Referencia;
          $scope.firstStep.ContratantePerson.Ubigeo = {
            Departamento: data.data.Department,
            Provincia: data.data.Province,
            Distrito: data.data.District,
            CodigoZona: data.data.Zone.Codigo,
            ZonaDescripcion: data.data.Zone.Descripcion,
            TextoZona: data.data.TextoZona,
            CodigoVia: data.data.Via.Codigo,
            NombreVia: data.data.NombreVia,
            CodigoNumero: data.data.NumberType.Codigo,
            NumeroDescripcion: data.data.NumberType.Descripcion,
            TextoNumero: data.data.TextoNumero,
            CodigoInterior: data.data.Inside.Codigo,
            InteriorDescripcion: data.data.Inside.Descripcion,
            TextoInterior: data.data.TextoInterior,
            Referencia: data.data.Referencia
          };
          $scope.firstStep.ContratantePerson.Direccion = data.data.Direccion;
        }
        if (data.documentType && data.documentNumber) {
          $scope.firstStep.Contratante.TipoDocumento = data.documentType;
          $scope.firstStep.Contratante.NumeroDocumento = data.documentNumber;
        }
        if (data.isClear) {
          $scope.firstStep.Contratante.TipoDocumento = null;
          $scope.firstStep.Contratante.NumeroDocumento = null;
        }
      };

      function setFormData(name, data) {
        $scope.firstStep[name].TipoDocumento = data.documentType;
        $scope.firstStep[name].NumeroDocumento = data.documentNumber;
        $scope.firstStep[name].Nombre = data.Nombre;
        $scope.firstStep[name].ApellidoPaterno = data.ApellidoPaterno;
        $scope.firstStep[name].ApellidoMaterno = data.ApellidoMaterno;
        $scope.firstStep[name].Sexo = {
          Codigo: data.Sexo,
          Descripcion: data.Sexo
        };
        $scope.firstStep[name].FechaNacimiento = data.FechaNacimiento
        $scope.firstStep[name].Correo = data.CorreoElectronico;
        $scope.firstStep[name].EstadoCivil = {
          CodigoEstadoCivil: data.civilState ? data.civilState.Codigo : 0,
          CodigoEstadoCivilTron: data.civilState ? data.civilState.CodigoEstadoCivilTron : "",
          NombreEstadoCivil: data.civilState ? data.civilState.Descripcion : ""
        };
        $scope.firstStep[name].NombreEmpresa = data.NombreEmpresa;
        if(data.Ocupacion){
          $scope.firstStep[name].Ocupacion = data.Ocupacion;
        }
        $scope.firstStep[name].Pais = data.nationality;
        if(data.weight){
          $scope.firstStep[name].Peso = String(data.weight);
        }
        $scope.firstStep[name].Profesion = data.Profesion;
        if(data.size){
          $scope.firstStep[name].Talla = String(data.size);
        }
        $scope.firstStep[name].TelefonoCasa = data.Telefono;
        $scope.firstStep[name].TelefonoMovil = data.Telefono2;
        $scope.firstStep[name].Ubigeo = {
          CodigoPaisNatal: data.nationality ? data.nationality.Codigo : "",
          Direccion: data.Direccion,
          Departamento: data.Department,
          Provincia: data.Province,
          Distrito: data.District
        }

        $scope.firstStep[name].TelefonoOficina = data.TelefonoOficina;
        $scope.firstStep[name].Via = data.Via;
        $scope.firstStep[name].Zone = data.Zone;
        $scope.firstStep[name].TextoZona = data.TextoZona;
        $scope.firstStep[name].NombreVia = data.NombreVia;
        $scope.firstStep[name].NumberType = data.NumberType;
        $scope.firstStep[name].TextoNumero = data.TextoNumero;
        $scope.firstStep[name].Inside = data.Inside;
        $scope.firstStep[name].TextoInterior = data.TextoInterior;
        $scope.firstStep[name].Referencia = data.Referencia;
        $scope.firstStep[name].nationality = data.nationality;
        $scope.firstStep[name].residenceCountry = data.residenceCountry;
      }

      $scope.guardar = function () {
        /* $state.go('.', {
          step: 2
        }); */
        $scope.$broadcast('submitForm', true);
        if (_validarFormulario()) {
          _guardarData();
        } else {
          mModalAlert.showError('Tiene errores en el rellenado del formulario', 'Error');
          $scope.status.open1 = true;
          $scope.status.open2 = true;
          if($scope.firstStep.Asegurados.length > 0)
            $scope.status.open3 = true;
        }
      }

      $scope.cambiarFecNacContratante = function () {
        if ($scope.valcheck.val) {
          $scope.cambiarFecNacTitular();
        }
      }

      $scope.cambiarFecNacTitular = function () {
        $scope.firstStep.Titular.Edad = _difAnos(new Date(), $scope.firstStep.Titular.FechaNacimiento);
      }

      $scope.cambiarFecNacAsegurado = function (index) {
        $scope.firstStep.Asegurados[index].Edad = _difAnos(new Date(), $scope.firstStep.Asegurados[index].FechaNacimiento);
      }

      $scope.openTimePicker1 = function () {
        $scope.popup1DatePicker.opened = true;
      };

      $scope.openTimePicker2 = function () {
        $scope.popup2DatePicker.opened = true;
      };

      $scope.openTimePicker3 = function () {
        $scope.popup3DatePicker.opened = true;
      };

      $scope.openTimePicker4 = function () {
        $scope.popup4DatePicker.opened = true;
      };

      $scope.openTimePicker5 = function () {
        $scope.popup5DatePicker.opened = true;
      };

      $scope.$on('changingStep', function(ib, e){
        if (e.step > 1){
          if (!_validarFormulario()){
            e.cancel = true;
            mModalAlert.showError('Tiene errores en el rellenado del formulario', 'Error');
          }
        } else {
          if (e.step > $scope.firstStep.paso) {
            e.cancel = true;
          }
        }
      });

      $scope.buscarContratante = function () {
        _limpiarDatosContratante();
        _buscarPersona($scope.firstStep.Contratante.TipoDocumento.Codigo, $scope.firstStep.Contratante.NumeroDocumento, function (data) {
          $scope.firstStep.Contratante.Nombre = data.Nombre;
          $scope.firstStep.Contratante.ApellidoMaterno = data.ApellidoMaterno;
          $scope.firstStep.Contratante.ApellidoPaterno = data.ApellidoPaterno;
          $scope.firstStep.Contratante.Sexo =
            data.Sexo == $scope.sexCode.male
              ? { Codigo: $scope.sexCode.male, Descripcion: 'Masculino' }
              : { Codigo: $scope.sexCode.female, Descripcion: 'Femenino' };

          $scope.firstStep.Contratante.buscado = true;
          var split = data.FechaNacimiento.split('/');
          if (split.length === 3)
            $scope.firstStep.Contratante.FechaNacimiento = new Date(split[2], split[1] - 1, split[0]);
        });
      }

      $scope.onChangeDocumento = function (codigoDocumento, limpiar) {
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, codigoDocumento, 1);
        $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;

        if (limpiar) {
            $scope.limpiarContratante();
        }
      };

      $scope.limpiarContratante = function () {
        $scope.firstStep.Contratante.NumeroDocumento = '';
        _limpiarDatosContratante();
      }

      $scope.copiarDatosContratante = function () {
        if ($scope.valcheck.val) {
          _copiarDatos();
        }
      }

      var listenValcheck = $scope.$watch('valcheck', function (newVal, oldVal) {
        if (newVal.val) {
          $scope.$broadcast('eventCapture', true);
          $scope.noButton = true;
          $scope.copiarDatosContratante();
        }
        else {
          $scope.noButton = false;
        }
      }, true);

      function _clonarDatos() {
        $scope.firstStep.TitularPerson = angular.copy($scope.firstStep.ContratantePerson);
      }

      function _copiarDatos() {
        if ($scope.firstStep.ContratantePerson.civilState && !$scope.firstStep.ContratantePerson.civilState.Codigo) {
          $scope.firstStep.ContratantePerson.civilState = null;
        }
        _clonarDatos();
      }

      function _combinarObjs(obj1, obj2) {
        var obj3 = {};
        for (var i in obj2) {
          obj3[i] = obj2[i];
        }

        for (var i in obj1) {
          if (angular.isUndefined(obj2[i])) obj3[i] = obj1[i];
        }

        return obj3;
      }

      function _buscarPersona(tipoDocumento, numeroDocumento, fnCallback) {
        saludFactory.getDataInsured(tipoDocumento, numeroDocumento, true).then(
          function(data) {
            if (data.OperationCode === 200) {
              if (typeof fnCallback === 'function') {
                fnCallback(data.Data);
              }
            }
        });
      }

      var _limpiarDatosContratante = function () {
        $scope.firstStep.Contratante.ApellidoMaterno = '';
        $scope.firstStep.Contratante.ApellidoPaterno = '';
        $scope.firstStep.Contratante.Nombre = '';
        $scope.firstStep.Contratante.Sexo = null;
        $scope.firstStep.Contratante.FechaNacimiento = null;
        $scope.firstStep.Contratante.buscado = false;
        if (!angular.isUndefined($scope.firstStep.Contratante.Ubigeo)) {
          $scope.firstStep.Contratante.Ubigeo.Direccion = '';
        }
        $scope.firstStep.Contratante.Pais = null;
        $scope.firstStep.Contratante.EstadoCivil = null;
        $scope.firstStep.Contratante.NombreEmpresa = '';
        $scope.firstStep.Contratante.Profesion = null;
        $scope.firstStep.Contratante.Ocupacion = null;
        $scope.firstStep.Contratante.Correo = '';
        $scope.firstStep.Contratante.TelefonoMovil = '';
        $scope.firstStep.Contratante.TelefonoCasa = '';
        $scope.ubigeos.UbigeoContratante.mDepartamento = null;
        $scope.ubigeos.UbigeoContratante.mDistrito = null;
        $scope.ubigeos.UbigeoContratante.mProvincia = null;
      }

      function _getSuscripcionInfo(quotationNumber, showSpin) {

        saludSuscripcionFactory.getPaso1ClinicaDigital(quotationNumber, showSpin, false).then(function (res) {
          $scope.firstStep = angular.copy(res);
          _formatearData();
        }, function(err) {
          console.log(err);
        })
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
        $scope.firstStep[name].nationality = {
          Codigo: data.Pais ? data.Pais.Codigo : ""
        };
        $scope.firstStep[name].size = data.Talla;
        $scope.firstStep[name].weight = data.Peso;
        $scope.firstStep[name].Telefono = data.TelefonoCasa;
        $scope.firstStep[name].Telefono2 = data.TelefonoMovil;
        $scope.firstStep[name].CorreoElectronico = data.Correo;
        $scope.firstStep[name].residenceCountry = data.residenceCountry ;
        $scope.firstStep[name].Ubigeo = {
          Departamento: data.Ubigeo ? data.Ubigeo.Departamento : null,
          Provincia: data.Ubigeo ? data.Ubigeo.Provincia : null,
          Distrito: data.Ubigeo ? data.Ubigeo.Distrito : null
        };
        $scope.firstStep[name].Direccion = data.Ubigeo ? data.Ubigeo.Direccion : "";
        if(data.EstadoCivil){
          $scope.firstStep[name].civilState = {
            Codigo: data.EstadoCivil.CodigoEstadoCivil
          };
        }
        $scope.firstStep[name].Profesion = data.Profesion;
        $scope.firstStep[name].Ocupacion = data.Ocupacion;
        //$scope.firstStep[name].ignoreEquifax = true;
      }

      function _formatearData() {
        $scope.firstStep.ContratantePerson = {};
        $scope.firstStep.TitularPerson = {};
        var keyTitular = '';
        $scope.firstStep.Asegurados.forEach(function (asegurado, key) {
          asegurado.Talla = angular.isUndefined(asegurado.Talla) ? '' : String(asegurado.Talla);
          asegurado.FechaNacimiento2 = asegurado.FechaNacimiento;
          asegurado.FechaNacimiento = _cambiarFormatoFechaDate(asegurado.FechaNacimiento);          
          asegurado.Edad = _difAnos(new Date(), asegurado.FechaNacimiento);
          if (angular.isObject(asegurado.Profesion) && asegurado.Profesion)
            asegurado.Profesion = { codigo: asegurado.Profesion.Codigo, descripcion: asegurado.Profesion.Descripcion }
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
        $scope.firstStep.Titular = $scope.firstStep.Asegurados[keyTitular];

        if (angular.isObject($scope.firstStep.Contratante)) {
          $scope.firstStep.Contratante.Pais = {
            Codigo: $scope.firstStep.Contratante.Ubigeo.CodigoPaisNatal
          }
          $scope.firstStep.Contratante.Ocupacion = {
            codigo: $scope.firstStep.Contratante.Ocupacion.Codigo,
            descripcion: $scope.firstStep.Contratante.Ocupacion.Descripcion
          }
          $scope.firstStep.Contratante.Profesion = {
            codigo: $scope.firstStep.Contratante.Profesion.Codigo,
            descripcion: $scope.firstStep.Contratante.Profesion.Descripcion
          }
          $scope.firstStep.Contratante.FechaNacimiento = _cambiarFormatoFechaDate($scope.firstStep.Contratante.FechaNacimiento);
          $scope.firstStep.Contratante.EstadoCivil = {
            CodigoEstadoCivil: $scope.firstStep.Contratante.EstadoCivil.Codigo
          }
          $scope.onChangeDocumento($scope.firstStep.Contratante.TipoDocumento.Codigo, false);
        } else {
          $scope.firstStep.Contratante = {
            TipoDocumento: $scope.firstStep.Titular.TipoDocumento,
            NumeroDocumento: $scope.firstStep.Titular.NumeroDocumento,
            ApellidoMaterno: $scope.firstStep.Titular.ApellidoMaterno,
            ApellidoPaterno: $scope.firstStep.Titular.ApellidoPaterno,
            Nombre: $scope.firstStep.Titular.Nombre,
            Sexo: $scope.firstStep.Titular.Sexo,
            FechaNacimiento: $scope.firstStep.Titular.FechaNacimiento,
            Pais: {
              Codigo: 'PE'
            }
          }
        }

        _createObjectComponent("ContratantePerson", $scope.firstStep.Contratante);
        _createObjectComponent("TitularPerson", $scope.firstStep.Titular);

        //$scope.valcheck.val = ($scope.firstStep.Titular.NumeroDocumento == $scope.firstStep.Contratante.NumeroDocumento);
      }

      $scope.$on('$destroy', function $destroy(){
        listenValcheck();
      });

      function _reducirListaMotivo(motivos) {
        var codigoPolizaNueva = '1';
        return motivos.filter(function(motivo){ return motivo.Codigo === codigoPolizaNueva });
      }

     $scope.$on('$locationChangeSuccess',function(evt, newUrl, oldUrl) {
      if (oldUrl.split('/').pop() !== 1) {
        /* $state.go('suscripcionSalud.steps', {quotationNumber: $stateParams.quotationNumber, step: 1}); */
      }
     });

      function _difAnos(dt2, dt1) {
        var diferencia =(dt2.getTime() - dt1.getTime()) / 1000;
        diferencia /= (60 * 60 * 24);
        return Math.floor(diferencia/365.25);
      }

      function _validarFormulario() {
        if( $scope.firstStep.EstadoSolicitud != ''){
          return true
        }else{
          $scope.formData.markAsPristine();
          var formValid = $scope.formData.$valid && $scope.contratanteValid && $scope.titularValid;
          return formValid;
        }
        
      }

      function _cambiarFormatoFechaDate(fecha) {
        if (fecha) {
          var fechas = fecha.split('/');
          return new Date(fechas[1] + '/' + fechas[0] + '/' + fechas[2]);
        }
      }

      function _cambiarFormatoDatetime(fecha) {
        var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
        return fechaModificada;
      }

      function _guardarData() {
        if ($scope.valcheck.val) {
          $scope.firstStep.Titular = angular.copy($scope.firstStep.Titular);
        }
        var suscripcion = angular.copy($scope.firstStep);
        suscripcion["emisionClinicaDigital"] = {
          NumeroDocumento: $stateParams.quotationNumber,
          CodigoRamo: $scope.firstStep.Producto.CodigoRamo,
          EmisionOrquestador: foramatEmisionOrquestador(),
        };

        suscripcion.Contratante.FechaNacimiento = suscripcion.Contratante.FechaNacimiento ;
        suscripcion.Contratante.Ubigeo.CodigoPaisNatal = $scope.firstStep.Contratante.Pais.Codigo;
        suscripcion.Contratante.Ubigeo.Departamento = $scope.firstStep.Contratante.Ubigeo.Departamento;
        suscripcion.Contratante.Ubigeo.Provincia = $scope.firstStep.Contratante.Ubigeo.Provincia;
        suscripcion.Contratante.Ubigeo.Distrito = $scope.firstStep.Contratante.Ubigeo.Distrito;

        suscripcion.Contratante.EstadoCivil = {
          Codigo: $scope.firstStep.Contratante.EstadoCivil.CodigoEstadoCivil,
          Descripcion: $scope.firstStep.Contratante.EstadoCivil.NombreEstadoCivil
        }
        suscripcion.Contratante.Ocupacion = {
          Codigo: $scope.firstStep.Contratante.Ocupacion.codigo,
          Descripcion: $scope.firstStep.Contratante.Ocupacion.descripcion
        }
        suscripcion.Contratante.Profesion = {
          Codigo: $scope.firstStep.Contratante.Profesion.codigo,
          Descripcion: $scope.firstStep.Contratante.Profesion.descripcion
        }
        suscripcion.Contratante.Sexo = {
          Codigo: $scope.firstStep.Contratante.Sexo.Codigo,
          Descripcion: $scope.firstStep.Contratante.Sexo.Descripcion
        }       

        suscripcion.NumeroDocumento = $stateParams.quotationNumber;
        suscripcion.Paso = 1;

        saludSuscripcionFactory.setPaso1ClinicaDigital(suscripcion)
            $state.go('.', {
              step: 2
            });
      }

      function foramatEmisionOrquestador(){
        console.log($scope.firstStep.Contratante)
        $scope.firstStep.riesgoSalud = [];
        $scope.firstStep.Asegurados.forEach(function (asegurado) {
          $scope.firstStep.riesgoSalud.push({
            codParentesco: asegurado.TipoAsegurado.Codigo,
            tipDocum: asegurado.TipoDocumento.Codigo,
            codDocum: asegurado.NumeroDocumento,
            fecNacimiento: asegurado.FechaNacimiento2,
            numRiesgo: asegurado.Orden,
            numCertificado: "1554",
            descCertificado: "Certificado ABC"
          });
        });

        return {
          cabecera: {
            codigoAplicacion: "OIM"
          },

          poliza: {
            fecEfecSpto: $scope.firstStep.FechaInicio,
            fecVctoSpto: $scope.firstStep.FechaFin,
            codAgt: oimPrincipal.getAgent().codigoAgente,
            moneda: {
              codMon: $scope.firstStep.CodigoMoneda
            },
            fraccionamiento: {
              codFraccPago: $scope.firstStep.CodigoFinanciamiento
            }
          },

          producto: {
            codCia: $scope.firstStep.Producto.CodigoCompania,
            codRamo: $scope.firstStep.Producto.CodigoRamo,
            numPolizaGrupo: $scope.firstStep.Producto.NumPolizaGrupo,
            codModalidad: $scope.firstStep.Producto.CodigoModalidad,
            codProducto: $scope.firstStep.Producto.CodigoProducto,
            codSubProducto: $scope.firstStep.Producto.CodigoSubProducto,
            codPlan: $scope.firstStep.Producto.CodigoPlan,
          },

          contratante: {
            nacionalidad: $scope.firstStep.Contratante.nationality.Codigo,
            mcaFisico: $scope.firstStep.MarcaPorDctoIntegralidad,
            tipDocum: $scope.firstStep.Contratante.TipoDocumento.Codigo,
            codDocum: $scope.firstStep.Contratante.NumeroDocumento,
            nombre: $scope.firstStep.Contratante.Nombre,
            apePaterno: $scope.firstStep.Contratante.ApellidoPaterno,
            apeMaterno: $scope.firstStep.Contratante.ApellidoMaterno,
            fecNacimiento: $scope.firstStep.Contratante.FechaNacimiento,
            mcaSexo: $scope.firstStep.Contratante.Sexo.Codigo,
            estadoCivil: $scope.firstStep.Contratante.EstadoCivil.CodigoEstadoCivil,
            codProfesion: $scope.firstStep.Contratante.Profesion.Codigo,
            tipActEconomica: $scope.firstStep.Contratante.Ocupacion.Codigo,
            email: $scope.firstStep.Contratante.Correo,
            tlfNumero: $scope.firstStep.Contratante.TelefonoCasa,
            tlfMovil: $scope.firstStep.Contratante.TelefonoMovil,
            tipCargo: $scope.firstStep.Contratante.Ocupacion.Codigo,
            nomContacto: $scope.firstStep.Contratante.Ocupacion.Codigo,
            direccion: [
                    {
                            codPais: $scope.firstStep.Contratante.residenceCountry.Codigo,
                            codDepartamento: $scope.firstStep.Contratante.Ubigeo.Departamento.Codigo,
                            codProvincia: $scope.firstStep.Contratante.Ubigeo.Provincia.Codigo,
                            codDistrito: $scope.firstStep.Contratante.Ubigeo.Distrito.Codigo,
                            tipDomicilio: $scope.firstStep.Contratante.Via.Codigo,
                            nomDomicilio: $scope.firstStep.Contratante.NombreVia,
                            tipNumero: $scope.firstStep.Contratante.NumberType.Codigo,
                            descNumero: $scope.firstStep.Contratante.TextoNumero,
                            tipInterior: $scope.firstStep.Contratante.Inside.Codigo,
                            nroInterior: $scope.firstStep.Contratante.TextoInterior,
                            tipZona: $scope.firstStep.Contratante.Zone.Codigo,
                            nomZona: $scope.firstStep.Contratante.TextoZona,
                            refDireccion: $scope.firstStep.Contratante.Referencia
                    }
            ]
          },
          riesgoSalud: $scope.firstStep.riesgoSalud
        }
      }
  }

  return ng.module('appClinicaDigital')
    .controller('emisionClinicDigitalPaso1Controller', emisionClinicDigitalPaso1Controller)
    .factory('loaderSuscripcionP1ControllerCD', ['saludFactory', '$q', 'mainServices',
      function (saludFactory, $q, mainServices) {
        var lists;

        function _getLists(showSpin){
          var deferred = $q.defer();

          mainServices.fnReturnSeveralPromise([
            saludFactory.getDocumentType(false),
            saludFactory.getSexo(false),
            saludFactory.getListEstadoCivil(false),
            saludFactory.getNacionalidad(false),
            saludFactory.getListMotivoSalud(false)
          ], showSpin).then(function (response) {
            lists = response;
            deferred.resolve(lists);
          }, function (error) {
            deferred.reject(error.statusText);
          });

          return deferred.promise;
        }

        return {
          getLists: function (showSpin, step) {
            if (step == 1) {
              if (lists) return $q.resolve(lists);
              return _getLists(showSpin);
            }
          }
        };

      }]);
});
