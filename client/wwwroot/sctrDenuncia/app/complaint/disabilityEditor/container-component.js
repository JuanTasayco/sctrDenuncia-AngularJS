(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintDisabilityEditorContainerComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintDisabilityEditorContainerComponentController", ["mpSpin", "$timeout", "mModalAlert", "$state", "complaintDisabilityItemService", "$uibModal", "$document", "proxyDisabilityRequest", "accessSupplier", "oimPrincipal",
      function (mpSpin, $timeout, mModalAlert, $state, complaintDisabilityItemService, $uibModal, $document, proxyDisabilityRequest, accessSupplier, oimPrincipal) {
        var vm = this;
        var profile = accessSupplier.profile();

        vm.dataView = complaintDisabilityItemService.getComplaintSctrState();

        vm.activeTab = 0;

        var currentRole = oimPrincipal.get_role().toUpperCase();

        vm.role = 0;

        if(currentRole === "EJECSCTR") vm.role = 1;
        if(currentRole === "COORDMED") vm.role = 2;
        if(currentRole === "AUDMEDI") vm.role = 3;

        function onInit() {          
          vm.dateFormat = "dd/MM/yyyy";
          
          proxyDisabilityRequest.parametros(99, null, null, 12, 20, 1, false).then(function (resp) {
            vm.finalizarDenuncia = resp.data;
          });
        }

        // Abrir modal con datos de entrada
        function open(url, config, size) {
          var parentElem = ng.element($document[0].querySelector(".modal-complaint"));

          return $uibModal.open({
            animation: true,
            templateUrl: url,
            ariaLabelledBy: "modal-title",
            ariaDescribedBy: "modal-body",
            size: size,
            controller: "complaintDisabilityActionStateController",
            controllerAs: "$ctrl",
            appendTo: parentElem,
            resolve: {
              data: function () {
                return {
                  dataView: vm.dataView,
                  lookups: {
                    finalizarDenuncia: vm.finalizarDenuncia
                  },
                  config: config
                };
              },
            },
          });
        }

        // Rehabilitar Solicitud
        function rehabAttention() {
          var body = { 
            opt: 2, 
            codigoUsuario: profile.loginUserName,
            numeroDocumento: vm.dataView.numeroDocumento,
            tipoDocumento: vm.dataView.tipoDocumento
          };

          proxyDisabilityRequest.setSolicitudInvalidez(body, vm.dataView.solicitudId, true).then(function (response){
            if(response.codigoRpta) {
              mModalAlert.showSuccess(
                "Se rehabilitó la solicitud con éxito",
                "Solicitud Rehabilitada"
              );
              $state.go($state.current, {}, { reload: true });
            } else {
              mModalAlert.showError(
                "Ha sucedido un error al momento de intentar rehabilitar la solicitud",
                "Solicitud Rehabilitada"
              );
            }
          });
        }

        // Mostrar Modal de Finalizar Dictamen
        function finishComplaint() {
          open(
            "EndComplaint.html",
            {
              finalizar: "finalizarDenuncia",
              action: "finishComplaint",
              title: "Finalizar solicitud"
            },
            "sm"
          ).result.then(
            changeStateAndReload("Solicitud Finalizada"),
            function () {}
          );
        }

        // Mostrar modal para cambio de estado
        function changeStateAndReload(title) {
          return function (r) {
            if (r.success)
              mModalAlert.showSuccess(r.message, title).then(
                function () {
                  $timeout(function () {
                    mpSpin.start();
                    $state.go($state.current, {}, { reload: true });
                  }, 300);
                },
                function () {}
              );
          };
        }

        // Setear funciones del componente citas medicas
        function recepFnMedicalAppointment(ev) {
          if(ev.action == 0) { // Cancelar
            vm.activeTab = 0;
          }
        }

        // Setear funciones del componente auditorias medicas
        function recepFnMedicalAudit(ev) {
          if(ev.action == 0) { // Cancelar
            vm.activeTab = 1;
          }
        }
        
        vm.$onInit = onInit;
        vm.rehabAttention = rehabAttention;
        vm.finishComplaint = finishComplaint;
        vm.recepFnMedicalAppointment = recepFnMedicalAppointment;
        vm.recepFnMedicalAudit = recepFnMedicalAudit;
      }
    ])
    .component("complaintDisabilityEditorContainer", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityEditor/container-component.html",
      controller: "complaintDisabilityEditorContainerComponentController",
      bindings: {},
    })
    .factory("complaintDisabilityItemService", ["proxyDisabilityRequest", "$q", "$filter", "oimProgress", "$interval",
      function (proxyDisabilityRequest, $q, $filter, oimProgress, $interval) {
        function parseDate(sDate) {
          return sDate ? new Date(sDate) : undefined;
        }

        var complaintSctr = null;

        // Obtener detalle de solicitud
        function resolveItem(solicitudId) {
          oimProgress.start();
          var i = 50;
          var stop = $interval(function () {
            oimProgress.inch(i);
            i = i * 2;
          }, 200);

          var deferred = $q.defer();

          proxyDisabilityRequest.getSolicitudInvalidez(solicitudId, false).then(
            function (response) {
              var req = response.data;
              req.nombreCompleto = req.numeroDocumento + " - " + req.nombres + " " + req.apellidoPaterno + " " + req.apellidoMaterno;
              req.genero = req.sexo === 'M' ? 'MASCULINO' : req.sexo === 'F' ? 'FEMENINO' : '';
              req.fecNacimiento = parseDate(req.fechaNacimiento);
              req.fecAccidente = parseDate(req.fechaSiniestro);

              var dataClinica = req.nombreClinica.split('-');
              
              req.clinic = {
                cprvdr: req.codigoProveedor,
                dscrsl: dataClinica.length > 1 ? dataClinica[1].trim() : '',
                nsprvdr: req.numeroSucursal,
                rsaynmbrs: dataClinica[0].trim(),
                fulltext: req.nombreClinica
              };

              if(req.fechaFin && req.fechaInicio){
                req.vigencia =
                  $filter("date")(parseDate(req.fechaInicio), "dd/MM/yyyy") +
                  " al " +
                  $filter("date")(parseDate(req.fechaFin), "dd/MM/yyyy");
              }

              if(req.tipoPoliza) {
                req.tipoPoliza = req.tipoPoliza.trim();
              }

              req.nombresCliente = req.contratante.ruc + " - " + req.contratante.razonSocial;
              req.telefonoCliente = req.contratante.telefono;
              req.correoCliente = req.contratante.email;

              req.sendComeps =  req.indEnvioCOMEPS;
              req.sendDate = parseDate(req.fechaEnvioCOMEPS);
              req.receiveDate = parseDate(req.fechaRespuestaCOMEPS);

              req.nroPlan = req.numeroPlan;
              req.affiliateCode = req.codAsegurado;
              req.codigoEstado = req.codigoEstado;

              req.estimateMoneyType = req.monedaAhorroEstimado;
              req.estimatedAmount = req.importeAhorroEstimado;

              complaintSctr = req;
              deferred.resolve(complaintSctr);
              oimProgress.end();
              $interval.cancel(stop);
            },
            function (e) {
              deferred.reject(e);
            }
          );

          return deferred.promise;
        }

        // Setear dato de item
        function getComplaintSctrState() {
          var item = complaintSctr;
          complaintSctr = null;
          return item;
        }

        return {
          resolveItem: resolveItem,
          getComplaintSctrState: getComplaintSctrState
        };
      },
    ])
    .controller("complaintDisabilityActionStateController", ["mModalAlert", "$scope", "$uibModalInstance", "data", "proxyDisabilityRequest", "accessSupplier",
      function (mModalAlert, $scope, $uibModalInstance, data, proxyDisabilityRequest, accessSupplier) {
        var vm = this;
        var profile = accessSupplier.profile();
        vm.lookups = data.lookups;
        vm.config = data.config;
        vm.attention = data.attention;
        vm.dataView = data.dataView;

        var action = {
          finishComplaint: function () {
            var body = { 
              opt: 3 ,
              nombres: vm.dataView.nombres,
              apellidoPaterno: vm.dataView.apellidoPaterno,
              apellidoMaterno: vm.dataView.apellidoMaterno,
              fechaSiniestro: vm.dataView.fechaSiniestro,
              numeroDocumento: vm.dataView.numeroDocumento,
              tipoDocumento: vm.dataView.tipoDocumento,
              tipoDictamen: vm.dictamen.codigo,
              codigoUsuario: profile.loginUserName,
              comentario: vm.descripcion ? vm.descripcion.toUpperCase() : ''
            };

            proxyDisabilityRequest.setSolicitudInvalidez(body, vm.dataView.solicitudId, true).then(function (response){
              if(response.codigoRpta) {
                var comment = {
                  opt: 1,
                  comentario: vm.descripcion,
                  codigoUsuario: profile.loginUserName,
                  codigoUsuarioAct: profile.loginUserName,
                  numeroItem: 0
                };
      
                proxyDisabilityRequest.newComentario(comment, vm.dataView.solicitudId, false);

                $uibModalInstance.close({
                  message: "Se finalizó la solicitud con éxito",
                  success: true,
                });
              } else {
                mModalAlert.showError(
                  "Ha sucedido un error al momento de intentar finalizar la solicitud",
                  "Finalizar Solicitud"
                );
              }
            });
          }
        };

        // Ejecutar accion
        function execAction() {
          if (!$scope.formState || $scope.formState.$valid) {
            action[data.config.action]();
          } else {
            $scope.formState.markAsPristine();
          }
        }

        // Cancelar y cerrar modal
        function cancel() {
          $uibModalInstance.dismiss("cancel");
        }

        vm.ok = execAction;
        vm.cancel = cancel;
      },
    ]);
});
