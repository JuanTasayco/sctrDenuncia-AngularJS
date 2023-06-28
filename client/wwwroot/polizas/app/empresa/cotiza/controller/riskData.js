(function($root, deps, action) {
  define(deps, action);
})(this, ["angular", "constants", "helper", "swal", "lodash"], function(angular, constants, helper, swal, _) {
  var appAutos = angular.module("appAutos");

  appAutos
    .controller("riskDataController", [
      "$scope",
      "$anchorScroll",
      "lookupCompanyData",
      "$rootScope",
      "$timeout",
      "mModalAlert",
      "proxyCotizacion",
      "$state",
      "$q",
      "mModalConfirm",
      "empresasFactory",
      "mainServices",
      function(
        $scope,
        $anchorScroll,
        lookupCompanyData,
        $rootScope,
        $timeout,
        mModalAlert,
        proxyCotizacion,
        $state,
        $q,
        mModalConfirm,
        empresasFactory,
        mainServices
      ) {
        (function onLoad() {
          $rootScope.errorConvenio1 = false;
          eventHandlers();

          $scope.isRuc = function() {
            var vNatural = true;
            if ($scope.data.mTipoDocumento && $scope.data.mNumeroDocumento)
              vNatural = mainServices.fnShowNaturalRucPerson(
                $scope.data.mTipoDocumento.codigo,
                $scope.data.mNumeroDocumento
              );
            return !vNatural;
          };

          $scope.calcTotal = function(companyData, risk) {
            if (!!companyData === false) {
              cancel();
              return;
            }

            function cancel() {
              if (risk.seed) {
                $timeout.cancel(risk.seed);
                delete risk.seed;
                delete risk.totalPrima;
                delete risk.inputCalcRequest;
                delete risk.calculatedRisk;
              }
            }

            function getData() {
              companyData.data.codigoTipoEmpresa = $scope.data.mTipoEmpresa.codigo;
              companyData.data.codigoGiroNegocio = $scope.data.mGiroNegocio.Codigo;
              companyData.data.dsctoComercial = $scope.data.mDsctComercial || 0;
              companyData.data.importeAplicarMapfreDolar = $scope.data.mAplicadosMDolares;
              var bodyRequest = {
                codigoCompania: 1,
                codigoRamo: 274,
                vehiculo: {
                  numeroRiesgo: $scope.data.risks.length,
                  dsctoComercial: 0
                },
                empresa: companyData.data,
                documento: { codigoMoneda: $scope.data.mMoneda.codigo }
              };
              var promise = proxyCotizacion.cotizarEmpresa(bodyRequest);

              promise.then(function(response) {
                if (risk.seed) {
                  risk.inputCalcRequest = companyData.data;
                  risk.calculatedRisk = response.Data;
                }
              });
              risk.totalPrima = promise;
            }
            cancel();
            risk.seed = $timeout(getData, 1500);
          };
        })(); //end onLoad

        $anchorScroll();
        if ($scope.data.isValidStep1 !== true) {
          $state.go("companyquot.steps", { step: 1 });
        }

        function updateRisk() {
          if (!$rootScope.$$phase) $scope.$apply("data.risks");
          else $scope.$evalAsync("data.risks");
        }

        var maxRisks = 5;

        $scope.data = $scope.data || {};
        $scope.data.risks = $scope.data.risks || [];

        $scope.data.mGiroNegocio = $scope.data.mGiroNegocio || {};

        $scope.lookups = lookupCompanyData;

        function addRisk() {
          if ($scope.data.risks.length < maxRisks) {
            $scope.data.risks.push({
              details: {}
            });
            updateRisk();
          }
        }

        $scope.active = 0;
        if ($scope.data.secondStepExec !== true) {
          addRisk(); //addRisk();
        }

        function removeRisk($index) {
          if ($scope.data.risks.length > 1) {
            var push = [];
            angular.forEach($scope.data.risks, function(item, index) {
              if (index != $index) push.push(item);
            });
            $scope.data.risks = push;
            updateRisk();
          } else {
            $scope.data.risks = [];
            addRisk();
          }
        }

        $scope.remove = function($event, $index) {
          mModalConfirm
            .confirmWarning("¿Estas seguro que quieres eliminar este riesgo?", "Eliminar Riesgo")
            .then(function(r) {
              if (r) removeRisk($index);
            });

          $event.stopPropagation();
          $event.stopImmediatePropagation();
          $event.preventDefault();
        };

        $scope.addTab = function() {
          addRisk();
        };

        $scope.getAdditionalData = function() {
          return {
            esRiesgoso: $scope.data.esRiesgoso,
            mTipoEmpresa: $scope.data.mTipoEmpresa,
            mGiroNegocio: $scope.data.mGiroNegocio,
            countRisk: $scope.data.risks.length
          };
        };

        function eventHandlers(){
          $scope.$on('changingStep', function(p, e){
            if(e.step == 3){
              event.preventDefault();
              $scope.irPaso3();
            } else $state.go("companyquot.steps", { step: e.step });
          });
        }

        $scope.data.secondStepExec = true;

        $scope.validarPaso3 = function(){
          var risks = $scope.data.risks;
          var maxValue = $scope.data.mMoneda.codigo === '1' ? 2800000 : 1000000;
          var currencyText = $scope.data.mMoneda.codigo === '1' ? 'S/. ' : '$ ';
          //errores minimos de validacion antes de pasar a paso 3
          var errors = {
            departamento: 0,
            provincia: 0,
            distrito: 0,
            tipo: 0,
            categoria: 0,
            comunicacion: 0,
            convenio1: 0,
            convenio2: 0,
            convenio3: 0,
            convenio4: 0,
            convenio5: 0,
            convenio6: 0,
            convenio7: 0,
            convenio8: 0,
            convenio9: 0,
            convenio10: 0
          };

          var numErrors = 0;

          for (var i = 0; i < risks.length; i++) {
            if ($scope.data.mSelecProd.CodigoProducto == 57
              && risks[i].c01.mEdificacion == 0
              && risks[i].c01.mEstables == 0
              && risks[i].c01.mExistencias == 0
              && risks[i].c01.mMaquinaria == 0
              && risks[i].c01.mMovilidad == 0
              ) {
              errors.convenio1 = 1;
              $rootScope.errorConvenio1 = true;
              numErrors++;
            }

            //validacion de ubigeo
            if (risks[i].mDepartamento.Codigo == null) {
              errors.departamento = 1;
              numErrors++;
            } else if (risks[i].mProvincia.Codigo == null) {
              errors.provincia = 1;
              numErrors++;
            } else if (risks[i].mDistrito.Codigo == null) {
              errors.distrito = 1;
              numErrors++;
            }

            if (risks[i].mTipoLocal.strCodigo == null) {
              errors.tipo = 1;
              numErrors++;
            }

            if (risks[i].mCategoriaLocal.Codigo == null) {
              errors.categoria = 1;
              numErrors++;
            }

            //validacion alarmas
            if (risks[i].mServAlarmMonit.value == "S") {
              if (risks[i].mMarcaTipoCom.Codigo == null) {
                errors.comunicacion = 1;
                numErrors++;
              }
            }

            //validacion convenio 2
            if (risks[i].c02.error) {
              errors.convenio2 = 1;
              numErrors++;
            }

            //validacion convenio 3
            if (risks[i].c03.error) {
              errors.convenio3 = 1;
              numErrors++;
            }

            //validacion convenio 4
            if (risks[i].c04.error) {
              errors.convenio4 = 1;
              numErrors++;
            }

            //validacion convenio 5
            if (risks[i].c05.error) {
              errors.convenio5 = 1;
              numErrors++;
            }

            //validacion convenio 6
            if (risks[i].c06.error) {
              errors.convenio6 = 1;
              numErrors++;
            }

            //validacion convenio 7
            if (risks[i].c07.error) {
              errors.convenio7 = 1;
              numErrors++;
            }

            //validacion convenio 8
            if (risks[i].c08.error) {
              errors.convenio8 = 1;
              numErrors++;
            }

            //validacion convenio 9
            if (risks[i].c09.error) {
              errors.convenio9 = 1;
              numErrors++;
            }

            //validacion convenio 10
            if (risks[i].c10.error) {
              errors.convenio10 = 1;
              numErrors++;
            }

            risks[i].errors = errors;
          } //end for

          if (parseFloat(risks.sumTotalConvenios) > maxValue) {
            numErrors++;
            mModalAlert.showWarning(
              "La suma acumulada de todos los convenios contratados hasta este convenio no puede exceder " +
                currencyText +
                maxValue,
              "Datos Erróneos"
            );
          }
          return numErrors <= 0;
        };

        function _paramsGenerarCotizacion() {
          var data = $scope.data;
          var vMoneda;
          //Moneda segun producto selccionado
          if (data.mSelecProd.CodigoProducto == 129 || data.mSelecProd.CodigoProducto == 130) {
            vMoneda = {
              Codigo: "1",
              Descripcion: "NUEVOS SOLES"
            };
          } else {
            vMoneda = {
              Codigo: data.mMoneda && data.mMoneda.codigo !== null ? data.mMoneda.codigo : "1",
              Descripcion: data.mMoneda && data.mMoneda.codigo !== null ? data.mMoneda.descripcion : "NUEVOS SOLES"
            };
          }

          var vParams = {
            Producto: data.mSelecProd,
            GiroNegocio: {
              Codigo: data.mGiroNegocio.strCodigo,
              Descripcion: data.mGiroNegocio.Nombre
            },
            TipoEmpresa: {
              Codigo: data.mTipoEmpresa.strCodigo,
              Descripcion: data.mTipoEmpresa.Nombre
            },
            Contratante: {
              Nombre: !angular.isUndefined(data.mNombre) ? data.mNombre : "",
              ApellidoPaterno: !angular.isUndefined(data.mApellidoPaterno) ? data.mApellidoPaterno : "",
              ApellidoMaterno: !angular.isUndefined(data.mApellidoMaterno) ? data.mApellidoMaterno : "",
              NombreCompleto: !angular.isUndefined(data.mNombre)
                ? data.mNombre
                : "" + " " + !angular.isUndefined(data.mApellidoPaterno)
                ? data.mApellidoPaterno
                : "" + " " + !angular.isUndefined(data.mApellidoMaterno)
                ? data.mApellidoMaterno
                : "",
              TipoDocumento: {
                Codigo: data.mTipoDocumento.codigo,
                Descripcion: data.mTipoDocumento.descripcion
              },
              NumeroDocumento: data.mNumeroDocumento
            },
            Moneda: vMoneda,
            AplicarMapfreDolar: data.mOpcionMapfreDolares == "Si" ? "S" : "N",
            ImporteMapfreDolar: angular.isUndefined(data.mAplicadosMDolares) ? 0 : data.mAplicadosMDolares,
            PolizaGrupo: {
              Codigo: data.mCodPolizaGrupo == "" ? 0 : data.mCodPolizaGrupo,
              Descripcion: angular.isUndefined(data.groupPolicy) ? "" : data.groupPolicy
            },
            DescuentoComercial: angular.isUndefined(data.mDsctComercial) ? 0 : data.mDsctComercial,
            Agente: {
              CodigoAgente: data.agent.codigoAgente,
              Nombre: data.agent.codigoNombre
            },
            Riesgos: []
          };
          angular.forEach(data.risks, function(item, index) {
            var vRisk = {
              NumeroRiesgo: index + 1,
              Tipolocal: {
                Codigo: item.mTipoLocal.strCodigo,
                Descripcion: item.mTipoLocal.Nombre
              },
              Categoria: {
                Codigo: item.mCategoriaLocal.Codigo,
                Descripcion: item.mCategoriaLocal.Descripcion
              },
              Ubigeo: {
                Departamento: {
                  Codigo: item.mDepartamento.Codigo,
                  Descripcion: item.mDepartamento.Nombre
                },
                Provincia: {
                  Codigo: item.mProvincia && item.mProvincia.Codigo ? item.mProvincia.Codigo : null,
                  Descripcion: item.mProvincia && item.mProvincia.Nombre ? item.mProvincia.Nombre : ""
                },
                Distrito: {
                  Codigo: item.mDistrito && item.mDistrito.Codigo ? item.mDistrito.Codigo : null,
                  Descripcion: item.mDistrito && item.mDistrito.Nombre ? item.mDistrito.Nombre : ""
                }
              },
              AlarmaMonitoreo: {
                TipoComunicacion: {
                  Codigo: item.mMarcaTipoCom && item.mMarcaTipoCom.Codigo ? item.mMarcaTipoCom.Codigo : 0,
                  Descripcion:
                    item.mMarcaTipoCom && item.mMarcaTipoCom.Descripcion ? item.mMarcaTipoCom.Descripcion : ""
                },
                mcaAlarmaMonitoreo: item.mServAlarmMonit.value,
                mcaKitSmart: item.mMarcaKitSmart.value,
                mcaVideoWeb: item.mMarcaVideo.value,
                mcaLlaveroMedico: item.mLlavero.value
              },
              Convenio1: {
                Edificacion: item.c01.mEdificacion,
                Maquinaria: item.c01.mMaquinaria,
                Mobiliario: item.c01.mMovilidad,
                Existencias: item.c01.mExistencias,
                LucroCesante: item.c01.mEstables,
                MCATerremoto: item.c01.mTerremoto == "N" ? "N" : "S",
                MCATerrorismo: item.c01.mTerrorismo == "N" ? "N" : "S",
                TotalPrimaNeta: 0
              },
              Convenio2: {
                Fijas: item.c02.contenido.mFijas,
                Maquinaria: item.c02.contenido.mMaquinaria,
                Mobiliario: item.c02.contenido.mMobiliario,
                Existencias: item.c02.contenido.mExistencias,
                TotalContenido: item.c02.contenido.total,
                CajaChica: item.c02.declarado.mChica,
                CajaFuerte: item.c02.declarado.mFuerte,
                Transito: item.c02.declarado.mTransito,
                NumeroCobradores: item.c02.declarado.mCobradores,
                PoderCobradores: item.c02.declarado.mPoder,
                TotalDeclarado: item.c02.declarado.total,
                TotalPrimaNeta: 0
              },
              Convenio3: {
                SumaAsegurada: item.c03.mCivil,
                TotalPrimaNeta: 0
              },
              Convenio4: {
                SumaAsegurada: item.c04.mRotura,
                TotalPrimaNeta: 0
              },
              Convenio5: {
                Limite: item.c05.mLimite,
                Movil: item.c05.mMovil,
                TotalPrimaNeta: 0
              },
              Convenio6: {
                NumeroAsegurados: item.c06.mAsegurados,
                SumaAsegurada: item.c06.total,
                TotalPrimaNeta: 0
              },
              Convenio7: {
                NumeroEmpleados: item.c07.mEmpleados,
                SumaAsegurada: item.c07.total,
                TotalPrimaNeta: 0
              },
              Convenio8: {
                SumaAsegurada: item.c08.mTrec,
                TotalPrimaNeta: 0
              },
              Convenio9: {
                SumaAsegurada: item.c09.mCar,
                TotalPrimaNeta: 0
              },
              Convenio10: {
                SumaAsegurada: item.c10.mEar,
                TotalPrimaNeta: 0
              }
            };
            vParams.Riesgos.push(vRisk);
          });

          return vParams;
        }

        $scope.irPaso3 = function() {
          if (!$scope.validarPaso3()) {
            $scope.frmSecondStep.formDataStep2.markAsPristine();
            var msgError;
            if(!$scope.frmSecondStep.formDataStep2.$valid ){
              msgError = "Por favor verifique los datos ingresados (*)";
            } else if($rootScope.errorConvenio1){
              msgError = "Debe contratar por lo menos un item del Convenio I";
            }

            mModalAlert.showWarning(msgError, "Datos Erróneos");
            $scope.data.isValidStep2 = false;
          } else {
            var vParams = _paramsGenerarCotizacion();
            empresasFactory.proxyEmpresa.GenerarCotizacion(vParams, true).then(function(response) {
              if (response.OperationCode == constants.operationCode.success) {
                $scope.data.prima = response.Data.ConceptosDesglose;
                $scope.data.request = _.merge({}, vParams, response.Data);
                $state.go("companyquot.steps", { step: 3 }, { reload: false, inherit: true });
              } else mModalAlert.showWarning(response.Message, "Generar Cotización");
            });
            $scope.data.isValidStep2 = true;
          }
        };
      }
    ])
    .directive("pushTab", function($parse) {
      return {
        compile: function() {
          return {
            pre: function() {},
            post: function(scope, element, attr, ctrl, tra) {
              function fnlastItem(ul) {
                var childs = ul.children();
                var _lastItem = childs && childs.length > 0 ? childs[childs.length - 1] : null;
                _lastItem = angular.element(_lastItem);
                return _lastItem;
              }

              function display(lastItem, max) {
                if (!lastItem) return;
                lastItem.css({ display: "block" });
                if (scope.$index + 1 == max) {
                  lastItem.css({ display: "none" });
                }
              }

              function isPlusItem(ul) {
                var lastItem = fnlastItem(ul);
                return lastItem && lastItem.hasClass("tab-plus") ? lastItem : null;
              }

              if (scope.$last === true) {
                var max = $parse(attr.maxItems)(scope);
                var fn = $parse(attr.pushTab);
                var ul = element.parent();
                ul.removeClass("nav");
                ul.removeClass("nav-tabs");

                var lastItem = fnlastItem(ul);

                function h(e) {
                  fn(scope, { $event: e });
                }

                if (lastItem && !lastItem.hasClass("tab-plus")) {
                  ul.append("<li class='tab-plus'>+</li>");
                  fnlastItem(ul).on("click", h);
                }
                display(fnlastItem(ul), max);

                scope.$watch("$last", function() {
                  var item = isPlusItem(ul);
                  display(item, max);
                });
              }
            }
          };
        }
      };
    });
});
