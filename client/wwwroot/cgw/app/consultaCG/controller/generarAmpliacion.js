define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js', 'modalPresupuesto'
], function(ng, constants) {

  generarAmpliacionController.$inject = ['$scope', '$rootScope', '$uibModal', '$timeout', 'cgwFactory', '$stateParams', '$state', 'mModalAlert', 'mModalConfirm', '$http', 'mpSpin', 'oimClaims'];

  function generarAmpliacionController($scope, $rootScope, $uibModal, $timeout, cgwFactory, $stateParams, $state, mModalAlert, mModalConfirm, $http, mpSpin, oimClaims) {

    (function onLoad() {

      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;
      $scope.flagClinic = $stateParams.flag;
      $scope.filesT = [];

      getValueIGV();
      $scope.subtotal = 0;

      if (constants.environment === 'QA') {
        $scope.statusLetter = constants.module.cgw.statusLetter.QA;
        $scope.statusAuditoria = constants.module.cgw.statusAuditoria.QA;
      } else  if (constants.environment === 'DEV') {
        $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
        $scope.statusAuditoria = constants.module.cgw.statusAuditoria.DEV;
      } else {
        $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
        $scope.statusAuditoria = constants.module.cgw.statusAuditoria.PROD;
      }

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

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

              $scope.isSOAT = ($scope.cartaGarantia.productName === 'SOAT');
              $scope.isSCTR = ($scope.cartaGarantia.productName === 'SCTR');

              getBudget();

            } else {
                $state.go('consultaCgw', {reload: true, inherit: false});
              }
            }, function(error) {
              $state.go('consultaCgw', {reload: true, inherit: false});
            });
       }
      });

    })();

    $scope.$watch('myFile', function() {
      if ($scope.myFile !== undefined)
        $scope.filesT.push($scope.myFile);
    });

    $scope.collapse1 = false;
    $scope.collapse2 = false;
    $scope.collapse3 = false;

    function getBudget() {
      var paramsBudget = {
        CodeProvider: $scope.cartaGarantia.codeSeps,
        Flag: 1,
        CodeCompany: $scope.letterCia
      };

      cgwFactory.getListBudgets(paramsBudget, true).then(function(response) {

        if (response.data.items.length>0) {
          $scope.procedimientos = response.data.items;
        }
       }, function(error) {
          mModalAlert.showError('Al cargar el presupuesto', 'Error');
        });
    }

    function getValueIGV() {

      var paramsValueIGV = {
        CodeCompany: parseInt($scope.letterCia),
        Date: new Date()
      };

      cgwFactory.getValueIGV(paramsValueIGV, true).then(function(response) {
        $scope.valorIGV = response.data.igv;
        $scope.getSubtotal();
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    $scope.getSubtotal = function() {
      $scope.subtotal = 0;

      ng.forEach($scope.procedimientos, function(value,key) {
        $scope.subtotal += $scope.procedimientos[key].price;
      });

      $scope.montoIGV = $scope.subtotal * ($scope.valorIGV/100);
      $scope.total = $scope.subtotal + $scope.montoIGV;
    };

    $scope.cargarPresupuesto = function cpFn(codProcedimiento) {
      $scope.procedimientos.every(function(value,key) {
        if ($scope.procedimientos[key].code === codProcedimiento) {
          $scope.detalleProcedimiento = $scope.procedimientos[key];
          return false;
        } else {return true;}
      });

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--500 modal--budget fade',
        template: '<mpf-modal-presupuesto data="data" close="close()" grabar="grabar()"></mpf-modal-presupuesto>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.grabar = function() {
            $timeout(function() {
                $scope.getSubtotal();
            }, 500);

            $uibModalInstance.close();
          };
          scope.data = {
            lista: $scope.detalleProcedimiento
          };
        }]
      });
    };

    $scope.deleteFile = function(index, array) {
      var filesBkp = [];

      ng.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        }
      });

      $scope.filesT = filesBkp;
    };

    function getTramaCarta() {
      $scope.Budgets = [];

      ng.forEach($scope.procedimientos, function(value,key1) {
        ng.forEach($scope.procedimientos[key1].details, function(value,key) {
          var procedimiento = {
            CodeBudget: $scope.procedimientos[key1].details[key].codeDetail,
            requestedAmount: $scope.procedimientos[key1].details[key].price,
            approvedAmount: $scope.procedimientos[key1].details[key].price,
            observation: ""
          };
          if ($scope.procedimientos[key1].details[key].price>0)
            $scope.Budgets.push(procedimiento);
        });
      });

      var paramsCarta =
        {
          GuaranteeLetter:
            {
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
              Version: $scope.letterVersion,
              CodeCompany: $scope.letterCia,
              UserCreate: "",
              ProductCode: $scope.cartaGarantia.productCode,// === 'SALUD') ? 'S' : 'R',// Producto. S Salud, R SCTR
              AccidentDate: $scope.cartaGarantia.accidentDate,
              ProviderCode: parseInt($scope.cartaGarantia.providerCode),
              ProviderNumber: 1, // Numero proveedor fijo por ahora preguntar
              BeneficiaryCode: $scope.cartaGarantia.benefitCode, //codigo cobertura AQUIIII
              BranchClinicCode: $scope.cartaGarantia.branchClinicCode,
              Cacnta: 0, // fijo
              Iacgrnta: 0, // fijo
              CurrencyCode: 1, // moneda
              UserForced: ($scope.cartaGarantia.userForced === "") ? 0 : $scope.cartaGarantia.userForced,
              AuthorizationDetail: $scope.cartaGarantia.authorizationDetail,
              Nacpln: $scope.cartaGarantia.nacpln,
              ForcedCopayment: 0, //cambiar (typeof $scope.formData.copayForced.idForced != 'undefined') ? $scope.formData.copayForced.idForced : 1, //1, // copago forzado popup
              Cerspsta: '', // fijo
              StateCode: $scope.cartaGarantia.stateId,//1, // fijo
              ClientCode: ($scope.cartaGarantia.clientCode !== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,//$scope.cartaGarantia.clientCode,
              Contract: $scope.cartaGarantia.clientNumber, //'3790', $scope.formData.policyholderInfo.contractNumber,
              EffectiveDate: $scope.cartaGarantia.effectiveDate,
              FixedCopayment: $scope.cartaGarantia.fixedCopayment,
              VariableCopayment: $scope.cartaGarantia.variableCopayment,
              NumberPlan: $scope.cartaGarantia.numberPlan,
              Mail: $scope.cartaGarantia.email,
              PhoneNumber: $scope.cartaGarantia.phoneNumber,
              DiagnosticCode: $scope.cartaGarantia.diagnosticCode,
              CoverageCode: $scope.cartaGarantia.coverageCode, //cambiar $scope.formData.cobertura.coverage,//ZU, // En servicio affiliate/load, obtiene un array de coberturas
              Policyholder:
                {
                  License: $scope.cartaGarantia.affiliateCode,
                  FullName: $scope.cartaGarantia.policyholderFullName,
                  ContractNumber: $scope.cartaGarantia.clientNumber,//'3790', $scope.formData.policyholderInfo.contractNumber,
                  CompanyName: $scope.cartaGarantia.companyName,
                  RucNumber: $scope.cartaGarantia.clientDocumentNumber,
                  Currency: $scope.cartaGarantia.currency,
                  AffiliateDate: $scope.cartaGarantia.affiliationDate,
                  ContractDate: $scope.cartaGarantia.affiliationDate//"3/1/2008", (typeof $scope.formData.policyholderInfo.contractDate != 'undefined') ? $scope.formData.policyholderInfo.contractDate : ''
                },
              Patient:
                {
                  FullName: $scope.cartaGarantia.patientFullName,
                  Sex: $scope.cartaGarantia.sex,
                  Kinship: $scope.cartaGarantia.relationship
                },
              GuaranteeLetterVersion :
                {
                  Year: $scope.yearLetter,
                  Number: $scope.letterNumber,
                  Version: $scope.letterVersion,
                  RequestedAmount: $scope.cartaGarantia.requestedAmount, // Importe total (suma de procedimientos * 1.18 igv)
                  AprrovedAmount: $scope.cartaGarantia.approvedAmount,
                  TypeAttention: $scope.cartaGarantia.typeAttention,
                  DaysOfHospitalization: $scope.cartaGarantia.daysOfHospitalization,
                  DoctorCode: $scope.cartaGarantia.doctorCode,
                  DoctorFullName : $scope.cartaGarantia.doctorFullName,
                  DoctorRemark: $scope.cartaGarantia.doctorRemark,
                  LetterObservation: '',
                  Oacnta: '',
                  StatusLetter: $scope.cartaGarantia.stateId,
                  CodeCompany: $scope.letterCia,
                  UserCreate: ""
                }
            },
            Budgets: $scope.Budgets,//$scope.procedimientosSolicitados,
            AttachFiles: [
              {
              }
            ]
        };

      return paramsCarta;
    }

    $scope.showCrearAmpliacion = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditado.code &&
            $scope.letterVersion === "1");
        }else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
        $scope.roleCode === constants.module.cgw.roles.admin.description ||
        $scope.roleCode === constants.module.cgw.roles.supervisor.description) { //EJEC
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code &&
          $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code &&
          $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code &&
          $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code &&
            $scope.letterVersion==="1");
        }else if ($scope.roleCode === constants.module.cgw.roles.ejeSI24.description) { //SI24
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observada.code &&
            $scope.letterVersion==="1");
        }else if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) { //med externo
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code &&
            $scope.letterVersion==="1");
        }else if ($scope.roleCode === constants.module.cgw.roles.clinica.description) { //crear ampliacopn
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
              $scope.cartaGarantia.stateId === $scope.statusLetter.liquidado.code ||
              $scope.cartaGarantia.stateId === $scope.statusLetter.procesada.code ||
              $scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code &&
              $scope.letterVersion==="1");
        }
    };

    $scope.crearAmpliacion = function() {

      if (!$scope.filesT.length>0)
          $scope.showFileError = true;

      if ($scope.showCrearAmpliacion())
        if ($scope.mObsExterna && $scope.subtotal>0 && $scope.filesT.length>0) {
           $scope.showFileError = false;
           mModalConfirm.confirmInfo('¿Estás seguro que desea crear la ampliación?','CREAR AMPLIACIÓN','').then(function(response) {
            if (response) {
              var paramsFile = getTramaCarta();
                  paramsFile.GuaranteeLetter.DeductibleAmount = 0;
                  paramsFile.GuaranteeLetter.ForcedCopayment = 0;
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = 0;
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
                  paramsFile.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.mObsExterna;

              var fd = new FormData();
              fd.append("request", JSON.stringify(paramsFile));

              if ($scope.filesT === undefined) {
               // fd.append("fieldNameHere", null);
              } else {
                for(var i=0; i<$scope.filesT.length; i++) {
                  fd.append("fieldNameHere", $scope.filesT[i][0]);
                }
              }

              $http.post(constants.system.api.endpoints.cgw + 'api/guaranteeletter/generate/medicalextension', fd, {
                transformRequest: ng.identity,
                headers: {'Content-Type': undefined},
                eventHandlers: {
                  progress: function(c) {
                  }
                },
                uploadEventHandlers: {
                  progress: function(e) {
                    mpSpin.start();
                  }
                }
              })
              .success(function(response) {
                mpSpin.end();
                if (response.operationCode === 500)
                  mModalAlert.showError(response.data, 'Error');
                else
                  mModalAlert.showSuccess(response.data.message, 'Ampliación Creada').then(function(response) {
                     if (response) {
                        $state.go('consultaCgw', {reload: true, inherit: false});
                     }
                  });
              })
              .error(function() {
                mModalAlert.showError('Error al crear la ampliación', 'Error');
                mpSpin.end();
              });
            }
          });
         } else {
          if (!$scope.subtotal>0) {
            mModalAlert.showError('Ingrese un monto mayor a cero', 'Error');
          }
         }
    };

    $scope.update = function (mount, code) {
      ng.forEach($scope.coberturasPowerEPS, function(value,key) {
        if (value.code === code) {
          value.mount = mount;
          $scope.subtotal += value.mount;
        }
      });
      calcularTotal();
    };

    function calcularTotal() {
      $scope.montoIGV = $scope.subtotal * ($scope.valorIGV/100);
      $scope.total = $scope.subtotal + $scope.montoIGV;
    }

  } //  end controller

  return ng.module('appCgw')
    .controller('generarAmpliacionController', generarAmpliacionController);
});
