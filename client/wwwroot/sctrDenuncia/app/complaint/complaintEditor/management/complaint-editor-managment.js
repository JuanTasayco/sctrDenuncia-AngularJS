(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "complaintEditorManagementComponent", ['angular'], function(ng){
    ng.module('sctrDenuncia.app').
    controller('complaintEditorManagementComponentController',['mModalConfirm','mModalAlert','$stateParams', 'mpSpin', 'proxyBinnacle', 'proxyDocument', 'proxyLookupSctr', 'oimProxySctrDenuncia', '$http', 'accessSupplier', 
    function(mModalConfirm, mModalAlert,$stateParams, mpSpin, proxyBinnacle, proxyDocument, proxyLookupSctr, oimProxySctrDenuncia, $http, accessSupplier){
        
        var vm = this;
        var profile = accessSupplier.profile();
        vm.$onInit = onInit;
        
        function onInit(){
            
            proxyLookupSctr.GetLookups(["DOC_SOLIC"]).then(function(resp){
                vm.documentosSolicitados = resp.doC_SOLIC;
            });

            proxyBinnacle
            .Get($stateParams.periodo, vm.viewdata.nroDenuncia)
            .then(function(resp){
                vm.bicatoras  = resp;
            })
            listarDocumentos();
        }
        
        function isBlank(str) {
            return (!str || /^\s*$/.test(str));
        }
        function listarDocumentos(){
            if (!isBlank(vm.viewdata.nroPolizaSalud)){ 
            proxyDocument
            .List($stateParams.periodo, vm.viewdata.nroDenuncia, vm.viewdata.nroPolizaSalud, true)
            .then(function(response){
                vm.documents = response.result;
            });
            }
            
        }
        function appendDocument()
        {
            var accept = ".jpg, .jpeg, .png .gif, .bmp, .pdf, .doc, .xls,.docx, .xlsx, .txt"
            var aAccept = accept.split(",");
            if (!vm.data.documentoSolicitado || !vm.data.documentoSolicitado.codigo){
                mModalAlert.showError("Seleccione un tipo de documento solicitado", "Documento");
                return;
            }
            if (!vm.data.file || vm.data.file.length==0){
                mModalAlert.showError("Adjute un documento.", "Documento");
                return;
            }
            if (vm.data.file[0].size>=25000000){
                mModalAlert.showError("El archivo seleccionado supera el tamaño de 25 megas, selecione uno de menos tamaño", "Documento");
                return;
            }
            if (!_.find(aAccept, function(x){ return vm.data.file[0].name.toLowerCase().indexOf(x.trim().toLowerCase()) != -1; }))
            {
                mModalAlert.showError("Seleccione un archivo con las siguientes extensiones permitidas: " + accept, "Documento");
                return;
            }
            if (isBlank(vm.viewdata.nroPolizaSalud)){
                mModalAlert.showError("Denuncia no tiene póliza", "Documento");
                return;
            }
            var paramsFile = {nroPolizaSalud: vm.viewdata.nroPolizaSalud, codigoDocumentoSolicitado: vm.data.documentoSolicitado.codigo};
            var fd = new FormData();
            fd.append("request", JSON.stringify(paramsFile));
            fd.append("file", vm.data.file[0]);
            mpSpin.start()
            $http.post( oimProxySctrDenuncia.endpoint + "api/document/append/" + $stateParams.periodo + "/" + vm.viewdata.nroDenuncia,
                        fd,
                        {
                            transformRequest: angular.identity,
                            headers: {
                              'Content-Type': undefined
                            }
            })
            .then(function(response){
                var re = response.data
                if (re.isSuccess){
                    mModalAlert
                    .showSuccess("Se cargó el archivo satisfactoriamente.", "Documento")
                    .then(function(){ vm.data.documentoSolicitado = {codigo:undefined}; delete vm.data.file; listarDocumentos(); });
                }
                else{
                    mModalAlert.showError("Ha sucedido un error al momento de guardar el archivo", "Documento");
                }
                mpSpin.end();
            },function(){
                mModalAlert.showError("Ha sucedido un error al momento de guardar el archivo", "Documento");
                mpSpin.end();
            });
        }
        function getNameTipo(doc){
            
            var item;
            if (vm.documentosSolicitados){
                item = _.find(vm.documentosSolicitados, function(x){ return x.codigo == doc.tipoDocumento; })
           }
           return item && item.codigo ? item.descripcion:"Desconocido";
        }
        function getFilename(doc){
            return doc.nombreDocumento
        }
        function deleteDocument (doc){
            mModalConfirm.confirmQuestion("¿Está seguro de eliminar el archivo?", "Documento")
            .then(function(){
                proxyDocument
                .Eliminar(doc.documentId, true)
                .then(function(){
                    mModalAlert
                        .showSuccess("Se eliminó el archivo satisfactoriamente.", "Documento")
                        .then(function(){ listarDocumentos(); });
                },
                function(){
                    mModalAlert.showError("Ha sucedido un error al momento de eliminar el archivo", "Documento");
                })
            }, function(){ })
            
        }

        function downloadDocument (doc){
            mpSpin.start()
            $http.get(
                oimProxySctrDenuncia.endpoint + 'api/document/download/' +$stateParams.periodo + "/" + vm.viewdata.nroDenuncia+ "/" + vm.viewdata.nroPolizaSalud+ "/" + doc.documentId,
                { transformRequest: angular.identity, responseType: 'blob' }
            )
            .success(function (data, status, headers) {
            //   var defaultFileName ='denuncia-' + '-' + item.periodoDenuncia + '-' + item.nroDenuncia + '-'+ item.codAfiliado;
                var defaultFileName = "";
                var type = headers('Content-Type');
                var disposition = headers('Content-Disposition');
                console.log(disposition);
                if (disposition) {
                    var match = disposition.match(/.*filename=\"?([^;\"]+)\"?.*/);
                    if (match[1]) defaultFileName = match[1];
                }
                defaultFileName = defaultFileName.replace(/[<>:"\/\\|?*]+/g, '_');
                var blob = new Blob([data], { type: type });
                saveAs(blob, defaultFileName);
                mpSpin.end();
            }, function(data, status) {
                mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Documento");
                mpSpin.end();
            });
            //window.open(oimProxySctrDenuncia.endpoint + 'api/document/download/' +$stateParams.periodo + "/" + vm.viewdata.nroDenuncia+ "/" + vm.viewdata.nroPolizaSalud+ "/" + doc.documentId);
        }

        vm.deleteDocument = deleteDocument;
        vm.downloadDocument  = downloadDocument;
        vm.getFilename = getFilename;
        vm.getNameTipo = getNameTipo;
        vm.appendDocument = appendDocument;
        vm.isEndStatus = isEndStatus;

        function isEndStatus() {
            return (vm.viewdata.estado || "").trim() == "F";
        }

        function addBitacora(){
            if (!vm.mObsExterna){
                mModalAlert.showError("Ingrese una observación para agregar una bitácora", "Bitacora");
                return;
            }
            var request = {
                periodoDenuncia: $stateParams.periodo,
                nroDenuncia:vm.viewdata.nroDenuncia,
                Comentario: vm.mObsExterna,
                usuario:profile.loginUserName
            }
            
            proxyBinnacle
            .Save(request, "Agregando bitacora ...").then(function(){
                vm.mObsExterna = "";
                proxyBinnacle
                .Get($stateParams.periodo, vm.viewdata.nroDenuncia, "Actualizando lista de bitacoras ...")
                .then(function(resp){
                    vm.bicatoras  = resp;
                })
            })
        }

        vm.addBitacora=addBitacora
        
    }]).
    component("complaintEditorManagement", {
        templateUrl: "/sctrDenuncia/app/complaint/complaintEditor/management/complaint-editor-managment.html",
        controller: "complaintEditorManagementComponentController",
        bindings: {
            viewdata: "=?"
        }
    })
});
