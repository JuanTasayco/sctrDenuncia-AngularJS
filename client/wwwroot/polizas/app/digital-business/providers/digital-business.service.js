define([
  'angular', 'constants'
], function (angular, constants) {
  'use strict';

  angular
    .module('appAutos')
    .factory('digitalBusinessService', DigitalBusinessService);

  DigitalBusinessService.$inject = ['proxyMailTemplate'];

  function DigitalBusinessService(proxyMailTemplate) {
    var service = {
      searchDigitalBusiness: SearchDigitalBusiness,
      insertDigitalBusiness: InsertDigitalBusiness,
      updateDigitalBusiness: UpdateDigitalBusiness,
      deleteDigitalBusiness: DeleteDigitalBusiness,
      getTemplateMail: GetTemplateMail
    };

    return service;

    function SearchDigitalBusiness(request) {
      return proxyMailTemplate.GetListTemplateMail(request, true);
    }

    function GetTemplateMail(codigoCompania, codigoRamo) {
      return proxyMailTemplate.GetTemplateMail(codigoCompania, codigoRamo, true);
    }

    function InsertDigitalBusiness(request) {
      return proxyMailTemplate.InsertTemplateMail(request, true);
    }

    function UpdateDigitalBusiness(request) {
      return proxyMailTemplate.UpdateTemplateMail(request, true);
    }

    function DeleteDigitalBusiness(codigoCompania, codigoRamo) {
      return proxyMailTemplate.DeleteTemplateMail({ codigoCompania: codigoCompania, codigoRamo: codigoRamo }, true);
    }
  }

});
