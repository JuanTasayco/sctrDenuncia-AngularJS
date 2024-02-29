'use strict';
/* eslint-disable new-cap */

define(['angular', 'lodash', 'constants', 'wpConstant', 'wpFactoryLookup', 'wpFactoryHelp', 'wpFactoryCache', 'fileSaver'], function(
  ng,
  _,
  constants,
  wpConstant,
  wpFactoryLookup,
  wpFactoryHelp,
  wpFactoryCache,
  fileSaver
) {
  wpFactory.$inject = [
    'proxySecurity',
    'proxyCategory',
    'proxyLookup',
    'proxySeveralTable',
    'proxyTheme',
    'proxyUbigeo',
    'proxyCarRepairShop',
    'proxyPoliceStation',
    'proxySubject',
    'proxyAssistance',
    'proxySiniestro',
    'proxyTaller',
    'proxyEquifax',
    '$timeout',
    '$q',
    '$http',
    '$log',
    'mpSpin',
    '$window',
    'httpData'
  ];

  function wpFactory(
    proxySecurity,
    proxyCategory,
    proxyLookup,
    proxySeveralTable,
    proxyTheme,
    proxyUbigeo,
    proxyCarRepairShop,
    proxyPoliceStation,
    proxySubject,
    proxyAssistance,
    proxySiniestro,
    proxyTaller,
    proxyEquifax,
    $timeout,
    $q,
    $http,
    $log,
    mpSpin,
    $window,
    httpData
  ) {
    var FROM_CACHE = false;
    var SHOW_SPIN = true;
    var SHOW_SPIN_LOOKUP = false;
    var sizeImage = {
      xs: 1,
      lg: 0
    };
    var factory = {
      car: {
        Get: GetCar,
        GetBranchsByRepairShop: GetBranchsByRepairShop,
        GetBranchsByRepairShopAndUbigeo: GetBranchsByRepairShopAndUbigeo,
        GetByUbigeoBrandTron: GetByUbigeoBrandTron
      },
      taller: {
        GetTalleres: GetTalleres
      },
      typeDocuments: {
        Get: GetTypeDocuments
      },
      category: {
        Get: GetCategory,
        GetBatch: GetBatch,
        GetCategoryAll: GetCategoryAll,
        GetRequestTemplate: GetRequestTemplateCategory,
        PutUpdateStates: PutUpdateStatesCategory
      },
      lookup: {
        Get: GetLookup,
        GetCarBrands: GetCarBrands,
        GetUsers: GetUsers,
        GetCarModelsByBrand: GetCarModelsByBrand,
        GetCarTypes: GetCarTypes,
        GetCarTypesUse: GetCarTypesUse,
        GetCarYearsByModelAndBrand: GetCarYearsByModelAndBrand,
        GetLookupSeveral: GetLookupSeveral,
        GetPhotoTypes: GetPhotoTypes
      },
      police: {
        GetPoliceStationByDistrict: GetPoliceStationByDistrict, // no nuevo
        GetPoliceStationByUbigeo: GetPoliceStationByUbigeo // nuevo
      },
      severalTable: {
        GetDetails: GetDetails,
        GetHeader: GetHeader
      },
      subject: {
        Get: GetSubject,
        GetRequestTemplate: GetRequestTemplateSubject,
        PutUpdateStates1: PutUpdateStates1Subject
      },
      theme: {
        Get: GetTheme,
        GetRequestTemplate: GetRequestTemplateTheme,
        PutUpdateStates: PutUpdateStatesTheme
      },
      ubigeo: {
        GetDepartaments: GetDepartaments,
        GetDistricts: GetDistricts,
        GetProvinces: GetProvinces
      },
      assistance: {
        DownloadVersion: DownloadVersion,
        Export: Export, // TODO: gc, el back el export estaba en minuscula
        GetAssistance: GetAssistance,
        Search: Search
      },
      security: {
        GetUserRole: GetUserRole
      },
      siniestro: {
        Get: GetSiniestro,
        InitSiniestro : InitSiniestro,
        SetSiniestro : SetSiniestro,
        GetSiniestroPlaca:GetSiniestroPlaca,
        GetSiniestroPerson : GetSiniestroPerson,
        GetSiniestroData : GetSiniestroData,
        GetSiniestroMongo: GetSiniestroMongo,
        Save: Save,
        Autorizar: Autorizar,
        DownloadVersionSinSiniestro: DownloadVersionSinSiniestro,
        GetCarBrands: GetVehicleParts,
        GeneratorCaseFile: GeneratorCaseFile,
        UploadCarDocument: UploadCarDocument,
        UploadCarSinister: UploadCarSinister,
        UploadSinisterDetail: UploadSinisterDetail,
        UploadThirdParties: UploadThirdParties,
        DeleteImages: DeleteImages,
        ViewImage: ViewImage,
        ViewImageThirdParties: ViewImageThirdParties,
        ViewImageByPath: ViewImageByPath,
        GetVersion: GetVersion,
        GetListServiec: GetListServiec,
        GetListAffected: GetListAffected,
        GetListParameterDetail: GetListParameterDetail,
        DeleteThirdPartyBy: DeleteThirdPartyBy,
        GenerateSinisterTRONv2: GenerateSinisterTRONv2,
        GetExistingSinister: GetExistingSinister,
        GetAcuerdoConductores: GetAcuerdoConductores,
      }
    };

    return ng.extend({}, factory, wpFactoryLookup, wpFactoryHelp, wpFactoryCache);

    // proxySecurity
    function GetUserRole() {
      return proxySecurity.GetUserRole();
    }

    // proxyCarRepairShop

    function GetCar() {
      return proxyCarRepairShop.Get(FROM_CACHE, SHOW_SPIN_LOOKUP);
    }

    function GetBranchsByRepairShop(repairShopId) {
      return proxyCarRepairShop.GetBranchsByRepairShop(repairShopId, FROM_CACHE, SHOW_SPIN);
    }

    function GetBranchsByRepairShopAndUbigeo(repairShopId, departamentId, provinceId, codigoActTercero) {
      return proxyCarRepairShop.GetBranchsByRepairShopAndUbigeo(
        repairShopId,
        departamentId,
        provinceId,
        codigoActTercero,
        FROM_CACHE,
        SHOW_SPIN
      );
    }

    function GetByUbigeoBrandTron(departamentId, provinceId, brandId) {
      return proxyCarRepairShop.GetByUbigeoBrandTron(departamentId, provinceId, brandId, FROM_CACHE, SHOW_SPIN);
    }

    // proxyTaller

    function GetTalleres(departamentoId, provinciaId, distritoId, tipo, nombre) {
      return proxyTaller.GetTalleres(
        wpFactoryHelp.getNroAsistencia(),
        departamentoId,
        provinciaId,
        distritoId,
        tipo,
        nombre,
        SHOW_SPIN
      );
    }

    // proxyCategory

    function GetCategory(id) {
      return proxyCategory.Get(id, FROM_CACHE, SHOW_SPIN);
    }

    function GetBatch(ids) {
      return proxyCategory.GetBatch(ids, FROM_CACHE, SHOW_SPIN);
    }

    function GetCategoryAll() {
      return proxyCategory.GetCategoryAll(FROM_CACHE, SHOW_SPIN);
    }

    function PutUpdateStatesCategory(request) {
      return proxyCategory.PutUpdateStates(request, SHOW_SPIN);
    }

    function GetRequestTemplateCategory() {
      return proxyCategory.GetRequestTemplate(SHOW_SPIN);
    }

    // proxyLookup

    function GetLookup(code) {
      return proxyLookup.Get(code, SHOW_SPIN);
    }

    function GetCarBrands() {
      return proxyLookup.GetCarBrands(FROM_CACHE, SHOW_SPIN_LOOKUP);
    }

    function GetUsers() {
      return proxyLookup.GetUsers(SHOW_SPIN_LOOKUP);
    }

    function GetCarModelsByBrand(codeBrand) {
      return proxyLookup.GetCarModelsByBrand(codeBrand, FROM_CACHE, SHOW_SPIN);
    }

    function GetCarTypes() {
      return proxyLookup.GetCarTypes(FROM_CACHE, SHOW_SPIN_LOOKUP);
    }

    function GetCarTypesUse() {
      return proxyLookup.GetCarTypesUse(FROM_CACHE, SHOW_SPIN_LOOKUP);
    }

    function GetCarYearsByModelAndBrand(codeModel, codeBrand) {
      return proxyLookup.GetCarYearsByModelAndBrand(codeModel, codeBrand, FROM_CACHE, SHOW_SPIN);
    }

    function GetLookupSeveral(codes) {
      return proxyLookup.GetLookupSeveral(codes, FROM_CACHE, SHOW_SPIN_LOOKUP);
    }

    function GetPhotoTypes(ownerId) {
      return proxyLookup.GetPhotoTypes(ownerId, FROM_CACHE, SHOW_SPIN);
    }

    // proxyPoliceStation

    function GetPoliceStationByDistrict(districtId, fromTron, departamentId, provinceId) {
      return proxyPoliceStation.GetPoliceStationByDistrict(
        districtId,
        fromTron,
        departamentId,
        provinceId,
        FROM_CACHE,
        SHOW_SPIN
      );
    }

    function GetPoliceStationByUbigeo(districtId, fromTron, departamentId, provinceId) {
      return proxyPoliceStation.GetPoliceStationByUbigeo(
        districtId,
        fromTron,
        departamentId,
        provinceId,
        FROM_CACHE,
        SHOW_SPIN
      );
    }

    // proxySeveralTable

    function GetDetails(codigoGrupo, codigoParametro) {
      return proxySeveralTable.GetDetails(codigoGrupo, codigoParametro, FROM_CACHE, SHOW_SPIN_LOOKUP);
    }

    function GetHeader(codigoGrupo) {
      return proxySeveralTable.GetHeader(codigoGrupo, FROM_CACHE, SHOW_SPIN);
    }

    // proxySubject

    function GetRequestTemplateSubject() {
      return proxySubject.GetRequestTemplate(SHOW_SPIN);
    }

    function GetSubject(codeCategory) {
      return proxySubject.Get(codeCategory, FROM_CACHE, SHOW_SPIN);
    }

    function PutUpdateStates1Subject(request) {
      return proxySubject.PutUpdateStates1(request, SHOW_SPIN);
    }

    // proxyTheme

    function GetTheme(codeCategory, codeSubject) {
      return proxyTheme.Get(codeCategory, codeSubject, FROM_CACHE, SHOW_SPIN);
    }

    function GetRequestTemplateTheme() {
      return proxyTheme.GetRequestTemplate(SHOW_SPIN);
    }

    function PutUpdateStatesTheme(request) {
      return proxyTheme.PutUpdateStates(request, SHOW_SPIN);
    }

    // proxyUbigeo

    function GetDepartaments(withDetails) {
      return proxyUbigeo.GetDepartaments(withDetails, FROM_CACHE, SHOW_SPIN);
    }

    function GetDistricts(departamentId, provinceId) {
      return proxyUbigeo.GetDistricts(departamentId, provinceId, FROM_CACHE, SHOW_SPIN);
    }

    function GetProvinces(departamentId, withDetails) {
      return proxyUbigeo.GetProvinces(departamentId, withDetails, FROM_CACHE, SHOW_SPIN);
    }

    // proxyAssistance

    function Search(query) {
      return proxyAssistance.Search(query, SHOW_SPIN);
    }

    function GetAssistance(idassistance) {
      return proxyAssistance.Get(idassistance, SHOW_SPIN);
    }

    function Export(query) {
      return _downloableReport(query, {
        nomenclatura: 'reporte_',
        ext: 'csv'
      });
    }

    function DownloadVersion(query) {
      return _downloableReport(query, {
        nomenclatura: wpFactoryHelp.getNroAsistencia() + '_',
        ext: 'pdf'
      });
    }

    // proxySiniestro

    function GetSiniestro(caso) {
      return proxySiniestro.Get(caso, SHOW_SPIN)

    }

    function GetTypeDocuments() {
      return httpData['get']('https://oim.pre.mapfre.com.pe/oim_polizas/api/general/tipodoc/nacional', undefined,undefined, false)
    }

    function GetSiniestroPlaca(numPlaca) {
      return  proxyEquifax.GetPlacaEquifax(numPlaca,true)
    }

    function GetSiniestroPerson(numDoc,tipoConsulta,tipoDoc,codCia) {
      return  proxyEquifax.GetPersonEquifax(codCia,tipoDoc,numDoc,tipoConsulta,true)
    }

    function InitSiniestro() {
      factory.siniestro.siniestroData = {};
    }

    function SetSiniestro(siniestro) {
      factory.siniestro.InitSiniestro();
      factory.siniestro.siniestroData = angular.extend({}, factory.siniestro.siniestroData, siniestro);
    }

    function GetSiniestroData() {
      return factory.siniestro.siniestroData;
    }
    

    function GetSiniestroMongo(caso) {
      return proxySiniestro.GetSiniestroMongo(caso, SHOW_SPIN);
    }

    function Save(siniestro, showSpin) {
      return proxySiniestro.Save(wpFactoryHelp.help.upperCaseObject(siniestro), showSpin);
    }

    function GeneratorCaseFile(rejected, siniestro) {
      return proxySiniestro.GeneratorCaseFile(rejected, wpFactoryHelp.help.upperCaseObject(siniestro), SHOW_SPIN);
    }

    function Autorizar(siniestro) {
      return proxySiniestro.AutorizarSave(siniestro, SHOW_SPIN);
    }

    function GenerateSinisterTRONv2(siniesterDetail) {
      return proxySiniestro.GenerateSinisterTRONv2(siniesterDetail, SHOW_SPIN_LOOKUP);
    }

    function GetVersion() {
      var baseUrl =
        constants.system.api.endpoints.webproc + 'api/Siniestro/versions/' + wpFactoryHelp.getNroAsistencia();
      var pathWithSiniester = baseUrl + '?sinisterNumber=' + wpFactoryHelp.getSiniestroNro();
      var url = wpFactoryHelp.getSiniestroNro() ? pathWithSiniester : baseUrl;

      var defer = $q.defer();

      $http({
        url: url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function(resp) {
          defer.resolve(resp.data);
        })
        .catch(function(err) {
          defer.reject(err);
        });

      return defer.promise;
    }

    function DownloadVersionSinSiniestro(query) {
      return _downloableReport(query, {
        nomenclatura: wpFactoryHelp.getNroAsistencia() + '_',
        ext: 'pdf'
      });
    }

    function GetVehicleParts(zoneId) {
      return proxySiniestro.GetCarBrands(zoneId, SHOW_SPIN);
    }

    function UploadCarDocument(file, imageTypeCode) {
      var apiPath = constants.system.api.endpoints.webproc + 'api/Siniestro/upload/cardocument';
      var params = {
        caseNumber: wpFactoryHelp.getNroAsistencia(),
        file: file,
        imageTypeCode: imageTypeCode
      };
      var reqPromise = _buildReqUpload(apiPath, params);
      return reqPromise;
    }

    function UploadCarSinister(file, imageTypeCode) {
      var apiPath = constants.system.api.endpoints.webproc + 'api/Siniestro/upload/carsiniester';
      var params = {
        caseNumber: wpFactoryHelp.getNroAsistencia(),
        file: file,
        imageTypeCode: imageTypeCode
      };
      var reqPromise = _buildReqUpload(apiPath, params);
      return reqPromise;
    }

    function UploadSinisterDetail(file, imageTypeCode) {
      var apiPath = constants.system.api.endpoints.webproc + 'api/Siniestro/upload/sinisterdetail';
      var params = {
        caseNumber: wpFactoryHelp.getNroAsistencia(),
        file: file,
        imageTypeCode: imageTypeCode
      };
      var reqPromise = _buildReqUpload(apiPath, params);
      return reqPromise;
    }

    function UploadThirdParties(file, data) {
      var apiPath = constants.system.api.endpoints.webproc + 'api/Siniestro/upload/thirdparties';
      var params = {
        caseNumber: wpFactoryHelp.getNroAsistencia(),
        file: file,
        imageTypeCode: data.imageTypeCode,
        itemConductor: data.itemConductor || 1
      };
      var reqPromise = _buildReqUpload(apiPath, params);
      return reqPromise;
    }

    function DeleteImages(nombreFisico) {
      return proxySiniestro.DeleteImages(
        {itemImagen: wpFactoryHelp.getNroAsistencia(), nombreFisico: nombreFisico},
        SHOW_SPIN_LOOKUP
      );
    }

    function ViewImage(id, isResize) {
      isResize = ng.isUndefined(isResize) ? sizeImage.xs : isResize;
      return proxySiniestro.ViewImage(wpFactoryHelp.getNroAsistencia(), id, isResize);
    }

    function ViewImageByPath(filename, isResize) {
      isResize = ng.isUndefined(isResize) ? sizeImage.xs : isResize;
      return proxySiniestro.ViewImageByPath(filename, isResize);
    }

    function ViewImageThirdParties(terceroid, id, isResize) {
      isResize = ng.isUndefined(isResize) ? sizeImage.xs : isResize;
      return proxySiniestro.ViewImageThirdParties(wpFactoryHelp.getNroAsistencia(), terceroid, id, isResize);
    }

    function GetListServiec() {
      return proxySiniestro.GetListServiec(wpFactoryHelp.getNroAsistencia(), SHOW_SPIN);
    }

    function GetListAffected() {
      return proxySiniestro.GetListAffected(wpFactoryHelp.getNroAsistencia(), SHOW_SPIN);
    }

    function GetListParameterDetail(groupCode, parameterCode, SHOW_SPIN) {
      return proxyLookup.GetListParameterDetail(groupCode, parameterCode, SHOW_SPIN);
    }

    function DeleteThirdPartyBy(thirdPartyId) {
      return proxySiniestro.DeleteThirdPartyBy(
        {
          caseNumber: wpFactoryHelp.getNroAsistencia(),
          thirdPartyId: thirdPartyId
        },
        SHOW_SPIN_LOOKUP
      );
    }

    // private

    function _downloableReport(wpPath, opts) {
      var deferred = $q.defer();
      mpSpin.start();
      $http
        .get(constants.system.api.endpoints.webproc + wpPath, {
          responseType: 'arraybuffer'
        })
        .success(
          function(data, status, headers) {
            var type = headers('Content-Type');
            var disposition = headers('Content-Disposition');
            var FileName = '';
            if (disposition) {
              var match = disposition.match(/.*filename="?([^;"]+)"?.*/);
              if (match[1]) FileName = match[1];
            }
            FileName =
              FileName.replace(/[<>:"/\\|?*]+/g, '_') ||
              opts.nomenclatura + new Date().toLocaleTimeString() + '.' + opts.ext;
            var blob = new Blob([data], {
              type: type
            });
            fileSaver(blob, FileName);
            deferred.resolve(FileName);
            mpSpin.end();
          },
          function() {
            var e = deferred.reject(e);
            mpSpin.end();
          }
        )
        .error(function(data) {
          mpSpin.end();
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function _buildReqUpload(apiPath, params) {
      var deferred = $q.defer();
      var fd = new FormData();
      var keyParams = _.keys(params);
      _.forEach(keyParams, function pFe(item) {
        fd.append(item, params[item]);
      });
      mpSpin.start();
      $http
        .post(apiPath, fd, {
          transformRequest: ng.identity,
          headers: {
            'Content-Type': undefined
          },
          uploadEventHandlers: {
            progress: function(ev) {
              $log.log('UploadProgress total: ' + ev.total);
            }
          }
        })
        .then(function(response) {
          mpSpin.end();
          deferred.resolve(response);
        })
        .catch(function ucsErrHttp(err) {
          mpSpin.end();
          $log.error('Falló la carga de fotos', err);
        });

      return deferred.promise;
    }
    
    function GetExistingSinister(data) {
      var url = constants.system.api.endpoints.webproc + 'api/Siniestro/GetExistingSinister';

      var defer = $q.defer();

      $http({
        url: url,
        method: 'POST',
        data: data,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function (resp) {
          defer.resolve(resp);
        })
        .catch(function (err) {
          defer.reject(err);
        });

      return defer.promise;
    }

    function GetAcuerdoConductores() {
      var url = constants.system.api.endpoints.webproc + 'api/Lookup/parameterDetail/description?d=AgreementDriversOptions';
      var defer = $q.defer();
      $http({
        url: url,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(function(resp) {
          defer.resolve(resp.data);
        })
        .catch(function(err) {
          defer.reject(err);
        });
  
      return defer.promise;
    }

  
  } // end factory
  
  return ng.module('appWp.factory', ['oim.proxyService.webProc']).factory('wpFactory', wpFactory);
});
