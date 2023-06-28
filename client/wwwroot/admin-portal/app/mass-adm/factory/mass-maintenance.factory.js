'use strict';

define([
    'angular',
    'coreConstants',
    'endpointsConstants',
    'lodash',
], function(ng, coreConstants, endpointsConstants, _) {

    MassMaintenanceFactory.$inject = ['$q', 'httpData', '$log', 'mpSpin', '$stateParams', 'CommonFactory'];

    function MassMaintenanceFactory($q, httpData, $log, mpSpin, $stateParams, CommonFactory) {

        var domain = endpointsConstants.default;

        return {
            GetDocumentType: GetDocumentType,
            CreateMass: CreateMass,
            UpdateMass: UpdateMass,
            GetMass: GetMass,
            CreateDeceased: CreateDeceased,
            UpdateDeceased: UpdateDeceased,
            DeleteDeceased: DeleteDeceased
        };

        function CreateMass(bodyReq, showSpin) {
            return httpData.post(
                domain + 'api/v1/misa',
                bodyReq,
                {
                    params: _.assign({
                        codigoApp: coreConstants.codigoAppMassAdm
                    })
                },
                showSpin
            )
            .then(function(res) {
                return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
            });
        }

        function UpdateMass(id, bodyReq, showSpin) {
            var path = 'api/v1/misa/' + id;
            return httpData
              .put(
                domain + path,
                bodyReq,
                undefined,
                showSpin
              )
              .then(function(res) {
                return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
              });
        }

        function CreateDeceased(id, bodyReq, showSpin) {
          return httpData
          .post(
            domain + 'api/v1/misa/' + id + '/fallecido',
            bodyReq,
            {
                params: _.assign({
                    codigoApp: coreConstants.codigoAppMassAdm
                })
            },
            showSpin
        )
        .then(function(res) {
            return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
        });
      }

        function DeleteDeceased(id, idDeceased, showSpin) {
            var path = 'api/v1/misa/' + id + '/fallecido/' + idDeceased;
            return httpData
              .delete(
                domain + path,
                undefined,
                undefined,
                showSpin
              )
              .then(function(res) {
                return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
              });
        }

        function UpdateDeceased(id, bodyReq, showSpin) {
            var path = 'api/v1/misa/' + id + '/fallecido/' + bodyReq.idFallecido;
            return httpData
              .put(
                domain + path,
                bodyReq,
                undefined,
                showSpin
              )
              .then(function(res) {
                return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
              });
        }

        function GetMass(id, showSpin) {
            var path = 'api/v1/misa/' + id;
            return httpData
              .get(
                domain + path,
                undefined,
                undefined,
                showSpin
              )
              .then(function(res) {
                return _.assign(res, {success: res.codigo === coreConstants.api.successfulCode});
              });
        }

        function GetDocumentType(showSpin) {
            return CommonFactory.GetDocumentType(coreConstants.codigoAppMassAdm, showSpin);
        }
    }

    return ng.module(coreConstants.ngMassMaintenanceModule, []).factory('MassMaintenanceFactory', MassMaintenanceFactory);
});