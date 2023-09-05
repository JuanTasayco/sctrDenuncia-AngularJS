'use strict'

define(['angular', 'constants', 'helper', 'lodash', 'angular_file_saver'],
  function (angular, constants, helper, _) {
    var appControls = angular.module('mapfre.mainServices', ['ngFileSaver']);

		/*########################
    # service
    ########################*/
    appControls.service('mainServices', ['$uibModal', 'mpSpin', '$q', 'FileSaver', 'Blob', '$window',
      function ($uibModal, mpSpin, $q, FileSaver, Blob, $window) {

        /*########################
        # fnDownloadFileB64
        ########################*/
        //convert b64 to byteArrays, after convert byteArrays to blob
        function b64toBlob(b64Data, contentType, sliceSize) {
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = atob(b64Data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
          }
          //convert b64 to byteArrays, after convert byteArrays to blob
          var blob = new Blob(byteArrays, { type: contentType });
          return blob;
        }
		//MSAAVEDRA 20211211 Convierte bas64 a file
        function fnConvertBase64ToFile(base64String, fileName, vMimeType) {
          var mime = vMimeType;
          var bstr = atob(base64String);
          var n = bstr.length;
          var uint8Array = new Uint8Array(n);
          while (n--) {
            uint8Array[n] = bstr.charCodeAt(n);
          }
          var file = new File([uint8Array], fileName, { type: mime });
          return file;
        }

        //MSAAVEDRA 20211211 Descarga un archivo desde un file
        function fnDownloadFromFile(fileBase64, documentType, fileName) {
          var vType = {
            pdf: 'application/pdf',
            excel: 'application/vnd.ms-excel',
            png: 'image/png',
            jpeg: 'image/jpeg'
          };
          var vDocumentType = documentType || '';
          var vMimeType = vType[vDocumentType.toLowerCase()] || documentType;
          var vFileName = fileName || 'file';
          var file = fnConvertBase64ToFile(fileBase64, vFileName, vMimeType);
          FileSaver.saveAs(file, vFileName);
        }
        // Descargar PDF, Excel o JPEG/PNG
        function fnDownloadFileBase64(fileBase64, documentType, fileName, isArrayBuffer) {
          var vType = {
            pdf: 'application/pdf',
            excel: 'application/vnd.ms-excel',
            png: 'image/png',
            jpeg: 'image/jpeg'
          };
          var vDocumentType = documentType || '';
          var vMimeType = vType[vDocumentType.toLowerCase()] || documentType;
          var vFileName = fileName || 'file';

          if (isArrayBuffer) {
            if (vMimeType && vFileName) {
              var vBlob = new Blob([fileBase64], { type: vMimeType });
              FileSaver.saveAs(vBlob, vFileName);
            }
          } else {
            var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
            if (vMimeType && vFileName) {
              var vFile = b64toBlob(fileBase64, vMimeType);
              FileSaver.saveAs(vFile, vFileName);
            }
          }
        }

        // Abre PDF en nueva ventana (desde servicio)
        function getPDF(base, URL, params) {
          if(!params) {
            $window.open(base + URL);
          } else {
            if (params !== '') { URL += '/'; }
            $window.open(base + URL + params);
          }

        }

        /*########################
        # fnReturnSeveralPromise
        ########################*/
        function fnReturnSeveralPromise(arrayPromises, showSpin) {
          function _end() {
            if (showSpin) mpSpin.end();
          }
          if (showSpin) mpSpin.start();

          var deferred = $q.defer();
          $q.all(arrayPromises).then(function (response) {
            deferred.resolve(response);
            _end();
          }, function (error) {
            deferred.reject(error.statusText);
            _end();
          });
          return deferred.promise;
        }

        /*########################
        # fnShowModal
        ########################*/
        function fnShowModal(customUibModalOptions, customModalOptions) {
          var vIcons = {
            info: 'swal2-info',
            success: 'swal2-success',
            warning: 'swal2-warning',
            error: 'swal2-error'
          };

          //option uiModal
          var uibModalOptions = {
            backdrop: true, // background de fondo
            keyboard: true,
            modalFade: true,
            size: 'md',
            templateUrl: '/scripts/mpf-main-controls/html/tplModal.html'
          };

          //option showModal
          var modalOptions = {
            showIcon: '',
            title: '',
            titleUppercase: true,
            content: '',
            templateContent: '',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'ACEPTAR'
          };

          if (!customUibModalOptions) customUibModalOptions = {};
          if (!customModalOptions) customModalOptions = {};

          if (customModalOptions.showIcon && customModalOptions.showIcon !== '') {
            customModalOptions.fontIcon = vIcons[customModalOptions.showIcon];
            customUibModalOptions.backdrop = 'static';
            customUibModalOptions.keyboard = false;
            customUibModalOptions.openedClass = 'g-animatedSweetAlert';
          }

          var tempUibModalOptions = {};
          var tempModalOptions = {};

          angular.extend(tempUibModalOptions, uibModalOptions, customUibModalOptions);
          angular.extend(tempModalOptions, modalOptions, customModalOptions);

          var customController;
          if (tempUibModalOptions.controller) customController = tempUibModalOptions.controller;

          function defaultController($scope, $uibModalInstance) {
            $scope.tplModalOptions.fnAcept = function (result) {
              var vResult = result || true;
              $uibModalInstance.close(vResult);
            };
            $scope.tplModalOptions.fnClose = function (result) {
              $uibModalInstance.dismiss('cancel');
            };
          }

          tempUibModalOptions.controller = function ($scope, $uibModalInstance) {
            $scope.tplModalOptions = tempModalOptions;
            defaultController($scope, $uibModalInstance)
            if (customController) {
              if (angular.isArray(customController)) {
                var vItemFunction = _.find(customController, function (item) {
                  return angular.isFunction(item);
                });
                vItemFunction($scope, $uibModalInstance)
              } else if (angular.isFunction(customController)) {
                customController($scope, $uibModalInstance)
              }
            }
          }

          return $uibModal.open(tempUibModalOptions).result;
        }

        /*########################
        # formatDatePicker
        ########################*/
        var datePicker = {
          fnFormatIn: function(value){
            if (!value || value === '' || value == '-') return null;
            var vDate = value.split('/');
            return new Date(vDate[2],vDate[1]-1, vDate[0])
          }
        }
        function fnFormatDatePicker(ins) {
          if (!ins || ins === '') {
            return new Date();
          }
          return new Date(ins.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$3-$2-$1'));
        }

        /*########################
        # formatZeroBefore
        ########################*/
        function fnFormatZeroBefore(number) {
          var n = number.toString();
          return n.replace(/^(\d)$/, '0$1');
        }

        /*########################
        # funDocNumMaxLengthValidation
        ########################*/
        var documentNumber = {
          fnFieldsToValidate: function (documentType) {
            var vFieldType = 'onlyNumber,alfanumerico';
            var vFieldTypeDisabled = 'alfanumerico';
            var vMaxLength;
            switch (documentType) {
              case constants.documentTypes.dni.Codigo: //DNI
                vMaxLength = 8;
                break;
              case constants.documentTypes.ruc.Codigo: //RUC
                vMaxLength = 11;
                break;
              case constants.documentTypes.pasaporte.Codigo: //PEX
                vFieldTypeDisabled = 'onlyNumber';
                vMaxLength = 18;
                break;
              case constants.documentTypes.carnetExtrajeria.Codigo: //CEX
                vFieldTypeDisabled = 'onlyNumber';
                vMaxLength = 13;
                break;
              case constants.documentTypes.cip.Codigo: //CIP: NO DEFINIDO
                vMaxLength = 20;
                break;
              default: //POR DEFECTO EL MAXLENGHT MAYOR
                vMaxLength = 20;
            }
            return {
              fieldType: vFieldType,
              fieldTypeDisabled: vFieldTypeDisabled,
              maxLength: vMaxLength
            };
          },
          fnFieldsToValidate1: function (documentType) {
            var vFieldType = 'onlyNumber,alfanumerico';
            var vFieldTypeDisabled = 'alfanumerico';
            var vMaxLength;
            switch (documentType) {
              case constants.documentTypes.dni.Codigo: //DNI
                vMaxLength = 8;
                break;
              case constants.documentTypes.ruc.Codigo: //RUC
                vMaxLength = 11;
                break;
              case constants.documentTypes.pasaporte.Codigo: //PEX
                vFieldTypeDisabled = 'onlyNumber';
                vMaxLength = 13;
                break;
              case constants.documentTypes.carnetExtrajeria.Codigo: //CEX
                vFieldTypeDisabled = 'onlyNumber';
                vMaxLength = 13;
                break;
              default: //POR DEFECTO EL MAXLENGHT MAYOR
                vMaxLength = 13;
            }
            return {
              fieldType: vFieldType,
              fieldTypeDisabled: vFieldTypeDisabled,
              maxLength: vMaxLength
            };
          },
          fnFieldsValidated: function (obj, documentType, validationOption) {
            var vArrayFnFieldsToValidate = [
              documentNumber.fnFieldsToValidate(documentType),
              documentNumber.fnFieldsToValidate1(documentType)
            ];
            var vOption = 0;
            if (validationOption) vOption = validationOption;
            var vValidate = vArrayFnFieldsToValidate[vOption];
            obj.DOCUMENT_NUMBER_FIELD_TYPE = vValidate.fieldType;
            obj.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED = vValidate.fieldTypeDisabled;
            obj.DOCUMENT_NUMBER_MAX_LENGTH = vValidate.maxLength;
          }
        };

        /*########################
        # funDocNumMaxLength
        ########################*/
        function fnDocNumMaxLength(documentType) {
          var vDocNumMaxLength;
          switch (documentType) {
            case constants.documentTypes.dni.Codigo:
              vDocNumMaxLength = 8;
              break;
            case constants.documentTypes.ruc.Codigo:
              vDocNumMaxLength = 11;
            break;
            default:
              vDocNumMaxLength = 13;
          }
          return vDocNumMaxLength;
        }
      /*########################
      # date
      ########################*/
      var date = {
        fnDiff: function(dateValue1, dateValue2, option){
          if (typeof dateValue1 === 'string') dateValue1 = date.fnStringToDate(dateValue1);
          if (typeof dateValue2 === 'string') dateValue2 = date.fnStringToDate(dateValue2);

          switch(option.toUpperCase()){
            case 'D':
              var days = (1000 * 60 * 60 * 24);
              var diff = (dateValue2 - dateValue1) / days;
              break;
            case 'M':
              var vYear = (dateValue2.getFullYear() - dateValue1.getFullYear()) * 12,
                  vMonth = dateValue2.getMonth() - dateValue1.getMonth(),
                  diff = vYear + vMonth;
              break;
          }
          return diff;
        },
        fnStringToDate: function(dateValue){
          if (!dateValue || dateValue === '' || dateValue == '-') return null;
          var vSlash = dateValue.indexOf('/') > 1,
              vOptSplit = vSlash
                            ? '/'
                            : '-',
              vDate = dateValue.split(vOptSplit);
          return new Date(vDate[2],vDate[1]-1, vDate[0]);
        },
        fnAdd: function(dateValue, number, option){
          var vDateValue = angular.copy(dateValue);
          if (typeof vDateValue === 'string') vDateValue = date.fnStringToDate(vDateValue);
          switch(option.toUpperCase()){
            case 'D':
              vDateValue.setDate(vDateValue.getDate() + number);
              break;
            case 'M':
              vDateValue.setMonth(vDateValue.getMonth() + number);
              break;
            case 'Y':
              vDateValue.setFullYear(vDateValue.getFullYear() + number);
              break;
          }
          return vDateValue;
        },
        fnSubtract: function(dateValue, number, option){
          var vDateValue = angular.copy(dateValue);
          if (typeof vDateValue === 'string') vDateValue = date.fnStringToDate(vDateValue);
          switch(option.toUpperCase()){
            case 'D':
              vDateValue.setDate(vDateValue.getDate() - number);
              break;
            case 'M':
              var vNewMonth = vDateValue.getMonth() - number,
                  vLastDayNewMonth = new Date(vDateValue.getFullYear(), vNewMonth + 1, 0);

              if (vDateValue.getDate() > vLastDayNewMonth.getDate()){
                vDateValue.setDate(vLastDayNewMonth.getDate());
              }
              vDateValue.setMonth(vNewMonth);
              break;
            case 'Y':
              vDateValue.setFullYear(vDateValue.getFullYear() - number);
            return vDateValue;
          }
        }
      };



        /*########################
        # substractDays
        ########################*/
        function fnSubtractDays(date, days) {
          date.setDate(date.getDate() - days);
          return date;
        }
        /*########################
        # addDays
        ########################*/
        function fnAddDays(date, days) {
          date.setDate(date.getDate() + days);
          return date;
        }
        /*########################
        # fnStartsWith
        ########################*/
        function fnStartsWith(cadena, startsWith) {
          var vResult = cadena.substring(0, 2).indexOf(startsWith) >= 0;
          return vResult
        }

        /*########################
        # fnShowNaturalRucPerson
        ########################*/
        function fnShowNaturalRucPerson(documentType, documentNumber) {
          var vResult = (documentType == constants.documentTypes.ruc.Codigo && fnStartsWith(documentNumber, '20'));
          return !vResult;
        }


        function isAdminEmisaApp(claimsRoles) {
          var emisa = _.find(claimsRoles, function (rol) {
            return rol.nombreAplicacion === constants.app.emisa.name
          });
          return emisa.codigoRol === constants.app.emisa.adminCode;
        }

        function isAdminAdmPortalesApp(claimsRoles) {
          var admPortal = _.find(claimsRoles, function (rol) {
            return rol.nombreAplicacion === constants.app.admportales.name;
          });
          return admPortal ? admPortal.codigoRol ===  constants.app.admportales.adminCode:false;
        }

        // Abrir PDF en nueva ventana
        function fnOpenFileBase64(fileBase64, fileName) {
          if (helper.isiOS() || helper.isIE() || helper.isEDGE()) {
            fnDownloadPDFBase64(fileBase64, fileName);
          } else {
            var pdfWindow = window.open('', '_blank');
            setTimeout(function() {
              pdfWindow.document.write("<iframe width='100%' style='margin: -8px;border: none;' height='100%' src='data:application/pdf;base64, " + encodeURI(fileBase64) + "'></iframe>");
              pdfWindow.document.title = fileName;
            }, 0);
          }
        }

        // Descargar PDF
        function fnDownloadPDFBase64(base64, fileName, type) {
          try {
            const mimeType = type === 'pdf' ? 'application/pdf' : type;
            const blobFile = b64toBlob(base64, mimeType);
            fnDownloadBlob(blobFile, fileName);
          } catch (error) { 
            console.log(error.message);
          }

      }
			/*########################
      # formatZeroBefore
      ########################*/
      function fnFormatZeroBefore(number){
        var n = number.toString();
        return n.replace(/^(\d)$/, '0$1');
      }
      /*########################
      # funDocNumMaxLengthValidation
      ########################*/
      var documentNumber = {
        fnFieldsToValidate: function(documentType){
          var vFieldType = 'onlyNumber,alfanumerico';
          var vFieldTypeDisabled = 'alfanumerico';
          var vMinLength = 4;
          var vMaxLength;

          switch(documentType) {
            case constants.documentTypes.dni.Codigo: //DNI
              vMaxLength = 8;
              vMinLength = 8;
              break;
            case constants.documentTypes.ruc.Codigo: //RUC
              vMaxLength = 11;
              vMinLength = 11;
              break;
            case constants.documentTypes.pasaporte.Codigo: //PEX
              vFieldTypeDisabled = 'onlyNumber';
              vMaxLength = 18;
              break;
            case constants.documentTypes.carnetExtrajeria.Codigo: //CEX
              vFieldTypeDisabled = 'onlyNumber';
              vMaxLength = 13;
              break;
            case constants.documentTypes.cip.Codigo: //CIP: NO DEFINIDO
              vMaxLength = 20;
              break;
            default: //POR DEFECTO EL MAXLENGHT MAYOR
              vMaxLength = 20;
          }
          return {
            fieldType:          vFieldType,
            fieldTypeDisabled:  vFieldTypeDisabled,
            maxLength:          vMaxLength,
            minLength:          vMinLength
          };
        },
        fnFieldsToValidate1: function(documentType){
          var vFieldType = 'onlyNumber,onlyLetterNumber';
          var vFieldTypeDisabled = 'onlyLetterNumber';
          var vMaxLength = 13;
          var vMinLength = 4;

          switch(documentType) {
            case constants.documentTypes.dni.Codigo: //DNI
              vMaxLength = 8;
              vMinLength = 8;
              break;
            case constants.documentTypes.ruc.Codigo: //RUC
              vMaxLength = 11;
              vMinLength = 11;
              break;
            case constants.documentTypes.carnetExtrajeria.Codigo: //CEX
            case constants.documentTypes.cip.Codigo: //CIP: NO DEFINIDO
              vFieldTypeDisabled = 'onlyNumber';
              break;
            case constants.documentTypes.pasaporte.Codigo: //PEX
              vMaxLength = 15;
              vMinLength = 1;
              vFieldTypeDisabled = 'onlyNumber';
              break;
            default:
              vFieldTypeDisabled = 'onlyNumber';
          }
          return {
            fieldType:          vFieldType,
            fieldTypeDisabled:  vFieldTypeDisabled,
            maxLength:          vMaxLength,
            minLength:          vMinLength
          };
        },
        fnFieldsValidated: function(obj, documentType, validationOption){
          var vValidate = {};
          vValidate = (validationOption == 1) ?
            documentNumber.fnFieldsToValidate1(documentType) :
            documentNumber.fnFieldsToValidate(documentType);

          obj.DOCUMENT_NUMBER_FIELD_TYPE = vValidate.fieldType;
          obj.DOCUMENT_NUMBER_FIELD_TYPE_DISABLED = vValidate.fieldTypeDisabled;
          obj.DOCUMENT_NUMBER_MAX_LENGTH = vValidate.maxLength;
          obj.DOCUMENT_NUMBER_MIN_LENGTH = vValidate.minLength;
          obj.PATTERN = vValidate.pattern;
        }
      };
      /*########################
      # funDocNumMaxLength
      ########################*/
      function fnDocNumMaxLength(documentType){
        var vDocNumMaxLength;
        switch(documentType) {
          case constants.documentTypes.dni.Codigo:
            vDocNumMaxLength = 8;
            break;
          case constants.documentTypes.ruc.Codigo:
            vDocNumMaxLength = 11;
            break;
          default:
            vDocNumMaxLength = 13;
        }
      }

        function fnDownloadBlob(blob, fileName) {
          if (helper.isiOS() || helper.isIE() || helper.isEDGE()) {
            FileSaver.saveAs(blob, fileName);
          } else {
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style.cssText = 'display: none';
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          }
        }
        function fnFileToBase64(resource){
          var file = resource
          return $q(function (resolve, reject) {
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onloadend = function () {
                var binaryData = reader.result;
                var base64String = binaryData.split(',');
                resolve(base64String[1]);
              }
              reader.onerror = function (error) { reject(error)};
          });
        }

        this.fnShowModal = fnShowModal;
        this.date = date;
        this.datePicker = datePicker;
        this.fnFormatZeroBefore = fnFormatZeroBefore;
        this.documentNumber = documentNumber;
        this.fnDocNumMaxLength = fnDocNumMaxLength;
        this.fnSubtractDays = fnSubtractDays;
        this.fnAddDays = fnAddDays;
		this.fnConvertBase64ToFile = fnConvertBase64ToFile; //MSAAVEDRA 20211112
        this.fnDownloadFromFile = fnDownloadFromFile; //MSAAVEDRA 20211112
        this.fnStartsWith = fnStartsWith;
        this.fnShowNaturalRucPerson = fnShowNaturalRucPerson;
        this.fnReturnSeveralPromise = fnReturnSeveralPromise;
        this.fnDownloadFileBase64 = fnDownloadFileBase64;
        this.isAdminEmisaApp = isAdminEmisaApp;
        this.isAdminAdmPortalesApp = isAdminAdmPortalesApp;
        this.getPDF = getPDF;
        this.fnDownloadPDFBase64 = fnDownloadPDFBase64;
        this.fnOpenFileBase64 = fnOpenFileBase64;
        this.fnDownloadBlob = fnDownloadBlob;
        this.fnFileSerializeToBase64 = fnFileToBase64;
      }]);
  });
