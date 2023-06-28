(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintDisabilityNewContainerComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintDisabilityNewContainerComponentController", ["proxyDisabilityRequest", "mModalAlert", "$scope", "$state", "accessSupplier", "$timeout", "$q",
      function (proxyDisabilityRequest, mModalAlert, $scope, $state, accessSupplier, $timeout, $q) {
        var vm = this;
        var funcsCmp = {};

        function onInit() {
          $scope.clear = false;
        }

        // Funcion para limpiar formulario
        function cleanForm() {
          $scope.clear = true;
          $timeout(function () {
            $scope.clear = false;
          }, 250);
        }

        // Carga de funciones de componentes
        function receptMethods(funcs) {
          funcsCmp = funcs;
        }

        // Funcion para cancelar registro de solicitud
        function cancel() {
          accessSupplier.GetProfile().then(function (data) {
            if (data.userSubType === "2") {
              $state.reload();
            } else {
              $state.go("complaint.disabilitySearch");
            }
          });
        }

        // Funcion para guardar solicitud
        function save() {
          var r = funcsCmp.getComplaint();

          if (!r.isvalid) {
            mModalAlert.showError(r.message, "Solicitud");
            return;
          }
          
          proxyDisabilityRequest.newSolicitudInvalidez(r.request, "Guardando solicitud ...").then(
            function (response) {
              if(response.codigoRpta) {
                vm.nroSolicitud = response.data;
                
                if (vm.nroSolicitud != null) {
                  var promises = [];
                  promises.concat(saveFiles(vm.nroSolicitud, r.files, r.request.numeroPoliza), saveComments(vm.nroSolicitud, r.comments));
                  $q.all(promises).then(function (resp) {
                    mModalAlert.showSuccess("Tu solicitud N° " + vm.nroSolicitud + " ha sido registrada satisfactoriamente.", "Solicitud").then(
                      function(){ 
                        $state.go('complaint.disabilityItem', {nrosolicitud: vm.nroSolicitud}, {reload: true, inherit: false});
                      }
                    );
                  }, function (error) {
                    mModalAlert.showError("Ha occurido un error al momento de guardar la solicitud, por favor comuniquese con el administrador.", "Solicitud");
                  });
                } else {
                  mModalAlert.showError("Ha occurido un error al momento de guardar la solicitud, por favor comuniquese con el administrador.", "Solicitud");
                }
              } else {
                mModalAlert.showError("Ha occurido un error al momento de guardar la solicitud.", "Solicitud");
              }
            },
            function (response) {
              mModalAlert.showError("Ha occurido un error al momento de guardar la solicitud.", "Solicitud");
            }
          );
        }

        function saveFiles(nroSolicitud, documents, numeroPoliza) {
          var promises = [];

          angular.forEach(documents, function (a, b) {
            var document = {
              opt: 1,
              numeroPoliza: numeroPoliza,
              nombreArchivo: a.nombreDocumento,
              base64: a.documento,
              tipoDocumento: a.tipoDocumento,
              codigoUsuario: a.user,
              codigoUsuarioAct: a.user,
              numeroItem: 0
            };

            promises.push(proxyDisabilityRequest.newDocumento(document, nroSolicitud, false));
          });

          return promises;
        }

        function saveComments(nroSolicitud, comments) {
          var promises = [];

          angular.forEach(comments, function (a, b) {
            var comment = {
              opt: 1,
              comentario: a.description.toUpperCase(),
              codigoUsuario: a.user,
              codigoUsuarioAct: a.user,
              numeroItem: 0
            };

            promises.push(proxyDisabilityRequest.newComentario(comment, nroSolicitud, false));
          });

          return promises;
        }

        vm.$onInit = onInit;
        vm.receptMethods = receptMethods;
        vm.cancel = cancel;
        vm.save = save;
        vm.cleanForm = cleanForm;
      },
    ])
    .component("complaintDisabilityNewContainer", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityNew/container.component.html",
      controller: "complaintDisabilityNewContainerComponentController"
    });
});
