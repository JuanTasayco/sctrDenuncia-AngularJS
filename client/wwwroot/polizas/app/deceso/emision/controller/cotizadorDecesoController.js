'use strict';

define(['angular', 'constants', 'helper', 'lodash', 'mpfPersonConstants', 'saludFactory', 'mpfPersonComponent', 'decesoFactory'], function(
  angular, constants, helper, _, personConstants) {
  cotizadorDecesoController.$inject = [
    '$scope',
    '$state',
    '$timeout',
    'mModalAlert',
    'mModalConfirm',
    '$sce',
    'saludFactory',
    'decesoFactory',
    'saludLists',
    'oimAbstractFactory',
    'oimClaims',
    'proxyGeneral',
    'decesoAuthorize',
    'mainServices',
    'oimPrincipal',
    '$q'
  ];

  function cotizadorDecesoController(
    $scope,
    $state,
    $timeout,
    mModalAlert,
    mModalConfirm,
    $sce,
    saludFactory,
    decesoFactory,
    saludLists,
    oimAbstractFactory,
    oimClaims,
    proxyGeneral,
    decesoAuthorize,
    mainServices,
    oimPrincipal,
    $q
  ) {
    var vm = this;

      evalAgentViewDcto();
      function _setList(list, paramFilter){
        var vObj = list.filter(function(item) {
          return item.Codigo === paramFilter;
        })[0];
        return vObj;
      }
      $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;
      $scope.data = $scope.firstStep || {};
      $scope.showPlan = false;
      $scope.showInsuredForm = false;
      $scope.data.tipoDocumentoAsegurado = {};
      $scope.format = constants.formats.dateFormat;
      $scope.insuredsList = [];
      $scope.insured = {};
      $scope.data.medioPago = {};
      $scope.data.fechaActual = new Date();
      $scope.data.fechaVencimiento = new Date(new Date().setYear($scope.data.fechaActual.getFullYear() + 1));
      $scope.decimal = constants.formats.twoDecimals;
      $scope.formVida = {};
      $scope.gLblTitle = 'Cotizador de decesos';
      $scope.selectIntegrante = 'TI';
      $scope.appCode = 'DECESO';
      $scope.formCodeTI = 'COT-DECESO-ASE-TI';
      $scope.formCodeIN = 'COT-DECESO-ASE-IN';
      $scope.formCodeCN = 'COT-DECESO-CN';
      $scope.data.contratante = {};
      $scope.titular = {}
      $scope.data.ContratantePerson = {};
      $scope.data.TitularPerson = {};
      $scope.data.blockAll = false
      $scope.data.indexedit = null
      $scope.valcheck = {
        val: false
      }
      $scope.disabledProductos = true;
      $scope.disabledPolizasGrupo = true;
      $scope.disabledModalidades = true;
      $scope.disabledFinanciamientos = true;
      $scope.data.showInsuredFormEdit = false;
      $scope.contratanteValid = false;
      $scope.existTI = false;
      $scope.vigenciaMon = null
      
      var insuredData = {};
      var insuredDocumentNumberValidate;
      var codigoProductoSalud;
      var codigoSubProductoSalud;
      var countIntegrantes = 0;
      $scope.data.IntegrantePerson = {}

      $scope.validadores = {
        minStartDate: null,
        maxEndDate: null,
      }

      $scope.validate = function(itemName){
        return decesoAuthorize.menuItem($scope.codeModule, itemName);
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

      $scope.openModal = function(){
        if($scope.insuredsList.length){
          mModalConfirm.confirmInfo( 'Para modificar el inicio de vigencia se eliminarán todos los asegurados ingresados',
            '¿Deseas cambiar la fecha de inicio?',
            'CONFIRMAR').then(
              function(data){ 
                $scope.insuredsList = [];
                $scope.existTI = false;
              }
            ).catch (function(err){
              console.error(err)
            })
        }
      }

      $scope.onFechaActualChanged = function(date){
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

      $scope.onFinanciamientoChange = function(showspin){

        decesoFactory.ListaFinanciamiento($scope.data.producto.CodigoRamo, $scope.data.polizaGrupo.NumeroPolizaGrupo, $scope.data.modalidad.CodigoModalidad, showspin).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            $scope.financiamientos = response.Data;
            $scope.data.financiamiento = $scope.financiamientos[0];
            if( $scope.financiamientos.length != 1 )
              $scope.disabledFinanciamientos = false;
          }
        })
        .catch(function(error) {
        });

        decesoFactory.FechaVigencia($scope.data.producto.CodigoRamo, $scope.data.polizaGrupo.NumeroPolizaGrupo, $scope.data.modalidad.CodigoModalidad, false).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            $scope.vigenciaMon = parseInt(response.Data)
            $scope.data.fechaVencimiento = new Date(new Date($scope.data.fechaActual).setMonth($scope.data.fechaActual.getMonth() + $scope.vigenciaMon  ));
            }
        })
        .catch(function(error) {
        });
        
      }
        
      $scope.onProductChange = function() {
        if ($scope.data.producto) {
          getPolizasModalidad($scope.data.producto.CodigoRamo, true).then(function(response) {
            if (response[0].OperationCode === constants.operationCode.success) {
              $scope.polizasGrupo = response[0].Data;
              $scope.data.polizaGrupo = $scope.polizasGrupo[0]
              if( $scope.polizasGrupo.length != 1 )
                $scope.disabledPolizasGrupo = false;
            } else {
              mModalAlert.showError(response[0].Message, 'Error');
            }

            if (response[1].OperationCode === constants.operationCode.success) {
              $scope.modalidades = response[1].Data;
              $scope.data.modalidad = $scope.modalidades[0]
              if( $scope.modalidades.length != 1 )
                $scope.disabledModalidades = false;
              $scope.onFinanciamientoChange(true)
            } else {
              mModalAlert.showError(response[1].Message, 'Error');
            }
          }).catch(function(err){
            mModalAlert.showError(err, 'Error');
          });
        } else {
          $scope.showPlan = false;
        }
      };


      var listenValcheck = $scope.$watch('valcheck', function (newVal, oldVal) {
        if (newVal.val) {
          $scope.$broadcast('eventCapture', true);
          $scope.data.noButton = true;
          _createTitularComponent($scope.data.ContratantePerson)
        }
        else {
          $scope.data.noButton = false;
        }
      }, true);

      $scope.$on('$destroy', function $destroy(){
        listenValcheck();
      });

      $scope.isAdmin = true; //oimPrincipal.isAdmin();
      if (saludLists){
        $scope.onFechaActualChanged($scope.data.fechaActual)       
        $scope.productos = saludLists[0].Data;
        $scope.medioPagos = saludLists[1].Data;
        $scope.tiposPersonas = saludLists[2].Data;
        $scope.tiposMoneda = saludLists[3].Data;
        if( $scope.productos.length != 1 )
            $scope.disabledProductos = false;

        $scope.data.producto = $scope.productos[0];
        $scope.onProductChange();
        var ag = oimPrincipal.getAgent();
        $scope.data.mAgente = {
          codigoNombre: ag ? ag.codigoAgente + '-' + ag.codigoNombre : '',
          codigoAgente: ag ? ag.codigoAgente : ''
        };
      }

      if (typeof $scope.data.fechaNacimiento === 'string') {
        $scope.data.fechaNacimiento = new Date($scope.data.fechaNacimiento);
      }

     

      $scope.$on('personForm', function(event, data) {
        if(data.datosContratante){
          $scope.contratanteValid = data.valid;
          $scope.data.ContratantePerson = angular.copy(data.datosContratante)
          //setFormContratante(data.datosContratante)          
        }
        if (data.compAsegurado1) {
          $scope.aseguradoValid = data.valid;
          setFormData(data.compAsegurado1);
        }      
        if (data.compAsegurado2) {
          $scope.aseguradoValid = data.valid;
          setFormData(data.compAsegurado2);
        }   
      });

      function _cambiarFormatoDatetime(fecha) {
        var fechaModificada = angular.isDate(fecha) ? $filter('date')(fecha, 'dd/MM/yyyy') : fecha;
        return fechaModificada;
      }

      function getPolizasModalidad(codigoRamo, showSpin){
        var deferred = $q.defer();
        mainServices.fnReturnSeveralPromise([
          decesoFactory.ListaPolizaGrupo(codigoRamo, false),
          decesoFactory.ListaModalidad(codigoRamo, false)
        ], showSpin).then(function(response){
          deferred.resolve(response);
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      function setFormData(data){
        $scope.dataAsegurado = {};
        $scope.data.tipoDocumento = data.documentType;
        $scope.data.numeroDocumento = data.documentNumber;
        $scope.data.nombreAsegurado = data.Nombre;
        $scope.data.apellidoPaternoAsegurado = data.ApellidoPaterno;
        $scope.data.apellidoMaternoAsegurado = data.ApellidoMaterno;
        $scope.data.sexo = {
          Descripcion: data.Sexo === '1' ? 'Masculino' : 'Femenino',
          Codigo: data.Sexo
        };
        $scope.data.tipo = null;
        $scope.data.fechaNacimiento = new Date(data.year.Codigo, data.month.Codigo - 1, data.day.Codigo);
        $scope.data.EstadoCivil = {
          codigo: data.civilState ? data.civilState.Codigo : null,
          descripcion: data.civilState ? data.civilState.Descripcion : null,
          CodigoEstadoCivilTron: data.civilState ? data.civilState.CodigoEstadoCivilTron: null
        };
        $scope.data.telefonoCasa = data.Telefono ? data.Telefono : null;
        $scope.data.telefonoMovil= data.Telefono2 ? data.Telefono2 : null;
        $scope.data.correo = data.CorreoElectronico || data.emailPersonal ? data.CorreoElectronico || data.emailPersonal : null;
        
        $scope.data.codProfesion = data.Profesion && data.Profesion.Codigo ? data.Profesion.Codigo : null;
        $scope.data.nacionalidad = data.nationality && data.nationality.Codigo ? data.nationality.Codigo : null;
        $scope.data.direccion = {
          codPais: data.residenceCountry && data.residenceCountry.Codigo ? data.residenceCountry.Codigo : null,
          codDepartamento: data.Department && data.Department.Codigo ? data.Department.Codigo : null,
          codProvincia: data.Province && data.Province.Codigo ? data.Province.Codigo : null,
          codDistrito: data.District && data.District.Codigo ? data.District.Codigo : null,
          tipDomicilio: data.Via && data.Via.Codigo ? data.Via.Codigo : null,
          nomDomicilio: data.NombreVia ? data.NombreVia : null,
          tipNumero: data.NumberType && data.NumberType.Codigo ? data.NumberType.Codigo : null,
          descNumero: data.TextoNumero ? data.TextoNumero : null,
          tipInterior: data.Inside && data.Inside.Codigo ? data.Inside.Codigo : null,
          nroInterior: data.TextoInterior? data.TextoInterior : null,
          tipZona: data.Zone && data.Zone.Codigo? data.Zone.Codigo : null,
          nomZona: data.TextoZona ? data.TextoZona : null,
          refDireccion: data.Referencia ? data.Referencia : null
        }
        //$scope.data.tipoPersona = data.tipoPersona;
      }
      function validateContratante(){
        var valContratamte = $scope.data.ContratantePerson;
        if(valContratamte.Department && valContratamte.Province  && valContratamte.District && 
          valContratamte.year && valContratamte.month && valContratamte.day && valContratamte.documentType
          ){
          if(valContratamte.documentType.Codigo && valContratamte.documentNumber && 
            valContratamte.year.Codigo && valContratamte.month.Codigo && valContratamte.day.Codigo &&
            valContratamte.Sexo && valContratamte.ApellidoPaterno && valContratamte.ApellidoMaterno && 
            valContratamte.Nombre && valContratamte.Telefono2 && (valContratamte.emailPersonal || valContratamte.CorreoElectronico ) && 
            valContratamte.Department.Codigo && valContratamte.Province.Codigo  && valContratamte.District.Codigo
            ){
              return true
            }
        }
        return false
      }
      function setFormContratante(){
          return {
            mcaFisico:    $scope.data.ContratantePerson.MCAFisico,
            TipoDocumento:    $scope.data.ContratantePerson.documentType,
            NumeroDocumento:  $scope.data.ContratantePerson.documentNumber,
            FechaNacimiento:  formatDate(JSON.parse(JSON.stringify(new Date($scope.data.ContratantePerson.year.Codigo, $scope.data.ContratantePerson.month.Codigo - 1, $scope.data.ContratantePerson.day.Codigo)))),
            Sexo:             {
              Descripcion:  $scope.data.ContratantePerson.Sexo === '1' ? 'Masculino' : 'Femenino',
              Codigo:  $scope.data.ContratantePerson.Sexo
            },
            ApellidoPaterno:  $scope.data.ContratantePerson.ApellidoPaterno.toUpperCase(),
            ApellidoMaterno:  $scope.data.ContratantePerson.ApellidoMaterno.toUpperCase(),
            Nombre:           $scope.data.ContratantePerson.Nombre.toUpperCase(),            
            EstadoCivil: {
              Descripcion: $scope.data.ContratantePerson.civilState ? $scope.data.ContratantePerson.civilState.Descripcion : null,
              Codigo: $scope.data.ContratantePerson.civilState ? $scope.data.ContratantePerson.civilState.CodigoEstadoCivilTron: null
            },
            telefonoCasa: $scope.data.ContratantePerson.Telefono,
            telefonoMovil: $scope.data.ContratantePerson.Telefono2,
            correo: $scope.data.ContratantePerson.CorreoElectronico || $scope.data.ContratantePerson.emailPersonal,
            codProfesion: $scope.data.ContratantePerson.Profesion.Codigo,
            nacionalidad: $scope.data.ContratantePerson.nationality.Codigo,
            direccion: {
              codPais: $scope.data.ContratantePerson.residenceCountry.Codigo,
              codDepartamento: $scope.data.ContratantePerson.Department.Codigo,
              codProvincia: $scope.data.ContratantePerson.Province.Codigo,
              codDistrito: $scope.data.ContratantePerson.District.Codigo,
              tipDomicilio: $scope.data.ContratantePerson.Via.Codigo,
              nomDomicilio: $scope.data.ContratantePerson.NombreVia,
              tipNumero: $scope.data.ContratantePerson.NumberType.Codigo,
              descNumero: $scope.data.ContratantePerson.TextoNumero,
              tipInterior: $scope.data.ContratantePerson.Inside.Codigo,
              nroInterior: $scope.data.ContratantePerson.TextoInterior,
              tipZona: $scope.data.ContratantePerson.Zone.Codigo,
              nomZona: $scope.data.ContratantePerson.TextoZona,
              refDireccion: $scope.data.ContratantePerson.Referencia
          }
          };
      }


      $scope.findAgent = function(wildcar) {
        return decesoFactory.GetListAgente({
          "CodigoNombre": wildcar, //filtro nombre agente
          "CodigoGestor": "0", //combobox gestor seleccionado
          "CodigoOficina": "0", //dato de usuario logeado
          "RolUsuario": oimPrincipal.get_role() //$scope.$parent.mainStep.claims.rolUsuario //dato de usuario logeado
        }, true);
      }

      $scope.onShowInsuredForm = function() {
        $scope.$broadcast('submitForm', true);
        if(validateContratante()){
          var split = $scope.data.ContratantePerson.FechaNacimiento.split('/');
          if (split.length === 3) {
            var fechaNacimiento  = new Date(split[2], split[1] - 1, split[0]);
          }
          if(getAge(fechaNacimiento) < 18){
            mModalAlert.showWarning('El contratante debe tener 18 años como mínimo, considerando la fecha de inicio de vigencia de la póliza.', 'ALERTA');
          }else{
            $scope.showInsuredForm = true;
            $scope.data.tipoDocumento = null;
            $scope.data.numeroDocumento = '';
            $scope.data.cobertura = false;
            $scope.valcheck.val = false
            _clearInsured();
            if($scope.existTI){
              $scope.data.tipoPersona = $scope.tiposPersonas[1];
            }else{
              $scope.data.tipoPersona = $scope.tiposPersonas[0];
            }
            $scope.data.cobertura = false;
            $scope.data.TitularPerson = {};
            $scope.data.IntegrantePerson = {};
          }
        } 
        
      };

      $scope.onHiddenInsuredForm = function() {
        $scope.showInsuredForm = false;
        $scope.data.showInsuredFormEdit = false;
        $scope.data.showInsuredFormEdit = false;
        $scope.data.indexedit = null;
      };

      function _createTitularComponent(data){
        if(data){
          $scope.data.TitularPerson = angular.copy($scope.data.ContratantePerson);
        }        
      }

      function _validateInsuredForm(){
        return $scope.aseguradoValid;
      }
      function _addInsured(insured){
        $scope.insuredsList.push(insured);
        var ninsuredsList = []
        var indexList = 0
        $scope.insuredsList.forEach(function(item) {
          if($scope.existTI){
            if(item.TipoAsegurado.codigo =='TI'){
              ninsuredsList[0] = item;
            }else{
              indexList++;
              ninsuredsList[indexList] = item;              
            }
          }else{
            ninsuredsList[indexList] = item;
            indexList++;
          }
          
        });
        $scope.insuredsList = ninsuredsList
        $scope.showInsuredForm = false;
        $scope.showInsuredResumen = true;
      }
      function _paramsPostInsuredValidate(){
        var vParams = {
            TipoDocumento:    $scope.data.tipoDocumento,
            NumeroDocumento:  $scope.data.numeroDocumento,
            FechaNacimiento:  formatDate(JSON.parse(JSON.stringify($scope.data.fechaNacimiento))),
            Edad: getAge($scope.data.fechaNacimiento),
            Sexo:             {codigo: $scope.data.sexo.Codigo, Descripcion: $scope.data.sexo.Descripcion},
            ApellidoPaterno:  $scope.data.apellidoPaternoAsegurado.toUpperCase(),
            ApellidoMaterno:  $scope.data.apellidoMaternoAsegurado.toUpperCase(),
            Nombre:           $scope.data.nombreAsegurado.toUpperCase(),
            TipoAsegurado:    {codigo: $scope.data.tipoPersona.Codigo, Descripcion: $scope.data.tipoPersona.Descripcion  },
            cobertura:        $scope.data.tipoPersona.Codigo == 'TI' ? true : $scope.data.cobertura,
            EstadoCivil: {
              Codigo: $scope.data.EstadoCivil ? $scope.data.EstadoCivil.CodigoEstadoCivilTron : null,
              Descripcion: $scope.data.EstadoCivil ? $scope.data.EstadoCivil.descripcion : null
            },
            telefonoCasa: $scope.data.telefonoCasa ? $scope.data.telefonoCasa : null ,
            telefonoMovil: $scope.data.telefonoMovil ? $scope.data.telefonoMovil : null ,
            correo: $scope.data.correo ? $scope.data.correo : null ,
            codProfesion: $scope.data.codProfesion ? $scope.data.codProfesion : null,
            nacionalidad: $scope.data.nacionalidad ? $scope.data.nacionalidad : null,
            direccion: $scope.data.direccion
          };
        return vParams;
      }
      function _paramsPostIntegrantes(){
        var vAsegurados = []
        $scope.insuredsList.forEach(function(it) {
          vAsegurados.push(it)
        });
        vAsegurados.push({
          TipoDocumento:    $scope.data.tipoDocumento,
          NumeroDocumento:  $scope.data.numeroDocumento,
          FechaNacimiento:  formatDate(JSON.parse(JSON.stringify($scope.data.fechaNacimiento))),
          Sexo:             {codigo: $scope.data.sexo.Codigo, Descripcion: $scope.data.sexo.Descripcion},
          ApellidoPaterno:  $scope.data.apellidoPaternoAsegurado.toUpperCase(),
          ApellidoMaterno:  $scope.data.apellidoMaternoAsegurado.toUpperCase(),
          Nombre:           $scope.data.nombreAsegurado.toUpperCase(),
          TipoAsegurado:    {codigo: $scope.data.tipoPersona.Codigo, Descripcion: $scope.data.tipoPersona.Descripcion  },
          cobertura:        $scope.data.tipoPersona.Codigo == 'TI' ? true : $scope.data.cobertura,
          EstadoCivil: {
            Codigo: $scope.data.EstadoCivil ? $scope.data.EstadoCivil.CodigoEstadoCivilTron : null,
            Descripcion: $scope.data.EstadoCivil ? $scope.data.EstadoCivil.descripcion : null
          },
          telefonoCasa: $scope.data.telefonoCasa ? $scope.data.telefonoCasa : null ,
          telefonoMovil: $scope.data.telefonoMovil ? $scope.data.telefonoMovil : null ,
          correo: $scope.data.correo ? $scope.data.correo : null,
          codProfesion: $scope.data.codProfesion ? $scope.data.codProfesion : null,
          nacionalidad: $scope.data.nacionalidad ? $scope.data.nacionalidad : null,
          direccion: $scope.data.direccion
        });
        return vAsegurados;
      }
      $scope.onAddInsuredData = function() {
        $scope.$broadcast('submitForm', true);
        if (_validateInsuredForm() && $scope.data.producto){
          var vParamsbody = {
            Ramo: { codigoRamo: $scope.data.producto.CodigoRamo },
            PolizaGrupo: { numeroPolizaGrupo: $scope.data.polizaGrupo.NumeroPolizaGrupo },
            Modalidad: { codigoModalidad: $scope.data.modalidad.CodigoModalidad },
            Asegurados: _paramsPostIntegrantes(),
            fechaInicio: formatDate(JSON.parse(JSON.stringify($scope.data.fechaActual))) ,
          };

          var vInsured = _paramsPostInsuredValidate();
          var vInsuredType = vInsured.TipoAsegurado.Codigo;          
          insuredDocumentNumberValidate = vInsured.NumeroDocumento;
          decesoFactory.validarIntegrante(vParamsbody, true).then(function(res) {
            if (res.OperationCode === 200) {
              if(vInsured.TipoAsegurado.codigo =='TI'){
                $scope.existTI = true;
              }
              _addInsured(vInsured);
              if(res.Message !== ""){ 
                mModalAlert.showInfo('', res.Message);
              }
            } else{
              mModalAlert.showInfo('', res.Message);
            }
          });
        }
      };
      
      function evalAgentViewDcto(){
        var params = {CodigoAgente: oimClaims.agentID}
        proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, false)
        .then(function(response){
          $scope.formVida.viewDcto = response.Data
        });
      }

      $scope.onDocumentChange = function() {
        $scope.data.numeroDocumento = '';
        var numDocValidations = {};
        mainServices.documentNumber.fnFieldsValidated(numDocValidations, $scope.data.tipoDocumento.Codigo, 1);

        $scope.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
        $scope.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
        $scope.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        $scope.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
        _clearInsured();
      };

      $scope.onCleanInsuredData = function() {
        $scope.data.numeroDocumento = '';
        $scope.data.tipoDocumento = null;
        _clearInsured();
      };

      $scope.onDeleteRowInsuredResumen = function(index) {
        if($scope.insuredsList[index].TipoAsegurado.codigo =='TI'){
          $scope.existTI = false;
        }
        $scope.insuredsList.splice(index, 1);
        
      };

      if ($scope.insuredsList.length === 0) {
        $scope.formVida.PorDctoIntgPlaza = 0;
        $scope.formVida.DctoIntegralidad = false;
      }
      // FUNCTIONS
      function buscarPersona(tipo, numeroDocumento, fnCallback) {
        if (tipo == null || numeroDocumento.length === 0) {
          return;
        }
        saludFactory.getDataInsured(tipo, numeroDocumento, true).then(
          function(data) {
            if (data.OperationCode === 200) {
              if (typeof fnCallback === 'function') {
                fnCallback(data);
              }
            }
          }
        );
        }

      function _clearInsured() {
        $scope.data.apellidoPaternoAsegurado = '';
        $scope.data.apellidoMaternoAsegurado = '';
        $scope.data.nombreAsegurado = '';
        $scope.data.sexo = null;
        $scope.data.fechaNacimiento = null;
        $scope.data.tipoPersona = null;
      }
      $scope.searchInsured = function() {
        _clearInsured();
        buscarPersona($scope.data.tipoDocumento.Codigo, $scope.data.numeroDocumento, function(data) {
          $scope.data.nombreAsegurado = data.Data.Nombre;
          $scope.data.apellidoPaternoAsegurado = data.Data.ApellidoPaterno;
          $scope.data.apellidoMaternoAsegurado = data.Data.ApellidoMaterno;
          $scope.dataAsegurado = data.Data;
          $scope.data.sexo =
            data.Data.Sexo === '1'
              ? { Codigo: '1', Descripcion: 'Masculino' }
              : { Codigo: '0', Descripcion: 'Femenino' };
          $scope.data.tipo = null;

          if ($scope.dataAsegurado.FechaNacimiento !== '') {
            var split = $scope.dataAsegurado.FechaNacimiento.split('/');
            if (split.length === 3) {
              $scope.data.fechaNacimiento = new Date(split[2], split[1] - 1, split[0]);
            }
            $scope.enableFecha = true;
          } else {
            $scope.enableFecha = false;
          }

          $scope.data.buscado = true;
        });
      };

      $scope.validationFormQuote = function() {
        $scope.formVida.markAsPristine();
        $scope.afterInsuredsList = angular.copy($scope.insuredsList);
        if ($scope.data.producto.CodigoCompania != null) {
            $scope.insuredsList.forEach(function(it) {
              if(it.TipoAsegurado.codigo != 'TI'){
                it["codProfesion"] = null;
                it["nacionalidad"] = null;
                it["direccion"] = {
                  codPais: null,
                  codDepartamento: null,
                  codProvincia: null,
                  codDistrito: null,
                  tipDomicilio: null,
                  nomDomicilio: null,
                  tipNumero: null,
                  descNumero: null,
                  tipInterior: null,
                  nroInterior: null,
                  tipZona: null,
                  nomZona: null,
                  refDireccion: null,
                }
              }
            });
            if ($scope.data.medioPago && $scope.data.medioPago.Codigo != null){
              $scope.$broadcast('submitForm', true);
              if(validateContratante()){
                var split = $scope.data.ContratantePerson.FechaNacimiento.split('/');
                if (split.length === 3) {
                  var fechaNacimiento  = new Date(split[2], split[1] - 1, split[0]);
                }
                if( getAge(fechaNacimiento) <18){
                  mModalAlert.showWarning('El contratante debe tener 18 años como mínimo, considerando la fecha de inicio de vigencia de la póliza.', 'ALERTA');
                }else {
                  _validateQuoteWithInsureds();
                }
              }
            }else{
              mModalAlert.showWarning('Debe ingresar un Medio de Pago', 'ALERTA');
            }
        }
      };

      function _existTitular(insured) {
        return insured.TipoAsegurado.Codigo === 'TI';
      }

      function _existConyuge(insured) {
        return insured.TipoAsegurado.Codigo === 'CO';
      }

      function _existDocumentNum(insured) {
        return insured.NumeroDocumento === insuredDocumentNumberValidate;
      }
      function _validateQuoteWithInsureds() {
        if ($scope.insuredsList.length > 0) {
          var quotationPost = {
            CodigoSistema: oimAbstractFactory.getOrigin(),
            Ramo: $scope.data.producto,
            PolizaGrupo: $scope.data.polizaGrupo,
            Modalidad: $scope.data.modalidad,
            Agente: $scope.data.mAgente,
            Financiamiento: $scope.data.financiamiento,
            FormaPago: $scope.data.medioPago,
            contratante:setFormContratante(),
            asegurados: $scope.insuredsList,
            codigoFinanciamiento: $scope.data.financiamiento,
            fechaInicio: formatDate(JSON.parse(JSON.stringify($scope.data.fechaActual))),
            fechaFin: formatDate(JSON.parse(JSON.stringify($scope.data.fechaVencimiento))),
            FlagAgenteDirecto: "N"
          };
          decesoFactory.RegistrarCotizacion(quotationPost, true).then(function(res) {
            if (res.OperationCode === 200) {
              var quotationResponse = res.Data;
              $state.go('cotizacionGuardadaDeceso', { numDoc: quotationResponse.NumeroDocumento }, { reload: true, inherit: false });
            }
            else if (res.OperationCode === 422){
              mModalConfirm.confirmWarning(res.Message, '').then( function(res){
                quotationPost["FlagAgenteDirecto"] = "S";
                cotizar(quotationPost);
              }, function(error){
                quotationPost["FlagAgenteDirecto"] = "N";
                
              }
              )
            }
            else {
              $scope.insuredsList = angular.copy($scope.afterInsuredsList);
              mModalAlert.showInfo('', res.Message);
            }
          }).catch(function(error) {
            mModalAlert.showInfo('', error);
          });;
        } else {
          addInsuredAlert();
        }
      }
    function cotizar(quotationPost){
      decesoFactory.RegistrarCotizacion(quotationPost, true).then(function(res) {
        if (res.OperationCode === 200) {
          var quotationResponse = res.Data;
          $state.go('cotizacionGuardadaDeceso', { numDoc: quotationResponse.NumeroDocumento }, { reload: true, inherit: false });
        }
        else {
          $scope.insuredsList = angular.copy($scope.afterInsuredsList);
          mModalAlert.showInfo('', res.Message);
        }
      }).catch(function(error) {
        mModalAlert.showInfo('', error);
      });;
    }
    $scope.obtenerDctontegralidad = function() {
      if ($scope.formVida.DctoIntegralidad){
        if($scope.insuredsList.length > 0){
          getTitular();
          proxyGeneral
            .ObtenerDescuentoIntegralidad(
              constants.module.polizas.salud.companyCode,
              oimClaims.agentID,
              $scope.data.producto.CodigoRamo,
              $scope.titular.TipoDocumento.Codigo,
              $scope.titular.NumeroDocumento
            )
            .then(function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.formVida.PorDctoIntgPlaza = response.Data;
              }
            })
            .catch(function(error) {
              console.log('Error en obtenerDctontegralidad: ' + error);
            });
        }
      } else {
        $scope.formVida.PorDctoIntgPlaza = 0;
        $scope.formVida.DctoIntegralidad = false;
      }
    };
    function getTitular() {
      $scope.titular = _.find($scope.insuredsList, function(o) {
        if (o.TipoAsegurado.Codigo === 'TI') {
          return o;
        }
      });
    }

      function formatDate(date) {
        var format = date.slice(0, 10);
        return format.replace(/^(\d{4})-(\d{2})-(\d{2})$/g, '$3/$2/$1');
      }

      // MODALS
      function addInsuredAlert() {
        mModalAlert.showWarning('Debe ingresar un asegurado', 'ALERTA');
      }

      function fourthChildrensAlert() {
        mModalAlert.showWarning('Solo puedes agregar hasta 4 hijos', 'ALERTA');
      }

      function oneTitularAlert() {
        mModalAlert.showWarning('Solo puedes agregar 1 titular', 'ALERTA');
      }

      function oneIntegranteAlert() {
        mModalAlert.showWarning('Solo puedes agregar 5 Integrantes', 'ALERTA');
      }

      function sexoTitularAlert() {
        mModalAlert.showWarning('El titular no puede tener el mismo sexo que el cónyuge', 'ALERTA');
      }

      function sexoConyugeAlert() {
        mModalAlert.showWarning('El cónyuge no puede tener el mismo sexo que el titular', 'ALERTA');
      }

      function documentNumberAlert() {
        mModalAlert.showWarning('Ya existe un asegurado con ese número de documento', 'ALERTA');
      }

      function getAge( fechaNacimiento) {
        var today = new Date();
        var dateString = fechaNacimiento;
        var birthDate = new Date(dateString);

        var yearNow = today.getYear();
        var monthNow = today.getMonth();
        var dateNow = today.getDate();

        var yearDob = birthDate.getYear();
        var monthDob = birthDate.getMonth();
        var dateDob = birthDate.getDate();

        var yearAge = yearNow - yearDob;

        if (monthNow >= monthDob)
          var monthAge = monthNow - monthDob;
        else {
          yearAge--;
          var monthAge = 12 + monthNow -monthDob;
        }

        if (dateNow < dateDob){
          monthAge--;
          if (monthAge < 0) {
            monthAge = 11;
            yearAge--;
          }
        }   
        return yearAge;
      }

      $scope.fnSeeDetail = function(){
        $scope.paramsFile = $scope.data.producto.CodigoRamo + '/' + $scope.data.producto.CodigoModalidad + '/' + $scope.data.producto.NumeroContrato + '/' + $scope.data.producto.NumeroSubContrato;
        $scope.attachFileQuoteURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/salud/descargar/archivoplan/' + $scope.paramsFile);
        $timeout(function() {
          document.getElementById('frmAttachFileQuote').submit();
        }, 500);
      };

  }

  return angular.module('appDeceso')
    .controller('cotizadorDecesoController', cotizadorDecesoController)
    .factory('loaderCotizadorDecesoController', ['saludFactory', 'decesoFactory', '$q', 'mainServices',
      function(saludFactory, decesoFactory, $q, mainServices){
        var lists;

        function _getLists(showSpin){
          var deferred = $q.defer();
          mainServices.fnReturnSeveralPromise([
            decesoFactory.ListarRamo(true),
            decesoFactory.ListaMedioPago(false),
            decesoFactory.ListaTipoAsegurado(false),
            saludFactory.getCurrencyType(false)
          ], showSpin).then(function(response){
            lists = response;
            deferred.resolve(lists);
          }, function (error){
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }

        return {
          getLists: function(showSpin){
            if (lists) return $q.resolve(lists);
            return _getLists(showSpin);
          }
        };
      }]);
});
