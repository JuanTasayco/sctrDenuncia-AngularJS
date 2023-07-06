'use strict';

define(['angular', 'coreConstants','system'], function (ng, coreConstants, system) {
    var folder = system.apps.ap.location;
    WhatYouWantToDoController.$inject = ['AdminRamoFactory', '$stateParams'];
    function WhatYouWantToDoController(AdminRamoFactory, $stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        function onInit() {
            console.log("WhatYouWantToDoController");
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('WhatYouWantToDoController', WhatYouWantToDoController)
        .component('apWhatYouWantToDo', {
            templateUrl: folder + '/app/admin-policy-section/pages/admin-ramo/what-you-want-to-do/what-you-want-to-do.component.html',
            controller: 'WhatYouWantToDoController',
            bindings: {
            }
          });;
});
