'use strict'

define([
  'angular', 'constants',
  'nsctrFactoryJs'
], function (angular, constants) {

  var appNsctr = angular.module('appNsctr');
  /*########################
  # factory
  ########################*/
  appNsctr.factory('nsctrFactoryResolve',
    ['nsctrFactory', '$q', 'oimPrincipal', 'mainServices',
      function (nsctrFactory, $q, oimPrincipal, mainServices) {

        var documentTypes, rolesPermission, location, risksPremium, risksList;

        function _paramsRisksLists(params) {
          return params.reduce(function (previous, current) {
            var vKey = (current.applicationType === 'P')
                        ? 'PensionApplication'
                        : 'HealthApplication';

            previous[vKey] = {
              applicationNumber: current.aplicationNumber,
              mCAFicticiousApplication: current.unTrue,
              previousSptoNumber: current.beforeSptoNumber,
              applicationExpirationDate: current.policyDateEnd,
              policy: {
                policyNumber: current.policyNumber,
                applicationNumber: current.aplicationNumber,
                sptoNumber: current.sptoNumber,
              }
            }

            return previous;
          }, { PensionApplication: {}, HealthApplication: {} });
        }
        function Declaration_Step1_GetRisksLists(params, showSpin) {
          var deferred = $q.defer();
          var vParams = _paramsRisksLists(params);
          nsctrFactory.common.proxyGenerateDeclarationPre.Declaration_Step1_GetRisksLists(vParams, showSpin).then(function (response) {
            risksList = response.data || response.Data;
            deferred.resolve(risksList);
          }, function (error) {
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }
        //ServiceRiskPrimaDeclaracion
        function CSServiceRiskPrimaDeclaracion(paramsRisk, paramsPendingRisks, showSpin) {
          var deferred = $q.defer();
          nsctrFactory.common.proxyCommon.CSServiceRiskPrimaDeclaracion(paramsRisk, paramsPendingRisks, showSpin).then(function (response) {
            risksPremium = response;
            deferred.resolve(risksPremium);
          }, function (error) {
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }
        //ServicesGetAllLocationsByEnterprise
        function ServicesGetAllLocationsByEnterprise(enterpriseId, showSpin) {
          var deferred = $q.defer();
          nsctrFactory.mining.proxyAssignments.ServicesGetAllLocationsByEnterprise(enterpriseId, showSpin).then(function (response) {
            location = response.data || response.Data;
            deferred.resolve(location);
          }, function (error) {
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }
        //GetRolesPermissionAbleStatus
        function GetRolesPermissionAbleStatus(module, showSpin) {
          var deferred = $q.defer(),
            vUserRole = oimPrincipal.get_role(module.appCode);
          nsctrFactory.common.proxyLookup.GetRolesPermissionAbleStatus(module.code, vUserRole, showSpin).then(function (response) {
            rolesPermission = response.data || response.Data;
            deferred.resolve(rolesPermission);
          }, function (error) {
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }
        //ServicesListDocumentType
        function ServicesListDocumentType(actionType, NSCTRSystemType, showSpin) {
          var deferred = $q.defer();
          nsctrFactory.common.proxyLookup.ServicesListDocumentType(actionType, NSCTRSystemType, showSpin).then(function (response) {
            documentTypes = response.data || response.Data;
            deferred.resolve(documentTypes);
          }, function (error) {
            deferred.reject(error.statusText);
          });
          return deferred.promise;
        }

        return {
          Declaration_Step1_GetRisksLists: function (params, showSpin) {
            return Declaration_Step1_GetRisksLists(params, showSpin);
          },
          CSServiceRiskPrimaDeclaracion: function (paramsRisk, paramsPendingRisks, showSpin) {
            return CSServiceRiskPrimaDeclaracion(paramsRisk, paramsPendingRisks, showSpin);
          },
          ServicesGetAllLocationsByEnterprise: function (enterpriseId, showSpin) {
            if (location) return $q.resolve(location);
            return ServicesGetAllLocationsByEnterprise(enterpriseId, showSpin);
          },
          GetRolesPermissionAbleStatus: function (module, showSpin) {
            if (rolesPermission) return $q.resolve(rolesPermission);
            return GetRolesPermissionAbleStatus(module, showSpin);
          },
          ServicesListDocumentType: function (actionType, NSCTRSystemType, showSpin) {
            if (documentTypes) return $q.resolve(documentTypes);
            return ServicesListDocumentType(actionType, NSCTRSystemType, showSpin);
          }
        };

      }]);

});
