'use strict';

define(['angular', 'constants', 'lodash', 'mpfPersonConstants', 'saludFactory', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js', 'saludSuscripcionFactory', 'constantsSalud', 'mpfPersonComponent'], function(ng, constants, _, personConstants) {

  QuoteS1Controller.$inject = [
    '$scope','$http'
    , '$stateParams'
    , 'saludLists'
    , 'saludFactory'
    , 'saludSuscripcionFactory'
    , '$state'
    , 'mModalAlert'
    , 'mainServices'
    , '$filter'];

  function QuoteS1Controller(
    $scope,$http
    , $stateParams
    , saludLists
    , saludFactory
    , saludSuscripcionFactory
    , $state
    , mModalAlert
    , mainServices
    , $filter) {
      var vm = this;
      $scope.motivoSolicitud = [];
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
          $scope.motivosSalud = _reducirListaMotivo(saludLists[4].Data);
          $scope.companias = saludLists[5].Data;
        }

        _getSuscripcionInfo($stateParams.quotationNumber, true);

        $scope.appCode = personConstants.aplications.SALUD;
        $scope.formCodeCN = personConstants.forms.EMI_SAL_CN;
        $scope.formCodeTI = personConstants.forms.EMI_SAL_ASE_TIT;
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
          $scope.firstStep.ContratantePerson.Ubigeo = {
            Departamento: data.data.Department,
            Provincia: data.data.Province,
            Distrito: data.data.District
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
      $scope.onCompaniasChange = function() {
        if ($scope.firstStep.Continuidad.TipoCompania) {
          saludFactory.GetTipoCompaniaSeguroSalud($scope.firstStep.Continuidad.TipoCompania.Codigo, true).then(
            function (response) {
              $scope.firstStep.companiasSeguro = angular.copy(response.Data);
            }
          );
        }
      };
      $scope.onCompaniaSeguroChange = function() {
        if ($scope.firstStep.Continuidad.TipoCompaniaSeguro) {
          $scope.firstStep.Continuidad.NombreCompania = $scope.firstStep.Continuidad.TipoCompaniaSeguro.Descripcion;
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
        $scope.firstStep[name].FechaNacimiento = new Date(data.year.Codigo, data.month.Codigo - 1, data.day.Codigo);
        $scope.firstStep[name].Correo = data.CorreoElectronico;
        $scope.firstStep[name].EstadoCivil = {
          CodigoEstadoCivil: data.civilState ? data.civilState.Codigo : 0,
          CodigoEstadoCivilTron: data.civilState ? data.civilState.CodigoEstadoCivilTron : "",
          NombreEstadoCivil: data.civilState ? data.civilState.Descripcion : ""
        };
        $scope.firstStep[name].NombreEmpresa = data.NombreEmpresa;
        if(data.Ocupacion){
          $scope.firstStep[name].Ocupacion = {
            codigo: data.Ocupacion ? data.Ocupacion.codigo : "",
            descripcion: data.Ocupacion ? data.Ocupacion.descripcion : "",
            codigoGrupo: data.Ocupacion ? data.Ocupacion.codigoGrupo : 0,
            indice: data.Ocupacion ? data.Ocupacion.indice : 0,
            nombreGrupo: data.Ocupacion ? data.Ocupacion.nombreGrupo : ""
          };
        }
        $scope.firstStep[name].Pais = data.nationality;
        if(data.weight){
          $scope.firstStep[name].Peso = String(data.weight);
        }
        $scope.firstStep[name].Profesion = {
          codigo: data.Profesion ? data.Profesion.codigo : "",
          descripcion: data.Profesion ? data.Profesion.descripcion : "",
          codigoGrupo: data.Profesion ? data.Profesion.codigoGrupo : 0,
          indice: data.Profesion ? data.Profesion.indice : 0,
          nombreGrupo: data.Profesion ? data.Profesion.nombreGrupo : ""
        };
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
      }

      $scope.changeFechaInicio = function () {
        if ($scope.firstStep.Continuidad.FechaInicio >= $scope.firstStep.Continuidad.FechaFin && $scope.firstStep.Continuidad.FechaFin !== '') {
          $scope.firstStep.Continuidad.FechaInicio = '';
          mModalAlert.showError('El valor seleccionado no puede ser mayor que la fecha final', 'Error');
        }
      }

      $scope.changeFechaFin = function () {
        if ($scope.firstStep.Continuidad.FechaFin <= $scope.firstStep.Continuidad.FechaInicio && $scope.firstStep.Continuidad.FechaInicio !== '') {
          $scope.firstStep.Continuidad.FechaFin = '';
          mModalAlert.showError('El valor seleccionado no puede ser menor que la fecha inicial', 'Error');
        }
      }

      $scope.guardar = function () {
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

      $scope.onChangePolicyType = function (value) {
        $scope.firstStep.MotivoSolicitud.NumeroPolizaMigracion = '';
        $scope.isRequiredPolicyNumber = value && (value.Codigo != constantsSalud.requestReasoNewPolicyCode);
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
        $scope.motivoSolicitud = []
        
        saludSuscripcionFactory.getPaso1(quotationNumber, showSpin).then(function (data) {
          if(data.OperationCode){
            if(data.OperationCode == 900){
              alert(data.Message);
              localStorage.clear();
              window.close();
            }
          }else{
            _validarPaso(data);
            _validarPermiso(data);
            $scope.firstStep = angular.copy(data);
            $scope.isRequiredPolicyNumber = $scope.firstStep.MotivoSolicitud ?
              $scope.firstStep.MotivoSolicitud.TipoMotivo.Codigo != constantsSalud.requestReasoNewPolicyCode :
              false;
            _formatearData();
          }
          
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
        $scope.firstStep[name].ignoreEquifax = true;
      }

      function _formatearData() {
        $scope.firstStep.ContratantePerson = {};
        $scope.firstStep.TitularPerson = {};
        var keyTitular = '';

        if ($scope.firstStep.Continuidad && $scope.firstStep.Continuidad.TipoCompania && $scope.firstStep.Continuidad.TipoCompania.Codigo){
          $scope.onCompaniasChange();
        }
        if($scope.firstStep.Continuidad && $scope.firstStep.Continuidad.TipoCompaniaSeguro && $scope.firstStep.Continuidad.TipoCompaniaSeguro.Codigo){
          $scope.onCompaniaSeguroChange();
        }
        $scope.firstStep.Asegurados.forEach(function (asegurado, key) {
          asegurado.Talla = angular.isUndefined(asegurado.Talla) ? '' : String(asegurado.Talla);
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
        $scope.firstStep.Titular = $scope.firstStep.Asegurados.splice(keyTitular, 1)[0];

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

        $scope.firstStep.Continuidad.FechaInicio = _cambiarFormatoFechaDate($scope.firstStep.Continuidad.FechaInicio);
        $scope.firstStep.Continuidad.FechaFin = _cambiarFormatoFechaDate($scope.firstStep.Continuidad.FechaFin);
        $scope.firstStep.MotivoSolicitud.TipoMotivo = angular.equals({}, $scope.firstStep.MotivoSolicitud.TipoMotivo) ? null : $scope.firstStep.MotivoSolicitud.TipoMotivo;
        $scope.firstStep.Continuidad.TipoCompania = angular.equals({}, $scope.firstStep.Continuidad.TipoCompania) ? null : $scope.firstStep.Continuidad.TipoCompania;
        _setOptSeguroActive($scope.firstStep.Producto.CodigoTipoPlan, $scope.firstStep.Continuidad.McaOtroSeguro);

        $scope.valcheck.val = ($scope.firstStep.Titular.NumeroDocumento == $scope.firstStep.Contratante.NumeroDocumento && !!$scope.firstStep.MotivoSolicitud.NumeroPolizaMigracion);
      }

      $scope.$on('$destroy', function $destroy(){
        listenValcheck();
      });

      function _reducirListaMotivo(motivos) {
        var codigoPolizaNueva = '1';
        return motivos.filter(function(motivo){ return motivo.Codigo === codigoPolizaNueva });
      }
      
      function _validarPermiso(firstStep) {
        $scope.blockAll = firstStep.EstadoSolicitud != ''  
        $scope.blockCP = $scope.motivoSolicitud.indexOf("CP") < 0 && firstStep.EstadoSolicitud != '' 
        if (firstStep.EstadoSolicitud != '' && $scope.motivoSolicitud.length === 0) {
          $state.go('resumenSuscripcionSalud', { quotationNumber: firstStep.NumeroDocumentoEncript }, {reload: true, inherit: false});
        }
      }
      
      function _validarPaso(data) {
        if (data.Paso > 1 && $scope.motivoSolicitud.length === 0 ) {
          $state.go('quote.steps', {quotationNumber: data.NumeroDocumentoEncript, step: data.Paso});
        }
      }

     $scope.$on('$locationChangeSuccess',function(evt, newUrl, oldUrl) {
      if (oldUrl.split('/').pop() !== 1) {
        $state.go('quote.steps', {quotationNumber: $stateParams.quotationNumber, step: 1});
      }
     });

      function _difAnos(dt2, dt1) {
        var diferencia =(dt2.getTime() - dt1.getTime()) / 1000;
        diferencia /= (60 * 60 * 24);
        return Math.floor(diferencia/365.25);
      }

      function _setOptSeguroActive(tipoPlan, mcaOtroSeguro) {
        if (tipoPlan === 'C') {
          $scope.McaOtroSeguro = {
            valor: mcaOtroSeguro ? mcaOtroSeguro : 1,
            disabled: true
          }
        } else {
          $scope.McaOtroSeguro = {
            valor: mcaOtroSeguro ? mcaOtroSeguro : 2,
            disabled: false
          }
        }
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

        suscripcion.Continuidad.FechaInicio = _cambiarFormatoDatetime(suscripcion.Continuidad.FechaInicio) ;
        suscripcion.Continuidad.FechaFin = _cambiarFormatoDatetime(suscripcion.Continuidad.FechaFin);
        suscripcion.Contratante.FechaNacimiento = _cambiarFormatoDatetime(suscripcion.Contratante.FechaNacimiento) ;
        suscripcion.Contratante.Ubigeo.CodigoPaisNatal = $scope.firstStep.Contratante.Pais.Codigo;
        suscripcion.Contratante.Ubigeo.Departamento = $scope.firstStep.Contratante.Ubigeo.Departamento;
        suscripcion.Contratante.Ubigeo.Provincia = $scope.firstStep.Contratante.Ubigeo.Provincia;
        suscripcion.Contratante.Ubigeo.Distrito = $scope.firstStep.Contratante.Ubigeo.Distrito;
        suscripcion.Continuidad.McaOtroSeguro = $scope.McaOtroSeguro.valor;
        if ($scope.firstStep.Continuidad.TipoCompaniaSeguro) {
          $scope.firstStep.Continuidad.NombreCompania = $scope.firstStep.Continuidad.TipoCompaniaSeguro.Descripcion;
        }

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

        suscripcion.NumeroDocumento = $scope.firstStep.NumeroCotizacion;
        suscripcion.Paso = 1;
        suscripcion.Asegurados.unshift(suscripcion.Titular);
        suscripcion.Asegurados.forEach(function (asegurado) {
          asegurado.Sexo.Descripcion = asegurado.Sexo.Codigo == $scope.sexCode.male ? 'Femenino' : 'Masculino';
          asegurado.FechaNacimiento = _cambiarFormatoDatetime(asegurado.FechaNacimiento);
          if (!angular.isUndefined(asegurado.EstadoCivil)) {
            asegurado.EstadoCivil = {
              Codigo: asegurado.EstadoCivil.CodigoEstadoCivil,
              Descripcion: asegurado.EstadoCivil.NombreEstadoCivil
            }
          }

          asegurado.Profesion = {
            Codigo: asegurado.Profesion.codigo,
            Descripcion: asegurado.Profesion.descripcion
          }

          if (asegurado.TipoAsegurado.Codigo === 'TI') {
            asegurado.Ubigeo = {
              Departamento: $scope.firstStep.Titular.Ubigeo.Departamento,
              Provincia: $scope.firstStep.Titular.Ubigeo.Provincia,
              Distrito: $scope.firstStep.Titular.Ubigeo.Distrito,
              CodigoPaisNatal: asegurado.Pais.Codigo,
              Direccion: $scope.firstStep.Titular.Ubigeo.Direccion
            }
          } else {
            asegurado.Ubigeo = {
              CodigoPaisNatal: asegurado.Pais.Codigo
            }
          }

        });

        delete suscripcion.ContratantePerson;
        delete suscripcion.TitularPerson;

        saludFactory.registrarSuscripcion(suscripcion, true).then(
          function () {
            saludSuscripcionFactory.setPaso1(suscripcion)
            $state.go('.', {
              step: 2
            });
          }
        );
      }
  }

  return ng.module('appLanding')
    .controller('QuoteS1Controller', QuoteS1Controller)
    .factory('loaderSuscripcionP1Controller', ['saludFactory', '$q', 'mainServices','$http',
      function (saludFactory, $q, mainServices, $http) {
        var lists;

        function _getLists(showSpin){

          var deferred = $q.defer();

          mainServices.fnReturnSeveralPromise([
            saludFactory.getDocumentType(false),
            saludFactory.getSexo(false),
            saludFactory.getListEstadoCivil(false),
            saludFactory.getNacionalidad(false),
            saludFactory.getListMotivoSalud(false),
            saludFactory.GetCompaniaSeguroSalud(false)
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
