(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular'
  , 'constants'
  , 'helper'
  , 'seguridadFactory'],
  function (ng
    , constants
    , helper
    , seguridadFactory) {

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('crearUsuarioEjecMapfrePaso2Controller',
      ['$scope'
        , '$window'
        , '$state'
        , '$timeout'
        , '$q'
        , 'mainServices'
        , 'mModalAlert'
        , 'seguridadFactory'
        , function ($scope
          , $window
          , $state
          , $timeout
          , $q
          , mainServices
          , mModalAlert
          , seguridadFactory) {

          (function onLoad() {

            if (!$scope.create.validStep1)
              $state.go('crearUsuarioEjecMapfre.steps', { step: 1 });

            $scope.login = seguridadFactory.getVarLS("profile");

            $scope.create = $scope.create || {};
            $scope.createS1 = $scope.createS1 || {};
            $scope.createS2 = $scope.createS2 || {};

          })();
          $scope.getListOffice = getListOffice;
          $scope.fnCreateUser = _fnCreateUser;

          var watchItems = $scope.$watch('createS2.user.mCodAgente', function(nv, ov) {
            if (!nv) {
              return void 0;
            }
            if(nv.codigoDescripcion && nv.oficina){
              getListOffice(nv.oficina);
            }
          });
          
          function _fnCreateUser() {
            var params = {
              userCode: $scope.mIDUsuario
              , codCollector: (ng.isUndefined($scope.mCodCobrador) || $scope.mCodCobrador == "") ? 0 : $scope.mCodCobrador.codigo
              , codOffice: (ng.isUndefined($scope.mCodOficina) || $scope.mCodOficina == "") ? 0 : $scope.mCodOficina.codigo
              , codProducer: (ng.isUndefined($scope.mCodAgente) || $scope.mCodAgente == "") ? 0 : $scope.mCodAgente.codigo
              , codeUserRegister: $scope.login.username
            };
            var pms = seguridadFactory.insertUserMapfre(params);
            pms.then(function (response) {
              if (response.operationCode == 200) {
                var user = response.data;
                var id = user.numUsuario;
                $state.go('crearUsuarioEjecMapfreExito', { id: id });
              } else mModalAlert.showWarning(response.message, '');
            })
          }

          $scope.fnGetListCollector = _fnGetListCollector;
          function _fnGetListCollector(str) {
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
              var defer = $q.defer();
              var pms = seguridadFactory.autocompleteCollectors(txt)
              pms.then(function (response) {
                var data = response.data || response.Data;
                if (data.length > 0) $scope.noResultCollector = false;
                else $scope.noResultCollector = true;
                defer.resolve(data);
              });
              return defer.promise;
            }
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

                  $scope.createS2.user.mCodOficina = {
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

          $scope.fnGetListProducer = _fnGetListProducer;
          function _fnGetListProducer(str) {
            if (str && str.length >= 2) {
              var txt = str.toUpperCase();
              var defer = $q.defer();
              var pms = seguridadFactory.autocompleteProducer(txt)
              pms.then(function (response) {
                var data = response.data || response.Data;
                if (data.length > 0) $scope.noResultProducer = false;
                else $scope.noResultProducer = true;
                defer.resolve(data);
              });
              return defer.promise;
            }
          }

          $scope.createS2.fnNextStep = _fnNextStep;
          function _fnNextStep(isNextStep, e) {
            var isCreate = true;
            if (!$scope.create.validStep2) {
              isCreate = true;
              var params = {
                userCode: $scope.createS1.mIDUsuario
                , codCollector: (ng.isUndefined($scope.createS2.user.mCodCobrador) || $scope.createS2.user.mCodCobrador == "") ? 0 : $scope.createS2.user.mCodCobrador.codigo
                , codOffice: (ng.isUndefined($scope.createS2.user.mCodOficina) || $scope.createS2.user.mCodOficina == "") ? 0 : $scope.createS2.user.mCodOficina.codigo
                , codProducer: (ng.isUndefined($scope.createS2.user.mCodAgente) || $scope.createS2.user.mCodAgente == "") ? 0 : $scope.createS2.user.mCodAgente.codigo
                , codeUserRegister: $scope.login.username
              }
              var pms = seguridadFactory.insertUserMapfre(params);
            } else { //actualiza datos usuario
              isCreate = false;
              var params = {
                numUser: $scope.createS3.numUser
                , codeCollector: (ng.isUndefined($scope.createS2.user.mCodCobrador) || $scope.createS2.user.mCodCobrador == "") ? 0 : $scope.createS2.user.mCodCobrador.codigo
                , codeOffice: (ng.isUndefined($scope.createS2.user.mCodOficina) || $scope.createS2.user.mCodOficina == "") ? 0 : $scope.createS2.user.mCodOficina.codigo
                , codeAgent: (ng.isUndefined($scope.createS2.user.mCodAgente) || $scope.createS2.user.mCodAgente == "") ? 0 : $scope.createS2.user.mCodAgente.codigo
                , codeUser: $scope.createS1.mIDUsuario
              }
              var pms = seguridadFactory.updateMapfre(params);
            }

            pms.then(function (response) {
              if (response.operationCode == 200) {
                $scope.createS3.isCreate = isCreate;
                $scope.showResultado = true;
                $scope.data = response.data || response.Data;
                if (!$scope.create.validStep2) {
                  $scope.create.validStep2 = true;
                  $scope.createS3.numUser = $scope.data.numUsuario;
                  $scope.createS3.numPerson = $scope.data.numPersona;
                }
                $state.go('crearUsuarioEjecMapfre.steps', { step: 3 })
              } else mModalAlert.showWarning(response.message, '');
            });
          }

          //valida formulario desde click en paso 2 (circulo superior)
          $scope.$on("changingStep", function (event, e) {
            $scope.createS2.fnNextStep(true, e);
          });

        }])
  });  