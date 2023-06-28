(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "orderDispatchSearchComponent", ['angular', 'moment', '/farmapfre/app/common/helpers/farmapfrehelper.js'], function(ng, moment){
    ng.module('farmapfre.app').
    controller('orderDispatchSearchComponentController', [
        'oimPrincipal', 'proxyOrder', '$state', '$scope', 'farmapfrehelper', 
    function(oimPrincipal, proxyOrder, state, $scope, helper){
        var vm = this;
        var mainArgs;

        $scope.$parent.$parent.$parent.item.order = false;
        $scope.$parent.$parent.$parent.item.dispatch = true;

        function validProfiles() {
            var roleId = oimPrincipal.get_role();
            var ret = false;

            if(roleId) {
                switch(roleId) {
                    case "USR_ADMIN": {
                        vm.showTabDelivery = vm.showTabTC = vm.showTabCM = vm.showTabCL = true;
                        vm.origin = 1;
                        ret = true;
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

        function clean(){
            vm.pagination = {
                maxSize: 5,
                sizePerPage: 5,
                currentPage: 1,
                totalRecords: 0
            }
        }

        clean();

        function search(arg, notClean) {
            if (arg.notClean)
                notClean = arg.notClean;
                
            if(!notClean)
                clean();
                
            mainArgs = arg;

            searchDispatchs(vm.origin, arg, true);
        }

        function searchDispatchs(origin, params, setPag) {
            var arg = JSON.parse(JSON.stringify(params));

            if(!setPag) {
                arg.pageNumber = 1;
                arg.provinceIndicator = 1;
                delete arg.movementTypeCode;
                delete arg.districtProvCode;
                delete arg.filter;
                delete arg.date;
                delete arg.showSpin;
            } else {
                arg.pageNumber = vm.pagination.currentPage;
            }

            arg.pageLength = vm.pagination.sizePerPage;
            arg.originIndicator = origin;

            proxyOrder.SearchDispatch(arg, arg.showSpin).then(function(response){
                vm.totalRecordsDelivery = response.total.recordsLanding ? response.total.recordsLanding : 0;
                vm.totalRecordsTeCuidamos = response.total.recordsTeCuidamos ? response.total.recordsTeCuidamos : 0;
                vm.totalRecordsMedicalCenter = response.total.recordsMedicalCenter ? response.total.recordsMedicalCenter : 0;
                vm.totalRecordsDigitalClinic = response.total.recordsDigitalClinic ? response.total.recordsDigitalClinic : 0;

                if(setPag) {
                    vm.orders = response.records;
                    vm.pagination.totalRecords = response.totalRecords;
                    vm.noResult = !vm.orders || (!vm.pagination.totalRecords && vm.orders.length == 0);
                }
            });
        }

        function pageChanged() {
            search(mainArgs, true);
        }

        function cleanFilter(){
            
        }

        vm.verDetalle = function(order) {
            vm.stopTimer = true;
            state.go('order.dispatchItem', { orderid: order.orderId, itemDispatch:order.id } );
        }

        function setOrigin(code) {
            if(vm.origin != code) {
                vm.resetFilter = true;
            }

            vm.origin = code;
        }

        vm.setOrigin = setOrigin;
        vm.clean = cleanFilter
        vm.search = search;
        vm.pageChanged = pageChanged;
        vm.getDateWithFormat = helper.getDateWithFormat;
    }]).
    component("orderDispatchSearch", {
        templateUrl: "/farmapfre/app/order/dispatch/dispatchSearch/dispatch-search.component.html",
        controller: "orderDispatchSearchComponentController",
        bindings: {
        }
    })
});