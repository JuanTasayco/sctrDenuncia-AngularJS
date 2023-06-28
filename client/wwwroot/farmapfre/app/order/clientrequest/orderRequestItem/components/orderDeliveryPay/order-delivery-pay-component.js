(function($root, name, deps, action) {
    define(name, deps, action)
})(window, "orderDeliveryPayComponent", ['angular'], function(ng) {
    ng.module('farmapfre.app').
    controller('orderDeliveryPayComponentController',
    ['$scope', 'orderItemService', 'proxyPayType', 'mModalAlert', '$state',
    function($scope, orderItemService, proxyPayType, mModalAlert, state) {
        var vm = this;
        vm.orderId = $scope.$parent.$ctrl.dataItem.id;
        vm.code = $scope.$parent.$ctrl.dataItem.move.id;
        vm.cancelButtom = vm.code == 5 || vm.code == 4 || vm.code == 3 ? true : false ? true : false;
        vm.porcCopago = $scope.$parent.$ctrl.dataItem.attention ? $scope.$parent.$ctrl.dataItem.attention.porcCopago : undefined;
        vm.has100PercentCopago = $scope.$parent.$ctrl.dataItem.attention ? $scope.$parent.$ctrl.dataItem.attention.porcCopago == 100 : false;

        if(vm.itscollect) {
            var sumaCopagos = function(medicines) {
                var total = 0;
                angular.forEach(medicines, function(value, key) {
                    total = total + value.copago;
                });
                return total;
            }

            angular.forEach(vm.preorders, function(pre, key) {
                angular.forEach(pre.details, function(det, key) {
                    if(det.externalProvider && !det.externalProvider.id2) {
                        det.externalProvider.id2 = det.externalProvider.id + '-' + (det.externalProvider.premises ? det.externalProvider.premises.id : null);
                    }
                });
            });

            angular.forEach(vm.preorders, function(pre, key) {
                pre.groupPharmacyPremises = [];
                angular.forEach(pre.details, function(det, key) {
                    var itemPharmacyPremises = {};
                    if(key == 0) {
                        itemPharmacyPremises.externalProvider = det.externalProvider;
                        itemPharmacyPremises.details = [];
                        var item = JSON.parse(JSON.stringify(det));
                        item.externalProvider = null;
                        itemPharmacyPremises.details.push(item);
                        pre.groupPharmacyPremises.push(itemPharmacyPremises);
                    } else {
                        var filter = pre.groupPharmacyPremises.filter(function(x) { return x.externalProvider.id2 === det.externalProvider.id2; });
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
                            pre.groupPharmacyPremises.push(itemPharmacyPremises);
                        }
                    }
                });
                
                angular.forEach(pre.groupPharmacyPremises, function(item, key) {
                    item.copago = sumaCopagos(item.details);
                });
            });
        }

        proxyPayType.GetPayType().then(function(response) {
            vm.payTypes = response;
        });

        vm.valCheck = function() {
            switch(vm.preorders[0].payType.id) {
                case "1": { vm.preorders[0].cardType = ''; }; break;
                case "2": { vm.preorders[0].paymentAmount = ''; }; break;
                case "3":
                case "4": {  
                    vm.preorders[0].cardType = '';
                    vm.preorders[0].paymentAmount = '';
                }; break;
            }
        };

        vm.valPaymentAmount = function(pre) {
            pre.isOkPaymentAmount = true;
            if(pre.paymentAmount < pre.copago) {
                pre.isOkPaymentAmount = false;
            }
        };

        if(vm.itsdelivery) {
            angular.forEach(vm.preorders, function(pre, key) {
                vm.valPaymentAmount(pre);
            });
        }

        vm.ordernarDespacho = function() {
            if($scope.$parent.$ctrl.pagePreOrderIsValid()) {
                orderItemService.SaveDispatchs(vm, true).then(function(res) {
                    if(res === 'OK') {
                        vm.onRefresh();
                        mModalAlert.showSuccess('El despacho se guardó satisfactoriamente.', 'Guardar Despacho').then(function() {
                            state.go('order.searchRequest');
                        });
                    }
                }, function(err){
                    mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
                });
            }
        };

        vm.countChars = function(value) {
            value = (value == undefined || value == null) ? "" : value;
            var maxLength = 250;
            $scope.maxLengthTA = maxLength;
            var strLength = value.length;
            var charRemain = (maxLength - strLength);
            if(charRemain < 0) {
                $scope.remainMsg = "0/" + maxLength;
            } else {
                $scope.remainMsg = charRemain + '/' + maxLength;
            }
        };

        angular.forEach(vm.preorders, function(value, key) {
            vm.countChars(value.comments);
        });
    }]).
    component("orderDeliveryPay", {
        templateUrl: "/farmapfre/app/order/clientrequest/orderRequestItem/components/orderDeliveryPay/order-delivery-pay-component.html",
        controller: "orderDeliveryPayComponentController",
        bindings: {
            onRefresh: '&',
            preorders:"=?",
            address:"=?",
            itscollect:"=?",
            itsdelivery:"=?"
        }
    })
});