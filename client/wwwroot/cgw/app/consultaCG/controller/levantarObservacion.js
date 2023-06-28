define([
  'angular', 'constants', 'modalPresupuesto',
  '/cgw/app/factory/cgwFactory.js',
  '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea.js',
  '/cgw/app/solicitudCG/component/modalPreExistencias.js', 'mfpModalBuscarDiagnostico'
], function(ng, constants) {

  levantarObservacionController.$inject = ['$scope', '$rootScope', '$uibModal', '$timeout', 'cgwFactory', '$stateParams', '$state', '$sce', 'mpSpin', 'mModalConfirm', 'mModalAlert', '$http', 'oimClaims'];

  function levantarObservacionController($scope, $rootScope, $uibModal, $timeout, cgwFactory, $stateParams, $state, $sce, mpSpin, mModalConfirm, mModalAlert, $http, oimClaims) {

  	(function onLoad() {

      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;
      $scope.flagClinic = $stateParams.flag;
      $scope.filesT = [];

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

      getValueIGV();
      $scope.subtotal = 0;

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

              if($scope.cartaGarantia.productCode === 'SCTR' || $scope.cartaGarantia.productCode === 'SALUD') {

                var paramsAfiliado = {
                  CodeProvider: $scope.cartaGarantia.providerCode,
                  CodeBranchOffice: $scope.cartaGarantia.branchClinicCode,
                  PlanNumber: $scope.cartaGarantia.numberPlan,

                  RucNumber: $scope.cartaGarantia.clientDocumentNumber,
                  CodeSeps: $scope.cartaGarantia.codeSepsEmpty,
                  CodeCompany: $scope.cartaGarantia.codeCompany,

                  Entity: $scope.cartaGarantia.providerName,
                  CompanyName: $scope.cartaGarantia.company,
                  Product: $scope.cartaGarantia.productName,
                  CodeAffiliate: $scope.cartaGarantia.affiliateCode,
                  IdCompany: parseInt($scope.letterCia),
                  CorrelativeCode: $scope.cartaGarantia.correlativeCode
                };

                cgwFactory.getAffiliate_Load(paramsAfiliado, true).then(function(response) {
                  $scope.cartaGarantia.paramsAfiliado = response.data;
                  $scope.cartaGarantia.preexistences = response.data.preexistences;
                  $scope.cartaGarantia.remark = response.data.remark;
                  $scope.toSummary = ng.copy($scope.formData);  // para solo mostrar la info de paciente y titular
                }, function(error) {
                  mModalAlert.showError(error.data.message, 'Error');
                });

              }

              $scope.isSOAT = ($scope.cartaGarantia.productName === 'SOAT');
              $scope.isSCTR = ($scope.cartaGarantia.productName === 'SCTR');

              getProcedimientosSolicitados();
              getListArchivosAdjuntos();

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
        $scope.showFileError = false;
    });

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

    function getProcedimientosSolicitados() {

      $scope.paramsProcedimientosSolicitados = {
        Year: $scope.yearLetter,
        Number : $scope.letterNumber,
        Version : $scope.letterVersion,
        CompanyId: $scope.letterCia
      };

       cgwFactory.getAllProcedimientosSolicitados($scope.paramsProcedimientosSolicitados).then(function (response) {
        if (response.data.items) {
          $scope.procedimientosSolicitados = response.data.items;

          $scope.totalRequestedAmountProcedimientos = 0;
          $scope.totalApprovedAmountProcedimientos = 0;

          if ($scope.procedimientosSolicitados.length>0) {
            ng.forEach($scope.procedimientosSolicitados, function(value,key) {

              $scope.procedimientosSolicitados[key].CodeBudget = $scope.procedimientosSolicitados[key].code;

              $scope.totalRequestedAmountProcedimientos += $scope.procedimientosSolicitados[key].requestedAmount;
              $scope.totalApprovedAmountProcedimientos += $scope.procedimientosSolicitados[key].approvedAmount;
            });

            $scope.montoIGVProcedimientos = $scope.totalApprovedAmountProcedimientos * ($scope.valorIGV/100);
            $scope.totalAmountProcedimientos = $scope.montoIGVProcedimientos + $scope.totalApprovedAmountProcedimientos;
          }
        } else {
          console.log('Error en: getProcedimientosSolicitados')
          getValueIGV();
        }
      });
    }

    $scope.collapse1 = false;
    $scope.collapse2 = false;
    $scope.collapse3 = true;

    $scope.getObservaciones = function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template: '<mpf-modal-text-area data="observacionesData" close="close()"></mpf-modal-text-area>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.observacionesData = $scope.cartaGarantia.remark.description;
        }]
      });
    };

    $scope.getPreexistencias = function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--md fade',
        template: '<mpf-modal-pre-existencias data="data" close="close()"></mpf-modal-pre-existencias>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.data = {
            lista: $scope.cartaGarantia.preexistences
          };
        }]
      });
    };

    $scope.showObservaciones = function() {
      if ($scope.cartaGarantia) {
        if (!ng.equals({}, $scope.cartaGarantia.remark)) {
          return $scope.cartaGarantia.remark.description;
        }
      } else {
        return false;
      }
    };

    $scope.showPreExistencias = function() {
      if ($scope.cartaGarantia) {
        if ($scope.cartaGarantia.preexistences) {
          return $scope.cartaGarantia.preexistences.length > 0;
        }
      } else {
        return false;
      }
    };

    $scope.editarDiagnostico = function edFn() {
      var myModal = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--md',
        template: '<mfp-modal-buscar-diagnostico carta="dataCarta" close="close(a)" update="update()"></mfp-modal-buscar-diagnostico>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.dataCarta = {
              CodeCompany: parseInt($scope.letterCia),
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
              UserUpdate: $scope.cartaGarantia.defaultSignature,
              ShowObservaciones: true,
              DoctorRemark: $scope.cartaGarantia.doctorRemark,
              CodDiagnostico: {
                codeName: $scope.cartaGarantia.diagnosticCode + " " + $scope.cartaGarantia.diagnostic,
                code: $scope.cartaGarantia.diagnosticCode,
                name: $scope.cartaGarantia.diagnostic
              }
            };
            scope.close = function(type) {
              if (type && type === 'ok') {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
            scope.update = function() {
              $scope.cartaGarantia.doctorRemark = scope.dataCarta.DoctorRemark;
              $scope.cartaGarantia.diagnosticCode = scope.dataCarta.CodDiagnostico.code;
              $scope.cartaGarantia.diagnostic = scope.dataCarta.CodDiagnostico.name;
              $uibModalInstance.close();
            };
          }
        ]
      });

      myModal.result
        .then(function mdScFn() {
          // click en close
        })
        .catch(function mdErrFn() {
          // click en cancel
        });
    };

    $scope.cargarPresupuesto = function cpFn(codProcedimiento) {
      $scope.procedimientosSolicitados.every(function(value,key) {
        if ($scope.procedimientosSolicitados[key].code === codProcedimiento) {
          $scope.detalleProcedimiento = $scope.procedimientosSolicitados[key];
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
        template: '<mpf-modal-presupuesto data="data" close="close()" grabar="grabar(data)"></mpf-modal-presupuesto>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.grabar = function(val) {
            $timeout(function() {
                $scope.getSubtotal();
            }, 500);

            $scope.procedimientosSolicitados.every(function(value,key) {
              if ($scope.procedimientosSolicitados[key].code === codProcedimiento) {
                 $scope.procedimientosSolicitados[key] = scope.data.lista;
                return false;
              } else {return true;}
            });

            $uibModalInstance.close();
          };

          scope.data = {
            lista: $scope.detalleProcedimiento
          };
        }]
      });
    };

    $scope.getSubtotal = function() {
      $scope.subtotal = 0;

      ng.forEach($scope.procedimientosSolicitados, function(value,key) {
        $scope.subtotal += $scope.procedimientosSolicitados[key].requestedAmount;
      });

      $scope.montoIGV = $scope.subtotal * ($scope.valorIGV/100);
      $scope.total = $scope.subtotal + $scope.montoIGV;
    };

    function getListArchivosAdjuntos(params) {
      $scope.paramsListArchivosAdjuntos = {
        Year: parseInt($scope.yearLetter),
        Number : parseInt($scope.letterNumber),
        Version : parseInt($scope.letterVersion),
        CompanyId: parseInt($scope.letterCia)
      };

       cgwFactory.getListArchivosAdjuntos($scope.paramsListArchivosAdjuntos).then(function (response) {
        if (response.data.items) {
          $scope.files = response.data.items;
        }
      });
    }

    $scope.deleteFile = function(index, array) {
      var filesBkp = [];

      ng.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        }
      });

      $scope.filesT = filesBkp;
    };

    $scope.downloadAttachFileCGW = function(value) {
      var paramsFile = {
        FileNameLarge: value.fileNameLarge
      };

      $scope.attachFileCGWURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/guaranteeletter/attachfile/download');
      $scope.downloadAtachFile = paramsFile;

      $timeout(function() {
        document.getElementById('frmAttachFileCGW').submit();
      }, 500);
    };

    function getTramaCarta() {

      $scope.Budgets = [];

      ng.forEach($scope.procedimientosSolicitados, function(value,key1) {
        ng.forEach($scope.procedimientosSolicitados[key1].details, function(value,key) {
          var procedimiento = {
            CodeBudget: $scope.procedimientosSolicitados[key1].details[key].codeDetail,
            requestedAmount: $scope.procedimientosSolicitados[key1].details[key].requestedAmount,
            approvedAmount: $scope.procedimientosSolicitados[key1].details[key].approvedAmount,
            observation: ""
          };
          if ($scope.procedimientosSolicitados[key1].details[key].requestedAmount>0)
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

    $scope.showLevantarObservacion = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditado.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
        $scope.roleCode === constants.module.cgw.roles.admin.description ||
        $scope.roleCode === constants.module.cgw.roles.supervisor.description) { //EJEC
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.clinica.description) { //clinica
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code);
        }
    };

    $scope.levantarObs = function() {
      if ($scope.roleCode === constants.module.cgw.roles.clinica.description) {//clinica
        if ($scope.showLevantarObservacion() && (!(typeof $scope.filesT === 'undefined') && $scope.filesT.length > 0)) {
             $scope.showFileError = false;
             if ($scope.mObsExterna) {
                mModalConfirm.confirmInfo('¿Estás seguro que desea levantar la observación?','LEVANTAR OBSERVACIÓN','').then(function(response) {
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

                    $http.post(constants.system.api.endpoints.cgw + 'api/guaranteeletter/correct/observation', fd, {
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
                          mModalAlert.showSuccess(response.data.message, 'Observación Levantada').then(function(response) {
                             if (response) {
                                $state.go('consultaCgw', {reload: true, inherit: false});
                             }
                          });
                    })
                    .error(function() {
                      mModalAlert.showError('Error al levantar la observación', 'Error');
                      mpSpin.end();
                    });
                  }
                });
             }
         } else {
            $scope.showFileError = true;
         }
       } else {
        if ($scope.showLevantarObservacion()) {
          $scope.showFileError = false;
          mModalConfirm.confirmInfo('¿Estás seguro que desea levantar la observación?','LEVANTAR OBSERVACIÓN','').then(function(response) {
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

              //fd.append("fieldNameHere", undefined);

              if ($scope.filesT === undefined) {
               // fd.append("fieldNameHere", null);
              } else {
                for(var i=0; i<$scope.filesT.length; i++) {
                  fd.append("fieldNameHere", $scope.filesT[i][0]);
                }
              }

              $http.post(constants.system.api.endpoints.cgw + 'api/guaranteeletter/correct/observation', fd, {
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
                  mModalAlert.showError('Error al levantar la observación', 'Error');
                else
                    mModalAlert.showSuccess(response.data.message, 'Observación Levantada').then(function(response) {
                       if (response) {
                          $state.go('consultaCgw', {reload: true, inherit: false});
                       }
                    });
              })
              .error(function() {
                mModalAlert.showError('Error al levantar la observación', 'Error');
                mpSpin.end();
              });
            }
          });
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
    .controller('LevantarObservacionController', levantarObservacionController);
});
