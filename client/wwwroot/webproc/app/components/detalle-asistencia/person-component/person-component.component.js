'use strict';

define(['angular', 'lodash', 'AsistenciaActions', 'wpConstant'], function (ng, _, AsistenciaActions, wpConstant) {
  PersonComponentController.$inject = ['wpFactory', '$log', '$scope', 'mainServices','$timeout', '$rootScope'];
  function PersonComponentController(wpFactory, $log, $scope, mainServices, $timeout, $rootScope) {
    var vm = this
    var onFrmSave;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.getPerson = getPerson;
    vm.documentTypeSource = [];
    vm.dateFormat = 'dd/MM/yyyy';
    vm.frmConductor = {}
    $scope.frmPerson = {}
    vm.docNumType = ""
    vm.showForm = true;

    vm.documentTypeChange = documentTypeChange;
    vm.calcularEdad = calcularEdad;

    vm.searched = false;
    $timeout(function() {
      if(vm.conductor && vm.conductor.codigoTipoDocumentoIdentidad ){
        documentNumberValidation();
        if(vm.frmConductor.numeroDocumentoIdentidad && !vm.frmConductor.nombreConductor ) {
          getPerson();
        }
        vm.frmConductor.edadCondutor = (vm.frmConductor && vm.frmConductor.fchNacimientoConductor) ? wpFactory.help.calcularEdad(vm.frmConductor.fchNacimientoConductor) : null
      }
    });

    function onDestroy() {
      onFrmSave();
    }

    function onInit() {
      onFrmSave = $rootScope.$on('frm:save', setFrm)
      vm.title = vm.isUa ? 'Conductor unidad asegurada' : 'Conductor Tercero';
      vm.docNumType = vm.isUa ? 'required' : '';
      vm.isRequired = vm.isUa ? true : false;
      if(vm.conductor && vm.conductor.codigoTipoDocumentoIdentidad ==0) {
        vm.conductor.codigoTipoDocumentoIdentidad = 1
      }
      vm.frmConductor = ng.copy(vm.conductor || { itemConductor: 1 });
    }

    function setFrm() {
      if ($scope.frmPerson.$invalid) {
        $scope.frmPerson.markAsPristine()
        return void 0;
      }
      vm.conductor = vm.frmConductor.codigoTipoDocumentoIdentidad ? vm.frmConductor : undefined
    }

    function setConductor(data) {
      vm.frmConductor.codigoTipoDocumentoIdentidad = vm.frmConductor.codigoTipoDocumentoIdentidad;
      vm.frmConductor.numeroDocumentoIdentidad = data ? data.num_documento : vm.frmConductor.numeroDocumentoIdentidad;
      vm.frmConductor.nombreConductor = data ? data.nombres : null;
      vm.frmConductor.paternoConductor = data ? data.ape_paterno : null;
      vm.frmConductor.telefonoConductor = data ? data.telefono : null;
      vm.frmConductor.correoConductor = data ? data.email : null;
      vm.frmConductor.fchExpiracionLicenciConductor = null;
      vm.frmConductor.licenciaConductor = null;
      vm.frmConductor.codigoLicenciaConductor = null;
      vm.frmConductor.fchNacimientoConductor = data ? new Date(data.fechaNacimiento) : null;
      vm.frmConductor.edadCondutor = data && data.fechaNacimiento ? wpFactory.help.calcularEdad(data.fechaNacimiento) : null;
      // (Hack) : para setear valores a selects del componente cbo
      $scope.frmPerson.codigoLicenciaConductor = null;
    }

    function getPerson() {
      if (vm.frmConductor.numeroDocumentoIdentidad && vm.frmConductor.codigoTipoDocumentoIdentidad) {
        wpFactory.siniestro.GetSiniestroPerson(vm.frmConductor.numeroDocumentoIdentidad, 0, $scope.frmPerson.codigoTipoDocumentoIdentidad.descripcionParametro, 1)
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

    function calcularEdad(){
      vm.frmConductor.edadCondutor = wpFactory.help.calcularEdad(vm.frmConductor.fchNacimientoConductor) ;
    }

    function documentTypeChange() {
      vm.frmConductor.numeroDocumentoIdentidad = '';
      setConductor(null);

      if (!ng.isUndefined($scope.frmPerson.codigoTipoDocumentoIdentidad)) {
        $timeout(function tcd() {
          documentNumberValidation();
          if(!vm.isUa) {
            vm.docNumType = vm.frmConductor.codigoTipoDocumentoIdentidad ? (vm.docNumType + ",required") : vm.docNumType;
            vm.isRequired = vm.frmConductor.codigoTipoDocumentoIdentidad ? true : false;
            // Hack: para refrescar validaciones del CBO
            vm.showForm = false;
            $timeout(function () {
              vm.showForm = true;
            })
          }
        }, 0);
      }
    }

    function documentNumberValidation(){
      var numDocValidations = {};
      mainServices.documentNumber.fnFieldsValidated(numDocValidations,$scope.frmPerson.codigoTipoDocumentoIdentidad.descripcionParametro, 1);
      vm.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
      vm.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
      vm.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE + (vm.isUa ? ",required" : '');
      vm.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('PersonComponentController', PersonComponentController)
    .component('wpPersonComponent', {
      templateUrl: '/webproc/app/components/detalle-asistencia/person-component/person-component.html',
      controller: 'PersonComponentController',
      bindings: {
        isUa: '=?',
        conductor: '=?',
        validateForm: '=?',
        modoLectura: '=?'
      }
    });
});
