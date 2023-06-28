define([
  'angular', 'constants', 'modalPresupuesto', '/cgw/app/factory/cgwFactory.js',
  '/scripts/mpf-main-controls/components/modalTextArea/component/modalTextArea.js',
  '/cgw/app/solicitudCG/component/modalPreExistencias.js'
], function(ng, constants) {

  detalleConsultaClinicaController.$inject = ['$scope', '$rootScope',  '$uibModal', '$stateParams', 'cgwFactory', '$state', '$sce', '$timeout', 'mModalAlert', 'oimClaims', 'mpSpin'];

  function detalleConsultaClinicaController($scope, $rootScope, $uibModal, $stateParams, cgwFactory, $state, $sce, $timeout, mModalAlert, oimClaims, mpSpin) {

    $scope.SCTR = "SCTR";
    $scope.SALUD = "SALUD";
    $scope.ASISTENCIA_MEDICA = "AA.MM.";
    $scope.SOAT = "SOAT";
    $scope.AAPP = "AAPP";
    $scope.AUTO = "AUTO";

    $scope.dynamicPopover = {
      templateUrl: 'denunciaRelatoTooltipPlantilla.html',
    };

    var largomaximo = 50;

    (function onLoad() {
      $scope.formData = $rootScope.formData || {};

      if (constants.environment === 'QA') {
        $scope.statusLetter = constants.module.cgw.statusLetter.QA;
      }else  if (constants.environment === 'DEV') {
        $scope.statusLetter = constants.module.cgw.statusLetter.DEV;
      } else {
        $scope.statusLetter = constants.module.cgw.statusLetter.PROD;
      }

      $scope.enMora = true; // cuando el asegurado está en mora por más de 3 meses
      $scope.letterNumber =  $stateParams.id;
      $scope.yearLetter =  $stateParams.year;
      $scope.letterVersion =  $stateParams.version;
      $scope.letterCia =  $stateParams.cia;

      $scope.collapse1 = true;

      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);

      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        mpSpin.start();
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

          if ($scope.roleCode !== constants.module.cgw.roles.clinica.description) {
            $state.go('detalleConsultaAdmin', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: $scope.flagClinic, state: ''}, {reload: true, inherit: false});
          } else {
            var paramsLetter =
            {
              CompanyId: parseInt($scope.letterCia),
              Year: parseInt($scope.yearLetter),
              Number: parseInt($scope.letterNumber),
              Version: parseInt($scope.letterVersion)
            };

            cgwFactory.getDetailLetter(paramsLetter).then(function (response) {

              if (response.operationCode === 200){
                if (response.data) {
                $scope.cartaGarantia = response.data;
                  ($scope.cartaGarantia.company === 'MAPFRE SEGUROS') ? $scope.cartaGarantia.isSeguros = true : $scope.cartaGarantia.isSeguros = false;

                  var paramsAfiliado = {
                    CodeProvider: $scope.cartaGarantia.providerCode,
                    CodeBranchOffice: $scope.cartaGarantia.branchClinicCode,
                    PlanNumber: $scope.cartaGarantia.numberPlan.toString(),

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

                  $scope.isSCTR = ($scope.cartaGarantia.productName === 'SCTR');

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

                  if($scope.cartaGarantia.productCode === $scope.SCTR || $scope.cartaGarantia.productCode === $scope.SALUD || $scope.cartaGarantia.productCode === $scope.ASISTENCIA_MEDICA) {

                    cgwFactory.getAffiliate_Load(paramsAfiliado, true).then(function(response) {
                      mpSpin.end();
                      $scope.cartaGarantia.patientInfo = response.data.patientInfo;
                      $scope.cartaGarantia.preexistences = response.data.preexistences;
                      $scope.cartaGarantia.remarkPaciente = response.data.remark;
                      $scope.showObservaciones();
                    }, function(error) {
                      mpSpin.end();
                      mModalAlert.showError(error.data.message, 'Error');
                    });

                    cgwFactory.getPic($scope.letterCia, $scope.cartaGarantia.affiliateCode).then(function (response) {
                      $scope.picAfiliado = response;
                    }, function(error) {
                      if (error.data)
                        mModalAlert.showError(error.data.message, "Error");
                      console.log('Error en: getPic');
                      $scope.showPic = false;
                    });
                  } else {
                    mpSpin.end();
                  }
              } else {
                console.log('Error en: getDetailLetter')
              }
              }else {
                mModalAlert.showError(response.message, 'Error').then(function () {
                  $state.go('consultaCgw', {reload: true, inherit: false});
                });
              }
            }).catch(function(err){
              mpSpin.end();
              mModalAlert.showError(err.data.message, 'Error').then(function () {
                $state.go('consultaCgw', {reload: true, inherit: false});
              });
            });
          }
        }
      });

    })();

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

     //movimientos

    $scope.formData.mConsultaDesdeM = cgwFactory.agregarDias(new Date(), -15);
    $scope.formData.mConsultaHastaM = new Date(new Date().setHours(23,59,59,999));

    $scope.dateOptionsM = {
      initDate: cgwFactory.agregarDias(new Date(), -15),
      maxDate: new Date()
    };

    $scope.dateOptionsM2 = {
      initDate: $scope.formData.mConsultaDesdeMM,
      minDate: new Date(),
      maxDate: new Date()
    };

    $scope.$watch('formData.mConsultaDesdeM', function(nv)
    {
      $scope.dateOptionsM.minDate = $scope.formData.mConsultaDesdeM;
      if (typeof $scope.formData.mConsultaDesdeM !== 'undefined')
        if ($scope.formData.mConsultaDesdeM > new Date(new Date().setHours(23,59,59,999)) ||
            $scope.formData.mConsultaHastaM > new Date(new Date().setHours(23,59,59,999))) {
            mModalAlert.showError("Fecha no puede ser mayor a la fecha actual", "Error");
          } else {
            buscarMovimientos();
          }
    });

    $scope.carta = {};
    $scope.carta.estado = '1';

    // tpls de los tabs
    $scope.tabPaciente = '/cgw/app/consultaCG/component/tabPaciente-clinica.html';
    $scope.tabCG = '/cgw/app/consultaCG/component/tabCG-clinica.html';
    $scope.tabPresupuesto = '/cgw/app/consultaCG/component/tabPresupuesto-clinica.html';
    $scope.tabMovimientos = '/cgw/app/consultaCG/component/tabMovimientos.html';

    $scope.cargarPresupuesto = function cpFn() {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--500 modal--budget fade',
        template: '<mpf-modal-presupuesto data="data" close="close()"></mpf-modal-presupuesto>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.data = {
            lista: ''
          };
        }]
      });
    };

    function getListArchivosAdjuntos() {
      $scope.paramsListArchivosAdjuntos = {
        Year: $scope.yearLetter,
        Number : $scope.letterNumber,
        Version : $scope.letterVersion,
        CompanyId: $scope.letterCia
      };

       cgwFactory.getListArchivosAdjuntos($scope.paramsListArchivosAdjuntos).then(function (response) {
        if (response.data.items) {
          $scope.files = response.data.items;
        }
      });
    }

    function getValueIGV() {
      var paramsValueIGV = {
        CodeCompany: parseInt($scope.letterCia),
        Date: new Date()
      };

      cgwFactory.getValueIGV(paramsValueIGV, true).then(function(response) {
        $scope.valorIGV = response.data.igv;
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

       cgwFactory.getProcedimientosSolicitadosDetail($scope.paramsProcedimientosSolicitados).then(function (response) {
        if (response.data.items) {
          $scope.procedimientosSolicitados = response.data.items;
          $scope.getSubtotal();
        }
      });
    }

    $scope.getSubtotal = function() {
      $scope.subtotal = 0;

      angular.forEach($scope.procedimientosSolicitados, function(value,key) {
        $scope.subtotal += $scope.procedimientosSolicitados[key].requestedAmount;
      });

      $scope.montoIGV = $scope.subtotal * ($scope.valorIGV/100);
      $scope.total = $scope.subtotal + $scope.montoIGV;
    };

    $scope.levantarObservacion = function() {
      $state.go('levantarObservacion', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: $scope.flagClinic}, {reload: true, inherit: false});
    };

    $scope.downloadAttachFileCGW = function(value) {
      $scope.attachFileCGWURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.cgw + 'api/guaranteeletter/attachfile/download/' + value.idFile);
      window.open($scope.attachFileCGWURL);
    };

    $scope.showCrearAmpliacion = function() {
      if ($scope.cartaGarantia !== undefined)
        return (($scope.cartaGarantia.stateId === $scope.statusLetter.aprobado.code ||
          $scope.cartaGarantia.stateId === $scope.statusLetter.liquidado.code ||
          $scope.cartaGarantia.stateId === $scope.statusLetter.procesada.code)  &&
          $scope.letterVersion==="1");
    };

    $scope.crearAmpliacion = function() {
      $state.go('generarAmpliacion', {id: $scope.letterNumber, year: $scope.yearLetter, version: $scope.letterVersion, cia: $scope.letterCia, flag: $scope.flagClinic}, {reload: true, inherit: false});
    };

    $scope.showLevantarObservacion = function() {
      if ($scope.cartaGarantia !== undefined)
       return ($scope.cartaGarantia.stateId === $scope.statusLetter.observada.code);
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
        return (item.stateId === $scope.statusLetter.observacionLevantada.code ||
          item.stateId === $scope.statusLetter.auditado.code || item.stateId === $scope.statusLetter.enProcesoDeAuditoria.code);
    };

    $scope.getTransparent = function(item) {
      if (item !== undefined)
        return (item.stateId === $scope.statusLetter.solicitado.code ||
                item.stateId === $scope.statusLetter.auditoriaEjecutivo.code);
    };

     $scope.downloadMovimientos = function(value) {
      var paramsFile = {
        CodeCompany: parseInt($scope.letterCia),
        Year: $scope.yearLetter,
        Number: $scope.letterNumber,
        StartDate: typeof $scope.formData.mConsultaDesdeM === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaDesdeM),
        EndDate: typeof $scope.formData.mConsultaHastaM === 'undefined' ? '' : cgwFactory.formatearFecha($scope.formData.mConsultaHastaM),
        ClientCode: ($scope.cartaGarantia.clientCode!== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,
        AffiliateCode: $scope.cartaGarantia.affiliateCode
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
            StartDate: typeof $scope.formData.mConsultaDesdeM === 'undefined' ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaDesdeM),
            EndDate: typeof $scope.formData.mConsultaHastaM === 'undefined' ? cgwFactory.formatearFecha(new Date()) : cgwFactory.formatearFecha($scope.formData.mConsultaHastaM),
            ClientCode: ($scope.cartaGarantia.clientCode !== '') ? parseInt($scope.cartaGarantia.clientCode) : 0,
            AffiliateCode: $scope.cartaGarantia.affiliateCode
          };

          cgwFactory.buscarMovimientos(paramsXMovimiento).then(function (response) {
            if (response.data) {
              if (response.data.items.length>0) {
                $scope.movimientos = response.data.items;

              }
            }
          }, function(error) {
            if (error.data)
              mModalAlert.showError(error.data.message, "Error");
          });
      }
    }

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
            lista: $scope.cartaGarantia.preexistences
          };
        }]
      });
    };

    $scope.showObservaciones = function() {
     if ($scope.cartaGarantia) {
       return ($scope.cartaGarantia.remarkPaciente);
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

    $scope.cargarMovimientos = function() {
      buscarMovimientos();
    };

    $scope.cargarMontos = function() {
      getValueIGV();
      getListArchivosAdjuntos();
      getProcedimientosSolicitados();
    };

    $scope.truncText = function (text) {
      if(text && text.length > largomaximo) {
        return text.substr(0, largomaximo) + '...';
      } else {
        return text;
      }
    };

  } //  end controller

  return ng.module('appCgw')
    .controller('DetalleConsultaClinicaController', detalleConsultaClinicaController);
});
