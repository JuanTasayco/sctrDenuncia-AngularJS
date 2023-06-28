(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, 'listDashByAssign', ['angular', 'system'],
  function(angular, system) {

    angular.module('oim.caller.dashboard')
      .controller('listDashByAssignController', [
        '$scope', '$filter', '$uibModal', 'orderByTypes', 'proxyDashboard', 'decoratorData', 'odataBuilder', 'mModalAlert', 'mModalConfirm',
        function($scope, $filter, $uibModal, orderByTypes, proxyDashboard, decoratorData, odataBuilder, mModalAlert, mModalConfirm) {

          var vm = this;
          vm.$onInit = onInit;
          vm.orderByTypes = helper.objectToArray(orderByTypes);
          vm.pageNumber = 1;
          vm.pageSize = 12;
          vm.orderBy = vm.orderByTypes[0];
          vm.dataFilter = {}

          function search() {
            var query = odataBuilder()
              .filterEq("DocumenterNumber", vm.dataFilter.documenterNumber)
              .filterEq("RequestType", vm.dataFilter.requestType ? vm.dataFilter.requestType.code : undefined)
              .filterEq("OperatorName", vm.dataFilter.operatorName)
              .addOrder(vm.orderBy.code)
              .pageOptions(vm.pageNumber, vm.pageSize)
              .query();

            proxyDashboard.ListToAssign(query, true)
              .then(function(response) {
                  vm.totalItems = response.recordCount;
                  vm.noResult = response.recordCount == 0;
                  decoratorData.incidents(response.data);
                  vm.objectData = response.data;

                },
                function(response) {

                });
            vm.onSearch();
          }

          function pageChanged() {
            search();
          }

          function changeOrder() {
            search();
          }

          function copyText(item) {
            var builder = "";
            builder += 'Número de solicitud:' + item.attentionRequestId;
            builder += '\nservicio solicitado:' + item.supplierName;
            builder += '\nfecha y hora de solicitud:' + $filter('date')(item.creationDate, 'dd/MM/yyyy HH:mm:ss');
            builder += '\nnombre del operador que atiende la solicitud:' + item.ownerName;
            if(item.supplierCode != '00001'){
              builder += '\nnombre del solicitante:' + item.requestorName;
              builder += '\nteléfono celular del solicitante:' + item.phoneNumber;
              builder += '\nDNI del solicitante:' + (item.documentNumber || "");
            }else{
              builder += '\nnombre del solicitante:' + item.adtNombres + ' ' + item.adtApellidos;
              builder += '\n'+ item.adtDocumentType + ' del solicitante:' + (item.adtDocumentNumber || "");
              builder += '\nPlaca:' + item.adtPlate;
              builder += '\nComentarios:' + item.adtComment;
            }
            builder += '\ndirección de la ubicación:' + item.addressGeoCode;
            builder += '\nlongitud y latitud de la ubicación:' + " " + item.choosenLatitud + ", " + item.choosenLongitude;
            var board = document.getElementById('clipboardText');
            board.style.display = 'block';
            board.value = builder;
            board.select()
            try {

              document.execCommand('copy');
            } catch (error) {

            } finally {
              board.style.display = 'none';
            }
          }

          function changeToAssigned(item) {
            mModalConfirm
              .confirmInfo("¿Desea asignar esta solicitud?", "Asignar")
              .then(function() {
                proxyDashboard
                  .ChangeToAssigned(item.attentionRequestId, true)
                  .then(function() {
                    search();
                  });
              })
          }

          function onInit() {
            vm.pageChanged = pageChanged;
            vm.changeOrder = changeOrder;
            vm.changeToAssigned = changeToAssigned;
            vm.copyText = copyText;
            search();
          }

          $scope.showFilter = function(option, index, event) {
            var vModal = $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              size: 'md',
              template: '<modal-Filter ignore-dates="true" object-data="dataFilter" filter-apply="applyFilter($filter)" close="close()" clean="cleanFilter()" ><modal-filter>',
              controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.dataFilter = vm.dataFilter;

                $scope.cleanFilter = function() {
                  $uibModalInstance.close({});
                };
                $scope.close = function() {
                  $uibModalInstance.close();
                };
                $scope.applyFilter = function($filter) {
                  $uibModalInstance.close($filter);
                }
              }]
            });
            vModal.result.then(function(filter) {
              if (filter) {
                vm.dataFilter = filter;
                search();
              }
            }, function() {
              //  todo
            });
          };
        }
      ])
      .component('listDashByAssign', {
        templateUrl: system.pathAppBase('/dashbyassign/component/listdashbyassign.html'),
        controller: 'listDashByAssignController',
        bindings: {
          totalRecords: "=?",
          onSearch: "&?"
        }
      })
  });