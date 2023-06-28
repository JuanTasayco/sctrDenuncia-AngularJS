(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintEditorContainerComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintEditorContainerComponentController", [
      "oimProxySctrDenuncia",
      "mpSpin",
      "$timeout",
      "proxyComplaint",
      "mModalAlert",
      "$state",
      "complaintItemService",
      "$stateParams",
      "$uibModal",
      "$document",
      "$http",
      "proxyLookupSctr",
      "$rootScope",
      "$scope",
      function (
        oimProxySctrDenuncia,
        mpSpin,
        $timeout,
        proxyComplaint,
        mModalAlert,
        $state,
        complaintItemService,
        $stateParams,
        $uibModal,
        $document,
        $http,
        proxyLookupSctr,
        $rootScope,
        $scope
      ) {
        $rootScope.$on('nroPolizaSalud', function (event, value) {
         $scope.nroPolizaSalud = value;
      });
        var vm = this;
        var detailCmp = {};
        vm.dataView = complaintItemService.getComplaintSctrState();
        vm.periodo = $stateParams.periodo;
        vm.activeTab = 0;
        vm.hstep = 1;
        vm.mstep = 1;
        vm.ismeridian = true;

        vm.$onInit = onInit;
        vm.download = download;
        vm.recepFnComplaint = recepFnComplaint;
        vm.rejectDenuncia = rejectDenuncia;
        vm.acceptDenuncia = acceptDenuncia;
        vm.rejectAttention = rejectAttention;
        vm.authorizeAttention = authorizeAttention;
        vm.finishComplaint = finishComplaint;
        vm.showRehab = showRehab;
        vm.showFinish = showFinish;
        vm.showReject = showReject;
        vm.showApprove = showApprove;
        vm.showStateAttention = showStateAttention;
        vm.showStateAttention2 = showStateAttention2;
        vm.rehabAttention = rehabAttention;
        vm.getTrackItemClass = getTrackItemClass;

        function onInit() {
          vm.dateFormat = "dd/MM/yyyy";
          proxyLookupSctr
            .GetLookups(
              [
                "RCHZO_DEN",
                "APROB_DEN",
                "RCHZO_ATEN",
                "APROB_ATEN",
                "EPSTV101",
                "FINALI_DEN",
              ],
              true
            )
            .then(function (res) {
              if (res) {
                vm.rechazosDenuncia = res.rchzO_DEN;
                vm.rechazoAtencion = res.rchzO_ATEN;
                vm.aprobacionesDenuncia = res.aproB_DEN;
                vm.aprobacionesAtencion = res.aproB_ATEN;
                vm.gradosDenuncia = res.epstV101;
                vm.finalizarDenuncia = res.finalI_DEN;
              }
            });

          proxyComplaint
            .GetTrack($stateParams.periodo, $stateParams.nrodenuncia)
            .then(function (response) {
              vm.track = response;
              var trackFilter = vm.track.filter(function (x) {
                return x.estado == vm.dataView.estado;
              });
              var trackImp = trackFilter[trackFilter.length - 1];

              vm.infoToolTip = "";

              if(!isRegister()){
                if(trackImp && trackImp.descMotivoEstado) {
                  vm.infoToolTip = vm.infoToolTip + " Motivo: " + trackImp.descMotivoEstado.toUpperCase();
                }
                
                if(trackImp && trackImp.textMotivoEstado) {
                  vm.infoToolTip = vm.infoToolTip + " Descripción: " + trackImp.textMotivoEstado.toUpperCase();
                }
              }
            });
        }

        function getTrackItemClass() {
          if (vm.track.length == 3) return "col-md-4";
          else if (vm.track.length == 1 || vm.track.length == 2)
            return "col-md-6";
          else return "custom-md";
        }

        function open(url, config, size) {
          var parentElem = ng.element(
            $document[0].querySelector(".modal-complaint")
          );
          return $uibModal.open({
            animation: true,
            templateUrl: url,
            ariaLabelledBy: "modal-title",
            ariaDescribedBy: "modal-body",
            size: size,
            controller: "complaintActionStateController",
            controllerAs: "$ctrl",
            appendTo: parentElem,
            resolve: {
              data: function () {
                return {
                  dataView: vm.dataView,

                  lookups: {
                    rechazosDenuncia: vm.rechazosDenuncia,
                    rechazoAtencion: vm.rechazoAtencion,
                    aprobacionesDenuncia: vm.aprobacionesDenuncia,
                    aprobacionesAtencion: vm.aprobacionesAtencion,
                    gradosDenuncia: vm.gradosDenuncia,
                    finalizarDenuncia: vm.finalizarDenuncia,
                  },

                  complaint: detailCmp.getComplaint(),
                  attention: _.find(vm.dataView.attentions, function (o) {
                    return o.estado == "P";
                  }),
                  config: config,
                  periodo: $stateParams.periodo,
                };
              },
            },
          });
        }

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

        function rejectDenuncia() {
          open(
            "rejectComplaint.html",
            {
              rechazos: "rechazosDenuncia",
              motivos: "rechazoAtencion",
              action: "rejectComplaint",
              title: "Rechazar Denuncia",
            },
            "sm"
          ).result.then(
            changeStateAndReload("Denuncia Rechazada"),
            function () {}
          );
        }

        function acceptDenuncia() {
          var req = detailCmp.getComplaint();
          if (!req.isValid) {
            mModalAlert.showError(
              "Verifique que los datos de la denuncia estén correctos.",
              "Denuncia"
            );
            return;
          }

          open(
            "aproveComplaint.html",
            {
              aprovaciones: "aprobacionesDenuncia",
              action: "aproveComplaint",
              title: "Aprobar Denuncia",
              showGradoDenuncia: true,
            },
            "sm"
          ).result.then(
            changeStateAndReload("Denuncia Aprobada"),
            function () {}
          );
        }

        function rejectAttention() {
          var req = detailCmp.getComplaint();
          if (!req.isValid) {
            mModalAlert.showError(
              "Verifique que los datos de la denuncia estén correctos.",
              "Denuncia"
            );
            return;
          }

          open(
            "rejectAttention.html",
            {
              rechazos: "rechazoAtencion",
              motivos: "rechazoAtencion",
              action: "rejectAttention",
              title: "Rechazar Atención",
            },
            "sm"
          ).result.then(
            changeStateAndReload("Atención Rechazada"),
            function () {}
          );
        }

        function authorizeAttention() {
          open(
            "authorizeAttention.html",
            {
              aprovaciones: "aprobacionesAtencion",
              action: "authorizeAttention",
              title: "Autorizar Atención",
              showGradoDenuncia: false,
            },
            "sm"
          ).result.then(
            changeStateAndReload("Atención Autorizada"),
            function () {}
          );
        }

        function finishComplaint() {
          open(
            "EndComplaint.html",
            {
              finalizar: "finalizarDenuncia",
              action: "finishComplaint",
              title: "Finalizar Denuncia",
              showGradoDenuncia: false,
            },
            "sm"
          ).result.then(
            changeStateAndReload("Denuncia Finalizada"),
            function () {}
          );
        }

        function rehabAttention() {
          open(
            "rehabComplaint.html",
            {
              action: "rehabDenuncia",
              title: "Rehabilitar Denuncia",
              showGradoDenuncia: false,
            },
            "md"
          ).result.then(
            changeStateAndReload("Denuncia Rehabilitada"),
            function () {}
          );
        }

        function recepFnComplaint(ev) {
          detailCmp.getComplaint = ev.getComplaint;
        }

        function download() {
          mpSpin.start()
          $http.get(
            oimProxySctrDenuncia.endpoint + 'api/complaint/download/' +  $stateParams.nrodenuncia + '/' + $stateParams.periodo + '/' + $stateParams.codasegurado,
            { transformRequest: angular.identity, responseType: 'blob' }
          )
          .success(function (data, status, headers) {
            var defaultFileName ='denuncia-' + '-' + $stateParams.periodo + '-' + $stateParams.nrodenuncia + '-'+ $stateParams.codasegurado;
            var type = headers('Content-Type');
            // var disposition = headers('Content-Disposition');
            // console.log(disposition);
            // if (disposition) {
            //   var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
            //   if (match[1]) defaultFileName = match[1];
            // }
            // defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
            var blob = new Blob([data], { type: type });
            saveAs(blob, defaultFileName);
            mpSpin.end();
          }, function(data, status) {
            mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Documento");
            mpSpin.end();
          });
        }

        // Denuncia tiene atenciones pendientes
        function havePendingAttetion() {
          var havePendingAttetion = _.find(vm.dataView.attentions, function (o) {
            return o.estado == "P";
          });

          return havePendingAttetion;
        }

        // Denuncia tiene estado Aprobado
        function isApprove() {
          return (vm.dataView.estado || "").trim() == "P";
        }
        // Denuncia tiene estado En proceso
        function isProcess() {
          return (vm.dataView.estado || "").trim() == "E";
        }
        // Denuncia tiene estado Registrado
        function isRegister() {
          return (vm.dataView.estado || "").trim() == "R";
        }

        // Denuncia tiene estado Rechazado
        function isReject() {
          return (vm.dataView.estado || "").trim() == "H";
        }

        // Mostrar boton Rehabilitar Denuncia
        function showRehab() {
          return (vm.dataView.estado || "").trim() == "F"; // Estado Finalizado
        }

        // Mostrar boton Finalizar Denuncia
        function showFinish() {
          return  ((isApprove()||isProcess() ) && !havePendingAttetion());
        }

        // Mostrar boton Rechazar Denuncia
        function showReject() {
          return  (!showRehab() && (isApprove()||isProcess() )) || isRegister();
        }

        // Mostrar boton Aprobar Denuncia
        function showApprove() {
          return (!showRehab() && isReject()) || isRegister();
        }

        // Mostrar boton Autorizar Atencion
        function showStateAttention() {
          var isApprove = (vm.dataView.estado || "").trim() == "P"; // Estado Aprobado
          var havePendingAttetion = _.find(vm.dataView.attentions, function (o) {
            return o.estado == "P";
          });

          return isApprove && havePendingAttetion;
        }

        // Mostrar boton Rechazar Atencion
        function showStateAttention2() {
          var isApprove = (vm.dataView.estado || "").trim() == "P"; // Estado Aprobado
          var havePendingAttetion = _.find(vm.dataView.attentions, function (o) {
            return o.estado == "P";
          });

          return isApprove && havePendingAttetion;
        }
        }
    ])
    .component("complaintEditorContainer", {
      templateUrl:
        "/sctrDenuncia/app/complaint/complaintEditor/container-component.html",
      controller: "complaintEditorContainerComponentController",
      bindings: {},
    })
    .factory("complaintItemService", [
      "proxyComplaint",
      "$q",
      "$filter",
      "oimProgress",
      "$interval",
      function (proxyComplaint, $q, $filter, oimProgress, $interval) {
        function parseDate(sDate) {
          return sDate ? new Date(sDate) : undefined;
        }

        var complaintSctr = null;

        function resolveItem(nroDenuncia, periodo, codAsegurado) {
          oimProgress.start();
          var i = 50;
          var stop = $interval(function () {
            oimProgress.inch(i);
            i = i * 2;
          }, 200);
          var deferred = $q.defer();
          proxyComplaint.Get(nroDenuncia, periodo, codAsegurado).then(
            function (req) {
              req.fecNacimiento = parseDate(req.fecNacimiento);
              req.fecIngreso = parseDate(req.fecIngreso);
              req.fecIniVigencia = parseDate(req.fecIniVigencia);
              req.fecFinVigencia = parseDate(req.fecFinVigencia);
              req.fecAccidente = parseDate(req.fecAccidente);
              req.eFecAccidente = req.fecAccidente;
              if(req.fecFinVigencia && req.fecIniVigencia){
              req.vigencia =
                $filter("date")(req.fecIniVigencia, "dd/MM/yyyy") +
                " al " +
                $filter("date")(req.fecFinVigencia, "dd/MM/yyyy");
              }
              if(req.tipPoliza) {
                req.tipPoliza = req.tipPoliza.trim();
              }
              req.formaAccidente = { codigo: req.formaAccidente };
              req.beneficio = {cbnfco: req.codBeneficio, deS_CBNFCO: req.descBeneficio};  
              req.clinica = {ndidntdd: req.docClinica, rsaynmbrs: req.descClinica, rsabrvda: req.nomComercial, cprvdr : req.codProveedor, nsprvdr:req.sucProveedor,fulltext: req.docClinica + ' - '+ req.descClinica  }; 
              req.parteCuerpo = { codigo: req.parteCuerpo };
              req.naturalezaLesion = { codigo: req.naturalezaLesion };
              req.agenteCausante = { codigo: req.agenteCausante };
              req.consecuencia = { codigo: req.consecuencia };
              req.alerts = _.filter(req.alerts, function (x) {
                return (x.mensajeAlerta || "").trim().toUpperCase() != "N";
              });
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

        function getComplaintSctrState() {
          var item = complaintSctr;
          complaintSctr = null;
          return item;
        }

        return {
          resolveItem: resolveItem,
          getComplaintSctrState: getComplaintSctrState,
        };
      },
    ])
    .controller("complaintActionStateController", [
      "mModalAlert",
      "$scope",
      "$uibModalInstance",
      "data",
      "proxyComplaint",
      function (mModalAlert, $scope, $uibModalInstance, data, proxyComplaint) {
        var vm = this;
        vm.lookups = data.lookups;
        vm.config = data.config;
        vm.attention = data.attention;
        vm.dataView = data.dataView;
        vm.showDateAcept = showDateAcept;
        vm.showDateReject = showDateReject;
        vm.showSI24 = showSI24;
        vm.showAttetionReason = showAttetionReason

        function showDateAcept() {
          return (vm.dataView.estado || "").trim() == "H";
        }

        function showDateReject() {
          return (vm.dataView.estado || "").trim() == "P";
        }

         // Mostrar campo SI24
         function showSI24() {
          var isRegister = (vm.dataView.estado || "").trim() == "R";
          var isReject = (vm.dataView.estado || "").trim() == "H";

          var havePendingAttetion = _.find(vm.dataView.attentions, function (o) {
            return o.estado == "P";
          });

          return isRegister || (isReject && havePendingAttetion);
        }

        // Mostrar campo Motivo Atencion
        function showAttetionReason() {
          var isRegister = (vm.dataView.estado || "").trim() == "R";
          var isApprove =  (vm.dataView.estado || "").trim() == "P";

          var havePendingAttetion = _.find(vm.dataView.attentions, function (o) {
            return o.estado == "P";
          });

          return isRegister || (isApprove && havePendingAttetion);
        }

        var action = {
          aproveComplaint: function () {
            var req = {
              aproveAttention: !!data.attention,
              nroDenuncia: data.dataView.nroDenuncia,
              periodoDenuncia: data.periodo,
              codigoGradoDenuncia: vm.gradoDenuncia && vm.gradoDenuncia.codigo ? vm.gradoDenuncia.codigo : null,
              authorizacionSys24: vm.authoSys24,
              codigoMotivo: vm.motivo && vm.motivo.codigo ? vm.motivo.codigo : null,
              descripcion: vm.descripcion ? vm.descripcion.toUpperCase() : null,
              complaint: data.complaint,
              nroPoliza:  $scope.nroPolizaSalud ?  $scope.nroPolizaSalud : '',
              tienePoliza: $scope.nroPolizaSalud ? 'S' : 'N',
              FechaCambioEstado: vm.FechaCambioEstado
            };
            var mensaje =  "Se aprobó la denuncia satisfactoriamente."; 
            if(data.complaint.CodBeneficio == "47"){
             mensaje =  "En caso de hospitalización, la aprobación es con carta de garantía";
             req.EnvioCorreo = true;
             req.CorreoRuc = data.dataView.clinica.ndidntdd;
             req.CorreoNombres = data.dataView.nombreCompleto;
            }
            proxyComplaint.AproveComplaint(req, "Aprobando denuncia ...").then(
              function () {
                $uibModalInstance.close({
                  message: mensaje,
                  success: true,
                });
              },
              function () {
                mModalAlert.showError(
                  "Ha sucedido un error al momento de intentar aprobar una denuncia",
                  "Aprobar Denuncia"
                );
              }
            );
          },
          rejectComplaint: function () {
            var req = {
              complaint: data.complaint,
              nroDenuncia: data.dataView.nroDenuncia,
              periodoDenuncia: data.periodo,
              nroPoliza:  $scope.nroPolizaSalud ?  $scope.nroPolizaSalud : '',
              tienePoliza: $scope.nroPolizaSalud ? 'S' : 'N',
              codigoMotivo: vm.motivoReject && vm.motivoReject.codigo ? vm.motivoReject.codigo : null,
              descripcion: vm.descripcionReject ? vm.descripcionReject.toUpperCase() : null,
              username: vm.username,
              codigoMotivoAtecion: vm.motivoRejectAtencion && vm.motivoRejectAtencion.codigo ? vm.motivoRejectAtencion.codigo : 0
            };
            proxyComplaint.RejectComplaint(req, "Rechazando denuncia ...").then(
              function () {
                $uibModalInstance.close({
                  message: "Se rechazó la denuncia satisfactoriamente",
                  success: true,
                });
              },
              function () {
                mModalAlert.showError(
                  "Ha sucedido un error al momento de intentar rechazar una denuncia",
                  "Rechazar Atención"
                );
              }
            );
          },
          authorizeAttention: function () {
            var req = {
              aproveAttention: !!data.attention,
              complaint: data.complaint,
              nroDenuncia: data.dataView.nroDenuncia,
              periodoDenuncia: data.periodo,
              codigoGradoDenuncia: vm.gradoDenuncia && vm.gradoDenuncia.codigo ? vm.gradoDenuncia.codigo : null,
              authorizacionSys24: vm.authoSys24,
              codigoMotivo: vm.motivo && vm.motivo.codigo ? vm.motivo.codigo : null,
              descripcion: vm.descripcion ? vm.descripcion.toUpperCase() : null
            };
            proxyComplaint.AproveAttention(req, "Autorizando atención ...").then(
              function () {
                $uibModalInstance.close({
                  message: "Se autorizó la atención satisfactoriamente",
                  success: true,
                });
              },
              function () {
                mModalAlert.showError(
                  "Ha sucedido un error al momento de intentar autorizar la atención",
                  "Autorizar Atención"
                );
              }
            );
          },
          rejectAttention: function () {
            var req = {
              nroDenuncia: data.dataView.nroDenuncia,
              periodoDenuncia: data.periodo,
              codigoMotivo: vm.motivoRejectAtencion && vm.motivoRejectAtencion.codigo ? vm.motivoRejectAtencion.codigo : null,
              descripcion: vm.descripcionReject ? vm.descripcionReject.toUpperCase() : null,
              atentions: data.dataView.attentions,
            };
            proxyComplaint.RejectAttention(req, "Rechazando atención ...").then(
              function () {
                $uibModalInstance.close({
                  message: "Se rechazó la atención satisfactoriamente",
                  success: true,
                });
              },
              function () {
                mModalAlert.showError(
                  "Ha sucedido un error al momento de intentar rechazar la atención",
                  "Rechazar Atención"
                );
              }
            );
          },
          finishComplaint: function () {
            var req = {
              nroDenuncia: data.dataView.nroDenuncia,
              periodoDenuncia: data.periodo,
              codigoMotivo: vm.motivoFin && vm.motivoFin.codigo ? vm.motivoFin.codigo : null,
              descripcion: vm.descripcionEnd ? vm.descripcionEnd.toUpperCase() : null,
              username: data.username,
              complaint: data.complaint,
            };
            proxyComplaint.EndComplaint(req, "Finalizando Denuncia...").then(
              function () {
                $uibModalInstance.close({
                  message: "Se finalizó la denuncia satisfactoriamente",
                  success: true,
                });
              },
              function () {
                mModalAlert.showError(
                  "Ha sucedido un error al momento de intentar finalizar la denuncia",
                  "Finalizar Denuncia"
                );
              }
            );
          },
          rehabDenuncia: function () {
            var req = {
              nroDenuncia: data.dataView.nroDenuncia,
              periodoDenuncia: data.periodo,
              descripcion: data.escripcion,
              username: data.username,
              complaint: data.complaint,
            };
            mensaje = "Se rehabilitó la denuncia satisfactoriamente";
            if(data.complaint.CodBeneficio == "47"){
              mensaje =  "En caso de hospitalización, la aprobación es con carta de garantía";
              req.EnvioCorreo = true;
              req.CorreoRuc = data.dataView.clinica.ndidntdd;
              req.CorreoNombres = data.dataView.nombreCompleto;
             }
            proxyComplaint
              .RehabilitateComplaint(req, "Rehabilitando Denuncia...")
              .then(
                function () {
                  $uibModalInstance.close({
                    message: mensaje,
                    success: true,
                  });
                },
                function () {
                  mModalAlert.showError(
                    "Ha sucedido un error al momento de intentar rehabilitar la denuncia",
                    "Rehabilitar Denuncia"
                  );
                }
              );
          },
        };

        function execAction() {
          if (!$scope.formState || $scope.formState.$valid) {
            action[data.config.action]();
          } else {
            $scope.formState.markAsPristine();
          }
        }

        function cancel() {
          $uibModalInstance.dismiss("cancel");
        }

        vm.ok = execAction;
        vm.cancel = cancel;
      },
    ]);
});
