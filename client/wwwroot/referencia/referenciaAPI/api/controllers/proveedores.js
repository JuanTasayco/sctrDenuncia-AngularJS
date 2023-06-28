'use strict'

var data = {}

data.proveFilter = [
  {
    id: '1',
    nombre: 'Clínica Limatambo',
    ubigeo: '1501',
    departamento: 'Lima',
    provincia: 'Lima',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.095766',
    longitud: '-77.023340',
    evinculada_ruc: '123456',
    evinculada_codigo: '123456'
  },
  {
    id: '2',
    nombre: 'Clínica Adventista Ana Astahl',
    ubigeo: '1501',
    departamento: 'Lima',
    provincia: 'Lima',
    categoria: 'II - 2',
    entidad: 'Salud con internamiento',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '065-252518',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-3.738677',
    longitud: '-73.241085',
    evinculada_ruc: '123456',
    evinculada_codigo: '123456'
  },
  {
    id: '3',
    nombre: 'CLINICA SAN MARTIN-SERVICIOS MEDICOS LIONEL FLORES',
    ubigeo: '1501',
    departamento: 'Lima',
    provincia: 'Lima',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '042 523680',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-6.617402',
    longitud: '-76.693902',
    evinculada_ruc: '123456',
    evinculada_codigo: '123456'
  },
  {
    id: '4',
    nombre: 'CLINICA DELGADO',
    ubigeo: '1501',
    departamento: 'Lima',
    provincia: 'Lima',
    categoria: 'III - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445',
    evinculada_ruc: '123456',
    evinculada_codigo: '123456'
  },
  {
    id: '5',
    nombre: 'CLINICA SAN PABLO SAC',
    ubigeo: '1501',
    departamento: 'Lima',
    provincia: 'Lima',
    categoria: 'II - 2',
    entidad: 'Primeros Auxilios',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '6103333',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.100111',
    longitud: '-76.971188',
    evinculada_ruc: '123456',
    evinculada_codigo: '123456'
  },
  {
    id: '23',
    nombre: 'Nombre del proveedor 3',
    ubigeo: 'Departamento, Provincia',
    categoria: 'SMA',
    entidad: 'Hospital',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '6',
    nombre: 'Nombre del proveedor 6',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '7',
    nombre: 'Nombre del proveedor 7',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Sin Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '8',
    nombre: 'Nombre del proveedor 8',
    ubigeo: 'Departamento, Provincia',
    categoria: 'II - 1',
    entidad: 'Hospital',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '9',
    nombre: 'Nombre del proveedor 9',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '10',
    nombre: 'Nombre del proveedor 10',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Hospital',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '11',
    nombre: 'Nombre del proveedor 11',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Primeros Auxilios',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '12',
    nombre: 'Nombre del proveedor 12',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Sin Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '13',
    nombre: 'Nombre del proveedor 13',
    ubigeo: 'Departamento, Provincia',
    categoria: 'SMA',
    entidad: 'Hospital',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '14',
    nombre: 'Nombre del proveedor 14',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '15',
    nombre: 'Nombre del proveedor 15',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Primeros Auxilios',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '16',
    nombre: 'Nombre del proveedor 16',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Hospital',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '17',
    nombre: 'Nombre del proveedor 17',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '18',
    nombre: 'Nombre del proveedor 18',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Clinica',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '19',
    nombre: 'Nombre del proveedor 19',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Hospital',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '20',
    nombre: 'Nombre del proveedor 20',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Primeros Auxilios',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '21',
    nombre: 'Nombre del proveedor 21',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Primeros Auxilios',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  },
  {
    id: '22',
    nombre: 'Nombre del proveedor 22',
    ubigeo: 'Departamento, Provincia',
    categoria: 'I - 1',
    entidad: 'Primeros Auxilios',
    categoria_Id: 6,
    entidad_Id: 32,
    convenioStr: 'Con Convenio',
    convenio: 'C',
    direccion_Principal: 'AV. GUARDIA CIVIL Nº 385',
    direccion_Establecimiento: 'av. larco 123',
    telefono_Responsable: '3777000',
    nroCamas: 35,
    nombre_Responsable: 'JAIME PLANAS',
    latitud: '-12.113830',
    longitud: '-77.033445'
  }
];

data.detalles = {
  '1': {
    tab_info_basica: {
      nombre: 'Clínica LimaTambo',
      categoria: 'II - 2',
      institucion: 'Privada',
      clasificacion: 'HOSPITALES O CLINICAS DE ATENCION GENERAL',
      establecimiento: 'CON INTERNAMIENTO',
      director_medico: 'Juan Perez Correa',
      direccion_fiscal: 'AV. ANGAMOS OESTE, CUADRA 4. ESQUINA CON LA CALLE GENERAL BORGOÑO - MIRAFLORES',
      razon_social: 'MEDIC SER SAC',
      representante_legal: 'JAIME PLANAS',
      aforo: 2028,
      direccion_principal: 'AV. ANGAMOS OESTE, CUADRA 4. ESQUINA CON LA CALLE GENERAL BORGOÑO - MIRAFLORES',
      telefono: '3777000',
      email: 'informes@clinicalimatambo.pe',
      horario: 'Lunes a Domingo de 8 AM - 12 PM',
    },
    tab_contacto_referencia: {
      nombre_responsable: 'JAIME PLANAS',
      telefono_responsable: '3777000',
      email_responsable: 'informes@clinicalimatambo.pe'
    },
    tab_localizacion: {
      direccion_establecimiento: 'Av. Rep de Panama Nro. 3606 - lima San Isidro',
      latitud: '-12.095766',
      longitud: '-77.023340'
    },
    tab_servicios: {
      servicios: [
        {
          grupo: 'Hospitalización',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 30}
          ]
        },
        {
          grupo: 'UCI general',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI para adultos',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI pediátrica',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 4}
          ]
        },
        {
          grupo: 'UCI neonatal',
          disponible: 'no',
          items: [
            {nombre: 'N° de Camas', valor: '-'},
            {nombre: 'N° de Ventiladores', valor: '-'}
          ]
        },
        {
          grupo: 'Unidad de ciudados intermedios',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'Centro quirúrgico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Centro obstétrico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Laboratorio clínico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Farmacia',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Banco de sangre',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo I', valor: 'sí'},
            {nombre: 'Tipo II', valor: 'sí'}
          ]
        },
        {
          grupo: 'Imagenología',
          disponible: 'sí',
          items: [
            {nombre: 'Rayos X', valor: 'sí'},
            {nombre: 'Mamografía', valor: 23},
            {nombre: 'Tomografía', valor: 23},
            {nombre: 'Ecografía', valor: 23},
            {nombre: 'Densiometría', valor: 21},
            {nombre: 'Resonancia', valor: 23}
          ]
        },
        {
          grupo: 'Ambulancia',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo 1', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 1},
            {nombre: 'Tipo 2', valor: 'no'},
            {nombre: 'N° de Ambulancia', valor: '-'},
            {nombre: 'Tipo 3', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 2}
          ]
        },
        {
          grupo: 'Emergencias',
          disponible: 'sí',
          items: [
            {nombre: 'Tópicos adultos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos pediátricos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Ginecología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Traumatología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'}
          ]
        }
      ]
    },
    tab_especialidades: {
      medicas: [
        {
          especialidad: 'ANATOMIA PATOLOGICA',
          cantidad: 0,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'CARDIOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ],
      no_medicas: [
        {
          especialidad: 'OTORRINOLARINGOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'OFTALMOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'TRAUMATOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ]
    }
  },
  '2': {
    tab_info_basica: {
      nombre: 'Clínica Adventista Ana Astahl',
      categoria: 'II - 2',
      institucion: 'Privada',
      clasificacion: 'HOSPITALES O CLINICAS DE ATENCION GENERAL',
      establecimiento: 'Anatomía patalógica',
      director_medico: 'Milka Betty Brañez Claudet',
      direccion_fiscal: 'AV. La Marina N° 285, IQUITOS',
      razon_social: 'Clínica Adventista Ana Astahl',
      representante_legal: 'JAIME PLANAS',
      aforo: 587,
      direccion_principal: 'AV. La Marina N° 285, IQUITOS',
      telefono: '065-252518',
      email: 'administracion@caas-peru.org',
      horario: 'Lunes a Domingo de 8 AM - 12 PM',
    },
    tab_contacto_referencia: {
      nombre_responsable: 'Milka Betty Brañez Claudet',
      telefono_responsable: '065-252524',
      email_responsable: 'administracion@caas-peru.org'
    },
    tab_localizacion: {
      direccion_establecimiento: 'AV. La Marina N° 285, IQUITOS',
      latitud: '-3.738677',
      longitud: '-73.241085'
    },
    tab_servicios: {
      servicios: [
        {
          grupo: 'Hospitalización',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 30}
          ]
        },
        {
          grupo: 'UCI general',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI para adultos',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI pediátrica',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 4}
          ]
        },
        {
          grupo: 'UCI neonatal',
          disponible: 'no',
          items: [
            {nombre: 'N° de Camas', valor: '-'},
            {nombre: 'N° de Ventiladores', valor: '-'}
          ]
        },
        {
          grupo: 'Unidad de ciudados intermedios',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'Centro quirúrgico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Centro obstétrico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Laboratorio clínico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Farmacia',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Banco de sangre',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo I', valor: 'sí'},
            {nombre: 'Tipo II', valor: 'sí'}
          ]
        },
        {
          grupo: 'Imagenología',
          disponible: 'sí',
          items: [
            {nombre: 'Rayos X', valor: 'sí'},
            {nombre: 'Mamografía', valor: 23},
            {nombre: 'Tomografía', valor: 23},
            {nombre: 'Ecografía', valor: 23},
            {nombre: 'Densiometría', valor: 21},
            {nombre: 'Resonancia', valor: 23}
          ]
        },
        {
          grupo: 'Ambulancia',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo 1', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 1},
            {nombre: 'Tipo 2', valor: 'no'},
            {nombre: 'N° de Ambulancia', valor: '-'},
            {nombre: 'Tipo 3', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 2}
          ]
        },
        {
          grupo: 'Emergencias',
          disponible: 'sí',
          items: [
            {nombre: 'Tópicos adultos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos pediátricos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Ginecología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Traumatología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'}
          ]
        }
      ]
    },
    tab_especialidades: {
      medicas: [
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 4,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'PROAÑO TATAJE JOSE',
              cmp: '10976',
              rne: '',
              horario: 'Lu a Sab 8 AM A 11 AM //  Lu a Vi 5 A 7:40 PM '
            },
            {
              profesional: 'SALAZAR HERBOZO JOSE',
              cmp: '20576',
              rne: '',
              horario: 'Mi-Sab 9 AM A 12 PM '
            }
          ]
        },
        {
          especialidad: 'GINECOLOGIA',
          cantidad: 3,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'AMAT CHAVEZ JAVIER',
              cmp: '30033',
              rne: '',
              horario: 'Sab 10 AM A 12 PM // Mi 5 A 7:30PM'
            }
          ]
        },
        {
          especialidad: 'CENTRO QUIRÚRGICO Y ANESTESIOLOGÍA-CIRUGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ],
      no_medicas: [
        {
          especialidad: 'PEDIATRÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'DIAGNOSTICO POR IMÁGENES',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'DIÁLISIS',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'FARMACIA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'MEDICINA DE REHABILITACION',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'PATOLOGÍA CLINICA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'CIRUGIAGENERAL',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'OTORRINOLARINGOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'UROLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'TRAUMTATOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'ODONTOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'GASTROENTEROLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'RADIOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'CARDIOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'EMERGENCIA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'HOSPITALIZACION',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'NEUROLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ]
    }
  },
  '3': {
    tab_info_basica: {
      nombre: 'CLINICA SAN MARTIN-SERVICIOS MEDICOS LIONEL FLORES',
      categoria: 'II - 1',
      institucion: 'Privada',
      clasificacion: 'HOSPITALES O CLINICAS DE ATENCION GENERAL',
      establecimiento: 'CON INTERNAMIENTO',
      director_medico: 'ROBERTO DIAZ',
      direccion_fiscal: 'Jr. SAN MARTIN N° 274, TARAPOTO',
      razon_social: 'CLINICA SAN MARTIN-SERVICIOS MEDICOS LIONEL FLORES',
      representante_legal: 'JAIME PLANAS',
      aforo: 800,
      direccion_principal: 'Jr. SAN MARTIN N° 274, TARAPOTO',
      telefono: '042 523680',
      email: 'informes@clinicalimatambo.pe',
      horario: 'Lunes a Domingo de 8 AM - 12 PM',
    },
    tab_contacto_referencia: {
      nombre_responsable: 'JAIME PLANAS',
      telefono_responsable: '042 523680',
      email_responsable: 'informes@clinicasanmartin.pe'
    },
    tab_localizacion: {
      direccion_establecimiento: 'Jr. SAN MARTIN N° 274, TARAPOTO',
      latitud: '-6.617402',
      longitud: '-76.693902'
    },
    tab_servicios: {
      servicios: [
        {
          grupo: 'Hospitalización',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 30}
          ]
        },
        {
          grupo: 'UCI general',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI para adultos',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI pediátrica',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 4}
          ]
        },
        {
          grupo: 'UCI neonatal',
          disponible: 'no',
          items: [
            {nombre: 'N° de Camas', valor: '-'},
            {nombre: 'N° de Ventiladores', valor: '-'}
          ]
        },
        {
          grupo: 'Unidad de ciudados intermedios',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'Centro quirúrgico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Centro obstétrico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Laboratorio clínico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Farmacia',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Banco de sangre',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo I', valor: 'sí'},
            {nombre: 'Tipo II', valor: 'sí'}
          ]
        },
        {
          grupo: 'Imagenología',
          disponible: 'sí',
          items: [
            {nombre: 'Rayos X', valor: 'sí'},
            {nombre: 'Mamografía', valor: 23},
            {nombre: 'Tomografía', valor: 23},
            {nombre: 'Ecografía', valor: 23},
            {nombre: 'Densiometría', valor: 21},
            {nombre: 'Resonancia', valor: 23}
          ]
        },
        {
          grupo: 'Ambulancia',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo 1', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 1},
            {nombre: 'Tipo 2', valor: 'no'},
            {nombre: 'N° de Ambulancia', valor: '-'},
            {nombre: 'Tipo 3', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 2}
          ]
        },
        {
          grupo: 'Emergencias',
          disponible: 'sí',
          items: [
            {nombre: 'Tópicos adultos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos pediátricos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Ginecología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Traumatología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'}
          ]
        }
      ]
    },
    tab_especialidades: {
      medicas: [
        {
          especialidad: 'ANATOMIA PATOLOGICA',
          cantidad: 4,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'AYON DEJO CARMEN',
              cmp: '26026',
              rne: '',
              horario: 'Ma-Vi 4 A 6:30PM '
            },
            {
              profesional: 'BARRERA HURTADO CECILIA',
              cmp: '21380',
              rne: '',
              horario: 'Lu-Mi-Vi 9 AM A 12:30 // Ma-Ju 4 A 7:30PM // Sab 9:30 AM A 12 PM'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'CARDIOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ],
      no_medicas: [
        {
          especialidad: 'OTORRINOLARINGOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'OFTALMOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'TRAUMATOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ]
    }
  },
  '4': {
    tab_info_basica: {
      nombre: 'CLINICA DELGADO',
      categoria: 'III - 1',
      institucion: 'Privada',
      clasificacion: 'HOSPITALES O CLINICAS DE ATENCION GENERAL',
      establecimiento: 'CON INTERNAMIENTO',
      director_medico: 'DR. DOING BERNUY PATRICIO RAFAEL MARTIN',
      direccion_fiscal: 'AV. ANGAMOS OESTE, CUADRA 4. ESQUINA CON LA CALLE GENERAL BORGOÑO - MIRAFLORES',
      razon_social: 'MEDIC SER SAC',
      representante_legal: 'JAIME PLANAS',
      aforo: 2028,
      direccion_principal: 'AV. ANGAMOS OESTE, CUADRA 4. ESQUINA CON LA CALLE GENERAL BORGOÑO - MIRAFLORES',
      telefono: '3777000',
      email: 'informes@clinicalimatambo.pe',
      horario: 'Lunes a Domingo de 8 AM - 12 PM',
    },
    tab_contacto_referencia: {
      nombre_responsable: 'JAIME PLANAS',
      telefono_responsable: '3777000',
      email_responsable: 'informes@clinicadelgado.pe'
    },
    tab_localizacion: {
      direccion_establecimiento: 'AV. ANGAMOS OESTE, CUADRA 4. ESQUINA CON LA CALLE GENERAL BORGOÑO - MIRAFLORES',
      latitud: '-12.113830',
      longitud: '-77.033445'
    },
    tab_servicios: {
      servicios: [
        {
          grupo: 'Hospitalización',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 30}
          ]
        },
        {
          grupo: 'UCI general',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI para adultos',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI pediátrica',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 4}
          ]
        },
        {
          grupo: 'UCI neonatal',
          disponible: 'no',
          items: [
            {nombre: 'N° de Camas', valor: '-'},
            {nombre: 'N° de Ventiladores', valor: '-'}
          ]
        },
        {
          grupo: 'Unidad de ciudados intermedios',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'Centro quirúrgico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Centro obstétrico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Laboratorio clínico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Farmacia',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Banco de sangre',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo I', valor: 'sí'},
            {nombre: 'Tipo II', valor: 'sí'}
          ]
        },
        {
          grupo: 'Imagenología',
          disponible: 'sí',
          items: [
            {nombre: 'Rayos X', valor: 'sí'},
            {nombre: 'Mamografía', valor: 23},
            {nombre: 'Tomografía', valor: 23},
            {nombre: 'Ecografía', valor: 23},
            {nombre: 'Densiometría', valor: 21},
            {nombre: 'Resonancia', valor: 23}
          ]
        },
        {
          grupo: 'Ambulancia',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo 1', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 1},
            {nombre: 'Tipo 2', valor: 'no'},
            {nombre: 'N° de Ambulancia', valor: '-'},
            {nombre: 'Tipo 3', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 2}
          ]
        },
        {
          grupo: 'Emergencias',
          disponible: 'no',
          items: [
            {nombre: 'Aforo', valor: '-'},
            {nombre: 'N° tópicos adultos', valor: '-'},
            {nombre: 'N° tópicos pediatría', valor: '-'},
            {nombre: 'N° tópicos ginecología', valor: '-'}
          ]
        }
      ]
    },
    tab_especialidades: {
      medicas: [
        {
          especialidad: 'ANATOMIA PATOLOGICA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 11,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'PROAÑO TATAJE JOSE',
              cmp: '10976',
              rne: '',
              horario: 'Lu a Sab 8 AM A 11 AM //  Lu a Vi 5 A 7:40 PM '
            },
            {
              profesional: 'SALAZAR HERBOZO JOSE',
              cmp: '20576',
              rne: '',
              horario: 'Mi-Sab 9 AM A 12 PM '
            },
            {
              profesional: 'BOBBIO ROSA MIREYA',
              cmp: '8773',
              rne: '',
              horario: 'Lu a Sab 8 AM A 1PM // Lu aVi 3 A 8PM'
            },
            {
              profesional: 'AMAT CHAVEZ JAVIER',
              cmp: '30033',
              rne: '',
              horario: 'Sab 10 AM A 12 PM // Mi 5 A 7:30PM'
            },
            {
              profesional: 'VERASTEGUI MALDONADO HIPOLITO',
              cmp: '9206',
              rne: '',
              horario: 'Lu a Sab 10 AM A  12:30PM  // Lu a Vi 5 A 7:30PM'
            },
            {
              profesional: 'AYON DEJO CARMEN',
              cmp: '26026',
              rne: '',
              horario: 'Ma-Vi 4 A 6:30PM '
            },
            {
              profesional: 'BARRERA HURTADO CECILIA',
              cmp: '21380',
              rne: '',
              horario: 'Lu-Mi-Vi 9 AM A 12:30 // Ma-Ju 4 A 7:30PM // Sab 9:30 AM A 12 PM'
            },
            {
              profesional: 'HUBY MUÑOZ CINTHIA',
              cmp: '55795',
              rne: '',
              horario: 'Ju 4 A 8PM'
            },
            {
              profesional: 'PEREDA AGUILAR ESTELA ',
              cmp: '19405',
              rne: '',
              horario: 'Lu 4:30 A 7:30 PM // Ma-Ju 10 AM A 1 PM'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'CARDIOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ],
      no_medicas: [
        {
          especialidad: 'OTORRINOLARINGOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'OFTALMOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'TRAUMATOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ]
    }
  },
  '5': {
    tab_info_basica: {
      nombre: 'CLINICA SAN PABLO',
      categoria: 'II - 2',
      institucion: 'Privada',
      clasificacion: 'HOSPITALES O CLINICAS DE ATENCION GENERAL',
      establecimiento: 'CON INTERNAMIENTO',
      director_medico: 'LAVADO ACUÑA WILDER',
      direccion_fiscal: 'AV EL POLO 789 SURCO',
      razon_social: 'CLINICA SAN PABLO SAC',
      representante_legal: 'JAIME PLANAS',
      aforo: 6103333,
      direccion_principal: 'AV EL POLO 789 SURCO',
      telefono: '3777000',
      email: 'informes@clinicasanpablo.pe',
      horario: 'Lunes a Domingo de 8 AM - 12 PM',
    },
    tab_contacto_referencia: {
      nombre_responsable: 'LAVADO ACUÑA WILDER',
      telefono_responsable: '6103333 *1173',
      email_responsable: 'WLAVADO@SANPABLO.COM.PE'
    },
    tab_localizacion: {
      direccion_establecimiento: 'AV EL POLO 789 SURCO',
      latitud: '-12.100111',
      longitud: '-76.971188'
    },
    tab_servicios: {
      servicios: [
        {
          grupo: 'Hospitalización',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 30}
          ]
        },
        {
          grupo: 'UCI general',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI para adultos',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'UCI pediátrica',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 4}
          ]
        },
        {
          grupo: 'UCI neonatal',
          disponible: 'no',
          items: [
            {nombre: 'N° de Camas', valor: '-'},
            {nombre: 'N° de Ventiladores', valor: '-'}
          ]
        },
        {
          grupo: 'Unidad de ciudados intermedios',
          disponible: 'sí',
          items: [
            {nombre: 'Número de camas', valor: 7}
          ]
        },
        {
          grupo: 'Centro quirúrgico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Centro obstétrico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Laboratorio clínico',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Farmacia',
          disponible: 'sí',
          items: []
        },
        {
          grupo: 'Banco de sangre',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo I', valor: 'sí'},
            {nombre: 'Tipo II', valor: 'sí'}
          ]
        },
        {
          grupo: 'Imagenología',
          disponible: 'sí',
          items: [
            {nombre: 'Rayos X', valor: 'sí'},
            {nombre: 'Mamografía', valor: 23},
            {nombre: 'Tomografía', valor: 23},
            {nombre: 'Ecografía', valor: 23},
            {nombre: 'Densiometría', valor: 21},
            {nombre: 'Resonancia', valor: 23}
          ]
        },
        {
          grupo: 'Ambulancia',
          disponible: 'sí',
          items: [
            {nombre: 'Tipo 1', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 1},
            {nombre: 'Tipo 2', valor: 'no'},
            {nombre: 'N° de Ambulancia', valor: '-'},
            {nombre: 'Tipo 3', valor: 'sí'},
            {nombre: 'N° de Ambulancia', valor: 2}
          ]
        },
        {
          grupo: 'Emergencias',
          disponible: 'sí',
          items: [
            {nombre: 'Tópicos adultos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos pediátricos', valor: 'sí'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Ginecología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'},
            {nombre: 'Tópicos de Traumatología', valor: 'no'},
            {nombre: 'N° de unidades', valor: '10'}
          ]
        }
      ]
    },
    tab_especialidades: {
      medicas: [
        {
          especialidad: 'ANATOMIA PATOLOGICA',
          cantidad: 5,
          profesionales: [
            {
              profesional: 'VERASTEGUI MALDONADO HIPOLITO',
              cmp: '9206',
              rne: '',
              horario: 'Lu a Sab 10 AM A  12:30PM  // Lu a Vi 5 A 7:30PM'
            },
            {
              profesional: 'AYON DEJO CARMEN',
              cmp: '26026',
              rne: '',
              horario: 'Ma-Vi 4 A 6:30PM '
            },
            {
              profesional: 'BARRERA HURTADO CECILIA',
              cmp: '21380',
              rne: '',
              horario: 'Lu-Mi-Vi 9 AM A 12:30 // Ma-Ju 4 A 7:30PM // Sab 9:30 AM A 12 PM'
            },
            {
              profesional: 'HUBY MUÑOZ CINTHIA',
              cmp: '55795',
              rne: '',
              horario: 'Ju 4 A 8PM'
            },
            {
              profesional: 'PEREDA AGUILAR ESTELA ',
              cmp: '19405',
              rne: '',
              horario: 'Lu 4:30 A 7:30 PM // Ma-Ju 10 AM A 1 PM'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'MEDICINA INTERNA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'CARDIOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ],
      no_medicas: [
        {
          especialidad: 'OTORRINOLARINGOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'OFTALMOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        },
        {
          especialidad: 'TRAUMATOLOGÍA',
          cantidad: 2,
          profesionales: [
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            },
            {
              profesional: 'Dr. Dyer Velarde - Alvarez, Richard Rodrigo',
              cmp: '17738',
              rne: '1942',
              horario: 'SIN PROGRAMACION'
            }
          ]
        }
      ]
    }
  }
}

module.exports = data
