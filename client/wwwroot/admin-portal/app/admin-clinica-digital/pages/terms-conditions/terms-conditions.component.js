'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    TermsConditionsComponent.$inject = ['sections'];
    function TermsConditionsComponent(sections) {
        var vm = this;
        vm.$onInit = onInit;
        
        function onInit() {
            vm.sections = sections;
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('TermsConditionsComponent', TermsConditionsComponent);
});
