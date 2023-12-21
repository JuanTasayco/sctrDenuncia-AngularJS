'use strict';

define(['angular', 'lodash'], function (ng, _) {
  AgregarEditarAtropelladoController.$inject = ['$rootScope', '$scope', '$timeout', 'wpFactory', 'mainServices'];
  function AgregarEditarAtropelladoController($rootScope, $scope, $timeout, wpFactory, mainServices) {
    var vm = this;
    vm.$onInit = onInit;
    vm.grabarAtropellado = grabarAtropellado;
    vm.cerrarFrm = cerrarFrm;
    vm.getPerson = getPerson;
    vm.documentTypeChange = documentTypeChange;

    function onInit() {
      vm.frm = {}
      vm.frmTitulo = vm.esFrmAgregar ? 'Agregando Atropellado' : 'Editando Atropellado';
      !vm.esFrmAgregar && asignarDatosAlModelo();
    }

    function asignarDatosAlModelo() {
      vm.frm = ng.copy(vm.atropellado);
    }

    function grabarAtropellado() {
      if (vm.frmAtropellado.$invalid) {
        vm.frmAtropellado.markAsPristine();
        return void 0;
      }

      vm.ngIf = false;
      vm.esFrmAgregar && vm.onAgregar({$event: {atropellado: vm.frm}});
      if (!vm.esFrmAgregar) {
        vm.onEditar({$event: {idx: vm.idxAtropellado, atropellado: vm.frm}});
        $scope.$emit('atropellado:frmEditCerrado');
      }
      $timeout(function() {
        $rootScope.$emit('atropellado:frmCerrado');
      });
    }

    function cerrarFrm() {
      vm.ngIf = false;
      $scope.$emit('atropellado:frmEditCerrado');
      $rootScope.$emit('atropellado:frmCerrado');
    }

    function getPerson() {
      console.log(vm.frmAtropellado)
      if (vm.frm.numeroDocumentoIdentidad  && vm.frm.CodigoTipoDocumentoIdentidad) {
        wpFactory.siniestro.GetSiniestroPerson(vm.frm.numeroDocumentoIdentidad, 0, vm.frmAtropellado.CodigoTipoDocumentoIdentidad.descripcionParametro, 1)
          .then(function (response) {
            response.persona.respuesta == "1"
            ? setConductor(response.persona)
            : setConductor(null);
          }).catch(function aEPr(err) {
            $log.error('Falló al obtener equifax', err.data);
            setConductor(null);
          })
      }
    }

    function documentTypeChange() {
      vm.frm.numeroDocumentoIdentidad = '';
      setConductor(null);
      console.log("documentTypeChange",vm.frmAtropellado.CodigoTipoDocumentoIdentidad)
      if (!ng.isUndefined(vm.frmAtropellado.CodigoTipoDocumentoIdentidad)) {
        $timeout(function tcd() {
          documentNumberValidation();
        }, 0);
      }
    }

    function setConductor(data) {
      vm.frm.CodigoTipoDocumentoIdentidad = vm.frm.CodigoTipoDocumentoIdentidad;
      vm.frm.nombrePeaton = data ? data.nombres : null;
      vm.frm.paternoPeaton = data ? data.ape_paterno : null;
      vm.frm.telefonoPeaton = data ? data.telefono : null;
      vm.frm.correoPeaton = data ? data.email : null;
    }

    function documentNumberValidation(){
      var numDocValidations = {};
      mainServices.documentNumber.fnFieldsValidated(numDocValidations,vm.frmAtropellado.CodigoTipoDocumentoIdentidad.descripcionParametro, 1);
      vm.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
      vm.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
      vm.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE +  ",required";
      vm.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
    }
  }

  return ng
    .module('appWp')
    .controller('AgregarEditarAtropelladoController', AgregarEditarAtropelladoController)
    .component('wpAgregarEditarAtropellado', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/common/agregar-atropellado/agregar-editar-atropellado/agregar-editar-atropellado.html',
      controller: 'AgregarEditarAtropelladoController',
      bindings: {
        atropellado: '<?',
        esFrmAgregar: '<?',
        idxAtropellado: '<?',
        ngIf: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        modoLectura: '=?'
      }
    });
});
