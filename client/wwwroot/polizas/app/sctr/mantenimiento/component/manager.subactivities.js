(function($root, name, deps, action) {
    $root.define(name, deps, action);
  })(window, 'sctrMngSubActivities', ['angular', 'system'],
    function(angular, system) {
  
      angular.module('appAutos')
        .controller('sctrMngSubActivitiesController', ['proxySctr', '$uibModal', '$scope', 'mModalAlert', function(proxySctr, $uibModal, $scope, mModalAlert) {
          var vm = this;
          vm.removeSubActivity = function(subactivity){
            proxySctr.DeleteSubactividad(subactivity.IdSubactividad, true).then(
              function(response){
                updateList();
              });
          }
          vm.updateClausula = function(value){
            vm.clausulaAutomatica.Nombre = vm.mClausula

            var text = value.replace(/\n/g, '<br/>');
            vm.clausulaAutomatica.Nombre = text;

            if (vm.clausulaAutomatica.IdClausula){
              proxySctr.UpdateClausulaAutomatica(vm.clausulaAutomatica, true);
            }
            else{
              proxySctr.CreateClausulaAutomatica(vm.clausulaAutomatica, true);
            }
            
          }
          function getClausula() {
            proxySctr.GetListClausulaAutomaticaByCiiu(vm.selectedActivity.CodigoCiiuEmp, true)
            .then(function(response){
              vm.mClausula = "";
              vm.clausulaAutomatica = response.Data && response.Data.length>0 ?
                                      response.Data[0]: 
                                      {
                                        "Ciiu": vm.selectedActivity.CodigoCiiuEmp,
                                        "Nombre": vm.mClausula,
                                        "Orden": 1
                                      }
              vm.mClausula = vm.clausulaAutomatica.Nombre;
            });
          }
          function updateList(){
            proxySctr.GetListSubactividadByCiiu(vm.selectedActivity.CodigoCiiuEmp, true)
            .then(function(response){
              vm.listSubActivities = response.Data;
            });
          }
          vm.editSubActivity = function(item){
            var vModal = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              template: '<sctr-Mng-Editor-Sub-Activity on-close="close($event)" sub-Activity="activity"><sctr-Mng-Editor-Sub-Activity>',
              controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                if (!item)
                  item = {
                      Ciiu: vm.selectedActivity.CodigoCiiuEmp,
                      Nombre: "",
                      Orden: 9
                  }
                $scope.activity = item
                $scope.close = function($event) {
                  $uibModalInstance.close($event);
                };
              }]
            }); 
            vModal.result.then(function(response){
              if (response && response.success){
                mModalAlert
                .showSuccess("!Los cambios han sido guardados con éxito¡", "Guardado")
                .then(function(){
                  updateList();
                });
              }
            });          
          }
          vm.showModalActivity = function(){
            var vModal = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              template: '<sctr-Mng-Search-Activity on-close="close()" on-activity ="GetActivity($event)"><sctr-Mng-Search-Activity>',
              controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.dataFilter = vm.dataFilter;

                $scope.close = function() {
                  $uibModalInstance.close({});
                };
                $scope.GetActivity = function($event) {
                  $uibModalInstance.close($event);
                };
              }]
            });
            
            vModal.result.then(function(response){
              vm.selectedActivity = response.selectedItem;
              updateList();
              getClausula();
            })


          }
        }])
        .directive("contenteditable", function() {
          return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attrs, ngModel) {

              function read() {
                ngModel.$setViewValue(element.html());
              }

              ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
              };

              element.bind("blur keyup change", function() {
                scope.$apply(read);
              });
            }
          };
        })
        .component('sctrMngSubActivities', {
          templateUrl: '/polizas/app/sctr/mantenimiento/component/manager.subactivities.html',
          controller: 'sctrMngSubActivitiesController',
          bindings: {
  
          }
        })
    });