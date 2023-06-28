define([
  'angular', 'constants', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'
], function (ng, constants) {
  FormCampaniaController.$inject = ['$scope', '$filter', '$rootScope', '$state', '$stateParams', '$window', '$http', '$q', 'oimClaims', 'agricolaUtilities', 'proxyAviso', 'proxyCampania', 'proxyLookup', 'oimProxyAtencionsiniestrosagricola', 'authorizedResource', 'mpSpin', 'mModalAlert'];
  function FormCampaniaController($scope, $filter, $rootScope, $state, $stateParams, $http, $q, $window, oimClaims, agricolaUtilities, proxyAviso, proxyCampania, proxyLookup, oimURL, authorizedResource, mpSpin, mModalAlert) {
    var vm = this;
    vm.formValid = false;
    $scope.tituloCampania = "Nueva Campaña";
    var edit = false;

    var usuarioSistema = "";
    $scope.patronMinagri = '[a-zA-Z0-9]+$';
    vm.$onInit = function () {
      usuarioSistema =vm.$resolve.oimClaims.userName;
      if ($stateParams.edit == 1) {
        edit = true;
        $scope.tituloCampania = "Editar Campaña";
        cargaEditarCampania();
      }
    }
    $scope.registrarCampania = function () {
      if(!edit && !$scope.frmFormCampania.$valid){
        mModalAlert.showWarning("Por favor completar los campos", "");
        return;
      }
      var objCampania = {
        "descripcion": $scope.mNombreCampania,
        "fecIni": $filter('date')(new Date($scope.mFechaIni), 'dd/MM/yyyy'),
        "fecFin": $filter('date')(new Date($scope.mFechaFin), 'dd/MM/yyyy'),
        "codMINAGRI": $scope.mCodigoMinagri,
        "numPoliza": $scope.mNumPoliza,
        "nMaxLotePermitido": $scope.mCantMaxLotes,
        "nCantDuplicados": $scope.mCantDuplicados,
        "usuarioRegistro": usuarioSistema,
        "usuarioModificacion": usuarioSistema
      };

      if ($scope.mFechaFin <= $scope.mFechaIni) {
        mModalAlert.showWarning("Verifique las fechas seleccionadas", "");
      } else {
        if (edit) {
          if($scope.mEstadoRegistro=='A'){
            mModalAlert.showWarning("No se puede modificar la campaña activa", "");
            return;
          }
          mpSpin.start('Guardando información, por favor espere...');
          objCampania.tipoCambio = 1;
          proxyCampania.EditCampania($scope.mCodigoCampania,objCampania)
            .then(function (response) {
              if (response.operationCode == 200) {
                mpSpin.end();
                mModalAlert.showSuccess("¡La campaña se modificó con éxito!","").then(function (response) {
                  $state.go('campanias', undefined, { reload: true, inherit: false });
                 });
              }
              else {
                mpSpin.end();
                mModalAlert.showError(response.message, "Error en el sistema");
              }
            }, function (response) {
              mpSpin.end();
              mModalAlert.showError(response.message, "Error en el sistema");
            });
        } else {
          objCampania.accion = "nuevoRegistro";
          proxyCampania.InsertCampania(objCampania)
            .then(function (response) {
              if (response.operationCode == 200) {
                mpSpin.end();
                mModalAlert.showSuccess("¡La campaña se registró con éxito!","").then(function (response) {
                  $state.go('campanias', undefined, { reload: true, inherit: false });
                });
              }
              else {
                mpSpin.end();
                mModalAlert.showError(response.message, "Error en el sistema");
              }
            }, function (response) {
              mpSpin.end();
              mModalAlert.showError(response.message, "Error en el sistema");
            });
        }
      }
    }

    function cargaEditarCampania() {
      var editarCampania = angular.fromJson($stateParams.campania);
      $scope.mEstadoRegistro = editarCampania.estadoRegistro;
      $scope.mNombreCampania = editarCampania.descripcion;
      $scope.mCodigoCampania = editarCampania.codigo;

      var datePartsFF = editarCampania.fecFin.split("/");
      var dateFechaFin = new Date(+datePartsFF[2], datePartsFF[1] - 1, +datePartsFF[0]);

      var datePartsFI = editarCampania.fecIni.split("/");
      var dateFechaIni = new Date(+datePartsFI[2], datePartsFI[1] - 1, +datePartsFI[0]);

      $scope.mFechaFin = new Date(dateFechaFin);
      $scope.mFechaIni = new Date(dateFechaIni);
      $scope.mCodigoMinagri = editarCampania.codMINAGRI;
      $scope.mNumPoliza = editarCampania.numPoliza;
      $scope.mCantDuplicados = editarCampania.nCantDuplicados;
      $scope.mCantMaxLotes = editarCampania.nMaxLotePermitido;
    }
    $scope.confirmarCancelar = function () {     
        $state.go('campanias', null, { reload: true, inherit: false });   
    }

  }
  return ng.module('atencionsiniestrosagricola.app')
    .controller('FormCampaniaController', FormCampaniaController)
    .directive('preventDefault', function () {
      return function (scope, element, attrs) {
        ng.element(element).bind('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
        });
      }
    });
});