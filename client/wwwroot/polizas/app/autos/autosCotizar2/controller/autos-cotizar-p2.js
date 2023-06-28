(function($root, deps, action){
    define(deps, action)
})(this, [
  'angular',
  'lodash',
  'constants',
  'mpfPersonConstants',
  '/polizas/app/autos/autosCotizar2/service/autosCotizarFactory.js',
  '/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js',
  'mpfPersonComponent'
  ],
  function(angular, _, constants, personConstants){
    angular.module("appAutos").controller('autosCotizarS2', ['$scope', '$state', 'autosCotizarFactory', '$timeout', 'mModalAlert', '$rootScope', 'oimPrincipal', 'mainServices', 'proxyGeneral', 'mpfPersonFactory', 'mpSpin',
      function($scope, $state, autosCotizarFactory, $timeout, mModalAlert, $rootScope, oimPrincipal, mainServices, proxyGeneral, mpfPersonFactory, mpSpin){

    var _self = this;
      const MAXDAYS = 365;

      (function onLoad() {
        $scope.evalAgentViewDcto = evalAgentViewDcto;
        evalAgentViewDcto();
        $scope.formData = $rootScope.formData || {};
        if($scope.formData.ModeloMarca){
          disableNextStep();
          loadProductoxUsuario();
        }
        else{
          $state.go('.',{
            step: 1
          });
        }

        if(!$scope.formData.inicioVigencia){
          $scope.formData.inicioVigencia = new Date();
          $scope.formData.finVigencia = new Date();
          $scope.formData.finVigencia.setYear($scope.formData.finVigencia.getFullYear() + 1)
        }
        $scope.maxDate = new Date(new Date().setFullYear( new Date().getFullYear() - 18 ));

        $scope.formData.optMostrarMDolar = $scope.formData.optMostrarMDolar || 2;

        $scope.$on('personForm', function(event, data) {
          if (data.contractor) {
            setFormData(data.contractor);
            $scope.contractorValid = data.valid;
          }
        });

        $scope.companyCode = constants.module.polizas.autos.companyCode;
        $scope.appCode = personConstants.aplications.AUTOS;
        $scope.formCodeCN = personConstants.forms.COT_AUT_CN;
        $scope.daySource = mpfPersonFactory.getDays();
        $scope.monthSource = mpfPersonFactory.getMonths();
        $scope.yearSource = mpfPersonFactory.getYears();
        getTransmissionTypeList();
        $scope.documentNumber = $rootScope.dataFromInspec ? $rootScope.dataFromInspec.Contratante.CodigoDocumento : null;
        $scope.documentType = $rootScope.dataFromInspec ? $rootScope.dataFromInspec.Contratante.TipoDocumento : null;
        $scope.formData.isEmblem = $scope.formData.isEmblem || false;
        $scope.hiddenFields = $scope.formData.isEmblem ? [] : [personConstants.fields.CIVIL_STATUS];
      })();

      _self.$onDestroy = function() {
        _self.listener();
      };

      $scope.documentsChange = function(data) {
        if (angular.isDefined(data.documentType) && angular.isDefined(data.documentNumber)) {
          $scope.formData.mTipoDocumento = data.documentType;
          $scope.formData.mNumeroDocumento = data.documentNumber;
          $scope.formData.showNaturalPerson = mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
          $scope.formData.opcionesContratante = {
            Codigo: data.documentType.Codigo === constants.documentTypes.ruc.Codigo ? "2" : "1"
          };
          $scope.formData.esFraudulento = data.EsFraudulento;
        }
        if (data.isClear){
          $scope.formData.mTipoDocumento = null;
          $scope.formData.mNumeroDocumento = null;
          $scope.formData.showNaturalPerson = false;
        }
        if ($scope.formData.mTipoDocumento && $scope.formData.mNumeroDocumento) {
        getUserScore({
          applicationCode: $scope.appCode,
          tipoDocumento: $scope.formData.mTipoDocumento.Codigo,
          codigoDocumento: $scope.formData.mNumeroDocumento,
          codigoCompania: $scope.companyCode
        });
        }
      }

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
            dd = '0' + dd
          }
          if(mm<10){
            mm = '0' + mm
          }
          return  dd + '/' + mm + '/' + yyyy;
        }
      }

      $scope.hoy = formatearFecha(new Date());

      $scope.productoValid = true;
	  $scope.productoExceptionMessage = null;

      // Vigencia
      $scope.format = 'dd/MM/yyyy';

      $scope.popupNac = {
        opened: false
      };

      $scope.popup1 = {
        opened: false
      };

      $scope.popup2 = {
        opened: false
      };

      $scope.adultDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18 ))

      $scope.dateOptions = {
        initDate: new Date(),
        minDate: new Date(),
        maxDate: mainServices.date.fnAdd(new Date(), MAXDAYS , 'D')
      };

      // Radio
      $scope.gLblSi = {
          label: 'Si',
          required: true,
          error1: '* Este campo es obligatorio'
      };
      $scope.gLblNo = {
          label: 'No',
          required: true,
          error1: '* Este campo es obligatorio'
      };
      $scope.si = {
          name: 'formData.optMostrarMDolar',
          value: '1'
      };
      $scope.no = {
          name: 'formData.optMostrarMDolar',
          value: '2'
      };

      $scope.openNac = function() {
        $scope.popupNac.opened = true;
      };

      $scope.open1 = function() {
        $scope.popup1.opened = true;
      };

      $scope.open2 = function() {
        $scope.popup2.opened = true;
      };

      $scope.$watch('$scope.formData.inicioVigencia', function(nv){
        $scope.dateOptions.minDate = $scope.formData.inicioVigencia;
      });

      $scope.$watch('formData', function(nv){
        $rootScope.formData =  nv;
      });
      // showMapfreDolares
      $scope.showMapfreDolares = function(tipoDocumento, numeroDocumento) { //setear campos
        $scope.bDatosContratante = 0;
        var vParams = '/' + tipoDocumento + '/' + numeroDocumento;

        autosCotizarFactory.getMapfreDolares(vParams).then(function(response) {
          if (response.OperationCode === constants.operationCode.success) {
            var data = response.Data;

            if (tipoDocumento !== 'RUC') {
              if (data.Nombre == null) {
                $scope.bDatosContratante = 2;
              } else {
                $scope.bDatosContratante = 1;
                $scope.formData.mNomContratante = data.Nombre;
                $scope.formData.mApePatContratante = data.ApellidoPaterno;
                $scope.formData.ImporteMapfreDolar = (function(){
                  var str = data.MapfreDolars.toString()
                  str = str.substring(0, 7)
                  return parseFloat(str);
                })();
              }
            }

        }
        else if (response.Message.length > 0) {
          $scope.bDatosContratante = 2;
        }
      })
      .catch(function(error) {
        $scope.bDatosContratante = 2;
        console.log('Error en getMapfreDolares: ' + error);
      });
    };

     $scope.changeDate = function(valI, valF){
      if(typeof $scope.formData.inicioVigencia != 'undefined'){
        $scope.formData.inicioVigencia2 = angular.copy(valI);

        if(valF > $scope.formData.inicioVigencia2.setFullYear($scope.formData.inicioVigencia2.getFullYear() + 1)){
          $scope.formData.finVigenciaBkp = angular.copy(valF);
          $scope.formData.inicioVigencia = valI;
          $scope.formData.finVigencia = valF;
        }else{
          $scope.formData.inicioVigencia = valI;//new Date();
          $scope.formData.finVigencia = new Date(angular.copy(valI).setFullYear(angular.copy(valI).getFullYear() + 1));
        }
      }
    }

    function disableNextStep(){
      $scope.formData.thirdStepNextStep = false;
    }

    $scope.$on('changingStep', function(ib,e){
      if (typeof $scope.formData.thirdStepNextStep == 'undefined') $scope.formData.thirdStepNextStep = false;

      if (e.step < 3) {
        e.cancel = false;
      }
      else{
        if (typeof $scope.formData.mProducto != 'undefined'){
          if ($scope.formData.mProducto.CodigoProducto!=null){
            if (typeof $scope.formData.mUsoRiesgo != 'undefined'){
              if ($scope.formData.mUsoRiesgo.Codigo!=null){
                e.cancel = false;
              }
              else{
                e.cancel = true;
              }
            }
            else{
              e.cancel = true;
              disableNextStep();
            }
          }
          else{
            e.cancel = true;
            disableNextStep();
          }
        }
        else{
          e.cancel = true;
          disableNextStep();
        }
      }
    });

    // ProductoxMarca
    function loadProductoxUsuario(){//cambiado en integracion
      var vParams = {
        CodigoAplicacion : constants.module.polizas.description,
        CodigoUsuario : $scope.mAgente.codigoUsuario,
        Filtro : constants.module.polizas.autos.description,
        CodigoRamo : constants.module.polizas.autos.codeRamo,
        CodigoTipoVehiculo : $scope.formData.Tipo
      };
      mpSpin.start();
      autosCotizarFactory.getProducts(vParams).then(function(response){
        if(response.OperationCode == constants.operationCode.success){
          $scope.productos = response.Data;
          $scope.sinProductos=false;
          if ($rootScope.dataFromInspec) {
            $scope.formData.mProducto = _.find($scope.productos, { 'CodigoProducto': $rootScope.dataFromInspec.CodigoProducto });
            $scope.getFuctionsProducto($scope.formData.mProducto);
          }
        }else if (response.Message.length > 0){
          $scope.sinProductos=true;
        }
        mpSpin.end();
      })
      .catch(function(error){
        mpSpin.end();
        console.log('Error en getProducts: ' + error);
      });

      if(typeof $scope.formData.mProducto != 'undefined'){
          loadUso($scope.formData.mProducto.CodigoModalidad, $scope.formData.mSubModelo.Tipo);

        }
      }

      function _setProduct(){
      $scope.formData.mProducto = {
        CodigoProducto: null
      };
    }

    function es0Km(val){
      var autosArray = constants.module.polizas.autos.productos0Km;
      var producto0Km = false;
      for(var i=0; i<autosArray.length; i++){
        if(autosArray[i]==val){
          producto0Km = true;
          break;
        }
      }
      return producto0Km;
    }

    $scope.getFuctionsProducto = function(val){//setear campos
      if(val.CodigoProducto == null){
        delete $scope.formData.mUsoRiesgo;
      }else{
        //si es auto usado y ha seleccionado un producto para autos nuevos
          if($scope.formData.mcaNuevo == 'N' && es0Km(val.CodigoProducto)){

          mModalAlert.showWarning("El producto Auto 0Km y Auto 0Km X2 son exclusivamente para automoviles nuevos", "Seleccione otro producto", "", "", "", "g-myd-modal").then(function(response){
            if (response){
              _setProduct();
            }
          }, function(error){
            $timeout(function() {
              _setProduct(); // si en vez de click, presiona esc
            }, 0);
          }, function(defaultError){
          });

          $scope.formData.mProducto.CodigoModalidad = val.CodigoModalidad;
          loadUso($scope.formData.mProducto.CodigoModalidad, $scope.formData.mSubModelo.Tipo);
        }else{
          if(val.TipoProducto == constants.module.polizas.autos.responsabilidadCivil){
            $scope.formData.mcaNuevo = 'S';
          }else{
            $scope.formData.mcaNuevo = $scope.formData.mcaNuevoBkp;
          }

          $scope.formData.mProducto.CodigoModalidad = val.CodigoModalidad;
          loadUso($scope.formData.mProducto.CodigoModalidad, $scope.formData.mSubModelo.Tipo);
        }

        loadUso(val.CodigoModalidad, $scope.formData.mSubModelo.Tipo);

      }

      $scope.tieneVigencia(val);
      $scope.formData.isEmblem = val.TipoModalidad === 'EMBLEM';
      $scope.hiddenFields = $scope.formData.isEmblem ? [] : [personConstants.fields.CIVIL_STATUS];
    };

    $scope.loadTypeUse = function(){
      $scope.formData.mUsoRiesgo={};
      $scope.usoRiesgos = {};
    }

    // TipoUso

    if($scope.formData.mProducto!=null && $scope.formData.mSubModelo!=null){
      loadUso($scope.formData.mProducto.CodigoModalidad, $scope.formData.mSubModelo.Tipo);
    }

    function loadUso(codModalidad, tipoVehiculo){
      if($scope.formData.noLoad && ($scope.formData.mProducto.CodigoProducto == 5 || $scope.formData.mProducto.CodigoProducto == 20)){
        $scope.formData.mUsoRiesgo={};
        $scope.usoRiesgos = {};
      }
      else{
        if(codModalidad != null && tipoVehiculo != null){
          var vParams = '/' + codModalidad + '/' + tipoVehiculo;
          autosCotizarFactory.getTypesUse(vParams).then(function(response){
            if(response.OperationCode == constants.operationCode.success){
              $scope.usoRiesgos = response.Data;
              $scope.sinUsoRiesgo = ($scope.usoRiesgos.length === 0);
              if ($rootScope.dataFromInspec && !$scope.sinUsoRiesgo) {
                $scope.formData.mUsoRiesgo = _.find($scope.usoRiesgos, { 'Codigo': $rootScope.dataFromInspec.Vehiculo.CodigoUso });
              }
            }else if (response.Message.length > 0){
              $scope.sinUsoRiesgo=true;
            }
          })
          .catch(function(error){
            console.log('Error en getYearFabric: ' + error);
          });
        }
      }

      console.log('$scope.formData:', $scope.formData);

      var params = {
        codMarca: $scope.formData.ModeloMarca.codigoMarca,
        codModalidad: codModalidad,
        codModelo: $scope.formData.ModeloMarca.codigoModelo
      };
      validarExcepcion(params);
    }

    function validarExcepcion(vParams){
      autosCotizarFactory.validarExcepcion(vParams).then(function(response){
        if(response.OperationCode == constants.operationCode.success){
          if (Object.keys(response.Data).length > 0 && response.Data.excepcion){
			$scope.productoExceptionMessage = response.Message;
            $scope.productoValid = false;
            mModalAlert.showError(response.Message, "Error");
          }else{
			  $scope.productoValid = true;
		  }
        }
      })
      .catch(function(error){
        console.log('Error en validarExcepcion: ' + error);
      });
    }

      function setFormData(data) {
        $scope.formData.mTipoDocumento = data.documentType;
        $scope.formData.mNumeroDocumento = data.documentNumber;
        $scope.formData.mRazSocContratante = data.Nombre;
        $scope.formData.fechaNacimiento = data.FechaNacimiento;
        $scope.formData.mNomContratante = data.Nombre;
        $scope.formData.mApePatContratante = data.ApellidoPaterno;
        $scope.formData.mApeMatContratante = data.ApellidoMaterno;
        $scope.formData.Sexo = {
          Description: data.Sexo === '1' ? 'Masculino' : 'Femenino',
          Codigo: data.Sexo
        };
        $scope.formData.mEstadoCivil = data.civilState;
        $scope.formData.contractor = {};
        $scope.formData.contractor.TipoDocumento = data.documentType,
        $scope.formData.contractor.NumeroDocumento = data.documentNumber,
        $scope.formData.contractor.ActividadEconomica = data.ActividadEconomica;
        $scope.formData.contractor.ApellidoPaterno = data.ApellidoPaterno;
        $scope.formData.contractor.ApellidoMaterno = data.ApellidoMaterno;
        $scope.formData.contractor.Nombre = data.Nombre;
        $scope.formData.contractor.FechaNacimiento = data.FechaNacimiento;
        $scope.formData.contractor.Sexo = data.Sexo;
        $scope.formData.contractor.EstadoCivil = data.civilState;
      }

      $scope.guardarPaso2 = function(){
				$scope.$broadcast('submitForm', true);
        $scope.formData.validatedPaso2 = false;
        $scope.frmProductData.markAsPristine();
		
		if(!$scope.productoValid){
			mModalAlert.showError($scope.productoExceptionMessage, "Error");
		}

        if($scope.frmProductData.$valid && $scope.contractorValid && $scope.productoValid){
          $scope.frmProductData.validatedPaso2 =  true;
          $scope.formData.validatedPaso2 =  true;
          $scope.nextStep();
        }else{
          $scope.formData.validatedPaso2 =  false;
        }
      };

      $scope.nextStep = function(){
        if($scope.mPolizaGrupo!=null){
          if($scope.mPolizaGrupo.showGroupPolize){
            $scope.formData.nombrePolizaGrupo = $scope.formData.mPolizaGrupo;
            $scope.formData.codPolizaGrupo = $scope.formData.mPolizaGrupo.groupPolize;
            $scope.formData.conPolizaGrupo = true;
          }else{
            $scope.formData.conPolizaGrupo = false;
          }
        }else{
          $scope.formData.conPolizaGrupo = false;
        }

        $state.go('.',{
          step: 3
        });
    };

    $scope.isBancaSeg = function(){
        return (oimPrincipal.get_role() === 'BANSEG');
    };

    $scope.showVigencia = function(){
      if($scope.formData.mProducto){
        if($scope.formData.mProducto.TipoProducto === 'PLURIANUAL'){
          return false;
        }else{
          return (oimPrincipal.get_role() === 'BANSEG');
        }
      }

      $scope.updateDctoIntegralidad = function () {
        if ($scope.formData.documentNumber  && $scope.formData.DctoIntegralidad) {

            $scope.formData.PorDctoIntgPlaza = 0;
            $scope.formData.DctoIntegralidad = false;
        }
      }
    }

      function evalAgentViewDcto(){
        var params = {CodigoAgente: $scope.mAgente.codigoAgente}
        proxyGeneral.EsDescuentoIntegralidadParaAgentes(params, true)
        .then(function(response){
          $scope.formData.viewDcto = response.Data
        });
      }

      $scope.obtenerDctontegralidad = function() {
        $scope.formData.PorDctoIntgPlaza = 0;
        if ($scope.formData.DctoIntegralidad) {

          if ($scope.formData.mTipoDocumento.Codigo && $scope.formData.mNumeroDocumento) {

            autosCotizarFactory
              .obtenerDctontegralidad(
                constants.module.polizas.autos.companyCode,
                $scope.mAgente.codigoAgente,
                constants.module.polizas.autos.codeRamo,
                $scope.formData.mTipoDocumento.Codigo,
                $scope.formData.mNumeroDocumento
              )
              .then(function(response) {
                if (response.OperationCode === constants.operationCode.success) {
                  $scope.formData.PorDctoIntgPlaza = response.Data == "" ? 0 : response.Data;
                }
              })
              .catch(function(error) {
                console.log('Error en obtenerDctontegralidad: ' + error);
              });
          }
        }
      };
      
      $scope.tieneVigencia =  function(producto) {
        if (producto.McaVigencia === 'S') {
          $scope.formData.mVigenciaMeses = producto.VigenciaMeses;
        }
        $scope.formData.inicioVigencia = new Date();
      }

      $scope.validateVigencia = function(){
        $scope.limitDate = new Date(new Date().setMonth(new Date().getMonth()+$scope.formData.mVigenciaMeses));
        $scope.frmProductData.nInicioVigenciaPoliza.$setValidity('maxDate', $scope.formData.inicioVigencia < $scope.limitDate);
      }
      
      _self.listener = $scope.$watch('formData.inicioVigencia',function() {
        if ($scope.formData.inicioVigencia) {
          $scope.formData.finVigencia = mainServices.date.fnAdd($scope.formData.inicioVigencia, $scope.formData.mVigenciaMeses , 'M');
          $scope.limitDate = $scope.formData.finVigencia;
        }
      });

      function getTransmissionTypeList(){
        proxyGeneral.GetListTipoTransmision($scope.companyCode, true)
          .then(function(response){
            $scope.transmissionTypeList = response.Data
          })
          .catch(function (err) {
            console.error(err);
          })
      };

      function getUserScore(params) {
        mpfPersonFactory.getEquifaxData(params)
          .then(function(response){
            $scope.formData.score = response.Data.ScoreMorosidad;
          })
          .catch(function (err) {
            console.error(err);
          })
      };
    }]);
});
