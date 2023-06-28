(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "complaintDisabilityNewComponent", ["angular"], function (ng) {
  ng.module("sctrDenuncia.app")
    .controller("complaintDisabilityNewComponentController", ["$scope", "accessSupplier", "proxyLocation", "proxyDisabilityRequest",  "proxyClinicCoverage", "proxyInsurancePolicy", "$q", "mModalAlert", "mainServices", "mModalConfirm", "$filter",
      function ($scope, accessSupplier, proxyLocation, proxyDisabilityRequest, proxyClinicCoverage, proxyInsurancePolicy, $q, mModalAlert, mainServices, mModalConfirm, $filter) {
        var vm = this;
        var profile = accessSupplier.profile();

        function onInit() {
          vm.dateFormat = "dd/MM/yyyy";
          vm.currentDate = new Date();

          vm.provincias = [];
          vm.distritos = [];
          vm.documents = [];
          vm.comments = [];
          vm.data = { insured : {} , client: {} };

          $scope.$watch("$parent.clear", function (newValue) {
            if (newValue == true && vm.data) {
              vm.data.insured = {};
              vm.data.client = {};
              vm.data.clinic = "";
              vm.data.documentoSolicitado = "";
              vm.data.comment = "";

              vm.nroSolicitud = "";

              vm.provincias = [];
              vm.distritos = [];
              vm.documents = [];
              vm.comments = [];

              vm.currentPoliza = null;
            }
          });

          proxyDisabilityRequest.parametros(99, null, null, 21, 20, 1, false).then(function (resp) {
            vm.documentosSolicitados = resp.data;
          });

          proxyDisabilityRequest.parametros(1, null, null, null, 20, 1, false).then(function (resp) {
            vm.tiposDocumentos = resp.data;
          });

          proxyLocation.GetLocation(null, null, true).then(function(resp){
            vm.departamentos = resp;
          });

          vm.emitMethods({ $funcs: { getComplaint: getComplaint } });
        }

        // Accion al elegir un tipo de documento
        function documentTypeChange() {
          vm.data.insured.documentNumber = '';
          var numDocValidations = {};
          if (!ng.isUndefined(vm.data.insured.documentType)) {
            checkLegalPerson(vm.data.insured.documentType, vm.data.insured.documentNumber);
            mainServices.documentNumber.fnFieldsValidated(numDocValidations, vm.data.insured.documentType.Codigo, 1);
    
            vm.docNumMaxLength = numDocValidations.DOCUMENT_NUMBER_MAX_LENGTH;
            vm.docNumMinLength = numDocValidations.DOCUMENT_NUMBER_MIN_LENGTH;
            vm.docNumType = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE;
            vm.docNumTypeDisabled = numDocValidations.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED;
          }
        }

        // Accion al ingresar numero de documento
        function documentNumberChange(documentType, documentNumber) {
          if (documentType && documentNumber) {
            checkLegalPerson(documentType, documentNumber);
            getInsuredData(documentType, documentNumber)
          }
        }

        // Validar si es una persona legal
        function checkLegalPerson(documentType, documentNumber) {
          vm.legalPerson = documentType === 'RUC' && documentNumber ? documentNumber.substring(0, 2) === '20' : false;
        }
        
        // Funcion para obtener data de asegurado
        function getInsuredData(documentType, documentNumber) {
          proxyDisabilityRequest.consultarPersona(documentType.codigo, documentNumber, 3, "Buscando asegurado...").then(function (resp) {
            vm.data.insured.names = resp.data.nombres;
            vm.data.insured.lastName = resp.data.apellidoPaterno;
            vm.data.insured.motherLastName = resp.data.apellidoMaterno;
            vm.data.insured.gender = resp.data.genero;
            vm.data.insured.phone = resp.data.telefono;
            vm.data.insured.email = resp.data.correoElectronico;

            vm.data.insured.birthDate = null;
            
            if(resp.data.fechaNacimiento){
            var fechaNacimiento = resp.data.fechaNacimiento.split("/");
            var fechaNacimientoDate = new Date(fechaNacimiento[2], fechaNacimiento[1] - 1, fechaNacimiento[0]);
            vm.data.insured.birthDate = fechaNacimientoDate;
            }
          });
        }

        // Funcion para obtener datos de poliza
        function changeSearchPoliza() {
          var data = vm.data;

          if (data && data.insured && data.insured.sinisterDate) {
            var insuredDocument = data.insured ? data.insured.documentNumber: null;
            var sinisterDate = data.insured.sinisterDate.toISOString();
            proxyInsurancePolicy.GetByDocument(insuredDocument, null, sinisterDate, "Buscando polizas...").then(function (resp) {
              if(resp.length !== 0) {
                var poliza = resp[0];
                vm.currentPoliza = poliza;
                vm.data.insured.policyType = poliza.tipoPoliza;
                vm.data.insured.policyNumber = poliza.nroPoliza;
                vm.data.insured.policyTime = $filter("date")(poliza.fecIniVig, "dd/MM/yyyy") + " al " + $filter("date")(poliza.fecFinVig, "dd/MM/yyyy");
                vm.data.insured.planNumber = poliza.num_plan;
                vm.data.client.fullName = poliza.cod_docum + ' - ' + poliza.rznSocialCliente;
                vm.data.client.phone = poliza.tlf_movil;
                vm.data.client.email = poliza.email;
              } else {
                vm.currentPoliza = null;
                vm.data.insured.policyType = '';
                vm.data.insured.policyNumber = '';
                vm.data.insured.policyTime = '';
                vm.data.insured.planNumber = '';
                vm.data.client.fullName = '';
                vm.data.client.phone = '';
                vm.data.client.email = '';
              }
            });
          }
        }

        // Accion al seleccionar un departamento
        function selectDepartment(deparmentId) {
          if (!deparmentId || deparmentId.codigo == null) {
            vm.provincias = [];
            vm.distritos = [];
          } else {
            proxyLocation.GetLocation(deparmentId.codigo, null, "Obteniendo Provincias...").then(function(resp){
              vm.provincias = resp;
            });

          }
        }

        // Accion al seleccionar una provincia
        function selectProvince(deparmentId, provincieId) {
          if (!provincieId || provincieId.codigo == null) {
            vm.provincias = [];
            vm.distritos = [];
          } else {
            proxyLocation.GetLocation(deparmentId.codigo, provincieId.codigo, "Obteniendo distritos...").then(function(resp){
              vm.distritos = resp;
            });
          }
        }

        // Obtiene datos de clinica
        function seekClinic(wildcar) {
          var deferred = $q.defer();
          var params = { Wildcard : wildcar };

          proxyClinicCoverage.SeekClinic(params).then(
            function (r) {
              listClinic = r;
              if(r && r.length > 0) {
                angular.forEach(r, function (a, b) {
                  a.fulltext = a.rsaynmbrs + " - " + a.dscrsl;
                });
              } else {
                mModalAlert.showError("No se encontraron clínicas.", "Solicitud");
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
              nombreDocumento: vm.data.file[0].name, 
              tipoDocumento: vm.data.documentoSolicitado.codigo, 
              nombreTipoDocumento: vm.data.documentoSolicitado.descripcion, 
              documento: encoded, 
              user: profile.loginUserName 
            };
            vm.documents.push(paramsFile);

            vm.data.documentoSolicitado = "";
            delete vm.data.file;
          });
        }

        // Eliminar documento
        function deleteDocument(index) {
          mModalConfirm.confirmQuestion("¿Está seguro de eliminar el archivo?", "Documento").then(function(){
            vm.documents.splice(index, 1);
          }, function(){ })
        }

        // Agregar Comentario
        function addComment() {
          if (!vm.data.comment ){
            mModalAlert.showError("Debe escribir un comentario",  "Comentario");
            return;
          }

          var paramsFile = { description: vm.data.comment, user: profile.loginUserName, date: new Date() };

          vm.comments.push(paramsFile);

          vm.data.comment = "";
        }

        // Eliminar Comentario
        function deleteComment(index) {
          mModalConfirm.confirmQuestion("¿Está seguro de eliminar el comentario?", "Comentario").then(function(){
            vm.comments.splice(index, 1);           
          }, function(){ })
        }

        // Obtener datos de solicitud a guardar
        function getComplaint() {
          if (!$scope.frmComplaintDetail.$valid) {
            $scope.frmComplaintDetail.markAsPristine();
            return { isvalid: false, message: "Verifique que los datos de la solicitud estén correctos." };
          }

          if (!vm.currentPoliza) {
            $scope.frmComplaintDetail.markAsPristine();
            return { isvalid: false, message: "Verifique que los datos de la solicitud estén correctos." };
          }

          if (vm.documents.length === 0) {
            $scope.frmComplaintDetail.markAsPristine();
            return { isvalid: false, message: "Debe adjuntar al menos un documento." };
          }

          var documentsFormato1 = vm.documents.filter(function(item) { return item.tipoDocumento == 1; });;

          if (documentsFormato1.length === 0) {
            $scope.frmComplaintDetail.markAsPristine();
            return { isvalid: false, message: "Debe adjuntar al menos un documento de tipo FORMATO N1." };
          }

          var currentDateIso = new Date(vm.currentDate.getFullYear(), vm.currentDate.getMonth(), vm.currentDate.getDate());

          var req = {
            apellidoMaterno: vm.data.insured.motherLastName,
            apellidoPaterno: vm.data.insured.lastName,
            codigoDepartamento: vm.data.insured.department.codigo,
            codigoDistrito: vm.data.insured.district.codigo,
            codigoProveedor: vm.data.clinic.cprvdr,
            codigoProvincia: vm.data.insured.province.codigo,
            codigoUsuario: profile.loginUserName,
            direccion: vm.data.insured.address ? vm.data.insured.address.toUpperCase() : '',
            email: vm.data.insured.email,
            fechaFin: vm.currentPoliza.fecFinVig,
            fechaInicio: vm.currentPoliza.fecIniVig,
            fechaNacimiento: vm.data.insured.birthDate.toISOString(),
            fechaSiniestro: vm.data.insured.sinisterDate.toISOString(),
            fechaSolicitud: currentDateIso.toISOString(),
            nombres: vm.data.insured.names,
            numeroDocumento: vm.data.insured.documentNumber,
            numeroPoliza: vm.data.insured.policyNumber,
            numeroSucursal: vm.data.clinic.nsprvdr,
            opt: 1,
            sexo: vm.data.insured.gender,
            solicitudId: 0,
            telefono: vm.data.insured.phone,
            tipoDocumento: vm.data.insured.documentType.codigo,
            tipoPoliza: vm.data.insured.policyType,
            contratante: {
              ruc: vm.currentPoliza.cod_docum,
              razonSocial: vm.currentPoliza.rznSocialCliente,
              telefono: vm.currentPoliza.tlf_movil,
              email: vm.currentPoliza.email
            },
            numeroPlan: vm.data.insured.planNumber
          }

          return { isvalid: true, request: req, files: vm.documents, comments: vm.comments };
        }

        vm.$onInit = onInit;
        vm.documentTypeChange = documentTypeChange;
        vm.documentNumberChange = documentNumberChange;
        vm.selectDepartment = selectDepartment;
        vm.selectProvince = selectProvince;
        vm.seekClinic = seekClinic;
        vm.changeSearchPoliza = changeSearchPoliza;
        vm.appendDocument = appendDocument;
        vm.deleteDocument = deleteDocument;
        vm.addComment = addComment;
        vm.deleteComment = deleteComment;
      }
    ])
    .component("complaintDisabilityNew", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityNew/input/complaint-input.html",
      controller: "complaintDisabilityNewComponentController",
      bindings: {
        emitMethods: "&",
        nroSolicitud: "=?"
      }
    });
});
