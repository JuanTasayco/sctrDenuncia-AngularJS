define([
  'angular', 'constants', 'generalConstants', 'mfpModalQuestion', 'mfpModalBuscarDiagnostico', 'mfpModalEditarBeneficio',
  'mfpModalAgregarDenuncia',
  'mfpModalTarifas', 'mfpModalScanAuditoria', 'mfpModalDatosScan', 'mfpModalDatosScanEdit', 'mfpModalAltosCostos', 'mfpModalDatosCondicionado', 'mfpModalInvalidez',
  '/cgw/app/factory/cgwFactory.js',
  '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea.js',
  '/cgw/app/solicitudCG/component/modalPreExistencias.js'
], function(ng, constants, generalConstants) {

  detalleConsultaAdminController.$inject = ['$scope', '$rootScope', '$uibModal', '$timeout', 'cgwFactory', '$stateParams', '$state', '$sce', 'mModalAlert', '$window', 'oimClaims', 'mpSpin', '$q'];

  function detalleConsultaAdminController($scope, $rootScope, $uibModal, $timeout, cgwFactory, $stateParams, $state, $sce, mModalAlert, $window, oimClaims, mpSpin, $q) {

    $scope.SCTR = "R";
    $scope.SALUD = "S";
    $scope.ASISTENCIA_MEDICA = "AA.MM.";
    $scope.SOAT = "O";
    $scope.AAPP = "A";
    $scope.AUTO = "U";
    $scope.dynamicPopover = {
      templateUrl: 'denunciaRelatoTooltipPlantilla.html',
    };

    var paramsLetter;
    var paramsAmountMedic;
    var sinisterLinkParams = [];
    var largomaximo = 50;

    $scope.clinicsToAdd = {};

    (function onLoad() {
      $scope.formData = $rootScope.formData || {};
      $scope.collapse1 = true;
      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

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

      $scope.isSI24 = true;//verificar ROL
      $scope.showAmpliacion = true; //Será visible dependiendo del estado de la carta
      $scope.isSCTR = true; // el producto es SCTR
      $scope.verAuditoriaExt = true; //-Será visible dependiendo del estado de la carta
      $scope.descargarAuditoriaExt = true; //Solo se muestra cuando la carta ha sido aprobada y ha sido auditada
                                            //Descargar PDF con Informacion de la ultima auditoria
      $scope.enMora = true; // cuando el asegurado está en mora por más de 3 meses
      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;
      $scope.flagClinic = $stateParams.flag;
      $scope.stateEmail = parseInt($stateParams.state);

      cgwFactory.getListUserExecutive(true).then(function(response) {
        if (response.data.items.length > 0) {
          $scope.ejecutivos = response.data.items;
        }
      }, function (error) {
        if (error.data)
          mModalAlert.showError(error.data.message, "Error");
      });

      cgwFactory.Resource_InternalRemark_GetList_Common().then(function(responseInternal) {
        if (responseInternal.data.items.length > 0) {
          $scope.internalRemarkCommon = responseInternal.data.items;
        }
      }, function(errorInternal) {
        if(errorInternal.data) {
          mModalAlert.showError(errorInternal.data.message, "Error");
        }
      });
      var pendingPaymentEnable = true
      var loadedData = false
      $scope.isEnabledPendingPay = function(){
        return pendingPaymentEnable &&
              loadedData &&
              ($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code);
      }
      $scope.changePendingPayment = function(value){
        if ($scope.isEnabledPendingPay()){
          pendingPaymentEnable = false;
          cgwFactory.updatePendingPayment
          (parseInt($scope.letterCia),
          parseInt($scope.letterNumber),
          parseInt($scope.yearLetter),
          value
            ).then(function (response) {
            pendingPaymentEnable = true;
          }, function(response){
            pendingPaymentEnable = true;
          })
        }
      }
      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        mpSpin.start();
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;
          $scope.showTabFactura();

          if ($scope.roleCode === constants.module.cgw.roles.clinica.description) {//$scope.flagClinic == 1)
            $state.go('detalleConsultaClinica', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: $scope.flagClinic, state: ''}, {reload: true, inherit: false});
          } else {
            cgwFactory.getEstadosCobranza().then(function (response) {
              if (response.data.items.length > 0) {
                $scope.edoCobranza = response.data.items;
              }
            }, function(error) {
              if (error.data)
                mModalAlert.showError(error.data.message, "Error");
            });

            cgwFactory.getProductos().then(function (response) {
              if (response.data.items.length > 0) {
                $scope.productos = response.data.items;
              }
            }, function(error) {
              if (error.data)
                mModalAlert.showError(error.data.message, "Error");
            });

            paramsLetter =
            {
              CompanyId: parseInt($scope.letterCia),
              Year: parseInt($scope.yearLetter),
              Number: parseInt($scope.letterNumber),
              Version: parseInt($scope.letterVersion)
            };
            cgwFactory.getDetailLetter(paramsLetter).then(function (response) {

              if (response.operationCode === 200){
                if (response.data) {
                  loadedData = true;
                  $scope.cartaGarantia = response.data;
                  $scope.showUltimaAE = ($scope.cartaGarantia.stateIdExternalAudit === 4);
                  $scope.verAuditoriaExt = !($scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
                  $scope.isSCTR = ($scope.cartaGarantia.productCode === $scope.SCTR);

                  if($scope.isSCTR) {
                    $scope.affiliateForcedCoverage = {
                      isSctrInsuredObserved: (response.data.sctrInsuredObserved === 'S'),
                      sctrInsuredMessage: response.data.sctrInsuredMessage,
                      isSctrCustomerVip: (response.data.sctrCustomerVip === 'S'),
                      isForcedCoverage: (response.data.forcedCoverage === 'S')
                    };

                    if(response.data.documentNumber != "" && response.data.policyholderTypeDocument != ""){
                      var paramsDocumentoPaciente = {
                        CodDocum: response.data.documentNumber,
                        TipDocum: response.data.policyholderTypeDocument
                      };

                      cgwFactory.ConsultarAseguradoObservado(paramsDocumentoPaciente).then(function (response) {
                        if(response.operationCode == 200){
                          $scope.msgAseguradoObservado = response.data;
                          if($scope.msgAseguradoObservado != "N") $scope.showMsgAseguradoObservado = true;
                        } else {
                          console.log('Error en: ConsultarAseguradoObservado');
                        }
                      }, function(error) {
                        console.log('Error en: ConsultarAseguradoObservado');
                      });
                    }

                    if(response.data.clientDocumentNumber != "" && response.data.clientTypeDocument != ""){
                      var paramsDocumentoCliente = {
                        CodDocum: response.data.clientDocumentNumber,
                        TipDocum: response.data.clientTypeDocument
                      };

                      cgwFactory.ConsultarClienteImportante(paramsDocumentoCliente).then(function (response) {
                        if(response.operationCode == 200){
                          $scope.msgClienteImportante = response.data;
                          if($scope.msgClienteImportante != "N") $scope.showMsgClienteImportante = true;
                        } else {
                          console.log('Error en: ConsultarClienteImportante');
                        }
                      }, function(error) {
                        console.log('Error en: ConsultarClienteImportante');
                      });
                    }
                  }

                  ($scope.cartaGarantia.company === 'MAPFRE SEGUROS') ? $scope.cartaGarantia.isSeguros = true : $scope.cartaGarantia.isSeguros = false;

                  if ($scope.cartaGarantia.mcaPeriodoCarencia === "S") {
                    mModalAlert.showInfo("La póliza se encuentra en periodo de carencia", "");
                  }

                if($scope.cartaGarantia.affiliateCode) {

                  var paramsCodeAfiliado = {
                    CodeAffiliate: ($scope.cartaGarantia.affiliateCode) ? $scope.cartaGarantia.affiliateCode : ''
                  };

                  var paramsDocAfiliado = {
                    tipoDocumento: $scope.cartaGarantia.typeDocument == '1' ? 'DNI' : 'RUC',
                    numeroDocumento: $scope.cartaGarantia.documentNumber
                  };

                  cgwFactory.getPreexistenciasAfiliado(paramsCodeAfiliado).then(function (response) {
                    if (response.data) {
                      if (response.data.items.length>0) {
                        $scope.preexistenciasAfiliado = response.data.items;
                      }
                    } else {
                      console.log('Error en: getPreexistenciasAfiliado');
                    }
                  }, function(error) {
                    console.log('Error en: getPreexistenciasAfiliado');
                  });

                  cgwFactory.getPreexistenciasTemporales(paramsDocAfiliado).then(function (response) {
                    if (response.data) {
                      if (response.data.exclusionesTemporales.length>0) {
                        $scope.preexistenciasTemporales = response.data.exclusionesTemporales;
                      }
                    } else {
                      console.log('Error en: getPreexistenciasTemporales');
                    }
                  }, function(error) {
                    console.log('Error en: getPreexistenciasTemporales');
                  });

                  if($scope.cartaGarantia.productCode === $scope.SCTR || $scope.cartaGarantia.productCode === $scope.SALUD || $scope.cartaGarantia.productCode === $scope.ASISTENCIA_MEDICA) {
                    cgwFactory.getPic($scope.letterCia, $scope.cartaGarantia.affiliateCode).then(function (response) {
                      $scope.picAfiliado = response;
                    }, function(error) {
                      if (error.data)
                        mModalAlert.showError(error.data.message, "Error");
                      console.log('Error en: getPic');
                      $scope.showPic = false;
                    });
                  }
                }

                if($scope.cartaGarantia.productCode === $scope.SCTR || $scope.cartaGarantia.productCode === $scope.SALUD || $scope.cartaGarantia.productCode === $scope.ASISTENCIA_MEDICA) {
                  var paramsAfiliado = {
                    CodeProvider: $scope.cartaGarantia.providerCode,
                    CodeBranchOffice: $scope.cartaGarantia.branchClinicCode,
                    PlanNumber: $scope.cartaGarantia.numberPlanString,
                    RucNumber: $scope.cartaGarantia.providerRucNumber,
                    CodeSeps: $scope.cartaGarantia.codeSepsEmpty,
                    CodeCompany: $scope.cartaGarantia.codeCompany,
                    Entity: $scope.cartaGarantia.providerName,
                    CompanyName: $scope.cartaGarantia.company,
                    Product: $scope.cartaGarantia.productName,
                    CodeAffiliate: ($scope.cartaGarantia.affiliateCode) ? $scope.cartaGarantia.affiliateCode : '',
                    IdCompany: parseInt($scope.letterCia),
                    CorrelativeCode: $scope.cartaGarantia.correlativeCode
                  };

                  cgwFactory.getAffiliate_Load(paramsAfiliado, false).then(function(response) {
                   mpSpin.end();
                    $scope.cartaGarantia.patientInfo = response.data.patientInfo;
                    $scope.cartaGarantia.preexistences = response.data.preexistences;
                    $scope.cartaGarantia.remarkPaciente = response.data.remark;
                    $scope.cartaGarantia.coberturasList = response.data.coverages;
                    $scope.cartaGarantia.policyholderInfo = response.data.policyholderInfo;
                    $scope.coberturasCargadas = true;
                    $scope.showObservaciones();
                  }, function(error) {
                   mpSpin.end();
                    mModalAlert.showError(error.data.message, 'Error');
                    $scope.coberturasCargadas = false;
                  });
                } else {
                  mpSpin.end();
                }

                  if ($scope.roleCode !== constants.module.cgw.roles.clinica.description) {//MED Externo o MED auditor
                    if ($scope.stateEmail === $scope.statusLetter.aprobado.code)
                      aprobar();
                    else if ($scope.stateEmail === $scope.statusLetter.rechazada.code)
                      rechazar();
                  }

                  obtenerDataCondicionado();

                }

                var valueDate = ($scope.cartaGarantia.isSeguros) ? ($scope.cartaGarantia.patientInfo && $scope.cartaGarantia.patientInfo.effectiveDateBegin ? $scope.cartaGarantia.patientInfo.effectiveDateBegin :  $scope.cartaGarantia.effectiveDate) : $scope.cartaGarantia.affiliationDate;
                setEffectiveDate(valueDate);
              }else {
                mModalAlert.showError(response.message, 'Error').then(function () {
                  $state.go('consultaCgw', {reload: true, inherit: false});
                });
              }
            }).catch(function(err){
              mModalAlert.showError(err.data.message, 'Error').then(function () {
                $state.go('consultaCgw', {reload: true, inherit: false});
              });
            });
          }
        }
      });

      obtenerScan();
    })();

    function getTramaCarta() {
      $scope.Budgets = [];
      $scope.cartaGarantia.approvedAmount = 0;

      angular.forEach($scope.procedimientosSolicitados, function(value,key) {
        var procedimiento = {
          CodeBudget: $scope.procedimientosSolicitados[key].codeDetail,
          requestedAmount: $scope.procedimientosSolicitados[key].requestedAmount,
          approvedAmount: $scope.procedimientosSolicitados[key].approvedAmount,
          observation: $scope.procedimientosSolicitados[key].observation
        };

        $scope.cartaGarantia.approvedAmount += $scope.procedimientosSolicitados[key].approvedAmount;
        $scope.Budgets.push(procedimiento);
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
              ProductCode: $scope.cartaGarantia.productCode,// === $scope.SALUD) ? 'S' : 'R',// Producto. S Salud, R SCTR
              AccidentDate: $scope.cartaGarantia.accidentDate,
              SinisterDate: $scope.cartaGarantia.sinisterDate,
              ProviderCode: parseInt($scope.cartaGarantia.providerCode),
              ProviderNumber: 1, // Numero proveedor fijo por ahora preguntar
              BeneficiaryCode: $scope.cartaGarantia.benefitCode, //codigo cobertura AQUIIII
              BranchClinicCode: $scope.cartaGarantia.branchClinicCode,
              Cacnta: 0, // fijo
              Iacgrnta: 0, // fijo
              CurrencyCode: 1, // moneda
              UserForced: $scope.cartaGarantia.userForced,
              AuthorizationDetail: $scope.cartaGarantia.authorizationDetail,
              Nacpln: $scope.cartaGarantia.nacpln,
              DeductibleAmount : $scope.cartaGarantia.percentageCoverage,
              ForcedCopayment: 0, //cambiar (typeof $scope.formData.copayForced.idForced != 'undefined') ? $scope.formData.copayForced.idForced : 1, //1, // copago forzado popup
              Cerspsta: '', // fijo
              StateCode: $scope.cartaGarantia.stateId,//1, // fijo
              ClientCode: ($scope.cartaGarantia.clientCode !== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,//$scope.cartaGarantia.clientCode,
              Contract: $scope.cartaGarantia.clientNumber, //'3790', $scope.formData.policyholderInfo.contractNumber,
              EffectiveDate: ($scope.cartaGarantia.isSeguros) ? ($scope.cartaGarantia.patientInfo && $scope.cartaGarantia.patientInfo.effectiveDateBegin ? $scope.cartaGarantia.patientInfo.effectiveDateBegin :  $scope.cartaGarantia.effectiveDate) : $scope.cartaGarantia.affiliationDate,
              FixedCopayment: $scope.cartaGarantia.fixedCopayment,
              VariableCopayment: $scope.cartaGarantia.variableCopayment,
              NumberPlan: $scope.cartaGarantia.numberPlan,
              Mail: $scope.cartaGarantia.email,
              PhoneNumber: $scope.cartaGarantia.phoneNumber,
              DiagnosticCode: $scope.cartaGarantia.diagnosticCode,
              CoverageCode: $scope.cartaGarantia.coverageCode, //cambiar $scope.formData.cobertura.coverage,//ZU, // En servicio affiliate/load, obtiene un array de coberturas
              PowerSinisterAnio: $scope.cartaGarantia.powerSinisterAnio,
              PowerSinisterNumber: $scope.cartaGarantia.powerSinisterNumber,
              Policyholder:
                {
                  License: ($scope.cartaGarantia.affiliateCode) ? $scope.cartaGarantia.affiliateCode : '',
                  FullName: $scope.cartaGarantia.policyholderFullName,
                  ContractNumber: $scope.cartaGarantia.clientNumber,//'3790', $scope.formData.policyholderInfo.contractNumber,
                  CompanyName: $scope.cartaGarantia.companyName,
                  RucNumber: $scope.cartaGarantia.clientDocumentNumber,
                  Currency: $scope.cartaGarantia.currency,
                  AffiliateDate: $scope.cartaGarantia.affiliationDate,
                  ContractDate: $scope.cartaGarantia.contractDate//"3/1/2008", (typeof $scope.formData.policyholderInfo.contractDate != 'undefined') ? $scope.formData.policyholderInfo.contractDate : ''
                },
              Patient:
                {
                },
              GuaranteeLetterVersion :
                {
                  Year: $scope.yearLetter,
                  Number: $scope.letterNumber,
                  Version: $scope.letterVersion,
                  RequestedAmount: $scope.cartaGarantia.requestedAmount,// * ($scope.valorIGV/100), // Importe total (suma de procedimientos * 1.18 igv)
                  AprrovedAmount: ($scope.cartaGarantia.approvedAmount + ($scope.cartaGarantia.approvedAmount * ($scope.valorIGV/100))) ,
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

      if (paramsCarta.GuaranteeLetter.ProductCode !== 'R' && paramsCarta.GuaranteeLetter.ProductCode !== 'S'){
        paramsCarta.GuaranteeLetter.Policyholder.PolicyNumber = ($scope.cartaGarantia.policyNumber) ? $scope.cartaGarantia.policyNumber : '';
        paramsCarta.GuaranteeLetter.Policyholder.PlateNumber = ($scope.cartaGarantia.plateNumber) ? $scope.cartaGarantia.plateNumber : '';
        paramsCarta.GuaranteeLetter.Patient = {
          accidentInfo: $scope.cartaGarantia.patientInfo.accidentInfo,
          contactInfo: $scope.cartaGarantia.patientInfo.contactInfo,
          FullName: $scope.cartaGarantia.patientFullName,
          Sex: $scope.cartaGarantia.sex,
          Kinship: $scope.cartaGarantia.relationship
        };
      }

      return paramsCarta;
    }

    function anular() {
      validarFinalizarSCTR();

        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
          controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
            scope.close = function clFn() {
              $uibModalInstance.close();
            };
            scope.anularCarta = function acFn() {
              paramsLetter = getTramaCarta();
              paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = 0;
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark;
              paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReasonAnulled = ($scope.cartaGarantia.mMotivoAnulacion.id) ? $scope.cartaGarantia.mMotivoAnulacion.id : -1;

              setUpdateComplaintFinalizedStatus();

              cgwFactory.annulLetter(paramsLetter).then(function (response) {
                if (response.operationCode === 200) {
                  $uibModalInstance.close();
                  mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                   if (response) {
                      $state.go('consultaCgw', {reload: true, inherit: false});
                   }
                  });
                  } else {
                    mModalAlert.showError(response.data.message, "Error");
                }
              }, function(error) {
                if (error.data)
                  mModalAlert.showError(error.data.message, "Error");
              });
            };
            // Los parametros que recibe el componente estan detallados en el js del componente
            scope.data = {
              mostrarObservaciones: true,
              showCboMtvRchzo: true,
              showSeccMtvFnlzcnDenuncia: $scope.showSeccComplaintFinalizedStatus,
              cartaGarantia: $scope.cartaGarantia,
              title: '¿Está seguro de anular la carta?',
              btns: [
                {
                  lbl: 'Cancelar',
                  accion: scope.close,
                  clases: 'g-btn-transparent'
                },
                {
                  lbl: 'Anular',
                  accion: scope.anularCarta,
                  clases: 'g-btn-verde'
                }
              ],
              txtThx: "SE HA ANULADO LA CARTA DE GARANTIA NRO 17-11537-1 " + $scope.yearLetter+'-' +$scope.letterNumber+'-'+$scope.letterCia +" DEL AFILIADO " + $scope.cartaGarantia.patientFullName//'La carta ha sido anulada con éxito'
            };

          $timeout(function () {
            cgwFactory.getListMotivosAnulado().then(function (response) {
              if (response.data.items.length > 0) {
                scope.data.motivosAnulacion = response.data.items;
              }
            }, function (error) {
              if (error.data)
                mModalAlert.showError(error.data.message, "Error");
            });
          }, 0);

            if($scope.isSCTR && $scope.showSeccComplaintFinalizedStatus) {
              $timeout(function () {
                cgwFactory.GetListComplaintReasonFinalized(false)
                  .then(function (response) {
                    if (response.data.items.length > 0) {
                      scope.data.reasonsFinalizedComplaint = response.data.items;
                    }
                  },
                  function (error) {
                    if (error.data)
                      mModalAlert.showError(error.data.message, "Error");
                  }
                );
              }, 0);
            }
          }] // end Controller uibModal
        });
    }

    function observar() {
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

        cgwFactory.observeLetter(paramsLetter).then(function (response) {
          if (response.operationCode === 200) {
            mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
              $state.go('consultaCgw', {reload: true, inherit: false});
            });
          }
        }, function(error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        });
    }

    function rechazar() {
        $scope.cartaGarantia.remark2 = $scope.cartaGarantia.remark;
      if ($scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code && 
        $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code) {
            $uibModal.open({
              backdrop: true,
              backdropClick: true,
              dialogFade: false,
              keyboard: true,
              scope: $scope,
              windowTopClass: 'modal--md',
              template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
              controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

                scope.close = function clFn() {
                  $uibModalInstance.close();
                  if (scope.cartaGarantia.remark !== $scope.cartaGarantia.remark2)
                    if (typeof scope.cartaGarantia.remark !== 'undefined')
                      $scope.cartaGarantia.remark = scope.cartaGarantia.remark;
                  else
                    $scope.cartaGarantia.remark = $scope.cartaGarantia.remark2;
                };
                scope.rechazarCarta = function acFn() {
                  if (scope.data.mMotivo.id === 1 || scope.data.mMotivo.id === 2 || scope.data.mMotivo.id === 5 || scope.data.mMotivo.id === 6) {
                      scope.data.errorFormReject = false;
                      paramsLetter = getTramaCarta();
                      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = (scope.data.mCodDiagnostico1) ? scope.data.mCodDiagnostico1.code : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = (scope.data.mCodDiagnostico2) ? scope.data.mCodDiagnostico2.code : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = (scope.data.mCodDiagnostico3) ? scope.data.mCodDiagnostico3.code : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                      cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                        if (response.operationCode === 200) {
                          $uibModalInstance.close();

                          mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                           if (response) {
                            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                                $scope.roleCode === constants.module.cgw.roles.admin.description ||
                                $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description
                                ) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                        } else {
                           scope.data.showMsgThx = true;
                           scope.data.txtThx = response.data.message;
                        }
                      }, function(error) {
                        if (error.data)
                          mModalAlert.showError(error.data.message, "Error");
                      });
                  } else if (scope.data.mMotivo.id === 4) {
                      scope.data.errorFormReject = false;

                      paramsLetter = getTramaCarta();
                      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = (scope.data.mMotivoText) ? scope.data.mMotivoText : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = (scope.data.mMotivoDetalle) ? scope.data.mMotivoDetalle : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                      cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                        if (response.operationCode === 200) {

                          $uibModalInstance.close();
                          mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                           if (response) {
                            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                                $scope.roleCode === constants.module.cgw.roles.admin.description ||
                                $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                        } else {
                           scope.data.showMsgThx = true;
                           scope.data.txtThx = response.data.message;
                        }
                      }, function(error) {
                        if (error.data)
                          mModalAlert.showError(error.data.message, "Error");
                      });
                  } else if (scope.data.mMotivo.id === 7) {
                      scope.data.errorFormReject = false;

                      paramsLetter = getTramaCarta();
                      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = ($scope.formData.mArticle) ? $scope.formData.mArticle : '';
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                      cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                        if (response.operationCode === 200) {
                          $uibModalInstance.close();
                          mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                           if (response) {
                            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                                $scope.roleCode === constants.module.cgw.roles.admin.description ||
                                $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                        } else {
                           scope.data.showMsgThx = true;
                           scope.data.txtThx = response.data.message;
                        }
                      }, function(error) {
                        if (error.data)
                          mModalAlert.showError(error.data.message, "Error");
                      });
                  } else if (scope.data.mMotivo.id === 8) {//medicamentos

                      scope.data.errorFormReject = false;
                      paramsLetter = getTramaCarta();
                      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = (scope.data.mMedicamento1) ? scope.data.mMedicamento1 : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = (scope.data.mMedicamento2) ? scope.data.mMedicamento2 : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = (scope.data.mMedicamento3) ? scope.data.mMedicamento3 : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                      if (scope.data.tipoSeguro !== constants.module.cgw.seguros)
                        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
                      else
                        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = (scope.data.mMotivoDetalle) ? scope.data.mMotivoDetalle : "";


                      cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                        if (response.operationCode === 200) {
                          $uibModalInstance.close();

                          mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                           if (response) {
                            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                                $scope.roleCode === constants.module.cgw.roles.admin.description ||
                                $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                        } else {
                           scope.data.showMsgThx = true;
                           scope.data.txtThx = response.data.message;
                        }
                      }, function(error) {
                        if (error.data)
                          mModalAlert.showError(error.data.message, "Error");
                      });
                  } else if (scope.data.mMotivo.id === 9 || (scope.data.mMotivo.id === 3 && scope.data.tipoSeguro === constants.module.cgw.seguros)) {
                      scope.data.errorFormReject = false;

                      paramsLetter = getTramaCarta();
                      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = (scope.data.mMotivoExclusion) ? scope.data.mMotivoExclusion : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                      cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                        if (response.operationCode === 200) {

                          $uibModalInstance.close();
                          mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                           if (response) {
                             if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                               $scope.roleCode === constants.module.cgw.roles.admin.description ||
                               $scope.roleCode === constants.module.cgw.roles.supervisor.description  ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                        } else {
                           scope.data.showMsgThx = true;
                           scope.data.txtThx = response.data.message;
                        }
                      }, function(error) {
                        if (error.data)
                          mModalAlert.showError(error.data.message, "Error");
                      });



                  } else if (scope.data.mMotivo.id === 10 && scope.data.tipoSeguro === constants.module.cgw.seguros) {//examen medico

                      scope.data.errorFormReject = false;
                      paramsLetter = getTramaCarta();
                      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = (scope.data.mExMedico1) ? scope.data.mExMedico1 : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = (scope.data.mExMedico2) ? scope.data.mExMedico2 : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = (scope.data.mExMedico3) ? scope.data.mExMedico3 : "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
                      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                      cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                        if (response.operationCode === 200) {
                          $uibModalInstance.close();

                          mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                           if (response) {
                            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                                $scope.roleCode === constants.module.cgw.roles.admin.description ||
                                $scope.roleCode === constants.module.cgw.roles.supervisor.description  ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                        } else {
                           scope.data.showMsgThx = true;
                           scope.data.txtThx = response.data.message;
                        }
                      }, function(error) {
                        if (error.data)
                          mModalAlert.showError(error.data.message, "Error");
                      });
                  } else {

                    paramsLetter = getTramaCarta();
                    paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = scope.data.mMotivo.id;
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
                    paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = ($scope.cartaGarantia.remark) ? $scope.cartaGarantia.remark : '';

                    cgwFactory.rejectLetter(paramsLetter).then(function (response) {
                      if (response.operationCode === 200) {

                        $uibModalInstance.close();
                        mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                          if (response) {
                            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                                $scope.roleCode === constants.module.cgw.roles.admin.description ||
                                $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
                                $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
                              $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                                              'api/guaranteeletter/reject/download/' + $scope.letterCia + '/' + $scope.yearLetter + '/' + $scope.letterNumber + '/' + $scope.letterVersion + '/PDF');
                              $timeout(function() {
                                document.getElementById('frmDownloadLetter').submit();
                                $state.go('consultaCgw', {reload: true, inherit: false});
                              }, 500);
                             } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                           } else {
                              $state.go('consultaCgw', {reload: true, inherit: false});
                            }
                          });
                      } else {
                         scope.data.showMsgThx = true;
                         scope.data.txtThx = response.data.message;
                      }
                    }, function(error) {
                      if (error.data)
                        mModalAlert.showError(error.data.message, "Error");
                    });
                  }
                };

                // Los parametros que recibe el componente estan detallados en el js del componente
                scope.data = {
                  mostrarObservaciones: true,
                  cartaGarantia: $scope.cartaGarantia,
                  title: 'Está seguro de rechazar la carta',
                  btns: [
                    {
                      lbl: 'Cancelar',
                      accion: scope.close,
                      clases: 'g-btn-transparent'
                    },
                    {
                      lbl: 'Rechazar',
                      accion: scope.rechazarCarta,
                      clases: 'g-btn-verde'
                    }
                  ],
                  showCbo: true,
                  txtThx: 'La carta ha sido rechazada con éxito',
                  type: 'rechazar',
                  tipoSeguro: $scope.cartaGarantia.codeCompany
                };

                $timeout(function() {
                  cgwFactory.getListRechazos($scope.letterCia).then(function (response) {
                    if (response.data.items.length > 0) {
                      scope.data.motivos = response.data.items;
                    }
                  }, function(error) {
                    if (error.data)
                      mModalAlert.showError(error.data.message, "Error");
                  });
                }, 0);

              }] // end Controller uibModal
            });
        } else {
          mModalAlert.showInfo("Para rechazar la carta de garantia debe estar por lo menos en estado EN PROCESO DE AUDITORIA", "Rechazar Carta");
        }
    }

    // Ver nueva vista de rechazar
    function nuevoRechazar() {
      $scope.cartaGarantia.remark2 = $scope.cartaGarantia.remark;
      $scope.seguros = constants.module.cgw.seguros;

      if ($scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code) {
        localStorage.setItem("remark", $scope.cartaGarantia.remark2);
        $state.go('rechazarCarta', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia}, {reload: true, inherit: false});
      } else {
        mModalAlert.showInfo(
          "Para rechazar la carta de garantia debe estar por lo menos en estado EN PROCESO DE AUDITORIA",
          "Rechazar Carta"
        );
      }
    }

    // Obtener informacion de condicionado para vista Rechazo
    function obtenerDataCondicionado() {
      $scope.rechazo = {};
      cgwFactory.GetInfoCondicionado($scope.yearLetter, $scope.letterNumber, true).then(
        function (response) {
          if (response.operationCode == 200) {
            var cont = angular.element('<div>').html(response.data).text();
            $scope.dataCondicionado = cont;
          } else {
            $scope.dataCondicionado = "";
          }
        },
        function (error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        }
      );
    }

    function validarFinalizarSCTR() {
      $scope.showSeccComplaintFinalizedStatus = false;

      if($scope.isSCTR && $scope.cartaGarantia.newProcess) {
        if($scope.cartaGarantia.accidentBenefitCode.trim() === generalConstants.benefits.hospitable.id &&
          ($scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.inProcess || 
            $scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.approved)) {
          $scope.showSeccComplaintFinalizedStatus = true;
        }
      }
    }

    function setUpdateComplaintFinalizedStatus() {
      if($scope.showSeccComplaintFinalizedStatus && $scope.isSCTR) {
        paramsLetter.GuaranteeLetter.ComplaintReasonReject = {
          CodeReject: $scope.cartaGarantia.reasonFinalizedComplaint.id,
          Observation: $scope.cartaGarantia.remarkComplaint
        };
      }
    }

    // Obtener listado de diagnosticos
    $scope.getListDiagnostic = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostic = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        cgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
          defer.resolve(response.data.items);
        }, function(error){
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    function searchSinisters() {
      var deferred = $q.defer();
      var paramsSinister = {
        ProductCode: $scope.cartaGarantia.productCode,
        AccidentDate: $scope.cartaGarantia.sinisterDate,
        ContractNumber: $scope.cartaGarantia.clientNumber,
        AffiliateCode: $scope.cartaGarantia.affiliateCode,
        LicenseNumber: ($scope.cartaGarantia.productCode == 'O' ? $scope.cartaGarantia.plateNumber : '')
      }
      cgwFactory.Resource_Sinister_Search(paramsSinister, true).then(function (response) {
        if($scope.cartaGarantia.productCode == 'O'){
          if (response.data.valueReturnSinister === 1){
            var itemsSinister = {
              TypeLinkSinister: 1,
              SinisterYear: response.data.yearDocControl,
              SinisterCod: response.data.docControlNumber
            }
            deferred.resolve(itemsSinister);
          } else {
            var itemsSinister = {
              TypeLinkSinister: null,
              SinisterYear: null,
              SinisterCod: null
            }
            deferred.resolve(itemsSinister);
          }
        }

        if($scope.cartaGarantia.productCode == 'A'){
        if (response.data.valueReturnSinister === 1) {
          //Vincular con Siniestro
          var itemsSinister = {
            TypeLinkSinister: 1,
            SinisterYear: response.data.yearDocControl,
            SinisterCod: response.data.docControlNumber
          }
          deferred.resolve(itemsSinister);
        }
        else if (response.data.valueReturnSinister === 2) {
          //Abrir popUp
          deferred.resolve(openModalSinister());
        }
        else {
          //Aperturar nuevo Siniestro
          var itemsSinister = {
            TypeLinkSinister: 0,
            SinisterYear: null,
            SinisterCod: null
          }
          deferred.resolve(itemsSinister);
        }
        }
      });
      return deferred.promise;
    }
    function getListSinister() {
      var deferred = $q.defer();
      var listSinisters;
      var paramsSinister = {
        ProductCode: $scope.cartaGarantia.productCode,
        AccidentDate: $scope.cartaGarantia.sinisterDate,
        ContractNumber: $scope.cartaGarantia.clientNumber,
        AffiliateCode: $scope.cartaGarantia.affiliateCode,
        LicenseNumber: ($scope.cartaGarantia.productCode == 'O' ? $scope.cartaGarantia.plateNumber : '')
      }

      cgwFactory.Resource_Sinister_OpenModal(paramsSinister, true).then(function (response) {
        listSinisters = response.data.items;
        deferred.resolve(listSinisters);
      });

      return deferred.promise;
    }
    function openModalSinister() {
      var deferred = $q.defer();

      getListSinister().then(function (response) {
        if (response.length > 0) {
          var modalInstance = $uibModal.open({
            backdrop: 'static',
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            templateUrl: "/cgw/app/consultaCG/component/preAproveSiniestro.html",
            size: "lg",
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            animation: true,
            resolve: {
              items: function () {
                return response
              }
            },
            controller: ['items', "$uibModalInstance", "$scope", function (items, $uibModalInstance, $scope) {

              function select(item) {
                var itemsSinister = {
                  TypeLinkSinister: 2,
                  SinisterYear: item.sinisterNumberRef.substring(0, 2),
                  SinisterCod: item.sinisterNumberRef.substring(2, (item.sinisterNumberRef.length))
                }
                deferred.resolve(itemsSinister);
                $uibModalInstance.close();
              }
              function cancel() {
                $uibModalInstance.dismiss('cancel');
              }
              function closeModal() {
                $uibModalInstance.close();
              }
              $scope.letterDateLimit = 10;
              $scope.select = select;
              $scope._items = items;
              $scope.cancel = cancel;
              $scope.closeModal = closeModal;
            }]
          });

          modalInstance.result.then(function (item) {
            deferred.resolve(item);
          },
            function () {
              var itemsSinister = {
                TypeLinkSinister: 0,
                SinisterYear: null,
                SinisterCod: null
              }
              deferred.resolve(itemsSinister);
            });
        }
        else {
          var itemsSinister = {
            TypeLinkSinister: 0,
            SinisterYear: null,
            SinisterCod: null
          }
          deferred.resolve(itemsSinister);
        }
      });

      return deferred.promise;
    }

    function aprobar() {
      paramsLetter = getTramaCarta();
      paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = 0;
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
      paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark;
      paramsLetter.ApplicationGroup = $scope.grupoAplicacion;
      paramsLetter.GuaranteeLetter.sumAssured = $scope.cartaGarantia.sumAssured;

      paramsLetter.GuaranteeLetter.CurrentEffectiveDate = setEffectiveDate(paramsLetter.GuaranteeLetter.EffectiveDate);

      //Caso cuando Pasa del Estaso "EN PROCESO DE AUDITORIA -> APROBADO"
      if (($scope.roleId != 4 && $scope.roleId != 8 && $scope.roleId != 9) 
      && paramsLetter.GuaranteeLetter.StateCode === 6) {
        var paramsAmountForMedic = {
          CodeCompany: paramsLetter.GuaranteeLetter.CodeCompany,
          CodeProduct: paramsLetter.GuaranteeLetter.ProductCode
        }

        cgwFactory.Resource_AmountForMedic(paramsAmountForMedic, true).then(function (response) {
          paramsAmountMedic = (response.data.items != undefined ? response.data.items[0] : undefined);
        });
      } else {
        paramsAmountMedic = undefined;
      }

     if (!$scope.auditarAprobar) {
        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          template: '<mfp-modal-question data="data" close="close()"></mfp-modal-question>',
          controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
            scope.close = function clFn() {
              $uibModalInstance.close();
            };
            scope.verificar = function acFn() {
              $scope.auditarToggle(undefined, 0);
              $scope.isSelectedItem = true;
              $scope.selectedItem[undefined] = true;
              $uibModalInstance.close();
            };
            scope.aprobarCarta = function() {
              $uibModalInstance.close();
              if ((paramsLetter.GuaranteeLetter.StateCode === 1
                && paramsLetter.GuaranteeLetter.PowerSinisterNumber === ''
                && paramsLetter.GuaranteeLetter.PowerSinisterAnio === ''
                && (paramsLetter.GuaranteeLetter.ProductCode === 'A' || paramsLetter.GuaranteeLetter.ProductCode === 'O')) ||
                (paramsLetter.GuaranteeLetter.StateCode == 6
                  && paramsAmountMedic !== undefined 
                  && paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.AprrovedAmount < paramsAmountMedic.max 
                  && paramsLetter.GuaranteeLetter.PowerSinisterNumber === ''
                && paramsLetter.GuaranteeLetter.PowerSinisterAnio === ''
                && (paramsLetter.GuaranteeLetter.ProductCode === 'A' || paramsLetter.GuaranteeLetter.ProductCode === 'O'))) {
                //Verifica las aperturas de siniestros 
                searchSinisters().then(function (item) {
                  if (item !== undefined) {
                    paramsLetter.GuaranteeLetter.TypeLinkSinister = item.TypeLinkSinister;
                    paramsLetter.GuaranteeLetter.SinisterYear = item.SinisterYear;
                    paramsLetter.GuaranteeLetter.SinisterCod = item.SinisterCod;

              cgwFactory.approveLetter(paramsLetter).then(function (response) {
                if (response.operationCode === 200) {
                  mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
                    $state.go('consultaCgw', {reload: true, inherit: false});
                  });
                } else {
                  mModalAlert.showError(response.data.message, "Error");
                }
              }, function(error) {
                if (error.data)
                  mModalAlert.showError(error.data.message, "Error");
              });
                  }
                });
              }
              else {
                cgwFactory.approveLetter(paramsLetter).then(function (response) {
                  if (response.operationCode === 200) {
                    mModalAlert.showSuccess(response.data.message, '', '').then(function (response) {
                      $state.go('consultaCgw', { reload: true, inherit: false });
                    });
                  } else {
                    mModalAlert.showError(response.data.message, "Error");
                  }
                }, function (error) {
                  if (error.data)
                    mModalAlert.showError(error.data.message, "Error");
                });
              }


            };
            scope.data = {
              mostrarObservaciones: false,
              cartaGarantia: $scope.cartaGarantia,
              title: '¿Desea auditar los montos solicitados antes de aprobar?',
              btns: [
                {
                  lbl: 'No, aprobar',
                  accion: scope.aprobarCarta,
                  clases: 'g-btn-transparent'
                },
                {
                  lbl: 'Si, modificar montos',
                  accion: scope.verificar,
                  clases: 'g-btn-verde'
                }
              ]
            };

          }] // end Controller uibModal
        });
      } else if ($scope.auditarAprobar || $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code) {
        cgwFactory.approveLetter(paramsLetter).then(function (response) {
          if (response.operationCode === 200) {
            mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
              $state.go('consultaCgw', {reload: true, inherit: false});
            });
          } else {
            mModalAlert.showError(response.data.message, "Error");
          }
        }, function(error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        });
      }
    }

    function aprobarEjec() {
      $scope.aprobarEjecFlag = true;
      angular.forEach($scope.procedimientosSolicitados, function(value,key) {
        if ($scope.procedimientosSolicitados[key].approvedAmount > $scope.procedimientosSolicitados[key].requestedAmount) {
          $scope.aprobarEjecFlag = false;
        }
        $scope.aprobarEjecFlag = !($scope.procedimientosSolicitados[key].requestedAmount === 0);
      });

      if (!$scope.aprobarEjecFlag) {
        mModalAlert.showError("El Total de Monto Aprobado debe ser Mayor a 0.00", "Error");
      }
      else {
       paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark;
        paramsLetter.ApplicationGroup = $scope.grupoAplicacion;
        paramsLetter.GuaranteeLetter.sumAssured = $scope.cartaGarantia.sumAssured;

        paramsLetter.GuaranteeLetter.CurrentEffectiveDate = setEffectiveDate(paramsLetter.GuaranteeLetter.EffectiveDate);

        if (paramsLetter.GuaranteeLetter.PowerSinisterNumber === ''
          && paramsLetter.GuaranteeLetter.PowerSinisterAnio === ''
          && (paramsLetter.GuaranteeLetter.ProductCode === 'A' || paramsLetter.GuaranteeLetter.ProductCode === 'O')) {
          //Verifica las aperturas de Siniestros
          searchSinisters().then(function (item) {
            if (item !== undefined) {
              paramsLetter.GuaranteeLetter.TypeLinkSinister = item.TypeLinkSinister;
              paramsLetter.GuaranteeLetter.SinisterYear = item.SinisterYear;
              paramsLetter.GuaranteeLetter.SinisterCod = item.SinisterCod;

              cgwFactory.approveExecutiveLetter(paramsLetter).then(function (response) {
                if (response.operationCode === 200) {
                  mModalAlert.showSuccess(response.data.message, '', '').then(function (response) {
                    $state.go('consultaCgw', { reload: true, inherit: false });
                  });
                } else {
                  mModalAlert.showError(response.data.message, "Error");
                }
              }, function (error) {
                if (error.data)
                  mModalAlert.showError(error.data.message, "Error");
              });
            }
          });
        }
        else {
        cgwFactory.approveExecutiveLetter(paramsLetter).then(function (response) {
          if (response.operationCode === 200) {
            mModalAlert.showSuccess(response.data.message,'','').then(function(response) {
              $state.go('consultaCgw', {reload: true, inherit: false});
            });
          } else {
            mModalAlert.showError(response.data.message, "Error");
          }
        }, function(error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        });
      }
    }
    }

    $scope.setEstadoCGW = function secgwFn(opt) {
      switch (opt) {
        case 1: nuevoRechazar(); break;
        case 2: anular(); break;
        case 3: observar(); break;
        case 4: aprobar(); break;
        case 5: aprobarEjec(); break;
        default: return;
      }
    };

    $scope.$watch('formData', function (nv) {
        $rootScope.formData =  nv;
      });

    var idxSelected;
    $scope.isSelectedItem = false;
    $scope.selectedItem = [];

    $scope.dateOptions = {
      initDate: new Date(),
      maxDate: new Date()
    };

    $scope.carta = {};
    $scope.carta.estado = '1';
    $scope.obsInterArr = [];

    // tpls de los tabs
    $scope.tabPaciente = '/cgw/app/consultaCG/component/tabPaciente.html';
    $scope.tabCG = '/cgw/app/consultaCG/component/tabCG.html';
    $scope.tabAuditoria = '/cgw/app/consultaCG/component/tabAuditoria.html';
    $scope.tabFacturas = '/cgw/app/consultaCG/component/tabFacturas.html';
    $scope.tabMovimientos = '/cgw/app/consultaCG/component/tabMovimientos.html';

    // component de rechazo
    $scope.rechazarCarta = '/cgw/app/consultaCG/component/rechazarCarta.html';
    $scope.showRechazarView = false;

    $scope.verHistorial = function vhFn() {
      var url = $state.href('historialAfiliado', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, start: cgwFactory.formatearFecha($scope.CurrentEffectiveDate), end: cgwFactory.formatearFecha($scope.CurrentEndEffectiveDate)}, {reload: true, inherit: false});
      window.open(url,'_blank');
    };

    $scope.editarDiagnostico = function edFn() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--500 modal--budget fade',
        template: '<mfp-modal-buscar-diagnostico carta="dataCarta" close="close(a)"></mfp-modal-buscar-diagnostico>',
        controller: [
          '$scope',
          '$uibModalInstance',
          function(scope, $uibModalInstance) {
            scope.dataCarta = {
              CodeCompany: parseInt($scope.letterCia),
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
              UserUpdate: oimClaims.loginUserName.toUpperCase(),
              ShowObservaciones: false,
              AmputationIndicator: $scope.cartaGarantia.amputationIndicator
            };
            scope.close = function(type) {
              if (type && type === 'ok') {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
          }
        ]
      });
    };

    $scope.editarBeneficio = function ebFn(cartaGarantia) {

      if ($scope.coberturasCargadas) {
        $scope.dataCarta = {
          CodeCompany: parseInt($scope.letterCia),
          Year: $scope.yearLetter,
          Number: $scope.letterNumber,
          Version: $scope.letterVersion,
          UserUpdate: oimClaims.loginUserName.toUpperCase(),
          Sexo: $scope.cartaGarantia.sex,
          UserForced: $scope.cartaGarantia.userForced,
          Coberturas: $scope.cartaGarantia.coberturasList,
          CodeBeneficio: $scope.cartaGarantia.benefitCode,
          Beneficio: $scope.cartaGarantia.benefit
        };

        $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          windowTopClass: 'modal--md',
          template: '<mfp-modal-editar-beneficio data="cartaGarantia" carta="dataCarta" close="close()"></mfp-modal-editar-beneficio>',
          controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
            scope.close = function clFn() {
              $uibModalInstance.close();
              $scope.cartaGarantia.userForced = $scope.dataCarta.UserForced;
              if($scope.dataCarta.percentageCoverage)
                $scope.cartaGarantia.percentageCoverage = $scope.dataCarta.percentageCoverage;
              if($scope.dataCarta.typeAttention)
                $scope.cartaGarantia.typeAttention = $scope.dataCarta.typeAttention;
            };

          }] // end Controller uibModal
        });
      }
    };

    $scope.agregarDenuncia = function adFn() {
      // $uibModal.open({
      //   backdrop: true,
      //   backdropClick: true,
      //   dialogFade: false,
      //   keyboard: true,
      //   scope: $scope,
      //   windowTopClass: 'modal--lg',
      //   template: '<mfp-modal-agregar-denuncia close="close()"></mfp-modal-agregar-denuncia>',
      //   controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
      //     scope.close = function clFn() {
      //       $uibModalInstance.close();
      //     };

      //   }] // end Controller uibModal
      // });
    };

    $scope.crearDenuncia = function() {
      if (constants.environment === 'PROD') {
        window.open("http://spe001001-350/SCTRAV_WEB/default.aspx?ROL=EJECUTIVO&TIPODOC=" +
          $scope.cartaGarantia.clientTypeDocument +
          "&NUMDOC=" + $scope.cartaGarantia.clientDocumentNumber +
          "&TIPODOCAF=" + $scope.cartaGarantia.policyholderTypeDocument +
          "&NUMDOCAF=" + $scope.cartaGarantia.documentNumber +
          "&Usuario=" + $scope.cartaGarantia.userCreated +
          "&Sis_reg=C");
        } else {
          window.open("http://spe001001-128.mapfreperu.com/SCTRAV_WEB/Default.aspx?ROL=EJECUTIVO&TIPODOC=" +
            $scope.cartaGarantia.clientTypeDocument +
            "&NUMDOC=" + $scope.cartaGarantia.clientDocumentNumber +
            "&TIPODOCAF=" + $scope.cartaGarantia.policyholderTypeDocument +
            "&NUMDOCAF=" + $scope.cartaGarantia.documentNumber +
            "&Usuario=" + $scope.cartaGarantia.userCreated +
            "&Sis_reg=C");
        }
    };

    $scope.auditarToggle = function atFn(idx, type) {
      if (type === 0 || (!$scope.montoInvalido && type === 1)) {
        $scope.isSelectedItem = $scope.selectedItem[idx] = !$scope.selectedItem[idx];

        if (idxSelected === idx) {
          //
        } else if (idxSelected !== idx) {
          $scope.selectedItem[idxSelected] = false;
          idxSelected = idx;
        }
      }
    }

    $scope.showSolicitarAE = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
          if ($scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.porAuditar.code ||
            $scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.enProcesoDeAuditoria.code)
            return false;
          else
            return true;
        } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description || $scope.roleCode === constants.module.cgw.roles.admin.description || $scope.roleCode === constants.module.cgw.roles.supervisor.description) { //EJEC
           if ($scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.porAuditar.code ||
            $scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.enProcesoDeAuditoria.code)
            return false;
          else
            return true;
        } else if ($scope.roleCode === constants.module.cgw.roles.ejeSI24.description) { //SI24
          if ($scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.porAuditar.code ||
            $scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code
            )
            return false;
          else
            return true;
        } else if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo
          if ($scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.porAuditar.code ||
            $scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.enProcesoDeAuditoria.code)
            return false;
          else
            return true;
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return false;
        }
    };

    $scope.showAuditar = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description || $scope.roleCode === constants.module.cgw.roles.admin.description || $scope.roleCode === constants.module.cgw.roles.supervisor.description) { //EJEC
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.observada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.liquidado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.procesada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejeSI24.description) { //SI24
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return false;
        }
    };

    $scope.showCrearAmpliacion = function() {
      if ($scope.cartaGarantia !== undefined && $scope.letterVersion ==="1")
        if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description || $scope.roleCode === constants.module.cgw.roles.admin.description || $scope.roleCode === constants.module.cgw.roles.supervisor.description) { //EJEC
           return ($scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code &&
             $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code &&
             $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejeSI24.description) { //SI24
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observada.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) { //med externo
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return false;
        }
    };

    $scope.crearAmpliacion = function() {
      $state.go('generarAmpliacion', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: $scope.flagClinic}, {reload: true, inherit: false});
    };

    $scope.levantarAmpliacion = function() {
      $state.go('levantarObservacion', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: $scope.flagClinic}, {reload: true, inherit: false});
    };

    $scope.showLevantarObservacion = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.auditado.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
              $scope.roleCode === constants.module.cgw.roles.admin.description ||
              $scope.roleCode === constants.module.cgw.roles.supervisor.description  ||
              $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC

          if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {
            return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code);
          } else {
           return ($scope.cartaGarantia.stateId !== $scope.statusLetter.solicitado.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaEjecutivo.code &&
             $scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code &&
             $scope.cartaGarantia.stateId !== $scope.statusLetter.observacionLevantada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.enProcesoDeAuditoria.code &&
             $scope.cartaGarantia.stateId !== $scope.statusLetter.auditoriaAdministrativa.code);
          }
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return false;
        }
    };

    $scope.areThereObsInternas = function soiFn() {
      if ($scope.observInternas)
        return $scope.observInternas.length > 0;
      else
        return false
    };

    $scope.cancelFrmObsInterna = function cfoiFn() {
      $scope.showFrmObsInterna = false;
    };

    $scope.saveFrmObsInterna = function sfoiFn() {
      $scope.showFrmObsInterna = false;
      $scope.obsInterArr.push(1);

      if ($scope.formData.mObsInterna) {
        var paramsObsInterna = { // RemarkInternalSaveRq
          CodeCompany: parseInt($scope.letterCia),
          Year: $scope.yearLetter,
          Number: $scope.letterNumber,
          Version: $scope.letterVersion,
          User: oimClaims.loginUserName.toUpperCase(),
          Remark: $scope.formData.mObsInterna
        };
        cgwFactory.saveFrmObsInterna(paramsObsInterna).then(function (response) {
          if (response.operationCode === 200) {
            getListObservInternas();
          }
          $scope.formData.mInternalRemarkCommon = {"code":"-- SELECCIONE --","value":""};
          $scope.formData.mObsInterna = '';
       }, function(error) {
        if (error.data)
          mModalAlert.showError(error.data.message, "Error");
        $scope.formData.mInternalRemarkCommon = {"code":"-- SELECCIONE --","value":""};
        $scope.formData.mObsInterna = '';
      });
      }
    };

    $scope.updateProcedimiento = function(index) {
      if ($scope.procedimientosSolicitados)
        recalcular(index);
    };

    function recalcular(index) {
      $scope.totalApprovedAmountProcedimientos = 0;
      if (!$scope.montoInvalido) {
        $scope.showAprobarButton = true;
        $scope.auditarAprobar = true;
      } else {
        $scope.procedimientosSolicitados[index].approvedAmount = $scope.procedimientosSolicitados[index].requestedAmount;
        $scope.showAprobarButton = false;
        $scope.auditarAprobar = false;
      }

      if ($scope.procedimientosSolicitados.length>0) {
        angular.forEach($scope.procedimientosSolicitados, function(value,key) {
          $scope.procedimientosSolicitados[key].CodeBudget = $scope.procedimientosSolicitados[key].codeDetail;
          $scope.totalApprovedAmountProcedimientos += $scope.procedimientosSolicitados[key].approvedAmount;
        });

        $scope.montoIGVProcedimientos = $scope.totalApprovedAmountProcedimientos * ($scope.valorIGV/100);
        $scope.totalAmountProcedimientos = $scope.montoIGVProcedimientos + $scope.totalApprovedAmountProcedimientos;
      }
    }

    $scope.saveProcedimiento = function(procedimientosSolicitados) {
      if (!$scope.montoInvalido) {
        $scope.showAprobarButton = true;
        $scope.auditarAprobar = true;
      }
    };

    /*########################
    # Vigencia
    ########################*/

    $scope.format = 'dd/MM/yyyy';
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
      opened: false
    };
    $scope.popup2 = {
      opened: false
    };

    $scope.open1 = function() {
      $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
      $scope.popup2.opened = true;
    };

    $scope.formData.mConsultaDesde = cgwFactory.restarMes(new Date(), 4);
    $scope.formData.mConsultaHasta = new Date(new Date().setHours(23,59,59,999));

    $scope.dateOptions = {
      initDate: cgwFactory.restarMes(new Date(), 4),
      maxDate: new Date()
    };

    $scope.dateOptions2 = {
      initDate: $scope.formData.mConsultaDesde,
      minDate: new Date(),
      maxDate: new Date()
    };

    $scope.$watch('formData.mConsultaDesde', function (nv) {
      $scope.dateOptions2.minDate = $scope.formData.mConsultaDesde;
       if (typeof $scope.formData.mConsultaDesde !== 'undefined')
        if ($scope.formData.mConsultaDesde > new Date(new Date().setHours(23,59,59,999)) ||
          $scope.formData.mConsultaHasta > new Date(new Date().setHours(23,59,59,999))) {
          mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
        } else {
          getInvoice();
        }
    });

    //movimientos

    $scope.formData.mConsultaDesdeM = cgwFactory.agregarDias(new Date(), -15);
    $scope.formData.mConsultaHastaM = new Date(new Date().setHours(23,59,59,999));

    $scope.dateOptionsM = {
      initDate: cgwFactory.agregarDias(new Date(), -15),
      maxDate: new Date()
    };

    $scope.dateOptionsM2 = {
      initDate: $scope.formData.mConsultaDesdeM,
      minDate: new Date(),
      maxDate: new Date()
    };

    $scope.$watch('formData.mConsultaDesdeM', function (nv) {
      $scope.dateOptions2.minDate = $scope.formData.mConsultaDesdeM;
      if (typeof $scope.formData.mConsultaDesdeM !== 'undefined')
        if ($scope.formData.mConsultaDesdeM > new Date(new Date().setHours(23,59,59,999)) ||
            $scope.formData.mConsultaHastaM > new Date(new Date().setHours(23,59,59,999))) {
            mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
          } else {
            buscarMovimientos();
          }
    });

    function getValueIGV() {
      var paramsValueIGV = {
        CodeCompany: parseInt($scope.letterCia),
        Date: new Date()
      };

      cgwFactory.getValueIGV(paramsValueIGV, true).then(function(response) {
        $scope.valorIGV = response.data.igv;
       }, function(error) {
        if (error.data)
          mModalAlert.showError(error.data.message, "Error");
      });
    }

    function getProcedimientosSolicitados() {
      $scope.paramsProcedimientosSolicitados = {
        Year: $scope.yearLetter,
        Number : $scope.letterNumber,
        Version : $scope.letterVersion,
        CompanyId: $scope.letterCia
      };

       cgwFactory.getProcedimientosSolicitadosDetail($scope.paramsProcedimientosSolicitados).then(function (response) {
        if (response.data.items) {
          $scope.procedimientosSolicitados = response.data.items;

          $scope.totalRequestedAmountProcedimientos = 0;
          $scope.totalApprovedAmountProcedimientos = 0;

          if ($scope.procedimientosSolicitados.length>0) {
            angular.forEach($scope.procedimientosSolicitados, function(value,key) {

              $scope.procedimientosSolicitados[key].CodeBudget = $scope.procedimientosSolicitados[key].codeDetail;

              $scope.totalRequestedAmountProcedimientos += $scope.procedimientosSolicitados[key].requestedAmount;
              $scope.totalApprovedAmountProcedimientos += $scope.procedimientosSolicitados[key].approvedAmount;
            });

            $scope.montoIGVProcedimientos = $scope.totalApprovedAmountProcedimientos * ($scope.valorIGV/100);
            $scope.totalAmountProcedimientos = $scope.montoIGVProcedimientos + $scope.totalApprovedAmountProcedimientos;
          }
        }
      });
    }

    function getListArchivosAdjuntos() {
      $scope.paramsListArchivosAdjuntos = {
        Year: $scope.yearLetter,
        Number : $scope.letterNumber,
        Version : $scope.letterVersion,
        CompanyId: $scope.letterCia
      };

       cgwFactory.getListArchivosAdjuntos($scope.paramsListArchivosAdjuntos).then(function (response) {
        if (response.data.items) {
            $scope.filesOtros = [];
            $scope.filesPatologicos = [];
            var files = response.data.items;
            angular.forEach(files, function(value) {
              if(value.fileType == "P") {
                $scope.filesPatologicos.push(value);
              } else {
                $scope.filesOtros.push(value);
              }
            });
        }
      });
    }

    $scope.downloadAttachFileCGW = function(value) {
      $scope.attachFileCGWURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/guaranteeletter/attachfile/download/' + value.idFile);
      window.open($scope.attachFileCGWURL);
    };

    function getListObservInternas() {
      cgwFactory.getListObservInternas($scope.letterCia, $scope.yearLetter, $scope.letterNumber, $scope.letterVersion).then(function (response) {
        if (response.data.items) {
          $scope.observInternas = response.data.items;
        }
      });
    }

    $scope.irAuditoriaExt = function() {
      $scope.cartaGarantia.statusLetter = $scope.statusLetter.enProcesoDeAuditoria.description;
      if ($scope.roleCode !== constants.module.cgw.roles.clinica.description)
        $state.go('detalleConsultaAuditor', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, auditNumber: 0, flag: 0}, {reload: true, inherit: false});
      else
        $state.go('detalleConsultaAuditor', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, auditNumber: 0, flag: 1}, {reload: true, inherit: false});
    };

    $scope.verUltimaAE = function() {
      var url;
      if ($scope.cartaGarantia.numberExternalAudit > 0) {
        if ($scope.roleCode !== constants.module.cgw.roles.clinica.description) {
          url = $state.href('detalleConsultaAuditor', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, auditNumber: $scope.cartaGarantia.numberExternalAudit, flag: 0}, {reload: true, inherit: false});
          window.open(url,'_blank');
        } else {
          url = $state.href('detalleConsultaAuditor', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, auditNumber: $scope.cartaGarantia.numberExternalAudit, flag: 1}, {reload: true, inherit: false});
          window.open(url,'_blank');
        }
      }
    };

    $scope.downloadMovimientos = function(value) {
        var paramsFile = {
          CodeCompany: parseInt($scope.letterCia),
          Year: $scope.yearLetter,
          Number: $scope.letterNumber,
          StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
          EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
          ClientCode: ($scope.cartaGarantia.clientCode !== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,
          AffiliateCode: ($scope.cartaGarantia.affiliateCode) ? $scope.cartaGarantia.affiliateCode : ''
        };

        $scope.movimientosFileCGWURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/guaranteeletter/report/movements/download/PDF');
        $scope.downloadAtachFile = paramsFile;

        $timeout(function() {
          document.getElementById('frmMovimientosCGW').submit();
        }, 500);
    };

    function buscarMovimientos() {
      if ($scope.cartaGarantia) {
        var paramsXMovimiento = {
          CodeCompany: parseInt($scope.letterCia),
          Year: $scope.yearLetter,
          Number: $scope.letterNumber,
          StartDate: typeof $scope.formData.mConsultaDesdeM === 'undefined' ? cgwFactory.formatearFecha(cgwFactory.agregarDias(new Date(), -15)) : cgwFactory.formatearFecha($scope.formData.mConsultaDesdeM),
          EndDate: typeof $scope.formData.mConsultaHastaM === 'undefined' ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaHastaM),
          ClientCode: ($scope.cartaGarantia.clientCode !== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,
          AffiliateCode: ($scope.cartaGarantia.affiliateCode) ? $scope.cartaGarantia.affiliateCode : ''
        };

        cgwFactory.buscarMovimientos(paramsXMovimiento).then(function (response) {
          if (response.data) {
            if (response.data.items.length>0) {
              $scope.movimientos = response.data.items;

            } else {
              console.log('Error en: buscarMovimientos');
            }
          }
        }, function(error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
          console.log('Error en: buscarMovimientos');
        });
      }
    }

    function getInvoice() {
      $scope.buscarFacturas();
    }

    $scope.changeInternalRemarkCommon = function(item) {
      $scope.formData.mObsInterna = item.value;
    };

    $scope.buscarFacturas = function() {
      if ($scope.cartaGarantia)
        if ($scope.cartaGarantia.clientCode) {
          var paramsFacturas = {
            StartDate: typeof $scope.formData.mConsultaDesde === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesde),
            EndDate: typeof $scope.formData.mConsultaHasta === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHasta),
            ProductCode: typeof $scope.formData.mProductoCobranza === 'undefined' ? "0" : $scope.formData.mProductoCobranza.code,
            ClientCode: ($scope.cartaGarantia.clientCode !== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,
            StatusInvoice: typeof $scope.formData.mEstadoCobranza === 'undefined' ? "T" : $scope.formData.mEstadoCobranza.code,
            AffiliateCode: ($scope.cartaGarantia.affiliateCode) ? $scope.cartaGarantia.affiliateCode : '',
            DocumentNumber: $scope.cartaGarantia.clientDocumentNumber
          };

          cgwFactory.buscarFacturas(paramsFacturas).then(function (response) {
            if (response.data.items.length>0) {
              $scope.facturas = response.data.items;
            } else {
              $scope.facturas = [];
            }
          }, function(error) {
            if (error.data)
              mModalAlert.showError(error.data.message, "Error");
          });
        }
    };

    $scope.showHistorial = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo
          if ($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditado.code)
            return false;
          else
            return true;
        } else {
          return true;
        }
    };

    $scope.hideEditDiagnostico = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditado.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return true;
        } else {
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code);
        }
    };

    $scope.hideEditDiagnostico = function() {
      return ($scope.roleCode === constants.module.cgw.roles.consulta.description || 
        $scope.roleCode === constants.module.cgw.roles.coordinador.description);
    };

    $scope.showAnular = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.ejeSI24.description) {//EJE24
          return ($scope.cartaGarantia.stateId === $scope.statusLetter.auditado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
          $scope.roleCode === constants.module.cgw.roles.admin.description ||
          $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
          $scope.roleCode === constants.module.cgw.roles.medAuditor.description) { //EJEC
          return true;
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return false;
        } else {
          return false;
        }
    };

    $scope.showRechazar = function() {
      if ($scope.cartaGarantia !== undefined)
        if ($scope.roleCode === constants.module.cgw.roles.ejeSI24.description) {//EJE24
          return  ($scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAUDITOR
           return ($scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code);

        } else if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.rechazada.code);
        } else if ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
          $scope.roleCode === constants.module.cgw.roles.coordinador.description) {
          return false;
        } else {
          return true;
        }
    };

    $scope.showObservar = function() {
      if ($scope.cartaGarantia !== undefined) {
        if ($scope.roleCode !== constants.module.cgw.roles.consulta.description && $scope.roleCode !== constants.module.cgw.roles.coordinador.description) {
          return ($scope.cartaGarantia.stateId !== $scope.statusLetter.observada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.liquidado.code &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.procesada.code && $scope.cartaGarantia.stateId !== $scope.statusLetter.aprobado.code);
        }
      }
    };

    $scope.showAprobar =  function() {
      if ($scope.cartaGarantia !== undefined){// && $scope.cartaGarantia.stateIdExternalAudit) {
        if ($scope.roleCode !== constants.module.cgw.roles.consulta.description &&
          $scope.roleCode !== constants.module.cgw.roles.coordinador.description) {
          var auditado = ($scope.cartaGarantia.stateIdExternalAudit === $scope.statusAuditoria.auditado.code);
          if (($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code || $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code || $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
            $scope.cartaGarantia.stateId === $scope.statusLetter.auditado.code) &&
            $scope.showAprobarButton) {
            return true;
          } else {
            if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
              $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
              $scope.roleCode === constants.module.cgw.roles.admin.description ||
              $scope.roleCode === constants.module.cgw.roles.ejeSI24.description ||
              $scope.roleCode === constants.module.cgw.roles.medAuditor.description) {
              if ($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
                $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code ||
                $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaAdministrativa.code ||
                $scope.cartaGarantia.stateId === $scope.statusLetter.observacionLevantada.code ||
                $scope.cartaGarantia.stateId === $scope.statusLetter.auditado.code ||
                $scope.cartaGarantia.stateId === $scope.statusLetter.enProcesoDeAuditoria.code)// && auditado))
                return true;
            } else {
              return ($scope.showAprobarButton && auditado);
            }
          }
        }
      } else {
        return false;
      }
    };

    $scope.showAprobarEjec = function() {
      if ($scope.cartaGarantia !== undefined) {
        if ($scope.roleCode !== constants.module.cgw.roles.consulta.description &&
          $scope.roleCode !== constants.module.cgw.roles.coordinador.description) {
          return (
            ($scope.cartaGarantia.stateId === $scope.statusLetter.solicitado.code ||
              $scope.cartaGarantia.stateId === $scope.statusLetter.auditoriaEjecutivo.code) &&
            ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
              $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
              $scope.roleCode === constants.module.cgw.roles.medAuditor.description) &&
            $scope.cartaGarantia.stateId !== $scope.statusLetter.anulada.code.description);
        }
      }
    };

    $scope.getRojo = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.rechazada.code || item.stateId === $scope.statusLetter.anulada.code);
    };

    $scope.getVerde = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.auditoriaAdministrativa.code);
    };

    $scope.getAmarillo = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.observada.code);
    };

    $scope.getAzul = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.aprobado.code ||  item.stateId === $scope.statusLetter.procesada.code ||
          item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
    };

    $scope.getBlanco = function(item) {
      if (item !== undefined)
        return  (item.stateId === $scope.statusLetter.observacionLevantada.code ||
          item.stateId === $scope.statusLetter.auditado.code || item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code)
    };

    $scope.getTransparent = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.solicitado.code || 
                item.stateId === $scope.statusLetter.auditoriaEjecutivo.code);
    };

    $scope.isAnulada = function() {
      if ($scope.cartaGarantia !== undefined)
       return ($scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code)
    };

    $scope.isObservada = function() {
      if ($scope.cartaGarantia !== undefined)
       return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code);
    };

    $scope.isRechazada = function() {
      if ($scope.cartaGarantia !== undefined)
        return ($scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code)
    };

    $scope.showTabFactura = function() {
      if($scope.cartaGarantia && ($scope.cartaGarantia.productCode === $scope.SCTR || $scope.cartaGarantia.productCode === $scope.SALUD || $scope.cartaGarantia.productCode === $scope.ASISTENCIA_MEDICA)) {
        if ($scope.roleCode) {
          if ($scope.roleCode === constants.module.cgw.roles.medAuditor.description) {//MAD = medico auditor
            $scope.isMedicoAuditor = true;
            return false;
          } else if ($scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
            $scope.roleCode === constants.module.cgw.roles.admin.description ||
            $scope.roleCode === constants.module.cgw.roles.consulta.description ||
            $scope.roleCode === constants.module.cgw.roles.supervisor.description
          ) { //EJEC
            $scope.isMedicoAuditor = false;
            return true;
          } else {
            $scope.isMedicoAuditor = false;
            return false;
          }
        }
      }
    };

    $scope.verifyValue = function(item) {
      $scope.montoInvalido =  item.approvedAmount>item.requestedAmount;
      return $scope.montoInvalido;
    };

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
          scope.observacionesData = {
            paciente: true,
            description: $scope.cartaGarantia.remarkPaciente,
            aditionalRemark: $scope.cartaGarantia.remarkPaciente
          };
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
            lista: $scope.preexistenciasAfiliado,
            lista2: $scope.preexistenciasTemporales
          };
        }]
      });
    };

    $scope.showObservaciones = function() {
     if ($scope.cartaGarantia) {
       return $scope.cartaGarantia.remarkPaciente;
     }
    };

    $scope.showPreExistencias = function() {
      if ($scope.preexistenciasAfiliado) {
        return $scope.preexistenciasAfiliado.length > 0;
      } else {
        return false;
      }
    };

    $scope.rolConsulta = function() {
      return ($scope.roleCode === constants.module.cgw.roles.consulta.description ||
        $scope.roleCode === constants.module.cgw.roles.coordinador.description);
    };

    $scope.rolSupervisor = function() {
     return ($scope.roleCode === constants.module.cgw.roles.supervisor.description);
    };

    $scope.cambiarEjecutivo = function() {
      if ($scope.formData.mEjecutivo.code !== "0" && $scope.rolSupervisor()) {
        var paramsChange = {
          codeCompany: $scope.letterCia,
          year: $scope.yearLetter,
          number: $scope.letterNumber,
          version: $scope.letterVersion,
          executive : $scope.formData.mEjecutivo.code
        };

        cgwFactory.cambiarEjecutivo(paramsChange).then(function (response) {
          if (response.operationCode === 200) {
           mModalAlert.showSuccess("El ejecutivo ha sido cambiado",'');
          }
        }, function(error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        });
      }
    };

    $scope.cargarMovimientos = function() {
      buscarMovimientos();
    };

    $scope.cargarFacturas = function() {
      getInvoice();
    };

    $scope.cargarAuditoria = function() {
      getValueIGV();
      getProcedimientosSolicitados();
      getListArchivosAdjuntos();
      getListObservInternas();
    };

    function setEffectiveDate(value) {
      var parts = value.split('/');
      var effectiveDate = new Date(parts[2], parts[1] - 1, parts[0]);

      var effectiveYear = effectiveDate.getFullYear();
      var actualYear = new Date().getFullYear();
      var diffYear = actualYear - effectiveYear;

      var fecha = ng.copy(effectiveDate);
      fecha.setFullYear(fecha.getFullYear()+diffYear);

      if (fecha > new Date(new Date().setHours(23,59,59,999))){
        fecha = ng.copy(effectiveDate);
        fecha.setFullYear(fecha.getFullYear()+(diffYear-1));
      }

      $scope.CurrentEffectiveDate = fecha;
      $scope.CurrentEndEffectiveDate = cgwFactory.agregarDias(ng.copy(fecha), 364);

      return fecha;
    }

    // Validación que permite mostrar boton "Condicionado"
    $scope.disabledDatosCondicionado = function () {
      if ($scope.dataCondicionado) {
        return false;
      }
        return true;
    };

    // Mostar modal de tarifas
    $scope.verDatosCondicionado = function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: "modal--lg",
        template:
          '<mfp-modal-datos-condicionado data="dataCondicionado" close="close(a)"></mfp-modal-tarifas>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function (scope, $uibModalInstance) {
            scope.dataCondicionado = $scope.dataCondicionado;
            scope.close = function (type) {
              if (type && type === "ok") {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
          },
        ],
      });
    };

    // Validacion que permite mostrar boton "Ver Tarifas"
    $scope.showTarifas = function () {
      if ($scope.cartaGarantia) {
      return ($scope.cartaGarantia.productCode != 'O' && $scope.cartaGarantia.productCode != 'A');
      }
      return false;
    };
    
    // Mostrar modal de tarifas
    $scope.mostrarTarifas = function () {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: "modal--lg",
        template:
          '<mfp-modal-tarifas carta="dataCarta" close="close(a)"></mfp-modal-tarifas>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function (scope, $uibModalInstance) {
            scope.dataCarta = {
              CodeCompany: parseInt($scope.letterCia),
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
            };
            scope.close = function (type) {
              if (type && type === "ok") {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
          },
        ],
      });
    };

    // Validacion que permite mostrar boton "Solicitar SCAN"
    $scope.showSolicitarScan = function () {
      return ($scope.roleCode === constants.module.cgw.roles.supervisor.description ||
      $scope.roleCode === constants.module.cgw.roles.medAuditor.description ||
      $scope.roleCode === constants.module.cgw.roles.ejecutivo.description) && 
      ($scope.cartaGarantia !== undefined && $scope.cartaGarantia.scanRequestIndicator == "N" && 
       !($scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code || 
        $scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code)) &&
      ($scope.cartaGarantia.productCode != 'O' && $scope.cartaGarantia.productCode != 'A');
    };

    // Mostrar modal de scan
    $scope.solicitarScan = function () {
      var listScan = [];
      var items = Object.values($scope.clinicsToAdd);
      angular.forEach(items, function(itm){ 
        angular.forEach(itm, function(itm2){ 
          listScan.push(itm2);
        });
      });
      
      var params = { usuario: oimClaims.loginUserName.toUpperCase(), listscan: listScan };

      cgwFactory.SaveScanRequest($scope.yearLetter, $scope.letterNumber, params, true).then(function(response) {
        if (response.operationCode == 200) {
          $state.reload();
        } else {
          mModalAlert.showError(response.message, 'Error');
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    };

    // Obtener datos de Scan
    function obtenerScan() {
      var paramsSearch = {
        Filter: '',
        PageNumber: 1,
        PageSize: 5
      };

      cgwFactory.GetCoordinatorByGuaranteeLetter($scope.yearLetter, $scope.letterNumber, paramsSearch, true).then(function(response) {
        if (response.data) {
          if (response.data.lista.length > 0) {
            var results = response.data.lista;
            angular.forEach(results, function(itm){ 
              var clinicas = $scope.clinicsToAdd[itm.cod_usuario] || [];
              if(clinicas.length == 0) {
                var params = { PageNumber: 1, PageSize: 100 };
          
                cgwFactory.GetClinicsByCoordinatorToScanRequest($scope.yearLetter,$scope.letterNumber, itm.cod_usuario, params, true).then(function(response) {
                  if (response.operationCode == 200) {
                    if (response.data) {
                      if (response.data.lista.length > 0) {
                        clinicas = response.data.lista;
                        var items = [];
                        angular.forEach(clinicas, function(itm2){
                          var element = {
                            coordinator: itm2.coordinator,
                            codClinic: itm2.codClinic,
                            nSucClinic: itm2.nSucClinic
            };
                          items.push(element);
                          $scope.clinicsToAdd[itm.cod_usuario] = items;
                        });
                      } else {
                        clinicas = [];
                      }
              } else {
                      clinicas = [];
                    }
                    itm.cant_scan = String(clinicas.length);
                  }
                });
              }
            });
          }
              }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    };

    // Validacion que permite mostrar boton "Alto Costo"
    $scope.showAltosCostos = function () {
      if ($scope.cartaGarantia !== undefined) {
        var codeReasonAnulled = $scope.cartaGarantia.codeReasonAnulled ? $scope.cartaGarantia.codeReasonAnulled.trim() : $scope.cartaGarantia.codeReasonAnulled;
        return (
          ($scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code && codeReasonAnulled === '5') && 
          ($scope.cartaGarantia.productCode != 'O' && $scope.cartaGarantia.productCode != 'A')
        );
      } else {
        return false;
      }
    };

    // Mostrar modal de altos costos
    $scope.mostrarAltosCostos = function () {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: "modal--lg",
        template:
          '<mfp-modal-altos-costos carta="dataCarta" close="close(a)"></mfp-modal-tarifas>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function (scope, $uibModalInstance) {
            scope.dataCarta = {
              CodeCompany: parseInt($scope.letterCia),
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
              Version: $scope.letterVersion,
              UserLogin: oimClaims.loginUserName.toUpperCase()
            };
            scope.close = function (type) {
              if (type && type === "ok") {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
          },
        ],
      });
    };

    // Validacion que permite mostrar boton "Datos Scan" (editable)
    $scope.showDatosScanEdit = function () {
      return ($scope.roleCode === constants.module.cgw.roles.coordinador.description) &&
        ($scope.cartaGarantia !== undefined && !($scope.cartaGarantia.stateId === $scope.statusLetter.rechazada.code || 
        $scope.cartaGarantia.stateId === $scope.statusLetter.anulada.code)) &&
        ($scope.cartaGarantia.productCode != 'O' && $scope.cartaGarantia.productCode != 'A');
    };

    // Mostrar modal de datos scan - editable
    $scope.editarDatosScan = function () {
      console.log()
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: "modal--lg",
        template:
          '<mfp-modal-datos-scan-edit carta="dataCarta" close="close(a)"></mfp-modal-datos-scan-edit>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function (scope, $uibModalInstance) {
            scope.dataCarta = {
              CodeCompany: parseInt($scope.letterCia),
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
              UserLogin: oimClaims.loginUserName.toUpperCase()
            };
            scope.close = function (type) {
              if (type && type === "ok") {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
          },
        ],
      });
    };

    // Validacion que permite mostrar boton "Datos Scan" (lectura)
    $scope.showDatosScan = function () {
      return ($scope.roleCode === constants.module.cgw.roles.supervisor.description ||
      $scope.roleCode === constants.module.cgw.roles.medAuditor.description ||
      $scope.roleCode === constants.module.cgw.roles.ejecutivo.description) && 
      ($scope.cartaGarantia !== undefined && $scope.cartaGarantia.scanDataIndicator == "S") &&
      ($scope.cartaGarantia.productCode != 'O' && $scope.cartaGarantia.productCode != 'A');
    };

    // Mostrar modal de datos scan
    $scope.verDatosScan = function () {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: "modal--lg",
        template:
          '<mfp-modal-datos-scan carta="dataCarta" close="close(a)"></mfp-modal-datos-scan>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function (scope, $uibModalInstance) {
            scope.dataCarta = {
              CodeCompany: parseInt($scope.letterCia),
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
            };
            scope.close = function (type) {
              if (type && type === "ok") {
                $uibModalInstance.close();
              } else {
                $uibModalInstance.dismiss();
              }
            };
          },
        ],
      });
    };

    $scope.truncText = function (text) {
      if(text && text.length > largomaximo) {
        return text.substr(0, largomaximo) + '...';
      } else {
        return text;
      }
    };

    // Validacion que permite habilitar el boton "Invalidez"
    $scope.disableBtnInvalidez = function() {
      return $scope.showMsgAseguradoObservado || ($scope.cartaGarantia && $scope.cartaGarantia.invaliditySendingInd == 'S');
    };

    // Mostral modal de invalidez
    $scope.verPopupInvalidez = function() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        template:
          '<mfp-modal-invalidez carta="carta" close="close()" confirm="confirm()"></mfp-modal-invalidez>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function (scope, $uibModalInstance) {
            scope.carta = {
              Year: $scope.yearLetter,
              Number: $scope.letterNumber,
              Version: $scope.letterVersion
            };

            scope.close = function () {
              $uibModalInstance.dismiss();
            };

            scope.confirm = function () {
                $uibModalInstance.close();
              $state.reload();
            };
          },
        ],
      });
    };

    // Generar solicitud reticencia
    $scope.generarReticencia = function() {
      var body = {
        tipoDocumento: $scope.cartaGarantia.typeDocument,
        codigoDocumento: $scope.cartaGarantia.documentNumber
      };

      mpSpin.start();
      cgwFactory.GenerateReticencia(body).then(function(response) {
        mpSpin.end();
        if(response.status === 200) {
          mModalAlert.showSuccess('Se registró la solicitud de reticencia con éxito', '');
        } else if(response.status === 204) {
          mModalAlert.showError('No existe información para procesar', 'Error');
        } else {
          mModalAlert.showError('Hubo un error al registrar la solicitud de reticencia', 'Error');
        }
      },
      function(error) {
        mpSpin.end();
        mModalAlert.showError("Hubo un error al registrar la solicitud de reticencia", 'Error');
      });
    };

  } //  end controller

  return ng.module('appCgw')
    .controller('DetalleConsultaAdminController', detalleConsultaAdminController)
    .directive('cgwTabsFixed', ['$timeout','$window', function($timeout,$window) {
      // Runs during compile
      return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, element, attrs) {
          scope.widthWindow = $window.innerWidth; console.log(scope.widthWindow + 'px');
          var rectTimeout = $timeout(function() {
            var rawDom = element.find('ul')[0]; //console.log(rawDom)
            var rect = rawDom.getBoundingClientRect(),
              scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
              scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
              top: rect.top + scrollTop,
              left: rect.left + scrollLeft
            }
          }, 100);
          rectTimeout.then(function(positionTabs) {
            scope.heightScrollTabs = positionTabs.top;
            angular.element($window).bind('scroll', function() {
              if (this.pageYOffset >= scope.heightScrollTabs) {
                scope.boolChangeClassTabs = true;
              } else {
                scope.boolChangeClassTabs = false;
              }
              if (scope.widthWindow >= 1200) {
                scope.changeTabWidth = true;
              } else {
                scope.changeTabWidth = false;
              }
              scope.$apply();
            });
          });
        }
      };
    }]);
});
