define([
  'angular',
  'lodash',
  'constants',
  'saludFactory'
], function(ng, _) {

  saludSuscripcionFactory.$inject = ['saludFactory', '$q', 'httpData', '$filter'];

  function saludSuscripcionFactory(saludFactory, $q, httpData, $filter) {
      var firstStep = {};
      var firstStepClinicaDigital = {};
      var thirdStep = {};
      var cuestionarioInfo = {};
      var motivoSolicitud = [];
      var itemSaludBandeja = {}

      function _fnConvertFormData(params){
        var fd = new FormData();
        angular.forEach(params, function(value, key) {
          fd.append(key, value);
        });
        return fd;
      }

      function _fnServiceUploadPromise(url, params, showSpin){
				var vConfig = {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				};
				var vParams = _fnConvertFormData(params);
				return httpData['post'](constants.system.api.endpoints.policy + url, vParams, vConfig, showSpin);
			}

      return {
          cargaAltaDocumental: function(params, showSpin) {
            return _fnServiceUploadPromise('api/salud/documento/adjunto', params, showSpin);
          },

          setPaso1: function(data) {
              firstStep = data;
          },

          getPaso1: function(quotationNumber, showspin) {
              var self = this;
              return $q(function (resolve, reject) {
                if (Object.keys(firstStep).length === 0 || quotationNumber != firstStep.NumeroDocumento) {
                  thirdStep = {};
                  cuestionarioInfo = {};
                  saludFactory.getSuscripcion(quotationNumber, showspin).then(function(res) {
                    if (res.OperationCode === 200) {
                      self.setPaso1(res.Data);
                      resolve(res.Data);
                    } else {
                      reject(res.error);
                    }
                  });
                } else {
                  resolve(firstStep);
                }
              });
          },

          ordenarPreguntasHijasRptas: function(preguntas, depNroDocumentos) {
            var self = this;

            preguntasRpta.forEach( function (cuestionario, keyDependiente) {
              self.ordenarPreguntasHijas(cuestionario.preguntas, dependientesOrden[keyDependiente], accion)
            })
          },

          ordenarRepuestasPreguntas: function (preguntasRptas) {
            var self = this;
            var rptasPregPrincipales = preguntasRptas.preguntasPrincipales;
            var detallesDept = preguntasRptas.detalle;
            cuestionarioInfo = {};
            rptasPregPrincipales.forEach(function (pregunta, index) {
              pregunta.order = index + 1;
              pregunta.ordenYDescripcion = (pregunta.TITULO) ? ((pregunta.TITULO != '' ) ? pregunta.TITULO :  'Pregunta ' + pregunta.order) : 'Pregunta ' + pregunta.order;
              pregunta.response = pregunta.Respuesta.VALOR_RPTA;
              pregunta.valid = pregunta.Respuesta.VALOR_RPTA == 'S';
              cuestionarioInfo[pregunta.COD_PRGNTA] = pregunta;
            });

            detallesDept.forEach(function (dependiente, key) {
              dependiente.preguntasPrincipales.forEach(function (pregPrincipal) {
                if (cuestionarioInfo[pregPrincipal.COD_PRGNTA]){
                  var preguntasOrdenadas = self.ordenarPreguntasInternas(pregPrincipal.preguntas);
                  if (key == 0) {

                    cuestionarioInfo[pregPrincipal.COD_PRGNTA].hijosOrdenHtml = preguntasOrdenadas.hijosOrdenHtml;
                    cuestionarioInfo[pregPrincipal.COD_PRGNTA].hijosOrdenSimple = preguntasOrdenadas.hijosOrdenSimple;
                    cuestionarioInfo[pregPrincipal.COD_PRGNTA].cuestionarios = {};
                  }
                  cuestionarioInfo[pregPrincipal.COD_PRGNTA].cuestionarios[dependiente.cod_docum] = {
                    respuestas: preguntasOrdenadas.respuestas,
                    valid: preguntasOrdenadas.cuestionarioHijoValido
                  };
  
                  if (preguntasOrdenadas.cuestionarioHijoValido) {
                    var cantCuestionariosValidos = cuestionarioInfo[pregPrincipal.COD_PRGNTA].cantCuestionariosValidos || 0;
                    cuestionarioInfo[pregPrincipal.COD_PRGNTA].cantCuestionariosValidos = cantCuestionariosValidos + 1;
                  }
                } 
              });
            });
            cuestionarioInfo;
          },

          ordenarPreguntasHijas: function(preguntas)   {
            var self = this;
            preguntas.forEach(function (pregunta, index) {
              var preguntasOrdenadas = self.ordenarPreguntasInternas(pregunta.HIJOS);
              pregunta.hijosOrdenHtml = preguntasOrdenadas.hijosOrdenHtml;
              pregunta.hijosOrdenSimple = preguntasOrdenadas.hijosOrdenSimple;
              pregunta.order = index + 1;
              pregunta.ordenYDescripcion = (pregunta.TITULO) ? ((pregunta.TITULO != '' ) ? pregunta.TITULO :  'Pregunta ' + pregunta.order) : 'Pregunta ' + pregunta.order;
              pregunta.cuestionarios = {};
              pregunta.subPreguntasHijas = preguntasOrdenadas.subPreguntasHijas;

              if (!angular.isObject(cuestionarioInfo[pregunta.COD_PRGNTA])) {
                cuestionarioInfo[pregunta.COD_PRGNTA] = pregunta;
                cuestionarioInfo[pregunta.COD_PRGNTA].cuestionarios = {};
              }
            });
          },

          ordenarPreguntasInternas: function(preguntasHijas, rptas, hijosGeneral, padre, subPregHijas) {
            var self = this;
            var i = 0 ;
            var j = 0;
            var hijosTipoOpciones = [];
            var hijosTipoNormal = [];
            var hijosGeneral = hijosGeneral || [];
            var respuestas = rptas || {} ;
            var cuestionarioHijoValido = true;
            var subPreguntasHijas = subPregHijas || {};

            preguntasHijas.forEach(function (hijo) {
              hijosGeneral.push(hijo);
              if (!angular.isUndefined(padre)) {
                subPreguntasHijas[hijo.COD_PRGNTA] = {parent: padre.COD_PRGNTA}
              }

              if (angular.isObject(hijo.Respuesta)  && Object.keys(hijo.Respuesta).length > 0) {
                if (hijo.TIPO == 4 && hijo.Respuesta.VALOR_RPTA != '') {
                  var fechas = hijo.Respuesta.VALOR_RPTA.split('/')
                  respuestas[hijo.COD_PRGNTA] = new Date(fechas[1] + '/' + fechas[0] + '/' + fechas[2]);
                } else {
                  respuestas[hijo.COD_PRGNTA] = hijo.Respuesta.VALOR_RPTA;
                }
                if (cuestionarioHijoValido && hijo.Respuesta.VALOR_RPTA == '') {
                  cuestionarioHijoValido = false;
                }
              } else {
                cuestionarioHijoValido = false;
              }

              if (hijo.TIPO == 1) {
                if (angular.isUndefined(hijosTipoOpciones[j])) {
                  hijosTipoOpciones[j] = [];
                }
                hijosTipoOpciones[j].push(hijo)
                j++;

                if (!angular.isUndefined(hijo.HIJOS) && hijo.HIJOS.length > 0) {
                  var preguntasOrdenadas = self.ordenarPreguntasInternas(hijo.HIJOS, respuestas, hijosGeneral, hijo, subPreguntasHijas);
                  hijo.hijosOrdenHtml = preguntasOrdenadas.hijosOrdenHtml;
                  hijosGeneral = preguntasOrdenadas.hijosOrdenSimple;
                  respuestas = preguntasOrdenadas.respuestas;
                  subPreguntasHijas = preguntasOrdenadas.subPreguntasHijas;
                }
              } else if (hijo.TIPO == 2 || hijo.TIPO == 4 || hijo.TIPO == 7) {
                var indice = Math.floor(i / 3);
                if (hijosTipoNormal[indice] === undefined) hijosTipoNormal[indice] = [];
                hijosTipoNormal[indice].push(hijo)
                i++;
              }

            });

            return {
              hijosOrdenHtml: hijosTipoOpciones.concat(hijosTipoNormal),
              hijosOrdenSimple: hijosGeneral,
              respuestas: respuestas,
              cuestionarioHijoValido: cuestionarioHijoValido,
              subPreguntasHijas: subPreguntasHijas
            }
          },

          getPaso2: function(nroCuestionario, aseguradosNumDoc) {
              var self = this;
              return $q(function (resolve, reject) {
                if (_.isEmpty(cuestionarioInfo, true)) {
                  if (angular.isUndefined(nroCuestionario)) {
                    self.getPreguntasService(3).then(function (res) {
                      if (res.COD === 200) {
                        self.ordenarPreguntasHijas(res.Resultado, aseguradosNumDoc)
                        resolve(self.getCuestionarioInfo());
                      } else {
                        reject(res.error);
                      }
                    });

                  } else {
                    self.getRespuestasService(nroCuestionario).then(function (res) {
                      if (res.COD === 200) {
                        self.ordenarRepuestasPreguntas(res.Resultado)
                        resolve(self.getCuestionarioInfo());
                      } else {
                        reject(res.error);
                      }
                    });
                  }

              } else {
                  resolve(self.getCuestionarioInfo());
              }
            });
          },

          setPaso2: function (data) {
            return cuestionarioInfo = data;
          },

          getRespuestasService: function (params) {
            return saludFactory.getCuestionarioRespuestas(params, true);
          },

          getPreguntasService: function (params) {
            return saludFactory.getCuestionario(params, true);
          },

          getCuestionarioInfo: function() {
            var newcuestionarioInfo = {}
            for ( var elem in cuestionarioInfo){
              if (!angular.isObject(newcuestionarioInfo[cuestionarioInfo[elem].ORDERN])) {
                newcuestionarioInfo[cuestionarioInfo[elem].ORDERN] = cuestionarioInfo[elem];
              }
            }
            cuestionarioInfo = newcuestionarioInfo
            return cuestionarioInfo;
          },

          getPaso3: function (number) {
            var self = this;
            return $q(function (resolve, reject) {
              if (Object.keys(thirdStep).length === 0) {
                var params = {
                  NumeroDocumentoEncrypt: number,
                  cod_grupo_documento: 4,
                  valores: [
                    {
                      etiqueta: "CNTNDD",
                      valor: "S"
                    },
                  ]
                }

                saludFactory.getInformacionDocumentos(params, true).then(function(res) {
                  if (res.COD === 200) {
                    var dataDoc = res.Resultado
                    dataDoc.forEach(function (files) {
                      if(files.Archivos && files.Archivos.length > 0){
                        var archivos = [];
                        var archivos2 = [];
                        files.Archivos.forEach(function (ar) {
                          archivos.push(ar.NombreOriginal);
                          archivos2.push(ar.NombreTemp);
                        });
                        files.fileNombre = archivos;
                        files.fileGuardado = archivos2;
                        
                      }
                    });
                    self.setPaso3(dataDoc);
                    resolve(dataDoc);
                  } else {
                    reject(res.error);
                  }
                });
              } else {
                  resolve(thirdStep);
              }
            });
          },

          setPaso3: function (data) {
            thirdStep = data;
          },
          setmotivoSolicitud: function(value){
            motivoSolicitud = value;
          },
          getmotivoSolicitud: function(){
            return motivoSolicitud;
          },
          setitemSaludBandeja: function(value){
            itemSaludBandeja = value;
          },
          getitemSaludBandeja: function(){
            return itemSaludBandeja;
          },
          setPaso1ClinicaDigital: function(data) {
            firstStepClinicaDigital = data;
          },
          getPaso1ClinicaDigital: function(quotationNumber, showspin, firsts) {
            return $q(function (resolve, reject) {
              if(firsts){
                resolve(firstStepClinicaDigital);
              }
              else if (Object.keys(firstStepClinicaDigital).length === 0 || quotationNumber != firstStepClinicaDigital.NumeroDocumento) {
                saludFactory.ObtenerCotizacionClinicaDigital(quotationNumber, showspin).then(function(res) {
                  resolve(res.Data);
                }).catch(function (error){
                  reject(error);
                });
              } else {
                resolve(firstStepClinicaDigital);
              }
            });
          }
      };
  }
  return ng.module('appSalud')
    .factory('saludSuscripcionFactory', saludSuscripcionFactory);
});
