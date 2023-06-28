/*jslint node: true */
'use strict';
var express = require('express');
var router = express.Router();
console.log('test-Profesion');

router.get('/ocupacion',function(req, res){
  console.log(req.body);
  res.json(
      {
        "Message":"",
        "Data":[
            {
            "Codigo":"1",
            "Descripcion":"ABOGADO"
            },
            {
            "Codigo":"2",
            "Descripcion":"ACTOR, ARTISTA Y DIREC D ESPEC"
            },
            {
            "Codigo":"3",
            "Descripcion":"ADMIN. EMPRESAS (PROFESIONAL)"
            },
            {
            "Codigo":"62",
            "Descripcion":"AGRICULTOR"
            },
            {
            "Codigo":"4",
            "Descripcion":"AGRIMENSOR Y TOPOGRAFO"
            },
            {
            "Codigo":"5",
            "Descripcion":"AGRONOMO"
            },
            {
            "Codigo":"6",
            "Descripcion":"ALBA¿IL"
            },
            {
            "Codigo":"63",
            "Descripcion":"AMA DE CASA"
            },
            {
            "Codigo":"7",
            "Descripcion":"ANAL. SISTEMAS Y COMPUTACION"
            },
            {
            "Codigo":"64",
            "Descripcion":"ANALISTA JR."
            },
            {
            "Codigo":"65",
            "Descripcion":"ANALISTA SR."
            },
            {
            "Codigo":"8",
            "Descripcion":"ANTROPOL., ARQUEOLOG.Y ETNOLOG"
            },
            {
            "Codigo":"9",
            "Descripcion":"ARCHIVERO"
            },
            {
            "Codigo":"10",
            "Descripcion":"ARQUITECTO"
            },
            {
            "Codigo":"11",
            "Descripcion":"ARTESANO DE CUERO"
            },
            {
            "Codigo":"12",
            "Descripcion":"ARTESANO TEXTIL"
            },
            {
            "Codigo":"66",
            "Descripcion":"ASISTENTE"
            },
            {
            "Codigo":"13",
            "Descripcion":"AUT.LITERARIO, ESCRITOR,CRITIC"
            },
            {
            "Codigo":"14",
            "Descripcion":"BACTEREOLOGO, FARMACOLOGO"
            },
            {
            "Codigo":"15",
            "Descripcion":"BIOLOGO"
            },
            {
            "Codigo":"67",
            "Descripcion":"CAJERO"
            },
            {
            "Codigo":"16",
            "Descripcion":"CARPINTERO"
            },
            {
            "Codigo":"68",
            "Descripcion":"CHEF"
            },
            {
            "Codigo":"69",
            "Descripcion":"COMERCIO Y NEGOCIOS"
            },
            {
            "Codigo":"71",
            "Descripcion":"COMUNICADOR"
            },
            {
            "Codigo":"17",
            "Descripcion":"CONDUCTOR DE VEHICULO A MOTOR"
            },
            {
            "Codigo":"70",
            "Descripcion":"CONSULTOR"
            },
            {
            "Codigo":"18",
            "Descripcion":"CONTADOR"
            },
            {
            "Codigo":"19",
            "Descripcion":"COREOGRAFO Y BAILARINES"
            },
            {
            "Codigo":"20",
            "Descripcion":"COSMETOLOGO, BARBERO Y PELUQUE"
            },
            {
            "Codigo":"21",
            "Descripcion":"DECORADOR, DIBUJANTE, PUBLICIS"
            },
            {
            "Codigo":"22",
            "Descripcion":"DEPORTISTA PROFESIONAL Y ATLET"
            },
            {
            "Codigo":"23",
            "Descripcion":"DIRECTOR DE EMPRESAS"
            },
            {
            "Codigo":"72",
            "Descripcion":"DISEÑADOR"
            },
            {
            "Codigo":"24",
            "Descripcion":"ECONOMISTA"
            },
            {
            "Codigo":"73",
            "Descripcion":"EJECUTIVO DE CUENTA"
            },
            {
            "Codigo":"25",
            "Descripcion":"ELECTRICISTA (TECNICO)"
            },
            {
            "Codigo":"74",
            "Descripcion":"EMPRESARIO"
            },
            {
            "Codigo":"26",
            "Descripcion":"ENFERMERO"
            },
            {
            "Codigo":"27",
            "Descripcion":"ENTRENADOR DEPORTIVO"
            },
            {
            "Codigo":"28",
            "Descripcion":"ESCENOGRAFO"
            },
            {
            "Codigo":"78",
            "Descripcion":"ESCRITOR"
            },
            {
            "Codigo":"29",
            "Descripcion":"ESCULTOR"
            },
            {
            "Codigo":"30",
            "Descripcion":"ESPECIALISTA EN TRAT DE BELLEZ"
            },
            {
            "Codigo":"31",
            "Descripcion":"FARMACEUTICO"
            },
            {
            "Codigo":"32",
            "Descripcion":"FOTOGRAFO, OPER.CAMAR, CINE TV"
            },
            {
            "Codigo":"33",
            "Descripcion":"GASFITERO"
            },
            {
            "Codigo":"34",
            "Descripcion":"GEOGRAFO"
            },
            {
            "Codigo":"75",
            "Descripcion":"GERENTE"
            },
            {
            "Codigo":"35",
            "Descripcion":"INGENIERO"
            },
            {
            "Codigo":"36",
            "Descripcion":"INTERPRETE, TRADUCT, FILOSOFO"
            },
            {
            "Codigo":"76",
            "Descripcion":"JEFE DEPARTAMENTO"
            },
            {
            "Codigo":"37",
            "Descripcion":"JOYERO Y/O PLATERO"
            },
            {
            "Codigo":"38",
            "Descripcion":"LABORATORISTA (TECNICO)"
            },
            {
            "Codigo":"77",
            "Descripcion":"LING¿ISTA"
            },
            {
            "Codigo":"39",
            "Descripcion":"LOCUTOR DE RADIO Y TV"
            },
            {
            "Codigo":"79",
            "Descripcion":"MARKETING"
            },
            {
            "Codigo":"41",
            "Descripcion":"MECANIC VEHICULOS DE MOTOR"
            },
            {
            "Codigo":"40",
            "Descripcion":"MECANICO DE MOTORES AVION Y B"
            },
            {
            "Codigo":"42",
            "Descripcion":"MEDICO Y CIRUJANO"
            },
            {
            "Codigo":"43",
            "Descripcion":"MODELO"
            },
            {
            "Codigo":"44",
            "Descripcion":"MUSICO"
            },
            {
            "Codigo":"45",
            "Descripcion":"NUTRICIONISTA"
            },
            {
            "Codigo":"80",
            "Descripcion":"OBRERO"
            },
            {
            "Codigo":"46",
            "Descripcion":"OBSTETRIZ"
            },
            {
            "Codigo":"47",
            "Descripcion":"ODONTOLOGO (DENTISTA)"
            },
            {
            "Codigo":"61",
            "Descripcion":"OTROS"
            },
            {
            "Codigo":"48",
            "Descripcion":"PERIODISTA"
            },
            {
            "Codigo":"49",
            "Descripcion":"PILOTO DE AERONAVES"
            },
            {
            "Codigo":"50",
            "Descripcion":"PINTOR"
            },
            {
            "Codigo":"82",
            "Descripcion":"PRACTICANTE"
            },
            {
            "Codigo":"99",
            "Descripcion":"PROFESIO-OCUP.NO ESPECIFICADA"
            },
            {
            "Codigo":"51",
            "Descripcion":"PROFESOR"
            },
            {
            "Codigo":"52",
            "Descripcion":"PSICOLOGO"
            },
            {
            "Codigo":"53",
            "Descripcion":"RADIOTECNICO"
            },
            {
            "Codigo":"83",
            "Descripcion":"RECEPCIONISTA"
            },
            {
            "Codigo":"54",
            "Descripcion":"REGIDOR MUNICIPAL"
            },
            {
            "Codigo":"55",
            "Descripcion":"RELACIONISTA PUBLICO E INDUST"
            },
            {
            "Codigo":"56",
            "Descripcion":"SASTRE"
            },
            {
            "Codigo":"81",
            "Descripcion":"SERVICIO DOMESTICO"
            },
            {
            "Codigo":"57",
            "Descripcion":"SOCIOLOGO"
            },
            {
            "Codigo":"84",
            "Descripcion":"SUB DIRECTOR"
            },
            {
            "Codigo":"85",
            "Descripcion":"SUB GERENTE"
            },
            {
            "Codigo":"86",
            "Descripcion":"SUPERVISOR"
            },
            {
            "Codigo":"58",
            "Descripcion":"TAPICERO"
            },
            {
            "Codigo":"59",
            "Descripcion":"TAXIDERMISTA-DESECADOR ANIMAL"
            },
            {
            "Codigo":"87",
            "Descripcion":"VENDEDOR"
            },
            {
            "Codigo":"60",
            "Descripcion":"VETERINARIO"
            }
        ],
        "OperationCode":200,
        "TypeMessage":"success",
        "Title":"Operación Exitosa",
        "Icon":"glyphicon glyphicon-ok-sign"
        }
    );
});
module.exports = router;