'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function(ng, coreConstants, system, _) {
  var folder = system.apps.ap.location;

  AddDeceasedController.$inject = ['$scope', 'MassMaintenanceFactory'];
  function AddDeceasedController($scope, MassMaintenanceFactory) {
    var vm = this;
    vm.frm = vm.frm || {};
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;

    vm.cancel = cancel;
    vm.save = save;
    vm.changeDocumentTypeDeceased = changeDocumentTypeDeceased;
    vm.changeDocumentTypeTitular = changeDocumentTypeTitular;
    vm.cellPhoneValid = cellPhoneValid;

    MassMaintenanceFactory.GetDocumentType(false).then(function(res) {
      vm.documentTypes = res;

      if(vm.mode === 2) {
        setValidationDocumentTypeDeceased(getDocumentType(vm.frm.fallecido.tipoDocumento.codigo));
        setValidationDocumentTypeTitular(getDocumentType(vm.frm.fallecido.pariente.tipoDocumento.codigo));
      }
    });

    function onDestroy() {
      // console.log("destroy");
    }

    function onInit() {
      $scope.validation1 = 'onlyNumber,onlyLetterNumber';
      $scope.validation2 = 'onlyNumber,onlyLetterNumber';

      if(vm.mode === 2) {
        vm.frm.fallecido = JSON.parse(JSON.stringify(vm.data));
      } else {
        $scope.maxLengthDoc1 = 8;
        $scope.minLengthDoc1 = 8;
        $scope.validationDisabled1 = 'onlyLetterNumber';
  
        $scope.maxLengthDoc2 = 8;
        $scope.minLengthDoc2 = 8;
        $scope.validationDisabled2 = 'onlyLetterNumber';
      }
    }

    function cancel() {
      if(vm.mode === 2) {
        vm.data.edit = false;
      } else {
        vm.onCancel();
      }
    }

    function setData(frm) {
      vm.data.nombres = frm.fallecido.nombres;
      vm.data.apellidoPaterno = frm.fallecido.apellidoPaterno;
      vm.data.apellidoMaterno = frm.fallecido.apellidoMaterno;
      vm.data.numeroDocumento = frm.fallecido.numeroDocumento;
      vm.data.tipoDocumento = frm.fallecido.tipoDocumento;
      vm.data.pariente = frm.fallecido.pariente;
    }

    function save(fallecido) {
      if(vm.mode === 1) {
        setData(vm.frm);
        vm.onPush();
      } else {
        if(vm.data.idFallecido) {
          vm.onSave({
            $arg: fallecido
          });
        } else {
          setData(vm.frm);
          vm.data.edit = false;
        }
      }
    }

    function changeDocumentTypeDeceased(doc) {
      vm.frm.fallecido.numeroDocumento = '';
      setValidationDocumentTypeDeceased(doc);
    }

    function changeDocumentTypeTitular(doc) {
      vm.frm.fallecido.pariente.numeroDocumento = '';
      setValidationDocumentTypeTitular(doc);
    }

    function setValidationDocumentTypeDeceased(doc) {
      $scope.maxLengthDoc1 = doc.longMaxima;
      $scope.minLengthDoc1 = doc.longMinima;
      $scope.validationDisabled1 = getValidationDisabled(doc.tipoDato);
    }

    function setValidationDocumentTypeTitular(doc) {
      $scope.maxLengthDoc2 = doc.longMaxima;
      $scope.minLengthDoc2 = doc.longMinima;
      $scope.validationDisabled2 = getValidationDisabled(doc.tipoDato);
    }

    function cellPhoneValid(cellPhone) {
      var isValid = true;
      if(cellPhone) {
        if(cellPhone < 900000000 || cellPhone > 999999999) {
          isValid = false;
        }
      }
      return isValid;
    }

    function getValidationDisabled(dataType) {
      switch(dataType) {
        case "NUMERICO": return 'onlyLetterNumber'; break;
        case "ALFANUMERICO": return 'onlyNumber'; break;
        default: return 'onlyLetterNumber'; break;
      } 
    }

    function getDocumentType(cod) {
        return vm.documentTypes.filter(function(obj) { return obj.codigo === cod }).pop();
    }

  } // end controller
  return ng
    .module(coreConstants.ngMainModule)
    .controller('AddDeceasedController', AddDeceasedController)
    .component('addDeceasedComponent', {
      templateUrl: folder + '/app/mass-adm/mass/components/deceased/add/add-deceased.component.html',
      controller: 'AddDeceasedController',
      bindings: {
        data: "=?",
        mode: "=?",
        onCancel: '&?',
        onSave: '&?',
        onPush: '&?'
      }
    });
});