(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "infoClientComponent", ['angular'], function(ng) {
    ng.module('farmapfre.app')
    .controller('infoClientComponentController', ['$scope', 'proxyUbigeo', function($scope, proxyUbigeo) {
        var vm = this;
        vm.open = true;
        vm.frm = vm.frm || {};
        vm.frm.address = vm.frm.address || {};
        var largomaximo = 50;

        if(vm.data.orderOrigin === 3) {
            $scope.dynamicPopover = {
                templateUrl: 'diagnosticTooltipPlantilla.html',
            };

            angular.forEach(vm.data.consultation.diagnostics, function(obj, key) {
                obj.showPopover = (obj.description.length > largomaximo);
            });
        }

        function truncText(text) {
            if(text.length > largomaximo) {
              return text.substr(0, largomaximo) + '...';
            } else {
              return text;
            }
        }

        function editClick($event) {
            vm.open = true;
            vm.data.edit = true;
            $event.stopPropagation();
        };

        function GetDepartments() {
            proxyUbigeo.GetDepartments().then(function(res) {
                vm.departments = res;
                angular.copy(vm.data.insured.address.department, vm.frm.address.department);
            });
        }

        function GetProvinces(departmentId) {
            if(departmentId) {
                proxyUbigeo.GetProvinces(departmentId).then(function(res) {
                    vm.provinces = res;
                    angular.copy(vm.data.insured.address.province, vm.frm.address.province);
                });
            }
        }

        function GetDistricts(provinceId) {
            if(provinceId) {
                proxyUbigeo.GetDistricts(provinceId).then(function(res) {
                    vm.districts = res;
                    angular.copy(vm.data.insured.address.district, vm.frm.address.district);
                });
            }
        }

        function changeDepartment(departmentId) {
            vm.provinces = vm.districts = [];
            if(departmentId) {
                proxyUbigeo.GetProvinces(departmentId).then(function(res) {
                vm.provinces = res;
                });
            }
        };

        function changeProvince(provinceId) {
            vm.districts = [];
            if(provinceId) {
                proxyUbigeo.GetDistricts(provinceId).then(function(res) {
                vm.districts = res;
                });
            }
        };

        function cancel() {
            vm.data.edit = false;
            setData();
        }

        function setData() {
            vm.frm.phoneNumber = '' + vm.data.insured.phoneNumber;
            vm.frm.phoneNumber2 = vm.data.insured.phoneNumber2;
            vm.frm.email = vm.data.insured.email; 
            angular.copy(vm.data.insured.address, vm.frm.address);
        }

        function save() {
            vm.onSave({$arg: vm.frm });
        }

        vm.truncText = truncText;
        vm.editClick = editClick;
        vm.GetDepartments = GetDepartments;
        vm.GetProvinces = GetProvinces;
        vm.GetDistricts = GetDistricts;
        vm.changeDepartment = changeDepartment;
        vm.changeProvince = changeProvince;
        vm.cancel = cancel;
        vm.save = save;

        if(!vm.config.readonly) {
            vm.GetDepartments();
            vm.GetProvinces(vm.data.insured.address.department.id);
            vm.GetDistricts(vm.data.insured.address.province.id);
            setData();
        }
    }]).
    component("infoClient", {
        templateUrl: "/farmapfre/app/components/infoClient/info-client-component.html",
        controller: "infoClientComponentController",
        bindings: {
            onSave: '&',
            data:"=?",
            audit:"=?",
            config:"=?",
        }
    })
});