(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/vida/proxy/vidaFactory.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaFileInterestController', 
      ['$scope', 'oimPrincipal', '$window', '$state', 'vidaFactory', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm', 'oimPrincipal', 'mpSpin',
      function($scope, oimPrincipal, $window, $state, vidaFactory, $timeout, $uibModal, mModalAlert, mModalConfirm, oimPrincipal, mpSpin){
    
        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};

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
            $scope.isAdmin = oimPrincipal.isAdmin();
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
          vidaFactory.filterFileInterest(params, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              if (response.Data.Lista.length > 0){
                $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10;
                $scope.items = response.Data.Lista;
              }else{
                $scope.noResult = true;
              }
              // console.log(JSON.stringify(response.Data));
            }
            // }else{
            //   mModalAlert.showError(response.Message, 'Error');
            // }
          }, function(error){
            $scope.noResult = true;
            // console.log('error');
          }, function(defaultError){
            $scope.noResult = true;
            // console.log('errorDefault');
          });
        }
        function _clearFilterResult(){
          $scope.totalItems = 0;
          $scope.items = [];
        }

        /*########################
        # Filter
        ########################*/
        $scope.filter = function(currentPage){
          $scope.mainStep.mPagination = currentPage;
          _clearFilterResult();
          _filter(currentPage);
        }

        $scope.clearFilter = function(){
          _clearFilter();
        }

        /*########################
        # Filter x page
        ########################*/
        $scope.pageChanged = function(page){
          _filter(page);
        }


        // function _newRegister(){
        //   $scope.modalTitle = 'NUEVO ARCHIVO';
        //   $scope.mainStep.mArchivo = '';
        //   $scope.mainStep.mValor = '';
        //   // $scope.modalPathAttach = '';
        //   $scope.mainStep.mDescripcion = '';
        //   $scope.mainStep.mEstado = {
        //     Codigo: null
        //   };
        //   $scope.modalCode = '';
        //   $scope.modalUserCreation = '';
        //   //fileAttach
        //   _clearFileAttach();
        // }

        // function _editRegister(index){
        //   $scope.modalTitle = 'ACTUALIZAR ARCHIVO';
        //   var item = $scope.items[index];
        //   $scope.mainStep.mArchivo = item.Nombre;
        //   $scope.mainStep.mValor = item.Codigo;
        //   $scope.modalPathAttach = item.Ruta;
        //   $scope.mainStep.mDescripcion = item.Descripcion;
        //   $scope.mainStep.mEstado = {
        //     Codigo: (item.Estado == 'A') ? 1 : 2
        //   };
        //   $scope.modalCode = item.Codigo;
        //   $scope.modalUserCreation = item.UsuarioCreacion;
        //   //fileAttach
        //   $scope.modalAttach = false;
        //   $scope.modalAttachTitle = 'Adjunto';
        // }

        // function _clearFileAttach(){
        //   $scope.mainStep.mCargarArchivo = '';
        //   $scope.modalAttach = true;
        //   $scope.modalAttachTitle = 'Adjuntar';
        //   $scope.modalPathAttach = '';
        // }




        /*########################
        # showModal
        ########################*/
        $scope.showModal = function(option, index, event){
          // console.log(option);
          // console.log(index);
          // if (event) {
          //   event.preventDefault();
          //   event.stopPropagation();
          // }

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
            // $scope.modalPathAttach = '';
            $scope.mainStep.mDescripcion = '';
            $scope.mainStep.mEstado = {
              Codigo: null
            };
            $scope.modalCode = '';
            $scope.modalUserCreation = '';
            //fileAttach
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
            //fileAttach
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
          

          //Modal
          var vModal = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : '/polizas/app/vida/fileInterest/controller/fileInterestForm.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function($scope, $uibModalInstance, $uibModal, $timeout) {
              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              //


              /*#########################
              # changeFile
              #########################*/
              $scope.changeLoadFile = function(){
                $scope.modalAttach = false;
                $scope.modalAttachTitle = 'Adjunto';
                $timeout(function(){
                  var vFile = $scope.mainStep.mCargarArchivo || {};
                  $scope.modalPathAttach = vFile[0].name;
                }, 0);
              };
              // $scope.$watch('mainStep.mCargarArchivo', function(newValue, oldValue){
              //   // debugger;
              //   // var vLength = Object.keys(newValue).length;
              //   // if (newValue.length){
              //     // $scope.modalAttachN = false;
              //   //   $scope.modalAttachTitle = 'Adjunto';
              //   //   $scope.modalPathAttach = newValue[0].name;
              //   // }
              // });

              /*#########################
              # deleteFile - Modal
              #########################*/
              $scope.clearFileAttach = function(){
                $scope.mainStep.mCargarArchivo = '';
                $scope.modalAttach = true;
                $scope.modalAttachTitle = 'Adjuntar';
                $scope.modalPathAttach = '';
                // _clearFileAttach(); => No se utiliza la funcion porque no reconoce el scope en estos datos
              };
              

              /*#########################
              # _buildFileInterest
              #########################*/
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

              /*#########################
              # ValidationForm
              #########################*/
              $scope.validationForm = function(){
                $scope.frmFileInterestForm.markAsPristine();

                var vFile = $scope.mainStep.mCargarArchivo || {};
                var vValidateFile = (typeof vFile[0] == 'undefined') ? false : true;
                $scope.errorAttachedFile = !$scope.modalAttach || vValidateFile;
                
                return $scope.frmFileInterestForm.$valid && $scope.errorAttachedFile;
              };
              
              /*#########################
              # saveFileInterest
              #########################*/
              $scope.saveFileInterest = function() {
                if ($scope.validationForm()){
                  mpSpin.start();
                  var vfile = $scope.mainStep.mCargarArchivo || {};
                  var params = _buildFileInterest();
                  // debugger;
                  vidaFactory.saveFileInterest($scope.modalOption, vfile[0], params).then(function(response){
                    if (response.data.OperationCode == constants.operationCode.success){
                      $scope.closeModal();
                      var vPager = (typeof $scope.mainStep.mPagination == 'undefined') ? 1 : $scope.mainStep.mPagination;
                      _filter(vPager);
                      mpSpin.end();
                      mModalAlert.showSuccess('Se registro/actualizo con éxito', 'Éxito');
                    }
                    // }else{
                    //   mModalAlert.showError(response.data.Message, 'Error');
                    // }
                    // debugger;
                  }, function(error){
                    mpSpin.end();
                    // console(error);
                    // console.log('error');
                  }, function(defaultError){
                    mpSpin.end();
                    // console.log('errorDefault');
                    // console(defaultError);
                  });
                }
              };

            }]
          });
          vModal.result.then(function(){
            //Action after CloseButton Modal
            // console.log('closeButton');
          },function(){
            //Action after CancelButton Modal
            // console.log("CancelButton");
          });
          //
        }


        /*########################
        # donwload
        ########################*/
        $scope.download = function(index){
          var item = $scope.items[index];
          var vUrl = vidaFactory.downloadFileInterest(item.Codigo);
          $window.open(vUrl, '_blank');
        }

    }]);
    // }]).factory('loaderHogarHomeController', ['hogarFactory', '$q', function(hogarFactory, $q){
    //   var claims;

    //   //Claims
    //   function getClaims(){
    //    var deferred = $q.defer();
    //     hogarFactory.getClaims().then(function(response){
    //       claims = response;
    //       deferred.resolve(claims);
    //     }, function (error){
    //       deferred.reject(error.statusText);
    //     });
    //     return deferred.promise; 
    //   }

    //   return {
    //     getClaims: function(){
    //       if(claims) return $q.resolve(claims);
    //       return getClaims();
    //     }
    //   }

    // }])

  });
