(function ($root, name, deps, action) {
  $root.define(name, deps, action)
})(window, 'formAviso', ['angular', '/atencionsiniestrosagricola/app/utilities/agricolaUtilities.js'], function (angular) {
  angular.module('atencionsiniestrosagricola.app').
    controller('formAvisoController', ['$scope', '$state', '$q', '$filter', 'mpSpin', 'mModalAlert', 'agricolaUtilities', 'proxyAviso', 'proxyCampania', 'proxyLookup', 'proxyContacto', '$uibModal', '$rootScope', 'proxyAgricolaSecurity',
      function ($scope, $state, $q, $filter, mpSpin, mModalAlert, agricolaUtilities, proxyAviso, proxyCampania, proxyLookup, proxyContacto, $uibModal, $rootScope,proxyAgricolaSecurity) {
        var vm = this;
        var codigoOpcion = [];
        vm.$onInit = onInit;

        var userCampania =  "";
        function setInitialData() {
          var deferred = $q.defer();
          proxyAgricolaSecurity.GetRole().then(function (response) {      

          vm.entidadAviso = {};
          vm.entidadAviso.superficieAsegurada = 0;
          vm.entidadAviso.tipoPerdida = "";
          vm.entidadAviso.desTipoPerdida = "";
          vm.maxDateFecActual = new Date();
          vm.listaFechaSiembra = [{ codigo: null, descripcion: "" }];
          vm.listaDepartamentos;
            if ( response.codRol =="DGA") {
              userCampania = vm.masters.loginUserName;
              vm.mEjecutivo = false;
            } else {
              vm.mEjecutivo = true;
            } 
          // lista campania
            var params = { codCamp: "", usro: userCampania }
          mpSpin.start('Cargando información, por favor espere...');
            proxyCampania.GetCampaniaActiva(params)
            .then(function (response) {
              if (response.operationCode == 200) {
                deferred.resolve(response.data);
                vm.itemCampania = response.data;
                if(typeof(vm.itemCampania) === "undefined"){
                  mModalAlert.showWarning("La campaña activa no está configurada correctamente", "");
                }else{
                preparedVigencias();
                    cargarDepartamentos(response.data.codigo);
                reloadFiltersData('cltvo', { cmstro: "100", prmtro1: response.data.codigo, prmtro2: "", prmtro3: "", prmtro4: "" }, false);
                reloadFiltersData('prvnce', { cmstro: "101", prmtro1: response.data.codDepartamento, prmtro2: "", prmtro3: "", prmtro4: "" }, false);
                reloadFiltersData('tsnstro', { cmstro: "3", prmtro1: "", prmtro2: "", prmtro3: "", prmtro4: "" }, false);
              }
              }
              mpSpin.end();
            }, function (response) {
              mpSpin.end();
            });            
          return deferred.promise;
          });
        }

        function preparedVigencias() {
          var fecIniVigencia = vm.itemCampania.fecIni.substr(6, 4) + vm.itemCampania.fecIni.substr(3, 2) + vm.itemCampania.fecIni.substr(0, 2);
          var fecFinVigencia = vm.itemCampania.fecFin.substr(6, 4) + vm.itemCampania.fecFin.substr(3, 2) + vm.itemCampania.fecFin.substr(0, 2);
          var wFecActual = $filter('date')(new Date(), 'yyyyMMdd');
          var wFecFin = fecFinVigencia;

          if (wFecActual <= fecFinVigencia) {
            wFecFin = wFecActual;
          }

          for (var i = fecIniVigencia; i <= wFecFin; i++) {
            var wCi = i + "";
            if (((wCi.substr(6, 2) * 1) === 1 || (wCi.substr(6, 2) * 1) === 15) && (wCi.substr(4, 2) * 1) >= 1 && (wCi.substr(4, 2) * 1) <= 12) {
              var wDescrip = wCi.substr(6, 2) + "/" + wCi.substr(4, 2) + "/" + wCi.substr(0, 4);
              var item = {
                codigo: i + "",
                descripcion: wDescrip
              };
              vm.listaFechaSiembra.push(item);
            }
          }
        }

        function reloadFiltersData(search, params, showLoad) {
          switch (search) {

            case 'cltvo':
              if (showLoad) mpSpin.start();
              proxyLookup.GetFiltros(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    vm.listaCultivo = response.data;
                  }
                  mpSpin.end();
                }, function (response) {
                  mpSpin.end();
                });
              break;

            case 'prvnce':
              if (showLoad) mpSpin.start();
              proxyLookup.GetFiltros(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    vm.listaProvincia = response.data;
                  }
                  mpSpin.end();
                }, function (response) {
                  mpSpin.end();
                });
              break;

            case 'dstrto':
              if (params.prmtro2) {
                if (showLoad) mpSpin.start();
                proxyLookup.GetFiltros(params)
                  .then(function (response) {
                    if (response.operationCode == 200) {
                      vm.listaDistrito = response.data;
                    }
                    mpSpin.end();
                  }, function (response) {
                    mpSpin.end();
                  });
              } else {
                vm.listaDistrito = [];
                vm.listaSectorEstadistico = [];
              }
              break;

            case 'tsnstro':
              if (showLoad) mpSpin.start();
              proxyLookup.GetFiltros(params)
                .then(function (response) {
                  if (response.operationCode == 200) {
                    vm.listaTipoSiniestro = response.data;
                  }
                  mpSpin.end();
                }, function (response) {
                  mpSpin.end();
                });
              break;

            case 'sestdstco':
              if (params.prmtro3) {
                if (showLoad) mpSpin.start();
                proxyLookup.GetFiltros(params)
                  .then(function (response) {
                    if (response.operationCode == 200) {
                      vm.listaSectorEstadistico = response.data;
                    }
                    mpSpin.end();
                  }, function (response) {
                    mpSpin.end();
                  });
              } else {
                vm.listaSectorEstadistico = [];
              }
              break;

            case 'efnlgco':
              if (params.prmtro1) {
                if (showLoad) mpSpin.start();
                proxyLookup.GetFiltros(params)
                  .then(function (response) {
                    if (response.operationCode == 200) {
                      vm.listaEstadoFenologico = response.data;
                    }
                    mpSpin.end();
                  }, function (response) {
                    mpSpin.end();
                  });
              } else {
                vm.listaEstadoFenologico = [];
              }
              break;
          }
        }

        function selectCultivo() {
          var buscarSuperficieAsegurada = true;
          var buscarEstadoFenologico = true;

          if (typeof (vm.entidadAviso.sectorEstadistico) === 'undefined') {
            buscarSuperficieAsegurada = false;
          } else if (vm.entidadAviso.sectorEstadistico.codigo === null) {
            buscarSuperficieAsegurada = false;
          }
          if (typeof (vm.entidadAviso.cultivo) === 'undefined') {
            buscarSuperficieAsegurada = false;
            buscarEstadoFenologico = false;
          } else if (vm.entidadAviso.cultivo.codigo === null) {
            buscarSuperficieAsegurada = false;
            buscarEstadoFenologico = false;
          }

          if (buscarSuperficieAsegurada === true) {
            mpSpin.start();
            var codCompania = vm.itemCampania.codigo;
            var codCultivo = vm.entidadAviso.cultivo.codigo;
            var codSectorEst = vm.entidadAviso.sectorEstadistico.codigo;
            proxyAviso.GetSuperficieAsegurada({ CodCampania: codCompania, CodCultivo: codCultivo, CodSectorEst: codSectorEst })
              .then(function (response) {
                if (response.operationCode == 200) {
                  vm.entidadAviso.superficieAsegurada = response.data;
                }
                mpSpin.end();
              }, function (response) {
                mpSpin.end();
              });
          } else {
            vm.entidadAviso.superficieAsegurada = 0;
            mpSpin.end();
          }

          if (buscarEstadoFenologico === true) {
            mpSpin.start();
            var prmtro1 = vm.entidadAviso.cultivo.codigo;
            var prmtro2 = "";
            var prmtro3 = "";
            var prmtro4 = "";

            proxyLookup.GetFiltros({ cmstro: "104", prmtro1: prmtro1, prmtro2: prmtro2, prmtro3: prmtro3, prmtro4: prmtro4 })
              .then(function (response) {
                if (response.operationCode == 200) {
                  vm.listaEstadoFenologico = response.data;
                  vm.entidadAviso.estadoFenologico = null;
                }
                mpSpin.end();
              }, function (response) {
                mpSpin.end();
              });
          }
          else {
            vm.entidadAviso.estadoFenologico = null;
            vm.listaEstadoFenologico = [];
            mpSpin.end();
          }
        }

        function selectDistrito() {
          var prmtro1 = vm.itemCampania.codDepartamento;
          var prmtro2 = "";
          var tipoProvincia = typeof(vm.entidadAviso.provincia);
          if(tipoProvincia != "undefined"){            
          var prmtro2 = vm.entidadAviso.provincia.codigo;
          }
          var prmtro3 = "";
          var prmtro4 = "";
          vm.entidadAviso.distrito = null;
          vm.entidadAviso.sectorEstadistico = null;
          vm.listaSectorEstadistico = [];
          vm.entidadAviso.superficieAsegurada = 0.00;
          reloadFiltersData('dstrto', { cmstro: "102", prmtro1: prmtro1, prmtro2: prmtro2, prmtro3: prmtro3, prmtro4: prmtro4 }, true);
        }

        function selectSectorEstadistico() {
          var prmtro1 = vm.itemCampania.codDepartamento;

          var tipoProvincia = typeof(vm.entidadAviso.provincia);
          if(tipoProvincia != "undefined"){            
          var prmtro2 = vm.entidadAviso.provincia.codigo;
          }

          var tipoDistrito = typeof(vm.entidadAviso.distrito);
          if(tipoDistrito != "undefined"){            
          var prmtro3 = vm.entidadAviso.distrito.codigo;
          }

          vm.entidadAviso.sectorEstadistico = null;
          vm.listaSectorEstadistico = [];
          vm.entidadAviso.superficieAsegurada = 0.00;

          reloadFiltersData('sestdstco', { cmstro: "103", prmtro1: prmtro1, prmtro2: prmtro2, prmtro3: prmtro3 }, true);
        }

        function selectEstadoFenologico() {
          var prmtro1 = vm.entidadAviso.cultivo.codigo;
          var prmtro2 = "";
          var prmtro3 = "";
          var prmtro4 = "";
          reloadFiltersData('efnlgco', { cmstro: "104", prmtro1: prmtro1, prmtro2: prmtro2, prmtro3: prmtro3, prmtro4: prmtro4 }, true);
        }

        function selectSuperficieAsegurada() {
          var buscarSuperficieAsegurada = true;

          if (typeof (vm.entidadAviso.sectorEstadistico) === 'undefined') {
            buscarSuperficieAsegurada = false;
          } else if (vm.entidadAviso.sectorEstadistico.codigo === null) {
            buscarSuperficieAsegurada = false;
          }

          if (typeof (vm.entidadAviso.cultivo) === 'undefined') {
            buscarSuperficieAsegurada = false;
          } else if (vm.entidadAviso.cultivo.codigo === null) {
            buscarSuperficieAsegurada = false;
          }
          mpSpin.start();
          if (buscarSuperficieAsegurada === true) {
            var codCompania = vm.itemCampania.codigo;
            var codCultivo = vm.entidadAviso.cultivo.codigo;
            var codSectorEst = vm.entidadAviso.sectorEstadistico.codigo;
            proxyAviso.GetSuperficieAsegurada({ CodCampania: codCompania, CodCultivo: codCultivo, CodSectorEst: codSectorEst })
              .then(function (response) {
                if (response.operationCode == 200) {
                  vm.entidadAviso.superficieAsegurada = response.data;
                }
                mpSpin.end();
              }, function (response) {
                mpSpin.end();
              });
          } else {
            mpSpin.end();
            vm.entidadAviso.superficieAsegurada = 0;
          }
        }

        function searchEstadoFenologico(text) {
          if (text && text.length >= 2) {
            var defer = $q.defer();
            var prmtro1 = vm.entidadAviso.cultivo.codigo;
            var prmtro2 = text;
            var prmtro3 = "";
            var prmtro4 = "";
            proxyLookup.GetFiltros({ cmstro: "104", prmtro1: prmtro1, prmtro2: prmtro2, prmtro3: prmtro3, prmtro4: prmtro4 })
              .then(function (response) {
                if (response.operationCode == 200) {
                  defer.resolve(response.data);
                }
              }, function (response) {
              });
            return defer.promise;
          }
        }

        function calcularTipoPerdida() {
          vm.entidadAviso.tipoPerdida = "";
          vm.entidadAviso.desTipoPerdida = "";
          if ((vm.entidadAviso.superficieAfectadaParcial * 1) > 0 || (vm.entidadAviso.superficiePerdidaTotal * 1) > 0) {
            if ((vm.entidadAviso.superficieAfectadaParcial * 1) === (vm.entidadAviso.superficiePerdidaTotal * 1)) {
              vm.entidadAviso.tipoPerdida = "1";
              vm.entidadAviso.desTipoPerdida = "AFECTADA";
            }
            if ((vm.entidadAviso.superficieAfectadaParcial * 1) > (vm.entidadAviso.superficiePerdidaTotal * 1)) {
              vm.entidadAviso.tipoPerdida = "1";
              vm.entidadAviso.desTipoPerdida = "AFECTADA";
            }
            if ((vm.entidadAviso.superficieAfectadaParcial * 1) < (vm.entidadAviso.superficiePerdidaTotal * 1)) {
              vm.entidadAviso.tipoPerdida = "2";
              vm.entidadAviso.desTipoPerdida = "PÉRDIDA";
            }
          }
        }

        function crearAviso02() {
          mModalAlert.showSuccess('Se ha enviado un mensaje', "¡El aviso se registró con éxito!");
        }

        function validarForm() {
          if (!$scope.avisoAgricolaForm.$valid) {
            return;
          } else {
            var validFechaSiniestro = new Date(vm.entidadAviso.fechaSiniestro);
            var validFechaCosecha = new Date(vm.entidadAviso.fechaCosecha);
            var validFechaSiembra = agricolaUtilities.toDate(vm.entidadAviso.fechaSiembra.descripcion);
            var validFechaActual = new Date();
            var validFechaIniVig = agricolaUtilities.toDate(vm.itemCampania.fecIni);
            var validFechaFinVig = agricolaUtilities.toDate(vm.itemCampania.fecFin);

            if (!vm.itemCampania.codigo) {
              mModalAlert.showError('Error en campaña', "Error");
              return;
            }

            if (!vm.itemCampania.codDepartamento) {
              mModalAlert.showError('Error en departamento', "Error");
              return;
            }

            if (vm.entidadAviso.cultivo.codigo === null) {
              //mModalAlert.showError('Seleccione cultivo', "Error");
              return;
            }

            if (vm.entidadAviso.provincia.codigo === null) {
              //mModalAlert.showError('Seleccione provincia', "Error");
              return;
            }

            if (vm.entidadAviso.distrito.codigo === null) {
              //mModalAlert.showError('Seleccione distrito', "Error");
              return;
            }

            if (vm.entidadAviso.sectorEstadistico.codigo === null) {
              //mModalAlert.showError('Seleccione sector estadístico', "Error");
              return;
            }

            if (vm.entidadAviso.tipoSiniestro.codigo === null) {
              //mModalAlert.showError('Seleccione tipo siniestro', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.fechaSiniestro) === 'undefined') {
              //mModalAlert.showError('Seleccione fecha de siniestro', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.superficieSiembraEstimada) === 'undefined') {
              //mModalAlert.showError('Ingrese superficie de siembra estimada', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.fechaSiembra) === 'undefined') {
              //mModalAlert.showError('Seleccione fecha de siembra', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.fechaCosecha) === 'undefined') {
              //mModalAlert.showError('Seleccione fecha de cosecha', "Error");
              return;
            }

            if (vm.entidadAviso.estadoFenologico.codigo === null) {
              //mModalAlert.showError('Seleccione tipo siniestro', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.superficieAfectadaParcial) === 'undefined') {
              //mModalAlert.showError('Ingrese superficie afectada (Pérdida parcial)', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.superficiePerdidaTotal) === 'undefined') {
              //mModalAlert.showError('Ingrese superficie pérdida total', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.contacto) === 'undefined') {
              //mModalAlert.showError('Ingrese nombre', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.telefonoContacto) === 'undefined') {
              //mModalAlert.showError('Ingrese teléfono celular', "Error");
              return;
            }

            if (typeof (vm.entidadAviso.CorreoContacto) === 'undefined') {
              //mModalAlert.showError('Ingrese email', "Error");
              return;
            }

            // validacion fecha siniestro
            if (validFechaSiniestro < validFechaIniVig || validFechaSiniestro > validFechaActual) {
              mModalAlert.showWarning('La fecha de siniestro debe estar entre ' + vm.itemCampania.fecIni + " y " + agricolaUtilities.formatearFecha(validFechaActual), "");
              return;
            }

            //validacion superficie asegurada
            if ((vm.entidadAviso.superficieAsegurada * 1) <= 0) {
              mModalAlert.showWarning('La superficie asegurada debe ser mayor a 0', "");
              return;
            }

            if ((vm.entidadAviso.superficieSiembraEstimada * 1) === 0) {
              mModalAlert.showWarning('La superficie de siembra estimada debe ser mayor a 0', "");
              return;
            }

            if ((vm.entidadAviso.superficieSiembraEstimada * 1) > (vm.entidadAviso.superficieAsegurada * 1)) {
              mModalAlert.showWarning('La superficie de siembra estimada debe ser menor o igual a ' + vm.entidadAviso.superficieAsegurada, "");
              return;
            }

            //validacion fecha de cosecha
            //if (validFechaCosecha < validFechaIniVig || validFechaCosecha > validFechaActual) {
            //  mModalAlert.showWarning('La fecha de cosecha debe estar entre ' + vm.itemCampania.fecIni + " y " + agricolaUtilities.formatearFecha(validFechaActual), "");
            //  return;
            //}

            if (validFechaCosecha <= validFechaSiembra) {
              mModalAlert.showWarning("La fecha de cosecha debe ser mayor a la fecha de siembra: " + vm.entidadAviso.fechaSiembra.descripcion, "");
              return;
            }

            //validacion valores mayores a cero
            if ((vm.entidadAviso.superficieAfectadaParcial * 1) === 0 && (vm.entidadAviso.superficiePerdidaTotal * 1) === 0) {
              mModalAlert.showWarning('El valor de superficie afectada parcial o pérdida total debe ser mayor a 0', "");
              return;
            }

            //validacion suma y mayor superficie asegurada        
            if ((vm.entidadAviso.superficieAfectadaParcial * 1) + (vm.entidadAviso.superficiePerdidaTotal * 1) > (vm.entidadAviso.superficieAsegurada * 1)) {
              mModalAlert.showWarning('Pérdida parcial + pérdida total no debe ser mayor a la superficie asegurada', "");
              return;
            }
          }

          return true;
        }

        function crearAviso() {
          $scope.avisoAgricolaForm.markAsPristine();
          if (this.validarForm()) {
            mpSpin.start('Guardando información, por favor espere...');
            var wCFechaSiembra = vm.entidadAviso.fechaSiembra.codigo + "";
            var wFechaSiembra = new Date(wCFechaSiembra.substr(0, 4) + "/" + wCFechaSiembra.substr(4, 2) + "/" + wCFechaSiembra.substr(6, 2));
            var nombreContacto = "";
            if(typeof(vm.entidadAviso.contacto.nombre) ==='undefined'){
              nombreContacto = vm.entidadAviso.contacto;
            }else{
              nombreContacto = vm.entidadAviso.contacto.nombre;
            }
            var objAviso = {
              "CodCampania": vm.itemCampania.codigo,
              "CodDepartamnto": vm.itemCampania.codDepartamento,
              "CodCultivo": vm.entidadAviso.cultivo.codigo,
              "CodProvincia": vm.entidadAviso.provincia.codigo,
              "CodDistrito": vm.entidadAviso.distrito.codigo,
              "CodSectorEst": vm.entidadAviso.sectorEstadistico.codigo,
              "SuperficieAsegurada": vm.entidadAviso.superficieAsegurada,

              "TipSini": vm.entidadAviso.tipoSiniestro.codigo,
              "FecSini": vm.entidadAviso.fechaSiniestro,
              "SuperficieSembrada": vm.entidadAviso.superficieSiembraEstimada,
              "FecIniSiembra": wFechaSiembra,

              "FecIniCosecha": vm.entidadAviso.fechaCosecha,
              "CodEstadoFenologicoIni": vm.entidadAviso.estadoFenologico.codigo,
              "SuperficieAfectada": vm.entidadAviso.superficieAfectadaParcial,
              "SuperficiePerdidatotal": vm.entidadAviso.superficiePerdidaTotal,
              "TipPerdidaSuprfc": vm.entidadAviso.tipoPerdida,

              "NomContacto": nombreContacto,
              "TelContacto": vm.entidadAviso.telefonoContacto,
              "MailContacto": vm.entidadAviso.CorreoContacto,
              "NumPoliza": vm.itemCampania.numPoliza
            };
            
      

            var msgError = "";
            proxyAviso.NewAviso(objAviso)
              .then(function (response) {
                if (response.operationCode == 200) {
                  vm.entidadAviso = {};
                  vm.entidadAviso.superficieAsegurada = 0;
                  vm.entidadAviso.tipoPerdida = "";
                  vm.entidadAviso.desTipoPerdida = "";
                  vm.listaDistrito = [];
                  vm.listaSectorEstadistico = [];
                  vm.listaEstadoFenologico = [];
                  mpSpin.end();
                  mModalAlert.showSuccess(response.message, "¡El aviso se registró con éxito!").then(function (response) {
                  $state.go('registrarAviso', undefined, { reload: true, inherit: false });
                  });
                }
                else {
                  msgError = response.message;
                  mpSpin.end();
                  mModalAlert.showError(response.message, msgError);
                }
              }, function (response) {
                  var res = response.data;
                mpSpin.end();
                  msgError = res.message;
                  if(msgError==""){
                    res.data.errors.forEach(function (value, key) {
                      msgError =  msgError + value.errorMessage + "\n";
                     }); 
                  } 
                  if(res.operationCode == 500){
                    msgError = "Error en el sistema";
                  }
                mModalAlert.showError("", msgError);
              });
          }
        }

        function cargarDepartamentos(CodCampania) {
          var objFiltro = {
            cmstro: "105",
            prmtro1: CodCampania,
            prmtro2: userCampania,
            prmtro3: "",
            prmtro4: ""
          }
            mpSpin.start('Cargando, por favor espere...');
            proxyLookup.GetFiltros(objFiltro).then(function (response) {
              if (response.operationCode === 200) {
                vm.listaDepartamentos = response.data;
              vm.mDepartamento = ((response.data.map(function (o) { return o.codigo; }).indexOf(vm.itemCampania.codDepartamento)) >= 0 ? { codigo: vm.itemCampania.codDepartamento } : { codigo: null });
                mpSpin.end();
              } else {
                mModalAlert.showWarning("Error al cargar los departamentos", "");
              }
            });
        }
        function selectDepartamento(){
          vm.entidadAviso.provincia = undefined;
          vm.entidadAviso.distrito= undefined;
          vm.entidadAviso.sectorEstadistico = undefined;

          if(typeof(vm.mDepartamento) !=='undefined'){
            vm.itemCampania.codDepartamento = vm.mDepartamento.codigo;
            vm.itemCampania.nomDepartamento = vm.mDepartamento.descripcion;
          reloadFiltersData('prvnce', { cmstro: "101", prmtro1: vm.mDepartamento.codigo, prmtro2: "", prmtro3: "", prmtro4: "" }, false);
          }else{
            vm.itemCampania.nomDepartamento = "";
            reloadFiltersData('prvnce', { cmstro: "101", prmtro1: "", prmtro2: "", prmtro3: "", prmtro4: "" }, false);
        }
        }

        $scope.mMostrarLimpiarContacto = false;
          $scope.buscarContacto = function(text) {          
          if (text && text.length >= 3) {
            var defer = $q.defer();
              proxyContacto.GetContacto(text)
              .then(function (response) {
                if (response.operationCode == 200) {
                  datosContacto = response.data;
                    defer.resolve(response.data);                     
                }
              }, function (response) { 
              });
            return defer.promise;
          }
        }
        $scope.pressedKey = function(keyObj) {
          if(keyObj.code =="Backspace" || keyObj.code =="Delete" ){
            if(typeof(vm.entidadAviso.contacto) ==="object"){
              $scope.limpiarContacto();
            }
          }
          $scope.myKey = keyObj.key;
        }
        $scope.limpiarContacto  = function (){          
          $scope.mMostrarLimpiarContacto = false;
          vm.entidadAviso.contacto = '';          
          vm.entidadAviso.telefonoContacto = '';
          vm.entidadAviso.CorreoContacto = '';
        }
        $scope.$watch('$ctrl.entidadAviso.contacto', function (contacto) {
          if(typeof contacto === "object"){
            $scope.mMostrarLimpiarContacto = true;
            vm.entidadAviso.telefonoContacto = contacto.telefono;
            vm.entidadAviso.CorreoContacto = contacto.correo;
            $scope.avisoAgricolaForm.nCelular.$pristine = false;
            $scope.avisoAgricolaForm.nCorreo.$pristine  = false;
              }
          });


        function onInit() {
          vm.selectCultivo = selectCultivo;
          vm.selectDepartamento = selectDepartamento;
          vm.selectDistrito = selectDistrito;
          vm.selectSectorEstadistico = selectSectorEstadistico;
          vm.selectSuperficieAsegurada = selectSuperficieAsegurada;
          vm.selectEstadoFenologico = selectEstadoFenologico;
          vm.calcularTipoPerdida = calcularTipoPerdida;
          vm.searchEstadoFenologico = searchEstadoFenologico;
          vm.reloadFiltersData = reloadFiltersData;
          vm.crearAviso = crearAviso;
          vm.validarForm = validarForm;
          vm.crearAviso02 = crearAviso02;

          setInitialData();
        }
      }]).
    component('formAviso', {
      templateUrl: '/atencionsiniestrosagricola/app/components/aviso/form-aviso.html',
      controller: 'formAvisoController',
      bindings: {
        masters: '=?',
        reloadMasters: '&?'
      }
    })
});