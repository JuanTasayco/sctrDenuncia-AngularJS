(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper',
  '/polizas/app/vida/proxy/vidaFactory.js'], 
  function(angular, constants, helper){

    var appAutos = angular.module('appAutos');

    appAutos.controller('vidaMaintenanceController', 
      ['$scope','oimPrincipal', '$window', '$state', 'vidaFactory', '$timeout', '$uibModal', 'mModalAlert', 'mModalConfirm', 
      function($scope, oimPrincipal, $window, $state, vidaFactory, $timeout, $uibModal, mModalAlert, mModalConfirm){
    
        (function onLoad(){
          $scope.mainStep = $scope.mainStep || {};
          $scope.isAdmin = true;

          _filter('1');

        })();

        function _clearFilter(){
          $scope.mainStep.mCodigoFilter = '';
          $scope.mainStep.mValorFilter = '';
          $scope.mainStep.mDescFilter = '';
        }

        function _buildFilter(currentPage){
          var data = {
            CodigoIdentificador: 'CWVI',
            Campo: (typeof $scope.mainStep.mCodigoFilter !== 'undefined') ? $scope.mainStep.mCodigoFilter : '',
            Codigo: (typeof $scope.mainStep.mValorFilter !== 'undefined') ? $scope.mainStep.mValorFilter : '',
            Descripcion: (typeof $scope.mainStep.mDescFilter !== 'undefined') ? $scope.mainStep.mDescFilter : '',
            CantidadFilasPorPagina: '10',
            PaginaActual: currentPage
          }
          return data;
        }

        function _filter(currentPage){
          $scope.noResult = false;
          var params = _buildFilter(currentPage);
          vidaFactory.filterMaintenance(params, true).then(function(response){
            if (response.OperationCode == constants.operationCode.success){
              if (response.Data.Lista.length > 0){
                $scope.totalItems = parseInt(response.Data.CantidadTotalPaginas) * 10; //response.Data.CantidadTotalFilas; //CantidadTotalPaginas FALTA que corrigan este valor, lueho lo multiplico por 100, para que pueda funcionar en la directiva
                $scope.items = response.Data.Lista;
              }else{
                $scope.noResult = true;
              }
              // console.log(JSON.stringify(response.Data));
            }else{
              $scope.noResult = true;
              // mModalAlert.showError(response.Message, 'Error');
            }
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


        function _clearModal(){
          $scope.mainStep.mCodigo = '';
          $scope.mainStep.mValor = '';
          $scope.mainStep.mDescripcion = '';
        }


        /*########################
        # showModal
        ########################*/
        $scope.showModal = function(option, index, event){
          // console.log(option);
          // console.log(index);

          _clearModal();
          $scope.modalOption = option;
          $scope.modalTitle = 'REGISTRAR';
          if ($scope.modalOption == 'u') {
            $scope.modalTitle = 'ACTUALIZAR PARÁMETRO';
            var item = $scope.items[index];
            $scope.mainStep.mCodigo = item.Campo;
            $scope.mainStep.mValor = item.Codigo;
            $scope.mainStep.mDescripcion = item.Descripcion;
          }
          // if (event) {
          //   event.preventDefault();
          //   event.stopPropagation();
          // }

          //Modal
          var vModal = $uibModal.open({
            backdrop: true, // background de fondo
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: 'md',
            templateUrl : '/polizas/app/vida/maintenance/controller/maintenanceForm.html',
            controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
              //CloseModal
              $scope.closeModal = function () {
                $uibModalInstance.close();
              };
              //

              /*#########################
              # ValidationForm
              #########################*/
              $scope.validationForm = function(){
                $scope.frmMaintenanceForm.markAsPristine();
                return $scope.frmMaintenanceForm.$valid;
              };

              function _buildMaintenance(){
                var data = {
                  CodigoIdentificador: 'CWVI',
                  Campo: $scope.mainStep.mCodigo,
                  Codigo: $scope.mainStep.mValor,
                  Descripcion: $scope.mainStep.mDescripcion,
                  vcValor1: ''
                }
                return data;
              }

              /*#########################
              # saveMaintenance
              #########################*/
              $scope.saveMaintenance = function() {
                if ($scope.validationForm()){
                  // console.log('correcto');
                  var params = _buildMaintenance();
                  vidaFactory.saveMaintenance($scope.modalOption, params, true).then(function(response){
                    // debugger;
                    if (response.OperationCode == constants.operationCode.success){
                      $scope.closeModal();
                      var vPager = (typeof $scope.mainStep.mPagination == 'undefined') ? 1 : $scope.mainStep.mPagination;
                      _filter(vPager);
                      mModalAlert.showSuccess('Se registro/actualizo con éxito', 'Éxito');
                    }
                    // }else{
                    //   mModalAlert.showError(response.Message, 'Error');
                    // }
                  }, function(error){
                    debugger;
                    // console.log('error');
                  }, function(defaultError){
                    debugger;
                    // console.log('errorDefault');
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
        # deleteItem
        ########################*/
        $scope.deleteItem = function(index){
          mModalConfirm.confirmInfo('¿Esta seguro que desea eliminar el registro?','Eliminar', 'Eliminar').then(function(response){
            // debugger;
            if (response) {
              var item = $scope.items[index];
              var params = {
                code: item.Campo,
                value: item.Codigo
              }
              vidaFactory.deleteMaintenance(params.code, params.value, true).then(function(response){
                if (response.OperationCode == constants.operationCode.success){
                  $scope.items.splice(index, 1);
                  mModalAlert.showSuccess('Se elimino el registro con éxito', '');
                }
                // }else{
                //   mModalAlert.showError(response.Message, 'Error');
                // }
              }, function(error){
                // console.log('error');
              }, function(defaultError){
                // console.log('errorDefault');
              });
            }
          }, function(error){
            // console.log('error');
          }, function(defaultError){
            // console.log('errorDefault');
          });
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
