'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    ContentController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function ContentController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
            console.log("entro contetn")
        }

    
    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('ContentController', ContentController)
        .component('apContent', {
            templateUrl: folder + '/app/admin-additional-services/pages/masses-and-responses/content/content.component.html',
            controller: 'ContentController',
            bindings: {
            }
        });;
});
