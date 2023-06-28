'use strict';
/* eslint-disable new-cap */

define(['angular', 'lodash', 'helper', 'wpConstant'], function(ng, _, helper, wpConstant) {
  var currentUser, roleWP, nroAsistencia, siniestroNro;
  var wpFactoryHelp = {
    help: {
      buildReq: buildReq,
      calcularEdad: calcularEdad,
      getArrayBy: getArrayBy,
      getArrayFotosNuevas: getArrayFotosNuevas,
      getArrayTipoSiniestro: getArrayTipoSiniestro,
      getArrayWithOutNullables: getArrayWithOutNullables,
      getClsTag: getClsTag,
      getDetaSiniestroChoque: getDetaSiniestroChoque,
      getDetaSiniestroRobo: getDetaSiniestroRobo,
      getFotoConB64: getFotoConB64,
      getFotosConB64: getFotosConB64,
      getNombreParteDanho: getNombreParteDanho,
      getObjFotoDoc: getObjFotoDoc,
      isArrayFotosValid: isArrayFotosValid,
      isCode200: isCode200,
      isNotNullable: isNotNullable,
      isObjDifferent: isObjDifferent,
      padLeft: padLeft,
      seleccionarCombo: seleccionarCombo,
      upperCaseObject: upperCaseObject,
      convertStringToBoolean: convertStringToBoolean,
      getObjWithHoursFormat5Characters: getObjWithHoursFormat5Characters
    },
    setRole: setRole,
    getRole: getRole,
    isAdmin: isAdmin,
    isAdminOrSupervisor: isAdminOrSupervisor,
    isProcOrObservador: isProcOrObservador,
    setCurrentUser: setCurrentUser,
    getCurrentUser: getCurrentUser,
    setNroAsistencia: setNroAsistencia,
    getNroAsistencia: getNroAsistencia,
    setSiniestroNro: setSiniestroNro,
    getSiniestroNro: getSiniestroNro,
    validFrmGeneral: validFrmGeneral,
    validFrmSiniestro: validFrmSiniestro,
    validFrmVehiculo: validFrmVehiculo,
    validFrmConductor: validFrmConductor,
    getCorrelativoItemConductor: getCorrelativoItemConductor,
    getCorrelativoItemOcupante: getCorrelativoItemOcupante
  };

  return wpFactoryHelp;

  // help

  function convertStringToBoolean(frmStatus) {
    var newFrmState = {};
    _.each(frmStatus, function efs(value, key) {
      newFrmState[key] = /true/i.test(value) ? true : false;
    });
    return newFrmState;
  }

  function upperCaseObject(obj) {
    var propertiesToIgnore = ['_id', 'rutaImagen', 'nombreFisico', 'nombreImagen'];
    obj = _.merge({}, obj);
    var newObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value = obj[key];
        if (_.isString(value) && !_.include(propertiesToIgnore, key)) {
          newObj[key] = value.trim().toUpperCase();
        } else if (_.isArray(value)) {
          for (var j = 0; j < value.length; j++) {
            value[j] = upperCaseObject(value[j]);
          }
          newObj[key] = value;
        } else if (_.isObject(value) && !_.isDate(value)) {
          newObj[key] = upperCaseObject(value);
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  }

  function padLeft(str, length, chars) {
    return Array(length - String(str).length + 1).join(chars || '0') + str;
  }

  function seleccionarCombo(arr, prop, cod) {
    return _.find(arr, function(item) {
      var codOfItem = (item[prop] + '').toUpperCase().trim();
      var codToMatch = (cod + '').toUpperCase().trim();

      return codOfItem === codToMatch;
    });
  }

  function isObjDifferent(oldObj, newObj) {
    var oldFrmParseado = ng.toJson(_deletePropsNullables(oldObj));
    var newFrmParseado = ng.toJson(_deletePropsNullables(newObj));

    return oldFrmParseado !== newFrmParseado;
  }

  function isCode200(resp) {
    return resp.operationCode === 200;
  }

  function isArrayFotosValid(arrFotos, max) {
    var max_value = !max ? 3 : max
    var myArrFotos = ng.copy(arrFotos);
    arrFotos.length < max_value && (myArrFotos.length = max_value);
    return _.every(myArrFotos, function(item) {
      return _.keys(item).length;
    });
  }

  function getNombreParteDanho(objDanho) {
    return helper.hasPath(objDanho, 'cDanho.parte') && objDanho.cDanho.parte.descripcionParteAfectada;
  }

  function getObjFotoDoc(resp, photoData) {
    return {
      imageTypeCode: resp.data[0].imageTypeCode,
      itemImagen: resp.data[0].itemImagen,
      nombreFisico: resp.data[0].nombreFisico,
      nombreImagen: photoData.name
    };
  }

  function getFotoConB64(resp, photoData) {
    return _.assign({}, getObjFotoDoc(resp, photoData), {srcImg: photoData.photoBase64});
  }

  function getFotosConB64(arrFotos, foto, photoData) {
    return [].concat(ng.copy(arrFotos), getFotoConB64(foto, photoData));
  }

  function getArrayFotosNuevas(arrFotos, resp, photoData) {
    return [].concat(ng.copy(arrFotos), getObjFotoDoc(resp, photoData));
  }

  function getArrayBy(arr, prop, val) {
    return _.filter(ng.copy(arr), function farb(item) {
      return item[prop] === val;
    });
  }

  function _deleteProperty(arr, arrProperties) {
    return _.map(arr, function(itemObj) {
      _.forEach(arrProperties, function(nameProperty) {
        delete itemObj[nameProperty];
      });
      return _.assign({}, itemObj);
    });
  }

  function getDetaSiniestroRobo(arrSiniestros) {
    return arrSiniestros.slice(0, 4);
  }

  function getDetaSiniestroChoque(arrSiniestros) {
    var arr = arrSiniestros.slice(4, 14);
    arr.splice(8, 1);
    return arr;
  }

  function getArrayTipoSiniestro(arrSiniestros, dataTab1) {
    var valorTrue = true;
    var valorFalse = false;

    var idsRobosSeleccionados = _.map(dataTab1.lstSelDetaSiniestroPorRobo, function mLsdpr(item) {
      return item;
    });

    var arrRobo = _.map(dataTab1.lstDetalleSiniestroPorRobo, function mLdsr(item) {
      item.value = _.contains(idsRobosSeleccionados, item.id) ? valorTrue : valorFalse;
      return item;
    });

    var arrChoque = _.map(dataTab1.lstDetalleSiniestroPorChoque, function mLdsc(item) {
      item.value = item.id === dataTab1.rbDetaSiniestroPorChoque ? valorTrue : valorFalse;
      return item;
    });
    arrChoque.splice(8, 0, _.assign({}, arrSiniestros[12], {value: dataTab1.roturaLuna || valorFalse}));

    return [].concat(arrRobo, arrChoque);
  }

  function buildReq(objFrm) {
    var frmInicial = _.merge({}, objFrm);
    if (!_.isEmpty(frmInicial.detalleTipoSiniestro)) {
      if (frmInicial.tab1) {
        frmInicial.detalleTipoSiniestro = getArrayTipoSiniestro(frmInicial.detalleTipoSiniestro, frmInicial.tab1);
      }
      if (frmInicial.detalleTipoSiniestro[12] && frmInicial.detalleTipoSiniestro[12].value) {
        frmInicial.expediente = 'PPL';
      }
      frmInicial.detalleTipoSiniestro = _deleteProperty(frmInicial.detalleTipoSiniestro, ['id', 'label', 'isChecked']);
    }
    frmInicial.expediente = frmInicial.expediente || '';
    frmInicial = _deletePropsNullables(frmInicial);
    frmInicial = _getObjWithOutProps(frmInicial, [
      'tab1',
      'tab2',
      'tab3',
      'tab5',
      'cabecera',
      'assistanceNumber',
      'callTime'
    ]);

    frmInicial.horaSiniestro = (frmInicial.horaSiniestro || '').substring(0, 5);
    frmInicial.ocupantes = _deleteProperty(frmInicial.ocupantes, ['cOcupante']);
    frmInicial.bienesTercero = _deleteProperty(frmInicial.bienesTercero, ['tab4At3']);
    frmInicial.detalleDanioVehiculo = _deleteProperty(frmInicial.detalleDanioVehiculo, ['cDanho']);
    frmInicial.peatonesTercero = _deleteProperty(frmInicial.peatonesTercero, ['tab4At2']);
    frmInicial.conductorTercero = _deleteProperty(frmInicial.conductorTercero, ['tab4At1']);
    frmInicial.conductorTercero = _.map(frmInicial.conductorTercero, function(item) {
      if (item.lesionadosTercero && item.lesionadosTercero.length) {
        item.lesionadosTercero = _deleteProperty(item.lesionadosTercero, ['cOcupante']);
      }
      item.vehiculoTercero || (item.vehiculoTercero = {fotosVehiculo: [], detalleDanioVehiculo: []});
      if (helper.hasPath(item, 'item.vehiculoTercero.detalleDanioVehiculo')) {
        item.vehiculoTercero.detalleDanioVehiculo = _deleteProperty(item.vehiculoTercero.detalleDanioVehiculo, [
          'cDanho'
        ]);
      }
      return item;
    });

    return frmInicial;
  }

  function _deletePropsNullables(obj) {
    var newObj = _.merge({}, obj);
    for (var key in newObj) {
      if (newObj.hasOwnProperty(key)) {
        var value = newObj[key];
        if (value == null) {
          delete newObj[key];
        } else if (_.isArray(value)) {
          for (var j = 0; j < value.length; j++) {
            value[j] = _deletePropsNullables(value[j]);
          }
          newObj[key] = value;
        } else if (_.isObject(value) && !_.isDate(value)) {
          newObj[key] = _deletePropsNullables(value);
        }
      }
    }
    return newObj;
  }

  function getObjWithHoursFormat5Characters(obj) {
    obj = _.merge({}, obj);
    var newObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var value = obj[key];
        if (/hora/i.test(key)) {
          newObj[key] = (value || '').trim().substring(0, 5);
        } else if (_.isArray(value)) {
          for (var j = 0; j < value.length; j++) {
            value[j] = getObjWithHoursFormat5Characters(value[j]);
          }
          newObj[key] = value;
        } else if (_.isObject(value) && !_.isDate(value)) {
          newObj[key] = getObjWithHoursFormat5Characters(value);
        } else {
          newObj[key] = value;
        }
      }
    }
    return newObj;
  }

  function _getObjWithOutProps(obj, arrProps) {
    var newObj = _.merge({}, obj);
    _.each(arrProps, function edp(item) {
      delete newObj[item];
    });
    return newObj;
  }

  function getArrayWithOutNullables(arr) {
    return _.filter(arr, function gawon(item) {
      return isNotNullable(item);
    });
  }

  function isNotNullable(item) {
    // aplicamos coercion para el undefined y null
    return item != null;
  }

  function _getStatusCampos(arrCampos, frm) {
    return _.map(arrCampos, function mcnn(el) {
      return !ng.isUndefined(frm[el]) && frm[el] !== null && frm[el] !== '';
    });
  }

  // root

  function validFrmGeneral(frm) {
    var camposNoNullOrUndefined = [
      'fechaSiniestro',
      'horaSiniestro',
      'codigoTipoSiniestro',
      'exoneraDenuncia',
      'codigoLugarAtencion',
      'fechaAtencion',
      'horaInicioAtencion',
      'horaFinAtencion'
    ];
    var statusCampos = _getStatusCampos(camposNoNullOrUndefined, frm);
    var isValidCampos = _.every(statusCampos, function ssc(status) {
      return status;
    });
    var isValidDetalleSiniestro = _.some(frm.detalleTipoSiniestro, function sds(item) {
      return item.value;
    });

    return isValidCampos && isValidDetalleSiniestro;
  }

  function validFrmSiniestro(frm) {
    return !!frm.codigoResponsaDetaSiniestro;
  }

  function validFrmVehiculo(frm) {
    var isSoatValid = frm.codigoSoatVehiculo;
    var isFotosDocValid = isArrayFotosValid(frm.documentosVehiculo, 3);
    var isFotosSiniestroValid = frm.fotosSiniestroVehiculo.length;

    return isSoatValid && isFotosDocValid && isFotosSiniestroValid;
  }

  function validFrmConductor(frm) {
    var isLicenciaValid = true;
    var camposNoNullOrUndefined = ['nombreConductor', 'paternoConductor', 'correoConductor'];
    var statusCampos = _getStatusCampos(camposNoNullOrUndefined, frm.conductor);
    /* eslint-disable */
    var regexEmail = /^([a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)[._-]?@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}\.?)([a-zA-Z0-9]*)$/i;
    var regexAlfaNumerico = /^[0-9a-zA-Z\ ]+$/;
    /* eslint-enable */
    var isDefinedFields = _.every(statusCampos, function ssc(status) {
      return status;
    });
    var isEmailValid = frm.conductor ? regexEmail.test(frm.conductor['correoConductor']) : false;
    if (
      frm.conductor &&
      !ng.isUndefined(frm.conductor['licenciaConductor']) &&
      frm.conductor['licenciaConductor'] !== ''
    ) {
      isLicenciaValid = regexAlfaNumerico.test(frm.conductor['licenciaConductor']);
    }
    return isDefinedFields && isEmailValid && isLicenciaValid;
  }

  function getClsTag() {
    return {
      abierto: 'tag-green',
      anulado: 'tag-gray',
      pendiente: 'tag-orange',
      generado: 'tag-blue'
    };
  }

  function setRole(role) {
    roleWP = role;
  }

  function getRole() {
    return roleWP;
  }

  function _getRoleName() {
    return getRole().roleCode.toUpperCase();
  }

  function isAdmin() {
    return _getRoleName() === wpConstant.codUserType.admin;
  }

  function isAdminOrSupervisor() {
    return _getRoleName() === wpConstant.codUserType.admin || _getRoleName() === wpConstant.codUserType.supervisor;
  }

  function isProcOrObservador() {
    return _getRoleName() === wpConstant.codUserType.procurador || _getRoleName() === wpConstant.codUserType.observador;
  }

  function setCurrentUser(objUser) {
    currentUser = ng.extend({}, objUser.profile, {
      loginUserName: objUser.profile.loginUserName.toUpperCase()
    });
  }

  function getCurrentUser() {
    return currentUser;
  }

  function setNroAsistencia(codAsistencia) {
    nroAsistencia = codAsistencia;
  }

  function getNroAsistencia() {
    return nroAsistencia;
  }

  function setSiniestroNro(codSiniestro) {
    siniestroNro = codSiniestro;
  }

  function getSiniestroNro() {
    return siniestroNro;
  }

  // TODO: componer calculo de correlativo
  function getCorrelativoItemConductor(arrConductorTercero) {
    if (!arrConductorTercero.length) {
      return 1;
    }

    var maxId =
      _.max(arrConductorTercero, function marct(item) {
        return item.ocupanteTercero.itemConductor;
      }).ocupanteTercero.itemConductor || 0;

    return maxId + 1;
  }

  function calcularEdad(fechaNacimiento) {
    var currentYear = new Date();
    var birthdate = new Date(fechaNacimiento);
    var diff = currentYear - birthdate;
    var age = Math.floor(diff / 31557600000);
    return age;
  }

  function getCorrelativoItemOcupante(arrLesionados) {
    if (!arrLesionados.length) {
      return 1;
    }

    var maxId =
      _.max(arrLesionados, function marct(item) {
        return item.itemOcupante;
      }).itemOcupante || 0;

    return maxId + 1;
  }
});
