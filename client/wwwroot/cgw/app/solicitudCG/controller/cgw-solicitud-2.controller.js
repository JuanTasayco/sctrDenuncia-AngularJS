define([
  'angular', 'constants',
  '/cgw/app/solicitudCG/service/solicitudCgwFactory.js',
  'mfSummary',
  '/cgw/app/solicitudCG/component/modalDenuncias.js' 
], function(ng, constants) {

  cgwSolicitud2Controller.$inject = ['$scope', '$stateParams', 'solicitudCgwFactory', '$rootScope', '$state', 'mModalAlert', '$uibModal'];

  function cgwSolicitud2Controller($scope, $stateParams, solicitudCgwFactory, $rootScope, $state, mModalAlert, $uibModal) {

    (function onLoad() {
      $scope.formData = $rootScope.formData || {};
      $scope.formData.complaint = {};
      $scope.toSummary = ng.copy($scope.formData);
      $scope.pageSize = 5;

      if (!$scope.formData.paso2Guardado) {
        $scope.mClinica ? getAffiliate_Load() : $state.go('.', {step: 1, id: $stateParams.id});
        $scope.listShow = [];
        $scope.currentPage = 0;
        $scope.formData.pages = [];
        $scope.noResult = true;
        $scope.firtSearch = false;
        $scope.coberturaSelected = [];
      }

     if (typeof  $scope.formData.beneficio === 'undefined')
         $scope.formData.beneficio = {};

      if (typeof $scope.formData.afiliado === 'undefined') {
        $state.go('.', {step: 1, id: $stateParams.id});
      } else {
        disableNextStep();
      }
    })();

    $scope.$watch('formData', function(nv) {
      $rootScope.formData = nv;
    });

    $scope.emailCboLbl = {
      label: 'Correo electrónico',
      required: false
    };
    $scope.celularInputLbl = {
      label: 'Número de celular',
      required: false
    };

    $scope.getEstado = function(estado) {
      return estado === 'INACTIVO';
    };

    $scope.showCoberturas = function() {
      return $scope.formData.coverages ? ($scope.formData.coverages.length > 0 ? true : false) : false;
    };

    function getAffiliate_Load() {

      var codeseps = '';
      if ($scope.mClinica.code) {
        codeseps = $scope.mClinica.code.replace(/-/g, '');
      } else {
        $scope.formData.sucursalKey = solicitudCgwFactory.getVariableSession('sucursal');
        $scope.mClinica.code = $scope.formData.sucursalKey.providerName;
        if ($scope.mClinica.code)
          codeseps = $scope.mClinica.code.replace(/-/g, '');
      }

      if (typeof $scope.formData.afiliado === 'undefined') {
       $state.go('.', {step: 1, id: $stateParams.id});
      } else {
        var paramsAfiliado = {
          CodeProvider: ($scope.mClinica.providerCode==null) ? '' : $scope.mClinica.providerCode.toString(),
          CodeBranchOffice: parseInt($scope.formData.CgwHome),
          PlanNumber: $scope.formData.afiliado.planSalud,
          RucNumber: $scope.formData.paramAffiliate.EntidadVinculanteRuc,//($scope.userRuc) ? $scope.userRuc : $scope.mClinica.rucNumber,
          Product: $scope.formData.afiliado.codigoProducto,
          CodeAffiliate: $scope.formData.afiliado.codigoAfilado.trim(),
          CodeCompany: $scope.formData.mEmpresa.code,
          CodeSeps: codeseps,
          CompanyName: $scope.formData.mEmpresa.description,
          Entity: $scope.mClinica.description,
          IdCompany: $scope.formData.mEmpresa.id.toString(),
          CorrelativeCode: $stateParams.id
        };

        solicitudCgwFactory.getAffiliate_Load(paramsAfiliado, true).then(function(response) {
          $scope.formData.searchCobertura = true;
          $scope.formData.coverages = response.data.coverages;

          ng.forEach($scope.formData.coverages, function(value,key) {
            $scope.formData.coverages[key].checkSelected = false;
          });


          if ($scope.formData.coverages.length>0) {
            configPages();
            $scope.noResult = false;
            $scope.firtSearch = false;
          } else {
            $scope.noResult = true;
            $scope.firtSearch = true;
          }

          $scope.noResult = false;
          $scope.firtSearch = false;

          $scope.formData.patientInfo = response.data.patientInfo;
          $scope.formData.policyholderInfo = response.data.policyholderInfo;
          $scope.formData.preexistences = response.data.preexistences;
          $scope.formData.remark = response.data.remark;
          $scope.toSummary = ng.copy($scope.formData);  // para solo mostrar la info de paciente y titular

          if($scope.formData.mEmpresa.id === 3 
            && $scope.formData.mProducto.productCode === 'R' 
            && $scope.formData.afiliado.codigoProducto === 'R'
            && $scope.formData.patientInfo.state === 'VIGENTE') {
            var clientReq = { 
                tipDocum: 'RUC', 
                codDocum: response.data.policyholderInfo.rucNumber 
            };

            solicitudCgwFactory.ConsultarClienteImportante(clientReq).then(function(res) {
              $scope.isClientVIP = (res.data != 'N');
              $scope.validateComplaints();
            }, function(err) {
              console.log('Error en: ConsultarClienteImportante' + err);
            });            
          } else {
            $scope.formData.showComplaintRequiredSection = false;
          }
          
          if ($scope.currentStep === '2') {
            $("body").animate({scrollTop: 420}, 1500);
          }
        }, function(error) {
          $scope.noResult = true;
          $scope.firtSearch = true;
          mModalAlert.showError(error.data.message, 'Error');
        });
      }
    }

    function configPages() {
      $scope.formData.pages.length = 0;
      var ini = $scope.currentPage - 4;
      var fin = $scope.currentPage + 5;
      if (ini < 1) {
        ini = 1;
        if (Math.ceil($scope.formData.coverages.length / $scope.pageSize) > 5)
          fin = 5;
        else
          fin = Math.ceil($scope.formData.coverages.length / $scope.pageSize);
      } else {
        if (ini >= Math.ceil($scope.formData.coverages.length / $scope.pageSize) - 5) {
          ini = Math.ceil($scope.formData.coverages.length / $scope.pageSize) - 5;
          fin = Math.ceil($scope.formData.coverages.length / $scope.pageSize);
        }
      }
      if (ini < 1) ini = 1;
      for (var i = ini; i <= fin; i++) {
        $scope.formData.pages.push({
          no: i
        });
      }

      if ($scope.currentPage >= $scope.formData.pages.length)
        $scope.currentPage = $scope.formData.pages.length - 1;
    }

    $scope.setPage = function(index) {
      $scope.currentPage = index - 1;
    };

    $scope.updateCobertura = function(idx, cobertura) {
      $scope.coberturaSelected = [];
      if ($scope.formData.cobertura) {
        if ($scope.formData.cobertura === cobertura) {
          $scope.coberturaSelected[cobertura.code] = cobertura.code;
          if ($scope.formData.coverages[idx] === cobertura)
            $scope.formData.coverages[idx].checkSelected = cobertura.code;
        } else {
          $scope.formData.coverages[idx].checkSelected = cobertura.code;
          angular.forEach($scope.formData.coverages, function(value,key) {
            if ($scope.formData.coverages[key].checkSelected !== $scope.formData.coverages[idx].checkSelected)
              $scope.formData.coverages[key].checkSelected = false;
          });
        }
      } else {
        $scope.formData.coverages[idx].checkSelected = cobertura.code;
      }

      if (cobertura.code === "3" && cobertura.typeCoverage === "CONSULTA AMBULATORIA")
        mModalAlert.showInfo('Endoscopía diagnóstica <br/>Ecografía transvaginal <br/>Electromiografía <br/>Ecografía de mama <br/>Colonoscopía diagnóstica <br/>Proctoscopía diagnóstica <br/>', 'Procedimientos que no requieren de Carta de Garantía');

      $scope.formData.cobertura = cobertura;
      $scope.formData.thirdStepNextStep = true;
    };

    $scope.guardarPaso2 = function() {
      $scope.frmSolicitudCgw2.markAsPristine();
      if ($scope.formData.cobertura && $scope.frmSolicitudCgw2.$valid) {
        if ($scope.formData.cobertura.checkSelected) {
          $scope.formData.mCelular = $scope.frmSolicitudCgw2.nCelular.$error.onlyNumber ? '' : $scope.formData.mCelular;
          $scope.formData.paso2Guardado = true;
          $state.go('.', {step: 3, id: $stateParams.id});
        }
      }
    };

     function disableNextStep() {
      $scope.formData.thirdStepNextStep = false;
      $scope.formData.fourthStepNextStep = false;
      $scope.formData.fifthStepNextStep = false;
    }

    $scope.$on('changingStep', function(ib,e) {
      if (typeof $scope.formData.thirdStepNextStep === 'undefined') $scope.formData.thirdStepNextStep = false;

      if (e.step < 3) {
        e.cancel = false;
      }else
        if ($scope.formData.cobertura) {
          e.cancel = false;
        } else {
          e.cancel = true;
          disableNextStep();
        }
    });

    $scope.validateComplaints = function() {
      if($scope.formData.newProcess) {
        var searchRq = { affiliateCode : $scope.formData.patientInfo.license, contractNumber: $scope.formData.policyholderInfo.contractNumber };

        solicitudCgwFactory.GetListComplaints(searchRq).then(function(response) {
          if (response.operationCode === 200) {
            if (response.data && response.data.items && response.data.items.length > 0) {
              $scope.formData.complaints = response.data.items;
              showComplaints();
            } else {
              //if($scope.formData.newProcess && !$scope.isClientVIP) {
              if(!$scope.isClientVIP) {
                mModalAlert.showWarning("Coordinar la creación de la denuncia de accidente con el SI24", 'El afiliado no cuenta con denuncias asociadas')
                .then(function() {
                  $state.go('.', {step: 1, id: $stateParams.id});
                });
                return;
              } else {
                showComplaints();
              }
            }
          } else {
            mModalAlert.showError("Ocurrió un error al listar las denuncias de accidentes.", 'Error').then(function(){
              $state.go('.', {step: 1, id: $stateParams.id});
            });
          }
        }, function(error) {
          mModalAlert.showError("Ocurrió un error al listar las denuncias de accidentes.", 'Error').then(function(){
            $state.go('.', {step: 1, id: $stateParams.id});
          });
        });
      }
    }

    function showComplaints() {
      $uibModal.open({
        backdrop: 'static',
        backdropClick: false,
        dialogFade: false,
        keyboard: false,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal--md fade cgw-modal-80-porc cgw-modal-hide-close',
        template: '<mpf-modal-denuncias data="data" close="close()" complaint="complaint"></mpf-modal-denuncias>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.complaint = {};
          scope.close = function() {
            if(scope.complaint && scope.complaint.complaintNumber) {
              $scope.formData.complaint = scope.complaint;
            }
            $uibModalInstance.close();
          };
          scope.data = {
            complaints: $scope.formData.complaints,
            clinic: $scope.$parent.$parent.mClinica,
            affiliate: $scope.formData.patientInfo,
            isClientVIP: $scope.isClientVIP,
            stringBrakeDate: $scope.formData.stringBrakeDate,
            newProcess: $scope.formData.newProcess,
          };
        }]
      });
    }    
  } //  end controller

  function startFromGrid() {
      return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
      }
    }

  return ng.module('appCgw')
    .controller('CgwSolicitud2Controller', cgwSolicitud2Controller)
    .filter('startFromGrid', startFromGrid)
});
