'use strict';

define(['angular', 'moment',
  '/referencia/app/clientesProveedores/component/clienteProveedoresHistorialModal.js',
  '/referencia/app/clientesProveedores/component/clienteProveedoresProductoItem.js',
  '/referencia/app/clientesProveedores/component/clienteProveedoresProductoPreguntas.js',
  '/referencia/app/clientesProveedores/component/clienteProveedoresModalIniciarAuditoria.js',
  '/referencia/app/clientesProveedores/component/clienteProveedoresModalGuardarAuditoria.js',
  '/referencia/app/clientesProveedores/component/clienteProveedoresModalFinalizarAuditoria.js'
], function(ng, moment) {
  proveeDetalleController.$inject = ['$scope', '$state', 'localStorageService', '$timeout', '$log',
    'staticData', 'dataProveedor', '$uibModal', 'panelService', 'oimPrincipal', 'oimClaims', '$window'];

  function proveeDetalleController($scope, $state, localStorageService, $timeout, $log,
    staticData, dataProveedor, $uibModal, panelService, oimPrincipal, oimClaims, $window) {
    var vm = this;
    vm.loader = {};
    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.isAdmin = oimPrincipal.get_role() === 'ADMREF';
    vm.isDoctor = oimPrincipal.get_role() === 'MEDREF';
    vm.user = {
      code: oimPrincipal.getUsername(),
      name: oimClaims.userName
    };

    vm.$onInit = function oiFn() {
      vm.lvl1 = $state.params.lvl1 || '';
      vm.showLvl1 = !!vm.lvl1;
      vm.lvl2 = $state.params.lvl2 || '';
      vm.showLvl2 = !!vm.lvl2;
      vm.lstDptos = staticData.departamentos;
      vm.onAuditMode = $state.params.auditando;

      vm.showCP = true;
      vm.panel = 'Clientes y Proveedores';
      vm.page = 'Busqueda de Proveedores';
      vm.title = 'Proveedores';
      vm.lvl0 = 'Proveedores';

      vm.data = dataProveedor;
      vm.auditHistory = [];
      vm.auditSaved = true;
      vm.auditSaving = false;
      vm.auditTouched = false;
      vm.auditValid = false;

      if (vm.onAuditMode) {
        dataProveedor.Auditoria.nombresAutor = vm.user.name;
        dataProveedor.Auditoria.autor = vm.user.code;
      }
    };

    var author = dataProveedor.Auditoria.nombresAutor;
    var date = getAuditDate(dataProveedor);

    vm.idAudit = dataProveedor.Auditoria.idAuditoria;
    vm.clinicaName = dataProveedor.DatosGenerales.Proveedor;
    vm.finished = dataProveedor.Auditoria.auditado;
    vm.subtitle = (author) ? author + ', ' + date : date;
    vm.score = dataProveedor.Resumen.indicadorGeneral;

    vm.page = 'Proveedores Detalles';
    vm.lvl0 = 'Proveedores';

    vm.proveid = $state.params.id || '';
    var dataParam = {};
    dataParam.id = vm.proveid;
    dataParam.audit = dataProveedor;
    dataParam.originalCategory = dataProveedor.DatosGenerales.Categoria.numeroValor;

    function getAuditDate(audit) {
      if (audit.Auditoria.fechaFin) {
        return moment(audit.Auditoria.fechaFin).format('L');
      }
      if (audit.Auditoria.fechaInicio) {
        return moment(audit.Auditoria.fechaInicio).format('L');
      }
      return null;
    }

    vm.downloadPDF = function gpdfFn() {
      vm.loader.loading = true;
      vm.loader.text = 'Estamos generando el reporte';
      panelService.getReporte(vm.idAudit).then(function gpdfPr(response) {
        $log.info('pdf ok');
        vm.loader.loading = false;
        var fileName = 'Reporte Auditoría.pdf';
        var a = document.createElement('a'); // eslint-disable-line
        document.body.appendChild(a); // eslint-disable-line
        a.style = 'display: none';
        var url = (window.URL || window.webkitURL).createObjectURL(response); // eslint-disable-line
        a.href = url;
        a.download = fileName;
        a.click();
        (window.URL || window.webkitURL).revokeObjectURL(response); // eslint-disable-line
      });

      var filtros = {idProveedor: vm.proveid, idAuditoria: vm.idAudit};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón descargar reporte", 
        "filtros": angular.toJson(filtros),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    vm.historyAudit = function fnha() {
      var filtros = {idProveedor: vm.proveid};
      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón Historial auditorias",
        "filtros": angular.toJson(filtros), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
    };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    }

    panelService.getHistorialAuditorias(vm.proveid).then(function(data) {
      data = data || [];

      vm.auditHistory = data
        .map(function(audit) {
          audit.date = moment(audit.fechaFin || audit.fechaInicio).format('LLL');
          return audit;
        })
        .sort(function(a, b) {
          if (a.idAuditoria > b.idAuditoria) {
            return -1;
          }
          if (a.idAuditoria < b.idAuditoria) {
            return 1;
          }

          return 0;
        });
    });

    var tabRoutes = [
      'referencia.panel.proveedores.busqueda.detalle.info',
      'referencia.panel.proveedores.busqueda.detalle.especialidades',
      'referencia.panel.proveedores.busqueda.detalle.servicio',
      'referencia.panel.proveedores.busqueda.detalle.localizacion',
      'referencia.panel.proveedores.busqueda.detalle.reporte'
    ];

    // send id proveedor to each tab's view
    vm.go = function(tabIndex) {
      $state.go(tabRoutes[tabIndex], dataParam);
    };

    // barra volver
    vm.goBack = function() {
      if ($state.params.estado === 'registro') {
        $state.go('referencia.panel.registro.response');
      } else if ($state.params.estado === 'comprobante') {
        $state.go('referencia.panel.registro.comprobante');
      } else if ($state.params.estado === 'reportes') {
        $state.go('referencia.panel.reportes.detalle', {id: $state.params.idRef});
      } else {
        $state.go('referencia.panel.proveedores.busqueda');
      }
    };

    vm.activeTabIndex = 0;
    var unregisterFn = $scope.$on('activeTabIndexChange', function trti(event, data) {
      $scope.$evalAsync(function fn() {
        vm.activeTabIndex = data.tab;
      });
    });

    vm.disableAuditMode = function() {
      vm.onAuditMode = false;
      $scope.$broadcast('changedAuditMode', vm.onAuditMode);
      $scope.$emit('rightActionsShow');
    };

    $scope.$on('$destroy', function unFn() {
      unregisterFn();
    });

    vm.retrieveAudit = function(auditId, auditMode) {
      vm.loader.loading = true;
      vm.loader.text = 'Cargando la auditoría';

      var params = {
        id: $state.params.id
      };

      auditId && (params.auditoria = auditId === -1 ? 'new' : auditId);
      auditMode !== null && (params.auditando = auditMode);
      $state.go('referencia.panel.proveedores.busqueda.detalle.info', params);
    };

    vm.openHistoryModal = function(auditHistory) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcph-referencia close="close()" audits="auditHistory" select-audit="onSelectAudit(id)">'
                  + '</modalcph-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.auditHistory = auditHistory;
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.onSelectAudit = function(id) {
            vm.retrieveAudit(id, false);
          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.initAudit = function() {
      if (vm.auditHistory.length && !vm.auditHistory[0].auditado
        && (vm.isAdmin || vm.auditHistory[0].autor === vm.user.code)) {
        openInitModal();
      } else {
        vm.retrieveAudit(-1, true);
      }

      var filtros = {idProveedor: vm.proveid};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón Iniciar auditorias",
        "filtros": angular.toJson(filtros),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    function openInitModal() {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcp-ini-audit close="close()" last-audit="lastAudit" '
                  + 'audit-selected="auditSelected" on-audit-init="auditInit()">'
                  + '</modalcp-ini-audit>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.lastAudit = vm.auditHistory[0];
          scope.auditSelected = null;

          scope.auditInit = function() {
            scope.close();
            vm.retrieveAudit(scope.auditSelected, true);
          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    }

    vm.finishAudit = function() {
      openEndModal();
      /*
      if (!vm.auditValid) {
        showInfoFormErrors();
      } else {
        openEndModal();
      }
      */

      var filtros = {idProveedor: vm.proveid, idAuditoria: vm.idAudit};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón finalizar auditorias",
        "filtros": angular.toJson(filtros),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };
      
      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    function openEndModal() {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcp-end-audit close="close()" comment="comment" save="save()"></modalcp-end-audit>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.comment = '';

          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.save = function() {
            dataProveedor.Auditoria.observacion = scope.comment;
            dataProveedor.Auditoria.auditado = 1;
            scope.close();
            vm.disableAuditMode();
            vm.loader.loading = true;
            vm.loader.text = 'Finalizando la auditoría';
            vm.saveAudit(true);
          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    }

    vm.savingAudit = function() {
      openSaveModal();

      var filtros = {idProveedor: vm.proveid};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal,
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón guardar auditoria",
        "filtros": angular.toJson(filtros),
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };
      
      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    function openSaveModal() {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcp-save-audit close="close()" save="save()" save-exit="saveExit()"></modalcp-save-audit>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.comment = '';

          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.save = function() {
            scope.close();
            vm.saveAudit();
          };

          scope.saveExit = function() {
            scope.close();
            vm.loader.loading = true;
            vm.loader.text = 'Guardando la auditoría';
            vm.saveAudit(true);
            vm.disableAuditMode();
          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    }

    vm.saveAudit = function(finished) {
      $scope.$broadcast('savingAudit');
      vm.auditSaving = true;
      vm.auditSaved = true;

      if (finished) {
        vm.data.Auditoria.auditado = 1;
      }


      panelService.saveAuditoria(vm.data).then(function(data) {
        vm.auditSaving = false;
        $scope.$broadcast('auditSaved');

        if (finished) {
          vm.retrieveAudit(data.Auditoria.idAuditoria, false);
          /*gtx*/
          var idAuditoria = data.Auditoria.idAuditoria;
          var idProveedor = data.Auditoria.idProveedor;
          var exteriores = localStorageService.get('exteriores');
          var interiores = localStorageService.get('interiores');
          var otros = localStorageService.get('otros');

          var arrayFiles = exteriores.concat(interiores,otros);

          for (var i = 0; i < arrayFiles.length; i++) {
            panelService.saveFile(idProveedor,idAuditoria,arrayFiles[i]).then(function(data) {
              data = data || [];
            });
          }
          /*--gtx--*/
        }
      });

    };

    $scope.$on('saveAudit', function() {
      vm.auditSaving = true;
      $scope.$broadcast('savingAudit');
      vm.saveAudit(false);
    });

    $scope.$on('changesInAudit', function() {
      vm.auditSaved = false;
      vm.auditTouched = true;
    });

    $scope.$on('auditValid', function(event, validity) {
      vm.auditValid = validity;
    });

    function showInfoFormErrors() {
      vm.go(0);
      $timeout(function() {
        $scope.$broadcast('showErrors');
      }, 500);
    }
  }

  detalleInformacionController.$inject = ['$scope', '$state', 'Restangular', 'localStorageService', '$timeout', 'categories', 'dataProveedor', 'panelService', 'oimPrincipal', '$window'];

  function detalleInformacionController($scope, $state, Restangular, localStorageService, $timeout, categories, dataProveedor, panelService, oimPrincipal, $window) {
    var vm = this;
    vm.loader = {};
    vm.data = $scope.$parent.$ctrl.data;
    vm.datosgenerales = vm.data.DatosGenerales;
    vm.usuarioProv = vm.data.DatosGenerales.Proveedor;
    vm.contacto = vm.data.Contacto;
    vm.responsable = vm.data.Referencia;
    vm.originalCategory = $state.params.originalCategory || vm.data.DatosGenerales.Categoria.numeroValor;
    vm.categories = categories;

    /*gtx*/
    //vm.auditValid = true;
    //console.log("vm-> ",vm)

    vm.user = oimPrincipal.getUsername()
    vm.idProveedor = dataProveedor.Auditoria.idProveedor;
    vm.idAuditoria = dataProveedor.Auditoria.idAuditoria;

    //console.log("$scope-> ",$scope)
    //console.log("$state-> ",$state)
    //console.log("apiUrl-> ",window)
    //console.log("document-> ",document)
    //console.log("navigator-> ",navigator)
    //var apiUrl = '{{{apiUrl}}}';
    //console.log("URL-> ",apiUrl)

    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    /*gtx*/
    vm.$onInit = function oiFn() {
      vm.onAuditMode = $state.params.auditando;
      vm.showingErrors = false;

      /*gtx*/
      vm.getFilesRegister();
      /*
      if(!vm.onAuditMode) {
        console.log("ENTRA IF")
        vm.getFilesRegister();
      } else {
        console.log("ENTRA ELSE")
        vm.exteriores = [];
        vm.interiores = [];
        vm.otros = [];
      }
       */
      /*gtx*/

      if (vm.onAuditMode) {
        vm.showResolution = !!vm.datosgenerales.Resolucion
        || (vm.originalCategory !== vm.datosgenerales.Categoria.numeroValor);
      } else {
        vm.showResolution = !!vm.datosgenerales.Resolucion;
      }

      vm.categorySelected = (function() {
        var cat = vm.categories.find(function(category) {
          return category.numeroValor === vm.datosgenerales.Categoria.numeroValor;
        });
        if (cat) {
          return cat;
        }
        return null;
      }());

      vm.onCategoryChange = function() {

        if (!vm.datosgenerales.Resolucion
          && vm.originalCategory === vm.datosgenerales.Categoria.numeroValor) {
          vm.datosgenerales.Resolucion = '';
          vm.showResolution = false;
        } else {
          vm.showResolution = true;
        }
      };

      vm.testAforo = function() {
        if (!/\d+$/.test(vm.datosgenerales.Aforo)) {
          vm.datosgenerales.Aforo = null;
        }
      };

      $timeout(function() {
        if (vm.onAuditMode) {
          $scope.$watch('basicInfo.$valid', function(validity) {
            $scope.$emit('auditValid', validity);
          });
        }
      }, 1000);
    };
    vm.activeTabIndex = 0;

    $scope.$emit('activeTabIndexChange', { tab: vm.activeTabIndex });
    $scope.$on('showErrors', function() {
      vm.showingErrors = true;
    });

    vm.infoChanged = function() {
      $scope.$emit('changesInAudit');
    };
    /*gtx*/
    vm.typesFile= [
      {
        'valFile': 'exteriores',
        'descFile': 'Fotos de exteriores'
      },
      {
        'valFile': 'interiores',
        'descFile': 'Fotos de interiores'
      },
      {
        'valFile': 'otros',
        'descFile': 'Otros'
      }
    ];

    vm.getFilesRegister = function () {
      panelService.getListFiles(vm.idProveedor,vm.idAuditoria).then(function(data) {
        vm.auditValid = true;

        data = data || [];
        vm.exteriores = [];
        vm.interiores = [];
        vm.otros = [];

        if(data.lista) {
          for (var i = 0; i < data.lista.length; i++) {
            if(data.lista[i].tipoArchivo === "exteriores"){
              vm.exteriores.push(data.lista[i]);
              localStorageService.set('exteriores', ng.copy(vm.exteriores));
            }else if(data.lista[i].tipoArchivo === 'interiores'){
              vm.interiores.push(data.lista[i]);
              localStorageService.set('interiores', ng.copy(vm.interiores));
            }else{
              vm.otros.push(data.lista[i]);
              localStorageService.set('otros', ng.copy(vm.otros));
            }
          }
        } else {
          vm.exteriores = [];
          vm.interiores = [];
          vm.otros = [];
          localStorageService.set('exteriores', ng.copy(vm.exteriores));
          localStorageService.set('interiores', ng.copy(vm.interiores));
          localStorageService.set('otros', ng.copy(vm.otros));
        }

      });
    };

    /*
    panelService.getIp().then(function(data) {
      var clientIp = localStorageService.get('clientIp');
      vm.ipLocal = data ? data.ip : clientIp;
    });
    */

    vm.validateAlert = function() {
      vm.messageAlert = "(*) Debe seleccionar el tipo de archivo para adjuntar un documento";
    };

    $scope.saveFile = function (e) {
      vm.auditValid = true;
      if(vm.typeFile) {
        vm.messageAlert = "";
        var file = e.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          var obj = {
            "archivoBase64": reader.result.split(',')[1],
            "nomArchivo": file.name,
            "tipoArchivo": vm.typeFile.valFile,
            "usuario": vm.user
          };

          //vm.loader.loading = true;
          //vm.loader.text = 'Estamos guardando tu archivo';

          /*ISSUES*/
          vm.loader.loading = true;
          vm.loader.text = 'Alamacenando archivo';
          if(obj.tipoArchivo === 'exteriores'){
            vm.exteriores.push(obj);
            localStorageService.set('exteriores', ng.copy(vm.exteriores));
          }else if(obj.tipoArchivo === 'interiores'){
            vm.interiores.push(obj);
            localStorageService.set('interiores', ng.copy(vm.interiores));
          }else{
            vm.otros.push(obj);
            localStorageService.set('otros', ng.copy(vm.otros));
          }

          vm.loader.loading = false;
          document.elementFromPoint(10, 10).click();
          document.getElementById("contained-button-file").value = "";
          //vm.filesToSave.push(obj);

          /*--ISSUES--*/

          /*
          panelService.saveFile(vm.idProveedor,vm.idAuditoria,obj).then(function(data) {
            data = data || [];
            panelService.getListFiles(vm.idProveedor,vm.idAuditoria).then(function(data) {
              data = data || [];
              vm.exteriores = [];
              vm.interiores = [];
              vm.otros = [];

              if(data.lista) {
                for (var i = 0; i < data.lista.length; i++) {
                  if(data.lista[i].tipoArchivo === "exteriores"){
                    vm.exteriores.push(data.lista[i]);
                  }else if(data.lista[i].tipoArchivo === 'interiores'){
                    vm.interiores.push(data.lista[i]);
                  }else{
                    vm.otros.push(data.lista[i]);
                  }
                }
              } else {
                vm.exteriores = [];
                vm.interiores = [];
                vm.otros = [];
              }

              vm.loader.loading = false;
              document.getElementById("contained-button-file").value = "";
            });
          });
          */
        };
      }

      var filtros = {idProveedor: vm.idProveedor, tipoArchivo: vm.typeFile.descFile};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón Adjuntar archivo",
        "filtros": angular.toJson(filtros), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    vm.downloadFile = function(item,seccion) {
      if (item.idArchivo) {
        vm.auditValid = true;
        vm.loader.loading = true;
        vm.loader.text = 'Estamos descargando tu archivo';

        /*
              console.log("$scope-> ",$scope)

              var ruta = Restangular.one('/aprobar');
              console.log("ruta-> ",ruta)
        */
        /*   CORRECT
        var link = document.createElement("a");
        link.download = "descarga.jpg";
        link.href = 'http://localhost:23610/api/proveedores/'+vm.idProveedor+'/auditoria/'+vm.idAuditoria+'/archivo/'+item.idArchivo // CHANGE URL TO PROD
        //link.href = 'http://10.160.120.216/oim_referencia/api/proveedores/'+vm.idProveedor+'/auditoria/'+vm.idAuditoria+'/archivo/'+item.idArchivo
        //link.href = 'https://oim.mapfre.com.pe/oim_referencia/api/proveedores/'+vm.idProveedor+'/auditoria/'+vm.idAuditoria+'/archivo/'+item.idArchivo // CHANGE URL TO PROD
        link.click();
      */

        panelService.downloadFile(vm.idProveedor,vm.idAuditoria,item.idArchivo).then(function(data) {
          data = data || [];
          //console.log("DATA-> ",typeof data)
          //$log.info('pdf ok');
          //vm.loader.loading = false;
          var fileName = item.nomArchivo;
          var a = document.createElement('a'); // eslint-disable-line
          document.body.appendChild(a); // eslint-disable-line
          a.style = 'display: none';
          /*
          var binaryData = [];
          binaryData.push(data);

          var blob = new Blob([binaryData], {type: 'application/pdf,image/*'});
          console.log("blob-> ",blob)
          */
          /*
          vm.decodedFrame = atob(data)
          var raw = vm.decodedFrame
          var HEX = '';
          for ( i = 0; i < raw.length; i++ ) {
            var _hex = raw.charCodeAt(i).toString(16)
            HEX += (_hex.length==2?_hex:'0'+_hex);
          }

          var base = HEX.toUpperCase();
          var bytes = new Uint8Array(base.length / 2);
          for (var i = 0; i < base.length; i += 2) {
            bytes[i / 2] = parseInt(base.substring(i, i + 2), 16);
          }

          console.log("bytes-> ",bytes)

          var url = (window.URL || window.webkitURL).createObjectURL(new Blob([bytes], {type: 'application/pdf,image/*'})); // eslint-disable-line
          */
          //var url = (window.URL || window.webkitURL).createObjectURL(new Blob(binaryData, {type: 'application/pdf,image/*'})); // eslint-disable-line
          var url = (window.URL || window.webkitURL).createObjectURL(data); // eslint-disable-line

          a.href = url;
          a.download = fileName;
          a.click();
          (window.URL || window.webkitURL).revokeObjectURL(data); // eslint-disable-line
        });

        var filtros = {idProveedor: vm.idProveedor};

        var obj = {
          "codigoAplicacion": "REF",
          "ipOrigen": vm.ipLocal,
          "tipoRegistro": "O",
          "codigoObjeto": "PROVEEDORES",
          "opcionMenu": "Detalle de Proveedor - descargar archivos",
          "descripcionOperacion": "Descarga de archivo en la sección "+seccion,
          "filtros": angular.toJson(filtros),
          "codigoUsuario": oimPrincipal.getUsername(),
          "numeroSesion": "",
          "codigoAgente": 0
        };

        panelService.saveTracker(obj).then(function(data) {
          data = data || [];
          vm.loader.loading = false;
        });
      } else {
        vm.downloadFileAudit(item,seccion);
      }
    };

    vm.deleteFile = function(item) {
      vm.auditValid = true;
      var obj = {
        "usuario": vm.user
      };
      vm.loader.loading = true;
      vm.loader.text = 'Estamos eliminando el archivo';
      panelService.deleteFile(vm.idProveedor,vm.idAuditoria,item.idArchivo,obj).then(function(data) {
        data = data || [];
        panelService.getListFiles(vm.idProveedor,vm.idAuditoria).then(function(data) {
          data = data || [];
          vm.exteriores = [];
          vm.interiores = [];
          vm.otros = [];

          if(data.lista) {
            for (var i = 0; i < data.lista.length; i++) {
              if(data.lista[i].tipoArchivo === "exteriores"){
                vm.exteriores.push(data.lista[i]);
                localStorageService.set('exteriores', ng.copy(vm.exteriores));
              }else if(data.lista[i].tipoArchivo === 'interiores'){
                vm.interiores.push(data.lista[i]);
                localStorageService.set('interiores', ng.copy(vm.interiores));
              }else{
                vm.otros.push(data.lista[i]);
                localStorageService.set('otros', ng.copy(vm.otros));
              }
            }
          } else {
            vm.exteriores = [];
            vm.interiores = [];
            vm.otros = [];
            localStorageService.set('exteriores', ng.copy(vm.exteriores));
            localStorageService.set('interiores', ng.copy(vm.interiores));
            localStorageService.set('otros', ng.copy(vm.otros));
          }

          vm.loader.loading = false;
        });
      });

    };

    vm.downloadFileAudit = function (item,seccion) {
      var a = document.createElement("a");
      var separate = item.nomArchivo.split(".");

      if(separate[1]==='pdf') {
        a.href = "data:application/pdf;base64," + item.archivoBase64;
      } else {
        a.href = "data:image/*;base64," + item.archivoBase64;
      }
      a.download = item.nomArchivo;
      a.click();
    }

    vm.deleteFileAudit = function (item) {
      if(item.tipoArchivo === 'exteriores'){
        vm.exteriores= vm.exteriores.filter(function(e) { return e.$$hashKey !== item.$$hashKey })
        localStorageService.set('exteriores', ng.copy(vm.exteriores));
      }else if(item.tipoArchivo === 'interiores'){
        vm.interiores = vm.interiores.filter(function(e) { return e.$$hashKey !== item.$$hashKey })
        localStorageService.set('interiores', ng.copy(vm.interiores));
      }else{
        vm.otros = vm.otros.filter(function(e) { return e.$$hashKey !== item.$$hashKey })
        localStorageService.set('otros', ng.copy(vm.otros));
      }
    }
    /*--gtx*/
    $scope.$on('auditSaved', function() {
      vm.data = $scope.$parent.$ctrl.data;
    });
  }

  detalleEspecialidadesController.$inject = ['$scope', '$state', 'panelService', 'oimPrincipal', '$window'];

  function detalleEspecialidadesController($scope, $state, panelService, oimPrincipal, $window) {
    var vm = this;
    vm.activeTabIndex = 1;
    $scope.$emit('activeTabIndexChange', { tab: vm.activeTabIndex });
    vm.clsLoad = 'modal-data--is-loading';

    vm.auditSaved = true;
    vm.auditSaving = false;

    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.$onInit = function oiFn() {
      vm.data = $scope.$parent.$ctrl.data;
      vm.specialitySelected = null;
      vm.specialitySelectedEnabled = true;
      vm.visibilityFilter = 'all';
      vm.onAuditMode = $state.params.auditando;
      vm.proveid = $state.params.id || '';
    };

    vm.specialitiesFilter = function(item) {
      if (item.tipo === 2) {
        return;
      }

      switch (vm.visibilityFilter) {
        case 'audited':
          vm.serviceSelected = null;
          return item.auditado;
        case 'unaudited':
          vm.serviceSelected = null;
          return !item.auditado;
        default:
          return true;
      }
    };

    vm.medicalSpecialitiesFilter = function(item) {
      return !!item.esMedica;
    };

    vm.nonMedicalSpecialitiesFilter = function(item) {
      return !item.esMedica;
    };

    vm.selectSpeciality = function(specialityIdx) {
      vm.specialitySelectedEnabled = vm.isSpecialityActive(specialityIdx);
      vm.specialitySelectedEmergecyEnabled = vm.isEmergencyEnabled(specialityIdx);
      vm.specialitySelected = specialityIdx;
    };

    vm.unselectSpeciality = function() {
      vm.specialitySelected = null;
    };

    vm.enableSpeciality = function(specialityIdx) {
      vm.specialitySelectedEnabled = vm.isSpecialityActive(specialityIdx);
    };

    vm.disableSpeciality = function(specialityIdx) {
      vm.specialitySelectedEnabled = vm.isSpecialityActive(specialityIdx);
    };

    vm.isSpecialityActive = function(specialityIdx) {

      var specialityStateSwitcher = vm.data.Auditoria.ProductoList[specialityIdx].CaracteristicaList
        .find(function(characteristic) {
          return characteristic.idTipoCaracteristica === 7;
        });

      if (specialityStateSwitcher) {
        return !!+specialityStateSwitcher.idValor;
      }

      return true;
    };

    vm.enableEmergency = function(specialityIdx) {
      vm.specialitySelectedEmergecyEnabled = vm.isEmergencyEnabled(specialityIdx);
    };

    vm.disableEmergency = function(specialityIdx) {
      vm.specialitySelectedEmergecyEnabled = vm.isEmergencyEnabled(specialityIdx);
    };

    vm.isEmergencyEnabled = function(specialityIdx) {
      var specialityStateSwitcher = vm.data.Auditoria.ProductoList[specialityIdx].CaracteristicaList
        .find(function(characteristic) {
          return characteristic.idTipoCaracteristica === 3;
        });

      if (specialityStateSwitcher) {
        return !!+specialityStateSwitcher.subCaracteristicas[0].idValor;
      }
    };

    vm.hasAMShifts = function(shifts) {
      return /1|3|5|7|9|11/.test(shifts);
    };

    vm.hasPMShifts = function(shifts) {
      return /2|4|6|8|10|12/.test(shifts);
    };

    vm.saveAudit = function() {
      $scope.$emit('saveAudit');
      vm.auditSaved = true;
      vm.auditSaving = true;

      var filtros = {idProveedor: vm.proveid};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón Guardar especialidad",
        "filtros": angular.toJson(filtros), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    vm.specialityChanged = function() {
      vm.auditSaved = false;
      $scope.$emit('changesInAudit');
    };

    $scope.$on('auditSaved', function() {
      vm.auditSaving = false;
      vm.data = $scope.$parent.$ctrl.data;
    });

    $scope.$on('savingAudit', function() {
      vm.auditSaved = true;
      vm.auditSaving = true;
    });
  }

  detalleServiciosController.$inject = ['$scope', '$state', 'panelService', 'oimPrincipal', '$window'];

  function detalleServiciosController($scope, $state, panelService, oimPrincipal, $window) {
    var vm = this;
    vm.activeTabIndex = 2;
    $scope.$emit('activeTabIndexChange', { tab: vm.activeTabIndex });

    vm.auditSaved = true;
    vm.auditSaving = false;

    vm.ipLocal = $window.localStorage['clientIp'] ? $window.localStorage['clientIp'] : "0.0.0.0";

    vm.$onInit = function oiFn() {
      vm.data = $scope.$parent.$ctrl.data;
      vm.onAuditMode = $state.params.auditando;
      vm.serviceSelected = null;
      vm.serviceSelectedEnabled = true;
      vm.visibilityFilter = 'all';
      vm.proveid = $state.params.id || '';
    };

    vm.servicesFilter = function(item) {

      if (item.tipo === 1) {
        return;
      }

      switch (vm.visibilityFilter) {
        case 'audited':
          vm.serviceSelected = null;
          return item.auditado;
        case 'unaudited':
          vm.serviceSelected = null;
          return !item.auditado;
        default:
          return true;
      }
    };

    vm.selectService = function(serviceIdx) {
      vm.serviceSelected = serviceIdx;
      vm.serviceSelectedEnabled = vm.isServiceActive(serviceIdx);
    };

    vm.isServiceActive = function(serviceIdx) {
      var serviceStateSwitcher = vm.data.Auditoria.ProductoList[serviceIdx].CaracteristicaList
        .find(function(characteristic) {
          return characteristic.idTipoCaracteristica === 7;
        });

      if (serviceStateSwitcher) {
        return !!+serviceStateSwitcher.idValor;
      }

      return true;
    };

    vm.isServiceDeactivatable = function(serviceIdx) {
      return !!vm.data.Auditoria.ProductoList[serviceIdx].CaracteristicaList.find(function(characteristic) {
        return characteristic.idTipoCaracteristica === 7;
      });
    };

    vm.unselectService = function() {
      vm.serviceSelected = null;
    };

    vm.enableService = function(serviceIdx) {
      vm.serviceSelectedEnabled = vm.isServiceActive(serviceIdx);
    };

    vm.disableService = function(serviceIdx) {
      vm.serviceSelectedEnabled = vm.isServiceActive(serviceIdx);
    };

    vm.saveAudit = function() {
      $scope.$emit('saveAudit');
      vm.auditSaved = true;
      vm.auditSaving = true;

      var filtros = {idProveedor: vm.proveid};

      var obj = {
        "codigoAplicacion": "REF",
        "ipOrigen": vm.ipLocal, 
        "tipoRegistro": "O",
        "codigoObjeto": "PROVEEDORES",
        "opcionMenu": "Proveedores/busqueda - Ver detalle",
        "descripcionOperacion": "Click al botón Guardar servicio",
        "filtros": angular.toJson(filtros), 
        "codigoUsuario": oimPrincipal.getUsername(),
        "numeroSesion": "",
        "codigoAgente": 0
      };

      panelService.saveTracker(obj).then(function(data) {
        data = data || [];
      });
    };

    vm.serviceChanged = function() {
      vm.auditSaved = false;
      $scope.$emit('changesInAudit');
    };

    vm.filterGroups = function(char) {
      if (char.subCaracteristicas) {
        return true;
      }
      return false;
    };

    vm.filterNoGroups = function(char) {
      if (char.subCaracteristicas) {
        return false;
      }
      return true;
    };

    $scope.$on('auditSaved', function() {
      vm.auditSaving = false;
      vm.data = $scope.$parent.$ctrl.data;
    });

    $scope.$on('savingAudit', function() {
      vm.auditSaved = true;
      vm.auditSaving = true;
    });
  }

  referenciaMapController.$inject = ['$scope', '$state', 'dataProveedor', 'NgMap', '$timeout'];

  function referenciaMapController($scope, $state, dataProveedor, NgMap, $timeout) {
    var vm = this;
    vm.activeTabIndex = 3;

    $scope.$emit('activeTabIndexChange', { tab: vm.activeTabIndex });

    vm.$onInit = function oiFn() {
      vm.address = dataProveedor.Contacto.SedePrincipal;
      vm.markerTitle = dataProveedor.DatosGenerales.Proveedor;
      vm.localizacion = dataProveedor.DatosGenerales.Localizacion;
      vm.proveid = $state.params.id || '';
      vm.zoom = 18;
      if (vm.localizacion.Latitud && vm.localizacion.Longitud) {
        $timeout(function() {
          NgMap.initMap(vm.proveid);
        }, 500);
      }
      vm.onAuditMode = $state.params.auditando;
    };
  }

  detalleReporteController.$inject = ['$scope', 'dataProveedor'];

  function detalleReporteController($scope, dataProveedor) {
    var vm = this;
    vm.activeTabIndex = 4;

    $scope.$emit('activeTabIndexChange', { tab: vm.activeTabIndex });

    vm.$onInit = function oiFn() {
      vm.reporte = dataProveedor.Resumen;
      vm.observacion = dataProveedor.Auditoria.observacion;
      vm.date = moment(dataProveedor.Auditoria.fechaFin || dataProveedor.Auditoria.fechaInicio).format('L');
    };
  }

  return ng.module('referenciaApp')
    .controller('ProveeDetalleController', proveeDetalleController)
    .controller('DetalleInformacionController', detalleInformacionController)
    .controller('DetalleEspecialidadesController', detalleEspecialidadesController)
    .controller('DetalleServiciosController', detalleServiciosController)
    .controller('ReferenciaMapController', referenciaMapController)
    .controller('DetalleReporteController', detalleReporteController);
});
