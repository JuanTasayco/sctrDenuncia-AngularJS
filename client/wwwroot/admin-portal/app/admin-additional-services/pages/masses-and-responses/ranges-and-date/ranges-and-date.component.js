'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
    var folder = system.apps.ap.location;
    RangesAndDateController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert', 'MassesAndResponsesFactory', 'AdminRamoFactory'];
    function RangesAndDateController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert, MassesAndResponsesFactory, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;

        vm.save = save;
        vm.addCancellationDate = addCancellationDate;
        vm.deleteCancellationDate = deleteCancellationDate;
        vm.changeDayBoxStatus = changeDayBoxStatus;
        vm.addTimeBox = addTimeBox;
        vm.removeTimeBox = removeTimeBox;
        vm.onTabCamposanto = onTabCamposanto;

        vm.dataCeremonyRange = []
        vm.dataCancellationDays = [];
        vm.dataSector = []

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
            vm.servicesSelected = MassesAndResponsesFactory.getServiceSelected();
            vm.subServicesSelected = MassesAndResponsesFactory.getSubServiceSelected();
            AdminRamoFactory.subsChangeRamo(changeRamo);
            MassesAndResponsesFactory.subsChangeSubService(changeSubService);

            var now = new Date();
            vm.dataDays = MassesAndResponsesFactory.getDays(now.getFullYear(), now.getMonth());
            vm.dataMonths = MassesAndResponsesFactory.getMonths();
            vm.dataYears = MassesAndResponsesFactory.getAnios();
        }

        function changeRamo() {
            //changeSubService(vm.servicesSelected.)
        }

        function changeSubService(item){
            MassesAndResponsesFactory.getServiceParameters(item.code).then(function (res){
                MassesAndResponsesFactory.setServiceParameters(res);

                vm.isResponse = item.code === 'SA0025';

                vm.tabsCamposanto = MassesAndResponsesFactory.getCamposantos();
                vm.tabsCamposantoSelected = vm.tabsCamposanto[0];
                vm.dataCeremonyRange = MassesAndResponsesFactory.getCeremonyRange();
                vm.dataSector = MassesAndResponsesFactory.getSector(vm.tabsCamposantoSelected.code);

            });
        }

        function onTabCamposanto(event){
            vm.tabsCamposantoSelected = event;
            vm.dataSector = MassesAndResponsesFactory.getSector(vm.tabsCamposantoSelected.code);
        }

        function save() {
            console.log("save")
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
                templateUrl: '/admin-portal/app/admin-additional-services/pages/masses-and-responses/ranges-and-date/modal-cancellation-date.html',
                controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout', function ($scope, $uibModalInstance, $uibModal, $timeout) {
                    //CloseModal
                    $scope.closeModal = function () {
                        $uibModalInstance.close();
                    };

                    $scope.changeMonth = function (){
                        vm.dataDays = MassesAndResponsesFactory.getDays(vm.form.year.code, vm.form.month.code);
                    }

                    $scope.save = function () {
                        console.log("save modal")
                        if (!$scope.formCancellationDay.$valid) {
                            $scope.formCancellationDay.markAsPristine();
                            return;
                        }

                        var filters = _.filter(vm.dataCancellationDays, function (item) {
                            if ((!vm.isResponse || (item.sector.code === vm.form.sector.code))
                                && item.day.code === vm.form.day.code
                                && item.month.code === vm.form.month.code
                                && item.year.code === vm.form.year.code) {
                              return item;
                            }
                          });

                        console.log(filters);

                        if (filters.length !== 0){
                            mModalAlert.showWarning("La fecha seleccionada ya se encuentra en la lista", 'Advertencia');
                            return;
                        }

                        var cancellationDate = {
                            sector: vm.form.sector,
                            day: vm.form.day,
                            month: vm.form.month,
                            year: vm.form.year
                        };
                        vm.dataCancellationDays.push(cancellationDate);
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
