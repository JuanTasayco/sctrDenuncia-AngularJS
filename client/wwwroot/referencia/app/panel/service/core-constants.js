'use strict';
define([], function() {
  return {
    operationCode: {
      success: 200
    },
    order: [
      { id: 'A', nombre: 'Ascendente' },
      { id: 'D', nombre: 'Descendente' }
    ],
    atributos: [
      { id: 'attr', nombre: 'atributos' },
      { id: 'name', nombre: 'nombre' }
    ],
    convenios: [
      { id: 'C', nombre: 'Con Convenio' },
      { id: 'S', nombre: 'Sin Convenio' }
    ],
    companias: [
      { id: 3, nombre: 'MAPFRE PERU S.A. EPS' },
      { id: 1, nombre: 'MAPFRE PERU' }
    ],
    productos: [
      { id: 'S', nombre: 'Salud regular' },
      { id: 'R', nombre: 'SCTR' },
      { id: 'J', nombre: 'AAMM personas jurídicas' },
      { id: 'N', nombre: 'AAMM personas naturales' }
    ],
    parentescos: [
      { id: 'T', nombre: 'Titular' },
      { id: 'D', nombre: 'Dependiente' }
    ],
    tipoRef: [
      { id: '1', nombre: 'Emergencia' },
      { id: '2', nombre: 'Hospitalización' },
      { id: '3', nombre: 'Interconsulta' },
      { id: '4', nombre: 'Lab/Imágenes' }
    ],
    resueltoDest: [
      {id: '1', nombre: 'En departamento de origen'},
      {id: '0', nombre: 'Fuera del departamento de origen'}
    ],
    departamentos: [
      { id: '01', nombre: 'Amazonas' },
      { id: '02', nombre: 'Ancash' },
      { id: '03', nombre: 'Apurímac' },
      { id: '04', nombre: 'Arequipa' },
      { id: '05', nombre: 'Ayacucho' },
      { id: '06', nombre: 'Cajamarca' },
      { id: '08', nombre: 'Cusco' },
      { id: '09', nombre: 'Huancavelica' },
      { id: '10', nombre: 'Huánuco' },
      { id: '11', nombre: 'Ica' },
      { id: '12', nombre: 'Junín' },
      { id: '13', nombre: 'La Libertad' },
      { id: '14', nombre: 'Lambayeque' },
      { id: '15', nombre: 'Lima' },
      { id: '16', nombre: 'Loreto'},
      { id: '17', nombre: 'Madre de Dios'},
      { id: '18', nombre: 'Moquegua'},
      { id: '19', nombre: 'Pasco'},
      { id: '20', nombre: 'Piura'},
      { id: '21', nombre: 'Puno'},
      { id: '22', nombre: 'San Martín'},
      { id: '23', nombre: 'Tacna'},
      { id: '24', nombre: 'Tumbes'},
      { id: '25', nombre: 'Ucayali'}
    ],
    provincias: {
      '01': [
        { id: '0101', nombre: 'Chachapoyas' },
        { id: '0102', nombre: 'Bagua' },
        { id: '0103', nombre: 'Bongará' },
        { id: '0104', nombre: 'Condorcanqui' },
        { id: '0105', nombre: 'Luya' },
        { id: '0106', nombre: 'Rodríguez de Mendoza' },
        { id: '0107', nombre: 'Utcubamba' }
      ],
      '02': [
        { id: '0201', nombre: 'Huaraz' },
        { id: '0202', nombre: 'Aija' },
        { id: '0203', nombre: 'Antonio Raymondi' },
        { id: '0204', nombre: 'Asunción' },
        { id: '0205', nombre: 'Bolognesi' },
        { id: '0206', nombre: 'Carhuaz' },
        { id: '0207', nombre: 'Carlos Fermín Fitzcarrald' },
        { id: '0208', nombre: 'Casma' },
        { id: '0209', nombre: 'Corongo' },
        { id: '0210', nombre: 'Huari' },
        { id: '0211', nombre: 'Huarmey' },
        { id: '0212', nombre: 'Huaylas' },
        { id: '0213', nombre: 'Mariscal Luzuriaga' },
        { id: '0214', nombre: 'Ocros' },
        { id: '0215', nombre: 'Pallasca' },
        { id: '0216', nombre: 'Pomabamba' },
        { id: '0217', nombre: 'Recuay' },
        { id: '0218', nombre: 'Santa' },
        { id: '0219', nombre: 'Sihuas' },
        { id: '0220', nombre: 'Yungay' }
      ],
      '03': [
        { id: '0301', nombre: 'Abancay' },
        { id: '0302', nombre: 'Andahuaylas' },
        { id: '0303', nombre: 'Antabamba' },
        { id: '0304', nombre: 'Aymaraes' },
        { id: '0305', nombre: 'Cotabambas' },
        { id: '0306', nombre: 'Chincheros' },
        { id: '0307', nombre: 'Grau' }
      ],
      '04': [
        { id: '0401', nombre: 'Arequipa' },
        { id: '0402', nombre: 'Camaná' },
        { id: '0403', nombre: 'Caravelí' },
        { id: '0404', nombre: 'Castilla' },
        { id: '0405', nombre: 'Caylloma' },
        { id: '0406', nombre: 'Condesuyos' },
        { id: '0407', nombre: 'Islay' },
        { id: '0408', nombre: 'La Unión' }
      ],
      '05': [
        { id: '0501', nombre: 'Huamanga' },
        { id: '0502', nombre: 'Cangallo' },
        { id: '0503', nombre: 'Huanca Sancos' },
        { id: '0504', nombre: 'Huanta' },
        { id: '0505', nombre: 'La Mar' },
        { id: '0506', nombre: 'Lucanas' },
        { id: '0507', nombre: 'Parinacochas' },
        { id: '0508', nombre: 'Páucar del Sara Sara' },
        { id: '0509', nombre: 'Sucre' },
        { id: '0510', nombre: 'Víctor Fajardo' },
        { id: '0511', nombre: 'Vilcas Huamán' }
      ],
      '06': [
        { id: '0601', nombre: 'Cajamarca' },
        { id: '0602', nombre: 'Cajabamba' },
        { id: '0603', nombre: 'Celendín' },
        { id: '0604', nombre: 'Chota' },
        { id: '0605', nombre: 'Contumazá' },
        { id: '0606', nombre: 'Cutervo' },
        { id: '0607', nombre: 'Hualgayoc' },
        { id: '0608', nombre: 'Jaén' },
        { id: '0609', nombre: 'San Ignacio' },
        { id: '0610', nombre: 'San Marcos' },
        { id: '0611', nombre: 'San Miguel' },
        { id: '0612', nombre: 'San Pablo' },
        { id: '0613', nombre: 'Santa Cruz' }
      ],
      '08': [
        { id: '0801', nombre: 'Cusco' },
        { id: '0802', nombre: 'Acomayo' },
        { id: '0803', nombre: 'Anta' },
        { id: '0804', nombre: 'Calca' },
        { id: '0805', nombre: 'Canas' },
        { id: '0806', nombre: 'Canchis' },
        { id: '0807', nombre: 'Chumbivilcas' },
        { id: '0808', nombre: 'Espinar' },
        { id: '0809', nombre: 'La Convención' },
        { id: '0810', nombre: 'Paruro' },
        { id: '0811', nombre: 'Paucartambo' },
        { id: '0812', nombre: 'Quispicanchi' },
        { id: '0813', nombre: 'Urubamba' }
      ],
      '09': [
        { id: '0901', nombre: 'Huancavelica' },
        { id: '0902', nombre: 'Acobamba' },
        { id: '0903', nombre: 'Angaraes' },
        { id: '0904', nombre: 'Castrovirreyna' },
        { id: '0905', nombre: 'Churcampa' },
        { id: '0906', nombre: 'Huaytará' },
        { id: '0907', nombre: 'Tayacaja' }
      ],
      '10': [
        { id: '1001', nombre: 'Huánuco' },
        { id: '1002', nombre: 'Ambo' },
        { id: '1003', nombre: 'Dos de Mayo' },
        { id: '1004', nombre: 'Huacaybamba' },
        { id: '1005', nombre: 'Huamalíes' },
        { id: '1006', nombre: 'Leoncio Prado' },
        { id: '1007', nombre: 'Marañón' },
        { id: '1008', nombre: 'Pachitea' },
        { id: '1009', nombre: 'Puerto Inca' },
        { id: '1010', nombre: 'Lauricocha' },
        { id: '1011', nombre: 'Yarowilca' }
      ],
      '11': [
        { id: '1101', nombre: 'Ica' },
        { id: '1102', nombre: 'Chincha' },
        { id: '1103', nombre: 'Nasca' },
        { id: '1104', nombre: 'Palpa' },
        { id: '1105', nombre: 'Pisco' }
      ],
      '12': [
        { id: '1201', nombre: 'Huancayo' },
        { id: '1202', nombre: 'Concepción' },
        { id: '1203', nombre: 'Chanchamayo' },
        { id: '1204', nombre: 'Jauja' },
        { id: '1205', nombre: 'Junín' },
        { id: '1206', nombre: 'Satipo' },
        { id: '1207', nombre: 'Tarma' },
        { id: '1208', nombre: 'Yauli' },
        { id: '1209', nombre: 'Chupaca' }
      ],
      '13': [
        { id: '1301', nombre: 'Trujillo' },
        { id: '1302', nombre: 'Ascope' },
        { id: '1303', nombre: 'Bolívar' },
        { id: '1304', nombre: 'Chepén' },
        { id: '1305', nombre: 'Julcán' },
        { id: '1306', nombre: 'Otuzco' },
        { id: '1307', nombre: 'Pacasmayo' },
        { id: '1308', nombre: 'Pataz' },
        { id: '1309', nombre: 'Sánchez Carrión' },
        { id: '1310', nombre: 'Santiago de Chuco' },
        { id: '1311', nombre: 'Gran Chimú' },
        { id: '1312', nombre: 'Virú' }
      ],
      '14': [
        { id: '1401', nombre: 'Chiclayo' },
        { id: '1402', nombre: 'Ferreñafe' },
        { id: '1403', nombre: 'Lambayeque' }
      ],
      '15': [
        { id: '1501', nombre: 'Lima' },
        { id: '1502', nombre: 'Barranca' },
        { id: '1503', nombre: 'Cajatambo' },
        { id: '1504', nombre: 'Canta' },
        { id: '1505', nombre: 'Cañete' },
        { id: '1506', nombre: 'Huaral' },
        { id: '1507', nombre: 'Huarochirí' },
        { id: '1508', nombre: 'Huaura' },
        { id: '1509', nombre: 'Oyón' },
        { id: '1510', nombre: 'Yauyos' },
        { id: '07', nombre: 'Callao' }
      ],
      '16': [
        { id: '1601', nombre: 'Maynas' },
        { id: '1602', nombre: 'Alto Amazonas' },
        { id: '1603', nombre: 'Loreto' },
        { id: '1604', nombre: 'Mariscal Ramón Castilla' },
        { id: '1605', nombre: 'Requena' },
        { id: '1606', nombre: 'Ucayali' },
        { id: '1607', nombre: 'Datem del Marañón' },
        { id: '1608', nombre: 'Putumayo' }
      ],
      '17': [
        { id: '1701', nombre: 'Tambopata' },
        { id: '1702', nombre: 'Manu' },
        { id: '1703', nombre: 'Tahuamanu' }
      ],
      '18': [
        { id: '1801', nombre: 'Mariscal Nieto' },
        { id: '1802', nombre: 'General Sánchez Cerro' },
        { id: '1803', nombre: 'Ilo' }
      ],
      '19': [
        { id: '1901', nombre: 'Pasco' },
        { id: '1902', nombre: 'Daniel Alcides Carrión' },
        { id: '1903', nombre: 'Oxapampa' }
      ],
      '20': [
        { id: '2001', nombre: 'Piura' },
        { id: '2002', nombre: 'Ayabaca' },
        { id: '2003', nombre: 'Huancabamba' },
        { id: '2004', nombre: 'Morropón' },
        { id: '2005', nombre: 'Paita' },
        { id: '2006', nombre: 'Sullana' },
        { id: '2007', nombre: 'Talara' },
        { id: '2008', nombre: 'Sechura' }
      ],
      '21': [
        { id: '2101', nombre: 'Puno' },
        { id: '2102', nombre: 'Azángaro' },
        { id: '2103', nombre: 'Carabaya' },
        { id: '2104', nombre: 'Chucuito' },
        { id: '2105', nombre: 'El Collao' },
        { id: '2106', nombre: 'Huancané' },
        { id: '2107', nombre: 'Lampa' },
        { id: '2108', nombre: 'Melgar' },
        { id: '2109', nombre: 'Moho' },
        { id: '2110', nombre: 'San Antonio de Putina' },
        { id: '2111', nombre: 'San Román' },
        { id: '2112', nombre: 'Sandia' },
        { id: '2113', nombre: 'Yunguyo' }
      ],
      '22': [
        { id: '2201', nombre: 'Moyobamba' },
        { id: '2202', nombre: 'Bellavista' },
        { id: '2203', nombre: 'El Dorado ' },
        { id: '2204', nombre: 'Huallaga' },
        { id: '2205', nombre: 'Lamas' },
        { id: '2206', nombre: 'Mariscal Cáceres' },
        { id: '2207', nombre: 'Picota' },
        { id: '2208', nombre: 'Rioja' },
        { id: '2209', nombre: 'San Martín' },
        { id: '2210', nombre: 'Tocache' }
      ],
      '23': [
        { id: '2301', nombre: 'Tacna' },
        { id: '2302', nombre: 'Candarave' },
        { id: '2303', nombre: 'Jorge Basadre' },
        { id: '2304', nombre: 'Tarata' }
      ],
      '24': [
        { id: '2401', nombre: 'Tumbes' },
        { id: '2402', nombre: 'Contralmirante Villar' },
        { id: '2403', nombre: 'Zarumilla' }
      ],
      '25': [
        { id: '2501', nombre: 'Coronel Portillo' },
        { id: '2502', nombre: 'Atalaya' },
        { id: '2503', nombre: 'Padre Abad' },
        { id: '2504', nombre: 'Purús' }
      ]
    }
  };
});
