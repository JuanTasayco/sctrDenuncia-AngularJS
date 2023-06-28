'use strict';

define(['angular', 'lodash', 'constants',
  '/referencia/app/clientesProveedores/component/clienteProveedoresDetalleModal.js',
  '/referencia/app/reportes/component/commentsModal.js',
  '/referencia/app/reportes/component/registerHospModal.js',
  '/referencia/app/reportes/component/registerNoHospModal.js',
  '/referencia/app/reportes/component/confirmationModal.js'], function(ng, _, constants) {

  reporteDetalleController.$inject = ['$scope', '$state', 'dataReferencia', 'NgMap', '$uibModal', 'registroService',
    '$timeout', '$log', 'reportesService', '$sce', 'oimPrincipal'
  ];

  function reporteDetalleController($scope, $state, dataReferencia, NgMap, $uibModal, registroService,
    $timeout, $log, reportesService, $sce, oimPrincipal
    ) {
    var vm = this;
    vm.loader = {};
    vm.loader.text = 'Estamos cargando la información del proveedor';

    vm.isAdmin = oimPrincipal.get_role() === 'ADMREF';
    vm.isDoctor = oimPrincipal.get_role() === 'MEDREF';

    vm.$onInit = function oiFn() {
      vm.panel = vm.title = 'Reporte Referencia';
      vm.origen = {};
      vm.paciente = {};
      vm.proveedores = {};
      vm.mapShow = [];
      vm.clsLoad = 'modal-data--is-loading';

      // @TODO: Cambiar URL al pasar a producción
      vm.pdfURL =  $sce.trustAsResourceUrl(constants.system.api.endpoints.referencia
        + 'api/referencia/resumen/pdf');
      // vm.pdfURL =  $sce.trustAsResourceUrl('https://oim.mapfre.com.pe/oim_referencia/api/referencia/resumen/pdf');

      // @TODO: Mirar porqué no redirige a la página anterior
      dataReferencia || $state.go({location: 'replace'});

      vm.item = vm.dataReferencia = dataReferencia; // data del resolve del state

      vm.filtros = vm.dataReferencia.filtros || [];
      vm.proveedores = vm.dataReferencia.proveedores || [];
      vm.proveedoresLength = vm.proveedores.length;

      vm.servicios = _.filter(vm.filtros, function fFn(item) {
        return item.tipoServicio.toUpperCase() === 'SERVICIOS';
      });

      vm.imagenes = _.filter(vm.filtros, function fFn(item) {
        return item.tipoServicio.toUpperCase() === 'IMAGENOLOGIAS';
      });

      vm.emergencias = _.filter(vm.filtros, function fFn(item) {
        return item.tipoServicio.toUpperCase() === 'EMERGENCIAS';
      });

      vm.ambulancias = _.filter(vm.filtros, function fFn(item) {
        return item.tipoServicio.toUpperCase() === 'AMBULANCIAS';
      });

      vm.especialidades = _.filter(vm.filtros, function fFn(item) {
        return item.tipoServicio.toUpperCase() === 'ESPECIALIDADES';
      });

      vm.areThereData = function ardFn(tipo) {
        var resp = false;

        switch (tipo) {
          case 'filtros':
            resp = vm.filtros.length > 0;
            break;
          case 'servicios':
            resp = vm.servicios.length > 0;
            break;
          case 'imagenes':
            resp = vm.imagenes.length > 0;
            break;
          case 'emergencias':
            resp = vm.emergencias.length > 0;
            break;
          case 'ambulancias':
            resp = vm.ambulancias.length > 0;
            break;
          case 'especialidades':
            resp = vm.especialidades.length > 0;
            break;
          default:
            resp = false;
        }
        return resp;
      };
    };  //  end onInit

    vm.verDetalleProveedor = function vdpFn(item) {
      var data = {};
      data.id = item.idProveedor;
      data.idRef = vm.item.idReferencia;
      data.estado = 'reportes';
      vm.loader.loading = true;
      $state.go('referencia.panel.proveedores.busqueda.detalle.info', data);
    };

    vm.toggleMap = function tgFn(idx, item) {
      vm.mapShow[idx] = !vm.mapShow[idx];

      if (vm.mapShow[idx]) {
        $timeout(function() {
          NgMap.initMap(item.idRefProveedor);
        }, 500);
      }
    };

    vm.downloadPDF = function gpdfFn() {
      reportesService.getPDF(vm.item).then(function gpdfPr() {
        $log.info('pdf ok');
      });
    };

    vm.openCommentsModal = function() {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<modal-comments text="comment" close="close()" save="save(msg)"></modal-comments>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {

          scope.comment = vm.item.descripcionObservacion;

          scope.hasAlreadyComment = !!scope.comment;

          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.save = function() {
            var serviceName = scope.hasAlreadyComment ? 'updateObservacion' : 'addObservacion';

            if ($scope.comment === '') {
              return;
            }

            reportesService[serviceName](vm.item.idReferencia, scope.comment)
              .then(function aObs(res) {
                if (res.OperationCode === 200) {
                  vm.item.descripcionObservacion = scope.comment;
                  vm.openConfirmationModal('La observación se guardó con éxito');
                  vm.item.revisado = '1';
                } else {
                  $log.info('Error al guardar el comentario');
                }
              });

            $uibModalInstance.close();
          };


        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.openRegisterModal = function(entity) {

      // if codReferencia is an emergency or an hospitalization
      if (vm.item.origenCodReferencia === '1' || vm.item.origenCodReferencia === '2') {
        openHospRegisterModal(entity);
      } else {
        openNoHospRegisterModal(entity);
      }

    };

    function openHospRegisterModal(entity) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<register-hosp-modal close="close()" save="save(registro)" entity="entity"></register-hosp-modal>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.entity = entity;
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.save = function(registro) {
            vm.registro = angular.copy(registro);

            vm.registro.diagnosticoIngreso
              && (vm.registro.diagnosticoIngreso = registro.diagnosticoIngreso.descripcion);
            vm.registro.diagnosticoEgreso && (vm.registro.diagnosticoEgreso = registro.diagnosticoEgreso.descripcion);
            vm.registro.condicionPaciente && (vm.registro.condicionPaciente = registro.condicionPaciente.Descripcion);

            reportesService.registrarReferencia(registro)
              .then(function(res) {
                if (res.OperationCode === 200) {
                  $uibModalInstance.close();
                  vm.openConfirmationModal('La referencia se registró con éxito');

                  for (var attrname in vm.registro) {
                    if (Object.prototype.hasOwnProperty.call(vm.registro, attrname)) {
                      vm.item[attrname] = vm.registro[attrname];
                    }
                  }
                  vm.item.revisado = '1';
                  $timeout(function() {
                    $state.reload();
                  }, 1000);

                } else {
                  $log.info('Error al registrar la referencia');
                }
              });

          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    }

    function openNoHospRegisterModal(entity) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<register-nohosp-modal close="close()" save="save(registro)"'
                  + 'entity="entity"></register-nohosp-modal>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.entity = entity;
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.save = function(registro) {
            vm.registro = angular.copy(registro);

            reportesService.registrarReferencia(registro)
              .then(function(res) {
                if (res.OperationCode === 200) {
                  $uibModalInstance.close();
                  vm.openConfirmationModal('La referencia se registró con éxito');

                  for (var attrname in vm.registro) {
                    if (Object.prototype.hasOwnProperty.call(vm.registro, attrname)) {
                      vm.item[attrname] = vm.registro[attrname];
                    }
                  }
                  vm.item.revisado = '1';
                  $timeout(function() {
                    $state.reload();
                  }, 1000);

                } else {
                  $log.info('Error al registrar la referencia');
                }
              });

          };
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    }

    vm.openConfirmationModal = function(msg) {
      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'md',
        windowTopClass: 'modal-cpd fade',
        template: '<modal-confirmation msg="{{msg}}" close="close()"></modal-confirmation>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };
          scope.msg = msg;
        }]
      });
      modalInstance.result.then(function() {}, function() {});
    };

    vm.openClientProveedoresDetailModal = function(proveedor) {
      var req = {};
      req.companyID = vm.item.aseguradoIdCompania;
      req.cod_afiliado = vm.item.afiliadoCodigo; // eslint-disable-line
      req.plan_afiliado = vm.item.afiliadoPlan; // eslint-disable-line

      req.evinculada_ruc = proveedor.entidadRucCobertura; // eslint-disable-line
      req.evinculada_codigo = proveedor.entidadCodigoCobertura; // eslint-disable-line

      var modalInstance = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: true,
        animation: vm.animationsEnabled,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal-cpd fade',
        template: '<modalcpd-referencia close="close()" afiliado="infoAfiliado">HLEO</modalcpd-referencia>',
        controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
          scope.close = function() {
            $uibModalInstance.close();
          };

          scope.infoAfiliado = {};
          scope.infoAfiliado.clsIsLoading = vm.clsLoad;
          scope.infoAfiliado.info = {};
          scope.infoAfiliado.info.asegurado = {};
          scope.infoAfiliado.info.asegurado.name = vm.item.aseguradoNombre;

          scope.infoAfiliado.info.asegurado.depa = vm.item.afiliadoDepartamento;
          scope.infoAfiliado.info.asegurado.prov = vm.item.afiliadoProvincia;

          scope.infoAfiliado.info.asegurado.dni = vm.item.aseguradoDNI;
          scope.infoAfiliado.info.asegurado.fnac = vm.item.aseguradoFecNac;
          scope.infoAfiliado.info.asegurado.gen = vm.item.aseguradoGenero;
          scope.infoAfiliado.info.asegurado.parentesco = vm.item.aseguradoParentesco;
          scope.infoAfiliado.info.asegurado.company = vm.item.aseguradoEmpresa;
          scope.infoAfiliado.info.asegurado.producto = vm.item.aseguradoProducto;
          scope.infoAfiliado.info.asegurado.estado = vm.item.aseguradoEstado;
          scope.infoAfiliado.info.titular = {};
          scope.infoAfiliado.info.titular.name = vm.item.titularNombre;
          scope.infoAfiliado.info.titular.contrato = vm.item.titularContrato;
          scope.infoAfiliado.info.titular.empresa = vm.item.titularEmpresa;
          scope.infoAfiliado.info.titular.ruc = vm.item.titularRuc;
          scope.infoAfiliado.info.titular.tipo_afiliacion = vm.item.tipoAfiliacion; // eslint-disable-line
          scope.infoAfiliado.info.titular.fec_afiliacion = vm.item.fechaAfiliacion; // eslint-disable-line

          registroService.getCoberturaByAsegurado(req).then(function gaiFnPr(payload) {
            $scope.$evalAsync(function eaFn() {
              scope.infoAfiliado.info.cobertura = payload.lista;
              scope.infoAfiliado.clsIsLoading = '';
            });
          });
        }]
      });
      modalInstance.result.then(function() {}, function() {});

    };  // end openClientProveedoresDetailModal

  } //  end controller

  return ng.module('referenciaApp')
    .controller('reporteDetalleController', reporteDetalleController);
});
