'use strict';

define([
  'angular', 'constants', 'nsctr_constants',
  'nsctrFactoryJs', 'nsctrServiceJs',
  'nsctrNoResultFilterJs',
  'nsctrModalSendEmailFilesJs'
], function (angular, constants, nsctr_constants) {

  var appNsctr = angular.module('appNsctr');

  appNsctr.controller('nsctrSearchedProofsController',
    ['$rootScope', '$scope', '$window', '$state', '$stateParams', 'mainServices', 'nsctrFactory',
      'nsctrService', '$uibModal', 'mModalConfirm', '$timeout', 'mModalAlert', 'gaService',
      function ($rootScope, $scope, $window, $state, $stateParams, mainServices, nsctrFactory,
        nsctrService, $uibModal, mModalConfirm, $timeout, mModalAlert, gaService) {
        /*########################
        # _self
        ########################*/
        var _self = this;
        var fnSearchProofs_searchedProofs;
        /*########################
        # $onInit
        ########################*/
        _self.$onInit = function () {

          _self.data = _self.data || {};
          _self.message = 'No hay resultados para los datos ingresados en la búsqueda. Intente nuevamente.';
          _self.MODULE = $state.current.module;
          _self.IS_MODULE = nsctrService.fnIsModule(_self.MODULE);
          _self.STATE_PARAMS = new nsctrFactory.object.oStateParams();
          _self.USER = new nsctrFactory.object.oUser();

          _self.noResultFilter = new nsctrFactory.object.oNoResultFilter(true);
          _self.data.dataList = new nsctrFactory.object.oDataList();
          _self.data.mPagination = new nsctrFactory.object.oPagination();

          _self.CHANGE_STATE = {
            EC: 'EC', //ELIMINAR CONSTANCIA
            RE: 'RE', //REHABILITAR
            ER: 'ER', //ELIMINAR RECIBO
            ECR: 'ECR', //ELIMIBAR CONSTANCIA Y RECIBO
            NA: 'NA',  //NA
            CA: 'CA' // CONSTANCIA ANULADA - NO MOSTRAR ICONO REHABILITAR
          };

          fnSearchProofs_searchedProofs = $rootScope.$on('fnSearchProofs_searchedProofs', function (event, params, isPagination) {
            if (isPagination) {
              _changePage();
            } else {
              _self.PARAMS_PROOFS_SEARCHER = params;
              _clearSearchedProofs();
              _searchProofs(params);
            }
          });
          _self.name = (window.location.hash.split("/")[3] == "searchProofs") ? "CONSULTA_CONSTANCIAS" : "PROCESOS_CONSTANCIAS";
          localStorage.setItem('typeName', _self.name);
          _self.segurity = nsctrFactory.validation._filterData(JSON.parse(localStorage.getItem("nsctrSubMenu" + _self.MODULE.appCode)), _self.name, "nombreCabecera");
          _self.segurityMailMass = nsctrFactory.validation._filterData(_self.segurity.items, "ENVIAR_EMAIL_MASIVO", "nombreCorto");
          _self.segurityMail = nsctrFactory.validation._filterData(_self.segurity.items, "ENVIAR_EMAIL_INDIVIDUAL", "nombreCorto");
          _self.segurityPayroll = nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_PLANILLA", "nombreCorto");
          _self.seguritycertificate = nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_CERTIFICADO", "nombreCorto");
          _self.segurityCargo = nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_CARGO", "nombreCorto");
          _self.segurityCard = nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_CARTA", "nombreCorto");
          _self.segurityRecibo = nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_RECIBO", "nombreCorto");
          _self.segurityDelete = nsctrFactory.validation._filterData(_self.segurity.items, "ANULAR_CONSTANCIA/RECIBO", "nombreCorto")
        };

        _self.fnInTechnicalControl = function (number) {
          return number === '-1';
        };

        _self.validateSegurity = function (itemProofs, type) {
          return (type == 1 ? itemProofs.enableUrlPensionReceipt : itemProofs.enableUrlHealthReceipt) == 'S' ?
            nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_RECIBO", "nombreCorto") :
            nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_RECIBO_ANULADO", "nombreCorto");
        }

        _self.validateConstancia = function (itemProofs) {
          return itemProofs.enableUrlConstancy == 'S' && itemProofs.state == '1' ?
            nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_CONSTANCIA", "nombreCorto") :
            nsctrFactory.validation._filterData(_self.segurity.items, "DESCARGAR_CONSTANCIA_ANULADA", "nombreCorto");
        }
        /*########################
        # fnSearchProofs_searchedProofs
        ########################*/
        function _clearSearchedProofs(isPagination) {
          _self.data.dataList.setDataList();
          _self.data.mPagination.setTotalItems(0);
          if (!isPagination) _self.data.mPagination.setCurrentPage(1);
        }
        function _paramsSearchProofs(params) {
          params.currentPage = _self.data.mPagination.currentPage;
          return params;
        }
        function _searchProofs(params) {
          _self.noResultFilter.setNoResultFilter(false, false);
          var vParams = _paramsSearchProofs(params);
          nsctrFactory.common.proxyConstancy.ServicesListPagingConstancy(vParams, true).then(function (response) {
            if (response.operationCode == constants.operationCode.success) {
              if (response.data.list.length > 0) {
                _self.data.dataList.setDataList(response.data.list, response.data.totalRows, 0, response.data.totalPages);
                _self.data.mPagination.setTotalItems(_self.data.dataList.totalItemsPagination);
              } else {
                _self.message = response.data.message;
                _self.noResultFilter.setNoResult(true);
              }
            } else {
              _self.message = response.data.message;
              _self.noResultFilter.setNoResult(true);
            }
          }, function (error) {
            _self.message = response.data.message;
            _self.noResultFilter.setNoResult(true);
          });
        }
        function _changePage() {
          _clearSearchedProofs(true);
          _searchProofs(_self.PARAMS_PROOFS_SEARCHER);
        }

        /*########################
        # fnClearSearchedProofs_searchedProofs
        ########################*/
        var fnClearSearchedProofs_searchedProofs = $rootScope.$on('fnClearSearchedProofs_searchedProofs', function (event) {
          _self.PARAMS_PROOFS_SEARCHER = {};
          _clearSearchedProofs();
          _self.noResultFilter.setNoResultFilter(true, false);
        });
        /*########################
        # fnChangePage
        ########################*/
        _self.fnChangePage = function () {
          _changePage();
          // $rootScope.$broadcast('fnSearchProofs_proofsSearcher', true);
        };
        /*#########################
        # fnOpenUrl
        #########################*/
        _self.fnOpenUrl = function (e, url) {
          if (url) $window.open(url, '_blank');
          var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
          setTimeout(function () {
            var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
            gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + '- Click Identificador de Constancia ', gaLabel: 'Botón: Descargar' });
          }, 100);
        }
        _self.fnDownloadConstancia = function (constancyIdentity) {
          nsctrFactory.common.proxyConstancy.ServicesDownloadConstancy(constancyIdentity, true).then(function (response) {
            mainServices.fnDownloadFileBase64(response.data, "pdf", 'Constancia_' + constancyIdentity, false);
          });
        }

        /*#########################
        # showField
        #########################*/
        _self.fnShowFields = function (option, item) {
          var vShowField = false,
            vMOVEMENT_TYPE = nsctr_constants.movementType;
          switch (option) {
            case 'S': //STATE
              vShowField = vMOVEMENT_TYPE.manualProof.codeTypeConstancy == item.codeTypeConstancy;
              break;
            case 'R': //RECEIPT
              vShowField = vMOVEMENT_TYPE.declaration.codeTypeConstancy == item.codeTypeConstancy || vMOVEMENT_TYPE.inclusion.codeTypeConstancy == item.codeTypeConstancy || vMOVEMENT_TYPE.exclusion.codeTypeConstancy == item.codeTypeConstancy;
              break;
            case 'I': //ICON_STATE
              vShowField = _self.CHANGE_STATE.NA !== item.option && _self.CHANGE_STATE.CA !== item.option;
              break;
            case 'B': //BTN_SEE_MORE
              vShowField = (vMOVEMENT_TYPE.declaration.codeTypeConstancy == item.codeTypeConstancy || vMOVEMENT_TYPE.inclusion.codeTypeConstancy == item.codeTypeConstancy || vMOVEMENT_TYPE.exclusion.codeTypeConstancy == item.codeTypeConstancy) && item.flgMostrarBotonVerMas;
              break;
          }
          return vShowField;
        };
        /*#########################
        # getClassMovementType
        #########################*/
        _self.getClassMovementType = function (item) {
          var vClass = '',
            vMOVEMENT_TYPE = nsctr_constants.movementType;

          switch (item.codeTypeConstancy) {
            case vMOVEMENT_TYPE.inclusion.codeTypeConstancy:
              vClass = 'gBgcOrange1';
              break;
            case vMOVEMENT_TYPE.declaration.codeTypeConstancy:
              vClass = 'gBgcBlue2';
              break;
            case vMOVEMENT_TYPE.proof.codeTypeConstancy:
              vClass = 'gBgcPurple1';
              break;
            case vMOVEMENT_TYPE.replacement.codeTypeConstancy:
              vClass = 'gBgcOrange3';
              break;
            case vMOVEMENT_TYPE.manualProof.codeTypeConstancy:
              vClass = 'gBgcOrange4';
              break;
            default:
              vClass = 'gBgcBlack1';
          }
          return vClass;
        };
        /*########################
        # fnShowSendEmail
        ########################*/
        function _fileListItem(item) {
          var vFiles = [
            {
              type: nsctr_constants.pension.code,
              description: (_self.IS_MODULE.lifeLaw)
                ? "Recibo"
                : "Recibo Pensión",
              number: item.pensionReceiptNumber,
              url: item.urlPensionReceipt
            },
            {
              type: nsctr_constants.health.code,
              description: "Recibo Salud",
              number: item.healthReceiptNumber,
              url: item.urlHealthReceipt
            },
            {
              type: nsctr_constants.movementType.proof.operationType,
              description: "Constancia",
              number: item.constancyNumber,
              url: item.urlConstancy
            },
            {
              type: nsctr_constants.certificate.code,
              description: "Certificado",
              number: item.certificateNumber,
              url: item.urlCertificate
            },
            {
              type: nsctr_constants.letter.code,
              description: "Carta",
              number: item.letterNumber,
              url: item.urlLetter
            },
            {
              type: nsctr_constants.charge.code,
              description: "Cargo",
              number: item.cargoNumber,
              url: item.urlCargo
            }
          ];

          var vFileList = {
            proofNumber: item.constancyNumber,
            fileList: vFiles.filter(function (elem, key) {
              return elem.url;
            })
          };
          return vFileList;
        }
        function _fileListMassive() {
          var vDataList = _self.data.dataList.list,
            vFileList = vDataList.reduce(function (previous, current, index, array) {
              if (current.mCheck) {
                var vItem = _fileListItem(current);
                previous.push(vItem);
              }
              return previous;
            }, []);

          return vFileList;
        };
        _self.fnShowSendEmail = function (sendType, item) {
          if ((sendType === 'M') && _fileListMassive().length < 1) {
            mModalAlert.showError("Debe seleccionar al menos un registro", 'ENVÍO DE MAIL');
            return;
          }
          _self.modalSendEmailFiles = {
            mainData: {
              paramsSendEmail: {
                clientName: (_self.STATE_PARAMS['client'])
                  ? _self.STATE_PARAMS['client'].clientName || ''
                  : '',
                fileList: (sendType === 'I')
                  ? [_fileListItem(item)]
                  : _fileListMassive()
              },
              constancyNumber: item ? item.constancyIdentity : null
            },
            data: {}
          };
          var vOptModal = nsctrService.fnDefaultModalOptions($scope, {
            template: '<nsctr-modal-send-email-files main-data="$ctrl.modalSendEmailFiles.mainData" data="$ctrl.modalSendEmailFiles.data"></nsctr-modal-send-email-files>'
          });
          vOptModal.controller = ['$scope', '$uibModalInstance', '$uibModal',
            function ($scope, $uibModalInstance, $uibModal) {
              /*########################
              # fnCloseModal_modalSendEmailFiles
              ########################*/
              $scope.$on('fnCloseModal_modalSendEmailFiles', function (event, actionButton) {
                if (actionButton == constants.actionButton.cancel) {
                  $uibModalInstance.dismiss('cancel');
                } else {
                  $uibModalInstance.close(actionButton);
                }
              });
            }];
          $uibModal.open(vOptModal);
        };
        /*#########################
        # fnChangeState
        #########################*/
        function _paramChangeState(item, action, reasonCanceledConstancy, ReasonCanceledReceipt) {
          var vMOVEMENT_TYPE = nsctr_constants.movementType,
            vParams = {
              constancyNumber: item.constancyNumber,
              userId: item.userId,
              flgDeleteTrab: '',
              action: action || item.option,
              reasonCanceledConstancy: reasonCanceledConstancy,
              codeTypeConstancy: item.codeTypeConstancy,
              listPolicyConstancy: []
            };

          function _getItemListPolicyConstancy(option) {
            var vItem = {
              CiaId: nsctr_constants[option].codeCompany,
              RamoId: nsctr_constants[option].codeRamo,
              PolicyNumber: item[option + 'PolicyNumber'],
              ApplicationNumber: item[option + 'ApplicationNumber'],
              SptoApplicationNumber: item[option + 'ApplicationSupplementNumber'],
              SptoNumber: item[option + 'SupplementNumber'],
              ReasonCanceledReceipt: ReasonCanceledReceipt,
              ReceiptNumber: item[option + 'ReceiptNumber']
            };
            return vItem;
          }

          if (vMOVEMENT_TYPE.manualProof.codeTypeConstancy !== item.codeTypeConstancy) {
            vParams.flgDeleteTrab = $scope.modalChangeState.mRadioOpcion || '';
            if ($scope.modalChangeState.mCheckPension) {
              var vPension = _getItemListPolicyConstancy('pension');
              vParams.listPolicyConstancy.push(vPension);
            }
            if ($scope.modalChangeState.mCheckSalud) {
              var vHealth = _getItemListPolicyConstancy('health');
              vParams.listPolicyConstancy.push(vHealth);
            }
          }
          return vParams;
        }

        function _servicesChangeStateConstancy(item) {
          var action = "", reasonCanceledConstancy = "", reasonCanceledReceipt = "";

          if (item.option != _self.CHANGE_STATE.RE && item.option != _self.CHANGE_STATE.EC && $scope.modalChangeState.mRadioOpcion != "SI") {
            if (_self.MODULE.appCode !== "VLE") {
              if (_self.CountReceipt == 1) {
                action = _self.CHANGE_STATE.ECR;
                reasonCanceledConstancy = $scope.modalChangeState.motivo;
                reasonCanceledReceipt = $scope.modalChangeState.motivo;
                if ($scope.modalChangeState.mRadioOpcion == "NO") {
                  action = _self.CHANGE_STATE.EC;
                  reasonCanceledConstancy = $scope.modalChangeState.motivo;
                }
              }
              else {
                if ($scope.modalChangeState.mRadioOpcion == "NO") {
                  action = _self.CHANGE_STATE.EC;
                  reasonCanceledConstancy = $scope.modalChangeState.motivo;
                }
                else if ($scope.modalChangeState.mCheckPension && $scope.modalChangeState.mCheckSalud) {
                  action = _self.CHANGE_STATE.ECR;
                  reasonCanceledConstancy = $scope.modalChangeState.motivo;
                  reasonCanceledReceipt = $scope.modalChangeState.motivo;
                }
                else {
                  action = _self.CHANGE_STATE.ER;
                  reasonCanceledReceipt = $scope.modalChangeState.motivo;
                }
              }
            }
            else {
              if ($scope.modalChangeState.mCheckPension) {
                action = _self.CHANGE_STATE.ECR;
                reasonCanceledConstancy = $scope.modalChangeState.motivo;
                reasonCanceledReceipt = $scope.modalChangeState.motivo;
              }
              else if($scope.modalChangeState.mRadioOpcion == 'NO'){
                action = _self.CHANGE_STATE.EC;
                reasonCanceledConstancy = $scope.modalChangeState.motivo;
              }
            }
          }
          else if (item.option == _self.CHANGE_STATE.EC) {
            reasonCanceledConstancy = $scope.modalChangeState.motivo;
          }


          var vParams = _paramChangeState(item, action, reasonCanceledConstancy, reasonCanceledReceipt);

          nsctrFactory.common.proxyConstancy.ServicesChangeStateConstancy(vParams, true).then(function (response) {
            if (response.operationCode == constants.operationCode.success) {
              mModalAlert.showSuccess('Se realizó la operación con éxito', '').then(function (response) {
                _self.fnChangePage();
              });
            } else if (response.operationCode == constants.operationCode.code900) {
              mModalAlert.showWarning(response.message, 'ALERTA').then(function (response) {
                _self.fnChangePage();
              });
            } else {
              mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
            }
          }, function (error) {
            mModalAlert.showError(nsctr_constants.message.genericError, 'ERROR');
          });
        }

        function _showReceipt(option) {
          return {
            ECR: _self.CHANGE_STATE.ECR == option,
            ER: _self.CHANGE_STATE.ER == option
          };
        }

        function _countReceipt(item) {
          _self.CountReceipt = 0;
          if (item.pensionReceiptNumber) {
            _self.CountReceipt++;
          }

          if (item.healthReceiptNumber) {
            _self.CountReceipt++;
          }
        }
        _self.fnSeeReason = function (number, reasonCanceled, dateCanceled, userCanceledReceipt, systemName, type) {
          $scope.itemReason = {};

          var uibModalOptions = {
            scope: $scope,
            size: 'md',
          };
          var modalOptions = {
            showIcon: 'warning',
            title: 'Detalle de anulación',
            templateContent: 'tplMotivo.html',
            showCancelButton: false,
            showConfirmButton: false,
          };

          $scope.itemReason.type = type == 'R' ? 'RECIBO' : 'CONSTANCIA';
          $scope.itemReason.number = number;
          $scope.itemReason.reasonCanceled = reasonCanceled;
          $scope.itemReason.dateCanceled = dateCanceled;
          $scope.itemReason.userCanceledReceipt = userCanceledReceipt;
          $scope.itemReason.systemName = systemName;


          mainServices.fnShowModal(uibModalOptions, modalOptions).then(function (result) {
            _servicesChangeStateConstancy(item);
          });
        }

        _self.fnChangeState = function (item, isVidaley) {
          $scope.modalChangeState = {};
          $scope.modalChangeState.item = item;

          _countReceipt(item);
          switch (item.option) {
            case _self.CHANGE_STATE.EC:
              $uibModal.open({
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'md',
                windowTopClass: 'modal--md fade',
                templateUrl: '/nsctr/app/common/components/modalChangeState/modalChangeStateConstancy.html',
                controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
                  scope.close = function () {
                    $uibModalInstance.close();
                  };
                  scope.send = function (value) {
                    scope.frmModalChangeState.markAsPristine();

                    if (scope.frmModalChangeState.$valid) {
                      _servicesChangeStateConstancy(item);
                      $uibModalInstance.close();
                    }
                  }
                }]
              })
              break;
            case _self.CHANGE_STATE.RE:
              mModalConfirm.confirmWarning('', '¿DESEA HABILITAR LA CONSTANCIA ' + item.constancyNumber + '?', 'ACEPTAR').then(function (response) {
                _servicesChangeStateConstancy(item);
              }, function (otherOptions) {
                return false;
              });
              break;
            default:
              var urlTemplate =  isVidaley ? 
              '/nsctr/app/common/components/modalChangeState/modalChangeStateVL.html'
              : '/nsctr/app/common/components/modalChangeState/modalChangeState.html';
              urlTemplate = _self.CountReceipt == 0 ? '/nsctr/app/common/components/modalChangeState/modalChangeStateConstancy.html' : urlTemplate;
              $scope.SHOW_RECEIPT = _showReceipt(item.option);
              $scope.modalChangeState.mRadioOpcion = ($scope.SHOW_RECEIPT.ECR || $scope.SHOW_RECEIPT.ER) ? 'NA' : 'SI';
              
              $uibModal.open({
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                scope: $scope,
                size: 'md',
                windowTopClass: 'modal--md fade',
                templateUrl: urlTemplate,
                controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
                  scope.close = function () {
                    $uibModalInstance.close();
                  };
                  scope.send = function (value) {
                    scope.frmModalChangeState.markAsPristine();

                    if (scope.frmModalChangeState.$valid) {
                      _servicesChangeStateConstancy(item);
                      $uibModalInstance.close();
                    }
                  }
                }]
              })
          }
        };

        /*#########################
        # fnSeeMore
        #########################*/
        _self.fnSeeMore = function (item) {
          var textToAnalytics = nsctrService.fnSearchUrlforGoogleAnalytics();
          setTimeout(function () {
            var appCode = window.localStorage['appOrigin'] ? window.localStorage['appOrigin'] : 'OIM'
            gaService.add({ gaCategory: appCode + ' - NSCTR', gaAction: textToAnalytics + '- Click Botón Ver mas ', gaLabel: 'Botón: Ver mas' });
          }, 100);

          var vMOVEMENT_TYPE = nsctr_constants.movementType;
          var vNameRoute = "";

          switch (item.codeTypeConstancy) {
            case vMOVEMENT_TYPE.inclusion.codeTypeConstancy:
              vNameRoute = "InclusionGenerated";
              break;
            case vMOVEMENT_TYPE.declaration.codeTypeConstancy:
              vNameRoute = "DeclarationGenerated";
              break;
            case vMOVEMENT_TYPE.exclusion.codeTypeConstancy:
              vNameRoute = "ExclusionGenerated";
              break;
            default:
              break;
          }

          var vStateName = _self.MODULE.prefixState + vNameRoute;

          var vUrl = $state.href(vStateName, {
            client: _self.STATE_PARAMS['client'] || null,
            idProof: item.constancyIdentity
          });

          window.open(vUrl, '_blank');

        };

        function _paramsDownloadPayroll(item) {
          return {
            MovementNumber: item.movementNumber ||  item.movementNumberHealth,
            PolicyNumber: item.pensionPolicyNumber || item.healthPolicyNumber,
            CiaId: parseInt(item.pensionCiaId) || parseInt(item.healthCiaId),
            SptoNumber: parseInt(item.pensionSupplementNumber) ||  parseInt(item.healthSupplementNumber),
            ApplicationNumber: parseInt(item.pensionApplicationNumber) ||  parseInt(item.healthApplicationNumber),
            ApplicationSptoNumber: parseInt(item.pensionApplicationSupplementNumber) || parseInt(item.healthApplicationSupplementNumber),
          }
        }

        _self.downloadPayroll = function (item) {
          var params = _paramsDownloadPayroll(item);
          nsctrFactory.common.proxyConstancy.ServicesDownloadExcelPayroll(params, true)
            .then(function (response) {
              mainServices.fnDownloadFileBase64(response.file, response.mimeType, response.defaultFileName, true);
            });
        };

        /*#######################
        # DESTROY_EVENTS
        #######################*/
        $scope.$on('$destroy', function () {
          fnSearchProofs_searchedProofs();
          fnClearSearchedProofs_searchedProofs();
        });


      }]).component('nsctrSearchedProofs', {
        templateUrl: function ($state) {
          var vCurrentModule = $state.current.module,
            vTemplate = (vCurrentModule.code == nsctr_constants.lifeLaw.code)
              ? vCurrentModule.prefixState
              : 'searchedProofs';
          return '/nsctr/app/common/components/searchedProofs/' + vTemplate + '.component.html';
        },
        controller: 'nsctrSearchedProofsController',
        bindings: {
          data: '='
        }
      });


});
