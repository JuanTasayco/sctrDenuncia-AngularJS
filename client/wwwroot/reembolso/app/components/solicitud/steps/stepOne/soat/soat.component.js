"use strict";

define(["angular", "lodash", "ReembolsoActions", "reConstants"], function(ng, _, ReembolsoActions, reConstants) {
  ReSoatController.$inject = [
    "$scope",
    "reFactory",
    "reServices",
    "$ngRedux",
    "$uibModal",
    "$state",
    "mModalAlert",
    "$log",
    "$window",
    "$q",
    "$filter"
  ];

  function ReSoatController(
    $scope,
    reFactory,
    reServices,
    $ngRedux,
    $uibModal,
    $state,
    mModalAlert,
    $log,
    $window,
    $q,
    $filter
  ) {
    var vm = this;
    var actionsRedux;
    var SOAT_CODE = "O";
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.isVisibleSections = false;
    vm.isActiveSinisterDate = false;
    vm.isActiveNotificationDate = false;

    vm.fnShowAlert = eventError;
    vm.getDataByLicensePlate = getDataByLicensePlate;
    vm.getDiagnosticList = getDiagnosticList;
    vm.changeDepartment = changeDepartment;
    vm.changeProvince = changeProvince;
    vm.changeSinisterDate = changeSinisterDate;
    vm.openModalAfiliate = openModalAfiliate;
    vm.openModalCobertura = openModalCobertura;
    vm.continueToStepTwo = continueToStepTwo;
    vm.changeComplaintDate = changeComplaintDate;
    vm.changeNotificationDate = changeNotificationDate;
    vm.onChangeDocumentDate = onChangeDocumentDate;

    // functions declaration

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, ReembolsoActions)(vm);

      _validateInit();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        company: ng.copy(state.solicitud.company),
        product: ng.copy(state.solicitud.product),
        solicitud: ng.copy(state.solicitud)
      };
    }

    function getDataByLicensePlate() {
      if (vm.stepOne.licensePlate) {
        reFactory.solicitud
          .GetDataByLicensePlate(vm.company.id, vm.stepOne.licensePlate)
          .then(function(res) {
            _validateLicensePlate(res);
          })
          .catch(function(err) {
            _cleanInputs();
            $log.error("Fallo en el servidor", err);
          });
      }
    }

    function getDiagnosticList(input) {
      if (input && input.length >= 3) {
        var criteria = {
          diagnosticName: input.toUpperCase()
        };

        var defer = $q.defer();
        reFactory.solicitud.GetDiagnosticList(criteria).then(
          function(res) {
            defer.resolve(res.data.items);
          },
          function(err) {
            mModalAlert.showError(err.data.message, "Error");
          }
        );

        return defer.promise;
      }
    }

    function changeDepartment() {
      reFactory.solicitud
        .GetProvinceList(vm.stepOne.sinister.department.departmentCode)
        .then(function(res) {
          vm.provinceList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function changeProvince() {
      if (vm.stepOne.sinister.province) {
        reFactory.solicitud
          .GetDistrictList(vm.stepOne.sinister.department.departmentCode, vm.stepOne.sinister.province.idProvince)
          .then(function(res) {
            vm.districtList = res.isValid ? res.data : [];
          })
          .catch(function(err) {
            $log.error("Fallo en el servidor", err);
          });
      }
    }

    function changeSinisterDate(sinisterDate) {

      if (!sinisterDate) {
        return void 0;
      }

      vm.isActiveSinisterDate = true;

      var request = {
        licensePlate: vm.stepOne.licensePlate.toUpperCase(),
        sinisterDate: _formatDate(sinisterDate),
        policyNumber: vm.stepOne.policyNumber
      };

      reFactory.solicitud
        .GeatAssistance(request)
        .then(function(res) {
          if (res.isValid) {
            vm.assitanceProviderData = res.data;

            vm.stepOne.sinister.hour = res.data.sinisterTime;
            vm.stepOne.notification.date = new reFactory.common.DatePicker(new Date(res.data.notificationDate));
            vm.stepOne.notification.hour = res.data.notificationTime;
            vm.stepOne.notification.email = res.data.email;
            vm.stepOne.notification.cellphone = res.data.cellphone;
            vm.stepOne.complaint.date = new reFactory.common.DatePicker(new Date(res.data.denunciationDate));
            vm.stepOne.complaint.hour = res.data.denunciationTime;

            res.data.sinisterNumberRef && _setSinisterData(res.data);
            _mapSinisterCustomer(res.data);

            vm.reduxAdditionalDataAdd({
              documentControlNumber: vm.assitanceProviderData.documentControlNumber,
              idProvider: vm.assitanceProviderData.idProvider,
              isCallToDb: vm.assitanceProviderData.isToCallDb,
              licensePlate: vm.stepOne.licensePlate.toUpperCase(),
              policyNumber: vm.stepOne.policyNumber,
              sinisterAnio: vm.assitanceProviderData.anio,
              sinisterDate: vm.assitanceProviderData.sinisterDate,
              sinisterNumber: vm.assitanceProviderData.sinisterNumber,
              sinisterNumberRef: vm.assitanceProviderData.sinisterNumberRef,
              expedientType: vm.assitanceProviderData.expedientType,
            });
          } else {
            if (res.brokenRulesCollection[0].severity === 0) {
              mModalAlert.showError(res.brokenRulesCollection[0].description, "Error").then(function(r) {
                _cleanInputs();
              });

              return void 0;
            }

            vm.stepOne = _.assign({}, vm.stepOne, {
              documentsDate: new reFactory.common.DatePicker(),
              notification: _.assign({}, vm.stepOne.notification, {
                date: new reFactory.common.DatePicker(),
                hour: "00:00"
              }),
              complaint: {
                date: new reFactory.common.DatePicker(),
                hour: "00:00"
              }
            });

            vm.reduxAdditionalDataAdd({
              idProvider: null,
              isCallToDb: false,
              licensePlate: vm.stepOne.licensePlate.toUpperCase(),
              policyNumber: vm.stepOne.policyNumber,
              sinisterDate: vm.stepOne.sinister.date.model
            });

            _validateCustomerContract();
          }

          vm.isActiveNotificationDate = !res.isValid;
          vm.isEditableStepOne = res.isValid ? !(res.data.sinisterNumber > 0) : true;
          vm.stepOne.notification.date.setMinDate(sinisterDate);
          vm.stepOne.complaint.date.setMinDate(sinisterDate);
          vm.stepOne.documentsDate.setMinDate(sinisterDate);
          vm.stepOne.documentsDate.setMaxDate(new Date());
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function onChangeDocumentDate(date) {
      if (!date) {
        return void 0;
      }

      if (date < vm.stepOne.sinister.date.model) {
        mModalAlert.showError("La fecha de recepción no puede ser menor a la de siniestro", "Error");
        vm.stepOne.documentsDate = new reFactory.common.DatePicker();
        vm.stepOne.documentsDate.setMinDate(vm.stepOne.sinister.date.model);
        vm.stepOne.documentsDate.setMaxDate(new Date());

        return void 0;
      }

      if (date > new Date()) {
        mModalAlert.showError("La fecha de recepción del documento no puede ser a futuro.", "Error");
        vm.stepOne.documentsDate = new reFactory.common.DatePicker();
        vm.stepOne.documentsDate.setMinDate(vm.stepOne.sinister.date.model);
        vm.stepOne.documentsDate.setMaxDate(new Date());

        return void 0;
      }

      var req = {
        receptionDocumentDate: vm.stepOne.documentsDate.model,
        idCompany: vm.solicitud.company.id
      };

      reFactory.solicitud.ValidateDocumentsDate(req)
        .then(function(res) {
          if (!res.isValid) {
            mModalAlert.showError(res.brokenRulesCollection[0].description, "Error");
            vm.stepOne.documentsDate = new reFactory.common.DatePicker();
            vm.stepOne.documentsDate.setMinDate(vm.stepOne.sinister.date.model);
            vm.stepOne.documentsDate.setMaxDate(new Date());
          }
        })
        .catch(function(err) {
          $log.log(err);
        });
    }

    function changeComplaintDate(complaintDate) {
      if (vm.stepOne.sinister.date.model && complaintDate) {
        if (complaintDate < vm.stepOne.sinister.date.model) {
          mModalAlert.showError("La fecha de denuncia no puede ser anterior a la fecha del siniestro", "Error");
          vm.stepOne.complaint.date.model = undefined;
        }
      }
    }

    function changeNotificationDate(notificationDate) {
      if (vm.stepOne.sinister.date.model && notificationDate) {
        if (notificationDate < vm.stepOne.sinister.date.model) {
          mModalAlert.showError("La fecha de notificación no puede ser anterior a la fecha del siniestro", "Error");
          vm.stepOne.notification.date.model = undefined;
        }
      }
    }

    function openModalAfiliate() {
      if (vm.stepOne.sinister.date.model) {
        var modalAfiliate = vm.modalAffiliate();
        var modalCreateAfiliate = vm.modalCreateAfiliate();
        var assignAfiliate = function(resObj) {
          return _.assign({}, resObj, {
            beneficiaryCorrelativeNumber: resObj.correlativeNumber || 1
          });
        };

        var setBeneficaryData = function(res) {
          vm.stepOne.afiliate = assignAfiliate(res);
          vm.reduxUpdateAfiliate(vm.stepOne.afiliate);
        };

        modalAfiliate('GetEquifaxData', true).result.then(function(r) {
          if (r.action === "create") {
            modalCreateAfiliate(r, true).result.then(function(res) {
              setBeneficaryData(res);
            });
          } else {
            setBeneficaryData(r.afiliate);
          }
        });
      }
    }

    function openModalCobertura() {
      if (vm.frmStepOne.$invalid) {
        !_isValidRangerSinisterDate() &&
          mModalAlert.showError("La fecha de siniestro no se encuentra en el rango permitido", "Error");

        vm.frmStepOne.markAsPristine();
        return void 0;
      }

      if (vm.stepOne.afiliate) {
        _showCoveragesModal(vm.solicitud.coverage, vm.solicitud.afiliate)
          .result.then(function(res) {
            vm.stepOne.coverage = res;
            vm.reduxUpdateCoverage(res);
            _getDocumentLiquidation();
          })
          .catch(function(err) {
            $log.error(err);
          });
      }
    }

    function eventError() {
      var response = false;
      if (!response) {
        mModalAlert
          .showError(
            "Comunicate con tu ejecutivo Mapfre lo antes posible",
            "¡Ups! La placa no tiene una póliza asociada"
          )
          .then(function(response) {
            $log(response);
          });
      }
    }

    function continueToStepTwo() {
      if (vm.frmStepOne.$invalid) {
        vm.frmStepOne.markAsPristine();
        return void 0;
      }

      if (
        vm.stepOne.afiliate &&
        vm.stepOne.coverage &&
        vm.stepOne.sinister.hour &&
        vm.stepOne.notification.hour &&
        vm.stepOne.complaint.hour
      ) {
        var frmToState = _mapFormToState(vm.stepOne);
        // _saveEmailPhone();

        vm.onContinue(frmToState);
      }
    }

    // private

    // validates
    function _validateInit() {
      vm.isEditableStepOne = true;
      vm.stepOne = _mapInitObjProperties();
      vm.dateForm = "dd/MM/yyyy";

      vm.stepOne.documentsDate.setMaxDate(new Date());

      if (vm.solicitud.coverage) {
        _getSinisterList();
        _getDepartmentList();
        _setRangeToSinisterDate();

        vm.isVisibleSections = true;
        vm.stepOne = _mapEditStepOne(vm.solicitud);

        vm.changeDepartment();
        vm.changeProvince();
      }
    }

    function _validateLicensePlate(response) {
      if (response.isValid) {
        vm.stepOne.policyNumber = response.data.policyNumber;
        vm.isVisibleSections = true;
        vm.reduxAdditionalDataAdd({
          maxSinisterDate: response.data.policyDueDate,
          minSinisterDate: response.data.policyIssueDate
        });

        _getSinisterList();
        _getDepartmentList();
        _setRangeToSinisterDate();
      } else {
        mModalAlert
          .showError("Comunicate con tu ejecutivo Mapfre lo antes posible", "¡Ups! La placa no exise")
          .then(function() {});
        _cleanInputs();
      }
    }

    function _validateCustomerContract() {
      var request = {
        policyNumber: vm.solicitud.additionalData.policyNumber,
        idCompany: vm.solicitud.company.id
      };

      reFactory.solicitud
        .GenerateContract(request)
        .then(function(res) {
          res.isValid && _getCustomerData();
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function _validateModalFlowRegularCoverage(isCallToDb) {
      if (
        vm.solicitud.coverage.code !== reConstants.coverages.gastosSepelio &&
        vm.solicitud.coverage.code !== reConstants.coverages.gastosCuracion
      ) {
        // isCallToDb && _setReservationAmount();

        _showCoveragesModalForm().result.then(function(r) {
          vm.continueToStepTwo();
        });
      }
    }

    function _validateModalFlowGastosCoverage(isCallToDb) {
      if (
        vm.solicitud.coverage.code === reConstants.coverages.gastosSepelio ||
        vm.solicitud.coverage.code === reConstants.coverages.gastosCuracion
      ) {
        _showAmountProviderModal().result.then(function(r) {
          vm.reduxUpdateDocumentLiquidation({
            amountDocumentProvider: r
          });

          _showCoveragesModalForm().result.then(function() {
            vm.continueToStepTwo();
          });
        });
      }
    }

    function _isValidRangerSinisterDate() {
      var minDate = vm.solicitud.additionalData.minSinisterDate;
      var maxDate = vm.solicitud.additionalData.maxSinisterDate;

      return vm.stepOne.sinister.date.model >= new Date(minDate) && vm.stepOne.sinister.date.model <= new Date(maxDate);
    }

    function _validateAmountProvider(data) {
      if (data.amountDocumentProvider < 1) {
        _showAmountModalWrapperToFormModal(_getPreLiquidation, data);
      } else {
        _getPreLiquidation(data);

        _showCoveragesModalForm().result.then(function(r) {
          vm.continueToStepTwo();
        });
      }
    }

    function _cleanInputs() {
      vm.stepOne = _mapInitObjProperties();
      vm.isVisibleSections = false;
      vm.dateForm = "dd/MM/yyyy";
      vm.stepOne.documentsDate.setMaxDate(new Date());
    }

    function _formatDate(date) {
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var formatDate = day + "-" + month + "-" + year;
      var newDate = date instanceof Date ? formatDate : "Error: argument date is not Date type";
      return newDate;
    }

    // modals

    function _showCoveragesModal(coverage, afiliate) {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: "md",
        template: '<re-coverages-modal close="close($event)" coverage-selected="coverage" afiliate="afiliate"></re-coverages-modal>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function(scope, $uibModalInstance) {
            scope.coverage = coverage;
            scope.afiliate = afiliate;
            scope.close = function(ev) {
              ev && ev.status === "ok" ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _showCoveragesModalForm() {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: "lg",
        template: '<re-coverages-modal-form close="close"></re-coverages-modal-form>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function(scope, $uibModalInstance) {
            scope.close = function(ev) {
              ev && ev.status === "ok" ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _showAmountProviderModal() {
      return $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: "md",
        template: '<re-modal-amount-provider close="close($event)"></re-modal-amount-provider>',
        controller: [
          "$scope",
          "$uibModalInstance",
          function(scope, $uibModalInstance) {
            scope.close = function(ev) {
              ev && ev.status === "ok" ? $uibModalInstance.close(ev.data) : $uibModalInstance.dismiss();
            };
          }
        ]
      });
    }

    function _showAmountModalWrapperToFormModal(servicePreFormModal, params) {
      var req = ng.copy(params);

      _showAmountProviderModal().result.then(function(r) {
        servicePreFormModal(req, r);

        _showCoveragesModalForm().result.then(function(r) {
          vm.continueToStepTwo();
        });
      });
    }

    // services

    function _getSinisterList() {
      reFactory.solicitud
        .GetSinisterList()
        .then(function(res) {
          vm.sinisterList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function _getDepartmentList() {
      reFactory.solicitud
        .GetDepartmentList()
        .then(function(res) {
          vm.departmentList = res.isValid ? res.data : [];
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function _getDocumentLiquidation() {
      var request = {
        sinisterNumberRef: vm.solicitud.additionalData.sinisterNumberRef,
        benefitCode: vm.solicitud.coverage.code,
        receptionDocumentDate: vm.stepOne.documentsDate.model,
        productCode: vm.solicitud.product.code,
        idAffiliate: vm.solicitud.afiliate.idAffiliate
      };

      reFactory.solicitud
        .GetDocumentLiquidation(request)
        .then(function(res) {
          if (res.isValid) {
            vm.reduxUpdateDocumentLiquidation({
              anio: res.data.anio,
              documentControlNumber: res.data.documentControlNumber,
              idAffiliate: res.data.idAffiliate,
              amountDocumentProvider: res.data.amountDocumentProvider
            });
            vm.continueToStepTwo();
          } else {
            _validateModalFlowRegularCoverage(vm.solicitud.additionalData.isCallToDb);
            _validateModalFlowGastosCoverage(vm.solicitud.additionalData.isCallToDb);
          }
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function _getPreLiquidation(data, amountProvider) {
      var request = {
        anio: data.anio,
        documentControlNumber: data.documentControlNumber
      };

      reFactory.solicitud
        .GetPreLiquidation(request)
        .then(function(res) {
          var data = res.isValid ? res.data : ng.copy(vm.solicitud.afiliate);

          vm.reduxUpdateExtraBeneficiaryData(data);

          amountProvider > 0 &&
            vm.reduxAddDocumentLiquidation({
              amountDocumentProvider: amountProvider
            });
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function _getCustomerData() {
      var request = {
        idCompany: vm.solicitud.company.id,
        policyNumber: vm.solicitud.additionalData.policyNumber,
        productCode: vm.solicitud.product.code
      };

      reFactory.solicitud
        .GetCustomerContract(request)
        .then(function(res) {
          res.isValid && _mapSinisterCustomer(res.data);
        })
        .catch(function(err) {
          $log.error(err);
        });
    }

    function _saveDocumentLiquidation(optional, amountProvider) {
      var request = {
        amountDocumentProvider: amountProvider,
        anio: vm.solicitud.additionalData.sinisterAnio,
        beneficiaryCompensationCode: vm.solicitud.coverage.code,
        beneficiaryCorrelativeNumber: vm.solicitud.afiliate.beneficiaryCorrelativeNumber,
        customerContractNumber: vm.solicitud.solicitudData.contractNumber,
        documentControlNumber: vm.solicitud.additionalData.documentControlNumber,
        expedientType: "ZOV",
        idAffiliate: vm.solicitud.afiliate.idAffiliate,
        idCause: vm.stepOne.sinister.causa.idCause,
        idCompany: vm.solicitud.company.id,
        idCustomer: vm.solicitud.solicitudData.client.id,
        idPlan: vm.solicitud.solicitudData.plan.id,
        liquidationReceptionDocumentDate: vm.stepOne.documentsDate.model,
        productCode: vm.solicitud.product.code,
        sinisterDate: vm.solicitud.additionalData.sinisterDate,
        sinisterNumberRef: vm.solicitud.additionalData.sinisterNumberRef
      };

      reFactory.solicitud
        .SaveDocumentLiquidation(request)
        .then(function(res) {
          var data = ng.copy(vm.solicitud.afiliate);
          if (res.isValid) {
            var documentLiquidationData = {
              anio: res.data.anio,
              documentControlNumber: res.data.documentControlNumber,
              idAffiliate: res.data.idAffiliate,
              amountDocumentProvider: res.data.amountDocumentProvider
            };

            vm.reduxUpdateExtraBeneficiaryData(data);
            vm.reduxUpdateDocumentLiquidation(documentLiquidationData);
          }
        })
        .catch(function(err) {
          $log.error("Fallo en el servidor", err);
        });
    }

    function _setSinisterData(data) {
      vm.stepOne.sinister = _.assign({}, vm.stepOne.sinister, {
        causa: {
          idCause: data.idCause
        },
        hour: data.sinisterTime,
        department: {
          departmentCode: data.departmentCode
        },
        province: {
          idProvince: data.idProvince
        },
        district: {
          idDistrict: data.idDistrict
        }
      });

      vm.changeDepartment();
      vm.changeProvince();
    }

    function _setReservationAmount() {
      var request = {
        sinisterDate: vm.solicitud.additionalData.sinisterDate,
        beneficiaryCompensationCode: vm.solicitud.coverage.code,
        beneficiaryCorrelativeNumber: vm.solicitud.afiliate.beneficiaryCorrelativeNumber,
        sinisterNumberRef: vm.solicitud.additionalData.sinisterNumberRef,
        sinisterNumber:
          vm.solicitud.additionalData.sinisterNumber === 0 ? null : vm.solicitud.additionalData.sinisterNumber,
        idCompany: vm.solicitud.company.id,
        anio: vm.solicitud.additionalData.sinisterAnio,
        documentControlNumber: vm.solicitud.additionalData.documentControlNumber
      };

      reFactory.solicitud
        .ReservationAmount(request)
        .then(function(r) {})
        .catch(function(err) {
          $log.error("Falló el servidor", err);
        });
    }

    function _setRangeToSinisterDate() {
      var minDate = vm.solicitud.additionalData.minSinisterDate;
      var maxDate = vm.solicitud.additionalData.maxSinisterDate;
      vm.stepOne.sinister.date.setMinDate(new Date(minDate));
      vm.stepOne.sinister.date.setMaxDate(new Date(maxDate));
    }

    function _saveEmailPhone() {
      var request = {
        anio: vm.solicitud.additionalData.sinisterAnio,
        correlativeNumber: vm.solicitud.afiliate.beneficiaryCorrelativeNumber,
        documentControlNumber: vm.solicitud.additionalData.documentControlNumber,
        email: vm.stepOne.notification.email,
        phone: vm.stepOne.notification.cellphone
      };

      reFactory.solicitud
        .SaveExtendBeneficiary(request)
        .then(function(res) {})
        .catch(function(err) {
          $log.error("Falló el servidor", err);
        });
    }

    // map objects

    function _mapSinisterCustomer(data) {
      vm.stepOne.solicitudData = {
        client: {
          id: data.idCustomer,
          documentNumber: data.customerDocumentNumber,
          name: data.customerDescription
        },
        plan: {
          id: data.idPlan,
          name: data.descriptionPlan
        },
        relationship: {
          id: data.idRelationship,
          description: data.descriptionRelationship
        },
        contractNumber: data.customerContractNumber
      };

      vm.reduxUpdateSolicitudData(vm.stepOne.solicitudData);
    }

    function _mapFormToState(form) {
      var sinisterHourArr = form.sinister.hour.split(":");
      var notificationHour = form.notification.hour.split(":");
      var complaintHour = form.complaint.hour.split(":");

      var sinisterDate = new reFactory.common.DatePicker(
        new Date(new Date(form.sinister.date.model).setHours(sinisterHourArr[0], sinisterHourArr[1]))
      );

      var notificationDate = new reFactory.common.DatePicker(
        new Date(new Date(form.notification.date.model).setHours(notificationHour[0], notificationHour[1]))
      );

      var complaintDate = new reFactory.common.DatePicker(
        new Date(new Date(form.complaint.date.model).setHours(complaintHour[0], complaintHour[1]))
      );

      var objAfiliate = _.assign({}, form.afiliate);
      var objCoverage = _.assign({}, form.coverage);
      var objsolicitudData = _.assign({}, form.solicitudData);
      var objComplaint = _.assign({}, form.complaint, {
        date: $filter("date")(complaintDate.model, "yyyy-MM-ddThh:mm:00")
      });
      var objNotification = _.assign({}, form.notification, {
        date: $filter("date")(notificationDate.model, "yyyy-MM-ddThh:mm:00")
      });
      var objSinister = _.assign({}, form.sinister, {
        causa: form.sinister.causa.idCause,
        date: $filter("date")(sinisterDate.model, "yyyy-MM-ddThh:mm:00"),
        department: form.sinister.department.departmentCode,
        district: form.sinister.district.idDistrict,
        province: form.sinister.province.idProvince
      });

      return _.assign(
        {},
        {
          afiliate: objAfiliate,
          complaint: objComplaint,
          coverage: objCoverage,
          notification: objNotification,
          solicitudData: objsolicitudData,
          sinister: objSinister,
          presentationsDocumentsDate: vm.stepOne.documentsDate.model
        }
      );
    }

    function _mapInitObjProperties() {
      return _.assign(
        {},
        {
          documentsDate: new reFactory.common.DatePicker(),
          sinister: {
            date: new reFactory.common.DatePicker()
          },
          notification: {
            date: new reFactory.common.DatePicker()
          },
          complaint: {
            date: new reFactory.common.DatePicker()
          }
        }
      );
    }

    function _mapEditStepOne(data) {
      return _.assign(
        {},
        {
          licensePlate: data.additionalData.licensePlate,
          policyNumber: data.additionalData.policyNumber,
          sinister: {
            date: new reFactory.common.DatePicker(new Date(data.sinister.date)),
            hour: data.sinister.hour,
            causa: {
              idCause: data.sinister.causa
            },
            department: {
              departmentCode: data.sinister.department
            },
            province: {
              idProvince: data.sinister.province
            },
            district: {
              idDistrict: data.sinister.district
            }
          },
          notification: {
            date: new reFactory.common.DatePicker(new Date(data.notification.date)),
            hour: data.notification.hour,
            email: data.notification.email,
            cellphone: data.notification.cellphone
          },
          solicitudData: {
            diagnostic: data.solicitudData.diagnostic,
            client: data.solicitudData.client,
            plan: data.solicitudData.plan,
            relationship: data.solicitudData.relationship,
            contractNumber: data.solicitudData.contractNumber
          },
          complaint: {
            date: new reFactory.common.DatePicker(new Date(data.complaint.date)),
            hour: data.complaint.hour
          },
          documentsDate: new reFactory.common.DatePicker(new Date(data.presentationsDocumentsDate)),
          afiliate: data.afiliate,
          coverage: data.coverage
        }
      );
    }
  }

  return ng
    .module("appReembolso")
    .controller("ReSoatController", ReSoatController)
    .component("reSoat", {
      templateUrl: "/reembolso/app/components/solicitud/steps/stepOne/soat/soat.html",
      controller: "ReSoatController",
      bindings: {
        modalAffiliate: "<",
        modalCreateAfiliate: "<",
        onContinue: "<"
      }
    });
});
