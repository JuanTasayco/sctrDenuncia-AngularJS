'use strict';

define(['angular', 'lodash', 'constants', 'reConstants'], function (ng, _, constants, reConstants) {
  ReAttachmentsFileController.$inject = ['reFactory', '$log', 'mModalConfirm', 'mModalAlert', '$window'];

  function ReAttachmentsFileController(reFactory, $log, mModalConfirm, mModalAlert, $window) {
    var vm = this;
    vm.$onInit = onInit;
    vm.$onChanges = onChanges;
    vm.onChangeFile = onChangeFile;
    vm.deleteFile = deleteFile;
    vm.downloadMedia = downloadMedia;

    function onInit() {
      vm.frmData = new FormData();
      _getAllFiles();
      _validateMediaExtensions();
    }

    function onChanges(changes) {
      if (
        changes.documentControlNumber && changes.documentControlNumber.currentValue &&
        changes.idAffiliate && changes.idAffiliate.currentValue &&
        changes.sinisterNumberRef && changes.sinisterNumberRef.currentValue &&
        changes.receptionDocumentDate && changes.receptionDocumentDate.currentValue
      ) {
        _getAllFiles();
      }
    }

    function onChangeFile(e) {
      var listName = e.target.files[0].name.split('.');
      var listExtensions = vm.mediaExtensions.split(',');
      var listExtensionsTrim = _.map(listExtensions, function(item) {
        return item.trim();
      });
      var fileExtension = '.' + listName[listName.length - 1].toLowerCase();

      var isIncludeExtension = _.find(listExtensionsTrim, function(ext) {
        return ext === fileExtension
      });

      if (isIncludeExtension) {
        var request = _.assign({}, _mapRequestObj(), {
          mediaTempSequence: vm.additionalData.identificatorImageCode,
          idCompany: vm.idCompany,
          productCode: vm.productCode,
          idAffiliate: vm.idAffiliate || null,
          benefitCode: vm.benefitCode || null,
          invoiceItemNumber: vm.invoiceItemNumber || 1
        })
  
        if (e.target.files[0].name) {
          var service = vm.observed ? reFactory.solicitud['UploadFileObserved'] : reFactory.solicitud['UploadFile'];
          service(e.target.files[0], vm.codeUploadFile, request)
            .then(function (res) {
              res.data.isValid && _getAllFiles();
            })
            .catch(function (err) {
              $log.error('Fallo en el servidor', err);
            })
        }
      } else {
        mModalAlert.showError("Elige un formato válido", "");
      }
    }

    function deleteFile(file) {
      mModalConfirm.confirmWarning('¿Estás seguro de querer eliminar el elemento?', '', '').then(function(confirm) {
        if(confirm) {
          var request = {
            filePowerSq: vm.additionalData.identificatorImageCode,
            item: file.item,
            codeFileType: file.codeFileType,
            idCompany: vm.idCompany,
            productCode: vm.productCode,
            invoiceItemNumber: vm.invoiceItemNumber || 1,
            benefitCode: vm.benefitCode || null
          };

          reFactory.solicitud
            .DeleteFile(request)
            .then(function (res) {
              res.isValid && _getAllFiles()
            })
            .catch(function (err) {
              $log.error('Fallo en el servidor', err);
            })
        }
      })
    }

    function downloadMedia(file) {
      reFactory.solicitud
        .DownloadFile(
          'api/media/DownloadMediaFile/' +
          file.filePowerSq +
          '/' + file.item +
          '/' + file.codeFileType +
          '/' + vm.idCompany +
          '/' + vm.productCode +
          '/' + (vm.benefitCode.trim() || null) +
          '/' + (vm.invoiceItemNumber || 1), {
            fileName: file.fileName
          }
        )
    }

    // privates

    function _getAllFiles() {
      var request = {
        item: vm.item,
        codeFileType: vm.codeUploadFile,
        idCompany: vm.idCompany,
        productCode: vm.productCode,
        benefitCode: vm.benefitCode || null,
        invoiceItemNumber: vm.invoiceItemNumber || 1,
        receptionDocumentDate: vm.receptionDocumentDate,
        idAffiliate: vm.idAffiliate,
        sinisterNumberRef: vm.sinisterNumberRef || (vm.additionalData && vm.additionalData.sinisterNumberRef),
        // documentControlNumber: vm.documentControlNumber
      };

      if (vm.documentLiquidationNumber !== undefined && vm.documentLiquidationNumber.documentControlNumber) {
        if (
          vm.benefitCode !== reConstants.coverages.temporaryDisability &&
          vm.benefitCode !== reConstants.coverages.permanentDisability &&
          vm.benefitCode !== reConstants.coverages.accidentalDeath
        ) {
          request.documentControlNumber = vm.documentLiquidationNumber.documentControlNumber;
        }
      } else {
        request.filePowerSq = vm.additionalData ? vm.additionalData.identificatorImageCode : vm.identificatorId;
        request.documentControlNumber = vm.documentControlNumber;
      }

      reFactory.solicitud
        .GetAllFiles(request)
        .then(function (res) {
          vm.fileList = res.isValid ? res.data : [];
          if (!res.isValid) {
            vm.fileListFilter = [{files: []}];
            vm.listFile && vm.listFile([]);
            return void 0;
          }
          var filesFilter = _.groupBy(vm.fileList, 'liquidationPower');
          var keys = _.keys(filesFilter);
          vm.fileListFilter = _.map(keys, function(item) {
            return _.assign({}, {
              liquidationPower: item,
              files: filesFilter[item]
            })
          });
          vm.listFile && vm.listFile(vm.fileListFilter);
        })
        .catch(function (err) {
          $log.error('Fallo en el servidor', err);
        })
    }

    function _validateMediaExtensions() {
      vm.mediaExtensions = ng.fromJson($window.sessionStorage['mediaExtensions']);
    }

    function _mapRequestObj() {
      var reqObject = {
        anio: vm.sinisterAnio || (vm.additionalData.sinisterAnio || null),
        // documentControlNumber: vm.documentLiquidationNumber ?
        //   vm.documentLiquidationNumber.documentControlNumber :
        //   vm.additionalData.documentControlNumber,
          // (vm.documentLiquidationNumber.documentControlNumber ?
          //   vm.documentLiquidationNumber.documentControlNumber :
          //   (vm.additionalData.documentControlNumber || null)
          // ) : (vm.additionalData.documentControlNumber || null),
        sinisterNumber: vm.additionalData.sinisterNumber || null,
        policyNumber: vm.additionalData.policyNumber || null
      }

      if (vm.documentLiquidationNumber !== undefined && vm.documentLiquidationNumber.documentControlNumber) {
        if (
          vm.benefitCode !== reConstants.coverages.temporaryDisability &&
          vm.benefitCode !== reConstants.coverages.permanentDisability &&
          vm.benefitCode !== reConstants.coverages.accidentalDeath
        ) {
          reqObject.documentControlNumber = vm.documentLiquidationNumber.documentControlNumber;
        }
      } else {
        if (
          vm.benefitCode !== reConstants.coverages.temporaryDisability &&
          vm.benefitCode !== reConstants.coverages.permanentDisability &&
          vm.benefitCode !== reConstants.coverages.accidentalDeath
        ) {
          reqObject.documentControlNumber = vm.documentControlNumber || (vm.documentLiquidationNumber ?
          vm.documentLiquidationNumber.documentControlNumber :
          vm.additionalData.documentControlNumber)
        } else if (vm.observed) {
          reqObject.documentControlNumber = vm.documentControlNumber;
        }
      }

      return reqObject;
    }
  }

  return ng
    .module('appReembolso')
    .controller('ReAttachmentsFileController', ReAttachmentsFileController)
    .component('reAttachmentsFile', {
      templateUrl: '/reembolso/app/components/solicitud/steps/attachments/attachments-file/attachments-file.html',
      controller: 'ReAttachmentsFileController as $ctrl',
      bindings: {
        additionalData: '<',
        codeUploadFile: '<',
        listFile: '<?',
        idCompany: '<',
        productCode: '<',
        idAffiliate: '<',
        benefitCode: '<',
        documentLiquidationNumber: '<',
        invoiceItemNumber: '<',
        readOnly: '<',
        identificatorId: '<?',
        receptionDocumentDate: '<?',
        listFileToShow: '<?',
        documentControlNumber: '<?',
        sinisterNumberRef: '<?',
        sinisterAnio: '<?',
        observed: '<?'
      }
    })
})
