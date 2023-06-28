(function($root, deps, action) {
	define(deps, action);
})(this, ['angular', 'constants', 'helper', 'lodash',
	'/polizas/app/vida/proxy/vidaFactory.js',
  '/polizas/app/vida/emit/component/questions/question-item.js',
  'polizasFactory'],
	function(angular, constants, helper, _) {

		var appVida = angular.module('appVida');

		appVida.controller('vidaEmitS3',
		['$scope', '$state', '$timeout', '$window', '$filter', 'mainServices', 'mModalAlert', 'mModalConfirm',
    'vidaFactory', '$q', 'mpSpin', 'surveyDPS', 'oimPrincipal', 'polizasFactory', 'oimClaims', 'oimAbstractFactory','httpData','oimProxyPoliza', 'proxyGeneral',
		function($scope, $state, $timeout, $window, $filter, mainServices, mModalAlert, mModalConfirm,
      vidaFactory, $q, mpSpin, surveyDPS, oimPrincipal, polizasFactory, oimClaims, oimAbstractFactory, httpData, oimProxyPoliza, proxyGeneral){

      function _getDPSResultsRequiredDocuments(){
        var vQuoteNumber = $scope.firstStep.cotizacion.NumeroCotizacion;
        mainServices.fnReturnSeveralPromise([
          vidaFactory.evaluarCotizacion.getResultadosDPS(vQuoteNumber, false),
          vidaFactory.evaluarCotizacion.listarDocumentosRequeridos(vQuoteNumber, false)
        ], true).then(function(response){
          if (response[0].COD === 200 && response[1].COD === 200){
            $scope.thirdStep.resultDPS = response[0].Resultado;
            $scope.thirdStep.requiredDocs = response[1].Resultado;
            setRequiredFile();
          }else{
            if (response[0].COD === 200){
              $scope.thirdStep.resultDPS = response[0].Resultado;
            }else{
              if (response[0].COD === 400) mModalAlert.showError(response[0].MSJ, 'ERROR');
              if (response[0].COD === 500) mModalAlert.showWarning(response[0].MSJ, 'ALERTA');
            }
            if (response[1].COD === 200){
              $scope.thirdStep.requiredDocs = response[1].Resultado;
            }else{
              if (response[0].COD === 400) mModalAlert.showError(response[0].MSJ, 'ERROR');
              if (response[0].COD === 500) mModalAlert.showWarning(response[0].MSJ, 'ALERTA');
            }
          }
        },function(error){
          mModalAlert.showError('No se pudieron recuperar los resultados de la evaluación. </br> Comuníquese con su administrador', 'ERROR');
        });
      }

      function _getRequiredDocuments() {
        vidaFactory.evaluarCotizacion.listarDocumentosRequeridos($scope.firstStep.cotizacion.NumeroCotizacion, true)
          .then(function(response) {
            switch(response.COD){
              case constants.operationCode.success:
                $scope.thirdStep.requiredDocs = response.Resultado;
               setRequiredFile();
                break;
              case constants.operationCode.code400:
                mModalAlert.showError(response.MSJ, 'ERROR');
                break;
              case constants.operationCode.code500:
                mModalAlert.showWarning(response.MSJ, 'ALERTA');
                break;
              default:
                break;
            }
          });
      }
      /*########################
      # onLoad
      ########################*/
			(function onLoad() {

				$scope.mainStep = $scope.mainStep || {};
				$scope.firstStep = $scope.firstStep || {};
				$scope.secondStep = $scope.secondStep || {};
        $scope.thirdStep = $scope.thirdStep || {};
        $scope.thirdStep.esRentaSegura = $scope.firstStep.cotizacion.FlagRentaSegura === 'S';
        $scope.thirdStep.codigoRamo = $scope.firstStep.cotizacion.Producto.CodigoRamo;

        console.log("accionistas bs, step 3:", $scope);

        $scope.thirdStep.showSurveyDPS = $scope.thirdStep.showSurveyDPS || !!surveyDPS.questions;
        if ($scope.thirdStep.showSurveyDPS && !$scope.thirdStep.esRentaSegura) {
          $scope.thirdStep.answers = $scope.thirdStep.answers || [];
          $scope.thirdStep.savedAnswers = surveyDPS.answers;
          $scope.thirdStep.answeredAllQuestions = $scope.thirdStep.answeredAllQuestions || !!surveyDPS.answers.length || false;
          $scope.thirdStep.showQuestionary = !$scope.thirdStep.answeredAllQuestions;
          $scope.thirdStep.questionsDPS = $scope.thirdStep.questionsDPS || _questionsDPS(angular.copy(surveyDPS.questions));

          if (!$scope.thirdStep.showQuestionary && !$scope.thirdStep.resultDPS) {
            _getDPSResultsRequiredDocuments();
          }
        } else {
          _getRequiredDocuments();
        }
      })();

      getEncuesta();

      function getEncuesta(){
        var codCia = constants.module.polizas.vida.companyCode;
        var codeRamo = $scope.firstStep.cotizacion.Producto.CodigoRamo;
  
        proxyGeneral.GetEncuesta(codCia, codeRamo, false).then(function(response) {
          if(response.OperationCode == constants.operationCode.success){
          if (Object.keys(response.Data.Pregunta).length > 0){
            $scope.encuesta = response.Data;
            $scope.encuesta.CodigoCompania = codCia;
            $scope.encuesta.CodigoRamo = codeRamo;
          }else{
            $scope.encuesta = {};
            $scope.encuesta.mostrar = 0;
          }
          }
        }, function(error){
          console.log('Error en getEncuesta: ' + error);
        })
      }


      function _questionsDPS(arrayQuestions) {
				var vTYPE = {
					INPUT_RADIO: 					1,
					INPUT_TEXT: 					2,
					INPUT_NUMBER: 				3,
					DATE_PICKER: 					4,
					SUB_TITLE_QUESTIONS: 	5,
					SUB_TITLE: 						6,
					SELECT: 							7,
          TEXT_AREA:            9
				};

				function parseDate(stringDate) {
				  var dateElements = stringDate.split('-');
				  return new Date(+dateElements[2], +dateElements[1] - 1, +dateElements[0]);
        }

				function updateQuestions(question, answers) {
          if (answers && answers.length) {
            var answer = _.find(answers, function(a) {
              return a && a.cod_prgnta === question.COD_PRGNTA;
            });

            if (answer) {
              var value = answer.valor_rpta;
              switch (question.TIPO) {
                case vTYPE.DATE_PICKER:
                  value = parseDate(value);
                  break;
                case vTYPE.SELECT:
                  value = {CODIGO: +value, NOMBRE: answer.descrpcn_rpta};
                  break;
              }

              question.value = value;

              fnShowContentYesNo(question);
            }
          }
          return question;
        }

				var vNewArrayQuestions = [];
				var questionIdx = 0;
				angular.forEach(arrayQuestions, function(question) {
          question = updateQuestions(question, $scope.thirdStep.savedAnswers);
					angular.forEach(question.HIJOS, function(child) {
            child = updateQuestions(child, $scope.thirdStep.savedAnswers);
            child.HIJOS = child.HIJOS.map(function(grandchild) {
              return updateQuestions(grandchild, $scope.thirdStep.savedAnswers);
            });
						if (question.TIPO === vTYPE.SUB_TITLE_QUESTIONS) {
							child.parentQuestion = question.DSCRPCN;
							child.index = questionIdx;
							vNewArrayQuestions.push(child);
							putAnswers(child);
              questionIdx++;
						}
					});
					if (question.TIPO !== vTYPE.SUB_TITLE && question.TIPO !== vTYPE.SUB_TITLE_QUESTIONS) {
					  question.index = questionIdx;
						vNewArrayQuestions.push(question);
						putAnswers(question);
            questionIdx++;
					}
				});
				return vNewArrayQuestions;
			}

      function fnShowContentYesNo(item) {
				var vShowContentYesNo = {
					yes: false,
					no: false
				};

				var vValue = item.value;

				if (angular.isObject(vValue)) {
					vValue = (vValue.CODIGO) ? 'S' : 'N';
				}

				if (vValue === 'S') {
					vShowContentYesNo.yes = true;
				} else {
					vShowContentYesNo.no = true;
				}
				item.showChild = vShowContentYesNo;
			}

      $scope.fnShowContentYesNo = function(item) {
        fnShowContentYesNo(item);
      };

			function putAnswers(question) {

			  function putAnswer(q) {
			    if (!q.value) {
			      return;
          }
          var code = q.COD_PRGNTA;

          $scope.thirdStep.answers[code] = {};
          $scope.thirdStep.answers[code].cod_pregunta = q.COD_PRGNTA;

          switch (q.TIPO) {
            case 1:
              $scope.thirdStep.answers[code].cod_respuesta = q.value;
              $scope.thirdStep.answers[code].desc_respuesta = _.find(q.OPCIONES, function(o) {
                  return o.CODIGO === q.value;
                }).NOMBRE;
              break;
            case 7:
              $scope.thirdStep.answers[code].cod_respuesta = q.value.CODIGO;
              $scope.thirdStep.answers[code].desc_respuesta = q.value.NOMBRE;
              break;
            case 4:
              var stringDate = (typeof q.value.getMonth === 'function') ? q.value.getDate() + '-' + (q.value.getMonth() + 1) + '-' + q.value.getFullYear() : q.value;
              $scope.thirdStep.answers[code].cod_respuesta = stringDate;
              $scope.thirdStep.answers[code].desc_respuesta = stringDate;
              break;
            default:
              $scope.thirdStep.answers[code].cod_respuesta = q.value;
              $scope.thirdStep.answers[code].desc_respuesta = q.value;
			    }
        }

			  putAnswer(question);

			  angular.forEach(question.HIJOS, function(child) {
			    if (~child.ACTIVAR.indexOf(question.value) || (question.TIPO === 7 && question.value && ~child.ACTIVAR.indexOf('S'))) {
            putAnswer(child);
          }
			    angular.forEach(child.HIJOS, function(grandchild) {
            if (~grandchild.ACTIVAR.indexOf(child.value) || (child.TIPO === 7 && child.value && ~grandchild.ACTIVAR.indexOf('S'))) {
              putAnswer(grandchild);
            }
          });
        });
      }

      function cleanArray(answers) {
			  var cleanedArray = [];
			  for (var i = 0, x = answers.length; i < x; i++) {
			    if (answers[i]) {
            cleanedArray.push(answers[i]);
          }
        }
        return cleanedArray;
      }

      function _paramsEvaluarCotizacion(){
        angular.forEach($scope.thirdStep.questionsDPS, function(item, index){
          putAnswers(item);
        });

        var vParams = {
          cod_cotizacion:   $scope.firstStep.cotizacion.NumeroCotizacion,
          cod_ocupacion:    ($scope.firstStep.ocupacionAsegurado && $scope.firstStep.ocupacionAsegurado.Codigo !== null)
                              ? $scope.firstStep.ocupacionAsegurado.Codigo
                              : $scope.firstStep.ocupacion && $scope.firstStep.ocupacion.Codigo !== null
                              ? $scope.firstStep.ocupacion.Codigo
                              : '0',
          usuario_registro: oimPrincipal.getUsername(),
          lista_respuestas: cleanArray($scope.thirdStep.answers)
        };
        return vParams;
      }
      function quoteEvaluation(notifications) {
        var vParams = _paramsEvaluarCotizacion();
        var vParamsAuditoria = {
          TokenMapfre: oimClaims.tokenMapfre,
          CodigoAplicacion: constants.module.polizas.vida.code,
          CodigoObjeto: 1,
          DescripcionOperacion: 'evaluarCotizacion - GUARDAR DPS',
          CodigoUsuario: vParams.usuario_registro,
          IdAgente: $scope.firstStep.cotizacion.Agente.CodigoAgente,
          DescripcionMenu: 'EMISION',
          Filtro: JSON.stringify(vParams.lista_respuestas),
          Consulta: vParams.cod_cotizacion,
          Observacion: null,
          TipoRegistro: 'SE'
        };
        mainServices.fnReturnSeveralPromise([
          vidaFactory.proxyGeneral.RegistrarAuditoria(vParamsAuditoria, false),
          vidaFactory.evaluarCotizacion.evaluarCotizacion(vParams, false)
        ], true).then(function(res){
          if (res[1].COD === 200) {
            $scope.thirdStep.resultDPS = res[1].Resultado;
            $scope.thirdStep.answeredAllQuestions = true;
            $scope.thirdStep.showQuestionary = false;
            if (notifications) mModalAlert.showSuccess(res[1].Resultado.Mensaje, '');
            vidaFactory.evaluarCotizacion.listarDocumentosRequeridos($scope.firstStep.cotizacion.NumeroCotizacion, true)
              .then(function(res) {
                if (res.COD === 200) {
                  $scope.thirdStep.requiredDocs = res.Resultado;
                  setRequiredFile();
                } else {
                  if (res.COD === 400) mModalAlert.showError(res.MSJ, 'ERROR');
                  if (res.COD === 500) mModalAlert.showWarning(res.MSJ, 'ALERTA');
                }
              });
          } else {
            if (res[1].COD === 400) mModalAlert.showError(res.MSJ, 'ERROR');
            if (res[1].COD === 500) mModalAlert.showWarning(res.MSJ, 'ALERTA');
          }
        });
      }
      /*########################
      # fnSaveDPS
      ########################*/
      function _validateSurveyForm(){
        $scope.frmSurvey.markAsPristine();
        return $scope.frmSurvey.$valid;
      }
			$scope.fnSaveDPS = function() {
        // if (_validateSurveyForm()){
          mModalConfirm.confirmInfo(
            '¿Estás seguro de grabar la Declaración Personal de Salud (DPS)? <br> Al grabar ya no podrás editar las respuestas',
            'GRABAR DPS',
            'GRABAR').then(function(response) {
            quoteEvaluation(true);
          });
        // }
      };

      function _validateSurveyDPS() {
        return $scope.thirdStep.showSurveyDPS
          ? !!$scope.thirdStep.resultDPS
          : true;
      }

      function _validRequiredDoc(){
        $scope.thirdStep.frmRequiredDocuments.markAsPristine();
        return $scope.thirdStep.frmRequiredDocuments.$valid;
      }

      function _paramsCargaAltaDocumental(){
        var vFile = $scope.secondStep.fmLoadFile || {};
        var vParams = {
          NumeroCotizacion: $scope.firstStep.cotizacion.NumeroCotizacion,
          fieldNameHere: 		vFile[0]
        };
        return vParams;
      }

      function _paramsUpdateRequiredDocuments() {
        return angular.copy($scope.thirdStep.requiredDocs)
          .map(function(doc) {
            doc.mca_entregado = doc.mRequiredDoc
              ? 'S'
              : 'N';

            return doc;
          });
      }

      function _paramsEmit() {
        var vQuotation = $scope.firstStep.cotizacion,
            vFile = $scope.secondStep.fmLoadFile || {};

        function getAddress(obj, personType, parentObjCountryCode) {
          var vCodPais,
              vAddress = {
                codDepartamento:        obj.CodigoDepartamento || '0',
                codProvincia:           obj.CodigoProvincia || '0',
                codDistrito:            obj.CodigoDistrito || '0',
                tipDomicilio:           obj.CodigoVia || '0',
                nomDomicilio:           obj.NombreVia || '',
                tipNumero:              obj.CodigoNumero || '0',
                descNumero:             obj.TextoNumero || '',
                tipInterior:            obj.CodigoInterior || '0',
                nroInterior:            obj.TextoInterior || '',
                tipZona:                obj.CodigoZona || '0',
                nomZona:                obj.TextoZona || '',
                refDireccion:           obj.Referencia || '',
                codigoPostal:           ''
              };

          switch (personType){
            case 'C':
              vCodPais = (parentObjCountryCode.paisResidencia && parentObjCountryCode.paisResidencia.Codigo !== null )
                            ? parentObjCountryCode.paisResidencia.Codigo
                            : '';
              break;
            case 'I':
              vCodPais = (parentObjCountryCode.paisResidenciaAsegurado && parentObjCountryCode.paisResidenciaAsegurado.Codigo !== null )
                            ? parentObjCountryCode.paisResidenciaAsegurado.Codigo
                            : '';
              break;
            case 'B':
              vCodPais = (parentObjCountryCode.mPaisResidencia && parentObjCountryCode.mPaisResidencia.Codigo !== null )
                            ? parentObjCountryCode.mPaisResidencia.Codigo
                            : '';
              break;
          }
          vAddress.codPais = vCodPais;

          return vAddress;
        }

        function _tipoGestor(){
          var vTipoGestor = '';
          if ($scope.firstStep.IS_REQUIRED_GESTOR_COBRO){
            vTipoGestor = ($scope.secondStep.registro == 'C')
                            ? 'DB'
                            : 'TA';
          }else{
            if ($scope.secondStep.registro == 'C' && $scope.secondStep.entidad && $scope.secondStep.entidad.Codigo !== null) vTipoGestor = 'DB';
            if ($scope.secondStep.registro == 'T' && $scope.secondStep.tipoTarjeta && $scope.secondStep.tipoTarjeta.Codigo !== null) vTipoGestor = 'TA';
          }
          return vTipoGestor;
        }
        function _codGestor(){
          var vCodGestor = '';
          if ($scope.firstStep.IS_REQUIRED_GESTOR_COBRO){
            vCodGestor = ($scope.secondStep.registro == 'C')
                            ? $scope.secondStep.codigoGestorEn.Codigo
                            : $scope.secondStep.codigoGestorTa.Codigo;
          }else{
            if ($scope.secondStep.registro == 'C' && $scope.secondStep.codigoGestorEn && $scope.secondStep.codigoGestorEn.Codigo !== null) vCodGestor = $scope.secondStep.codigoGestorEn.Codigo;
            if ($scope.secondStep.registro == 'T' && $scope.secondStep.codigoGestorTa && $scope.secondStep.codigoGestorTa.Codigo !== null) vCodGestor = $scope.secondStep.codigoGestorTa.Codigo;
          }
          return vCodGestor;
        }

        var vParamsOrchestrator = {
          numCotizacion:              vQuotation.NumeroCotizacion,
          cabecera: {
            codigoAplicacion:         'OIM'
          },
          poliza: {
            codAgt:                   vQuotation.Agente.CodigoAgente,
            moneda: {
              codMon:                 vQuotation.Producto.CodigoMoneda
            }
          },
          contratante: {
            mcaFisico:                ($scope.firstStep.showNaturalRucPerson) ? 'S' : 'N',
            tipDocum:                 vQuotation.Contratante.TipoDocumento,
            codDocum:                 vQuotation.Contratante.NumeroDocumento,
            nombre:                   vQuotation.Contratante.Nombre,
            apePaterno:               vQuotation.Contratante.ApellidoPaterno || '',
            apeMaterno:               vQuotation.Contratante.ApellidoMaterno || '',
            email:                    vQuotation.Contratante.CorreoElectronico || '',
            codPaisTelefono:          $scope.firstStep.prefijo || '',
            tlfNumero:                vQuotation.Contratante.TelefonoCasa || '',
            tlfMovil:                 vQuotation.Contratante.TelefonoMovil || '',
            tlfOficina:               vQuotation.Contratante.TelefonoOficina || '',
            tipCargo:                 '',
            nomContacto:              '',
            fecNacimiento:            (vQuotation.Contratante.newFechaNacimiento && vQuotation.Contratante.newFechaNacimiento !== null) ? $filter('date')(vQuotation.Contratante.newFechaNacimiento, constants.formats.dateFormat) : '',
            mcaSexo:                  vQuotation.Contratante.Sexo || '',
            codProfesion:             ($scope.firstStep.profesion && $scope.firstStep.profesion.Codigo !== null)
                                        ? $scope.firstStep.profesion.Codigo
                                        : '0',
            codOcupacion:             ($scope.firstStep.ocupacion && $scope.firstStep.ocupacion.Codigo !== null)
                                        ? $scope.firstStep.ocupacion.Codigo
                                        : '0',
            tipActEconomica:          (vQuotation.Contratante.ActividadEconomica && vQuotation.Contratante.ActividadEconomica.Codigo !== null)
                                        ? vQuotation.Contratante.ActividadEconomica.Codigo
                                        : '',
            estadoCivil:              $scope.firstStep.cotizacion.Contratante.EstadoCivil || '',
            nacionalidad:             ($scope.firstStep.nationalityDisabled) ? $scope.firstStep.nacionalidad.Codigo : '',
            codPaisNacimiento:             vQuotation.Contratante.CodigoPaisNatal,
            codigoPaisResidenciaFiscal:    vQuotation.Contratante.CodigoPaisResidenciaFiscal,
            direccion: [
                                      getAddress($scope.firstStep.cotizacion.Contratante.Ubigeo, 'C', $scope.firstStep)
            ]
          },
          asegurado: {
            centroLaboral:            $scope.firstStep.centroTrabajoAsegurado,
            tipDocum:                 $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.TipoDocumento
                                        : vQuotation.Asegurado.TipoDocumento,
            codDocum:                 $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.NumeroDocumento
                                        : vQuotation.Asegurado.NumeroDocumento,
            nombre:                   $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.Nombre
                                        : vQuotation.Asegurado.Nombre,
            apePaterno:               $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.ApellidoPaterno || ''
                                        : vQuotation.Asegurado.ApellidoPaterno || '',
            apeMaterno:               $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.ApellidoMaterno || ''
                                        : vQuotation.Asegurado.ApellidoMaterno || '',
            email:                    $scope.firstStep.mIgualAsegurado
                                        ? $scope.firstStep.cotizacion.Contratante.CorreoElectronico || ''
                                        : $scope.firstStep.cotizacion.Asegurado.CorreoElectronico || '',
            codPaisTelefono:          ($scope.firstStep.mIgualAsegurado)
                                        ? $scope.firstStep.prefijo || ''
                                        : $scope.firstStep.prefijoAsegurado || '',
            tlfNumero:                $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.TelefonoCasa || ''
                                        : vQuotation.Asegurado.TelefonoCasa || '',
            tlfMovil:                 $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.TelefonoMovil || ''
                                        : vQuotation.Asegurado.TelefonoMovil || '',
            tlfOficina:               $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.TelefonoOficina || ''
                                        : vQuotation.Asegurado.TelefonoOficina || '',
            fecNacimiento:            $scope.firstStep.mIgualAsegurado
                                        ? (vQuotation.Contratante.newFechaNacimiento && vQuotation.Contratante.newFechaNacimiento !== null)
                                          ? $filter('date')(vQuotation.Contratante.newFechaNacimiento, constants.formats.dateFormat)
                                          : ''
                                        : vQuotation.Asegurado.FechaNacimiento || '',
            mcaSexo:                  $scope.firstStep.mIgualAsegurado
                                        ? vQuotation.Contratante.Sexo || ''
                                        : vQuotation.Asegurado.Sexo || '',
            codProfesion:             $scope.firstStep.mIgualAsegurado
                                        ? ($scope.firstStep.profesion && $scope.firstStep.profesion.Codigo !== null)
                                            ? $scope.firstStep.profesion.Codigo
                                            : '0'
                                        : ($scope.firstStep.profesionAsegurado && $scope.firstStep.profesionAsegurado.Codigo !== null)
                                            ? $scope.firstStep.profesionAsegurado.Codigo
                                            : '0',
            codOcupacion:             $scope.firstStep.mIgualAsegurado
                                        ? ($scope.firstStep.ocupacion && $scope.firstStep.ocupacion.Codigo !== null)
                                            ? $scope.firstStep.ocupacion.Codigo
                                            : '0'
                                        : ($scope.firstStep.ocupacionAsegurado && $scope.firstStep.ocupacionAsegurado.Codigo !== null)
                                            ? $scope.firstStep.ocupacionAsegurado.Codigo
                                            : '0',
            estadoCivil:              $scope.firstStep.mIgualAsegurado
                                        ? $scope.firstStep.cotizacion.Contratante.EstadoCivil || ''
                                        : $scope.firstStep.cotizacion.Asegurado.EstadoCivil || '',
            nacionalidad:             ($scope.firstStep.nationalityDisabled && $scope.firstStep.mIgualAsegurado)
                                        ? vQuotation.Contratante.CodigoPaisNatal : vQuotation.Asegurado.CodigoPaisNatal,
            codPaisNacimiento:           $scope.firstStep.mIgualAsegurado ? vQuotation.Contratante.CodigoPaisResidencia || ''  : vQuotation.Asegurado.CodigoPaisResidencia || '',
            direccion: [
                                      getAddress(
                                        $scope.firstStep.mIgualAsegurado
                                          ? $scope.firstStep.cotizacion.Contratante.Ubigeo
                                          : $scope.firstStep.cotizacion.Asegurado.Ubigeo,
                                        $scope.firstStep.mIgualAsegurado
                                          ? 'C'
                                          : 'I',
                                        $scope.firstStep
                                      )
            ],
            CentroTrabajo:            $scope.firstStep.centroTrabajoAsegurado || $scope.firstStep.cotizacion.Asegurado.NombreEmpresa,
          },
          beneficiario:               $scope.secondStep.dataBeneficiary.beneficiaries
                                        .map(function(it) {
                                          return {
            tipDocum:                       it.contractor.mTipoDocumento.TipoDocumento,
            codDocum:                       it.contractor.mNumeroDocumento,
            nombre:                         it.contractor.mNomContratante,
            apePaterno:                     it.contractor.mApePatContratante || '',
            apeMaterno:                     it.contractor.mApeMatContratante || '',
            email:                          it.contractor.mCorreoElectronico || '',
            tlfNumero:                      it.contractor.mTelefonoFijo || '',
            tlfMovil:                       it.contractor.mTelefonoCelular || '',
            tlfOficina:                     it.contractor.mTelefonoOficina || '',
            fecNacimiento:                  $filter('date')(it.contractor.mFechaNacimiento, constants.formats.dateFormat) || '',
            mcaSexo:                        it.contractor.mSexo || '',
            codProfesion:                   (it.contractor.mProfesion && it.contractor.mProfesion.Codigo !== null)
                                              ? it.contractor.mProfesion.Codigo
                                              : '0',
            codOcupacion:                   (it.contractor.mOcupacion && it.contractor.mOcupacion.Codigo !== null)
                                              ? it.contractor.mOcupacion.Codigo
                                              : '0',
            tipActEconomica:                (it.contractor.mActividadEconomica && it.contractor.mActividadEconomica.Codigo !== null)
                                              ? it.contractor.mActividadEconomica.Codigo
                                              : '',
            estadoCivil:                    (it.contractor.mEstadoCivil && it.contractor.mEstadoCivil.CodigoEstadoCivil !== null)
                                              ? it.contractor.mEstadoCivil.CodigoEstadoCivilTron
                                              : '',
            nacionalidad:                   (it.contractor.mNacionalidad && it.contractor.mNacionalidad.Codigo !== null)
                                              ? it.contractor.mNacionalidad.Codigo
                                              : '',
            tipBenef:                       it.contractor.mTipoBeneficiario.Codigo,
            pctCesion:                      it.contractor.mDistribucion,
            codParentesco:                  (it.contractor.mParentesco.Codigo && it.contractor.mParentesco.Codigo !== null)
                                              ? it.contractor.mParentesco.Codigo
                                              : '0',
            direccion: [
                                            getAddress(it.contractorAddress, 'C', it.contractor)
            ]
                                          };
                                        }),
          referido:                   ($scope.secondStep.breferidos === 'S')
                                        ? $scope.secondStep.referidos
                                            .map(function(it) {
                                              return {
            nombre:                             it.nombre,
            email:                              it.correo || '',
            tlfNumero:                          it.telefono1 || '',
            tlfMovil:                           it.celular || '',
            tlfOficina:                         it.telefono2 || '',
            nomParentesco:                      it.parentesco || ''
                                              };
                                            })
                                        : [],

            ListaAccionista:            $scope.firstStep.accionistas
                                            .map(function(it) {
                                              return {
            TipDocumento:                      it.documentType.Codigo,
            NroDocumento:                      it.documentNumber || '',
            ApellidoMaterno:                   it.ApellidoMaterno || '',
            ApellidoPaterno:                   it.ApellidoPaterno || '',
            Nombres:                           it.Nombre || '',
            RazonSocial:                       it.RazonSocial || '',
            Relacion:                          it.Relacion.Codigo,
			PorParticipacion:                  it.PorParticipacion,
                                              };
                                            }),

          gestorCobro: {
            codEntidad      : ($scope.secondStep.entidad && $scope.secondStep.entidad.Codigo !== null)
                                ? $scope.secondStep.entidad.Codigo
                                : '0',
            cuentaCorriente : $scope.secondStep.cuentaNoFormat || '',
            tipoTarjeta     : ($scope.secondStep.tipoTarjeta && $scope.secondStep.tipoTarjeta.Codigo !== null)
                                ? $scope.secondStep.tipoTarjeta.Codigo
                                : '0',
            codTarjeta      : ($scope.secondStep.codigoTarjeta && $scope.secondStep.codigoTarjeta.Codigo !== null)
                                ? $scope.secondStep.codigoTarjeta.Codigo
                                : '0',
            numTarjeta      : $scope.secondStep.numeroTarjetaNoFormat || '',
            fecVencTarjeta  : $scope.secondStep.fechaTarjeta || '',
            codTipoCuenta   : ($scope.secondStep.tipoCuenta && $scope.secondStep.tipoCuenta.Codigo !== null)
                                ? $scope.secondStep.tipoCuenta.Codigo
                                : '0',
            codMoneda       : ($scope.secondStep.moneda && $scope.secondStep.moneda.Codigo !== null)
                                ? $scope.secondStep.moneda.Codigo
                                : '0',
            codOficina      : $scope.secondStep.oficina || '',
            cuentaCalcular  : $scope.secondStep.ctaCalcular || '',
            tipoGestor      : _tipoGestor(),
            codGestor       : _codGestor()
          }
        };

        if ($scope.secondStep.rEndosatario > 0) {
          vParamsOrchestrator.riesgoVida = {
            endosatario: {
              tipFiltro: $scope.secondStep.rEndosatario,
              tipDocumEndosatario: $scope.secondStep.endosatario.TipoDocumento,
              codDocumEndosatario: $scope.secondStep.endosatario.Codigo,
              sumaEndosada: $scope.secondStep.sumaEndosada,
              fecVctoCesion: $filter('date')($scope.secondStep.mCesionDate, constants.formats.dateFormat)
            }
          };
        }

        var vParams = {
          CodigoSistema: oimAbstractFactory.getOrigin(),
          CodigoUsuario       : oimPrincipal.getUsername(),
          EmisionOrquestador  : vParamsOrchestrator,
          FrecuenciaPago      : vQuotation.FrecuenciaPago,
          CodigoRamo          : $scope.thirdStep.codigoRamo
        };

        return vParams;
      }

      $scope.fnEmitPolicy = function() {
        if (!_validateSurveyDPS() && !$scope.thirdStep.esRentaSegura) {
          mModalAlert.showWarning(
            'Debes grabar la Declaración Personal de Salud (DPS) para poder emitir la póliza',
            'ALERTA'
          );
          return;
        }

        if (_validRequiredDoc()) {
          var vQuotation = $scope.firstStep.cotizacion;
          var vParamsCargaAltaDocumental = _paramsCargaAltaDocumental(),
              paramsUpdateRequiredDocuments = _paramsUpdateRequiredDocuments(),
              vParamsEmit = _paramsEmit();

          vidaFactory.cargaAltaDocumental(vParamsCargaAltaDocumental, true)
            .then(function(rsCargaAltaDocumental){
              if (rsCargaAltaDocumental.OperationCode == constants.operationCode.success){
                vParamsEmit.ArchivoGestorDocumental = { Nombre: rsCargaAltaDocumental.Data.ValueResult };

                return vidaFactory.evaluarCotizacion.modificarDocumentosRequeridos(vQuotation.NumeroCotizacion, paramsUpdateRequiredDocuments, true);
              }else{
                mModalAlert.showError(rsCargaAltaDocumental.Message, 'Error Archivo cargomático');
              }
            }).then(function(rsDocumentosRequeridos){
              if (rsDocumentosRequeridos){
                if (rsDocumentosRequeridos.COD === constants.operationCode.success){
                  const pathParams = {
                    opcMenu: localStorage.getItem('currentBreadcrumb')
                   };
                  return httpData.post(
                    oimProxyPoliza.endpoint + 'api/emision/vida/orquestador?COD_OBJETO=.&OPC_MENU=' + pathParams.opcMenu,
                    polizasFactory.setReferidoNumber(vParamsEmit), 
                    undefined, 
                    true
                  );
                }else{
                  if(rsDocumentosRequeridos.COD === 400){
                    mModalAlert.showWarning(rsDocumentosRequeridos.MSJ, 'ALERTA');
                  }else{
                    mModalAlert.showError(rsDocumentosRequeridos.MSJ, 'ERROR');
                  }
                }
              }
            }).then(function(rsEmision){
              if (rsEmision){
                if (rsEmision.OperationCode == constants.operationCode.success){
                  if($scope.encuesta.mostrar == 1){
                    $scope.encuesta.numOperacion = vQuotation.NumeroCotizacion;
                    $state.go('vidaEmitted', {
                      documentNumber: vQuotation.NumeroCotizacion, encuesta: $scope.encuesta
                    });
                  }else{
                    $state.go('vidaEmitted', {
                      documentNumber: vQuotation.NumeroCotizacion
                    });
                  }
                }else{
                  mModalAlert.showError(rsEmision.Message, 'ERROR EMISIÓN');
                }
              }
            });
        }
      };

      $scope.fnAbandonProcess = function(){
        $state.go('homePolizasVidas', {});
      };

      function setRequiredFile() {
        var indexCargomatico = _.findIndex($scope.thirdStep.requiredDocs, { 'descripcion': 'Cargomatico'});
        if (!$scope.secondStep.selectLoadFile && $scope.thirdStep.requiredDocs) {
          $scope.thirdStep.requiredDocs[indexCargomatico].mca_obligatorio = "S";
        }
      }

		}]);
});