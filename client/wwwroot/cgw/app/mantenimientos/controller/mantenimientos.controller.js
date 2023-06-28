(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', '/cgw/app/factory/cgwFactory.js', 'mfpModalAgregarCliente', 'mfpModalQuestion'],
  function(angular, constants, helper){

    var appCgw = angular.module('appCgw');

    appCgw.controller('MantenimientosController',
      ['$scope', '$window', '$state', '$timeout', '$uibModal', '$q', 'cgwFactory', '$rootScope', 'mModalAlert',
      function($scope, $window, $state, $timeout, $uibModal, $q, cgwFactory, $rootScope, mModalAlert){
        var vm = this;

        vm.deleteClient = deleteClient;
        vm.saveDiagnostic = saveDiagnostic;
        vm.deleteDiagnostic = deleteDiagnostic;

        $scope.formData = {};
        $scope.disabledButton = "disabled";

        function deleteClient(code) {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
            controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
              scope.close = function clFn() {
                $uibModalInstance.close();
              };
              scope.eliminarCliente = function acFn() {
                // aqui se debe llamar al servicio para eliminar el cliente
                //con el valor de code

                cgwFactory.Resource_Client_Priority_Delete(code, true).then(function(response) {
                  mModalAlert.showSuccess(response.message,'','').then(function(response){
                    $uibModalInstance.close();
                    $state.reload();
                  });
                 }, function(error){
                    mModalAlert.showError(error.data.message, 'Error');
                });

                $uibModalInstance.close();
              };
              // Los parametros que recibe el componente estan detallados en el js del componente
              scope.data = {
                mostrarObservaciones: false,
                cartaGarantia: $scope.cartaGarantia,
                title: '¿Desea eliminar el cliente?',
                btns: [
                  {
                    lbl: 'No',
                    accion: scope.close,
                    clases: 'g-btn-transparent'
                  },
                  {
                    lbl: 'Si',
                    accion: scope.eliminarCliente,
                    clases: 'g-btn-verde'
                  }
                ]//,
              };
            }] // end Controller uibModal
          });
        }

        function saveDiagnostic() {

        }

        function deleteDiagnostic(code){
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
            controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
              scope.close = function clFn() {
                $uibModalInstance.close();
              };
              scope.eliminarDiagnostico = function acFn() {
                // aqui se debe llamar al servicio para eliminar el diagnostico
                //con el valor de code

                cgwFactory.Resource_Diagnostic_Priority_Delete(code, true).then(function(response) {
                  mModalAlert.showSuccess(response.message,'','').then(function(response){
                    $uibModalInstance.close();
                    $state.reload();
                  });
                 }, function(error){
                    mModalAlert.showError(error.data.message, 'Error');
                });

                $uibModalInstance.close();
              };
              // Los parametros que recibe el componente estan detallados en el js del componente
              scope.data = {
                mostrarObservaciones: false,
                cartaGarantia: $scope.cartaGarantia,
                title: '¿Desea eliminar el diagnóstico?',
                btns: [
                  {
                    lbl: 'No',
                    accion: scope.close,
                    clases: 'g-btn-transparent'
                  },
                  {
                    lbl: 'Si',
                    accion: scope.eliminarDiagnostico,
                    clases: 'g-btn-verde'
                  }
                ]//,
              };
            }] // end Controller uibModal
          });
        }

        (function onLoad(){
         cgwFactory.ExternalAuditorGetList().then(function(response){
            $scope.auditores = response.data.items;
          }).catch(function(exc){
          });

          cgwFactory.Resource_Diagnostic_Priority_GetList().then(function(response){
            $scope.diagnostics = response.data.items;
          }).catch(function(exc){
          });

          cgwFactory.Resource_Client_Priority_GetList().then(function (response) {
            $scope.clients = response.data.items;
          }).catch(function (exc) {
          });

          cgwFactory.Resource_Eps_Get_ListTypeDocument().then(function (response) {
            if(response.data){
              $scope.tipoDocumentos = response.data;
            }
          }).catch(function (exc) {
          });
           
            cargarCoverageMinsa(); 
        })();

          function cargarCoverageMinsa(load) {
            cgwFactory.Resource_CoverageMinsa_GetList(load).then(function (response) {
              $scope.coverageMinsa = response.data.items;
            }).catch(function (exc) {
            });
          };

        $scope.fnShowModalAuditarNuevo = function(value, item){
          $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            templateUrl : 'app/mantenimientos/components/modalAuditorNuevo.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
              function($scope, $uibModalInstance, $uibModal, $timeout) {
              /*#########################
              # closeModal
              #########################*/
              $scope.closeModal = function () {
                $uibModalInstance.close();
                $scope.cleanFields(0);
              };
              $scope.crearAuditor2 = function(formData){
                $scope.frmAuditor.markAsPristine();
                //en cualquiera de los casos tenemos la data del modal

                var paramAuditor = {
                  providerCode: 0,
                  typePerson: ($scope.formData.mTipoBusqueda == 'JURIDICA') ? "J" : "N",
                  typeProvider: 4,//$scope.formData.mTypeProvider,
                  fullName: ($scope.formData.mTipoBusqueda == 'JURIDICA') ? $scope.formData.mRazSocialNombre : $scope.formData.mNombre + " " + $scope.formData.mApelPaterno + " " + $scope.formData.mApelMaterno, //apellidos + nombres
                  shortName: ($scope.formData.mTipoBusqueda == 'JURIDICA') ? $scope.formData.mRazSocialNombre : $scope.formData.mNombre + " " + $scope.formData.mApelPaterno + " " + $scope.formData.mApelMaterno, //apellidos + nombres
                  lastName: ($scope.formData.mTipoBusqueda == 'JURIDICA') ? "" : $scope.formData.mApelPaterno,
                  lastName2: ($scope.formData.mTipoBusqueda == 'JURIDICA') ? "" : $scope.formData.mApelMaterno,
                  firstName: ($scope.formData.mTipoBusqueda == 'JURIDICA') ? "" : $scope.formData.mNombre,
                  secondName: "",
                  typeDocument: 2,
                  documentNumber: $scope.formData.mNroDoc,
                  mail: $scope.formData.mEmail
                };

                paramAuditor.fullName = paramAuditor.fullName.substring(0, 69);
                paramAuditor.shortName = paramAuditor.shortName.substring(0, 19);
                paramAuditor.firstName = paramAuditor.firstName.substring(0, 29);
                paramAuditor.lastName = paramAuditor.lastName.substring(0, 29);
                paramAuditor.lastName2 = paramAuditor.lastName2.substring(0, 29);

                if(value===1){ //actualizamos la info del auditor

                  cgwFactory.ExternalAuditorSave(paramAuditor, true).then(function(response) {
                    mModalAlert.showSuccess(response.message,'','').then(function(response){
                      $uibModalInstance.close();
                      $state.reload();
                    });
                   }, function(error){
                      mModalAlert.showError(error.data.message, 'Error');
                  });
                }

                if(value===0){ //agregamos un nuevo auditor
                  paramAuditor.providerCode = $scope.formData.mProviderCode;

                  cgwFactory.ExternalAuditorSave(paramAuditor, true).then(function(response) {
                    mModalAlert.showSuccess(response.message,'','').then(function(response){
                      $uibModalInstance.close();
                      $state.reload();
                    });
                   }, function(error){
                      mModalAlert.showError(error.data.message, 'Error');
                  });
                }
                $scope.closeModal();
              }
              // Los parametros que recibe el componente estan detallados en el js del componente
              if(value===1){

                $scope.formData.mTipoBusqueda = (item.typePerson == 'J') ? "JURIDICA" : "NATURAL";
                if($scope.formData.mTipoBusqueda == 'JURIDICA'){
                  $scope.formData.mRazSocialNombre = item.fullName;

                }else{
                  $scope.formData.mNombre = item.firstName;
                  $scope.formData.mApelPaterno = item.lastName;
                  $scope.formData.mApelMaterno = item.lastName2;
                }

                $scope.formData.mNroDoc = item.documentNumber;
                $scope.formData.mEmail = item.mail;
                $scope.formData.mProviderCode = item.providerCode;

                $scope.data = {
                  auditor: 1,
                  title: 'INFORMACIÓN AUDITOR',
                  boton: 'ACTUALIZAR'
                };
              }else{
                $scope.data = {
                  auditor: 0,
                  title: 'AUDITOR NUEVO',
                  boton: 'CREAR AUDITOR'
                };
              }
            }]
          });
        };

        function funDocNumMaxLength(documentType){
          switch(documentType) {
            case constants.documentTypes.dni.Codigo:
              $scope.formData.docNumMaxLength = 8;
              break;
            case constants.documentTypes.ruc.Codigo:
              $scope.formData.docNumMaxLength = 11;
              break;
            case constants.documentTypes.carnetExtrajeria.Codigo:
              $scope.docNumMaxLength = 12;$scope.docNumMinLength = 6;
              break;
            default:
              $scope.formData.docNumMaxLength = 13;
          }
        }

        $scope.showNaturalPerson = function(item){
          if(item){
            $scope.formData.mNroDoc = '';
            funDocNumMaxLength(item.name);
          }
        }

        $scope.fnShowModalAddDiagnostico = function(){
          $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'lg',
            templateUrl : 'app/mantenimientos/components/modalAddDiagnostico.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
              function($scope, $uibModalInstance, $uibModal, $timeout) {
              /*#########################
              # closeModal
              #########################*/
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              $scope.addDiagnostic = function (value) {
                // valor del diagnostico agregado, aqui se debe llamar al servicio que realice
                //  la insercion del valor
                var paramDiagnostic = {
                  Code : value.code,
                  Description : value.name
                };

                cgwFactory.Resource_Diagnostic_Priority_Save(paramDiagnostic, true).then(function(response) {
                  mModalAlert.showSuccess(response.message,'','').then(function(response){
                    $uibModalInstance.close();
                    $state.reload();
                  });
                 }, function(error){
                    mModalAlert.showError(error.data.message, 'Error');
                });
              };
            }]
          });
        };

        $scope.fnShowModalBuscarCliente = function(){
         $scope.cliente = {
            CodeCompany: 0
          };

          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            windowTopClass: 'modal--lg',
            template: '<mfp-modal-agregar-cliente data="cliente" close="close()"></mfp-modal-agregar-cliente>',
            controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
              scope.close = function clFn() {
                $uibModalInstance.close();
                if($scope.cliente.dataCliente){
                  $scope.addCliente();
                }
              };
              $scope.addCliente = function (value) {
                /*
                  En esta variable tenemos todos los datos del cliente a agregar
                  aqui llamaremos al servicio para el insert
                */

                var paramsAddClient = {
                  Code : $scope.cliente.dataCliente.code,
                  Description : $scope.cliente.dataCliente.name
                };
               cgwFactory.Resource_Client_Priority_Save(paramsAddClient, true).then(function(response) {
                  mModalAlert.showSuccess(response.message,'','').then(function(response){
                    $uibModalInstance.close();
                    $state.reload();
                  });
                 }, function(error){
                    mModalAlert.showError(error.data.message, 'Error');
                });

              };
            }] // end Controller uibModal
          });
        };

        $scope.getListDiagnostic = function(wilcar) {
          if (wilcar && wilcar.length >= 3) {
            var paramDiagnostic = {
              diagnosticName: wilcar.toUpperCase()
            }

            var defer = $q.defer();
            cgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
              defer.resolve(response.data.items);
             }, function(error){
              mModalAlert.showError(error.data.message, 'Error');
            });

            return defer.promise;
          }
        };

        $scope.cleanFields = function(condicion){
          if(condicion == 0){
            $scope.formData.mRazSocialNombre = '';
            $scope.formData.mTipoDocumento = {code: null};
            $scope.formData.mNroDoc = '';
            $scope.formData.mEmail = '';
            $scope.formData.mNombre = '';
            $scope.formData.mApelPaterno = '';
            $scope.formData.mApelMaterno = '';
          }
        };

        function searchActiveAuditor(){
          angular.forEach($scope.auditores, function(value, key) {
            if($scope.auditores[key].mCheck)
              $scope.activeAuditor = true;
            else
              $scope.activeAuditor = false;
          });
        }

        $scope.showInactivarAuditor = function(item){
          searchActiveAuditor();
          if(item || $scope.activeAuditor)
            $scope.disabledButton = "";
          else
            $scope.disabledButton = "disabled";
        }

        $scope.inactivarAuditor = function(){
          $scope.inactivos = [];
          angular.forEach($scope.auditores, function(value, key) {
            if($scope.auditores[key].mCheck){
             $scope.eliminados=true;
              cgwFactory.Resource_ExternalAuditor_Delete($scope.auditores[key].providerCode, true).then(function(response) {
               }, function(error){
                  mModalAlert.showError(error.data.message, 'Error');
              });
            }
          });

          if($scope.eliminados){
            $state.reload();
          }

          //llamamos al servicio para enviar el array de auditores a inactivar

          //limpiamos el array de $scope.inactivos
          $scope.inactivos = [];
        }

          $scope.optionsP = { scale: 2, simbol: { value: '', align: 'rigth' } };

          $scope.funcShowModalLogCoverage = function (itemCoverage){
            $uibModal.open({
              backdrop: 'static',
              backdropClick: true, 
              dialogFade: false, 
              keyboard: false, 
              scope: $scope, 
              size: 'lg', 
              templateUrl: 'app/mantenimientos/components/modalLogCobertura.html',
              controller: ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal){
                $scope.closeModal = function(){
                  $uibModalInstance.close();
                }

                /* var parameterLog = {
                  TypeAttention: itemCoverage.codeAttentionType
                } */

                cgwFactory.Resource_CoverageMinsa_GetLog(itemCoverage.codeAttentionType, true).then(function (response){
                  if(response.data.items.length > 0){
                    $scope.dataLogCoverage = response.data.items;
                    $scope.noDataLog = false;
                  }
                  else{
                    $scope.noDataLog = true;
                  }
                });

                $scope.nameAttentionType = itemCoverage.attentionType;

              }]

            });
          }

          $scope.functShowModalEditCoverage = function (item) {
            $uibModal.open({
              backdrop: 'static',
              backdropClick: true,
              dialogFade: false,
              keyboard: false,
              scope: $scope,
              size: 'xs',
              templateUrl: 'app/mantenimientos/components/modalEditCobertura.html',
              controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
                function ($scope, $uibModalInstance, $uibModal, $timeout) {
                  
                  $scope.closeModal = function () {
                    $uibModalInstance.close();
                    $scope.cleanFields(0);
                  };
                  
                  $scope.editarPercentCoverage = function (formData) {
                    $scope.frmCoverage.markAsPristine();

                    var paramCoverage = {
                      codeCoverMinsa: $scope.formData.eCodeCoverMinsa,
                      percentCover: $scope.formData.eCoverPercent
                    };

                    if(paramCoverage.percentCover !== '' && paramCoverage.percentCover !== '0'){
                      cgwFactory.Resource_CoverageMinsa_Save(paramCoverage, true).then(function (response) {
                        mModalAlert.showSuccess(response.message, '', '').then(function (response) {
                          $uibModalInstance.close();
                          cargarCoverageMinsa(true);
                        });
                      }, function (error) {
                        mModalAlert.showError(error.data.message, 'Error');
                      });
  
                      $scope.closeModal();
                    }
                  };

                  $scope.formData.eCodeCoverMinsa = item.codeCoverMinsa;
                  $scope.formData.eTypeAttention = item.attentionType;
                  $scope.formData.eCoverPercent = item.percentCover;

                  $scope.data = {
                    title: 'EDITAR PORCENTAJE DE COBERTURA MINSA',
                    boton: 'ACTUALIZAR'
                  };
                }]
            });
          }
      }]
    );
});
