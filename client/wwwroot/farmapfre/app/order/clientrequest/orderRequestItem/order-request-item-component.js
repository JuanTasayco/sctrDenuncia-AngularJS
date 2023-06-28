(function($root, name, deps, action){
    define(name, deps, action)
})(window, "orderRequestItemComponent", ['angular', 'swal', 'moment', 'farmConstants',
    '/farmapfre/app/common/helpers/farmapfrehelper.js', 'mfpModalReportInfoSendEmail', 'mfpModalCancelOrder', 'mpfModalTransferOrder', 'mpfModalGeneric'], function(ng, swal, moment, farmConstants) {
    ng.module('farmapfre.app')
    .controller('orderRequestItemComponentController',
    ['$scope', '$q', '$uibModal', '$filter', 'oimPrincipal', 'orderItemService', 'mModalAlert', 'mModalConfirm', '$state', 'farmapfrehelper',
    function($scope, $q, $uibModal, $filter, oimPrincipal, orderItemService, mModalAlert, mModalConfirm, state, helper) {

        $scope.$parent.$parent.$parent.item.order = true;
        $scope.$parent.$parent.$parent.item.dispatch = false;

        var vm = this;
        vm.buttonUp = false;
        vm.showButtonAudit = false;
        vm.dataItem = orderItemService.getCurrentOrderItem();
        vm.dataItem.externalProvidersRecojo = [];
        vm.dataItem.customExternalProviders = [];
        vm.dataItem.itsCollect = vm.dataItem.itsCollect ? vm.dataItem.itsCollect : false;
        var largomaximo = 50;

        $scope.dynamicPopover = {
            templateUrl: 'diagnosticTooltipPlantilla.html',
        };

        vm.isAdmin = (oimPrincipal.get_role() === "USR_ADMIN");

        function truncText(text) {
            if(text && text.length > largomaximo) {
              return text.substr(0, largomaximo) + '...';
            } else {
              return text;
            }
        }

        function calcExternalProviders() {
            if(vm.dataItem.itsCollect) {
                var custom = [];
    
                angular.forEach(vm.dataItem.externalProviders, function(ext, key) {
                    angular.forEach(ext.premises, function(pre, key) {
                        var obj = {};
                        obj.premises = {};
                        obj.premises.address = {};
    
                        obj.fullName = ext.description + ' - ' + pre.description;
                        obj.id2 = ext.id + '-' + pre.id;
                        obj.id = ext.id;
                        obj.description = ext.description;
                        obj.premises.id = pre.id;
                        obj.premises.description = pre.description;
                        obj.premises.address = pre.address;
    
                        custom.push(obj);
                    });
                });
                if(vm.dataItem.details) {
                    angular.forEach(vm.dataItem.details, function(det, key) {
                        if(det.externalProvider) {
                            det.externalProvider.id2 = det.externalProvider.id + '-' + (det.externalProvider.premises ? det.externalProvider.premises.id : null);
                        }
                    });
                }
    
                vm.dataItem.customExternalProviders = JSON.parse(JSON.stringify(custom));
            } else {
                if(vm.dataItem.details) {
                    angular.forEach(vm.dataItem.details, function(det, key) {
                        det.externalProviders = JSON.parse(JSON.stringify(vm.dataItem.externalProviders));
                    });
                }
                vm.dataItem.customExternalProviders = JSON.parse(JSON.stringify(vm.dataItem.externalProviders));
            }
        }

        calcExternalProviders();

        vm.dataItem.itsSavedDet = vm.dataItem.itsSavedDet ? vm.dataItem.itsSavedDet : false;
        vm.dataItem.itsSavedPre = vm.dataItem.itsSavedPre ? vm.dataItem.itsSavedPre : false;
        vm.dataItem.itsConfirm = vm.dataItem.itsConfirm ? vm.dataItem.itsConfirm : false;
        vm.porcCopago =  vm.dataItem && vm.dataItem.attention ? vm.dataItem.attention.porcCopago : 0;
        vm.watcherSuspend = false;
        vm.itsCollect = vm.dataItem.itsCollect ? vm.dataItem.itsCollect : false;
        vm.itsDelivery = vm.dataItem.itsDelivery ? vm.dataItem.itsDelivery : false;

        vm.valCancelEdit = function() {
            vm.dataItem.cancelEdit = vm.dataItem.move.id == farmConstants.orderStatus.delivered ||
                                        vm.dataItem.move.id == farmConstants.orderStatus.canceled ||
                                        vm.dataItem.move.id == farmConstants.orderStatus.managed ? true : false;
        }
        
        vm.valCancelEdit();

        (function onLoad() {
            if(vm.dataItem.itsConfirm) {
                vm.activeTab = 1;
            }

            if(vm.dataItem.transfer && vm.dataItem.transfer.comment) {
                vm.dataItem.transfer.showPopover = (vm.dataItem.transfer.comment.length > largomaximo);
            }

            if(vm.dataItem.hasAudit) {
                getAudit();
            } else {
                vm.showButtonAudit = true;
            }
        })();

        $scope.$watchCollection('$ctrl.dataItem.details', function(n, o) {
            if (n != o && !vm.watcherSuspend) {
                vm.dataItem.itsSavedDet = false;
                vm.dataItem.itsConfirm = false;
            }
            if(vm.watcherSuspend) {
                vm.watcherSuspend = false;
            }
        });

        angular.forEach(vm.dataItem.details, function(val, key) {
            $scope.$watchGroup([
                "$ctrl.dataItem.details[" + key + "].quantityRequired",
                "$ctrl.dataItem.details[" + key + "].externalProvider.id",
                "$ctrl.dataItem.details[" + key + "].medicine.id",
                "$ctrl.dataItem.details[" + key + "].medicine.priceSales"
            ], function(n, o) {
                if (n != o && !vm.watcherSuspend) {
                    vm.dataItem.itsSavedDet = false;
                    vm.dataItem.itsConfirm = false;
                }
                if(vm.watcherSuspend) {
                    vm.watcherSuspend = false;
                }
            });
        });

        vm.getOrderHead = function() {
            orderItemService.GetHeadOrderById(vm.dataItem.id).then(function(orderResponse) {
                vm.dataItem.move = orderResponse.move;
                vm.dataItem.timeElapsed = orderResponse.timeElapsed;
                vm.dataItem.traficLightLabel = orderResponse.traficLightLabel;
                vm.dataItem.insured = orderResponse.insured;

                vm.valCancelEdit();
            });
        }

        vm.saveAttention = function() {
            var deferred = $q.defer();
            if(vm.activeTab === 0) {
                if(vm.pageDetIsValid()) {
                    orderItemService.SaveOrderDetail({ "id": vm.dataItem.id, "bODispatch": vm.dataItem.boDispatch , "details": vm.dataItem.details }, true)
                    .then(function(res) {
                        vm.getOrderHead();

                        vm.watcherSuspend = true;
                        angular.forEach(res, function(det, key) {
                            if(vm.dataItem.itsCollect) {
                                if(det.externalProvider) {
                                    det.externalProvider.id2 = det.externalProvider.id + '-' + (det.externalProvider.premises ? det.externalProvider.premises.id : null);
                                }
                            } else {
                                det.externalProviders = JSON.parse(JSON.stringify(vm.dataItem.externalProviders));
                            }
                        });

                        vm.dataItem.details = res;
                        vm.dataItem.itsSavedDet = true;
                        deferred.resolve(vm.dataItem.itsSavedDet);
                    }, function(e) {
                        vm.dataItem.itsSavedDet = false;
                        vm.getOrderHead();
                        vm.showMsgError();
                        deferred.reject(e)
                    });
                }
            } else {
              if(vm.pagePreOrderIsValid()) {
                    orderItemService.SavePreOrders({ "orderId": vm.dataItem.id, "preOrders": vm.dataItem.preOrders }, true)
                    .then(function(res) {
                        vm.dataItem.itsSavedPre = true;
                        vm.dataItem.preOrders = res;
                        vm.getOrderHead();
                        deferred.resolve(vm.dataItem.itsSavedPre);
                    }, function(err) {
                        vm.dataItem.itsSavedPre = false;
                        vm.showMsgError();
                        deferred.reject(err)
                    });
                }

            }
            return deferred.promise;
        };

        vm.pageDetIsValid = function() {
            var det = vm.dataItem.details.filter(function(x) { return x.medicine && x.medicine.id; });
            if(det.length == 0) {
                mModalAlert.showWarning("Los campos con (*) son obligatorios.", "Guardar Atención");
                return false;
            } else {
                var valid = true;
                angular.forEach(vm.dataItem.details, function(detail, key) {
                    if(valid) { 
                        valid = (detail.medicine && detail.externalProvider && (detail.externalProvider.id || detail.externalProvider.id2) && detail.quantityRequired && detail.medicine.priceSales);
                        if(!valid) {
                            mModalAlert.showWarning("Los campos con (*) son obligatorios.", "Guardar Atención");
                            valid = false;
                        }
                    }
                });
                return valid;
            }
        }

        vm.pagePreOrderIsValid = function() {
            if(!vm.dataItem.preOrders || vm.dataItem.preOrders.length == 0) {
                mModalAlert.showWarning("Debe generar al menos una Pre-Orden", "Guardar Pre-Orden");
                return false;
            } else {
                var valid = true;
                angular.forEach(vm.dataItem.preOrders, function(pre, key) {
                    if(vm.dataItem.itsDelivery) {
                        valid = (
                            pre.payType && pre.payType.id && (
                                (pre.payType.id == 1 && pre.paymentAmount || vm.porcCopago == 100 && pre.paymentAmount == 0) || 
                                (pre.payType.id == 2 && pre.cardType) ||
                                (pre.payType.id == 3) ||
                                (pre.payType.id == 4)
                            )
                        );
                    }
                    if(!valid) {
                        mModalAlert.showWarning("Los campos con (*) son obligatorios.", "Guardar Atención");
                        valid = false;
                        return false;
                    }
                });
                return valid;
            }
        }

        vm.save = function() {
            vm.saveAttention().then(function(res) {
                if(res) {
                    mModalAlert.showSuccess('La atención ' + vm.dataItem.id + ' se guardó satisfactoriamente.', 'Guardar Atención');
                }
            });
        };

        vm.continue = function() {
            if(vm.dataItem.cancelEdit || !vm.dataItem.isOwner) {
                vm.activeTab = 1;
                return;
            }

            if(!vm.dataItem.itsConfirm) {
                if(vm.dataItem.itsSavedDet && !vm.dataItem.firstLoad) {
                    vm.dataItem.itsConfirm = true;
                    vm.dataItem.preOrders = vm.calcPreOrders();
                    vm.activeTab = 1;
                } else {
                    vm.saveAttention().then(function(res) {
                        if(res) {
							vm.dataItem.itsConfirm = true;
							vm.dataItem.preOrders = vm.calcPreOrders();
							vm.activeTab = 1;
                        }
                    });
                }
            } else {
                vm.activeTab = 1;
            }
        };
        
        vm.anularAtencion = function() {
          $uibModal.open({
            backdrop: 'static',
            backdropClick: false,
            dialogFade: false,
            keyboard: false,
            scope: $scope,
            size: 'md',
            windowTopClass: 'modal--md fade',
            template: '<mfp-modal-cancel-order close="close()" data="{orderId:'+vm.dataItem.id+'}" type="'+farmConstants.modalType.cancelOrder+'"></mfp-modal-cancel-order>',
            controller : ['$scope', '$uibModalInstance',
              function($scope, $uibModalInstance) {
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              }]
          });
        }

        vm.transferOrder = function() {
            var data = JSON.stringify(vm.dataItem).replaceAll("\"", "\'");
            $uibModal.open({
              backdrop: 'static',
              backdropClick: false,
              dialogFade: false,
              keyboard: false,
              scope: $scope,
              size: 'md',
              windowTopClass: 'modal--md fade',
              template: '<mpf-modal-transfer-order close="close()" data="'+ data +'"></mpf-modal-transfer-order>',
              controller : ['$scope', '$uibModalInstance',
                function($scope, $uibModalInstance) {
                  $scope.close = function () {
                    $uibModalInstance.close();
                  };
                }]
            });
          }

        vm.calcPreOrders = function() {
            var preOrders = [];
            var cont = 1;

            var sumaCopagos = function(medicines) {
                var total = 0;
                angular.forEach(medicines, function(value, key) {
                    total = total + value.copago;
                });
                return total;
            }

            preOrders.push({
                "orderId": vm.dataItem.id,
                "item": cont,
                "boDispatch": vm.dataItem.boDispatch,
                "details": vm.dataItem.details,
                "address": vm.dataItem.insured.address,
                "payType": vm.dataItem.attention && vm.dataItem.attention.porcCopago == 100 ? { "id": 1 } : {},
                "paymentAmount":  vm.dataItem.attention && vm.dataItem.attention.porcCopago == 100 ? 0 : '',
                "copago": sumaCopagos(vm.dataItem.details)
            });

            return preOrders;
        };

        vm.showMsgError = function() {
            mModalAlert.showError('Ocurrió un error, comuníquece con el administrador.', 'Error');
        };

        function refresh() {
            vm.getOrderHead();
            orderItemService.GetOrderDetailsById(vm.dataItem.id).then(function(detResponse) {
                vm.dataItem.details = detResponse;
                calcExternalProviders();
            });
        }

        function saveInfoClient(arg) {
            orderItemService.SaveOrder(vm.dataItem.id, { insured: arg}, true).then(function(res) {
                vm.getOrderHead();
                // vm.dataItem.insured = res.insured;
                vm.dataItem.edit = false;
            }, function(err) {
                vm.showMsgError();
            });
        }

        vm.auditOrder = function() {
            var data = JSON.stringify(vm.dataItem).replaceAll("\"", "\'");
            var config = JSON.stringify({
                button: { text: "Enviar a auditor&iacute;a" },
                label1: { text: "Motivos de Auditor&iacute;a " },
                type: farmConstants.modalType.auditOrder, // 4
                comments: {
                    required: false
                }
            }).replaceAll("\"", "\'");

            $uibModal.open({
                backdrop: 'static',
                backdropClick: false,
                dialogFade: false,
                keyboard: false,
                scope: $scope,
                size: 'md',
                windowTopClass: 'modal--md fade',
                template: '<mpf-modal-generic close="close()" config="'+config+'" data="'+data+'" type="'+farmConstants.modalType.auditOrder+'"></mpf-modal-generic>',
                controller : ['$scope', '$uibModalInstance',
                  function($scope, $uibModalInstance) {
                    $scope.close = function () {
                      $uibModalInstance.close();
                    };
                  }]
              });
        }

        function getAudit() {
            orderItemService.GetAuditOrder(vm.dataItem.id, vm.dataItem.audit.id, true).then(function(res) {
                vm.audit = res;
                
                if(vm.audit) {
                    vm.audit.class = vm.audit.additionalComments ? 'col-md-6' : 'col-md-3';
                }
                
                vm.showButtonAudit = vm.audit.status.id > 1;
                vm.dataItem.cancelEdit = vm.audit.status.id === 1;
            }, function(err) {
                vm.showMsgError();
            });
        }

        vm.getDateWithFormat = helper.getDateWithFormat;
        vm.refresh = refresh;
        vm.saveInfoClient = saveInfoClient;
        vm.truncText = truncText;
    }])
    .component("orderRequestItem", {
        templateUrl: "/farmapfre/app/order/clientrequest/orderRequestItem/order-request-item-component.html",
        controller: "orderRequestItemComponentController",
        bindings: {
        }
    })
});