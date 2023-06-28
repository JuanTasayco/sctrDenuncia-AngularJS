'use strict';

define(['angular', 'constants', 'moment', 'lodash', 'helper', 'mpfPersonConstants'], function (ng, constants, moment, _, helper, personConstants) {
  registroInspeccionController.$inject = [
    '$state',
    '$log',
    '$q',
    '$scope',
    '$stateParams',
    '$uibModal',
    'inspecFactory',
    'UserService',
    'mModalAlert',
    'mpSpin',
    'mModalConfirm',
    'ErrorHandlerService',
    '$filter',
    '$window',
    'proxyGeneral',
    'proxyDocumento',
    'oimAbstractFactory',
  ];

  function registroInspeccionController(
    $state,
    $log,
    $q,
    $scope,
    $stateParams,
    $uibModal,
    inspecFactory,
    UserService,
    mModalAlert,
    mpSpin,
    mModalConfirm,
    ErrorHandlerService,
    $filter,
    $window,
    proxyGeneral,
    proxyDocumento,
    oimAbstractFactory
  ) {
    var vm = this;

    var filterDate = $filter('date');
    var formatDate = constants.formats.dateFormat;

    vm.$onInit = onInit;
    vm.searchMarcaModelo = searchMarcaModelo;
    vm.getFunctionsModeloMarca = getFunctionsModeloMarca;
    vm.getFunctionsSubModelo = getFunctionsSubModelo;
    vm.getFuctionsYearFabric = getFuctionsYearFabric;
    vm.getWheelDrive = getWheelDrive;
    vm.getInfoByLicensePlate = getInfoByLicensePlate;
    vm.showAutomas = showAutomas;
    vm.showObservationModal = showObservationModal;
    vm.saveInspection = saveInspection;
    vm.saveInspection2 = saveInspection2;
    vm.endInspection = endInspection;
    vm.loadMarca = loadMarca;
    vm.calculatePremium = calculatePremium;
    vm.fnAutoEmit = _fnAutoEmit;
    vm.loadOtherDetails = loadOtherDetails;
    vm.buildExtraData = buildExtraData;
    vm.obtenerDctontegralidad = obtenerDctontegralidad;
    vm.loadObservations = loadObservations;
    vm.resolveObservations = resolveObservations;
    vm.downloadPDF = downloadPDF;
    vm.shouldAddObservation = shouldAddObservation;

    function buildExtraData() {
      inspecFactory.vehicle.getTipoVehiculo().then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          vm.tipoVehiculo = response.Data;
        }
      });

      var pmsI = inspecFactory.management.getInspectorByRequestId(vm.requestId);
      pmsI.then(function (response) {
        vm.inspector = response.data[0];
      });
    }

    function onInit() {
      vm.activeTab = 1;
      vm.user = UserService;
      vm.riskId = $stateParams.riskId;
      vm.requestId = $stateParams.requestId;
      vm.inspectionId = $stateParams.inspectionId;
      vm.currentDate = new Date();
      vm.photos = {};
      vm.request = $stateParams.request;
      vm.isMyDream = oimAbstractFactory.isMyDream();
      vm.isMobile = helper.isMobile();

      vm.Math = $window.Math;
      vm.scale = {
        decimalSeparator: '.',
        millarSeparator: ',',
        millonSeparator: "'",
        precision: 9,
        scale: 0,
        sinCeros: true,
      };
      vm.observationStatus = {
        none: 0,
        Nuevo: 1,
        Observado: 2,
        Pendiente: 3,
        Resuelto: 4,
      };

      vm.propertyCardPhotos = [];
      if (!vm.riskId || !vm.requestId) {
        $state.go('solicitudes');
      } else {
        mpSpin.start();
        vm.roleCode = inspecFactory.common.getRoleCode();
        vm.profile = inspecFactory.common.getProfile();
        queryRequest().then(function () {
          if (!vm.inspection.inspectionId) {
            queryFormData().then(function () {
              setNewOriginal();
              vm.firstRequestCompleted = true;
            });
          } else {
            queryInspection().then(function () {
              queryFormData().then(function () {
                setNewOriginal();
                vm.firstRequestCompleted = true;
              });
            });
          }
        });
      }
      buildExtraData();

      var profile = JSON.parse(window.localStorage.getItem('profile'));
      vm.esEjecutivo = !profile.isAgent && profile.userSubType === "1";
      vm.esAgente = profile.isAgent && profile.userSubType === "1";
      vm.esCorredor = profile.userSubType === "3";
    }
    onInit();

    $scope.$on('$stateChangeStart', function(event, toState) {
      if (vm.hasBeenModified && !vm.saved) {
        event.preventDefault();
        mModalConfirm
          .confirmInfo('Si sales del registro sin guardar, perderás el progreso', 'Abandonar el registro', 'Aceptar')
          .then(function () {
            vm.saved = true;
            $state.go(toState);
          });
      }
    });

    function getFlagAnual(cod) {
      var paramsP = {
        CodigoAplicacion: 'EMISA',
        CodigoUsuario: vm.profile.username,
        Filtro: 'AUTOMOVILES',
        CodigoRamo: 301,
        CodigoTipoVehiculo: cod,
      };
      var pmsP = inspecFactory.vehicle.getListProductsByVehicle(paramsP);
      pmsP.then(function (res) {
        var dataProducts = res.Data;
        var product = _.find(dataProducts, {CodigoProducto: vm.contractor.productId});
        vm.modality = product.CodigoModalidad;
        vm.flagAnual = product.FlagAnual;
      });
    }

    function loadOtherDetails() {
      var pmsE = inspecFactory.management.getEmitInfoByRequestID(vm.requestId);
      pmsE.then(function (response) {
        vm.otherDetails = response.data[0];
        getFlagAnual(vm.otherDetails.codtipovehiculo);
      });
    }

    function queryOffice() {
      return inspecFactory.common.getGestorOficina(vm.inspection.agentId, true).then(function (response) {
        vm.inspectionOffice = response.Data;
      });
    }

    function queryFormData() {
      return $q.all([
        getWheelDrive(),
        getVehicleOrigin(),
        getListColor(),
        getVehicleAccessories(),
        getVehicleStatus(),
        getSteeringWheel(),
        queryPhotoType(),
        queryOffice(),
        loadObservations()
      ]);
    }

    function queryRequest() {
      return inspecFactory.requests.getRequestById(vm.requestId, vm.riskId, true).then(function (response) {
        setRequest(response);
      });
    }

    function setRequest(response) {
      vm.inspection = {
        systemCode: oimAbstractFactory.getOrigin(),
        inspectionId: response.items[0].inspectionId,
        financeTypeId: response.contractor.financeTypeId,
        riskId: response.items[0].riskId,
        riskStatus:
          response.items[0].riskStatusCode === '2' ? 'EN PROCESO DE INSPECCIÓN' : response.items[0].riskStatus,
        riskStatusCode: response.items[0].riskStatusCode === '2' ? '4' : response.items[0].riskStatusCode,
        isForEvaluation: response.items[0].riskStatusCode === '5',
        name: response.contractor ? response.contractor.name : '',
        lastName: response.contractor ? response.contractor.lastName : '',
        lastMotherName: response.contractor ? response.contractor.motherlastName : '',
        documentTypeCode: response.contractor ? response.contractor.documentTypeCode : null,
        documentNumber: response.contractor ? response.contractor.documentNumber : '',
        sexCode: response.contractor ? response.contractor.sex : null,
        personTypeCode: null,
        nationalityCode: response.contractor ? response.contractor.nationalityCode : null,
        nationality: response.contractor ? response.contractor.nationality : '',
        professionId: response.contractor ? response.contractor.professionId : null,
        profession: response.contractor ? response.contractor.profession : '',
        phone: response.items[0].contactPhone,
        celPhone: response.items[0].contactCelphone ? response.items[0].contactCelphone.match(/\d+/)[0] : null,
        extPhone: response.items[0].contactOfficePhone ? response.items[0].contactOfficePhone.match(/\d+/)[0] : null,
        personalEmail: response.items[0].contactEmail,
        officeEmail: response.items[0].contactOfficeEmail,
        zoneTypeCode: null,
        address: response.items[0].contactAddress,
        departmentId: response.contractor ? response.contractor.departmentId : null,
        department: response.contractor ? response.contractor.department : '',
        provinceId: response.contractor ? response.contractor.provinceId : null,
        province: response.contractor ? response.contractor.province : '',
        districtId: response.contractor ? response.contractor.districtId : null,
        district: response.contractor ? response.contractor.district : '',
        addressReference: response.contractor ? response.contractor.addressReference : '',
        inspectionReasonId: response.inspectionTypeCode,
        inspectionDate: response.items[0].scheduleDate
          ? moment(response.items[0].scheduleDate).toDate()
          : moment().toDate(),
        inspectionPlaceCode: null,
        agentId: response.agentRequestId,
        agentRequestName: response.agentRequestName,
        vehicleLicensePlate: response.requestTypeCode !== '2' ? response.items[0].vehicleLicensePlate : null,
        officeCode: null,
        vehicleClassCode: null,
        vehicleWheelDriveId: null,
        vehicleGasId: null,
        vehicleWeight: null,
        vehicleCylindersNumber: null,
        vehicleDoorsNumber: null,
        vehicleTransmissionId: null,
        vehicleImage: null,
        vehicleSteeringWheelCode: null,
        civilStateCode: response.contractor ? response.contractor.civilstateId : null,
        civilstate: response.contractor ? response.contractor.civilstate : '',
        birthDate: response.contractor ? moment(response.contractor.birthDate, 'D/MM/YYYY h:mm:ss A').toDate() : '',
        vehicleSteeringWheelId: null,
        roadTypeCode: response.contractor ? response.contractor.roadTypeCode : null,
        roadType: response.contractor ? response.contractor.roadType : '',
        roadDescription: response.contractor ? response.contractor.roadDescription : '',
        numberTypeCode: response.contractor ? response.contractor.numberTypeCode : null,
        numberType: response.contractor ? response.contractor.numberType : '',
        insideTypeCode: response.contractor ? response.contractor.insideTypeCode : null,
        insideType: response.contractor ? response.contractor.insideType : '',
        insideDescription: response.contractor ? response.contractor.insideDescription : '',
        numberDescription: response.contractor ? response.contractor.numberDescription : '',
        zoneTypeId: response.contractor ? response.contractor.zoneTypeId : null,
        zoneType: response.contractor ? response.contractor.zoneType : '',
        zoneDescription: response.contractor ? response.contractor.zoneDescription : '',
        reinspectionDetails: null,
        inspectionDepartmentId: response.items[0].departmentId,
        inspectionDepartment: response.items[0].departmentCirculationPlace,
        inspectionProvinceId: response.items[0].provinceId,
        inspectionProvince: response.items[0].provinceCirculationPlace,
        inspectionDistrictId: response.items[0].districtId,
        inspectionDistrict: response.items[0].districtCirculationPlace,
        inspectionAddress: response.items[0].contactAddress,
        inspectionAddressReference: response.items[0].contactReference,
        userOwnerCode: 'MULTIPLICA',
        startInspectionDate: response.items[0].scheduleDate
          ? moment(response.items[0].scheduleDate).toDate()
          : moment().toDate(),
        endInspectionDate: response.items[0].endScheduleDate
          ? moment(response.items[0].endScheduleDate).toDate()
          : moment().toDate(),
        mStereo: [],
        mItems: [],
        isAnotherInsurer: response.isAnotherInsurer,
        isAutoInspection: response.isAutoInspection,
        idInspecPresencial: response.mcaReqInspeccionPresencial === 'S' ? '10' : null,
        inspecPresencial: response.mcaReqInspeccionPresencial === 'S' ? 'INSP. PRESENCIAL' : null
      };
      vm.requestData = response.items[0];
      vm.creationDate = response.items[0].riskCreationDate;
      vm.inspection.vehicleSteeringWheelId = null;
      if (response.contractor) {
        vm.contractor = {
          contractorNumberTypeId: response.contractor.numberTypeId,
          contractorNumberType: response.contractor.numberType,
          contractorInsideTypeId: response.contractor.insideTypeId,
          contractorInsideType: response.contractor.insideType,
          contractorZoneTypeId: response.contractor.zoneTypeId,
          contractorZoneType: response.contractor.zoneType,
          contractorMapfreDollar: response.contractor.mapfreDollar,
          contractorAgentOwnerId: response.agentOwnerId,
          productId: response.contractor.productId,
          product: response.contractor.product,
          name: response.contractor.name,
          lastName: response.contractor.lastName,
          lastMotherName: response.contractor.motherlastName,
          documentTypeCode: response.contractor.documentTypeCode,
          documentNumber: response.contractor.documentNumber,
          sexCode: response.contractor.sex,
          nationalityCode: response.contractor.nationalityCode,
          nationality: response.contractor.nationality,
          professionId: response.contractor.professionId,
          profession: response.contractor.profession,
          departmentId: response.contractor.departmentId,
          department: response.contractor.department,
          provinceId: response.contractor.provinceId,
          province: response.contractor.province,
          districtId: response.contractor.districtId,
          district: response.contractor.district,
          addressReference: response.contractor.addressReference,
          civilStateCode: response.contractor.civilstateId,
          civilstate: response.contractor.civilstate,
          birthDate: moment(response.contractor.birthDate, 'D/MM/YYYY h:mm:ss A').toDate(),
          roadTypeCode: response.contractor.roadTypeCode,
          roadType: response.contractor.roadType,
          roadDescription: response.contractor.roadDescription,
          numberTypeCode: response.contractor.numberTypeCode,
          numberType: response.contractor.numberType,
          insideTypeCode: response.contractor.insideTypeCode,
          insideType: response.contractor.insideType,
          insideDescription: response.contractor.insideDescription,
          numberDescription: response.contractor.numberDescription,
          zoneTypeId: response.contractor.zoneTypeId,
          zoneType: response.contractor.zoneType,
          zoneDescription: response.contractor.zoneDescription,
        };
        vm.requestData.vehicleLicensePlate = response.contractor.licensePlate;
      }

      var paramsGPS = {
        codMar: !vm.requestData.vehicleBrandId ? 0 : vm.requestData.vehicleBrandId,
        codMod: !vm.requestData.vehicleModelId ? 0 : vm.requestData.vehicleModelId,
        codSub: !vm.requestData.vehicleSubModelId ? 0 : vm.requestData.vehicleSubModelId,
        anoFab: !vm.requestData.vehicleYear ? 0 : vm.requestData.vehicleYear,
      };
      var pmsG = inspecFactory.vehicle.getGps(paramsGPS);
      pmsG.then(function (response) {
        vm.gps = response.Data;
      });

      vm.finished = vm.inspection.riskStatusCode === '3';
      vm.disabled =
        (vm.finished && !vm.user.isAPermittedObject('EDIFIN')) ||
        (vm.inspection.riskStatusCode !== '5' && !vm.user.isAPermittedObject('REGINS')) ||
        (vm.inspection.riskStatusCode === '5' && !vm.user.isAPermittedObject('EVAINS')) ||
        vm.inspection.riskStatusCode === '6';
      if (
        (vm.inspection.riskStatusCode === '4' && !response.items[0].inspectorId) ||
        (response.items[0].vehicleBrandId && !vm.inspection.inspectionId)
      ) {
        vm.inspection.ModeloMarca = {
          codigoMarca: response.items[0].vehicleBrandId,
          codigoModelo: response.items[0].vehicleModelId,
          marcaModelo: response.items[0].vehicleBrand + ' ' + response.items[0].vehicleModel,
          nombreMarca: response.items[0].vehicleBrand,
          nombreModelo: response.items[0].vehicleModel,
        };
        vm.inspection.mTipoVehiculo = {
          CodigoTipo: response.items[0].vehicleTypeId,
          NombreTipo: response.items[0].vehicleType,
        };
        vm.inspection.mVersion = response.items[0].vehicleVersion;
        getFunctionsModeloMarca(vm.inspection.ModeloMarca);
        if (response.items[0].vehicleSubModelId) {
          vm.inspection.mSubModelo = {
            Codigo: response.items[0].vehicleSubModelId,
            Tipo: response.items[0].vehicleTypeId,
            NombreTipo: response.items[0].vehicleType,
          };
          getFunctionsSubModelo(vm.inspection.mSubModelo);
          if (response.items[0].vehicleYear) {
            vm.inspection.mYearFabric = {
              Codigo: response.items[0].vehicleYear.toString(),
            };
            getFuctionsYearFabric(vm.inspection.mYearFabric);
          }
        }
      }
      //documento

      proxyDocumento
        .GetDocumentoByNumber(
          constants.module.polizas.autos.companyCode,
          response.quotationId,
          constants.module.polizas.autos.codeRamo,
          true
        )
        .then(function (response) {
          if (response.OperationCode === 200 && response.Data) {
            vm.inspection.DctoIntegralidad = response.Data.MarcaPorDctoIntegralidad === 'S';
            vm.inspection.PorDctoIntgPlaza = response.Data.PorDctoIntgPlaza ? response.Data.PorDctoIntgPlaza : 0;
          }
        });
    }

    function setInspection(response) {
      vm.inspection.vehicleColor = {};
      vm.inspection.vehicleColor.Codigo = response.vehicleColorId;
      vm.inspectionId = response.inspectionId;
      vm.inspection.vehicleLicensePlate = response.vehicleLicensePlate || vm.requestData.vehicleLicensePlate;
      vm.inspection.vehicleVinNumber = response.vehicleVinNumber;
      vm.inspection.vehicleEngineNumber = response.vehicleEngineNumber;
      vm.inspection.vehicleAmount = response.vehicleAmount;
      vm.inspection.vehicleMileage = +response.vehicleMileage;
      vm.inspection.observations = response.observations;
      vm.inspection.technicalReviewDate = response.technicalReviewDate
        ? moment(response.technicalReviewDate).toDate()
        : null;
      vm.inspection.photos = response.photos;
      vm.accesoriesTitle = response.userOwnerCode === 'APPMAPFRE' ? 'Accesorios Adicionales' : 'Accesorios Musicales';

      if (response.vehicleBrandId) {
        vm.inspection.ModeloMarca = {
          codigoMarca: response.vehicleBrandId,
          codigoModelo: response.vehicleModelId,
          marcaModelo: response.brand + ' ' + response.model,
          nombreMarca: response.brand,
          nombreModelo: response.model,
        };

        vm.inspection.mTipoVehiculo = {
          CodigoTipo: response.vehicleTypeId,
          NombreTipo: response.vehicleType,
        };

        vm.inspection.mVersion = response.vehicleVersion;

        getFunctionsModeloMarca(vm.inspection.ModeloMarca);
        if (response.vehicleSubModelId) {
          vm.inspection.mSubModelo = {
            Codigo: response.vehicleSubModelId,
            Tipo: response.vehicleTypeId,
            NombreTipo: response.vehicleType,
          };

          getFunctionsSubModelo(vm.inspection.mSubModelo);
          if (response.vehicleYear) {
            vm.inspection.mYearFabric = {
              Codigo: String(response.vehicleYear),
            };
            getFuctionsYearFabric(vm.inspection.mYearFabric);
          }
        }
      } else {
        vm.inspection.ModeloMarca = {
          codigoMarca: vm.requestData.vehicleBrandId,
          codigoModelo: vm.requestData.vehicleModelId,
          marcaModelo: vm.requestData.vehicleBrand + ' ' + vm.requestData.vehicleModel,
          nombreMarca: vm.requestData.vehicleBrand,
          nombreModelo: vm.requestData.vehicleModel,
        };
        getFunctionsModeloMarca(vm.inspection.ModeloMarca);
        if (vm.requestData.vehicleSubModelId) {
          vm.inspection.mSubModelo = {
            Codigo: vm.requestData.vehicleSubModelId,
            Tipo: vm.requestData.vehicleTypeId,
            NombreTipo: vm.requestData.vehicleType,
          };

          vm.inspection.mTipoVehiculo = {
            CodigoTipo: vm.requestData.vehicleTypeId,
            NombreTipo: vm.requestData.vehicleType,
          };

          vm.inspection.mVersion = vm.requestData.vehicleVersion;

          getFunctionsSubModelo(vm.inspection.mSubModelo);
          if (vm.requestData.vehicleYear) {
            vm.inspection.mYearFabric = {
              Codigo: String(vm.requestData.vehicleYear),
            };
            getFuctionsYearFabric(vm.inspection.mYearFabric);
          }
        }
      }

      if (response.vehicleSteeringWheelCode) {
        vm.inspection.mTimon = {
          value1: response.vehicleSteeringWheelCode,
        };
      }

      if (response.vehicleWheelDriveId) {
        vm.inspection.mTraccion = {
          parameterId: response.vehicleWheelDriveId,
        };
      }

      if (response.vehicleSteeringWheelId) {
        vm.inspection.mOrigenAuto = {
          parameterId: response.vehicleSteeringWheelId,
        };
      }

      if (response.steeringWheelConditionId) {
        vm.inspection.mEstadoAuto = {
          parameterId: response.steeringWheelConditionId,
        };
      }

      if (vm.inspection.vehicleAmount) {
        vm.inspection.vehicleAmount = vm.inspection.vehicleAmount;
      }

      if (response.items && response.items.length) {
        vm.inspection.mItems = response.items.map(function (item) {
          return {
            mAccessory: {
              parameterId: +item.accesoryId,
              description: item.accesoryName,
            },
            mDescription: item.description,
            mValue: item.price,
          };
        });
      }

      if (response.stereo && response.stereo.length) {
        vm.inspection.mStereo = response.stereo.map(function (item) {
          return {
            mAccessory: {
              accesoryId: item.accesoryId,
              accesoryName: item.accesoryName,
            },
            mDescription: item.description,
            mValue: item.value,
          };
        });
      }
    }

    function queryInspection() {
      return inspecFactory.inspec
        .getInspectionByRiskId(vm.riskId)
        .then(function (response) {
          if (response.inspectionId) {
            setInspection(response);
          }
        })
        .catch(function () {});
    }

    function processPhotos(photos) {
      inspecFactory.common.getPhotoTypeByVehicleTypeAndDeviceType(vm.inspection.mTipoVehiculo.CodigoTipo, 1)
      .then(function (res) {
        vm.vehiclePhotosNumber = res.length || 0;
        vm.carPhotos = res.map(function(item) {
          return {
            image64: item.base64,
            description: item.title,
            nOrder: item.nOrder,
            photoTypeId: item.photoTypeId,
            vehicleTypeId: item.vehicleTypeId,
            imageTemplate: item.base64,
            isImageTemplate: true,
            isImageVehicle: true
          }
        });

        if (photos && photos.length > 0) {
          vm.totalNumberPhotos = photos.length;
          ng.forEach(photos, function (photo) {
            var index2 = _.findIndex(vm.carPhotos, function (carPhoto) {
              return carPhoto.photoTypeId === photo.photoTypeId;
            });

            if (index2 !== -1) {
              vm.carPhotos[index2].locationPath = photo.locationPath;
              vm.carPhotos[index2].image64 = photo.image64;
              vm.carPhotos[index2].sequenceId = photo.sequenceId;
              vm.carPhotos[index2].inspectionId = photo.inspectionId;
              vm.carPhotos[index2].isImageTemplate = false;
            }
          });
        }
      });

      if (photos && photos.length > 0) {
        ng.forEach(photos, function (photo) {
          if (photo.photoTypeId <= 2) {
            var index = _.findIndex(vm.propertyCardPhotos, function (propertyCardPhoto) {
              return propertyCardPhoto.parameterId === photo.photoTypeId;
            });

            if (index !== -1) {
              vm.propertyCardPhotos[index].locationPath = photo.locationPath;
              vm.propertyCardPhotos[index].image64 = photo.image64;
              vm.propertyCardPhotos[index].sequenceId = photo.sequenceId;
              vm.propertyCardPhotos[index].inspectionId = photo.inspectionId;
              vm.propertyCardPhotos[index].isImageTemplate = false;
              vm.propertyCardPhotos[index].isImageVehicle = false;
            }
          } else if (photo.photoTypeId === 8 || photo.photoTypeId === null) {
            vm.aditionalPhotos.push(photo);
          }
        });
      }
    }

    function queryPhotoType() {
      return inspecFactory.common.getPhotoType(true).then(function (response) {
        vm.carPhotos = _.filter(response, function (photo) {
          return photo.value1 === '2';
        });
        vm.propertyCardPhotos = _.filter(response, function (photo) {
          return photo.value1 === '1';
        });
        vm.aditionalPhotos = [];
        processPhotos(vm.inspection.photos);
      });
    }

    function searchMarcaModelo(input) {
      if (input && input.length >= 3) {
        var params = {
          Texto: input.toUpperCase(),
          CodigoTipo: vm.inspection.mTipoVehiculo.CodigoTipo,
        };
        return inspecFactory.vehicle.getListMarcaModelo(params);
      }
    }

    function getFunctionsModeloMarca(value) {
      if (value.codigoMarca === null) {
        vm.inspection.ModeloMarca = null;
        vm.inspection.mSubModelo = null;
        vm.inspection.mYearFabric = null;
      } else {
        vm.inspection.mSubModelo = null;
        vm.inspection.mYearFabric = null;
        vm.canClickAutomas = true;
        if (vm.inspection.mTipoVehiculo) {
          loadSubModelo(vm.inspection.mTipoVehiculo.CodigoTipo, value.codigoMarca, value.codigoModelo);
        }
      }
    }

    function loadSubModelo(codTipoVehiculo, codigoMarca, codigoModelo) {
      if (codTipoVehiculo) {
        inspecFactory.vehicle.getListSubModelo(codTipoVehiculo, codigoMarca, codigoModelo).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.submodels = response.Data;
            vm.noSubmodels = false;
            if (vm.submodels.length === 0) {
              vm.noSubmodels = true;
              mModalAlert.showError('El vehiculo ingresado no esta configurado para cotizar', 'Error');
            } else {
              vm.inspection.mSubModelo = vm.submodels[0];
              getFunctionsSubModelo(vm.submodels[0]);
            }
          } else if (response.Message.length > 0) {
            vm.noSubmodels = true;
          }
        });
      }
    }

    function getFunctionsSubModelo(value) {
      if (!ng.isUndefined(value)) {
        if (value.Codigo === null) {
          vm.inspection.mYearFabric = null;
          vm.inspection.yearSelected = false;
        } else {
          vm.inspection.subModeloSelected = true;

          vm.inspection.NombreTipo = value.NombreTipo;
          vm.inspection.Tipo = value.Tipo;

          loadYearFabric(
            vm.inspection.ModeloMarca.codigoMarca,
            vm.inspection.ModeloMarca.codigoModelo,
            vm.inspection.mSubModelo.Codigo
          );
          vm.valorVehiculoMin = 0;
          vm.valorVehiculoMax = 0;
          if (vm.inspection.Tipo) {
            getStereoAccessories(vm.inspection.Tipo);
          }
        }
      }
    }

    function loadYearFabric(codigoMarca, codigoModelo, codigoSubModelo) {
      inspecFactory.vehicle.getListAnoFabricacion(codigoMarca, codigoModelo, codigoSubModelo).then(function (response) {
        if (response.OperationCode == constants.operationCode.success) {
          vm.years = response.Data;
          vm.noYear = false;
          if (vm.years.length == 0) {
            vm.noYear = true;
          }
        } else if (response.Message.length > 0) {
          vm.noYear = true;
        }
      });
    }

    function getFuctionsYearFabric(value) {
      if (value != null || !ng.isUndefined(value)) {
        if (value && value.Codigo == null) {
          vm.inspection.yearSelected = false;
        } else {
          vm.inspection.yearSelected = true;
          if (!vm.inspection.mYearFabric) {
            vm.inspection.mYearFabric = undefined;
          } else {
            if (vm.inspection.mSubModelo && vm.inspection.mSubModelo.Codigo) {
              loadValorSugerido(
                vm.inspection.ModeloMarca.codigoMarca,
                vm.inspection.ModeloMarca.codigoModelo,
                vm.inspection.mSubModelo.Codigo,
                vm.inspection.mTipoVehiculo.CodigoTipo,
                vm.inspection.mYearFabric.Codigo
              );
            }
          }
        }
      } else {
        vm.inspection.yearSelected = false;
      }
    }

    function loadValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo , tipoVehiculo, Anio) {
      inspecFactory.vehicle.getValorSugerido(codigoMarca, codigoModelo, SubModeloCodigo , tipoVehiculo, Anio).then(
        function (response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.inspection.vehicleAmount = vm.inspection.vehicleAmount || response.Data.Valor;
            vm.valorVehiculoMin = response.Data.Minimo;
            vm.valorVehiculoMax = response.Data.Maximo;
          }
        },
        function (error) {
          $log.log('Error en loadValorSugerido: ' + error);
        }
      );
    }

    function getWheelDrive() {
      return inspecFactory.common.getWheelDrive(true).then(function (response) {
        vm.tractions = response;
      });
    }

    function getVehicleOrigin() {
      return inspecFactory.common.getVehicleOrigin(true).then(function (response) {
        vm.origins = response;
      });
    }

    function getListColor() {
      return inspecFactory.vehicle.getListColor(true).then(function (response) {
        vm.colors = response;
      });
    }

    function getStereoAccessories(vehicleType) {
      return inspecFactory.common.getStereo(vehicleType).then(function (response) {
        vm.stereoAccessories = response;
      });
    }

    function getVehicleAccessories() {
      return inspecFactory.common.getAccesories(true).then(function (response) {
        vm.vehicleAccessories = response;
      });
    }

    function getVehicleStatus() {
      return inspecFactory.common.getVehicleStatus(true).then(function (response) {
        vm.vehicleStatuses = response;
      });
    }

    function getSteeringWheel() {
      return inspecFactory.common.getSteeringWheel(true).then(function (response) {
        vm.steeringWheels = response;
      });
    }

    function getInfoByLicensePlate() {
      inspecFactory.vehicle.getInfoByLicensePlate(vm.inspection.mPlaca).then(function (response) {
        $log.log('response', response);
      });
    }

    function showAutomas() {
      var brand = vm.inspection.ModeloMarca.nombreMarca;
      var model = vm.inspection.ModeloMarca.nombreModelo;
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/components/inspecciones/registro-inspeccion/modal-automas.html',
          controllerAs: '$ctrl',
          controller: [
            '$location',
            '$uibModalInstance',
            function ($location, $uibModalInstance) {
              var vm = this;
              vm.$onInit = onInit;
              vm.closeModal = closeModal;
              vm.showAutomasVerMas = showAutomasVerMas;
              vm.hideAutomasVerMas = hideAutomasVerMas;

              function onInit() {
                vm.mMarca = brand;
                vm.mModel = model;
                vm.pagination = {
                  currentPage: 1,
                  pageSize: 10,
                  totalRecords: 0,
                };

                inspecFactory.management
                  .automasMongoSearchByName(brand, model, vm.pagination.pageSize, vm.pagination.currentPage, true)
                  .then(function (response) {
                    vm.items = response.data.data;
                    vm.pagination.currentPage = 1;
                    vm.pagination.totalItems = response.total;
                    vm.firstRequestCompleted = true;
                  });
              }

              function showAutomasVerMas(item) {
                vm.showMore = true;
                vm.currentBrand = item.brand;
                vm.currentModel = item.model;
                vm.details = item.items;
              }

              function hideAutomasVerMas() {
                vm.showMore = false;
              }

              function closeModal() {
                $uibModalInstance.close();
              }
            },
          ],
        })
        .result.then(
          function () {
            //  todo
          },
          function () {
            //  todo
          }
        );
    }

    function showObservationModal() {
      var inspectionId = vm.inspectionId;
      $uibModal
        .open({
          backdrop: true,
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl: '/inspec/app/components/inspecciones/registro-inspeccion/modal-observation.html',
          controllerAs: '$ctrl',
          controller: [
            '$location',
            '$uibModalInstance',
            function ($location, $uibModalInstance) {
              var vm = this;
              vm.$onInit = onInit;
              vm.closeModal = closeModal;
              vm.addObservation = addObservation;
              function onInit() {}

              function closeModal() {
                $uibModalInstance.close();
              }

              function addObservation() {
                vm.frmObservation.markAsPristine();
                if (vm.frmObservation.$valid) {
                  inspecFactory.inspec
                    .addObservation(inspectionId, vm.frmObservation.mObsevaciones)
                    .then(function (res) {
                      $uibModalInstance.close();
                      loadObservations();
                      mModalAlert.showSuccess('Presione el botón guardar para continuar con la solicitud', '');
                    })
                    .catch(function (err) {
                      console.error(err);
                    });
                }
              }
            },
          ],
        })
        .result.then(
          function () {
            //  todo
          },
          function () {
            //  todo
          }
        );
    }

    function saveInspection2() {
      setValues();
      if (vm.inspection.mSubModelo && vm.inspection.mSubModelo.Codigo) {
        inspecFactory.inspec.saveInspection(vm.inspection, true).then(function (response) {
          if (response) {
            mModalAlert.showSuccess('Inspección guardada correctamente', '').then(function () {
              vm.inspectionId = response.inspectionId;
              vm.hasBeenModified = false;
              vm.inspection.riskStatusCode = response.riskStatusCode;
              if (!vm.finished) {
                vm.inspection.riskStatus =
                  response.riskStatusCode === '4'
                    ? 'EN PROCESO DE INSPECCIÓN'
                    : response.riskStatusCode === '5'
                    ? 'EN EVALUACIÓN'
                    : response.riskStatusCode === '8'
                    ? 'AUTOINSPECCIÓN PROGRAMADA'
                    : null;
              }
              vm.inspection.approved = false;
              vm.inspection.isForEvaluation = response.riskStatusCode === '5';
              setNewOriginal();
              $state.go('solicitudes');
            });
          }
        });
      }
    }

    function saveInspection() {
      if(seValidaListaNegra()) {
        validarListNegra();
      } else {
        saveInspection2();
      }
    }

    function seValidaListaNegra() {
      return (vm.esEjecutivo || vm.esAgente || vm.esCorredor);
    }

    function validarListNegra() {
      var reqLN = [];

      if(vm.inspection.vehicleLicensePlate) {reqLN.push({ "tipo": "NUM_MATRICULA", "valor": vm.inspection.vehicleLicensePlate})};
      if(vm.inspection.vehicleVinNumber) {reqLN.push({ "tipo": "NUM_SERIE", "valor": vm.inspection.vehicleVinNumber})};
      if(vm.inspection.vehicleEngineNumber) {reqLN.push({ "tipo": "NUM_MOTOR", "valor": vm.inspection.vehicleEngineNumber})};

      if(reqLN.length == 0) {
        saveInspection2();
        return;
      }

      inspecFactory.blackList.ValidBlackList(reqLN, true).then(function(response) {
        var datosLN = [];
        
        if(response.OperationCode === constants.operationCode.success) {
          var msg = "";

          response.Data.forEach(function(element) {
            if(element.Resultado) {
              var elemetLN = {
                codAplicacion: personConstants.aplications.INSPECCIONES,
                numCotizacion: vm.requestId,
                tipoProceso: 'SOLICITUD_REGISTRO_INSPECCION',
                tipoDato: element.Tipo,
                valorDato: element.Valor
              };

              datosLN.push(elemetLN);
              var msgComun = "est&aacute; en la tabla de Cliente/Unidad inelegible por estudios t&eacute;cnicos.";
              switch(element.Tipo) {
                case "NUM_MATRICULA": { msg += "El n&uacute;mero placa " + msgComun +"<br/>"; }; break;
                case "NUM_MOTOR": { msg += "El n&uacute;mero motor " + msgComun +"<br/>"; }; break;
                case "NUM_SERIE": { msg += "El n&uacute;mero chasis " + msgComun +"<br/>"; }; break;
                default: "";
              }
            }
          });

          if(msg === "") {
            saveInspection2();
          } else {
            var fullMsg = msg;

            if(vm.esEjecutivo) {
              mModalAlert.showError(fullMsg, 'Error');
            } else {
              confirmarListaNegra(datosLN);
            }
          }
        }
      });
    }

    function confirmarListaNegra(datosLN) {
      mModalConfirm.confirmError('Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA INSPECCI&Oacute;N?', '', 'SI', undefined, 'NO')
      .then(function(ok) {
        if(ok) {
          datosLN.forEach(function(element) {
            element.aceptaAdvertencia = true;
            inspecFactory.blackList.saveAuditBlackList(element).then();  
          });

          saveInspection2();
        } 
      });
    }

    function setValues() {
      if (vm.inspection.ModeloMarca) {
        vm.inspection.brand = vm.inspection.ModeloMarca.nombreMarca;
        vm.inspection.model = vm.inspection.ModeloMarca.nombreModelo;
        vm.inspection.vehicleBrandId = +vm.inspection.ModeloMarca.codigoMarca;
        vm.inspection.vehicleModelId = +vm.inspection.ModeloMarca.codigoModelo;
      }

      if (vm.inspection.mSubModelo && vm.inspection.mSubModelo.Codigo) {
        vm.inspection.subModel = vm.inspection.mSubModelo.Descripcion;
        vm.inspection.vehicleSubModelId = +vm.inspection.mSubModelo.Codigo;
        vm.inspection.vehicleTypeId = +vm.inspection.mSubModelo.Tipo;
      }

      if (vm.inspection.mYearFabric && vm.inspection.mYearFabric.Codigo) {
        vm.inspection.vehicleYear = +vm.inspection.mYearFabric.Codigo;
        vm.inspection.vehicleYear = +vm.inspection.mYearFabric.Codigo;
      }

      if (vm.inspection.mTimon && vm.inspection.mTimon.value1) {
        vm.inspection.vehicleSteeringWheelCode = vm.inspection.mTimon.value1;
      }

      if (vm.inspection.mTraccion.parameterId) {
        vm.inspection.vehicleWheelDriveId = +vm.inspection.mTraccion.parameterId;
      }

      if (vm.inspection.mOrigenAuto.parameterId) {
        vm.inspection.vehicleSteeringWheelId = +vm.inspection.mOrigenAuto.parameterId;
      }

      if (vm.inspection.mEstadoAuto.parameterId) {
        vm.inspection.steeringWheelConditionId = +vm.inspection.mEstadoAuto.parameterId;
      }

      if (vm.inspection.vehicleAmount) {
        vm.inspection.vehicleAmount = vm.inspection.vehicleAmount;
      }

      if (vm.inspection.vehicleColor) {
        vm.inspection.vehicleColorId = vm.inspection.vehicleColor.Codigo;
      }

      if (vm.inspection.mItems.length) {
        vm.inspection.items = vm.inspection.mItems.map(function (item) {
          return {
            accesoryId: item.mAccessory.parameterId,
            accesoryName: item.mAccessory.description,
            description: item.mDescription,
            price: item.mValue,
            value: 'S',
          };
        });
      }
      if (vm.inspection.mStereo.length) {
        vm.inspection.stereo = vm.inspection.mStereo.map(function (item) {
          return {
            accesoryId: item.mAccessory.accesoryId,
            accesoryName: item.mAccessory.accesoryName,
            description: item.mDescription,
            value: item.mValue,
          };
        });
      }
      vm.inspection.tronMinVehiclePrice = vm.valorVehiculoMin;
      vm.inspection.tronMaxVehiclePrice = vm.valorVehiculoMax;
      if (!vm.inspection.isForEvaluation && vm.inspection.riskStatusCode === '5') {
        vm.inspection.approved = true;
      } else {
        vm.inspection.approved = false;
      }

      vm.inspection.vehicleVersion = vm.inspection.mVersion ? vm.inspection.mVersion.toUpperCase() : '';
      vm.inspection.mVersion = vm.inspection.mVersion ? vm.inspection.mVersion.toUpperCase() : '';
    } //end setValues

    function setNewOriginal() {
      mpSpin.end();
      vm.originalInspection = ng.copy(vm.inspection);
    }

    function endInspection() {
      if (vm.inspection.vehicleAmount == 0) {
        return void 0;
      }
      setValues();
      vm.formData.markAsPristine();
      if (vm.formData.$valid && vm.inspection.mSubModelo && (vm.inspection.vehicleAmount >= vm.valorVehiculoMin && vm.inspection.vehicleAmount <= vm.valorVehiculoMax)) {
        var pcpRequired = _.filter(vm.propertyCardPhotos, function (photo) {
          return photo.image64 || photo.name;
        });
        var pcRequired = _.filter(vm.carPhotos, function (photo) {
          return photo.image64 || photo.name;
        });
        var validPhotosLength = pcpRequired.length + pcRequired.length;

        if (validPhotosLength !== vm.vehiclePhotosNumber + 2 && !vm.inspection.isAnotherInsurer) {
          mModalAlert.showError('No se han adjuntado las fotos necesarias', '');
        } else {
          var pms = inspecFactory.inspec.endInspection(vm.inspection, true);
          pms
            .then(function (response) {
              if (response) {
                vm.inspection.inspectionId = !vm.inspection.inspectionId
                  ? response.inspectionId
                  : vm.inspection.inspectionId;
                loadOtherDetails();
                vm.hasBeenModified = false;
                if (response.isValidToEmit) {
                  mModalConfirm
                    .confirmInfo(
                      'Inspección finalizada correctamente. <br /> ¿Desea emitir una poliza de forma automática?',
                      ''
                    )
                    .then(
                      function (response) {
                        if (response == true) calculatePremium();
                      },
                      function (dismiss) {
                        if (dismiss === 'cancel' || dismiss === 'close') $state.go('solicitudes');
                      }
                    );
                } else $state.go('solicitudes');
              }
            })
            .catch(function (e) {
              ErrorHandlerService.handleError(e);
            });
        }
      } else {
        mModalAlert.showError('No se han llenado todos los datos del vehiculo', '');
        vm.activeTab = 1;
      }
    }

    vm.getPickup = getPickup;
    function getPickup() {
      var vResult = 'N';
      if (vm.otherDetails.codtipovehiculo == '6' || vm.otherDetails.codtipovehiculo == '7') {
        vResult = 'S';
      }
      return vResult;
    }

    function _fnAutoEmit() {
      var today = new Date();
      var end = new Date();
      vm.hasBeenModified = false;
      end.setFullYear(today.getFullYear() + vm.flagAnual);

      vm.params = {
        systemCode: oimAbstractFactory.getOrigin(),
        PorDctoIntgPlaza: vm.inspection.PorDctoIntgPlaza || 0,
        MarcaPorDctoIntegralidad: vm.inspection.DctoIntegralidad ? 'S' : 'N',
        NumeroSolicitud: vm.requestId,
        PrimaPactada: '',
        ScoreContratante: -1,
        FlgCheckAsegurado: 'SI',
        CodigoCompania: constants.module.polizas.autos.companyCode,
        CodigoTipoEntidad: 1,
        TipoEmision: 7,
        ModalidadEmision: 'I',
        MCAEndosatario: 'N',
        MCAInformeInspeccion: 'N',
        MCAInspeccionPrevia: 'S',
        McaOtraAseguradora: vm.inspection.isAnotherInsurer,
        SNEmite: 'S',
        Poliza: {
          CodigoFinanciamiento: vm.inspection.financeTypeId.toString(),
          ModalidadPrimeraCuota: 'IND',
          CodigoCompania: constants.module.polizas.autos.companyCode,
          CodigoRamo: constants.module.polizas.autos.codeRamo,
          MCAModalidad: 'N',
          InicioVigencia: filterDate(today, formatDate),
          FinVigencia: filterDate(end, formatDate),
          PolizaGrupo: '',
        },
        Contratante: {
          Nombre: vm.inspection.name,
          ApellidoPaterno: vm.inspection.lastName,
          ApellidoMaterno: vm.inspection.lastMotherName,
          FechaNacimiento: filterDate(vm.inspection.birthDate, formatDate),
          TipoDocumento: vm.inspection.documentTypeCode,
          CodigoDocumento: vm.inspection.documentNumber,
          Sexo: vm.inspection.sexCode,
          Telefono: !vm.inspection.phone ? '' : vm.inspection.phone,
          Telefono2: !vm.inspection.cellPhone ? '' : vm.inspection.cellPhone,
          CorreoElectronico: vm.inspection.personalEmail,
          MCAMapfreDolar: vm.inspection.contractorMapfreDollar == 0 ? 'N' : 'S',
          MCAFisico: 'S',
          ImporteAplicarMapfreDolar: vm.inspection.contractorMapfreDollar,
          Profesion: {
            Codigo: !vm.inspection.professionId ? 0 : vm.inspection.professionId.toString(),
          },
          ActividadEconomica: {
            Codigo: !vm.otherDetails.actividadeconomica ? '' : vm.otherDetails.actividadeconomica,
          },
          Ubigeo: {
            CodigoNumero: vm.otherDetails.codnumero,
            TextoNumero: !vm.otherDetails.textnumero ? '' : vm.otherDetails.textnumero,
            CodigoInterior: !vm.otherDetails.codinterior ? '' : vm.otherDetails.codinterior.toString(),
            TextoInterior: !vm.otherDetails.textinterior ? '' : vm.otherDetails.textinterior,
            CodigoZona: '',
            TextoZona: '',
            Referencia: !vm.otherDetails.referencia ? '' : vm.otherDetails.referencia.toString(),
            CodigoDepartamento: !vm.inspection.departmentId ? '' : vm.inspection.departmentId.toString(),
            CodigoProvincia: !vm.inspection.provinceId ? '' : vm.inspection.provinceId.toString(),
            CodigoDistrito: !vm.inspection.districtId ? '' : vm.inspection.districtId.toString(),
            CodigoVia: !vm.otherDetails.codvia ? '' : vm.otherDetails.codvia.toString(),
          },
          Direccion: !vm.otherDetails.direccion ? '' : vm.otherDetails.direccion.toString(),
        },
        Endosatario: {
          CodigoEndosatario: '',
          TipoDocumento: '',
          CodigoDocumento: '',
          SumaEndosatario: 0,
        },
        Documento: {
          NumeroAnterior: '',
          NumeroTicket: '',
          CodigoEstado: '1',
          CodigoUsuario: vm.inspection.contractorAgentOwnerId,
          CodigoUsuarioRED: constants.module.polizas.autos.networkUser,
          CodigoProducto: !vm.otherDetails.codproducto ? '' : vm.otherDetails.codproducto,
          FlagDocumento: '',
          CodigoProceso: '2',
          CodigoAgente: vm.profile.codagent,
          McaAsegNuevo: 'N',
          NombreDocumento: '',
          RutaDocumento: '',
          MontoPrima: vm.totalPremium,
          CodigoMoneda: constants.currencyType.dollar.code,
          NumeroPlaca: '',
          MarcaAsistencia: '',
          Ubigeo: {
            CodigoDepartamento: '',
            CodigoProvincia: '',
            CodigoDistrito: '',
          },
        },
      };

      vm.params.Vehiculo = {
        CodigoTipo: vm.inspection.vehicleTypeId.toString(),
        NumeroChasis: vm.inspection.vehicleVinNumber,
        NumeroMotor: vm.inspection.vehicleEngineNumber,
        ZonaTarifa: '',
        CodigoMoneda: constants.currencyType.dollar.code,
        CodigoColor: vm.inspection.vehicleColor.Codigo,
        NumeroPlaca: vm.inspection.vehicleLicensePlate,
        MCANUEVO: 'N',
        MCAGPS: vm.gps,
        PolizaGrupo: !vm.otherDetails.polizagrupo ? '' : vm.otherDetails.polizagrupo,
        ProductoVehiculo: {
          CodigoProducto: vm.otherDetails.codproducto,
          CodigoMoneda: constants.currencyType.dollar.code,
        },
        CodTipoFrecUso: '',
        CodAnioLicencia: '',
        CodGuardaGaraje: 'N',
        CodConductorUnico: 'N',
        CodEventoUltimosAnios: '',
        CodTipoUsoVehiculo: '',
        DesTipoFrecUso: '',
        DesAnioLicencia: '',
        DesEventoUltimosAnios: '',
        DesTipoUsoVehiculo: '',
        Version: vm.inspection.mVersion ? vm.inspection.mVersion : '',
      };

      vm.params.Inspector = {
        Nombre: !vm.inspector ? '' : vm.inspector.nombre,
        ApellidoPaterno: !vm.inspector ? '' : vm.inspector.apellidopaterno,
        Telefono: !vm.inspector ? '' : vm.inspector.telefono,
        Telefono2: !vm.inspector ? '' : vm.inspector.telefono2,
        Observacion: !vm.inspector ? '' : vm.inspector.observaciones,
      };

      vm.params.Inspeccion = {
        NumeroInspeccionTRON: vm.inspection.inspectionId == null ? '' : vm.inspection.inspectionId,
        FlagAccMusical: 'N',
        CadenaAccesoriosCodigo: '',
        CadenaAccesoriosValor: '',
      };
      vm.params.Cotizacion = {
        CodigoCompania: constants.module.polizas.autos.companyCode,
        CodigoTipoEntidad: '1',
        CodigoCorredor: vm.profile.codagent,
        numeroInspeccion: vm.inspection.inspectionId == null ? '' : vm.inspection.inspectionId,
        mcaInspeccionPrevia: 'S',
        DocumentosAsociados: [
          {
            CodigoEstado: '1',
            CodigoUsuarioRED: constants.module.polizas.autos.networkUser,
            CodigoUsuario: vm.profile.username,
            CodigoProceso: '1',
            CodigoProducto: vm.otherDetails.codproducto,
            CodigoAgente: vm.inspection.contractorAgentOwnerId,
            MarcaAsistencia: 'N',
            FlgAplicaDsctoComision: 'N',
            DsctoComercial: '0',
            DsctoPorComision: vm.discountCommission,
            TotalDscto: 0,
            TuComision: 0,
            MontoPrima: vm.totalPremium,
            PrimaNeta: vm.netPremium,
            Ubigeo: {
              CodigoDepartamento: !vm.inspection.inspectionDepartmentId
                ? ''
                : vm.inspection.inspectionDepartmentId.toString(),
              CodigoProvincia: !vm.inspection.inspectionProvinceId ? '' : vm.inspection.inspectionProvinceId.toString(),
              CodigoDistrito: !vm.inspection.inspectionDistrictId ? '' : vm.inspection.inspectionDistrictId.toString(),
            },
          },
        ],
        Vehiculo: {
          AnioFabricacion: vm.otherDetails.aniovehiculo.toString(),
          CodigoCategoria: '2',
          CodigoMarca: vm.otherDetails.codmarcavehiculo.toString(),
          CodigoModelo: vm.otherDetails.codmodelovehiculo.toString(),
          CodigoSubModelo: vm.otherDetails.submodelovehiculo.toString(),
          CodigoTipo: vm.inspection.vehicleTypeId.toString(),
          CodigoUso: '8',
          DsctoComercial: 0,
          NombreMarca: vm.otherDetails.marcavehiculo.toString(),
          NombreModelo: vm.otherDetails.modelovehiculo.toString(),
          MCAGPS: vm.gps,
          MCANUEVO: 'N',
          MCAPICKUP: vm.getPickup(),
          NombreTipo: vm.otherDetails.tipovehiculo,
          MCAREQUIEREGPS: vm.gps,
          PolizaGrupo: '',
          SumaAsegurada: vm.sumaAsegurada,
          TipoVolante: vm.inspection.mTimon ? vm.inspection.mTimon.value1 : null,
          ZonaTarifa: '',
          ProductoVehiculo: {
            CodigoProducto: vm.otherDetails.codproducto,
          },
        },
        Contratante: {
          Nombre: !vm.inspection.name ? '' : vm.inspection.name.toString(),
          ApellidoPaterno: !vm.inspection.lastName ? '' : vm.inspection.lastName.toString(),
          MCAMapfreDolar: vm.inspection.contractorMapfreDollar == 0 ? 'N' : 'S',
          ImporteMapfreDolar: vm.inspection.contractorMapfreDollar,
          Ubigeo: {
            CodigoDepartamento: !vm.inspection.inspectionDepartmentId
              ? ''
              : vm.inspection.inspectionDepartmentId.toString(),
            CodigoProvincia: !vm.inspection.inspectionProvinceId ? '' : vm.inspection.inspectionProvinceId.toString(),
            CodigoDistrito: !vm.inspection.inspectionDistrictId ? '' : vm.inspection.inspectionDistrictId.toString(),
          },
        },
      };

      vm.params.AseguradoAutos_2 = {
        Nombre: vm.inspection.name,
        ApellidoPaterno: vm.inspection.lastName,
        ApellidoMaterno: vm.inspection.lastMotherName,
        FechaNacimiento: filterDate(vm.inspection.birthDate, formatDate),
        TipoDocumento: vm.inspection.documentTypeCode,
        CodigoDocumento: vm.inspection.documentNumber,
        Sexo: vm.inspection.sexCode,
        Telefono: !vm.inspection.phone ? '' : vm.inspection.phone,
        Telefono2: !vm.inspection.cellPhone ? '' : vm.inspection.cellPhone,
        CorreoElectronico: vm.inspection.personalEmail,
        MCAMapfreDolar: vm.inspection.contractorMapfreDollar == 0 ? 'N' : 'S',
        MCAFisico: 'S',
        ImporteAplicarMapfreDolar: vm.inspection.contractorMapfreDollar,
        Profesion: {
          Codigo: !vm.inspection.professionId ? '0' : vm.inspection.professionId.toString(),
        },
        ActividadEconomica: {
          Codigo: !vm.otherDetails.actividadeconomica ? '' : vm.otherDetails.actividadeconomica,
        },
        Ubigeo: {
          CodigoNumero: !vm.otherDetails.codnumero ? '' : vm.otherDetails.codnumero.toString(),
          TextoNumero: !vm.otherDetails.textnumero ? '' : vm.otherDetails.textnumero,
          CodigoInterior: !vm.otherDetails.codinterior ? '' : vm.otherDetails.codinterior.toString(),
          TextoInterior: !vm.otherDetails.textinterior ? '' : vm.otherDetails.textinterior,
          CodigoZona: !vm.otherDetails.codzona ? '' : vm.otherDetails.codzona.toString(),
          TextoZona: !vm.otherDetails.textzona ? '' : vm.otherDetails.textzona,
          Referencia: !vm.otherDetails.referencia ? '' : vm.otherDetails.referencia,
          CodigoDepartamento: !vm.otherDetails.coddepartamento ? '' : vm.otherDetails.coddepartamento.toString(),
          CodigoProvincia: !vm.otherDetails.codprovincia ? '' : vm.otherDetails.codprovincia.toString(),
          CodigoDistrito: !vm.otherDetails.codprovincia ? '' : vm.otherDetails.codprovincia.toString(),
          CodigoVia: !vm.otherDetails.codvia ? '' : vm.otherDetails.codvia.toString(),
        },
        Direccion: !vm.otherDetails.direccion ? '' : vm.otherDetails.direccion.toString(),
      };
      var pms = inspecFactory.inspec.grabarEmisionConInspeccion(vm.params, true);
      pms
        .then(function (response) {
          if (response.OperationCode == 200) {
            mModalAlert.showSuccess(response.Message, '');
            $state.go('solicitudes');
          } else {
            mModalAlert.showWarning(response.Message, '');
            return false;
          }
        })
        .catch(function (e) {
          ErrorHandlerService.handleError(e);
        });
      $state.go('solicitudes');
    } //end fnAutoEmit

    function calculatePremium() {
      var paramsCalculatePremium = {
        AutoConInspeccion: 'S',
        numeroCotizacion: '',
        CodigoCorredor: vm.profile.codagent,
        TotalDsctoComision: 0,
        DsctoComision: 0,
        Vehiculo: {
          CodigoTipo: vm.otherDetails.codtipovehiculo,
          CodigoMarca: vm.otherDetails.codmarcavehiculo,
          CodigoModelo: vm.otherDetails.codmodelovehiculo,
          CodigoSubModelo: vm.otherDetails.submodelovehiculo,
          CodigoUso: 8,
          CodigoProducto: vm.otherDetails.codproducto,
          DsctoComercial: 0,
          AnioFabricacion: vm.otherDetails.aniovehiculo,
          SumaAsegurada: !vm.inspection.vehicleAmount ? 0 : vm.inspection.vehicleAmount,
          TipoVolante: vm.otherDetails.volantevehiculo,
          MCAGPS: vm.gps,
          MCANUEVO: 'N',
          PolizaGrupo: !vm.otherDetails.polizagrupo ? '' : vm.otherDetails.polizagrupo,
          ProductoVehiculo: {
            CodigoModalidad: vm.modality,
            CodigoCompania: constants.module.polizas.autos.companyCode,
            CodigoRamo: constants.module.polizas.autos.codeRamo,
          },
          CodTipoFrecUso: '',
          CodAnioLicencia: vm.otherDetails.aniovehiculo,
          CodGuardaGaraje: 'N',
          CodConductorUnico: 'S',
          CodEventoUltimosAnios: 'N',
          CodTipoUsoVehiculo: vm.otherDetails.codtipovehiculo,
          DesTipoFrecUso: '',
          DesAnioLicencia: '',
          DesEventoUltimosAnios: '',
          DesTipoUsoVehiculo: '',
        },
        Contratante: {
          MCAMapfreDolar: 'N',
          ImporteMapfreDolar: 0,
        },
        Ubigeo: {
          CodigoProvincia: vm.otherDetails.codprovincia,
          CodigoDistrito: vm.otherDetails.coddistrito,
        },
      };
      var pmsC = inspecFactory.common.getCalculatePremium(paramsCalculatePremium, true);
      pmsC
        .then(function (response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.netPremium = response.Data.Vehiculo.PrimaVehicular;
            vm.netPremiumReal = response.Data.Vehiculo.PrimaVehicularReal;
            vm.emissionValuePercent = response.Data.PorDerechoEmision / 100;
            vm.sumaAsegurada = response.Data.Vehiculo.SumaAsegurada;
            _calculatePremium();
            _fnAutoEmit();
          } else {
            mModalAlert.showWarning(response.Message, 'Error BD');
          }
        })
        .catch(function (e) {
          ErrorHandlerService.handleError(e);
        });
    }

    vm.calculateDiscountCommission = calculateDiscountCommission;
    calculateDiscountCommission();
    function calculateDiscountCommission(discountCommission) {
      if (typeof discountCommission == 'undefined' || discountCommission.AgenteComision == null) {
        vm.discountCommission = 0.0;
      } else {
        var discountCommissionPercent = vm.Math.abs(discountCommission.DsctoEspecial) / 100;
        vm.discountCommission = roundTwoDecimals(vm.netPremium * discountCommissionPercent);
      }
      _calculatePremium();
    }

    function roundTwoDecimals(num) {
      return +(Math.round(num + 'e+2') + 'e-2');
    }

    function _calculatePremium() {
      var netPremium = vm.netPremium - vm.discountCommission;
      vm.emissionValue = roundTwoDecimals(netPremium * vm.emissionValuePercent);
      vm.commercialPremium = roundTwoDecimals(vm.netPremium);
      vm.igv = roundTwoDecimals((netPremium + vm.emissionValue) * 0.18);
      vm.totalPremium = roundTwoDecimals(netPremium + vm.emissionValue + vm.igv);
    }

    function loadMarca() {
      vm.inspection.ModeloMarca = null;
      vm.inspection.mSubModelo = null;
      vm.inspection.mYearFabric = null;
      vm.inspection.vehicleAmount = null;
    }
    function obtenerDctontegralidad() {
      if (vm.inspection.DctoIntegralidad) {
        proxyGeneral
          .ObtenerDescuentoIntegralidad(
            constants.module.polizas.autos.companyCode,
            vm.profile.codagent,
            constants.module.polizas.autos.codeRamo,
            vm.inspection.documentTypeCode,
            vm.inspection.documentNumber,
            true
          )
          .then(function (response) {
            if (response.OperationCode === constants.operationCode.success) {
              vm.inspection.PorDctoIntgPlaza = response.Data;
            }
          })
          .catch(function (error) {
            console.log('Error en obtenerDctontegralidad: ' + error);
          });
      }
    }

    function loadObservations() {
      inspecFactory.inspec
        .getObservations(vm.inspectionId)
        .then(function (res) {
          vm.observationsList = res;
          vm.isPeritoObservation = vm.observationsList.length ? vm.observationsList[0].images.length === 0 : false;
          vm.lastObservationStatus = vm.observationsList.length ? vm.observationsList[0].status : vm.observationStatus.none;
          vm.currentObservationStatus = getObservationStatus(vm.observationStatus, vm.lastObservationStatus);
          vm.inspection.observationStatus = vm.lastObservationStatus;
          shouldShowEndBtn();
        })
        .catch(function (err) {
          console.error(err);
        });
    }

    function downloadPDF() {
      inspecFactory.requests.getDocumentFromAnotherInsurer(vm.requestId, vm.riskId)
    }

    function resolveObservations() {
      mModalConfirm
        .confirmInfo('', '¿Estás seguro de marcar como resuelta la observación?', 'Aceptar')
        .then(function () {
          inspecFactory.inspec
            .resolveObservation(vm.riskId, vm.inspectionId)
            .then(function () {
              vm.loadObservations();
              vm.isPeritoObservation = false;
            })
            .catch(function (err) {
              console.error(err);
            });
        });
    }

    function getObservationStatus(obj, status) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === status) {
            return key;
          }
        }
      }
    }

    function shouldAddObservation() {
      return vm.inspection && vm.inspection.isAutoInspection && (
        vm.lastObservationStatus === vm.observationStatus.Resuelto ||
        vm.lastObservationStatus === vm.observationStatus.none
      );
    }

    function shouldShowEndBtn() {
      vm.showEndBtn = vm.inspection
        ? vm.inspection.isAutoInspection ? shouldAddObservation() : true
        : false;
    }

    $scope.$watch(
      '$ctrl.inspection',
      function (newValue, oldValue) {
        if (newValue && oldValue && vm.firstRequestCompleted) {
          vm.hasBeenModified = !ng.equals(newValue, oldValue) && !ng.equals(newValue, vm.originalInspection);
        }
      },
      true
    );
  }

  return ng
    .module('appInspec')
    .controller('RegistroInspeccionController', registroInspeccionController)
    .component('inspecRegistroInspeccion', {
      templateUrl: '/inspec/app/components/inspecciones/registro-inspeccion/registro-inspeccion.html',
      controller: 'RegistroInspeccionController',
      controllerAs: '$ctrl',
    })
    .directive('photoViewer', [
      '$timeout',
      function ($timeout) {
        return {
          restrict: 'A',
          link: function ($scope, iElm, iAttrs, controller) {
            var arrowTimeout = $timeout(function () {
              return iElm.querySelectorAll('.array-foto-box')[0];
            }, 300);
            arrowTimeout.then(function (d) {
              $scope.scrollPhotosRight = function () {
                d.scrollLeft += 500;
              };
              $scope.scrollPhotosLeft = function () {
                d.scrollLeft -= 500;
              };
            });
          },
        };
      },
    ]);
});
