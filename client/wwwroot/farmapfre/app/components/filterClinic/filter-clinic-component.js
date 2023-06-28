(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, "filterClinicComponent", ['angular'], function(ng) {
  ng.module('farmapfre.app').
  controller(
    'filterClinicComponentController',
    [
      'proxyUbigeo',
      function(proxyUbigeo) {
        var vm = this;

        vm.frm = vm.frm || {};
        vm.frm.relation = "2";

        vm.timeInMs;
        vm.first = true;

        GetDepartments = function() {
          proxyUbigeo.GetDepartments().then(function(res) {
            vm.departments = res;
          });
        };

        GetDepartments();

        vm.changeProvinces = function(provinceId, first) {
          proxyUbigeo.GetProvinces(provinceId).then(function(res) {
            vm.provinces = res;
          });
        };

        vm.changeDistricts = function(districtId, first) {
          proxyUbigeo.GetDistricts(districtId).then(function(res) {
            vm.districts = res;
          });
        };

        function search() {
          vm.onSearch({
            $arg: {
              itsRelated: vm.frm.relation === '1' ? true : false,
              filter: vm.frm.filter,
              department: vm.frm.department,
              province: vm.frm.province,
              district: vm.frm.district
            }});
        }

        function clean() {
          vm.cleanFrm();
          vm.onClean();
          vm.search();
        }

        vm.search = search;
        vm.clean = clean;

        vm.cleanFrm = function() {
          vm.districts = [];
          vm.provinces = [];
          vm.frm.relation = '2';
          vm.frm.filter = '';
          vm.frm.department = null;
          vm.frm.province = null;
          vm.frm.district = null;
        };

        vm.search();
      }
    ]
  ).
  component("filterClinic", {
    templateUrl: "/farmapfre/app/components/filterClinic/filter-clinic-component.html",
    controller: "filterClinicComponentController",
    bindings: {
      onSearch: '&',
      onClean: '&'
    }
  })
});