(function ($root, deps, action) {
  define(deps, action)
})(this, ['angular', 'constants', 'helper', 'lodash', 'mpfPersonConstants', '/scripts/mpf-main-controls/components/contractorAddress/component/contractorAddress.js', '/polizas/app/sctr/emitir/service/sctrEmitFactory.js', '/scripts/mpf-main-controls/components/modalSteps/component/modalSteps.js', 'mpfPersonComponent'],
  function (angular, constants, helper, _, personConstants) {

    var appAutos = angular.module('appAutos');

    appAutos.controller('sctrEmitirS1Controller', ['$scope', '$location', '$window', '$state', '$timeout', '$rootScope', 'sctrEmitFactory', 'mModalAlert', '$uibModal', '$stateParams', 'oimClaims', 'mainServices', 'proxySctr', 'proxyClient',
      function ($scope, $location, $window, $state, $timeout, $rootScope, sctrEmitFactory, mModalAlert, $uibModal, $stateParams, oimClaims, mainServices, proxySctr, proxyClient) {

        (function onLoad() {

          proxySctr.ValidarAgente().then(function (response) {
            if (response.Data && response.Data.Bloqueado == 1) {
              $state.go('sctrHome');
            } else {
            }
          }, function (response) {
            //defer.reject(response);
          });

          $scope.formData = $scope.formData || {};
          $scope.formData.mAgente = $scope.mAgente;
          $scope.formData.paso1Grabado = $scope.formData.paso1Grabado || false;
          $scope.formData.existente = false;

          disableNextStep();

          sctrEmitFactory.getListProduct().then(function (response) {
            if (response.Data.length > 0) {
              $scope.formData.productos = response.Data;
            }
          });

          function disableNextStep() {
            $scope.formData.secondStepNextStep = false;
            $scope.formData.thirdStepNextStep = false;
            $scope.formData.fourthStepNextStep = false;
            $scope.formData.fifthStepNextStep = false;
          }

          if (!$scope.cotizacion) {
            $scope.cotizacion = [
              {
                Solicitud: {
                  SecuenciaReg: 0,
                  CodigoEstado: ''
                }
              }
            ];
          }

          $scope.$on('changingStep', function (ib, e) {
            if (typeof $scope.formData.secondStepNextStep == 'undefined') $scope.formData.secondStepNextStep = false;
            if (parseInt(e.step) < 2) {
              e.cancel = false;
            } else {
              $scope.formData.validatedPaso1 = $scope.frmSCTR1.$valid ? true : false;
              if (parseInt(e.step) >= 3) {
                if (parseInt(e.step) == 3) {
                  if ($scope.formData.paso3Grabado ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'RT' && $scope.cotizacion[0].Solicitud.SecuenciaReg == 3) ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'SC') ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'AS') ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'RS') ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'RE' && $scope.cotizacion[0].Solicitud.SecuenciaReg == 3)
                  ) {
                    e.cancel = false;
                  } else {
                    e.cancel = true;
                    disableNextStep();
                  }
                } else if (parseInt(e.step) == 4) {
                  if ($scope.formData.paso4Grabado ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'AT') ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'ER')
                  ) {
                    e.cancel = false;
                  } else {
                    e.cancel = true;
                    disableNextStep();
                  }
                } else if (parseInt(e.step) == 5) {
                  if ($scope.formData.paso4Grabado ||
                    ($scope.cotizacion[0].Solicitud.CodigoEstado == 'EM')
                  ) {
                    e.cancel = false;
                  } else {
                    e.cancel = true;
                    disableNextStep();
                  }
                }

              } else
                if ($scope.formData.validatedPaso1 && $scope.formData.paso1Grabado && !$scope.formData.agenteBloqueado) {
                  e.cancel = false;
                } else {
                  e.cancel = true;
                  disableNextStep();
                }
            }
          });

          function setRole() {
            if (angular.isArray($state.current.submenu)) {
              $scope.formData.onlyRole = $state.current.submenu.length == 1
              $scope.roles = [];
              angular.forEach($state.current.submenu, function (submenu) {
                $scope.roles.push({
                  descripcion: submenu.nombreLargo,
                  codigo: helper.searchQuery('ROL', submenu.ruta)
                });
              });

              if ($scope.roles[0].codigo == null) {
                $scope.roles = [];
                angular.forEach($state.current.submenu, function (submenu) {
                  $scope.roles.push({
                    descripcion: submenu.nombreLargo,
                    codigo: helper.searchQuery('Rol', submenu.ruta)
                  });
                });
              }

              if ($scope.formData.onlyRole) {
                $scope.formData.mRole = $scope.roles[0];
                $scope.formData.TipoRol = $scope.formData.mRole.codigo;
              } else {
                $scope.formData.TipoRol = $scope.roles[0].codigo;
              }
            }
          }


          if (!$scope.formData.paso2Grabado) {
            $scope.formData.salud = true;
            $scope.formData.pension = true;
          }

          $scope.formData.errorFile = false;
          $scope.formData.quotation = $stateParams.quotation;
          $scope.formData.tipoSCTR = $stateParams.tipo;
          $scope.appCode = personConstants.aplications.SCTR;
          $scope.formData.personData = {};
          if ($scope.formData.tipoSCTR == constants.module.polizas.sctr.periodoCorto.TipoPeriodo) {
            $scope.formData.pNormal = false;
            $scope.formCode = personConstants.forms.EMI_SCTR_PC_CN;
          } else {
            $scope.formData.pNormal = true;
            $scope.formCode = personConstants.forms.EMI_SCTR_PR_CN;
          }

          $scope.formData.duraciones = true;

          $scope.formData.dataContractor2 = $scope.formData.dataContractor2 || {};
          $scope.contractorValid = {};
          $scope.addressValid = {};

          $scope.formData.contractor = $scope.formData.contractor || {};
          $scope.formData.contractor.saldoMapfreDolares = 0;
          $scope.formData.addressContractor = $scope.formData.addressContractor || {};

          $timeout(function () {
            if (typeof $scope.formData.mAgente != 'undefined') {
              sctrEmitFactory.getSuscriptorByIdAgent($scope.formData.mAgente.codigoAgente).then(function (response) {
                if (response.OperationCode == constants.operationCode.success) {
                  $scope.formData.suscriptorData = response.Data;
                  $scope.formData.suscriptorEmail = $scope.formData.suscriptorData.Correo;
                  $scope.formData.CodigoSuscriptor = $scope.formData.suscriptorData.CodigoSuscriptor;
                }
              }, function (error) {
                console.log('Error en getSuscriptorByIdAgent: ' + error);
              });
            }

            if (!$scope.formData.TipoRol){
              setRole();
            }

          }, 1000);


          if ($scope.formData.quotation > 0) {
            cargarPaso1();
          }
          else {
            if ($scope.formData.paso1Grabado) {
              _createObjectComponent("personData", $scope.formData);
            }
          }

          $scope.$on('personForm', function (event, data) {
            if (data.compContratante) {
              $scope.contractorValid = data.valid;
              setFormData("dataContractor2", "contractorAddress", data.compContratante, data.legalPerson);
            }
          });

        })();

        function setFormData(name, address, data, isCompany) {
          $scope.formData[name].TipoDocumento = data.documentType.Codigo;
          $scope.formData[name].NumeroDocumento = data.documentNumber;
          $scope.formData[name].PersonaNatural = isCompany ? "N" : "S";
          $scope.formData[name].RazonSocial = data.Nombre;
          $scope.formData[name].CargoRepresentante = data.RepresentanteCargo ? data.RepresentanteCargo.Descripcion : "";
          $scope.formData[name].Representante = data.Representante;
          $scope.formData[name].Profesion = data.Profesion ? data.Profesion.Descripcion : "";
          $scope.formData[name].CodigoProfesion = data.Profesion ? parseInt(data.Profesion.Codigo) : null;
          $scope.formData[name].ApellidoPaterno = data.ApellidoPaterno;
          $scope.formData[name].ApellidoMaterno = data.ApellidoMaterno;
          $scope.formData[name].Sexo = data.Sexo;
          $scope.formData[name].McaFisico = data.MCAFisico;
          $scope.formData[name].EmailUsuario = data.CorreoElectronico;
          $scope.formData[name].NombreDomicilio = data.Ubigeo.NombreVia;
          $scope.formData[name].CodigoPostal = data.CodigoPostal;
          $scope.formData[name].Telefono = data.Telefono;
          $scope.formData[name].NumeroMovil = data.Telefono2;
          $scope.formData[name].CodigoCiiuEmp = data.CodigoCiiuEmp;
          $scope.formData[name].DescripcionCiiuEmp = data.DescripcionCiiuEmp;
          $scope.formData[name].McaExtCliTron = data.McaExtCliTron;
          $scope.formData[name].CodigoDepartamento = data.Department.Codigo;
          $scope.formData[name].CodigoProvincia = data.Province.Codigo;
          $scope.formData[name].CodigoDistrito = data.District.Codigo;
          $scope.formData[name].CodigoPais = data.nativeCountry ? data.nativeCountry.Codigo : "";
          $scope.formData[name].DescripcionNumero = data.NumeroDescripcion;
          $scope.formData[name].DescripcionInterior = data.InteriorDescripcion;
          $scope.formData[name].DescripcionZona = data.ZonaDescripcion;
          $scope.formData[name].TipoInterior = data.Inside ? parseInt(data.Inside.Codigo) : 0;
          $scope.formData[name].TipoDomicilio = data.Via ? parseInt(data.Via.Codigo) : 0;
          $scope.formData[name].TipoNumero = data.NumberType ? parseInt(data.NumberType.Codigo) : 0;
          $scope.formData[name].TipoZona = data.Zone ? parseInt(data.Zone.Codigo) : 0;
          $scope.formData[name].Referencia = data.Referencia;
          $scope.formData[name].Solicitud = data.Solicitud;
          $scope.formData[name].Riesgo = data.Riesgo;
          $scope.formData[name].McaDeficitarioPension = $scope.formData[name].McaDeficitarioPension || data.McaDeficitarioPension;
          $scope.formData[name].McaDeficitarioSalud = $scope.formData[name].McaDeficitarioSalud || data.McaDeficitarioSalud;

          $scope.formData[name].McaReciboPendientePension = $scope.formData[name].McaReciboPendientePension || data.McaReciboPendientePension || "N";
          $scope.formData[name].McaReciboPendienteSalud = $scope.formData[name].McaReciboPendienteSalud || data.McaReciboPendienteSalud || "N";
          $scope.formData[address] = {};
          $scope.formData[address].ubigeoData = {
            mDepartamento: data.Department,
            mProvincia: data.Province,
            mDistrito: data.District
          };

          $scope.formData[address].mTipoZona = data.Zone;
          $scope.formData[address].mNombreZona = data.TextoZona;
          $scope.formData[address].mDirReferencias = data.Referencia;
          $scope.formData[address].mTipoVia = data.Via;
          $scope.formData[address].mNombreVia = data.Ubigeo.NombreVia;
          $scope.formData[address].mTipoNumero = data.NumberType;
          $scope.formData[address].mNumeroDireccion = data.TextoNumero;
          $scope.formData[address].mTipoInterior = data.Inside;
          $scope.formData[address].mNumeroInterior = data.TextoInterior;

          $scope.formData.mTipoDocumento = data.documentType;
          $scope.formData.mNumeroDocumento = data.documentNumber;
          $scope.formData.mApePatContratante = data.ApellidoPaterno;
          $scope.formData.mApeMatContratante = data.ApellidoMaterno;
          $scope.formData.mCorreoElectronico = data.CorreoElectronico;
          $scope.formData.mTelefonoCelular = data.Telefono2;
          $scope.formData.mNomContratante = data.Nombre;
          $scope.formData.mRazonSocial = data.Nombre;
          $scope.formData.mSexo = data.Sexo;
          $scope.formData.mTelefonoFijo = data.Telefono;
          $scope.formData.mProfesion = data.Profesion;
          $scope.formData.mRepresentante = data.Representante;
          $scope.formData.mRepresentanteCargo = data.RepresentanteCargo;
          $scope.formData.McaFisico = data.MCAFisico;
          $scope.formData.showNaturalRucPerson = isCompany;

          $scope.formData.McaExtCliTron = data.McaExtCliTron || "N";
          $scope.formData[name].McaExtCliTron = data.McaExtCliTron || "N";
          $scope.formData.McaReciboPendienteSalud = $scope.formData[name].McaReciboPendienteSalud || "N";
          $scope.formData.McaReciboPendientePension = $scope.formData[name].McaReciboPendientePension || "N";
          $scope.formData.isdeficitario = $scope.formData[name].McaDeficitarioPension == 'S' || $scope.formData[name].McaDeficitarioSalud == 'S';
        }

        function _createObjectComponent(name, data) {
          $scope.formData[name] = {
            TipoDocumento: data.mTipoDocumento,
            NumeroDocumento: data.mNumeroDocumento,
            Nombre: data.mRazonSocial,
            ApellidoMaterno: data.mApePatContratante,
            ApellidoPaterno: data.mApeMatContratante,
            Sexo: data.mSexo,
            Profesion: data.mProfesion,
            Telefono: data.mTelefonoFijo,
            Telefono2: data.mTelefonoCelular,
            CorreoElectronico: data.mCorreoElectronico,
            Representante: data.mRepresentante,
            TipoCargoRep: data.mRepresentanteCargo ? data.mRepresentanteCargo.Codigo : ""
          };
          if (data.contractorAddress) {
            var direccion = data.contractorAddress;
            $scope.formData[name].Ubigeo = {
              Departamento: direccion.ubigeoData.mDepartamento,
              Provincia: direccion.ubigeoData.mProvincia,
              Distrito: direccion.ubigeoData.mDistrito,
              CodigoVia: direccion.mTipoVia ? direccion.mTipoVia.Codigo : "",
              CodigoNumero: direccion.mTipoNumero ? direccion.mTipoNumero.Codigo : "",
              CodigoInterior: direccion.mTipoInterior ? direccion.mTipoInterior.Codigo : "",
              CodigoZona: direccion.mTipoZona ? direccion.mTipoZona.Codigo : "",
              NombreVia: direccion.mNombreVia,
              TextoNumero: direccion.mNumeroDireccion,
              TextoInterior: direccion.mNumeroInterior,
              TextoZona: direccion.mNombreZona,
              Referencia: direccion.mDirReferencias
            }
          }
        }

        $scope.documentsChange = function (data) {
          if (angular.isDefined(data.CodigoCiiuEmp) && angular.isDefined(data.DescripcionCiiuEmp)) {
            $scope.formData.dataContractor2.CodigoCiiuEmp = data.CodigoCiiuEmp;
            $scope.formData.dataContractor2.DescripcionCiiuEmp = data.DescripcionCiiuEmp;
            if ($scope.formData.dataContractor2.CodigoCiiuEmp != '') {
              $scope.formData.mActivSunat = {
                codigo: $scope.formData.dataContractor2.CodigoCiiuEmp,
                descripcion: $scope.formData.dataContractor2.DescripcionCiiuEmp
              }
              $scope.formData.sunat = true;
            }
            else {
              $scope.formData.sunat = false;
            }
          }
          if (data.TipoDocumento && data.CodigoDocumento) {
            $scope.formData.resultContratante = 1;
            $scope.formData.esCliente = true;
          }
          if (data.noData) {
            $scope.formData.mActivSunat = undefined;
            $scope.formData.sunat = false;
            $scope.formData.esCliente = false;
            $scope.formData.resultContratante = 2;
          }
          if (data.isClear) {
            $scope.formData.mActivSunat = undefined;
            $scope.formData.sunat = false;
            $scope.formData.esCliente = false;
            $scope.formData.resultContratante = 2;
          }
        }

        $scope.$watch('formData', function (nv) {
          $rootScope.formData = nv;
        })

        $scope.$watch('formData.mAgente', function (nv) {
          $rootScope.formData.mAgente = nv;
        })

        $scope.$watch('formData.mRole', function () {
          if (typeof $scope.formData.mRole != 'undefined')
            $scope.formData.TipoRol = $scope.formData.mRole.codigo;
        })

        $scope.setTipoPersona = function () {
          if (!mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento)) {
            $scope.formData.PersonaNatural = 'N';
          } else {
            $scope.formData.PersonaNatural = 'S';
          }
        };

        $scope.searchActividadSunat = function (wilcar) {
          var paramActividadSunat = {
            Codigo: '',
            Descripcion: wilcar.toUpperCase(),
            TamanoPagina: 10,
            NumeroPagina: 1
          };
          return sctrEmitFactory.getActividadSunat(paramActividadSunat);
        };

        function cargarPaso1() {

          $scope.formData.paso1Grabado = true;

          var paramsCoti = {
            NumeroSolicitud: $scope.formData.quotation,
            Tipo: 1,
            TipoRol: $scope.formData.TipoRol
          };

          $scope.formData.NroSolicitud = $scope.formData.quotation;
          sctrEmitFactory.getCotizacion(paramsCoti, true).then(function (response) {

            if (response.OperationCode == constants.operationCode.success) {
              $scope.cotizacion = response.Data;

              $scope.formData.CodigoEstado = $scope.cotizacion[0].Solicitud.CodigoEstado;

              if ($scope.cotizacion.length == 2) {
                $scope.formData.salud = true;
                $scope.formData.pension = true;
              } else if ($scope.cotizacion[0].CodigoCompania == 3) {
                $scope.formData.salud = true;
              } else if ($scope.cotizacion[0].CodigoCompania == 2) {
                $scope.formData.pension = true;
              }

              if ($scope.cotizacion[0].Solicitud.SecuenciaReg >= 2) {
                $scope.paso2 = true;

                $scope.formData.mTipoDocumento = { Codigo: $scope.cotizacion[0].TipoDocumento, Descripcion: $scope.cotizacion[0].TipoDocumento };
                $scope.formData.mNumeroDocumento = $scope.cotizacion[0].NumeroDocumento;
                $scope.formData.mRazonSocial = $scope.cotizacion[0].RazonSocial;
                $scope.formData.mApePatContratante = ($scope.cotizacion[0].ApellidoPaterno == '') ? '' : $scope.cotizacion[0].ApellidoPaterno;
                $scope.formData.mApeMatContratante = ($scope.cotizacion[0].ApellidoMaterno == '') ? '' : $scope.cotizacion[0].ApellidoMaterno;
                $scope.formData.McaFisico = ($scope.cotizacion[0].McaFisico == '') ? '' : $scope.cotizacion[0].McaFisico;
                $scope.formData.mSexo = ($scope.cotizacion[0].Sexo == '') ? '' : $scope.cotizacion[0].Sexo;
                $scope.formData.mProfesion = {};
                $scope.formData.mProfesion.Codigo = ($scope.cotizacion[0].CodigoProfesion == 0) ? 99 : $scope.cotizacion[0].CodigoProfesion;
                $scope.formData.mActivSunat = { codigo: $scope.cotizacion[0].CodigoCiiuEmp, descripcion: $scope.cotizacion[0].DescripcionCiiuEmp };
                $scope.formData.mDirReferencias = $scope.cotizacion[0].Referencia;
                $scope.formData.mRepresentante = $scope.cotizacion[0].Representante;
                $scope.formData.mRepresentanteCargo = { Codigo: $scope.cotizacion[0].TipoCargoRep, Descripcion: $scope.cotizacion[0].CargoRepresentante };
                $scope.formData.showNaturalRucPerson = !mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento);
                $scope.formData.mCorreoElectronico = $scope.cotizacion[0].EmailUsuario;
                $scope.formData.mTelefonoCelular = $scope.cotizacion[0].NumeroMovil;
                $scope.formData.mTelefonoFijo = $scope.cotizacion[0].Telefono;
                $scope.formData.McaExtCliTron = $scope.cotizacion[0].McaExtCliTron || "N";
                $scope.formData.dataContractor2.McaExtCliTron = $scope.cotizacion[0].McaExtCliTron || "N";
                $scope.formData.dataContractor2.McaReciboPendienteSalud = $scope.cotizacion[0].McaReciboPendienteSalud;
                $scope.formData.dataContractor2.McaReciboPendientePension = $scope.cotizacion[0].McaReciboPendientePension;
                $scope.formData.McaReciboPendienteSalud = $scope.formData.dataContractor2.McaReciboPendienteSalud;
                $scope.formData.McaReciboPendientePension = $scope.formData.dataContractor2.McaReciboPendientePension;
                $scope.formData.dataContractor2.McaDeficitarioPension = data.McaDeficitarioPension;
                $scope.formData.dataContractor2.McaDeficitarioSalud = $scope.cotizacion[0].McaDeficitarioSalud;
                $scope.formData.isdeficitario = $scope.formData.dataContractor2.McaDeficitarioPension == 'S' || $scope.formData.dataContractor2.McaDeficitarioSalud == 'S';
                $scope.formData.contractorAddress = {};
                $scope.formData.contractorAddress.ubigeoData = {
                  mDepartamento: { Codigo: $scope.cotizacion[0].Departamento },
                  mProvincia: { Codigo: $scope.cotizacion[0].Provincia },
                  mDistrito: { Codigo: $scope.cotizacion[0].Distrito }
                };

                $scope.formData.contractorAddress.mTipoZona = { Codigo: $scope.cotizacion[0].TipoZona };
                $scope.formData.contractorAddress.mNombreZona = $scope.cotizacion[0].DescripcionZona;
                $scope.formData.contractorAddress.mDirReferencias = $scope.cotizacion[0].Referencia;
                $scope.formData.contractorAddress.mTipoVia = { Codigo: $scope.cotizacion[0].TipoDomicilio };
                $scope.formData.contractorAddress.mNombreVia = $scope.cotizacion[0].NombreDomicilio;
                $scope.formData.contractorAddress.mTipoNumero = { Codigo: $scope.cotizacion[0].TipoNumero };
                $scope.formData.contractorAddress.mNumeroDireccion = $scope.cotizacion[0].DescripcionNumero;
                $scope.formData.contractorAddress.mTipoInterior = { Codigo: $scope.cotizacion[0].TipoInterior };
                $scope.formData.contractorAddress.mNumeroInterior = $scope.cotizacion[0].DescripcionInterior;

                _createObjectComponent("personData", $scope.formData);
              }
            }
          });
        }

        $scope.validateMovil = function () {
          if (typeof $scope.formData.mTelefonoCelular != 'undefined') {
            if ($scope.formData.mTelefonoCelular.length < 7)
              return true;
            else
              return false;
          } else {
            if (typeof $scope.formData.dataContractor2 != 'undefined') {
              if (typeof $scope.formData.dataContractor2.NumeroMovil != 'undefined') {
                if ($scope.formData.dataContractor2.NumeroMovil.length < 7)
                  return true;
                else
                  return false;
              }
            }
          }
        }

        /*#########################
        # ModalConfirmation
        #########################*/
        $scope.showModalConfirmation = function () {
          $scope.$broadcast('submitForm', true);
          var validarTelefonos = _validarTelefonos();
          if(!validarTelefonos) return;
          if(!$scope.formData.mActivSunat){
            console.log('showModalConfirmation')
            return;
          }
  
          if (!$scope.formData.agenteBloqueado) {

            $scope.validateMovil();

            if ($scope.formData.quotation > 0) {
              $state.go('.', {
                step: 2
              });
            }
            var dc = $scope.formData && $scope.formData.dataContractor2 ? $scope.formData.dataContractor2 : undefined;
            if (dc) {
              var pendientePago = dc.McaReciboPendientePension == 'S' &&
                dc.McaReciboPendienteSalud == 'S'
              var isdeficitario = dc.McaDeficitarioPension == 'S' ||
                dc.McaDeficitarioSalud == 'S';

              $scope.formData.salud = dc.McaReciboPendienteSalud != 'S'
              $scope.formData.pension = dc.McaReciboPendientePension != 'S'

              $scope.formData.isdeficitario = isdeficitario;

              $scope.formData.applyDeficitarioValidation = isdeficitario
                && !$scope.formData.isBroker

              if (pendientePago) {
                mModalAlert.showWarning("El cliente actual tiene recibos pendientes por mas de 60 dias por pagar", 'Pendiente de Pago');
                return;
              } else
                if ($scope.formData.applyDeficitarioValidation &&
                  $stateParams.tipo == constants.module.polizas.sctr.periodoCorto.TipoPeriodo) {
                  mModalAlert.showWarning("El cliente actual es deficitario", 'Deficitario');
                  return;
                }

              $scope.formData.McaReciboPendienteSalud = dc.McaReciboPendienteSalud;
              $scope.formData.McaReciboPendientePension = dc.McaReciboPendientePension;

            }

            if (typeof $scope.formData.NroSolicitud == 'undefined' || $scope.formData.NroSolicitud == 0) {
              $scope.validationForm();
              if ($scope.formData.validatedPaso1) {
                var personData = $scope.formData.personData;
                proxyClient.ServicesClientValid(personData.documentType.Codigo, personData.documentNumber, 'SCTR', true)
                  .then(function(res) {
                    if (res.operationCode === constants.operationCode.code900) {
                      mModalAlert.showError(res.message, 'ERROR');

                      return false;
                    }

                    $scope.dataConfirmation = {
                      save: false,
                      title: '¿Estás seguro que quieres guardar los datos de la empresa?',
                      subTitle: 'Recuerda que una vez guardados los datos no podrás hacer cambios',
                      lblClose: 'Seguir editando',
                      lblSave: 'Guardar y continuar'
                    };
                    var vModalSteps = $uibModal.open({
                      backdrop: true, // background de fondo
                      backdropClick: true,
                      dialogFade: false,
                      keyboard: true,
                      scope: $scope,
                      // size: 'lg',
                      template: '<mpf-modal-confirmation-steps data="dataConfirmation" close="close()"></mpf-modal-confirmation-steps>',
                      controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
                        //CloseModal
                        $scope.close = function () {
                          $uibModalInstance.close();
                        };
                      }]
                    });
                    vModalSteps.result.then(function () {
                      $scope.$watch('dataConfirmation', function (value) {
                        if (value.save) {
                          $scope.nextStep();
                        }
                      });
                      //Action after CloseButton Modal
                      //console.log('closeButton');
                    }, function () {
                      //Action after CancelButton Modal
                      // console.log("CancelButton");
                    });

                });
              }
            } else {
              $state.go('.', {
                step: 2
              });
            }
          } else {
            mModalAlert.showError('El código de agente ha sido bloqueado para emisión SCTR por presentar 3 pólizas pendientes de pago (primer recibo pendiente vencido mayor a 45 días). <br/>' +
              'Coordinar con su gestor comercial', 'Agente Bloqueado');
          }
        };

        function _validarTelefonos(){
          if(
            ($scope.formData.personData.Telefono !== undefined && $scope.formData.personData.Telefono !== '')
            ||
            ($scope.formData.personData.Telefono2 !== undefined && $scope.formData.personData.Telefono2 !== '')
          ) {
           return true;
          }

          return false;
        }

        /*########################
        # Grabar Paso # 1
        ########################*/
        function grabarP1() {
          $scope.setTipoPersona();
          $scope.formData.mAgente = $rootScope.mAgente;

          if (mainServices.fnShowNaturalRucPerson($scope.formData.mTipoDocumento.Codigo, $scope.formData.mNumeroDocumento))
            $scope.formData.McaFisico = 'S';
          else
            $scope.formData.McaFisico = 'N';

          Number.prototype.padLeft = function (base, chr) {
            var len = (String(base || 10).length - String(this).length) + 1;
            return len > 0 ? new Array(len).join(chr || '0') + this : this;
          }

          var d = new Date,
            dformat = [d.getDate().padLeft(),
            (d.getMonth() + 1).padLeft(),
            d.getFullYear()].join('/') +
              ' ' +
              [d.getHours().padLeft(),
              d.getMinutes().padLeft(),
              d.getSeconds().padLeft()].join(':');

          if ($scope.formData.mAgente.codigoAgente != '0') {
            if ($scope.formData.tipoSCTR == constants.module.polizas.sctr.periodoCorto.TipoPeriodo) {
              var paramsP1 = {
                Empresa: {
                  CodigoProcedencia: constants.module.polizas.sctr.procedencia,
                  CodigoCompania: constants.module.polizas.sctr.companyCode,
                  TipoEntidad: constants.module.polizas.sctr.TipoEntidad,
                  TipoDocumento: $scope.formData.mTipoDocumento.Codigo,
                  NumeroDocumento: $scope.formData.mNumeroDocumento,
                  RazonSocial: $scope.formData.mRazonSocial,
                  ApellidoPaterno: (typeof $scope.formData.mApePatContratante == 'undefined') ? '' : $scope.formData.mApePatContratante,
                  ApellidoMaterno: (typeof $scope.formData.mApeMatContratante == 'undefined') ? '' : $scope.formData.mApeMatContratante,
                  Sexo: (typeof $scope.formData.mSexo == 'undefined') ? '' : $scope.formData.mSexo,
                  McaFisico: $scope.formData.McaFisico,
                  CodigoProfesion: (typeof $scope.formData.mProfesion.Codigo == 'undefined') ? 99 : parseInt($scope.formData.mProfesion.Codigo) || 0,
                  Profesion: (typeof $scope.formData.mProfesion.Descripcion == 'undefined') ? '' : $scope.formData.mProfesion.Descripcion,
                  EmailUsuario: $scope.formData.mCorreoElectronico,
                  TipoDomicilio: $scope.formData.contractorAddress.mTipoVia.Codigo,//3,//codigo via ** por preguntar
                  NombreDomicilio: $scope.formData.contractorAddress.mNombreVia,
                  CodigoPais: 'PE', //constants.module.polizas.sctr.pais, //fijo
                  Pais: 'PERU',
                  CodigoDepartamento: $scope.formData.contractorAddress.ubigeoData.mDepartamento.Codigo,
                  CodigoProvincia: $scope.formData.contractorAddress.ubigeoData.mProvincia.Codigo,
                  CodigoDistrito: $scope.formData.contractorAddress.ubigeoData.mDistrito.Codigo,
                  CodigoPostal: constants.module.polizas.sctr.codPostal,//viene de servicio
                  Telefono: $scope.formData.mTelefonoFijo,
                  NumeroMovil: (typeof $scope.formData.mTelefonoCelular == 'undefined' || $scope.formData.mTelefonoCelular == null) ? '' : $scope.formData.mTelefonoCelular,//$scope.formData.mTelefonoCelular,
                  Representante: $scope.formData.mRepresentante,
                  TipoCargoRep: parseInt($scope.formData.mRepresentanteCargo.Codigo),
                  CodigoCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.codigo : '',
                  DescripcionCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.descripcion : '',
                  DescripcionTrabajo: '',
                  McaExtCliTron: $scope.formData.McaExtCliTron,
                  PersonaNatural: $scope.formData.PersonaNatural,//'N', //si no es RUC
                  TipoNumero: (typeof $scope.formData.contractorAddress.mTipoNumero.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoNumero.Codigo == null) ? '' : $scope.formData.contractorAddress.mTipoNumero.Codigo,//$scope.formData.contractorAddress.mTipoNumero.Codigo,
                  DescripcionNumero: (typeof $scope.formData.contractorAddress.mNumeroDireccion == 'undefined' || $scope.formData.contractorAddress.mNumeroDireccion == null) ? '' : $scope.formData.contractorAddress.mNumeroDireccion,//$scope.formData.contractorAddress.mNumeroDireccion,
                  TipoInterior: (typeof $scope.formData.contractorAddress.mTipoInterior.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoInterior.Codigo == null) ? '' : $scope.formData.contractorAddress.mTipoInterior.Codigo,
                  DescripcionInterior: (typeof $scope.formData.contractorAddress.mNumeroInterior == 'undefined' || $scope.formData.contractorAddress.mNumeroInterior == null) ? '' : $scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNumeroInterior,
                  TipoZona: (typeof $scope.formData.contractorAddress.mTipoZona.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoZona.Codigo == null) ? '' : $scope.formData.contractorAddress.mTipoZona.Codigo,//$scope.formData.contractorAddress.mTipoZona.Codigo,
                  DescripcionZona: (typeof $scope.formData.contractorAddress.mNombreZona == 'undefined' || $scope.formData.contractorAddress.mNombreZona == null) ? '' : $scope.formData.contractorAddress.mNombreZona,//$scope.formData.contractorAddress.mNombreZona,
                  Referencia: (typeof $scope.formData.contractorAddress.mDirReferencias == 'undefined' || $scope.formData.contractorAddress.mDirReferencias == null) ? '' : $scope.formData.contractorAddress.mDirReferencias,
                  CodigoAgente: $scope.formData.mAgente.codigoAgente,
                  Tipo: 1, //pendiente
                  TipoRol: $scope.formData.TipoRol,
                  CodigoUserReg: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  Solicitud: {
                    TipoPeriodo: constants.module.polizas.sctr.periodoCorto.TipoPeriodo, //PC
                    CodigoEstado: constants.module.polizas.sctr.CodigoEstado, //fijo
                    DescripcionEstado: constants.module.polizas.sctr.DescripcionEstado, //fijo
                    SecuenciaReg: constants.module.polizas.sctr.SecuenciaReg, //fijo
                    EmailSolicitud: $scope.formData.suscriptorEmail,//'LQUEQUEZANA@MAPFRE.COM.PE', //pendiente correo del suscritor
                    NroSolicitud: 0,
                    RolUsuario: $scope.formData.TipoRol//$scope.formData.mAgente.rolUsuario.substring(0, 3)//'ADM'//$scope.formData.mAgente.rolUsuario
                  }
                },
                Documento:
                {
                  NumeroDocumento: 0,
                  NumeroAnterior: 0,
                  NumeroTicket: '',
                  NumeroPoliza: '',
                  CodigoEstado: constants.module.polizas.sctr.codEdo, //fijo
                  CodigoUsuario: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  FechaRegistro: dformat,//'03/10/2016 12:59:35',
                  IpDocumento: '::1',
                  CodigoUsuarioRED: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  EstadoEmision: '',
                  RutaDocumento: '',
                  FlagDocumento: constants.module.polizas.sctr.FlagDocumento,//'N',//fijo
                  CodigoProceso: constants.module.polizas.sctr.CodigoProceso,//fijo
                  CodigoProducto: $scope.formData.productos[0].Codigo,//64,//constants.module.polizas.sctr.periodoCorto.CodigoProducto,//55,//solo PC
                  CodigoMoneda: constants.module.polizas.sctr.CodigoMoneda, //pendiente
                  CodigoCia: ''
                },
                Polizas:
                  [
                    {
                      NumeroSolicitud: 0,
                      CodigoCompania: constants.module.polizas.sctr.salud.CodigoCompania,//3,//cia para salud
                      CodigoRamo: constants.module.polizas.sctr.salud.CodigoRamo,//salud
                      CodUserReg: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                      Tipo: constants.module.polizas.sctr.salud.Tipo
                    },
                    {
                      NumeroSolicitud: 0,
                      CodigoCompania: constants.module.polizas.sctr.pension.CodigoCompania,//cia para pension
                      CodigoRamo: constants.module.polizas.sctr.pension.CodigoRamo,//pension
                      CodUserReg: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                      Tipo: constants.module.polizas.sctr.pension.Tipo
                    }
                  ]
              };

              sctrEmitFactory.grabarPaso1PC(paramsP1, true).then(function (response) {
                if (response.OperationCode == constants.operationCode.success) {

                  $scope.formData.NroSolicitud = response.Data.NumeroSolicitud;
                  $scope.$parent.formData.NroSolicitud = response.Data.NumeroSolicitud;
                  $scope.formData.NumeroTicket = response.Data.NumeroTicket;
                  $scope.formData.PolizaEstado = response.Data.PolizaEstado; //si es V dejo pasar
                  $scope.formData.PolizaEstadoDetalle = response.Data.PolizaEstadoDetalle;
                  $scope.formData.CodigoPostal = response.Data.CodigoPostal;

                  $scope.formData.paso1Grabado = true;
                  if ((typeof $scope.formData.PolizaEstadoDetalle != 'undefined') &&
                    ($scope.formData.PolizaEstadoDetalle != '')) {
                    var message = $scope.formData.PolizaEstadoDetalle;//.replace(/<br\s*\/?>/mg,"\n")
                    mModalAlert.showWarning(message, 'Paso 1');
                    $state.go('.', {
                      step: 2
                    });
                  } else {
                    if ($scope.formData.PolizaEstado != 'V' && typeof $scope.formData.PolizaEstado != 'undefined') {
                      // mModalAlert.showError('Tiene pólizas expiradas', 'Paso 1');
                      var message = $scope.formData.PolizaEstadoDetalle;//.replace(/<br\s*\/?>/mg,"\n")
                      mModalAlert.showWarning(message, 'Paso 1');
                    } else {
                      $state.go('.', {
                        step: 2
                      });
                    }
                  }

                } else if (response.OperationCode == 422) {
                  $scope.formData.PolizaEstadoDetalle = response.Data.PolizaEstadoDetalle;
                  var message = $scope.formData.PolizaEstadoDetalle;//.replace(/<br\s*\/?>/mg,"\n")
                  mModalAlert.showWarning(message, 'Paso 1');
                } else {
                  mModalAlert.showError(response.Message, 'Paso 1');
                }
              });
            } else if ($scope.formData.tipoSCTR == constants.module.polizas.sctr.periodoNormal.TipoPeriodo) {

              var paramsP1 = {
                Empresa: {
                  CodigoProcedencia: constants.module.polizas.sctr.procedencia,
                  CodigoCompania: constants.module.polizas.sctr.companyCode,
                  TipoEntidad: constants.module.polizas.sctr.TipoEntidad,
                  TipoDocumento: $scope.formData.mTipoDocumento.Codigo,//'RUC',
                  NumeroDocumento: $scope.formData.mNumeroDocumento,//20145549478,
                  RazonSocial: $scope.formData.mRazonSocial,
                  ApellidoPaterno: (typeof $scope.formData.mApePatContratante == 'undefined') ? '' : $scope.formData.mApePatContratante,
                  ApellidoMaterno: (typeof $scope.formData.mApeMatContratante == 'undefined') ? '' : $scope.formData.mApeMatContratante,
                  Sexo: (typeof $scope.formData.mSexo == 'undefined') ? '' : $scope.formData.mSexo,
                  McaFisico: $scope.formData.McaFisico,
                  CodigoProfesion: (typeof $scope.formData.mProfesion.Codigo == 'undefined') ? 99 : parseInt($scope.formData.mProfesion.Codigo) || 0,
                  Profesion: (typeof $scope.formData.mProfesion.Descripcion == 'undefined') ? '' : $scope.formData.mProfesion.Descripcion,
                  EmailUsuario: $scope.formData.mCorreoElectronico,
                  TipoDomicilio: $scope.formData.contractorAddress.mTipoVia.Codigo,
                  NombreDomicilio: $scope.formData.contractorAddress.mNombreVia,
                  CodigoPais: 'PE',//constants.module.polizas.sctr.pais, //fijo
                  Pais: 'PERU',
                  CodigoDepartamento: $scope.formData.contractorAddress.ubigeoData.mDepartamento.Codigo,
                  CodigoProvincia: $scope.formData.contractorAddress.ubigeoData.mProvincia.Codigo,
                  CodigoDistrito: $scope.formData.contractorAddress.ubigeoData.mDistrito.Codigo,
                  CodigoPostal: constants.module.polizas.sctr.codPostal,//viene de servicio
                  Telefono: $scope.formData.mTelefonoFijo,
                  NumeroMovil: (typeof $scope.formData.mTelefonoCelular == 'undefined' || $scope.formData.mTelefonoCelular == null) ? '' : $scope.formData.mTelefonoCelular,//$scope.formData.mTelefonoCelular,
                  Representante: $scope.formData.mRepresentante,
                  TipoCargoRep: parseInt($scope.formData.mRepresentanteCargo.Codigo),
                  CodigoCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.codigo : '',
                  DescripcionCiiuEmp: ($scope.formData.mActivSunat) ? $scope.formData.mActivSunat.descripcion : '',
                  DescripcionTrabajo: '',
                  McaExtCliTron: $scope.formData.McaExtCliTron,
                  PersonaNatural: $scope.formData.PersonaNatural,//'N', //si no es RUC
                  TipoNumero: (typeof $scope.formData.contractorAddress.mTipoNumero.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoNumero.Codigo == null) ? '' : $scope.formData.contractorAddress.mTipoNumero.Codigo,//$scope.formData.contractorAddress.mTipoNumero.Codigo,
                  DescripcionNumero: (typeof $scope.formData.contractorAddress.mNumeroDireccion == 'undefined' || $scope.formData.contractorAddress.mNumeroDireccion == null) ? '' : $scope.formData.contractorAddress.mNumeroDireccion,//$scope.formData.contractorAddress.mNumeroDireccion,
                  TipoInterior: (typeof $scope.formData.contractorAddress.mTipoInterior.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoInterior.Codigo == null) ? '' : $scope.formData.contractorAddress.mTipoInterior.Codigo,
                  DescripcionInterior: (typeof $scope.formData.contractorAddress.mNumeroInterior == 'undefined' || $scope.formData.contractorAddress.mNumeroInterior == null) ? '' : $scope.formData.contractorAddress.mNumeroInterior,//$scope.formData.contractorAddress.mNumeroInterior,
                  TipoZona: (typeof $scope.formData.contractorAddress.mTipoZona.Codigo == 'undefined' || $scope.formData.contractorAddress.mTipoZona.Codigo == null) ? '' : $scope.formData.contractorAddress.mTipoZona.Codigo,//$scope.formData.contractorAddress.mTipoZona.Codigo,
                  DescripcionZona: (typeof $scope.formData.contractorAddress.mNombreZona == 'undefined' || $scope.formData.contractorAddress.mNombreZona == null) ? '' : $scope.formData.contractorAddress.mNombreZona,//$scope.formData.contractorAddress.mNombreZona,
                  Referencia: (typeof $scope.formData.contractorAddress.mDirReferencias == 'undefined' || $scope.formData.contractorAddress.mDirReferencias == null) ? '' : $scope.formData.contractorAddress.mDirReferencias,
                  CodigoAgente: $scope.formData.mAgente.codigoAgente,
                  Tipo: 1, //pendiente
                  TipoRol: $scope.formData.TipoRol,
                  CodigoUserReg: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  Solicitud: {
                    TipoPeriodo: constants.module.polizas.sctr.periodoNormal.TipoPeriodo, //PN
                    CodigoEstado: 'RE',
                    DescripcionEstado: 'REGISTRADA',
                    SecuenciaReg: 2,
                    EmailSolicitud: $scope.formData.suscriptorEmail, //'RICARDO@MULTIPLICA.COM',
                    NroSolicitud: 0,
                    RolUsuario: $scope.formData.TipoRol//$scope.formData.mAgente.rolUsuario.substring(0, 3)//'ADM'//$scope.formData.mAgente.rolUsuario
                  }
                },
                Documento:
                {
                  NumeroDocumento: 0,
                  NumeroAnterior: 0,
                  NumeroTicket: '',
                  NumeroPoliza: '',
                  CodigoEstado: constants.module.polizas.sctr.codEdo, //fijo
                  CodigoUsuario: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  FechaRegistro: dformat,//'03/10/2016 12:59:35',
                  IpDocumento: '::1',
                  CodigoUsuarioRED: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                  EstadoEmision: '',
                  RutaDocumento: '',
                  FlagDocumento: 'N',
                  CodigoProceso: 1,
                  CodigoProducto: $scope.formData.productos[0].Codigo,//64,//constants.module.polizas.sctr.periodoNormal.CodigoProducto,//55,//solo PC
                  CodigoMoneda: constants.module.polizas.sctr.CodigoMoneda, //pendiente
                  CodigoCia: ''
                },
                Polizas:
                  [
                    {
                      NumeroSolicitud: 0,
                      CodigoCompania: constants.module.polizas.sctr.salud.CodigoCompania,//3,//cia para salud
                      CodigoRamo: constants.module.polizas.sctr.salud.CodigoRamo,//salud
                      CodUserReg: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                      Tipo: constants.module.polizas.sctr.salud.Tipo
                    },
                    {
                      NumeroSolicitud: 0,
                      CodigoCompania: constants.module.polizas.sctr.pension.CodigoCompania,//cia para pension
                      CodigoRamo: constants.module.polizas.sctr.pension.CodigoRamo,//pension
                      CodUserReg: oimClaims.loginUserName.toUpperCase(),//$scope.formData.mAgente.codigoUsuario,
                      Tipo: constants.module.polizas.sctr.pension.Tipo
                    }
                  ]
              };

              sctrEmitFactory.grabarPaso1PN(paramsP1, true).then(function (response) {
                if (response.OperationCode == constants.operationCode.success) {
                  $scope.formData.NroSolicitud = response.Data.NumeroSolicitud;
                  $scope.$parent.formData.NroSolicitud = response.Data.NumeroSolicitud;
                  $scope.formData.NumeroTicket = response.Data.NumeroTicket;
                  $scope.formData.PolizaEstado = response.Data.PolizaEstado; //si es V dejo pasar
                  $scope.formData.PolizaEstadoDetalle = response.Data.PolizaEstadoDetalle;
                  $scope.formData.CodigoPostal = response.Data.CodigoPostal;

                  $scope.formData.paso1Grabado = true;

                  if ((typeof $scope.formData.PolizaEstadoDetalle != 'undefined') &&
                    ($scope.formData.PolizaEstadoDetalle != '')) {
                    var message = $scope.formData.PolizaEstadoDetalle;//.replace(/<br\s*\/?>/mg,"\n")
                    mModalAlert.showWarning(message, 'Paso 1');
                    $state.go('.', {
                      step: 2
                    });
                  } else {
                    if ($scope.formData.PolizaEstado != 'V' && typeof $scope.formData.PolizaEstado != 'undefined') {
                      // mModalAlert.showError('Tiene pólizas expiradas', 'Paso 1');
                      var message = $scope.formData.PolizaEstadoDetalle;//.replace(/<br\s*\/?>/mg,"\n")
                      mModalAlert.showWarning(message, 'Paso 1');
                    } else {
                      $state.go('.', {
                        step: 2
                      });
                    }
                  }

                } else if (response.OperationCode == 422) {
                  $scope.formData.PolizaEstadoDetalle = response.Data.PolizaEstadoDetalle;
                  var message = $scope.formData.PolizaEstadoDetalle;//.replace(/<br\s*\/?>/mg,"\n")
                  mModalAlert.showWarning(message, 'Paso 1');
                } else {
                  mModalAlert.showWarning(response.Message, 'Paso 1');
                }
              });
            }
          } else {
            mModalAlert.showError("No tiene un agente seleccionado", "Error");
          }
        };

        $scope.nextStep = function () {
          grabarP1();
        };

        $scope.validationForm = function () {
          $scope.frmSCTR1.markAsPristine();
          $scope.formData.validatedPaso1 = $scope.frmSCTR1.$valid && $scope.contractorValid;
        }
      }]);
  });
