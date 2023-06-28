define([
    'angular', 'constants', 'mpfModalConfirmationSteps'
  ], function (angular, constants) {
    'use strict';
  
    angular
      .module(constants.module.polizas.epsEmpresa.moduleName)
      .controller('mantenimientoEpsEmpresaController', MantenimientoEpsEmpresaController);
  
      MantenimientoEpsEmpresaController.$inject = [ '$scope', '$state', '$window', 'epsEmpresaFactory', 'epsEmpresaService' , '$uibModal'];
  
    function MantenimientoEpsEmpresaController($scope, $state, $window , epsEmpresaFactory, epsEmpresaService , $uibModal) {
      var vm = this;

      //variables
      vm.grupos = [];
      vm.estados = [{valor: 1, descripcion: 'Habilitado'},{valor: 2, descripcion: 'Deshabilitado'}]
      vm.mantenimiento_parametros = {};
      vm.filter_parametros = {};
      vm.totalParametros = 0;
      vm.paginaActualParametros = 1;
      vm.showNumberRows = 10;

      vm.form_rangos = { idTarifa: 0, desde : '', hasta : '', tarifaPersona : ''};
      vm.mantenimiento_rangos = {};
      vm.paginaActualRangos = 1;
      vm.totalRangos = 0;
      vm.tarifaPlan = {};

      vm.mensajeError = '';
      vm.mensajeExito = '';
      vm.mensajeErrorTarifa = '';
      vm.mensajeExitoTarifa = '';


      //funciones
      vm.cambioTipoParametro = CambioTipoParametro;
      vm.changePageParametros = ChangePageParametros;
      vm.guardarTarifa = GuardarTarifa;
      vm.activeBotonGuardar = ActiveBotonGuardar;
      vm.changePageTarifas = ChangePageTarifas;
      vm.eliminarTarifa = EliminarTarifa;
      vm.setTimeoutClearMessages = SetTimeoutClearMessages;
      vm.setTimeoutClearMessagesTarifa = SetTimeoutClearMessagesTarifa;
      vm.mostrarErrorInterno = MostrarErrorInterno;

      (function load_MantenimientoEpsEmpresaController(){
        
        var storage = $window.localStorage;
        var subMenu = angular.fromJson(storage['evoSubMenuEMISA']);
        var menus = subMenu.filter(function(x) { return x.nombreCabecera === "EPSEMPRESA"})[0] ? subMenu.filter(function(x) { return x.nombreCabecera === "EPSEMPRESA"})[0].items : [];
        if(menus.length >0){
          var opc = [];
          opc =  menus.filter(function(x) { return  x.nombreCorto == 'EPSMANT'});
          if(opc.length === 0){
            return $state.go(constantsEpsEmpresa.ROUTES.HOME, {}, { reload: true, inherit: false });
          }
        }

        $scope.formParametro = $scope.formParametro || {};
        $scope.formEditParametro = $scope.formEditParametro || {};
        $scope.formEditTarifa = $scope.formEditTarifa || {};

        epsEmpresaService.getListParametros().then(function (response) { 
          if(response.rows) epsEmpresaFactory.setParametros(response.rows);
          vm.tarifaPlan = epsEmpresaFactory.getParametro("TARIFA_PLAN");
        }).catch(function() {
          _mostrarErrorInterno();
        });

        epsEmpresaService.getListParametros(100, '', 1).then(function (response) {
          if(response.rows) {
            epsEmpresaFactory.setGrupos(response.rows);
            vm.grupos = epsEmpresaFactory.getGrupos();
            epsEmpresaFactory.setMantenimientoParametros(response.rows.slice(0,10)).then(function() {
              vm.mantenimiento_parametros = epsEmpresaFactory.getMantenimientoParametros();
              if(response.total && response.rows.length > 0 )
              {
                vm.totalParametros = response.total;
              }
              $scope.$apply();
            });
          }
        }).catch(function() {
          _mostrarErrorInterno();
        });
        ChangePageTarifas(1);
      })();

      function CambioTipoParametro(seleccion){
        if (angular.isUndefined(seleccion)) {
          vm.filter_parametros.mTipoParametro = void(0);
          vm.filter_parametros.tipoParametro = '';
        }else{
          vm.filter_parametros.tipoParametro = seleccion.valor;
        }
        epsEmpresaService.getListParametros(10, vm.filter_parametros.tipoParametro, 1).then(function (response) {
          if(response.rows) {
            epsEmpresaFactory.setMantenimientoParametros(response.rows).then(function() {
              vm.mantenimiento_parametros = epsEmpresaFactory.getMantenimientoParametros();
              if(response.total && response.rows.length > 0 )
              {
                vm.totalParametros = response.total;
              }
              $scope.$apply();
            });
          }
        });
      }

      function ChangePageParametros(indexPage){
        vm.paginaActualParametros = indexPage;
        epsEmpresaService.getListParametros(10, vm.filter_parametros.tipoParametro, vm.paginaActualParametros).then(function (response) {
          if(response.rows) {
            epsEmpresaFactory.setMantenimientoParametros(response.rows).then(function(){
              vm.mantenimiento_parametros = epsEmpresaFactory.getMantenimientoParametros();
              if(response.total && response.rows.length > 0 )
              {
                vm.totalParametros = response.total;
              }
              $scope.$apply();
            });
          }
        }).catch(function() {
          _mostrarErrorInterno();
        });
      }

      function ActiveBotonGuardar(){
        return vm.form_rangos != {} && vm.form_rangos.desde != '' && vm.form_rangos.hasta != '' && vm.form_rangos.tarifaPersona != '';
      }

      function GuardarTarifa(){
        if(vm.activeBotonGuardar()){
          $scope.dataConfirmation = {
            save: false,
            title: '¿Desea grabar una nueva tarifa?',
            lblClose: 'Cancelar',
            lblSave: 'Confirmar'
          };
          var vModalSteps = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.close = function () {
                $uibModalInstance.close();
              };
            }]

          });
          vModalSteps.result.then(function () {
            var dataConfirmationWatch = $scope.$watch('dataConfirmation', function (value) {
              if (value.save) _guardarTarifa();
            });
            $scope.$on('$destroy', function () { dataConfirmationWatch(); });
          }, function () { });
        }
      }
      
      function EliminarTarifa(tarifaId){
        $scope.dataConfirmation = {
          save: false,
          title: '¿Desea eliminar una tarifa?',
          lblClose: 'Cancelar',
          lblSave: 'Eliminar'
        };
        var vModalSteps = $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
          controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
            $scope.close = function () {
              $uibModalInstance.close();
            };
          }]

        });
        vModalSteps.result.then(function () {
          var dataConfirmationWatch = $scope.$watch('dataConfirmation', function (value) {
            if (value.save) _eliminarTarifa(tarifaId);
          });
          $scope.$on('$destroy', function () { dataConfirmationWatch(); });
        }, function () { });
      }

      function _guardarTarifa(){
        var tarifaDTO = _crearObjetoDTOTarifa(vm.form_rangos);

        epsEmpresaService.addTarifa(tarifaDTO).then(function(response){
          _clearFormTarifa();
          ChangePageTarifas(1);
          vm.mensajeExitoTarifa = 'Se grabo exitosamente la nueva tarifa';
          vm.setTimeoutClearMessagesTarifa();
        },function (error) {
          if(error.status === 500) { vm.mostrarErrorInterno(); }
          if(error.status === 400) {
              if(error.message){
                vm.mensajeErrorTarifa = error.message;
              }else{
                vm.mensajeErrorTarifa = 'Error al guardar nueva tarifa';
              }
              vm.setTimeoutClearMessagesTarifa();
          }
        });
      }

      function _eliminarTarifa(tarifaId){
        epsEmpresaService.deleteTarifa(tarifaId).then(function(response){
          ChangePageTarifas(1);
          vm.mensajeExitoTarifa = 'Se elimino exitosamente la tarifa';
          vm.setTimeoutClearMessagesTarifa();
        },function (error) {
          if(error.status === 500) { vm.mostrarErrorInterno(); }
          if(error.status === 400) {
              if(error.message){
                vm.mensajeErrorTarifa = error.message;
              }else{
                vm.mensajeErrorTarifa = 'Error al eliminar la tarifa';
              }
              vm.setTimeoutClearMessagesTarifa();
          }
        });
      }

      function _crearObjetoDTOTarifa(objectTarifa){
        var tarifa = 
        {
            data: {
                idTarifa : objectTarifa.idTarifa,
                desde : objectTarifa.desde,
                hasta: objectTarifa.hasta,
                tarifa: objectTarifa.tarifaPersona
            },
            metadata: {
                emailUsuario: 'lmvega@stefanini.com',
                fecha: Date.now().toString(),
                origen: 'OIM',
                usuario: 'LMVEGA'
            }
        };
        return tarifa;
      }

      function _clearFormTarifa(){
        vm.form_rangos = { idTarifa: 0, desde : '', hasta : '', tarifaPersona : ''};
      }

      function SetTimeoutClearMessages(){
        setTimeout(function(){
          vm.mensajeError = ''
          vm.mensajeExito = ''
          $scope.$apply();
        }, 5000);
      }

      function SetTimeoutClearMessagesTarifa(){
        setTimeout(function(){
          vm.mensajeErrorTarifa = ''
          vm.mensajeExitoTarifa = ''
          $scope.$apply();
        }, 5000);
      }

      function MostrarErrorInterno() {
        return $state.go(constantsEpsEmpresa.ROUTES.ERROR_INTERNO, {}, { reload: true, inherit: false });
      }

      function ChangePageTarifas(indexPage){
        vm.paginaActualRangos = indexPage;

        epsEmpresaService.getListTarifas(vm.showNumberRows, indexPage, 0).then(function (response) {
          if(response.rows) {
            epsEmpresaFactory.setTarifas(response.rows);
            vm.mantenimiento_rangos = epsEmpresaFactory.getTarifas();
            vm.totalRangos = response.total;
          }
        }).catch(function() {
          _mostrarErrorInterno();
        });
      }

      function _mostrarErrorInterno() {
        return $state.go(constantsEpsEmpresa.ROUTES.ERROR_INTERNO, {}, { reload: true, inherit: false });
      }

      $scope.showModalAddParameter = function(option, index, event){
        $scope.message = false;
        $scope.usuarioNoExiste = false;

        $scope.formParametro.mTipoParametro = void(0);
        $scope.formParametro.tipoParametro = '';
        $scope.formParametro.descripcion = '';
        $scope.formParametro.valorNumerico = '';
        $scope.formParametro.valorTexto = '';
        $scope.formParametro.orden = '';
        $scope.formParametro.mEstado = void(0);
        $scope.formParametro.estado = 0;

        //Modal
        var vModal = $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          windowTopClass:'popup',
          templateUrl : '/polizas/app/eps-empresa/views/mantenimiento/modal/modal-add-parametro.html',
          controller : ['$scope', '$uibModalInstance', 'epsEmpresaService', function($scope, $uibModalInstance, epsEmpresaService) {
            //CloseModal
            $scope.closeModal = function () {
              $uibModalInstance.close();
            };

            $scope.cambioTipoParametroNuevo = function(seleccion){
              if (angular.isUndefined(seleccion)) {
                $scope.formParametro.mTipoParametro = null;
                $scope.formParametro.tipoParametro = '';
              }else{
                if($scope.formParametro.mTipoParametro.descripcion == "PORCENTAJE_PLAN") {
                  $scope.formParametro.mDescripcion = null;
                  $scope.formParametro.descripcion = '';
                }
                $scope.formParametro.tipoParametro = seleccion.valor;
                if($scope.formParametro.mTipoParametro.descripcion != "PORCENTAJE_PLAN") {
                  $scope.formParametro.orden = '';
                }
              }
            }

            $scope.cambioTarifaPlan = function(seleccion){
              if (angular.isUndefined(seleccion)) {
                $scope.formParametro.mDescripcion = null;
                $scope.formParametro.descripcion = '';
                $scope.formParametro.orden = '';
              }else{
                $scope.formParametro.descripcion = seleccion.descripcion;
                $scope.formParametro.orden = seleccion.valorNumerico;
              }
            }

            $scope.cambioEstadosNuevo = function(seleccion){
              if (angular.isUndefined(seleccion)) {
                $scope.formParametro.mEstado = null;
                $scope.formParametro.estado = '';
              }else{
                $scope.formParametro.estado = seleccion.valor;
              }
            }

            $scope.activeBotonGuardar = function(){
              return $scope.formParametro.tipoParametro != '' && $scope.formParametro.estado != '' && $scope.formParametro.descripcion != '' && (($scope.formParametro.valorNumerico != '' && !isNaN($scope.formParametro.valorNumerico)) || $scope.formParametro.valorTexto != '');
            }

            $scope.guardarParametro = function(){
              var parametroDTO = $scope._crearObjetoDTOParametro($scope.formParametro);
              epsEmpresaService.addParametro(parametroDTO).then(function(response){
                if(response.grupo === 'PORCENTAJE_PLAN' || response.grupo === 'NUMERO_TRABAJADORES' || response.grupo === 'CORREO_REMITENTE'){
                  if(response.activo === 1){
                    vm.mensajeExito = 'Se guardo correctamente, El registro anterior fue deshabilitado';
                  }else{
                    vm.mensajeExito = 'Se guardo correctamente';
                  }
                }else{
                  vm.mensajeExito = 'Se guardo correctamente';
                }
                vm.setTimeoutClearMessages();
                $scope.closeModal();
                vm.changePageParametros(1);
              },function (error) {
                if(error.status === 500) { vm.mostrarErrorInterno(); }
                if(error.status === 400) {
                    if(error.data.errors[0]){
                      vm.mensajeError = 'Error al guardar nuevo parametro. ' +  error.data.errors[0];
                    }else{
                      vm.mensajeError = 'Error al guardar nuevo parametro';
                    }
                    vm.setTimeoutClearMessages();
                    $scope.closeModal();
                }
              });
            }

            $scope._crearObjetoDTOParametro = function(objectParametro){
              var parametro = 
              {
                  data: {
                      idParametro : objectParametro.idParametro,
                      grupo : objectParametro.tipoParametro,
                      descripcion: (objectParametro.descripcion != '' ? objectParametro.descripcion : null),
                      valorNumerico: (objectParametro.valorNumerico == '' || isNaN(objectParametro.valorNumerico || +objectParametro.valorNumerico == 0) ? null : (objectParametro.tipoParametro == 'PORCENTAJE_PLAN' ? (+objectParametro.valorNumerico/100): objectParametro.valorNumerico)),
                      valorTexto: (objectParametro.valorTexto !== '' ? objectParametro.valorTexto : null),
                      orden: (objectParametro.orden == '' || isNaN(objectParametro.orden || +objectParametro.orden == 0) ? null : objectParametro.orden),
                      activo: objectParametro.estado
                  },
                  metadata: {
                      emailUsuario: 'lmvega@stefanini.com',
                      fecha: Date.now().toString(),
                      origen: 'OIM',
                      usuario: 'LMVEGA'
                  }
              };
              return parametro;
            }
          }]
        });
      }

      $scope.showModalEditParameter = function(idParametro){
        $scope.message = false;
        $scope.usuarioNoExiste = false;
        epsEmpresaService.getParametro(idParametro).then(function(response){
          $scope.formEditParametro.idParametro = response.idParametro;
          $scope.formEditParametro.mTipoParametro = { valor : response.grupo, descripcion : response.grupo };
          $scope.formEditParametro.tipoParametro = response.grupo;
          var actualTarifa = vm.tarifaPlan.filter(function(x){ return x.valorNumerico == response.orden });
          if(actualTarifa.length > 0) $scope.formEditParametro.mDescripcion = { valorNumerico : actualTarifa[0].valorNumerico, descripcion: actualTarifa[0].descripcion };
          $scope.formEditParametro.descripcion = response.descripcion;
          $scope.formEditParametro.valorNumerico = (response.grupo == 'PORCENTAJE_PLAN' ? (+response.valorNumerico*100): response.valorNumerico);
          $scope.formEditParametro.valorTexto = response.valorTexto;
          $scope.formEditParametro.orden = response.orden;
          $scope.formEditParametro.mEstado = { valor: response.activo, descripcion: (response.activo === 1 ? 'Habilitado': 'Deshabilitado')};
          $scope.formEditParametro.estado = response.activo;

          //Modal
          var vModal = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            windowTopClass:'popup',
            templateUrl : '/polizas/app/eps-empresa/views/mantenimiento/modal/modal-edit-parametro.html',
            controller : ['$scope', '$uibModalInstance', 'epsEmpresaService', function($scope, $uibModalInstance, epsEmpresaService) {
              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };

              $scope.cambioTipoParametroNuevo = function(seleccion){
                if (angular.isUndefined(seleccion)) {
                  $scope.formEditParametro.mTipoParametro = void(0);
                  $scope.formEditParametro.tipoParametro = '';
                }else{
                  if($scope.formEditParametro.tipoParametro === 'PORCENTAJE_PLAN') {
                    $scope.formEditParametro.mDescripcion = void(0);
                    $scope.formEditParametro.descripcion = '';
                  }
                  $scope.formEditParametro.tipoParametro = seleccion.valor;
                  if($scope.formEditParametro.tipoParametro !== 'PORCENTAJE_PLAN') {
                    $scope.formEditParametro.orden = '';
                  }
                }
              }

              $scope.cambioTarifaPlan = function(seleccion){
                if (angular.isUndefined(seleccion)) {
                  $scope.formEditParametro.mDescripcion = void(0);
                  $scope.formEditParametro.descripcion = '';
                  $scope.formEditParametro.orden = '';
                }else{
                  $scope.formEditParametro.descripcion = seleccion.descripcion;
                  $scope.formEditParametro.orden = seleccion.valorNumerico;
                }
              }

              $scope.cambioEstadosNuevo = function(seleccion){
                if (angular.isUndefined(seleccion)) {
                  $scope.formEditParametro.mEstado = void(0);
                  $scope.formEditParametro.estado = '';
                }else{
                  $scope.formEditParametro.estado = seleccion.valor;
                }
              }

              $scope.activeBotonGuardar = function(){
                return !(($scope.formEditParametro.tipoParametro === 'PORCENTAJE_PLAN' || $scope.formEditParametro.tipoParametro === 'NUMERO_TRABAJADORES' || $scope.formEditParametro.tipoParametro === 'CORREO_REMITENTE') && $scope.formEditParametro.estado === 2) && ($scope.formEditParametro.tipoParametro != '' && $scope.formEditParametro.estado != '' && $scope.formEditParametro.descripcion != '' && (($scope.formEditParametro.valorNumerico != '' && !isNaN($scope.formEditParametro.valorNumerico)) || $scope.formEditParametro.valorTexto != ''));
              }

              $scope.guardarParametro = function(){
                var parametroDTO = $scope._crearObjetoDTOParametro($scope.formEditParametro);

                epsEmpresaService.putParametro(idParametro, parametroDTO).then(function(response){
                  if(response.grupo === 'PORCENTAJE_PLAN' || response.grupo === 'NUMERO_TRABAJADORES' || response.grupo === 'CORREO_REMITENTE'){
                    if(response.activo === 1){
                      vm.mensajeExito = 'Se edito correctamente, El registro anterior fue deshabilitado';
                    }else{
                      vm.mensajeExito = 'Se edito correctamente';
                    }
                  }else{
                    vm.mensajeExito = 'Se edito correctamente';
                  }
                  vm.setTimeoutClearMessages();
                  $scope.closeModal();
                  vm.changePageParametros(1);
                },function (error) {
                  if(error.status === 500) { vm.mostrarErrorInterno(); }
                  if(error.status === 400) {
                      if(error.message){
                        vm.mensajeError = error.message;
                      }else{
                        vm.mensajeError = 'Error al guardar nuevo parametro';
                      }
                      vm.setTimeoutClearMessages();
                      $scope.closeModal();
                  }
                });
              }

              $scope._crearObjetoDTOParametro = function(objectParametro){
                var parametro = 
                {
                    data: {
                        idParametro : objectParametro.idParametro,
                        grupo : objectParametro.tipoParametro,
                        descripcion: (objectParametro.descripcion != '' ? objectParametro.descripcion : null),
                        valorNumerico: (objectParametro.valorNumerico == '' || isNaN(objectParametro.valorNumerico || +objectParametro.valorNumerico == 0) ? null : (objectParametro.tipoParametro == 'PORCENTAJE_PLAN' ? (+objectParametro.valorNumerico/100): objectParametro.valorNumerico)),
                        valorTexto: (objectParametro.valorTexto !== '' ? objectParametro.valorTexto : null),
                        orden: (objectParametro.orden == '' || isNaN(objectParametro.orden || +objectParametro.orden == 0) ? null : objectParametro.orden),
                        activo: objectParametro.estado
                    },
                    metadata: {
                        emailUsuario: 'lmvega@stefanini.com',
                        fecha: Date.now().toString(),
                        origen: 'OIM',
                        usuario: 'LMVEGA'
                    }
                };
                return parametro;
              }
            }]
          });
        });
      }

      $scope.showModalEditTarifa = function(idTarifa){
        $scope.message = false;
        $scope.usuarioNoExiste = false;
        epsEmpresaService.getTarifa(idTarifa).then(function(response){
          $scope.formEditTarifa.idTarifa = response.idTarifa;
          $scope.formEditTarifa.desde = response.desde;
          $scope.formEditTarifa.hasta = response.hasta;
          $scope.formEditTarifa.tarifaPersona = response.tarifa;

          //Modal
          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            windowTopClass:'popup',
            templateUrl : '/polizas/app/eps-empresa/views/mantenimiento/modal/modal-edit-tarifa.html',
            controller : ['$scope', '$uibModalInstance', 'epsEmpresaService', function($scope, $uibModalInstance, epsEmpresaService) {
              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };

              $scope.activeBotonGuardar = function(){
                return $scope.formEditTarifa.desde !== '' && $scope.formEditTarifa.hasta !== '' && $scope.formEditTarifa.tarifaPersona !== '';
              }

              $scope.guardarTarifa = function(){
                var tarifaDTO = $scope._crearObjetoDTOTarifa($scope.formEditTarifa);

                epsEmpresaService.putTarifa(idTarifa, tarifaDTO).then(function(response){
                  $scope.closeModal();
                  vm.changePageTarifas(1);
                  vm.mensajeExitoTarifa = 'Se edito exitosamente la tarifa';
                  vm.setTimeoutClearMessagesTarifa();
                },function (error) {
                  if(error.status === 500) { vm.mostrarErrorInterno(); }
                  if(error.status === 400) {
                      if(error.message){
                        vm.mensajeErrorTarifa = error.message;
                      }else{
                        vm.mensajeErrorTarifa = 'Error al editar la tarifa';
                      }
                      vm.setTimeoutClearMessagesTarifa();
                      $scope.closeModal();
                  }
                });
              }

              $scope._crearObjetoDTOTarifa = function(objectTarifa){
                var tarifa = 
                {
                    data: {
                        idTarifa : objectTarifa.idTarifa,
                        desde : objectTarifa.desde,
                        hasta: objectTarifa.hasta,
                        tarifa: objectTarifa.tarifaPersona
                    },
                    metadata: {
                        emailUsuario: 'lmvega@stefanini.com',
                        fecha: Date.now().toString(),
                        origen: 'OIM',
                        usuario: 'LMVEGA'
                    }
                };
                return tarifa;
              }
            }]
          });
        });
      }
    }
});