define([
 'angular', 'constants', '/cgw/app/solicitudCG/service/solicitudCgwFactory.js'
], function(ng, constants) {

  cgwSolicitud3Controller.$inject = ['$scope', '$stateParams', '$rootScope', 'mModalAlert', 'solicitudCgwFactory', '$q', '$state'];

  function cgwSolicitud3Controller($scope, $stateParams, $rootScope, mModalAlert, solicitudCgwFactory, $q, $state) {

    (function onLoad() {
      $scope.formData = $rootScope.formData || {};
      $scope.toSummary = ng.copy($scope.formData);
      if (typeof $scope.formData.diagnostico === 'undefined') {
        $scope.formData.diagnostico = {};
        $scope.formData.diagnostico.mFechaAccidente = new Date();
        $scope.formData.cobertura || $state.go('.', {step: 2, id: $stateParams.id});//( $state.go('.', {step: 2} ) );
      }
      if (typeof  $scope.formData.beneficio === 'undefined')
         $scope.formData.beneficio = {};

      if (typeof $scope.formData.afiliado === 'undefined') {
        $state.go('.', {step: 1, id: $stateParams.id});
      } else {
        disableNextStep();
        getListCopayForced();
      }

      if ($scope.currentStep === '3') {
        $("body").animate({scrollTop: 0}, 300);
        $("body").animate({scrollTop: 450}, 1500);
        if (!ng.isUndefined($scope.formData.diagnostico.mMedicoTratante) &&
            ng.isUndefined($scope.formData.diagnostico.mMedicoTratante.fName)) {
              $scope.isVisibleInput = false;
        }
        else
        {
          $scope.isVisibleInput = true;
        }

      }

      if ($scope.mClinica.rucNumber.length<10){
        $scope.mClinica.rucNumber = $scope.formData.getTicketUser.ruc;
      }

       solicitudCgwFactory.getListBranchClinicByRuc(parseInt($scope.mClinica.rucNumber), true).then(function(response) {
        if (response.data.items.length > 0) {

            if (response.data.items.length <= 1) {
              $scope.branchCli = response.data.items[0].code;
            }
            if (!$scope.formData.CgwHome)
              $scope.formData.BranchClinicCode = $scope.branchCli;
            else {
              if ($scope.formData.CgwHome.length === 0)
                $scope.formData.BranchClinicCode = $scope.branchCli;
              else
                $scope.formData.BranchClinicCode = ($scope.branchCli) ? $scope.branchCli : $scope.formData.CgwHome;
            }

            if (!$scope.formData.BranchClinicCode) {
               $scope.formData.BranchClinicCode = solicitudCgwFactory.getVariableSession('cgwCodeSucursal');
            }
          }
         }, function(error) {
         });

    })();

    function disableNextStep() {
      $scope.formData.fourthStepNextStep = false;
      $scope.formData.fifthStepNextStep = false;
    }

    $scope.$on('changingStep', function(ib,e) {
      if (typeof $scope.formData.fourthStepNextStep === 'undefined') $scope.formData.fourthStepNextStep = false;

       if (e.step < 4) {
        e.cancel = false;
      }else

       if ($scope.formData.diagnostico.mCodDiagnostico
        && $scope.formData.diagnostico.mMedicoTratante
        && $scope.formData.diagnostico.mObsMedicoTratante) {
          e.cancel = false;
        } else {
          e.cancel = true;
          disableNextStep();
        }
    });

    $scope.format = 'dd/MM/yyyy';
    $scope.dateOptions = {
      initDate: new Date(),
      maxDate: new Date()
    };

    $scope.getListDiagnostic = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDiagnostic = {
          diagnosticName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        solicitudCgwFactory.getListDiagnostic(paramDiagnostic, false).then(function(response) {
          defer.resolve(response.data.items);
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    $scope.getListDoctor = function(wilcar) {
      if (wilcar && wilcar.length >= 3) {
        var paramDoctor = {
          fName: wilcar.toUpperCase()
        };

        var defer = $q.defer();
        solicitudCgwFactory.getListDoctor(paramDoctor, false).then(function(response) {
          defer.resolve(response.data.items);
          }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });

        return defer.promise;
      }
    };

    $scope.mostrarInputMedico = function mimFn() {
      if (ng.isUndefined($scope.formData.diagnostico.mMedicoTratante))
      {
        $scope.formData.diagnostico.mMedicoTratante = '';
      }
      $scope.isVisibleInput = !$scope.isVisibleInput;
      return $scope.isVisibleInput;
    };

    function getListCopayForced() {
      var paramsListCopayForced = {
        planCode: $scope.formData.afiliado.planSalud,
        beneficioCode: $scope.formData.cobertura.code,
        copayCode: '0' ,
        descriptionCopay: ''
      };

       solicitudCgwFactory.getListCopayForced(paramsListCopayForced, true).then(function(response) {
        var items = response.data.items;
        if (items.length > 0) {
          $scope.formData.listCopayForced = items;
           getListUserForzed();
        } else {
          getListUserForzed();
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    function getListUserForzed() {
      solicitudCgwFactory.getListUserForced({}, true).then(function(response) {
        var items = response.data.items;
        if (items.length > 0) {
          $scope.listaUsuarioForzado = items;
        }
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    $scope.$on('changingStep', function(ib,e) {
      if (typeof $scope.formData.fifthStepNextStep === 'undefined') $scope.formData.fifthStepNextStep = false;

      if (e.step < 5) {
        e.cancel = false;
      }else

       if ($scope.formData.mDiasHospitalizacion) {
          e.cancel = false;
        } else {
          e.cancel = true;
          disableNextStep();
        }
    });

    solicitudCgwFactory.getListMedicalCare({}, true).then(function(response) {
      var items = response.data.items;
      if (items.length > 0) {
        $scope.listaTipoAtencion = items;
        if ($scope.formData.cobertura)
          if ($scope.formData.cobertura.code === "47" && $scope.formData.cobertura.typeCoverage === "HOSPITALARIO") {
            $scope.formData.beneficio.mTipoAtencion = {id: 2, code: "H", description: "Hospitalario"};
          }
      }
     }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });

    $scope.$watch('formData.beneficio.mTipoAtencion', function(nv)
      {
        $scope.updateTipoAtencion();
    });

    $scope.updateTipoAtencion = function() {
      $scope.formData.mDiasHospitalizacion = 0;
    };

    $scope.guardarPaso4 = function() {
      $scope.frmSolicitudCgw4.markAsPristine();

      if ($scope.formData.mDiasHospitalizacion>=0) {
        $scope.formData.copagoForzado = $scope.optCobertura;
        $scope.formData.paso3Guardado = true;
        $state.go('.', {step: 5, id: $stateParams.id});
      }
    };

    $scope.guardarPaso3 = function() {
      $scope.frmSolicitudCgw3.markAsPristine();

      if ($scope.formData.diagnostico.mCodDiagnostico
        && $scope.formData.diagnostico.mMedicoTratante
        && $scope.formData.diagnostico.mObsMedicoTratante
        && $scope.formData.mResonanciaMagnetica) {
        $scope.formData.paso3Guardado = true;
        $state.go('.', {step: 4, id: $stateParams.id});
      }
    };

    $scope.showCopago = function() {
      if (typeof $scope.formData.listCopayForced !== 'undefined') {
        if (($scope.formData.roleCode === constants.module.cgw.roles.clinica.description && $scope.formData.listCopayForced.length>0) || $scope.formData.mEmpresa.id === 1)
          return false;
        else if ($scope.formData.roleCode !== constants.module.cgw.roles.clinica.description && $scope.formData.listCopayForced.length>0)
          return true;
        else
          return false;
      }
    };

    $scope.setCopagoFixValue = function(item, copayFixNumber) {
      $scope.formData.copayFixNumber = copayFixNumber;
      $scope.updateCopago(item);
    };

    $scope.setCopagoVarValue = function(item, copayVarNumber) {
      $scope.formData.copayVarNumber = copayVarNumber;
      $scope.updateCopago(item);
    };

    $scope.updateCopago = function(item) {
      $scope.formData.copayForced = item;
      $scope.formData.descripcionServicio =  item.service;

      if (typeof $scope.formData.mUsuarioForzado.code !== 'undefined') {
        if (item.codeService === 'Z3')
          $scope.formData.cfijoseg = $scope.formData.copayFixNumber + " POR " + $scope.formData.descripcionServicio;
        else
          $scope.formData.cfijoseg = $scope.formData.copayFixNumber + " "+ item.currencyCode + " POR " + $scope.formData.descripcionServicio;

        $scope.formData.cvaribleseg =  "CUBIERTO AL " + $scope.formData.copayVarNumber + " %";
      } else {
        $scope.formData.cfijoseg = $scope.formData.copayFixNumber;
        $scope.formData.cvaribleseg = $scope.formData.copayVarNumber;
      }

      ng.forEach($scope.formData.listCopayForced, function(value,key) {
        if ($scope.formData.listCopayForced[key].idForced === item.idForced) {
          $scope.formData.listCopayForced[key].selected = true;
        } else {
          $scope.formData.listCopayForced[key].selected = false;
        }
      });
    }

  } //  end controller

  return ng.module('appCgw')
    .controller('CgwSolicitud3Controller', cgwSolicitud3Controller);
});
