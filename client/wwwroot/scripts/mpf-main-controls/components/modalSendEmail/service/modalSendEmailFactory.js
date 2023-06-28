'use strict'

define([
	'angular', 'constants'
], function(angular, constants){

		var appControls = angular.module('mapfre.controls');

		appControls.factory('modalSendEmailFactory', [
			'proxyMail',
			'proxyClinicaDigital',
			'proxySctr',
			'$http',
			'$q',
      'proxyEmpresa',
      'proxyVidaLey',
			function(
				proxyMail,
				proxyClinicaDigital,
				proxySctr,
				$http,
				$q,
        proxyEmpresa,
        proxyVidaLey
				){

			var base = constants.system.api.endpoints.policy;

			function sendEmail(action, data){
				var accion;

				if((typeof action.action == 'undefined')){
					accion = action;
				}else{
					accion = action.action;
				}
				// debugger;
				switch (accion) {
					case "cotizar":
						return sendEmailQuote(data);
					case "emitir":
						return sendEmailEmit(data);
					case "emitirAuto":
						return sendEmailEmitAutos(data);
			 		case "emitirEmpresa":
			 			return SendMailCotizacionEmpresa(data, false);
			 		case "enviarPolizaEmitida":
			 			return SendMailPolizaEmitidaEmpresa(data, false);
					case 'hogarQuote':
						return sendEmailHogarQuote(data, false);
					case 'hogarEmit':
						return sendEmailHogarEmit(data, false);
					case 'soat':
						return sendEmailSOAT(data, false);
					case 'accidentesQuote':
						return sendEmailAccidentesQuote(data, false);
					case 'emitirTransporte':
						return sendEmailTransporteEmir(data, false);
					case 'cotizarVida':
						return sendEmailVidaCotizacion(data, false);
					case 'sctr':
						return sendEmailSCTR(data, false);
					case 'soatElectronico':
						return sendEmailSOATElectronico(data, false);
					case 'agenteDigital':
						return sendEmailSOATAgtDigital(data, false);
					case 'salud':
            			return sendEmailSalud(data, false);
					case 'salud2':
						return SendMailSolicitudSalud(data, false);
					case 'seguroViajeQuote':
						return sendEmailSeguroViajeQuote(data, false);
					case 'seguroViajeEmit':
						return sendEmailSeguroViajeEmit(data, false);
					case 'vidaLeyCotizar':
						return sendEmailVidaleyCotizar(data, false);
					case 'clinicaDigital':
						return sendEmailClinicaDigital(data, false);
					case 'vidaLeyEmitir':
						  return sendEmailVidaleyEmitir(data, false);
					default:
						return $q(function(resolve, reject) {
							setTimeout(function() {
								reject("Action " + action + " no definido");
							}, 1000);
						})
				}
			}

			function sendEmailSOAT(data){
				return $http.post(base + 'api/general/mail/emisionSoat/sendMail', data, { headers: { 'Content-Type': 'application/json' } });
			}

			function sendEmailSOATElectronico(data){
				return $http.post(base + 'api/soat/mail/digital', data, { headers: { 'Content-Type': 'application/json' } });
			}

			function sendEmailSOATAgtDigital(data){
				return $http.post(base + 'api/general/mail/emisionSoat/sendeMailEmisionBancario', data, { headers: { 'Content-Type': 'application/json' } });
			}

			function sendEmailQuote(data){
				return $http.post(base + 'api/general/mail/cotizacion/sendMail', data, { headers: { 'Content-Type': 'application/json' } });
			}

			function sendEmailEmit(data){
				return $http.post(base + 'api/general/mail/emision/sendMail', data, { headers: { 'Content-Type': 'application/json' } });
			}
			function sendEmailEmitAutos(data){
				return $http.post(base + 'api/general/mail/emision/autos', data, { headers: { 'Content-Type': 'application/json' } });
			}

			//https://mxperu.atlassian.net/browse/OIM-466
			// 2 Formas de envio de data, cuando la cotizacion ESTA guardada y cuando NO
			// Ejm: quoteS2.js => sendEmail = Cotizacion NO guardada
			// Ejm: generatedletter.js => sendEmail = Cotizacion SI guardada

			function SendMailCotizacionEmpresa(data, showSpin){
				return proxyEmpresa.SendMailCotizacion(data, showSpin);
			}

			function SendMailPolizaEmitidaEmpresa(data, showSpin){
				return proxyEmpresa.SendMailEmision(data, showSpin)
			}

			function sendEmailHogarQuote(data, showSpin){
				return proxyMail.SendMailCotizacionHogar(data, showSpin);
			}

			//https://mxperu.atlassian.net/browse/OIM-509
			function sendEmailHogarEmit(data, showSpin){
				return proxyMail.SendMailDocumento(data, showSpin);
			}


			function sendEmailAccidentesQuote(data, showSpin){
				return proxyMail.SendMailCotizacionAccidente(data, showSpin);
			}

			function sendEmailTransporteEmir(data,showSpin) {
				return proxyMail.SendMailCotizacionTransporte(data, showSpin);
			}

			function sendEmailVidaCotizacion(data, showSpin) {
				return proxyMail.SendMailCotizacionVida(data, showSpin);
			}

			function sendEmailSCTR(data, showSpin) {
				return proxySctr.SendBandejaMail(data, showSpin);
			}

			function sendEmailSalud(data, showSpin) {
				return proxyMail.SendMailCotizacionSalud(data, showSpin);
      		}
			function SendMailSolicitudSalud(data, showSpin) {
				return proxyMail.SendMailSolicitudSalud(data, showSpin);
			}
			function sendEmailClinicaDigital(data, showSpin) {
				return proxyClinicaDigital.SendMailCotizacion(data, showSpin);
			}

      function sendEmailSeguroViajeQuote(data, showSpin) {
        return proxyTrip.SendEmailQuotation(data, showSpin);
      }

      function sendEmailSeguroViajeEmit(data, showSpin) {
        return proxyTrip.SendEmailEmission(data, showSpin);
      }

      function sendEmailVidaleyCotizar(data, showSpin) {
        return proxyVidaLey.SendMailCotizacion(data.reporteParam.numDoc, data, showSpin);
      }

	  function sendEmailVidaleyEmitir(data, showSpin) {
		return $http.post(base + 'api/vidaley/emision/'+data.reporteParam.numDoc+'/correo', data, { headers: { 'Content-Type': 'application/json' } });
      }

			return{
				sendEmail: sendEmail
			};

		}]);

});
