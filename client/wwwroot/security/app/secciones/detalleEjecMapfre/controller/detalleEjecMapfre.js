(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'
  , 'seguridadFactory'],
  function (ng, constants, helper) {

    var appSecurity = angular.module('appSecurity');

    appSecurity.controller('detalleEjecMapfreController',
      ['$scope'
        , '$window'
        , '$state'
        , '$timeout'
        , '$q'
        , 'mainServices'
        , 'mModalAlert'
        , 'mModalConfirm'
        , 'seguridadFactory'
        , function ($scope
          , $window
          , $state
          , $timeout
          , $q
          , mainServices
          , mModalAlert
          , mModalConfirm
          , seguridadFactory) {

          $scope.objetSeguridad = seguridadFactory.onlyView();
          (function onLoad() {
            $scope.tabDatosGenerales = '/security/app/secciones/templates/tabDatosGenerales_2.html';
            $scope.tabRoles = '/security/app/secciones/templates/tabRoles.html';
            
            $scope.onlyView = true;
            $timeout(function () {
              $scope.onlyView = $scope.objetSeguridad.soloLectura;
            }, 10);
                
            $scope.login = seguridadFactory.getVarLS("profile");
            $scope.frmData = $scope.frmData || {}
            $scope.frmData.mCodCobrador = $scope.frmData.mCodCobrador || undefined;
            $scope.frmData.mCodOficina = $scope.frmData.mCodOficina || undefined;
            $scope.frmData.mCodAgente = $scope.frmData.mCodAgente || undefined;
            $scope.doubleSpace = '^(?!.*  ).+';

            $scope.isSaveDisabled = false;
            $scope.showFullAccess = true;
            $scope.data = $scope.data || {};
            $scope.existRole = false;

            $scope.id = $state.params.id;

            $timeout(function () {
              getDataViewDetails();
            }, 1000);

          })();

          $scope.getListCollector = getListCollector;
          $scope.getListOffice = getListOffice;
          $scope.getListProducer = getListProducer;
          $scope.$onDestroy = onDestroy;

          var watchItems = $scope.$watch('frmData.mCodAgente', function(nv, ov) {
            if (!nv) {
              return void 0;
            }
            if(nv.codigoDescripcion && nv.oficina){
              getListOffice(nv.oficina);
            }
          });

          $scope.fnGuardarCambios = _fnGuardarCambios;
          function _fnGuardarCambios() {
            mModalConfirm.confirmInfo('', '¿Estás seguro de guardar los cambios?', 'Guardar cambios').then(function () {
              _fnGuardado();
            });
          }
          function _fnGuardado() {
            var params = {
              numUser: $scope.data.numUsuario,
              codeCollector: (!ng.isUndefined($scope.frmData.mCodCobrador)) ? $scope.frmData.mCodCobrador.codigo : 0,
              codeOffice: (!ng.isUndefined($scope.frmData.mCodOficina)) ? $scope.frmData.mCodOficina.codigo : 0,
              codeAgent: (!ng.isUndefined($scope.frmData.mCodAgente)) ? $scope.frmData.mCodAgente.codigo : 0,
              codeUser: $scope.login.username
            };

            var promise = seguridadFactory.updateMapfre(params);
            promise.then(function (response) {
              if (response.operationCode == 200) {
                $timeout(function () {
                  getDataViewDetails();

                  mModalAlert.showSuccess('Los cambios se guardaron con éxito.', '').then(function () {
                  });
                }, 1000);
              }
              else mModalAlert.showWarning(response.message, '');
            });
          }

          function getListCollector(str) {
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
            }

            var defer = $q.defer();
            seguridadFactory.autocompleteCollectors(txt)
              .then(function (response) {
                var data = response.data || response.Data;

                if (data.length > 0) $scope.noResultCollector = false;
                else $scope.noResultCollector = true;
                defer.resolve(data);
              });
            return defer.promise;
          }

          function getListOffice(oficina) {
            var str = oficina;
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
            }

            var defer = $q.defer();
            seguridadFactory.autocompleteOffice(txt)
              .then(function (response) {
                var data = response.data || response.Data;

                if (data.length > 0) {
                  $scope.noResultOffice = false;

                  $scope.frmData.mCodOficina = {
                    codigo: data[0].codigo, 
                    descripcion: data[0].descripcion,
                    codigoDescripcion: data[0].codigoDescripcion
                  }
  
                }
                else{
                  $scope.noResultOffice = true;
                }
                defer.resolve(data);
              });
            return defer.promise;
          }

          function getListProducer(str) {
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
            }

            var defer = $q.defer();
            seguridadFactory.autocompleteProducer(txt)
              .then(function (response) {
                var data = response.data || response.Data;

                if (data.length > 0) $scope.noResultProducer = false;
                else $scope.noResultProducer = true;
                defer.resolve(data);
              });
            return defer.promise;
          }

          function getDataViewDetails() {
            var promise = seguridadFactory.getDismaViewDetails($scope.id);
            promise.then(function (response) {
              $scope.data = response.data || response.Data;

              $scope.frmData.mCodCobrador = ($scope.data.codCobrador != 0) ? {
                codigo: $scope.data.codCobrador
                , descripcion: $scope.data.nombreCobrador
                , codigoDescripcion: $scope.data.codigoNombreCobrador
              } : undefined

              $scope.frmData.mCodOficina = ($scope.data.codOficina != 0) ? {
                codigo: $scope.data.codOficina
                , descripcion: $scope.data.nombreOficina
                , codigoDescripcion: $scope.data.codigoNombreOficina
              } : undefined

              $scope.frmData.mCodAgente = ($scope.data.codAgente != 0) ? {
                codigo: $scope.data.codAgente
                , descripcion: $scope.data.nombreAgente
                , codigoDescripcion: $scope.data.codigoNombreAgente
              } : undefined

              //Variables de roles y accesos
              $scope.typeGroup = parseInt($scope.data.numTipoGrupo);
              $scope.numUser = parseInt($scope.data.numUsuario);
              $scope.codeUser = $scope.login.username;
              $scope.typeUser = 2;
              if ($scope.typeUser == 2)
                $scope.isUserAdmin = true;
              else
                $scope.isUserAdmin = false;

              $scope.isCreate = false;
              $scope.showRoleAccess = true;
              $scope.existRole = false;
              $scope.isFinalizar = false;


            });

          }

          $scope.fnClearCobrador = _fnClearCobrador;
          function _fnClearCobrador(){
            $scope.frmData.mCodCobrador = undefined;
          }

          $scope.fnClearOficina = _fnClearOficina;
          function _fnClearOficina(){
            $scope.frmData.mCodOficina = undefined;
          }

          $scope.fnClearAgente = _fnClearAgente;
          function _fnClearAgente(){
            $scope.frmData.mCodAgente = undefined;
            $scope.frmData.mCodOficina = undefined;

          }

          function onDestroy() {
            watchItems();
          }
        }])
  });
