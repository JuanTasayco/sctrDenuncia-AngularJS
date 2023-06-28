(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
'/polizas/app/sctr/emitir/service/sctrEmitFactory.js'
],
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('sctrMantenimientoController',
      ['$scope', '$window', '$state', '$timeout', '$uibModal', 'sctrEmitFactory', 'mModalAlert', 'claims', 'oimPrincipal', '$rootScope',
      function($scope, $window, $state, $timeout, $uibModal, sctrEmitFactory, mModalAlert, claims, oimPrincipal, $rootScope){

        console.log('sctrHomeController');

       (function onLoad(){
          $scope.formData = $scope.formData || {};
          $scope.formData.vacio = false;

          /*########################
          # Tipo de producto
          ########################*/
          $scope.estadoData = [{"Codigo":null, "Descripcion":"--Seleccione--", "selectedEmpty":true},{"Codigo": "1","Descripcion":"VIGENTE"}, {"Codigo":"2","Descripcion":"NO VIGENTE"}];
          $scope.estadoDataSus = [{"Codigo": "1","Descripcion":"VIGENTE"}, {"Codigo":"2","Descripcion":"NO VIGENTE"}];
          $scope.estadoDataSusU = [{Codigo: "1", Descripcion:"VIGENTE"}, {Codigo:"2", Descripcion:"NO VIGENTE"}];
          $scope.estadoDataSusN = [{"Codigo":null, "Descripcion":"--Seleccione--", "selectedEmpty":true},{"Codigo": "1","Descripcion":"VIGENTE"}, {"Codigo":"2","Descripcion":"NO VIGENTE"}];

          sctrEmitFactory.getTipoDocumento().then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.tipoDocumentos = response.Data;
            }
          });

          $timeout(function(){
            $scope.filter();
          }, 2000);


        if (claims){
          $scope.formData.claims = {
            codigoUsuario:  claims[2].value.toUpperCase(), //Ejm: DBISBAL //username en el claim
            rolUsuario:     claims[12].value, //'ADMIN'
            nombreAgente:   claims[6].value.toUpperCase(),
            codigoAgente:   claims[7].value //Ejm: 9808 //agendid en el claim
          }
          $scope.userRoot = false;
          if ((oimPrincipal.isAdmin()) && $scope.formData.claims.nombreAgente != ''){
            $scope.userRoot = true;
          }

          $scope.mAgente = {
            codigoAgente: $scope.formData.claims.codigoAgente,
            codigoNombre: $scope.formData.claims.codigoAgente + "-" + $scope.formData.claims.nombreAgente,
            importeAplicarMapfreDolar:0,
            mcamapfreDolar:"",
            codigoEstadoCivil:0,
            codigoUsuario: $scope.formData.claims.codigoUsuario,
            rolUsuario: $scope.formData.claims.rolUsuario
          };
        }

      })();

       $scope.$watch('formData', function(nv)
      {
        $rootScope.formData =  nv;
      })

      $scope.searchOptions = {};

      $scope.searchOptions.filterNumbers = {
        'filterIni': 10
      }
      $scope.searchOptions.limitRow = $scope.searchOptions.filterNumbers.filterIni;   // Máximo número de registros por página

      $scope.searchOptions.pageLimit = 5;
      $scope.searchOptions.pageIni = {number:1, active:true};
      $scope.searchOptions.pageLast = $scope.searchOptions.pageLimit;

      $scope.saveAgent = function(agent){
        $scope.formData.claims.codigoAgente = agent.codigoAgente;
        $scope.mAgente.codigoUsuario = $scope.formData.claims.codigoUsuario;
      }

      $scope.listarCotizacionesVigentes = function(nombre, page){
        if(page==null){page=$scope.currentPage;}
        if($scope.currentPage != page){
          $scope.searchOptions.pageActive = {number:page, active:true};
            $scope.lastPage = page + 1;

             var paramsSuscriptor = {
                NombreCompleto : (typeof nombre == 'undefined') ? '' : nombre,
                CodigoUsuario : (typeof $scope.formData.mUsuario == 'undefined') ? '' : $scope.formData.mUsuario,//$scope.mUsuario
                Estado : (typeof $scope.formData.mEstado.Codigo == 'undefined') ? 1 : $scope.formData.mEstado.Codigo,//$scope.estadoData.Codigo
                CantidadFilasPorPagina: 10,
                PaginaActual: page
              };

            buscarCotizacion(paramsSuscriptor);
        }
      };

      $scope.consultaDocumentosPrev = function(nombre, page){
        if($scope.currentPage != page && page >0){
          if(page>=0){
            $scope.lastPage = page - 1;
            $scope.searchOptions.pageActive = {number:page, active:true};

             var paramsSuscriptor = {
                NombreCompleto : (typeof nombre == 'undefined') ? '' : nombre,
                CodigoUsuario : (typeof $scope.formData.mUsuario == 'undefined') ? '' : $scope.formData.mUsuario,//$scope.mUsuario
                Estado : (typeof $scope.formData.mEstado.Codigo == 'undefined') ? 1 : $scope.formData.mEstado.Codigo,//$scope.estadoData.Codigo
                CantidadFilasPorPagina: 10,
                PaginaActual: page
              };

            buscarCotizacion(paramsSuscriptor);
          }
        }
      }

      $scope.consultaDocumentosNext = function(nombre, page){
        if($scope.currentPage != page){
          if(page<$scope.CantidadTotalPaginas){
            $scope.lastPage = page - 1;
            $scope.searchOptions.pageActive = {number:page, active:true};

            var paramsSuscriptor = {
                NombreCompleto : (typeof nombre == 'undefined') ? '' : nombre,
                CodigoUsuario : (typeof $scope.formData.mUsuario == 'undefined') ? '' : $scope.formData.mUsuario,//$scope.mUsuario
                Estado : (typeof $scope.formData.mEstado.Codigo == 'undefined') ? 1 : $scope.formData.mEstado.Codigo,//$scope.estadoData.Codigo
                CantidadFilasPorPagina: 10,
                PaginaActual: page
              };

            buscarCotizacion(paramsSuscriptor);
          }
        }
      }

      function funDocNumMaxLength(documentType){
        //MaxLength documentType
        switch(documentType) {
          case constants.documentTypes.dni.Codigo:
            $scope.docNumMaxLength = 8;
            break;
          case constants.documentTypes.ruc.Codigo:
            $scope.docNumMaxLength = 11;
            break;
          default:
            $scope.docNumMaxLength = 13;
        }
      }

      $scope.showNaturalPerson = function(item){
        //MaxLength documentType
        funDocNumMaxLength(item.Codigo);
      }

      function buscarCotizacion(paramsSuscriptor){

        sctrEmitFactory.getListSuscriptor(paramsSuscriptor).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.dataSuscriptores = response.Data;
            $scope.showPages = true;
            $scope.formData.suscriptores = $scope.dataSuscriptores.Lista;

            $scope.CantidadTotalPaginas = response.Data.CantidadTotalPaginas; //empezando en 0
            $scope.CantidadTotalFilas = response.Data.CantidadTotalFilas;

            if($scope.CantidadTotalFilas==null){$scope.showCotizaciones = false;$scope.vacio=false;}else{$scope.showCotizaciones = true;$scope.vacio=true;}
          }
        });

      }

      $scope.filter = function(){

        var paramsSuscriptor = {
            NombreCompleto : (typeof $scope.formData.mNombres == 'undefined') ? '' : $scope.formData.mNombres.toUpperCase(),
            CodigoUsuario : (typeof $scope.formData.mUsuario == 'undefined') ? '' : $scope.formData.mUsuario.toUpperCase(),//$scope.mUsuario
            Estado : (typeof $scope.formData.mEstado.Codigo == 'undefined') ? 1 : $scope.formData.mEstado.Codigo,//$scope.estadoData.Codigo
            CantidadFilasPorPagina: 10,
            PaginaActual: 1
          };

        buscarCotizacion(paramsSuscriptor);
      }

      $scope.getNumber = function(num) {
        if(num==0 || num==null){$scope.showCotizaciones = false;}else{
          $scope.showCotizaciones = true;
          return new Array(num);
        }
      }

      $scope.clearFilter = function(){
        $scope.formData.mNombres = '';
        $scope.formData.mUsuario = '';
        $scope.formData.mEstado = {"Codigo": "0","Descripcion":"TODOS"};
      }

      /*########################
      # showModal
      ########################*/
      $scope.showModal = function(index, sus){
        $scope.message = false;
         // $scope.buscarSuscriptor(sus);
         $scope.getSuscriptor(sus);

        //Modal
        var vModal = $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-edit-mant.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.closeModal = function () {
              $uibModalInstance.close();
              if(!$scope.message)
                $scope.filter();
            };
            //
          }]
        });
      }

      $scope.showModalAddSuscrit = function(option, index, event){
        $scope.message = false;
        $scope.usuarioNoExiste = false;
        $scope.formData.mCodigoSus = '';

        $scope.formData.mNombreSus = '';
        $scope.formData.mApelPSus = '';
        $scope.formData.mApelMSus = '';

        $scope.formData.mNumDocSus = '';
        $scope.formData.mEmailSus = '';

        //Modal
        var vModal = $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-add-suscrit.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.closeModal = function () {
              $uibModalInstance.close();
              $scope.filter();
            };
            //
          }]
        });
      }

      $scope.showModalEditSuscrit = function(index, sus){
        $scope.message = false;
        $scope.formData.mCodigo = '';
        $scope.formData.newSuscriptores = [];

        $scope.formData.suscriptorPadre = sus.CodigoUsuario;
        $scope.formData.suscriptorPadreCod = sus.CodigoSuscriptor;

        $scope.getListOficina();

        //Modal
        $scope.vModalEditarAsignacion = $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl : '/polizas/app/sctr/mantenimiento/controller/modal-edit-suscrit.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.closeModal = function () {
              $uibModalInstance.close();
              $scope.filter();
            };
            //
          }]
        });
      }

      $scope.getListOficina = function(){

        var paramsOficina = {
          CodigoOficina : (typeof $scope.formData.mCodigo == 'undefined') ? '' : $scope.formData.mCodigo,
          NombreOficina : (typeof $scope.formData.mValor == 'undefined') ? '' : $scope.formData.mValor.toUpperCase()
        };

         sctrEmitFactory.getListOficina(paramsOficina, true).then(function(response){
          if (response.OperationCode == constants.operationCode.success){
            $scope.formData.oficinas = response.Data;
          }
        });
      }

      $scope.agregarSuscriptor = function(ofi, model){

        if(ofi){
          if(ofi.Indice)
            $scope.tipoUpdate = 1;
          else
            $scope.tipoUpdate = 2;

           var paramsSus = {
            CodigoSuscriptor : (typeof $scope.formData.suscriptorPadreCod == 'undefined') ? '' : $scope.formData.suscriptorPadreCod,
            CodigoOficina : ofi.CodigoOficina,
            NombreOficina : ofi.NombreOficina,
            CodigoUsuario : $scope.formData.suscriptorPadre,
            Tipo: $scope.tipoUpdate,//1,//1 asignar y 2 desasignar
            Grabado: ofi.Indice
          };
          var repetido = false;
          $scope.suscriptoresLength = $scope.formData.newSuscriptores.length;
          for(var i=0; i<$scope.suscriptoresLength; i++){
            if($scope.formData.newSuscriptores[i].CodigoOficina == ofi.CodigoOficina){
              repetido = true;
              break;
            }
          }
          if(!repetido){// si no existe lo agrego
            $scope.formData.newSuscriptores.push(paramsSus);
          }
        }else{//si ya esta agregado cambio el estado
          $scope.suscriptoresLength = $scope.formData.newSuscriptores.length;
          for(var i=0; i<$scope.suscriptoresLength; i++){
            if($scope.formData.newSuscriptores[i].CodigoOficina == ofi.CodigoOficina){
              $scope.formData.newSuscriptores[i].Grabado = false;
              break;
            }
          }
        }
      }

      $scope.grabarOficina = function(){

        $scope.formData.sendSuscriptores = [];
        $scope.suscriptoresLength = $scope.formData.newSuscriptores.length;
        for(var i=0; i<$scope.suscriptoresLength; i++){
            $scope.formData.sendSuscriptores.push($scope.formData.newSuscriptores[i]);
        }

        var paramsOficina = $scope.formData.sendSuscriptores;

        if(paramsOficina.length > 0){
          sctrEmitFactory.saveSuscriptorOficina(paramsOficina, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.respuesta = 'Se ha grabado los datos ingresados';
              $scope.message = true;
            }else{
              mModalAlert.showError(response.Message, 'Error');
            }
            //$scope.vModalEditarAsignacion.close();
          });
        }
      }

      $scope.buscarSuscriptor = function(usuario){
        var userSus;

        if(typeof usuario.CodigoUsuario == 'undefined'){
          userSus = usuario.toUpperCase();
        }else{
          userSus = usuario.CodigoUsuario.toUpperCase();
        }

        if(usuario !='' && typeof usuario != 'undefined'){
          $scope.formData.vacio = false;
          var usuarioOIM = {
            CodigoUsuario: userSus,//usuario.CodigoUsuario.toUpperCase(),//$scope.mAgente.codigoUsuario,
            Tipo: 1
          };

          sctrEmitFactory.getUsuarioOim(usuarioOIM, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.formData.suscriptorPadre = userSus;//usuario.CodigoUsuario;
              $scope.formData.suscriptorPadreCod = usuario.CodigoSuscriptor;
              $scope.usuarioNoExiste = false;

              $scope.formData.suscriptor = response.Data;
              $scope.formData.mCodigoSus = $scope.formData.suscriptor.CodigoUsuario;

              $scope.formData.mNombreSus = $scope.formData.suscriptor.Nombres;
              $scope.formData.mApelPSus = $scope.formData.suscriptor.ApellidoPaterno;
              $scope.formData.mApelMSus = $scope.formData.suscriptor.ApellidoMaterno;

              $scope.formData.mTipoDocumentoSus = {
                  Codigo: $scope.formData.suscriptor.TipoDocumento,
                  Descripcion: $scope.formData.suscriptor.TipoDocumento
                };
              $scope.formData.mNumDocSus = $scope.formData.suscriptor.CodigoDocumento;
              $scope.formData.mEmailSus = $scope.formData.suscriptor.Correo;
              //$scope.formData.mEstadoSus = {};
              //$scope.formData.mEstadoSus.Codigo = $scope.formData.suscriptor.Estado;

            }else{
              $scope.usuarioNoExiste = true;
            }
          });
        }else{
          $scope.formData.vacio = true;
        }
      }

      $scope.getSuscriptor = function(usuario){

        var userSus;

        if(usuario !='' && typeof usuario != 'undefined'){
          $scope.formData.vacio = false;

          sctrEmitFactory.getSuscriptor(usuario.CodigoSuscriptor, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.formData.suscriptorPadre = userSus;//usuario.CodigoUsuario;
              $scope.formData.suscriptorPadreCod = usuario.CodigoSuscriptor;

              $scope.formData.suscriptor = response.Data;
              $scope.formData.mCodigoSus = $scope.formData.suscriptor.CodigoUsuario;

              $scope.formData.mNombreSus = $scope.formData.suscriptor.Nombres;
              $scope.formData.mApelPSus = $scope.formData.suscriptor.ApellidoPaterno;
              $scope.formData.mApelMSus = $scope.formData.suscriptor.ApellidoMaterno;

              $scope.formData.mTipoDocumentoSus = {
                  Codigo: $scope.formData.suscriptor.TipoDocumento,
                  Descripcion: $scope.formData.suscriptor.TipoDocumento
                };

              $scope.formData.mNumDocSus = $scope.formData.suscriptor.CodigoDocumento;
              $scope.formData.mEmailSus = $scope.formData.suscriptor.Correo;
              $scope.formData.mEstadoSus = {};
              $scope.formData.mEstadoSus.Codigo = $scope.formData.suscriptor.Estado;


            }else{
              mModalAlert.showError(response.Message, 'Error');
            }
          });
        }else{
          $scope.formData.vacio = true;
        }
      }

      $scope.saveSuscriptor = function(){//guarda y/o actualiza

        $scope.formData.frmMaintenanceForm.markAsPristine();
        if(typeof $scope.formData.mTipoDocumentoSus != 'undefined'
          && $scope.formData.mCodigoSus!=''
          && $scope.formData.mNombreSus!=''
          && $scope.formData.mApelMSus!=''
          && $scope.formData.mNumDocSus!=''
          && $scope.formData.mEstadoSusN.Codigo){
            var paramsSuscriptor = {
              CodigoUsuario: $scope.formData.mCodigoSus,
              ApellidoPaterno: $scope.formData.mApelPSus,
              ApellidoMaterno: $scope.formData.mApelMSus,
              Nombres: $scope.formData.mNombreSus,
              TipoDocumento: $scope.formData.mTipoDocumentoSus.Codigo,
              CodigoDocumento: $scope.formData.mNumDocSus,
              Correo: $scope.formData.mEmailSus,
              Estado: $scope.formData.mEstadoSusN.Codigo,
              UsuarioCreacion : $scope.mAgente.codigoUsuario
            };

             sctrEmitFactory.saveSuscriptor(paramsSuscriptor, true).then(function(response){
              if (response.OperationCode == constants.operationCode.success){
                $scope.respuesta = 'Se ha registrado al suscriptor con éxito';
                $scope.message = true;
                $scope.filter();
              }else{
                mModalAlert.showError(response.Message, 'Error');
              }
            });
        }

      }

      $scope.saveMaintenance = function(){
       $scope.formData.frmMaintenanceUpForm.markAsPristine();

        if($scope.formData.mEstadoSus.Codigo != null){
          var paramsSuscriptor = {
            CodigoUsuario: $scope.formData.mCodigoSus,
            ApellidoPaterno: $scope.formData.mApelPSus,
            ApellidoMaterno: $scope.formData.mApelMSus,
            Nombres: $scope.formData.mNombreSus,
            TipoDocumento: $scope.formData.mTipoDocumentoSus.Codigo,
            CodigoDocumento: $scope.formData.mNumDocSus,
            Correo: $scope.formData.mEmailSus,
            Estado: (typeof $scope.formData.mEstadoSus.Codigo == 'undefined') ? $scope.formData.suscriptor.Estado : $scope.formData.mEstadoSus.Codigo,
            UsuarioCreacion : $scope.mAgente.codigoUsuario
          };

          sctrEmitFactory.saveSuscriptor(paramsSuscriptor, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              $scope.respuesta = 'Se ha actualizado los datos del suscriptor con éxito';
              $scope.message = true;
              $scope.filter();
            }else{
              mModalAlert.showError(response.Message, 'Error');
            }
          });
          $scope.formData.EstadoRequired = false;
        }else{
          $scope.formData.EstadoRequired = true;
        }
      }

    }])
    .factory('loaderSctrSuscriptoresController', ['sctrEmitFactory', '$q', 'mpSpin', 'oimPrincipal',
      function(sctrEmitFactory, $q, mpSpin, oimPrincipal){
        var claims;
        //Claims
        function getClaims(){
         var deferred = $q.defer();
          sctrEmitFactory.getClaims().then(function(response){
            //
            // console.log(JSON.stringify(response));
            //
            claims = response;
            deferred.resolve(claims);
          }, function (error){
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }

        return {
          getClaims: function(){
            if(claims) return $q.resolve(claims);
            return getClaims();
          }
        }
      }
    ])
    .directive('showFilter', ['$window', '$timeout', function($window,$timeout){
      // Runs during compile
      return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, element, attrs) {
          // console.log('Llamando directiva... ');
          var w = angular.element($window);
          function showFilterBox(){
            // console.log($window.innerWidth);
            scope.isFilterVisible = false;
            var isDesktop = $window.innerWidth > 991;
            var heightDevice = $window.innerHeight;
            if (isDesktop) {
              element.css('top', 'auto');
            } else {
              element.css('top', heightDevice - 70 + 'px');
            }
            scope.toggleFilter = function(){
              // console.log('Activando filtro... '+ $window.innerWidth + 'x' + $window.innerHeight);
              var isDesktop = $window.innerWidth > 991;
              var filterBox = document.getElementsByClassName('g-col-filter__box');
              filterBox[0].style.height = heightDevice - 105 + 'px';

              if (isDesktop) {
                document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                return;
              } else {
                scope.isFilterVisible = !scope.isFilterVisible;
                if (scope.isFilterVisible) {
                  document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
                } else {
                  document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                }
              }
            }
          }
          $timeout(init, false);
          function init(){ showFilterBox(); }
          // **************************************************
          // Script cuando pasa de portrait a layout en Tablet
          // **************************************************
          w.bind('resize', function(){
            // console.log('Resize... ', $window.innerWidth);
            var isDesktop = $window.innerWidth > 991;
            var heightDevice = $window.innerHeight;
            if (isDesktop) {
              // console.log('Es desktop... ');
              // scope.isFilterVisible = false;
              element.css('top', 'auto');
              document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
              return;
            } else {
              element.css('top', heightDevice - 70 + 'px');
              if (scope.isFilterVisible) {
                document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
              }
            }
          });
        }
      };
    }]);

  });
