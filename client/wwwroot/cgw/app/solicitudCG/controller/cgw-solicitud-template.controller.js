define([
  'angular', 'constants', '/cgw/app/factory/cgwFactory.js',
  '/scripts/mpf-main-controls/components/modalSteps/component/modalSteps.js',
  'modalSendEmail'
], function(ng, constants) {

  cgwSolicitudTemplateController.$inject = ['$scope', '$timeout', '$state', 'cgwFactory', '$rootScope', '$q', '$uibModal', 'mModalAlert', '$window', 'oimClaims', 'stepsService', '$stateParams'];

  function cgwSolicitudTemplateController($scope,$timeout, $state, cgwFactory, $rootScope, $q, $uibModal, mModalAlert, $window, oimClaims, stepsService, $stateParams) {

    var vm = this;

    var paramsMinsa = {
      flagIsMinsa: 1, 
      flagIsNotMinsa: 0,
      companyForMinsa: 1,
      productForMinsa: 'O'
    }; 

    $scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
      if(absOldUrl && typeof absOldUrl === 'string'){
        if(absOldUrl.substr(absOldUrl.length - 3) === "/#/") {
          $state.go('.', {step: 1, id: $stateParams.id}, {reload: true, inherit: false});
        }
      }
    });

    vm.$onInit = function() {

      $scope.formData = $rootScope.formData || {};
      $scope.saveInitData = false;
      $scope.noExisteAfiliadoMensaje = false;
      $scope.grupoAplicacion = parseInt(oimClaims.userSubType);
      if($scope.formData){
        $scope.formData.mPlaca= '';
        $scope.formData.mEmpresaInit = '';
        $scope.formData.mProducto='';
        $scope.formData.afiliadoSeleccionado='';
        $scope.formData.mFechaAccidente='';
        $scope.formData.mCausa='';
        $scope.formData.polizasArray ='';
        stepsService.addStep1('');
        stepsService.addStep2('');
        stepsService.addStep3('');
        stepsService.addStep4('');
        $scope.formData.flagIsMinsa = paramsMinsa.flagIsNotMinsa;
      }
      cgwFactory.getRole($scope.grupoAplicacion).then(function (response) {
        if (response.data) {
          $scope.roleId = response.data.roleId;
          $scope.roleCode = response.data.roleCode;

          if ($scope.roleCode === constants.module.cgw.roles.medExterno.description) {//MED Externo)
            window.location.href = '/';
          }

          if ($scope.roleCode === constants.module.cgw.roles.clinica.description) {
            cgwFactory.getSubMenu('OIMPROV').then(function (response) {
              var appSubMenu = _.find(response.data,
                function(item) {
                  return item.nombreCabecera && item.nombreCabecera.toUpperCase() === "APLICACIONES"
                });

              if (appSubMenu !== undefined)

                ng.forEach(appSubMenu.items, function(submenu) {
                  if (submenu.nombreCorto.toUpperCase() === "CARTA CARANTIA") setRuta(submenu);

                });
            }, function(error) {
              mModalAlert.showError("Error en getTicketUser", 'Error');
            });
          }

        }
      });

      $scope.formData = $rootScope.formData || {};
      $scope.formData.showComplaintRequiredSection = false;

      if (cgwFactory.getVariableSession('RutaCGW').length>0) {
        $scope.paramsTicket = {
          GrupoAplicacion: parseInt($scope.grupoAplicacion),
          Usuario: oimClaims.loginUserName.toUpperCase(),
          CodigoAgente: (parseInt($scope.codAgt) ? parseInt($scope.codAgt) : 0),
          DescriptionAgente: ''
        };
      } else {
        $scope.user = '';
        $scope.grupoAplicacion = 0;
        $scope.codAgt = 0;

        $scope.paramsTicket = {
          GrupoAplicacion: parseInt($scope.grupoAplicacion),
          Usuario: oimClaims.loginUserName.toUpperCase(),
          CodigoAgente: (parseInt($scope.codAgt) ? parseInt($scope.codAgt) : 0),
          DescriptionAgente: ''
        };
      }

      cgwFactory.getTicketUser($scope.paramsTicket, false).then(function(response) {
        if (response.data) {
          $scope.formData.getTicketUser = response.data;
          $scope.userRuc = response.data.userCode;
          $scope.formData.ruc = response.data.userCode;
          $scope.userLogin = response.data.userLogin;
          $scope.formData.roleCode = response.data.roleCode;
          $scope.formData.flagClinic = response.data.flagClinic;
          $scope.codeClinic = response.data.clinic;
          $scope.sepsCode = response.data.sepsCode;
          $scope.clinicBranchCode = response.data.clinicBranchCode;
          $scope.clinicCode = response.data.clinicCode;
          $scope.providerCodeSctr = response.data.providerCodeSctr;
          $scope.providerName = response.data.providerName;
          $scope.formData.userCreate = response.data.userCode;

          if ($scope.formData.roleCode === constants.module.cgw.roleCodeClinica) {
            $scope.mClinica = {
              providerCode: $scope.clinicCode,
              code: $scope.providerName,
              description: $scope.userLogin,
              rucNumber: $scope.userRuc
            };
            $scope.flagClinic = 1;
            $scope.isClinic = true;
          } else {
            $scope.flagClinic = 0;
          }

          if (!$scope.clinicCode) {
            $scope.formData.sucursalKey = cgwFactory.getVariableSession('sucursal');
            $scope.userRuc = $scope.formData.sucursalKey.documentNumber;
            $scope.formData.ruc = $scope.formData.sucursalKey.documentNumber;
            $scope.sepsCode = $scope.formData.sucursalKey.providerCode;
            $scope.clinicCode = $scope.formData.sucursalKey.code;
            $scope.providerName = response.data.providerName;
            $scope.providerNameClean = response.data.providerNameClean;

            if ($scope.formData.roleCode === constants.module.cgw.roleCodeClinica) {
              $scope.mClinica = {
                providerCode: $scope.clinicCode,
                code: $scope.providerName,
                description: $scope.userLogin,
                rucNumber: $scope.userRuc
              };
            }
          }
          ///cgw 1.2
          if (response.data.roleCode === constants.module.cgw.roles.consulta.description ||
            response.data.roleCode === constants.module.cgw.roles.coordinador.description) {
            window.location.href = '/';
          }
          //listado de empresas
          cgwFactory.GetAllCompanyBy('SGA', 'EPS').then(function(response) {
            // if (response.operationCode === constants.operationCode.success) {
            if (response.data) {
              $scope.empresasCGW = response.data;
            } else {
              if (!response.isValid) {
                var message = '';
                ng.forEach(response.brokenRulesCollection, function(error) {
                  message += error.description + ' ';

                });
                mModalAlert.showError(message, 'Error');
              }
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data, 'Error');
            });

          //listado de causas
          cgwFactory.GetAllCauseBy().then(function(response) {
            if (response.data) {
              $scope.causasCGW = response.data;
            } else {
              if (!response.isValid) {
                var message = '';
                ng.forEach(response.brokenRulesCollection, function(error) {
                  message += error.description + ' ';

                });
                mModalAlert.showError(message, 'Error');
              }
            }

          })
            .catch(function(err){
              mModalAlert.showError(err.data.message, 'Error');
            });

          //listado de tipo docs
          cgwFactory.GetAllType().then(function(response) {
            if (response.data) {
              $scope.typeDocsPowerEPS = response.data;
            } else {
              if (!response.isValid) {
                var message = '';
                ng.forEach(response.brokenRulesCollection, function(error) {
                  message += error.description + ' ';

                });
                mModalAlert.showError(message, 'Error');
              }
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data, 'Error');
            });

          //listado de tipo sex
          cgwFactory.GetAllSex().then(function(response) {
            if (response.data) {
              $scope.sexPowerEPS = response.data;
            } else {
              if (!response.isValid) {
                var message = '';
                ng.forEach(response.brokenRulesCollection, function(error) {
                  message += error.description + ' ';

                });
                mModalAlert.showError(message, 'Error');
              }
            }
          })
            .catch(function(err){
              mModalAlert.showError(err.data, 'Error');
            });
        }
      }, function(error) {
        mModalAlert.showError("Al obtener credenciales de acceso a Cartas de Garantía", "Error").then(function(response) {
          window.location.href = '/';
        }, function(error) {
          window.location.href = '/';
        });
      });

    };

    $scope.validateComplaintRequired = function(companyId, providerid, productId) {
      cgwFactory.ComplaintRequired(companyId, providerid, productId).then(function(response) {
        $scope.formData.showComplaintRequiredSection = response.newProcess;
        $scope.formData.newProcess = response.newProcess;
      }, function(error) {
        mModalAlert.showError("Error al validar la obligatoriedad de la cl&iacute;nica", "Error");
      });
    }

    $scope.fnOpenModalAfiliado = function () {
      if ($scope.formData.mProducto != undefined) {
        if ($scope.formData.mProducto.productCode == 'O') {
          if (($scope.formData.mPlaca != undefined && $scope.formData.mPlaca != "") && $scope.formData.seletedPoliza != undefined && ($scope.formData.mFechaAccidente != undefined && $scope.formData.mFechaAccidente != "")) {
            $scope.fnShowModalAfiliadoApertura();
          } else {
            mModalAlert.showWarning("Asegure de ingresar una Placa, Fecha de Accidente/Siniestro y seleccionar una Póliza correctamente", '');
          }
        } else {
          $scope.fnShowModal();
        }
      }
    }

    $scope.fnShowModalAfiliadoApertura = function () {
      $scope.searchAffiliatePolicy('', 1).then(function(response){
        if(response.listAffiliates.length > 0){
          $uibModal.open({
            backdrop: 'static',
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            templateUrl: "/cgw/app/solicitudCG/component/modalAffiliatePolicy.html",
            size: "md",
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            animation: true,
            resolve: {
              items: function () {
                return response
              }
            },
            controller: ['items', "$uibModalInstance", "$scope", "$q", function (items, $uibModalInstance, scope, $q) {
              scope.pagination = {
                maxSize: 5,
                sizePerPage: 1,
                currentPage: 1,
                totalRecords: 0
              }

              function select(item, index) {
                scope.selectedRowAffiliate = index;
                $scope.formData.afiliadoDataSelected = item;
                $scope.formData.afiliadoDataSelected.names = item.firstName + (item.secondName != "" ? " " + item.secondName : "");
                $scope.formData.afiliadoSeleccionado = item.fullName;
              }
              
              function editar(item) {
                var listPromises = [];
                listPromises.push($uibModalInstance.close());
                $q.all(listPromises).then(function (result) {
                  $scope.fnShowModalAfiliadoAperturaEdit(item);
                });
              }
              
              function search(dataFiltro, page) {
                if(dataFiltro != undefined){
                  $scope.searchAffiliatePolicy(dataFiltro.toUpperCase(), page).then(function (response) {
                    scope._items = response.listAffiliates;
                    scope._items.length = response.listAffiliates.length;
                    scope.pagination.totalRecords = response.countPages;
                  });
                }
              }
              
              function searchAffiliate() {
                var listPromises = [];
                listPromises.push($uibModalInstance.close());
                $q.all(listPromises).then(function (result) {
                  $scope.fnShowModal();
                });
              }
              
              function changePages (page){
                $scope.searchAffiliatePolicy('', page).then(function (response) {
                  scope._items = response.listAffiliates;
                  scope._items.length = response.listAffiliates.length;
                  scope.pagination.totalRecords = response.countPages;
                });
              }

              function refreshModal(){
                $scope.searchAffiliatePolicy('', 1).then(function (response) {
                  scope.mDatoAfiliadoPoliza = undefined;
                  scope._items = response.listAffiliates;
                  scope._items.length = response.listAffiliates.length;
                  scope.pagination.totalRecords = response.countPages;
                });
              }

              function closeModal() {
                $uibModalInstance.close();
              }

              scope.select = select;
              scope.editar = editar;
              scope.search = search;
              scope.searchAffiliate = searchAffiliate;
              scope._items = items.listAffiliates;
              scope._items.length = items.listAffiliates.length;
              scope.pagination.totalRecords = items.countPages;
              scope.pageChanged = changePages;
              scope.refreshModal = refreshModal;
              scope.closeModal = closeModal;
            }]
          });
        } else {
          $scope.fnShowModal();
        }
      });
    }

    $scope.searchAffiliatePolicy = function (dataFiltro, page) {
      var deferred = $q.defer();
      var listResult;
      var paramsSearch = {
        numPlaca: $scope.formData.mPlaca.toUpperCase(),
        polizaSelect: $scope.formData.mPoliza,
        fechaSiniestro: cgwFactory.formatearFecha($scope.formData.mFechaAccidente),
        datoFiltro: dataFiltro,
        numPagina: page
      }

      cgwFactory.Resource_GetListAffiliateByPolicy(paramsSearch, true).then(function (response) {
        listResult = (response.data != undefined ? response.data : undefined);
        deferred.resolve(listResult);
      });

      return deferred.promise;
    }

    $scope.fnShowModalAfiliadoAperturaEdit = function (item) {
      $uibModal.open({
        backdrop: 'static',
        backdropClick: true,
        dialogFade: false,
        keyboard: false,
        templateUrl: "/cgw/app/solicitudCG/component/modalAffiliatePolicyEdit.html",
        size: "md",
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        animation: true,
        controller: ["$uibModalInstance", "$scope", "$q", function ($uibModalInstance, scope, $q) {
          var listPromises = [];
          listPromises.push(changeLengthDoc(item.idDocumentType));

          $q.all(listPromises).then(function (result) {
            scope.mAffilPriNombre = item.firstName;
            scope.mAffilSegNombre = item.secondName;
            scope.mAffilApePat = item.lastName;
            scope.mAffilApeMat = item.motherLastName;
            scope.mAffilTipoDoc = { idDocumentType: (item.idDocumentType != 0 ? item.idDocumentType : null) };
            scope.mAffilNroDoc = item.documentNumber;
            scope.mAffilSexo = { key: (item.sex != "" ? item.sex : null) };
            scope.mAffilFechaNac = toDate(item.birthdate);
          });

          function changeLengthDoc(tipoDoc) {
            scope.mAffilNroDoc = undefined;
            switch (tipoDoc) {
              case 1:
                scope.docNumMaxLength = 8;
                break;
              case 2:
                scope.docNumMaxLength = 11;
                break;
              case 4:
                scope.docNumMaxLength = 12; scope.docNumMinLength = 6;
                break;
              default:
                scope.docNumMaxLength = 13;
            }
          }

          function closeModal() {
            var listPromises = [];
            listPromises.push($uibModalInstance.close());
            $q.all(listPromises).then(function (result) {
              $scope.formData.afiliadoDataSelected = undefined;
              $scope.formData.afiliadoSeleccionado = undefined;
              $scope.fnShowModalAfiliadoApertura();
            });
          }

          function updateAffiliatePolicy() {
            scope.frmAffiliatePolicyEdit.markAsPristine();

            if (scope.frmAffiliatePolicyEdit.$valid === true) {
              var params = {
                IdAffiliate: item.idAffiliate,
                FirstName: scope.mAffilPriNombre.toUpperCase(),
                SecondName: (scope.mAffilSegNombre != undefined ? scope.mAffilSegNombre.toUpperCase() : undefined),
                LastName: scope.mAffilApePat.toUpperCase(),
                MotherLastName: scope.mAffilApeMat.toUpperCase(),
                IdDocumentType: parseInt(scope.mAffilTipoDoc.idDocumentType),
                DocumentNumber: scope.mAffilNroDoc, 
                Sex: scope.mAffilSexo.key, 
                Birthdate: cgwFactory.formatearFecha(scope.mAffilFechaNac)
              }

              cgwFactory.Resource_UpdateAffiliatePolicy(params, true).then(function (response) {
                if(response.operationCode == 200) { 
                  $uibModalInstance.close();
                  mModalAlert.showSuccess(response.message, '', '').then(function (result) { 
                    $scope.fnShowModalAfiliadoApertura();
                  });
                } else{
                  mModalAlert.showWarning('Ocurrio un error al intentar actualizar la información de Afiliado', '');
                }
              }, function (error) {
                mModalAlert.showError(error.data.message, 'Error');
              });
            }
          }

          scope.openAffilCalendar = function(){
            scope.popupCalendar.opened = true;
          }

          scope.changeLengthDoc = changeLengthDoc;
          scope.updateAffiliatePolicy = updateAffiliatePolicy;
          scope.closeModal = closeModal;
          scope.dsAffilTipoDoc = $scope.typeDocsPowerEPS;
          scope.dsAffilSexo = $scope.sexPowerEPS;
          scope.popupCalendar = { opened: false };
          scope.format = 'dd/MM/yyyy';
        }]
      });
    }

    // Modals --- borrar despues
    // Buscar Afiliado
    $scope.fnShowModal = function() {
      $scope.affiliatePowerEPS = [];
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--500 modal--budget fade',
        templateUrl: 'tplModal.html',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
            $scope.closeModal = function(afiliadoSeleccionado) {
              if (afiliadoSeleccionado) {
                $scope.afiliadoPowerEPS = afiliadoSeleccionado.fullName;
              }
              $uibModalInstance.close();
            };
          }]
      });
    };

    // Crear Nuevo Afiliado
    $scope.fnShowModalCrearAfiliado = function() {
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'modal--500 modal--budget fade',
        templateUrl: 'modalCrearNuevoAfiliado.html',
        // template : '<mpf-modal-send-email action="action" data="emailData" close="close()"></mpf-modal-send-email>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', '$timeout',
          function($scope, $uibModalInstance, $uibModal, $timeout) {
            /*#########################
            # closeModal
            #########################*/
            $scope.closeModal = function() {
              // $uibModalInstance.dismiss('cancel');
              $uibModalInstance.close();
            };
          }]
      });
    };

    // Exito creando afiliado
    $scope.fnShowModalAfiliadoCreado = function(tipoDoc, numDoc, apelPat, apelMat, nombres, fechaNac, sex) {
      if (tipoDoc && numDoc && apelPat && apelMat && nombres && fechaNac && (sex && sex.key)) {
        $scope.paramsCreateAffiliate = {
          lastName: apelPat || '',
          motherLastName: apelMat || '',
          names: nombres || '',
          birthdate: (fechaNac) ? cgwFactory.formatearFecha(fechaNac) : '',
          sex: (sex.key) ? sex.key : '',
          documentNumber: numDoc || '',
          idDocumentType: (tipoDoc.idDocumentType) ? tipoDoc.idDocumentType : 1,
          idCompany: ($scope.formData.mEmpresaInit.idCompany) ? $scope.formData.mEmpresaInit.idCompany : 1,
          createdBy: 'SGA'
        };

        $scope.idAffiliate = 0;
            $scope.afiliadoPowerEPS = $scope.paramsCreateAffiliate.names + ' ' + $scope.paramsCreateAffiliate.lastName + ' ' + $scope.paramsCreateAffiliate.motherLastName;
            $scope.formData.afiliadoSeleccionado = $scope.afiliadoPowerEPS;
            $scope.formData.afiliadoDataSelected = $scope.paramsCreateAffiliate;
            $scope.formData.afiliadoDataSelected.idAffiliate = $scope.idAffiliate;
            $scope.formData.afiliadoDataSelected.fullName = $scope.afiliadoPowerEPS;
            $scope.formData.afiliadoDataSelected.userCode = $scope.paramsCreateAffiliate.createdBy;
          } else {
        $scope.saveInitData = false;
        mModalAlert.showError("Complete los datos", 'Error');
      }
    };

    $scope.$watch('formData', function(nv) {
      $rootScope.formData = nv;
    });

    $scope.$watch('mClinica', function(nv) {
      (typeof $scope.mClinica === 'undefined') ?  $scope.sinClinica = true : $scope.sinClinica = false;
      if(!$scope.sinClinica 
        && $scope.formData.mEmpresaInit && $scope.formData.mEmpresaInit.idCompany === 3
        && $scope.formData.mProducto && $scope.formData.mProducto.productCode === 'R') {
        $scope.validateComplaintRequired($scope.formData.mEmpresaInit.idCompany, nv.providerCode, $scope.formData.mProducto.productCode);
      }
    });

    $scope.pasosgarantia = [{
      description: 'Buscador de cartas'
    }];

    $scope.$on('$stateChangeSuccess', function(s, state, param, d) {
      $scope.currentStep = param.step;
    });

    $scope.gotoStep = function gtsFn(step) {
      if ($scope.currentStep > step) {
        $state.go('.', {
          step: step
        });
      }
    };

    $scope.showModalConfirmation = function() {
      $scope.dataConfirmation = {
        title: '¿Estás seguro de querer cambiar la clínica?',
        subTitle: 'Si cambias la clínica se perderán todos los datos ingresados',
        lblClose: 'Cancelar',
        lblSave: 'Cambiar'
      };

      var vModalConfirmacion = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        windowTopClass: 'cgw-modal-steps__overlay',
        template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
        }]
      });

      vModalConfirmacion.result.then(function() {
        $scope.$watch('dataConfirmation', function(value) {
          if (value.save) {
            $state.go('..steps', {step: 1}, {inherit: false});
            $scope.flagClinic = $scope.formData.flagClinic;
            $scope.formData = {};
          }
        });
      }, function() {
      });

    };

    /*#########################
    # Steps
    #########################*/
    $scope.nav = {};
    $scope.nav.go = function(step, type, currentStep) {
      $scope.stepTogo = step;
      var e = { cancel: false, step: step, type: type};
      var eOld = { cancel: false, step: currentStep, type: type};
      var noEmpytSep = function() {
        if((step===1)||
        (step==='2' && !_.isEmpty(stepsService.getStep1()))||
        (step==='3' && !_.isEmpty(stepsService.getStep2()))||
        (step==='4' && !_.isEmpty(stepsService.getStep3()))){
          return true
        }
      };
      if(noEmpytSep()){
          (type==='O' || type==='A' || type==='U') ? $state.go('solicitudCgw.stepsSoat', {step: parseInt(step), id: type}, {reload: false, inherit: false}) : $state.go('solicitudCgw.steps', {step: parseInt(step), id: type}, {reload: false, inherit: false});
          $scope.$broadcast('$locationChangeStart', e, eOld);
          return !e.cancel;
      }
    };

    $scope.getListClinic = function (wilcar) {

      if (wilcar && wilcar.length >= 2) {
        var paramClinica = {
          Filter: wilcar.toUpperCase()
        };

        var defer = $q.defer();

        cgwFactory.getListClinic(paramClinica, false).then(function (response) {
          $scope.sinResultados = !(response.data.items.length > 0);
          defer.resolve(response.data.items);
        });

        return defer.promise;
      }

    };

    $scope.cleanFieldClinica = function() {
      $scope.sinResultados = false;
    };

    function setRuta(aplicacion) {
      if ($window.sessionStorage.getItem('RutaCGW') == null) {
        $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
      }else if ($window.sessionStorage.getItem('RutaCGW').length>0) {
        $window.sessionStorage.removeItem('RutaCGW');
        $window.sessionStorage.setItem('RutaCGW', JSON.stringify(aplicacion.ruta));
      }

      if (cgwFactory.getVariableSession('RutaCGW').length>0) {
        var str = cgwFactory.getVariableSession('RutaCGW');
        var res = str.split("&");

        $scope.user = res[1].split("=")[1];
        $scope.grupoAplicacion = res[2].split("=")[1];
        $scope.codAgt = res[3].split("=")[1];
        $scope.userRuc = $scope.user;
      } else {
        $scope.user = '';
        $scope.grupoAplicacion = 0;
        $scope.codAgt = 0;

      }
    }

    $scope.saveClinic = function(item) {
      if (item) {
        $window.sessionStorage.setItem('cgwCodeSucursal', item.branchClinicCode);
        $window.sessionStorage.setItem('clinicData', JSON.stringify(item));
        
        if($scope.mClinica.tipoHospital === "07"){
          $scope.formData.flagIsMinsa = paramsMinsa.flagIsMinsa; 
          $scope.formData.mEmpresaInit = { 
           idCompany: paramsMinsa.companyForMinsa 
          }; 
          $scope.loadProducts($scope.formData.mEmpresaInit.idCompany);
        }
        else{
          $scope.formData.flagIsMinsa = paramsMinsa.flagIsNotMinsa;
        }
      }
    };

    $scope.loadProducts = function (idCompany) {
      var validProductMinsa = $scope.formData.flagIsMinsa;
      $scope.formData.mProducto = undefined;
      $scope.productosCGW = [];
      if (idCompany) {
        cgwFactory.GetAllProductBy('SGA', idCompany).then(function(response) {
          // if (response.operationCode === constants.operationCode.success) {
          if (response.data) {
            $scope.productosCGW = response.data;

            $scope.formData.mProducto = {
              productCode: (validProductMinsa === paramsMinsa.flagIsMinsa ? paramsMinsa.productForMinsa: null)
            }
            $scope.nav.go(1, $scope.formData.mProducto.productCode, $scope.currentStep);
            $scope.frmSolicitudCgw.nProducto.$valid = (validProductMinsa === paramsMinsa.flagIsMinsa ? true: false);

          } else {
            if (!response.isValid) {
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';

              });
              mModalAlert.showError(message, 'Error');
            }
          }

        })
          .catch(function(err){
            mModalAlert.showError(err.data, 'Error');
          });
      }
    };


    //fecha accidente
    $scope.status = {
      isopen: false
    };

    $scope.format = 'dd/MM/yyyy';

    $scope.popup = {
      opened: false
    };

    $scope.popupNew = {
      opened: false
    };

    $scope.dateOptions = {
      initDate: new Date(),
      maxDate: new Date()
    };

    $scope.open = function () {
      $scope.popup.opened = true;
    };

    $scope.openNew = function () {
      $scope.popupNew.opened = true;
    };

    $scope.openCalendar = function () {
      $scope.popup.opened = true;
    };

    function getPolicy(cadena) {
      //lamar a servicio
      switch ($scope.formData.mProducto.productCode){
        case 'A':
          cgwFactory.GetPolicyAAPPBy(cadena.toUpperCase()).then(function(response) {
            // if (response.operationCode === constants.operationCode.success) {
            if (response.data) {
              $scope.polizaError = false;
              $scope.formData.polizasArray = response.data;
              isOnlyOne();
            } else {
              $scope.polizaError = true;
              $scope.formData.polizasArray = [];
              $scope.polizaMessageError = 'No hay resultados';
            }

            if (!response.isValid) {
              $scope.polizaError = true;
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';

              });
              // mModalAlert.showError(response.brokenRulesCollection[0].description, 'Error');
              $scope.polizaMessageError = message;
              mModalAlert.showError(message, 'Error');
            }
          })
            .catch(function(err){
              $scope.formData.polizasArray = [];
              $scope.polizaError = true;
              $scope.polizaMessageError = err.data;
              mModalAlert.showError(err.data, 'Error');
            });
          break;
        case 'O':
          if($scope.formData.mFechaAccidente != undefined && $scope.formData.mFechaAccidente != "") {
            if($scope.formData.mPlaca) {
              if (cadena) {
                $scope.formData.afiliadoDataSelected = undefined;
                $scope.formData.afiliadoSeleccionado = undefined;
                getPolicySoat(cadena, cgwFactory.formatearFecha($scope.formData.mFechaAccidente));
              }
            }
            }
          break;
        case 'U':
          cgwFactory.GetPolicyCarBy(cadena.toUpperCase()).then(function(response) {
            // if (response.operationCode === constants.operationCode.success) {
            if (response.data) {
              $scope.polizaError = false;
              $scope.formData.polizasArray = response.data;
              isOnlyOne();
            } else {
              $scope.polizaError = true;
              $scope.polizaMessageError = 'No hay resultados';
              $scope.formData.polizasArray = [];
            }
            if (!response.isValid) {
              $scope.polizaError = true;
              var message = '';
              ng.forEach(response.brokenRulesCollection, function(error) {
                message += error.description + ' ';

              });
              // mModalAlert.showError(response.brokenRulesCollection[0].description, 'Error');
              $scope.polizaMessageError = message;
              mModalAlert.showError(message, 'Error');
            }
          })
            .catch(function(err){
              $scope.polizaError = true;
              $scope.polizaMessageError = err.data;
              $scope.formData.polizasArray = [];
              mModalAlert.showError(err.data, 'Error');
            });
          break;
        default:
          break;
      }
    }

    $scope.$watch('formData.mFechaAccidente', function(data){
      if($scope.formData.mProducto != undefined && $scope.formData.mProducto.productCode == 'O'){
        if(data != undefined && data != ""){
          if($scope.formData.mPlaca){
            $scope.formData.afiliadoDataSelected = undefined;
            $scope.formData.afiliadoSeleccionado = undefined;
            $scope.buscarPolizaPlaca($scope.formData.mPlaca);
          }
        }
      }
    });

    $scope.buscarPolizaPlaca = function(cadena){
      if($scope.formData.mProducto.productCode == 'O') { 
        if($scope.formData.mFechaAccidente != undefined && $scope.formData.mFechaAccidente != "") {
          if($scope.formData.mPlaca) {
            if (cadena) {
              $scope.formData.afiliadoDataSelected = undefined;
              $scope.formData.afiliadoSeleccionado = undefined;
              getPolicySoat(cadena, cgwFactory.formatearFecha($scope.formData.mFechaAccidente));
            }
          }
        }
      } else {
      if (cadena) {
        getPolicy(cadena);
      }
      } 
    };

    function getPolicySoat(license, accidentDate){
      cgwFactory.GetPolicySoatByLicenseAccidentDate(license.toUpperCase(), accidentDate).then(function (response) {
        if (response.data.items.length > 0) {
          $scope.polizaError = false;
          $scope.formData.polizasArray = response.data.items;
          isOnlyOne();
        } else {
          $scope.polizaError = true;
          $scope.formData.polizasArray = [];
          $scope.polizaMessageError = 'No hay resultados';
          $scope.formData.seletedPoliza = undefined;
        }
      }).catch(function (err) {
          $scope.polizaError = true;
          $scope.formData.polizasArray = [];
          $scope.polizaMessageError = err.data;
          $scope.formData.seletedPoliza = undefined;
          mModalAlert.showError(err.data, 'Error');
        });
    }

    //buscar polizas
    $scope.buscarPoliza = function($event, cadena){
      var keyCode = $event.which || $event.keyCode;
      if ((keyCode === 13 || keyCode === 9) && cadena){
        getPolicy(cadena);
      }
    };

    function isOnlyOne() {
      if($scope.formData.polizasArray && $scope.formData.polizasArray.length===1){
        $scope.seletedPoliza($scope.formData.polizasArray[0],0);
      }
    }

    $scope.buscarPersona = function ($event, affiliateInfo, mApellidoPaterno, mApellidoMaterno) {
      $scope.isString = isNaN(parseInt(affiliateInfo));
      var keyCode = $event.which || $event.keyCode;

      if ($scope.isString) {
        if ((keyCode === 13 || keyCode === 9) && affiliateInfo && (mApellidoPaterno && mApellidoMaterno)){
          $scope.searchAffiliatePowerEPS(affiliateInfo, mApellidoPaterno, mApellidoMaterno);
        }
      } else {
        if ((keyCode === 13 || keyCode === 9) && affiliateInfo){
          $scope.searchAffiliatePowerEPS(affiliateInfo, mApellidoPaterno, mApellidoMaterno);
        }
      }
    };

    function GetSearchBy() {

      $scope.paramsSearch = {
        person: ($scope.paramsSearchAffiliatePowerEPS.documentNumber) ? $scope.paramsSearchAffiliatePowerEPS.documentNumber : $scope.paramsSearchAffiliatePowerEPS.lastName + ' ' +
          $scope.paramsSearchAffiliatePowerEPS.motherLastName + ' ' +
          $scope.paramsSearchAffiliatePowerEPS.names
      };

      cgwFactory.GetSearchBy($scope.paramsSearch).then(function(response) {
        // if (response.operationCode === constants.operationCode.success) {
        if (response.data) {
          $scope.affiliatePowerEPS = response.data;
          if(_.isEmpty($scope.affiliatePowerEPS)){
            $scope.noExisteAfiliadoMensaje = true;
          }
        } else {
          if (!response.isValid) {
            var message = '';
            ng.forEach(response.brokenRulesCollection, function(error) {
              message += error.description + ' ';

            });
            mModalAlert.showError(message, 'Error');
          }
        }

      })
        .catch(function(err){
          mModalAlert.showError(err.data, 'Error');
        });
    }

    $scope.searchAffiliatePowerEPS = function (affiliateInfo, mApellidoPaterno, mApellidoMaterno) {
      $scope.isString = isNaN(parseInt(affiliateInfo));

      $scope.paramsSearchAffiliatePowerEPS = {
        lastName: '',
        motherLastName: '',
        names: '',
        documentNumber: ''
      };

      if($scope.isString && affiliateInfo && (mApellidoPaterno !== 'undefined' && mApellidoMaterno !== 'undefined') ) {
        $scope.paramsSearchAffiliatePowerEPS.names = affiliateInfo;
        $scope.paramsSearchAffiliatePowerEPS.lastName = (mApellidoPaterno) ? mApellidoPaterno : '';
        $scope.paramsSearchAffiliatePowerEPS.motherLastName = (mApellidoMaterno) ? mApellidoMaterno : '';
        GetSearchBy();
      } else {
        if(affiliateInfo) {
          $scope.paramsSearchAffiliatePowerEPS.documentNumber = affiliateInfo;
          GetSearchBy();
        }
      }
    };

    $scope.selectedAffiliatePowerEPS  = function (afiliadoPowerEPS, index) {
      $scope.formData.afiliadoDataSelected = afiliadoPowerEPS;
      $scope.formData.afiliadoSeleccionado = afiliadoPowerEPS.fullName;
      $scope.selectedRowAffilate = index;
    };

    function funDocNumMaxLength(documentType){
      //MaxLength documentType
      switch(documentType) {
        case constants.documentTypes.dni.Codigo:
          $scope.docNumMaxLength = 8;
          break;
        case constants.documentTypes.ruc.Codigo:
          $scope.docNumMaxLength = 11;
          break;
        case constants.documentTypes.carnetExtrajeria.Codigo:
          $scope.docNumMaxLength = 12;$scope.docNumMinLength = 6;
          break;
        default:
          $scope.docNumMaxLength = 13;
      }
    }

    $scope.showNaturalPerson = function(item){
      $scope.mNewNroDoc = '';
      funDocNumMaxLength(item.initials);
    };

    function toDate(dateStr) {
      var fecha = dateStr.split("/")
      return new Date(fecha[2], fecha[1] - 1, fecha[0]);
    }

    $scope.showPaso1 = function () {
      if ($scope.formData.mFechaAccidente >= toDate($scope.formData.seletedPoliza.effectivePolicyDate) && $scope.formData.mFechaAccidente < toDate($scope.formData.seletedPoliza.expirationPolicyDate) ) {
        $scope.fechaMayor = false;
        $scope.frmSolicitudCgw.markAsPristine();
        validatePaso1();
      } else{
        $scope.fechaMayor = true;
      }
    };

    function validatePaso1() {
      switch ($scope.formData.mProducto.productCode){
        case 'O':
          if($scope.mClinica && $scope.formData.mEmpresaInit.idCompany && $scope.frmSolicitudCgw.nProducto.$valid &&
            $scope.frmSolicitudCgw.afiliadoSeleccionado.$valid && $scope.frmSolicitudCgw.nFechaAccidente.$valid &&
            $scope.frmSolicitudCgw.nCausa.$valid && $scope.frmSolicitudCgw.nPlaca.$valid){
            $scope.formData.mClinica = $scope.mClinica;
            stepsService.addStep($scope.formData);
            $scope.saveInitData = true;
          } else{
            $scope.saveInitData = false;
            //mModalAlert.showError("Complete los datos", 'Error');
          }
          break;
        case 'A':
          if($scope.mClinica && $scope.formData.mEmpresaInit.idCompany && $scope.frmSolicitudCgw.nProducto.$valid &&
            $scope.frmSolicitudCgw.afiliadoSeleccionado.$valid && $scope.frmSolicitudCgw.nFechaAccidente.$valid &&
            $scope.frmSolicitudCgw.nPoliza.$valid){
            $scope.formData.mClinica = $scope.mClinica;
            stepsService.addStep($scope.formData);
            $scope.saveInitData = true;
          } else{
            $scope.saveInitData = false;
           // mModalAlert.showError("Complete los datos", 'Error');
          }
          break;
        case 'U':
          if($scope.mClinica && $scope.formData.mEmpresaInit.idCompany && $scope.frmSolicitudCgw.nProducto.$valid &&
            $scope.frmSolicitudCgw.afiliadoSeleccionado.$valid && $scope.frmSolicitudCgw.nFechaAccidente.$valid &&
            $scope.frmSolicitudCgw.nPoliza.$valid && $scope.frmSolicitudCgw.nPlaca.$valid && $scope.frmSolicitudCgw.nPoliza.$valid){
            $scope.formData.mClinica = $scope.mClinica;
            stepsService.addStep($scope.formData);
            $scope.saveInitData = true;
          } else{
            $scope.saveInitData = false;
            //mModalAlert.showError("Complete los datos", 'Error');
          }
          break;
        default:
          break;
      }
    }

    $scope.seletedPoliza = function (poliza,index) {
      $scope.formData.seletedPoliza = poliza;
      $scope.formData.mPoliza = poliza.policyNumber;
      $scope.selectedRow = index;
    };

    $scope.buscarPersonaJNE = function ($event, tipoDoc, dni) {

      // var keyCode = $event.which || $event.keyCode;
      // if ((keyCode === 13 || keyCode === 9) && tipoDoc.initials === "DNI" && dni){
      //   $scope.urlJNE = "http://aplicaciones007.jne.gob.pe/srop_publico/Consulta/Afiliado/GetNombresCiudadano?DNI=" + dni;
      //   cgwFactory.getData($scope.urlJNE).then(function(response) {
      //     if(response.substring(0, 3) !== "|||") {
      //       $scope.valueJNE = response.split("|");
      //       $scope.mApelPat = $scope.valueJNE[0];
      //       $scope.mApelMat = $scope.valueJNE[1];
      //       $scope.mNombres = $scope.valueJNE[2];
      //     }
      //   })
      //     .catch(function(err){
      //       mModalAlert.showError(err.data, 'Error');
      //     });
      // }

    }

    $scope.$watch('formData.mProducto', function(data){
      if(data != undefined && data != "" 
        && data.productCode === 'R'
        && $scope.formData.mEmpresaInit && $scope.formData.mEmpresaInit.idCompany === 3
        && $scope.mClinica && $scope.mClinica.providerCode){
        $scope.validateComplaintRequired($scope.formData.mEmpresaInit.idCompany, $scope.mClinica.providerCode, data.productCode);
      }
    });

  } //  end controller

  return ng.module('appCgw')
    .controller('CgwSolicitudTemplateController', cgwSolicitudTemplateController);
});

