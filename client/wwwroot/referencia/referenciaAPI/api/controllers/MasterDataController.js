/**
 * MasterDataController
 *
 * @description :: Server-side logic for managing Masterdatas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  all: function(req, res) {

    var data = {
      'categorias': {
        'filtros': [
          {
            'nombre': 'I-1',
            'id': 1
          },
          {
            'nombre': 'I-2',
            'id': 2
          },
          {
            'nombre': 'I-3',
            'id': 3
          },
          {
            'nombre': 'I-4',
            'id': 4
          },
          {
            'nombre': 'II-1',
            'id': 5
          },
          {
            'nombre': 'II-2',
            'id': 6
          },
          {
            'nombre': 'II-E',
            'id': 7
          },
          {
            'nombre': 'III-1',
            'id': 8
          },
          {
            'nombre': 'III-2',
            'id': 9
          },
          {
            'nombre': 'III-E',
            'id': 10
          },
          {
            'nombre': 'SIN CATEGORIA',
            'id': 11
          }
        ]
      },
      'entidades': {
        'filtros': [
          {
            'nombre': 'ANATOMIA PATOLOGICA',
            'id': 1
          },
          {
            'nombre': 'ATENCION DOMICILIARIA',
            'id': 2
          },
          {
            'nombre': 'ATENCION PRE HOSPITALARIA',
            'id': 3
          },
          {
            'nombre': 'CENTRO ODONTOLOGICO',
            'id': 4
          },
          {
            'nombre': 'CENTROS DE ATENCION GERIATRICA',
            'id': 5
          },
          {
            'nombre': 'CENTROS DE ATENCION PARA DEPENDIENTES A SUSTANCIAS PSICOACTIVAS Y OTRAS DEPENDENCIAS',
            'id': 6
          },
          {
            'nombre': 'CENTROS DE MEDICINA ALTERNATIVA',
            'id': 7
          },
          {
            'nombre': 'CENTROS DE SALUD CON CAMAS DE INTERNAMIENTO',
            'id': 8
          },
          {
            'nombre': 'CENTROS DE SALUD O CENTROS MEDICOS',
            'id': 9
          },
          {
            'nombre': 'CENTROS DE VACUNACION',
            'id': 10
          },
          {
            'nombre': 'CENTROS DE VACUNACION | ATENCION DOMICILIARIA',
            'id': 11
          },
          {
            'nombre': 'CENTROS MEDICOS ESPECIALIZADOS',
            'id': 12
          },
          {
            'nombre': 'CENTROS OPTICOS',
            'id': 13
          },
          {
            'nombre': 'COLPOSCOPIAS',
            'id': 14
          },
          {
            'nombre': 'CONSULTORIOS MEDICOS Y DE OTROS PROFESIONALES DE LA SALUD',
            'id': 15
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES',
            'id': 16
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | ATENCION DOMICILIARIA',
            'id': 17
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | ATENCION DOMICILIARIA | ATENCION PRE HOSPITALARIA',
            'id': 18
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | CENTROS DE MEDICINA ALTERNATIVA',
            'id': 19
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | CENTROS OPTICOS',
            'id': 20
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | ENDOSCOPIAS | COLPOSCOPIAS',
            'id': 21
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | LABORATORIOS DE PROTESIS DENTAL',
            'id': 22
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | MEDICINA FISICA | REHABILITACION',
            'id': 23
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | MEDICINA NUCLEAR',
            'id': 24
          },
          {
            'nombre': 'DIAGNOSTICO POR IMAGENES | MEDICINA NUCLEAR | RADIOTERAPIA | MEDICINA HIPERBARICA',
            'id': 25
          },
          {
            'nombre': 'ENDOSCOPIAS',
            'id': 26
          },
          {
            'nombre': 'ESTABLECIMIENTOS DE RECUPERACION O REPOSO',
            'id': 27
          },
          {
            'nombre': 'ESTABLECIMIENTOS DE RECUPERACION O REPOSO | ATENCION DOMICILIARIA',
            'id': 28
          },
          {
            'nombre': 'ESTABLECIMIENTOS DE RECUPERACION O REPOSO | CENTROS DE ATENCION PARA DEPENDIENTES A SUSTANCIAS PSICOACTIVAS Y OTRAS DEPENDENCIAS',
            'id': 29
          },
          {
            'nombre': 'HEMODIALISIS',
            'id': 30
          },
          {
            'nombre': 'HOSPITALES O CLINICAS DE ATENCION ESPECIALIZADA',
            'id': 31
          },
          {
            'nombre': 'HOSPITALES O CLINICAS DE ATENCION GENERAL',
            'id': 32
          },
          {
            'nombre': 'INSTITUTOS DE SALUD ESPECIALIZADOS',
            'id': 33
          },
          {
            'nombre': 'LABORATORIOS DE PROTESIS DENTAL',
            'id': 34
          },
          {
            'nombre': 'LITOTRIPSIA',
            'id': 35
          },
          {
            'nombre': 'MEDICINA FISICA',
            'id': 36
          },
          {
            'nombre': 'MEDICINA FISICA | REHABILITACION',
            'id': 37
          },
          {
            'nombre': 'MEDICINA FISICA | REHABILITACION | ORTOPEDIAS Y SERVICIOS DE PODOLOGIA',
            'id': 38
          },
          {
            'nombre': 'MEDICINA FISICA | REHABILITACION | ORTOPEDIAS Y SERVICIOS DE PODOLOGIA | ATENCION DOMICILIARIA',
            'id': 39
          },
          {
            'nombre': 'MEDICINA HIPERBARICA',
            'id': 40
          },
          {
            'nombre': 'MEDICINA NUCLEAR',
            'id': 41
          },
          {
            'nombre': 'ORTOPEDIAS Y SERVICIOS DE PODOLOGIA',
            'id': 42
          },
          {
            'nombre': 'PATOLOGIA CLINICA',
            'id': 43
          },
          {
            'nombre': 'PATOLOGIA CLINICA | ANATOMIA PATOLOGICA',
            'id': 44
          },
          {
            'nombre': 'PATOLOGIA CLINICA | ANATOMIA PATOLOGICA | CENTROS DE VACUNACION',
            'id': 45
          },
          {
            'nombre': 'PATOLOGIA CLINICA | ATENCION DOMICILIARIA',
            'id': 46
          },
          {
            'nombre': 'PATOLOGIA CLINICA | CENTROS DE VACUNACION',
            'id': 47
          },
          {
            'nombre': 'PATOLOGIA CLINICA | DIAGNOSTICO POR IMAGENES',
            'id': 48
          },
          {
            'nombre': 'PATOLOGIA CLINICA | DIAGNOSTICO POR IMAGENES | MEDICINA FISICA | SERVICIO DE TRASLADO DE PACIENTES',
            'id': 49
          },
          {
            'nombre': 'PATOLOGIA CLINICA | DIAGNOSTICO POR IMAGENES | RADIOTERAPIA',
            'id': 50
          },
          {
            'nombre': 'PATOLOGIA CLINICA | HEMODIALISIS',
            'id': 51
          },
          {
            'nombre': 'PATOLOGIA CLINICA | MEDICINA FISICA | REHABILITACION',
            'id': 52
          },
          {
            'nombre': 'PATOLOGIA CLINICA | REHABILITACION',
            'id': 53
          },
          {
            'nombre': 'POLICLINICOS',
            'id': 54
          },
          {
            'nombre': 'PUESTOS DE SALUD O POSTAS DE SALUD',
            'id': 55
          },
          {
            'nombre': 'RADIOTERAPIA',
            'id': 56
          },
          {
            'nombre': 'REHABILITACION',
            'id': 57
          },
          {
            'nombre': 'REHABILITACION | ATENCION DOMICILIARIA',
            'id': 58
          },
          {
            'nombre': 'REHABILITACION | CENTROS DE MEDICINA ALTERNATIVA',
            'id': 59
          },
          {
            'nombre': 'REHABILITACION | ESTABLECIMIENTOS DE RECUPERACION O REPOSO',
            'id': 60
          },
          {
            'nombre': 'REHABILITACION | ORTOPEDIAS Y SERVICIOS DE PODOLOGIA',
            'id': 61
          },
          {
            'nombre': 'SERVICIO DE TRASLADO DE PACIENTES',
            'id': 62
          },
          {
            'nombre': 'SERVICIO DE TRASLADO DE PACIENTES | ATENCION DOMICILIARIA',
            'id': 63
          },
          {
            'nombre': 'SERVICIO DE TRASLADO DE PACIENTES | ATENCION DOMICILIARIA | ATENCION PRE HOSPITALARIA',
            'id': 64
          },
          {
            'nombre': 'SERVICIO DE TRASLADO DE PACIENTES | ATENCION PRE HOSPITALARIA',
            'id': 65
          },
          {
            'nombre': 'SERVICIO DE TRASLADO DE PACIENTES | ESTABLECIMIENTOS DE RECUPERACION O REPOSO | ORTOPEDIAS Y SERVICIOS DE PODOLOGIA',
            'id': 66
          }
        ]
      },
      'servicios': {
        'filtros': [
          {
            'nombre': 'Banco de sangre',
            'id': 47
          },
          {
            'nombre': 'Centro Obstetrico',
            'id': 37
          },
          {
            'nombre': 'Centro Quirúrgico',
            'id': 36
          },
          {
            'nombre': 'FARMACIA',
            'id': 46
          },
          {
            'nombre': 'HOSPITALIZACIÓN',
            'id': 23
          },
          {
            'nombre': 'LABORATORIO CLINICO',
            'id': 38
          },
          {
            'nombre': 'UCI GENERAL',
            'id': 25
          },
          {
            'nombre': 'UCI NEONATAL',
            'id': 31
          },
          {
            'nombre': 'UCI PARA ADULTOS',
            'id': 27
          },
          {
            'nombre': 'UCI PEDIATRICA',
            'id': 29
          },
          {
            'nombre': 'UNIDAD DE CUIDADOS INTENSIVOS',
            'id': 34
          }
        ]
      },
      'imagenologias': {
        'filtros': [
          {
            'nombre': 'Densidometría osea',
            'id': 43
          },
          {
            'nombre': 'Ecografía',
            'id': 41
          },
          {
            'nombre': 'Mamografía',
            'id': 42
          },
          {
            'nombre': 'Rayos X',
            'id': 40
          },
          {
            'nombre': 'Resonancia',
            'id': 45
          },
          {
            'nombre': 'Tomografía',
            'id': 44
          }
        ]
      },
      'emergencias': {
        'filtros': [
          {
            'nombre': 'N° tópicos adultos',
            'id': 59
          },
          {
            'nombre': 'N° tópicos ginecología',
            'id': 61
          },
          {
            'nombre': 'N° tópicos pediatría',
            'id': 60
          }
        ]
      },
      'ambulancias': {
        'filtros': [
          {
            'nombre': 'Tipo I',
            'id': 51
          },
          {
            'nombre': 'Tipo II',
            'id': 53
          },
          {
            'nombre': 'Tipo III',
            'id': 55
          }
        ]
      },
      'especialidades': {
        'filtros': [
          {
            'nombre': 'ANESTESIOLOGIA Y ANALGESIA',
            'id': 0
          },
          {
            'nombre': 'CARDIOLOGIA',
            'id': 8
          },
          {
            'nombre': 'CIRUGIA CARDIOVASCULAR',
            'id': 0
          },
          {
            'nombre': 'CIRUGIA GENERAL',
            'id': 9
          },
          {
            'nombre': 'CIRUGIA GENERAL Y ONCOLOGICA',
            'id': 57
          },
          {
            'nombre': 'CIRUGIA PLASTICA Y REPARADORA',
            'id': 12
          },
          {
            'nombre': 'DERMATOLOGIA',
            'id': 13
          },
          {
            'nombre': 'ENDOCRINOLOGIA',
            'id': 14
          },
          {
            'nombre': 'GASTROENTEROLOGIA',
            'id': 20
          },
          {
            'nombre': 'GERIATRIA',
            'id': 22
          },
          {
            'nombre': 'GINECOLOGIA Y OBSTETRICIA',
            'id': 21
          },
          {
            'nombre': 'HEMATOLOGIA',
            'id': 24
          },
          {
            'nombre': 'LABORATORIO CLINICO Y ANATOMIA PATOLOGICA',
            'id': 79
          },
          {
            'nombre': 'MEDICINA FISICA Y REHABILITACION',
            'id': 31
          },
          {
            'nombre': 'MEDICINA GENERAL',
            'id': 0
          },
          {
            'nombre': 'MEDICINA GENERAL Y ONCOLOGICA',
            'id': 58
          },
          {
            'nombre': 'MEDICINA INTERNA',
            'id': 29
          },
          {
            'nombre': 'MEDICO CIRUJANO - ONCOLOGO',
            'id': 0
          },
          {
            'nombre': 'MEDICO INTERNISTA',
            'id': 5
          },
          {
            'nombre': 'NEONATOLOGIA',
            'id': 55
          },
          {
            'nombre': 'NEUMOLOGIA',
            'id': 34
          },
          {
            'nombre': 'NEUROCIRUGIA',
            'id': 35
          },
          {
            'nombre': 'NUTRICION Y DIETETICA',
            'id': 0
          },
          {
            'nombre': 'ODONTOLOGIA',
            'id': 100
          },
          {
            'nombre': 'OFTALMOLOGIA',
            'id': 38
          },
          {
            'nombre': 'ONCOLOGIA MEDICA',
            'id': 39
          },
          {
            'nombre': 'ORTOPEDIA Y TRAUMATOLOGIA',
            'id': 41
          },
          {
            'nombre': 'OTORRINOLARINGOLOGIA',
            'id': 42
          },
          {
            'nombre': 'PATOLOGIA CLINICA',
            'id': 43
          },
          {
            'nombre': 'PEDIATRA',
            'id': 0
          },
          {
            'nombre': 'PEDIATRIA',
            'id': 44
          },
          {
            'nombre': 'PSICOLOGIA',
            'id': 92
          },
          {
            'nombre': 'PSIQUIATRIA',
            'id': 45
          },
          {
            'nombre': 'RADIOLOGIA',
            'id': 46
          },
          {
            'nombre': 'RADIOTERAPIA',
            'id': 47
          },
          {
            'nombre': 'SERV MED FISICA Y REHABILITACION',
            'id': 3
          },
          {
            'nombre': 'TRAUMATOLOGÍA',
            'id': 54
          },
          {
            'nombre': 'UROLOGIA',
            'id': 50
          }
        ]
      },
      'plantillas': {
        'filtros': [
          {
            'id': 22,
            'nombre': 'SERVICIOS'
          },
          {
            'id': 23,
            'nombre': 'HOSPITALIZACIÓN'
          },
          {
            'id': 24,
            'nombre': 'N° de Camas'
          },
          {
            'id': 25,
            'nombre': 'UCI GENERAL'
          },
          {
            'id': 26,
            'nombre': 'N° de Camas'
          },
          {
            'id': 27,
            'nombre': 'UCI PARA ADULTOS'
          },
          {
            'id': 28,
            'nombre': 'N° de Camas'
          },
          {
            'id': 29,
            'nombre': 'UCI PEDIATRICA'
          },
          {
            'id': 30,
            'nombre': 'N° de Camas'
          },
          {
            'id': 31,
            'nombre': 'UCI NEONATAL'
          },
          {
            'id': 32,
            'nombre': 'N° de Camas'
          },
          {
            'id': 33,
            'nombre': 'N° de Ventiladores'
          },
          {
            'id': 34,
            'nombre': 'UNIDAD DE CUIDADOS INTENSIVOS'
          },
          {
            'id': 35,
            'nombre': 'N° de Camas'
          },
          {
            'id': 36,
            'nombre': 'Centro Quirúrgico'
          },
          {
            'id': 37,
            'nombre': 'Centro Obstetrico'
          },
          {
            'id': 38,
            'nombre': 'LABORATORIO CLINICO'
          },
          {
            'id': 39,
            'nombre': 'IMAGEN'
          },
          {
            'id': 40,
            'nombre': 'Rayos X'
          },
          {
            'id': 41,
            'nombre': 'Ecografía'
          },
          {
            'id': 42,
            'nombre': 'Mamografía'
          },
          {
            'id': 43,
            'nombre': 'Densidometría osea'
          },
          {
            'id': 44,
            'nombre': 'Tomografía'
          },
          {
            'id': 45,
            'nombre': 'Resonancia'
          },
          {
            'id': 46,
            'nombre': 'FARMACIA'
          },
          {
            'id': 47,
            'nombre': 'BANCO DE SANGRE'
          },
          {
            'id': 48,
            'nombre': 'Tipo I'
          },
          {
            'id': 49,
            'nombre': 'Tipo II'
          },
          {
            'id': 50,
            'nombre': 'AMBULANCIA'
          },
          {
            'id': 51,
            'nombre': 'Tipo I'
          },
          {
            'id': 52,
            'nombre': 'N° de Ambulancia'
          },
          {
            'id': 53,
            'nombre': 'Tipo II'
          },
          {
            'id': 54,
            'nombre': 'N° de Ambulancia'
          },
          {
            'id': 55,
            'nombre': 'Tipo III'
          },
          {
            'id': 56,
            'nombre': 'N° de Ambulancia'
          },
          {
            'id': 57,
            'nombre': 'EMERGENCIA'
          },
          {
            'id': 58,
            'nombre': 'Aforo'
          },
          {
            'id': 59,
            'nombre': 'N° tópicos adultos'
          },
          {
            'id': 60,
            'nombre': 'N° tópicos pediatría'
          },
          {
            'id': 61,
            'nombre': 'N° tópicos ginecología'
          },
          {
            'id': 62,
            'nombre': 'N° tópicos traumatología'
          }
        ]
      }
    };

    var respFilter = {};
    respFilter.Message = 'Operación Exitosa';
    respFilter.OperationCode = 200;
    respFilter.TypeMessage = 'success';
    respFilter.Data = data;

    setTimeout(function stFn() {
      console.log(' ==> XYZ Sending Master Data');
      res.json('200', respFilter);
    }, 1500);
  }
};
