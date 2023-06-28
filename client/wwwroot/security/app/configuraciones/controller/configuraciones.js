(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper']
, function(ng
    , constants
    , helper){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('configuracionesController',
      ['$scope'
      , '$timeout'
      , '$state'
      , 'mModalAlert'
      , 'seguridadFactory'
      , function($scope
        , $timeout
        , $state
        , mModalAlert
        , seguridadFactory){

        var profile = seguridadFactory.getVarLS('profile');
        if(profile.typeUser != 1) $state.go('dashboard');

          function bindLookups(){
            //rango fechas
            var pms = seguridadFactory.getDismaSearchParams();
            pms.then(function(response){
              if (response.operationCode == 200){
                $scope.rangoFechaData = response.data || response.Data;
                $scope.rangoFechaData.splice(3, 1)
              }
              else mModalAlert.showWarning(response.message, '');
            })
            .catch(function(error){
              mModalAlert.showError('Ocurrió un error inesperado', '');
            });
          }

          (function onLoad(){

            bindLookups();

            $scope.oneAtATime = true;
            $scope.frmConfig = {};

            $scope.status = {
              open1: false,
              open2: false,
              open3: false,
              isCustomHeaderOpen: false,
              isFirstOpen: true,
              isFirstDisabled: false
            };

            $scope.login = seguridadFactory.getVarLS("profile");
            $scope.data = $scope.data || {};

            $timeout(function(){
              getDetailsConfig();
            }, 200)
          })();

          function getDetailsConfig(){
            var pms = seguridadFactory.getDetailsConfig();
            pms.then(function(response){
              if(response.operationCode === constants.operationCode.success){
                $scope.data = response.data;
                $scope.frmConfig = {
                  mRango: {
                    codigo: ($scope.data == null) ? 1 : $scope.data.numRangoFechaDashboard
                  }
                  , mNroHoras: ($scope.data == null || $scope.data.numHorasTokenConfirmar == "") ? 24 : $scope.data.numHorasTokenConfirmar
                  , mCheckP1: ($scope.data == null) ? true : $scope.data.bajaUsuarioInactivo
                  , mCheckP2: ($scope.data == null) ? true : $scope.data.creaClientePersona
                  , mCheckP3: ($scope.data == null) ? true : $scope.data.creaCorredorAdmin
                  , mCheckP4: ($scope.data == null) ? true : $scope.data.creaClienteEmpresaAdmin
                  , mCheckP5: ($scope.data == null) ? true : $scope.data.bajaCorredorRegular
                  , mCheckP6: ($scope.data == null) ? true : $scope.data.bajaProveedorRegular
                  , mCheckP7: ($scope.data == null) ? true : $scope.data.creaProveedorAdmin
                  , mNroMeses: ($scope.data == null || $scope.data.mesesUsuarioInactivo == 0) ? "" : $scope.data.mesesUsuarioInactivo
                  , mCheckM1: ($scope.data == null) ? false : $scope.data.altaEmailDestino
                  , mCorreoM1: ($scope.data == null || $scope.data.listaAltaEmailDestino == null) ? "" : $scope.data.listaAltaEmailDestino
                  , mCheckM2: ($scope.data == null) ? false : $scope.data.altaEmailCC
                  , mCorreoM2: ($scope.data == null || $scope.data.listaAltaEmailCC == null) ? "" : $scope.data.listaAltaEmailCC
                  , mCheckM3: ($scope.data == null) ? false : $scope.data.modificacionEmailDestino
                  , mCorreoM3: ($scope.data == null || $scope.data.listaModificacionEmailDestino == null) ? "" : $scope.data.listaModificacionEmailDestino
                  , mCheckM4: ($scope.data == null) ? false : $scope.data.modificacionEmailCC
                  , mCorreoM4: ($scope.data == null || $scope.data.listaModificacionEmailCC == null) ? "" : $scope.data.listaModificacionEmailCC
                  , mCheckM5: ($scope.data == null) ? false : $scope.data.bajaEmailDestino
                  , mCorreoM5: ($scope.data == null || $scope.data.listaBajaEmailDestino == null) ? "" : $scope.data.listaBajaEmailDestino
                  , mCheckM6: ($scope.data == null) ? false : $scope.data.bajaEmailCC
                  , mCorreoM6: ($scope.data == null || $scope.data.listaBajaEmailCC == null) ? "" : $scope.data.listaBajaEmailCC
                  , mCheckM7: ($scope.data == null) ? false : $scope.data.cambioContraEmailDestino
                  , mCorreoM7: ($scope.data == null || $scope.data.listaCambioContraEmailDestino == null) ? "" : $scope.data.listaCambioContraEmailDestino
                  , mCheckM8: ($scope.data == null) ? false : $scope.data.cambioContraEmailCC
                  , mCorreoM8: ($scope.data == null || $scope.data.listaCambioContraEmailCC == null) ? "" : $scope.data.listaCambioContraEmailCC
                  , mMaxLength: 5
                }
              }else{
                mModalAlert.showWarning(response.message, '');
              }
            })
            .catch(function(err){
              mModalAlert.showError('Ocurrió un error inesperado', '');
            })
          }

          function isValid(){
            $scope.ngFrmConfig.markAsPristine();
            var vHours = ($scope.frmConfig.mNroHoras >= 24);

            if($scope.frmConfig.mCheckP1){
              if($scope.frmConfig.mNroMeses != ""){
                var vMonths = ($scope.frmConfig.mNroMeses >= 1)
              }
            }else{
              if($scope.frmConfig.mNroMeses != "") var vMonths = false
              else var vMonths = true
            }
            // var vMonths = ($scope.frmConfig.mCheckP1 && $scope.frmConfig.mNroMeses >= 1) ? true : false;

            if($scope.frmConfig.mCheckM1){
              var vSign1 = ($scope.frmConfig.mCorreoM1 != "") ? true : false
            }else{
              var vSign1 = ($scope.frmConfig.mCorreoM1 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM2){
              var vSign2 = ($scope.frmConfig.mCorreoM2 != "") ? true : false
            }else{
              var vSign2 = ($scope.frmConfig.mCorreoM2 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM3){
              var vUpdate1 = ($scope.frmConfig.mCorreoM3 != "") ? true : false
            }else{
              var vUpdate1 = ($scope.frmConfig.mCorreoM3 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM4){
              var vUpdate2 = ($scope.frmConfig.mCorreoM4 != "") ? true : false
            }else{
              var vUpdate2 = ($scope.frmConfig.mCorreoM4 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM5){
              var vDel1 = ($scope.frmConfig.mCorreoM5 != "") ? true : false
            }else{
              var vDel1 = ($scope.frmConfig.mCorreoM5 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM6){
              var vDel2 = ($scope.frmConfig.mCorreoM6 != "") ? true : false
            }else{
              var vDel2 = ($scope.frmConfig.mCorreoM6 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM7){
              var vPwd1 = ($scope.frmConfig.mCorreoM7 != "") ? true : false
            }else{
              var vPwd1 = ($scope.frmConfig.mCorreoM7 != "") ? false : true;
            }

            if($scope.frmConfig.mCheckM8){
              var vPwd2 = ($scope.frmConfig.mCorreoM8 != "") ? true : false
            }else{
              var vPwd2 = ($scope.frmConfig.mCorreoM8 != "") ? false : true;
            }

            return vHours && vMonths
            && vSign1 && vSign2
            && vUpdate1 && vUpdate2
            && vDel1 && vDel2
            && vPwd1 && vPwd2
            && $scope.ngFrmConfig.$valid;
          }

          $scope.fnSaveConfig = _fnSaveConfig;
          function _fnSaveConfig(){
            if(isValid()){
              var params = {
                numConfiguracion: 0
                , numHorasTokenConfirmar: $scope.frmConfig.mNroHoras
                , numRangoFechaDashboard: $scope.frmConfig.mRango.codigo

                //procesos automaticos
                , bajaUsuarioInactivo: $scope.frmConfig.mCheckP1
                , mesesUsuarioInactivo: $scope.frmConfig.mNroMeses
                , creaClientePersona: $scope.frmConfig.mCheckP2
                , creaCorredorAdmin: $scope.frmConfig.mCheckP3
                , creaProveedorAdmin: $scope.frmConfig.mCheckP7
                , creaClienteEmpresaAdmin: $scope.frmConfig.mCheckP4
                , bajaCorredorRegular: $scope.frmConfig.mCheckP5
                , bajaProveedorRegular: $scope.frmConfig.mCheckP6

                //distribucion mensajeria
                  //alta
                  , altaEmailDestino: $scope.frmConfig.mCheckM1
                  , listaAltaEmailDestino: $scope.frmConfig.mCorreoM1
                  , altaEmailCC: $scope.frmConfig.mCheckM2
                  , listaAltaEmailCC: $scope.frmConfig.mCorreoM2

                  //modificaciones
                  , modificacionEmailDestino: $scope.frmConfig.mCheckM3
                  , listaModificacionEmailDestino: $scope.frmConfig.mCorreoM3
                  , modificacionEmailCC: $scope.frmConfig.mCheckM4
                  , listaModificacionEmailCC: $scope.frmConfig.mCorreoM4

                  //bajas
                  , bajaEmailDestino: $scope.frmConfig.mCheckM5
                  , listaBajaEmailDestino: $scope.frmConfig.mCorreoM5
                  , bajaEmailCC: $scope.frmConfig.mCheckM6
                  , listaBajaEmailCC: $scope.frmConfig.mCorreoM6

                  //cambios contrasena
                  , cambioContraEmailDestino: $scope.frmConfig.mCheckM7
                  , listaCambioContraEmailDestino: $scope.frmConfig.mCorreoM7
                  , cambioContraEmailCC: $scope.frmConfig.mCheckM8
                  , listaCambioContraEmailCC: $scope.frmConfig.mCorreoM8
                  , codUser: $scope.login.username
                }
                var pms = seguridadFactory.updateConfig(params);
                pms.then(function(response){
                  if(response.operationCode == 200)
                    mModalAlert.showSuccess('La configuración se actualizó correctamente', '');
                  else
                    mModalAlert.showWarning(response.message, '');
                })
                .catch(function(err){
                  mModalAlert.showError(messagesSeguridad.UNEXPECTED_ERROR, '');
                })
              }else{
                mModalAlert.showWarning('Por favor corregir los errores antes de continuar', '');
              }
          }

          $scope.Acordion1 = function(elm) {
            var icons = document.getElementsByClassName('i-acordion');

            Array.from(icons).forEach(function(element){
              element.classList.remove('ico-mapfre_309_arrowUp');
              element.classList.add('ico-mapfre_308_arrowDown');
            });

            $scope.status.open1 = $scope.status.open1 == false ? true: false;
            $scope.status.open2 = false;
            $scope.status.open3 = false;
          }

          $scope.Acordion2 = function() {
            var icons = document.getElementsByClassName('i-acordion');

            Array.from(icons).forEach(function(element, index){
              element.classList.remove('ico-mapfre_309_arrowUp');
              element.classList.add('ico-mapfre_308_arrowDown');
            });

            $scope.status.open2 = $scope.status.open2 == false ? true: false;
            $scope.status.open1 = false;
            $scope.status.open3 = false;
          }

          $scope.Acordion3 = function() {
            var icons = document.getElementsByClassName('i-acordion');

            Array.from(icons).forEach(function(element, index){
              element.classList.remove('ico-mapfre_309_arrowUp');
              element.classList.add('ico-mapfre_308_arrowDown');
            });

            $scope.status.open3 = $scope.status.open3 == false ? true: false;
            $scope.status.open1 = false;
            $scope.status.open2 = false;
          }

    }])
  });
