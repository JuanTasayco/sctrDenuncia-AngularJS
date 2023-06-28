(function($root, deps, action){
  define(deps, action)
})(this, ['angular', 'constants', 'helper',
'/polizas/app/accidentes/quote/service/accidentesFactory.js',
'/scripts/mpf-main-controls/components/modalSteps/component/modalSteps.js',
'polizasFactory'],
function(angular, constants, helper){
  var appAutos = angular.module('appAutos');

  accidentesEmitS2Controller.$inject = ['$scope', '$window', '$state', '$timeout', '$rootScope', 'mModalAlert', 'fileAccidentesUpload', 'mpSpin', 'accidentesFactory', '$uibModal', 'oimPrincipal', 'oimClaims', 'mainServices', 'polizasFactory', 'proxyGeneral'];

  function accidentesEmitS2Controller($scope, $window, $state, $timeout, $rootScope, mModalAlert, fileAccidentesUpload, mpSpin, accidentesFactory, $uibModal, oimPrincipal, oimClaims, mainServices, polizasFactory, proxyGeneral) {
    (function onLoad() {
      $scope.formData = $rootScope.formData || {};

      $scope.formData.urlPlanilla = constants.system.api.endpoints.policy + 'api/file/accidente/template';

      if(!$scope.formData.validatedPaso1){
        $state.go('.',{
          step: 1
        });
      }
    })();

    getEncuesta();

    $scope.$watch('formData', function(nv)
    {
      $rootScope.formData =  nv;
    })

    $scope.showModalConfirmation = function(){
      $scope.validationForm();
      $scope.validateFiles();

      if($scope.formData.validatedPaso2 && $scope.formData.allFiles){
          $scope.dataConfirmation = {
            save:false,
            title: '¿Estás seguro que desea emitir la emisión?',
            subTitle: 'Recuerda que una vez emitida la cotización no podrás hacer cambios',
            lblClose: 'Seguir editando',
            lblSave: 'Emitir'
          };
          var vModalSteps = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template : '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
            controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]
          });
          vModalSteps.result.then(function(){
            $scope.$watch('dataConfirmation', function(value){
              if (value.save) {
                $scope.irAEmitir();
              }
            });
          },function(){
          });
        }else{
          mModalAlert.showError('Debe subir primero la(s) planilla(s)', "¡Error!")
        }
    }

    $scope.dt = new Date();

    $scope.formData.today = formatearFecha($scope.dt);

    function getEncuesta(){
      var codCia = constants.module.polizas.accidentes.companyCode;
      var codeRamo = constants.module.polizas.accidentes.codeRamo;

      proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
        if(response.OperationCode == constants.operationCode.success){
          
          if (Object.keys(response.Data.Pregunta).length > 0){
            $scope.encuesta = response.Data;
          }else{
            $scope.encuesta = {};
            $scope.encuesta.mostrar = 0;

            //Para probar nomas
            /*$scope.encuesta.mostrar = 1;
            $scope.encuesta.Pregunta = {
              preguntaId: 1,
              nombre: "Pregunta de prueba"
            };*/
          }
        }
      }, function(error){
        console.log('Error en getGestor: ' + error);
      })
    }

    function formatearFecha(fecha) {
      if (fecha != null) {
        var fechaC = fecha;
        var dd = fechaC.getDate();
        var mm = fechaC.getMonth() + 1; // January is 0!

        if (dd === 32) {
          dd = 1;
          mm = today.getMonth() + 2;
        }

        var yyyy = fechaC.getFullYear();
        var yyyy2 = yyyy + 1;
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        $scope.formData.mConsultaHasta = dd + '/' + mm + '/' + yyyy2;
        $scope.formData.mConsultaDesdeF = dd + '/' + mm + '/' + yyyy;
        $scope.formData.desde = fechaC;
        return fechaC = dd + '/' + mm + '/' + yyyy;
      }
    }

    $scope.irAEmitir = function() {
      $scope.formData.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.dataContractor.mTipoDocumento.Codigo,  $scope.formData.dataContractor.mNumeroDocumento);

      if(typeof $scope.formData.dataContractor.saldoMapfreDolares != 'undefined'){
        $scope.formData.saldoMDolar = $scope.formData.dataContractor.saldoMapfreDolares
      }
      if(typeof $scope.formData.dataContractor2.SaldoMapfreDolar != 'undefined'){
        $scope.formData.saldoMDolar = $scope.formData.dataContractor2.SaldoMapfreDolar;
      }
      if(typeof $scope.formData.saldoMDolar == 'undefined'){
        $scope.formData.saldoMDolar = 0;
      }

      if ($scope.formData.contractorAddress.ubigeoData.mDepartamento.Descripcion === 'LIMA') {
        $scope.formData.MCALima = 'S';
      } else {
        $scope.formData.MCALima = 'N';
      }

      if ($scope.formData.dataContractor.mTipoDocumento.Codigo === 'RUC') {
        var vIniRuc = ($scope.formData.dataContractor.mNumeroDocumento.indexOf(10) == 0);
        if (vIniRuc && $scope.formData.dataContractor.mNumeroDocumento.length === 11) {
          $scope.formData.MCAPersonaRUC = 'S';
        } else {
          $scope.formData.MCAPersonaRUC = 'N';
        }
      } else {
        $scope.formData.MCAPersonaRUC = 'N';
      }
      
      var paramsEmision = {
        Documento: {
          NumeroDocumento: 0,
          NumeroAnterior: $scope.formData.quotationNumber,
          CodigoUsuario: ($scope.formData.codigoUsuario).toUpperCase(),
          CodigoUsuarioRED: 'Usuario',//$scope.formData.codigoUsuario,
          FechaRegistro: $scope.formData.today,// al hacer click en emitir
          CodigoProducto: 49,
          MontoPrima: $scope.formData.PrimaNeta, //prima sin igv
          FlagDocumento: '',
          CodigoEstado: 1,
          CodigoProceso: 2,
          CodigoMoneda: $scope.formData.codigoMoneda,
          McaAsegNuevo: $scope.formData.McaAsegNuevo,//'', // Si existe el contratante va S, sino N
          CodigoAgente: $scope.formData.codigoAgente,//(typeof $scope.formData.codigoAgente == 'undefined') ? oimClaims.agentID : $scope.formData.codigoAgente, // Codigo agente obligatorio para emision
          Ubigeo: {
            CodigoDepartamento: '', // $scope.formData.contractorAddress.ubigeoData.mDepartamento.Codigo,
            CodigoProvincia: '', //$scope.formData.contractorAddress.ubigeoData.mProvincia.Codigo,
            CodigoDistrito: '' //$scope.formData.contractorAddress.ubigeoData.mDistrito.Codigo
          }
        },
        CodigoCompania:1, //es fijo
        CodigoTipoEntidad:1,//es fijo
        AseguradoAccidente:{
          NumeroEmision: $scope.formData.quotationNumber,
          NumeroRiesgo: $scope.formData.riesgosLength.length//$scope.formData.riesgos.length
        },
        MCALima: $scope.formData.MCALima,//'S', // si es departamento lima
        TipoEmision: 6, //es fijo
        MCAPersonaRUC: $scope.formData.MCAPersonaRUC,//'N', //si empieza con 10
        Poliza:{
          CodigoFinanciamiento: 10001,
          InicioVigencia: $scope.formData.inicioVigencia, //revisar //'19/01/2017',
          FinVigencia: $scope.formData.finVigencia //'09/05/2017',//
        },
        Vehiculo: {
          ProductoVehiculo: {
            CodigoProceso: 1,
            CodigoObjeto: 102,
            CodigoCompania: 1,
            CodigoModalidad: 1010,
            CodigoRamo: 101,
            CodigoProducto: 49,
            CodigoPlan: 0,
            CodigoMoneda: $scope.formData.codigoMoneda,
            NombreModalidad:'',
            NombreRamo: '',
            NombreProducto: 'COTIZADOR DE ACCIDENTES',
            NombreCompania: '',
            NombreObjeto: '',
            TipoSuplemento: '',
            InicioVigencia: $scope.formData.inicioVigencia, //'19/01/2017',
            CondicionesEspeciales: '',
            Indicador: 0,
            CodigoFamProducto: 0
          }
        },
        Contratante: {
          ActividadEconomica: {
            Codigo: ($scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mActividadEconomica.Codigo : 0, //0
          },
          Profesion:{
            Codigo: ($scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.formData.dataContractor.mProfesion.Codigo
          },
          Ubigeo: {
            NombreDistrito: $scope.formData.contractorAddress.ubigeoData.mDistrito.Descripcion,
            CodigoDistrito: $scope.formData.contractorAddress.ubigeoData.mDistrito.Codigo,
            NombreDepartamento: $scope.formData.contractorAddress.ubigeoData.mDepartamento.Descripcion,
            NombreProvincia: $scope.formData.contractorAddress.ubigeoData.mProvincia.Descripcion,
            CodigoDepartamento: $scope.formData.contractorAddress.ubigeoData.mDepartamento.Codigo,
            CodigoProvincia: $scope.formData.contractorAddress.ubigeoData.mProvincia.Codigo,
            CodigoVia: $scope.formData.contractorAddress.mTipoVia.Codigo,
            NombreVia: $scope.formData.contractorAddress.mTipoVia.Descripcion,
            CodigoNumero: $scope.formData.contractorAddress.mTipoNumero.Codigo,
            TextoNumero: $scope.formData.contractorAddress.mNumeroDireccion,
            CodigoInterior: $scope.formData.contractorAddress.mTipoInterior.Codigo,
            TextoInterior: $scope.formData.contractorAddress.mNumeroInterior,
            CodigoZona: $scope.formData.contractorAddress.mTipoZona.Codigo,
            TextoZona: $scope.formData.contractorAddress.mNombreZona,
            Referencia: $scope.formData.contractorAddress.mDirReferencias
          },
          FechaNacimiento: ($scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.formData.dataContractor.mDay.description + '/' + $scope.formData.dataContractor.mMonth.description + '/' + $scope.formData.dataContractor.mYear.description,
          Telefono: $scope.formData.dataContractor.mTelefonoFijo,
          Direccion: $scope.formData.contractorAddress.mNombreVia,
          CorreoElectronico: $scope.formData.dataContractor.mCorreoElectronico,
          Telefono2: $scope.formData.dataContractor.mTelefonoCelular,
          MCAFisico: constants.module.polizas.soat.MCAFisico,//es fijo
          Nombre: ($scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? $scope.formData.dataContractor.mRazonSocial : $scope.formData.dataContractor.mNomContratante,
          ApellidoPaterno: ((typeof $scope.formData.dataContractor.mApePatContratante == 'undefined') || !$scope.formData.showNaturalRucPerson) ? '' : $scope.formData.dataContractor.mApePatContratante,
          ApellidoMaterno: ((typeof $scope.formData.dataContractor.mApeMatContratante == 'undefined') || !$scope.formData.showNaturalRucPerson) ? '' : $scope.formData.dataContractor.mApeMatContratante,
          TipoDocumento : $scope.formData.dataContractor.mTipoDocumento.Codigo,
          CodigoDocumento : $scope.formData.dataContractor.mNumeroDocumento,//no sale
          ImporteMapfreDolar: $scope.formData.saldoMDolar,//$scope.formData.mMapfreDolares, //saldo
          ImporteAplicarMapfreDolar: $scope.formData.mMapfreDolares, //importe aplicar
          Sexo: ($scope.formData.dataContractor.mTipoDocumento.Codigo == constants.documentTypes.ruc.Codigo) ? '' : $scope.formData.dataContractor.mSexo,
          MCAMapfreDolar: $scope.formData.MCAMapfreDolar,
          SegmentoComercial: ''
        }
      };
      
      if($scope.formData.codigoAgente != '0'){
        mpSpin.start();

        paramsEmision = polizasFactory.setReferidoNumber(paramsEmision)

        accidentesFactory.emitirAccidente(paramsEmision).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
              $scope.dataPrima = response.Data;

              // GUARDAR ENCUESTA
              if($scope.encuesta.mostrar == 1){
                $scope.encuesta.numOperacion = $scope.dataPrima.NumeroPoliza;
                $state.go('accidentesEmitted', {quotationNumber:$scope.dataPrima.NumeroCotizacion, encuesta: $scope.encuesta});
                mpSpin.end();
              }else{
                $state.go('accidentesEmitted', {quotationNumber:$scope.dataPrima.NumeroCotizacion});
                mpSpin.end();
              }

          }else if (response.OperationCode == constants.operationCode.code900) {
            mpSpin.end();
            mModalAlert.showError(response.Message, "¡Error!");
          } else {
            mpSpin.end();
            mModalAlert.showError(response.Message, "¡Error!");
          }
        });
      }else{
        mModalAlert.showError("No tiene un agente seleccionado", "Error");
      }

    }

    /**
     * Adjuntos
     */
    $scope.uploadPlantilla = function(filename, nroRiesgo) {
      var file = null;

      if (typeof filename == 'undefined') {
        mModalAlert.showError("Debe subir una planilla", "¡Error!")
      } else {
        var paramsFile = {
          numeroSolicitud: $scope.formData.quotationNumber,
          numeroRiesgo: nroRiesgo,
          numeroDocumento: $scope.formData.dataContractor.mNumeroDocumento, //0
          codigoUsuario: oimPrincipal.getUsername()
        };
        // formData.fileRiesgo[0].name = nombre del archivo cargado
        var promise = fileAccidentesUpload.uploadAccidentesFileToUrl(filename[0], paramsFile);
        promise.then(function(response) {
          console.log(nroRiesgo);
          if (response.OperationCode === constants.operationCode.success) {
            if(response.Data.Success){
              $scope.formData.fileRiesgo[nroRiesgo-1] = {name: filename[0].name, cargado: true};
              $scope.formData.cargados = true;
            }else{
              $scope.formData.fileRiesgo[nroRiesgo-1] = {name: filename[0].name, cargado: false};
              mModalAlert.showError(response.Message, "¡Error!")
            }
          }else{
            $scope.formData.fileRiesgo[nroRiesgo-1] = {name: filename[0].name, cargado: false};
            mModalAlert.showError(response.Message, "¡Error!")
          }
        }, function() {
          $scope.serverResponse = 'Error en la carga del archivo';
        });
      }
    };

    $scope.cargarOtraVez = function cargarOtraVez(idx) {
      if ($scope.formData.fileRiesgo[idx] && $scope.formData.fileRiesgo[idx].cargado) {
        $scope.formData.fileRiesgo[idx].cargado = false;
      }
    };

    $scope.validateFiles = function() {
      for (var i = 0; i < $scope.formData.fileRiesgo.length; i++) {
        if ($scope.formData.fileRiesgo[i].cargado == false) {
          $scope.formData.allFiles = false;
          break;
        } else {
          $scope.formData.allFiles = true;
        }
      }
    }

    /*
     * Plantilla
     */
    $scope.$watch('formData.riesgos', function(nv) {
      // $scope.uploadPlantilla();
    })

    $scope.validationForm = function() {
      $scope.formData.validatedPaso2 =  true;
    }
  }

  appAutos.controller('accidentesEmitS2Controller', accidentesEmitS2Controller);
});
