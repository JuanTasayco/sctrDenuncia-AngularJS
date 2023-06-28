define([
  'angular', 'constantsSepelios'
], function (ng, constantsSepelios) {
  formEmisionController.$inject = ['mModalAlert', 'campoSantoFactory', 'campoSantoService', 'mpSpin'];
  function formEmisionController(mModalAlert, campoSantoFactory, campoSantoService, mpSpin) {
    var vm = this;
    vm.isReadOnly = !campoSantoFactory.isPreemitidoEditable();
    vm.getDepartamentos = getDepartamentos;
    vm.getProvincia = getProvincia;
    vm.getDistrito = getDistrito;
    vm.getPersonEquifax = getPersonEquifax;
    vm.$onInit = function () {
      vm.constantsCps = constantsSepelios;
      vm.userRoot = campoSantoFactory.userRoot();
      vm.format = constants.formats.dateFormat;
      vm.maxlengthnroDocumento = 8;
      var fechaActual = new Date();
      fechaActual.toISOString();
      vm.validadores = {
        minStartDate: new Date(),
        minStartDateFormat: campoSantoFactory.formatearFecha(new Date()),
        maxEndDate: fechaActual
      }
      
      vm.tipoBeneficiario = [{Codigo:"TI", Text: "TITULAR"},{Codigo:"IN", Text: "INTEGRANTE"}];

      campoSantoService.getSexo().then(function (response) {
        vm.sexo = response.Data
      })
      campoSantoService.getProfesionesAll().then(function (response) {
        vm.profesion = response.Data
      })
      campoSantoService.getOcupacion().then(function (response) {
        vm.ocupacion = response.data.Data
      })
      campoSantoService.getListPais().then(function (response) {
        vm.pais = response.Data;
        setTimeout(function () {
          vm.cotizacion.modelo.pais = {
            Codigo: vm.cotizacion.modelo.idPais || 'PE'
          }
          if (vm.cotizacion.modelo.pais.Codigo) {
            getDepartamentos(vm.cotizacion.modelo.pais, true);
          }
        }, 1000);
      })
      campoSantoService.getNumeracionDomicilio().then(function (response) {
        vm.numeracion = response.Data
      })
      campoSantoService.getListTipo().then(function (response) {
        vm.domicilio = response.Data
      })
      campoSantoService.getListInterior().then(function (response) {
        vm.interior = response.Data
      })
      campoSantoService.getListZona().then(function (response) {
        vm.zona = response.Data
      })
      campoSantoService.getProxiListEstadoCivil().then(function (response) {
        vm.estadoCivil = response.Data
      })
      campoSantoService.getDocumentTypes({ appCode: "FUNERARIAS", formCode: "COT-FUN-CN" }).then(function (response) {
        if (vm.cabecera === "Tomador") {
          vm.tipoDocumento = response.Data;
        } else {
          vm.tipoDocumento = response.Data.filter(function (item) { return item.Codigo !== "RUC" });
        }
      })
      campoSantoService.listaParentesco().then(function (response) {
        vm.parentesco = response.Data
      })
      setTimeout(function () {    
        if (!vm.cotizacion.modelo) return;
        vm.ramo =  campoSantoFactory.cotizacion.datosCotizacion.idRamo;
        vm.cotizacion.isDiferenteDeRuc = vm.cotizacion.modelo.idDocumento && vm.cotizacion.modelo.idDocumento.Codigo === 'RUC' ? false : true;
        vm.labelName = vm.cotizacion.isDiferenteDeRuc ? "Nombres" : "Razón Social";
        vm.maxlengthnroDocumento = vm.cotizacion.isDiferenteDeRuc ? 8 : 11;
        _validCamposRequeridos();
        vm.cotizacion.modelo.fechaNacimiento =  vm.cotizacion.modelo.fechaNacimiento ? new Date(vm.cotizacion.modelo.fechaNacimiento) : null;
        vm.cotizacion.modelo.fechaDefuncion = vm.cotizacion.modelo.fechaDefuncion ? new Date(vm.cotizacion.modelo.fechaDefuncion) : null;
        vm.cotizacion.modelo.tipoBeneficiario = {
          Codigo: vm.cotizacion.modelo.tipoBeneficiario || null
        }
        vm.cotizacion.modelo.estadoCivil = {
          CodigoEstadoCivil: vm.cotizacion.modelo.idEstadoCivil || null
        }
        vm.cotizacion.modelo.parentesco = {
          Codigo: vm.cotizacion.modelo.codParentesco || null
        }
        vm.cotizacion.modelo.sexo = {
          Codigo: vm.cotizacion.modelo.idSexo || null
        }
        vm.cotizacion.modelo.profesion = {
          codProfesionBE: vm.cotizacion.modelo.idProfesion || 61
        }
        vm.cotizacion.modelo.ocupacion = {
          Codigo: vm.cotizacion.modelo.idOcupacion || 99
        }
        vm.cotizacion.modelo.nacionalidad = {
          Codigo: vm.cotizacion.modelo.idNacionalidad || "PE"
        }
        vm.cotizacion.modelo.domicilio = {
          Codigo: vm.cotizacion.modelo.idTipoDomicilio || null
        }
        vm.cotizacion.modelo.numeracion = {
          Codigo: vm.cotizacion.modelo.idNumero || null
        }
        vm.cotizacion.modelo.interior = {
          Codigo: vm.cotizacion.modelo.idInterior || null
        }
        vm.cotizacion.modelo.zona = {
          Codigo: vm.cotizacion.modelo.idZona || null
        }
        document.getElementById("formEmitir").click();
      }, 1000)
    };

    function getPersonEquifax(){
      if (vm.cotizacion.modelo.idDocumento.Codigo && vm.cotizacion.modelo.numDocumento){
        mpSpin.start();
        campoSantoService.getDatosPersona(vm.cotizacion.modelo.idDocumento.Codigo,vm.cotizacion.modelo.numDocumento).then(function (response) {
          mpSpin.end();
          setValues(response.Data);
        }).catch(function (e) {
          mpSpin.end();
        });
      }
    }

    function getFechaNacimiento(dateString){
      if (dateString){
        if (dateString.length == 10){
          var dateSplit = dateString.split('/');
          return new Date(dateSplit[2], dateSplit[1], dateSplit[0]);
        }
      }
      return null;
    }

    function setValues(data){
      if (!data) return;
      vm.cotizacion.modelo.nombre = data.Nombre;
      vm.cotizacion.modelo.paterno = data.ApellidoPaterno;
      vm.cotizacion.modelo.materno = data.ApellidoMaterno;
      vm.cotizacion.modelo.fechaNacimiento = getFechaNacimiento(data.FechaNacimiento);
      vm.cotizacion.modelo.sexo = {
        Codigo: data.Sexo
      };
      vm.cotizacion.modelo.celular1 = data.Telefono;
      vm.cotizacion.modelo.celular2 = data.Telefono2;
      vm.cotizacion.modelo.correoElectronico = data.CorreoElectronico;
      vm.cotizacion.modelo.departamento = {
        Codigo: data.Ubigeo.CodigoDepartamento || null
      };
      vm.cotizacion.modelo.provincia = {
        Codigo: data.Ubigeo.CodigoProvincia || null
      };
      vm.cotizacion.modelo.distrito = {
        Codigo: data.Ubigeo.CodigoDistrito || null
      };
      vm.cotizacion.modelo.domicilio = {
        Codigo: data.Ubigeo.CodigoVia || null
      };
      vm.cotizacion.modelo.descripcionDomicilio = data.Ubigeo.ViaDescripcion;
      vm.cotizacion.modelo.numeracion = {
        Codigo: data.Ubigeo.CodigoNumero || null
      };
      vm.cotizacion.modelo.descripcionNumero = data.Ubigeo.NumeroDescripcion;
      vm.cotizacion.modelo.interior = {
        Codigo: data.Ubigeo.CodigoInterior || null
      };;
      vm.cotizacion.modelo.descripcionInterior = data.Ubigeo.InteriorDescripcion;
      vm.cotizacion.modelo.zona = {
        Codigo: data.Ubigeo.CodigoZona || null
      };
      vm.cotizacion.modelo.descripcionZona = data.Ubigeo.ZonaDescripcion;
      vm.cotizacion.modelo.referencia = data.Ubigeo.Referencia;
      getDepartamentos(vm.cotizacion.modelo.pais, true);
    }

    function getDepartamentos(pais, isAutocomplete) {
      if ((!pais ? null : pais.Codigo) == null) return;
      campoSantoService.getDepartamento(pais.Codigo).then(function (response) {
        vm.departamento = response.Data;
        if (isAutocomplete) {
          setTimeout(function () {
            if (vm.cotizacion.modelo.departamento || !vm.cotizacion.modelo.departamento.Codigo){
            vm.cotizacion.modelo.departamento = {
              Codigo: vm.cotizacion.modelo.idDepartamento || null
            }
            }
            getProvincia(vm.cotizacion.modelo.departamento, true);
          }, 500)
        }

      })
    }

    function getProvincia(departamento, isAutocomplete) {
      if ((!departamento ? null : departamento.Codigo) == null) return;
      campoSantoService.getProvincia(departamento.Codigo, vm.cotizacion.modelo.pais.Codigo).then(function (response) {
        vm.provincia = response.Data;
        if (isAutocomplete) {
          setTimeout(function () {
            if (vm.cotizacion.modelo.provincia || !vm.cotizacion.modelo.provincia.Codigo){
              vm.cotizacion.modelo.provincia = {
                Codigo: vm.cotizacion.modelo.idProvincia || null
              }
            }
            getDistrito(vm.cotizacion.modelo.provincia, true);
          }, 500)
        }
      })
    }

    function getDistrito(provincia, isAutocomplete) {
      if ((!provincia ? null : provincia.Codigo) == null) return;
      campoSantoService.getDistrito(provincia.Codigo, vm.cotizacion.modelo.pais.Codigo).then(function (response) {
        vm.distrito = response.Data;
        if (isAutocomplete) {
          setTimeout(function () {
            if (vm.cotizacion.modelo.distrito || !vm.cotizacion.modelo.distrito.Codigo){
              vm.cotizacion.modelo.distrito = {
                Codigo: vm.cotizacion.modelo.idDistrito || null
            }
            }
          }, 500)
        }
      })
    }



    function _validCamposRequeridos() {
        if (vm.cabecera === "Beneficiario" && vm.ramo == vm.constantsCps.RAMOS.NI) {
          _infoPersonal();
        }
        if (vm.cabecera === "Beneficiario" && vm.ramo == vm.constantsCps.RAMOS.NF) {
          _infoPersonal(); vm.reqTipoBeneficiario = true;
        }
        if (vm.cabecera === "Tomador") {
          _infoPersonal();
          _infoPersonalDireccion();
          if (vm.userRoot) {
            _datosContactoEmisor(); 
            _datosDireccion();
          }
          else {
            _datosContactoAgente();
          }
        }
        if (vm.cabecera === "Aval") {
          _infoPersonal();_datosContactoEmisor();_datosDireccion();
        }

    }

    function _infoPersonal() {
      vm.reqTiDocumento = true;
      vm.reqNrDocumento = true;
      vm.reqNombres = true;
      vm.reqApellido1 = true;
      vm.reqApellido2 = true;
      vm.reqFecNac = true;
      vm.reqSexo = true;
      vm.reqEstadoCivil = true;
      vm.reqFechaDefuncion = true;
      vm.reqParentesco = true;
      vm.reqOcupacion = true;
      vm.reqNacionalidad = true;
    }

    function _infoPersonalDireccion() {
      vm.reqNumeracion = true;
      vm.reqEnumeracion = true;
    }

    function _datosContactoAgente() {
      vm.reqCel1 = false;
      vm.reqCel2 = true;
      vm.reqEmail = true;
    }

    function _datosContactoEmisor() {
      vm.reqCel1 = false;
      vm.reqCel2 = true;
      vm.reqEmail = true;
    }

    function _datosDireccion(){
      vm.reqPais = true;
      vm.reqDepartamento = true;
      vm.reqProvincia = true;
      vm.reqDistrito = true;
      vm.reqVia = true;
      vm.reqNombreVia = true;
    }


  } // end controller
  return ng.module('appSepelio')
    .controller('formEmisionController', formEmisionController)
    .component('cpsformEmision', {
      templateUrl: '/polizas/app/sepelio/components/form-emision/form-emision.component.html',
      controller: 'formEmisionController',
      bindings: {
        cotizacion: '=',
        form: '=?form',
        disabled: '=',
        index: "=?",
        cabecera: '='
      }
    })
});
