(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "filterAffiliateComponent", ['angular'], function(ng) {
    ng.module('farmapfre.app').
    controller(
        'filterAffiliateComponentController', 
        ['proxyDocumentType', '$scope', 
        function(proxyDocumentType, $scope) {
            var vm = this;
            vm.frm = vm.frm || {}

            proxyDocumentType.GetDocumentTypes().then(function(response){
                vm.documentTypes = response;
            });

            vm.search = function() {
                var documentTypeCode = vm.frm && vm.frm.documentType ? vm.frm.documentType.id: null;
                vm.onSearch({$arg: {
                    documentTypeCode: documentTypeCode,
                    filter: vm.frm.filterCode
                }});
            }

            vm.clean = function() {
                vm.cleanFrm();
                vm.onClean(); 
            }

            vm.cleanFrm = function() {
                vm.frm.filterCode = '';
            };
        }] 
    ).
    component("filterAffiliate", {
        templateUrl: "/farmapfre/app/components/filterAffiliate/filter-affiliate-component.html",
        controller: "filterAffiliateComponentController",
        bindings: {
           onSearch: '&',
           onClean: '&'
        }
    })
});