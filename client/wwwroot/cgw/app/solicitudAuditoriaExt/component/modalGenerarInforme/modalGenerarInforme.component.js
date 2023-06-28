define([
  'angular', 'constants', '/cgw/app/factory/cgwFactory.js',
], function(ng, constants) {

  ModalGenerarInformeController.$inject = ['$scope', 'cgwFactory', '$sce', '$timeout', '$http', 'mpSpin', 'mModalAlert', 'mModalConfirm', '$state', '$window'];

  function ModalGenerarInformeController($scope, cgwFactory, $sce, $timeout, $http, mpSpin, mModalAlert, mModalConfirm, $state, $window) {
    var vm = this;
    vm.data.txtBtnThx = vm.data.txtBtnThx || 'Cerrar';

    vm.$onInit = function() {

      vm.files = [];
      vm.filesT = [];
      vm.arrayDeleted = [];

      vm.oimClaims = cgwFactory.getVariableSession('oimClaims');

      var paramsListFileInformeAuditoria =
      {
        CodeCompany: parseInt(vm.data.letterCia),
        Year: parseInt(vm.data.yearLetter),
        Number: parseInt(vm.data.letterNumber),
        Version: parseInt(vm.data.letterVersion),
        ExternalAuditNumber: parseInt(vm.data.externalAuditNumber)
      };

      getListFileInformeAuditoria(paramsListFileInformeAuditoria);

      vm.fileAuditoriaExtURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw+ 'api/externalaudit/attachfile/download');
    };

    $scope.$watch('vm.myFile', function() {
      if (vm.myFile !== undefined)
        vm.filesT.push(vm.myFile);
    });

    vm.downloadPlanilla = downloadPlanilla;
    vm.downloadAdjunto = downloadAdjunto;
    vm.saveInformeAuditoria = saveInformeAuditoria;
    vm.finishInformeAuditoria = finishInformeAuditoria;
    vm.deleteFile = deleteFile;
    vm.deleteFileAuditoria = deleteFileAuditoria;

    function downloadAdjunto(name) {
      var paramsFile = {
        FileNameLarge: name
      };

      vm.downloadAtachFile = paramsFile;

      $timeout(function() {
        document.getElementById('frmFileuditoriaExt').submit();
      }, 500);
    }

    function downloadPlanilla(type) {

      var paramsFile = {
        DateRequested: vm.data.mFechaSolicitud,
        ExternalAuditor: vm.data.fullName,
        PatientFullName: vm.data.mPaciente,
        Age: vm.data.mEdad,
        PolicyMode: vm.data.mModalidadPoliza,
        EffectiveDate: new Date(),
        Exclusion: vm.data.mExclusiones,
        Continuity: vm.data.mContinuidad,
        Diagnostic: vm.data.mDiagnostico,
        Treatment: vm.data.mTratamientoProcedimiento,
        ProvideName: vm.data.mClincasCentros,
        Requirements: vm.data.mRequerimiento,
        AdditionalInformation: vm.data.mInfoAdicional
      };

      vm.downloadFile = paramsFile;

      if (type === 1) {//PDF
        vm.informeAuditoriaExtURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw+ 'api/externalaudit/template/PDF');
      }else if (type === 2) {//word
        vm.informeAuditoriaExtURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw+ 'api/externalaudit/template/WORD');
      }

      $timeout(function() {
        document.getElementById('frmInformeAuditoriaExt').submit();
      }, 500);

    }

    function getListFileInformeAuditoria(params) {
      cgwFactory.getListFileInformeAuditoria(params).then(function (response) {
        if (response.data.items.length > 0) {
          vm.filesAuditoria = response.data.items;
        }
      });
    }

    function finishInformeAuditoria() {

      mModalConfirm.confirmInfo('¿Estás seguro que desea aprobar la auditoría externa?','AUDITORIA EXTERNA','').then(function(response) {
        if (response) {
          var paramsFinishInforme = { // ExternalAuditUpdateReportRq
            CodeCompany: parseInt(vm.data.letterCia),
            Year: parseInt(vm.data.yearLetter),
            Number: parseInt(vm.data.letterNumber),
            Version: parseInt(vm.data.letterVersion),
            StateId: 0,
            GuaranteeLetterStateId: 0,
            UpdatedUser: vm.oimClaims.loginUserName,
            NumberExternalAudit: parseInt(vm.data.externalAuditNumber),
            Report: vm.data.mRequerimiento,
            Comment: vm.data.comment,
            AttachFiles: []
          };

          var fd = new FormData();
          fd.append("request", JSON.stringify(paramsFinishInforme));

          if (vm.filesT === undefined) {
           // fd.append("fieldNameHere", null);
          } else {
            for(var i=0; i<vm.filesT.length; i++) {
              fd.append("fieldNameHere", vm.filesT[i][0]);
            }
          }

          $http.post(constants.system.api.endpoints.cgw + 'api/externalaudit/approve', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function(c) {
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
                mpSpin.start();
              }
            }
          })
          .success(function(response) {
            mpSpin.end();
            $state.go('consultaAuditorCgw', {reload: true, inherit: false});
            if (response.operationCode === 500)
              mModalAlert.showError('Error al cargar', 'Error');
            else
              vm.close();
          })
          .error(function() {
            mModalAlert.showError('Error al cargar', 'Error');
            mpSpin.end();
          });
        } else {
          vm.close();
        }
      });
    }

    function saveInformeAuditoria() {

      mModalConfirm.confirmInfo('¿Estás seguro que desea guardar los cambios?','AUDITORIA EXTERNA','').then(function(response) {
        if (response) {
          var paramsSaveInforme = { // ExternalAuditUpdateReportRq
            CodeCompany: parseInt(vm.data.letterCia),
            Year: parseInt(vm.data.yearLetter),
            Number: parseInt(vm.data.letterNumber),
            Version: parseInt(vm.data.letterVersion),
            StateId: 0,
            GuaranteeLetterStateId: 0,
            UpdatedUser: vm.oimClaims.loginUserName,
            NumberExternalAudit: parseInt(vm.data.externalAuditNumber),
            Report: vm.data.mRequerimiento,
            Comment: vm.data.comment,
            AttachFiles: []
          };

          vm.attachFilesDeleted  = {
            AttachFilesDeleted : vm.arrayDeleted
          };

          var fd = new FormData();
          fd.append("request",  JSON.stringify(paramsSaveInforme));

           if (vm.filesT === undefined) {
           // fd.append("fieldNameHere", null);
          } else {
            for(var i=0; i<vm.filesT.length; i++) {
              fd.append("fieldNameHere", vm.filesT[i][0]);
            }
          }

          fd.append("filesDeleted", JSON.stringify(vm.attachFilesDeleted));

          $http.post(constants.system.api.endpoints.cgw + 'api/externalaudit/save', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            eventHandlers: {
              progress: function(c) {
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
                mpSpin.start();
              }
            }
          })
          .success(function(response) {
            mpSpin.end();
            if (response.operationCode === 500) {
              mModalAlert.showError('Error al cargar', 'Error');
            }
            else{
              vm.close();
              $state.go('consultaAuditorCgw', {reload: true, inherit: false});
            }
          })
          .error(function() {
            mpSpin.end();
            mModalAlert.showError('Error al cargar', 'Error');
          });
        } else {
          vm.close();
        }
      });
    }

    function deleteFile(index, array) {
      var filesBkp = [];

      angular.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        }
      });

      vm.filesT = filesBkp;
    }

    function deleteFileAuditoria(index, array) {
      var filesBkp = [];

      angular.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        } else {
          vm.fileD = {
            FileNameLarge: array[key].fileLargeName
          };

          vm.arrayDeleted.push(vm.fileD);

          cgwFactory.deleteFileAuditoria(vm.fileD).then(function (response) {
          });
        }
      });
      vm.filesAuditoria = filesBkp;
    }

  } // end controller

  return ng.module('appCgw')
    .controller('ModalGenerarInformeController', ModalGenerarInformeController)
    .component('mfpModalGenerarInforme', {
      templateUrl: '/cgw/app/solicitudAuditoriaExt/component/modalGenerarInforme/modalGenerarInforme.html',
      controller: 'ModalGenerarInformeController',
      controllerAs: 'vm',
      bindings: {
        data: '=?',
        close: '&?'
      }
    })
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      };
    });
});
