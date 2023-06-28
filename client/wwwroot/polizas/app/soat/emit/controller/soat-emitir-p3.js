(function($root, deps, action) {
    define(deps, action)
})(this, ['angular', 'mpfPersonConstants', 'constants',
        '/scripts/mpf-main-controls/components/contractorData/component/contractorData.js',
        '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js',
        'mpfPersonComponent'
    ],
    function(angular, personConstants) {
        angular.module("appSoat").controller('soatEmitS3', ['$scope', '$state', '$rootScope', '$timeout', 'mModalAlert', 'mainServices', 'proxyListaNegra', '$uibModal', 'mModalConfirm',
            function($scope, $state, $rootScope, $timeout, mModalAlert, mainServices, proxyListaNegra, $uibModal, mModalConfirm) {

            (function onLoad() {
                // $scope.formData = $rootScope.formData || {};
                $scope.disabledForm = false;
                $scope.isDeliveryVisible = $scope.isDeliveryVisible || '';
                $scope.formData = $scope.formData || {};
                $scope.formData.contractor = $scope.formData.contractor || {};
                $scope.formData.contractor.saldoMapfreDolares = 0;
                $scope.formData.addressContractor = $scope.formData.addressContractor || {};
                $scope.contractorValid = false;
                $scope.addressValid = {};

                if (typeof $scope.formData.mapfreDollarError == 'undefined') $scope.formData.mapfreDollarError = false;

                $scope.appCode = personConstants.aplications.SOAT;
                $scope.formCode = personConstants.forms.EMI_SOAT_CN;
                $scope.companyCode = constants.module.polizas.soat.companyCode;
                $scope.formData.dataContractor = $scope.formData.dataContractor || {};

                if(!angular.isUndefined($scope.formData.dataContractor.mTipoDocumento) && !angular.isUndefined($scope.formData.dataContractor.mNumeroDocumento)){
                  _createObjectComponent("contratantePerson", $scope.formData.dataContractor, $scope.formData.dataContractorAddress);
                }

                $scope.$on('personForm', function(event, data) {
                  $scope.contractorValid = data.valid;
                  setFormData('dataContractor', 'dataContractorAddress', data.datosPoliza);
                });

                if ($scope.formData.mProductoSoat != null && $scope.formData.mUsoRiesgo != null) {
                    disableNextStep();
                    if($scope.formData.modalidadesSOAT) {
                      var a = $scope.formData.modalidadesSOAT.lastIndexOf($scope.formData.mProductoSoat.CodigoModalidad.toString());
                      if(a == -1){
                        $scope.formData.isBlockedAll = false;
                        return false;
                      }else{
                        if($scope.formData.isBlocked){
                          mModalAlert.showError('El sistema bloquea el acceso y muestra un mensaje de error indicando el mensaje: Tiene emisiones pendientes de pago mayores a 72 hrs', 'Agente Bloqueado');
                          $scope.formData.isBlockedAll = true;
                          return true;
                        }
                        else{
                          $scope.formData.isBlockedAll = false;
                          return false;
                        }
                      }
                  }
                } else {
                    $state.go('.', {
                        step: 2
                    });
                }

                // if($scope.formData.validatedPaso1){
                if (typeof $scope.formData.dataContractor2 != 'undefined' && !$scope.formData.validatedPaso3) { //
                    $scope.formData.dataContractor = {};
                    $scope.formData.dataContractor.mTipoDocumento = { Codigo: ($scope.formData.mTipoDocumento == '') ? null : $scope.formData.mTipoDocumento };
                    $scope.formData.dataContractor.mNumeroDocumento = $scope.formData.mNumeroDocumento;
                    // if ($scope.formData.mTipoDocumento != constants.documentTypes.ruc.Codigo) {
                    if ($scope.formData.mTipoDocumento) {
                        $scope.formData.showNaturalRucPerson = mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento, $scope.formData.dataContractor.mNumeroDocumento);

                        if ($scope.formData.mTipoDocumento != constants.documentTypes.ruc.Codigo || $scope.formData.showNaturalRucPerson) {
                            if (typeof $scope.formData.dataContractor2 != 'undefined') {
                                // naturalPerson
                                $scope.formData.dataContractor.mNomContratante = $scope.formData.dataContractor2.Nombre;
                                $scope.formData.dataContractor.mApePatContratante = $scope.formData.dataContractor2.ApellidoPaterno;
                                $scope.formData.dataContractor.mApeMatContratante = $scope.formData.dataContractor2.ApellidoMaterno;

                                if ($scope.formData.dataContractor2.FechaNacimiento){
                                    $scope.formData.dataContractor.mDay = { id: getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'd') };
                                    $scope.formData.dataContractor.mMonth = { id: getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'm') };
                                    $scope.formData.dataContractor.mYear = { id: getBirthDate($scope.formData.dataContractor2.FechaNacimiento, 'y') };
                                }

                                $scope.formData.dataContractor.mSexo = $scope.formData.dataContractor2.Sexo == 1 ? 'H' : 'M';

                                $scope.formData.blockFields = !!$scope.formData.dataContractor.mNomContratante;

                                $scope.formData.dataContractor.saldoMapfreDolares = $scope.formData.dataContractor2.SaldoMapfreDolar;
                                $scope.formData.dataContractor.mProfesion = {
                                    Codigo: ($scope.formData.dataContractor2.Profesion && $scope.formData.dataContractor2.Profesion.Codigo && $scope.formData.dataContractor2.Profesion.Codigo !== 99) ? $scope.formData.dataContractor2.Profesion.Codigo : null
                                };
                            }
                        }else{
                            $scope.formData.dataContractor.mRazonSocial = $scope.formData.dataContractor2.Nombre;

                            $scope.formData.dataContractor.mActividadEconomica = {
                              Codigo: ($scope.formData.dataContractor2.ActividadEconomica && $scope.formData.dataContractor2.ActividadEconomica.Codigo && $scope.formData.dataContractor2.ActividadEconomica.Codigo !== '') ? $scope.formData.dataContractor2.ActividadEconomica.Codigo : null
                            };
                        }

                    } else {
                        // legalEntity
                        $scope.formData.dataContractor.mRazonSocial = $scope.formData.dataContractor2.Nombre;

                        $scope.formData.dataContractor.mActividadEconomica = {
                          Codigo: ($scope.formData.dataContractor2.ActividadEconomica && $scope.formData.dataContractor2.ActividadEconomica.Codigo && $scope.formData.dataContractor2.ActividadEconomica.Codigo !== '') ? $scope.formData.dataContractor2.ActividadEconomica.Codigo : null
                        };
                    }

                    if (typeof $scope.formData.dataContractor2 != 'undefined') {

                        $scope.formData.dataContractor.mTelefonoFijo = $scope.formData.dataContractor2.Telefono;
                        $scope.formData.dataContractor.mTelefonoCelular = $scope.formData.dataContractor2.Telefono2;
                        $scope.formData.dataContractor.mCorreoElectronico = $scope.formData.dataContractor2.CorreoElectronico;
                        $scope.formData.dataContractorClone = helper.clone($scope.formData.dataContractor, true);

                    }
                }
                if (typeof $scope.formData.dataContractor2 != 'undefined' && !$scope.formData.validatedPaso3) {
                    if ($scope.formData.dataContractor2.Ubigeo) {
                        if ($scope.formData.dataContractor2.CodigoDepartamento) {
                                $scope.formData.dataContractorAddress = {
                                    mTipoVia: {
                                        Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoVia == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoVia
                                    },
                                    mNombreVia: $scope.formData.dataContractor2.Ubigeo.Direccion,
                                    mTipoNumero: {
                                        Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoNumero == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoNumero
                                    },
                                    mNumeroDireccion: $scope.formData.dataContractor2.Ubigeo.TextoNumero,
                                    mTipoInterior: {
                                        Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoInterior == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoInterior
                                    },
                                    mNumeroInterior: $scope.formData.dataContractor2.Ubigeo.TextoInterior,
                                    mTipoZona: {
                                        Codigo: ($scope.formData.dataContractor2.Ubigeo.CodigoZona == '') ? null : $scope.formData.dataContractor2.Ubigeo.CodigoZona
                                    },
                                    mNombreZona: $scope.formData.dataContractor2.Ubigeo.TextoZona,
                                    mDirReferencias: $scope.formData.dataContractor2.Ubigeo.Referencia
                                };
                                $scope.formData.dataContractorAddressClone = helper.clone($scope.formData.dataContractorAddress, true);
                                var isload = false;
                                $scope.$watch('setterUbigeo', function() {
                                    if ($scope.setterUbigeo && !isload) {
                                        $scope.setterUbigeo($scope.formData.dataContractor2.Ubigeo.CodigoDepartamento, $scope.formData.dataContractor2.Ubigeo.CodigoProvincia, $scope.formData.dataContractor2.Ubigeo.CodigoDistrito);
                                        isload = true;
                                    }
                                });
                            //}
                        }
                    }
                }

            })();

            function setFormData(name, address, data) {
              $scope.formData[name].mNomContratante = data.Nombre;
              $scope.formData[name].mRazonSocial = data.Nombre;
              $scope.formData[name].mApePatContratante = data.ApellidoPaterno;
              $scope.formData[name].mApeMatContratante = data.ApellidoMaterno;
              $scope.formData[name].mDay = {
                id: data.day.Codigo,
                description: data.day.Descripcion
              };
              $scope.formData[name].mMonth = {
                id: data.month.Codigo,
                description: data.month.Descripcion
              };
              $scope.formData[name].mYear = {
                id: (data.year && data.year.Codigo) || 0,
                description: (data.year && data.year.Descripcion) || ''
              };
              $scope.formData[name].mSexo = data.Sexo == '1' ? 'H' : 'M';
              $scope.formData[name].mTipoDocumento = data.documentType;
              $scope.formData[name].mNumeroDocumento = data.documentNumber;
              $scope.formData[name].mTelefonoFijo = data.Telefono;
              $scope.formData[name].mTelefonoCelular = data.Telefono2;
              $scope.formData[name].mCorreoElectronico = data.CorreoElectronico;
              $scope.formData[name].mProfesion = data.Profesion;
              $scope.formData[name].mActividadEconomica = data.ActividadEconomica;

              $scope.formData[address] = {
                ubigeoData: {}
              }

              $scope.formData[address].mTipoNumero = data.NumberType;
              $scope.formData[address].mNumeroDireccion = data.TextoNumero;
              $scope.formData[address].mTipoInterior = data.Inside;
              $scope.formData[address].mNumeroInterior = data.TextoInterior;
              $scope.formData[address].mTipoZona = data.Zone;
              $scope.formData[address].mNombreZona = data.TextoZona;
              $scope.formData[address].mDirReferencias = data.Referencia;
              $scope.formData[address].mTipoVia = data.Via;
              $scope.formData[address].mNombreVia = data.NombreVia;

              $scope.formData[address].ubigeoData.mDepartamento = data.Department;
              $scope.formData[address].ubigeoData.mProvincia = data.Province;
              $scope.formData[address].ubigeoData.mDistrito = data.District;
            }

            $scope.documentsChange = function (data){
              if(data.esFraudulento) {
                $scope.disabledForm = data.esFraudulento && !data.aceptaAdvertencia;
              } else {
              if(!angular.isUndefined(data.SaldoMapfreDolar)){
                $scope.formData.dataContractor.saldoMapfreDolares = data.SaldoMapfreDolar;
              }
            }
            }

            function _createObjectComponent(name, data, address){
              $scope.formData[name] = {
                TipoDocumento: data.mTipoDocumento,
                NumeroDocumento: data.mNumeroDocumento,
                Nombre: data.mNomContratante || data.mRazonSocial,
                ApellidoMaterno: data.mApeMatContratante,
                ApellidoPaterno: data.mApePatContratante,
                ActividadEconomica: data.mActividadEconomica,
                FechaNacimiento: data.mDay.description + "/" + data.mMonth.description + "/" + data.mYear.description,
                Sexo: data.mSexo,
                Profesion: data.mProfesion,
                Telefono: data.mTelefonoFijo,
                Telefono2: data.mTelefonoCelular,
                CorreoElectronico: data.mCorreoElectronico,
                Ubigeo: {
                  Departamento: address.ubigeoData.mDepartamento,
                  Provincia: address.ubigeoData.mProvincia,
                  Distrito: address.ubigeoData.mDistrito,
                  CodigoVia: !angular.isUndefined(address.mTipoVia) ? address.mTipoVia.Codigo : null,
                  NombreVia: address.mNombreVia,
                  CodigoNumero: !angular.isUndefined(address.mTipoNumero) ? address.mTipoNumero.Codigo : null,
                  TextoNumero: address.mNumeroDireccion,
                  CodigoInterior: !angular.isUndefined(address.mTipoInterior) ? address.mTipoInterior.Codigo : null,
                  TextoInterior: address.mNumeroInterior,
                  CodigoZona: !angular.isUndefined(address.mTipoZona) ? address.mTipoZona.Codigo : null,
                  TextoZona: address.mNombreZona,
                  Referencia: address.mDirReferencias
                }
              };
            }

            function getBirthDate(date, option) {
                var r = null;
                if (date && option) {
                    var vDate = date.split('/');
                    switch (option) {
                        case 'd':
                            r = vDate[0];
                            break;
                        case 'm':
                            r = vDate[1];
                            break;
                        case 'y':
                            r = vDate[2];
                            break;
                    }
                }
                return parseInt(r);
            }

            $scope.cleanContract = function() {
                var data = $scope.formData;
                $scope.formData.blockDepartament = false;
                $scope.formData.blockFields = false;
                data.dataContractorAddress.mTipoInterior = { Codigo: null };
                data.dataContractorAddress.mTipoNumero = { Codigo: null };
                data.dataContractorAddress.mTipoVia = { Codigo: null };
                data.dataContractorAddress.mTipoZona = { Codigo: null };
                data.dataContractorAddress.mDirReferencias = "";
                data.dataContractorAddress.mNumeroInterior = "";
                data.dataContractorAddress.mNumeroDireccion = "";
                data.dataContractorAddress.mNombreZona = "";
                data.dataContractorAddress.mNombreVia = "";
                $scope.cleanUbigeo();
            };

            $scope.notifyContract = function(value) {
                var data = $scope.formData;
                if (!value) {
                    $scope.cleanContract();
                    return;
                }

                $scope.formData.blockFields = !!value.CodigoDocumento;
                $scope.formData.blockDepartament = !!value.CodigoDepartamento || !!value.Ubigeo.CodigoDepartamento;
                $scope.formData.McaAsegNuevo = 'N';
                value = value.Ubigeo;

                if(value.CodigoVia == "")
                    value.CodigoVia = null;
                if(value.CodigoNumero == "")
                    value.CodigoNumero = null;
                if(value.CodigoInterior == "")
                    value.CodigoInterior = null;
                if(value.CodigoZona == "")
                    value.CodigoZona = null;

                $scope.setterUbigeo(value.CodigoDepartamento, value.CodigoProvincia, value.CodigoDistrito);
                data.dataContractorAddress.mTipoInterior = { Codigo: value.CodigoInterior }
                data.dataContractorAddress.mTipoNumero = { Codigo: value.CodigoNumero };
                data.dataContractorAddress.mTipoVia = { Codigo: value.CodigoVia }
                data.dataContractorAddress.mTipoZona = { Codigo: value.CodigoZona }
                data.dataContractorAddress.mDirReferencias = value.Referencia
                data.dataContractorAddress.mNumeroInterior = value.TextoInterior
                data.dataContractorAddress.mNumeroDireccion = value.TextoNumero
                data.dataContractorAddress.mNombreZona = value.TextoZona
                data.dataContractorAddress.mNombreVia = value.Direccion;
            }

            $scope.nextStep = function() {
                $scope.$broadcast('submitForm', true);
                $scope.$watch('formData.dataContractor', function(newData) {
                    $scope.formData.contractorData = newData;
                });
                $scope.$watch('formData.dataContractorAddress', function(newData) {
                    $scope.formData.dataContractorAddress = newData;
                });
                $scope.validationForm();

                if ($scope.formData.validatedPaso3  && !$scope.formData.isBlockedAll) {
                  _validarDatosListaNegra();
                }
            };

            function _guardarData() {
                    if(typeof $scope.formData.dataContractor.mCorreoElectronico != 'undefined')
                        $scope.formData.dataContractor.mCorreoElectronico = $scope.formData.dataContractor.mCorreoElectronico.toUpperCase();
                    if ($scope.formData.dataContractorAddress && $scope.formData.dataContractorAddress.mDirReferencias === undefined) {
                        $scope.formData.dataContractorAddress.mDirReferencias = '';
                    } else {
                        if($scope.formData.dataContractorAddress && $scope.formData.dataContractorAddress.mDirReferencias != undefined)
                            $scope.formData.dataContractorAddress.mDirReferencias = $scope.formData.dataContractorAddress.mDirReferencias.toUpperCase();
                    }
                    $state.go('.', {
                        step: 4
                    });
                }

            $scope.validationForm = function() {
                if (!$scope.contractorValid) {
                    $scope.formData.validatedPaso3 = false;
                } else {
                    $scope.formData.validatedPaso3 = true;
                }
            }

            function disableNextStep() {
                $scope.formData.fourthStepNextStep = false;
            }

            $scope.$on('changingStep', function(ib, e) {
              $scope.$broadcast('submitForm', true);
                if (typeof $scope.formData.fourthStepNextStep == 'undefined')
                    $scope.formData.fourthStepNextStep = false;

                if (e.step < 4) {
                    e.cancel = false;
                } else {

                    $scope.validationForm();

                    if (!$scope.contractorValid) {
                        e.cancel = true;
                        disableNextStep();
                    } else {
                        if(!$scope.formData.isBlockedAll){
                            e.cancel = false;
                        }
                        else{
                             e.cancel = true;
                            disableNextStep();
                     }
                    }

                }
            });

            /*########################
            # ValidarListaNegra
            ########################*/
            function _validarDatosListaNegra() {
              var reqLN = [];

              if($scope.formData.dataContractor.mCorreoElectronico) reqLN.push({ "tipo": "CORREO", "valor": $scope.formData.dataContractor.mCorreoElectronico });
              if($scope.formData.dataContractor.mTelefonoCelular) reqLN.push({ "tipo": "TLF_MOVIL", "valor": $scope.formData.dataContractor.mTelefonoCelular });
              if($scope.formData.dataContractor.mTelefonoFijo) reqLN.push({ "tipo": "TLF_FIJO", "valor": $scope.formData.dataContractor.mTelefonoFijo });

              proxyListaNegra.ConsultaListaNegra(reqLN, true).then(function(response) {
                var datosLN = [];
                
                if(response.OperationCode === constants.operationCode.success) {
                  var msg = "";

                  response.Data.forEach(function(element) {
                    if(element.Resultado) {
                      var elemetLN = {
                        codAplicacion: personConstants.aplications.SOAT,
                        tipoDato: element.Tipo,
                        valorDato: element.Valor
                      };

                      datosLN.push(elemetLN);

                      switch(element.Tipo) {
                        case "CORREO": 
                          msg += "El correo del contratante est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                          break;
                        case "TLF_MOVIL": 
                          msg += "El tel&eacute;fono celular del contrante est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                          break;
                        case "TLF_FIJO": 
                          msg += "El tel&eacute;fono fijo del contrante est&aacute; en la tabla de Cliente/ Unidad inelegible por estudios t&eacute;cnicos.<br/>"; 
                          break;
                        default: "";
                      }
                    }
                  });

                  if(msg === "") {
                    _guardarData();
                  } else {
                    var profile = JSON.parse(window.localStorage.getItem('profile'));

                    // EJECUTIVO
                    if(!profile.isAgent && profile.userSubType === "1") {
                      mModalAlert.showError(msg, 'Error');
                    } else {
                      var tipoPerfil = (profile.isAgent && profile.userSubType === "1") ? 'A' // AGENTE
                          : (profile.userSubType === "3" ? 'B' : null); //BROKER
              
                      _confirmacionFraudulento(tipoPerfil, datosLN);
                    }
                  }
                }
              });
            }

            function _confirmacionFraudulento(perfil, datos) {
              if(!perfil) return;

              mModalConfirm.confirmError('Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA COTIZACI&Oacute;N?', '', 'SI', undefined, 'NO')
              .then(function(ok) {
                  if(ok) {
                    datos.forEach(function(element) {
                      element.aceptaAdvertencia = true;
                      proxyListaNegra.GuardarAuditoria(element).then();
                    });
                    _guardarData();
                  } 
              }, function(res) {
                datos.forEach(function(element) {
                  element.aceptaAdvertencia = false;
                  proxyListaNegra.GuardarAuditoria(element).then();
                });
              });

              /*
              $uibModal.open({
                backdrop: 'static', // background de fondo
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                scope: $scope,
                windowTopClass:'popup',
                templateUrl : '/scripts/mpf-main-controls/components/mpf-person/components/popupListaNegra.html',
                controller : ['$scope', '$uibModalInstance', 'proxyListaNegra', function($scope, $uibModalInstance, proxyListaNegra) { 
                  $scope.continuar = function(){
                    datos.forEach(function(element) {
                      element.aceptaAdvertencia = true;
                      proxyListaNegra.GuardarAuditoria(element).then();  
                    });

                    $uibModalInstance.close();
                    _guardarData();
                  }

                  $scope.cancelar = function(){
                    datos.forEach(function(element) {
                      element.aceptaAdvertencia = false;
                      proxyListaNegra.GuardarAuditoria(element).then();  
                    });

                    $uibModalInstance.close();
                  }
                }]
              });
              */
            }

        }]);
    });
