'use strict';
define([
  'angular', 'constants', 'mfSummary', 'modalPresupuesto',
  '/cgw/app/solicitudCG/service/solicitudCgwFactory.js'
], function(ng, constants) {

  cgwSolicitudPresupController.$inject = ['$rootScope', '$scope', '$stateParams', '$uibModal', '$timeout', 'solicitudCgwFactory', '$state', 'fileUpload', 'mModalAlert', 'stepsService'];

  function cgwSolicitudPresupController($rootScope, $scope, $stateParams, $uibModal, $timeout, solicitudCgwFactory, $state, fileUpload, mModalAlert, stepsService) {

    $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
      $scope.step3 = stepsService.getStep3();
      if(!$scope.step3.paso3Guardado) {
        $state.go('.', {step: (absOldUrl.substr(absOldUrl.length - 3)).charAt(0), id: $stateParams.id}, {reload: false, inherit: false});
      }
    });

    var vm = this;
    vm.$onInit = function() {

      $scope.requestedAmount = 0;
      $scope.codeCoberturas = [];
      $scope.valorIGV = 18;

      $scope.stepInitial = stepsService.getStep();
      $scope.step1 = stepsService.getStep1();
      $scope.step2 = stepsService.getStep2();
      $scope.step3 = stepsService.getStep3();
      $scope.step4 = stepsService.getStep4();
      stepsService.addStep4($scope);
      $scope.requestedAmount = $scope.step3.subtotal;

      if (typeof $scope.stepInitial.mClinica === 'undefined') {
        // $state.go('.', {step: 1});
        $state.go('solicitudCgw.steps', {step: 1, id: 0});
      }

      function getValueIGV() {
        var paramsValueIGV = {
          CodeCompany: parseInt($scope.stepInitial.mEmpresaInit.idCompany),
          Date: new Date()
        };

        solicitudCgwFactory.getValueIGV(paramsValueIGV, true).then(function(response) {
          $scope.valorIGV = response.data.igv;
        }, function(error) {
          mModalAlert.showError(error.data.message, 'Error');
        });
      }

      //BranchClinicCode
      if ((solicitudCgwFactory.getVariableSession('cgwHome').length > 0) || (typeof(solicitudCgwFactory.getVariableSession('cgwHome')) !== 'undefined')) {
        $scope.CgwHome = solicitudCgwFactory.getVariableSession('cgwHome');
      }

      if ($scope.stepInitial.mClinica.rucNumber.length<10){
        $scope.stepInitial.mClinica.rucNumber = $scope.stepInitial.getTicketUser.ruc;
      }

      solicitudCgwFactory.getListBranchClinicByRuc(parseInt($scope.stepInitial.mClinica.rucNumber), true).then(function(response) {
        if (response.data.items.length > 0) {

          if (response.data.items.length > 1) {
            //openSucursalModal();
            // $scope.branchCli =
          } else {
            $scope.branchCli = response.data.items[0].code;
          }
          if (!$scope.CgwHome) //---TODO
            $scope.stepInitial.mClinica.BranchClinicCode = $scope.branchCli;
          else {
            if ($scope.CgwHome.length === 0)
              $scope.stepInitial.mClinica.BranchClinicCode = $scope.branchCli;
            else
              $scope.stepInitial.mClinica.BranchClinicCode = ($scope.branchCli) ? $scope.branchCli : $scope.CgwHome;
          }

          if (!$scope.stepInitial.mClinica.BranchClinicCode) {
            $scope.stepInitial.mClinica.BranchClinicCode = solicitudCgwFactory.getVariableSession('cgwCodeSucursal');
          }
        }
      }, function(error) {
      });
      //BranchClinicCode
    };

    //fecha accidente
    $scope.status = {
      isopen: false
    };

    $scope.format = 'dd/MM/yyyy';

    $scope.popup = {
      opened: false
    };

    $scope.dateOptions = {
      initDate: new Date(),
      maxDate: new Date()
    };

    $scope.open = function () {
      $scope.popup.opened = true;
    };

    $scope.fnShowModalCartaRegistrada = function() {

      $scope.paramsRegistroCarta =
        {
          GuaranteeLetter: {
            // "CorrelativeCode": "003205418",
            Year: 0,//fijo
            Number: 0,//fijo
            Version: 0,//fijo
            CodeCompany: $scope.stepInitial.mEmpresaInit.idCompany,
            UserCreate: $scope.stepInitial.userCreate,
            ProductCode: $scope.stepInitial.mProducto.productCode,//"S", // Codigo de producto del combo nuevo
            ProviderCode: $scope.stepInitial.mClinica.providerCode,//2,
            ProviderNumber: 1,
            BeneficiaryCode: "3112",//($scope.isAutos()) $scope.step3.coberturasPowerEPS[0].code,//CoverageCode  ---TODO actualizar valor del servicio
            BranchClinicCode: $scope.stepInitial.mClinica.BranchClinicCode,
            Cacnta: 0,//fijo
            Iacgrnta: 0,//fijo
            CurrencyCode: 1,//fijo
            UserForced: 0,//fijo porque no hay
            AuthorizationDetail: "",//fijo porque no hay
            Nacpln: 0,//fijo
            ForcedCopayment: 0,//fijo porque no hay
            Cerspsta: "",//fijo
            StateCode: 1,//fijo
            ClientCode: 0,//fijo
            Contract: "", //policyholderInfo.contractNumber
            EffectiveDate: ($scope.stepInitial.seletedPoliza.effectivePolicyDate), //policyholderInfo.affiliateDate
            FixedCopayment: "", //cobertura.copaymentFixed
            VariableCopayment: "", //cobertura.copaymentVariable
            AccidentDate: "",//fijo
            SinisterDate: solicitudCgwFactory.formatearFecha($scope.stepInitial.mFechaAccidente),//"23/10/2018", // Paso 2 - fecha de accidente / siniestro
            BirthDate: $scope.stepInitial.afiliadoDataSelected.birthdate,//"24/09/1968",
            NumberPlan: 0, //afiliado.planSalud
            Mail: $scope.step3.mEmail, //email
            PhoneNumber: $scope.step3.mCelular,
            DiagnosticCode: $scope.step2.diagnosticoPowerEPS.code, //diagnostico.mCodDiagnostico.code
            CoverageCode: "Z3", //$scope.step3.coberturasPowerEPS[0].code,//"ZU", //cobertura.coverage --TODO actualizar valor del servicio
            Policyholder: {  // Codigo de compania del combo nuevo
              License: ($scope.stepInitial.mProducto.productCode === 'A') ? (($scope.step1.idAffiliate) ? $scope.step1.idAffiliate : $scope.step1.getFullDataAffiliate.idAffiliate) : 0, //afiliado.codigoAfilado
              FullName: ($scope.step1.formData.seletedPoliza.thirdName) ? $scope.step1.formData.seletedPoliza.thirdName : "", //policyholderInfo.fullName
              ContractNumber: "", //policyholderInfo.contractNumber
              CompanyName: ($scope.step1.formData.seletedPoliza.thirdName) ? $scope.step1.formData.seletedPoliza.thirdName : "", //policyholderInfo.companyName
              RucNumber: ($scope.step1.formData.seletedPoliza.documentNumber) ? $scope.step1.formData.seletedPoliza.documentNumber : "", //policyholderInfo.rucNumber
              TypeAffiliation: "", //policyholderInfo.typeAffiliation
              Currency: "SOLES", //policyholderInfo.currency
              AffiliateDate: "", //policyholderInfo.affiliateDate
              ContractDate: "", //policyholderInfo.contractDate
              PlateNumber: $scope.stepInitial.mPlaca,//"ASP308", // Solo PRODUCTO AUTO y SOAT
              PolicyNumber: $scope.stepInitial.seletedPoliza.policyNumber//"30130210100001" // Todos PRODUCTOS
            },
            Patient: {
            IdAffiliate: (($scope.stepInitial.mProducto.productCode == 'O' && $scope.stepInitial.afiliadoDataSelected.idAffiliate != 0) ? 
                            $scope.stepInitial.afiliadoDataSelected.idAffiliate : $scope.step1.idAffiliate),
              FullName: $scope.stepInitial.afiliadoDataSelected.fullName,//"LEVANO VERGARA AGUSTIN MARTIN SMITH",
              Sex: $scope.stepInitial.afiliadoDataSelected.sex,
              Kinship: "", //patientInfo.relationship
              AccidentInfo: { // Solo PRODUCTO SOAT inicio
                CauseCode: ($scope.stepInitial.mCausa.idCause) ? $scope.stepInitial.mCausa.idCause : 0,//10,
              DepartamentCode: ($scope.step1.mDeparmento.departmentCode) ? $scope.step1.mDeparmento.departmentCode : 0,
              ProvinceCode: ($scope.step1.mDeparmento.departmentCode) ? $scope.step1.mProvincia.idProvince : 0,
              DistrictCode: ($scope.step1.mDeparmento.departmentCode) ? $scope.step1.mDistrito.idDistrict : 0
              }, // Solo PRODUCTO SOAT fin
              ContactInfo: { // Paso 1 - Contacto inicio
                Name: $scope.step1.mNombre,//"MARI CRUZ", // nombres
                LastName: $scope.step1.mApellido,//"ESCOBAR GALVEZ", // apellidos
                PhoneNumber: $scope.step1.mCelular,//"991467614", // celular
                Mail: $scope.step1.mCorreoU, //"ricardosanchezc10@gmail.com", // correo
                MobilityCode: $scope.step1.mMovilidad.id//1 // Movidad
              } // Paso 1 - Contacto fin
            },
            GuaranteeLetterVersion: {
              Year: 0, //fijo
              Number: 0, //fijo
              Version: 0, //fijo
              RequestedAmount: $scope.requestedAmount,//$scope.step3.coberturasPowerEPS[0].mount,//5000, // Monto Total rrequerido
              AprrovedAmount: 0, //fijo
              TypeAttention: $scope.step2.mTipoAtencion.code,//"A",
              DaysOfHospitalization: ($scope.step2.formData.mDiasHospitalizacion) ? $scope.step2.formData.mDiasHospitalizacion : 0,
              DoctorCode: (typeof $scope.step2.formData.mMedicoTratante.doctorFullName === 'undefined') ? 0 : $scope.step2.formData.mMedicoTratante.code,//23791, // diagnostico.mMedicoTratante.code //similar a cgw actual
              DoctorFullName: (typeof $scope.step2.formData.mMedicoTratante.doctorFullName === 'undefined') ? $scope.step2.formData.mMedicoTratante : $scope.step2.formData.mMedicoTratante.doctorFullName,//"ANAMILE CHACTAYO ARRASUNE DE SANCHEZ", //formData.diagnostico.mMedicoTratante.fName // similar a cgw actual
              DoctorRemark: $scope.step2.mObservacionesPowerEPS,//"dra observaciones", // similar a cgw actual
              LetterObservation: "",//fijo
              Oacnta: "",//fijo
              StatusLetter: 9,//fijo
              CodeCompany: $scope.stepInitial.mEmpresaInit.idCompany,//3,
              UserCreate: $scope.stepInitial.userCreate,//"DADIAZG" // similar a cgw actual
              MagneticResonance: $scope.formData.mResonanciaMagnetica
            },
            SinisterOpening: {
              Year: ($scope.stepInitial.afiliadoDataSelected.anioSinister != "" ? $scope.stepInitial.afiliadoDataSelected.anioSinister : 0),
              Number: ($scope.stepInitial.afiliadoDataSelected.sinisterNumber != "" ? $scope.stepInitial.afiliadoDataSelected.sinisterNumber : 0)
            }
          },
          Budgets: [
            {
              Year: 0,//fijo
              Number: 0,//fijo
              Version: 0,//fijo
              CodeCompany: $scope.stepInitial.mEmpresaInit.idCompany,//3, // Codigo de compania del combo nuevo
              UserCreate: $scope.stepInitial.userCreate,//"DADIAZG",
              CodeBudget:0,// $scope.codeCoberturas,//$scope.step3.coberturasPowerEPS[0].budgetCode,//"3112", //procedimientos[key].details[key2].codeDetail
              RequestedAmount: $scope.requestedAmount + ($scope.requestedAmount * $scope.valorIGV/100),//$scope.step3.coberturasPowerEPS[0].mount,//5000, //procedimientos[key].details[key2].price
              AprrovedAmount: 0, //fijo
              Register: "V",//fijo
              TypeOperation: 1//fijo
            }
          ],
          AttachFiles: []
        };


        $scope.Budgets = [];

        ng.forEach($scope.step3.procedimientos, function (value,key) {
          ng.forEach($scope.step3.procedimientos[key].details, function(value2,key2) {
            if ($scope.step3.procedimientos[key].details[key2].price>0) {
              var budgets = {
                Year: 0,
                Number: 0,
                Version: 0,
                CodeCompany: $scope.stepInitial.mEmpresaInit.idCompany,
                UserCreate: $scope.stepInitial.userCreate,
                CodeBudget: $scope.step3.procedimientos[key].details[key2].codeDetail,
                RequestedAmount: $scope.step3.procedimientos[key].details[key2].price,
                AprrovedAmount: 0.0,
                Register: 'V',//fijo
                TypeOperation: 1//fijo
              };
              $scope.Budgets.push(budgets);
            }
          });
        });

        $scope.paramsRegistroCarta.Budgets = $scope.Budgets;

        $scope.stepInitial.afiliadoDataSelected.splitNames = $scope.stepInitial.afiliadoDataSelected.names.split(" ");
        $scope.stepInitial.afiliadoDataSelected.FirstName = $scope.stepInitial.afiliadoDataSelected.splitNames[0];
        $scope.stepInitial.afiliadoDataSelected.SecondName = ($scope.stepInitial.afiliadoDataSelected.splitNames.length > 1) ? $scope.stepInitial.afiliadoDataSelected.splitNames[1] : '';

        if($scope.stepInitial.mProducto.productCode !== 'S' && $scope.stepInitial.mProducto.productCode !== 'R'){

          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.LastName = $scope.stepInitial.afiliadoDataSelected.lastName || '';
          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.MotherLastName = $scope.stepInitial.afiliadoDataSelected.motherLastName || '';
          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.FirstName = $scope.stepInitial.afiliadoDataSelected.FirstName || '';
          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.SecondName = $scope.stepInitial.afiliadoDataSelected.SecondName || '';
          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.BirthDate = $scope.stepInitial.afiliadoDataSelected.birthdate;
          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.TypeDocument = $scope.stepInitial.afiliadoDataSelected.idDocumentType;
          $scope.paramsRegistroCarta.GuaranteeLetter.Patient.DocumentNumber = $scope.stepInitial.afiliadoDataSelected.documentNumber;
        }

        $scope.paramsRegistroCarta.GuaranteeLetter.Patient.FullName = $scope.stepInitial.afiliadoDataSelected.lastName  + ' ' ||  '';
        $scope.paramsRegistroCarta.GuaranteeLetter.Patient.FullName += $scope.stepInitial.afiliadoDataSelected.motherLastName  + ' ' || '' ;
        $scope.paramsRegistroCarta.GuaranteeLetter.Patient.FullName += $scope.stepInitial.afiliadoDataSelected.FirstName + ' ';
        $scope.paramsRegistroCarta.GuaranteeLetter.Patient.FullName += $scope.stepInitial.afiliadoDataSelected.SecondName || '';


      var response = true;
      if (response) {
          fileUpload.solicitarCartaURL($scope.step3.myFile, $scope.paramsRegistroCarta).then(function(response) {
            if (response.data.operationCode === 200) {
              $scope.formData.yearLetter = response.data.data.year;
              $scope.formData.numberLetter = response.data.data.number;
              $scope.disabledButton = false;
              mModalAlert.showInfo('Carta de Garantía registrada exitosamente', '¡Carta N° ' + response.data.data.year + '-'+ response.data.data.number + '-'+ response.data.data.version).then(function() {
                $state.go('consultaCgw');
              });
            } else {
              $scope.disabledButton = false;
              if (response.data.operationCode === 500)
                mModalAlert.showError(response.data.data.message, 'Error');
              else
                mModalAlert.showError(response.data.mensaje, 'Error');
            }
          }, function(error) {
            $scope.disabledButton = false;
            mModalAlert.showError(error.data.message, 'Error');
          });
      }
    };

    // Editar datos paciente
    $scope.modalEditarDatosPaciente = function(){
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : 'modalEditarDatosPaciente.html',
        // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
            /*#########################
                          # closeModal
                          #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
          }]
      });
    };

    // Editar datos Titular
    $scope.modalEditarDatosTitular = function(){
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : 'modalEditarDatosTitular.html',
        // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
            /*#########################
                          # closeModal
                          #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
          }]
      });
    };

    // Editar datos Diagnostico
    $scope.modalEditarDiagnostico = function(){
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'md',
        templateUrl : 'modalEditarDiagnostico.html',
        // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller : ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
            /*#########################
                          # closeModal
                          #########################*/
            $scope.closeModal = function () {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
          }]
      });
    };

    $scope.isAAPP = function () {
      return ($stateParams.id) === 'A';
    };

    $scope.isSOAT = function () {
      return ($stateParams.id) === 'O';
    };

    $scope.isAutos = function () {
      return ($stateParams.id) === 'U';
    };


  } //  end controller

  return ng.module('appCgw')
    .controller('CgwSolicitudPresupController', cgwSolicitudPresupController);
});
