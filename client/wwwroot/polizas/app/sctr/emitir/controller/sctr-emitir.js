define([
  'angular', 'constants',
  '/polizas/app/sctr/emitir/service/sctrEmitFactory.js'
], function(angular, constants){

		var appAutos = angular.module('appAutos');

		appAutos.controller('sctrEmitirController',
			['$scope','oimPrincipal', '$window', '$state', '$stateParams', '$timeout', '$rootScope', 'oimClaims', 'sctrEmitFactory', 'proxyAgente', 'proxySctr', 'proxyReferido','mModalAlert',
      'mModalConfirm',
			function($scope, oimPrincipal, $window, $state, $stateParams, $timeout, $rootScope, oimClaims, sctrEmitFactory, proxyAgente, proxySctr,proxyReferido,mModalAlert,mModalConfirm){

      (function onLoad(){

        $scope.disableSgt = false;

        proxySctr.ValidarAgente().then(function(response){     
          if(response.Data && response.Data.Bloqueado == 1){          
            $state.go('sctrHome');        
          }
          else{
  
            $scope.formData = $scope.formData || {};
            $scope.formData.agenteBloqueado = false;
            if (oimClaims){
              $scope.formData.claims = {
                codigoUsuario:  oimClaims.loginUserName,//claims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
                rolUsuario:     oimClaims.roleCode,// claims[12].value, //'ADMIN'
                nombreAgente:   oimClaims.agentName,//claims[6].value.toUpperCase(),
                codigoAgente:   oimClaims.agentID,//claims[7].value, //Ejm: 9808 //agendid en el claim
                nombre:         oimClaims.userName
                
              }
              $scope.formData.isBroker = oimClaims.userSubType == 3 && oimClaims.userType==3
              $scope.userSubType = oimClaims.userSubType;
              $scope.userType = oimClaims.userType //claims[3].value
              $scope.userRoot = false;
              //$scope.officeName =  oimClaims.officeName;
              $scope.agentName =  oimClaims.agentName;
              
              $scope.formData.mAgente = {
                codigoAgente: $scope.formData.claims.codigoAgente,
                codigoNombre: $scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente,
                importeAplicarMapfreDolar:0,
                mcamapfreDolar:"",
                codigoEstadoCivil:0,
                codigoUsuario: $scope.formData.claims.codigoUsuario,
                rolUsuario: $scope.formData.claims.rolUsuario,
                nombre: $scope.formData.claims.nombre
              };

              proxyAgente.GetRegionOficina(2, $scope.formData.claims.codigoAgente, false).then(function(response){              
                if(response.Data && response.Data.NombreOficina){          
                  $scope.officeName = response.Data.NombreOficina; 
                  $scope.regionName = response.Data.NombreRegion;        
                }
              }, function(response){
                //defer.reject(response);
              });

              $rootScope.mAgente = $scope.formData.mAgente;
              
            }

            function setRole(){
              if (angular.isArray($state.current.submenu)){
                $scope.formData.onlyRole = $state.current.submenu.length == 1
                $scope.roles = [];
                angular.forEach($state.current.submenu, function(submenu){
                  $scope.roles.push({
                    descripcion: submenu.nombreLargo,
                    codigo: helper.searchQuery('ROL', submenu.ruta)
                  });
                });

                if($scope.roles[0].codigo == null){
                  $scope.roles = [];
                  angular.forEach($state.current.submenu, function(submenu){
                    $scope.roles.push({
                      descripcion: submenu.nombreLargo,
                      codigo: helper.searchQuery('Rol', submenu.ruta)
                    });
                  });
                }


                if ($scope.formData.onlyRole){
                  $scope.formData.mRole = $scope.roles[0];
                  $scope.formData.TipoRol = $scope.formData.mRole.codigo;
                }else{
                  $scope.formData.TipoRol = $scope.roles[0].codigo;
                }

                console.log($scope.formData.TipoRol);

                 if($scope.formData.TipoRol=='ADM' || $scope.formData.TipoRol=='EAC' || $scope.formData.TipoRol=='GST'){
                    $scope.userRoot = true;
                  }else{
                    $scope.userRoot = false;
                  }
                  
                  $scope.formData.numReferido = JSON.parse(window.localStorage.getItem('profile')).numeroReferido;
                  
                  _validateReferredNumber();
             
              }
            }

            if(typeof $scope.formData.TipoRol == 'undefined'){
              setRole();
              //console.log($scope.formData.TipoRol);
              if($stateParams.quotation>0)
                getAgente();
            }else{
              //console.log($scope.formData.TipoRol);
              if($stateParams.quotation>0)
                getAgente();
            }

          }
        }, function(response){
          //defer.reject(response);
        });
        
      })();

      $scope.data = {};

      if (constants.module.polizas.sctr.periodoCorto.TipoPeriodo === $state.params.tipo) {
        $scope.isRegular = false;
        $scope.data.title = 'Emitir póliza SCTR Periodo Corto';
      } else {
        $scope.isRegular = true;
        $scope.data.title = 'Emitir póliza SCTR Periodo Regular';
      }

      $scope.saveAgent = function(agent){
        $scope.formData.claims.codigoAgente = agent.codigoAgente;
        $scope.formData.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
        $rootScope.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
        $scope.mAgente = agent;

        _validateReferredNumber();
        
        proxySctr.ValidarAgentePorCodigo(agent.codigoAgente).then(function(response){              
          if(response.Data && response.Data.Bloqueado == "1"){          
            $scope.formData.agenteBloqueado = true;        
          }else{
            $scope.formData.agenteBloqueado = false;
          }
          
        }, function(response){
          //defer.reject(response);
        });

        proxySctr.getCodOficina(2, agent.codigoAgente).then(function(response){              
          if(response.Data && response.Data.NombreOficina){          
            $scope.officeName = response.Data.NombreOficina;  
            $scope.regionName = response.Data.NombreRegion;       
          }
        }, function(response){
          //defer.reject(response);
        });
        
      }
      
      function _validateReferredNumber() {
        if($scope.formData.numReferido){
        proxyReferido.ValidateReferredNumber($scope.formData.numReferido,"ambos", $scope.mAgente.codigoAgente,$scope.userRoot, true)              
        .then(function(response){
            if(response.data == "F1" || response.data == "F2"){
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
            }
            else if (response.data == "F3"){
              if($scope.userRoot){
                mModalAlert.showWarning(response.mensaje, '')
                $scope.disableSgt = true;
                $scope.formData.msjReferidoValidate = response.mensaje;
              }
              else{
              mModalAlert.showWarning(response.mensaje, '')
              window.location.href = "/polizas/#"
              }
            }
            
            else{
              $scope.disableSgt = false;
              $scope.formData.msjReferidoValidate = null;
            }
          });
      }
      }

      $scope.$watch('formData.mAgente', function(nv)
      {
        $rootScope.mAgente =  nv;
      })

			$scope.$on('$stateChangeSuccess', function (s, state, param, d) {
	      $scope.currentStep = param.step;
	    });

      function getAgente(){

        var paramsCoti = {

          NumeroSolicitud: $stateParams.quotation,
          Tipo: 1,
          TipoRol: $scope.formData.TipoRol

        };
        
        $scope.formData.NroSolicitud = $scope.formData.quotation;
        sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){
 
          if (response.OperationCode == constants.operationCode.success){
            $scope.cotizacion = response.Data;
            $rootScope.chatNumber = $scope.cotizacion[0].Solicitud.CantidadMensaje;
            $scope.formData.mAgente = {
              codigoAgente: $scope.cotizacion[0].Solicitud.CodigoAgente,
              codigoNombre: $scope.cotizacion[0].Solicitud.CodigoAgente + "-" + $scope.cotizacion[0].Solicitud.DescripcionAgente,
              importeAplicarMapfreDolar:0,
              mcamapfreDolar:"",
              codigoEstadoCivil:0,
              codigoUsuario: oimClaims.loginUserName,
              rolUsuario: oimClaims.roleCode,
              nombre: oimClaims.userName
            };   
            $rootScope.mAgente = $scope.formData.mAgente;       
          }
        });
      }

      $scope.isAgente = function(){
       if($scope.formData){
        if($scope.formData.TipoRol == 'AGT')
          return true;
        else
          return false;
       }
      }

	    /*#########################
	    # Steps
	    #########################*/
	    $scope.nav = {}
	    $scope.nav.go = function (step){
	      var e = { cancel : false, step: step }
	      $scope.$broadcast('changingStep', e);
	      return !e.cancel;
	    }

      $scope.findAgent = function(wildcar) {
        if($scope.formData.TipoRol == 'EAC')
          return proxyAgente.buscarAgenteSctr(wildcar.toUpperCase(), $scope.formData.TipoRol, oimClaims.officeCode, false);
        else if($scope.formData.TipoRol == 'GST')
          return proxyAgente.buscarAgenteSctr(wildcar.toUpperCase(), $scope.formData.TipoRol, oimClaims.gestorId, false);
        else
          return proxyAgente.buscarAgenteSctr(wildcar.toUpperCase(), false);
      }

		}]).filter('isEmpty', function () {
    var bar;
    return function (obj) {
      for (bar in obj) {
        if (obj.hasOwnProperty(bar)) {
          return false;
        }
      }
      return true;
    };
  })
});