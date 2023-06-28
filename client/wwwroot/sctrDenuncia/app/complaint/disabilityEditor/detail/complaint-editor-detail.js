(function ($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, "complaintDisabilityEditorDetailComponent", ['angular'], function(ng){
  ng.module('sctrDenuncia.app')
    .controller('complaintDisabilityEditorDetailComponentController', ['oimProxySctrDenuncia', 'proxyDisabilityRequest', '$state', 'accessSupplier', 'mModalAlert', "proxyClinicCoverage", "$q", "mModalConfirm", "mainServices", "mpSpin", "$http",
      function (oimProxySctrDenuncia, proxyDisabilityRequest, $state, accessSupplier, mModalAlert, proxyClinicCoverage, $q, mModalConfirm, mainServices, mpSpin, $http) {
        var vm = this;
        var profile = accessSupplier.profile();

        function onInit() {
          vm.showDetail = vm.viewdata.codigoEstado == '4' || vm.role != 1;

          vm.dateFormat = 'dd/MM/yyyy';

          vm.documents = [];
          vm.comments = [];
          vm.data = {};

          proxyDisabilityRequest.parametros(99, null, null, 21, 20, 1, false).then(function (resp) {
            vm.documentosSolicitados = resp.data;
          });

          proxyDisabilityRequest.parametros(99, null, null, 22, 20, 1, false).then(function (resp) {
            vm.tiposMonedas = resp.data;

            if(vm.viewdata.estimateMoneyType) {
              vm.viewdata.estimateMoneyType = _.find(vm.tiposMonedas, function(x){ return x.codigo == vm.viewdata.estimateMoneyType; })
            }
          });

          seekClinic(vm.viewdata.clinic.cprvdr, true);

          cleanPagerDocuments();
          cleanPagerComments();

          listDocuments();
          listComments();
        }

        // Inicializar paginador
        function cleanPagerDocuments() {
          vm.paginationDoc = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0,
          };
        }

        // Inicializar paginador
        function cleanPagerComments() {
          vm.paginationCom = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0,
          };
        }

        // Obtiene datos de clinica
        function seekClinic(wildcar, load) {
          var deferred = $q.defer();
          if (load) return deferred.resolve(vm.viewdata.clinic);

          var params = { Wildcard: wildcar };
          proxyClinicCoverage.SeekClinic(params).then(
            function (r) {
              if (r && r.length > 0) {
                angular.forEach(r, function (a, b) {
                  a.fulltext = a.rsaynmbrs + " - " + a.dscrsl;
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

        // Adjuntar documento
        function appendDocument() {
          var accept = ".jpg, .jpeg, .png, .gif, .bmp, .pdf, .doc, .xls,.docx, .xlsx, .txt"
          var aAccept = accept.split(",");

          if (!vm.data.documentoSolicitado || !vm.data.documentoSolicitado.codigo){
            mModalAlert.showError("Seleccione un tipo de documento solicitado",  "Documento");
            return;
          }

          if (!vm.data.file || vm.data.file.length == 0){
            mModalAlert.showError("Adjute un documento.",  "Documento");
            return;
          }

          if (vm.data.file[0].size >= 25000000){
            mModalAlert.showError("El archivo seleccionado supera el tamaño de 25 megas, selecione uno de menos tamaño", "Documento");
            return;
          }

          if (!_.find(aAccept, function(x){ return vm.data.file[0].name.toLowerCase().indexOf(x.trim().toLowerCase()) != -1; })){
            mModalAlert.showError("Seleccione un archivo con las siguientes extensiones permitidas: " + accept, "Documento");
            return;
          }

          mainServices.fnFileSerializeToBase64(vm.data.file[0]).then(function (data) {
            encoded = data.toString().replace(/^data:(.*,)?/, '');
            if ((encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }

            var paramsFile = { 
              nombreArchivo: vm.data.file[0].name, 
              tipoDocumento: vm.data.documentoSolicitado.codigo, 
              descripcionTipoDocumento: vm.data.documentoSolicitado.descripcion,
              base64: encoded,
              codigoUsuario: profile.loginUserName, 
              numeroPoliza: vm.viewdata.numeroPoliza,
              opt: 1
            };
            vm.documents.push(paramsFile);
            vm.paginationDoc.totalRecords = vm.paginationDoc.totalRecords + 1;

            vm.data.documentoSolicitado = "";
            delete vm.data.file;
          });
        }

        // Eliminar documento
        function deleteDocument(doc, index) {
          mModalConfirm.confirmQuestion("¿Está seguro de eliminar el archivo?", "Documento").then(function(){
            if(doc.opt === 1) {
              vm.documents.splice(index, 1);
            } else {
              proxyDisabilityRequest.eliminarDocumento(vm.viewdata.solicitudId, doc.numeroItem, true).then(function(response) {
                if(response.codigoRpta == 200)  {
                  listDocuments();
                } else {
                  mModalAlert.showError("Ha occurido un error al momento de eliminar su archivo.", "Solicitud");
                }
              }); 
            }
          });
        }

        // Descargar documento
        function downloadDocument (doc){
          mpSpin.start()
          $http.get(oimProxySctrDenuncia.endpoint + 'api/solicitud/' + vm.viewdata.solicitudId + '/documentos/' + doc.numeroItem + '/descargaDocumento',
            { responseType: 'blob' }
          ).success(function (data, status, headers) {
            var type = headers('Content-Type');
            var disposition = headers('Content-Disposition');
            if (disposition) {
              var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
              if (match[1])
                defaultFileName = match[1];
            }
            defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
            var blob = new Blob([data], { type: type });
            saveAs(blob, defaultFileName);
            mpSpin.end();
          }, function(data, status) {
            mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Documento");
            mpSpin.end();
          });
        }

        // Listar documentos
        function listDocuments() {
          proxyDisabilityRequest.listDocumentos(vm.viewdata.solicitudId, vm.paginationDoc.sizePerPage, vm.paginationDoc.currentPage, "Obteniendo archivos adjuntos...").then(function (response) {
            if(response.codigoRpta == 200) {
              vm.documents = response.data;
              vm.paginationDoc.totalRecords = response.totalRegistro;
            } else {
              vm.comments = [];
            }
          });
        }

        // Agregar Comentario
        function addComment() {
          if (!vm.data.comment ){
            mModalAlert.showError("Debe escribir un comentario",  "Comentario");
            return;
          }

          var comment = {
            opt: 1,
            comentario: vm.data.comment.toUpperCase(),
            codigoUsuario: profile.loginUserName,
            numeroItem: 0,
            fechaCreacion: new Date()
          };

          vm.comments.push(comment);
          vm.paginationCom.totalRecords = vm.paginationCom.totalRecords + 1;

          vm.data.comment = "";
        }

        // Eliminar Comentario
        function deleteComment(comen, index) {
          mModalConfirm.confirmQuestion("¿Está seguro de eliminar el comentario?", "Comentario").then(function(){
            vm.comments.splice(index, 1);
          });
        }

        // Listar Comentarios
        function listComments() {
          proxyDisabilityRequest.listComentarios(vm.viewdata.solicitudId, vm.paginationCom.sizePerPage, vm.paginationCom.currentPage, "Obteniendo comentarios...").then(function (response) {
            if(response.codigoRpta == 200) {
              var data = response.data;
              vm.comments = [];

              angular.forEach(data, function (a, b) {
                var item = a;
                var formatDate = new Date(a.fechaCreacion);
                item.fechaCreacion = formatDate;
                vm.comments.push(item);
              });
              vm.paginationCom.totalRecords = response.totalRegistro;
            } else {
              vm.comments = [];
            }
          });
        }

        // Guardar documentos
        function saveFiles(nroSolicitud, documents) {
          var promises = [];

          angular.forEach(documents, function (a, b) {
            var document = {
              opt: a.opt,
              numeroPoliza: a.numeroPoliza,
              nombreArchivo: a.nombreArchivo,
              base64: a.base64,
              tipoDocumento: a.tipoDocumento,
              codigoUsuario: a.codigoUsuario,
              codigoUsuarioAct: a.codigoUsuario,
              numeroItem: 0
            };

            promises.push(proxyDisabilityRequest.newDocumento(document, nroSolicitud, false));
          });

          return promises;
        }

        // Guardar comentarios
        function saveComments(nroSolicitud, comments) {
          var promises = [];

          angular.forEach(comments, function (a, b) {
            var comment = {
              opt: 1,
              comentario: a.comentario,
              codigoUsuario: a.codigoUsuario,
              codigoUsuarioAct: a.codigoUsuario,
              numeroItem: 0
            };

            promises.push(proxyDisabilityRequest.newComentario(comment, nroSolicitud, false));
          });

          return promises;
        }

        // Guardar cambios de solicitud
        function guardarSolicitud(){
          var params = {
            telefono: vm.viewdata.telefono,
            email: vm.viewdata.email,
            indEnvioCOMEPS: vm.viewdata.sendComeps,
            fechaEnvioCOMEPS: vm.viewdata.sendDate,
            fechaRespuestaCOMEPS: vm.viewdata.receiveDate,
            codigoUsuario: profile.loginUserName,
            monedaAhorroEstimado: vm.viewdata.estimateMoneyType ? vm.viewdata.estimateMoneyType.codigo : "",
            importeAhorroEstimado: vm.viewdata.estimatedAmount,
            opt: 1
          }

          proxyDisabilityRequest.setSolicitudInvalidez(params, vm.viewdata.solicitudId, true).then(function (resp) {
            if(resp.codigoRpta == 200) {
              var promises = [];

              var files = vm.documents.filter(function(item) { return item.opt == 1; });
              var comments = vm.comments.filter(function(item) { return item.opt == 1; });

              promises.concat(saveFiles(vm.viewdata.solicitudId, files), saveComments(vm.viewdata.solicitudId, comments));
              $q.all(promises).then(function (resp) {
                mModalAlert.showSuccess("Solicitud Actualizada con éxito.", "Solicitud");
              $state.go($state.current, {}, { reload: true });
              }, function (error) {
                mModalAlert.showError("Ha occurido un error al momento de actualizar su solicitud.", "Solicitud");
              });
            } else {
              mModalAlert.showError("Ha occurido un error al momento de actualizar su solicitud.", "Solicitud");
            }
          });
        }

        // Funcion cambio de pagina (documentos)
        function pageChangedDocs() {
          listDocuments();
        }

        // Funcion cambio de pagina (comentarios)
        function pageChangedComs() {
          listComments();
        }

        vm.$onInit = onInit;
        vm.seekClinic = seekClinic;    
        vm.appendDocument = appendDocument;
        vm.deleteDocument = deleteDocument;
        vm.downloadDocument = downloadDocument;
        vm.addComment = addComment;
        vm.deleteComment = deleteComment;
        vm.guardarSolicitud = guardarSolicitud;
        vm.pageChangedDocs = pageChangedDocs;
        vm.pageChangedComs = pageChangedComs;
      }
    ])
    .component("complaintDisabilityEditorDetail", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityEditor/detail/complaint-editor-detail.html",
      controller: "complaintDisabilityEditorDetailComponentController",
      bindings: {
        viewdata: "=?",
        role:"=?"
      }
    });
});
