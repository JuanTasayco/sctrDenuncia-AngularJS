(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "filterOrderComponent", ['angular'], function(ng) {
    ng.module('farmapfre.app').
    controller(
        'filterOrderComponentController',
        [
            'proxyParameter', 'proxyUbigeo', 'proxyMovementType', 'proxyTeCuidamos', '$timeout', '$scope',
            function( proxyParameter, proxyUbigeo, proxyMovementType, proxyTeCuidamos, $timeout, $scope) {
                var vm = this;
                var timer;
                vm.timeInMs = 30000;
                vm.frm = vm.frm || {};
                vm.frm.provinceIndicator = "1";
                vm.dateFormat = 'dd/MM/yyyy';
                vm.districtIsVisible = true;
                vm.first = true;

                $scope.$on("$destroy", function(event) {
                    destroyTimer();
                });

                proxyUbigeo.GetDistrictsLimaCallao().then(function(response) {
                    vm.districts = response;
                });

                if (vm.movementType == 'dispatch') {
                    proxyMovementType.GetMovementTypeDispatch().then(function(data) {
                        vm.statues = data;
                    });

                    proxyParameter.GetParameterDispatchRefresh().then(function(data) {
                        vm.timeInMs = data * 1000;
                        search();
                    });
                }
                else {
                    proxyMovementType.GetMovementType().then(function(data) {
                        vm.statues = data;
                    });

                    proxyParameter.GetParameterOrderRefresh().then(function(data) {
                        vm.timeInMs = data * 1000;
                        search();
                    });
                }

                function search(showSpin, notClean) {
                    if(vm.first) {
                        vm.first = false;
                        $timeout.cancel(timer);
                    }

                    var movementTypeCode = vm.frm && vm.frm.state ? vm.frm.state.id: null;
                    var districtCode = vm.frm && vm.frm.district ? vm.frm.district.id: null;
                    var provinceIndicator = vm.frm ? vm.frm.provinceIndicator : null;
                    var companyId = vm.frm && vm.frm.program ? vm.frm.program.companyId : null;
                    var programId = vm.frm && vm.frm.program ? vm.frm.program.id : null;
                    var programCompanyCode = companyId && programId ? companyId + '-' + programId : null;

                    vm.onSearch({$arg: {
                        filter: vm.frm.filterCode,
                        movementTypeCode: movementTypeCode,
                        programCompanyCode : programCompanyCode,
                        firstDate: vm.frm.firstDate,
                        endDate: vm.frm.endDate,
                        provinceIndicator: provinceIndicator,
                        districtProvCode: districtCode,
                        showSpin: showSpin,
                        notClean: notClean
                    }});

                    timer = $timeout(search, vm.timeInMs, true, false, true);
                }

                function search2() {
                    $timeout.cancel(timer);
                    search(true, false);
                    $scope.toggleFilter();
                }

                function clean() {
                    vm.cleanFrm();
                    vm.onClean();
                }

                function valCheck() {
                    vm.districtIsVisible = (vm.frm.provinceIndicator === '1');
                    vm.frm.district = undefined;
                }

                function destroyTimer() {
                    $timeout.cancel(timer);
                }

                vm.search = search;
                vm.clean = clean;
                vm.search2 = search2;
                vm.valCheck = valCheck;

                vm.cleanFrm = function() {
                    delete vm.frm.filterCode;
                    delete vm.frm.program;
                    delete vm.frm.firstDate;
                    delete vm.frm.endDate;
                    delete vm.frm.state;
                    delete vm.frm.district;

                    vm.frm.provinceIndicator = '1';
                    vm.districtIsVisible = true;
                };

                var cont = 0;

                $scope.$watch("$ctrl.reset", function(n, o) {
                    if ((n || o) && n != o) {
                        if(cont == 0) {
                            vm.cleanFrm();
                            vm.first = true;
                            // search(true, false);
                            cont++;
                        } else {
                            cont = 0;
                        }
                        delete vm.reset;
                    }
                });

                $scope.$watch("$ctrl.stop", function(n, o) {
                    if (n != o) {
                        if(n) {
                            destroyTimer();
                        }
                    }
                });

                $scope.$watch("$ctrl.originType", function(n, o) {
                    if (n != o) {
                        if(n === 2) {
                            proxyTeCuidamos.GetAllProgramsDelivery().then(function(response) {
                                vm.programs = response;
                            });
                        }
                        search2();
                    }
                });

                $scope.$watch('$ctrl.frm.firstDate', function(n, o) {
                    vm.frm.endDate = vm.frm.endDate == null ? undefined : vm.frm.endDate;
                    if (vm.frm.firstDate && (vm.frm.firstDate > vm.frm.endDate)) {
                        vm.frm.firstDate = null;
                    }

                    if(!vm.frm.firstDate && o) {
                        vm.frm.firstDate = null;
                    }

                    vm.frm.disabled = (vm.frm.firstDate && !vm.frm.endDate) || (!vm.frm.firstDate && vm.frm.endDate);
                  });
                  
                  $scope.$watch('$ctrl.frm.endDate', function(n, o) {
                    vm.frm.endDate = vm.frm.endDate == null ? undefined: vm.frm.endDate;
                    if (vm.frm.endDate && (vm.frm.firstDate > vm.frm.endDate)) {
                        vm.frm.endDate = null;
                    }

                    if(!vm.frm.endDate && o) {
                        vm.frm.endDate = null;
                    }

                    vm.frm.disabled = (vm.frm.firstDate && !vm.frm.endDate) || (!vm.frm.firstDate && vm.frm.endDate);
                  });
            }
        ]
    ).
    component("filterOrder", {
        templateUrl: "/farmapfre/app/components/filterOrder/filter-order-component.html",
        controller: "filterOrderComponentController",
        bindings: {
           onSearch: '&',
           onClean: '&',
           movementType:'=?',
           originType:'=?',
           reset:'=?',
           stop:'=?'
        }
    })
});