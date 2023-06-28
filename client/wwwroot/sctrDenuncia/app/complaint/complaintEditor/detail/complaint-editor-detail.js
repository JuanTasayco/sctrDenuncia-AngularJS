(function ($root, name, deps, action) {
    $root.define(name, deps, action)
})(window, "complaintEditorDetailComponent", ['angular'], function (ng) {
    ng.module('sctrDenuncia.app').
    controller('complaintEditorDetailComponentController', ['proxyLookupSctr', '$scope', '$state', 'accessSupplier', 'mModalAlert', "$uibModal", "$rootScope", "proxyComplaint", "$q", function (proxyLookupSctr, $scope, $state, accessSupplier, mModalAlert, $uibModal, $rootScope,proxyComplaint,$q) {

            var vm = this;
            var profile = accessSupplier.profile();
            vm.$onInit = onInit;
            vm.openSiteds = openSiteds;
            vm.isEndStatus = isEndStatus;
      vm.onLoadBeneficio = onLoadBeneficio;
      vm.seekClinic = seekClinic; vm.validPolicy = validPolicy;
            vm.showSearchPolicy = false;
            vm.showModalSearchPolicy = showModalSearchPolicy;
            vm.params = {
                periodo: $state.params.periodo, nrodenuncia: $state.params.nrodenuncia, codasegurado: $state.params.codasegurado
            }
            function onInit() {
                if (isBlank(vm.viewdata.nroPolizaSalud)) {
                    vm.showSearchPolicy = true;
                } else {                    
                    $scope.$emit('nroPolizaSalud', vm.viewdata.nroPolizaSalud);
                }
                vm.dateFormat = 'dd/MM/yyyy';
                vm.genero = vm.viewdata.sexo == "M" ? "Masculino" : vm.viewdata.sexo == "F" ? "Femenino" : "";
                proxyLookupSctr
                    .GetLookups(["EPSTV87", "EPSTV88", "EPSTV89", "EPSTV91", "CONSEC"], true)
                    .then(function (res) {
                        if (res) {

                            vm.formaAccidentes = res.epstV87;
                            vm.naturalezaLesiones = res.epstV89;
                            vm.partesCuerpoLesionado = res.epstV88;
                            vm.agentesCausantes = res.epstV91;
                            vm.consecuencias = res.consec;
                        }

                    })
        onLoadBeneficio(true);
        seekClinic(vm.viewdata.clinica.ndidntdd, true);
            }
      function onLoadBeneficio(load) {

        if (!load) vm.viewdata.beneficio = null;
        var params = { cprvdr: vm.viewdata.clinica.cprvdr, nsprvdr: vm.viewdata.clinica.nsprvdr };
        proxyComplaint.SeekBenefit(params).then(
          function (r) {
            vm.beneficio = r;
          }
        );
            }

      function seekClinic(wildcar, load) {
        var deferred = $q.defer();
        if (load) return deferred.resolve(vm.viewdata.clinica);

        var params = { Wildcard: wildcar };
        proxyClinicCoverage.SeekClinic(params).then(
          function (r) {
            if (r && r.length > 0) {
              angular.forEach(r, function (a, b) {
                a.fulltext = a.ndidntdd + " - " + a.rsabrvda + " - " + a.dscrsl;
              });
                }else{  
              mModalAlert.showError(
                "No se encontraron clínicas.",
                "Denuncia"
              );
                }
            deferred.resolve(r);
          },
          function (r) {
            deferred.reject(r);
             }
        );
        return deferred.promise;
            }
            function validPolicy() {
                vm.showSearchPolicy = true;
            }
            function showModalSearchPolicy() {
                $uibModal.open({
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    scope: $scope,
                    size: "lg",
                    template:
                        "<modalsearchpolicy afiliado='afiliado' close='close(policy)'> </modalsearchpolicy>",
                    controller: [
                        "$scope",
                        "$uibModalInstance",
                        function ($scope, $uibModalInstance) {
                            $scope.afiliado = vm.viewdata;
                            $scope.close = function () {
                                if ($rootScope.hasPolicy) {
                                    vm.viewdata.tipPoliza = $rootScope.tipPoliza;
                                    $scope.$emit('nroPolizaSalud', $rootScope.nroPolizaSalud);
                                    vm.viewdata.nroPolizaSalud = $rootScope.nroPolizaSalud;
                                    vm.viewdata.vigencia = $rootScope.vigencia;
                                    vm.viewdata.noPlan = $rootScope.noPlan;
                                }
                                $uibModalInstance.close();
                            };
                        },
                    ],
                });
            }
      function isBlank(str) {
        return (!str || /^\s*$/.test(str));
      }
      function openSiteds() {
        if (isBlank(vm.viewdata.nroPolizaSalud)) {
          mModalAlert.showError("Denuncia no tiene póliza", "Documento");
          return;
        } else {
          $state.go("siteds.search", { periodo: $state.params.periodo, nrodenuncia: $state.params.nrodenuncia, codasegurado: $state.params.codasegurado });
        }
      }
      function getCodeFromSelectObject(model, prop, propCode) {
        return model && model[prop] && model[prop][propCode] ? model[prop][propCode] : null
      }
            function getComplaint() {

                if (!$scope.frmComplaintDetail.$valid) {
                    $scope.frmComplaintDetail.markAsPristine();
                    return { isValid: false }
                }

                var dateAcc = vm.viewdata.fecAccidente
                var timeAcc = vm.viewdata.fecAccidente
                var fecAcc = new Date(dateAcc.getFullYear(), dateAcc.getMonth(), dateAcc.getDate(),
                    timeAcc.getHours(), timeAcc.getMinutes(), timeAcc.getSeconds());

                var req = {
                    isValid: true,
                    nombreRepresentante: vm.viewdata.nombreRepresentante,
                    cargoRepresentante: vm.viewdata.cargoRepresentante,
                    fechaAccidente: fecAcc,
                    lugarOcurrencia: vm.viewdata.lugarOcurrencia,
                    indicadorDenunciaProvisional: vm.viewdata.rbDenunciaProvisional,
                    indicadorOcurrioDentroTrabajo: vm.viewdata.rbOcurrioTrabajo,
                    codigoFormaAccidente: getCodeFromSelectObject(vm.viewdata, "formaAccidente", "codigo"),
                    codigoParteCuerpo: getCodeFromSelectObject(vm.viewdata, "parteCuerpo", "codigo"),
                    codigoNaturalezaLesion: getCodeFromSelectObject(vm.viewdata, "naturalezaLesion", "codigo"),
                    codigoAgenteCausante: getCodeFromSelectObject(vm.viewdata, "agenteCausante", "codigo"),
                    codigoConsecuencia: getCodeFromSelectObject(vm.viewdata, "consecuencia", "codigo"),
                    descripcionAccidente: vm.viewdata.descripcion,
                    usuario: profile.loginUserName,
          DescClinica: vm.viewdata.clinica.rsaynmbrs,
          CodProveedor: vm.viewdata.clinica.cprvdr,
          SucProveedor: vm.viewdata.clinica.nsprvdr,
          DescBeneficio: vm.viewdata.beneficio.deS_CBNFCO,
          CodBeneficio: vm.viewdata.beneficio.cbnfco,
                    correoDenuncia: vm.viewdata.correoDenuncia,
                    telefonoDenuncia: vm.viewdata.telefonoDenuncia
                }

                return req;
            }
            function isEndStatus() {
                return (vm.viewdata.estado || "").trim() == "F";
            }
            vm.emitFnComplaint({ $fn: { getComplaint: getComplaint } });
        }]).
        component("complaintEditorDetail", {
            templateUrl: "/sctrDenuncia/app/complaint/complaintEditor/detail/complaint-editor-detail.html",
            controller: "complaintEditorDetailComponentController",
            bindings: {
                viewdata: "=?",
                emitFnComplaint: "&?"
            }
        })
});
