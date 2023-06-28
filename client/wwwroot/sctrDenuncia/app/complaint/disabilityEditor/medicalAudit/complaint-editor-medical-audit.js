(function($root, name, deps, action){
    $root.define(name, deps, action)
})(window, "complaintDisabilityEditorMedicalAuditComponent", ['angular', '/sctrDenuncia/app/services/externalServices.js'], function(ng){
  ng.module('sctrDenuncia.app')
    .controller('complaintDisabilityEditorMedicalAuditComponentController',['$scope', '$q', 'mModalAlert', 'accessSupplier', 'proxyDisabilityRequest', 'mainServices', 'mModalConfirm', 'externalServices',
      function($scope, $q, mModalAlert, accessSupplier, proxyDisabilityRequest, mainServices, mModalConfirm, externalServices){
        var vm = this;
        var profile = accessSupplier.profile();

        vm.audits = [];
        vm.examens = [];
        vm.currentAudit = {};
        
        function onInit(){
          vm.showDetail = vm.viewdata.codigoEstado == '4' || (vm.role == 2 || vm.role == 0);
          vm.showEdit = vm.viewdata.codigoEstado != '4' && (vm.role != 2 && vm.role != 0);

          proxyDisabilityRequest.parametros(99, null, null, 16, 20, 1, false).then(function(resp){
            vm.natures = resp.data;
          });

          proxyDisabilityRequest.parametros(99, null, null, 17, 20, 1, false).then(function(resp){
            vm.grades = resp.data;
          });

          proxyDisabilityRequest.parametros(99, null, null, 18, 20, 1, false).then(function(resp){
            vm.activities = resp.data;
          });

          vm.cleanForm = true;

          cleanPagerAudit();
          cleanPagerExam();
          getListAudits();
        }

        // Inicializar paginador auditorias
        function cleanPagerAudit() {
          vm.paginationAudit = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0,
          };
        }

        // Inicializar paginador examenes
        function cleanPagerExam() {
          vm.paginationExam = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0,
          };
        }

        // Obtienes datos de medico
        function seekDoctor(wildcar) {
          var deferred = $q.defer();

          var params = {
            fName: wildcar.toUpperCase()
          };

          externalServices.getCgwListDoctor(params, false).then(
            function (r) {
              if (r && r.data.items.length > 0) {
                angular.forEach(r.data.items, function (a, b) {
                  a.fulltext = a.doctorFullName;
                });
              } else {  
                mModalAlert.showError(
                  "No se encontraron doctores.",
                  "Solicitud"
                );
              }
              deferred.resolve(r.data.items);
            },
            function (r) {
              deferred.reject(r);
            }
          );

          return deferred.promise;
        }

        // Obtienes datos de diagnostico
        function getListDiagnostic(wildcar) {
          var deferred = $q.defer();

          var params = {
            diagnosticName: wildcar.toUpperCase()
          };

          externalServices.getCgwListDiagnostic(params, false).then(
            function (r) {
              deferred.resolve(r.data.items);
            },
            function (r) {
              deferred.reject(r);
            }
          );

          return deferred.promise;
        }

        // Obtiene datos de procedimientos
        function getListProcedures(wildcar) {
          var deferred = $q.defer();

          proxyDisabilityRequest.parametros(2,  wildcar.toUpperCase(), null, null, 20, 1, false).then(function (r) {
            deferred.resolve(r.data);
          },
          function (r) {
            deferred.reject(r);
          });

          return deferred.promise;
        }

        // Limpiar formulario de auditoria
        function clearAuditForm() {
          vm.cleanForm = true;
          $scope.frmMedicalAudit.$setPristine();
          vm.data = {};
          vm.data.doctor = "";
          vm.data.diagnostic = "";
          vm.data.startDate = "";
          vm.data.grade = "";
          vm.data.combineMenoscabo = "";
          vm.data.globalMenoscabo = "";
          vm.data.nature = "";
          vm.data.rehability = "";
          vm.data.activity = "";
          vm.data.comment = "";
          vm.currentAudit = {};
          vm.examens = [];
          vm.showDetail = vm.viewdata.codigoEstado == '4' || (vm.role == 2 || vm.role == 0);
          vm.showEdit = vm.viewdata.codigoEstado != '4' && (vm.role != 2 && vm.role != 0);
        }

        // Regresar a la vista anterior
        function cancelAudit() {
          vm.clearAuditForm();
        }

        // Función para registrar auditoría
        function registerAudit(){
          vm.cleanForm = false;
          if (!$scope.frmMedicalAudit.$valid) {
            $scope.frmMedicalAudit.markAsPristine();
            mModalAlert.showError("Verifique que los datos de la auditoría estén correctos.", "Auditoría Médica");
            return;
          }

          var fechaIncapacidad = new Date(
            vm.data.startDate.getFullYear(),
            vm.data.startDate.getMonth(),
            vm.data.startDate.getDate()
          );

          var body = {
            opt: 1,
            codigoDiagnostico: vm.data.diagnostic.code,
            codigoUsuario: profile.loginUserName,
            comentario: vm.data.comment ? vm.data.comment.toUpperCase() : '',
            fechaInicioIncapacidad: fechaIncapacidad.toISOString(),
            gradoIncapacidad: vm.data.grade.codigo,
            menoscaboCombinado: vm.data.combineMenoscabo,
            menoscaboGlobal: vm.data.globalMenoscabo,
            naturalezaIncapacidad: vm.data.nature.codigo,
            posibilidadRehabilitacion: vm.data.rehability,
            tipoActividad: vm.data.activity.codigo
          }

          if(vm.currentAudit.auditoriaId) {
            proxyDisabilityRequest.setAuditoria(body, vm.viewdata.solicitudId, vm.currentAudit.auditoriaId, "Actualizando auditoria...").then(function (resp) {
              if(resp.codigoRpta == 200) {
                var promises = [];

                var examenesSave = vm.examens.filter(function(item) { return item.opt == 1; });
                var examenesUpdate = vm.examens.filter(function(item) { return item.opt == 2; });

                promises.concat(saveExamens(examenesSave, vm.currentAudit.auditoriaId), updateExamens(examenesUpdate, vm.currentAudit.auditoriaId));

                $q.all(promises).then(function (response) {
                  console.log(response);
                  
                  mModalAlert.showSuccess("Auditoría actualizada con éxito.", "Auditoría médica");

                  clearAuditForm();
                  clearExamenForm();
                  getListAudits();
                }, function (error) {
                  mModalAlert.showError("Hubo un error al registrar la auditoría.", "Auditoría médica");
                });
              } else {
                mModalAlert.showError("Hubo un error al registrar la auditoría.", "Auditoría médica");
              }
            });
          } else {
            proxyDisabilityRequest.newAuditoria(body, vm.viewdata.solicitudId, "Creando auditoria...").then(function (resp) {
              if(resp.codigoRpta == 200) {
                var promises = [];

                var examenes = vm.examens.filter(function(item) { return item.opt == 1; });

                promises.concat(saveExamens(examenes, resp.data));

                $q.all(promises).then(function (response) {
                  console.log(response);
                  
                  mModalAlert.showSuccess("Auditoría registrada con éxito.", "Auditoría médica");

                  clearAuditForm();
                  clearExamenForm();
                  getListAudits();
                }, function (error) {
                  mModalAlert.showError("Hubo un error al registrar la auditoría.", "Auditoría médica");
                });
              } else {
                mModalAlert.showError("Hubo un error al registrar la auditoría.", "Auditoría médica");
              }
            });
          }
        }

        // Funcion listener cuando se cambia el archivo de un examen
        function changeFile(examen) {
          console.log('changeFile');
          if(!validateAddDocument(vm.data.file2)) {
            return;
          }

          var encoded = "";
    
          mainServices.fnFileSerializeToBase64(vm.data.file2[0]).then(function (data) {
            encoded = data.toString().replace(/^data:(.*,)?/, '');
            if ((encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }

            editExamen();

            examen.file = vm.data.file2;
            examen.base64 = encoded;
            examen.nombreArchivo = vm.data.file2[0].name;

            delete vm.data.file2;
          },
          function(error) {
            console.log('Hubo problema al subir el archivo');
          });
        }

        // Funcion listener cuando se hace cambio en un examen
        function editExamen(examen) {
          if(!examen.opt) {
            examen.opt = 2;
            examen.numeroPoliza = vm.viewdata.numeroPoliza;
            examen.codigoUsuario = profile.loginUserName;
          }
        }

        // Funcion para listar las auditorías
        function getListAudits() {
          proxyDisabilityRequest.listAuditorias(vm.viewdata.solicitudId, vm.paginationAudit.sizePerPage, vm.paginationAudit.currentPage, "Obteniendo historial de auditoría...").then(function(resp){
            if(resp.codigoRpta == 200) {
              vm.audits = resp.data;
              angular.forEach(vm.audits, function (a, b) {                
                if(a.fechaInicioIncapacidad) {
                  var fecha = a.fechaInicioIncapacidad.substr(0,10);
                  var fechas = fecha.split('-');
                  a.fechaInicioIncapacidad = new Date(fechas[0], fechas[1] - 1, fechas[2]);
                } else {
                  a.fechaInicioIncapacidad = null;
                }
              });
              vm.paginationAudit.totalRecords = resp.totalRegistro;
            } else {
              vm.audits = [];
            }
          });
        }

        // Funcion cambio de pagina AUDITORIAS
        function pageChangedAudits() {
          getListAudits();
        }

        // Función para obtener el detalle de una auditoría
        function getDetailAudit(audit, showDetail, showEdit){
          proxyDisabilityRequest.getAuditoria(vm.viewdata.solicitudId, audit.auditoriaId, "Obteniendo auditoría...").then(function(resp) {
            if(resp.codigoRpta == 200) {
              vm.currentAudit = resp.data;

              vm.data.startDate = new Date(resp.data.fechaInicioIncapacidad);

              vm.data.diagnostic = {
                code: resp.data.codigoDiagnostico,
                codeName: resp.data.codigoDiagnostico + " - " + resp.data.descriocionDiagnosctico,
                name: resp.data.descriocionDiagnosctico
              };

              vm.data.nature = { 
                codigo: resp.data.naturalezaIncapacidad,
                descripcion: resp.data.descripcionIncapacidad
              };

              vm.data.grade = { 
                codigo: resp.data.gradoIncapacidad,
                descripcion: resp.data.descripcionGrado
              };

              vm.data.activity = { 
                codigo: resp.data.tipoActividad,
                descripcion: resp.data.descripcionActividad
              };

              vm.data.combineMenoscabo = resp.data.menoscaboCombinado;
              vm.data.rehability = resp.data.posibilidadRehabilitacion;
              vm.data.globalMenoscabo = resp.data.menoscaboGlobal;
              vm.data.comment = resp.data.comentario;

              getListExamns();

              vm.showDetail = showDetail;
              vm.showEdit = showEdit;
            } else {
              mModalAlert.showError("Hubo un error al obtener los datos de la auditoría.", "Auditorías Médicas");
            }
          });
        }

        // Mostrar en vista de lectura la auditoria
        function showAudit(audit) {
          getDetailAudit(audit, true, false);
        }

        // Mostrar en vista de edicion la auditoria
        function editAudit(audit) {
          getDetailAudit(audit, true, true);
        }

        // Validar subida de documentos
        function validateAddDocument(file) {
          var accept = ".jpg, .jpeg, .png, .pdf, .doc, .docx, .msg"
          var aAccept = accept.split(",");
    
          if (!file || file.length == 0){
            mModalAlert.showError("Adjute un documento.",  "Auditoría Médica");
            return false;
          }
    
          if (file[0].size >= 25000000){
            mModalAlert.showError("El archivo seleccionado supera el tamaño de 25 megas, selecione uno de menos tamaño", "Auditoría Médica");
            return false;
          }
    
          if (!_.find(aAccept, function(x){ return file[0].name.toLowerCase().indexOf(x.trim().toLowerCase()) != -1; })){
            mModalAlert.showError("Seleccione un archivo con las siguientes extensiones permitidas: " + accept, "Auditoría Médica");
            return false;
          }

          return true;
        }

        // Limpiar formulario de examenes
        function clearExamenForm() {
          vm.data.examen = "";
          vm.data.fechaExamen = "";
          vm.data.resultado = "";
          delete vm.data.file;
        }

        // Función para registrar examenes
        function registerExamen(){
          if (!vm.data.examen || !vm.data.fechaExamen || !vm.data.resultado) {
            mModalAlert.showError("Verifique que los datos del examen estén correctos.", "Auditoría Médica");
            return;
          }

          if(!validateAddDocument(vm.data.file)) {
            return;
          }

          var encoded = "";
    
          mainServices.fnFileSerializeToBase64(vm.data.file[0]).then(function (data) {
            encoded = data.toString().replace(/^data:(.*,)?/, '');
            if ((encoded.length % 4) > 0) {
              encoded += '='.repeat(4 - (encoded.length % 4));
            }

            var item = {
              opt: 1,
              codigoProcedimiento: vm.data.examen.codigo,
              descripcionProcedimiento: vm.data.examen.descripcion,
              fechaInforme: vm.data.fechaExamen,
              descripcionResultado: vm.data.resultado,
              numeroPoliza: vm.viewdata.numeroPoliza,
              codigoUsuario: profile.loginUserName,
              nombreArchivo: vm.data.file[0].name,
              base64: encoded,
              file: vm.data.file
            };
  
            vm.examens.push(item);
            vm.paginationExam.totalRecords = vm.paginationExam.totalRecords + 1;

            clearExamenForm();

            delete vm.data.file;
          },
          function(error) {
            console.log('Hubo problema al subir el archivo');
          });
        }

        // Funcion para guardar nuevo examen
        function saveExamens(examens, auditId) {
          var promises = [];

          angular.forEach(examens, function (data, b) {
            var fechaExamen = new Date(
              data.fechaInforme.getFullYear(),
              data.fechaInforme.getMonth(),
              data.fechaInforme.getDate()
            );
  
            var body = {
              opt: data.opt,
              codigoProcedimiento: data.codigoProcedimiento,
              fechaInforme: fechaExamen.toISOString(),
              descripcionResultado: data.descripcionResultado.toUpperCase(),
              codigoUsuario: data.codigoUsuario,
              nombreArchivo: data.nombreArchivo,
              base64: data.base64,
              numeroPoliza: data.numeroPoliza
            }

            promises.push(proxyDisabilityRequest.newExamenAuditoria(body, vm.viewdata.solicitudId, auditId, false));
          });

          return promises;
        }

        // Funcion para actualizar examen
        function updateExamens(examens, auditId) {
          var promises = [];

          angular.forEach(examens, function (data, b) {
            var fechaExamen = new Date(
              data.fechaInforme.getFullYear(),
              data.fechaInforme.getMonth(),
              data.fechaInforme.getDate()
            );
  
            var body = {
              opt: 1,
              fechaInforme: fechaExamen.toISOString(),
              descripcionResultado: data.descripcionResultado.toUpperCase(),
              codigoUsuario: data.codigoUsuario,
              nombreArchivo: data.nombreArchivo,
              base64: data.base64,
              numeroPoliza: data.numeroPoliza,
              identificadorDocumento: data.identificadorDocumento
            }

            var numeroItemId = data.codigoProcedimiento.split('.').join('_');
            promises.push(proxyDisabilityRequest.setExamenAuditoria(body, vm.viewdata.solicitudId, auditId, numeroItemId, false));
          });

          return promises;
        }

        // Funcion para eleiminar examen
        function deleteExamen(examen, index) {
          mModalConfirm.confirmQuestion("¿Está seguro de eliminar el examen?", "Auditoría Médica").then(function(){
            if(examen.opt === 1) {
              vm.examens.splice(index, 1);
            } else {
              var numeroItemId = examen.codigoProcedimiento.split('.').join('_');
              proxyDisabilityRequest.eliminarExamen(vm.viewdata.solicitudId, examen.auditoriaId, numeroItemId, true).then(function(response) {
                if(response.codigoRpta == 200)  {
                  getListExamns();
                } else {
                  mModalAlert.showError("Ha occurido un error al momento de eliminar su examen.", "Auditoría Médica");
                }
              }); 
            }
          });
        }

        // Funcion para listar los examenes
        function getListExamns() {
          proxyDisabilityRequest.listExamenesAuditoria(vm.viewdata.solicitudId, vm.currentAudit.auditoriaId, vm.paginationExam.sizePerPage, vm.paginationExam.currentPage, "Obteniendo exámenes...").then(function(resp){
            if(resp.codigoRpta == 200) {
              var data = resp.data;
              vm.examens = [];

              angular.forEach(data, function (a, b) {
                var item = a;
                var formatDate = new Date(a.fechaInforme);
                item.fechaInforme = formatDate;
                vm.examens.push(item);
              });
              
              vm.paginationExam.totalRecords = resp.totalRegistro;
            } else {
              vm.examens = [];
            }
          });
        }

        // Funcion cambio de pagina EXAMENES
        function pageChangedExams() {
          getListExamns();
        }

        vm.$onInit = onInit;
        vm.seekDoctor = seekDoctor;
        vm.getListDiagnostic = getListDiagnostic;
        vm.getListProcedures = getListProcedures;
        vm.registerAudit = registerAudit;
        vm.getDetailAudit = getDetailAudit;
        vm.pageChangedAudits = pageChangedAudits;
        vm.clearAuditForm = clearAuditForm;
        vm.cancelAudit = cancelAudit;
        vm.showAudit = showAudit;
        vm.editAudit = editAudit;
        vm.registerExamen = registerExamen;
        vm.changeFile = changeFile;
        vm.editExamen = editExamen;
        vm.deleteExamen = deleteExamen;
        vm.getListExamns = getListExamns;
        vm.pageChangedExams = pageChangedExams;
      }
    ])
    .component("complaintDisabilityEditorMedicalAudit", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityEditor/medicalAudit/complaint-editor-medical-audit.html",
      controller: "complaintDisabilityEditorMedicalAuditComponentController",
      bindings: {
        viewdata: "=?",
        emitFnMedicalAudit: "&?",
        role:"=?"
      }
    })
});
