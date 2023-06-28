'use strict';

define(['angular', 'lodash', 'ReembolsoActions', 'constants', 'moment', 'reConstants'], function (ng, _, ReembolsoActions, constants, moment, reConstants) {
  InitConsultarController.$inject = ['reFactory', '$ngRedux', '$q', '$log', 'oimClaims', 'mModalAlert', '$sce', '$timeout', '$scope', '$state', 'mModalConfirm', '$window', 'mpSpin', '$http', 'mainServices', 'httpData'];

  function InitConsultarController(reFactory, $ngRedux, $q, $log, oimClaims, mModalAlert, $sce, $timeout, $scope, $state, mModalConfirm, $window, mpSpin, $http, mainServices, httpData) {

    var vm = this;
    var actionsRedux;
    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.changeCompany = changeCompany;
    vm.searchAfiliate = searchAfiliate;
    vm.searchMedic = searchMedic;
    vm.searchBroker = searchBroker;
    vm.searchDocuments = searchDocuments;
    vm.clean = clean;
    vm.pageChanged = pageChanged;
    vm.getPopoverContent = getPopoverContent;
    vm.downloadFiniquito = downloadFiniquito;
    vm.aplicarGiro = aplicarGiro;
    vm.showAplicarGiro = showAplicarGiro;
    vm.showFiltroBroker = showFiltroBroker;
    vm.onChangeFile = onChangeFile;
    vm.saveIndex = saveIndex;
    vm.showDetail = showDetail;
    vm.setPropertyData = setPropertyData;
    vm.deleteFiniquito = deleteFiniquito;
    vm.downloadFiniquitoFirmado = downloadFiniquitoFirmado;
    vm.goToDetail = goToDetail;
    vm.downloadExcel = downloadExcel;
    vm.downloadLetter = downloadLetter;
    vm.downloadProfitLiquidation = downloadProfitLiquidation;
    vm.isADoctor = isADoctor;

    // function declaration

    function onInit() {
      vm.indexArray = -1;
      vm.pageSize = 10;
      vm.index = -1;
      vm.msjFiniquitoSF =
        "  <h5 class='gH5'>Finiquito sin firmar</h5>\n" +
        "  <p>\n" +
        "    Si la solicitud de reembolso ha sido aprobada recibirás un 'finiquito sin firmar'. Para continuar con el proceso sube el documento firmado.<br><br>Si no está conforme con el finiquito envía un mail al <b>siniestros_rh@mapfre.com.pe</b> para solicitar asesoría.\n" +
        "  </p>\n";

      oimClaims.rolesCode.some(function (obj, i) {
        return obj.nombreAplicacion === constants.module.reembolso.code ? vm.indexArray = i : false;
      });

      if (vm.indexArray !== -1) {
        vm.rol = oimClaims.rolesCode[vm.indexArray].codigoRol;
      }

      actionsRedux = $ngRedux.connect(
        mapStateToThis,
        ReembolsoActions
      )(vm);

      vm.consultarInit = {};
      vm.requestFile = {};
      vm.currentYearTwoLastNumber = new Date().getFullYear().toString().substr(2);

      _getCompanies();
      _getStates();
      vm.consultData = _mapInitForm();
      setInitDate();

      vm.currentPage = 1;
      vm.mediaExtensions = ng.fromJson($window.sessionStorage['mediaExtensions']);

      setDoctor();

    }

    function setDoctor(){
      if(isADoctor()){
        vm.consultData.medic = {
          userCode: oimClaims.loginUserName,
          userName: oimClaims.userName
        }
      }
    }

    function onDestroy() {
      vm.fileUpload();
      actionsRedux();
    }

    function setInitDate() {
      vm.consultData.fromDate.model = moment().subtract(7, 'days').toDate();
      vm.consultData.toDate.model = new Date();

      setTimeout(function() {
        searchDocuments(1);
      }, 1000)

    }

    function mapStateToThis(state) {
      return {
        consultar: state
      };
    }

    function changeCompany() {
      if (!vm.consultData.company.idCompany) {
        vm.productType = [];
        return void 0;
      }
      vm.consultData.productType = null;
      _getProductType(vm.consultData.company.idCompany);
    }

    function searchAfiliate(criteria) {
      if (criteria && criteria.length >= 3) {
        var defer = $q.defer();
        reFactory.solicitud.GetAfiliatesList({
          idCompany: vm.consultData.company.idCompany,
          criteria: criteria.toUpperCase()
        }).then(
          function (res) {
            defer.resolve(res.data);
          },
          function (err) {
            $log.error(err.data.message);
          }
        );
        return defer.promise;
      }
    }

    function searchMedic(criteria) {
      if (criteria && criteria.length >= 3) {
        var defer = $q.defer();
        reFactory.solicitud.GetMedicList(criteria).then(
          function (res) {
            defer.resolve(res.data);
          },
          function (err) {
            $log.error(err.data.message);
          }
        );
        return defer.promise;
      }
    }

    function searchBroker(criteria) {
      if (criteria && criteria.length >= 3) {
        var defer = $q.defer();
        reFactory.solicitud.GetBrokerList(criteria).then(
          function (res) {
            defer.resolve(res.data);
          },
          function (err) {
            $log.error(err.data.message);
          }
        );
        return defer.promise;
      }
    }

    function searchDocuments(numberPage) {
      vm.req = getTrama(numberPage || vm.mPagination);
      var newReq = {};
      _.forEach(_.keys(vm.req), function(key){
        newReq[key] = typeof vm.req[key] === 'string' ? vm.req[key].toUpperCase() : vm.req[key];
      });

      reFactory.solicitud
        .GetAllRefundTrayBy(newReq)
        .then(function (res) {
          if (!res.isValid) {
            sinData();
            var message = '';
            ng.forEach(res.brokenRulesCollection, function (error) {
              message += error.description + ' ';
            });
            mModalAlert.showError(message, 'Error');
          } else {
            if (res.data.result.length > 0) {
              vm.documents = res.data.result;
              vm.totalPages = res.data.totalPages;
              vm.totalRows = res.data.totalRows;
              vm.noResult = false;
            } else {
              sinData();
            }
          }
        })
        .catch(function (err) {
          sinData();
          $log.error('Fallo en el servidor', err);
        });
    }

    function sinData() {
      vm.documents = [];
      vm.totalPages = 0;
      vm.totalRows = 0;
      vm.noResult = true;
    }

    function clean() {
      vm.consultData.company = '';
      vm.productType = [];
      vm.consultData.state = '';
      vm.consultData.asegurado = '';
      vm.consultData.placa = '';
      vm.consultData.liquidationPowerYear = '';
      vm.consultData.liquidationPowerNumber = '';
      vm.consultData.toDate.model = new Date();
      vm.consultData.fromDate.model = new Date();
      isADoctor ? setDoctor() : vm.consultData.medic = null;
      vm.consultData.broker = null;
      searchDocuments(1);
    }

    function getTrama(numberPage) {
      return {
        idCompany: vm.consultData.company && vm.consultData.company.idCompany ? vm.consultData.company.idCompany : null,
        productCode: vm.consultData.productType && vm.consultData.productType.productCode ? vm.consultData.productType.productCode : null,
        refundFrom: vm.consultData.fromDate.model ? vm.consultData.fromDate.model : new Date(),
        refundTo: vm.consultData.toDate.model ? vm.consultData.toDate.model : new Date(),
        pageNum: numberPage ? numberPage : 1,
        pageSize: vm.pageSize,
        rolCode: vm.rol,
        documentStatusCode: vm.consultData.state && vm.consultData.state.code ? vm.consultData.state.code : null,
        idAffiliate: vm.consultData.asegurado && vm.consultData.asegurado.idAffiliate ? vm.consultData.asegurado.idAffiliate : 0,
        doctorCode: vm.consultData.medic && vm.consultData.medic.userCode ? vm.consultData.medic.userCode : null,
        licensePlate: vm.consultData.placa,
        anio: vm.consultData.liquidationPowerYear,
        documentControlNumber: vm.consultData.liquidationPowerNumber,
        inBrokerCode: vm.consultData.broker && vm.consultData.broker.idBroker ? vm.consultData.broker.idBroker : null
      };
    }

    function pageChanged(numberPage) {
      vm.currentPage = numberPage;
      searchDocuments(numberPage);
    }

    function setPropertyData(item) {
      vm.requestFile = item;
    }

    function goToDetail(data) {
      vm.reduxConsultAddSolicitud(data);
      $window.sessionStorage['consulta'] = ng.toJson({data: data});
      $state.go('consultar.detail', {
        data: data
      })
    }

    //Finiquito

    var trusted = {};

    function getPopoverContent() {
      return trusted[vm.msjFiniquitoSF] || (trusted[vm.msjFiniquitoSF] = $sce.trustAsHtml(vm.msjFiniquitoSF));
    }

    function downloadFiniquito(item) {
      reFactory.solicitud
        .DownloadFile(
          'api/report/downloadCompensation?' +
          'documentYear=' + item.anio +
          '&documentControlNumber=' + item.documentControlNumber, {
            fileName: 'finiquito_sin_firmar.pdf'
          }
        )
    }

    function aplicarGiro(index, item, value) {
      if(item.refundOrderStatus !== 0 && item.refundOrderStatus !== 1 ) {
        mModalConfirm.confirmWarning('¿Estás seguro de aplicar la operacion?', '', '')
        .then(function (confirm) {
          if (confirm) {
      vm.req = {
        documentYear: item.anio,
        documentNumber: item.documentControlNumber,
        idCompany: item.idCompany,
        productCode: item.productCode,
        status: value,
        userCode: 'SGA',
        paymentOrder: item.paymentOrderNumberTron || ''
      };

      reFactory.solicitud
        .SetRefundOrder(vm.req)
        .then(function (res) {
          if (!res.isValid) {
            var message = '';
            ng.forEach(res.brokenRulesCollection, function (error) {
              message += error.description + ' ';
            });
            mModalAlert.showError(message, 'Error');
          } else {
            vm.documents[index].refundOrderStatus = value;
          }
        })
        .catch(function (err) {
          sinData();
          $log.error('Fallo en el servidor', err);
        });
    }
        })
      } else {
        mModalAlert.showInfo('El giro ya ha sido aplicado', 'Información');
      }
    }

    function showAplicarGiro() {
      return vm.rol === constants.module.reembolso.roles.supeSOAT.description || vm.rol === constants.module.reembolso.roles.admin.description;
    }

    function showFiltroBroker() {
      return vm.rol === constants.module.reembolso.roles.admin.description;
    }

    function saveIndex(index) {
      vm.index = index;
    }

    vm.fileUpload = $scope.$watch(function () {
      return vm.finiquitoFile
    }, function (newVal, oldVal) {
      if (ng.isDefined(vm.finiquitoFile)) {
        ng.forEach(vm.finiquitoFile, function (value, key) {
          onChangeFile(vm.documents[vm.index], value);
        });
      }
    });

    function onChangeFile(e) {
      var request = _.assign({}, {
        anio: vm.requestFile.anio,
        documentControlNumber: vm.requestFile.documentControlNumber,
        sinisterNumber: vm.requestFile.sinisterNumber,
        policyNumber: vm.requestFile.policyNumber,
        mediaTempSequence: vm.requestFile.filePowerSq,
        idCompany: vm.requestFile.idCompany,
        productCode: vm.requestFile.productCode,
        idAffiliate: vm.requestFile.idAffiliate,
        benefitCode: vm.requestFile.benefitCode,
        invoiceItemNumber: 1
      })

      if (e.target.files[0].name) {
        reFactory.solicitud
          .UploadSignedDocument(e.target.files[0], reConstants.codeUploadFile.finiquitoFirmado, request)
          .then(function (res) {
            res.data.isValid && searchDocuments(vm.mPagination);
          })
          .catch(function (err) {
            $log.error('Fallo en el servidor', err);
          })
      }
    }

    function showDetail(item) {
      vm.reduxConsultAddSolicitud(item);
      $window.sessionStorage['consulta'] = ng.toJson({data: item, edit: item.documentStatusDescription === 'OBSERVADO'});
      $state.go('consultar.detail', {
        data: item,
        edit: item.documentStatusDescription === 'OBSERVADO'
      })
    }

    function deleteFiniquito(item) {
      mModalConfirm.confirmWarning('¿Estás seguro de querer eliminar el finiquito?', '', '')
        .then(function (confirm) {
          if (confirm) {
            var request = {
              filePowerSq: item.filePowerSq,
              item: 1,
              codeFileType: reConstants.codeUploadFile.finiquitoFirmado,
              idCompany: item.idCompany,
              productCode: item.productCode,
              invoiceItemNumber: 1,
              benefitCode: item.benefitCode
            };

            reFactory.solicitud
              .DeleteFile(request)
              .then(function (res) {
                res.isValid && searchDocuments(vm.mPagination);
              })
              .catch(function (err) {
                $log.error('Fallo en el servidor', err);
              })
          }
        })
    }

    function downloadFiniquitoFirmado(item){
      var params = item.filePowerSq+'/1/'+reConstants.codeUploadFile.finiquitoFirmado+'/'+item.idCompany+'/'+item.productCode+'/'+item.benefitCode.trim()+'/1';
      params = params.trim();
      reFactory.solicitud
        .DownloadFile(
          'api/media/DownloadMediaFile/' + params, {
            fileName: 'finiquito_firmado.pdf'
          }
        )
    }

    function downloadExcel() {
      var requestData = getTrama(vm.mPagination);
      var newReq = {};
      _.forEach(_.keys(requestData), function(key){
        newReq[key] = typeof vm.req[key] === 'string' ? requestData[key].toUpperCase() : requestData[key];
      });
      var pathParams = {
        opcMenu: localStorage.getItem('currentBreadcrumb')
      };
      const urlRequest = constants.system.api.endpoints.reembolso2 + 'api/RefundTray/Download/Report' +'?COD_OBJETO=.&OPC_MENU='+pathParams.opcMenu;

      httpData.postDownload(
        urlRequest,
        newReq,
        { responseType: 'arraybuffer'},
        true
    ).then(function(data){
      mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
    });
    }

    function downloadLetter(item) {
      var deferred = $q.defer();
      var request = {
        letterType: item.letterType,
        anio: item.anio,
        documentControlNumber: item.documentControlNumber
      };

      mpSpin.start();
      $http({
        method: 'POST',
        url: constants.system.api.endpoints.reembolso2 + '/api/media/DownloadLetterBy',
        data: request,
        responseType: 'arraybuffer'
      })
        .then(function(res) {
          if (res.status === 200) {
            mpSpin.end();
            mainServices.fnDownloadFileBase64(res.data, 'pdf', 'carta.pdf', true);
            deferred.resolve();
          } else {
            mpSpin.end();
            mModalAlert.showError("Error", "");
          }
        })
        .catch(function(err) {
          mpSpin.end();
          $log.error(err);
        })
    }

    // privates

    function _mapInitForm() {
      return _.assign({}, {
        fromDate: new reFactory.common.DatePicker(),
        toDate: new reFactory.common.DatePicker(),
        liquidationPowerYear: ''
      })
    }

    function _getCompanies() {
      reFactory.solicitud
        .GetAllCompany()
        .then(function (res) {
          vm.companiesList = res.data;
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getProductType(companyId) {
      reFactory.solicitud
        .GetProductsByCompany(companyId)
        .then(function (res) {
          vm.productType = res.data;
        })
        .catch(function (err) {
          vm.productType = [];
          $log.error('Fallo en el servidor', err);
        });
    }

    function _getStates() {
      reFactory.solicitud
        .GetStateDocument()
        .then(function (res) {
          vm.states = res.data;
        })
        .catch(function (err) {
          vm.states = [];
          $log.error('Fallo en el servidor', err);
        });
    }

    function downloadProfitLiquidation(item) {
      reFactory.solicitud
      .DownloadFile(
        'api/report/downloadProfitLiquidation?' +
        'documentYear=' + item.anio +
        '&documentControlNumber=' + item.documentControlNumber, {
          fileName: item.documentControlNumber + '_liquidacion.pdf'
        }
      )
    }

    function isADoctor(){

      return vm.rol === constants.module.reembolso.roles.madOtros.description || vm.rol === constants.module.reembolso.roles.matSOAT.description;

    }
  }
  return ng
    .module('appReembolso')
    .controller('InitConsultarController', InitConsultarController)
    .component('reInitConsultar', {
      templateUrl: '/reembolso/app/components/consultar/init/init.html',
      controller: 'InitConsultarController',
      bindings: {}
    });
});
