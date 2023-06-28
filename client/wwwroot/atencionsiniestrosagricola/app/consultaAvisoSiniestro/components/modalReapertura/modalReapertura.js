(function ($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, 'ModalReapertura', ['angular', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
  angular.module('atencionsiniestrosagricola.app').
      controller('ModalReaperturaController', ['$rootScope', '$scope', 'mModalAlert', 'mpSpin', 'proxyLookup', 'proxyAviso', '$state',
          function ($rootScope, $scope, mModalAlert, mpSpin, proxyLookup, proxyAviso,$state) {
              var vm = this;
              var usuario = "";
              vm.$onInit = function () {
                  $scope.codigoAviso = $scope.$parent.data.codigoAviso;
                  $scope.codigoCampania = $scope.$parent.data.codigoCampania;
                  usuario = $scope.$parent.data.usuario;
                  cargarMotivos();
              }
              $scope.closeModal = function () {
                  $scope.$parent.closeModal();
              }
              $scope.reaperturarAviso = function () {
                if(!$scope.fromFormReapertura.$valid){                
                    mModalAlert.showError("", "Completar datos faltantes"); 
                    return;
                }
                var objReapertura = {
                    "codCampania":$scope.codigoCampania, 
                    "codAviso": $scope.codigoAviso,
                    "motivo": $scope.mMotivo.descripcion,
                    "comentario": $scope.mComentario,
                    "usuarioRegistro": usuario,
                };
                mpSpin.start('Guardando información, por favor espere...');
                proxyAviso.ReaperturarAviso($scope.codigoCampania,$scope.codigoAviso,objReapertura)
                    .then(function (response) {
                        if (response.operationCode == 200) {
                            mpSpin.end();
                            mModalAlert.showSuccess("Se reaperturó el aviso", "").then(function(){
                               $scope.closeModal();
                               $state.go('detalleConsultaAvisoSiniestro', { idCampania : $scope.codigoCampania,idAviso: $scope.codigoAviso }, { reload: true, inherit: false });                               
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
              function cargarMotivos() {
                  var objFiltro = {
                      cmstro: "20",
                      prmtro1: "",
                      prmtro2: $scope.codigoCampania,
                      prmtro3: "",
                      prmtro4: ""
                  }
                  mpSpin.start('Cargando, por favor espere...');
                  proxyLookup.GetFiltros(objFiltro).then(function (response) {
                      if (response.operationCode === 200) {
                          $scope.listaMotivo = response.data;
                          mpSpin.end();
                      } else {
                          mModalAlert.showWarning("Error al cargar los Tipos de Documento", "");
                      }
                  });

              }

          }]).
      component('modalReapertura', {
          templateUrl: '/atencionsiniestrosagricola/app/consultaAvisoSiniestro/components/modalReapertura/modalReapertura.html',
          controller: 'ModalReaperturaController',
          bindings: {
              masters: '=?',
              reloadMasters: '&?'
          }
      })
});