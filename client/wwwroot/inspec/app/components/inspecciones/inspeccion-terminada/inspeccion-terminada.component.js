'use strict';

define(['angular', 'moment', 'constants'], function(ng, moment, constants) {
  inspeccionTerminadaController.$inject = [
    '$stateParams',
    '$q',
    'inspecFactory',
    '$filter',
    'UserService',
    '$window',
    'ErrorHandlerService'
  ];

  function inspeccionTerminadaController(
    $stateParams,
    $q,
    inspecFactory,
    $filter,
    UserService,
    $window,
    ErrorHandlerService
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.emitPolize = emitPolize;
    vm.downloadPDF = downloadPDF;

    function onInit() {
      vm.requestId = $stateParams.requestId;
      vm.riskId = $stateParams.riskId;
      vm.inspectionId = $stateParams.inspectionId;
      queryRequest();
    }

    function queryRequest() {
      return inspecFactory.requests.getRequestById(vm.requestId, vm.riskId, true).then(function(response) {
        vm.request = response;
        if (vm.request.quotationId) {
          inspecFactory.quotations
            .getQuotationsByNumber('1-' + vm.request.quotationId + '-301', true)
            .then(function(response) {
              vm.quotation = response.Data;
            });
        }
        queryInspection();
      });
    }

    function queryInspection() {
      return inspecFactory.inspec.getInspectionByRiskId(vm.riskId, true).then(function(response) {
        vm.inspection = response;
        vm.inspection.inspectionDate = moment(response.inspectionDate).toDate();
        vm.inspection.fullVehicle =
          response.brand + ' ' + response.model + ' ' + response.subModel + '' + response.vehicleYear + ', USADO';

        vm.inspection.noAditionalPhotos = _.filter(vm.inspection.photos, function(photo) {
          return photo.photoTypeId !== 8;
        });
        vm.inspection.aditionalPhotos = _.filter(vm.inspection.photos, function(photo) {
          return photo.photoTypeId === 8;
        });
        queryOffice();
      });
    }

    function queryOffice() {
      return inspecFactory.common.getGestorOficina(vm.inspection.agentId, true).then(function(response) {
        vm.inspectionOffice = response.Data;
      });
    }

    function buildEmissionWithQuotation() {
      var filterDate = $filter('date');
      var formatDate = 'dd/MM/yyyy';
      var paramsEmit = {
        CodigoCompania: constants.module.polizas.autos.companyCode,
        CodigoTipoEntidad: 1,
        TipoEmision: 7,
        ModalidadEmision: 'I',
        MCAEndosatario: vm.request.endorserId > 0 ? 'S' : 'N', //($scope.fourthStep.mEndosatario.Codigo == null) ? 'N' : 'S', //'N',
        MCAInformeInspeccion: 'N',
        MCAInspeccionPrevia: 'S',
        SNEmite: 'S',
        Poliza: {
          CodigoFinanciamiento: vm.request.contractor.financeTypeId, //'10001',
          ModalidadPrimeraCuota: 'IND',
          CodigoCompania: constants.module.polizas.autos.companyCode, //"1",
          CodigoRamo: constants.module.polizas.autos.codeRamo, //"301",
          MCAModalidad: 'N',
          InicioVigencia: filterDate(moment().toDate(), formatDate), //"24/10/2016",
          FinVigencia: filterDate(
            moment()
              .add(1, 'years')
              .toDate(),
            formatDate
          ), //"24/10/2017",
          // PolizaGrupo: ng.isUndefined(typeof $scope.secondStep.groupPolizeData)
          //   ? ''
          //   : $scope.secondStep.groupPolizeData.groupPolize //"" //POLIZADATA
          PolizaGrupo: ''
        },
        Contratante: {
          Nombre: vm.request.contractor.name,
          ApellidoPaterno: vm.request.contractor.lastName,
          ApellidoMaterno: vm.request.contractor.motherlastName,
          FechaNacimiento: filterDate(
            moment(vm.request.contractor.birthDate, 'D/MM/YYYY h:mm:ss A').toDate(),
            formatDate
          ), //"28/01/1980",
          TipoDocumento: vm.request.contractor.documentTypeCode,
          CodigoDocumento: vm.request.contractor.documentNumber,
          Sexo: vm.request.contractor.sex,
          Telefono: vm.request.items[0].contactPhone,
          Telefono2: vm.request.items[0].contactCelphone,
          CorreoElectronico: vm.request.items[0].contactEmail,
          MCAMapfreDolar: vm.request.mapfreDollar > 0 ? 'S' : 'N', //"N" --> SI INGRES MAPFRE DOLLAR
          MCAFisico: 'S',
          ImporteAplicarMapfreDolar: vm.request.mapfreDollar,
          // Direccion 								: ($scope.thirdStep.dataContractorAddress.mTipoVia.Codigo !== null) ? $scope.thirdStep.dataContractorAddress.mTipoVia.Descripcion : '' + ' ' +
          // 														$scope.thirdStep.dataContractorAddress.mNombreVia + ' ' +
          // 														($scope.thirdStep.dataContractorAddress.mTipoNumero.Codigo !== null) ? $scope.thirdStep.dataContractorAddress.mTipoNumero.Descripcion : '' + ' ' +
          // 														$scope.thirdStep.dataContractorAddress.mNumeroDireccion + ' ' +
          // 														($scope.thirdStep.dataContractorAddress.mTipoInterior.Codigo !== null) ? $scope.thirdStep.dataContractorAddress.mTipoInterior.Descripcion : '' + ' ' +
          // 														$scope.thirdStep.dataContractorAddress.mNumeroInterior + ' ' +
          // 														($scope.thirdStep.dataContractorAddress.mTipoZona.Codigo !== null) ? $scope.thirdStep.dataContractorAddress.mTipoZona.Descripcion : '' + ' ' +
          // 														$scope.thirdStep.dataContractorAddress.mNombreZona,//"LA PAZ", AGRUPAR DIRECCION EN LE MISMO ORDEN PASO 3
          Profesion: {
            Codigo: vm.request.contractor.professionId //"99"
          },
          ActividadEconomica: {
            Codigo: '' // TODO: Ver
            // Codigo : ($scope.thirdStep.dataContractor.mActividadEconomica.Codigo == null) ? '' : $scope.thirdStep.dataContractor.mActividadEconomica.Codigo, //""
          },
          Ubigeo: {
            CodigoNumero: vm.request.contractor.numberTypeId ? vm.request.contractor.numberTypeId : '',
            TextoNumero: vm.request.contractor.numberDescription,
            CodigoInterior: vm.request.contractor.insideTypeId ? vm.request.contractor.insideTypeId : '',
            TextoInterior: vm.request.contractor.insideDescription,
            CodigoZona: vm.request.contractor.zoneTypeId ? vm.request.contractor.zoneTypeId : '',
            TextoZona: vm.request.contractor.zoneDescription,
            Referencia: vm.request.contractor.addressReference,
            CodigoDepartamento: vm.request.contractor.departmentId,
            CodigoProvincia: vm.request.contractor.provinceId,
            CodigoDistrito: vm.request.contractor.districtId,
            CodigoVia: vm.request.contractor.roadTypeId ? vm.request.contractor.roadTypeId : ''
          },
          Direccion: vm.request.contractor.roadDescription //Se agrego, es el texto de vía
        },
        // Endosatario : {
        //  		CodigoEndosatario : $scope.fourthStep.mEndosatario.Codigo == null ? '' : $scope.fourthStep.mEndosatario.Codigo, //'', // campo debe ir vacio //$scope.mEndosatario.Codigo,//"", //DEBE IR VALORES VER DE GIANCARLOS CAREMITACTION - LISTO
        //  		TipoDocumento 		: $scope.fourthStep.mEndosatario.Codigo == null ? '' : $scope.fourthStep.mEndosatario.TipoDocumento, //'', // campo debe ir vacio //$scope.mEndosatario.TipoDocumento,//"", //DEBE IR VALORES
        //  		CodigoDocumento 	: '', // campo debe ir vacio //DEBE IR VALORES
        //  		SumaEndosatario 	: $scope.fourthStep.mEndosatario.Codigo == null ? 0 : $scope.fourthStep.mSumaEndosar //'0' // campo debe ir vacio //$scope.fourthStep.dataEndorsee.sumEndorse//"0" //DEBE IR VALORES
        // },
        Endosatario: {
          CodigoEndosatario: '',
          // TipoDocumento: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mEndosatario.TipoDocumento : '', //$scope.fourthStep.mEndosatario.Codigo == null ? '' : $scope.fourthStep.mEndosatario.TipoDocumento, //'', // campo debe ir vacio //$scope.mEndosatario.TipoDocumento,//"", //DEBE IR VALORES
          // CodigoDocumento: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mEndosatario.Codigo : '', //$scope.fourthStep.mEndosatario.Codigo == null ? '' : $scope.fourthStep.mEndosatario.Codigo,
          // SumaEndosatario: $scope.fourthStep.mOpcionEndosatario > 0 ? $scope.fourthStep.mSumaEndosar : 0 //$scope.fourthStep.mEndosatario.Codigo == null ? 0 : $scope.fourthStep.mSumaEndosar //'0' // campo debe ir vacio //$scope.fourthStep.dataEndorsee.sumEndorse//"0" //DEBE IR VALORES
          TipoDocumento: '', // TODO
          CodigoDocumento: '', // TODO
          SumaEndosatario: '' // TODO
        },
        Documento: {
          NumeroAnterior: '',
          NumeroTicket: '',
          CodigoEstado: '1',
          CodigoUsuario: UserService.agentInfo.codigoUsuario, //"DBISBAL", // VIENE DEL LOGIN
          CodigoUsuarioRED: constants.module.polizas.autos.networkUser, //"Usuario", // FIJO
          CodigoProducto: vm.request.contractor.productId, //"5",
          FlagDocumento: '',
          CodigoProceso: '2',
          CodigoAgente: UserService.agentInfo.codigoAgente, //'9808', //"818", // VIENE DEL LOGIN
          McaAsegNuevo: 'N',
          NombreDocumento: '',
          RutaDocumento: '',
          // MontoPrima: $scope.fourthStep.dataCalculatePremium.total, //"9718.34", //TOTAL PASO 4
          MontoPrima: '9718.34', //TOTAL PASO 4
          CodigoMoneda: constants.currencyType.dollar.code, //"2", //DOLLAR CONSTANTE
          NumeroPlaca: '',
          MarcaAsistencia: '',
          Ubigeo: {
            CodigoDepartamento: '',
            CodigoProvincia: '',
            CodigoDistrito: ''
          }
        },
        Vehiculo: {
          CodigoTipo: vm.inspection.vehicleTypeId, //"1", // TIPO VEHICULO
          // NumeroChasis: $scope.firstStep.dataInspection.NumeroChasis, //"DRER65474",
          NumeroChasis: 'DRER65474',
          NumeroMotor: vm.inspection.vehicleEngineNumber, //"DF64GF65H4G18",
          ZonaTarifa: '', //"A", //SERVICIO APARTE // SE ENVIA VACIO, LA LOGICA LA REALIZA BACKEND
          CodigoMoneda: constants.currencyType.dollar.code,
          CodigoColor: vm.inspection.vehicleColorId ? vm.inspection.vehicleColorId : '1', //"1",
          NumeroPlaca: vm.inspection.vehicleLicensePlate, //"TNT015",
          MCANUEVO: 'N',
          // MCAGPS: carGps, //"N", // SERVICIO carGps
          MCAGPS: 'N', // SERVICIO carGps TODO
          PolizaGrupo: '',
          // PolizaGrupo: angular.isUndefined(typeof $scope.secondStep.groupPolizeData)
          //   ? ''
          //   : $scope.secondStep.groupPolizeData.groupPolize, //"" //POLIZADATA
          ProductoVehiculo: {
            CodigoProducto: vm.request.contractor.productId, //"5" // PASO 2
            CodigoMoneda: constants.currencyType.dollar.code
          }
        },
        Inspector: {
          Nombre: vm.request.items[0].inspectorName, //"CARLOS ENRIQUE", //NombreInspector PASO 1 - INSPECCION
          ApellidoPaterno: '', //"", //ApellidosInspector PASO 1 - INSPECCION TODO
          Telefono: '0',
          Telefono2: '0',
          Observacion: ''
        },
        Inspeccion: {
          NumeroInspeccionTRON: vm.inspectionId, //"2001719", //NumeroInspeccionTRON PASO 1 - INSPECCION
          FlagAccMusical: 'N', // AGREAGR A SERVICIO INSPECION - POR CONFIRMAR
          CadenaAccesoriosCodigo: '', // AGREAGR A SRVICIO INSPECION - POR CONFIRMAR
          CadenaAccesoriosValor: '' // AGREAGR A SRVICIO INSPECION - POR CONFIRMAR
        },
        Cotizacion: {
          CodigoCompania: constants.module.polizas.autos.companyCode, //"1", // -
          CodigoTipoEntidad: '1', //-
          CodigoCorredor: UserService.agentInfo.codigoAgente, //'9808', //"818", // VIENE DEL LOGIN
          // "DsctoComision" : $scope.mDescuentoComision.AgenteComision == null ? 0 :  $scope.mDescuentoComision.AgenteComision,//0,
          // // "McaDctoComision" : $scope.mDescuentoComision.AgenteComision == null ? 'N' : 'S', //"N",
          // "FlagDctoComision" : $scope.mDescuentoComision.AgenteComision == null ? 'N' : 'S', //"N",
          // "ComisionAgt": $scope.mDescuentoComision.AgenteComision == null ? 0 : $scope.Math.abs($scope.mDescuentoComision.DsctoEspecial), //volver absoluto
          // "TotalDsctoComision" : $scope.mDescuentoComision.AgenteComision == null ? 0 : $scope.Math.abs($scope.mDescuentoComision.DsctoEspecial),//0, ////volver absoluto
          numeroInspeccion: vm.inspectionId, //"2001719", //NUMERO DE INSPECION  QUE INGRESE PASO 1
          mcaInspeccionPrevia: 'S',
          DocumentosAsociados: [
            {
              CodigoEstado: '1', // FIJO
              CodigoUsuarioRED: constants.module.polizas.autos.networkUser, //"Usuario", // FIJO siempre es Usuario
              CodigoUsuario: UserService.agentInfo.codigoUsuario, //"DBISBAL", // VIENE LOGIN
              CodigoProceso: '1', // FIJO
              CodigoProducto: vm.quotation.CodigoProducto, //"5", // FIJO
              CodigoAgente: UserService.agentInfo.codigoAgente, //'9808', //"818", // VIENE DEL LOGIN
              MarcaAsistencia: 'N', //FIJO
              // FlgAplicaDsctoComision: $scope.fourthStep.mDescuentoComision.AgenteComision == null ? 'N' : 'S', //"S", //POR CONFIRMAR //LOGICA COTIZACION-FlagDctoComision TODO
              FlgAplicaDsctoComision: 'S', //"S", //POR CONFIRMAR //LOGICA COTIZACION-FlagDctoComision
              DsctoComercial: '0', //FIJO
              DsctoPorComision: '8',
              // $scope.fourthStep.mDescuentoComision.AgenteComision == null TODO
              //   ? 0
              //   : $scope.fourthStep.mDescuentoComision.DsctoEspecial, //$scope.fourthStep.mDescuentoComision.AgenteComision == null ? 0 : $scope.Math.abs($scope.fourthStep.mDescuentoComision.DsctoEspecial), //"0", //FIJO //LOGICA COTIZACION-ComisionAgt
              TotalDscto: '8',
              // $scope.fourthStep.mDescuentoComision.AgenteComision == null
              //   ? 0
              //   : $scope.fourthStep.mDescuentoComision.DsctoEspecial, //$scope.fourthStep.mDescuentoComision.AgenteComision == null ? 0 : $scope.Math.abs($scope.fourthStep.mDescuentoComision.DsctoEspecial), //"0", //FIJO //LOGICA COTIZACION-TotalDsctoComision
              TuComision: vm.quotation.TuComision,
              MontoPrima: vm.quotation.MontoPrima, //"9718.34", // TOTAL PASO4
              PrimaNeta: vm.quotation.PrimaNeta, //$scope.fourthStep.dataCalculatePremium.netPremium,
              Ubigeo: {
                CodigoDepartamento: vm.quotation.Contratante.Ubigeo.CodigoDepartamento, //"", //FIJO por ver
                CodigoProvincia: vm.quotation.Contratante.Ubigeo.CodigoProvincia, //"", //FIJO por ver
                CodigoDistrito: vm.quotation.Contratante.Ubigeo.CodigoDistrito //"" //FIJO por ver
              }
            }
          ],
          Vehiculo: {
            AnioFabricacion: vm.quotation.Vehiculo.AnioFabricacion, //"2016",
            CodigoCategoria: '2',
            CodigoMarca: vm.quotation.Vehiculo.CodigoMarca, //"15",
            CodigoModelo: vm.quotation.Vehiculo.CodigoModelo, //"23",
            CodigoSubModelo: vm.quotation.Vehiculo.CodigoSubModelo, //"1",
            CodigoTipo: vm.quotation.Vehiculo.CodigoTipoVehiculo, //"1",
            CodigoUso: vm.quotation.Vehiculo.CodigoUso, //"8",
            DsctoComercial: 0, //FIJO
            NombreMarca: vm.quotation.Vehiculo.NombreMarca, //"HYUNDAI",
            NombreModelo: vm.quotation.Vehiculo.NombreModelo, //"ELANTRA",
            // MCAGPS: carGps, //"N", TODO
            MCAGPS: vm.quotation.Vehiculo.MCAGPS,
            MCANUEVO: vm.quotation.Vehiculo.MCANUEVO,
            // MCAPICKUP: _getPickUp($scope.firstStep.dataInspection.Veh_tipo), //'S', //FIJO // Ahora no es fijo, existe una logica
            NombreTipo: vm.quotation.Vehiculo.NombreTipoVehiculo, //"AUTOMOVIL", // PENDIENTE SERVICIO en firstStep-Inspection
            MCAREQUIEREGPS: vm.quotation.Vehiculo.MCAGPS, //"S", // SERVICIO carGps
            // PolizaGrupo: angular.isUndefined(typeof $scope.secondStep.groupPolizeData)
            //   ? ''
            //   : $scope.secondStep.groupPolizeData.groupPolize, //"" //POLIZADATA
            PolizaGrupo: '',
            SumaAsegurada: vm.quotation.Vehiculo.SumaEndosatario, //"19990", //SUMASAGEUAD FINAL
            // TipoVolante: $scope.firstStep.dataInspection.Veh_timon, //"I",  // PASO1
            TipoVolante: 'I', // PASO1
            ZonaTarifa: '', //"A", // SE ENVIA VACIO, LA LOGICA LA REALIZA BACKEND
            ProductoVehiculo: {
              CodigoProducto: vm.quotation.CodigoProducto //"5" //FIJO
            }
          },
          Contratante: {
            Nombre: vm.quotation.Contratante.Nombre,
            ApellidoPaterno: vm.quotation.Contratante.ApellidoPaterno,
            MCAMapfreDolar: 'N', //($scope.fourthStep.mMapfreDolar > 0) ? 'S': 'N', //$scope.fourthStep.dataCalculatePremium.mapfreDollar > 0 ? 'S': 'N', //"N",
            ImporteMapfreDolar: roundTwoDecimals(vm.quotation.Contratante.ImporteMapfreDolar), //saldoMapfreDolares desde componente //roundTwoDecimals($scope.firstStep.dataContractor.SaldoMapfreDolar), //"-2.93"
            Ubigeo: {
              CodigoDepartamento: vm.request.contractor.departmentId,
              CodigoProvincia: vm.request.contractor.provinceId,
              CodigoDistrito: vm.request.contractor.districtId
            }
          }
        }
      };
      return paramsEmit;
    }

    function roundTwoDecimals(num) {
      return +(Math.round(num + 'e+2') + 'e-2');
    }

    function emitPolize() {
      var request = {};
      if (vm.request.quotationId) {
        request = buildEmissionWithQuotation();
      }
      inspecFactory.inspec
        .grabarEmisionConInspeccion(request, true)
        .then(function(response) {
          ErrorHandlerService.handleError(response.Message);
        })
        .catch(function(e) {
          ErrorHandlerService.handleError(e.data.Data.Message);
        });
    }

    function downloadPDF() {
      $window.open(
        constants.module.inspec[constants.environment].urlOldInspection +
          'descarga.aspx?caso=frmBandejaInspector&NroRiesgo=' +
          vm.riskId,
        '_blank',
        'toolbar=yes,scrollbars=no,resizable=no,width=710,height=796'
      );
    }
  }

  return ng
    .module('appInspec')
    .controller('InspeccionTerminadaController', inspeccionTerminadaController)
    .component('inspecTerminada', {
      templateUrl: '/inspec/app/components/inspecciones/inspeccion-terminada/inspeccion-terminada.html',
      controller: 'InspeccionTerminadaController',
      controllerAs: '$ctrl'
    })
    .filter('percentage', [
      '$filter',
      function($filter) {
        return function(input) {
          if (!ng.isUndefined(input)) {
            return $filter('number')(input) + '%';
          }
        };
      }
    ]);
});
