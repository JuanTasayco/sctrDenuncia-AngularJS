'use strict';
define([
  'angular', 'constants', 'mfSummary', 'modalPresupuesto',
  '/cgw/app/solicitudCG/service/solicitudCgwFactory.js',
  '/cgw/app/factory/cgwFactory.js'
], function(ng, constants) {

  cgwSolicitud4Controller.$inject = ['$rootScope', '$scope', '$stateParams', '$uibModal', '$timeout', 'solicitudCgwFactory', '$state', 'fileUploadNew', 'mModalAlert', 'cgwFactory'];

  function cgwSolicitud4Controller($rootScope, $scope, $stateParams, $uibModal, $timeout, solicitudCgwFactory, $state, fileUploadNew, mModalAlert, cgwFactory) {
    $scope.filesCgw = [];
    $scope.filesPatologico = [];
    var byte = 1000;
    var kb = 5120;
    var maxKbSize = kb * byte;
    (function onLoad() {
      $scope.formData = $rootScope.formData || {};
      $scope.toSummary = ng.copy($scope.formData);
      $scope.formData.subtotal = 0;
      $scope.formData.montoIGV = 0;
      $scope.formData.total = 0;
      $scope.files = [];
      $scope.filesExtra = [];
      $scope.filesTypes = [];
      if (typeof $scope.mClinica === 'undefined') {
        // $state.go('.', {step: 1});
        $state.go('.', {step: 1, id: $stateParams.id});
      }
      else{
        getBudget();
        getValueIGV();
        validateShowMagneticResonance();
      }
    })();

    function getValueIGV() {
      var paramsValueIGV = {
        CodeCompany: parseInt($scope.formData.mEmpresa.id),
        Date: new Date()
      };

      solicitudCgwFactory.getValueIGV(paramsValueIGV, true).then(function(response) {
        $scope.formData.valorIGV = response.data.igv;
      }, function(error) {
        mModalAlert.showError(error.data.message, 'Error');
      });
    }

    function getBudget() {
      var paramsBudget = {
        CodeProvider: $scope.mClinica.code,
        Flag: 1,
        CodeCompany: $scope.formData.mEmpresa.id
      };

      solicitudCgwFactory.getListBudgets(paramsBudget, true).then(function(response) {
        if (response.data.items.length>0) {
          $scope.formData.procedimientos = response.data.items;

        }
       }, function(error) {
        mModalAlert.showError('Al cargar el presupuesto', 'Error');
      });
    }

    $scope.cargarPresupuesto = function cpFn(codProcedimiento) {
      $scope.formData.procedimientos.every(function(value,key) {
        if ($scope.formData.procedimientos[key].code === codProcedimiento) {
          $scope.detalleProcedimiento = $scope.formData.procedimientos[key];
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

    $scope.grabarCarta = function() {
      if ($scope.formData.subtotal>0) {
        $scope.setCarta = true;
      } else {
        $scope.setCarta = false;
      }

      if ($scope.setCarta && !$scope.enviado)
        enviarCarta();
    };

    function enviarCarta() {
      $scope.disabledButton = true;
      $scope.formData.Budgets = [];

      ng.forEach($scope.formData.procedimientos, function (value,key) {
        ng.forEach($scope.formData.procedimientos[key].details, function(value2,key2) {
          if ($scope.formData.procedimientos[key].details[key2].price>0) {
            var budgets = {
              Year: 0,
              Number: 0,
              Version: 0,
              CodeCompany: $scope.formData.mEmpresa.id,
              UserCreate: $scope.formData.userCreate,
              CodeBudget: $scope.formData.procedimientos[key].details[key2].codeDetail,
              RequestedAmount: $scope.formData.procedimientos[key].details[key2].price,
              AprrovedAmount: 0.0,
              Register: 'V',//fijo
              TypeOperation: 1//fijo
            };
            $scope.formData.Budgets.push(budgets);
          }
        });
      });

      if (!$scope.formData.sucursalKey)
        $scope.ProviderCode = parseInt($scope.mClinica.providerCode);
      else {
        if ($scope.formData.sucursalKey.providerCode)
          $scope.ProviderCode = parseInt($scope.formData.sucursalKey.providerCode);
        else
          $scope.ProviderCode = parseInt($scope.mClinica.providerCode);
      }

      var paramsCarta = {
        GuaranteeLetter: {
          CorrelativeCode: ($stateParams.id) ? $stateParams.id : '',
          Year: 0,
          Number: 0,
          Version: 0,
          CodeCompany: $scope.formData.mEmpresa.id,
          UserCreate: $scope.formData.userCreate,
          ProductCode: $scope.formData.afiliado.codigoProducto,
          ProviderCode: $scope.ProviderCode,
          ProviderNumber: 1,
          BeneficiaryCode: $scope.formData.cobertura.code,
          BranchClinicCode: $scope.formData.BranchClinicCode,
          Cacnta: 0, // fijo
          Iacgrnta: 0, // fijo
          CurrencyCode: 1, // moneda
          UserForced: ($scope.formData.mUsuarioForzado.code != null) ? $scope.formData.mUsuarioForzado.code : 0, // usuario forzado, fijo 0
          AuthorizationDetail: (typeof $scope.formData.beneficio.mDetalleAutorizacionForzada === 'undefined') ? '' : $scope.formData.beneficio.mDetalleAutorizacionForzada,
          Nacpln: 0,//$scope.formData.patientInfo.healthPlan,
          ForcedCopayment: (typeof $scope.formData.copayForced.idForced !== 'undefined') ? $scope.formData.copayForced.idForced : 0, //1, // copago forzado popup
          Cerspsta: '', // fijo
          StateCode: 1, // fijo
          ClientCode: 0, // codigo cliente
          Contract: $scope.formData.policyholderInfo.contractNumber,
          EffectiveDate: $scope.formData.patientInfo.effectiveDateBegin,//01/03/2008, // vigencia AQUIIII
          FixedCopayment: (typeof $scope.formData.cfijoseg === 'undefined') ? $scope.formData.cobertura.copaymentFixed : $scope.formData.cfijoseg,
          VariableCopayment: (typeof $scope.formData.cvaribleseg === 'undefined') ? $scope.formData.cobertura.copaymentVariable : $scope.formData.cvaribleseg,

          AccidentDate: cgwFactory.formatearFecha($scope.formData.diagnostico.mFechaAccidente),
          BirthDate: $scope.formData.afiliado.fechaNacimiento,
          NumberPlan: parseInt($scope.formData.afiliado.planSalud),
          Mail: (typeof $scope.formData.mEmail !== 'undefined') ? $scope.formData.mEmail : '',// Obligatorio
          PhoneNumber: (typeof $scope.formData.mCelular !== 'undefined') ? $scope.formData.mCelular : '',
          DiagnosticCode: $scope.formData.diagnostico.mCodDiagnostico.code,//R500,
          CoverageCode: $scope.formData.cobertura.coverage,//ZU, // En servicio affiliate/load, obtiene un array de coberturas
          Policyholder: {
            License: parseInt($scope.formData.afiliado.codigoAfilado), // Codigo afiliado
            FullName: $scope.formData.policyholderInfo.fullName,
            ContractNumber: $scope.formData.policyholderInfo.contractNumber,
            CompanyName: $scope.formData.policyholderInfo.companyName,
            RucNumber: (typeof $scope.formData.policyholderInfo.rucNumber !== 'undefined') ? $scope.formData.policyholderInfo.rucNumber : '',
            TypeAffiliation: (typeof $scope.formData.policyholderInfo.typeAffiliation !== 'undefined') ? $scope.formData.policyholderInfo.typeAffiliation : '',
            Currency: (typeof $scope.formData.policyholderInfo.currency !== 'undefined') ? $scope.formData.policyholderInfo.currency : '',
            AffiliateDate: (typeof $scope.formData.policyholderInfo.affiliateDate !== 'undefined') ? $scope.formData.policyholderInfo.affiliateDate : '',
            ContractDate: (typeof $scope.formData.policyholderInfo.contractDate !== 'undefined') ? $scope.formData.policyholderInfo.contractDate : '', 
            PolicyNumber: (typeof $scope.formData.policyholderInfo.polizaNumber !== 'undefined') ? $scope.formData.policyholderInfo.polizaNumber : '' 
          },
          Patient: {
            FullName: $scope.formData.patientInfo.fullName,
            Sex: ($scope.formData.patientInfo.sex === 'FEMENINO') ? 'F' : 'M',
            Kinship: $scope.formData.patientInfo.relationship
          },
          GuaranteeLetterVersion: {
            Year: 0,
            Number: 0,
            Version: 0,
            RequestedAmount: $scope.formData.total, // Importe total (suma de procedimientos * 1.18 igv)
            AprrovedAmount: 0.0,
            TypeAttention: $scope.formData.beneficio.mTipoAtencion.code, // ambulatoria A, hospitalaria H
            DaysOfHospitalization: ($scope.formData.mDiasHospitalizacion === '') ? 0 : $scope.formData.mDiasHospitalizacion,//0,
            DoctorCode: (typeof $scope.formData.diagnostico.mMedicoTratante.fName === 'undefined') ? 0 : $scope.formData.diagnostico.mMedicoTratante.code,//Codigo del medico PENDIENTE AQUIIII
            DoctorFullName: (typeof $scope.formData.diagnostico.mMedicoTratante.fName === 'undefined') ? $scope.formData.diagnostico.mMedicoTratante : $scope.formData.diagnostico.mMedicoTratante.fName,//'AROCEMENA BRADELL ADRIAN',
            DoctorRemark: $scope.formData.diagnostico.mObsMedicoTratante,//'OBS MÉDICO TRATANTE TEXTO',
            LetterObservation: '',
            Oacnta: '',
            StatusLetter: 9 , // fijo
            CodeCompany: $scope.formData.mEmpresa.id,
            UserCreate: $scope.formData.userCreate, // Usuario creacion
            MagneticResonance: $scope.formData.mResonanciaMagnetica
          }
          , Complaint: { ComplaintYear: $scope.formData.complaint.complaintYear, ComplaintNumber: $scope.formData.complaint.complaintNumber },
          AmputationIndicator: (typeof $scope.formData.diagnostico.mAmputacion !== 'undefined') ? $scope.formData.diagnostico.mAmputacion : 'N'
        },
        Budgets: $scope.formData.Budgets, // procedimientos
        AttachFiles: [
          {}
        ]
      };

      if($scope.formData.mProducto.productCode === 'R') {
        paramsCarta.GuaranteeLetter.Policyholder.ForcedCoverage = $scope.formData.policyholderInfo.forcedCoverage; //TODO: revisar que venga dato del servicio
      }

      var file = null;
      if (!(typeof $scope.filesCgw === 'undefined') && $scope.filesCgw.length > 0) {
        file = generateFileUpload();
        $scope.sinArchivos = false;
        $scope.sinArchivosPatologico = false;

        $scope.formData.myFile = generateFileUpload();
        $scope.enviado = true;
        fileUploadNew.solicitarCartaURL(file, paramsCarta, $scope.filesTypes).then(function(response) {
          if (response.data.operationCode === 200) {
            $scope.formData.yearLetter = response.data.data.year;
            $scope.formData.numberLetter = response.data.data.number;
            $scope.disabledButton = false;
            $state.go('solicitudCgw.resumen');
          } else {
            $scope.disabledButton = false;
            $scope.enviado = false;

            if (response.data.operationCode === 500)
              mModalAlert.showError(response.data.data.message, 'Error');
            else
              mModalAlert.showError(response.data.mensaje, 'Error');
          }
        }, function(error) {
          $scope.disabledButton = false;
          $scope.enviado = false;
          mModalAlert.showError(error.data.message, 'Error');
        });
      } else {
        $scope.sinArchivos = true;
        mModalAlert.showWarning("Ingrese archivo adjunto", '');
        $scope.disabledButton = false;
      }
    }

    $scope.getSubtotal = function() {
      $scope.formData.subtotal = 0;

      ng.forEach($scope.formData.procedimientos, function(value,key) {
        $scope.formData.subtotal += $scope.formData.procedimientos[key].price;
      });

      $scope.formData.montoIGV = $scope.formData.subtotal * ($scope.formData.valorIGV/100);
      $scope.formData.total = $scope.formData.subtotal + $scope.formData.montoIGV;
    };

    $scope.$watch('myFile', function(nv) {
      if (!(typeof nv === 'undefined')) {
        angular.forEach(nv, function(value,key) {
          if (value.size > maxKbSize) {
            mModalAlert.showError('El archivo [' + value.name + '] excede el tamaño máximo de ' + kb + ' kb.' , 'Error');
            return void 0;
          }
          var existItem = _.find($scope.filesCgw, function (o) { 
            return o.name == value.name;
          }) || [];
          var existItem2 = _.find($scope.filesPatologico, function (o) { 
            return o.name == value.name;
          }) || [];
          if(existItem.length == 0 && existItem2.length == 0) {
          $scope.filesCgw.push(value);
          var reader = new FileReader();
          reader.readAsDataURL($scope.myFile[key]);
          reader.onload = function() {
          };
          reader.onerror = function(error) {
          };
          }
        });
      }

    });

    $scope.$watch('myFileExtra', function(nv) {
      if (!(typeof nv === 'undefined')) {
        angular.forEach(nv, function(value,key) {
          if (value.size > maxKbSize) {
            mModalAlert.showError('El archivo [' + value.name + '] excede el tamaño máximo de ' + kb + ' kb.' , 'Error');
            return void 0;
          }
          var existItem = _.find($scope.filesCgw, function (o) { 
            return o.name == value.name;
          }) || [];
          var existItem2 = _.find($scope.filesPatologico, function (o) { 
            return o.name == value.name;
          }) || [];
          if(existItem.length == 0 && existItem2.length == 0) {
          $scope.filesPatologico.push(value);
          var reader = new FileReader();
          reader.readAsDataURL($scope.myFileExtra[key]);
          reader.onload = function() {
          };
          reader.onerror = function(error) {
          };
          }
        });
      }

    });

    $scope.deleteFile = function(index, array) {
      var filesBkp = [];

      angular.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        }
      });

      $scope.filesCgw = filesBkp;
    }

    $scope.deleteFile2 = function(index, array) {
      var filesBkp = [];

      angular.forEach(array, function(value,key) {
        if (key !== index) {
          filesBkp.push(array[key]);
        }
      });

      $scope.filesPatologico = filesBkp;
    }

    function generateFileUpload() {
      var files = [];
      angular.forEach($scope.filesCgw, function(value) {
        $scope.filesTypes.push("O");
        files.push(value);
      });

      angular.forEach($scope.filesPatologico, function(value) {
        $scope.filesTypes.push("P");
        files.push(value);
      });

      return files;
    }

    function validateShowMagneticResonance() {
      if($scope.formData.mProducto.productCode === 'S') {
        solicitudCgwFactory.GetOncologyActivation($scope.formData.afiliado.codigoAfilado, true).then(function(response) {
          if (response.operationCode == 200) {
            $scope.showPatologicAnatomy = response.data === 'S';
          } else {
            $scope.showPatologicAnatomy = false;
          }
         }, function(error) {
          $scope.showPatologicAnatomy = false;
        });
      } else {
        $scope.showPatologicAnatomy = false;
      }
    }

  } //  end controller

  return ng.module('appCgw')
    .controller('CgwSolicitud4Controller', cgwSolicitud4Controller);
});
