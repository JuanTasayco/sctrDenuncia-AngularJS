define(['angular', 'constants', 'constantsFola'], function (angular, constants, constantsFola) {
  'use strict';
  angular
    .module(constants.module.polizas.fola.moduleName)
    .controller('resumenBandejaDocumentosController', ResumenBandejaDocumentosController);

  ResumenBandejaDocumentosController.$inject = [
    '$state',
    'folaService',
    'folaFactory',
    'mpSpin',
    'mModalAlert'
  ];
  function ResumenBandejaDocumentosController(
    $state,
    folaService,
    folaFactory,
    mpSpin,
    mModalAlert
  ) {
    var vm = this;

    // Propiedades
    vm.documento = {};
    vm.documentoEmitir = {
      riesgos: [],
    };
    vm.currency = constantsFola.SIMBOLO_MONEDA;
    vm.fileUpload = null;
    vm.dataInsured = [];

    // Funciones:
    vm.descargarPoliza = DescargarPoliza;
    vm.emitirPoliza = EmitirPoliza;

    (function load_ResumenBandejaDocumentosController() {
      _getDocument($state.params.documentoId);
    })();

    // funciones privadas
    function _getDocument(documentId) {
      mpSpin.start();
      folaService.getDocumentFola(documentId).then(
        function (response) {
          if (response.codigo === 0) {
            vm.documento = response.data;
            // console.log('lo que tiene el documento', vm.documento);
            mpSpin.end();
          } else {
            mModalAlert.showWarning(response.mensaje, 'ALERTA, no se pudo cargar el documento');
            mpSpin.end();
          }
        },
        function (error) {
          $state.go('errorInternoFola',{}, { reload: true, inherit: false });
          mpSpin.end();
          if (error.data) {
            if (error.data.errores) {
              if (error.data.errores.length > 0) {
                mModalAlert.showError(error.data.errores[0], 'ERROR', null, 3000);
                mpSpin.end();
                return;
              }
            }
          }
          mModalAlert.showError('No se pudo cargar el documento', 'Error', null, 3000);
          mpSpin.end();
        }
      );
    }

    function DescargarPoliza(riesgo) {
      folaService
        .getPolizaPDF(
          riesgo.numeroPoliza,
          constants.module.polizas.fola.companyCode,
          constants.module.polizas.fola.codeRamo
        )
        .then(
          function (response) {
            if (response.codigo === 0) {
              var fileName = 'N_' + riesgo.numeroPoliza + '_' + riesgo.grupo;
              folaFactory.downloadFileBase64(response.data.documentoBase64, 'pdf', fileName);
              mpSpin.end();
            } else {
              mModalAlert.showError(response.mensaje, 'Error, no se pudo descargar el documento');
              mpSpin.end();
            }
          },
          function (error) {
            if (error.data) {
              if (error.data.errores) {
                if (error.data.errores.length > 0) {
                  mModalAlert.showError(error.data.errores[0], 'ERROR', null, 3000);
                  mpSpin.end();
                  return;
                }
              }
            }
            mModalAlert.showError('Error, no se pudo descargar el documento', null, 3000);
            mpSpin.end();
          }
        );
    }

    function EmitirPoliza(riesgo) {
      mpSpin.start();
      vm.documentoEmitir.numeroDocumento = vm.documento.numeroDocumento;
      vm.documentoEmitir.contratante = folaFactory.transformContratanteEmitir(vm.documento.contratante);
      vm.documentoEmitir.riesgos.push(folaFactory.transformRiesgoEmitir(riesgo));
      // console.log('lo que tiene el documentoEmitir', vm.documentoEmitir);
      // console.log(JSON.stringify(vm.documentoEmitir));
      folaService.saveEmision(vm.documentoEmitir).then(
        function (response) {
          if (response.codigo === 0) {
            mpSpin.end();
            mModalAlert.showSuccess('Póliza emitida correctamente.', 'GUARDADO').then(function (response) {
              $state.reload();
            });
          } else {
            mModalAlert.showWarning(response.mensaje, 'ALERTA');
            mpSpin.end();
          }
        },
        function (error) {
          if (error.data) {
            if (error.data.errores) {
              if (error.data.errores.length > 0) {
                mModalAlert.showError(error.data.errores[0], 'ERROR', null, 3000);
                mpSpin.end();
                return;
              }
            }
          }
          mModalAlert.showError('No se pudo emitir la póliza', 'Error', null, 3000);
          mpSpin.end();
        }
      );
    }
  }
});
