'use strict';
var express = require('express');
var router = express.Router();

router.get('/general/enmascarcuenta/:cal/:tc', function(req, res) {
  return res.json({
    "Message": "",
    "Data": "10212345XXXXXXXXX",
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/parentesco/:codCia', function(req, res){
  if (req.params.codCia != '2') {
    return res.json("Not implementent");
  }
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "10",
        "Descripcion": "TITULAR"
      },
      {
        "Codigo": "20",
        "Descripcion": "CONYUGE"
      },
      {
        "Codigo": "21",
        "Descripcion": "CONVIVIENTE"
      },
      {
        "Codigo": "30",
        "Descripcion": "HIJO/A"
      },
      {
        "Codigo": "40",
        "Descripcion": "PADRE"
      },
      {
        "Codigo": "45",
        "Descripcion": "MADRE"
      },
      {
        "Codigo": "50",
        "Descripcion": "HERMANO/A"
      },
      {
        "Codigo": "51",
        "Descripcion": "SOBRINO/A"
      },
      {
        "Codigo": "52",
        "Descripcion": "NIETO/A"
      },
      {
        "Codigo": "53",
        "Descripcion": "ABUELO/A"
      },
      {
        "Codigo": "54",
        "Descripcion": "TIO/TIA"
      },
      {
        "Codigo": "55",
        "Descripcion": "CU�ADO/A"
      },
      {
        "Codigo": "56",
        "Descripcion": "PRIMO/A"
      },
      {
        "Codigo": "57",
        "Descripcion": "SERVICIO"
      },
      {
        "Codigo": "58",
        "Descripcion": "SUEGRO/A"
      },
      {
        "Codigo": "99",
        "Descripcion": "OTROS"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/codigotarjeta/2/:codigo', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "0",
        "Descripcion": "VISA"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/tipotarjeta', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "1",
        "Descripcion": "VISA",
        "LongitudMinimo": 16,
        "LongitudMaximo": 16
      },
      {
        "Codigo": "2",
        "Descripcion": "MASTER CARD",
        "LongitudMinimo": 16,
        "LongitudMaximo": 16
      },
      {
        "Codigo": "3",
        "Descripcion": "AMERICAN EXPRESS",
        "LongitudMinimo": 15,
        "LongitudMaximo": 15
      },
      {
        "Codigo": "4",
        "Descripcion": "DINERS",
        "LongitudMinimo": 14,
        "LongitudMaximo": 15
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});
router.get('/general/gestorentidad/:tipo/:codigo', function(req, res) {
  if (req.params.tipo == 'DB') {
    return res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "00020191",
          "Descripcion": "BANCO DE CREDITO DEL PERU"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
  } else if (req.params.tipo == 'TA') {
    return res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "88830001",
          "Descripcion": "MASTERCARD"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
  }
});

router.get('/general/moneda', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "02",
        "Descripcion": "DOLARES"
      },
      {
        "Codigo": "03",
        "Descripcion": "GENERICO"
      },
      {
        "Codigo": "01",
        "Descripcion": "SOLES"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/tipocuenta', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "2",
        "Descripcion": "AHORROS"
      },
      {
        "Codigo": "1",
        "Descripcion": "CORRIENTE"
      },
      {
        "Codigo": "3",
        "Descripcion": "MAESTRA"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/entidadfinanciera', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "0002",
        "Descripcion": "BANCO DE CREDITO DEL PERU",
        "CodigoOficiona": "0191",
        "LongitudMaximo": 14,
        "LongitudMinimo": 14
      },
      {
        "Codigo": "0003",
        "Descripcion": "INTERBANK",
        "CodigoOficiona": "0100",
        "LongitudMaximo": 13,
        "LongitudMinimo": 13
      },
      {
        "Codigo": "0009",
        "Descripcion": "SCOTIABANK PERU S.A.A.(EX-WIESE)",
        "CodigoOficiona": "0002",
        "LongitudMaximo": 10,
        "LongitudMinimo": 13
      },
      {
        "Codigo": "0011",
        "Descripcion": "BANCO CONTINENTAL",
        "CodigoOficiona": "0001",
        "LongitudMaximo": 18,
        "LongitudMinimo": 18
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/actividadeconomica', function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "1712",
        "Descripcion": "ACABADO DE PRODUCTOS TEXTILES"
      },
      {
        "Codigo": "5030",
        "Descripcion": "ACONDICIONAMIENTO DE EDIFICIOS"
      },
      {
        "Codigo": "1120",
        "Descripcion": "ACTIV. DE SERV. RELACIONADOS CON EXTRACCION DE PETROLEO Y GAS NATURAL"
      },
      {
        "Codigo": "6720",
        "Descripcion": "ACTIVIDADES AUXILIARES DE LA FINANCIACION DE PLANES DE SEGUROS Y DE PENSIONES"
      },
      {
        "Codigo": "6700",
        "Descripcion": "ACTIVIDADES AUXILIARES DE LA INTERMEDIACION FINANCIERA"
      },
      {
        "Codigo": "6719",
        "Descripcion": "ACTIVIDADES AUXILIARES DE LA INTERMEDIACION FINANCIERA"
      },
      {
        "Codigo": "6710",
        "Descripcion": "ACTIVIDADES AUXILIARES DE LA INTERMEDIACION FINANCIERA"
      },
      {
        "Codigo": "7514",
        "Descripcion": "ACTIVIDADES AUXILIARES DE TIPO SERVICIO PARA LA ADMINISTRACION PUBLICA EN GENERAL"
      },
      {
        "Codigo": "6712",
        "Descripcion": "ACTIVIDADES BURSATILES"
      },
      {
        "Codigo": "9220",
        "Descripcion": "ACTIVIDADES DE AGENCIAS DE NOTICIAS"
      },
      {
        "Codigo": "6304",
        "Descripcion": "ACTIVIDADES DE AGENCIAS DE VIAJES Y ORGANIZADORES DE EXCURSIONES Y GUIAS TURISTICAS"
      },
      {
        "Codigo": "6622",
        "Descripcion": "ACTIVIDADES DE AGENTES Y CORREDORES DE SEGUROS"
      },
      {
        "Codigo": "0990",
        "Descripcion": "ACTIVIDADES DE APOYO PARA OTRAS ACTIVIDADES DE EXPLOTACIÓN DE MINAS Y CANTERAS"
      },
      {
        "Codigo": "7421",
        "Descripcion": "ACTIVIDADES DE ARQUITECTURA E INGENIERIA Y ACTIVIDADES CONEXAS DE ASESORAMIENTO TECNICO"
      },
      {
        "Codigo": "7420",
        "Descripcion": "ACTIVIDADES DE ARQUITECTURA E INGENIERIA Y OTRAS ACTIVIDADES TECNICAS"
      },
      {
        "Codigo": "7414",
        "Descripcion": "ACTIVIDADES DE ASESORAMIENTO EMPRESARIAL Y EN MATERIA DE GESTION"
      },
      {
        "Codigo": "9100",
        "Descripcion": "ACTIVIDADES DE ASOCIACIONES"
      },
      {
        "Codigo": "9230",
        "Descripcion": "ACTIVIDADES DE BIBLIOTECAS, ARCHIVOS Y MUSEOS Y OTRAS ACTIVIDADES CULTURALES"
      },
      {
        "Codigo": "9231",
        "Descripcion": "ACTIVIDADES DE BIBLIOTECAS Y ARCHIVOS"
      },
      {
        "Codigo": "9210",
        "Descripcion": "ACTIVIDADES DE CINEMATOGRAFIA, RADIO Y TELEVISION Y OTRAS ACTIVIDADES DE ENTRETENIMIENTO"
      },
      {
        "Codigo": "7020",
        "Descripcion": "ACTIVIDADES DE CONSULTORIA DE GESTION"
      },
      {
        "Codigo": "7412",
        "Descripcion": "ACTIVIDADES DE CONTABILIDAD, TENEDURIA DE LIBROS Y AUDITORIA; ASESORAMIENTO EN MATERIA DE IMPUESTOS"
      },
      {
        "Codigo": "6412",
        "Descripcion": "ACTIVIDADES DE CORREO DISTINTAS DE LAS ACTIVIDADES POSTALES NACIONALES"
      },
      {
        "Codigo": "7522",
        "Descripcion": "ACTIVIDADES DE DEFENSA"
      },
      {
        "Codigo": "2210",
        "Descripcion": "ACTIVIDADES DE EDICION"
      },
      {
        "Codigo": "2200",
        "Descripcion": "ACTIVIDADES DE EDICION E IMPRESION Y DE REPRODUCCION DE GRABACIONES"
      },
      {
        "Codigo": "7495",
        "Descripcion": "ACTIVIDADES DE ENVASE Y EMPAQUE"
      },
      {
        "Codigo": "9200",
        "Descripcion": "ACTIVIDADES DE ESPARCIMIENTO Y ACTIVIDADES CULTURALES Y DEPORTIVAS"
      },
      {
        "Codigo": "7494",
        "Descripcion": "ACTIVIDADES DE FOTOGRAFIA"
      },
      {
        "Codigo": "8511",
        "Descripcion": "ACTIVIDADES DE HOSPITALES"
      },
      {
        "Codigo": "2221",
        "Descripcion": "ACTIVIDADES DE IMPRESION"
      },
      {
        "Codigo": "2220",
        "Descripcion": "ACTIVIDADES DE IMPRESION Y ACTIVIDADES DE SERVICIOS CONEXAS"
      },
      {
        "Codigo": "7492",
        "Descripcion": "ACTIVIDADES DE INVESTIGACION Y SEGURIDAD"
      },
      {
        "Codigo": "9233",
        "Descripcion": "ACTIVIDADES DE JARDINES BOTANICOS Y ZOOLOGICOS Y DE PARQUE NACIONALES"
      },
      {
        "Codigo": "7511",
        "Descripcion": "ACTIVIDADES DE LA ADMINISTRACION PUBLICA EN GENERAL"
      },
      {
        "Codigo": "7493",
        "Descripcion": "ACTIVIDADES DE LIMPIEZA DE EDIFICIOS"
      },
      {
        "Codigo": "7523",
        "Descripcion": "ACTIVIDADES DE MANTENIMIENTO DEL ORDEN PUBLICO Y DE SEGURIDAD"
      },
      {
        "Codigo": "8512",
        "Descripcion": "ACTIVIDADES DE MEDICOS Y ODONTOLOGOS"
      },
      {
        "Codigo": "9232",
        "Descripcion": "ACTIVIDADES DE MUSEOS Y PRESERVACION DE LUGARES Y EDIFICIOS HISTORICOS"
      },
      {
        "Codigo": "9111",
        "Descripcion": "ACTIVIDADES DE ORGANIZACION EMPRESARIALES Y DE EMPLEADORES"
      },
      {
        "Codigo": "9110",
        "Descripcion": "ACTIVIDADES DE ORGANIZACIONES EMPRESARIALES,PROFESIONALES Y DE EMPLEADORES"
      },
      {
        "Codigo": "9192",
        "Descripcion": "ACTIVIDADES DE ORGANIZACIONES POLITICAS"
      },
      {
        "Codigo": "9112",
        "Descripcion": "ACTIVIDADES DE ORGANIZACIONES PROFESIONALES"
      },
      {
        "Codigo": "9191",
        "Descripcion": "ACTIVIDADES DE ORGANIZACIONES RELIGIOSAS"
      },
      {
        "Codigo": "6309",
        "Descripcion": "ACTIVIDADES DE OTRAS AGENCIAS DE TRANSPORTE"
      },
      {
        "Codigo": "9190",
        "Descripcion": "ACTIVIDADES DE OTRAS ASOCIACIONES"
      },
      {
        "Codigo": "9199",
        "Descripcion": "ACTIVIDADES DE OTRAS ASOCIACIONES"
      },
      {
        "Codigo": "7530",
        "Descripcion": "ACTIVIDADES DE PLANES DE SEGURIDAD SOCIAL SOBRE AFILIACION OBLIGATORIA"
      },
      {
        "Codigo": "9213",
        "Descripcion": "ACTIVIDADES DE RADIO Y TELEVISION"
      },
      {
        "Codigo": "0140",
        "Descripcion": "ACTIVIDADES DE SERVICIOS AGRICOLAS Y GANADERAS EXCEPTO LAS ACTIVIDADES VETERINARIAS"
      },
      {
        "Codigo": "2222",
        "Descripcion": "ACTIVIDADES DE SERVICIOS RELACIONADOS CON LA IMPRESION"
      },
      {
        "Codigo": "8530",
        "Descripcion": "ACTIVIDADES DE SERVICIOS SOCIALES"
      },
      {
        "Codigo": "8500",
        "Descripcion": "ACTIVIDADES DE SERVICIOS SOCIALES Y DE SALUD"
      },
      {
        "Codigo": "9120",
        "Descripcion": "ACTIVIDADES DE SINDICATOS"
      },
      {
        "Codigo": "6300",
        "Descripcion": "ACTIVIDADES DE TRANSPORTE COMPLEMENTARIAS Y AUXILIARES, ACTIVIDADES DE AGENCIAS DE VIAJES"
      },
      {
        "Codigo": "9241",
        "Descripcion": "ACTIVIDADES DEPORTIVAS"
      },
      {
        "Codigo": "9240",
        "Descripcion": "ACTIVIDADES DEPORTIVAS Y OTRAS ACTIVIDADES DE ESPARCIMIENTO"
      },
      {
        "Codigo": "7000",
        "Descripcion": "ACTIVIDADES INMOBILIARIAS"
      },
      {
        "Codigo": "7010",
        "Descripcion": "ACTIVIDADES INMOBILIARIAS REALIZADAS CON BIENES PROPIOS O ARRENDADOS"
      },
      {
        "Codigo": "7411",
        "Descripcion": "ACTIVIDADES JURIDICAS"
      },
      {
        "Codigo": "7410",
        "Descripcion": "ACTIVIDADES JURIDICAS Y DE CONTABILIDAD, TENEDURIA DE LIBROS Y AUDITORIA; ASESORAMIENTO EN MATERIA DE"
      },
      {
        "Codigo": "6411",
        "Descripcion": "ACTIVIDADES POSTALES NACIONALES"
      },
      {
        "Codigo": "6410",
        "Descripcion": "ACTIVIDADES POSTALES Y DE CORREO"
      },
      {
        "Codigo": "7240",
        "Descripcion": "ACTIVIDADES RELACIONADAS CON BASES DE DATOS"
      },
      {
        "Codigo": "8510",
        "Descripcion": "ACTIVIDADES RELACIONADAS CON LA SALUD HUMANA"
      },
      {
        "Codigo": "9214",
        "Descripcion": "ACTIVIDADES TEATRALES Y MUSICALES Y OTRAS ACTIVIDADES ARTISTICAS"
      },
      {
        "Codigo": "8520",
        "Descripcion": "ACTIVIDADES VETERINARIAS"
      },
      {
        "Codigo": "6711",
        "Descripcion": "ADMINISTRACION DE MERCADOS FINANCIEROS"
      },
      {
        "Codigo": "7510",
        "Descripcion": "ADMINISTRACION DEL ESTADO Y APLICACION DE LA POLITICA ECONOMICA Y SOCIAL DE LA COMUNIDAD"
      },
      {
        "Codigo": "7500",
        "Descripcion": "ADMINISTRACION PUBLICA Y DEFENSA, PLANES DE SEGURIDAD SOCIAL DE AFILIACION OBLIGATORIA"
      },
      {
        "Codigo": "0100",
        "Descripcion": "AGRICULTURA, GANADERIA, CAZA Y ACTIVIDADES DE TIPO SERVICIO CONEXAS"
      },
      {
        "Codigo": "6302",
        "Descripcion": "ALMACENAMIENTO Y DEPOSITO"
      },
      {
        "Codigo": "7130",
        "Descripcion": "ALQUILER DE EFECTOS PERSONALES Y ENSERES DOMESTICOS"
      },
      {
        "Codigo": "4550",
        "Descripcion": "ALQUILER DE EQUIPO DE CONSTRUCCION Y DEMOLICION DOTADO DE OPERARIOS"
      },
      {
        "Codigo": "7110",
        "Descripcion": "ALQUILER DE EQUIPO DE TRANSPORTE"
      },
      {
        "Codigo": "7112",
        "Descripcion": "ALQUILER DE EQUIPO DE TRANSPORTE POR VIA ACUATICA"
      },
      {
        "Codigo": "7113",
        "Descripcion": "ALQUILER DE EQUIPO DE TRANSPORTE POR VIA AEREA"
      },
      {
        "Codigo": "7111",
        "Descripcion": "ALQUILER DE EQUIPO DE TRANSPORTE POR VIA TERRESTRE"
      },
      {
        "Codigo": "7121",
        "Descripcion": "ALQUILER DE MAQUINARIA Y EQUIPO AGROPECUARIO"
      },
      {
        "Codigo": "7122",
        "Descripcion": "ALQUILER DE MAQUINARIA Y EQUIPO DE CONSTRUCCION Y DE INGENIERIA CIVIL"
      },
      {
        "Codigo": "7123",
        "Descripcion": "ALQUILER DE MAQUINARIA Y EQUIPO DE OFICINA (INCLUSO COMPUTADORAS)"
      },
      {
        "Codigo": "7100",
        "Descripcion": "ALQUILER DE MAQUINARIA Y EQUIPO SIN OPERARIOS Y DE EFECTOS PERSONALES Y ENSERES DOMESTICOS."
      },
      {
        "Codigo": "7120",
        "Descripcion": "ALQUILER DE OTROS TIPOS DE MAQUINARIA Y EQUIPO"
      },
      {
        "Codigo": "7129",
        "Descripcion": "ALQUILER DE OTROS TIPOS DE MAQUINARIA Y EQUIPO N.C.P."
      },
      {
        "Codigo": "7730",
        "Descripcion": "ALQUILER Y ARRENDAMIENTO DE OTROS TIPOS DE MAQUINARIA, EQUIPO Y BIENES TANGIBLES"
      },
      {
        "Codigo": "7710",
        "Descripcion": "ALQUILER Y ARRENDAMIENTO DE VEHÍCULOS AUTOMOTORES"
      },
      {
        "Codigo": "6591",
        "Descripcion": "ARRENDAMIENTO FINANCIERO"
      },
      {
        "Codigo": "2010",
        "Descripcion": "ASERRADO Y ACEPILLADURA DE MADERA"
      },
      {
        "Codigo": "6511",
        "Descripcion": "BANCA CENTRAL"
      },
      {
        "Codigo": "4100",
        "Descripcion": "CAPTACION, DEPURACION Y DISTRIBUCION DE AGUA"
      },
      {
        "Codigo": "0150",
        "Descripcion": "CAZA ORDINARIA Y MEDIANTE TRAMPAS, Y REPOBLACION DE ANIMALES DE CAZA, INCLUSO LAS ACTIVIDADES DE SERVICIO"
      },
      {
        "Codigo": "5230",
        "Descripcion": "COMERCIO AL POR MENOR DE OTROS PRODUCTOS NUEVOS EN ALMACENES ESPECIALIZADOS"
      },
      {
        "Codigo": "5200",
        "Descripcion": "COMERCIO AL POR MENOR, EXCEPTO EL COMERCIO DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS,"
      },
      {
        "Codigo": "5210",
        "Descripcion": "COMERCIO AL POR MENOR NO ESPECIALIZADO EN ALMACENES"
      },
      {
        "Codigo": "5250",
        "Descripcion": "COMERCIO AL POR MENOR NO REALIZADO EN ALMACENES"
      },
      {
        "Codigo": "4500",
        "Descripcion": "CONSTRUCCION"
      },
      {
        "Codigo": "4520",
        "Descripcion": "CONSTRUCCION DE EDIFICIOS COMPLETOS Y DE PARTES DE EDIFICIOS; OBRAS DE INGENIERIA CIVIL"
      },
      {
        "Codigo": "4290",
        "Descripcion": "CONSTRUCCION DE OTRAS OBRAS DE INGENIERIA CIVIL"
      },
      {
        "Codigo": "3511",
        "Descripcion": "CONSTRUCCION Y REPARACION DE BUQUES"
      },
      {
        "Codigo": "3510",
        "Descripcion": "CONSTRUCCION Y REPARACION DE BUQUES Y OTRAS EMBARCACIONES"
      },
      {
        "Codigo": "3512",
        "Descripcion": "CONSTRUCCION Y REPARACION DE EMBARCACIONES DE RECREO Y DEPORTE"
      },
      {
        "Codigo": "7210",
        "Descripcion": "CONSULTORES EN EQUIPO DE INFORMATICA"
      },
      {
        "Codigo": "7220",
        "Descripcion": "CONSULTORES EN PROGRAMAS DE INFORMATICA Y SUMINISTROS DE PROGRAMAS DE INFORMATICA"
      },
      {
        "Codigo": "6400",
        "Descripcion": "CORREO Y TELECOMUNICACIONES"
      },
      {
        "Codigo": "2696",
        "Descripcion": "CORTE, TALLADO Y ACABADO DE LA PIEDRA"
      },
      {
        "Codigo": "0120",
        "Descripcion": "CRIA DE ANIMALES"
      },
      {
        "Codigo": "0121",
        "Descripcion": "CRIA DE GANADO VACUNO Y DE OVEJAS, CABRAS, CABALLOS, ASNOS, MULAS Y BURDEGANOS; CRIA DE GANADO LECHERO"
      },
      {
        "Codigo": "0122",
        "Descripcion": "CRIA DE OTROS ANIMALES; ELABORACION DE PRODUCTOS ANIMALES"
      },
      {
        "Codigo": "0111",
        "Descripcion": "CULTIVO DE CEREALES Y OTROS CULTIVOS"
      },
      {
        "Codigo": "0113",
        "Descripcion": "CULTIVO DE FRUTAS, NUECES, PLANTAS CUYAS HOJAS O FRUTOS SE UTILIZAN PARA PREPARAR BEBIDAS Y ESPECIAS"
      },
      {
        "Codigo": "7720",
        "Descripcion": "CULTIVO DE FRUTAS TROPICALES Y SUBTROPICALES"
      },
      {
        "Codigo": "0112",
        "Descripcion": "CULTIVO DE HORTALIZAS Y LEGUMBRES ESPECIALIDADES HORTICOLAS Y PRODUCTOS DE VIVERO"
      },
      {
        "Codigo": "0130",
        "Descripcion": "CULTIVO DE PRODUCTOS AGRICOLAS EN COMBINACION CON LA CRIA DE ANIMALES (EXPLOTACION MIXTA)"
      },
      {
        "Codigo": "0110",
        "Descripcion": "CULTIVOS EN GENERAL; CULTIVO DE PRODUCTOS DE MERCADO; HORTICULTURA"
      },
      {
        "Codigo": "1911",
        "Descripcion": "CURTIDO Y ADOBO DE CUEROS"
      },
      {
        "Codigo": "1900",
        "Descripcion": "CURTIDO Y ADOBO DE CUEROS;FABRICACION DE MALETAS,BOLSOS DE MANO,ARTICULOS DE TALABARTERIA Y GUARNICIONERIA,"
      },
      {
        "Codigo": "1910",
        "Descripcion": "CURTIDOYADOBO DE CUEROS;FABRICACION DE MALETAS,BOLSOS DE MANOYARTICULOS DE TALABARTERIAYGUARNICIONERIA"
      },
      {
        "Codigo": "1551",
        "Descripcion": "DESTILACION, RECTIFICACION Y MEZCLA DE BEBIDAS ALCOHOLICAS, PRODUCCION DE ALCOHOL ETILICO A PARTIR DE"
      },
      {
        "Codigo": "2213",
        "Descripcion": "EDICION DE GRABACIONES"
      },
      {
        "Codigo": "2211",
        "Descripcion": "EDICION DE LIBROS, FOLLETOS, PARTITURAS Y OTRAS PUBLICACIONES"
      },
      {
        "Codigo": "2212",
        "Descripcion": "EDICION DE PERIODICOS, REVISTAS Y PUBLICACIONES PERIODICAS"
      },
      {
        "Codigo": "1515",
        "Descripcion": "ELABORACION DE ACEITE DE PESCADO"
      },
      {
        "Codigo": "1514",
        "Descripcion": "ELABORACION DE ACEITE Y GRASAS DE ORIGEN VEGETAL Y ANIMAL"
      },
      {
        "Codigo": "1533",
        "Descripcion": "ELABORACION DE ALIMENTOS PREPARADOS PARA ANIMALES"
      },
      {
        "Codigo": "1532",
        "Descripcion": "ELABORACION DE ALMIDONES Y DE PRODUCTOS DERIVADOS DEL ALMIDON"
      },
      {
        "Codigo": "1542",
        "Descripcion": "ELABORACION DE AZUCAR"
      },
      {
        "Codigo": "1550",
        "Descripcion": "ELABORACION DE BEBIDAS"
      },
      {
        "Codigo": "1553",
        "Descripcion": "ELABORACION DE BEBIDAS MALTEADAS Y DE MALTA"
      },
      {
        "Codigo": "1554",
        "Descripcion": "ELABORACION DE BEBIDAS NO ALCOHOLICAS, PRODUCCION DE AGUAS MINERALES"
      },
      {
        "Codigo": "1543",
        "Descripcion": "ELABORACION DE CACAO Y CHOCOLATE Y DE PRODUCTOS DE CONFITERIA"
      },
      {
        "Codigo": "2330",
        "Descripcion": "ELABORACION DE COMBUSTIBLE NUCLEAR"
      },
      {
        "Codigo": "1544",
        "Descripcion": "ELABORACION DE MACARRONES, FIDEOS, ALCUZCUZ Y PRODUCTOS FARINACEOS SIMILARES"
      },
      {
        "Codigo": "1549",
        "Descripcion": "ELABORACION DE OTROS PRODUCTOS ALIMENTICIOS"
      },
      {
        "Codigo": "1500",
        "Descripcion": "ELABORACION DE PRODUCTOS ALIMENTICIOS Y BEBIDAS"
      },
      {
        "Codigo": "1531",
        "Descripcion": "ELABORACION DE PRODUCTOS DE MOLINERIA"
      },
      {
        "Codigo": "1530",
        "Descripcion": "ELABORACION DE PRODUCTOS DE MOLINERIA, ALMIDONES Y PRODUCTOS DERIVADOS DEL ALMIDON, Y DE ALIMENTOS"
      },
      {
        "Codigo": "1541",
        "Descripcion": "ELABORACION DE PRODUCTOS DE PANADERIA"
      },
      {
        "Codigo": "1600",
        "Descripcion": "ELABORACION DE PRODUCTOS DE TABACO"
      },
      {
        "Codigo": "1520",
        "Descripcion": "ELABORACION DE PRODUCTOS LACTEOS"
      },
      {
        "Codigo": "1552",
        "Descripcion": "ELABORACION DE VINOS"
      },
      {
        "Codigo": "1513",
        "Descripcion": "ELABORACION Y CONSERVACION DE FRUTAS, LEGUMBRES Y HORTALIZAS"
      },
      {
        "Codigo": "1512",
        "Descripcion": "ELABORACION Y CONSERVACION DE PESCADO Y PRODUCTOS DE PESCADO"
      },
      {
        "Codigo": "9000",
        "Descripcion": "ELIMINACION DE DESPERDICIOS, AGUAS RESIDUALES, SANEAMIENTO Y ACTIVIDADES SIMILARES"
      },
      {
        "Codigo": "7422",
        "Descripcion": "ENSAYOS Y ANALISIS TECNICOS"
      },
      {
        "Codigo": "8000",
        "Descripcion": "ENSEÑANZA"
      },
      {
        "Codigo": "9212",
        "Descripcion": "EXHIBICION DE FILMES Y VIDEOSCINTAS"
      },
      {
        "Codigo": "1420",
        "Descripcion": "EXPLOTACION DE MINAS Y CANTERAS N.C.P."
      },
      {
        "Codigo": "1400",
        "Descripcion": "EXPLOTACION DE OTRAS MINAS Y CANTERAS"
      },
      {
        "Codigo": "1429",
        "Descripcion": "EXPLOTACION DE OTRAS MINAS Y CANTERAS N.C.P."
      },
      {
        "Codigo": "1000",
        "Descripcion": "EXTRACCION DE CARBON Y LIGNITO; EXTRACCION DE TURBA"
      },
      {
        "Codigo": "1310",
        "Descripcion": "EXTRACCION DE MINERALES DE HIERRO"
      },
      {
        "Codigo": "1200",
        "Descripcion": "EXTRACCION DE MINERALES DE URANIO Y TORIO"
      },
      {
        "Codigo": "1300",
        "Descripcion": "EXTRACCION DE MINERALES METALIFEROS"
      },
      {
        "Codigo": "1320",
        "Descripcion": "EXTRACCION DE MINERALES METALIFEROS NO FERROSOS, EXCEPTO LOS MINERALES DE URANIO Y TORIO"
      },
      {
        "Codigo": "1421",
        "Descripcion": "EXTRACCION DE MINERALES PARA LA FABRICACION DE ABONOS Y PRODUCTOS QUIMICOS"
      },
      {
        "Codigo": "1100",
        "Descripcion": "EXTRACCION DE PETROLEO CRUDO Y GAS NATURAL; ACTIVIDADES DE SERVICIOS RELACIONADAS CON LA EXTRACCION DE PETROLEO Y GAS NATURAL"
      },
      {
        "Codigo": "1110",
        "Descripcion": "EXTRACCION DE PETROLEO CRUDO Y GAS NATURAL (INCLUYE OPERACIONES DE PERFORACION,TERMINACION Y EQUIPAMIENTO"
      },
      {
        "Codigo": "1410",
        "Descripcion": "EXTRACCION DE PIEDRA, ARENA Y ARCILLA"
      },
      {
        "Codigo": "1422",
        "Descripcion": "EXTRACCION DE SAL"
      },
      {
        "Codigo": "1010",
        "Descripcion": "EXTRACCION Y AGLOMERACION DE CARBON DE PIEDRA"
      },
      {
        "Codigo": "1020",
        "Descripcion": "EXTRACCION Y AGLOMERACION DE LIGNITO"
      },
      {
        "Codigo": "1030",
        "Descripcion": "EXTRACCION Y AGLOMERACION DE TURBA"
      },
      {
        "Codigo": "2300",
        "Descripcion": "FAB. DE COQUE, PRODUCTOS DE LA REFINACION DEL PETROLEO Y COMBUSTIBLE NUCLEAR"
      },
      {
        "Codigo": "2412",
        "Descripcion": "FABRICACION DE ABONOS Y COMPUESTOS DE NITROGENO"
      },
      {
        "Codigo": "3140",
        "Descripcion": "FABRICACION DE ACUMULADORES DE PILAS Y BATERIAS PRIMARIAS"
      },
      {
        "Codigo": "3530",
        "Descripcion": "FABRICACION DE AERONAVES Y NAVES ESPACIALES"
      },
      {
        "Codigo": "3120",
        "Descripcion": "FABRICACION DE APARATOS DE DISTRIBUCION Y CONTROL DE ENERGIA ELECTRICA"
      },
      {
        "Codigo": "2930",
        "Descripcion": "FABRICACION DE APARATOS DE USO DOMESTICO"
      },
      {
        "Codigo": "3310",
        "Descripcion": "FABRICACION DE APARATOS E INSTRUMENTOS MEDICOS Y DE APARATOS PARA MEDIR, VERIFICAR, ENSAYAR, NAVEGAR"
      },
      {
        "Codigo": "2927",
        "Descripcion": "FABRICACION DE ARMAS Y MUNICIONES"
      },
      {
        "Codigo": "1721",
        "Descripcion": "FABRICACION DE ARTICULOS CONFECCIONADOS DE MATERIAS TEXTILES, EXCEPTO PRENDAS DE VESTIR"
      },
      {
        "Codigo": "2893",
        "Descripcion": "FABRICACION DE ARTICULOS DE CUCHILLERIA, HERRAMIENTAS DE MANO Y ARTICULOS DE FERRETERIA"
      },
      {
        "Codigo": "3693",
        "Descripcion": "FABRICACION DE ARTICULOS DE DEPORTE"
      },
      {
        "Codigo": "2695",
        "Descripcion": "FABRICACION DE ARTICULOS DE HORMIGON, CEMENTO Y YESO"
      },
      {
        "Codigo": "3592",
        "Descripcion": "FABRICACION DE BICICLETAS Y DE SILLONES DE RUEDAS PARA INVALIDOS"
      },
      {
        "Codigo": "2912",
        "Descripcion": "FABRICACION DE BOMBAS, COMPRESORES, GRIFOS Y VALVULAS"
      },
      {
        "Codigo": "1920",
        "Descripcion": "FABRICACION DE CALZADO"
      },
      {
        "Codigo": "3420",
        "Descripcion": "FABRICACION DE CARROCERIAS PARA VEHICULOS AUTOMOTORES, FABRICACION DE REMOLQUES Y SEMIRREMOLQUES"
      },
      {
        "Codigo": "2694",
        "Descripcion": "FABRICACION DE CEMENTO, CAL Y YESO"
      },
      {
        "Codigo": "2913",
        "Descripcion": "FABRICACION DE COJINETES, ENGRANAJES, TRENES DE ENGRANAJES Y PIEZAS DE TRANSMISION"
      },
      {
        "Codigo": "2511",
        "Descripcion": "FABRICACION DE CUBIERTAS Y CAMARAS DE CAUCHO; REENCAUCHADO Y RENOVACION DE CUBIERTAS DE CAUCHO"
      },
      {
        "Codigo": "1723",
        "Descripcion": "FABRICACION DE CUERDAS, CORDELES, BRAMANTES Y REDES"
      },
      {
        "Codigo": "3313",
        "Descripcion": "FABRICACION DE EQUIPO DE CONTROL DE PROCESOS INDUSTRIALES"
      },
      {
        "Codigo": "2915",
        "Descripcion": "FABRICACION DE EQUIPO DE ELEVACION Y MANIPULACION"
      },
      {
        "Codigo": "3311",
        "Descripcion": "FABRICACION DE EQUIPO MEDICO Y QUIRURGICO Y DE APARATOS ORTOPEDICOS"
      },
      {
        "Codigo": "3230",
        "Descripcion": "FABRICACION DE EQUIPO Y APARATOS DE RADIO, TELEVISION Y COMUNICACIONES"
      },
      {
        "Codigo": "3200",
        "Descripcion": "FABRICACION DE EQUIPO Y APARATOS DE RADIO, TELEVISION Y COMUNICACIONES"
      },
      {
        "Codigo": "2430",
        "Descripcion": "FABRICACION DE FIBRAS MANUFACTURADAS"
      },
      {
        "Codigo": "4020",
        "Descripcion": "FABRICACION DE GAS; DISTRIBUCION DE COMBUSTIBLES GASEOSOS POR TUBERIAS"
      },
      {
        "Codigo": "2813",
        "Descripcion": "FABRICACION DE GENERADORES DE VAPOR, EXCEPTO CALDERAS DE AGUA CALIENTE PARA CALEFACCION CENTRAL"
      },
      {
        "Codigo": "3130",
        "Descripcion": "FABRICACION DE HILOS Y CABLES AISLADOS"
      },
      {
        "Codigo": "2021",
        "Descripcion": "FABRICACION DE HOJAS DE MADERA PARA ENCHAPADO; FABRICACION DE TABLEROS CONTRACHAPADOS, TABLEROS"
      },
      {
        "Codigo": "2914",
        "Descripcion": "FABRICACION DE HORNOS, HOGUERAS Y QUEMADORES"
      },
      {
        "Codigo": "3692",
        "Descripcion": "FABRICACION DE INSTRUMENTOS DE MUSICA"
      },
      {
        "Codigo": "3320",
        "Descripcion": "FABRICACION DE INSTRUMENTOS DE OPTICA Y EQUIPO FOTOGRAFICO"
      },
      {
        "Codigo": "3300",
        "Descripcion": "FABRICACION DE INSTRUMENTOS MEDICOS, OPTICOS Y DE PRECISION Y FABRICACION DE RELOJES"
      },
      {
        "Codigo": "3312",
        "Descripcion": "FABRICACION DE INSTRUMENTOS Y APARATOS PARA MEDIR, VERIFICAR, ENSAYAR, NAVEGAR Y OTROS FINES, EXCEPTO EL"
      },
      {
        "Codigo": "2424",
        "Descripcion": "FABRICACION DE JABONES Y DETERGENTES, PREPARADOS PARA LIMPIAR Y PULIR, PERFUMES Y PREPARADOS DE TOCADOR"
      },
      {
        "Codigo": "3691",
        "Descripcion": "FABRICACION DE JOYAS Y ARTICULOS CONEXOS"
      },
      {
        "Codigo": "3694",
        "Descripcion": "FABRICACION DE JUEGOS Y JUGUETES"
      },
      {
        "Codigo": "3150",
        "Descripcion": "FABRICACION DE LAMPARAS ELECTRICAS Y EQUIPO DE ILUMINACION"
      },
      {
        "Codigo": "3520",
        "Descripcion": "FABRICACION DE LOCOMOTORAS Y DE MATERIAL RODANTE PARA FERROCARRILES Y TRANVIAS"
      },
      {
        "Codigo": "1912",
        "Descripcion": "FABRICACION DE MALETAS, BOLSOS DE MANO Y ARTICULOS SIMILARES Y DE ARTICULOS DE TALABARTERIA Y GUARNICIONERIA"
      },
      {
        "Codigo": "2921",
        "Descripcion": "FABRICACION DE MAQUINARIA AGROPECUARIA Y FORESTAL"
      },
      {
        "Codigo": "3000",
        "Descripcion": "FABRICACION DE MAQUINARIA DE OFICINA, CONTABILIDAD E INFORMATICA"
      },
      {
        "Codigo": "2920",
        "Descripcion": "FABRICACION DE MAQUINARIA DE USO ESPECIAL"
      },
      {
        "Codigo": "2910",
        "Descripcion": "FABRICACION DE MAQUINARIA DE USO GENERAL"
      },
      {
        "Codigo": "2923",
        "Descripcion": "FABRICACION DE MAQUINARIA METALURGICA"
      },
      {
        "Codigo": "2925",
        "Descripcion": "FABRICACION DE MAQUINARIA PARA LA ELABORACION DE ALIMENTOS, BEBIDAS Y TABACO"
      },
      {
        "Codigo": "2926",
        "Descripcion": "FABRICACION DE MAQUINARIA PARA LA ELABORACION DE PRODUCTOS TEXTILES, PRENDAS DE VESTIR Y CUEROS"
      },
      {
        "Codigo": "2924",
        "Descripcion": "FABRICACION DE MAQUINARIA PARA LA EXPLOTACION DE MINAS Y CANTERAS Y PARA OBRAS DE CONSTRUCCION"
      },
      {
        "Codigo": "3100",
        "Descripcion": "FABRICACION DE MAQUINARIA Y APARATOS ELECTRICOS"
      },
      {
        "Codigo": "2900",
        "Descripcion": "FABRICACION DE MAQUINARIA Y EQUIPOS."
      },
      {
        "Codigo": "2922",
        "Descripcion": "FABRICACION DE MAQUINAS HERRAMIENTA"
      },
      {
        "Codigo": "2700",
        "Descripcion": "FABRICACION DE METALES COMUNES"
      },
      {
        "Codigo": "3591",
        "Descripcion": "FABRICACION DE MOTOCICLETAS"
      },
      {
        "Codigo": "3110",
        "Descripcion": "FABRICACION DE MOTORES, GENERADORES Y TRANSFORMADORES ELECTRICOS"
      },
      {
        "Codigo": "2911",
        "Descripcion": "FABRICACION DE MOTORES Y TURBINAS EXCEPTO MOTORES PARA AERONAVES, VEHICULOS AUTOMOTORES Y MOTOCICLETAS"
      },
      {
        "Codigo": "3610",
        "Descripcion": "FABRICACION DE MUEBLES"
      },
      {
        "Codigo": "3600",
        "Descripcion": "FABRICACION DE MUEBLES, INDUSTRIAS, MANUFACTURERAS N.C.P."
      },
      {
        "Codigo": "2109",
        "Descripcion": "FABRICACION DE OTROS ARTICULOS DE PAPEL Y CARTON"
      },
      {
        "Codigo": "2519",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS DE CAUCHO"
      },
      {
        "Codigo": "2029",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS DE MADERA, FABRICACION DE ARTICULOS DE CORCHO, PAJA Y MATERIALES TRENZABLES"
      },
      {
        "Codigo": "2899",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS ELABORADOS DE METAL"
      },
      {
        "Codigo": "2890",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS ELABORADOS DE METAL, ACTIVIDADES DE SERVICIOS Y DE TRABAJO DE METALES"
      },
      {
        "Codigo": "2600",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS MINERALES NO METALICOS"
      },
      {
        "Codigo": "2699",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS MINERALES NO METALICOS N.C.P."
      },
      {
        "Codigo": "2420",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS QUIMICOS"
      },
      {
        "Codigo": "2429",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS QUIMICOS N.C.P."
      },
      {
        "Codigo": "1720",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS TEXTILES"
      },
      {
        "Codigo": "1729",
        "Descripcion": "FABRICACION DE OTROS PRODUCTOS TEXTILES N.C.P."
      },
      {
        "Codigo": "3590",
        "Descripcion": "FABRICACION DE OTROS TIPOS DE EQUIPO DE TRANSPORTE"
      },
      {
        "Codigo": "3599",
        "Descripcion": "FABRICACION DE OTROS TIPOS DE EQUIPO DE TRANSPORTE"
      },
      {
        "Codigo": "3500",
        "Descripcion": "FABRICACION DE OTROS TIPOS DE EQUIPO DE TRANSPORTE"
      },
      {
        "Codigo": "3190",
        "Descripcion": "FABRICACION DE OTROS TIPOS DE EQUIPO ELECTRICO"
      },
      {
        "Codigo": "2929",
        "Descripcion": "FABRICACION DE OTROS TIPOS DE MAQUINARIA DE USO ESPECIAL"
      },
      {
        "Codigo": "2919",
        "Descripcion": "FABRICACION DE OTROS TIPOS DE MAQUINARIA DE USO GENERAL"
      },
      {
        "Codigo": "2102",
        "Descripcion": "FABRICACION DE PAPEL Y CARTON ONDULADO Y DE ENVASES DE PAPEL Y CARTON"
      },
      {
        "Codigo": "2100",
        "Descripcion": "FABRICACION DE PAPEL Y DE PRODUCTOS DE PAPEL"
      },
      {
        "Codigo": "3430",
        "Descripcion": "FABRICACION DE PARTES, PIEZAS Y ACCESORIOS PARA VEHICULOS AUTOMOTORES Y SUS MOTORES"
      },
      {
        "Codigo": "2022",
        "Descripcion": "FABRICACION DE PARTES Y PIEZAS DE CARPINTERIA PARA EDIFICIOS Y CONSTRUCCIONES"
      },
      {
        "Codigo": "2101",
        "Descripcion": "FABRICACION DE PASTA DE MADERA, PAPEL Y CARTON"
      },
      {
        "Codigo": "2422",
        "Descripcion": "FABRICACION DE PINTURAS, BARNICES Y PRODUCTOS DE REVESTIMIENTO SIMILARES, TINTAS DE IMPRENTA Y MASILLAS"
      },
      {
        "Codigo": "2421",
        "Descripcion": "FABRICACION DE PLAGUlCIDAS Y OTROS PRODUCTOS QUIMICOS DE USO AGROPECUARIO"
      },
      {
        "Codigo": "2413",
        "Descripcion": "FABRICACION DE PLASTICOS EN FORMAS PRIMARIAS Y DE CAUCHO SINTETICO"
      },
      {
        "Codigo": "1800",
        "Descripcion": "FABRICACION DE PRENDAS DE VESTIR; ADOBO Y TEÑIDO DE PIELES"
      },
      {
        "Codigo": "1810",
        "Descripcion": "FABRICACION DE PRENDAS DE VESTIR; EXCEPTO PRENDAS DE PIEL"
      },
      {
        "Codigo": "2693",
        "Descripcion": "FABRICACION DE PRODUCTOS DE ARCILLA Y CERAMICA NO REFRACTARIAS PARA USO ESTRUCTURAL"
      },
      {
        "Codigo": "2510",
        "Descripcion": "FABRICACION DE PRODUCTOS DE CAUCHO"
      },
      {
        "Codigo": "2500",
        "Descripcion": "FABRICACION DE PRODUCTOS DE CAUCHO Y PLASTICO"
      },
      {
        "Codigo": "2691",
        "Descripcion": "FABRICACION DE PRODUCTOS DE CERAMICA NO REFRACTARIA PARA USO NO ESTRUCTURAL"
      },
      {
        "Codigo": "2692",
        "Descripcion": "FABRICACION DE PRODUCTOS DE CERAMICA REFRACTARIA"
      },
      {
        "Codigo": "2310",
        "Descripcion": "FABRICACION DE PRODUCTOS DE HORNOS DE COQUE"
      },
      {
        "Codigo": "2320",
        "Descripcion": "FABRICACION DE PRODUCTOS DE LA REFINACION DEL PETROLEO"
      },
      {
        "Codigo": "2020",
        "Descripcion": "FABRICACION DE PRODUCTOS DE MADERA, CORCHO, PAJA Y MATERIALES TRENZABLES"
      },
      {
        "Codigo": "2520",
        "Descripcion": "FABRICACION DE PRODUCTOS DE PLASTICO"
      },
      {
        "Codigo": "2800",
        "Descripcion": "FABRICACION DE PRODUCTOS ELABORADOS DE METAL, EXCEPTO MAQUINARIA Y EQUIPO"
      },
      {
        "Codigo": "2423",
        "Descripcion": "FABRICACION DE PRODUCTOS FARMACEUTICOS, SUSTANCIAS QUIMICAS MEDICINALES Y PRODUCTOS BOTANICOS"
      },
      {
        "Codigo": "2811",
        "Descripcion": "FABRICACION DE PRODUCTOS METALICOS PARA USO ESTRUCTURAL"
      },
      {
        "Codigo": "2810",
        "Descripcion": "FABRICACION DE PRODUCTOS METALICOS PARA USO ESTRUCTURAL, TANQUES, DEPOSITOS Y GENERADORES DE VAPOR"
      },
      {
        "Codigo": "2690",
        "Descripcion": "FABRICACION DE PRODUCTOS MINERALES NO METALICOS N.C.P."
      },
      {
        "Codigo": "2720",
        "Descripcion": "FABRICACION DE PRODUCTOS PRIMARIOS DE METALES PRECIOSOS Y METALES NO FERROSOS"
      },
      {
        "Codigo": "1700",
        "Descripcion": "FABRICACION DE PRODUCTOS TEXTILES"
      },
      {
        "Codigo": "2023",
        "Descripcion": "FABRICACION DE RECIPIENTES DE MADERA"
      },
      {
        "Codigo": "3330",
        "Descripcion": "FABRICACION DE RELOJES"
      },
      {
        "Codigo": "2410",
        "Descripcion": "FABRICACION DE SUSTANCIAS QUIMICAS BASICAS"
      },
      {
        "Codigo": "2411",
        "Descripcion": "FABRICACION DE SUSTANCIAS QUIMICAS BASICAS, EXCEPTO ABONOS Y COMPUESTOS DE NITROGENO"
      },
      {
        "Codigo": "2400",
        "Descripcion": "FABRICACION DE SUSTANCIAS Y PRODUCTOS QUIMICOS"
      },
      {
        "Codigo": "2812",
        "Descripcion": "FABRICACION DE TANQUES, DEPOSITOS Y RECIPIENTES DE METAL"
      },
      {
        "Codigo": "1722",
        "Descripcion": "FABRICACION DE TAPICES Y ALFOMBRAS"
      },
      {
        "Codigo": "1730",
        "Descripcion": "FABRICACION DE TEJIDOS Y ARTICULOS DE PUNTO Y GANCHILLO"
      },
      {
        "Codigo": "3220",
        "Descripcion": "FABRICACION DE TRANSMISORES DE RADIO Y TELEVISION Y DE APARATOS PARA TELEFONIA Y TELEGRAFIA CON HILOS."
      },
      {
        "Codigo": "3210",
        "Descripcion": "FABRICACION DE TUBOS Y VALVULAS ELECTRONICOS Y DE OTROS COMPONENTES ELECTRONICOS"
      },
      {
        "Codigo": "3410",
        "Descripcion": "FABRICACION DE VEHICULOS AUTOMOTORES"
      },
      {
        "Codigo": "3400",
        "Descripcion": "FABRICACION DE VEHICULOS AUTOMOTORES, REMOLQUES Y SEMIRREMOLQUES"
      },
      {
        "Codigo": "2610",
        "Descripcion": "FABRICACION DE VIDRIO Y PRODUCTOS DE VIDRIO"
      },
      {
        "Codigo": "6600",
        "Descripcion": "FINANCIACION DE PLANES DE SEGUROS Y DE PENSIONES, EXCEPTO LOS PLANES DE SEGURIDAD SOCIAL DE"
      },
      {
        "Codigo": "2891",
        "Descripcion": "FORJA, PRENSADO, ESTAMPADO Y LAMINADO DE METALES, PULVIMETALURGIA"
      },
      {
        "Codigo": "2731",
        "Descripcion": "FUNDICION DE HIERRO Y ACERO"
      },
      {
        "Codigo": "2730",
        "Descripcion": "FUNDICION DE METALES"
      },
      {
        "Codigo": "2732",
        "Descripcion": "FUNDICION DE METALES NO FERROSOS"
      },
      {
        "Codigo": "4010",
        "Descripcion": "GENERACION, CAPTACION Y DISTRIBUCION DE ENERGIA ELECTRICA"
      },
      {
        "Codigo": "1710",
        "Descripcion": "HILATURA, TEJEDURA Y ACABADO DE PRODUCTOS TEXTILES"
      },
      {
        "Codigo": "9500",
        "Descripcion": "HOGARES PRIVADOS CON SERVICIO DOMESTICO"
      },
      {
        "Codigo": "5510",
        "Descripcion": "HOTELES, CAMPAMENTOS Y OTROS TIPOS DE HOSPEDAJE TEMPORAL"
      },
      {
        "Codigo": "5500",
        "Descripcion": "HOTELES Y RESTAURANTES"
      },
      {
        "Codigo": "2710",
        "Descripcion": "INDUSTRIAS BASICAS DE HIERRO Y DE ACERO"
      },
      {
        "Codigo": "3690",
        "Descripcion": "INDUSTRIAS MANUFACTURERAS"
      },
      {
        "Codigo": "7200",
        "Descripcion": "INFORMATICA Y ACTIVIDADES CONEXAS"
      },
      {
        "Codigo": "6500",
        "Descripcion": "INTERMEDIACION FINANCIERA, EXCEPTO LA FINANCIACION DE PLANES DE SEGUROS Y DE PENSIONES"
      },
      {
        "Codigo": "6510",
        "Descripcion": "INTERMEDIACION MONETARIA"
      },
      {
        "Codigo": "7413",
        "Descripcion": "INVESTIGACION DE MERCADOS Y REALIZACION DE ENCUESTAS DE OPINION PUBLICA"
      },
      {
        "Codigo": "7300",
        "Descripcion": "INVESTIGACION Y DESARROLLO"
      },
      {
        "Codigo": "7310",
        "Descripcion": "INVESTIGACION Y DESARROLLO DE LAS CIENCIAS NATURALES Y LA INGENIERIA"
      },
      {
        "Codigo": "7320",
        "Descripcion": "INVESTIGACION Y DESARROLLO DE LAS CIENCIAS SOCIALES Y LAS HUMANIDADES"
      },
      {
        "Codigo": "9301",
        "Descripcion": "LAVADO Y LIMPIEZA DE PRENDAS DE TELA Y DE PIEL, INCLUSO LA LIMPIEZA EN SECO"
      },
      {
        "Codigo": "6301",
        "Descripcion": "MANIPULACION DE LA CARGA"
      },
      {
        "Codigo": "7250",
        "Descripcion": "MANTENIMIENTO Y REPARACION DE MAQUINARIA DE OFICINA, CONTABILIDAD E INFORMATICA"
      },
      {
        "Codigo": "5020",
        "Descripcion": "MANTENIMIENTO Y REPARACION DE VEHICULOS AUTOMOTORES"
      },
      {
        "Codigo": "7491",
        "Descripcion": "OBTENCION Y DOTACION DE PERSONAL"
      },
      {
        "Codigo": "9900",
        "Descripcion": "ORGANIZACIONES Y ORGANOS EXTRATERRITORIALES"
      },
      {
        "Codigo": "2219",
        "Descripcion": "OTRAS ACTIVIDADES DE EDICION"
      },
      {
        "Codigo": "9219",
        "Descripcion": "OTRAS ACTIVIDADES DE ENTRETENIMIENTO"
      },
      {
        "Codigo": "9249",
        "Descripcion": "OTRAS ACTIVIDADES DE ESPARCIMIENTO"
      },
      {
        "Codigo": "7290",
        "Descripcion": "OTRAS ACTIVIDADES DE INFORMATICA"
      },
      {
        "Codigo": "9300",
        "Descripcion": "OTRAS ACTIVIDADES DE SERVICIOS"
      },
      {
        "Codigo": "9609",
        "Descripcion": "OTRAS ACTIVIDADES DE TIPO SERVICIO"
      },
      {
        "Codigo": "6303",
        "Descripcion": "OTRAS ACTIVIDADES DE TRANSPORTES COMPLEMENTARIAS"
      },
      {
        "Codigo": "7400",
        "Descripcion": "OTRAS ACTIVIDADES EMPRESARIALES"
      },
      {
        "Codigo": "8519",
        "Descripcion": "OTRAS ACTIVIDADES RELACIONADAS CON LA SALUD HUMANA"
      },
      {
        "Codigo": "93098",
        "Descripcion": "OTRAS ACTIVID.DE TIPO SERVICIO NCP"
      },
      {
        "Codigo": "3699",
        "Descripcion": "OTRAS INDUSTRIAS MANUFACTURERAS"
      },
      {
        "Codigo": "6592",
        "Descripcion": "OTROS TIPOS DE CREDITO"
      },
      {
        "Codigo": "6590",
        "Descripcion": "OTROS TIPOS DE INTERMEDIACION FINANCIERA"
      },
      {
        "Codigo": "6599",
        "Descripcion": "OTROS TIPOS DE INTERMEDIACION FINANCIERA"
      },
      {
        "Codigo": "6519",
        "Descripcion": "OTROS TIPOS DE INTERMEDIACION MONETARIA"
      },
      {
        "Codigo": "6022",
        "Descripcion": "OTROS TIPOS DE TRANSPORTE NO REGULAR DE PASAJEROS POR VIA TERRESTRE"
      },
      {
        "Codigo": "6020",
        "Descripcion": "OTROS TIPOS DE TRANSPORTE POR VIA TERRESTRE"
      },
      {
        "Codigo": "6021",
        "Descripcion": "OTROS TIPOS DE TRANSPORTE REGULAR DE PASAJEROS POR VIA TERRESTRE"
      },
      {
        "Codigo": "5259",
        "Descripcion": "OTROS TIPOS DE VENTA AL POR MENOR NO REALIZADA EN ALMACENES"
      },
      {
        "Codigo": "9302",
        "Descripcion": "PELUQUERIA Y OTROS TRATAMIENTOS DE BELLEZA"
      },
      {
        "Codigo": "0500",
        "Descripcion": "PESCA, EXPLOTACION DE CRIADEROS DE PECES Y GRANJAS PISCICOLAS; ACTIVIDADES DE SERVICIOS"
      },
      {
        "Codigo": "6602",
        "Descripcion": "PLANES DE PENSIONES"
      },
      {
        "Codigo": "6601",
        "Descripcion": "PLANES DE SEGUROS DE VIDA"
      },
      {
        "Codigo": "6603",
        "Descripcion": "PLANES DE SEGUROS GENERALES"
      },
      {
        "Codigo": "9303",
        "Descripcion": "POMPAS FUNEBRES Y ACTIVIDADES CONEXAS"
      },
      {
        "Codigo": "4510",
        "Descripcion": "PREPARACION DEL TERRENO"
      },
      {
        "Codigo": "1711",
        "Descripcion": "PREPARACION E HILATURA DE FIBRAS TEXTILES, TEJEDURA DE PRODUCTOS TEXTILES"
      },
      {
        "Codigo": "7520",
        "Descripcion": "PRESTACION DE SERVICIOS A LA COMUNIDAD EN GENERAL"
      },
      {
        "Codigo": "7230",
        "Descripcion": "PROCESAMIENTO DE DATOS"
      },
      {
        "Codigo": "2000",
        "Descripcion": "PRODUCCION DE MADERA Y FABRICACION DE PRODUCTOS DE MADERA Y DE CORCHO, EXCEPTO MUEBLES"
      },
      {
        "Codigo": "1510",
        "Descripcion": "PRODUCCION, PROCESAMIENTO Y CONSERVACION DE CARNE, PESCADO,FRUTAS,LEGUMBRES,HORTALIZAS,ACEITES Y GRASAS"
      },
      {
        "Codigo": "1511",
        "Descripcion": "PRODUCCION, PROCESAMIENTO Y CONSERVACION DE CARNE Y PRODUCTOS CARNICOS"
      },
      {
        "Codigo": "9211",
        "Descripcion": "PRODUCCION Y DISTRIBUCION DE FILMES Y VIDEOCINTAS"
      },
      {
        "Codigo": "7430",
        "Descripcion": "PUBLICIDAD"
      },
      {
        "Codigo": "3700",
        "Descripcion": "RECICLAMIENTO"
      },
      {
        "Codigo": "3710",
        "Descripcion": "RECICLAMIENTO DE DESPERDICIOS Y DESECHOS METALICOS"
      },
      {
        "Codigo": "3720",
        "Descripcion": "RECICLAMIENTO DE DESPERDICIOS Y DESECHOS NO METALICOS"
      },
      {
        "Codigo": "7512",
        "Descripcion": "REGULACION DE LAS ACTIVIDADES DE ORGANISMOS QUE PRESTAN SERVICIOS SANITARIOS, EDUCATIVOS, CULTURALES Y OTROS"
      },
      {
        "Codigo": "7513",
        "Descripcion": "REGULACION Y FACILITACION DE LA ACTIVIDAD ECONOMICA"
      },
      {
        "Codigo": "7521",
        "Descripcion": "RELACIONES EXTERIORES"
      },
      {
        "Codigo": "5260",
        "Descripcion": "REPARACION DE EFECTOS PERSONALES Y ENSERES DOMESTICOS"
      },
      {
        "Codigo": "3314",
        "Descripcion": "REPARACIÓN DE EQUIPO ELÉCTRICO"
      },
      {
        "Codigo": "2230",
        "Descripcion": "REPRODUCCION DE GRABACIONES"
      },
      {
        "Codigo": "5520",
        "Descripcion": "RESTAURANTES, BARES Y CANTINAS"
      },
      {
        "Codigo": "6604",
        "Descripcion": "SERVICIOS CIA DE SEGUROS GENERALES"
      },
      {
        "Codigo": "8531",
        "Descripcion": "SERVICIOS SOCIALES CON ALOJAMIENTO"
      },
      {
        "Codigo": "8532",
        "Descripcion": "SERVICIOS SOCIALES SIN ALOJAMIENTO"
      },
      {
        "Codigo": "0200",
        "Descripcion": "SILVICULTURA, EXTRACCION DE MADERA Y ACTIVIDADES DE SERVICIOS CONEXAS"
      },
      {
        "Codigo": "4000",
        "Descripcion": "SUMINISTRO DE ELECTRICIDAD, GAS, VAPOR Y AGUA CALIENTE"
      },
      {
        "Codigo": "4030",
        "Descripcion": "SUMINISTRO DE VAPOR Y AGUA CALIENTE"
      },
      {
        "Codigo": "6420",
        "Descripcion": "TELECOMUNICACIONES"
      },
      {
        "Codigo": "4540",
        "Descripcion": "TERMINACION DE EDIFICIOS - (ACABADOS PARA CONSTRUCCION)"
      },
      {
        "Codigo": "4923",
        "Descripcion": "TRANSPORTE DE CARGA POR CARRETERA"
      },
      {
        "Codigo": "6110",
        "Descripcion": "TRANSPORTE MARITIMO Y DE CABOTAJE"
      },
      {
        "Codigo": "6220",
        "Descripcion": "TRANSPORTE NO REGULAR POR VIA AEREA"
      },
      {
        "Codigo": "6030",
        "Descripcion": "TRANSPORTE POR TUBERIAS"
      },
      {
        "Codigo": "6100",
        "Descripcion": "TRANSPORTE POR VIA ACUATICA"
      },
      {
        "Codigo": "6200",
        "Descripcion": "TRANSPORTE POR VIA AEREA"
      },
      {
        "Codigo": "6010",
        "Descripcion": "TRANSPORTE POR VIA FERREA"
      },
      {
        "Codigo": "6000",
        "Descripcion": "TRANSPORTE POR VIA TERRESTRE, TRANSPORTE POR TUBERIAS"
      },
      {
        "Codigo": "6120",
        "Descripcion": "TRANSPORTE POR VIAS DE NAVEGACION INTERIORES"
      },
      {
        "Codigo": "6210",
        "Descripcion": "TRANSPORTE REGULAR POR VIA AEREA"
      },
      {
        "Codigo": "2892",
        "Descripcion": "TRATAMIENTO Y REVESTIMIENTO DE METALES, OBRAS DE INGENIERIA MECANICA EN GENERAL REALIZADAS A CAMBIO DE UNA"
      },
      {
        "Codigo": "5110",
        "Descripcion": "VENTA AL POR MAYOR A CAMBIO DE UNA RETRIBUCION O POR CONTRATA"
      },
      {
        "Codigo": "5122",
        "Descripcion": "VENTA AL POR MAYOR DE ALIMENTOS BEBIDAS Y TABACO"
      },
      {
        "Codigo": "5141",
        "Descripcion": "VENTA AL POR MAYOR DE COMBUSTIBLES SOLIDOS, LIQUIDOS Y GASEOSOS Y DE PRODUCTOS CONEXOS"
      },
      {
        "Codigo": "5130",
        "Descripcion": "VENTA AL POR MAYOR DE ENSERES DOMESTICOS"
      },
      {
        "Codigo": "5100",
        "Descripcion": "VENTA AL POR MAYOR DE ENSERES DOMESTICOS"
      },
      {
        "Codigo": "5150",
        "Descripcion": "VENTA AL POR MAYOR DE MAQUINARIA, EQUIPO Y MATERIALES"
      },
      {
        "Codigo": "5143",
        "Descripcion": "VENTA AL POR MAYOR DE MATERIALES DE CONSTRUCCION, ARTICULOS DE FERRETERIA Y EQUIPO Y MATERIALES DE"
      },
      {
        "Codigo": "5120",
        "Descripcion": "VENTA AL POR MAYOR DE MATERIAS PRIMAS AGROPECUARIAS, ANIMALES VIVOS, ALIMENTOS, BEBIDAS Y TABACO."
      },
      {
        "Codigo": "5121",
        "Descripcion": "VENTA AL POR MAYOR DE MATERIAS PRIMAS AGROPECUARIAS Y DE ANIMALES VIVOS"
      },
      {
        "Codigo": "5142",
        "Descripcion": "VENTA AL POR MAYOR DE METALES Y DE MINERALES METALIFEROS"
      },
      {
        "Codigo": "5139",
        "Descripcion": "VENTA AL POR MAYOR DE OTROS ENSERES DOMESTICOS"
      },
      {
        "Codigo": "5190",
        "Descripcion": "VENTA AL POR MAYOR DE OTROS PRODUCTOS"
      },
      {
        "Codigo": "5149",
        "Descripcion": "VENTA AL POR MAYOR DE OTROS PRODUCTOS INTERMEDIOS, DESPERDICIOS Y DESECHOS"
      },
      {
        "Codigo": "5140",
        "Descripcion": "VENTA AL POR MAYOR DE PRODUCTOS INTERMEDIOS, DESPERDICIOS Y DESECHOS NO AGROPECUARIOS"
      },
      {
        "Codigo": "5131",
        "Descripcion": "VENTA AL POR MAYOR DE PRODUCTOS TEXTILES, PRENDAS DE VESTIR Y CALZADO"
      },
      {
        "Codigo": "5220",
        "Descripcion": "VENTA AL POR MENOR DE ALIMENTOS, BEBIDAS Y TABACO EN ALMACENES ESPECIALIZADOS"
      },
      {
        "Codigo": "5233",
        "Descripcion": "VENTA AL POR MENOR DE APARATOS, ARTICULOS Y EQUIPO DE USO DOMESTICO"
      },
      {
        "Codigo": "5234",
        "Descripcion": "VENTA AL POR MENOR DE ARTICULOS DE FERRETERIA, PINTURAS Y PRODUCTOS DE VIDRIO"
      },
      {
        "Codigo": "5251",
        "Descripcion": "VENTA AL POR MENOR DE CASAS DE VENTA POR CORREO"
      },
      {
        "Codigo": "4730",
        "Descripcion": "VENTA AL POR MENOR DE COMBUSTIBLES PARA AUTOMOTORES"
      },
      {
        "Codigo": "5239",
        "Descripcion": "VENTA AL POR MENOR DE OTROS PRODUCTOS EN ALMACENES ESPECIALIZADOS"
      },
      {
        "Codigo": "5219",
        "Descripcion": "VENTA AL POR MENOR DE OTROS PRODUCTOS EN ALMACENES NO ESPECIALIZADOS"
      },
      {
        "Codigo": "4773",
        "Descripcion": "VENTA AL POR MENOR DE OTROS PRODUCTOS NUEVOS EN COMERCIOS ESPECIALIZADOS"
      },
      {
        "Codigo": "5252",
        "Descripcion": "VENTA AL POR MENOR DE PRODUCTOS DE TODO TIPO EN PUESTOS DE MERCADO"
      },
      {
        "Codigo": "5231",
        "Descripcion": "VENTA AL POR MENOR DE PRODUCTOS FARMACEUTICOS Y MEDICINALES, COSMETICOS Y ARTICULOS DE TOCADOR"
      },
      {
        "Codigo": "5232",
        "Descripcion": "VENTA AL POR MENOR DE PRODUCTOS TEXTILES, PRENDAS DE VESTIR, CALZADO Y ARTICULOS DE CUERO"
      },
      {
        "Codigo": "5240",
        "Descripcion": "VENTA AL POR MENOR EN ALMACENES DE ARTICULOS USADOS"
      },
      {
        "Codigo": "5211",
        "Descripcion": "VENTA AL POR MENOR EN ALMACENES NO ESPECIALIZADOS CON SURTIDO COMPUESTO PRINCIPALMENTE DE ALIMENTOS,"
      },
      {
        "Codigo": "5270",
        "Descripcion": "VENTA AL POR MENOR NO ESPECIFICADO"
      },
      {
        "Codigo": "4530",
        "Descripcion": "VENTA DE PARTES, PIEZAS Y ACCESORIOS DE VEHICULOS AUTOMOTORES"
      },
      {
        "Codigo": "5010",
        "Descripcion": "VENTA DE VEHICULOS AUTOMOTORES"
      },
      {
        "Codigo": "5040",
        "Descripcion": "VENTA, MANTENIMIENTO Y REPARACION DE MOTOCICLETAS Y DE SUS PARTES, PIEZAS Y ACCESORIOS"
      },
      {
        "Codigo": "5000",
        "Descripcion": "VENTA, MANTENIMIENTO Y REPARACION DE VEHICULOS AUTOMOTORES Y MOTOCICLETAS, VENTA AL POR"
      },
      {
        "Codigo": "1820",
        "Descripcion": ""
      },
      {
        "Codigo": "8010",
        "Descripcion": ""
      },
      {
        "Codigo": "8020",
        "Descripcion": ""
      },
      {
        "Codigo": "8090",
        "Descripcion": ""
      },
      {
        "Codigo": "8022",
        "Descripcion": ""
      },
      {
        "Codigo": "8030",
        "Descripcion": ""
      },
      {
        "Codigo": "8021",
        "Descripcion": ""
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/financiamiento/tipo/plurianual/0',function(req, res){
  res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "10001",
          "Descripcion": "Al contado",
          "Dato": "IND",
          "CodigoSegundo": "10001 - IND"
        },
        {
          "Codigo": "20002",
          "Descripcion": "Semestral",
          "Dato": "IND",
          "CodigoSegundo": "20002 - IND"
        },
        {
          "Codigo": "30003",
          "Descripcion": "Cuatrimestral",
          "Dato": "IND",
          "CodigoSegundo": "30003 - IND"
        },
        {
          "Codigo": "80004",
          "Descripcion": "4 cuotas mensual (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "80004 - IND"
        },
        {
          "Codigo": "40004",
          "Descripcion": "Trimestral (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "40004 - IND"
        },
        {
          "Codigo": "60006",
          "Descripcion": "Bimestral",
          "Dato": "IND",
          "CodigoSegundo": "60006 - IND"
        },
        {
          "Codigo": "90008",
          "Descripcion": "8 cuotas mensual (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "90008 - IND"
        },
        {
          "Codigo": "10010",
          "Descripcion": "10 cuotas mensual",
          "Dato": "IND",
          "CodigoSegundo": "10010 - IND"
        },
        {
          "Codigo": "10012",
          "Descripcion": "12 cuotas mensual",
          "Dato": "IND",
          "CodigoSegundo": "10012 - IND"
        },
        {
          "Codigo": "10018",
          "Descripcion": "18 cuotas mensual",
          "Dato": "IND",
          "CodigoSegundo": "10018 - IND"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
});

router.get('/general/financiamiento/tipo/plurianualpro/20',function(req, res){
  res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "10001",
          "Descripcion": "Al contado",
          "Dato": "IND",
          "CodigoSegundo": "10001 - IND"
        },
        {
          "Codigo": "20002",
          "Descripcion": "Semestral",
          "Dato": "IND",
          "CodigoSegundo": "20002 - IND"
        },
        {
          "Codigo": "30003",
          "Descripcion": "Cuatrimestral",
          "Dato": "IND",
          "CodigoSegundo": "30003 - IND"
        },
        {
          "Codigo": "80004",
          "Descripcion": "4 cuotas mensual (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "80004 - IND"
        },
        {
          "Codigo": "40004",
          "Descripcion": "Trimestral (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "40004 - IND"
        },
        {
          "Codigo": "60006",
          "Descripcion": "Bimestral",
          "Dato": "IND",
          "CodigoSegundo": "60006 - IND"
        },
        {
          "Codigo": "90008",
          "Descripcion": "8 cuotas mensual (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "90008 - IND"
        },
        {
          "Codigo": "10010",
          "Descripcion": "10 cuotas mensual",
          "Dato": "IND",
          "CodigoSegundo": "10010 - IND"
        },
        {
          "Codigo": "90012",
          "Descripcion": "12 cuotas mensual (s/i)",
          "Dato": "IND",
          "CodigoSegundo": "90012 - IND"
        },
        {
          "Codigo": "10018",
          "Descripcion": "18 cuotas mensual",
          "Dato": "IND",
          "CodigoSegundo": "10018 - IND"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    }
    );
});


router.get('/general/financiamiento/tipo/rc/0',function(req, res){
  res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "10001",
          "Descripcion": "Al Contado",
          "Dato": "IND",
          "CodigoSegundo": "10001 - IND"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
});

router.get('/general/financiamiento/tipo/automovil/0',function(req, res){
  res.json({
      "Message": "",
      "Data": [
        {
          "Codigo": "10001",
          "Descripcion": "Contado",
          "Dato": "IND",
          "CodigoSegundo": "10001 - IND"
        },
        {
          "Codigo": "20002",
          "Descripcion": "Semestral",
          "Dato": "IND",
          "CodigoSegundo": "20002 - IND"
        },
        {
          "Codigo": "30003",
          "Descripcion": "Cuatrimestral",
          "Dato": "IND",
          "CodigoSegundo": "30003 - IND"
        },
        {
          "Codigo": "60006",
          "Descripcion": "Bimestral",
          "Dato": "IND",
          "CodigoSegundo": "60006 - IND"
        },
        {
          "Codigo": "10010",
          "Descripcion": "10 cuotas",
          "Dato": "IND",
          "CodigoSegundo": "10010 - IND"
        },
        {
          "Codigo": "10012",
          "Descripcion": "Mensual",
          "Dato": "IND",
          "CodigoSegundo": "10012 - IND"
        }
      ],
      "OperationCode": 200,
      "TypeMessage": "success"
    });
});

router.get('/general/materiaAsegurada', function(req, res){
  res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "14",
        "Descripcion": "ABONOS VEGETALES"
      },
      {
        "Codigo": "21",
        "Descripcion": "ACEITES, GRASAS Y LIBRICANTES"
      },
      {
        "Codigo": "27",
        "Descripcion": "ALIMENTOS CONGELADOS"
      },
      {
        "Codigo": "1",
        "Descripcion": "ALIMENTOS NO CONGELADOS"
      },
      {
        "Codigo": "24",
        "Descripcion": "APARATOS E INSTRUMENTOS DE PRECISION (MEDICO, OPTICO Y SIMILARES)"
      },
      {
        "Codigo": "19",
        "Descripcion": "ARTICULOS DE FERRETERIA"
      },
      {
        "Codigo": "38",
        "Descripcion": "ARTICULOS DE FOTOGRAFIA"
      },
      {
        "Codigo": "39",
        "Descripcion": "ARTICULOS DE MUSICA"
      },
      {
        "Codigo": "37",
        "Descripcion": "ARTICULOS DE VIDEO"
      },
      {
        "Codigo": "16",
        "Descripcion": "ARTICULOS DEPORTIVOS"
      },
      {
        "Codigo": "12",
        "Descripcion": "ARTICULOS PARA CONSTRUCCION"
      },
      {
        "Codigo": "7",
        "Descripcion": "BEBIDAS ALCOHOLICAS"
      },
      {
        "Codigo": "28",
        "Descripcion": "BEBIDAS NO ALCOHOLICAS"
      },
      {
        "Codigo": "9",
        "Descripcion": "CALZADOS, PELETERIA Y ARTICULOS DE CUERO"
      },
      {
        "Codigo": "6",
        "Descripcion": "ELECTRODOMESTICOS"
      },
      {
        "Codigo": "35",
        "Descripcion": "EQUIPOS DE ENERGIA COMUNES"
      },
      {
        "Codigo": "22",
        "Descripcion": "EQUIPOS DE TELEFONIA, ACCESORIOS Y REPUESTOS"
      },
      {
        "Codigo": "23",
        "Descripcion": "EXPLOSIVOS Y ACCESORIOS DE VOLADURA"
      },
      {
        "Codigo": "29",
        "Descripcion": "FLORES"
      },
      {
        "Codigo": "41",
        "Descripcion": "FRUTAS FRESCAS"
      },
      {
        "Codigo": "36",
        "Descripcion": "HERRAMIENTAS"
      },
      {
        "Codigo": "15",
        "Descripcion": "JUGUETES Y SIMILARES"
      },
      {
        "Codigo": "25",
        "Descripcion": "MAQUINARIA Y EQUIPO LIVIANO < 250 Kg (MAQUINAS Y EQUIPOS OFICINA)"
      },
      {
        "Codigo": "26",
        "Descripcion": "MAQUINARIA Y EQUIPO PESADO > 250 Kg"
      },
      {
        "Codigo": "13",
        "Descripcion": "MOBILIARIO EN GENERAL"
      },
      {
        "Codigo": "8",
        "Descripcion": "PAPEL Y PRODUCTOS DERIVADOS"
      },
      {
        "Codigo": "34",
        "Descripcion": "PINTURAS"
      },
      {
        "Codigo": "10",
        "Descripcion": "PLASTICOS"
      },
      {
        "Codigo": "4",
        "Descripcion": "PRODUCTOS FARMACEUTICOS"
      },
      {
        "Codigo": "5",
        "Descripcion": "PRODUCTOS METALURGICOS Y ELECTRICOS"
      },
      {
        "Codigo": "20",
        "Descripcion": "PRODUCTOS MINERALES"
      },
      {
        "Codigo": "2",
        "Descripcion": "PRODUCTOS QUIMICOS, INSUMOS Y/O MATERIAS PRIMAS EN GENERAL"
      },
      {
        "Codigo": "3",
        "Descripcion": "PRODUCTOS TEXTILES"
      },
      {
        "Codigo": "42",
        "Descripcion": "PROPIOS DEL GIRO DEL NEGOCIO DEL ASEGURADO"
      },
      {
        "Codigo": "18",
        "Descripcion": "TABACO Y CIGARRILLOS"
      },
      {
        "Codigo": "40",
        "Descripcion": "VEGETALES FRESCOS"
      },
      {
        "Codigo": "33",
        "Descripcion": "VEHICULOS, ACCESORIOS"
      },
      {
        "Codigo": "31",
        "Descripcion": "VEHICULOS DEPORTIVOS"
      },
      {
        "Codigo": "17",
        "Descripcion": "VEHICULOS LIVIANOS"
      },
      {
        "Codigo": "30",
        "Descripcion": "VEHICULOS PESADOS"
      },
      {
        "Codigo": "32",
        "Descripcion": "VEHICULOS, REPUESTOS"
      },
      {
        "Codigo": "11",
        "Descripcion": "VIDRIOS, CERAMICOS Y SIMILARES"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/ubigeo/pais', function(req, res) {
  res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "ZWE",
        "Descripcion": "ZIMBABWE"
      },
      {
        "Codigo": "ZMB",
        "Descripcion": "ZAMBIA"
      },
      {
        "Codigo": "ZAR",
        "Descripcion": "ZAIRE"
      },
      {
        "Codigo": "YUG",
        "Descripcion": "YUGOSLAVIA"
      },
      {
        "Codigo": "YEM",
        "Descripcion": "YEMEN"
      },
      {
        "Codigo": "VNM",
        "Descripcion": "VIETNAM"
      },
      {
        "Codigo": "VEN",
        "Descripcion": "VENEZUELA"
      },
      {
        "Codigo": "URY",
        "Descripcion": "URUGUAY"
      },
      {
        "Codigo": "UGA",
        "Descripcion": "UGANDA"
      },
      {
        "Codigo": "UKR",
        "Descripcion": "UCRANIA"
      },
      {
        "Codigo": "TUR",
        "Descripcion": "TURQUIA"
      },
      {
        "Codigo": "TUN",
        "Descripcion": "TUNEZ"
      },
      {
        "Codigo": "TTO",
        "Descripcion": "TRINIDAD Y TOBAGO"
      },
      {
        "Codigo": "TGO",
        "Descripcion": "TOGO"
      },
      {
        "Codigo": "TOM",
        "Descripcion": "TODO EL MUNDO"
      },
      {
        "Codigo": "TZA",
        "Descripcion": "TANZANIA"
      },
      {
        "Codigo": "TWN",
        "Descripcion": "TAIWAN"
      },
      {
        "Codigo": "THA",
        "Descripcion": "TAILANDIA"
      },
      {
        "Codigo": "SWZ",
        "Descripcion": "SWAZILANDIA"
      },
      {
        "Codigo": "SUR",
        "Descripcion": "SURINAM"
      },
      {
        "Codigo": "CHE",
        "Descripcion": "SUIZA"
      },
      {
        "Codigo": "SWE",
        "Descripcion": "SUECIA"
      },
      {
        "Codigo": "SDN",
        "Descripcion": "SUDAN"
      },
      {
        "Codigo": "ZAF",
        "Descripcion": "SUDAFRICA"
      },
      {
        "Codigo": "LCA",
        "Descripcion": "ST. LUCIA"
      },
      {
        "Codigo": "LKA",
        "Descripcion": "SRI LANKA"
      },
      {
        "Codigo": "SOM",
        "Descripcion": "SOMALIA"
      },
      {
        "Codigo": "SYR",
        "Descripcion": "SIRIA"
      },
      {
        "Codigo": "SGP",
        "Descripcion": "SINGAPUR"
      },
      {
        "Codigo": "SLE",
        "Descripcion": "SIERRA LEONA"
      },
      {
        "Codigo": "SYC",
        "Descripcion": "SEYCHELLES"
      },
      {
        "Codigo": "SEN",
        "Descripcion": "SENEGAL"
      },
      {
        "Codigo": "STP",
        "Descripcion": "SANTO TOME Y PRINCIPE"
      },
      {
        "Codigo": "VCT",
        "Descripcion": "SAN VICENTE Y LAS GRANADINAS"
      },
      {
        "Codigo": "SCN",
        "Descripcion": "SAN CRISTOBAL Y NEVIS"
      },
      {
        "Codigo": "RUS",
        "Descripcion": "RUSIA"
      },
      {
        "Codigo": "ROM",
        "Descripcion": "RUMANIA"
      },
      {
        "Codigo": "RWA",
        "Descripcion": "RUANDA"
      },
      {
        "Codigo": "DOM",
        "Descripcion": "REPUBLICA DOMINICANA"
      },
      {
        "Codigo": "RCA",
        "Descripcion": "REPUBLICA CENTRO AFRICANA"
      },
      {
        "Codigo": "CZE",
        "Descripcion": "REPUBLICA  CHECA"
      },
      {
        "Codigo": "REU",
        "Descripcion": "REINO UNIDO DE GRAN BRETANA E"
      },
      {
        "Codigo": "QAT",
        "Descripcion": "QATAR"
      },
      {
        "Codigo": "PTR",
        "Descripcion": "PUERTO RICO"
      },
      {
        "Codigo": "PRT",
        "Descripcion": "PORTUGAL"
      },
      {
        "Codigo": "POL",
        "Descripcion": "POLONIA"
      },
      {
        "Codigo": "PE",
        "Descripcion": "PERU"
      },
      {
        "Codigo": "PRY",
        "Descripcion": "PARAGUAY"
      },
      {
        "Codigo": "PAN",
        "Descripcion": "PANAMA"
      },
      {
        "Codigo": "PAK",
        "Descripcion": "PAKISTAN"
      },
      {
        "Codigo": "OMN",
        "Descripcion": "OMAN"
      },
      {
        "Codigo": "NZE",
        "Descripcion": "NUEVA ZELANDA"
      },
      {
        "Codigo": "NOR",
        "Descripcion": "NORUEGA"
      },
      {
        "Codigo": "NGA",
        "Descripcion": "NIGERIA"
      },
      {
        "Codigo": "NER",
        "Descripcion": "NIGER"
      },
      {
        "Codigo": "NIC",
        "Descripcion": "NICARAGUA"
      },
      {
        "Codigo": "NPL",
        "Descripcion": "NEPAL"
      },
      {
        "Codigo": "NAM",
        "Descripcion": "NAMIBIA"
      },
      {
        "Codigo": "MOZ",
        "Descripcion": "MOZAMBIQUE"
      },
      {
        "Codigo": "MNG",
        "Descripcion": "MONGOLIA"
      },
      {
        "Codigo": "MDA",
        "Descripcion": "MOLDAVIA"
      },
      {
        "Codigo": "MEX",
        "Descripcion": "MEXICO"
      },
      {
        "Codigo": "MRT",
        "Descripcion": "MAURITANIA"
      },
      {
        "Codigo": "MAR",
        "Descripcion": "MARRUECOS"
      },
      {
        "Codigo": "MLI",
        "Descripcion": "MALI"
      },
      {
        "Codigo": "MDV",
        "Descripcion": "MALDIVAS"
      },
      {
        "Codigo": "MWI",
        "Descripcion": "MALAWI"
      },
      {
        "Codigo": "MYS",
        "Descripcion": "MALASIA"
      },
      {
        "Codigo": "MDG",
        "Descripcion": "MADAGASCAR"
      },
      {
        "Codigo": "MKD",
        "Descripcion": "MACEDONIA"
      },
      {
        "Codigo": "MAC",
        "Descripcion": "MACAO"
      },
      {
        "Codigo": "LUX",
        "Descripcion": "LUXEMBURGO"
      },
      {
        "Codigo": "LTU",
        "Descripcion": "LITUANIA"
      },
      {
        "Codigo": "LIE",
        "Descripcion": "LIECHTENSTEIN"
      },
      {
        "Codigo": "LBY",
        "Descripcion": "LIBIA"
      },
      {
        "Codigo": "LBR",
        "Descripcion": "LIBERIA"
      },
      {
        "Codigo": "LIB",
        "Descripcion": "LIBANO"
      },
      {
        "Codigo": "LET",
        "Descripcion": "LETONIA"
      },
      {
        "Codigo": "LSO",
        "Descripcion": "LESOTHO"
      },
      {
        "Codigo": "LAO",
        "Descripcion": "LAOS"
      },
      {
        "Codigo": "KWT",
        "Descripcion": "KUWAIT"
      },
      {
        "Codigo": "KEN",
        "Descripcion": "KENIA"
      },
      {
        "Codigo": "JOR",
        "Descripcion": "JORDANIA"
      },
      {
        "Codigo": "JPN",
        "Descripcion": "JAPON"
      },
      {
        "Codigo": "JAM",
        "Descripcion": "JAMAICA"
      },
      {
        "Codigo": "ITA",
        "Descripcion": "ITALIA"
      },
      {
        "Codigo": "ISR",
        "Descripcion": "ISRAEL"
      },
      {
        "Codigo": "ISL",
        "Descripcion": "ISLANDIA"
      },
      {
        "Codigo": "IRL",
        "Descripcion": "IRLANDA"
      },
      {
        "Codigo": "IRN",
        "Descripcion": "IRAN"
      },
      {
        "Codigo": "IRQ",
        "Descripcion": "IRAK"
      },
      {
        "Codigo": "ING",
        "Descripcion": "INGLATERRA"
      },
      {
        "Codigo": "IDN",
        "Descripcion": "INDONESIA"
      },
      {
        "Codigo": "IND",
        "Descripcion": "INDIA"
      },
      {
        "Codigo": "HUN",
        "Descripcion": "HUNGRIA"
      },
      {
        "Codigo": "HKG",
        "Descripcion": "HONG KONG"
      },
      {
        "Codigo": "HND",
        "Descripcion": "HONDURAS"
      },
      {
        "Codigo": "HOL",
        "Descripcion": "HOLANDA"
      },
      {
        "Codigo": "HTI",
        "Descripcion": "HAITI"
      },
      {
        "Codigo": "GUY",
        "Descripcion": "GUYANA"
      },
      {
        "Codigo": "GNQ",
        "Descripcion": "GUINEA ECUATORIAL"
      },
      {
        "Codigo": "GNB",
        "Descripcion": "GUINEA BISSAU"
      },
      {
        "Codigo": "GIN",
        "Descripcion": "GUINEA"
      },
      {
        "Codigo": "GTM",
        "Descripcion": "GUATEMALA"
      },
      {
        "Codigo": "GRD",
        "Descripcion": "GRENADA"
      },
      {
        "Codigo": "GRC",
        "Descripcion": "GRECIA"
      },
      {
        "Codigo": "GHA",
        "Descripcion": "GHANA"
      },
      {
        "Codigo": "GEO",
        "Descripcion": "GEORGIA"
      },
      {
        "Codigo": "GMB",
        "Descripcion": "GAMBIA"
      },
      {
        "Codigo": "GAB",
        "Descripcion": "GABON"
      },
      {
        "Codigo": "FRA",
        "Descripcion": "FRANCIA"
      },
      {
        "Codigo": "FIN",
        "Descripcion": "FINLANDIA"
      },
      {
        "Codigo": "PHL",
        "Descripcion": "FILIPINAS"
      },
      {
        "Codigo": "ETH",
        "Descripcion": "ETIOPIA"
      },
      {
        "Codigo": "EST",
        "Descripcion": "ESTONIA"
      },
      {
        "Codigo": "USA",
        "Descripcion": "ESTADOS UNIDOS"
      },
      {
        "Codigo": "ESP",
        "Descripcion": "ESPANA"
      },
      {
        "Codigo": "SVN",
        "Descripcion": "ESLOVENIA"
      },
      {
        "Codigo": "SVK",
        "Descripcion": "ESLOVAQUIA"
      },
      {
        "Codigo": "ARE",
        "Descripcion": "EMIRATOS ARABES UNIDOS"
      },
      {
        "Codigo": "SLV",
        "Descripcion": "EL SALVADOR"
      },
      {
        "Codigo": "EGY",
        "Descripcion": "EGIPTO"
      },
      {
        "Codigo": "ECU",
        "Descripcion": "ECUADOR"
      },
      {
        "Codigo": "DMA",
        "Descripcion": "DOMINICA"
      },
      {
        "Codigo": "DJI",
        "Descripcion": "DJIBOUTI"
      },
      {
        "Codigo": "DNK",
        "Descripcion": "DINAMARCA"
      },
      {
        "Codigo": "CUB",
        "Descripcion": "CUBA"
      },
      {
        "Codigo": "HRV",
        "Descripcion": "CROACIA"
      },
      {
        "Codigo": "CIV",
        "Descripcion": "COTE D´IVOIRE"
      },
      {
        "Codigo": "CRI",
        "Descripcion": "COSTA RICA"
      },
      {
        "Codigo": "CTR",
        "Descripcion": "COSTA RICA"
      },
      {
        "Codigo": "CSU",
        "Descripcion": "COREA DEL SUR"
      },
      {
        "Codigo": "CON",
        "Descripcion": "COREA DEL NORTE"
      },
      {
        "Codigo": "COG",
        "Descripcion": "CONGO"
      },
      {
        "Codigo": "COM",
        "Descripcion": "COMORAS"
      },
      {
        "Codigo": "COL",
        "Descripcion": "COLOMBIA"
      },
      {
        "Codigo": "CYP",
        "Descripcion": "CHIPRE"
      },
      {
        "Codigo": "CHN",
        "Descripcion": "CHINA"
      },
      {
        "Codigo": "CHL",
        "Descripcion": "CHILE"
      },
      {
        "Codigo": "TCD",
        "Descripcion": "CHAD"
      },
      {
        "Codigo": "CAN",
        "Descripcion": "CANADA"
      },
      {
        "Codigo": "CMR",
        "Descripcion": "CAMERUN"
      },
      {
        "Codigo": "KHM",
        "Descripcion": "CAMBOYA"
      },
      {
        "Codigo": "CPV",
        "Descripcion": "CABO VERDE"
      },
      {
        "Codigo": "BDI",
        "Descripcion": "BURUNDI"
      },
      {
        "Codigo": "BFA",
        "Descripcion": "BURKINA FASO"
      },
      {
        "Codigo": "BGR",
        "Descripcion": "BULGARIA"
      },
      {
        "Codigo": "BRN",
        "Descripcion": "BRUNEI"
      },
      {
        "Codigo": "BRA",
        "Descripcion": "BRASIL"
      },
      {
        "Codigo": "BWA",
        "Descripcion": "BOTSWANA"
      },
      {
        "Codigo": "BIH",
        "Descripcion": "BOSNIA HERZEGOVINA"
      },
      {
        "Codigo": "BOL",
        "Descripcion": "BOLIVIA"
      },
      {
        "Codigo": "BLR",
        "Descripcion": "BIELORRUSIA"
      },
      {
        "Codigo": "BTN",
        "Descripcion": "BHUTAN"
      },
      {
        "Codigo": "BEN",
        "Descripcion": "BENIN"
      },
      {
        "Codigo": "BLZ",
        "Descripcion": "BELICE"
      },
      {
        "Codigo": "BEL",
        "Descripcion": "BELGICA"
      },
      {
        "Codigo": "BRB",
        "Descripcion": "BARBADOS"
      },
      {
        "Codigo": "BGD",
        "Descripcion": "BANGLADESH"
      },
      {
        "Codigo": "BHR",
        "Descripcion": "BAHREIN"
      },
      {
        "Codigo": "BHS",
        "Descripcion": "BAHAMAS"
      },
      {
        "Codigo": "AZE",
        "Descripcion": "AZERBAIYAN"
      },
      {
        "Codigo": "AUT",
        "Descripcion": "AUSTRIA"
      },
      {
        "Codigo": "AUS",
        "Descripcion": "AUSTRALIA"
      },
      {
        "Codigo": "ARM",
        "Descripcion": "ARMENIA"
      },
      {
        "Codigo": "ARG",
        "Descripcion": "ARGENTINA"
      },
      {
        "Codigo": "DZA",
        "Descripcion": "ARGELIA"
      },
      {
        "Codigo": "SAU",
        "Descripcion": "ARABIA SAUDITA"
      },
      {
        "Codigo": "ATG",
        "Descripcion": "ANTIGUA Y BARBUDA"
      },
      {
        "Codigo": "AGO",
        "Descripcion": "ANGOLA"
      },
      {
        "Codigo": "DEU",
        "Descripcion": "ALEMANIA"
      },
      {
        "Codigo": "ALB",
        "Descripcion": "ALBANIA"
      },
      {
        "Codigo": "AFG",
        "Descripcion": "AFGANISTAN"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/ubigeo/departamento', function(req, res) {
  res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "1",
        "Descripcion": "AMAZONAS"
      },
      {
        "Codigo": "2",
        "Descripcion": "ANCASH"
      },
      {
        "Codigo": "3",
        "Descripcion": "APURIMAC"
      },
      {
        "Codigo": "4",
        "Descripcion": "AREQUIPA"
      },
      {
        "Codigo": "5",
        "Descripcion": "AYACUCHO"
      },
      {
        "Codigo": "6",
        "Descripcion": "CAJAMARCA"
      },
      {
        "Codigo": "7",
        "Descripcion": "CALLAO"
      },
      {
        "Codigo": "8",
        "Descripcion": "CUSCO"
      },
      {
        "Codigo": "9",
        "Descripcion": "HUANCAVELICA"
      },
      {
        "Codigo": "10",
        "Descripcion": "HUANUCO"
      },
      {
        "Codigo": "11",
        "Descripcion": "ICA"
      },
      {
        "Codigo": "12",
        "Descripcion": "JUNIN"
      },
      {
        "Codigo": "13",
        "Descripcion": "LA LIBERTAD"
      },
      {
        "Codigo": "14",
        "Descripcion": "LAMBAYEQUE"
      },
      {
        "Codigo": "15",
        "Descripcion": "LIMA"
      },
      {
        "Codigo": "16",
        "Descripcion": "LORETO"
      },
      {
        "Codigo": "17",
        "Descripcion": "MADRE DE DIOS"
      },
      {
        "Codigo": "18",
        "Descripcion": "MOQUEGUA"
      },
      {
        "Codigo": "19",
        "Descripcion": "PASCO"
      },
      {
        "Codigo": "20",
        "Descripcion": "PIURA"
      },
      {
        "Codigo": "21",
        "Descripcion": "PUNO"
      },
      {
        "Codigo": "22",
        "Descripcion": "SAN MARTIN"
      },
      {
        "Codigo": "23",
        "Descripcion": "TACNA"
      },
      {
        "Codigo": "24",
        "Descripcion": "TUMBES"
      },
      {
        "Codigo": "25",
        "Descripcion": "UCAYALI"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get('/general/ubigeo/provincia/:departamento', function(req, res) {
  res.json({
    "Message":"",
    "Data":[
    {
    "Codigo":"129",
    "Descripcion":"BARRANCA"
    },
    {
    "Codigo":"132",
    "Descripcion":"CA¿ETE"
    },
    {
    "Codigo":"130",
    "Descripcion":"CAJATAMBO"
    },
    {
    "Codigo":"131",
    "Descripcion":"CANTA"
    },
    {
    "Codigo":"133",
    "Descripcion":"HUARAL"
    },
    {
    "Codigo":"134",
    "Descripcion":"HUAROCHIRI"
    },
    {
    "Codigo":"135",
    "Descripcion":"HUAURA"
    },
    {
    "Codigo":"128",
    "Descripcion":"LIMA"
    },
    {
    "Codigo":"136",
    "Descripcion":"OYON"
    },
    {
    "Codigo":"137",
    "Descripcion":"YAUYOS"
    }
    ],
    "OperationCode":0,
    "TypeMessage":null,
    "Title":null,
    "Icon":null
    });
});

router.get('/general/ubigeo/distrito/:provincia', function(req,res) {
  res.json({
    "Message":"",
    "Data":[
    {
    "Codigo":"2",
    "Descripcion":"ANCON"
    },
    {
    "Codigo":"3",
    "Descripcion":"ATE"
    },
    {
    "Codigo":"4",
    "Descripcion":"BARRANCO"
    },
    {
    "Codigo":"5",
    "Descripcion":"BRE¿A"
    },
    {
    "Codigo":"6",
    "Descripcion":"CARABAYLLO"
    },
    {
    "Codigo":"1",
    "Descripcion":"CERCADO DE LIMA"
    },
    {
    "Codigo":"7",
    "Descripcion":"CHACLACAYO"
    },
    {
    "Codigo":"8",
    "Descripcion":"CHORRILLOS"
    },
    {
    "Codigo":"9",
    "Descripcion":"CIENEGUILLA"
    },
    {
    "Codigo":"10",
    "Descripcion":"COMAS"
    }
    ],
    "OperationCode":0,
    "TypeMessage":null,
    "Title":null,
    "Icon":null
    });
});

router.get("/general/tipodoc/nacional", function(req, res) {
  return res.json({
    "Message":"",
    "Data":[
      {
        "Codigo":"CEX",
        "Descripcion":"CARNET DE EXTRANJERIA"
      },
      {
        "Codigo":"CIP",
        "Descripcion":"CARNET DE IDENTIDAD PERSONAL"
      },
      {
        "Codigo":"DNI",
        "Descripcion":"DOCUMENTO NACIONAL IDENTIDAD"
      },
      {
        "Codigo":"RUC",
        "Descripcion":"REGISTRO UNICO CONTRIBUYENTE"
      }
    ],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
    });
})

router.get("/general/ocupacion", function(req, res) {
  return res.json({
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
    });
});

router.get("/general/domicilio/tipo", function(req, res) {
  return res.json({
    "Message":"",
    "Data":[
    {
    "Codigo":"34",
    "Descripcion":"AA.HH."
    },
    {
    "Codigo":"37",
    "Descripcion":"AGRUPACION"
    },
    {
    "Codigo":"14",
    "Descripcion":"ALAMEDA"
    },
    {
    "Codigo":"38",
    "Descripcion":"AMPLIACION"
    },
    {
    "Codigo":"39",
    "Descripcion":"ANEXO"
    },
    {
    "Codigo":"11",
    "Descripcion":"AUTOPISTA"
    },
    {
    "Codigo":"3",
    "Descripcion":"AV."
    },
    {
    "Codigo":"36",
    "Descripcion":"BARRIO"
    },
    {
    "Codigo":"19",
    "Descripcion":"BLOCK"
    },
    {
    "Codigo":"1",
    "Descripcion":"CALLE"
    },
    {
    "Codigo":"18",
    "Descripcion":"CARRETERA"
    },
    {
    "Codigo":"26",
    "Descripcion":"CASERIO"
    },
    {
    "Codigo":"40",
    "Descripcion":"CENTRO POBLADO"
    },
    {
    "Codigo":"33",
    "Descripcion":"CERRO"
    },
    {
    "Codigo":"32",
    "Descripcion":"COMITE"
    },
    {
    "Codigo":"31",
    "Descripcion":"COMPLEJO"
    },
    {
    "Codigo":"21",
    "Descripcion":"COMUNIDAD"
    },
    {
    "Codigo":"29",
    "Descripcion":"CONDOMINIO"
    },
    {
    "Codigo":"30",
    "Descripcion":"CONJUNTO HABITACIONAL"
    },
    {
    "Codigo":"27",
    "Descripcion":"COOPERATIVA"
    },
    {
    "Codigo":"10",
    "Descripcion":"ESQUINA"
    },
    {
    "Codigo":"12",
    "Descripcion":"JIRON"
    },
    {
    "Codigo":"15",
    "Descripcion":"MALECON"
    },
    {
    "Codigo":"41",
    "Descripcion":"MERCADO"
    },
    {
    "Codigo":"16",
    "Descripcion":"OVALO"
    },
    {
    "Codigo":"17",
    "Descripcion":"PARQUE"
    },
    {
    "Codigo":"13",
    "Descripcion":"PASAJE"
    },
    {
    "Codigo":"2",
    "Descripcion":"PASEO"
    },
    {
    "Codigo":"5",
    "Descripcion":"PLAZA"
    },
    {
    "Codigo":"23",
    "Descripcion":"PROLONG."
    },
    {
    "Codigo":"35",
    "Descripcion":"PUEBLO JOVEN"
    },
    {
    "Codigo":"24",
    "Descripcion":"RESIDENCIAL"
    },
    {
    "Codigo":"9",
    "Descripcion":"SECTOR"
    },
    {
    "Codigo":"20",
    "Descripcion":"UNIDAD VECINAL"
    },
    {
    "Codigo":"28",
    "Descripcion":"VILLA"
    }
    ],
    "OperationCode":200,
    "TypeMessage":"success",
    "Title":"Operación Exitosa",
    "Icon":"glyphicon glyphicon-ok-sign"
    });
});

router.get("/general/domicilio/numeracion", function(req ,res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "4",
        "Descripcion": "BLOCK"
      },
      {
        "Codigo": "6",
        "Descripcion": "CASA"
      },
      {
        "Codigo": "7",
        "Descripcion": "CHALET"
      },
      {
        "Codigo": "5",
        "Descripcion": "EDIFICIO"
      },
      {
        "Codigo": "2",
        "Descripcion": "KM"
      },
      {
        "Codigo": "8",
        "Descripcion": "LOTE"
      },
      {
        "Codigo": "3",
        "Descripcion": "MZ"
      },
      {
        "Codigo": "1",
        "Descripcion": "NRO"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get("/general/domicilio/interior", function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "1",
        "Descripcion": "DPTO"
      },
      {
        "Codigo": "2",
        "Descripcion": "INTERIOR"
      },
      {
        "Codigo": "3",
        "Descripcion": "LOTE"
      },
      {
        "Codigo": "4",
        "Descripcion": "OFICINA"
      },
      {
        "Codigo": "6",
        "Descripcion": "PISO"
      },
      {
        "Codigo": "5",
        "Descripcion": "PUESTO"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get("/general/domicilio/zona", function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "Codigo": "5",
        "Descripcion": "AA.HH"
      },
      {
        "Codigo": "9",
        "Descripcion": "ASOC"
      },
      {
        "Codigo": "12",
        "Descripcion": "COMITE"
      },
      {
        "Codigo": "4",
        "Descripcion": "CONJ.HABIT"
      },
      {
        "Codigo": "6",
        "Descripcion": "COOPERATIVA"
      },
      {
        "Codigo": "2",
        "Descripcion": "PBLO.JOVEN"
      },
      {
        "Codigo": "7",
        "Descripcion": "RESIDENCIAL"
      },
      {
        "Codigo": "11",
        "Descripcion": "SECTOR"
      },
      {
        "Codigo": "3",
        "Descripcion": "UN.VECINAL"
      },
      {
        "Codigo": "1",
        "Descripcion": "URB"
      },
      {
        "Codigo": "10",
        "Descripcion": "ZONA"
      },
      {
        "Codigo": "8",
        "Descripcion": "ZON.INDUSTRIAL"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get("/general/estadocivil", function(req, res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "CodigoEstadoCivil": 2,
        "NombreEstadoCivil": "CASADO"
      },
      {
        "CodigoEstadoCivil": 4,
        "NombreEstadoCivil": "DIVORCIADO"
      },
      {
        "CodigoEstadoCivil": 1,
        "NombreEstadoCivil": "SOLTERO"
      },
      {
        "CodigoEstadoCivil": 3,
        "NombreEstadoCivil": "VIUDO"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});

router.get("/general/tipodoc/vida", function(req,res) {
  return res.json({
    "Message": "",
    "Data": [
      {
        "CodigoTipoDocumento": 3,
        "TipoDocumento": "CEX",
        "NombreTipoDocumento": "CARNET DE EXTRANJERIA"
      },
      {
        "CodigoTipoDocumento": 1,
        "TipoDocumento": "DNI",
        "NombreTipoDocumento": "DOCUMENTO DE IDENTIDAD"
      },
      {
        "CodigoTipoDocumento": 2,
        "TipoDocumento": "RUC",
        "NombreTipoDocumento": "REGISTRO UNICO CONTRIBUYENTE"
      }
    ],
    "OperationCode": 200,
    "TypeMessage": "success"
  });
});
module.exports = router;