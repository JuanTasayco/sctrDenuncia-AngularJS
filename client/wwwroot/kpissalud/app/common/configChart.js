(function($root, deps, factory){
  define(deps, factory)
})(this, ['angular', 'constants'], function(angular, constants){
    var configChart = angular.module('oim.constants.kpissalud', []);
    configChart.constant('config', {
      siniestros: {
        tiempoAtencion: {
          id: 'tiempoPromedioAtencionSiniestro',
          type: 'serial',// serial: usar para barra y lineas | pie
          graph: 'line',// line: linea | column: barras (aplica para serial)
          orientation: 'vertical', // para caso de barras horizontales
          categoryDate: true,// en caso el eje x sea fechas
          isExported: true,// en caso deba exportar el gráfico
          title: 'Tiempo promedio (días) de atención de siniestros pagados',
          ticks: {
            y: {
              value: ' días',
              position: 'r'
            }
          },
          legends: {
            tsnstro: {
              label: 'Siniestro',
              color: '#749806',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            tlqudcn: {
              label: 'Liquidación',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            tpgo: {
              label: 'Pago',
              color: '#eba602',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            umbral: {
              label: 'Umbral',
              color: '#f44336',
              type: 'line',
              isGuide: true,
              showLegend: true
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            tsnstro: 'TIEMPO DE SINIESTRO',
            tlqudcn: 'TIEMPO DE LIQUIDACIÓN',
            tpgo: 'TIEMPO DE PAGO'
          },
          pdf: {
            file: 'TiempoPromedioAtencionSiniestrosPagados'
          }
        },
        totalSiniestros: {
          id: 'numeroTotalSiniestros',
          type: 'serial',
          graph: 'line',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Número total de siniestros pagados',
          ticks: {},
          legends: {
            nsnstrs: {
              label: 'Cantidad de siniestros',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            nsnstrs: 'NÚMERO DE SINIESTROS'
          },
          pdf: {
            file: 'NumeroTotalSiniestrosPagados'
          }
        },
        importeSiniestros: {
          id: 'importeTotalSiniestros',
          type: 'serial',
          graph: 'line',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Importe total (S/) de siniestros pagados',
          ticks: {},
          legends: {
            ispgdo: {
              label: 'Importe de siniestros',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            ispgdo: 'IMPORTE DE SINIESTROS'
          },
          pdf: {
            file: 'ImporteTotalSiniestrosPagados'
          }
        },
        costoPromedioAtencion: {
          id: 'costoPromedioAtencion',
          type: 'serial',
          graph: 'column',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Costo promedio (S/):subtitle:',
          subtitle: {
            atencion: ' por Atención',
            paciente: ' por Paciente'
          },
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            cpatncn: {
              label: 'Costo promedio por atención',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            },
            cppcnte: {
              label: 'Costo promedio por paciente',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            },
            umbralMax: {
              label: 'Umbral positivo',
              color: '#4caf50',
              type: 'line',
              isGuide: true,
              showLegend: true
            },
            umbralMin: {
              label: 'Umbral negativo',
              color: '#f44336',
              type: 'line',
              isGuide: true,
              showLegend: true
            }
          },
          buttons: [
            { key: 'paciente',  label: 'Paciente' },
            { key: 'atencion',  label: 'Atención' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            atencion: {
              text: 'COSTO POR ATENCIÓN',
              key: 'cpatncn'
            },
            paciente: {
              text: 'COSTO POR PACIENTE',
              key: 'cppcnte'
            }
          },
          multitable: true,
          pdf: {
            file: 'CostoPromedioAtencionPaciente'
          }
        },
        tasaHospitalizacion: {
          id: 'tasaHospitalizacion',
          type: 'serial',
          graph: 'column',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: ':subtitle: de hospitalización',
          subtitle: {
            porcentaje: 'Tasa (%)',
            importe: 'Importe (S/)'
          },
          percentage: {
            button: 'filter2'
          },
          ticks: {},
          legends: {
            ihcbrtra: {
              label: 'Coberturas Hospitalarias',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            ihotrs: {
              label: 'Coberturas No Hospitalarias',
              color: '#AEBEC4',
              type: 'circle',
              isGuide: false,
              showLegend: true
            }
          },
          buttons: [
            { key: 'importe',  label: 'S/' },
            { key: 'porcentaje',  label: '%' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            ihcbrtra: 'COBERTURAS HOSPITALARIAS',
            ihotrs: 'OTRAS COBERTURAS',
          },
          pdf: {
            file: 'TasaHospitalizacion'
          }
        },
        costoPacienteMes: {
          id: 'costoPacienteMes',
          type: 'serial',
          graph: 'column',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Costo paciente mes (S/)',
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            cpcnte: {
              label: 'Costo Paciente Mes',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            },
            umbral: {
              label: 'Costo del ticket promedio',
              color: '#f44336',
              type: 'line',
              isGuide: true,
              showLegend: true
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            cpcnte: 'COSTO PACIENTE MES'
          },
          pdf: {
            file: 'CostoPacienteMes'
          }
        },
        gastosPorProveedor: {
          id: 'soatGastosProveedor',
          type: 'serial',
          graph: 'column',
          orientation: 'horizontal',
          isExported: true,
          title: ':subtitle: de Gastos por proveedor (IPRESS)',
          subtitle: {
            porcentaje: '%',
            importe: 'S/'
          },
          percentage: {
            button: 'filter2',
            value: 'igprvdr',
            label: 'Porcentaje de gasto (%)'
          },
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            igprvdr: {
              label: 'Gastos por Proveedor',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [
            { key: 'importe',  label: 'S/' },
            { key: 'porcentaje',  label: '%' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'nprvdr',
            value: 'igprvdr'
          },
          table: {
            nprvdr: 'Proveedor',
            igprvdr: 'Importe de gasto (S/)',
            catncns: 'Cantidad de atenciones',
            cpcnts: 'Cantidad de pacientes',
            ipttl: 'Importe pagado total',
            cppcnte: 'Costo promedio por paciente',
            cpttl: 'Costo promedio total'
          },
          pdf: {
            file: 'GastosPorProveedor'
          }
        },
        gastosPorCobertura: {
          id: 'soatGastosCobertura',
          type: 'pie',
          graph: '',
          orientation: 'vertical',
          isExported: true,
          title: ':subtitle: de Gastos por cobertura',
          subtitle: {
            porcentaje: '%',
            importe: 'S/'
          },
          percentage: {
            button: 'filter2',
            value: 'igcbrtra',
            label: 'Porcentaje de gasto (%)'
          },
          ticks: {},
          legends: {},
          buttons: [
            { key: 'importe',  label: 'S/' },
            { key: 'porcentaje',  label: '%' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'ncst',
            value: 'igcbrtra',
            percentage: 'porc'
          },
          table: {
            ncst: 'Cobertura',
            igcbrtra: 'Importe de gasto (S/)',
            catncns: 'Cantidad de atenciones',
            cpcnts: 'Cantidad de pacientes',
            ipttl: 'Importe pagado total',
            cppcnte: 'Costo promedio por paciente',
            cpttl: 'Costo promedio total'
          },
          pdf: {
            file: 'GastosPorCobertura'
          }
        },
        gastosPorAccidente: {
          id: 'soatGastosTipoAccidente',
          type: 'serial',
          graph: 'column',
          orientation: 'horizontal',
          isExported: true,
          title: ':subtitle: de Gastos por tipo de accidente',
          subtitle: {
            porcentaje: '%',
            importe: 'S/'
          },
          percentage: {
            button: 'filter2',
            value: 'igsnstro',
            label: 'Porcentaje de gasto (%)'
          },
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            igsnstro: {
              label: 'Gastos por Tipo de Accidente',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [
            { key: 'importe',  label: 'S/' },
            { key: 'porcentaje',  label: '%' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'csst',
            value: 'igsnstro'
          },
          table: {
            csst: 'Tipo de Accidente',
            igsnstro: 'Importe de gasto (S/)',
            catncns: 'Cantidad de atenciones',
            cpcnts: 'Cantidad de pacientes',
            ipttl: 'Importe pagado total',
            cppcnte: 'Costo promedio por paciente',
            cpatncn: 'Costo promedio total'
          },
          pdf: {
            file: 'GastosPorTipoAccidente'
          }
        },
        gastosPorUbicacionDetallada: {
          id: 'soatGastosUbicacionDetallada',
          type: 'serial',
          graph: 'column',
          orientation: 'horizontal',
          isExported: true,
          title: ':subtitle: de Gastos por ubicación geográfico detallada',
          subtitle: {
            porcentaje: '%',
            importe: 'S/'
          },
          percentage: {
            button: 'filter2',
            value: 'igdprtmnto',
            label: 'Porcentaje de gasto (%)'
          },
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            igdprtmnto: {
              label: 'Gastos por Ubicacion geografica detallada',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [
            { key: 'importe',  label: 'S/' },
            { key: 'porcentaje',  label: '%' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'ndprtmnto',
            value: 'igdprtmnto'
          },
          table: {
            ndprtmnto: 'Zona',
            igdprtmnto: 'Importe de gasto (S/)',
            catncns: 'Cantidad de atenciones',
            cpcnts: 'Cantidad de pacientes',
            ipttl: 'Importe pagado total',
            cppcnte: 'Costo promedio por paciente',
            cpatncn: 'Costo promedio total'
          },
          pdf: {
            file: 'GastosPorUbicacionGeograficaDetallada'
          }
        },
        gastosPorUbicacionGeneral: {
          id: 'soatGastosUbicacionGeneral',
          type: 'pie',
          graph: '',
          orientation: 'vertical',
          isExported: true,
          title: ':subtitle: de Gastos por ubicación geográfico general por zona',
          subtitle: {
            porcentaje: '%',
            importe: 'S/'
          },
          percentage: {
            button: 'filter2',
            value: 'igdprtmnto',
            label: 'Porcentaje de gasto (%)'
          },
          ticks: {},
          legends: {},
          buttons: [
            { key: 'importe',  label: 'S/' },
            { key: 'porcentaje',  label: '%' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'ndprtmnto',
            value: 'igdprtmnto'
          },
          table: {
            ndprtmnto: 'Zona',
            igdprtmnto: 'Importe de gasto (S/)',
            catncns: 'Cantidad de atenciones',
            cpcnts: 'Cantidad de pacientes',
            ipttl: 'Importe pagado total',
            cppcnte: 'Costo promedio por paciente',
            cpatncn: 'Costo promedio total'
          },
          pdf: {
            file: 'GastosPorUbicacionGeograficaGeneral'
          }
        }
      }, 
      cartas: {
        importeTotalReservas: {
          id: 'importeTotalReservas',
          type: 'text',
          valueIsNumber: true,
          title: 'Importe total (S/) de reservas',
          ticks: {
            value: 'S/ ',
            position: 'l'
          },
          fields: {
            value: 'itrsrva'
          }
        },
        numeroCgSolicitadas: {
          id: 'numeroCartasGarantiaSolicitadas',
          type: 'text',
          valueIsNumber: true,
          title: 'Cartas de garantía solicitadas',
          fields: {
            value: 'ncgslctds'
          }
        },
        numeroCgRechazadas: {
          id: 'numeroCartasGarantiaRechazadas',
          type: 'text',
          valueIsNumber: true,
          title: 'Cartas de garantía rechazadas',
          fields: {
            value: 'ncgrchzds'
          }
        },
        numeroTotalCg: {
          id: 'numeroTotalCartasGarantia',
          type: 'serial',
          graph: 'column',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: ':subtitle: de cartas de garantía',
          subtitle: {
            porcentaje: 'Porcentaje',
            cantidad: 'Número total'
          },
          percentage: {
            button: 'filter1'
          },
          ticks: {},
          legends: {
            ncgrchzds: {
              label: 'Rechazadas',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            ncgslctds: {
              label: 'Solicitadas',
              color: '#AEBEC4',
              type: 'circle',
              isGuide: false,
              showLegend: true
            }
          },
          buttons: [
            { key: 'porcentaje',  label: '%' },
            { key: 'cantidad',  label: 'Nº' }
          ],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            ncgrchzds: 'RECHAZADAS',
            ncgslctds: 'SOLICITADAS',
          },
          pdf: {
            file: 'NumeroTotalCartasGarantia'
          }
        },
        importeTotalCg: {
          id: 'importeTotalCartasGarantia',
          type: 'serial',
          graph: 'line',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Importe total (S/) de cartas de garantía',
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            icgprbds: {
              label: 'Aprobadas',
              color: '#749806',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            icgrchzds: {
              label: 'Rechazadas',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: true
            },
            icgslctds: {
              label: 'Solicitadas',
              color: '#AEBEC4',
              type: 'circle',
              isGuide: false,
              showLegend: true
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            icgprbds: 'APROBADAS',
            icgrchzds: 'RECHAZADAS',
            icgslctds: 'SOLICITADAS'
          },
          pdf: {
            file: 'ImporteTotalCartasGarantia'
          }
        },
        ahorroSolicitudesRechazadas: {
          id: 'ahorroSolicitudesRechazadas',
          type: 'serial',
          graph: 'line',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Ahorro (S/) por solicitudes rechazadas',
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            iasrchzds: {
              label: 'Ahorro por solicitud rechazada',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            iasrchzds: 'IMPORTE AHORRADO (S/)'
          },
          pdf: {
            file: 'AhorroSolicitudesRechazdas'
          }
        },
        ahorroAuditoriaMedica: {
          id: 'ahorroAuditoriaMedica',
          type: 'serial',
          graph: 'line',
          orientation: 'vertical',
          categoryDate: true,
          isExported: true,
          title: 'Ahorro (S/) por auditoría médica',
          ticks: {
            y: {
              value: 'S/ ',
              position: 'l'
            }
          },
          legends: {
            iaamdca: {
              label: 'Ahorro por auditoría médica',
              color: '#547D8A',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'cmpfch',
            value: ''
          },
          table: {
            cmpfch: 'FECHA',
            iaamdca: 'IMPORTE AHORRADO (S/)'
          },
          pdf: {
            file: 'AhorroAuditoríaMédica'
          }
        },
        diagnosticoAprobado: {
          id: 'diagnosticoAprobado',
          type: 'serial',
          graph: 'column',
          orientation: 'horizontal',
          isExported: true,
          percentage: {
            button: 'filter2',
            value: 'pcgadgnstco',
          },
          title: 'Diagnósticos aprobados',
          secondTitle: {
            base: '% calculado en base a :value: cartas de garantía aprobadas',
            value: ''
          },
          ticks: {},
          legends: {
            pcgadgnstco: {
              label: 'Porcentaje de cartas de garantía aprobadas',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'ddgnstco',
            value: 'pcgadgnstco',
            base: 'ncgadgnstco'
          },
          table: {
            ddgnstco: 'Diagnóstico',
            pcgadgnstco: 'Porcentaje de cartas de garantía aprobadas',
            // ncgadgnstco: 'Número de cartas de garantía aprobadas'
          },
          pdf: {
            file: 'DiagnosticosAprobados'
          }
        },
        coberturaAprobada: {
          id: 'coberturaAprobada',
          type: 'serial',
          graph: 'column',
          orientation: 'horizontal',
          isExported: true,
          percentage: {
            button: 'filter2',
            value: 'pcgacbrtra',
          },
          title: 'Coberturas aprobadas',
          secondTitle: {
            base: '% calculado en base a :value: cartas de garantía aprobadas',
            value: ''
          },
          ticks: {},
          legends: {
            pcgacbrtra: {
              label: 'Porcentaje de cartas de garantía aprobadas',
              color: '#f44336',
              type: 'circle',
              isGuide: false,
              showLegend: false
            }
          },
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'dcbrtra',
            value: 'pcgacbrtra',
            base: 'ncgacbrtra'
          },
          table: {
            dcbrtra: 'Cobertura',
            pcgacbrtra: 'Porcentaje de cartas de garantía aprobadas',
            // ncgacbrtra: 'Número de cartas de garantía aprobadas'
          },
          pdf: {
            file: 'CoberturasAprobadas'
          }
        },
        motivoRechazo: {
          id: 'motivoRechazo',
          type: 'pie',
          graph: '',
          orientation: 'vertical',
          isExported: true,
          percentage: {
            button: 'filter2',
            value: 'pcgrchzds',
          },
          title: 'Motivos de rechazo',
          secondTitle: {
            base: '% calculado en base a :value: cartas de garantía rechazadas',
            value: ''
          },
          ticks: {},
          legends: {},
          buttons: [],
          guides: {
            simple: {},
            multiple: []
          },
          fields: {
            category: 'dmrchzo',
            value: 'pcgrchzds',
            base: 'ncgrchzds'
          },
          table: {
            dmrchzo: 'Motivos de Rechazo',
            pcgrchzds: 'Porcentaje de cartas de garantía rechazadas',
            // ncgrchzds: 'Número de cartas de garantía aprobadas'
          },
          pdf: {
            file: 'MotivosRechazo'
          }
        }
      }
    })
    .factory('configChart', ['config', 'mapfreAuthetication', '$templateRequest', '$sce', '$filter', 
      function(config, mapfreAuthetication, $templateRequest, $sce, $filter){
        return {
          // Generar json para graficar indicadores
          // Siniestros
          'KpiTiempoAtencionSiniestro' : function(filters, product, data, umbral){
            var title = config.siniestros.tiempoAtencion.title;
            var configJson = angular.copy(config.siniestros.tiempoAtencion);
            if(!filters.ac_frclmo.cdgo){
              configJson.buttons = [
                { key: 'credito',  label: 'Crédito' },
                { key: 'reembolso',  label: 'Reembolso' }
              ];
              var guide1 = {};
              var guide2 = {};
              if(product.cdgo == 'O') {
                guide1 = { umbral: umbral.creditosoat };
                guide2 = { umbral: umbral.reembolsosoat };
              } else {
                guide1 = { umbral: umbral.credito };
                guide2 = { umbral: umbral.reembolso };
              } 
              configJson.guides.multiple.push(guide1);
              configJson.guides.multiple.push(guide2);
              configJson.data = data;
            } else if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' por Crédito';
              configJson.data = data.credito;
              if(product.cdgo == 'O') configJson.guides.simple.umbral = umbral.creditosoat;
              else configJson.guides.simple.umbral = umbral.credito;
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' por Reembolso';
              configJson.data = data.reembolso;
              if(product.cdgo == 'O') configJson.guides.simple.umbral = umbral.reembolsosoat;
              else configJson.guides.simple.umbral = umbral.reembolso;
            }
            return configJson;
          },
          'KpiNumeroTotalSiniestro': function(filters, data){
            var title = config.siniestros.totalSiniestros.title;
            var configJson = angular.copy(config.siniestros.totalSiniestros);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' por Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' por Reembolso';
            }
            configJson.data = data;
            return configJson;
          },
          'KpiImporteTotalSiniestro': function(filters, data){
            var title = config.siniestros.importeSiniestros.title;
            var configJson = angular.copy(config.siniestros.importeSiniestros);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' por Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' por Reembolso';
            }
            configJson.data = data;
            return configJson;
          },
          'KpiCostoPromedioAtencionPaciente': function(filters, data, umbral){
            var title = config.siniestros.costoPromedioAtencion.title;
            var configJson = angular.copy(config.siniestros.costoPromedioAtencion);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' - Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' - Reembolso';
            }
            configJson.guides.multiple.push(umbral.umbralPaciente);
            configJson.guides.multiple.push(umbral.umbralAtencion);
            configJson.data = data;
            return configJson;
          },
          'KpiImporteTasaHospitalizacion': function(data){
            var configJson = angular.copy(config.siniestros.tasaHospitalizacion);
            configJson.data = data;
            return configJson;
          },
          'KpiCostoPacienteMes': function(filters, data, umbral){
            var title = config.siniestros.costoPacienteMes.title;
            var configJson = angular.copy(config.siniestros.costoPacienteMes);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' por Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' por Reembolso';
            }
            configJson.guides.simple = umbral;
            configJson.data = data;
            return configJson;
          },
          'KpiGastosProveedor': function(filters, data){
            var title = config.siniestros.gastosPorProveedor.title;
            var configJson = angular.copy(config.siniestros.gastosPorProveedor);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' - Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' - Reembolso';
            }
            configJson.data = data;
            return configJson;
          },
          'KpiGastosCobertura': function(filters, data){
            var title = config.siniestros.gastosPorCobertura.title;
            var configJson = angular.copy(config.siniestros.gastosPorCobertura);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' - Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' - Reembolso';
            }
            configJson.data = data;
            return configJson;
          },
          'KpiGastosTipoAccidente': function(filters, data){
            var title = config.siniestros.gastosPorAccidente.title;
            var configJson = angular.copy(config.siniestros.gastosPorAccidente);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' - Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' - Reembolso';
            }
            configJson.data = data;
            return configJson;
          },
          'KpiGastosUbicacionGeograficaDetallada': function(filters, data){
            var title = config.siniestros.gastosPorUbicacionDetallada.title;
            var configJson = angular.copy(config.siniestros.gastosPorUbicacionDetallada);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' - Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' - Reembolso';
            }
            configJson.data = data;
            return configJson;
          },
          'KpiGastosUbicacionGeograficaGeneral': function(filters, data){
            var title = config.siniestros.gastosPorUbicacionGeneral.title;
            var configJson = angular.copy(config.siniestros.gastosPorUbicacionGeneral);
            if(filters.ac_frclmo.cdgo == 'C') {
              configJson.title = title + ' - Crédito';
            } else if(filters.ac_frclmo.cdgo == 'R') {
              configJson.title = title + ' - Reembolso';
            }
            configJson.data = data;
            return configJson;
          },

          // Cartas de Garantía
          'KpiImporteTotalReservas': function(data){
            var configJson = angular.copy(config.cartas.importeTotalReservas);
            configJson.data = data;
            configJson.isText = configJson.type == 'text';
            return configJson;
          },
          'KpiNumeroCartasGarantiaSolicitadas': function(data){
            var configJson = angular.copy(config.cartas.numeroCgSolicitadas);
            configJson.data = data;
            configJson.isText = configJson.type == 'text';
            return configJson;
          },
          'KpiNumeroCartasGarantiaRechazadas': function(data){
            var configJson = angular.copy(config.cartas.numeroCgRechazadas);
            configJson.data = data;
            configJson.isText = configJson.type == 'text';
            return configJson;
          },
          'KpiNumeroTotalCartasGarantia': function(data){
            var configJson = angular.copy(config.cartas.numeroTotalCg);
            configJson.data = data;
            return configJson;
          },
          'KpiImporteTotalCartasGarantia': function(data){
            var configJson = angular.copy(config.cartas.importeTotalCg);
            configJson.data = data;
            return configJson;
          },
          'KpiAhorroSolicitudesRechazadas': function(data){
            var configJson = angular.copy(config.cartas.ahorroSolicitudesRechazadas);
            configJson.data = data;
            return configJson;
          },
          'KpiAhorroAuditoriaMedica': function(data){
            var configJson = angular.copy(config.cartas.ahorroAuditoriaMedica);
            configJson.data = data;
            return configJson;
          },
          'KpiDiagnosticoAprobado': function(data){
            var configJson = angular.copy(config.cartas.diagnosticoAprobado);
            configJson.data = data;
            return configJson;
          },
          'KpiCoberturaAprobada': function(data){
            var configJson = angular.copy(config.cartas.coberturaAprobada);
            configJson.data = data;
            return configJson;
          },
          'KpiMotivoRechazo': function(data){
            var configJson = angular.copy(config.cartas.motivoRechazo);
            configJson.data = data;
            return configJson;
          },

          // Conversion de datos para indicadores
          'convertTasaImporteHospitalizacion': function(data){
            var result = { importe: [], porcentaje: [] };
            result.importe = data.importe;
            for(var i = 0; i < data.porcentaje.length; i++){
              var porcentaje = data.porcentaje[i];
              var total = parseFloat(porcentaje.ihcbrtra) + parseFloat(porcentaje.ihotrs);
              var ihcbrtra = (total != 0 && !isNaN(total)) ? (Math.round((parseFloat(porcentaje.ihcbrtra) / total) * 100 * 100) / 100) : 0;
              var ihotrs = (total != 0 && !isNaN(total)) ? (Math.round((parseFloat(porcentaje.ihotrs) / total) * 100 * 100) / 100) : 0;
              var porcentajeTmp = { ihcbrtra: ihcbrtra, ihotrs: ihotrs, cmpfch: porcentaje.cmpfch }
              result.porcentaje.push(porcentajeTmp);
            }

            return result;
          },
          'convertSoatGastosProveedor': function(data){
            var result = {}, button1 = [], button2 = [];
            var gastosPorProveedor = config.siniestros.gastosPorProveedor;
            var buttons = gastosPorProveedor.buttons;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              //if(item[gastosPorProveedor.fields.value] !== '' && item[gastosPorProveedor.fields.value] !== '0'){
                var importe = item[gastosPorProveedor.fields.value] !== '' ? parseFloat(item[gastosPorProveedor.fields.value]) : 0;
                total += importe;
              //}
            }

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              //if(item[gastosPorProveedor.fields.value] !== '' && item[gastosPorProveedor.fields.value] !== '0'){
                var importe = item[gastosPorProveedor.fields.value] !== '' ? parseFloat(item[gastosPorProveedor.fields.value]) : 0;
                button1.push(item);
                var itemBtn2 = angular.copy(item);
                var value = importe / total * 100;
                itemBtn2[gastosPorProveedor.fields.value] = Math.round(value * 100) / 100;
                button2.push(itemBtn2);
              //}
            }

            result[buttons[0].key] = button1;
            result[buttons[1].key] = button2;

            return result;
          },
          'convertSoatGastosCobertura': function(data){
            var result = {}, button1 = [], button2 = [];
            var gastosPorCobertura = config.siniestros.gastosPorCobertura;
            var buttons = gastosPorCobertura.buttons;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              //if(item[gastosPorCobertura.fields.value] !== '' && item[gastosPorCobertura.fields.value] !== '0'){
                var importe = item[gastosPorCobertura.fields.value] !== '' ? parseFloat(item[gastosPorCobertura.fields.value]) : 0;
                total += importe;
              //}
            }

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              //if(item[gastosPorCobertura.fields.value] !== '' && item[gastosPorCobertura.fields.value] !== '0'){
                var importe = item[gastosPorCobertura.fields.value] !== '' ? parseFloat(item[gastosPorCobertura.fields.value]) : 0;
                button1.push(item);
                var itemBtn2 = angular.copy(item);
                // var value = importe / total * 100;
                // itemBtn2[gastosPorCobertura.fields.value] = Math.round(value * 100) / 100;
                /* --- */
                var importe = parseFloat(item[gastosPorCobertura.fields.percentage]);
                itemBtn2[gastosPorCobertura.fields.value] = importe;
                /* --- */
                button2.push(itemBtn2);
              //}
            }

            result[buttons[0].key] = button1;
            result[buttons[1].key] = button2;

            return result;
          },
          'convertSoatGastosTipoAccidente': function(data){
            var result = {}, button1 = [], button2 = [];
            var gastosPorAccidente = config.siniestros.gastosPorAccidente;
            var buttons = gastosPorAccidente.buttons;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              //if(item[gastosPorAccidente.fields.value] !== '' && item[gastosPorAccidente.fields.value] !== '0'){
                var importe = item[gastosPorAccidente.fields.value] !== '' ? parseFloat(item[gastosPorAccidente.fields.value]) : 0;
                total += importe;
              //}
            }

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              //if(item[gastosPorAccidente.fields.value] !== '' && item[gastosPorAccidente.fields.value] !== '0'){
                var importe = item[gastosPorAccidente.fields.value] !== '' ? parseFloat(item[gastosPorAccidente.fields.value]) : 0;
                button1.push(item);
                var itemBtn2 = angular.copy(item);
                var value = importe / total * 100;
                itemBtn2[gastosPorAccidente.fields.value] = Math.round(value * 100) / 100;
                button2.push(itemBtn2);
              //}
            }

            result[buttons[0].key] = button1;
            result[buttons[1].key] = button2;

            return result;
          },
          'convertSoatGastosUbicacionGeograficaDetallada': function(data){
            var result = {}, button1 = [], button2 = [];
            var gastosPorUbicacionDetallada = config.siniestros.gastosPorUbicacionDetallada;
            var buttons = gastosPorUbicacionDetallada.buttons;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[gastosPorUbicacionDetallada.fields.value] !== '' && item[gastosPorUbicacionDetallada.fields.value] !== '0'){
                var importe = parseFloat(item[gastosPorUbicacionDetallada.fields.value]);
                var importe = item[gastosPorUbicacionDetallada.fields.value] !== '' ? parseFloat(item[gastosPorUbicacionDetallada.fields.value]) : 0;
                total += importe;
              // }
            }

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[gastosPorUbicacionDetallada.fields.value] !== '' && item[gastosPorUbicacionDetallada.fields.value] !== '0'){
                // var importe = parseFloat(item[gastosPorUbicacionDetallada.fields.value]);
                var importe = item[gastosPorUbicacionDetallada.fields.value] !== '' ? parseFloat(item[gastosPorUbicacionDetallada.fields.value]) : 0;
                button1.push(item);
                var itemBtn2 = angular.copy(item);
                var value = importe / total * 100;
                itemBtn2[gastosPorUbicacionDetallada.fields.value] = Math.round(value * 100) / 100;
                button2.push(itemBtn2);
              // }
            }

            result[buttons[0].key] = button1;
            result[buttons[1].key] = button2;

            return result;
          },
          'convertSoatGastosUbicacionGeograficaGeneral': function(data){
            var result = {}, button1 = [], button2 = [];
            var gastosPorUbicacionGeneral = config.siniestros.gastosPorUbicacionGeneral;
            var buttons = gastosPorUbicacionGeneral.buttons;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[gastosPorUbicacionGeneral.fields.value] !== '' && item[gastosPorUbicacionGeneral.fields.value] !== '0'){
                var importe = item[gastosPorUbicacionGeneral.fields.value] !== '' ? parseFloat(item[gastosPorUbicacionGeneral.fields.value]) : 0;
                total += importe;
              // }
            }

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[gastosPorUbicacionGeneral.fields.value] !== '' && item[gastosPorUbicacionGeneral.fields.value] !== '0'){
                var importe = item[gastosPorUbicacionGeneral.fields.value] !== '' ? parseFloat(item[gastosPorUbicacionGeneral.fields.value]) : 0;
                button1.push(item);
                var itemBtn2 = angular.copy(item);
                var value = importe / total * 100;
                itemBtn2[gastosPorUbicacionGeneral.fields.value] = Math.round(value * 100) / 100;
                button2.push(itemBtn2);
              // }
            }

            result[buttons[0].key] = button1;
            result[buttons[1].key] = button2;

            return result;
          },
          'convertNumeroTotalCartasGarantia': function(data){
            var result = {}, button1 = [], button2 = [];
            var numeroTotalCg = config.cartas.numeroTotalCg;
            var buttons = numeroTotalCg.buttons;

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              button1.push(item);
              var itemBtn2 = {};
              var total = 0;
              for(var key in numeroTotalCg.legends){
                // if(item[key] !== '' && item[key] !== '0'){
                  var valueItem = item[key] !== '' ? parseFloat(item[key]) : 0;
                  total += valueItem;
                // }
              }
              for(var key in numeroTotalCg.legends){
                // if(item[key] !== '' && item[key] !== '0'){
                  var valueItem = item[key] !== '' ? parseFloat(item[key]) : 0;
                  var value = valueItem / total * 100;
                  itemBtn2[key] = Math.round(value * 100) / 100;
                // }/
              }
              itemBtn2[numeroTotalCg.fields.category] = item[numeroTotalCg.fields.category];
              button2.push(itemBtn2);
            }

            result[buttons[0].key] = button2;
            result[buttons[1].key] = button1;

            return result;
          },
          'convertDiagnosticoAprobado': function(data){
            var result = [];
            var diagnosticoAprobado = config.cartas.diagnosticoAprobado;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[diagnosticoAprobado.fields.base] !== '' && item[diagnosticoAprobado.fields.base] !== '0'){
                var initImporte = item[diagnosticoAprobado.fields.base] !== '' ? parseFloat(item[diagnosticoAprobado.fields.base]) : 0;
                var importe = Math.round(initImporte * 100) / 100;
                total += importe;
                total = Math.round(total * 1e12) / 1e12;
              // }
            }
            diagnosticoAprobado.secondTitle.value = total;

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[diagnosticoAprobado.fields.base] !== '' && item[diagnosticoAprobado.fields.base] !== '0'){
                var importe = item[diagnosticoAprobado.fields.base] !== '' ? parseFloat(item[diagnosticoAprobado.fields.base]) : 0;
                var value = importe / total * 100;
                var itemPercentage = item;
                itemPercentage[diagnosticoAprobado.fields.value] = Math.round(value * 100) / 100;
                result.push(itemPercentage);
              // }
            }

            return result;
          },
          'convertCoberturaAprobada': function(data){
            var result = [];
            var coberturaAprobada = config.cartas.coberturaAprobada;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[coberturaAprobada.fields.base] !== '' && item[coberturaAprobada.fields.base] !== '0'){
                var initImporte = item[coberturaAprobada.fields.base] !== '' ? parseFloat(item[coberturaAprobada.fields.base]) : 0;
                var importe = Math.round(initImporte * 100) / 100;
                total += importe;
                total = Math.round(total * 1e12) / 1e12;
              // }
            }

            coberturaAprobada.secondTitle.value = total;

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[coberturaAprobada.fields.base] !== '' && item[coberturaAprobada.fields.base] !== '0'){
                var importe = item[coberturaAprobada.fields.base] !== '' ? parseFloat(item[coberturaAprobada.fields.base]) : 0;
                var value = importe / total * 100;
                var itemPercentage = item;
                itemPercentage[coberturaAprobada.fields.value] = Math.round(value * 100) / 100;
                result.push(itemPercentage);
              // }
            }

            return result;
          },
          'convertMotivoRechazo': function(data){
            var result = [];
            var motivoRechazo = config.cartas.motivoRechazo;

            var total = 0;
            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[motivoRechazo.fields.base] !== '' && item[motivoRechazo.fields.base] !== '0'){
                var importe = item[motivoRechazo.fields.base] !== '' ? parseFloat(item[motivoRechazo.fields.base]) : 0;
                total += importe;
              // }
            }

            motivoRechazo.secondTitle.value = total;

            for(var i = 0; i < data.length; i++){
              var item = data[i];
              // if(item[motivoRechazo.fields.base] !== '' && item[motivoRechazo.fields.base] !== '0'){
                // var importe = parseFloat(item[motivoRechazo.fields.base]);
                var importe = item[motivoRechazo.fields.base] !== '' ? parseFloat(item[motivoRechazo.fields.base]) : 0;
                var value = importe / total * 100;
                var itemPercentage = item;
                itemPercentage[motivoRechazo.fields.value] = Math.round(value * 100) / 100;
                result.push(itemPercentage);
              // }
            }

            return result;
          },

          // Validaciones
          'validarTasaHospitalizacion': function(filters){
            return filters.ac_frclmo.cdgo == 'C';
          },
          'validarCostoPacienteMes': function(product, filters){
            var validFormaReclamo = filters.ac_frclmo.cdgo != 'R';
            var validProduct = product.cdgo == 'S'
            return validProduct && validFormaReclamo;
          },
          'validarGastosProveedor': function(filters){
            return filters.ac_frclmo.cdgo == 'C';
          },
          'validarGastosUbicacionGeograficaDet': function(filters){
            return filters.ac_frclmo.cdgo != 'R';
          },
          'validarGastosUbicacionGeograficaGen': function(filters){
            return filters.ac_frclmo.cdgo != 'R';
          },
          'validateKeyInFilter': function(dashboard, product, filters, key){
            var isSiniestro = dashboard == 'SNSTR';
            var isAsistenciaMedica = (product.cdgo == 'S' && product.cod_cia == '1');
            var isEps = (product.cdgo == 'S' && product.cod_cia == '3');
            var isSoat = (product.cdgo == 'O');
            var isAccidentesPersonales = product.cdgo == 'A';

            if(key == 'ac_frclmo' &&  !isSiniestro) return false;
            if((key == 'ac_crmo' || key == 'ac_ndcntrto' || key == 'ac_ndsbcntrto' || 
                key == 'ac_cdprdcto' || key == 'ac_cdsbprdcto') && !isAsistenciaMedica){
              return false;
            }
            if(key == 'ac_cadtrmdco' && (isSoat || isAccidentesPersonales)) return false;
            if(key == 'an_cgecnmco' && !isEps) return false;
            if(isAsistenciaMedica){
              if((key == 'ac_ndcntrto' || key == 'ac_ndsbcntrto') && filters.ac_crmo.cdgo != '116') return false;
              if((key == 'ac_cdprdcto' || key == 'ac_cdsbprdcto') &&
                 (filters.ac_crmo.cdgo != '114' && filters.ac_crmo.cdgo != '115')) return false;
            }

            return true;
          },

          // Utilitarios
          'formatDate': function(date){
            return date.getFullYear() + ('0'+(date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
          },
          'formatCustomDate': function(value){
            var year = value.substring(0,4);
            var month = value.substring(4);
            var monthLabel = '';
            switch(month){
              case '01':
                monthLabel = 'Ene';
                break;
              case '02':
                monthLabel = 'Feb';
                break;
              case '03':
                monthLabel = 'Mar';
                break;
              case '04':
                monthLabel = 'Abr';
                break;
              case '05':
                monthLabel = 'May';
                break;
              case '06':
                monthLabel = 'Jun';
                break;
              case '07':
                monthLabel = 'Jul';
                break;
              case '08':
                monthLabel = 'Ago';
                break;
              case '09':
                monthLabel = 'Set';
                break;
              case '10':
                monthLabel = 'Oct';
                break;
              case '11':
                monthLabel = 'Nov';
                break;
              case '12':
                monthLabel = 'Dic';
                break;
            }
            return monthLabel + ' ' + year;
          },
          'formatBigValues': function(value){
            if (value >= 1000000) return (Math.round(value / 1000000 * 100) / 100) + ' M';
            else if (value >= 1000) return (Math.round(value / 1000 * 100) / 100) + ' K';
            else return value;
          },
          'getUserName': function(value){
            var username = "";
            var profile = mapfreAuthetication.get_profile();
            var name = "";
            
            if(profile){
              for (var key in constants.typeLogin) {
                if (constants.typeLogin[key].code == profile.code) name = constants.typeLogin[key].name;
              }
              username = name + ": " + profile.name;
            }

            return username;
          },
          'generatePdfFromChart': function(chart, data, table, filters, username, config, callback){
            var templateUrl = $sce.getTrustedResourceUrl('./app/common/reportChart.html');

            $templateRequest(templateUrl).then(function(template) {
              var html = template;
              var divSubtitle = '';
              var date = moment();
              date.locale('es');
              var dateString = date.format('dddd DD [de] MMMM [del] YYYY [a las ] h:mm a');

              html = html.replace('{{usuario}}', username);
              html = html.replace('{{fecha}}', dateString);
              html = html.replace('{{tipoProducto}}', config.typeProduct);
              html = html.replace('{{producto}}', config.product);
              html = html.replace('{{filtros}}', filters);
              html = html.replace('{{nombreGrafico}}', config.title);
              html = html.replace('{{imagenGrafico}}', chart);

              if(config.subtitle !== ''){
                divSubtitle = '<div class="kpi-chart__second-title"><b>' + config.subtitle + '</b></div>';
              }

              html = html.replace('{{segundoTitulo}}', divSubtitle);

              var headers = [];

              for(var key in table){
                var headerItem = {};
                headerItem.key = key;
                headerItem.label = table[key];
                headers.push(headerItem);
              }

              var headersTable = "";
              for(var i = 0; i < headers.length; i++){
                var header = headers[i];
                var classRowHeader = i == 0 ? "kpi-report__table-header-left" : "kpi-report__table-header";
                headersTable += '<th class="' + classRowHeader + '">'+ header.label + '</th>';
              }

              var rowsTable = "";
              for(var i = 0; i < data.length; i++){
                var row = data[i];
                var rowTable = '<tr>';
                for(var j = 0; j < headers.length; j++){
                  var header = headers[j];
                  var value = row[header.key];
                  var valueCheck = parseFloat(row[header.key]);
                  // if(!isNaN(valueCheck)) value = $filter('number')(valueCheck);
                  if(!isNaN(valueCheck)) {
                    var key = header.key;
                    var isDecimalKey = key == 'ispgdo' ||  key == 'cpcnte' || key == 'ihcbrtra' || key == 'ihotrs' || 
                    key == 'cpatncn' || key == 'cppcnte' || key == 'ipttl' || key == 'igdprtmnto' || key == 'igsnstro' ||
                    key == 'cpttl' || key == 'igcbrtra' || key == 'igprvdr' || key == 'icgslctds' || key == 'icgrchzds' ||
                    key == 'icgprbds' || key == 'iasrchzds' || key == 'iaamdca' || key == 'pcgadgnstco' || key == 'pcgacbrtra' ||
                    key == 'pcgrchzds';
                    var precision = isDecimalKey || !Number.isInteger(valueCheck) ? 2 : 0;
                    value = $filter('number')(valueCheck, precision);
                  }
                  if(value == undefined) value = "";
                  var classRow = j == 0 ? "kpi-report__table-item-left" : "kpi-report__table-item";
                  rowsTable += '<td class="' + classRow + '">'+ value + '</td>';
                }
                rowTable += '</tr>';
                rowsTable += rowTable;
              }

              html = html.replace('{{headers}}', headersTable);
              html = html.replace('{{rows}}', rowsTable);

              var pdf = new jsPDF('p', 'pt', 'a4');
              pdf.html(html, {
                x: 40,
                y: 10,
                html2canvas: {
                  scale: 0.65
                },
                callback: function () {
                  pdf.save(config.file + "_" + date.format('x') +'.pdf');
                  callback();
                }
              });
            });
          },
          'generatePdfGeneral': function(charts, filters, username, config, callback){
            var templateUrl = $sce.getTrustedResourceUrl('./app/common/reportGeneralChart.html');

            $templateRequest(templateUrl).then(function(template) {
              var totalCharts = charts.length;
              if(config.hasTextCharts) totalCharts = totalCharts - config.numHastTextCharts + 1;
              var totalPage = Math.ceil(totalCharts / 6);
              var htmlBase = template;
              var html = "";
              var date = moment();
              date.locale('es');
              var dateString = date.format('dddd DD [de] MMMM [del] YYYY [a las ] h:mm a');

              var offset = 0;
              var size = 6;
              var total = charts.length;
              var numItems = 0;

              for(var page = 1; page <= totalPage; page++){
                if(total - size * page > 0) {
                  numItems = 6 * page;
                  if(config.hasTextCharts) numItems = numItems + config.numHastTextCharts - 1;
                }
                else numItems = total;

                html += htmlBase;
                html = html.replace('{{usuario}}', username);
                html = html.replace('{{fecha}}', dateString);
                html = html.replace('{{tipoProducto}}', config.typeProduct);
                html = html.replace('{{producto}}', config.product);
                html = html.replace('{{filtros}}', filters);

                var chartText = '<div class="col-md-6 col-sm-6">';
                var chartImages = "";

                for(var i = offset; i < numItems; i++){
                  var chart = charts[i];
                  if(chart){
                    var chartImage = ""
                    if(i < config.numHastTextCharts){
                      chartText += '<div class="kpi-report__chart-text-container""><div class="kpi-chart__canvas-container">';
                      chartText += '<div class="kpi-report__chart-text-value">' + chart.image + '</div></div>';
                      chartText += '<div class="kpi-chart__title-container">';
                      chartText += '<div class="kpi-chart__text-title kpi-chart__title-only">' + chart.title + '</div></div></div>';
                      if(i == config.numHastTextCharts - 1) {
                        chartText += '</div>';
                        chartImage += chartText;
                      }
                    } else {
                      chartImage += '<div class="col-md-6 col-sm-6"><div class="kpi-report__chart-container">';
                      chartImage += '<div class="kpi-chart__title-container"><div class="kpi-report__chart-title"><div>' + chart.title + '</div>'
                      if(chart.subtitle !== ''){
                        chartImage += '<div class="kpi-chart__second-title">' + chart.subtitle + '</div>'
                      }
                      chartImage += '</div></div>';
                      if(chart.hasError) chartImage += '<div class="kpi-chart__canvas-error">No se encontraron resultados para esta búsqueda.</div>';
                      else chartImage += '<div><img style="width:100%;" src="' + chart.image + '"></div>';
                      chartImage += '</div></div>';
                    }
                    chartImages += chartImage;
                  }
                }

                html = html.replace('{{chartsImages}}', chartImages);
                html = html.replace('{{actualPage}}', page);
                html = html.replace('{{totalPages}}', totalPage);
                offset = numItems;

                if(page < totalPage) html += '<div style="height:175px;"></div>';
              }

              var pdf = new jsPDF('p', 'pt', 'a4');
              pdf.html(html, {
                x: 40,
                y: 10,
                html2canvas: {
                  scale: 0.65
                },
                callback: function () {
                  pdf.save(config.file + "_" + date.format('x') +'.pdf');
                  callback(html);
                }
              });
            });
          }
        };
      }
     ]);
});