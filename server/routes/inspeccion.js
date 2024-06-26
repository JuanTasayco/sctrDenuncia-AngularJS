'use strict';
var express = require('express');
var router = express.Router();

//Datos de inspeccion por placa
router.get('/inspeccion/validar/:numPla=lgl384',function(req, res){
  console.log(req.body);
  res.json({
         "Message":"",
         "Data":{
            "CodZonaIns":"10",
            "DirectInt":"",
            "CodDirecInt":"2",
            "DirecNro":"",
            "CodDirecNro":"1",
            "CodTipoVia":"0",
            "Igv":18,
            "ApellidosInspector":"",
            "NombreInspector":"CARLOS ENRIQUE",
            "Nro_solicitud":"835",
            "CodZona":"",
            "NomSubModelo":"1.6",
            "NomModelo":"ELANTRA",
            "NomMarca":"HYUNDAI",
            "Veh_nro_motor":"DF64GF65H4G4",
            "Veh_tipo":"1",
            "Lugar_ref":"",
            "Tipo_zona":"",
            "Direccion":"",
            "Cod_distri":"",
            "Cod_prov":"",
            "Cod_dep":"",
            "Email1":"",
            "Email2":"",
            "Sexo":"",
            "Cod_profesion":"",
            "Fecha_nac":"",
            "Nro_doc":"12345678",
            "Ape_materno":"CHACA",
            "Ape_paterno":"RAMOS",
            "Nombres":"CARLOS ENRIQUE",
            "Tipo_doc":"DNI",
            "Veh_valor":19990.0,
            "Obs_adicional":"",
            "Veh_timon":"I",
            "Veh_ano":"2016",
            "Veh_sub_modelo":"1",
            "Veh_modelo":"23",
            "Veh_marca":"15",
            "Nro_Riesgo":798,
            "Tipo_Persona":"0",
            "Mca_estado_sol":"3",
            "NumeroPlaca":"TNT001",
            "NumeroChasis":"DRER65461",
            "CodigoColor":"1",
            "NumeroInspeccion":2001626,
            "NumeroInspeccionTRON":"2001626",
            "UsuarioCreacion":"DBISBAL",
            "UsuarioModificacion":"DBISBAL",
            "FechaModificacion":"24/06/2014 01:24:23 p.m.",
            "FechaCreacion":"24/06/2014 01:24:14 p.m.",
            "HoraCreacion":"13:24:14",
            "HoraModificacion":"13:24:23"
         }
      });
});

//Datos de inspeccion por numero de inspeccion
router.get('/inspeccion/validar/:numIns=2001626',function(req, res){
  console.log(req.body);
  res.json({
         "Message":"",
         "Data":{
            "CodZonaIns":"10",
            "DirectInt":"",
            "CodDirecInt":"2",
            "DirecNro":"",
            "CodDirecNro":"1",
            "CodTipoVia":"0",
            "Igv":18,
            "ApellidosInspector":"",
            "NombreInspector":"CARLOS ENRIQUE",
            "Nro_solicitud":"835",
            "CodZona":"",
            "NomSubModelo":"1.6",
            "NomModelo":"ELANTRA",
            "NomMarca":"HYUNDAI",
            "Veh_nro_motor":"DF64GF65H4G4",
            "Veh_tipo":"1",
            "Lugar_ref":"",
            "Tipo_zona":"",
            "Direccion":"",
            "Cod_distri":"",
            "Cod_prov":"",
            "Cod_dep":"",
            "Email1":"",
            "Email2":"",
            "Sexo":"",
            "Cod_profesion":"",
            "Fecha_nac":"",
            "Nro_doc":"12345678",
            "Ape_materno":"CHACA",
            "Ape_paterno":"RAMOS",
            "Nombres":"CARLOS ENRIQUE",
            "Tipo_doc":"DNI",
            "Veh_valor":19990.0,
            "Obs_adicional":"",
            "Veh_timon":"I",
            "Veh_ano":"2016",
            "Veh_sub_modelo":"1",
            "Veh_modelo":"23",
            "Veh_marca":"15",
            "Nro_Riesgo":798,
            "Tipo_Persona":"0",
            "Mca_estado_sol":"3",
            "NumeroPlaca":"TNT001",
            "NumeroChasis":"DRER65461",
            "CodigoColor":"1",
            "NumeroInspeccion":2001626,
            "NumeroInspeccionTRON":"2001626",
            "UsuarioCreacion":"DBISBAL",
            "UsuarioModificacion":"DBISBAL",
            "FechaModificacion":"24/06/2014 01:24:23 p.m.",
            "FechaCreacion":"24/06/2014 01:24:14 p.m.",
            "HoraCreacion":"13:24:14",
            "HoraModificacion":"13:24:23"
         }
      });
});

module.exports = router;