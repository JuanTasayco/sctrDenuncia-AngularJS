(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', 'decesoFactory'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appDeceso');

    appAutos.controller('decesoFileInterestController', 
      ['$scope', 'oimPrincipal', '$window', '$state', 'decesoFactory', 'mainServices', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimPrincipal', 'mpSpin', 'decesoAuthorize', 
      function($scope, oimPrincipal, $window, $state, decesoFactory, mainServices, $timeout, $uibModal, mModalAlert, mModalConfirm, oimPrincipal, mpSpin, decesoAuthorize){
    
        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;
          $scope.validate = function(itemName){
            return decesoAuthorize.menuItem($scope.codeModule, itemName);
          }

          $scope.mainStep.stateFilterData = [
            {
              Codigo: 1,
              Descripcion: 'ACTIVO'
            },
            {
              Codigo: 2,
              Descripcion: 'INACTIVO'
            }
          ];

          $scope.mainStep.stateData = [
            {
              Codigo: 1,
              Descripcion: 'ACTIVO'
            },
            {
              Codigo: 2,
              Descripcion: 'INACTIVO'
            }
          ];

          $scope.modalAttach = true;

          $scope.errorAttachedFile = true;

          

          function applyAccess(){
            $scope.isAdmin = true;
            if(!$scope.isAdmin){
              $scope.mainStep.mEstadoFilter = {Codigo: 1};
            }
            $scope.disabledStateFilter = !($scope.isAdmin || oimPrincipal.get_role() == 'EAC');  
          }
          applyAccess();
          _filter('1');
        })();

        function _clearFilter(){
          $scope.mainStep.mArchivoFilter = '';
          $scope.mainStep.mEstadoFilter.Codigo = null;
        }

        function _buildFilter(currentPage){
          var vEstado = '';
          if ($scope.mainStep.mEstadoFilter){
            if($scope.mainStep.mEstadoFilter.Codigo !== null){
              ($scope.mainStep.mEstadoFilter.Codigo == 1) ? vEstado = 'A' : vEstado = 'I';
            }
          }
          var data = {
            Codigo: '',
            Nombre: (typeof $scope.mainStep.mArchivoFilter !== 'undefined') ? $scope.mainStep.mArchivoFilter : '',
            Estado: vEstado,
            CantidadFilasPorPagina: '10',
            PaginaActual: currentPage
          }
          return data;
        }

        function _filter(currentPage){
          $scope.noResult = false;
          var params = _buildFilter(currentPage);
          decesoFactory.ObtenerArchivos(params, true).then(function(response){
            if (response.Data.Lista.length > 0){
              $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
              $scope.items = response.Data.Lista;
            }else{
              $scope.noResult = true;
            } 
          }, function(error){
            $scope.noResult = true;
          }, function(defaultError){
            $scope.noResult = true;
          });
        }
        function _clearFilterResult(){
          $scope.totalItems = 0;
          $scope.items = [];
        }

        $scope.filter = function(currentPage){
          $scope.mainStep.mPagination = currentPage;
          _clearFilterResult();
          _filter(currentPage);
        }

        $scope.clearFilter = function(){
          _clearFilter();
        }

        $scope.pageChanged = function(page){
          _filter(page);
        }

        $scope.showModal = function(option, index, event){

          function _clearFileAttach(){
            $scope.mainStep.mCargarArchivo = '';
            $scope.modalAttach = true;
            $scope.modalAttachTitle = 'Adjuntar';
            $scope.modalPathAttach = '';
          }

          function _newRegister(){
            $scope.modalTitle = 'NUEVO ARCHIVO';
            $scope.mainStep.mArchivo = '';
            $scope.mainStep.mValor = '';
            $scope.mainStep.mDescripcion = '';
            $scope.mainStep.mEstado = {
              Codigo: null
            };
            $scope.modalCode = '';
            $scope.modalUserCreation = '';
            _clearFileAttach();
          }

          function _editRegister(index){
            $scope.modalTitle = 'ACTUALIZAR ARCHIVO';
            var item = $scope.items[index];
            $scope.mainStep.mArchivo = item.Nombre;
            $scope.mainStep.mValor = item.Codigo;
            $scope.modalPathAttach = item.Ruta;
            $scope.mainStep.mDescripcion = item.Descripcion;
            $scope.mainStep.mEstado = {
              Codigo: (item.Estado == 'A') ? 1 : 2
            };
            $scope.modalCode = item.Codigo;
            $scope.modalUserCreation = item.UsuarioCreacion;
            $scope.modalAttach = false;
            $scope.modalAttachTitle = 'Adjunto';
          }


          $scope.modalOption = option;
          if ($scope.modalOption == 'u') {
            $scope.var = undefined;
            _editRegister(index);
          }else{
            $scope.var = true;
            _newRegister();
          }
          

          var vModal = $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : '/polizas/app/deceso/fileInterest/controller/fileInterestForm.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function($scope, $uibModalInstance, $uibModal, $timeout) {

              $scope.closeModal = function () {
                $uibModalInstance.close();
              };

              $scope.changeLoadFile = function(){
                $scope.modalAttach = false;
                $scope.modalAttachTitle = 'Adjunto';
                $timeout(function(){
                  var vFile = $scope.mainStep.mCargarArchivo || {};
                  $scope.modalPathAttach = vFile[0].name;
                }, 0);
              };
              $scope.clearFileAttach = function(){
                $scope.mainStep.mCargarArchivo = '';
                $scope.modalAttach = true;
                $scope.modalAttachTitle = 'Adjuntar';
                $scope.modalPathAttach = '';
              };
              function _buildFileInterest(){
                var data = {
                  Code: $scope.modalCode,
                  Description: $scope.mainStep.mDescripcion,
                  Name: $scope.mainStep.mArchivo,
                  Estate: ($scope.mainStep.mEstado.Codigo == 1) ? 'A' : 'I', //'A', //$scope.mainStep.mEstado.Codigo,
                  userCreation: ($scope.modalUserCreation == '') ? oimPrincipal.getUsername() : $scope.modalUserCreation//'GZAPATA' //$scope.modalUserCreation, //'GZAPATA',
                }
                return data;
              }

              $scope.validationForm = function(){
                $scope.frmFileInterestForm.markAsPristine();
                var vFile = $scope.mainStep.mCargarArchivo || {};
                var vValidateFile = (typeof vFile[0] == 'undefined') && !$scope.mainStep.mArchivo ? false : true;
                if(!vValidateFile){
                  mModalAlert.showError("No se adjunto ningun archivo nuevo", 'ERROR');
                }
                $scope.errorAttachedFile = !$scope.modalAttach && vValidateFile;
                
                return $scope.frmFileInterestForm.$valid && $scope.errorAttachedFile;
              };
              $scope.saveFileInterest = function() {
                if ($scope.validationForm()){
                  mpSpin.start();
                  var vfile = $scope.mainStep.mCargarArchivo || {};
                  var params = _buildFileInterest();
          
                  decesoFactory.saveFileInterest($scope.modalOption, vfile[0], params).then(function(response){
                    if (response.data.OperationCode == constants.operationCode.success){
                      $scope.closeModal();
                      var vPager = (typeof $scope.mainStep.mPagination == 'undefined') ? 1 : $scope.mainStep.mPagination;
                      _filter(vPager);
                      mpSpin.end();
                      mModalAlert.showSuccess('Se registro/actualizo con éxito', 'Éxito');
                    }
                  }, function(error){
                    mpSpin.end();
                  }, function(defaultError){
                    mpSpin.end();
                  });
                }
              };

            }]
          });
          vModal.result.then(function(){
          },function(){
          });
        }

        $scope.download = function(index){
          mpSpin.start();
          var item = $scope.items[index];
          decesoFactory.GetDescargarArchivo64(item.Codigo).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              mainServices.fnDownloadFileBase64(response.Data.Base64, response.Data.Type, item.Name, false);
              mpSpin.end();
            }else{
              mpSpin.end();
              mModalAlert.showError(response.Message? response.Message : "Error al descargar el documento", 'ERROR');
            }
          }, function(error){
            mpSpin.end();
            mModalAlert.showError("Error al descargar el documento", 'ERROR');
          }, function(defaultError){
            mpSpin.end();
            mModalAlert.showError("Error al descargar el documento", 'ERROR');
          });;
         
        }

    }]);
  });
