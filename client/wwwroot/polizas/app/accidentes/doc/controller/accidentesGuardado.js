define([
  'angular', 'constants',
  '/polizas/app/accidentes/doc/service/accidentesGuardadoFactory.js',
  'modalSendEmail',
  '/polizas/app/accidentes/quote/service/accidentesFactory.js',
  '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js',
], function(angular, constants){

  var appAccidentes = angular.module('appAccidentes');

  appAccidentes.controller('accidenteGetDocController', ['$scope', 'mpSpin', 'accidentesGuardadoFactory', 'mModalAlert', '$uibModal', 'accidentesFactory', '$state', '$sce', '$window', '$timeout', '$stateParams', 'mainServices','proxyReferido','oimPrincipal',  
    function($scope, mpSpin, accidentesGuardadoFactory, mModalAlert, $uibModal, accidentesFactory, $state, $sce, $window, $timeout, $stateParams, mainServices,proxyReferido,oimPrincipal){

    var key = 'documentosCotizacion';
    $scope.currencyType = constants.currencyType.dollar;    

    (function onLoad(){
    //cargamos datos del usuario logueado
    console.log($stateParams.quotation);

    $scope.PrimaNetaIndividual = 0;
    $scope.PrimaNeta = 0;
    $scope.PrimaTotal = 0;
    $scope.riesgos = [];
    $scope.formData = {};
    $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido
    
      mpSpin.start(); 
      accidentesGuardadoFactory.getClaims().then(function(response){
          $scope.dataClaims = response;
          if ($scope.dataClaims.length>0){    
            $scope.codAgente = $scope.dataClaims[7].value;//$scope.dataClaims.codagent;//'818'; //R: Se obtien cuando inicia sesion                         
            $scope.codigoUsuario = $scope.dataClaims[2].value.toUpperCase();
            $scope.nombreAgente = $scope.dataClaims[6].value.toUpperCase();
          }
          accidentesGuardadoFactory.getGestorOficina($scope.codAgente).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              var dataGestor = response.Data;
              if (dataGestor.length>0){    
                $scope.CodigoGestor = dataGestor.codigoGestor;
                $scope.CodigoOficina = dataGestor.codigoOficina;
              }          
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

      $scope.pdfURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/reporte/accidente/cotizacion');
      
      $scope.userRoot = false;
      if ((oimPrincipal.isAdmin()) && $scope.nombreAgente != ''){
        $scope.userRoot = true;
      }
      
      if($stateParams.quotation){
        $scope.nroCoti = $stateParams.quotation;
        buscarDocumento();
      }
     
    })();

    /*#######################################
    # Si venimos de la pagina de cotizacion
    #######################################*/

    // if((accidentesGuardadoFactory.getVariableSession(key).length>0) || (typeof(accidentesGuardadoFactory.getVariableSession(key)) != 'undefined')){
    //   $scope.nroCoti = accidentesGuardadoFactory.getVariableSession(key);
    //   console.log($scope.nroCoti);
    //   $timeout(function(){ 
    //     buscarDocumento();
    //    }, 2000);    
    // }

          //$scope.nroCoti = 185606;
      //buscarDocumento();

    // $scope.nroCoti = 185336;//doc de accidentes
    // $scope.NumeroPoliza = 3021600002681;//3021600002683
    // buscarDocumento();

    function mostrarEncuesta(){
      $scope.encuesta.tipo = 'C';
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
    
    function buscarDocumento(){
      if($scope.nroCoti!=null && $scope.nroCoti>0){

        mpSpin.start();   
        //console.log($scope.nroCoti);
        accidentesGuardadoFactory.buscarDocumento($scope.nroCoti).then(function(response){
          if(response.OperationCode == constants.operationCode.success){
            // mpSpin.end();
            if($scope.nroCoti==null){}else{
             // console.log(response.Data);
              $scope.NumeroDocumento = response.Data.NumeroSecuencia;
              $scope.codAgente = response.Data.CodigoAgente;
             // console.log($scope.NumeroDocumento);

              $scope.codigoUsuario = response.Data.CodigoUsuario;


              $scope.cotizacionGuardada = response.Data;
              $scope.NumeroPoliza = $scope.cotizacionGuardada.NumeroPoliza;
              //console.log($scope.NumeroPoliza);
              //$scope.PrimaNeta = response.Data.PrimaNeta;


              $scope.tipoDocumento = response.Data.Contratante.TipoDocumento;
              $scope.nroDocumento = response.Data.Contratante.CodigoDocumento;

              $scope.vShowNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.tipoDocumento, $scope.nroDocumento);

              $scope.nombre = response.Data.Contratante.Nombre;
              $scope.apellidoPaterno = response.Data.Contratante.ApellidoPaterno;
              $scope.apellidoMaterno = response.Data.Contratante.ApellidoMaterno;
              _validateReferredNumber(true)
              $scope.listarRiesgos();
            }
          }else if (response.Message.length > 0){
            mpSpin.end();
          }        
          delete accidentesGuardadoFactory.eliminarVariableSession(key);
        }, function(error){
          mpSpin.end();
          console.log('Error en buscarDocumento: ' + error);
          delete accidentesGuardadoFactory.eliminarVariableSession(key);
        });

      }

      if($scope.cotizacionGuardada==null){
        //mModalAlert.showWarning("No se puede mostrar la cotización", "Consultar cotización");
      }
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
            $scope.PrimaNeta += newRiesgo.primaNetaTotal;
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

      $scope.pdfData = {
        CodigoCotizacion : $scope.nroCoti,
        CodigoCotizacionRiesgos : $scope.NumeroDocumento,
        Usuario : $scope.codigoUsuario,
        NombreAgente : $scope.nombreAgente,
        NombreContratante : $scope.nombre,
        ApellidoContratante : $scope.apellidoPaterno,
        PrimaNetaIndividual : $scope.PrimaNetaIndividual,
        PrimaNeta : $scope.PrimaNeta,
        PrimaTotal : $scope.PrimaTotal
      };
     // accidentesGuardadoFactory.getQuotePDF(reporte);  

    // console.log($scope.pdfData);

      $window.setTimeout(function(){
        document.getElementById('frmDownloadPDF').submit();
      });         
    };

    /*#######################################
    # SEND EMAIL
    #######################################*/
    $scope.sendEmail = function(){
      $scope.emailData ={      
        emisor: '',
        nombreEmisor: '',
        reporteParamAccidente : {
          CodigoCotizacion : $scope.nroCoti,
          CodigoCotizacionRiesgos : $scope.NumeroDocumento,
          Usuario : $scope.codigoUsuario,
          NombreAgente : $scope.nombreAgente,
          NombreContratante : $scope.nombre,
          ApellidoContratante : $scope.apellidoPaterno,
          PrimaNetaIndividual : $scope.PrimaNetaIndividual,
          PrimaNeta : $scope.PrimaNeta,
          PrimaTotal : $scope.PrimaTotal
        },
        asunto: '',
        receptor: '',
        mensaje: ''       
      };

      //Modal
      $scope.optionSendEmail = constants.modalSendEmail.accidentesQuote.action;
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
      if($scope.formData.numReferido){
        _validateReferredNumber(false);
        
        setTimeout(function() {
        if($scope.numReferidoIsValid){
          var profileObject = JSON.parse(window.localStorage.getItem("profile"))
          profileObject.numeroReferido = $scope.formData.numReferido;
          window.localStorage.setItem("profile", JSON.stringify(profileObject));
          
          _irAEmitir();
          }
        }, 1000);
      }
      else{
        _irAEmitir();
      }
    };

    function _irAEmitir() {
      $state.go('accidentesEmit.steps', {quotationNumber:$scope.nroCoti, step: 1});   
    }

    
    function _validateReferredNumber(onLoad) {
      if($scope.formData.numReferido){
        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.codAgente,$scope.userRoot, true)              
        .then(function(response){
            if (response.data == "F1" || response.data == "F2" || response.data == "F3"){
              if(!onLoad){mModalAlert.showWarning(response.mensaje, '')}
              $scope.numReferidoIsValid = false;
              $scope.formData.msjReferidoValidate = response.mensaje;
            }
            else{
              $scope.numReferidoIsValid = true;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
    }


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
