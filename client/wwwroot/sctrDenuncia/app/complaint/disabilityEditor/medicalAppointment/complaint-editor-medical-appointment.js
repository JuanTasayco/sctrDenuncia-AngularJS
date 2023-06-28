(function ($root, name, deps, action){
  $root.define(name, deps, action)
})(window, "complaintDisabilityEditorMedicalAppointmentComponent", ['angular', '/sctrDenuncia/app/services/externalServices.js'], function(ng){
  ng.module('sctrDenuncia.app')
    .controller('complaintDisabilityEditorMedicalAppointmentComponentController',['$scope', '$q', 'proxyLocation', 'proxyDisabilityRequest', 'mModalAlert', 'proxyClinicCoverage', 'accessSupplier', 'externalServices',
      function($scope, $q, proxyLocation, proxyDisabilityRequest, mModalAlert, proxyClinicCoverage, accessSupplier, externalServices){
        var vm = this;
        var profile = accessSupplier.profile();

        vm.appointments = [];

        vm.isVisibleDoctorInput = true;
        vm.isVisibleClinicaInput = true;

        vm.currentDate = new Date();
        
        function onInit(){
          vm.showDetail = vm.viewdata.codigoEstado == '4' || (vm.role == 3 || vm.role == 0);
          vm.showEdit = vm.viewdata.codigoEstado != '4' && (vm.role != 3 && vm.role != 0);

          proxyLocation.GetLocation(null, null, "Obteniendo departamentos...").then(function(resp){
            vm.departments = resp;
          });

          proxyDisabilityRequest.parametros(99, null, null, 15, 20, 1, false).then(function(resp){
            vm.optionsAnswer = resp.data;
          });

          vm.data = {};
          vm.data.doctor = "";
          vm.data.clinic = "";

          vm.cleanForm = true;

          cleanPager();

          getList();
        }

        // Mostrar input medico editable
        function mostrarInputMedico() {
          if (ng.isUndefined(vm.data.doctor)){
            vm.data.doctor = '';
          }

          vm.isVisibleDoctorInput = !vm.isVisibleDoctorInput;
          return vm.isVisibleDoctorInput;
        };

        // Mostrar input medico clinica
        function mostrarInputClinica() {
          if (ng.isUndefined(vm.data.clinic)){
            vm.data.clinic = '';
          }

          vm.isVisibleClinicaInput = !vm.isVisibleClinicaInput;
          return vm.isVisibleClinicaInput;
        };

        // Inicializar paginador
        function cleanPager() {
          vm.pagination = {
            maxSize: 10,
            sizePerPage: 10,
            currentPage: 1,
            totalRecords: 0,
          };
        }

        // Obtener el listado de citas
        function getList() {
          proxyDisabilityRequest.listCitaSolicitudInvalidez(vm.viewdata.solicitudId, vm.pagination.sizePerPage, vm.pagination.currentPage, "Obteniendo citas...").then(function(resp){
            if(resp.codigoRpta == 200) {
              vm.appointments = resp.data;
              angular.forEach(vm.appointments, function (a, b) {                
                if(a.fechaCita) {
                  var fecha = a.fechaCita.substr(0,10);
                  var fechas = fecha.split('-');
                  a.fechaCita = new Date(fechas[0], fechas[1] - 1, fechas[2]);
                } else {
                  a.fechaCita = null;
                }
              });
              vm.pagination.totalRecords = resp.totalRegistro;
              vm.viewdata.medicoAuditor = resp.data.length > 0 ? resp.data[0].medicoAuditor : null;
            } else {
              vm.appointments = [];
            }
          });
        }

        // Funcion cambio de pagina
        function pageChanged() {
          getList();
        }

        // Obtienes datos de medico
        function seekDoctor(wildcar, load) {
          var deferred = $q.defer();
          if (load) return deferred.resolve(vm.data.doctor);

          var params = {
            fName: wildcar.toUpperCase()
          };

          externalServices.getCgwListDoctor(params, false).then(
            function (r) {
              deferred.resolve(r.data.items);
            },
            function (r) {
              deferred.reject(r);
            }
          );

          return deferred.promise;
        }

        // Obtiene datos de clinica
        function seekClinic(wildcar, load) {
          var deferred = $q.defer();
          if (load) return deferred.resolve(vm.data.clinica);

          var params = { Wildcard: wildcar };
          proxyClinicCoverage.SeekClinic(params).then(
            function (r) {
              if (r && r.length > 0) {
                angular.forEach(r, function (a, b) {
                  a.fulltext = a.rsabrvda + " - " + a.dscrsl;
                });
              }
              deferred.resolve(r);
            },
            function (r) {
              deferred.reject(r);
            }
          );

          return deferred.promise;
        }

        // Obtener el detalle de una cita
        function getDetail(appointment, showDetail, showEdit) {
          proxyDisabilityRequest.getCitaSolicitudInvalidez(vm.viewdata.solicitudId, appointment.numeroItemId, "Obteniendo cita...").then(function(resp){
            if(resp.codigoRpta == 200) {
              vm.data.comment = resp.data.comentario;
              vm.data.numeroItemId = resp.data.numeroItemId;

              vm.data.appointmentDate = new Date(resp.data.fechaCita);

              var datosHora = resp.data.horaCita.split(':');
              vm.data.schedule = new Date(
                vm.data.appointmentDate.getFullYear(),
                vm.data.appointmentDate.getMonth(),
                vm.data.appointmentDate.getDate(),
                parseInt(datosHora[0]),
                parseInt(datosHora[1])
              );

              vm.data.isAssisted = { 
                codigo: resp.data.indicadorAsistencia !== '' ? resp.data.indicadorAsistencia : "null",
                descripcion: resp.data.indicadorAsistencia !== '' ? resp.data.descripcionIndicador : null
              };

              vm.data.department = {
                codigo: resp.data.codigoDepartamento < 10 ? resp.data.codigoDepartamento + ' ' : resp.data.codigoDepartamento + '',
                descripcion: resp.data.descripcionDepartamento
              };

              if(resp.data.codigoMedico) {
                vm.isVisibleDoctorInput = true;
                vm.data.doctor = {
                  code: resp.data.codigoMedico,
                  fName: resp.data.nombresMedico,
                  doctorFullName: resp.data.codigoMedico + " - " + resp.data.nombresMedico
                };
                seekDoctor(resp.data.codigoMedico, true);
              } else {
                vm.isVisibleDoctorInput = false;
                vm.data.doctor = resp.data.nombresMedico;
              }

              if(resp.data.codigoProveedor) {
                vm.isVisibleClinicaInput = true;
                var datosClinica = resp.data.nombreClinica.split('-');

                vm.data.clinic = {
                  rsaynmbrs: datosClinica[0].trim(),
                  dscrsl: datosClinica.length > 1 ? datosClinica[1].trim() : '',
                  cprvdr: resp.data.codigoProveedor,
                  nsprvdr: resp.data.numeroSucursal,
                  fulltext: resp.data.nombreClinica
                };
                seekClinic(resp.data.codigoProveedor, true);
              } else {
                vm.isVisibleClinicaInput = false;
                vm.data.clinic = resp.data.nombreClinica;
              }

              vm.showDetail = showDetail;
              vm.showEdit = showEdit;
            } else {
              mModalAlert.showError("Hubo un error al obtener los datos de la cita.", "Citas Médicas");
            }
          });  
        }

        // Mostrar vista lectura de citas
        function show(appointment) {
          getDetail(appointment, true, false);
        }

        // Habilitar edicion de una cita
        function edit(appointment) {
          getDetail(appointment, true, true);
        }

        // Cancelar solicitud y regresar a tab inicial
        function cancel() {
          vm.clear();
        }

        // Limpiar formulario de cita
        function clear() {
          vm.cleanForm = true;
          vm.data = {};
          vm.data.doctor = "";
          vm.data.clinic = "";
          vm.data.department = "";
          vm.data.appointmentDate = "";
          vm.data.schedule = "";
          vm.data.isAssisted = "";
          vm.data.comment = "";
          vm.showDetail = vm.viewdata.codigoEstado == '4'|| (vm.role == 3 || vm.role == 0)
          vm.showEdit = vm.viewdata.codigoEstado != '4' && (vm.role != 3 && vm.role != 0);
          vm.isVisibleClinicaInput = true;
          vm.isVisibleDoctorInput = true;
        }

        // Regitrar una cita
        function register() {
          vm.cleanForm = false;
          if (!$scope.frmMedicalAppointment.$valid) {
            $scope.frmMedicalAppointment.markAsPristine();
            mModalAlert.showError("Verifique que los datos de la cita estén correctos.", "Cita Médica");
            return;
          }

          var fechaCita = new Date(
            vm.data.appointmentDate.getFullYear(),
            vm.data.appointmentDate.getMonth(),
            vm.data.appointmentDate.getDate()
          );

          var body = {
            codigoDepartamento: vm.data.department.codigo,
            codigoMedico: vm.isVisibleDoctorInput ? vm.data.doctor.code : '0',
            codigoProveedor: vm.isVisibleClinicaInput ? vm.data.clinic.cprvdr : '0',
            codigoUsuario: profile.loginUserName,
            comentario: vm.data.comment ? vm.data.comment.toUpperCase() : '',
            fechaCita: fechaCita,
            horaCita: vm.data.schedule.getHours().toString().padStart(2, '0')+":"+vm.data.schedule.getMinutes().toString().padStart(2, '0'),
            indicadorAsistencia: vm.data.isAssisted.codigo,
            nombreClinica: vm.isVisibleClinicaInput ? vm.data.clinic.rsabrvda : vm.data.clinic.toUpperCase(),
            nombresMedico: vm.isVisibleDoctorInput ? vm.data.doctor.fName : vm.data.doctor.toUpperCase(),
            numeroSucursal: vm.isVisibleClinicaInput ? vm.data.clinic.nsprvdr : '0',
            opt: 1
          };

          if(vm.data.numeroItemId) {
            proxyDisabilityRequest.setCitaSolicitudInvalidez(body, vm.viewdata.solicitudId, vm.data.numeroItemId, "Actualizando cita...").then(function(resp){
              if(resp.codigoRpta == 200) {
                mModalAlert.showSuccess("Se ha actualizado la información de la cita", "Citas Médicas");
  
                clear();
                getList();
              } else {
                mModalAlert.showError("Hubo un error al actualizar la cita.", "Citas Médicas");
              }
            });
          } else {
            proxyDisabilityRequest.newCitaSolicitudInvalidez(body, vm.viewdata.solicitudId, "Registrando cita...").then(function(resp){
              if(resp.codigoRpta == 200) {
                mModalAlert.showSuccess("Hemos enviado un correo con el detalle de la cita médica al correo " + vm.viewdata.email + ".", "Tu cita ha sido registrada satisfactoriamente");
  
                clear();
                getList();
              } else {
                mModalAlert.showError("Hubo un error al registrar la cita.", "Citas Médicas");
              }
            });
          }
        }
        
        vm.$onInit = onInit;
        vm.mostrarInputMedico = mostrarInputMedico;
        vm.mostrarInputClinica = mostrarInputClinica;
        vm._pageChanged = pageChanged;
        vm.seekDoctor = seekDoctor;
        vm.seekClinic = seekClinic;
        vm.show = show;
        vm.edit = edit;
        vm.cancel = cancel;
        vm.clear = clear;
        vm.register = register;
      }
    ])
    .component("complaintDisabilityEditorMedicalAppointment", {
      templateUrl: "/sctrDenuncia/app/complaint/disabilityEditor/medicalAppointment/complaint-editor-medical-appointment.html",
      controller: "complaintDisabilityEditorMedicalAppointmentComponentController",
      bindings: {
        viewdata: "=?",
        emitFnMedicalAppointment: "&?",
        role:"=?"
      }
    })
});
