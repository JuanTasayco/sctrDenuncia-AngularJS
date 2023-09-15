'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    RangesAndDateController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert'];
    function RangesAndDateController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert) {
        var vm = this;
        vm.$onInit = onInit;

        vm.tabs = [
            {
                code: 0,
                lbl: 'CHICLAYO'
            },
            {
                code: 1,
                lbl: 'CHICLAYO'
            },
            {
                code: 2,
                lbl: 'CHICLAYO'
            },
            {
                code: 3,
                lbl: 'CHICLAYO'
            },
            {
                code: 4,
                lbl: 'CHICLAYO'
            },
            {
                code: 5,
                lbl: 'CHICLAYO'
            }
        ]
        // al setear en false se quita la opcion sector del modal
        vm.isResponse = true;
        vm.save = save;
        vm.addCancellationDate = addCancellationDate;
        vm.deleteCancellationDate = deleteCancellationDate;
        vm.changeDayBoxStatus = changeDayBoxStatus;
        vm.addTimeBox = addTimeBox;
        vm.removeTimeBox = removeTimeBox;

        vm.dataCeremonyRange = [
            { Code: 2, Description: '1 hora' },
            { Code: 1, Description: '30 minutos' }
        ]
        vm.dataSector = [
            { Code: 1, Description: 'Sector 1' },
            { Code: 2, Description: 'Sector 2' }
        ]
        vm.dataDays = [
            { Code: 1, Description: '01' },
            { Code: 2, Description: '02' }
        ]
        vm.dataMonths = [
            { Code: 1, Description: 'Enero' },
            { Code: 2, Description: 'Febrero' }
        ]
        vm.dataYears = [
            { Code: 1, Description: '2023' },
            { Code: 2, Description: '2024' }
        ]

        vm.dataCancellationDays = [
            {
                sector: 'Sector 1',
                day: '01',
                month: 'Enero',
                year: '2023'
            },
            {
                sector: 'Sector 2',
                day: '01',
                month: 'Enero',
                year: '2023'
            }
        ]

        vm.formCancellationDay = {}

        vm.dataCampoSanto = {
            id: 1,
            days: [
                {
                    id: 1,
                    name: "DOM",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                },
                {
                    id:2,
                    name: "LUN",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                },
                {
                    id:3,
                    name: "MAR",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                },
                {
                    id:4,
                    name: "MIE",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                },
                {
                    id:5,
                    name: "JUE",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                },
                {
                    id:6,
                    name: "VIE",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                },
                {
                    id:7,
                    name: "SAB",
                    active: true,
                    rangeHours: [
                        {
                            initHour: "09:00",
                            endHour: "17:00"
                        }
                    ]
                }
            ],
            idTiempoCeremonia: 1,
            feriados: [
                "2023-05-06T00:00:00",
                "2023-05-06T00:00:00"
            ]
        }


        function onInit() {

        }

        function save() {
            console.log(vm.dataCampoSanto)
        }

        function changeDayBoxStatus(dayItem, dayIndex) {
            if (dayItem.active) {
                this.addTimeBox(dayIndex);
            } else {
                vm.dataCampoSanto.days[dayIndex].rangeHours = [];
            }
        }

        function addTimeBox(dayIndex) {
            vm.dataCampoSanto.days[dayIndex].rangeHours.push({
                initHour: "09:00",
                endHour: "17:00"
            });
        }

        function removeTimeBox(dayId, hourIndex) {
            for (var i = 0; i < vm.dataCampoSanto.days.length; i++) {
                if (vm.dataCampoSanto.days[i].id === dayId) {
                    vm.dataCampoSanto.days[i].rangeHours.splice(hourIndex, 1);

                    if (vm.dataCampoSanto.days[i].rangeHours.length === 0) {
                        vm.dataCampoSanto.days[i].active = false;
                    }
                }
            }
        }

        function addCancellationDate(data) {

            $uibModal.open({
                backdrop: true, // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'lg',
                templateUrl: '/admin-portal/app/admin-additional-services/pages/masses-and-responses/masses/modal-cancellation-date.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.save = function () {
                        console.log("save modal")
                        if (!$scope.formCancellationDay.$valid) {
                            $scope.formCancellationDay.markAsPristine();
                            return;
                        }
                        vm.dataCancellationDays.push(vm.form);
                        $uibModalInstance.close()
                    };
                }]
            });
        }

        function deleteCancellationDate(index) {
            vm.dataCancellationDays.splice(index, 1);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule)
        .controller('RangesAndDateController', RangesAndDateController)
        .component('apRangesAndDate', {
            templateUrl: folder + '/app/admin-additional-services/pages/masses-and-responses/ranges-and-date/ranges-and-date.component.html',
            controller: 'RangesAndDateController',
            bindings: {
            }
        });;
});
