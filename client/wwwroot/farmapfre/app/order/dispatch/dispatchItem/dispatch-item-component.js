(function($root, name, deps, action){
    define(name, deps, action)
})(window, "orderDispatchItemComponent", ['angular', 'farmConstants', '/farmapfre/app/common/helpers/farmapfrehelper.js', 'mfpModalCancelOrder'], function(ng, farmConstants) {
    ng.module('farmapfre.app').
    controller('orderDispatchItemComponentController', ['$scope', '$uibModal', 'proxyOrder', '$state', 'mModalConfirm','mModalAlert','serviceDispathModel', 'farmapfrehelper',
    function($scope, $uibModal, proxyOrder, $state, mModalConfirm, mModalAlert, serviceDispathModel, helper) {
        $scope.$parent.$parent.$parent.item.order = false;
        $scope.$parent.$parent.$parent.item.dispatch = true;
        
        var vm = this;
        vm.open = true;
        vm.model = serviceDispathModel.getDispatch();
        vm.showCancelDispatch = vm.model.move.id != 4 && vm.model.move.id != 3;

        if(vm.model.itsCollect) {
            var sumaCopagos = function(medicines) {
                var total = 0;
                angular.forEach(medicines, function(value, key) {
                    total = total + value.copago;
                });
                return total;
            }

            angular.forEach(vm.model.details, function(det, key) {
                det.externalProvider.id2 = det.externalProvider.id + '-' + det.externalProvider.premises.id;
            });

            vm.model.groupPharmacyPremises = []; 
            angular.forEach(vm.model.details, function(det, key) {
                var itemPharmacyPremises = {};
                if(key == 0) {
                    itemPharmacyPremises.externalProvider = det.externalProvider;
                    itemPharmacyPremises.details = [];
                    var item = JSON.parse(JSON.stringify(det));
                    item.externalProvider = null;
                    itemPharmacyPremises.details.push(item);
                    vm.model.groupPharmacyPremises.push(itemPharmacyPremises);
                } else {
                    var filter = vm.model.groupPharmacyPremises.filter(function(x) { return x.externalProvider.id2 === det.externalProvider.id2; });
                    if(filter.length > 0) {
                        filter = filter[0];
                        var item = JSON.parse(JSON.stringify(det));
                        item.externalProvider = null;
                        filter.details.push(item);
                    } else {
                        itemPharmacyPremises.externalProvider = det.externalProvider;
                        itemPharmacyPremises.details = [];
                        var item = JSON.parse(JSON.stringify(det));
                        item.externalProvider = null;
                        itemPharmacyPremises.details.push(item);
                        vm.model.groupPharmacyPremises.push(itemPharmacyPremises);
                    }
                }
            });
                
            angular.forEach(vm.model.groupPharmacyPremises, function(item, key) {
                item.copago = sumaCopagos(item.details);
            });
        }

        function confirmDispatch(){
            mModalConfirm.confirmInfo("¿Esta seguro de confirmar el despacho?", "Confirmar despacho")
            .then(function(value){
                if (value){
                    proxyOrder.ConfirmDeliveryDispatch(vm.model.orderId, vm.model.id , true)
                    .then(function(r){
                        mModalAlert.showSuccess("Se confirmó el despacho satisfactoriamente", "Enviado").then(function(){
                            $state.go('order.searchdispatch');
                        })
                    }, defaultHandlerError)
                }
            })
        }

        function defaultHandlerError(r){
            mModalAlert.showError("Ha sucedido un error al momento de procesar su solictud.")
        }

        function sendDispatch(){
            mModalConfirm.confirmInfo("Confirme el envío de los medicamentos", "Confirmar envío")
            .then(function(value){
                if (value){
                    proxyOrder.SendDispatch(vm.model.orderId, vm.model.id, true)
                    .then(function(r){
                        mModalAlert.showSuccess("Se ha enviado la orden satisfactoriamente", "Enviado").then(function(){
                            $state.go('order.searchdispatch');
                        })
                    }, defaultHandlerError)
                }

            });
        }

        function openCancelDispath() {
          $uibModal.open({
            backdrop: 'static',
            backdropClick: false,
            dialogFade: false,
            keyboard: false,
            scope: $scope,
            size: 'md',
            windowTopClass: 'modal--md fade',
            template: '<mfp-modal-cancel-order close="close()" data="{orderId:'+vm.model.orderId+', dispatchId:'+vm.model.id+'}" type="' + farmConstants.modalType.cancelDispatch + '"></mfp-modal-cancel-order>',
            controller : ['$scope', '$uibModalInstance',
              function($scope, $uibModalInstance) {
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
          });
        }

        function isEfective(){
            return vm.model && vm.model.payType && vm.model.payType.id == "1";
        }

        function isCard(){
            return vm.model && vm.model.payType && vm.model.payType.id == "2";
        }

        function calcTotal(){
            var m = vm.model;
            if (m){
                var total = 0;
                for (var index = 0; index < m.details.length; index++) {
                    var element = m.details[index];
                    total += element.copago;
                }
                return total;
            }
            return 0;
        }

        vm.calcTotal= calcTotal;
        vm.isEfective = isEfective
        vm.isCard = isCard;
        vm.confirmDispatch = confirmDispatch;
        vm.sendDispatch = sendDispatch;
        vm.openCancelDispath = openCancelDispath;
        vm.getDateWithFormat = helper.getDateWithFormat;
    }]).
    component("orderDispatchItem", {
        templateUrl: "/farmapfre/app/order/dispatch/dispatchItem/dispatch-item-component.html",
        controller: "orderDispatchItemComponentController",
        bindings: {
        }
    }).service('serviceDispathModel',['proxyOrder', '$q', function(proxyOrder, $q){
        var currentDispatch
        function getDispatchFromServer(orderid, itemId){
            var deferred = $q.defer();
            proxyOrder.GetDispatch(orderid, itemId, true).then(function(response){
                currentDispatch = response
                deferred.resolve(currentDispatch);
            }, function(e){
                deferred.reject(e);
            })
            return deferred.promise
        }

        function getDispatch(){
            return currentDispatch;
        }

        this.getDispatchFromServer= getDispatchFromServer;
        this.getDispatch = getDispatch;
    }]).
    component("anularDispatch", {
        templateUrl:'anularDispatchTemplate.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
          },
        controller: [function(){
            var vm = this;
        }]
    })
});
