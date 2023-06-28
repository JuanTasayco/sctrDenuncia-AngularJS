(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintNewComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintNewComponentController", [
      "$scope",
      "accessSupplier",
      "proxyClient",
      "proxyComplaint",
      "proxyLookupSctr",
      "proxyClinicCoverage",
      "proxyInsurancePolicy",
      "$q",
      "$uibModal",
      "mModalAlert",
      function (
        $scope,
        accessSupplier,
        proxyClient,
        proxyComplaint,
        proxyLookupSctr,
        proxyClinicCoverage,
        proxyInsurancePolicy,
        $q,
        $uibModal,
        mModalAlert
      ) {
        var vm = this;
        var profile = accessSupplier.profile();

        vm.showNewAfiliado = false;
        vm.isNewAfiliado = false;

        vm.genero = "";

        vm.showModalNewAfiliate = showModalNewAfiliate;
        vm.showModaldenuncias = showModaldenuncias;
        vm.treatmentComplaint = treatmentComplaint;
        vm.seekCompany = seekCompany;
        vm.seekClinic = seekClinic;
        vm.seekAsured = seekAsured;
        vm.changeSearchPoliza = changeSearchPoliza;
        vm.$onInit = onInit;
        vm.selectPoliza = selectPoliza;
        vm.searchBlist = searchBlist;
        vm.searchVip = searchVip;
        vm.changeSearchBeneficio = changeSearchBeneficio; 

        function onInit() {
          vm.dateFormat = "dd/MM/yyyy";
          vm.currentDate = new Date();

          $scope.newAfiliate = null;
          $scope.tratamientos = [];

          vm.data = { asured: "" };

          $scope.$watch("$parent.clear", function (newValue) {
            if (newValue == true && vm.data) {
              vm.data.asured = "";
              vm.data.fecAccidente = "";
              vm.data.client = "";
              vm.data.clinic = "";
              vm.data.nombreRepresentante = "";
              vm.data.cargoRepresentante = "";
              vm.nroSiniestro = "";
              vm.data.denunciaProvisional = "";
              vm.data.rbOcurrioTrabajo = "";
              vm.data.lugarOcurrencia = "";
              vm.data.formaAccidente = null;
              vm.data.parteCuerpo = null;
              vm.data.naturalezaLesion = null;
              vm.data.agenteCausante = null;
              vm.data.consecuencia = null;
              vm.data.descripcion = "";
              vm.observed = null;
              vm.vip = null;
              vm.showNewAfiliado = false;
              vm.isNewAfiliado = false;
              vm.polizas = null;
              vm.currentPoliza = null;
              vm.genero = "";
            }
          });

          proxyLookupSctr
            .GetLookups(
              ["EPSTV87", "EPSTV88", "EPSTV89", "EPSTV91", "CONSEC"],
              true
            )
            .then(function (res) {
              if (res) {
                vm.formaAccidentes = res.epstV87;
                vm.naturalezaLesiones = res.epstV89;
                vm.partesCuerpoLesionado = res.epstV88;
                vm.agentesCausantes = res.epstV91;
                vm.consecuencias = res.consec;
              }
            });

          if (profile.userSubType === "2") {
            vm.clientDefault = true;
            var taxid = profile.rucNumber || profile.documentNumber;
            proxyClient
              .GetClientByDocument(taxid, null, true)
              .then(function (request) {
                var item = request && request.length > 0 ? request[0] : undefined;
                if (item) {
                  vm.data = vm.data || {};
                  vm.data.client = vm.data.client || {};
                  (vm.data.client.documentNumber = taxid), (vm.data.client.fullname = item.fullname);
                  vm.data.client.telefonoCliente = item.telefonoCliente;
                  vm.data.client.correoCliente = item.correoCliente;
                  vm.data.client.fulltext =item.documentNumber + " - " + item.fullname;
                }
              });
          }
        }

        function showModalNewAfiliate() {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: "lg",
            template:
              "<modalnuevoafiliado data='modalnuevoafiliado' close='close()'> </modalnuevoafiliado>",
            controller: [
              "$uibModalInstance",
              function ($uibModalInstance) {
                $scope.close = function () {
                  if ($scope.newAfiliate && $scope.newAfiliate != null) {
                    var fullname = $scope.newAfiliate.nombres.trim() + " " + $scope.newAfiliate.ape_paterno.trim() + " " + $scope.newAfiliate.ape_materno.trim();
                    var fechaNacimiento = $scope.newAfiliate.fec_nacimiento.split("/");
                    var fechaNacimientoDate = new Date(fechaNacimiento[2], fechaNacimiento[1] - 1, fechaNacimiento[0]);
                    
                    vm.genero = $scope.newAfiliate.cod_sexo == "M" ? "Masculino" : $scope.newAfiliate.cod_sexo == "F" ? "Femenino" : "";

                    vm.data.asured = vm.data.asured || {};
                    vm.data.asured.telefono = $scope.newAfiliate.telefono;
                    vm.data.asured.genero = $scope.newAfiliate.cod_sexo;
                    vm.data.asured.fechaNacimiento = fechaNacimientoDate;
                    vm.data.asured.correo = $scope.newAfiliate.email;
                    vm.data.asured.documentNumber = $scope.newAfiliate.num_documento;
                    vm.data.asured.nombres = $scope.newAfiliate.nombres.trim();
                    vm.data.asured.ape_paterno = $scope.newAfiliate.ape_paterno.trim();
                    vm.data.asured.ape_materno = $scope.newAfiliate.ape_materno.trim();
                    vm.data.asured.fullname = fullname;
                    vm.data.asured.fulltext = $scope.newAfiliate.num_documento + " - " + fullname;
                    
                    vm.observed = null;
                    vm.vip = null;
                    
                    vm.showNewAfiliado = false;
                    vm.isNewAfiliado = true;
                  }
                  $uibModalInstance.close();
                };
              },
            ],
          });
        }

        function getCodeFromSelectObject(model, prop, propCode) {
          return model && model[prop] && model[prop][propCode]
            ? model[prop][propCode]
            : null;
        }

        function isProvisional() {
          return vm.isNewAfiliado;
        }

        function getComplaint() {
          if (!$scope.frmComplaintDetail.$valid) {
            $scope.frmComplaintDetail.markAsPristine();
            return {
              isvalid: false,
              message:
                "Verifique que los datos de la denuncia estén correctos.",
            };
          }
          if(vm.polizas !== undefined && vm.polizas !== null && vm.polizas.length !== 0){
            if (!vm.currentPoliza) {
              $scope.frmComplaintDetail.markAsPristine();
              return {
                isvalid: false,
                message:
                  "Verifique que los datos de la denuncia estén correctos.",
              };
            }
          }
          var data = vm.data;
          var dateAcc = vm.data.fecAccidente;
          var timeAcc = vm.data.fecAccidente;
          var fecAcc = new Date(
            dateAcc.getFullYear(),
            dateAcc.getMonth(),
            dateAcc.getDate(),
            timeAcc.getHours(),
            timeAcc.getMinutes(),
            timeAcc.getSeconds()
          );

          var req = {
            FechaIngresoEmpresa: data.asured.fechaAfiliacion
              ? data.asured.fechaAfiliacion
              : new Date(),
            FechaAccidente: fecAcc,
            LugarOccurrencia: data.lugarOcurrencia,
            RealizaTrabajoHabitual: "S",
            CodigoFormaAccidente: getCodeFromSelectObject(
              data,
              "formaAccidente",
              "codigo"
            ),
            CodigoParteCuerpo: getCodeFromSelectObject(
              data,
              "parteCuerpo",
              "codigo"
            ),
            CodigoNaturalezaLesion: getCodeFromSelectObject(
              data,
              "naturalezaLesion",
              "codigo"
            ),
            CodigoAgenteCausante: getCodeFromSelectObject(
              data,
              "agenteCausante",
              "codigo"
            ),
            DetalleAccidente: data.descripcion,
            UsuarioRegistro: profile.loginUserName,
            DocumentoIdentidad: data.asured.documentNumber,
            DenunciaProvisional: data.marcaProvisional,
            ClinicaCodProveedor: data.clinic.cprvdr , 
            ClinicaNumProveedor: data.clinic.nsprvdr , 
            ClinicaNombre:  data.clinic.rsaynmbrs ,
            BeneficioCod: data.benefit.cbnfco ,
            BeneficioNombre: data.benefit.deS_CBNFCO,
            OccurrioDentroTrabajo: data.rbOcurrioTrabajo,
            IndicadorPolizaSalud: vm.currentPoliza ? "S" : null,
            NumeroPolizaSalud: vm.currentPoliza ? vm.currentPoliza.nroPoliza : null,
            IndicadorSiniestroSalud: "S",
            NombreRepresentante: data.nombreRepresentante,
            CargoRepresentante: data.cargoRepresentante,
            CodigoConsecuencia: getCodeFromSelectObject(
              data,
              "consecuencia",
              "codigo"
            ),
            TelefonoEmpresa: data.client.telefonoCliente,
            CorreoEmpresa: data.client.correoCliente,
            DocumentoIdentidadEmpresa: data.client.documentNumber,
            TelefonoAfiliado: data.asured.telefono,
            CorreoAfiliado: data.asured.correo,
            RolUsuario: profile.userSubType,
          };
          return { isvalid: true, request: req };
        }

        function getProvisionalComplaint() {
          if (!$scope.frmComplaintDetail.$valid) {
            $scope.frmComplaintDetail.markAsPristine();
            return {
              isvalid: false,
              message:
                "Verifique que los datos de la denuncia estén correctos.",
            };
          }
          if(!vm.currentPoliza){
              $scope.frmComplaintDetail.markAsPristine();
              return {
                isvalid: false,
                message:
                  "Verifique que los datos de la denuncia estén correctos.",
              };
            }
          var data = vm.data;
          var dateAcc = vm.data.fecAccidente;
          var timeAcc = vm.data.fecAccidente;
          var fecAcc = new Date(
            dateAcc.getFullYear(),
            dateAcc.getMonth(),
            dateAcc.getDate(),
            timeAcc.getHours(),
            timeAcc.getMinutes(),
            timeAcc.getSeconds()
          );

          var req = {
            Asegurado: {
              Genero: vm.data.asured.genero,
              FechaNacimiento: vm.data.asured.fechaNacimiento,
              FechaAfiliacion: new Date(),
              Telefono: vm.data.asured.telefono,
              Correo: vm.data.asured.correo,
              ApellidoPaterno: vm.data.asured.ape_paterno,
              ApellidoMaterno: vm.data.asured.ape_materno,
              Nombres: vm.data.asured.nombres,
            },
            FechaIngresoEmpresa: new Date(),
            FechaAccidente: fecAcc,
            LugarOccurrencia: data.lugarOcurrencia,
            RealizaTrabajoHabitual: "S",
            CodigoFormaAccidente: getCodeFromSelectObject(
              data,
              "formaAccidente",
              "codigo"
            ),
            CodigoParteCuerpo: getCodeFromSelectObject(
              data,
              "parteCuerpo",
              "codigo"
            ),
            CodigoNaturalezaLesion: getCodeFromSelectObject(
              data,
              "naturalezaLesion",
              "codigo"
            ),
            CodigoAgenteCausante: getCodeFromSelectObject(
              data,
              "agenteCausante",
              "codigo"
            ),
            DetalleAccidente: data.descripcion,
            UsuarioRegistro: profile.loginUserName,
            DocumentoIdentidad: data.asured.documentNumber,
            OccurrioDentroTrabajo: data.rbOcurrioTrabajo,
            IndicadorPolizaSalud: vm.currentPoliza ? "S" : null,
            NumeroPolizaSalud: vm.currentPoliza ? vm.currentPoliza.nroPoliza : null,
            IndicadorSiniestroSalud: "S",
            NombreRepresentante: data.nombreRepresentante,
            CargoRepresentante: data.cargoRepresentante,
            CodigoConsecuencia: getCodeFromSelectObject(
              data,
              "consecuencia",
              "codigo"
            ),
            TelefonoEmpresa: data.client.telefonoCliente,
            CorreoEmpresa: data.client.correoCliente,
            DocumentoIdentidadEmpresa: data.client.documentNumber,
            TelefonoAfiliado: data.asured.telefono,
            CorreoAfiliado: data.asured.correo,
            RolUsuario: profile.userSubType,
            SptoPoliza: vm.currentPoliza ? vm.currentPoliza.sptoPoliza : null,
            ApliPoliza: vm.currentPoliza ? vm.currentPoliza.apliPoliza : null,
            SptoApliPoliza: vm.currentPoliza ? vm.currentPoliza.sptoApliPoliza : null
          };
          return { isvalid: true, request: req };
        }

        function seekCompany(wildcar) {
          var deferred = $q.defer();
          var params = { Wildcard : wildcar };
          proxyClient.SeekCompanyWithSpecialChar(params).then(
            function (r) {
              if(r && r.length > 0) {
              angular.forEach(r, function (a, b) {
                a.fulltext = a.documentNumber + " - " + a.fullname;
              });
              } else {
                mModalAlert.showError(
                  "No se encontraron clientes.",
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
        function seekClinic(wildcar) {
          var deferred = $q.defer();
          var params = { Wildcard : wildcar };
          proxyClinicCoverage.SeekClinic(params).then(
            function (r) {
              listClinic = r;
              if(r && r.length > 0) {
              angular.forEach(r, function (a, b) {
                a.fulltext = a.ndidntdd + " - " + a.rsaynmbrs + " - " + a.rsabrvda + " - " + a.dscrsl;
              });
              } else {
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

        function searchBlist() {
          vm.isNewAfiliado = false;
          if(vm.data.asured && vm.data.asured != null) {
            vm.genero = vm.data.asured.genero == "M" ? "Masculino" : vm.data.asured.genero == "F" ? "Femenino" : "";
            proxyClient
              .GetObservado(vm.data.asured.documentNumber, true)
              .then(function (response) {
                vm.observed = response;
              });
          }
        }

        function searchVip() {
          if(vm.data.client && vm.data.client != null) {
            proxyClient
              .GetImportant(vm.data.client.documentNumber, true)
              .then(function (response) {
                vm.vip = response;
              });
          }
        }

        function treatmentComplaint() {
          if (!vm.isNewAfiliado) {
            if(vm.data && vm.data.asured && vm.data.asured.documentNumber && vm.data.fecAccidente){
              var AseguradoDni = vm.data.asured.documentNumber;
              var StartDate = vm.data.fecAccidente.toISOString();

              proxyComplaint
                .GetCompaintClient({
                  AseguradoDni: AseguradoDni,
                  StartDate: StartDate,
                }, true)
                .then(function (response) {
                  if (response.items != "") {
                    showModaldenuncias();
                  } else {
                    mModalAlert.showError(
                      "No se encontraron denuncias en tratamiento para este asegurado.",
                      "Denuncia"
                    );
                  }
                });
            }
          }
        }

        function showModaldenuncias() {
          $uibModal.open({
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            scope: $scope,
            size: "lg",
            template:
              "<modaldenuncias params='modaldenuncias' afiliado='afiliado' role='role' close='close()'> </modaldenuncias>",
            controller: [
              "$scope",
              "$uibModalInstance",
              function ($scope, $uibModalInstance) {
                $scope.role = profile.userSubType;
                $scope.afiliado = vm.data.asured;
                $scope.modaldenuncias = {
                  AseguradoDni: vm.data.asured.documentNumber,
                  StartDate: vm.data.fecAccidente.toISOString(),
                };
                $scope.close = function () {
                  $uibModalInstance.close();
                };
              },
            ],
          });
        }

        function seekAsured(wildcar) {
          var deferred = $q.defer();
          proxyClient.SeekClient(wildcar).then(
            function (response) {
              if (response != "") {
                ng.forEach(response, function (a) {
                  a.fechaNacimiento = a.fechaNacimiento
                    ? new Date(a.fechaNacimiento)
                    : a.fechaNacimiento;
                  a.fechaAfiliacion = a.fechaAfiliacion
                    ? new Date(a.fechaAfiliacion)
                    : a.fechaAfiliacion;
                  a.fulltext = a.documentNumber + " - " + a.fullname;
                });
                $scope.newAfiliate = null;
                vm.showNewAfiliado = false;
              } else {
                mModalAlert.showError(
                  "No se encontraron asegurados.",
                  "Denuncia"
                );
                $scope.newAfiliate = null;
                vm.showNewAfiliado = profile.userSubType != "2";
              }
              deferred.resolve(response);
            },
            function (r) {
              deferred.reject(r);
            }
          );
          return deferred.promise;
        }

        function changeSearchPoliza() {
          var data = vm.data;

          if (data && data.fecAccidente && (data.client || (data.asured && !vm.isNewAfiliado))) {
            proxyInsurancePolicy
              .GetByDocument(
                data.asured && !vm.isNewAfiliado
                  ? data.asured.documentNumber
                  : null,
                data.client ? data.client.documentNumber : null,
                data.fecAccidente.toISOString()
              )
              .then(function (response) {
                vm.polizas = response;
              });
          }
        }

        function changeSearchBeneficio(){ 
          vm.beneficio = null;  
          vm.data.benefit = null;
          var params = { cprvdr : vm.data.clinic.cprvdr , nsprvdr : vm.data.clinic.nsprvdr};
          proxyComplaint.SeekBenefit(params).then(
            function (r) {
           vm.beneficio = r;           
            }
          );
        }


        function selectPoliza(_poliza) {
          if (vm.currentPoliza) vm.currentPoliza.checked = false;
          vm.currentPoliza = _poliza;
          if (_poliza.checked) {
            proxyClient
              .GetClientByDocument(null, _poliza.nroPoliza, true)
              .then(function (request) {
                var item =
                  request && request.length > 0 ? request[0] : undefined;
                if (item) {
                  vm.data = vm.data || {};
                  vm.data.client = vm.data.client || {};
                  vm.data.client.documentNumber = item.documentNumber;
                  vm.data.client.fullname = item.fullname;
                  vm.data.client.telefonoCliente = item.telefonoCliente;
                  vm.data.client.correoCliente = item.correoCliente;
                  vm.data.client.fulltext =
                    item.documentNumber + " - " + item.fullname;
                  searchVip();
                }
              });
          } else {
            vm.currentPoliza = null;
          }
        }

        vm.emitMethods({
          $funcs: {
            getComplaint: getComplaint,
            getProvisionalComplaint: getProvisionalComplaint,
            isProvisional: isProvisional,
          },
        });
      },
    ])
    .component("complaintNew", {
      templateUrl:
        "/sctrDenuncia/app/complaint/complaintNew/input/complaint-input.html",
      controller: "complaintNewComponentController",
      bindings: {
        emitMethods: "&",
        nroSiniestro: "=?",
        vip: "=?",
        observed: "=?",
        denunciaProvisional: "=?",
      },
    });
});
