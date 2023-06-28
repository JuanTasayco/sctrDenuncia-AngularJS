define(['angular', 'constants'], function (ng, constants) {

  ResumenController.$inject = ['$scope', '$window', '$uibModal', '$state', '$stateParams', '$http', 'mpSpin', 'oimProxyReferencias', 'proxyReferencia', 'authorizedResource', '$q'];

  function ResumenController($scope, $window, $uibModal, $state, $stateParams, $http, mpSpin, oimProxyReferencias, proxyReferencia, authorizedResource, $q) {
    (
      function onLoad() {
        $scope.showDatos = false;
        $scope.showPaciente = false;
        $scope.showOrigen = false;
        $scope.showDestino = false;
        $scope.showAuditoria = false;
        $scope.showTraslado = false;
        $scope.showHistorial = false;
        $scope.hasRevisionReferencia = false;
        $scope.motivoAuditoria = '';
        $scope.referenceRsum = referenceRsum;
        $scope.showModalRevisar = showModalRevisar;
        $scope.modalAnular = modalAnular;
        $scope.descargarPdf = descargarPdf;
        $scope.getIdReferencia = getIdReferencia;

        $scope.masters = {};
        $scope.resumeList = [];

        $scope.idReferencia = $stateParams.idReferencia;

        referenceRsum($scope.idReferencia);

        if ($stateParams.DescargaPdf) modalDownloadPDF();

        function getIdReferencia(num) {
          if (num) {
            var s = "000000" + num;
            return s.substr(num.toString().length);
          }
          return '';
        }

        function referenceRsum(idReferencia) {

          mpSpin.start();
          proxyReferencia.DetalleReferencia({
            CReferencia: idReferencia
          })
            .then(function (response) {
              if (response.codErr == 0) {
                $scope.resumeList = response.referencia;
                $scope.showDatos = true;
                $scope.hasRevisionReferencia = $scope.resumeList.idEstado == 2;
                $scope.ramo = $scope.resumeList.asegurado.numContrato.length > 3 ? $scope.resumeList.asegurado.numContrato.substring(0, 3) : "";
                generateRequerimientosMedicos($scope.resumeList);
              }
            });
          mpSpin.end();
        }

        $scope.getStyle = function (Convenio) {
          if (Convenio === "SIN CONVENIO")
            return { 'color': 'red', 'font-weight': 'bold' };
          if (Convenio === "CON CONVENIO")
            return { 'color': '#00B09F', 'font-weight': 'bold' };

        }


        $scope.getStyle2 = function (Estado) {
          if (Estado === "ANULADO")
            return { 'background-color': '#999999' };
          if (Estado === "REVISADA")
            return { 'background-color': '#00B09F' };
          if (Estado === "POR REVISAR")
            return { 'background-color': '#2C7F8F' };

        }


        function generateRequerimientosMedicos(data) {
          var requerimientos = data.proveedorDestino.requerimientosCumple;
          var listaServicios = [];
          var listaImagenes = [];
          var listaEmergencias = [];
          var listaEspecialidades = [];

          for (var i = 0; i < requerimientos.length; i++) {
            var requerimiento = requerimientos[i];

            if (requerimiento.cumpleRequerimiento) {

              switch (requerimiento.grupoRequerimiento) {
                case '13':// servicios
                  listaServicios.push(requerimiento.nombreRequerimiento);
                  break;
                case '14':// imagen
                  listaImagenes.push(requerimiento.nombreRequerimiento);
                  break;
                case '15': // emergencia
                  listaEmergencias.push(requerimiento.nombreRequerimiento);
                  break;
                case '16': // especialidad
                  listaEspecialidades.push(requerimiento.nombreRequerimiento);
                  break;
              }


            }
          }
          data.servicios = listaServicios.length > 0 ? listaServicios.join(', ') : '-';
          data.imagenes = listaImagenes.length > 0 ? listaImagenes.join(', ') : '-';
          data.emergencias = listaEmergencias.length > 0 ? listaEmergencias.join(', ') : '-';
          data.especialidades = listaEspecialidades.length > 0 ? listaEspecialidades.join(', ') : '-';
        }

        function showModalRevisar(data) {
          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            template: "<modal-revisar data='modalRevisar' close='close()' save='save($params)'></modal-revisar>",
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.modalRevisar = data;
              $scope.modalRevisar.CurrentUserName = authorizedResource.profile.loginUserName;

              $scope.close = function () {
                $uibModalInstance.close();
              };

              $scope.save = function (params) {


                mpSpin.start();
                proxyReferencia.RevisarReferencia(params)
                  .then(function (response) {

                    mpSpin.end();
                    if (response.codErr == 0) {
                      $uibModalInstance.close();
                      referenceRsum($scope.idReferencia);
                    }
                  });

              }
            }]
          });
        };

        function modalAnular(data) {


          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            template: "<modal-anular data='modalAnular' close='close()' anular='anular($params)'> </modal-anular>",
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.modalAnular = data;
              $scope.modalAnular.CurrentUserName = authorizedResource.profile.loginUserName;

              $scope.close = function () {
                $uibModalInstance.close();
              };

              $scope.anular = function (params) {
                mpSpin.start();

                proxyReferencia.AnularReferencia(params)
                  .then(function (response) {

                    mpSpin.end();
                    if (response.codErr == 0) {

                      $uibModalInstance.close();
                      referenceRsum($scope.idReferencia);
                    }
                  });
              }
            }]
          });

        };

        function modalDownloadPDF() {
          var data = { idReferencia: $scope.idReferencia };

          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'sm',
            template: "<modal-dpdf data='modalDownloadPdf' close='close()' download='download($params)'> </modal-dpdf>",
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
              $scope.modalDownloadPdf = data;

              $scope.close = function () {
                $uibModalInstance.close();
              };

              $scope.download = function (params) {

                downloadPdf(params)
                $uibModalInstance.close();
              }
            }]
          });
        }

        function downloadPdf(params) {
          var url = oimProxyReferencias.endpoint + 'api/referencia/detallePDF';

          mpSpin.start();

          /*gtx*/

          var urlTracker = oimProxyReferencias.endpoint + 'api/traza/eventTracker';

          var obj = {
            "codigoAplicacion": "NREF",
            "ipOrigen": $window.localStorage.getItem('clientIp'),
            "tipoRegistro": "O",
            "codigoObjeto": "REFERENCIAS",
            "opcionMenu": "Resumen referencia - descargar",
            "descripcionOperacion": "Click al Botón Descargar PDF de referencia",
            "filtros": "",
            "codigoUsuario": "",
            "numeroSesion": "",
            "codigoAgente": 0
          };

          $http.post(
            urlTracker,
            obj)
            .success(
              function (data) {
              });

          /*--gtx*/

          $http.post(
            url,
            params,
            { responseType: "arraybuffer" })
            .success(
              function (data, status, headers) {
                var type = headers('Content-Type');
                var disposition = headers('Content-Disposition');
                var defaultFileName = 'Referencia' + $scope.idReferencia + '.pdf';
                if (disposition) {
                  var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                  if (match[1]) defaultFileName = match[1];
                }

                defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');

                var blob = new Blob([data], { type: type });
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = defaultFileName;
                link.click();

                mpSpin.end();
              }, function (data, status) {
                mpSpin.end();
              });
        }

        function descargarPdf() {
          var params = { CReferencia: $scope.idReferencia };
          downloadPdf(params);
        }

        $scope.editReferencia = function () {
          $state.go('editar-refs', { idReferencia: $scope.idReferencia });
        }

        $scope.obtenerProductoContrato = function () {
          if($scope.ramo == '116') {
            return $scope.resumeList.asegurado.datosExtra.hasOwnProperty("contrato") ? $scope.resumeList.asegurado.datosExtra["contrato"] : "";
          } else if ($scope.ramo == '114' || $scope.ramo == '115') {
            return $scope.resumeList.asegurado.datosExtra.hasOwnProperty("producto Salud") ? $scope.resumeList.asegurado.datosExtra["producto Salud"] : "";
          } else {
            return "";
          }
        }

        $scope.obtenerSubProductoSubContrato = function () {
          if($scope.ramo == '116') {
            return $scope.resumeList.asegurado.datosExtra.hasOwnProperty("sub-Contrato") ? $scope.resumeList.asegurado.datosExtra["sub-Contrato"] : "";
          } else if ($scope.ramo == '114' || $scope.ramo == '115') {
            return $scope.resumeList.asegurado.datosExtra.hasOwnProperty("sub-Producto Salud") ? $scope.resumeList.asegurado.datosExtra["sub-Producto Salud"] : "";
          } else {
            return "";
          }
        }

      }

    )();
  }

  return ng.module('referencias.app')
    .controller('ResumenController', ResumenController);
});
