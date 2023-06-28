define([
  'angular', 'constants',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  ModalRechazarCartaController.$inject = ['$scope', '$stateParams', '$state', '$timeout', 'cgwFactory', 'mModalAlert', 'oimClaims', '$sce', '$q', 'accessSupplier', '$http', 'mpSpin', 'mainServices'];

  function ModalRechazarCartaController($scope, $stateParams, $state, $timeout, cgwFactory, mModalAlert, oimClaims, $sce, $q, accessSupplier, $http, mpSpin, mainServices) {
    var vm = this;

    $scope.files = [];
    $scope.filesRechazo = [];
    $scope.rechazo = {};
    $scope.emailInfo = {};

    var profile = accessSupplier.profile();

    vm.$onInit = function() {
      if (constants.environment === 'QA') {
        $scope.statusLetter = constants.module.cgw.statusLetter.QA;
      }else  if (constants.environment === 'DEV') {
        $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
      } else {
        $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
      }

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;

      var paramsLetter = {
        CompanyId: parseInt($scope.letterCia),
        Year: parseInt($scope.yearLetter),
        Number: parseInt($scope.letterNumber),
        Version: parseInt($scope.letterVersion)
      };

      mpSpin.start();
      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

            cgwFactory.getDetailLetter(paramsLetter).then(function (response) {
              mpSpin.end();
              if (response.data) {
                $scope.cartaGarantia = response.data;
                $scope.isSCTR = ($scope.cartaGarantia.productCode === $scope.SCTR);

                $scope.cartaGarantia.remark = localStorage.getItem("remark");

                $scope.rechazo.preview = $scope.cartaGarantia.rejectionDescription;

                $scope.rechazo.mArticle = $scope.cartaGarantia.article;

                $scope.rechazo.mExMedico1 = $scope.cartaGarantia.medicalExam1;
                $scope.rechazo.mExMedico2 = $scope.cartaGarantia.medicalExam2;
                $scope.rechazo.mExMedico3 = $scope.cartaGarantia.medicalExam3;

                $scope.rechazo.mMedicamento1 = $scope.cartaGarantia.medicine1;
                $scope.rechazo.mMedicamento2 = $scope.cartaGarantia.medicine2;
                $scope.rechazo.mMedicamento3 = $scope.cartaGarantia.medicine3;

                if($scope.cartaGarantia.diagnosticCode1) cargarDiagnosticoRechazo(1, $scope.cartaGarantia.diagnosticCode1);
                if($scope.cartaGarantia.diagnosticCode2) cargarDiagnosticoRechazo(2, $scope.cartaGarantia.diagnosticCode2);
                if($scope.cartaGarantia.diagnosticCode3) cargarDiagnosticoRechazo(3, $scope.cartaGarantia.diagnosticCode3);

                listarMotivosRechazo();
                obtenerDataCondicionado();
                validarRechazoSCTR();
                getProcedimientosSolicitados();
                listarDocumentosRechazo();
              } else {
                $scope.cancelarRechazo();
              }
            }, function(error) {
              mpSpin.end();
              if (error.data) {
                mModalAlert.showError(error.data.message, "Error").then(function(response) {
                  $scope.cancelarRechazo();
                }, function(error) {
                  $scope.cancelarRechazo();
                });
              }
            });
         }
      });
    };

    // Adjuntar archivo (Rechazo)
    $scope.$watch('myFile', function(nv) {
      if ($scope.myFile !== undefined) {
        appendDocument($scope.myFile);
      }
    });

    // Obtener previsualizacion en base al motivo de rechazo elegido
    $scope.obtenerPrevisualizacionPorMotivoRechazo = function(reasonCode) {
      cgwFactory.GetPreviewByRejectReason($scope.letterCia, reasonCode, true).then(
        function (response) {
          if (response.operationCode == 200) {
            if(response.data.items.length > 0) {
              var item = response.data.items[0];
              $scope.rechazo.preview = item.description;
            }
          } else {
            $scope.rechazo.preview = "";
          }
        },
        function (error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        }
      );
    }

    // Opciones relacionadas al editor HTML
    $scope.onEditorCreated = function (editor) {
      $scope.editor = editor;
    };

    $scope.undoEditor = function() {
      $scope.editor.history.undo();
    };

    $scope.redoEditor = function() {
      $scope.editor.history.redo();
    };

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

    // Ejecutar rechazo
    $scope.ejecutarRechazo = function() {
      if ($scope.rechazo.mMotivo.id === 1 || $scope.rechazo.mMotivo.id === 2 ||
        $scope.rechazo.mMotivo.id === 5 || $scope.rechazo.mMotivo.id === 6) {
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = $scope.rechazo.mCodDiagnostico1 ? $scope.rechazo.mCodDiagnostico1.code : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = $scope.rechazo.mCodDiagnostico2 ? $scope.rechazo.mCodDiagnostico2.code : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = $scope.rechazo.mCodDiagnostico3 ? $scope.rechazo.mCodDiagnostico3.code : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";
      } else if ($scope.rechazo.mMotivo.id === 4) {
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = $scope.rechazo.mMotivoText ? $scope.rechazo.mMotivoText : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = $scope.rechazo.mMotivoDetalle ? $scope.rechazo.mMotivoDetalle : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";
      } else if ($scope.rechazo.mMotivo.id === 7) {
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = $scope.rechazo.mArticle ? $scope.rechazo.mArticle : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";
      } else if ($scope.rechazo.mMotivo.id === 8) {
        //medicamentos
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = $scope.rechazo.mMedicamento1 ? $scope.rechazo.mMedicamento1 : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = $scope.rechazo.mMedicamento2 ? $scope.rechazo.mMedicamento2 : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = $scope.rechazo.mMedicamento3 ? $scope.rechazo.mMedicamento3 : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";

        if ($scope.cartaGarantia.codeCompany !== constants.module.cgw.seguros) paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        else paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = $scope.rechazo.mMotivoDetalle ? $scope.rechazo.mMotivoDetalle : "";
      } else if ($scope.rechazo.mMotivo.id === 9 || 
        ($scope.rechazo.mMotivo.id === 3 && $scope.cartaGarantia.codeCompany === constants.module.cgw.seguros)
      ) {
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = $scope.rechazo.mMotivoExclusion ? $scope.rechazo.mMotivoExclusion : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";
      } else if ($scope.rechazo.mMotivo.id === 10 && $scope.cartaGarantia.codeCompany === constants.module.cgw.seguros) {
        //examen medico

        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = $scope.rechazo.mExMedico1 ? $scope.rechazo.mExMedico1 : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = $scope.rechazo.mExMedico2 ? $scope.rechazo.mExMedico2 : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = $scope.rechazo.mExMedico3 ? $scope.rechazo.mExMedico3 : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";
      } else {
        paramsLetter = getTramaCarta();
        paramsLetter.GuaranteeLetter.ForcedCopayment = 0;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.CodeReject = $scope.rechazo.mMotivo.id;
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DiagnosticCode3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.MedicalExam3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication1 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication2 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Medication3 = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Article = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReason = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.OtherReasonDetail = "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.Observation = $scope.cartaGarantia.remark ? $scope.cartaGarantia.remark : "";
        paramsLetter.GuaranteeLetter.GuaranteeLetterVersion.DescriptionReject = $scope.rechazo.preview ? $scope.rechazo.preview : "";
      }

      setUpdateComplaintRejectStatus();

      if($scope.isSCTR && $scope.showSeccUpdateComplaintStatus && $scope.rechazo.mActualizaEstadoDenuncia === 'N') {
        mModalAlert.showWarning("El sistema &uacute;nicamente actualizar&aacute; el estado de la Carta de Garant&iacute;a", "Rechazar").then(function(resp) {
          if(resp) {
            ejecutarRechazoApi(paramsLetter);
          }
        });
      } else {
        ejecutarRechazoApi(paramsLetter);
      }
    }

    // Cancelar Rechazo
    $scope.cancelarRechazo = function() {
      $state.go('detalleConsultaAdmin', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: 0, state: ''}, {reload: true, inherit: false});
    }

    // Eliminar archivo adjunto (Rechazo)
    $scope.deleteFile = function(index, file) {
      if(file.opt === 1) {
        $scope.filesRechazo.splice(index, 1);
      } else {
        var params = {
          year: $scope.yearLetter,
          version: $scope.letterVersion
        };

        cgwFactory.deleteDocumentReject($scope.letterNumber, file.documentId, params, true).then(function(response) {
          if (response.operationCode === 200) {
            $scope.filesRechazo.splice(index, 1);
          } else {
            mModalAlert.showError("Ha occurido un error al momento de eliminar su archivo.", "Error");
          }
        }); 
      }
    }

    // Descargar archivo adjunto (Rechazo)
    $scope.downloadFile = function(file) {
      mpSpin.start()
      $http.get(constants.system.api.endpoints.cgw + 'api/guaranteeletter/'+file.number+'/document/'+file.documentId+'?year='+file.year+'&version='+file.version,
        { responseType: 'blob' }
      )
      .success(function (data, status, headers) {
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
      })
      .error(function (response) {
        mModalAlert.showError("Ha sucedido un error al momento de descargar el archivo", "Error");
        mpSpin.end();
      });
    }

    // Cargar diagnostico de rechazo en base a codigo
    function cargarDiagnosticoRechazo(diagnosticNumber, code) {
      var paramDiagnostic = { diagnosticName: code };

      cgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
        var list = response.data.items;
        var diagnostic = _.find(list, function (item) {
          return item.code == code;
        });

        if(diagnosticNumber == 1) $scope.rechazo.mCodDiagnostico1 = diagnostic;
        if(diagnosticNumber == 2) $scope.rechazo.mCodDiagnostico2 = diagnostic;
        if(diagnosticNumber == 3) $scope.rechazo.mCodDiagnostico3 = diagnostic;
      });
    }

    // Consumir API para rechazar carta
    function ejecutarRechazoApi(paramsLetter) {
      cgwFactory.rejectLetter(paramsLetter).then(
        function (response) {
          if (response.operationCode === 200) {
            mModalAlert.showSuccess(response.data.message, "", "").then(function (response) {
              if (response) {
                if (
                  $scope.roleCode === constants.module.cgw.roles.ejecutivo.description ||
                  $scope.roleCode === constants.module.cgw.roles.admin.description ||
                  $scope.roleCode === constants.module.cgw.roles.supervisor.description ||
                  $scope.roleCode === constants.module.cgw.roles.medAuditor.description
                ) {
                  var promises = [];

                  var files = $scope.filesRechazo.filter(function(item) { return item.opt == 1; });

                  promises.concat(adjuntDocumentsReject(files));

                  $q.all(promises).then(function (resp) {
                    sendEmail(files);

                    //EJEC
                    $scope.pdfLetterURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw +
                      "api/guaranteeletter/reject/download/" + $scope.letterCia + "/" + $scope.yearLetter +
                      "/" + $scope.letterNumber + "/" + $scope.letterVersion + "/PDF"
                    );
                    $timeout(function () {
                      document.getElementById("frmDownloadLetter").submit();

                      $scope.cancelarRechazo();
                    }, 500);
                  });
                } else {
                  $scope.cancelarRechazo();
                }
              } else {
                $scope.cancelarRechazo();
              }
            });
          } else {
            mModalAlert.showInfo(response.data.message, "");
          }
        },
        function (error) {
          if (error.data) mModalAlert.showError(error.data.message, "Error");
        }
      );
    }

    // Listar procedimientos (para trama)
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

          if ($scope.procedimientosSolicitados.length>0) {
            angular.forEach($scope.procedimientosSolicitados, function(value,key) {
              $scope.procedimientosSolicitados[key].CodeBudget = $scope.procedimientosSolicitados[key].codeDetail;
            });
          }
        }
      });
    }

    // Listar motivos de rechazo
    function listarMotivosRechazo() {
      cgwFactory.getListRechazos($scope.letterCia).then(
        function (response) {
          if (response.data.items.length > 0) {
            $scope.motivosRechazo = response.data.items;

            if($scope.cartaGarantia.rejectionCode) {
              $scope.rechazo.mMotivo = _.find($scope.motivosRechazo, function (item) {
                return item.id == $scope.cartaGarantia.rejectionCode;
              });
            }
          }
        },
        function (error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        }
      );
    }

    // Obtener data de condicionado
    function obtenerDataCondicionado() {
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

    // Listar documentos adjuntos de rechazo
    function listarDocumentosRechazo() {
      cgwFactory.getListDocumentsReject($scope.yearLetter, $scope.letterNumber, $scope.letterVersion, true).then(function(response) {
        if (response.operationCode == 200) {
          $scope.filesRechazo = response.data.documents.filter(function(item) { return item.statusCode == 'V'; });
          $scope.emailInfo = response.data.emailData;
        }
      });
    }

    // Validar rechazo SCTR
    function validarRechazoSCTR() {
      $scope.showSeccUpdateComplaintStatus = false;

      if($scope.isSCTR && $scope.cartaGarantia.newProcess) {
        $scope.showSeccUpdateComplaintStatus = true;

        if(!$scope.cartaGarantia.accidentNumber && !$scope.cartaGarantia.accidentYear) {
          if($scope.showMsgClienteImportante) {
            $scope.showSeccUpdateComplaintStatus = false;
          } else {
            mModalAlert.showError("Para rechazar la carta de garant&iacute;a se requiere tener asociada una denuncia de accidente SCTR", "Error")
            .then(function() {
              $scope.cancelarRechazo();
            });
            return;
          }
        } 

        if($scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.rejected) {
          $scope.showSeccUpdateComplaintStatus = false;
        }
        
        if($scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.finalized && 
          $scope.cartaGarantia.accidentBenefitCode.trim() !== generalConstants.benefits.hospitable.id) {
          $scope.showSeccUpdateComplaintStatus = false;
        }
  
        if($scope.showSeccUpdateComplaintStatus) {
          if($scope.cartaGarantia.accidentBenefitCode.trim() === generalConstants.benefits.hospitable.id &&
            ($scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.inProcess || 
              $scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.approved || 
              $scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.finalized)) {
            $scope.rechazo.mActualizaEstadoDenuncia = "S";
            $scope.rechazo.nActualizaEstadoDenunciaDisable = true;
          }
  
          if($scope.cartaGarantia.accidentStatus === generalConstants.complaint.status.approved 
            && $scope.cartaGarantia.accidentBenefitCode.trim() !== generalConstants.benefits.hospitable.id
            ) {
            delete $scope.rechazo.mActualizaEstadoDenuncia;
            $scope.rechazo.nActualizaEstadoDenunciaDisable = false;
          }
          
          listarMotivosRechazoDenuncia();
        }
      }
    }

    // Listar motivos de rechazo para denuncia
    function listarMotivosRechazoDenuncia() {
      cgwFactory.GetListComplaintReasonReject(false).then(
        function (response) {
          if (response.data.items.length > 0) {
            $scope.motivosRechazoDenuncia = response.data.items;
          }
        },
        function (error) {
          if (error.data)
            mModalAlert.showError(error.data.message, "Error");
        }
      );
    }

    // Setear estado "rechazo" para denuncia
    function setUpdateComplaintRejectStatus() {
      if($scope.showSeccUpdateComplaintStatus && $scope.isSCTR) {
        paramsLetter.GuaranteeLetter.UpdateComplaintStatus = ($scope.rechazo.mActualizaEstadoDenuncia === "S");

        if($scope.rechazo.mMotivoRechazoDenuncia) {
          paramsLetter.GuaranteeLetter.ComplaintReasonReject = {
            CodeReject: $scope.rechazo.mMotivoRechazoDenuncia.id,
            Observation: $scope.rechazo.mObsRechazoDenuncia
          };
        }
      }
    }

    // Generar trama para guardar rechazo
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

    // Adjuntar documento
    function appendDocument(file) {
      var accept = ".pdf, .msg, .jpg, .jpeg, .doc, .docx"
      var aAccept = accept.split(",");

      if (!file || file.length == 0){
        mModalAlert.showError("Adjute un documento.",  "Documento");
        return;
      }

      if (file[0].size >= 25000000){
        mModalAlert.showError("El archivo seleccionado supera el tamaño de 25 megas, selecione uno de menos tamaño", "Documento");
        return;
      }

      if (!_.find(aAccept, function(x){ return file[0].name.toLowerCase().indexOf(x.trim().toLowerCase()) != -1; })){
        mModalAlert.showError("Seleccione un archivo con las siguientes extensiones permitidas: " + accept, "Documento");
        return;
      }

      mainServices.fnFileSerializeToBase64(file[0]).then(function (data) {
        encoded = data.toString().replace(/^data:(.*,)?/, '');
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }

        var paramsFile = { 
          opt: 1,
          year: $scope.yearLetter,
          number: $scope.letterNumber,
          version: $scope.letterVersion,
          documentName: file[0].name,
          statusCode: 'V',
          registrationUser: profile.loginUserName,
          updateUser: profile.loginUserName,
          file: file[0],
          base64: encoded, 
          documentType: file[0].type
        };

        $scope.filesRechazo.push(paramsFile);

        delete $scope.file;
      });
    }

    // Adjuntar un documento via Webservice
    function adjuntDocumentsReject(documents) {
      var promises = [];

      angular.forEach(documents, function (a, b) {
        var fd = new FormData();

        var document = {
          year: a.year,
          number: a.number,
          version: a.version,
          documentId: 0,
          documentName: a.documentName,
          statusCode: a.statusCode,
          registrationUser: a.registrationUser,
          updateUser: a.updateUser
        };

        var fileUpload = a.file;

        fd.append("request", JSON.stringify(document));
        fd.append("fieldNameHere", fileUpload);

        promises.push($http.post(constants.system.api.endpoints.cgw + 'api/guaranteeletter', fd, { 
          transformRequest: angular.identity, 
          headers: {'Content-Type': undefined } 
        }));
      });

      return promises;
    }

    // Enviar correo con adjuntos
    function sendEmail(documents) {
      if($scope.emailInfo && $scope.emailInfo.patientEmail !== '') {
        patientEmail = $scope.emailInfo.patientEmail;

      var body = 'Rechazo de carta de garantía';
        if($scope.emailInfo.body !== '') {
        body = $scope.emailInfo.body;
      }

      var patient = $scope.cartaGarantia.patientFullName;
        if($scope.emailInfo.patientName !== '') {
        patient = $scope.emailInfo.patientName;
      }

      var policy = $scope.cartaGarantia.policyNumber;
        if($scope.emailInfo.policyNumber !== '') {
          policy = $scope.emailInfo.policyNumber;
      }

      var subject = 'Rechazo de carta de garantía';
        if($scope.emailInfo.subject !== '') {
          subject = "N° DE CARTA " + $scope.yearLetter + "-" + $scope.letterNumber + " - " + $scope.emailInfo.subject + " " + policy + " - " + patient;
      }

      var sender = "UnidadCartasGarantia@mapfre.com.pe";
        if($scope.emailInfo.sender !== '') {
        sender = $scope.emailInfo.sender;
      }

      var copyEmail = null;
        if($scope.emailInfo.copyEmail !== '') {
        copyEmail = $scope.emailInfo.copyEmail;
      }

      var params = {
        Body: body,
          IsBodyHtml: false,
        Subject: subject,
        cAttachments: [],
        cBcc: null,
        cCc: copyEmail,
        cFrom: sender,
        cTo: patientEmail
      };

      angular.forEach(documents, function(value) {
        var fileData = {
          FileBase64: value.base64,
          Name: value.documentName,
          MimeType: value.documentType
        }

        params.cAttachments.push(fileData);
      });

      return cgwFactory.SendMail(params, vm.carta, true);
      } else {
        mModalAlert.showError("El asegurado no tiene configurado su correo", "Error")
      }
    };
  } // end controller

  return ng.module('appCgw')
    .controller('ModalRechazarCartaController', ModalRechazarCartaController);
});