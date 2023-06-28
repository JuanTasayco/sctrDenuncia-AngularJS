(function($root, deps, action){
		define(deps, action)
})(this, ['angular', 'constants', 'helper', '/polizas/app/sctr/emitir/component/modalInfo.js', 'polizasFactory'],
	function(angular, constants, helper){

		var appAutos = angular.module('appAutos');

		appAutos.controller('sctrEmitirS4Controller',
			['$scope', '$window', '$state', '$timeout', '$rootScope', 'sctrEmitFactory', 'mModalAlert', '$uibModal', 'fileUpload', '$stateParams', '$sce', 'oimClaims', 'mainServices', 'proxySctr', 'polizasFactory', 'oimAbstractFactory', 'gaService', 'proxyGeneral',
			function($scope, $window, $state, $timeout, $rootScope, sctrEmitFactory, mModalAlert, $uibModal, fileUpload, $stateParams, $sce, oimClaims, mainServices, proxySctr, polizasFactory, oimAbstractFactory, gaService, proxyGeneral){

      (function onLoad(){

        $scope.gaValue = $stateParams.tipo == constants.module.polizas.sctr.periodoCorto.TipoPeriodo ? 'Periodo Corto' : 'Periodo Regular';

        proxySctr.ValidarAgente().then(function(response){
          if(response.Data && response.Data.Bloqueado == 1){
            $state.go('sctrHome');
          }else{
            $scope.formData = $scope.formData || {};
            $scope.formData.mAgente = $scope.mAgente;

            $scope.formData.isUploading = false; // validar porfa

             if(typeof $scope.formData == 'undefined'){
               $scope.formData.permitir = true;
               $state.go('.',{
                  step: 1
                });
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
              }
            }

            $scope.adjURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.policy + 'api/sctr/mensaje/archivo');

           if(typeof $scope.formData.TipoRol == 'undefined'){
              setRole();
            }

            if($scope.formData.TipoRol == 'AGT'){
              $scope.formData.esAgente = true;
              $scope.formData.esAdmin = false;
              $scope.formData.esAdminSus = false;
              $scope.formData.conTasas = true;
              $scope.formData.esCliente = false;
            }else if($scope.formData.TipoRol == 'ADM'){
              $scope.formData.esAgente = false;
              $scope.formData.esAdmin = true;
              $scope.formData.esAdminSus = false;
              $scope.formData.SolEnviada = false;
              $scope.formData.tasasEnviadas = false;
              $scope.formData.conTasas = false;
              $scope.formData.esCliente = false;
            }else if($scope.formData.TipoRol == 'SUS'){
              $scope.formData.esAgente = false;
              $scope.formData.esAdminSus = true;
              $scope.formData.conTasas = false;
              $scope.formData.esCliente = false;
              $scope.formData.esAdmin = false;
            }else if($scope.formData.TipoRol == 'CLI'){
              $scope.formData.esCliente = true;
              $scope.formData.esAgente = false;
              $scope.formData.esAdminSus = false;
              $scope.formData.esAdmin = false;
            }

            $scope.sinCargar = true;

            $scope.formData.quotation = $stateParams.quotation;
            $scope.formData.tipoSCTR = $stateParams.tipo;
            $scope.formData.NumeroMovimiento = 0;
            $scope.formData.errorFile = 2;

             if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
              $scope.formData.pNormal = false;
            }else{
              $scope.formData.pNormal = true;
            }

            if($scope.formData.quotation > 0){cargarPaso2();cargarPaso3();}

            if($scope.formData.pension && $scope.formData.salud){
              $scope.formData.CodigoCompania = 2;
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.pension.CodigoRamo;
            }else if($scope.formData.pension){
              $scope.formData.CodigoCompania = 2; //pension
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.pension.CodigoRamo;
            }else if($scope.formData.salud){
              $scope.formData.CodigoCompania = 3; //salud
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.salud.CodigoRamo;
            }

            getEncuesta();

            if($scope.formData.paso3Grabado){
              disableNextStep();
             }else{
              $state.go('.',{
                step: 3
              });
            }
          }
        }, function(response){
          //defer.reject(response);
        });

      })();

      $scope.$watch('formData', function(nv)
	    {
	      $rootScope.formData =  nv;
	    })
      
      function getEncuesta(){
        var codCia = $scope.formData.CodigoCompania;
        var codeRamo = $scope.formData.CodigoRamo;

        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
          if(response.OperationCode == constants.operationCode.success){
            if (Object.keys(response.Data.Pregunta).length > 0){
              $scope.encuesta = response.Data;
              $scope.encuesta.CodigoCompania = codCia;
              $scope.encuesta.CodigoRamo = codeRamo;
            }else{
              $scope.encuesta = {};
              $scope.encuesta.mostrar = 0;
            }
          }
        }, function(error){
          console.log('Error en getEncuesta: ' + error);
        })
      }

      function disableNextStep(){
        $scope.formData.fifthStepNextStep = false;
      }

      if(!$scope.cotizacion){
        $scope.cotizacion = [
          {
            Solicitud: {
              SecuenciaReg: 0,
              CodigoEstado: ''
            }
          }
        ];
      }

      $scope.$on('changingStep', function(ib,e){
        if (typeof $scope.formData.fifthStepNextStep == 'undefined') $scope.formData.fifthStepNextStep = false;

        if (e.step < 5) {
          e.cancel = false;
        }else
          if($scope.formData.paso4Grabado ||
            ($scope.cotizacion[0].Solicitud.CodigoEstado=='EM')
            ){
            e.cancel = false;
          }else{
            e.cancel = true;
            disableNextStep();
          }
      });



      function cargarPaso2(){

        $scope.formData.paso2Grabado = true;

        var paramsCoti = {

          NumeroSolicitud: $scope.formData.quotation,
          Tipo: 1,
          TipoRol: $scope.formData.TipoRol

        };

        sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

          if (response.OperationCode == constants.operationCode.success){
            $scope.cotizacion = response.Data;

            $scope.formData.procedencia = $scope.cotizacion[0].CodigoProcedencia || constants.module.polizas.sctr.procedencia;
            if (isNotEmisa()) {
              showModalProcedence();
              return;
            }
            console.log($scope.formData.mAgente);

            $scope.formData.codigoAgente = $scope.cotizacion[0].Solicitud.CodigoAgente;

            proxySctr.ValidarAgentePorCodigo($scope.formData.codigoAgente).then(function(response){
              if(response.Data && response.Data.Bloqueado == "1"){
                $scope.formData.agenteBloqueado = true;

                mModalAlert.showError('El código de agente ' + $scope.formData.codigoAgente + ' ha sido bloqueado para emisión SCTR por presentar 3 pólizas pendientes de pago (primer recibo pendiente vencido mayor a 45 días). <br/>'+
                'Coordinar con su gestor comercial', 'Agente Bloqueado').then(function(response){
                    $state.go('sctrHome');
                  }, function(error){
                    $state.go('sctrHome');
                  });
              }else{
                $scope.formData.agenteBloqueado = false;
              }
            }, function(response){
              //defer.reject(response);
            });

            $scope.formData.dataContractor2 = {};
            $scope.formData.dataContractor2.EmailUsuario = $scope.cotizacion[0].EmailUsuario;
            $scope.formData.dataContractor2.Telefono = $scope.cotizacion[0].Telefono;

            var isdeficitario = $scope.cotizacion[0].McaDeficitarioPension == 'S' ||
            $scope.cotizacion[0].McaDeficitarioSalud == 'S';

            $scope.formData.isdeficitario = isdeficitario;
            $scope.formData.applyDeficitarioValidation = $scope.formData.isdeficitario;

            if($scope.formData.TipoRol == 'AGT'|| $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){
              $scope.formData.esAgente = true;
            }else{
              $scope.formData.esAdminSus = true;
            }

            $scope.formData.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;
            $scope.formData.usuarioDestino = $scope.cotizacion[0].Solicitud.Suscriptor.CodigoUsuario;
            $scope.formData.McaExtCliTron = $scope.cotizacion[0].McaExtCliTron;

            $scope.formData.mActEco = {
              CodigoCiiuEmp: $scope.cotizacion[0].Solicitud.CodCiiuPol,
              DescripcionCiiuEmp: $scope.cotizacion[0].Solicitud.DescripcionCiiuPol,
              codigoDescricionCiiu: $scope.cotizacion[0].Solicitud.CodCiiuPol + '-' + $scope.cotizacion[0].Solicitud.DescripcionCiiuPol
            };

            $scope.formData.mCentroRiesgo = $scope.cotizacion[0].Solicitud.ColegAseg;
            $scope.formData.ColegAseg = $scope.formData.mCentroRiesgo;
            $scope.formData.subactividad = {
              Descripcion: $scope.cotizacion[0].Solicitud.DescTrabPol
            };

            $scope.formData.mDescripcionTrabajo = $scope.cotizacion[0].Solicitud.DescTrabPol;

             $scope.formData.mFrecDeclaracion = {
              Codigo : $scope.cotizacion[0].Solicitud.FormaPago,
              Descripcion: $scope.cotizacion[0].Solicitud.FormaPagoDescripcion
            }

            var str = $scope.cotizacion[0].Solicitud.FechaEfectivoPoliza;
            var res = str.split(" ");
            $scope.formData.desde = res[0];


            str = $scope.cotizacion[0].Solicitud.FechaVencimientoPoliza;
            res = str.split(" ");
            $scope.formData.hasta = res[0];

            $scope.formData.descripcionDuracion = sctrEmitFactory.getDescripcionDuracion($scope.formData.desde, $scope.formData.hasta);

            $scope.formData.mDuracionCobertura = {
              Codigo: $scope.cotizacion[0].CodigoCobertura
            };

            //tipo de seguro
            if($scope.cotizacion.length==2){
              $scope.formData.salud = true;
              $scope.formData.pension = true;

              $scope.formData.factor = [];

              for(var i=0; i<$scope.cotizacion.length; i++){

                if($scope.cotizacion[i].CodigoCompania==3){//salud

                  $scope.formData.primaNetaSalud = $scope.cotizacion[i].Riesgo.Tasa;
                  $scope.formData.subTotalSalud = $scope.cotizacion[i].Riesgo.SubTotal;
                  $scope.formData.factorSalud = $scope.cotizacion[i].Riesgo.Factor;
                  $scope.formData.primaNetaSalud = $scope.cotizacion[i].Riesgo.PrimaNeta;
                  $scope.formData.primaTotalSalud = $scope.cotizacion[i].Riesgo.PrimaTotal;

                }else if($scope.cotizacion[i].CodigoCompania==2){//pension

                  $scope.formData.primaNetaPension = $scope.cotizacion[i].Riesgo.Tasa;
                  $scope.formData.subTotalPension = $scope.cotizacion[i].Riesgo.SubTotal;
                  $scope.formData.factorPension = $scope.cotizacion[i].Riesgo.Factor;
                  $scope.formData.primaNetaPension = $scope.cotizacion[i].Riesgo.PrimaNeta;
                  $scope.formData.primaTotalPension = $scope.cotizacion[i].Riesgo.PrimaTotal;

                }
              }

            }else if($scope.cotizacion[0].CodigoCompania==3){
              $scope.formData.salud = true;

            }else if($scope.cotizacion[0].CodigoCompania==2){
              $scope.formData.pension = true;

            }

            //paso
            $scope.paso3 = true;
            $scope.tasasAceptadas = true;

            for(var i=0; i<$scope.cotizacion.length; i++){
              if($scope.cotizacion[i].CodigoCompania==3){//salud
                $scope.formData.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
                $scope.formData.mImportePlanillaSalud = $scope.cotizacion[i].Riesgo.ImportePlanilla;
              }

              if($scope.cotizacion[i].CodigoCompania==2){//pension
                $scope.formData.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
                $scope.formData.mImportePlanillaPension = $scope.cotizacion[i].Riesgo.ImportePlanilla;
              }
            }

          }
        });
      }

      function cargarPaso3(){
        $scope.formData.paso3Grabado = true;

        var paramsCoti = {

          NumeroSolicitud: $scope.formData.quotation,
          Tipo: 1,
          TipoRol: $scope.formData.TipoRol

        };

        sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

          if (response.OperationCode == constants.operationCode.success){
            $scope.cotizacion = response.Data;

            $scope.formData.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;

            $scope.formData.NroSolicitud = $scope.cotizacion[0].Solicitud.NumeroSolicitud;


            $scope.formData.CodigoPostal = $scope.cotizacion[0].CodigoPostal;

            //tipo de seguro
            if($scope.cotizacion.length==2){
              $scope.formData.salud = true;
              $scope.formData.pension = true;
              $scope.formData.CodigoCompania = 2;
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.pension.CodigoRamo;
              $scope.formData.NumeroTicket = $scope.cotizacion[0].NumeroTicket;

              $scope.formData.factor = [];

              for(var i=0; i<$scope.cotizacion.length; i++){

                if($scope.cotizacion[i].CodigoCompania==3){//salud

                  $scope.formData.primaNetaSalud = $scope.cotizacion[i].Riesgo.Tasa;
                  $scope.formData.subTotalSalud = $scope.cotizacion[i].Riesgo.SubTotal;
                  $scope.formData.factorSalud = $scope.cotizacion[i].Riesgo.Factor;
                  $scope.formData.primaNetaSalud = $scope.cotizacion[i].Riesgo.PrimaNeta;
                  $scope.formData.primaTotalSalud = $scope.cotizacion[i].Riesgo.PrimaTotal;

                  $scope.formData.NumeroMovimiento = $scope.cotizacion[i].Riesgo.NumeroMovimiento;
                  $scope.formData.NumeroPoliza = $scope.cotizacion[i].Riesgo.NumeroPoliza;

                  $scope.formData.tasaPC = {
                    Valor2: $scope.cotizacion[i].Riesgo.Tasa
                  };

                }else if($scope.cotizacion[i].CodigoCompania==2){//pension

                  $scope.formData.primaNetaPension = $scope.cotizacion[i].Riesgo.Tasa;
                  $scope.formData.subTotalPension = $scope.cotizacion[i].Riesgo.SubTotal;
                  $scope.formData.factorPension = $scope.cotizacion[i].Riesgo.Factor;
                  $scope.formData.primaNetaPension = $scope.cotizacion[i].Riesgo.PrimaNeta;
                  $scope.formData.primaTotalPension = $scope.cotizacion[i].Riesgo.PrimaTotal;

                  $scope.formData.NumeroMovimiento = $scope.cotizacion[i].Riesgo.NumeroMovimiento;
                  $scope.formData.NumeroPoliza = $scope.cotizacion[i].Riesgo.NumeroPoliza;

                  $scope.formData.tasaPC = {
                    Valor2: $scope.cotizacion[i].Riesgo.Tasa
                  };

                }
              }

              paso1($scope.cotizacion);

            }else if($scope.cotizacion[0].CodigoCompania==3){
              $scope.formData.salud = true;
              $scope.formData.CodigoCompania = 3; //salud
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.salud.CodigoRamo;
              $scope.formData.NumeroTicket = $scope.cotizacion[0].NumeroTicket;

              $scope.formData.primaNetaSalud = $scope.cotizacion[0].Riesgo.Tasa;
              $scope.formData.subTotalSalud = $scope.cotizacion[0].Riesgo.SubTotal;
              $scope.formData.factorSalud = $scope.cotizacion[0].Riesgo.Factor;
              $scope.formData.primaNetaSalud = $scope.cotizacion[0].Riesgo.PrimaNeta;
              $scope.formData.primaTotalSalud = $scope.cotizacion[0].Riesgo.PrimaTotal;

              $scope.formData.NumeroMovimiento = $scope.cotizacion[0].Riesgo.NumeroMovimiento;
              $scope.formData.NumeroPoliza = $scope.cotizacion[0].Riesgo.NumeroPoliza;

              $scope.formData.tasaPC = {
                Valor2: $scope.cotizacion[0].Riesgo.Tasa
              };


              paso1($scope.cotizacion);

            }else if($scope.cotizacion[0].CodigoCompania==2){
              $scope.formData.pension = true;
              $scope.formData.CodigoCompania = 2; //pension
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.pension.CodigoRamo;
              $scope.formData.NumeroTicket = $scope.cotizacion[0].NumeroTicket;

              $scope.formData.primaNetaPension = $scope.cotizacion[0].Riesgo.Tasa;
              $scope.formData.subTotalPension = $scope.cotizacion[0].Riesgo.SubTotal;
              $scope.formData.factorPension = $scope.cotizacion[0].Riesgo.Factor;
              $scope.formData.primaNetaPension = $scope.cotizacion[0].Riesgo.PrimaNeta;
              $scope.formData.primaTotalPension = $scope.cotizacion[0].Riesgo.PrimaTotal;

              $scope.formData.NumeroMovimiento = $scope.cotizacion[0].Riesgo.NumeroMovimiento;
              $scope.formData.NumeroPoliza = $scope.cotizacion[0].Riesgo.NumeroPoliza;

              $scope.formData.tasaPC = {
                Valor2: $scope.cotizacion[0].Riesgo.Tasa
              };

              paso1($scope.cotizacion);

            }

            //paso
            if($scope.cotizacion[0].Solicitud.CodigoEstado=='AT'){
              $scope.paso3 = true;
              $scope.tasasAceptadas = true;


              for(var i=0; i<$scope.cotizacion.length; i++){
                if($scope.cotizacion[i].CodigoCompania==3){//salud
                  $scope.formData.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
                  $scope.formData.mImportePlanillaSalud = $scope.cotizacion[i].Riesgo.ImportePlanilla;
                  $scope.formData.mTasaSalud = $scope.cotizacion[i].Riesgo.Tasa;
                }

                if($scope.cotizacion[i].CodigoCompania==2){//pension
                  $scope.formData.mNroTrabajadores = $scope.cotizacion[i].Riesgo.CantidadTrabajador;
                  $scope.formData.mImportePlanillaPension = $scope.cotizacion[i].Riesgo.ImportePlanilla;
                  $scope.formData.mTasaPension = $scope.cotizacion[i].Riesgo.Tasa;
                }
              }





              $scope.formData.planillaCargada = $scope.cotizacion[0].Solicitud.McaTrabajador;

              if($scope.formData.planillaCargada == 'S'){
                $scope.formData.planillaCargada=true;
                $scope.formData.errorFile=0;
                $scope.sinCargar = false;
              }else{
                $scope.formData.planillaCargada=false;
              }

            }else if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM'){

              if($scope.cotizacion.length==2){
                if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM'){
                  $scope.formData.mTasaPension = $scope.cotizacion[0].Riesgo.Tasa;
                  $scope.formData.mTasaSalud = $scope.cotizacion[1].Riesgo.Tasa;
                }
              }else{
                if($scope.cotizacion[0].CodigoCompania==3){
                  if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM'){
                    $scope.formData.mTasaSalud = $scope.cotizacion[1].Riesgo.Tasa;
                  }
                }else if($scope.cotizacion[0].CodigoCompania==2){
                  if($scope.cotizacion[0].Solicitud.CodigoEstado=='EM'){
                    $scope.formData.mTasaPension = $scope.cotizacion[0].Riesgo.Tasa;
                  }
                }
              }

              $scope.formData.planillaCargada = $scope.cotizacion[0].Solicitud.McaTrabajador;

              if($scope.formData.planillaCargada == 'S'){
                $scope.formData.planillaCargada=true;
                $scope.formData.errorFile=0;
                $scope.sinCargar = false;
              }else{
                $scope.formData.planillaCargada=false;
              }

            }
            if($scope.formData.pNormal)listarMensajes();
          }
        });
      }

      function paso1(cotizacion){
        $scope.formData.mTipoDocumento = {Codigo:cotizacion[0].TipoDocumento, Descripcion:cotizacion[0].TipoDocumento};
        $scope.formData.mNumeroDocumento = cotizacion[0].NumeroDocumento;

        $scope.buscarContratante();

        $scope.formData.mRazonSocial = cotizacion[0].RazonSocial;

        if($scope.cotizacion[0].ApellidoPaterno == '' && mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento)){
          var arregloDeCadenas = $scope.cotizacion[0].RazonSocial.split(' ');

          $scope.cotizacion[0].ApellidoPaterno = arregloDeCadenas[0];
          $scope.cotizacion[0].ApellidoMaterno = arregloDeCadenas[1];
          var nombre = '';

          angular.forEach(arregloDeCadenas, function(value,key){

            if(key>1){
              nombre += arregloDeCadenas[key] + ' ';
            }

          });
          $scope.formData.mRazonSocial = nombre;

          $scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
          $scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

        }else{

          $scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
          $scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

        }

        $scope.formData.mActivSunat = {codigo:cotizacion[0].CodigoCiiuEmp, descripcion: cotizacion[0].DescripcionCiiuEmp};

        $scope.formData.McaFisico            = ($scope.cotizacion[0].McaFisico == '' )? '' : $scope.cotizacion[0].McaFisico;
        $scope.formData.mSexo                = ($scope.cotizacion[0].Sexo == '' )? '' : $scope.cotizacion[0].Sexo;


        $scope.formData.mProfesion = {};
        $scope.formData.mProfesion.Codigo    = ($scope.cotizacion[0].CodigoProfesion == 0 )? 99 : $scope.cotizacion[0].CodigoProfesion;


        $scope.formData.mDirReferencias = cotizacion[0].Referencia;
        $scope.formData.mRepresentante = cotizacion[0].Representante;
        $scope.formData.mRepresentanteCargo = {Codigo:cotizacion[0].TipoCargoRep, Descripcion: cotizacion[0].CargoRepresentante};
      }


      $scope.buscarContratante = function(){
        // Contratante

        $scope.formData.resultContratante = 2;
        $scope.formData.contrante = true;

        $scope.formData.contractorAddress.mTipoVia = {
          Codigo:         ($scope.cotizacion[0].TipoDomicilio== '') ? null : $scope.cotizacion[0].TipoDomicilio
        };

        $scope.formData.contractorAddress.mNombreVia = $scope.cotizacion[0].NombreDomicilio;

        $scope.formData.contractorAddress.mTipoNumero = {
          Codigo:         ($scope.cotizacion[0].TipoNumero == '') ? null : $scope.cotizacion[0].TipoNumero
        };

        $scope.formData.contractorAddress.mNumeroDireccion = $scope.cotizacion[0].DescripcionNumero;

        $scope.formData.contractorAddress.mTipoInterior = {
          Codigo:         ($scope.cotizacion[0].TipoInterior == '') ? null : $scope.cotizacion[0].TipoInterior
        };

        $scope.formData.contractorAddress.mNumeroInterior = $scope.cotizacion[0].DescripcionInterior;

        $scope.formData.contractorAddress.mTipoZona = {
          Codigo:         ($scope.cotizacion[0].TipoZona == '') ? null : $scope.cotizacion[0].TipoZona
        };

        $scope.formData.contractorAddress.mNombreZona = $scope.cotizacion[0].DescripcionZona;

        if (typeof $scope.formData.dataContractorAddress == 'undefined'){

          $scope.formData.mRazonSocial         = $scope.cotizacion[0].RazonSocial;

          if($scope.cotizacion[0].ApellidoPaterno == '' && mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento)){
            var arregloDeCadenas = $scope.cotizacion[0].RazonSocial.split(' ');

            $scope.cotizacion[0].ApellidoPaterno = arregloDeCadenas[0];
            $scope.cotizacion[0].ApellidoMaterno = arregloDeCadenas[1];
            var nombre = '';

            angular.forEach(arregloDeCadenas, function(value,key){

              if(key>1){
                nombre += arregloDeCadenas[key] + ' ';
              }

            });
            $scope.formData.mRazonSocial = nombre;

            $scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
            $scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

          }else{

            $scope.formData.mApePatContratante   = ($scope.cotizacion[0].ApellidoPaterno == '' )? '' : $scope.cotizacion[0].ApellidoPaterno;
            $scope.formData.mApeMatContratante   = ($scope.cotizacion[0].ApellidoMaterno == '' )? '' : $scope.cotizacion[0].ApellidoMaterno;

          }

          $scope.formData.McaFisico            = ($scope.cotizacion[0].McaFisico == '' )? '' : $scope.cotizacion[0].McaFisico;
          $scope.formData.mSexo                = ($scope.cotizacion[0].Sexo == '' )? '' : $scope.cotizacion[0].Sexo;

          $scope.formData.mProfesion = {};
          $scope.formData.mProfesion.Codigo    = ($scope.cotizacion[0].CodigoProfesion == 0 ) ? 99 : $scope.cotizacion[0].CodigoProfesion;


          $scope.formData.mTelefonoFijo         = $scope.cotizacion[0].Telefono;
          $scope.formData.mTelefonoCelular      = $scope.cotizacion[0].NumeroMovil;
          $scope.formData.mCorreoElectronico    = $scope.cotizacion[0].EmailUsuario;

          // console.log($scope.formData.mCorreoElectronico);

          $scope.formData.dataContractorAddressClone = helper.clone($scope.formData.dataContractorAddress, true);
          var isload = false;
            $scope.$watch('setterUbigeo', function() {
              if ($scope.setterUbigeo && !isload) {
                  $scope.setterUbigeo($scope.cotizacion[0].Departamento, $scope.cotizacion[0].Provincia, $scope.cotizacion[0].Distrito);
                  isload = true;
              }
            });
          // $timeout(function(){
          //   $scope.setterUbigeo($scope.cotizacion[0].Departamento, $scope.cotizacion[0].Provincia, $scope.cotizacion[0].Distrito);
          // }, 1000);
        }
      }

      /*#########################
      # Comentarios
      #########################*/
      function listarMensajes(){
        sctrEmitFactory.listarMensajes($scope.formData.quotation, true).then(function(response){
        //sctrEmitFactory.listarMensajes(185392, true).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.formData.mensajes = response.Data;
            $rootScope.chatNumber = $scope.formData.mensajes.length;
            // console.log($scope.formData.mensajes);
            // console.log($scope.formData.mensajes.length);
          }
        });
      }

      /*#########################
      # Adjuntos
      #########################*/
      $scope.uploadFile = function(){
        $scope.formData.mAgente = $rootScope.mAgente;

        if($scope.formData.TipoRol == 'AGT' || $scope.formData.TipoRol == 'CLI'|| $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){

          $scope.frmSCTR4Comment.markAsPristine();

          var file = null;

          if(!(typeof $scope.myFile == 'undefined')){
            file = $scope.myFile;

          }

          if(!(typeof $scope.mComment == 'undefined')) {
             var paramsFile = {
              numeroSolicitud: $scope.formData.NroSolicitud,
              rolOrigen: $scope.formData.TipoRol,
              usuarioOrigen: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
              usuarioDestino: $scope.formData.usuarioDestino,
              asunto: 'MESSAGE: ' + new Date(),
              mensaje: $scope.mComment
            };

            fileUpload.uploadFileToUrl(file, paramsFile);
            $timeout(function () {
              listarMensajes();
              $scope.mComment = '';
              $scope.myFile = undefined;
            }, 2000);
          }

        }else if($scope.formData.TipoRol == 'ADM'){

          $scope.frmSCTR4Comment.markAsPristine();

          var file = null;

          if(!(typeof $scope.myFile == 'undefined')){
            file = $scope.myFile;

          }

          if(!(typeof $scope.mComment == 'undefined')) {
             var paramsFile = {
              numeroSolicitud: $scope.formData.NroSolicitud,
              rolOrigen: $scope.formData.TipoRol,
              usuarioOrigen: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
              usuarioDestino: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
              asunto: 'MESSAGE: ' + new Date(),
              mensaje: $scope.mComment
            };

            fileUpload.uploadFileToUrl(file, paramsFile);
            $timeout(function () {
              listarMensajes();
              $scope.mComment = '';
              $scope.myFile = undefined;
            }, 2000);
          }

        }else{//if($scope.formData.TipoRol == 'SUS'){

          $scope.frmSCTR4Comment.markAsPristine();

          var file = null;

          if(!(typeof $scope.myFile == 'undefined')){
            file = $scope.myFile;

          }

          if(!(typeof $scope.mComment == 'undefined')) {
             var paramsFile = {
              numeroSolicitud: $scope.formData.NroSolicitud,
              rolOrigen: $scope.formData.TipoRol,
              usuarioOrigen: oimClaims.loginUserName.toUpperCase(),//$scope.formData.usuarioDestino,
              usuarioDestino: $scope.formData.usuarioDestino,
              asunto: 'MESSAGE: ' + new Date(),
              mensaje: $scope.mComment
            };

            fileUpload.uploadFileToUrl(file, paramsFile);
            $timeout(function () {
              listarMensajes();
              $scope.mComment = '';
              $scope.myFile = undefined;
            }, 2000);
          }

        }

      };

      $scope.deleteFile = function(index){
        $scope.myFile = $.map($scope.myFile, function(myFile) { return myFile; })

        if ((index) > -1) {
          $scope.myFile.splice((index), 1);
        }
      }

      $scope.getAdjunto = function(adjunto){
        $scope.adjData = {
          NumeroSolicitud : parseInt($scope.formData.NroSolicitud),
          ArchivoAdjunto: adjunto
        };
        $window.setTimeout(function(){
          document.getElementById('frmDownloadADJ').submit();
        });
      }

      /*#########################
      # Plantilla
      #########################*/

	    $scope.getPlantilla = function(){
      	sctrEmitFactory.download(constants.module.polizas.sctr.idPlanilla, 'Formato_trama.xls').then(function(response){
          });
      };


      $scope.getPlantillaObs = function(){
        var vParams = {
          NumeroMovimiento: $scope.formData.NumeroMovimiento,
          CodigoCia: $scope.formData.CodigoCompania,
          NumeroPoliza: $scope.formData.NumeroPoliza,
          NumeroSpto: $scope.formData.NumeroSpto,
          NumeroAplicacion: $scope.formData.NumeroAplicacion,
          NumeroSptoAplicacion: $scope.formData.NumeroSptoAplicacion
        };

        sctrEmitFactory.downloadObs(vParams, 'Formato_trama_Obs.xlsx').then(function(response){
          });
      };

      $scope.resetPlanilla = function(){
        $scope.planilla = undefined;
        //$scope.frmPlanillaFile.reset();
        document.getElementById("frmPlanillaFile").reset();
        $scope.formData.errorFile = 2;
      }

      $scope.uploadPlantilla = function(){
        var file = $scope.planilla;
        $scope.archivoCargado = true;
        if (typeof file !== 'undefined' && ($scope.formData.TipoRol != 'SUS') && !$scope.formData.paso4Grabado){

          var paramsFile = {};


          if($scope.formData.salud && $scope.formData.pension){
             paramsFile = {
              numeroSolicitud: $scope.formData.NroSolicitud,
              cantidadTrabajador: $scope.formData.mNroTrabajadores,
              sueldoTotal: $scope.formData.mImportePlanillaPension
            };
          }else if($scope.formData.pension){
            paramsFile = {
              numeroSolicitud: $scope.formData.NroSolicitud,
              cantidadTrabajador: $scope.formData.mNroTrabajadores,
              sueldoTotal: $scope.formData.mImportePlanillaPension
            };
          }else if($scope.formData.salud){
            paramsFile = {
              numeroSolicitud: $scope.formData.NroSolicitud,
              cantidadTrabajador: $scope.formData.mNroTrabajadores,
              sueldoTotal: $scope.formData.mImportePlanillaSalud
            };
          }

          $scope.showModalInfo = function showModalInfo(obj, confirmFn) {
            $scope.data = obj;
            var modalInfo = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              template: '<mpf-modal-info data="data" close="close()"></mpf-modal-info>',
              controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
                scope.close = function() {
                  $uibModalInstance.close();
                };
              }]
            });

            modalInfo.result.then(function() {
              $scope.$watch('data', function(value) {
                if (value.confirm) {
                  confirmFn();
                }
              });
            }, function() {
            });
          };

          $scope.sinCargar = false;

          if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
            if(file && file.length > 0){
              fileUpload.uploadXLSFilePC(file[0], paramsFile).then(function(response){
                $scope.planilla = null;
                document.getElementById('file-upload').value = '';
                $scope.aseguradosError = (response.data.Data && response.data.Data.UploadErrors) || [];
                $scope.msgResponse = response.data.Message;
                $scope.codeOperation = response.data.OperationCode;
                $scope.erroresLength = ($scope.aseguradosError && $scope.aseguradosError.length) || 0;
                // console.log(response);
                // debugger;
                $scope.asegurados = response.data;
                if (response.data.OperationCode == 200){
                  //console.log($scope.asegurados);
                  $scope.formData.NumeroMovimiento = $scope.asegurados.NumeroMovimiento;

                  $scope.formData.errorFile = 0;
                  $scope.show600 = false;
                }else if (response.data.OperationCode == 600){
                  var textoFormateado = "<span class='g-sub-title u-txt-weight u-txt-18'>"+ response.data.Data.Data.InformativeMessage + "</span>";

                  var options = {
                    title: response.data.Message,
                    subTitle: textoFormateado,
                    lblSave: 'Descargar observaciones'
                  }

                  $scope.showModalInfo(options, $scope.getPlantillaObs);
                  $scope.show600 = true;
                  $scope.formData.NumeroMovimiento = response.data.Data.Data.NumeroMovimiento;

                  $scope.formData.NumeroPoliza = response.data.Data.Data.NumeroPoliza;
                  $scope.formData.NumeroSpto = response.data.Data.Data.NumeroSpto;
                  $scope.formData.NumeroAplicacion = response.data.Data.Data.NumeroAplicacion;
                  $scope.formData.NumeroSptoAplicacion = response.data.Data.Data.NumeroSptoAplicacion;

                  $scope.formData.errorFile = 0;
                } else {
                  $scope.formData.errorFile = 1;
                  $scope.show600 = false;
                  //mModalAlert.showError($scope.aseguradosError, 'Error en la carga del archivo');
                }
              });
            }
          }else{
            if(file.length > 0){
              fileUpload.uploadXLSFilePN(file[0], paramsFile).then(function(response){
                $scope.aseguradosError = response.data.Data && response.data.Data.UploadErrors;
                $scope.asegurados = response.data;
                $scope.msgResponse = response.data.Message;
                $scope.codeOperation = response.data.OperationCode;
                $scope.erroresLength = ($scope.aseguradosError && $scope.aseguradosError.length) || 0;
                if (response.data.OperationCode == 200){
                  //console.log($scope.asegurados);
                  $scope.formData.NumeroMovimiento = $scope.asegurados.NumeroMovimiento;
                  $scope.formData.errorFile = 0;
                  $scope.show600 = false;
                }else if (response.data.OperationCode == 600){
                  var textoFormateado = "<span class='g-sub-title u-txt-weight u-txt-18'>"+ response.data.Data.Data.InformativeMessage + "</span>";

                  var options = {
                    title: response.data.Message,
                    subTitle: textoFormateado,
                    lblSave: 'Descargar observaciones'
                  }

                  $scope.showModalInfo(options, $scope.getPlantillaObs);
                  $scope.show600 = true;
                  $scope.formData.NumeroMovimiento = response.data.Data.Data.NumeroMovimiento;

                  $scope.formData.NumeroPoliza = response.data.Data.Data.NumeroPoliza;
                  $scope.formData.NumeroSpto = response.data.Data.Data.NumeroSpto;
                  $scope.formData.NumeroAplicacion = response.data.Data.Data.NumeroAplicacion;
                  $scope.formData.NumeroSptoAplicacion = response.data.Data.Data.NumeroSptoAplicacion;

                  $scope.formData.errorFile = 0;
                }else{
                  // $scope.aseguradosError = response.data.Message;
                  $scope.formData.errorFile = 1;
                  $scope.show600 = false;
                  //mModalAlert.showError($scope.aseguradosError, 'Error en la carga del archivo');
                }
              });
            }
          }
        }

      };

       $scope.$watchCollection('planilla', function(nv)
      {
        $scope.uploadPlantilla();
      })

      /*#########################
      # Grabar paso 4
      #########################*/
      $scope.irAEmitir = function(){
        if($scope.formData.mAgente.codigoAgente != '0'){
          $scope.hideButtonEmit = true;
          $scope.formData.mAgente = $rootScope.mAgente;

          if($scope.formData.salud && $scope.formData.pension){
            $scope.formData.TipoRiesgo = 'A';
          }else if($scope.formData.salud){
            $scope.formData.TipoRiesgo = 'S';
          }else if($scope.formData.pension){
            $scope.formData.TipoRiesgo = 'P';
          }

          $scope.formData.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
          $scope.cambiadoMcaFisico = true;
          if($scope.formData.showNaturalRucPerson)
            $scope.formData.McaFisico = 'S';
          else
            $scope.formData.McaFisico = 'N';

          gaService.add({ gaCategory: 'Emisa - SCTR', gaAction: 'MPF - Cotización', gaLabel: 'Botón: Cotizar', gaValue: $scope.gaValue });
          gaService.add({ gaCategory: 'Emisa - SCTR', gaAction: 'MPF - Emisión', gaLabel: 'Botón: Emitir', gaValue: $scope.gaValue });

          // Periodo Corto
          if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
            var paramsEmit =
                {
                  CodigoSistema: oimAbstractFactory.getOrigin(),
                  CodigoCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.codigo : '',
                  CodigoDepartamento: $scope.formData.contractorAddress.ubigeoData.mDepartamento.Codigo,//$scope.formData.contractorAddress.CodigoDepartamento,
                  CodigoProvincia: $scope.formData.contractorAddress.ubigeoData.mProvincia.Codigo,
                  CodigoDistrito: $scope.formData.contractorAddress.ubigeoData.mDistrito.Codigo,
                  CodigoMoneda: 1,
                  CodigoPais: 'PE',
                  CodigoPostal: $scope.formData.CodigoPostal,//'31', //constants.module.polizas.sctr.codPostal,//viene de servicio
                  CodigoUserReg: 'TRON2000',//$scope.formData.mAgente.codigoUsuario,
                  DescripcionInterior : (typeof $scope.formData.contractorAddress.mNumeroInterior == 'undefined' || $scope.formData.contractorAddress.mNumeroInterior == null) ? '' : $scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNumeroInterior,
                  DescripcionCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.descripcion : '',
                  DescripcionInterior : (typeof $scope.formData.contractorAddress.mNumeroInterior == 'undefined' || $scope.formData.contractorAddress.mNumeroInterior == null) ? '' : $scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNumeroInterior,
                  DescripcionNumero: (typeof $scope.formData.contractorAddress.mNumeroDireccion == 'undefined' || $scope.formData.contractorAddress.mNumeroDireccion == null) ? '' : $scope.formData.contractorAddress.mNumeroDireccion,//'845', //$scope.formData.contractorAddress.mNumeroInterior,
                  DescripcionTrabajo: '.',//$scope.formData.mDescripcionTrabajo,
                  DescripcionZona: (typeof $scope.formData.contractorAddress.mNombreZona == 'undefined' || $scope.formData.contractorAddress.mNombreZona == null) ? '' : $scope.formData.contractorAddress.mNombreZona,//'845', //$scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNombreZona,
                  EmailUsuario: (typeof $scope.formData.mCorreoElectronico == 'undefined' || $scope.formData.mCorreoElectronico == null) ? '' : $scope.formData.mCorreoElectronico,//'DIANA@MULTIPLICA.COM',//$scope.formData.mCorreoElectronico,
                  McaExtCliTron: $scope.formData.McaExtCliTron,
                  NombreDomicilio: $scope.formData.contractorAddress.mNombreVia,
                  NumeroDocumento: $scope.formData.mNumeroDocumento,
                  NumeroMovil: $scope.formData.mTelefonoCelular,
                  RazonSocial: $scope.formData.mRazonSocial,
                  ApellidoPaterno: (typeof $scope.formData.mApePatContratante  == 'undefined') ? '' : $scope.formData.mApePatContratante,
                  ApellidoMaterno: (typeof $scope.formData.mApeMatContratante  == 'undefined') ? '' : $scope.formData.mApeMatContratante,
                  Sexo:  (typeof $scope.formData.mSexo  == 'undefined') ? '' : $scope.formData.mSexo,
                  McaFisico: $scope.formData.McaFisico,
                  CodigoProfesion: (typeof $scope.formData.mProfesion.Codigo  == 'undefined') ? 99 : $scope.formData.mProfesion.Codigo,
                  Profesion: (typeof $scope.formData.mProfesion.Descripcion  == 'undefined') ? '' : $scope.formData.mProfesion.Descripcion,
                  Referencia: '', //$scope.formData.contractorAddress.mDirReferencias,
                  Representante: $scope.formData.mRepresentante,
                  Telefono: $scope.formData.mTelefonoFijo,
                  TipoCargoRep: parseInt($scope.formData.mRepresentanteCargo.Codigo),
                  TipoDocumento: $scope.formData.mTipoDocumento.Codigo,
                  TipoInterior: parseInt((typeof $scope.formData.contractorAddress.mTipoInterior.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoInterior.Codigo == null) ? 3 : $scope.formData.contractorAddress.mTipoInterior.Codigo),//3,//(typeof $scope.formData.contractorAddress.mTipoInterior.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoInterior.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoInterior.Codigo,//1,// $scope.formData.contractorAddress.mTipoInterior.Codigo,
                  TipoDomicilio: (typeof $scope.formData.contractorAddress.mTipoVia.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoVia.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoVia.Codigo,//0,//parseInt($scope.formData.contractorAddress.mTipoVia.Codigo),
                  TipoNumero: (typeof $scope.formData.contractorAddress.mTipoNumero.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoNumero.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoNumero.Codigo,//1,//$scope.formData.contractorAddress.mTipoNumero.Codigo,
                  TipoZona: (typeof $scope.formData.contractorAddress.mTipoZona.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoZona.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoZona.Codigo,//1,//$scope.formData.contractorAddress.mTipoZona.Codigo,
                  Solicitud: {
                    FechaEfectivoPoliza: $scope.formData.desde,
                    FechaVencimientoPoliza: $scope.formData.hasta,
                    CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
                    CodCiiuPol: $scope.formData.mActEco.CodigoCiiuEmp || $scope.formData.mActEco.codigoCiiuEmp,
                    ColegAseg: $scope.formData.mCentroRiesgo,//(typeof $scope.formData.mCentroRiesgo == 'undefined' || $scope.formData.mCentroRiesgo == null) ? $scope.formData.mCentroRiesgo : '',//'C', //$scope.formData.mCentroRiesgo,
                    DescTrabPol: $scope.formData && $scope.formData.subactividad ? $scope.formData.subactividad.Descripcion : "",
                    FormaPago: $scope.formData.mFrecDeclaracion.Codigo,
                    McaEmiPol: 'S',
                    NumeroMovimiento: '',//$scope.formData.NumeroMovimiento.toString(),
                    NumeroPoliza: $scope.formData.NumeroTicket,
                    NumeroSolicitud: $scope.formData.NroSolicitud.toString()
                  },
                  Riesgo: {
                    CantidadTrabajador: parseInt($scope.formData.mNroTrabajadores),
                    CantidadTrabajadorSal: parseInt($scope.formData.mNroTrabajadores),
                    CodigoCompania: $scope.formData.CodigoCompania,//es 2 si es ambas, cuando es salud solo el codigo de salud y el de pension solo el codigo
                    CodigoRamo: $scope.formData.CodigoRamo,//701,
                    ImportePlanilla: parseInt($scope.formData.mImportePlanillaPension),
                    ImportePlanillaSal: parseInt($scope.formData.mImportePlanillaSalud),
                    Tasa: parseFloat($scope.formData.mTasaPension),
                    TasaSal: parseFloat($scope.formData.mTasaSalud),
                    TipoRiesgo: $scope.formData.TipoRiesgo,//'A',
                    Poliza : {
                      NumeroPoliza: $scope.formData.NumeroTicket,
                      NumeroApli : ''
                    }
                  }
                };
                paramsEmit = polizasFactory.setReferidoNumber(paramsEmit)
            //verificamos si hemos cargado antes o no la planilla antes de emitir
             $scope.formData.isUploading = true;
             sctrEmitFactory.emitirPC(paramsEmit, true).then(function(response){
                $scope.formData.isUploading = false;
                if (response.OperationCode == constants.operationCode.success){
                    $scope.emitPC = response.Data;
                    $scope.formData.paso4Grabado = true;
                    $scope.formData.emitPC = $scope.emitPC ;

                    var nroPolizas = [];
                    if($scope.formData.salud && $scope.formData.pension){
                      $scope.formData.NumeroReciboPension = $scope.emitPC.ReciboPension;
                      $scope.formData.NumeroReciboSalud = $scope.emitPC.ReciboSalud;
                      nroPolizas.push($scope.emitPC.PolizaPension);
                      nroPolizas.push($scope.emitPC.PolizaSalud);
                    }else if($scope.formData.salud){
                      $scope.formData.NumeroReciboSalud = $scope.emitPC.ReciboSalud;
                      nroPolizas.push($scope.emitPC.PolizaSalud);
                    }else if($scope.formData.pension){
                      $scope.formData.NumeroReciboPension = $scope.emitPC.ReciboPension;
                      nroPolizas.push($scope.emitPC.PolizaPension);
                    }

                    if($scope.encuesta.mostrar == 1){
                      $scope.encuesta.numOperacion = nroPolizas.join('-');
                    }

                    $timeout(function(){
					  $scope.formData.encuesta = $scope.encuesta;
                      $scope.$parent.formData = $scope.formData;
                      $state.go('.',{
                          step: 5
                      });
                    }, 500);
                }else if (response.OperationCode === 900){
                    $scope.formData.paso4Grabado = false;
                    mModalAlert.showError(response.Message, 'Error al emitir');
                    $scope.errorEmision = true;
                }else{
                    $scope.formData.paso4Grabado = false;
                    mModalAlert.showError(response.Message, 'Error al emitir');
                }

              });
          }else{
            //PERIODO NORMAL
            var paramsEmit =
                {
                  CodigoSistema: oimAbstractFactory.getOrigin(),
                  CodigoCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.codigo : '',
                  CodigoDepartamento: $scope.formData.contractorAddress.ubigeoData.mDepartamento.Codigo,//$scope.formData.contractorAddress.CodigoDepartamento,
                  CodigoProvincia: $scope.formData.contractorAddress.ubigeoData.mProvincia.Codigo,
                  CodigoDistrito: $scope.formData.contractorAddress.ubigeoData.mDistrito.Codigo,
                  CodigoMoneda: 1,
                  CodigoPais: 'PE',
                  CodigoPostal: $scope.formData.CodigoPostal,//'31', //constants.module.polizas.sctr.codPostal,//viene de servicio
                  CodigoUserReg: 'TRON2000',//$scope.formData.mAgente.codigoUsuario,
                  DescripcionInterior : (typeof $scope.formData.contractorAddress.mNumeroInterior == 'undefined' || $scope.formData.contractorAddress.mNumeroInterior == null) ? '' : $scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNumeroInterior,
                  DescripcionCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.descripcion : '',
                  DescripcionInterior : (typeof $scope.formData.contractorAddress.mNumeroInterior == 'undefined' || $scope.formData.contractorAddress.mNumeroInterior == null) ? '' : $scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNumeroInterior,
                  DescripcionNumero: (typeof $scope.formData.contractorAddress.mNumeroDireccion == 'undefined' || $scope.formData.contractorAddress.mNumeroDireccion == null) ? '' : $scope.formData.contractorAddress.mNumeroDireccion,//'845', //$scope.formData.contractorAddress.mNumeroInterior,
                  DescripcionTrabajo: '.',//$scope.formData.mDescripcionTrabajo,
                  DescripcionZona: (typeof $scope.formData.contractorAddress.mNombreZona == 'undefined' || $scope.formData.contractorAddress.mNombreZona == null) ? '' : $scope.formData.contractorAddress.mNombreZona,//'845', //$scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNombreZona,
                  EmailUsuario: (typeof $scope.formData.mCorreoElectronico == 'undefined' || $scope.formData.mCorreoElectronico == null) ? '' : $scope.formData.mCorreoElectronico,//'DIANA@MULTIPLICA.COM',//$scope.formData.mCorreoElectronico,
                  McaExtCliTron: $scope.formData.McaExtCliTron,
                  NombreDomicilio: $scope.formData.contractorAddress.mNombreVia,
                  NumeroDocumento: $scope.formData.mNumeroDocumento,
                  NumeroMovil: $scope.formData.mTelefonoCelular,
                  RazonSocial: $scope.formData.mRazonSocial,
                  ApellidoPaterno: (typeof $scope.formData.mApePatContratante  == 'undefined') ? '' : $scope.formData.mApePatContratante,
                  ApellidoMaterno: (typeof $scope.formData.mApeMatContratante  == 'undefined') ? '' : $scope.formData.mApeMatContratante,
                  Sexo:  (typeof $scope.formData.mSexo  == 'undefined') ? '' : $scope.formData.mSexo,
                  McaFisico: $scope.formData.McaFisico,
                  CodigoProfesion: (typeof $scope.formData.mProfesion.Codigo  == 'undefined') ? 99 : $scope.formData.mProfesion.Codigo,
                  Profesion: (typeof $scope.formData.mProfesion.Descripcion  == 'undefined') ? '' : $scope.formData.mProfesion.Descripcion,
                  Referencia: '', //$scope.formData.contractorAddress.mDirReferencias,
                  Representante: $scope.formData.mRepresentante,
                  Telefono: $scope.formData.mTelefonoFijo,
                  TipoCargoRep: parseInt($scope.formData.mRepresentanteCargo.Codigo),
                  TipoDocumento: $scope.formData.mTipoDocumento.Codigo,
                  TipoInterior: parseInt((typeof $scope.formData.contractorAddress.mTipoInterior.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoInterior.Codigo == null) ? 3 : $scope.formData.contractorAddress.mTipoInterior.Codigo),//3,//(typeof $scope.formData.contractorAddress.mTipoInterior.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoInterior.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoInterior.Codigo,//1,// $scope.formData.contractorAddress.mTipoInterior.Codigo,
                  TipoDomicilio: (typeof $scope.formData.contractorAddress.mTipoVia.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoVia.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoVia.Codigo,//0,//parseInt($scope.formData.contractorAddress.mTipoVia.Codigo),
                  TipoNumero: (typeof $scope.formData.contractorAddress.mTipoNumero.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoNumero.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoNumero.Codigo,//1,//$scope.formData.contractorAddress.mTipoNumero.Codigo,
                  TipoZona: (typeof $scope.formData.contractorAddress.mTipoZona.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoZona.Codigo == null) ? 0 : $scope.formData.contractorAddress.mTipoZona.Codigo,//1,//$scope.formData.contractorAddress.mTipoZona.Codigo,
                  Solicitud: {
                    FechaEfectivoPoliza: $scope.formData.desde,
                    FechaVencimientoPoliza: $scope.formData.hasta,
                    CodigoAgente: parseInt($scope.formData.mAgente.codigoAgente),
                    CodCiiuPol: $scope.formData.mActEco.CodigoCiiuEmp || $scope.formData.mActEco.codigoCiiuEmp,
                    ColegAseg: $scope.formData.mCentroRiesgo,//(typeof $scope.formData.mCentroRiesgo == 'undefined' || $scope.formData.mCentroRiesgo == null) ? $scope.formData.mCentroRiesgo : '',//'C', //$scope.formData.mCentroRiesgo,
                    DescTrabPol: $scope.formData && $scope.formData.subactividad ? $scope.formData.subactividad.Descripcion : "",
                    FormaPago: $scope.formData.mFrecDeclaracion.Codigo,
                    McaEmiPol: 'S',
                    NumeroMovimiento: '',//$scope.formData.NumeroMovimiento.toString(),
                    NumeroPoliza: $scope.formData.NumeroTicket,
                    NumeroSolicitud: $scope.formData.NroSolicitud.toString()
                  },
                  Riesgo: {
                    CantidadTrabajador: parseInt($scope.formData.mNroTrabajadores),
                    CantidadTrabajadorSal: parseInt($scope.formData.mNroTrabajadores),
                    CodigoCompania: $scope.formData.CodigoCompania,//es 2 si es ambas, cuando es salud solo el codigo de salud y el de pension solo el codigo
                    CodigoRamo: $scope.formData.CodigoRamo,//701,
                    ImportePlanilla: parseInt($scope.formData.mImportePlanillaPension),
                    ImportePlanillaSal: parseInt($scope.formData.mImportePlanillaSalud),
                    Tasa: parseFloat($scope.formData.mTasaPension),
                    TasaSal: parseFloat($scope.formData.mTasaSalud),
                    TipoRiesgo: $scope.formData.TipoRiesgo,//'A',
                    Poliza : {
                      NumeroPoliza: $scope.formData.NumeroTicket,
                      NumeroApli : ''
                    }
                  }
                };
                paramsEmit = polizasFactory.setReferidoNumber(paramsEmit)

            //verificamos si hemos cargado antes o no la planilla antes de emitir
             $scope.formData.isUploading = true;
             sctrEmitFactory.emitirPN(paramsEmit, true).then(function(response){
                $scope.formData.isUploading = false;
                if (response.OperationCode == constants.operationCode.success){
                    $scope.emitPN = response.Data;
                    $scope.formData.paso4Grabado = true;

                    $scope.formData.NumConstancia = $scope.emitPN.NumeroConstancia;
                    $scope.formData.CodigoConstancia = $scope.emitPN.CodigoConstancia;

                    var nroPolizas = [];

                    if($scope.formData.salud && $scope.formData.pension){
                      $scope.formData.NumeroReciboPension = $scope.emitPN.ReciboPension;
                      $scope.formData.NumeroReciboSalud = $scope.emitPN.ReciboSalud;
                      $scope.formData.NumPolizaPension = $scope.emitPN.PolizaPension;
                      $scope.formData.NumPolizaSalud = $scope.emitPN.PolizaSalud;
                      nroPolizas.push($scope.emitPN.PolizaPension);
                      nroPolizas.push($scope.emitPN.PolizaSalud);
                    }else if($scope.formData.salud){
                      $scope.formData.NumeroReciboSalud = $scope.emitPN.ReciboSalud;
                      $scope.formData.NumPolizaSalud = $scope.emitPN.PolizaSalud;
                      nroPolizas.push($scope.emitPN.PolizaSalud);
                    }else if($scope.formData.pension){
                      $scope.formData.NumeroReciboPension = $scope.emitPN.ReciboPension;
                      $scope.formData.NumPolizaPension = $scope.emitPN.PolizaPension;
                      nroPolizas.push($scope.emitPN.PolizaPension);
                    }

                    if($scope.encuesta.mostrar == 1){
                      $scope.encuesta.numOperacion = nroPolizas.join('-');
                    }

                    //console.log($scope.emitPN);

                    $timeout(function(){
					  $scope.formData.encuesta = $scope.encuesta;
                      $scope.$parent.formData = $scope.formData;
                      $state.go('.',{
                          step: 5
                      });
                    }, 2000);
                }else if (response.OperationCode === 900){
                    $scope.formData.paso4Grabado = false;
                    var message = response.Message.replace(/<br\s*\/?>/mg,"\n");
                    mModalAlert.showError(message, 'Error al emitir');
                    $scope.errorEmision = true;
                }else{
                    $scope.formData.paso4Grabado = false;
                    mModalAlert.showError(response.Message, 'Error al emitir');
                }
              });
          }
        }else{
          $scope.hideButtonEmit = false;
          mModalAlert.showError("No tiene un agente seleccionado", "Error");
        }
      };

      function isRuc(){
        $scope.formData.showNaturalRucPerson = !mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
      }
      $scope.requestCancel = function(){

      }

      function isDeficitario(){
        var fdata = $scope.formData;
        if(fdata)
          return fdata.applyDeficitarioValidation;
      }
      $scope.isDeficitario = isDeficitario;
      
      function showModalProcedence() {
        mModalAlert.showWarning('Solicitud de interconexión SCTR restringida para emisión', 'Procedencia').then(function(){
          $state.go('sctrHome');
        });
      }
      
      function isNotEmisa() {
        return $scope.formData.procedencia !== constants.module.polizas.sctr.procedencia;
      }
      
    }]);
});
