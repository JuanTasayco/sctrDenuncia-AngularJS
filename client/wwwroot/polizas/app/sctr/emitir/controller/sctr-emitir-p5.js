(function($root, deps, action){
    define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'
, 'modalSendEmail'
, 'seguroviajeService'
, '/scripts/mpf-main-controls/components/modalAssessment/component/modalAssessment.js'],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('sctrEmitirS5Controller',
    ['$scope', 'oimProxyPoliza', '$state', '$rootScope', 'sctrEmitFactory', 'mModalAlert', '$uibModal', '$stateParams', 'mpSpin', 'oimClaims', 'mainServices', 'proxySctr',
      function($scope, oimProxyPoliza, $state, $rootScope, sctrEmitFactory, mModalAlert, $uibModal, $stateParams, mpSpin, oimClaims, mainServices, proxySctr){

      $scope.downloadRecibo = downloadRecibo;
      function downloadRecibo(ramo,code){
        var nrecibo = $scope.formData["NumeroRecibo" + ramo]
        var urlDonwload = oimProxyPoliza.endpoint +
          helper.formatNamed(oimProxyPoliza.controllerSctr.actions.methodDownloadFactura.path,
            { 'codigoCompania':code  ,'numeroRecibo':nrecibo  ,'tipo': 'RE'});

        window.open(urlDonwload);
      }

      (function onLoad(){

        proxySctr.ValidarAgente().then(function(response){
          if(response.Data && response.Data.Bloqueado == 1){
            $state.go('sctrHome');
          }else{
            $scope.formData = $scope.formData || {};

            if(typeof $scope.formData == 'undefined'){
               $scope.formData.permitir = true;
               $state.go('.',{
                  step: 1
                });
            }
            if($scope.formData.agenteBloqueado){
              $state.go('sctrHome');
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

            if(typeof $scope.formData.TipoRol == 'undefined'){
              setRole();
            }

            if($scope.formData.TipoRol == 'AGT'|| $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){
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
            }else if($scope.formData.TipoRol == 'CLI'){
              $scope.formData.esCliente = true;
            }

            $scope.formData.quotation = $stateParams.quotation;
            $scope.formData.tipoSCTR = $stateParams.tipo;

            if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){
              $scope.formData.pNormal = false;
            }else{
              $scope.formData.pNormal = true;
              $scope.formData.Pagado = true;
            }

            if($scope.formData.quotation > 0){cargarPaso2();cargarPaso3();cargarPaso5();}

            if($scope.formData.paso4Grabado && !$scope.formData.agenteBloqueado){

            }else{
              $state.go('.',{
                step: 4
              });
            }
          }
		  
          if(Object.keys($scope.formData.encuesta).length > 0){
            if($scope.formData.encuesta.mostrar == 1){
              mostrarEncuesta();
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

      function mostrarEncuesta(){
		$scope.encuesta = $scope.formData.encuesta;
        $scope.encuesta.tipo = 'P';
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
            $scope.formData.dataContractor2 = {};
            $scope.formData.dataContractor2.EmailUsuario = $scope.cotizacion[0].EmailUsuario;
            $scope.formData.dataContractor2.Telefono = $scope.cotizacion[0].Telefono;


            if($scope.formData.TipoRol == 'AGT'|| $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){
              $scope.formData.esAgente = true;
            }else{
              $scope.formData.esAdminSus = true;
            }

            $scope.formData.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;
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
              $scope.formData.NumConstancia = $scope.cotizacion[0].Solicitud.NumeroConstancia;
              $scope.formData.CodigoConstancia = $scope.cotizacion[0].Solicitud.CodigoConstancia;
              $scope.formData.factor = [];

              for(var i=0; i<$scope.cotizacion.length; i++){

                if($scope.cotizacion[i].CodigoCompania==3){//salud
                  $scope.formData.primaNetaSalud = $scope.cotizacion[i].Riesgo.Tasa;
                  $scope.formData.subTotalSalud = $scope.cotizacion[i].Riesgo.SubTotal;
                  $scope.formData.factorSalud = $scope.cotizacion[i].Riesgo.Factor;
                  $scope.formData.primaNetaSalud = $scope.cotizacion[i].Riesgo.PrimaNeta;
                  $scope.formData.primaTotalSalud = $scope.cotizacion[i].Riesgo.PrimaTotal;
                  $scope.formData.tasaPC = {
                    Valor2: $scope.cotizacion[i].Riesgo.Tasa
                  };
                }else if($scope.cotizacion[i].CodigoCompania==2){//pension
                  $scope.formData.primaNetaPension = $scope.cotizacion[i].Riesgo.Tasa;
                  $scope.formData.subTotalPension = $scope.cotizacion[i].Riesgo.SubTotal;
                  $scope.formData.factorPension = $scope.cotizacion[i].Riesgo.Factor;
                  $scope.formData.primaNetaPension = $scope.cotizacion[i].Riesgo.PrimaNeta;
                  $scope.formData.primaTotalPension = $scope.cotizacion[i].Riesgo.PrimaTotal;
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
              $scope.formData.NumConstancia = $scope.cotizacion[0].Solicitud.NumeroConstancia;
              $scope.formData.CodigoConstancia = $scope.cotizacion[0].Solicitud.CodigoConstancia;
              paso1($scope.cotizacion);
            }else if($scope.cotizacion[0].CodigoCompania==2){
              $scope.formData.pension = true;
              $scope.formData.CodigoCompania = 2; //pension
              $scope.formData.CodigoRamo = constants.module.polizas.sctr.pension.CodigoRamo;
              $scope.formData.NumeroTicket = $scope.cotizacion[0].NumeroTicket;
              $scope.formData.NumConstancia = $scope.cotizacion[0].Solicitud.NumeroConstancia;
              $scope.formData.CodigoConstancia = $scope.cotizacion[0].Solicitud.CodigoConstancia;
              paso1($scope.cotizacion);
            }

            //paso
            if($scope.cotizacion[0].Solicitud.CodigoEstado == 'AT' ||
              $scope.cotizacion[0].Solicitud.CodigoEstado == 'EM'){
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


        $scope.formData.McaFisico            = ($scope.cotizacion[0].McaFisico == '' )? '' : $scope.cotizacion[0].McaFisico;
        $scope.formData.mSexo                = ($scope.cotizacion[0].Sexo == '' )? '' : $scope.cotizacion[0].Sexo;
        $scope.formData.mProfesion = {};
        $scope.formData.mProfesion.Codigo    = ($scope.cotizacion[0].CodigoProfesion == 0 )? 99 : $scope.cotizacion[0].CodigoProfesion;


        $scope.formData.mActivSunat = {codigo:cotizacion[0].CodigoCiiuEmp, descripcion: cotizacion[0].DescripcionCiiuEmp};

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
          $scope.formData.mProfesion.Codigo    = ($scope.cotizacion[0] == 0 )? 99 : $scope.cotizacion[0].CodigoProfesion;


          $scope.formData.mTelefonoFijo         = $scope.cotizacion[0].Telefono;
          $scope.formData.mTelefonoCelular      = $scope.cotizacion[0].NumeroMovil;
          $scope.formData.mCorreoElectronico    = $scope.cotizacion[0].EmailUsuario;

          $scope.formData.dataContractorAddressClone = helper.clone($scope.formData.dataContractorAddress, true);
          var isload = false;
            $scope.$watch('setterUbigeo', function() {
              if ($scope.setterUbigeo && !isload) {
                  $scope.setterUbigeo($scope.cotizacion[0].Departamento, $scope.cotizacion[0].Provincia, $scope.cotizacion[0].Distrito);
                  isload = true;
              }
            });
        }
      }

      /*#########################
      # Comentarios
      #########################*/
      function listarMensajes(){
        sctrEmitFactory.listarMensajes($scope.formData.quotation, true).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.formData.mensajes = response.Data;
          }
        });
      }

      function cargarPaso5(){

        $scope.formData.paso4Grabado = true;

        var paramsCoti = {

          NumeroSolicitud: $scope.formData.quotation,
          Tipo: 1,
          TipoRol: $scope.formData.TipoRol

        };

        sctrEmitFactory.getCotizacion(paramsCoti, true).then(function(response){

          if (response.OperationCode == constants.operationCode.success){
            $scope.cotizacion = response.Data;

            $scope.formData.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;
            //planilla paso 4
            $scope.formData.planillaCargada = $scope.cotizacion[0].Solicitud.McaTrabajador;

            if($scope.formData.planillaCargada == 'S'){
              $scope.formData.planillaCargada=true;
              $scope.formData.errorFile=0;
              $scope.sinCargar = false;
            }else{
              $scope.formData.planillaCargada=false;
            }

            if($scope.formData.TipoRol == 'AGT'|| $scope.formData.TipoRol == 'EAC' || $scope.formData.TipoRol == 'GST'){
              $scope.formData.esAgente = true;
            }else{
              $scope.formData.esAdminSus = true;
            }

            if($scope.formData.pNormal){// para normal siempre se muestra
              $scope.formData.Pagado = true;
            }

            if($scope.cotizacion.length==2){
              $scope.formData.salud = true;
              $scope.formData.pension = true;

              if(!$scope.formData.pNormal){
                $scope.formData.Pagado = $scope.cotizacion[0].Pagado && $scope.cotizacion[1].Pagado;

                $scope.formData.PagadoS = $scope.cotizacion[0].Pagado;
                $scope.formData.PagadoS = ($scope.formData.PagadoS === 'S') ? true : false;

                $scope.formData.PagadoP = $scope.cotizacion[1].Pagado;
                $scope.formData.PagadoP = ($scope.formData.PagadoP === 'S') ? true : false;
                $scope.formData.ambosPagados = ($scope.formData.PagadoP && $scope.formData.PagadoS) ? true : false;

                if($scope.formData.Pagado == 'N'){
                  $scope.formData.Pagado = false;
                }else if($scope.formData.Pagado == 'S'){
                  $scope.formData.Pagado = true;
                }

              }

              $scope.formData.NumeroReciboPension = $scope.cotizacion[0].Riesgo.NumeroRecibo;
              $scope.formData.NumeroReciboPensionEncrypt = $scope.cotizacion[0].Riesgo.NumeroReciboEncrypt;
              $scope.formData.NumeroReciboSalud = $scope.cotizacion[1].Riesgo.NumeroRecibo;
              $scope.formData.NumeroReciboSaludEncrypt = $scope.cotizacion[1].Riesgo.NumeroReciboEncrypt;
              if($scope.formData.Pagado){
                $scope.formData.NumPolizaPension = $scope.cotizacion[0].Riesgo.NumPoliza;
                $scope.formData.NumPolizaSalud = $scope.cotizacion[1].Riesgo.NumPoliza;
              }

            }else if($scope.cotizacion[0].CodigoCompania==3){//salud
              $scope.formData.salud = true;
              $scope.formData.NumeroReciboSalud = $scope.cotizacion[0].Riesgo.NumeroRecibo;
              $scope.formData.NumeroReciboSaludEncrypt = $scope.cotizacion[0].Riesgo.NumeroReciboEncrypt;
              if(!$scope.formData.pNormal){
                $scope.formData.PagadoS = $scope.cotizacion[0].Pagado;
                $scope.formData.PagadoS = ($scope.formData.PagadoS === 'S') ? true : false;
                $scope.formData.ambosPagados = ($scope.formData.PagadoS) ? true : false;
              }

              if($scope.formData.PagadoS){
                $scope.formData.NumPolizaSalud = $scope.cotizacion[0].Riesgo.NumPoliza;
              }

            }else if($scope.cotizacion[0].CodigoCompania==2){//pension
              $scope.formData.pension = true;
              if(!$scope.formData.pNormal){
                $scope.formData.PagadoP = $scope.cotizacion[0].Pagado;
                $scope.formData.PagadoP = ($scope.formData.PagadoP === 'S') ? true : false;
                $scope.formData.ambosPagados = ($scope.formData.PagadoP) ? true : false;
              }
              $scope.formData.NumeroReciboPension = $scope.cotizacion[0].Riesgo.NumeroRecibo;
              $scope.formData.NumeroReciboPensionEncrypt = $scope.cotizacion[0].Riesgo.NumeroReciboEncrypt;
              if($scope.formData.PagadoP){
                $scope.formData.NumPolizaPension = $scope.cotizacion[0].Riesgo.NumPoliza;
              }
            }

          }
        });
      }

      /*#########################
      # Documentos
      #########################*/

      $scope.getPlantilla = function(){
        sctrEmitFactory.download(constants.module.polizas.sctr.idPlanilla, 'planilla').then(function(response){
          });
      };

      $scope.getTemplate = function(idTemplate){
        sctrEmitFactory.getTemplate(idTemplate);
      };

      $scope.getConstancia = function(){
        sctrEmitFactory.getConstancia($scope.formData.NumConstancia).then(function(response){
          defaultFileName = 'constancia_'+$scope.formData.CodigoConstancia+'.pdf';
          defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
          mainServices.fnDownloadFileBase64(response.Data, "pdf",defaultFileName, false);
        });
      }

      $scope.getCondiciones = function(){
        if($scope.formData.pension && $scope.formData.salud){
          sctrEmitFactory.getCondiciones(2);
        }else if($scope.formData.pension){
          sctrEmitFactory.getCondiciones(2);
        }else if($scope.formData.salud){
          sctrEmitFactory.getCondiciones(3);
        }
      }

      $scope.getRecibo = function(recibo){
        sctrEmitFactory.getRecibo($scope.formData.tipoSCTR, recibo, 'recibo_'+recibo+'.pdf').then(function(response){
          });
      }

      $scope.getPoliza = function(id, numPoliza){
        sctrEmitFactory.getPoliza($scope.formData.tipoSCTR, id, numPoliza, 'OIM_'+numPoliza+'.pdf').then(function(response){
        }, function gpErFn(response) {
          mModalAlert.showError(response.Message, 'Error al descargar el documento');
        });
      }

      $scope.downloadAll = function(){

        if($scope.formData.tipoSCTR==constants.module.polizas.sctr.periodoCorto.TipoPeriodo){

          if($scope.formData.Pagado || $scope.formData.Pagado == 'S'){

            if($scope.formData.pension && $scope.formData.salud){
              $scope.getRecibo($scope.formData.NumeroReciboPensionEncrypt);
              $scope.getRecibo($scope.formData.NumeroReciboSaludEncrypt);
              $scope.getPoliza(2, $scope.formData.NumPolizaPension);
              $scope.getPoliza(3, $scope.formData.NumPolizaSalud);
            }else if($scope.formData.pension){
              $scope.getRecibo($scope.formData.NumeroReciboPensionEncrypt);
              $scope.getPoliza(2, $scope.formData.NumPolizaPension);
            }else if($scope.formData.salud){
              $scope.getRecibo($scope.formData.NumeroReciboSaludEncrypt);
              $scope.getPoliza(3, $scope.formData.NumPolizaSalud);
            }

            $scope.getConstancia();
            $scope.getCondiciones();
            $scope.getTemplate(4);

          }else{
            if($scope.formData.pension && $scope.formData.salud){
              $scope.getRecibo($scope.formData.NumeroReciboPensionEncrypt);
              $scope.getRecibo($scope.formData.NumeroReciboSaludEncrypt);
            }else if($scope.formData.pension){
              $scope.getRecibo($scope.formData.NumeroReciboPensionEncrypt);
            }else if($scope.formData.salud){
              $scope.getRecibo($scope.formData.NumeroReciboSaludEncrypt);
            }
          }
        }else{
          if($scope.formData.pension && $scope.formData.salud){
            $scope.getRecibo($scope.formData.NumeroReciboPensionEncrypt);
            $scope.getRecibo($scope.formData.NumeroReciboSaludEncrypt);
            $scope.getPoliza(2, $scope.formData.NumPolizaPension);
            $scope.getPoliza(3, $scope.formData.NumPolizaSalud);
          }else if($scope.formData.pension){
            $scope.getRecibo($scope.formData.NumeroReciboPensionEncrypt);
            $scope.getPoliza(2, $scope.formData.NumPolizaPension);
          }else if($scope.formData.salud){
            $scope.getRecibo($scope.formData.NumeroReciboSaludEncrypt);
            $scope.getPoliza(3, $scope.formData.NumPolizaSalud);
          }

          $scope.getConstancia();
          $scope.getCondiciones();
          $scope.getTemplate(4);

        }
      }

      /*#######################################
      # SEND EMAIL
      #######################################*/
      $scope.sendEmail = function(){
        $scope.emailData ={
          numeroSolicitud: $scope.formData.NroSolicitud//$scope.formData.quotation
        };

        //Modal
        $scope.optionSendEmail = constants.modalSendEmail.sctr;
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
      }

      $scope.goToPaymentGateway = function(index) {

        if( $scope.cotizacion && $scope.cotizacion.length === 1 ) {
          index = 0;
        }

        if ($scope.formData.emitPC) {
          $scope.formData.NumPolizaPension = $scope.formData.emitPC.PolizaPension;
          $scope.formData.NumPolizaSalud = $scope.formData.emitPC.PolizaSalud;
        }

        $state.go('paymentGateway', {
          paymentParam: {
            policy: {
              policyNumber: $scope.cotizacion ? $scope.cotizacion[index].Riesgo.NumPoliza : index === 0 ? $scope.formData.NumPolizaPension : $scope.formData.NumPolizaSalud,
              quoteNumber: 1,
              codeRamo: index === 0 ? constants.module.polizas.sctr.pension.CodigoRamo : constants.module.polizas.sctr.salud.CodigoRamo
            },
            contractor: {
              firstName: $scope.formData.mRazonSocial,
              lastName: '',
              phoneNumber: $scope.formData.dataContractor2.Telefono,
              email: $scope.formData.dataContractor2.EmailUsuario
            },
            font: 'ico-mapfre-351-myd-sctr'
          }
        });
      };

      function isRuc(){
        $scope.formData.showNaturalRucPerson = !mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
      }

    }]);
});
