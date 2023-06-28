define([
  'angular', 'constants', '/cgw/app/factory/cgwFactory.js', 'mfpModalGenerarInforme'
], function(ng, constants) {

  detalleConsultaAuditorController.$inject = ['$scope', '$rootScope', '$stateParams', 'cgwFactory', '$uibModal', '$window', '$state', 'mModalAlert', '$timeout', '$sce', 'oimClaims'];

  function detalleConsultaAuditorController($scope, $rootScope, $stateParams, cgwFactory, $uibModal, $window, $state, mModalAlert, $timeout, $sce, oimClaims) {

    (function onLoad() {
      $scope.formData = $rootScope.formData || {};

      $scope.enMora = true; // cuando el asegurado está en mora por más de 3 meses
      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;
      $scope.externalAuditNumber = $stateParams.auditNumber;
      $scope.flagClinic = parseInt($stateParams.flag);

      if ($stateParams.auditNumber>0)
        $scope.auditado = true;
      else
        $scope.auditado = false;

      $scope.carta = {};
      $scope.carta.estado = '1';

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data){
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;
       }
      });

      getListExternalAudit();
      getDetailExternalAudit();

    })();

    function getListExternalAudit(){
      cgwFactory.getListExternalAudit().then(function (response) {
        if (response.data.items.length > 0) {
          $scope.auditores = response.data.items;
        }
      });
    }

    function getDetailExternalAudit(){

      var paramsExternalAudit =
      {
        CodeCompany: parseInt($scope.letterCia),
        Year: parseInt($scope.yearLetter),
        Number: parseInt($scope.letterNumber),
        Version: parseInt($scope.letterVersion),
        ExternalAuditNumber: parseInt($scope.externalAuditNumber)
      };

      cgwFactory.getDetailExternalAudit(paramsExternalAudit).then(function (response) {
        if (response.data.items) {
          $scope.externalAudit = response.data.items[0];
          if ($scope.externalAudit){
            $scope.formData = {
              //mAuditorExterno: $scope.externalAudit.idExternalAuditor + '-' + $scope.externalAudit.externalAuditor,
              mModalidadPoliza: $scope.externalAudit.policyMode,
              mFechaSolicitud: $scope.externalAudit.createdDate,
              //mFechaSolicitud2: cgwFactory.formatearFecha($scope.externalAudit.createdDate),
              mPaciente: $scope.externalAudit.patientFullName,
              mEdad: $scope.externalAudit.age,
              mFip: $scope.externalAudit.effectiveDate,//new Date($scope.externalAudit.affiliationDate),
              //mFip2: cgwFactory.formatearFecha(new Date($scope.externalAudit.affiliationDate)),
              mContinuidad: $scope.externalAudit.continuity,
              mExclusiones: $scope.externalAudit.exclusion,
              mDiagnostico: $scope.externalAudit.diagnosticCode + '-' + $scope.externalAudit.diagnostic,
              mTratamientoProcedimiento: $scope.externalAudit.treatment,
              mClincasCentros: $scope.externalAudit.clinicOrMedicalCenter,
              mRequerimiento: "HC: \n" +
                    "DIRECCIÓN: \n" +
                    "TELÉFONO: \n" +
                    "DNI: \n" +
                    "OCUPACIÓN:\n" +
                    "CONDICIÓN:\n" +
                    "MEDICO TRATANTE:\n" +
                    "FECHA DE INGRESO:\n" +
                    "FECHA DE ALTA:\n" +
                    "EDAD:\n" +
                    "TIEMPO DE ENFERMEDAD:\n" +
                    "TIEMPO DE EPISODIO ACTUAL:\n" +
                    "ANTECEDENTES:\n" +
                    "PRE EXISTENCIAS:\n" +
                    "ENFERMEDAD ACTUAL:\n" +
                    "DIAGNOSTICO DE INGRESO:\n" +
                    "DIAGNOSTICO DE CONCUERRENCIA:\n" +
                    "PRUEBAS AUXILIARES:\n" +
                    "ATENCIONES ANTERIORES\n" +
                    "CONSULTA EXTERNA\n" +
                    "HOSPITALIZACIONES\n" +
                    "EMERGENCIAS",
              mInfoAdicional: $scope.externalAudit.additionalInformation,
              comment: $scope.externalAudit.comment,
              state: $scope.externalAudit.state,
              report: $scope.externalAudit.report
            };

            if ($scope.flagClinic === 0){
              $scope.formData.mAuditorExterno = {
                code: $scope.externalAudit.idExternalAuditor,
                fullName: $scope.externalAudit.externalAuditor
              };
            }else{
              $scope.formData.mAuditorExterno = $scope.externalAudit.idExternalAuditor + '-' + $scope.externalAudit.externalAuditor;
            }

          }else{

            var paramsLetter =
            {
              CompanyId: parseInt($scope.letterCia),
              Year: parseInt($scope.yearLetter),
              Number: parseInt($scope.letterNumber),
              Version: parseInt($scope.letterVersion)
            };

            cgwFactory.getDetailLetter(paramsLetter).then(function (response) {
              if (response.data) {
                $scope.cartaGarantia = response.data;

                if ($scope.cartaGarantia.productCode === 'SCTR')
                  $scope.isSCTR = true;
                else
                  $scope.isSCTR = false;


                $scope.formData = {
                  mModalidadPoliza: $scope.cartaGarantia.companyName,
                  mFechaSolicitud: new Date(),
                 // mFechaSolicitud2: cgwFactory.formatearFecha(new Date()),
                  mPaciente: $scope.cartaGarantia.patientFullName,
                  mEdad: $scope.cartaGarantia.age,
                  mFip: $scope.cartaGarantia.effectiveDate,//cgwFactory.formatearFecha(new Date($scope.cartaGarantia.affiliationDate)),
                  mContinuidad: '',
                  mExclusiones: '',
                  mDiagnostico: $scope.cartaGarantia.diagnosticCode + '-' + $scope.cartaGarantia.diagnostic,
                  mTratamientoProcedimiento: $scope.cartaGarantia.doctorRemark,
                  mClincasCentros: $scope.cartaGarantia.branchClinic,
                  mRequerimiento: "HC: \n" +
                    "DIRECCIÓN:\n" +
                    "TELÉFONO:\n" +
                    "DNI:\n" +
                    "OCUPACIÓN:\n" +
                    "CONDICIÓN:\n" +
                    "MEDICO TRATANTE:\n" +
                    "FECHA DE INGRESO:\n" +
                    "FECHA DE ALTA:\n" +
                    "EDAD:\n" +
                    "TIEMPO DE ENFERMEDAD:\n" +
                    "TIEMPO DE EPISODIO ACTUAL:\n" +
                    "ANTECEDENTES:\n" +
                    "PRE EXISTENCIAS:\n" +
                    "ENFERMEDAD ACTUAL:\n" +
                    "DIAGNOSTICO DE INGRESO:\n" +
                    "DIAGNOSTICO DE CONCUERRENCIA:\n" +
                    "PRUEBAS AUXILIARES:\n" +
                    "ATENCIONES ANTERIORES\n" +
                    "CONSULTA EXTERNA\n" +
                    "HOSPITALIZACIONES\n" +
                    "EMERGENCIAS",
                  mInfoAdicional: '',
                  state: $scope.cartaGarantia.statusLetter
                };

              }
            }, function(error){
              //deferred.reject(error.statusText);
            });
          }

          getListFileInformeAuditoria(paramsExternalAudit);

        }
      });
    }

    $scope.crearAuditoria = function(){

      $scope.disabledButton = true;

      //$scope.formData.cgwDataTicket = JSON.parse($window.sessionStorage.getItem('cgwDataTicket'));
      var paramsCreateAudit = { // ExternalAuditSaveRq
        CodeCompany: parseInt($scope.letterCia),
        Year: parseInt($scope.yearLetter),
        Number: parseInt($scope.letterNumber),
        Version: parseInt($scope.letterVersion),
        Report: (typeof $scope.formData.report === 'undefined') ? '' :  $scope.formData.report,
        IdExternalAuditor: (typeof $scope.formData.mAuditorExterno.code === 'undefined') ? '' :  $scope.formData.mAuditorExterno.code,
        UserCreate: oimClaims.loginUserName.toUpperCase(),
        PolicyMode: (typeof $scope.formData.mModalidadPoliza === 'undefined') ? '' :  $scope.formData.mModalidadPoliza,
        PolicyStartDate: (typeof $scope.formData.mFip === 'undefined') ? '' :  cgwFactory.formatearFecha($scope.formData.mFip),
        Continuity: (typeof $scope.formData.mContinuidad === 'undefined') ? '' :  $scope.formData.mContinuidad,
        Exclusion: (typeof $scope.formData.mExclusiones === 'undefined') ? '' :  $scope.formData.mExclusiones,
        Treatment: (typeof $scope.formData.mTratamientoProcedimiento === 'undefined') ? '' :  $scope.formData.mTratamientoProcedimiento,
        ClinicOrMedicalCenter: (typeof $scope.formData.mClincasCentros === 'undefined') ? '' :  $scope.formData.mClincasCentros,
        Requirements: (typeof $scope.formData.mRequerimiento === 'undefined') ? '' :  $scope.formData.mRequerimiento,
        AdditionalInformation: (typeof $scope.formData.mInfoAdicional === 'undefined') ? '' :  $scope.formData.mInfoAdicional,
        State: (typeof $scope.formData.state === 'undefined') ? '' :  $scope.formData.state
      };

       cgwFactory.crearAuditoria(paramsCreateAudit).then(function (response) {
        if (response.data) {
          $scope.auditoria = response.data;
          $scope.formData.mFechaSolicitud = $scope.auditoria.createdDate;
          //$scope.formData.mFechaSolicitud2 = new Date($scope.auditoria.createdDate);
          $scope.formData.externalAuditNumber = $scope.auditoria.numberExternalAudit;

           mModalAlert.showSuccess("Se ha registrado correctamente la Auditoría Externa",'','').then(function(response){
           if (response) {
            window.history.back();
           }
          });

          $scope.disabledButton = false;
        }
      });
    };

    $scope.updateAuditoria = function(){
      $scope.disabledButton = true;
      var paramsUpdateAudit =
      { // ExternalAuditUpdateRq // guarda en la ultima auditoria externa
        CodeCompany: parseInt($scope.letterCia),
        Year: parseInt($scope.yearLetter),
        Number: parseInt($scope.letterNumber),
        Version: parseInt($scope.letterVersion),
        Report: (typeof $scope.externalAudit.report === 'undefined') ? '' :  $scope.externalAudit.report,
        UserUpdate: (typeof $scope.oimClaims.loginUserName === 'undefined') ? '' :  $scope.oimClaims.loginUserName,
        StateId: 3,
        IncludeInfo: 1 // 0 no graba report, con 1 si graba report
      };

      cgwFactory.updateAuditoria(paramsUpdateAudit).then(function (response) {
        if (response.data) {
          $scope.auditoria = response.data;
          getDetailExternalAudit();
          $scope.disabledButton = false;
        } else {
          $scope.disabledButton = false;
        }
      });
    };

    function alertaGenerarInforme() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        size: 'lg',
        scope: $scope,
        template: '<mfp-modal-generar-informe data="data" close="close()"></mfp-modal-generar-informe>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function clFn() {
            $uibModalInstance.close();
            getDetailExternalAudit();
          };
          scope.generarInforme = function giFn() {
            $timeout(function() {
              $uibModalInstance.close();
            }, 1500);

          };
          // Los parametros que recibe el componente estan detallados en el js del componente
          scope.data = {
            letterNumber : $scope.letterNumber,
            yearLetter : $scope.yearLetter,
            letterVersion : $scope.letterVersion,
            letterCia : $scope.letterCia,
            mFechaSolicitud: (typeof $scope.formData.mFechaSolicitud === 'undefined') ? new Date() :  $scope.formData.mFechaSolicitud,
            externalAuditNumber : $scope.externalAuditNumber,
            fullName : (typeof $scope.formData.mAuditorExterno.fullName === 'undefined') ? $scope.formData.mAuditorExterno :  $scope.formData.mAuditorExterno.fullName,

            mContinuidad : (typeof $scope.formData.mContinuidad === 'undefined') ? '' :  $scope.formData.mContinuidad,
            mFip: (typeof $scope.formData.mFip === 'undefined') ? new Date() :  $scope.formData.mFip,
            mModalidadPoliza : (typeof $scope.formData.mModalidadPoliza === 'undefined') ? '' :  $scope.formData.mModalidadPoliza,
            mPaciente : (typeof $scope.formData.mPaciente === 'undefined') ? '' :  $scope.formData.mPaciente,
            mEdad: (typeof $scope.formData.mEdad === 'undefined') ? '' :  $scope.formData.mEdad,
            mExclusiones: (typeof $scope.formData.mExclusiones === 'undefined') ? '' :  $scope.formData.mExclusiones,
            mRequerimiento: (typeof $scope.formData.mRequerimiento === 'undefined') ? '' :  $scope.formData.mRequerimiento,
            mInfoAdicional: (typeof $scope.formData.mInfoAdicional === 'undefined') ? '' :  $scope.formData.mInfoAdicional,

            mDiagnostico: (typeof $scope.formData.mDiagnostico === 'undefined') ? '' :  $scope.formData.mDiagnostico,
            mTratamientoProcedimiento : (typeof $scope.formData.mTratamientoProcedimiento === 'undefined') ? '' :  $scope.formData.mTratamientoProcedimiento,
            mClincasCentros :  (typeof $scope.formData.mClincasCentros === 'undefined') ? '' :  $scope.formData.mClincasCentros,
            comment: (typeof $scope.formData.comment === 'undefined') ? '' : $scope.formData.comment,
            title: 'Informe de Auditoria Externa',
            subtitle: 'Estás seguro de generar el informe',
            btns: [
              {
                lbl: 'guardar',
                accion: scope.close,
                clases: 'g-btn-transparent'
              },
              {
                lbl: 'Finalizar Informe',
                accion: scope.generarInforme,
                clases: 'g-btn-verde'
              }
            ],
            rolConsultaCGW: $scope.isRolConsulta
          };

        }] // end Controller uibModal
      });
    }

    $scope.generarInforme = function sgiFn() {
      if ($scope.externalAuditNumber !== 0)
        $scope.isRolConsulta = $scope.rolConsulta();
        alertaGenerarInforme();
    };
    $scope.showGenerarInforme = function() {
      return ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
        $scope.roleCode === constants.module.cgw.roles.admin.description ||
        $scope.roleCode === constants.module.cgw.roles.ejeSI24.description ||
        $scope.roleCode === constants.module.cgw.roles.supervisor.description);
    };

    function getListFileInformeAuditoria(params) {
      cgwFactory.getListFileInformeAuditoria(params).then(function(response) {
        if (response.data.items.length > 0) {
          $scope.filesAuditoria = response.data.items;
        }
      });
    }

    $scope.downloadAdjunto = function(name) {
      $scope.fileAuditoriaExtURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/externalaudit/attachfile/download');
      $scope.downloadAtachFile = {
        FileNameLarge: name
      };// downloadAdjuntoAE

      $timeout(function() {
        document.getElementById('frmFileuditoriaExt1').submit();
      }, 500);
    };

    $scope.isAuditado = function() {
      return ($scope.formData.state !== "AUDITADO");
    };

    $scope.rolConsulta = function() {
      return $scope.roleCode === constants.module.cgw.roles.consulta.description || $scope.roleCode === constants.module.cgw.roles.coordinador.description;
    };

  } //  end controller

  return ng.module('appCgw')
    .controller('DetalleConsultaAuditorController', detalleConsultaAuditorController)
    .directive('preventDefault', function() {
      return function(scope, element, attrs) {
          angular.element(element).bind('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
          });
      }
    });
});
