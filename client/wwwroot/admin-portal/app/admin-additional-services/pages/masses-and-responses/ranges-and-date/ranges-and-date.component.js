'use strict';

define(['angular', 'coreConstants', 'moment', 'system', 'lodash'], function (ng, coreConstants, moment, system, _) {
    var folder = system.apps.ap.location;
    RangesAndDateController.$inject = ['$scope', '$stateParams', '$uibModal', 'mModalConfirm', 'mModalAlert', 'MassesAndResponsesFactory', 'AdminRamoFactory'];
    function RangesAndDateController($scope, $stateParams, $uibModal, mModalConfirm, mModalAlert, MassesAndResponsesFactory, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.$onDestroy = onDestroy;

        vm.patternHours  = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        vm.saveSubServiceRangesAndDate = saveSubServiceRangesAndDate;
        vm.addCancellationDate = addCancellationDate;
        vm.deleteCancellationDate = deleteCancellationDate;
        vm.changeDayBoxStatus = changeDayBoxStatus;
        vm.addTimeBox = addTimeBox;
        vm.removeTimeBox = removeTimeBox;
        vm.onTabCamposanto = onTabCamposanto;

        vm.validateEndHor = validateEndHor;
        
        vm.dataCeremonyRange = []
        vm.dataCancellationDays = [];
        vm.dataSector = []

        vm.formCancellationDay = {}
        vm.formHours = {}
        vm.formCeremonyRange = {}

        function onInit() {
            vm.servicesSelected = MassesAndResponsesFactory.getServiceSelected();
            vm.subServicesSelected = MassesAndResponsesFactory.getSubServiceSelected();
            AdminRamoFactory.subsChangeRamo(changeRamo);
            MassesAndResponsesFactory.subsChangeSubService(changeSubService);
           
            MassesAndResponsesFactory.emitComponentsReady();

            var now = new Date();
            vm.dataDays = MassesAndResponsesFactory.getDays(now.getFullYear(), now.getMonth());
            vm.dataMonths = MassesAndResponsesFactory.getMonths();
            vm.dataYears = MassesAndResponsesFactory.getAnios();
        }

        function onDestroy() {
            MassesAndResponsesFactory.unsubscribeChangeSubService();
        }

        function changeRamo() {
            // changeSubService(vm.servicesSelected.)
        }

        function changeSubService(item){
            vm.subServicesSelected = item;
            MassesAndResponsesFactory.getServiceParameters(item.code).then(function (res){
                MassesAndResponsesFactory.setServiceParameters(res);

                vm.isResponse = item.code === 'SA0025';

                vm.tabsCamposanto = MassesAndResponsesFactory.getCamposantos();
                vm.tabsCamposantoSelected = vm.tabsCamposanto[0];
                vm.dataCeremonyRange = MassesAndResponsesFactory.getCeremonyRange();
                vm.dataSector = MassesAndResponsesFactory.getSector(vm.tabsCamposantoSelected.code);

                getSubServiceRangesAndDate();

            });
        }

        function onTabCamposanto(event){
            vm.tabsCamposantoSelected = event;
            vm.dataSector = MassesAndResponsesFactory.getSector(vm.tabsCamposantoSelected.code);
            getSubServiceRangesAndDate()

            vm.dataCancellationDays = []
        }

        function getSubServiceRangesAndDate(){
            MassesAndResponsesFactory.getSubServiceRangesAndDate(vm.tabsCamposantoSelected.code, vm.subServicesSelected.code).then(function (res){
                vm.dataCampoSanto = res;

                vm.ceremonyRange = {
                    code: vm.dataCampoSanto.ceremonyRangeId
                };
                
                _.forEach(vm.dataCampoSanto.cancellationDays, function (x) {
                    var _date = new Date(x.date);
                    var cancellationDate = {
                        sector: x.sectorId,
                        year: { 
                            code: _date.getFullYear(), 
                            name: _date.getFullYear()
                        },
                        month: { 
                            code: _date.getMonth() +1 ,
                            name: _.find(MassesAndResponsesFactory.getMonths(), function(y) {
                                return y.code === _date.getMonth() + 1
                            }).name
                        },
                        day: { 
                            code: _date.getDate(),
                            name: _.find(MassesAndResponsesFactory.getDays(_date.getFullYear(),_date.getMonth() + 1), function(y) {
                                return y.code === _date.getDate()
                            }).name
                        },
                    };
                    vm.dataCancellationDays.push(cancellationDate);
                });

            });
        }

        function saveSubServiceRangesAndDate() {
            if (!$scope.formHours.$valid || !$scope.formCeremonyRange.$valid) {
                $scope.formHours.markAsPristine();
                $scope.formCeremonyRange.markAsPristine();
                return;
            }

            mModalConfirm.confirmInfo(
                null,
                '¿Estas seguro de guardar los cambios realizados?',
                'SI').then(function (response) {
                    var requestSave = {
                        tiempoCeremoniaId: vm.ceremonyRange.code,
                        activo: true,
                        dias: _.map(vm.dataCampoSanto.days, function (x) {
                            return {
                                id: ""+x.id,
                                nombre: x.name,
                                activo: x.active,
                                rangoHorario: _.map(x.rangeHours, function (y){
                                    return {
                                        horaInicio: moment(y.initHour,'HHmm').format('HH:mm'),
                                        horaFin: moment(y.endHour,'HHmm').format('HH:mm')
                                    };
                                })
                            };
                        }),
                        feriados: _.map(vm.dataCancellationDays, function (x) {
                            return {
                                sectorId: x.sector && x.sector.code,
                                fecha: x.year.code + "-" + x.month.code + "-" + x.day.code + "T05:00:00Z"
                            };
                        })
                    };
                    MassesAndResponsesFactory.saveSubServiceRangesAndDate(vm.tabsCamposantoSelected.code, vm.subServicesSelected.code, requestSave).then(function (res){
                        console.log(res);
                    });
                })

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

        // function compareHour(){

        // }

        function validateEndHor(hourInit,hourEnd) {
            var hourInit = moment(hourInit,'HH:mm');
            var hourEnd = moment(hourEnd,'HH:mm');
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
