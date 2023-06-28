(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "orderRequestSearchComponent", ['angular', 'moment', '/farmapfre/app/common/helpers/farmapfrehelper.js'], function(ng, moment) {
    ng.module('farmapfre.app').
    controller('orderRequestSearchComponentController', [
        'oimPrincipal', 'proxyOrder', '$state', '$scope', 'farmapfrehelper', 
        function(oimPrincipal, proxyOrder, state, $scope, helper) {
            var vm = this;
            vm.noResultInfo = true;
            vm.noResult = false;
            vm.isAdmin = false;
            var mainArgs;
            
            $scope.$parent.$parent.$parent.item.order = true;
            $scope.$parent.$parent.$parent.item.dispatch = false;

            function validProfiles() {
                var roleId = oimPrincipal.get_role();
                var ret = false;
                
                if(roleId) {
                    switch(roleId) {
                        case "USR_ADMIN": {
                            vm.showTabDelivery = vm.showTabTC = vm.showTabCM = vm.showTabCL = true;
                            vm.origin = 1;
                            ret = true;
                            vm.isAdmin = true;
                        }; break;
                        case "USR_BACKOFFICE": {
                            vm.showTabDelivery = vm.showTabTC = vm.showTabCL = true; vm.showTabCM = false;
                            vm.origin = 1;
                            ret = true;
                        }; break;
                        case "USR_BACKOFFICECM": {
                            vm.showTabDelivery = vm.showTabTC = vm.showTabCL = false; vm.showTabCM = true;
                            vm.origin = 3;
                            ret = true;
                        }; break;
                        default: {
                            vm.showTabDelivery = vm.showTabTC = vm.showTabCM = vm.showTabCL = false;
                        }; break;
                    }
                }
                return ret;
            }
            
            if(!validProfiles()) {
                return void(0);
            }

            function clean() {
                vm.pagination = {
                    maxSize: 5,
                    sizePerPage: 5,
                    currentPage: 1,
                    totalRecords: 0
                }
            }

            clean();

            function search(arg, notClean) {
                vm.noResultInfo = false;

                if (arg.notClean)
                    notClean = arg.notClean;

                if(!notClean)
                    clean();

                mainArgs = arg;

                searchOrders(vm.origin, arg, true);
            }

            function searchOrders(origin, params, setPag) {
                var arg = JSON.parse(JSON.stringify(params));

                if(!setPag) {
                    arg.pageNumber = 1;
                    arg.provinceIndicator = 1;
                    delete arg.filter;
                    delete arg.movementTypeCode;
                    delete arg.programCompanyCode;
                    delete arg.firstDate;
                    delete arg.endDate;
                    delete arg.districtProvCode;
                    delete arg.showSpin;
                } else {
                    arg.pageNumber = vm.pagination.currentPage;
                }

                arg.pageLength = vm.pagination.sizePerPage;
                arg.originIndicator = origin;

                proxyOrder.SearchOrder(arg, arg.showSpin).then(function(response) {
                        vm.totalRecordsDelivery = response.total.recordsLanding ? response.total.recordsLanding : 0;
                        vm.totalRecordsTeCuidamos = response.total.recordsTeCuidamos ? response.total.recordsTeCuidamos : 0;
                        vm.totalRecordsMedicalCenter = response.total.recordsMedicalCenter ? response.total.recordsMedicalCenter : 0;
                    vm.totalRecordsDigitalClinic = response.total.recordsDigitalClinic ? response.total.recordsDigitalClinic : 0;

                    if(setPag) {
                        vm.orders = response.records;
                        vm.pagination.totalRecords = response.totalRecords;
                        vm.noResult = !vm.orders || (vm.pagination.totalRecords == 0 && vm.orders.length == 0) ? true : false;
                    }
                });
            }

            function pageChanged() {
                mainArgs.showSpin = true;
                search(mainArgs, true);
            }

            vm.verDetalle = function(order) {
                vm.stopTimer = true;
                state.go('order.item', { orderid: order.id } );
            }

            vm.cleanSearch = function() {
            }

            function setOrigin(code) {
                // if(vm.origin != code) {
                //     vm.resetFilter = true;
                // }

                vm.origin = code;
            }

            vm.setOrigin = setOrigin;
            vm.search = search;
            vm.pageChanged = pageChanged;
            vm.getDateWithFormat = helper.getDateWithFormat;
        }
    ]).component("orderRequestSearch", {
        templateUrl: "/farmapfre/app/order/clientrequest/orderRequestSearch/order-request-search-component.html",
        controller: "orderRequestSearchComponentController",
        bindings: {
        }
    }).service("orderItemService", ['proxyOrder','$q', function(proxyOrder, $q) {
        var currentResponseView;

        function getOrder(id) {
            var deferred = $q.defer();
            proxyOrder.GetOrderById(id, true).then(function(res){
                if(res.itsProvinceOrder)
                    res.externalProviders = res.externalProviders.filter(function(x) { return x.id != 1; });
                currentResponseView = res;
                deferred.resolve(res);
            }, function(e){ deferred.reject(e)});
            return deferred.promise;
        }

        function getCurrentOrderItem(){
            return currentResponseView;
        }

        this.getOrder = getOrder;
        this.getCurrentOrderItem = getCurrentOrderItem;
        this.SaveOrderDetail = proxyOrder.SaveOrderDetail;
        this.CancelOrder = proxyOrder.CancelOrder;
        this.SavePreOrders = proxyOrder.SavePreOrders;
        this.SaveDispatchs = proxyOrder.SaveDispatchs;
        this.GetHeadOrderById = proxyOrder.GetHeadOrderById;
        this.GetOrderDetailsById  = proxyOrder.GetOrderDetailsById;
        this.SaveOrder  = proxyOrder.SaveOrder;
        this.GetAuditOrder = proxyOrder.GetAuditOrder;
    }])
});