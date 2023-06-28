(function($root, name, deps, action){
  $root.define(name, deps, action)
})(window, "filterLocalPharmacyComponent", ['angular'], function(ng) {
  ng.module('farmapfre.app').
  controller(
    'filterLocalPharmacyComponentController',
    ['proxyUbigeo',
      function(proxyUbigeo) {
        var vm = this;
        vm.frm = vm.frm || {};
        vm.frm.department = vm.frm.department || {};
        vm.frm.province = vm.frm.province || {};
        vm.frm.district = vm.frm.district || {};

        vm.GetDepartments = function() {
          proxyUbigeo.GetDepartments().then(function(res) {
            vm.departments = res;
          });
        };

        vm.GetDepartments();

        vm.changeProvinces = function(provinceId) {
          if(provinceId) {
            proxyUbigeo.GetProvinces(provinceId).then(function(res) {
              vm.provinces = res;
            });
          }
        };

        vm.changeDistricts = function(districtId) {
          if(districtId) {
            proxyUbigeo.GetDistricts(districtId).then(function(res) {
              vm.districts = res;
            });
          }
        };

        function search(showSpin, notClean) {
          var departamentCode = vm.frm.department ? vm.frm.department.id: null;
          var provinceCode = vm.frm.province ? vm.frm.province.id: null;
          var districtCode = vm.frm.district ? vm.frm.district.id: null;

          vm.onSearch({
            $arg: {
              filter: vm.frm.filter,
              departamentCode: departamentCode,
              provinceCode: provinceCode,
              districtCode: districtCode,
              // departament: vm.frm.department,
              // province: vm.frm.province,
              // district: vm.frm.district,
              showSpin: showSpin,
              notClean: notClean
            }});
        }

        function search2() {
          search(true, false);
        }

        function clean() {
          vm.cleanFrm();
          vm.onClean();
          vm.search2();
        }

        vm.search = search;
        vm.clean = clean;
        vm.search2 = search2;

        vm.cleanFrm = function() {
          vm.frm.filter = null;
          vm.frm.department = null;
          vm.provinces = vm.districts = [];
          vm.frm.province = null;
          vm.frm.district = null;
        };
      }
    ]
  ).
  component("filterLocalPharmacy", {
    templateUrl: "/farmapfre/app/components/filterLocalPharmacy/filter-local-pharmacy-component.html",
    controller: "filterLocalPharmacyComponentController",
    bindings: {
      onSearch: '&',
      onClean: '&'
    }
  })
});