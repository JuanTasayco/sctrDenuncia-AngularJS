(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'sctrMngUploadRates', ['angular', 'system', 'swal'],
  function(angular, system, swal) {

    angular.module('appAutos')
      .controller('sctrMngUploadRatesController', ['proxySctr', 'uploadRates', '$scope', 'mModalAlert', '$timeout', '$document', '$state', 
        function(proxySctr, uploadRates, $scope, mModalAlert, $timeout, $document, $state) {
        var vm = this;
        
        vm.$onInit = onInit;

        function onInit(){
          vm.modalState = {
            file: 'none'
          };
          vm.reupload = reupload;
          vm.clear = clear;
          vm.closeModal= closeModal;
        }
        function closeModal(){
          
          vm.onClose({});
        }
        function clear (){
          vm.modalState = {
            file: 'none'
          };
          vm.selectedFile = undefined;
        }
        function reupload($event){
          procesar(vm.selectedFile,1);
        }
        function upload(file, correct){
          
          var data = {
            idTasa:vm.taxType.Id,
            importarSoloCorrecta: correct || "0",
            template: file
          }
          vm.modalState.file = 'loading';
          uploadRates.uploadTaxs(data, true)
          .then(function(response){
            $document[0].getElementById("tasas").reset();
            
            // if (response.OperationCode === 500){
            //   mModalAlert.showError(response.Message, "Error");
            //  // return;
            // }
            // else if (response.OperationCode === 422){
            //   mModalAlert.showError(response.Message, "Error");
            //  // return;
            // }

            // else if (response.OperationCode === 900){
            //   mModalAlert.showError(response.Message, "Error");
            //  // return;
            // }

            if (response.OperationCode !== 200 
              && response.OperationCode !== 500
              && response.OperationCode !== 422){
              mModalAlert.showError(response.Message, "Error");
              //return;
            }else if (response.OperationCode === 500){
              mModalAlert.showError(response.Message, "Error");
             return;
            } else if (response.OperationCode === 422){
              mModalAlert.showError(response.Message, "Error");
             return;
            }          

            if(response.Data){

              vm.IdCargaTemporal = response.Data.IdCargaTemporal;
            }

            var withError = response.Data && response.Data.Errores && response.Data.Errores.length>0;
            vm.modalState.file =  withError ? 'loadedError': 'loadedSuccess' 

            if (withError)
              vm.errorsList = response.Data.Errores
            if (correct == 1){
              vm.onClose({});
              mModalAlert.showSuccess("El archivo se ha cargado con exito", "Archivo cargado");
              $timeout(function(){
                swal.close();
              }, 3000)
            }
          }, function(response){
            
          })
        }
        function procesar(file, correct){
          
          var data = {
            IdTemplateTasa: vm.taxType.Id,
            McaCorrecto: correct || "0",
            IdCargaTemporal: vm.IdCargaTemporal
          }
          vm.modalState.file = 'loading';
          proxySctr.ProcesarTasa(data, true)
          .then(function(response){
            // if (response.OperationCode === 500){
            //   mModalAlert.showError(response.Message, "Error");
            //   return;
            // }

            // else if (response.OperationCode === 422){
            //   mModalAlert.showError(response.Message, "Error");
            //   return;
            // }

            // else if (response.OperationCode === 900){
            //   mModalAlert.showError(response.Message, "Error");
            //   return;
            // }

            if (response.OperationCode !== 200 
              && response.OperationCode !== 500
              && response.OperationCode !== 422){
              mModalAlert.showError(response.Message, "Error");
              //return;
            }else if (response.OperationCode === 500){
              mModalAlert.showError(response.Message, "Error");
             return;
            } else if (response.OperationCode === 422){
              mModalAlert.showError(response.Message, "Error");
             return;
            }   
            

            var withError = response.Data && response.Data.Errores && response.Data.Errores.length>0;
            vm.modalState.file =  withError ? 'loadedError': 'loadedSuccess' 
            if (withError)
              vm.errorsList = response.Data.Errores
            if (correct == 1){
              vm.onClose({});
              mModalAlert.showSuccess("El archivo se ha cargado con exito", "Archivo cargado");
              
              $timeout(function(){
                $state.go('sctrManagment', {manager:'mnt', tab: 2}, {reload: true, inherit: false});             
                swal.close();
              }, 3000)
            }
          }, function(response){
            
          })
        }
        vm.selectFile = function(event){
          $scope.$evalAsync(function() {
            
            vm.selectedFile = event.target.files[0];
            upload(vm.selectedFile);
          })
        };
      }])
      .component('sctrMngUploadRates', {
        templateUrl: '/polizas/app/sctr/mantenimiento/component/upload.rates.html',
        controller: 'sctrMngUploadRatesController',
        bindings: {
          taxType: "=",
          onClose: "&?"
        }
      }).service("uploadRates",['httpData', 'mpSpin', 'oimProxyPoliza', function(httpData, mpSpin, oimProxyPoliza){
        this.uploadTaxs = uploadTaxs;
        function uploadTaxs(data, showSpin){
          var fdata = new FormData();
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              var element = data[key];
              fdata.append(key, element)
            }
          }
          mpSpin.start();
          var promise = httpData.post(oimProxyPoliza.endpoint + 
                        oimProxyPoliza.controllerSctr.actions.methodCargarTasa.path,
                        fdata,
                       {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined},
                        eventHandlers:{
                          progress:function(e){ mpSpin.start(); }
                        },
                        uploadEventHandlers: function(e){ mpSpin.start();}
                      }
          )
          promise.then(function(response){          
            mpSpin.end();
          }, function(response){
            mpSpin.end();
          });
          return promise;
        }
      }])
  });