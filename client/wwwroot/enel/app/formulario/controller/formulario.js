(function($root, deps, action){
    define(deps, action)
})(this, ['angular', 'constants', 'helper', '/enel/app/formulario/service/formularioFactory.js'], 
  function(angular, constants, helper){

    var appEnel = angular.module('appEnel');

    appEnel.controller('enelFormularioController', 
      ['$scope', '$window', '$state', '$timeout',  '$q', '$filter', '$stateParams', 'accessSupplier', 'mModalConfirm', 'mModalAlert', 'formularioFactory', 'formularioTipoProductos', 'formularioTipoDocumentos', 'formularioDepartamentos', 'formularioEmpresas',
      function($scope, $window, $state, $timeout, $q, $filter, $stateParams, accessSupplier, mModalConfirm, mModalAlert, formularioFactory, formularioTipoProductos, formularioTipoDocumentos, formularioDepartamentos, formularioEmpresas){

        (function onLoad(){
          $scope.mainForm = $scope.mainForm || {};

          $scope.mainForm.formatDate = constants.formats.dateFormat;
          $scope.mainForm.formatDate1 = 'yyyy-MM-dd';
          $scope.mainForm.formatDate2 = 'dd-MM-yyyy';
          $scope.mainForm.mask = constants.formats.dateFormatMask;
          $scope.mainForm.pattern = constants.formats.dateFormatRegex;
          
          $scope.mainForm.filterDate = $filter('date');

          $scope.currentDoc = {};

          $scope.showNaturalRucPerson = true;

          // _calendarInicioVigencia();
          _calendarFechaNacimiento();

          $scope.mainForm.userProfile = accessSupplier.profile();

          // Departamentos 
          $scope.mainForm.contratanteDepartamentoData = formularioDepartamentos;  
          $scope.mainForm.asegurableDepartamentoData = formularioDepartamentos; 
          // Tipo de producto
          $scope.mainForm.selectProductoData = formularioTipoProductos;
          // Tipo de documento
          $scope.mainForm.contratanteTipoDocumentoData = formularioTipoDocumentos;
          // Tipo de empresa
          $scope.mainForm.tipoEmpresaData = formularioEmpresas;

          //Default - New
          $scope.mainForm.anios_construccion = 0;
          $scope.mainForm.contratante_estado_civil = 0;
          $scope.mainForm.id_afiliacion_producto = 0;
          $scope.mainForm.id_acceso_digitador = 0; // ??
          $scope.mainForm.pisos = 0;
          $scope.mainForm.sotanos = 0;
          $scope.mainForm.valor_declarado = 0.0;
          $scope.mainForm.materia_seguro = '';
          $scope.mainForm.fecha_venta = new Date();
          $scope.mainForm.fecha_inicio_vigencia = new Date();

          var vTitle;
          if ($stateParams.id_afiliado_producto) {
            // Si se está editando el certificado
            vTitle = 'OIM - Enel - Certificado Detalle';
            _afiliado($stateParams.id_afiliado_producto);
            $scope.isNuevoCertificado = false;
          } else {
            // Si es un nuevo certificado
            vTitle = 'OIM - Enel - Nuevo Certificado';
            $scope.isNuevoCertificado = true;
          }
          document.title = vTitle;

        })();

        function _calendarFechaNacimiento(){
          $scope.todayFechaNacimiento = function() {
            $scope.mainForm.mContratanteFechaNacimiento = null; //new Date();
          };
          $scope.todayFechaNacimiento();

          $scope.mainForm.inlineOptions = {
            minDate: new Date(),
            showWeeks: true
          };

          $scope.mainForm.dateOptionsFechaNacimiento = {
            dateDisabled: function(data){
              var date = data.date;
              var _today = new Date(); 
              _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
              return date > _today;
            },
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
          };

          $scope.toggleMinFechaNacimiento = function() {
            $scope.mainForm.inlineOptions.minDate = $scope.mainForm.inlineOptions.minDate ? null : new Date();
            $scope.mainForm.dateOptionsFechaNacimiento.minDate = $scope.mainForm.inlineOptions.minDate;
          };
          $scope.toggleMinFechaNacimiento();

          $scope.openFechaNacimiento = function() {
            $scope.mainForm.popupFechaNacimiento.opened = true;
          };

          $scope.mainForm.altInputFormats = ['M!/d!/yyyy'];

          $scope.mainForm.popupFechaNacimiento = {
            opened: false
          };
          
          $scope.openInicioVigencia = function() {
            $scope.mainForm.popupInicioVigencia.opened = true;
          };

          $scope.mainForm.popupInicioVigencia = {
            opened: false
          };
        }

        function _toDate(ins) {
          if (!ins || ins ==='') {
            return new Date();
          }
          return new Date(ins.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, '$3-$2-$1'));
        }

        function _listarSumaAsegurada(producto_id){
          var defer = $q.defer();
          $scope.mainForm.sumaAseguradaData = [];
          formularioFactory.getSumaAsegurada(producto_id,true).then(function(response){
            if (response.length > 0) {
              // console.log(response);
              defer.resolve(response);
              $scope.mainForm.sumaAseguradaData = response;
              angular.forEach(response, function(value,key){
                $scope.mainForm.sumaAseguradaData[key].Descripcion = $scope.mainForm.sumaAseguradaData[key].descripcion + ' ' + $filter('currency')($scope.mainForm.sumaAseguradaData[key].monto, 'S/.', 2);
              });
            } else {
              console.log('No se pudo cargar sumas aseguradas.')
            }
          }, function(error){
            defer.reject(error.statusText);
          });
          return defer.promise;
        }

        function _listaProvincias(departamento_id){
          var defer = $q.defer();
          formularioFactory.getLocalizacion(departamento_id,0, true).then(function(response){
            if (response.length > 0) {
              defer.resolve(response);
            } else {
              console.log('No se pudo cargar la lista de provincias.')
            }
          }, function(error){
            defer.reject(error.statusText);
          });
          // console.log(defer.promise);
          return defer.promise;
        }

        function _listaDistritos(departamento_id, provincia_id){
          var defer = $q.defer();
          formularioFactory.getLocalizacion(departamento_id,provincia_id, true).then(function(response){
            if (response.length > 0) {
              defer.resolve(response);
            } else {
              console.log('No se pudo cargar la lista de distritos.')
            }
          }, function(error){
            defer.reject(error.statusText);
          });
          return defer.promise;
        }

        function _giroNegocio(empresa_id){
          $scope.mainForm.giroNegocioData = [];
          var defer = $q.defer();
          formularioFactory.getGiroNegocio(empresa_id,true).then(function(response) {
            if (response.length > 0) {
              defer.resolve(response);
              $scope.mainForm.giroNegocioData = response;
            } else {
              console.log('No se pudo cargar la lista de giros de negocios.');
            }
          }, function(error){
            defer.reject(error.statusText);
          });
          return defer.promise;
        }

        // Para traer datos de afiliado
        function _afiliado(id){
          formularioFactory.getAfiliado(id, true).then(function(afiliado){
            // console.log('afiliado: ' + JSON.stringify(afiliado));
            if (afiliado) {

              var paramsContractor = {
                documentType:   afiliado.contratante_tipo_documento,
                documentNumber: afiliado.contratante_numero_documento
              }
              $scope.currentDoc = paramsContractor;

              $scope.searchedPerson = true;
              

              $scope.mainForm.mNroCertificado = afiliado.certificado;
              $scope.mainForm.mNomVendedor = afiliado.vendedor_nombres;
              $scope.mainForm.mCodVendedor = afiliado.vendedor_codigo;

              $scope.mainForm.mSelectProducto = {
                id_Producto_Tipo_Extendido: afiliado.id_producto_tipo
              }

              _listarSumaAsegurada(afiliado.id_producto_tipo).then(function(sumas){
                $scope.mainForm.mSumaAsegurada = {
                  id_Suma_Asegurada: afiliado.id_suma_asegurada //3
                };
              }, function(error){
                console.log('No se pudo cargar giros de negocio.')
              });

              // $scope.mainForm.mContratanteTipoDocumento.codigo = afiliado.contratante_tipo_documento;
              $scope.mainForm.mContratanteTipoDocumento = {
                codigo: afiliado.contratante_tipo_documento
              };
              $scope.mainForm.mContratanteNroDocumento = afiliado.contratante_numero_documento;

              $scope.showNaturalRucPerson = _showNaturalRucPerson(afiliado.contratante_tipo_documento);
              if ($scope.showNaturalRucPerson){
                $scope.mainForm.mNomContratante = afiliado.contratante_nombres;
                $scope.mainForm.mApellidoPaterno = afiliado.contratante_paterno;
                $scope.mainForm.mApellidoMaterno = afiliado.contratante_materno;  
                $scope.mainForm.mContratanteFechaNacimiento = _toDate(afiliado.contratante_fecha_nacimiento);
                $scope.mainForm.mSexo = afiliado.contratante_sexo;
              }else{
                $scope.mainForm.mRazonSocial = afiliado.contratante_paterno;
              }
              
              $scope.mainForm.mContratanteCorreoElectronico = afiliado.contratante_correo_electronico.trim();
              $scope.mainForm.mContratanteTelefono = afiliado.contratante_telefono;
              
              $scope.mainForm.mDomicilio = afiliado.contratante_direccion;
              // $scope.mainForm.mContratanteDepartamento.id_Departamento = afiliado.contratante_id_departamento;
              $scope.mainForm.mContratanteDepartamento = {
                id_Departamento: afiliado.contratante_id_departamento
              }

              _listaProvincias(afiliado.contratante_id_departamento).then(function(provincias){
                $scope.mainForm.contratanteProvinciaData = provincias;
                $scope.mainForm.mContratanteProvincia = {}
                $scope.mainForm.mContratanteProvincia.id_Provincia = afiliado.contratante_id_provincia;
              }, function(error){
                console.log('No se pudo cargar provincia.')
              });
              _listaDistritos(afiliado.contratante_id_departamento, afiliado.contratante_id_provincia).then(function(distritos){
                $scope.mainForm.contratanteDistritoData = distritos;
                $scope.mainForm.mContratanteDistrito = {}
                $scope.mainForm.mContratanteDistrito.id_Distrito = afiliado.contratante_id_distrito;
              }, function(error){
                console.log('No se pudo cargar distrito.')
              });
              

              // $scope.mainForm.mTipoEmpresa.id_Empresa_Tipo = afiliado.id_empresa_tipo;
              $scope.mainForm.mTipoEmpresa = {
                id_Empresa_Tipo: afiliado.id_empresa_tipo
              }
              // _setGiroNegocio(afiliado.id_empresa_tipo, afiliado.id_empresa_giro);
              _giroNegocio(afiliado.id_empresa_tipo).then(function(giros){
                $scope.mainForm.giroNegocioData = giros;
                $scope.mainForm.mGiroNegocio = {};
                $scope.mainForm.mGiroNegocio.id_Empresa_Giro = afiliado.id_empresa_giro;
              });

              $scope.mainForm.mNroSuministro = afiliado.numero_suministro;
              $scope.mainForm.mDireccionRiesgo = afiliado.suministro_direccion;
              // $scope.mainForm.mAsegurableDepartamento.id_Departamento = afiliado.suministro_id_departamento;
              $scope.mainForm.mAsegurableDepartamento = {
                id_Departamento: afiliado.suministro_id_departamento
              }

              _listaProvincias(afiliado.suministro_id_departamento).then(function(provincias){
                $scope.mainForm.asegurableProvinciaData = provincias;
                $scope.mainForm.mAsegurableProvincia = {}
                $scope.mainForm.mAsegurableProvincia.id_Provincia = afiliado.suministro_id_provincia;
              }, function(error){
                console.log('No se pudo cargar provincia.')
              });
              _listaDistritos(afiliado.suministro_id_departamento, afiliado.suministro_id_provincia).then(function(distritos){
                $scope.mainForm.asegurableDistritoData = distritos;
                $scope.mainForm.mAsegurableDistrito = {}
                $scope.mainForm.mAsegurableDistrito.id_Distrito = afiliado.suministro_id_distrito;
              }, function(error){
                console.log('No se pudo cargar distrito.')
              });

              $scope.mainForm.mCategoriaAsegurada = afiliado.categoria_construccion;

              $scope.mainForm.anios_construccion = afiliado.anios_construccion;
              $scope.mainForm.id_afiliacion_producto = id;
              $scope.mainForm.id_acceso_digitador = afiliado.id_acceso_digitador; // ??
              $scope.mainForm.contratante_estado_civil = afiliado.contratante_estado_civil;
              $scope.mainForm.pisos = afiliado.pisos;
              $scope.mainForm.sotanos = afiliado.sotanos;
              $scope.mainForm.valor_declarado = afiliado.valor_declarado;
              $scope.mainForm.materia_seguro = afiliado.materia_seguro;
              $scope.mainForm.fecha_venta = afiliado.fecha_venta;

            } else {
              mModalAlert.showError('No se pudo cargar datos del afiliado.','Error').then(function(r){
                $state.go('enelBandeja');
              }); 
              // console.log('No se pudo cargar datos del afiliado.')
            }
          }, function(error){
            mModalAlert.showError('No se pudo cargar datos del afiliado.','Error').then(function(r){
              $state.go('enelBandeja');
            }); 
          });
        }

        // Lista de Sumas Aseguradas
        $scope.listarSumaAsegurada = function(producto){
          _listarSumaAsegurada(producto.id_Producto_Tipo_Extendido);
        }

        // Si es RUC
        $scope.updateTipoDoc = function(documentType){
          $scope.showNaturalRucPerson = (typeof documentType != 'undefined') ? _showNaturalRucPerson(documentType.codigo) : true;
        }
        

        function _showNaturalRucPerson(documentType){
          var vResult = documentType == 6;
          return !vResult;
        }

        function _clearContractor(cbo){
          if (cbo) $scope.mainForm.mContratanteNroDocumento = '';
          $scope.mainForm.mRazonSocial = '';
          $scope.mainForm.mNomContratante = '';
          $scope.mainForm.mApellidoPaterno = '';
          $scope.mainForm.mApellidoMaterno = '';
          $scope.mainForm.mContratanteFechaNacimiento = null;
          $scope.mainForm.mSexo = '';
          $scope.mainForm.mContratanteDepartamento = {
            id_Departamento: null
          };
          $scope.mainForm.contratanteProvinciaData = [];
          $scope.mainForm.mContratanteProvincia = {
            id_Provincia: null
          };
          $scope.mainForm.contratanteDistritoData = [];
          $scope.mainForm.mContratanteDistrito = {
            id_Distrito: null
          };
          $scope.mainForm.mDomicilio = '';
          $scope.mainForm.mNroSuministro = '';
          $scope.mainForm.mContratanteTelefono = '';
          $scope.mainForm.mContratanteCorreoElectronico = '';
          $scope.mainForm.mTipoEmpresa = {
            id_Empresa_Tipo: null
          };
          $scope.mainForm.giroNegocioData = [];
          $scope.mainForm.mGiroNegocio = {
            id_Empresa_Giro: null
          };

          $scope.mainForm.contratante_estado_civil = 0;
        }

        $scope.contratanteData = function(cbo){
          (cbo) ? cbo = true : false;

          var paramsContractor = {
            documentType:   ($scope.mainForm.mContratanteTipoDocumento && $scope.mainForm.mContratanteTipoDocumento.codigo) ? $scope.mainForm.mContratanteTipoDocumento.codigo :  null,
            documentNumber: $scope.mainForm.mContratanteNroDocumento
          }

          if (paramsContractor.documentType && 
              paramsContractor.documentNumber && 
              paramsContractor.documentNumber !== '' && 
              ($scope.currentDoc['documentType'] !== paramsContractor.documentType || $scope.currentDoc['documentNumber'] !== paramsContractor.documentNumber)){

              _clearContractor(cbo);

              $scope.currentDoc = paramsContractor;

              formularioFactory.getContratante(paramsContractor.documentType, paramsContractor.documentNumber, true).then(function(response){
                var vValue = response;
                if (vValue){
                  $scope.searchedPerson = true;
                  $scope.showNaturalRucPerson = _showNaturalRucPerson(paramsContractor.documentType);
                  if ($scope.showNaturalRucPerson){
                    $scope.mainForm.mNomContratante = vValue.contratante_Nombres;
                    $scope.mainForm.mApellidoPaterno = vValue.contratante_Paterno;
                    $scope.mainForm.mApellidoMaterno = vValue.contratante_Materno;
                    $scope.mainForm.mContratanteFechaNacimiento = _toDate(vValue.contratante_Fecha_Nacimiento);
                    $scope.mainForm.mSexo = vValue.contratante_Sexo;
                  }else{
                    $scope.mainForm.mRazonSocial = vValue.contratante_Paterno // => contratante_Paterno para RAZON SOCIAL
                  }
                  $scope.mainForm.mContratanteDepartamento = {
                    id_Departamento: vValue.contratante_Id_Departamento
                  }
                  _listaProvincias(vValue.contratante_Id_Departamento).then(function(provincias){
                    $scope.mainForm.contratanteProvinciaData = provincias;
                    $scope.mainForm.mContratanteProvincia = {}
                    $scope.mainForm.mContratanteProvincia.id_Provincia = vValue.contratante_Id_Provincia;
                  }, function(error){
                    console.log('No se pudo cargar provincia.')
                  });
                  _listaDistritos(vValue.contratante_Id_Departamento, vValue.contratante_Id_Provincia).then(function(distritos){
                    $scope.mainForm.contratanteDistritoData = distritos;
                    $scope.mainForm.mContratanteDistrito = {}
                    $scope.mainForm.mContratanteDistrito.id_Distrito = vValue.contratante_Id_Distrito;
                  }, function(error){
                    console.log('No se pudo cargar distrito.')
                  });
                  $scope.mainForm.mDomicilio = vValue.contratante_Direccion;
                  $scope.mainForm.mContratanteTelefono = vValue.contratante_Telefono;
                  $scope.mainForm.mContratanteCorreoElectronico = vValue.contratante_Correo_Electronico;
                }                
              }, function(error){
                // console.log('error');
              }, function(defaultError){
                // console.log('errorDefault');
              });
          }

        }

        
        function _clearSearchContractor(){
          $scope.searchedPerson = false;
          $scope.mainForm.mContratanteTipoDocumento = {
            codigo: null
          };
          $scope.currentDoc["documentType"] = undefined;
          $scope.currentDoc["documentNumber"] = undefined;
          _clearContractor(true);
        }
        
        $scope.clearSearchContractor = function(){
          _clearSearchContractor();
        }


        $scope.listarProvContratante = function(departamento){
          $scope.mainForm.contratanteProvinciaData = [];
          _listaProvincias(departamento.id_Departamento).then(function(provincias){
            $scope.mainForm.contratanteProvinciaData = provincias;
          }, function(error){
            deferred.reject(error.statusText);
          });
        }
        $scope.listarDistContratante = function(departamento, provincia){
          $scope.mainForm.contratanteDistritoData = [];
          if (departamento && provincia){
            _listaDistritos(departamento.id_Departamento, provincia.id_Provincia).then(function(distritos){
              $scope.mainForm.contratanteDistritoData = distritos;
            }, function(error){
              deferred.reject(error.statusText);
            });
          }
        }

        $scope.giroNegocio = function(empresa){
          _giroNegocio(empresa.id_Empresa_Tipo);
        }

        $scope.listarProvAsegurable = function(departamento){
          $scope.mainForm.asegurableProvinciaData = [];
          _listaProvincias(departamento.id_Departamento).then(function(provincias){
            $scope.mainForm.asegurableProvinciaData = provincias;
          }, function(error){
            deferred.reject(error.statusText);
          });
        }
        $scope.listarDistAsegurable = function(departamento, provincia){
          $scope.mainForm.asegurableDistritoData = [];
          if (departamento && provincia){
            _listaDistritos(departamento.id_Departamento, provincia.id_Provincia).then(function(distritos){
              $scope.mainForm.asegurableDistritoData = distritos;
            }, function(error){
              deferred.reject(error.statusText);
            });
          }
        }


        function _paramsRegister(){
          var vParams ={
            "Id_Afiliacion_Producto"          : parseInt($scope.mainForm.id_afiliacion_producto), //0, //_afiliado UPDATE
            "Digitador_Nombres"               : $scope.mainForm.userProfile.userName.trim(), // '', //"Carolina",
            "Digitador_Paterno"               : '', //"Mendoza",
            "Digitador_Materno"               : '', //"Aranibal",
            "Digitador_Tipo_Documento"        : 0,  //1,
            "Digitador_Numero_Documento"      : $scope.mainForm.userProfile.documentNumber, //'', //"565685789757",
            "Contratante_Paterno"             : ($scope.showNaturalRucPerson) ? (typeof $scope.mainForm.mApellidoPaterno == 'undefined') ? '' : $scope.mainForm.mApellidoPaterno : (typeof $scope.mainForm.mRazonSocial == 'undefined') ? '' : $scope.mainForm.mRazonSocial, //"Leiva", // RAZN SOCIAL
            "Contratante_Materno"             : ($scope.showNaturalRucPerson) ? (typeof $scope.mainForm.mApellidoMaterno == 'undefined') ? '' : $scope.mainForm.mApellidoMaterno : (typeof $scope.mainForm.mRazonSocial == 'undefined') ? '' : $scope.mainForm.mRazonSocial, //"Medrano",
            "Contratante_Nombres"             : ($scope.showNaturalRucPerson) ? (typeof $scope.mainForm.mNomContratante == 'undefined') ? '' : $scope.mainForm.mNomContratante : (typeof $scope.mainForm.mRazonSocial == 'undefined') ? '' : $scope.mainForm.mRazonSocial, //" Esperanza ",
            "Contratante_Tipo_Documento"      : ($scope.mainForm.mContratanteTipoDocumento.codigo) ? $scope.mainForm.mContratanteTipoDocumento.codigo : 0, //1,
            "Contratante_Numero_Documento"    : (typeof $scope.mainForm.mContratanteNroDocumento == 'undefined') ? '' : $scope.mainForm.mContratanteNroDocumento, //"5675675850",
            "Contratante_Fecha_Nacimiento"    : ($scope.showNaturalRucPerson) ? $scope.mainForm.filterDate($scope.mainForm.mContratanteFechaNacimiento, $scope.mainForm.formatDate1) : '',  //"01-01-1988",
            "Contratante_Sexo"                : ($scope.showNaturalRucPerson) ? $scope.mainForm.mSexo : 0, //1, //VALIDAR
            "Contratante_Estado_Civil"        : $scope.mainForm.contratante_estado_civil, //1, //_afiliado UPDATE
            "Contratante_Direccion"           : (typeof $scope.mainForm.mDomicilio == 'undefined') ? '' : $scope.mainForm.mDomicilio, //"Avenida Espinar 355",
            "Contratante_Id_Departamento"     : ($scope.mainForm.mContratanteDepartamento.id_Departamento) ? $scope.mainForm.mContratanteDepartamento.id_Departamento : 0, //15,
            "Contratante_Id_Provincia"        : (typeof $scope.mainForm.mContratanteProvincia != 'undefined' && $scope.mainForm.mContratanteProvincia.id_Provincia) ? $scope.mainForm.mContratanteProvincia.id_Provincia : 0, //1,
            "Contratante_Id_Distrito"         : (typeof $scope.mainForm.mContratanteDistrito != 'undefined' && $scope.mainForm.mContratanteDistrito.id_Distrito) ? $scope.mainForm.mContratanteDistrito.id_Distrito : 0, //4,
            "Contratante_Telefono"            : (typeof $scope.mainForm.mContratanteTelefono == 'undefined') ? '' : $scope.mainForm.mContratanteTelefono, //"654256",
            "Contratante_Correo_Electronico"  : (typeof $scope.mainForm.mContratanteCorreoElectronico == 'undefined') ? '' : $scope.mainForm.mContratanteCorreoElectronico, //"esther@gmail.com",
            "Numero_Suministro"               : (typeof $scope.mainForm.mNroSuministro === 'undefined') ? '' : $scope.mainForm.mNroSuministro, //"73454793597",
            "Suministro_Direccion"            : (typeof $scope.mainForm.mDireccionRiesgo === 'undefined') ? '' : $scope.mainForm.mDireccionRiesgo, //"Calle las rosas 4276",
            "Suministro_Id_Departamento"      : ($scope.mainForm.mAsegurableDepartamento) ? $scope.mainForm.mAsegurableDepartamento.id_Departamento : 0, //15,
            "Suministro_Id_Provincia"         : (typeof $scope.mainForm.mAsegurableProvincia != 'undefined' && $scope.mainForm.mAsegurableProvincia.id_Provincia) ? $scope.mainForm.mAsegurableProvincia.id_Provincia : 0, //1,
            "Suministro_Id_Distrito"          : (typeof $scope.mainForm.mAsegurableDistrito != 'undefined' && $scope.mainForm.mAsegurableDistrito.id_Distrito) ? $scope.mainForm.mAsegurableDistrito.id_Distrito : 0, //13,
            "Materia_Seguro"                  : $scope.mainForm.materia_seguro, //"Negocio", //_afiliado UPDATE
            "Valor_Declarado"                 : $scope.mainForm.valor_declarado, //200000, //_afiliado UPDATE
            "Suma_Asegurada_Principal"        : (typeof $scope.mainForm.mSumaAsegurada != 'undefined' &&  $scope.mainForm.mSumaAsegurada.id_Suma_Asegurada) ? (typeof $scope.mainForm.mSumaAsegurada.monto != 'undefined') ? $scope.mainForm.mSumaAsegurada.monto : 0.00 : 0.0, //190000,
            "Pisos"                           : $scope.mainForm.pisos, //5, //_afiliado UPDATE
            "Sotanos"                         : $scope.mainForm.sotanos, //2, //_afiliado UPDATE
            "Anios_Construccion"              : $scope.mainForm.anios_construccion, //15, //_afiliado UPDATE
            "Categoria_Construccion"          : $scope.mainForm.mCategoriaAsegurada, //1, 
            "Id_Empresa_Tipo"                 : ($scope.mainForm.mTipoEmpresa.id_Empresa_Tipo) ? $scope.mainForm.mTipoEmpresa.id_Empresa_Tipo : 0, //1,
            "Id_Empresa_Giro"                 : (typeof $scope.mainForm.mGiroNegocio != 'undefined' && $scope.mainForm.mGiroNegocio.id_Empresa_Giro) ? $scope.mainForm.mGiroNegocio.id_Empresa_Giro : 0, //1,
            "Id_Producto_Tipo"                : ($scope.mainForm.mSelectProducto.id_Producto_Tipo_Extendido) ? $scope.mainForm.mSelectProducto.id_Producto_Tipo_Extendido : 0, //11,
            "Id_Suma_Asegurada"               : (typeof $scope.mainForm.mSumaAsegurada != 'undefined' &&  $scope.mainForm.mSumaAsegurada.id_Suma_Asegurada) ? $scope.mainForm.mSumaAsegurada.id_Suma_Asegurada : 0, //1,
            "Fecha_Venta"                     : $scope.mainForm.filterDate($scope.mainForm.fecha_venta, $scope.mainForm.formatDate1), //"01/06/2017", //_afiliado UPDATE
            "Fecha_Inicio_Vigencia"           : $scope.mainForm.filterDate($scope.mainForm.fecha_inicio_vigencia, $scope.mainForm.formatDate1), //"01/06/2017", //_afiliado UPDATE
            "Certificado"                     : (typeof $scope.mainForm.mNroCertificado == 'undefined') ? '' : $scope.mainForm.mNroCertificado, //"42536564",
            "Vendedor_Codigo"                 : (typeof $scope.mainForm.mCodVendedor === 'undefined') ? '' : $scope.mainForm.mCodVendedor, //"9469646",
            "Vendedor_Nombres"                : (typeof $scope.mainForm.mNomVendedor === 'undefined') ? '' : $scope.mainForm.mNomVendedor, //"Mariana",
            "Vendedor_Paterno"                : '', //"bellido",
            "Vendedor_Materno"                : '' //"Balcázar"
          }
          // console.log(JSON.stringify(vParams));
          return vParams;
        }

        function _validateForm(){
          $scope.formCertificado.markAsPristine();
          return $scope.formCertificado.$valid;
        }

        $scope.save = function(option){
          var vModalConfirm, vModalAlert;
          if (_validateForm()){
            var vParams = _paramsRegister();
            // vParams.Digitador_Numero_Documento = '12345678'; // BORRAR
            if (option == 'I'){
              vModalAlert = 'registrado';
              vModalConfirm = mModalConfirm.confirmInfo('¿Estás seguro de querer crear este certificado?','CREAR CERTIFICADO','CREAR CERTIFICADO');
            }else{
              vModalAlert = 'actualizado';
              vModalConfirm = mModalConfirm.confirmInfo('¿Estás seguro de querer actualizar la información de este certificado?','ACTUALIZAR CERTIFICADO','ACTUALIZAR CERTIFICADO');
            }
            vModalConfirm.then(function(confirm){
              if (confirm){
                formularioFactory.saveAfiliado(option, vParams, true).then(function(saveResponse){
                  if (saveResponse.sucess > 0){
                    mModalAlert.showSuccess('Certificado ' + vModalAlert + ' exitosamente', 'Éxito').then(function(success){
                      $state.go('enelBandeja');
                    });
                  }else{
                    mModalAlert.showError(saveResponse.msg_Error, 'Error');
                  }
                }, function(error){
                  // console.log('error servicio');
                });
              }
            });

          }
        }  

    }])
    .factory('loaderEnelFormulario', ['formularioFactory', '$q', function(formularioFactory, $q){
      var _productos;
      function initProductos(){
        var deferred = $q.defer();
        formularioFactory.getProducto(true).then(function(response){
          if (response.length > 0) {
            // console.log('Lista de productos...', response);
            _productos = response;
            deferred.resolve(_productos);
          } else {
            console.log('No se pudo cargar la lista de productos.')
          }
        }, function(error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var _tipoDocs;
      function initTipoDocumentos(){
        var deferred = $q.defer();
        formularioFactory.getTipoDocumento(true).then(function(response) {
          // console.log('Tipos de documentos... ', response);
          if (response.length > 0) {
            _tipoDocs = response;
            deferred.resolve(_tipoDocs);
          } else {
            console.log('No se pudo cargar la lista de tipo de documentos.')
          }
        }, function (error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var _departamentos;
      function initDepartametos(){
        var deferred = $q.defer();
        formularioFactory.getLocalizacion(0,0, true).then(function(response){
          if (response.length > 0) {
            // console.log('Lista de departamentos... ', response);
            _departamentos = response;
            deferred.resolve(_departamentos);
          } else {
            console.log('No se pudo cargar la lista de departamentos.')
          }
        }, function(error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      var _empresas;
      function initEmpresas(){
        var deferred = $q.defer();
        formularioFactory.getTipoEmpresa(true).then(function(response) {
          // console.log('Tipos de empresas... ', response);
          if (response.length > 0) {
            _empresas = response;
            deferred.resolve(_empresas);
          } else {
            console.log('No se pudo cargar la lista de tipos de empresas.')
          }
        }, function(error){
          deferred.reject(error.statusText);
        });
        return deferred.promise;
      }

      return {
        initProductos: function(){
          if(_productos) return $q.resolve(_productos);
          return initProductos();
        },
        initTipoDocumentos: function(){
          if (_tipoDocs) return $q.resolve(_tipoDocs);
          return initTipoDocumentos();
        },
        initDepartametos: function(){
          if (_departamentos) return $q.resolve(_departamentos);
          return initDepartametos();
        },
        initEmpresas: function(){
          if (_empresas) return $q.resolve(_empresas);
          return initEmpresas();
        }
      }

    }])

  });
