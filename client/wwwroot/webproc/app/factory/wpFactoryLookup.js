define(['angular', 'lodash'], function(ng, _) {
  'use strict';
  /* eslint-disable new-cap */

  var dataLookup = {};
  var wpFactoryLookup = {
    myLookup: {
      getCodResponsabilidad: getCodResponsabilidad,
      getNivelEducativo: getNivelEducativo,
      getTipoBien: getTipoBien,
      getTipoLesion: getTipoLesion,
      getTipoLicencia: getTipoLicencia,
      getTipoRelacion: getTipoRelacion,
      getTipoSiniestro: getTipoSiniestro,
      getTipoSiniestroDetalle: getTipoSiniestroDetalle,
      getTipoSoat: getTipoSoat,
      getTipoVia: getTipoVia,
      getZonaDanho: getZonaDanho,
      getCompaniaSeguro: getCompaniaSeguro,
      getConvenio: getConvenio,
      getLugarAtencionAsistencia:getLugarAtencionAsistencia,
      setLookups: setLookups,
      getCarBrands: getCarBrands,
      setCarBrands: setCarBrands,
      getCarTypesUse: getCarTypesUse,
      setCarTypesUse: setCarTypesUse,
      getCarTypes: getCarTypes,
      setCarTypes: setCarTypes,
      getTypeDocuments: getTypeDocuments,
      setTypeDocuments: setTypeDocuments,
      getNivelDanho: getNivelDanho,
      setNivelDanho: setNivelDanho,
      getTipoDanho: getTipoDanho,
      setTipoDanho: setTipoDanho,
      setDepartamentos: setDepartamentos,
      getDepartamentos: getDepartamentos,
      setTalleres: setTalleres,
      getAllTalleres: getAllTalleres,
      getTalleresAfiliados: getTalleresAfiliados,
      getTalleresNoAfiliados: getTalleresNoAfiliados,
      getTalleresByUbigeo: getTalleresByUbigeo,
      setMotivoInves: setMotivoInves,
      getMotivoInves: getMotivoInves,
      getTipoMoneda : getTipoMoneda,
      resetDataLookUp: resetDataLookUp
    }
  };

  return wpFactoryLookup;

  // myLookup

  function setLookups(arrData) {
    _.forEach(arrData, function(item) {
      dataLookup.TIP_LESION = _filtrarSegunCodigo('TIP_LESION', 'codigoCampo', item, dataLookup.TIP_LESION);
      dataLookup.TIP_LICENCIA = _filtrarSegunCodigo('TIP_LICENCIA', 'codigoCampo', item, dataLookup.TIP_LICENCIA);
      dataLookup.TIP_SOAT = _filtrarSegunCodigo('TIP_SOAT', 'codigoCampo', item, dataLookup.TIP_SOAT);
      dataLookup.NIV_EDUCATIVO = _filtrarSegunCodigo('NIV_EDUCATIVO', 'codigoCampo', item, dataLookup.NIV_EDUCATIVO);
      dataLookup.ZONA_DANO = _filtrarSegunCodigo('ZONA_DANO', 'codigoCampo', item, dataLookup.ZONA_DANO);
      dataLookup.TIP_BIEN = _filtrarSegunCodigo('TIP_BIEN', 'codigoCampo', item, dataLookup.TIP_BIEN);
      dataLookup.TIP_DOMICILIO = _filtrarSegunCodigo('TIP_DOMICILIO', 'codigoCampo', item, dataLookup.TIP_DOMICILIO);
      dataLookup.TIP_RELACION = _filtrarSegunCodigo('TIP_RELACION', 'codigoCampo', item, dataLookup.TIP_RELACION);
      dataLookup.TIP_SINIESTRO = _filtrarSegunCodigo('TipoAsistencia', 'codigoCampo', item, dataLookup.TIP_SINIESTRO);
      dataLookup.TIP_SINIESTRO_DETALLE = _filtrarSegunCodigo('DetalleTipoSiniestro', 'codigoCampo', item, dataLookup.TIP_SINIESTRO_DETALLE);
      dataLookup.COMPANIA_ASEGURADO = _filtrarSegunCodigo('EmpresaAseguradora', 'codigoCampo', item, dataLookup.COMPANIA_ASEGURADO);
      dataLookup.CONVENIO = _filtrarSegunCodigo('CroquisAndResponsability', 'codigoCampo', item, dataLookup.CONVENIO);
      dataLookup.LUGAR_ATENCION = _filtrarSegunCodigo('LugarAtencionAsistencia', 'codigoCampo', item, dataLookup.LUGAR_ATENCION);
      dataLookup.TIPO_MONEDA = _filtrarSegunCodigo('TypeOfCurrency', 'codigoCampo', item, dataLookup.TIPO_MONEDA);
      dataLookup.COD_RESPONSABILIDAD = _filtrarSegunCodigo(
        'COD_RESPONSABILIDAD',
        'codigoCampo',
        item,
        dataLookup.COD_RESPONSABILIDAD
      );
    });
  }

  function setTalleres(arrTalleres) {
    dataLookup.allTalleres = [].concat(arrTalleres);
    _.forEach(arrTalleres, function(item) {
      dataLookup.talleresAfiliados = _filtrarSegunCodigo(17, 'codigoTipoTaller', item, dataLookup.talleresAfiliados);
      dataLookup.talleresNoAfiliados = _filtrarSegunCodigo(
        57,
        'codigoTipoTaller',
        item,
        dataLookup.talleresNoAfiliados
      );
    });
  }

  function getTalleresByUbigeo(arrTalleres, depa, prov, dist) {
    return _.filter(arrTalleres, function(item) {
      return item.codigoDepartamento === depa && item.codigoProvincia === prov && item.codigoDistrito === dist;
    });
  }

  function _filtrarSegunCodigo(pattern, campoAEvaluar, item, arrActual) {
    arrActual = ng.isArray(arrActual) ? arrActual : [];
    var myregx = new RegExp(pattern, 'i');
    var isMatching = myregx.test(item[campoAEvaluar]);

    return isMatching ? arrActual.concat(item) : arrActual;
  }

  function getAllTalleres() {
    return dataLookup.allTalleres;
  }

  function getTalleresAfiliados() {
    return dataLookup.talleresAfiliados;
  }

  function getTalleresNoAfiliados() {
    return dataLookup.talleresNoAfiliados;
  }

  function getCarBrands() {
    return dataLookup.CAR_BRANDS;
  }

  function getCarTypesUse() {
    return dataLookup.USO_VEHICULO;
  }

  function getTypeDocuments() {
    return dataLookup.TIP_DOCUMENTS;
  }

  function getCarTypes() {
    return dataLookup.CAR_TYPES;
  }

  function getNivelDanho() {
    return dataLookup.nivelDanho;
  }

  function getTipoDanho() {
    return dataLookup.tipoDanho;
  }

  function getDepartamentos() {
    return dataLookup.departamentos;
  }

  function setCarBrands(arrCarBrands) {
    dataLookup.CAR_BRANDS = [].concat(arrCarBrands);
  }

  function setCarTypesUse(arrUses) {
    dataLookup.USO_VEHICULO = [].concat(arrUses);
  }

  function setTypeDocuments(arrDocuments) {
    dataLookup.TIP_DOCUMENTS = [].concat(arrDocuments);
  }

  function setCarTypes(arrTypes) {
    dataLookup.CAR_TYPES = [].concat(arrTypes);
  }

  function setNivelDanho(arrNivel) {
    dataLookup.nivelDanho = [].concat(_.filter(arrNivel, function(item) {
      return item.codigoParametro != 0;
    }));
  }

  function setTipoDanho(arrNivel) {
    dataLookup.tipoDanho = [].concat(arrNivel);
  }

  function setDepartamentos(arrDepartamentos) {
    dataLookup.departamentos = [].concat(arrDepartamentos);
  }

  function getCodResponsabilidad() {
    return dataLookup.COD_RESPONSABILIDAD;
  }

  function getNivelEducativo() {
    return dataLookup.NIV_EDUCATIVO;
  }

  function getTipoMoneda() {
    return dataLookup.TIPO_MONEDA;
  }

  function getTipoBien() {
    return dataLookup.TIP_BIEN;
  }

  function getTipoVia() {
    return dataLookup.TIP_DOMICILIO;
  }

  function getTipoLesion() {
    return dataLookup.TIP_LESION;
  }

  function getTipoLicencia() {
    return dataLookup.TIP_LICENCIA;
  }

  function getTipoSoat() {
    return dataLookup.TIP_SOAT;
  }

  function getZonaDanho() {
    return dataLookup.ZONA_DANO;
  }

  function getCompaniaSeguro() {
    return dataLookup.COMPANIA_ASEGURADO;
  }

  function getConvenio() {
    return dataLookup.CONVENIO;
  }
  function getLugarAtencionAsistencia() {
    return dataLookup.LUGAR_ATENCION;
  }

  function getTipoRelacion() {
    return dataLookup.TIP_RELACION;
  }

  function getTipoSiniestro() {
    return dataLookup.TIP_SINIESTRO;
  }

  function getTipoSiniestroDetalle() {
    return dataLookup.TIP_SINIESTRO_DETALLE;
  }

  function setMotivoInves(arrMotivo) {
    dataLookup.motivoInves = arrMotivo;
  }

  function getMotivoInves() {
    return dataLookup.motivoInves;
  }
  function resetDataLookUp() {
    dataLookup = {}
  }

});
