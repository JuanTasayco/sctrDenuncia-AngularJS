'use strict';
define(['angular', 'lodash'],
  function(ng, _) {
    panelService.$inject = ['$q', 'Restangular', '$log'];

    function panelService($q, Restangular, $log) {
      /*gtx*/
      function getListFiles(idProveedor,idAuditoria) {
        var deferred = $q.defer(),
          clientUrl = Restangular.one('proveedores/'+idProveedor+'/auditoria/'+idAuditoria+'/archivos');
        clientUrl.get().then(function getSFn(data) {
          $log.info('factory successful: ' + data);
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      function saveFile(idProveedor,idAuditoria,obj) {
        var deferred = $q.defer();

        Restangular.one('proveedores/'+idProveedor+'/auditoria/'+idAuditoria+'/archivo').post('',obj).then(function postSFn(data) {
          $log.info('factory successful: ' + data);
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      function deleteFile(idProveedor,idAuditoria,idArchivo,obj) {
        var deferred = $q.defer();

        Restangular.all('proveedores/'+idProveedor+'/auditoria/'+idAuditoria+'/archivo/'+idArchivo)
          .customOperation('remove', '','',{'content-type': 'application/json'},obj).then(function removeSFn(data) {
          $log.info('factory successful: ' + data);
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getIp() {
        var deferred = $q.defer();
        Restangular.setBaseUrl('https://api.seeip.org/jsonip');

        var clientUrl = Restangular.one('');
          clientUrl.get().then(function getSFn(data) {
            $log.info('factory successful: ' + data);
            deferred.resolve(data);
          }, function getEFn(error) {
            $log.info('factory error: ' + error);
          });

        //Restangular.setBaseUrl('https://oim.mapfre.com.pe/oim_referencia/api');
        //Restangular.setBaseUrl('http://localhost:23610/api');
        return deferred.promise;
      }

      function saveTracker(obj) {
        var deferred = $q.defer();

        Restangular.one('traza/eventTracker').post('',obj).then(function postSFn(data) {
          $log.info('factory successful: ' + data);
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      function downloadFile(idProveedor,idAuditoria,idArchivo) {
        var deferred = $q.defer();

        Restangular.one('proveedores/'+idProveedor+'/auditoria/'+idAuditoria+'/archivo/'+idArchivo).withHttpConfig({responseType: 'blob'}).get().then(function getSFn(response) {
          deferred.resolve(response);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;

      }
      /*--gtx*/
      function getClientes(lugar) {
        var milugar = lugar || '';

        var deferred = $q.defer(),
          clientUrl = Restangular.one('clientes/ubigeo/' + milugar);
        clientUrl.get().then(function getSFn(data) {
          $log.info('factory successful: ' + data);
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      //  get list empresas
      function getClientesFilter(filter) {
        var myflt = filter || {},
          deferred = $q.defer(),
          req = {};

        myflt.filtro1 && (req.compania = +myflt.filtro1);
        req.ubigeo = myflt.pl || '';
        myflt.parentesco && (req.parentesco = myflt.parentesco);

        myflt.filtro2 && (req.producto = myflt.filtro2);

        Restangular.one('clientes/entidad').post('buscar', req).then(function postSFn(data) {
          $log.info('factory successful: ' + data);
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      // get info to busquedaClientes from filter (name, dni) or click en "ver asegurado" del mapa
      function getAfiliadosByFilter(filter) {
        var myflt = filter || {},
          deferred = $q.defer();
        var req = {};

        if (myflt.tipo === 'empresa') {
          // si buscamos por entidad
          myflt.filtro1 && (req.compania = +myflt.filtro1);
          myflt.filtro2 && (req.producto = myflt.filtro2);
          myflt.empresa && (req.empresa = +myflt.empresa);
        } else {
          // si buscamos por name o dni
          myflt.filtro1 && (req.dni = myflt.filtro1);
          myflt.filtro2 && (req.nombres = myflt.filtro2.toUpperCase());
          myflt.filtro3 && (req.apellidos = myflt.filtro3.toUpperCase());
          myflt.company && (req.compania = +myflt.company);
          myflt.producto && (req.producto = myflt.producto);
        }

        req.ubigeo = myflt.pl || '';
        myflt.parentesco && (req.parentesco = myflt.parentesco);
        req.esPaginacion = myflt.esPaginacion;  // valor booleano, por default recibimos false
        req.pageSize = +myflt.pageSize || 5;  // por defecto enviamos 5 si es que no lo seteamos
        req.pagina = +myflt.pagina || 1;

        Restangular.one('clientes/afiliados').post('buscar', req).then(function postSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      function getProveedores(lugar) {
        var milugar = lugar || '';
        var deferred = $q.defer(),
          clientUrl = Restangular.one('proveedores/ubigeo/', milugar);

        clientUrl.get().then(function getSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });
        return deferred.promise;
      }

      function getKeyFromArr(arr, key) {
        var arrKeys = _.map(arr, key);

        return arrKeys;
      }

      function getProveedoresByFilter(filter) {
        var myflt = filter || {},
          deferred = $q.defer();
        var req = {};
        myflt.nom && (req.nombre = myflt.nom.toUpperCase());
        myflt.pl && (req.ubigeo = myflt.pl);
        myflt.categoria && (req.categoria = +myflt.categoria);
        myflt.entidad && (req.entidad = +myflt.entidad);
        myflt.convenio && (req.convenio = myflt.convenio.toUpperCase());

        if (myflt.servicios || myflt.serviimagenes || myflt.serviemergencias || myflt.serviambulancias) {
          !ng.isArray(req.servicios) && (req.servicios = []);
        }

        myflt.servicios && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.servicios ,'id')));
        myflt.serviimagenes && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.serviimagenes ,'id')));
        myflt.serviemergencias && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.serviemergencias, 'id')));
        myflt.serviambulancias && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.serviambulancias, 'id')));

        myflt.especialidades && (req.especialidades = getKeyFromArr(myflt.especialidades, 'nombre'));
        myflt.plOrigen && (req.referenciaUbigeoOrigen = myflt.plOrigen);

        req.esPaginacion = myflt.esPaginacion;  // valor booleano, por default recibimos false
        req.pageSize = +myflt.pageSize || 5;  // por defecto enviamos 5 si es que no lo seteamos
        req.pagina = +myflt.pagina || 1;  //  pagina que queremos cargar

        Restangular.one('proveedores').post('buscar', req).then(function postSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }


      function getProveedor(idProveedor, idAuditoria) {

        var deferred = $q.defer();

        var params = {
          idProveedor: idProveedor,
          idAuditoria: idAuditoria
        };

        Restangular.one('proveedores/auditoria')
          .get(params)
          .then(function getSFn(data) {
            deferred.resolve(parseData(data.Data));
          }, function getEFn(error) {
            $log.info('factory error: ' + error);
          });

        return deferred.promise;
      }

      function getLastAudit(idProveedor) {
        return getProveedor(idProveedor, 0);
      }

      function getNewAudit(idProveedor) {
        return getProveedor(idProveedor, -1);
      }

      function getAuditById(idProveedor, idAuditoria) {
        return getProveedor(idProveedor, idAuditoria);
      }


      function getCategoriasProveedor() {
        var deferred = $q.defer();

        Restangular.one('proveedores/categoria').get().then(function getSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }


      function getHistorialAuditorias(id) {
        var deferred = $q.defer();

        Restangular.one('proveedores/historial').get({
          idProveedor: id
        }).then(function getSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }


      function saveAuditoria(dataProveedor) {

        var proveedorObj = angular.copy(dataProveedor);
        var deferred = $q.defer();

        Restangular.one('proveedores/auditoria').post('save',
          unparseData(angular.copy(proveedorObj))
        ).then(function getSFn(data) {
          deferred.resolve(parseData(data.Data));
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }


      function getReporte(idAuditoria) {
        var deferred = $q.defer();

        Restangular.one('proveedores/resumen').withHttpConfig({responseType: 'blob'}).get({
          idAuditoria: idAuditoria
        }).then(function getSFn(response) {
          deferred.resolve(response);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;

      }

      var days = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab'];

      function parseData(proveedorObj) {

        function groupExists(chars, characteristic) {
          return !chars.find(function(c) {
            return c.idGrupo === characteristic.idGrupo;
          });
        }

        function newGroup(chars, characteristic) {
          return chars.concat({
            idGrupo: characteristic.idGrupo,
            idTipoCaracteristica: characteristic.idTipoCaracteristica,
            descripcion: characteristic.grupo,
            orden: characteristic.orden,
            subCaracteristicas: [characteristic]
          });
        }

        proveedorObj.DatosGenerales.Aforo = proveedorObj.DatosGenerales.Aforo.toString();

        proveedorObj.Auditoria.ProductoList.map(function(product) {
          product.CaracteristicaList = product.CaracteristicaList
            .reduce(function(chars, characteristic) {

              switch (characteristic.idTipoCaracteristica) {

                case 3:
                  if (!characteristic.idGrupo) {
                    return chars.concat(characteristic);
                  }

                  if (groupExists(chars, characteristic)) {
                    return newGroup(chars, characteristic);
                  }

                  // push to existing group
                  var idx = chars.findIndex(function(item) {
                    return item.idGrupo === characteristic.idGrupo;
                  });

                  chars[idx].subCaracteristicas.push(characteristic);
                  return chars;

                case 4:
                  // return array including a new question group entity with first question attached
                  if (groupExists(chars, characteristic)) {
                    return newGroup(chars, characteristic);
                  }

                  // push to existing group
                  var idx = chars.findIndex(function(item) {
                    return item.idGrupo === characteristic.idGrupo;
                  });

                  chars[idx].subCaracteristicas.push(characteristic);
                  return chars;

                case 5:

                  var actualValues = (characteristic.valor) ?
                  characteristic.valor.split(',').map(function(v) { return +v; }) :
                  [];

                  characteristic.valores = days
                    .reduce(function(values, day, i) {
                      var amIdx = i * 2 + 1;
                      var pmIdx = i * 2 + 2;
                      values.am[day] = actualValues.includes(amIdx);
                      values.pm[day] = actualValues.includes(pmIdx);
                      return values;
                    }, {am: {}, pm: {}});
                  return chars.concat(characteristic);

                default:
                  return chars.concat(characteristic);

              }
            }, []);

          return product;
        });

        return proveedorObj;
      }

      function unparseData(proveedorObj) {
        proveedorObj.Auditoria.ProductoList.map(function(product) {
          product.CaracteristicaList = product.CaracteristicaList
            .reduce(function(chars, characteristic) {

              var characteristicType = characteristic.idTipoCaracteristica;

              switch (characteristicType) {
                case 3:
                  if (!characteristic.idGrupo) {
                    return chars.concat(characteristic);
                  }
                  characteristic.subCaracteristicas.map(function(c) {
                    chars.push(c);
                  });
                  return chars;
                case 4:
                  characteristic.subCaracteristicas.map(function(c) {
                    chars.push(c);
                  });
                  return chars;
                case 5:
                  characteristic.valor = days
                    .reduce(function(values, day, idx) {
                      var amIdx = idx * 2 + 1;
                      var pmIdx = idx * 2 + 2;
                      if (characteristic.valores.am[day]) {
                        values.push(amIdx);
                      }
                      if (characteristic.valores.pm[day]) {
                        values.push(pmIdx);
                      }
                      return values;
                    }, [])
                    .join(',');
                  delete characteristic.valores;
                  return chars.concat(characteristic);
                default:
                  return chars.concat(characteristic);
              }
            }, []);

          return product;
        });

        return proveedorObj;
      }

      return {
        getListFiles: getListFiles,
        saveFile: saveFile,
        deleteFile: deleteFile,
        getIp: getIp,
        saveTracker: saveTracker,
        downloadFile: downloadFile,
        getClientes: getClientes,
        getProveedores: getProveedores,
        getClientesFilter: getClientesFilter,
        getAfiliadosByFilter: getAfiliadosByFilter,
        getProveedoresByFilter: getProveedoresByFilter,
        getLastAudit: getLastAudit,
        getAuditById: getAuditById,
        getNewAudit: getNewAudit,
        getCategoriasProveedor: getCategoriasProveedor,
        getHistorialAuditorias: getHistorialAuditorias,
        saveAuditoria: saveAuditoria,
        getReporte: getReporte
      };
    }

    httpServiceTracker.$inject = ['$http'];

    function httpServiceTracker($http) {
      function hprFn() {
        return $http.pendingRequests.length > 0;
      }

      return { hasPendingRequests: hprFn };
    }

    return ng.module('referenciaApp')
      .service('panelService', panelService)
      .service('httpServiceTracker', httpServiceTracker);
  });
