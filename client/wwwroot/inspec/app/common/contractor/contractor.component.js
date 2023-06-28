'use strict';

define(['angular', 'constants', 'moment'], function(ng, constants, moment) {
  contractorController.$inject = ['$scope', '$state', 'inspecFactory', '$log', '$q'];
  function contractorController($scope, $state, inspecFactory, $log, $q) {
    var vm = this;
    var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
    vm.$onInit = onInit;

    function onInit() {
      vm.naturalPerson = true;
      vm.currentDoc = {};
      // vm.showNaturalPerson = showNaturalPerson;
      vm.inferData = inferData;
      vm.clean = clean;
      vm.clear = clear;
      queryAll().then(function() {
        spinner().end();
      });
      if (!ng.isUndefined(vm.origin)) {
        setContrator();
      }
    }

    function queryAll() {
      spinner().start();
      return $q.all([
        getTipoDocumento(),
        getListEstadoCivil(),
        getOcupacion(),
        getListPais(),
        getListTipo(),
        getNumeracionDomicilio(),
        getListInterior(),
        getListZona()
      ]);
    }

    function getTipoDocumento() {
      return inspecFactory.common.getTipoDocumento().then(function(response) {
        vm.documentTypeData = response.Data;
      });
    }

    function getListEstadoCivil() {
      return inspecFactory.common.getListEstadoCivil().then(function(response) {
        vm.civilStatusData = response.Data;
      });
    }

    function getOcupacion() {
      return inspecFactory.common.getOcupacion().then(function(response) {
        vm.profesionsData = response.Data;
      });
    }
    function getListPais() {
      return inspecFactory.common.getListPais().then(function(response) {
        vm.nacionalitiesData = response.Data;
      });
    }

    function getListTipo() {
      return inspecFactory.ubigeo.getListTipo().then(function(response) {
        vm.typesData = response.Data;
      });
    }
    function getNumeracionDomicilio() {
      return inspecFactory.ubigeo.getNumeracionDomicilio().then(function(response) {
        vm.numerationsData = response.Data;
      });
    }

    function getListInterior() {
      return inspecFactory.ubigeo.getListInterior().then(function(response) {
        vm.interiorsData = response.Data;
      });
    }

    function getListZona() {
      return inspecFactory.ubigeo.getListZona().then(function(response) {
        vm.zonesData = response.Data;
      });
    }

    // function showNaturalPerson(documentTypeData) {
    //   vm.naturalPerson = documentTypeData.Codigo !== constants.documentTypes.ruc.Codigo;
    //   setDocMaxLength(documentTypeData.Codigo);
    // }

    function setDocMaxLength(documentType) {
      switch (documentType) {
        case constants.documentTypes.dni.Codigo:
          vm.docMaxLength = 8;
          break;
        case constants.documentTypes.ruc.Codigo:
          vm.docMaxLength = 11;
          break;
        default:
          vm.docMaxLength = 13;
      }
    }

    function setContrator() {
      vm.data = {};
      vm.data.searchedPerson = true;
      vm.data.mNroDocumento = vm.origin.documentNumber;
      vm.data.mTipoDocumento = {Codigo: vm.origin.documentTypeCode};
      vm.data.mContactName = vm.origin.contactName;
      vm.data.mRazonSocial = vm.origin.name;
      vm.data.mActividadEconomica = {Codigo: vm.origin.economicActivity};
      vm.data.mNomContratante = vm.origin.name;
      vm.data.mApePatContratante = vm.origin.lastName;
      vm.data.mApeMatContratante = vm.origin.motherlastName;
      vm.data.mSexo = vm.origin.sex === '1' || vm.origin.sex === 'H' ? 'M' : 'F';
      vm.data.mEstadoCivil = {CodigoEstadoCivil: vm.origin.civilstateId};
      vm.data.mProfesion = {Codigo: vm.origin.professionId};
      vm.data.mNacionalidad = {Codigo: vm.origin.nationalityCode};
      vm.data.mTelfPersonal = vm.origin.contactPhone;
      vm.data.mTelfOficina = vm.origin.contactOfficePhone;
      vm.data.mCelular = vm.origin.contactCelphone;
      vm.data.mEmailPersonal = vm.origin.contactEmail;
      vm.data.saldoMapfreDolares = isNaN(parseFloat(vm.origin.mapfreDollar)) ? 0 : parseFloat(vm.origin.mapfreDollar);
      vm.data.mFechaNacimiento = vm.origin.birthDate
        ? moment(vm.origin.birthDate, 'D/MM/YYYY h:mm:ss A').toDate()
        : null;
      vm.data.mDepartamento = {Codigo: vm.origin.departmentId};
      vm.data.mProvincia = {Codigo: vm.origin.provinceId};
      vm.data.mDistrito = {Codigo: vm.origin.districtId};
      vm.data.mSelectVia = {Codigo: vm.origin.roadTypeId};
      vm.data.mSelectNumero = {Codigo: vm.origin.numberTypeId};
      vm.data.mSelectInterior = {
        Codigo: vm.origin.insideTypeId && vm.origin.insideTypeId > 0 ? vm.origin.insideTypeId : null
      };
      vm.data.mSelectZona = {Codigo: vm.origin.zoneTypeId && vm.origin.zoneTypeId > 0 ? vm.origin.zoneTypeId : null};
      vm.data.mVia = vm.origin.roadDescription;
      vm.data.mNumero = vm.origin.numberDescription;
      vm.data.mInterior = vm.origin.insideDescription;
      vm.data.mZona = vm.origin.zoneDescription;
      vm.data.mReferencias = vm.origin.addressReference;
    }

    function inferData() {
      var documentValue = vm.data.mNroDocumento;
      var documentType = vm.data.mTipoDocumento && vm.data.mTipoDocumento.Codigo ? vm.data.mTipoDocumento.Codigo : null;
      if (documentValue && documentType && (vm.currentDoc.number !== documentValue || vm.currentDoc.type !== documentType)) {
        vm.currentDoc = {number: documentValue, type: documentType};
        spinner().start();
        inspecFactory.common.getContratanteByNroDocumento(documentType, documentValue, false).then(function(response) {
          if (!ng.isString(response.Data)) {
            vm.data.searchedPerson = true;
            vm.data.mRazonSocial = response.Data.Nombre;
            vm.data.mActividadEconomica = {
              Codigo: response.Data.ActividadEconomica.Codigo === '' ? null : response.Data.ActividadEconomica.Codigo
            };
            vm.data.mNomContratante = response.Data.Nombre;
            vm.data.mApePatContratante = response.Data.ApellidoPaterno;
            vm.data.mApeMatContratante = response.Data.ApellidoMaterno;
            vm.data.mSexo = response.Data.Sexo === '1' || response.Data.Sexo === 'H' ? 'M' : 'F';
            vm.data.mEstadoCivil = {
              CodigoEstadoCivil: response.Data.CodigoEstadoCivil !== 0 ? response.Data.CodigoEstadoCivil : null
            };
            vm.data.mProfesion = {
              Codigo: response.Data.Profesion && response.Data.Profesion.Codigo ? response.Data.Profesion.Codigo : null
            };
            vm.data.mNacionalidad = {
              Codigo: response.Data.Ubigeo.CodigoPaisNatal ? response.Data.Ubigeo.CodigoPaisNatal : null
            };
            vm.data.mTelefonoFijo = response.Data.Telefono;
            vm.data.mTelefonoCelular = response.Data.Telefono2;
            vm.data.saldoMapfreDolares = isNaN(parseFloat(response.Data.SaldoMapfreDolar))
              ? 0
              : parseFloat(response.Data.SaldoMapfreDolar);
            if (response.Data.FechaNacimiento) {
              vm.data.mFechaNacimiento = new Date(response.Data.FechaNacimiento.replace(pattern, '$3-$2-$1'));
            } else {
              vm.data.mFechaNacimiento = null;
            }
            vm.data.mDepartamento = {
              Codigo: response.Data.Ubigeo.CodigoDepartamento ? response.Data.Ubigeo.CodigoDepartamento : null
            };
            vm.data.mProvincia = {
              Codigo: response.Data.Ubigeo.CodigoProvincia ? response.Data.Ubigeo.CodigoProvincia : null
            };
            vm.data.mDistrito = {
              Codigo: response.Data.Ubigeo.CodigoDistrito ? response.Data.Ubigeo.CodigoDistrito : null
            };
            vm.data.mSelectVia = {
              Codigo: response.Data.Ubigeo.CodigoVia ? response.Data.Ubigeo.CodigoVia : null
            };
            vm.data.mSelectNumero = {
              Codigo: response.Data.Ubigeo.CodigoNumero ? response.Data.Ubigeo.CodigoNumero : null
            };
            vm.data.mSelectInterior = {
              Codigo: response.Data.Ubigeo.CodigoInterior ? response.Data.Ubigeo.CodigoInterior : null
            };
            vm.data.mSelectZona = {
              Codigo: response.Data.Ubigeo.CodigoZona ? response.Data.Ubigeo.CodigoZona : null
            };
            vm.data.mVia = response.Data.Ubigeo.Direccion;
            vm.data.mNumero = response.Data.Ubigeo.TextoNumero;
            vm.data.mInterior = response.Data.Ubigeo.TextoInterior;
            vm.data.mZona = response.Data.Ubigeo.TextoZona;
            vm.data.mReferencias = response.Data.Ubigeo.Referencia;
            vm.data.mTelfPersonal = response.Data.Telefono;
            vm.data.mTelfOficina = response.Data.TelefonoOficina;
            vm.data.mCelular = response.Data.Telefono2;
            vm.data.mEmailPersonal = response.Data.CorreoElectronico;
          } else {
            clear(false);
          }
          spinner().end();
        });
      }
    }

    function spinner() {
      var injector, mpSpin;
      try {
        injector = angular.injector(['oim.theme.service']);
        mpSpin = injector.get('mpSpin');
      } catch (e) {
        $log.log('error', e);
      }
      return {
        start: function() {
          if (mpSpin) {
            mpSpin.start();
          }
        },
        end: function() {
          if (mpSpin) {
            mpSpin.end();
          }
        }
      };
    }

    function clean() {
      vm.data.searchedPerson = false;
      vm.data.mTipoDocumento = {Codigo: null};
      vm.currentDoc.number = null;
      vm.currentDoc.type = null;
      clear(true);
    }

    function clear(cbo) {
      if (cbo) {
        vm.data.mNroDocumento = '';
      }
      vm.data.mNomContratante = '';
      vm.data.mApePatContratante = '';
      vm.data.mApeMatContratante = '';
      vm.data.mSexo = null;
      vm.data.mEstadoCivil = {CodigoEstadoCivil: null};
      vm.data.mProfesion = {Codigo: null};
      vm.data.mNacionalidad = {Codigo: null};
      vm.data.mTelefonoFijo = '';
      vm.data.mTelefonoCelular = '';
      vm.data.saldoMapfreDolares = null;
      vm.data.mCorreoElectronico = '';
      vm.data.mRazonSocial = '';
      vm.data.mActividadEconomica = {Codigo: null};
      vm.data.mFechaNacimiento = null;
      vm.data.mDepartamento = {Codigo: null};
      vm.data.mProvincia = {Codigo: null};
      vm.data.mDistrito = {Codigo: null};
      vm.provincesData = [];
      vm.districtsData = [];
      vm.data.mSelectVia = {Codigo: null};
      vm.data.mSelectNumero = {Codigo: null};
      vm.data.mSelectInterior = {Codigo: null};
      vm.data.mSelectZona = {Codigo: null};
      vm.data.mVia = null;
      vm.data.mNumero = null;
      vm.data.mInterior = null;
      vm.data.mZona = null;
      vm.data.mReferencias = null;
      vm.data.mTelfPersonal = null;
      vm.data.mTelfOficina = null;
      vm.data.mContactName = '';
      vm.data.mCelular = null;
      vm.data.mEmailPersonal = null;
    }

    $scope.$watch('$ctrl.data.mSexo', function(newValue) {
      if (newValue) {
        vm.data.mSexoId = newValue !== 'M' ? 1 : 0;
      }
    });

    $scope.$watch('$ctrl.data.mTipoDocumento', function(newValue) {
      if (newValue) {
        vm.naturalPerson = newValue.Codigo !== constants.documentTypes.ruc.Codigo;
        setDocMaxLength(newValue.Codigo);
      }
    });
  }

  return ng
    .module('appInspec')
    .controller('ContractorController', contractorController)
    .component('inspecContractor', {
      templateUrl: '/inspec/app/common/contractor/contractor.html',
      controller: 'ContractorController',
      controllerAs: '$ctrl',
      bindings: {
        data: '=',
        origin: '=',
        onlyContractor: '=?',
        disabled: '=?',
        onlyContact: '=?',
        onlyUbigeo: '=?'
      }
    });
});
