'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appAutos = angular.module('appAutos');

		appAutos.factory('vidaFactory',
			['$http', '$q', 'proxyGeneral', 'proxyVida', 'proxyGestor', 'proxyAgente', 'proxyProducto',
			'proxyCotizacion', 'httpData', 'vidaService', 'mpSpin', 'proxyTipoDocumento', 'proxyContratante',
			'proxyEmision', 'mainServices', 'mModalAlert',
			function($http, $q, proxyGeneral, proxyVida, proxyGestor, proxyAgente, proxyProducto,
			proxyCotizacion, httpData, vidaService, mpSpin, proxyTipoDocumento, proxyContratante,
			proxyEmision, mainServices, mModalAlert){

			/*##################################
			# servicesMapfre
			##################################*/
			var cuestionario = {
				endpoint: constants.system.api.endpoints.wcfCuestionario + 'wsrCuestionario.svc/',
				recuperarCuestionario: function (productoCode, showSpin) {
					var params = {
						cod_cuestionario: 1,
						codModalidad: productoCode
					};
					return httpData['get'](cuestionario.endpoint + 'recuperar_cuestionario', { params: params, skipAuthorization: true }, undefined, showSpin);
				}
			}

			var verificarCodigoPromocion = {
				endpoint: constants.system.api.endpoints.policy + "api/Vida/vidaRenta/promocion/",
				verificarCodigo: function (bodyParams,reqParams, showSpin) {
				  return httpData["post"](verificarCodigoPromocion.endpoint + reqParams + "/validacion",bodyParams, undefined, showSpin);
				},
			}
			var obtenerResumen = {
				endpoint: constants.system.api.endpoints.policy + "api/Vida/vidaRenta/cotizaciones",
				getData: function (params, showSpin) {
				  return httpData["post"](obtenerResumen.endpoint, params, undefined, showSpin);
				}
			}

			var evaluarCotizacion = {
				endpoint: constants.system.api.endpoints.wcfCWVI + 'wsrEvaluarCotizacion.svc/',
				evaluacionIMC: function(params, showSpin){
					return httpData['get'](evaluarCotizacion.endpoint + 'Evaluacion_IMC', {params: params}, undefined, showSpin);
				},
				evaluacionCumulo: function(params, showSpin){
					return httpData['get'](evaluarCotizacion.endpoint + 'Evaluacion_Cumulo', {params: params}, undefined, showSpin);
				},
				recuperarRespuestasDPS: function(quoteNumber, showSpin){
					var vParams = {
						cod_cotizacion: quoteNumber
					};
					return httpData['get'](evaluarCotizacion.endpoint + 'recuperar_respuestas_DPS', {params: vParams}, undefined, showSpin);
				},
				evaluarCotizacion: function(data, showSpin) {
					return httpData.post(evaluarCotizacion.endpoint + 'evaluar_cotizacion/', data, undefined, showSpin);
				},
				listarDocumentosRequeridos: function(quoteNumber, showSpin){
					var vParams = {
						cod_cotizacion: quoteNumber
					};
					return httpData['get'](evaluarCotizacion.endpoint + 'listar_documentos_requeridos', {params: vParams}, undefined, showSpin);
				},
				modificarDocumentosRequeridos: function(quoteNumber, docs, showSpin) {
				  var data = {
            cod_cotizacion: quoteNumber,
            lista_documentos_requeridos: docs
          };
					return httpData['post'](evaluarCotizacion.endpoint + 'modificar_documentos_requeridos/', data, undefined, showSpin);
				},
				getResultadosDPS: function(quoteNumber, showSpin){
					return httpData['get'](evaluarCotizacion.endpoint + 'getResultados/' + quoteNumber, null, undefined, showSpin);
				}
			};

			var recuperarDatos = {
				endpoint: constants.system.api.endpoints.wcfCWVI + 'wsrRecuperarDatos.svc/',
				recuperarCuestionarioDPS: function(showSpin) {
				  return httpData['get'](recuperarDatos.endpoint + 'recuperar_cuestionarioDPS', null, undefined, showSpin);
        }
			};

			var solicitudCotizacion = {
				recuperarCotizacion: function(quoteNumber, showSpin){
					var vParams = {
            cod_cotizacion: quoteNumber
          };
          return proxyVida.ObtenerCotizacion(quoteNumber, showSpin);
				},
        enviarCorreoCotizacion: function(quoteNumber, showSpin){
          var vParams = {
            cod_cotizacion: quoteNumber
          };
          return proxyVida.EnviarPdfCotizacion(quoteNumber, showSpin);	
        },
        generarPDFCotizacion: function(quoteNumber, showSpin){
          var vParams = {
            cod_cotizacion: quoteNumber
          };
          return proxyVida.ObtenerPdfCotizacion(quoteNumber, showSpin);
				}
			};

			/*##################################
			# orchestrator
			##################################*/
      var cotizador = {
		    endpoint: constants.system.api.endpoints.orchestrator,
      	cotizarVida: function (params, showSpin){
      		return httpData['post'](cotizador.endpoint + 'rest/cotizador/cotizarVida', params, {skipAuthorization: true}, showSpin);
      	}
      };

      var emisor = {
		    endpoint: constants.system.api.endpoints.orchestrator,
        emisorVida: function(params, showSpin) {
        	return httpData['post'](emisor.endpoint + 'rest/emisor/emitirVida', params, {skipAuthorization: true}, showSpin);
        }
			};





			var proxyProducto = proxyProducto;
			var proxyTipoDocumento = proxyTipoDocumento;
			var proxyGeneral =proxyGeneral;
			var proxyContratante = proxyContratante;

			function fnServiceUploadPromise(url, params, showSpin){
				var vConfig = {
					transformRequest: angular.identity,
					headers: {
						'Content-Type': undefined
					}
				};
				var vParams = vidaService.fnConvertFormData(params);
				return httpData['post'](constants.system.api.endpoints.policy + url, vParams, vConfig, showSpin);
			}


			function cargaAltaDocumental(params, showSpin){
				// proxyVida.CargaAltaDocumental
				if (params.fieldNameHere){
					return fnServiceUploadPromise('api/Vida/cargaAltaDocumental', params, showSpin);
				}else{
					var deferred = $q.defer(),
							vResponse = {
								OperationCode : 200,
								Data 					: {
									ValueResult: ''
								}
							};
					deferred.resolve(vResponse);
					return deferred.promise;
				}
			}



			/*##################################
			# maintenance
			##################################*/

			//https://mxperu.atlassian.net/browse/OIM-593
			function filterMaintenance(params, showSpin){
				return proxyGeneral.GetListVariableOIMPag(params, showSpin);
			}

			function saveMaintenance(option, params, showSpin){
				switch(option) {
					case 'r':
						return proxyGeneral.InsVariableOIM(params, showSpin);
						break;
					case 'u':
						return proxyGeneral.UpdVariableOIM(params, showSpin);
						break;
					// default:
					// 	code block
				}
			}

			// function updateMaintenance(params, showSpin){
			// 	return proxyGeneral.UpdVariableOIM(params, showSpin);
			// }
			//codigo y valor se envia

			function deleteMaintenance(code, value, showSpin){
				return proxyGeneral.DelVariableOIM(code, value, showSpin);
			}



			/*##################################
			# fileInterest
			##################################*/

			//https://mxperu.atlassian.net/browse/OIM-584
			function filterFileInterest(params, showSpin){
				return proxyVida.GetListArchivoPag(params, showSpin);
			}
			//https://mxperu.atlassian.net/browse/OIM-586
			function saveFileInterest(option, file, paramsFile){
				// return proxyVida.InsArchivo(showSpin);
				var fd = new FormData();
				fd.append("Descripcion", paramsFile.Description);
				fd.append("Nombre", paramsFile.Name);
				fd.append("Estado", paramsFile.Estate);
				fd.append("UsuarioCreacion", paramsFile.userCreation);
				fd.append("fieldNameHere", file);

				if (option == 'r'){
					return $http.post(constants.system.api.endpoints.policy + 'api/Vida/archivos/', fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					});
				}else{
					fd.append("Codigo", paramsFile.Code);
					return $http.put(constants.system.api.endpoints.policy + 'api/Vida/archivos/', fd, {
						transformRequest: angular.identity,
						headers: {
							'Content-Type': undefined
						}
					});
				}
			}

			function downloadFileInterest(codeFile){
				var paramsFile = {
					codeFile: codeFile
				}
				return constants.system.api.endpoints.policy + 'api/Vida/archivos/descargar/' + paramsFile.codeFile;
			}


			/*##################################
			# summaryReport
			##################################*/
			//https://mxperu.atlassian.net/browse/OIM-375
			function getGestor(params, showSpin){
				return proxyGestor.GetListGestor(params, showSpin);
			}
			//https://mxperu.atlassian.net/browse/OIM-377
			function getAgent(params, showSpin){
				return proxyAgente.GetListAgenteVida(params, showSpin);
			}
			//https://mxperu.atlassian.net/browse/OIM-607
			function filterSummaryEquipment(params, showSpin){
				return proxyVida.ListarResumenEquipo(params, showSpin);
			}
			//https://mxperu.atlassian.net/browse/OIM-608
			function filterSummaryAgent(params, showSpin){
				return proxyVida.ListarResumenAgentePag(params, showSpin);
			}


			/*##################################
			# Documents
			##################################*/
			//pendingQuotes
			//https://mxperu.atlassian.net/browse/OIM-470
			function getProducts(showSpin){
				return proxyProducto.GetListProductoVida(showSpin);
			}
			//https://mxperu.atlassian.net/browse/OIM-599
			function filterPendingQuotes(params, showSpin){
				return proxyCotizacion.ListarCotizacionPendientePag(params, showSpin);
			}
			//emittedQuotes
			//https://mxperu.atlassian.net/browse/OIM-600
			function filterEmittedQuotes(params, showSpin){
				return proxyCotizacion.ListarCotizacionEnviadaPag(params, showSpin);
			}
			//referred
			//https://mxperu.atlassian.net/browse/OIM-601
			function filterRefrred(params, showSpin){
				return proxyCotizacion.ListarCotizacionReferidoPag(params, showSpin);
			}
			function usersCanEmit(params, showSpin){
				return proxyGeneral.ValidarAccesoUsuario(params, showSpin);
			}
			function generarPDF (params, vFileName){
				const opcMenu = localStorage.getItem('currentBreadcrumb');
				const urlRquest = constants.system.api.endpoints.policy + 'api/reporte/vida/cotizacion/' +  params + '?COD_OBJETO=.&OPC_MENU='+ opcMenu;
			return httpData.postDownload(
				urlRquest,
				undefined,
				{ 
					responseType: 'arraybuffer' 
				},
				true
			).then(
				function(data){
					mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
				}
			);
			}

			function esUsuarioEspecial() {
				return proxyVida.EsUsuarioEspecial(true);
      }

      function getListEndosatario() {
        return proxyContratante.GetListEndosatario();
      }

      function getEndosatarioByRuc(ruc, showSpin) {
        return proxyContratante.GetEndosatarioTerceroByRucAndCia(ruc, constants.module.polizas.vida.companyCode, showSpin);
      }

			function getAutocompleteEndorseeByName(name, showSpin) {
				var params = {
					Search: name,
					CodCia: constants.module.polizas.vida.companyCode
				};

        return proxyContratante.GetEndosatarioTerceroAutocomplete(params, showSpin);
      }

			return{
				filterMaintenance: filterMaintenance,
				saveMaintenance: saveMaintenance,
				// updateMaintenance: updateMaintenance,
				deleteMaintenance: deleteMaintenance,
				filterFileInterest: filterFileInterest,
				saveFileInterest: saveFileInterest,
				downloadFileInterest: downloadFileInterest,
				getGestor: getGestor,
				getAgent: getAgent,
				filterSummaryEquipment: filterSummaryEquipment,
				filterSummaryAgent: filterSummaryAgent,
				getProducts: getProducts,
				filterPendingQuotes: filterPendingQuotes,
				filterEmittedQuotes: filterEmittedQuotes,
				filterRefrred: filterRefrred,
				usersCanEmit : usersCanEmit,
				cargaAltaDocumental: cargaAltaDocumental,
				cuestionario: cuestionario,
				evaluarCotizacion: evaluarCotizacion,
				recuperarDatos: recuperarDatos,
				solicitudCotizacion: solicitudCotizacion,
				cotizador: cotizador,
        emisor: emisor,
				proxyProducto: proxyProducto,
				proxyTipoDocumento: proxyTipoDocumento,
				proxyGeneral: proxyGeneral,
				proxyContratante: proxyContratante,
				proxyCotizacion: proxyCotizacion,
				obtenerResumen: obtenerResumen,
				verificarCodigoPromocion: verificarCodigoPromocion,
				proxyEmision: proxyEmision,
				generarPDF: generarPDF,
        esUsuarioEspecial: esUsuarioEspecial,
        getListEndosatario: getListEndosatario,
        getEndosatarioByRuc: getEndosatarioByRuc,
				getAutocompleteEndorseeByName: getAutocompleteEndorseeByName
			};

		}]);

		/*########################
    # service
    ########################*/
		appAutos.service('vidaService', function(){

			/*########################
      # fnConvertFormData
      ########################*/
			function fnConvertFormData(params){
				var fd = new FormData();
				angular.forEach(params, function(value, key) {
					fd.append(key, value);
				});
				return fd;
			}

			/*########################
      # funDocNumMaxLength
      ########################*/


      /*########################
      # funDocNumMaxLength
      ########################*/
      function docNumMaxLength(documentType){
        var vDocumentType = documentType;
        var vDocNumMaxLength;
        switch(vDocumentType) {
          case constants.documentTypes.dni.Codigo:
            vDocNumMaxLength = 8;
            break;
          case constants.documentTypes.ruc.Codigo:
            vDocNumMaxLength = 11;
            break;
          default:
            vDocNumMaxLength = 13;
        }
        return vDocNumMaxLength;
      }
      /*########################
      # toDate
      ########################*/
      function toDate(ins) {
				if (!ins || ins ==='') {
					return new Date();
				}

				return new Date(ins.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$3-$2-$1'));
			}
			function outputFormatDatePicker(stringDate){
				var vResul = null;
				if (stringDate !== ""){
					var vBirthDate = stringDate.split("/");
					vResul = new Date(vBirthDate[2], vBirthDate[1] - 1, vBirthDate[0]);
				}
				return vResul;
			}

			function fnStartsWith(cadena, startsWith){
				var vResult = cadena.substring(0,2).indexOf(startsWith) >= 0;
        return vResult
			}

			this.docNumMaxLength = docNumMaxLength;
			this.toDate = toDate;
			this.outputFormatDatePicker = outputFormatDatePicker;
			this.fnStartsWith = fnStartsWith;
			this.fnConvertFormData = fnConvertFormData;

		});


		appAutos.constant('vidaRoles', {
			admin: 'ADMIN',
			director: 'DIRECTOR',
			gestor: 'GESTOR',
			supervisor: 'SUPERVISOR',
			agente: 'AGENTE',
			agentev: 'AGENTEV',
			agentep: 'AGENTEP',
			corredor: 'CORREDOR',
      eac: 'EAC',
      directore: 'DIRECTORE',
      eacemi: 'EACEMI',
      gestoremi: 'GESTOREMI'
		});

});