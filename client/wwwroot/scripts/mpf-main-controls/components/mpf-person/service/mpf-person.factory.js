define([
  'angular',
  'lodash',
  'constants'
], function (ng, _, constants) {

  function mpfPersonFactory($q, $http, httpData) {
    var base = constants.system.api.endpoints.policy;

    return {
      getDatosContractorData: function (params) {
        return httpData['get'](base + 'api/contratante/datos/1/' + params.documentType + '/' + params.documentNumber, undefined, undefined, true);
      },
      getSOATContractorData: function (params) {
        return httpData['post'](base + 'api/contratante/datos/soat', params, undefined, true);
      },
      getAutosContractorData: function (params) {
        return httpData['get'](base + 'api/contratante/multiempresa/' + params.documentType + '/' + params.documentNumber, undefined, undefined, true);
      },
      getEquifaxData: function (params) {
        return httpData['post'](base + 'api/form/person/equifax', params, undefined, true);
      },
      getCountries: function () {
        return httpData['get'](base + 'api/general/ubigeo/pais', undefined, undefined, false);
      },
      getDeparments: function () {
        return httpData['get'](base + 'api/general/ubigeo/departamento', undefined, undefined, false);
      },
      getProvinces: function (idDepartment) {
        return httpData['get'](base + 'api/general/ubigeo/provincia/' + idDepartment, undefined, undefined, false);
      },
      getDistrict: function (idProvince) {
        return httpData['get'](base + 'api/general/ubigeo/distrito/' + idProvince, undefined, undefined, false);
      },
      getViaType: function () {
        return httpData['get'](base + 'api/general/domicilio/tipo', undefined, undefined, false);
      },
      getNumberType: function () {
        return httpData['get'](base + 'api/general/domicilio/numeracion', undefined, undefined, false);
      },
      getIndoorType: function () {
        return httpData['get'](base + 'api/general/domicilio/interior', undefined, undefined, false);
      },
      getZoneType: function () {
        return httpData['get'](base + 'api/general/domicilio/zona', undefined, undefined, false);
      },
      getDocumentTypes: function (params) {
        return httpData['get'](base + 'api/form/person/TipoDoc', { params: params }, undefined, false);

      },
      getProfessions: function () {
        return httpData['get'](base + 'api/general/ocupacion', undefined, undefined, false);
      },
      getRelacion: function () {
        return httpData['get'](base + 'api/general/tipoRelacion', undefined, undefined, false);
      },
      getAccionista: function (typeDoc,NumDoc) {
        return httpData['get'](base + 'api/general/accionista/' + typeDoc + '/' + NumDoc, undefined, false);
      },
      getEconomicsActivities: function () {
        return httpData['get'](base + 'api/general/actividadeconomica', undefined, undefined, false);
      },
      getCivilStatus: function () {
        return httpData['get'](base + 'api/general/estadocivil', undefined, undefined, false);
      },
      getForm: function (params) {
        return httpData['get'](base + 'api/form/person/fields', { params: params }, undefined, true);
      },
      getRelationshipTypes: function () {
        return httpData['get'](base + 'api/salud/tipoPersona', undefined, undefined, false);
      },
      getRelationshipTypesClinicaDigital: function () {
        return httpData['get'](base + 'api/clinicaDigital/tipoAsegurado', undefined, undefined, false);
      },
      getRepresentativePositions: function () {
        return httpData['get'](base + 'api/general/cargo', undefined, undefined, false);
      },
      serviceValid: function (params) {
        return httpData['post'](base + 'api/form/person/serviceValid', params, undefined, false);
      },
      serviceValidBlackList: function (params, showSpin) {
        return httpData['post'](base + 'api/consultaListaNegra', params, undefined, showSpin);
      },
      serviceSaveAuditBlackList: function (params) {
        return httpData['post'](base + 'api/auditoria', params, undefined, false);
      },
      getDays: function () {
        var arrayDay = [];
        var objDay = {};
        var days = 31;
        var description = '';
        for (var i = 1; i <= days; i++) {
          description = ('0' + i).slice(-2);
          objDay = {
            Codigo: i,
            Descripcion: description
          };
          arrayDay.push(objDay);
        }
        return arrayDay;
      },
      getMonths: function () {
        var arrayMonth = [];
        var objMonth = {};
        var months = 12;
        var description = '';
        for (var i = 1; i <= months; i++) {
          description = ('0' + i).slice(-2);
          objMonth = {
            Codigo: i,
            Descripcion: description
          };
          arrayMonth.push(objMonth);
        }
        return arrayMonth;
      },
      getYears: function () {
        var thisYear = new Date().getFullYear();
        var firstYear = thisYear - 100;
        var arrayYear = [];
        var objYear = {};
        for (var i = firstYear; i <= thisYear; i++) {
          objYear = {
            Codigo: i,
            Descripcion: i
          };
          arrayYear.push(objYear);
        }
        return arrayYear;
      },
      documentsValidations: function (documentType) {
        var documents = [
          {
            codigo: constants.documentTypes.dni.Codigo,
            maxLength: 8,
            minLength: 8,
            pattern: 'onlyNumber'
          },
          {
            codigo: constants.documentTypes.carnetExtrajeria.Codigo,
            maxLength: 13,
            minLength: 4,
            pattern: ''
          },
          {
            codigo: constants.documentTypes.cip.Codigo,
            maxLength: 13,
            minLength: 4,
            pattern: ''
          },
          {
            codigo: constants.documentTypes.pasaporte.Codigo,
            maxLength: 13,
            minLength: 4,
            pattern: ''
          },
          {
            codigo: constants.documentTypes.ruc.Codigo,
            maxLength: 11,
            minLength: 11,
            pattern: 'onlyNumber'
          }
        ]
        
        return _.find(documents, function(item) { return item.codigo === documentType })
      },
    };
  }
  return ng.module('mapfre.controls')
    .factory('mpfPersonFactory', mpfPersonFactory)
})
