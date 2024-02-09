define([
  'angular', 'constantsRiesgosGenerales', 'rrggModalUploadDocument'
], function (ng, constantsRiesgosGenerales) {
  suscriptorController.$inject = ['$scope', 'mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', '$uibModal','oimAbstractFactory'];
  function suscriptorController($scope, mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, $uibModal, oimAbstractFactory) {
    var vm = this;
    vm.addCorreo = AddCorreo
    vm.deleteCorreo = DeleteCorreo
    vm.validControlForm = ValidControlForm;
    vm.OpenModal = OpenModal
    vm.cambioTipoDocumento = CambioTipoDocumento
    vm.getAgente = getAgente
    vm.isMydream = oimAbstractFactory.isMyDream();
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.emision = riesgosGeneralesFactory.cotizacion.emision;
      vm.riesgos = [];
      var riesgos = [
        {
          Grupo: "Otros Ramos",
          CantidadDoc: 0,
          comentarios: "",
          documentos: [],
          TipoGrupo: "RRGG"
        },
        {
          Grupo: "Marine",
          CantidadDoc: 0,
          comentarios: "",
          documentos: [],
          TipoGrupo: "MAR"
        }
      ]
      // SOLO PRODUCTO TRANSPORTE = MARIN
      // SOLO COBERTURA AMT = MULTIRIESGO Y MARIN, LOS DEMAS MULTIRIESGO
      if (vm.tramite.Grupo === vm.constantsRrgg.GRUPO.TRANSPORTE) {
        vm.riesgos.push(riesgos[1])
      } else {
        if (vm.tramite.Cobertura) {
          vm.tramite.Cobertura.Codigo === vm.constantsRrgg.COBERTURAS.RC_AMT
            ? vm.riesgos = riesgos
            : vm.riesgos.push(riesgos[0])
        } else {
          vm.riesgos.push(riesgos[0])
        }
      }
      vm.emision.modelo = {
        TipoSolicitud: "Solicitud de Cotización",
        TipoCotizacion: "NUEVA",
        emails: [{ email: vm.tramite.userEmail }],
        tramite: vm.tramite,
        checkEmail: true,
        documentacion: vm.riesgos,
        documentacionAll: []
      }
      riesgosGeneralesService.tipoDocumento()
        .then(function (response) {
          vm.tipoDocumento = response.Data;
        });
      riesgosGeneralesService.fraccionamiento().then(function (response) {
        vm.fraccionamiento = response.Data
      })
      riesgosGeneralesService.getCurrencyType(false)
        .then(function (response) {
          vm.monedas = response.Data;
        });

      if (vm.isMydream){
        riesgosGeneralesService.agenteSuscripcion(vm.emision.modelo.tramite.CodigoAgente)
        .then(function (response) {
          if (response.OperationCode === 200){
            vm.emision.modelo.tramite.CodigoAgente = response.Data.CodigoAgente;
            getAgente();
          }
        })
      }

    };
    function AddCorreo() {
      if (vm.emision.modelo.email.trim() && vm.form.email.$valid)
        vm.emision.modelo.emails.push({ email: vm.emision.modelo.email })
      vm.emision.modelo.email = ''
    }
    function DeleteCorreo(nroItem) {
      vm.emision.modelo.emails.splice(nroItem, 1);
    }
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function CambioTipoDocumento(documento) {
      if (angular.isUndefined(documento.TipDoc)) {
        return;
      } else {
        riesgosGeneralesFactory.setValidadores(documento)
        documento.NumeroDoc = ''
        documento.Nombres = ''
      }
    }
    function getAgente (){
      riesgosGeneralesService.agente(vm.emision.modelo.tramite.CodigoAgente)
        .then(function (response) {
          if(response.Data.Nombre){
            vm.emision.modelo.tramite.ResCotizacion.Agente.Descripcion = response.Data.Nombre;
          }else{
            vm.emision.modelo.tramite.ResCotizacion.Agente.Descripcion = null;
            mModalAlert
            .showWarning('El Código  de agente ingresado no existe', 'ALERTA');
          }
        }).catch(function(error){
          vm.emision.modelo.tramite.ResCotizacion.Agente.Descripcion = null;
          mModalAlert
            .showWarning('El Código de agente ingresado no existe', 'ALERTA');
        });
    }
    function OpenModal(validate, item) {
      $scope.data = {
        emision: vm.emision,
        type: validate,
        item: item
      }
      var vModalSendEmail = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        template: '<rrgg-modal-upload-document data="data"   close="close()"></rrgg-modal-upload-document>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalSendEmail.result.then(function () {
      }, function () {
      });
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('suscriptorController', suscriptorController)
    .component('rrggSuscriptor', {
      templateUrl: '/polizas/app/rrgg/components/suscriptor/suscriptor.component.html',
      controller: 'suscriptorController',
      bindings: {
        cotizacion: "=",
        tramite: "=",
        form: "=?form"
      }
    })
});
