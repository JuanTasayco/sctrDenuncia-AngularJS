'use strict';
define(['angular', 'lodash'],
  function(ng, _) {
    registroService.$inject = ['$q', 'Restangular', '$log'];

    function registroService($q, Restangular, $log) {

      var service = {
        getProveedoresConCoberturaByFilter: getProveedoresConCoberturaByFilter,
        getCoberturaByAsegurado: getCoberturaByAsegurado,
        getDateRegistro: getDateRegistro,
        saveRegistro: saveRegistro,
        getObjReq: getObjReq
      };

      return service;

      /**
        *
        * helper functions
        *
        */

      function getProveedores(arrOrigen) {
        var arrDest = [], obj = {}, arrLength = arrOrigen.length;
        for (var i = 0; i < arrLength; i++) {
          obj.idProveedor = arrOrigen[i].id;
          obj.nombreProveedor = arrOrigen[i].nombre;
          obj.direccionProveedor = arrOrigen[i].direccion_Establecimiento;
          obj.categoriaProveedorID = +arrOrigen[i].categoria_Id;
          obj.categoriaProveedor = arrOrigen[i].categoria;
          obj.tipoEntidadID = +arrOrigen[i].entidad_Id;
          obj.tipoEntidad = arrOrigen[i].entidad;
          obj.nroCamas = arrOrigen[i].nroCamas;
          obj.convenioID = arrOrigen[i].convenio.toUpperCase();
          obj.convenioStr = arrOrigen[i].convenioStr.toUpperCase();
          obj.telefonoContacto = arrOrigen[i].telefono_Responsable;
          obj.responsable = arrOrigen[i].nombre_Responsable.toUpperCase();
          obj.direccion = arrOrigen[i].direccion_Establecimiento;
          obj.latitud = arrOrigen[i].latitud;
          obj.longitud = arrOrigen[i].longitud;
          obj.entidadRucCobertura = arrOrigen[i].evinculada_ruc;
          obj.entidadCodigoCobertura = arrOrigen[i].evinculada_codigo;

          obj.codigoDepartamento = arrOrigen[i].ubigeo.substring(0, 2);
          obj.departamento = arrOrigen[i].departamento;
          obj.codigoProvincia = arrOrigen[i].ubigeo;
          obj.provincia = arrOrigen[i].provincia;

          arrDest.push(obj);
          obj = {};
        }

        return arrDest;
      }

      function getObjServicio(arrOrigen, nombreServicio) {
        var arrDest = [], obj = {}, arrLength = arrOrigen.length;

        for (var i = 0; i < arrLength; i++) {
          obj.tipoServicio = nombreServicio;
          obj.nombreServicio = arrOrigen[i].nombre;

          if (nombreServicio !== 'especialidades') {
            obj.idFiltro = arrOrigen[i].id;
          } else {
            obj.idFiltro = null;
            obj.filtroValue = arrOrigen[i].id;
          }
          arrDest.push(obj);
          obj = {};
        }

        return arrDest;
      }

      function getObjReq(myflt) {
        var req = {};
        req.filtros = [];

        myflt.paciente.titular.name && (req.titularNombre = myflt.paciente.titular.name.toUpperCase());
        myflt.paciente.titular.contrato && (req.titularContrato = myflt.paciente.titular.contrato);
        myflt.paciente.titular.empresa && (req.titularEmpresa = myflt.paciente.titular.empresa);
        myflt.paciente.titular.ruc && (req.titularRuc = myflt.paciente.titular.ruc);
        myflt.paciente.titular.tipo_afiliacion && (req.tipoAfiliacion = myflt.paciente.titular.tipo_afiliacion);
        myflt.paciente.titular.fec_afiliacion && (req.fechaAfiliacion = myflt.paciente.titular.fec_afiliacion);

        myflt.paciente.asegurado.name && (req.aseguradoNombre = myflt.paciente.asegurado.name.toUpperCase());
        myflt.paciente.asegurado.dni && (req.aseguradoDNI = myflt.paciente.asegurado.dni);
        myflt.paciente.asegurado.tipodocumento && (req.aseguradoTipoDocumento = myflt.paciente.asegurado.tipodocumento);
        myflt.paciente.asegurado.id && (req.afiliadoCodigo = myflt.paciente.asegurado.id);
        myflt.paciente.asegurado.plan && (req.afiliadoPlan = myflt.paciente.asegurado.plan);
        myflt.paciente.asegurado.depa && (req.afiliadoDepartamento = myflt.paciente.asegurado.depa);
        myflt.paciente.asegurado.prov && (req.afiliadoProvincia = myflt.paciente.asegurado.prov);

        myflt.paciente.asegurado.fnac && (req.aseguradoFecNac = myflt.paciente.asegurado.fnac);
        myflt.paciente.asegurado.gen && (req.aseguradoGenero = myflt.paciente.asegurado.gen);
        myflt.paciente.asegurado.parentesco && (req.aseguradoParentesco = myflt.paciente.asegurado.parentesco);

        myflt.paciente.asegurado.companyID && (req.aseguradoIdCompania = myflt.paciente.asegurado.companyID);
        myflt.paciente.asegurado.company && (req.aseguradoEmpresa = myflt.paciente.asegurado.company);
        myflt.paciente.asegurado.producto && (req.aseguradoProducto = myflt.paciente.asegurado.producto);
        myflt.paciente.asegurado.estado && (req.aseguradoEstado = myflt.paciente.asegurado.estado);
        myflt.paciente.diagnostico && (req.aseguradoDiagnostico = myflt.paciente.diagnostico);
        myflt.paciente.condicion && (req.aseguradoCondicion = myflt.paciente.condicion);
        myflt.notas.obs && (req.aseguradoObservacion = myflt.notas.obs);
        myflt.notas.requerimientos && (req.aseguradoRequerimientos = myflt.notas.requerimientos);

        myflt.origen.departamento.id && (req.origenCodDepartamento = myflt.origen.departamento.id);
        myflt.origen.departamento.nombre && (req.origenDepartamento = myflt.origen.departamento.nombre.toUpperCase());
        myflt.origen.provincia.id && (req.origenCodProvincia = myflt.origen.provincia.id);
        myflt.origen.provincia.nombre && (req.origenProvincia = myflt.origen.provincia.nombre.toUpperCase());
        myflt.origen.centro && (req.origenCentro = myflt.origen.centro.toUpperCase());
        myflt.origen.responsable && (req.origenResponsable = myflt.origen.responsable);
        myflt.origen.tel && (req.origenTelefono = myflt.origen.tel);
        myflt.origen.mail && (req.origenMail = myflt.origen.mail);
        myflt.origen.origenReferencia.id && (req.origenCodReferencia = myflt.origen.origenReferencia.id);
        myflt.origen.origenReferencia.nombre
          && (req.origenReferencia = myflt.origen.origenReferencia.nombre.toUpperCase());

        myflt.profile && (req.usuarioCreacion = myflt.profile);
        myflt.notas.idReferencia && (req.idReferencia = myflt.notas.idReferencia);
        myflt.notas.fechaCreacion && (req.fechaCreacion = myflt.notas.fechaCreacion);
        myflt.notas.usuarioCreacion && (req.usuarioCreacion = myflt.notas.usuarioCreacion);

        if (myflt.filtrosDestino.servicios) {
          req.filtros = req.filtros.concat(getObjServicio(myflt.filtrosDestino.servicios, 'servicios'));
        }
        if (myflt.filtrosDestino.serviimagenes) {
          req.filtros = req.filtros.concat(getObjServicio(myflt.filtrosDestino.serviimagenes, 'imagenologia'));
        }

        if (myflt.filtrosDestino.serviemergencias) {
          req.filtros = req.filtros.concat(getObjServicio(myflt.filtrosDestino.serviemergencias, 'emergencias'));
        }

        if (myflt.filtrosDestino.serviambulancias) {
          req.filtros = req.filtros.concat(getObjServicio(myflt.filtrosDestino.serviambulancias, 'ambulancias'));
        }

        if (myflt.filtrosDestino.especialidades) {
          req.filtros = req.filtros.concat(getObjServicio(myflt.filtrosDestino.especialidades, 'especialidades'));
        }

        myflt.proveedores && (req.proveedores = getProveedores(myflt.proveedores));

        return req;
      }

      function getKeyFromArr(arr, key) {
        var arrKeys = _.map(arr, key);

        return arrKeys;
      }

      /**
        *
        * service's functions to reveal as public
        *
        */

      function saveRegistro(referencia) {
        var myflt = referencia || {},
          deferred = $q.defer();
        var req = getObjReq(myflt);

        Restangular.one('referencia').post('add', req).then(function postSFn(data) {
          $log.info('Success');
          deferred.resolve(data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getDateRegistro() {
        var deferred = $q.defer();
        var data = new Date();
        deferred.resolve(data);
        return deferred.promise;
      }

      function getCoberturaByAsegurado(objAsegurado) {
        var deferred = $q.defer();

        Restangular.one('clientes/afiliados').post('cobertura', objAsegurado).then(function postSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }

      function getProveedoresConCoberturaByFilter(filter) {
        var myflt = filter || {},
          deferred = $q.defer();
        var req = {};
        myflt.nom && (req.nombre = myflt.nom.toUpperCase());
        myflt.pl && (req.ubigeo = myflt.pl);
        myflt.categoria && (req.categoria = +myflt.categoria);
        myflt.entidad && (req.entidad = +myflt.entidad);
        myflt.convenio && (req.convenio = myflt.convenio.toUpperCase());
        myflt.companyID && (req.companyID = myflt.companyID);
        myflt.cod_afiliado && (req.cod_afiliado = myflt.cod_afiliado); // eslint-disable-line
        myflt.plan_afiliado && (req.plan_afiliado = myflt.plan_afiliado); // eslint-disable-line

        if (myflt.servicios || myflt.serviimagenes || myflt.serviemergencias || myflt.serviambulancias) {
          !ng.isArray(req.servicios) && (req.servicios = []);
        }

        myflt.servicios && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.servicios ,'id')));
        myflt.serviimagenes && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.serviimagenes ,'id')));
        myflt.serviemergencias && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.serviemergencias, 'id')));
        myflt.serviambulancias && (req.servicios = req.servicios.concat(getKeyFromArr(myflt.serviambulancias, 'id')));

        myflt.especialidades && (req.especialidades = getKeyFromArr(myflt.especialidades, 'nombre'));
        myflt.plOrigen && (req.referenciaUbigeoOrigen = myflt.plOrigen);

        req.esPaginacion = false;  // HACK: valor necesario en backend
        req.pageSize = 99999999;  // HACK: valor necesario en backend
        req.pagina = 1;  // HACK: valor necesario en backend

        Restangular.one('proveedores').post('buscarConCobertura', req).then(function postSFn(data) {
          deferred.resolve(data.Data);
        }, function getEFn(error) {
          $log.info('factory error: ' + error);
        });

        return deferred.promise;
      }
    } //  end registroService

    return ng.module('referenciaApp')
      .service('registroService', registroService);
  });
