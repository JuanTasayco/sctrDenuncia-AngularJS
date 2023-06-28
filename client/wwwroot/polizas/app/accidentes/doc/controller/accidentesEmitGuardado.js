define([
  'angular', 'constants',
  '/polizas/app/accidentes/doc/service/accidentesGuardadoFactory.js',
  'modalSendEmail',
  '/polizas/app/accidentes/quote/service/accidentesFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js',
], function(angular, constants){

  var appAccidentes = angular.module('appAccidentes');

  appAccidentes.controller('accidentesEmittedController', ['$scope', 'mpSpin', 'accidentesGuardadoFactory', 'mModalAlert', '$uibModal', 'accidentesFactory', '$state', '$stateParams', 'mainServices', 
    function($scope, mpSpin, accidentesGuardadoFactory, mModalAlert, $uibModal, accidentesFactory, $state, $stateParams, mainServices){

console.log('accidentesEmittedController');
    var key = 'documentosCotizacion';
    $scope.currencyType = constants.currencyType.dollar;    

    (function onLoad(){
    //cargamos datos del usuario logueado

    $scope.PrimaNetaIndividual = 0;
    $scope.PrimaNeta = 0;
    $scope.PrimaTotal = 0;
    $scope.riesgos = [];

    $scope.nroCoti =  $stateParams.quotationNumber;

      mpSpin.start(); 
      accidentesGuardadoFactory.getClaims().then(function(response){
          $scope.dataClaims = response;
          if ($scope.dataClaims.length>0){    
            $scope.codAgente = $scope.dataClaims[7].value;//$scope.dataClaims.codagent;//'818'; //R: Se obtien cuando inicia sesion                         
            $scope.codigoUsuario = $scope.dataClaims[2].value.toUpperCase();
          }
          accidentesGuardadoFactory.getGestorOficina($scope.codAgente).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              var dataGestor = response.Data;
              if (dataGestor.length>0){    
                $scope.CodigoGestor = dataGestor.codigoGestor;
                $scope.CodigoOficina = dataGestor.codigoOficina;
              }   
              buscarDocumento();
       
            }else{             
            }
             mpSpin.end(); 

            //ver si se muestra la encuesta o no
            console.log("encuesta", $stateParams.encuesta);
            if($stateParams.encuesta){
              if($stateParams.encuesta.mostrar == 1){
                $scope.encuesta = $stateParams.encuesta;
                mostrarEncuesta();
              }
            }
          });       
      });

    })();

  
          //$scope.nroCoti = 185606;
      //buscarDocumento();

    // $scope.nroCoti = 185336;//doc de accidentes
    // $scope.NumeroPoliza = 3021600002681;//3021600002683
    // buscarDocumento();
    function buscarDocumento(){
      if($scope.nroCoti!=null && $scope.nroCoti>0){

        mpSpin.start();   
        console.log($scope.nroCoti);
        accidentesGuardadoFactory.buscarDocumento($scope.nroCoti).then(function(response){
          if(response.OperationCode == constants.operationCode.success){
             mpSpin.end();
            if($scope.nroCoti==null){}else{
              console.log(response.Data);

              $scope.NumeroDocumento = response.Data.NumeroSecuencia;
              $scope.codigoUsuario = response.Data.CodigoUsuario;


              $scope.emisionGuardada = response.Data;


              if($scope.emisionGuardada.Contratante.Sexo == 'M'){
                $scope.sexo = 'Femenino';
              }else if($scope.emisionGuardada.Contratante.Sexo == 'H'){
                $scope.sexo = 'Masculino';
              }

              $scope.NumeroPoliza = $scope.emisionGuardada.NumeroPoliza;
              //console.log($scope.NumeroPoliza);
              $scope.PrimaNeta = response.Data.PrimaNetaPeriodoTotalAsegurados;


              $scope.tipoDocumento = response.Data.Contratante.TipoDocumento;
              $scope.nroDocumento = response.Data.Contratante.CodigoDocumento;

              $scope.vShowNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.tipoDocumento, $scope.nroDocumento);

              $scope.nombre = response.Data.Contratante.Nombre;
              $scope.apellidoPaterno = response.Data.Contratante.ApellidoPaterno;
              $scope.apellidoMaterno = response.Data.Contratante.ApellidoMaterno;

              $scope.listarRiesgos();
            }
          }else if (response.Message.length > 0){
            mpSpin.end();
          }        
        }, function(error){
          mpSpin.end();
          console.log('Error en buscarDocumento: ' + error);
        });

      }

      if($scope.emisionGuardada==null){
        //mModalAlert.showWarning("No se puede mostrar la cotización", "Consultar cotización");
      }
    }

    function mostrarEncuesta(){
      $scope.encuesta.tipo = 'P';
      $scope.encuesta.CodigoCompania = constants.module.polizas.accidentes.companyCode;
      $scope.encuesta.CodigoRamo = constants.module.polizas.accidentes.codeRamo;
      $scope.dataConfirmation = {
        save:false,
        valor: 0,
        encuesta: $scope.encuesta
      };
      var vModalConfirmation = $uibModal.open({
        backdrop: 'static', // background de fondo
        keyboard: false,
        scope: $scope,
        // size: 'lg',
        template : '<mpf-modal-assessment data="dataConfirmation" close="close()"></mpf-modal-assessment>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalConfirmation.result.then(function(){
      },function(){
      });
    }

    $scope.listarRiesgos = function(){
      var num = 0; 
      $scope.riesgos = [];
      accidentesFactory.ListarRiesgoAccidente($scope.NumeroDocumento, true).then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          $scope.riesgosListados = response.Data;
      
          for(var i=0; i<$scope.riesgosListados.length; i++){
             var newRiesgo = {
              nroRiesgo: num+1,
              actividad: $scope.riesgosListados[i].NombreOcupacion,
              numeroAseg:$scope.riesgosListados[i].NumeroAsegurados,
              primaNetaAseg: $scope.riesgosListados[i].PrimaNetaIndividual,
              primaNetaTotal: $scope.riesgosListados[i].PrimaNeta,
              primaTotal: $scope.riesgosListados[i].PrimaTotal
            };
            $scope.PrimaNetaIndividual += newRiesgo.primaNetaAseg;
            //$scope.PrimaNeta += newRiesgo.primaNetaTotal;
            $scope.PrimaTotal += newRiesgo.primaTotal;

            num++;
            $scope.riesgos.push(newRiesgo);
          }
          console.log($scope.riesgos);
        
        }else{
          mModalAlert.showWarning(response.Message, "¡Verifique los montos ingresados!");
          $scope.riesgoValidated = false;
        }
      });
    }

    $scope.reporteCotizacion = function () {
     accidentesGuardadoFactory.getPDF($scope.NumeroPoliza);           
    };

    /*#######################################
    # SEND EMAIL
    #######################################*/
    $scope.sendEmail = function(){
      $scope.emailData ={
        // emisor: '', 
        // nombreEmisor : '',
        // reporteParam : {            
        //   codCompania : constants.module.polizas.autos.companyCode,
        //   codDocumento : $scope.nroCoti, 
        //   sumaAsegurada : $scope.emisionGuardada.sumaAsegurada,
        //   nomDepartamento : $scope.emisionGuardada.Ubigeo.NombreDepartamento,
        //   nomProvincia : $scope.emisionGuardada.Ubigeo.NombreProvincia,
        //   nomDistrito : $scope.emisionGuardada.Ubigeo.NombreDistrito,
        //   numeroPolizaGrupo : $scope.emisionGuardada.PolizaGrupo,
        //   cotizacion : {
        //     Contratante : {//datos del contratante los sacare del servicio OIM-142
        //       TipoDocumento : "",
        //       CodigoDocumento : "", //Nro de documento de la cotizacion
        //       ImporteMapfreDolar : 0//parseFloat($scope.emisionGuardada.Contratante.ImporteMapfreDolar).toFixed(2)
        //     },
        //     Agente : {
        //       CodigoOficina : $scope.CodigoOficina, //OIM-229
        //       CodigoAgente : $scope.emisionGuardada.CodigoAgente,
        //       CodigoGestor : $scope.CodigoGestor //oim-229
        //     },
        //     Poliza : {
        //       TipoDocumento : "", //consultar a que se refiere con tipo de documento
        //       CodigoDocumento : "", //Nro de documento de la cotizacion
        //       CodigoAgente : $scope.emisionGuardada.CodigoAgente,
        //       CodigoGestor : $scope.CodigoGestor, //oim-229
        //       PolizaGrupo : $scope.emisionGuardada.PolizaGrupo,
        //       Modalidad : {
        //         Codigo : "0"
        //       }
        //     },
        //     Vehiculo : {
        //       CodigoCompania : constants.module.polizas.autos.companyCode,
        //       SumaAsegurada: $scope.emisionGuardada.Vehiculo.ValorComercial,
        //       AnioFabricacion : $scope.emisionGuardada.Vehiculo.AnioFabricacion,
        //       CodigoTipo : $scope.emisionGuardada.Vehiculo.CodigoTipoVehiculo,
        //       CodigoUso : $scope.emisionGuardada.Vehiculo.CodigoUso,
        //       CodigoCategoria : $scope.emisionGuardada.Vehiculo.CodigoCategoria, 
        //       PrimaVehicular : $scope.PrimaNeta,
        //       MCAGPS : $scope.emisionGuardada.Vehiculo.MCAGPS,
        //       NombreSubModelo : $scope.emisionGuardada.Vehiculo.NombreSubModelo,
        //       DerechoEmision : '',
        //       ProductoVehiculo : {
        //         CodigoCompania : $scope.emisionGuardada.CodigoCia,
        //         CodigoMoneda : $scope.emisionGuardada.CodigoMoneda,
        //         CodigoRamo : constants.module.polizas.accidentes.codeRamo
        //       }
        //     }
        //   }
        // }
      };

      //Modal
      $scope.optionSendEmail = constants.modalSendEmail.autosemisionGuardada;
      var vModalSendEmail = $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        // size: 'lg',
        template : '<mpf-modal-send-email action="optionSendEmail" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalSendEmail.result.then(function(){
        //Action after CloseButton Modal
        // console.log('closeButton');
      },function(){
        //Action after CancelButton Modal
        // console.log("CancelButton");
      });
      //
    }

    /*#######################################
    # IR A EMITIR
    #######################################*/
    $scope.irAEmitir = function(){
   
        $state.go('accidentesEmit.steps', {quotationNumber:$scope.nroCoti});   
         
    };


  }]);

  appAccidentes.filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
  });

  appAccidentes.filter('isEmpty', function () {
    var bar;
    return function (obj) {
      for (bar in obj) {
        if (obj.hasOwnProperty(bar)) {
          return false;
        }
      }
      return true;
    };
  });

});
