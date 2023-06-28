
define([
	'angular', 'constants', 'lodash',
	'/gcw/app/factory/gcwFactory.js'
], function(ng, constants, _) {

	PolizaDetalleController.$inject = ['$scope', '$rootScope', '$stateParams', 'gcwFactory', 'gaService', '$uibModal', '$state', 'mModalAlert', '$sce', '$timeout', 'MxPaginador', '$http', 'mpSpin', '$window', '$q'];

	function PolizaDetalleController($scope, $rootScope, $stateParams, gcwFactory, gaService, $uibModal, $state, mModalAlert, $sce, $timeout, MxPaginador ,$http, mpSpin, $window, $q){

		var vm = this;
    vm.showCheckAndButton = true;
    var pagePolizas, pageSiniestros, pagePagos;
		vm.pageChangedPagos = pageChangedPagos;
		vm.pageChangedSiniestro = pageChangedSiniestro;
		vm.pageChangedPolizas = pageChangedPolizas;
		vm.selectPoliza = selectPoliza;
    vm.selectPolizaPE = selectPolizaPE;
		vm.selectAll = selectAll;
    vm.selectAllPE = selectAllPE;
		vm.showDetailSiniestro = showDetailSiniestro;
		vm.showPolizaElectronica = showPolizaElectronica;
		vm.modalCartera = modalCartera;
		vm.validationForm = validationForm;
    vm.modalEnvioMail = modalEnvioMail;
    vm.modalSendEmailPendingPayments = modalSendEmailPendingPayments;
		vm.isWindowsUserAgent = isWindowsUserAgent;

		vm.$onInit = function() {

		$rootScope.preLocPoliza = $state.current.url;
		gaService.add({ gaCategory: 'CG - Cartera', gaAction: 'MPF - Polizas - Vista Detalle de Póliza', gaLabel: 'Vista Detalle de Póliza', gaValue: 'Periodo Regular' });
		$rootScope.currentURL = $state.current.url;
		$rootScope.$broadcast('comprobanteRemitido');
		$rootScope.$broadcast('anuladasPorDeuda');
		$rootScope.$broadcast('dashboard');
		$rootScope.$broadcast('networkInit');
		$rootScope.$broadcast('msgSinResultados');
		$rootScope.reloadAgent = false;

		vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 4;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      pagePolizas = new MxPaginador();
      pagePolizas.setNroItemsPorPagina(vm.itemsXPagina).setCurrentTanda(1);
      pageSiniestros = new MxPaginador();
      pageSiniestros.setNroItemsPorPagina(vm.itemsXPagina).setCurrentTanda(1);
      pagePagos = new MxPaginador();
      pagePagos.setNroItemsPorPagina(vm.itemsXPagina).setCurrentTanda(1);

			$scope.currentPage = 1;
			$scope.pageSize = 5;
			$scope.pages = [];
			vm.dataTicket = gcwFactory.getVariableSession("dataTicket");

			$rootScope.cabecera = gcwFactory.getVariableSession('cabeceraSession');
      vm.cabecera = $rootScope.cabecera;

      vm.currentPage = 1; // El paginador selecciona el nro 1

			if($stateParams.id){
				vm.formDataCartera = {};
				vm.noResultPagos = true;
				vm.noResultSiniestro = true;
				vm.noResultPolizas = true;

				vm.formDataCartera.polizaDetail = gcwFactory.getVariableSession("polizaDetail");
				vm.muestraPagos = vm.formDataCartera.polizaDetail.withPendingPayment;
				vm.muestraSiniestros = vm.formDataCartera.polizaDetail.withAmountClaimed;
				if(vm.formDataCartera.polizaDetail){

					var paramsPending = {
							dateStart: vm.formDataCartera.polizaDetail.dateStartExpiration,
							dateEnd: vm.formDataCartera.polizaDetail.dateEndExpiration,
							policyNumber: vm.formDataCartera.polizaDetail.policyNumber,
							situationType: 'RE',
							RoleType: vm.dataTicket.roleType,
							agentId: vm.formDataCartera.polizaDetail.agentId,
							managerId: vm.formDataCartera.polizaDetail.managerId,
							RowByPage: vm.itemsXTanda,
							CurrentPage: vm.currentPage,
							ramo: {
								ramoId: vm.formDataCartera.polizaDetail.ramoId
							},
							client: {
								documentType: vm.formDataCartera.polizaDetail.documentType,
								documentNumber: vm.formDataCartera.polizaDetail.documentCode,
								agent: {
									agentId: vm.formDataCartera.polizaDetail.agentId
								}
							}
					};

					paymentPending(paramsPending);

					var paramsSiniestro = {
							dateStart: vm.formDataCartera.polizaDetail.dateStartExpiration,//
							dateEnd: vm.formDataCartera.polizaDetail.dateEndExpiration,//
							policyNumber: vm.formDataCartera.polizaDetail.policyNumber,
							documentType: vm.formDataCartera.polizaDetail.documentType,
							documentNumber: vm.formDataCartera.polizaDetail.documentCode,
							RowByPage: vm.itemsXTanda,
              CurrentPage: vm.currentPage,
							ramo: {
								ramoId: vm.formDataCartera.polizaDetail.ramoId
							},
							client: {
								agent: {
									agentId: vm.formDataCartera.polizaDetail.agentId
								}
							}
					};

					obtenerSiniestros(paramsSiniestro);

					var paramsImpresion =
					{
						policyNumber: vm.formDataCartera.polizaDetail.policyNumber,
						RowByPage: vm.itemsXTanda,
						CurrentPage: vm.currentPage,
						ramo: {
							CompanyId: vm.formDataCartera.polizaDetail.ciaId,
							ramoId: vm.formDataCartera.polizaDetail.ramoId
						},
						client: {
							agent: {
								agentId: vm.formDataCartera.polizaDetail.agentId
							}
						}
					};

					impresionPoliza(paramsImpresion);
				}
      }
		}; // end onInit

    // lista 1
		function paymentPending(params){

			gcwFactory.getListPendingPayment(params, true).then(function(response) {
        var pagos;
				if (response.data.list.length > 0) {
					pagos = response.data.list;
					vm.totalItemsPagos = response.data.totalRows;
					vm.totalPagesPagos = response.data.totalPages;
					vm.noResultPagos = false;
				}else{
					pagos = [];
					vm.totalItemsPagos = 0;
					vm.totalPagesPagos = 0;
					vm.noResultPagos = true;
        }
        pagePagos.setNroTotalRegistros(vm.totalItemsPagos).setDataActual(pagos).setConfiguracionTanda();
        setLstCurrentPagePagos();
			});
		}
    // lista 2
		function obtenerSiniestros(params){
			gcwFactory.getDetailAccident(params, true).then(function(response) {
        var siniestros;
				if (response.data.list.length > 0) {
					siniestros = response.data.list;
					vm.totalItemsSiniestro = response.data.totalRows;
					vm.totalPagesSiniestro = response.data.totalPages;
					vm.noResultSiniestro = false;
				}else{
					siniestros = [];
					vm.totalItemsSiniestro = 0;
					vm.totalPagesSiniestro = 0;
					vm.noResultSiniestro = true;
        }
        pageSiniestros.setNroTotalRegistros(vm.totalItemsSiniestro).setDataActual(siniestros).setConfiguracionTanda();
        setLstCurrentPageSiniestros();
			});
		}
    // lista 3
		function impresionPoliza(params){
			gcwFactory.getDetailRenewal(params, true).then(function(response) {
        var polizas;

				vm.cabecera = gcwFactory.getVariableSession('cabeceraSession');
				$rootScope.currentURL = $state.current.url;
				$rootScope.reloadAgent = false;
				$rootScope.polizaAnulada = "2";
	    	$rootScope.$broadcast('comprobanteRemitido');
				if (response.data) {
					polizas = response.data;
          vm.polizasLength = polizas && polizas.length;

					for(var i = 0; i<vm.polizasLength; i++){
						(polizas[i].selected === 'S') ? polizas[i].selected =true : polizas[i].selected = false;
					}
					(vm.polizasLength>0) ? vm.noResultPolizas = false : vm.noResultPolizas = true;
				}else{
					polizas = [];
					vm.noResultPolizas = true;
        }
        vm.totalItems = polizas.length;
        pagePolizas.setNroTotalRegistros(vm.totalItems).setDataActual(polizas).setConfiguracionTanda();
        setLstCurrentPagePolizas();
			});
    }

    function setLstCurrentPagePolizas() {
      vm.polizas = pagePolizas.getItemsDePagina();
    }

    function setLstCurrentPageSiniestros() {
      vm.siniestros = pageSiniestros.getItemsDePagina();
    }

    function setLstCurrentPagePagos() {
      vm.pagos = pagePagos.getItemsDePagina();
    }

		function pageChangedPagos(event) {
      vm.selectAll(false);
      vm.mCheckAll = false;
			var paramsPending = {
					dateStart: vm.formDataCartera.polizaDetail.dateStartExpiration,
					dateEnd: vm.formDataCartera.polizaDetail.dateEndExpiration,
					policyNumber: vm.formDataCartera.polizaDetail.policyNumber,
					situationType: 'RE',
					RoleType: vm.dataTicket.roleType,
					agentId: vm.formDataCartera.polizaDetail.agentId,
					managerId: vm.formDataCartera.polizaDetail.managerId,
					RowByPage: vm.itemsXTanda,
					ramo: {
						ramoId: vm.formDataCartera.polizaDetail.ramoId
					},
					client: {
						documentType: vm.formDataCartera.polizaDetail.documentType,
						documentNumber: vm.formDataCartera.polizaDetail.documentCode,
						agent: {
							agentId: vm.formDataCartera.polizaDetail.agentId
						}
					}
				};

      pagePagos.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        paramsPending.CurrentPage = nroTanda;
        paymentPending(paramsPending);
      }, setLstCurrentPagePagos);
		}

		function pageChangedSiniestro(event) {

			var paramsSiniestro = {
					dateStart: vm.formDataCartera.polizaDetail.dateStartExpiration,//
					dateEnd: vm.formDataCartera.polizaDetail.dateEndExpiration,//
					policyNumber: vm.formDataCartera.polizaDetail.policyNumber,
					documentType: vm.formDataCartera.polizaDetail.documentType,
					documentNumber: vm.formDataCartera.polizaDetail.documentCode,
					RowByPage: vm.itemsXTanda,
					ramo: {
						ramoId: vm.formDataCartera.polizaDetail.ramoId
					},
					client: {
						agent: {
							agentId: vm.formDataCartera.polizaDetail.agentId
						}
					}
        };

      pageSiniestros.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda) {
        paramsSiniestro.CurrentPage = nroTanda;
        obtenerSiniestros(paramsSiniestro);
      }, setLstCurrentPageSiniestros);
		}

		function pageChangedPolizas(event) {
      pagePolizas.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(null, setLstCurrentPagePolizas);
		}

		function selectPoliza(index, val){
			vm.showEmailBtn = val;
			vm.polizas[index].selected = val;

			for(var i=0; i<vm.polizasLength; i++){
				if(vm.polizas[i].selected){
					vm.polizasChecked = true;
					break;
				}else{
					vm.polizasChecked = false;
				}
			}

			if(!vm.polizasChecked){
				vm.showEmailBtn = false;
				vm.showSelectAll = false;
				vm.mCheckAll = false;
				vm.mCheckAllValue = false;
			}
		}

    function selectPolizaPE(index, val){
      vm.polizas[index].selected = val;

      for(var i=0; i<vm.polizasLength; i++){
        if(vm.polizas[i].selected){
          vm.polizasChecked = true;
          break;
        }else{
          vm.polizasChecked = false;
        }
      }

      if(!vm.polizasChecked){
        vm.showEmailBtn = false;
        vm.showSelectAll = false;
        vm.mCheckAll = false;
        vm.mCheckAllValue = false;
      }
    }

		function selectAll(val){
			vm.showEmailBtn = val;
			vm.showSelectAll = val;
			vm.mCheckAllValue = val;

			for(var i=0; i<vm.polizasLength; i++){
				vm.polizas[i].selected = val;
			}
		}

		function showDetailSiniestro(siniestro){
			vm.formSiniestro = {};
      vm.formSiniestro.siniestroDetail = siniestro;

      if(siniestro.viewDetail !== 'N'){
        $state.go('consulta.siniestroAutoDetalle', {id:siniestro.policyNumber}, {reload: false, inherit: false});
        gcwFactory.addVariableSession("siniestroDetail", vm.formSiniestro.siniestroDetail);
      }
		}

		$scope.downloadImpresion = function(poliza){
			var deferred = $q.defer();
			var downloadFile = '{"Ramo": {"RamoId": '+poliza.ramo.ramoId.toString()+', "CompanyId": '+poliza.ramo.companyId+' }, "agent":{ "agentId": '+vm.formDataCartera.polizaDetail.agentId+'}, "UserCode": "'+ vm.dataTicket.userCode+'", "PolicyNumber": '+poliza.policyNumber+', "Supplement": "'+poliza.supplement+'", "Application": "'+poliza.application+'", "ApplicationSupplement": "'+poliza.applicationSupplement+'"}';
			var datajson = "json="+downloadFile;
			gaService.add({ gaCategory: 'CG - Cartera', gaAction: 'MPF - Polizas - Boton Descargar (Reimpresiones CARTERA)', gaLabel: 'Boton: Descargar', gaValue: 'Periodo Regular' });
			mpSpin.start();
			$http({
		    method: "POST",
		    url: constants.system.api.endpoints.gcw+"api/renewal/download",
		    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		    data: datajson,
		    responseType: 'arraybuffer'
			})
			.then(function(data) {
			        // success
				if (data.status === 200) {
					var defaultFileName = 'poliza_'+poliza.policyNumber+'_spto_'+poliza.supplement+'.pdf';
					defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
					var vtype=  data.headers(["content-type"]);
					var file = new Blob([data.data], {type: vtype});
          mpSpin.end();
          $window.saveAs(file, defaultFileName);
          deferred.resolve(defaultFileName);
				}else{
					mpSpin.end();
					mModalAlert.showError("Ha ocurrido un error al generar el PDF", "Cartera: Pólizas", "", "", "", "g-myd-modal");
				}
			}, function(response) { // optional // failed
			   	mpSpin.end();
			   	mModalAlert.showError("Ha ocurrido un error al generar el PDF", "Cartera: Pólizas", "", "", "", "g-myd-modal");
			});

		};

		function showPolizaElectronica(){
			if(typeof vm.dataTicket !== 'undefined'){
				return (vm.dataTicket.roleCode === "GESTOR" || vm.dataTicket.roleCode === "ADM-RENOV")
			}
		}

		function showModalPolizaElectronica(){
			vm.paramsGetDataModalPolizaElec = {
				documentType: vm.formDataCartera.polizaDetail.documentType,
				documentNumber: vm.formDataCartera.polizaDetail.documentCode,
				list: []
			};

			for(var i=0; i<vm.polizas.length; i++){
				if(vm.polizas[i].selected){
					vm.polizas[i].ramo.sectorId = vm.formDataCartera.polizaDetail.sectorId;
					vm.paramsGetDataModalPolizaElec.list.push(vm.polizas[i]);
					vm.getDataPolicyElectronic = true;
				}
			}

			if(vm.paramsGetDataModalPolizaElec.list.length>0){// si hay data seleccionada
				gcwFactory.getDataPolicyElectronic(vm.paramsGetDataModalPolizaElec, true).then(function(response) {
          if (response.operationCode === constants.operationCode.success) {
            if(response.data){
              vm.dataPolicyElectronic = response.data;

              if(!vm.dataPolicyElectronic.email) {
                mModalAlert.showError('No hay correo electrónico para la(s) póliza(s) seleccionada(s)', 'Error', '', '', '', 'g-myd-modal');
              }

              if(vm.dataPolicyElectronic.withPolicyElectronic){
                vm.formDataCartera.mConsentimientoPoliza = (vm.dataPolicyElectronic.withPolicyElectronic === 'S');
              }

              if(vm.dataPolicyElectronic.withInsured){
                vm.formDataCartera.mConsentimientoAllPoliza = (vm.dataPolicyElectronic.withInsured === 'S');
              }
            }
          } else {
            mModalAlert.showError(response.data.Message, 'Error', '', '', '', 'g-myd-modal').then(function () {
              $state.reload();
            });
          }
        }).catch(function (err) {
          mModalAlert.showError(err.data.data.message, 'Error', '', '', '', 'g-myd-modal').then(function () {
            $state.reload();
          });
        });
			}
		}

		function modalCartera(){
			showModalPolizaElectronica();
			$scope.message = false;
			//Modal
      if(vm.paramsGetDataModalPolizaElec.list.length>0){
        $uibModal.open({
          backdrop: true, // background de fondo
          backdropClick: true,
          dialogFade: false,
          keyboard: true,
          scope: $scope,
          size: 'lg',
          templateUrl : '/gcw/app/components/modalCarteraPoliza/component/modalCartera.html',
          controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
            //CloseModal
            $scope.close = function () {
              $uibModalInstance.close();
            };
            $scope.enviarEmail = function(){
              if(!vm.dataPolicyElectronic.email) {
                mModalAlert.showError('No hay correo electrónico para la(s) póliza(s) seleccionada(s)', 'Error', '', '', '', 'g-myd-modal').then(function () {
                  $scope.close();
                })
              }
              if (vm.validationForm() && (vm.formDataCartera.mConsentimientoPoliza || vm.formDataCartera.mConsentimientoAllPoliza)){
                vm.paramsSetDataModalPolizaElec = {
                  documentType: vm.formDataCartera.polizaDetail.documentType,
                  documentNumber: vm.formDataCartera.polizaDetail.documentCode,
                  userCode: vm.dataTicket.userCode,
                  email: vm.dataPolicyElectronic.email,//'diana@multiplica.com',
                  withPolicyElectronic: (vm.formDataCartera.mConsentimientoPoliza === true) ? 'S' : 'N',
                  withInsured: (vm.formDataCartera.mConsentimientoAllPoliza === true) ? 'S' : 'N',
                  list: vm.paramsGetDataModalPolizaElec.list
                };

                gcwFactory.getSetDataPolicyElectronic(vm.paramsSetDataModalPolizaElec, true).then(function(response) {
                  if(response.data){
                    $scope.message = true;
                    $scope.respuesta = response.data.description;
                  }
                }, function(error){
                });
              }
            }
          }]
        });
      }else{
        mModalAlert.showInfo("Debe elegir por lo menos una póliza.", "Advertencia", "", "", "", "g-myd-modal");
      }
    }

    function modalSendEmailPendingPayments(pago) {
      gcwFactory.openModalSendMail(pago, $scope);
    }
    vm.modalEnvioMailImpPoliza = modalEnvioMailImpPoliza;
    function modalEnvioMailImpPoliza(val){
	  gaService.add({ gaCategory: 'CG - Cartera', gaAction: 'MPF - Polizas - Enviar Correo (Reimpresiones CARTERA)', gaLabel: 'Boton: Correo', gaValue: 'Periodo Regular' });
      showModalPolizaElectronica();
      vm.listArray = [];
      //Modal
      vm.docSeleted = {
        ramo: {
          ramoId: val.ramo.ramoId,
          companyId: val.companyId
        },
        agent: {
          agentId: vm.formDataCartera.polizaDetail.agentId
        },
        userCode: vm.dataTicket.userCode,
        policyNumber: val.policyNumber,
        supplement: val.supplement,
        application: val.application,
        applicationSupplement: val.applicationSupplement
      };
      vm.listArray.push(vm.docSeleted);
      $uibModal.open({
        backdrop: true, // background de fondo
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        templateUrl : '/gcw/app/components/modalCarteraPoliza/component/modalEnvioMail.html',
        controller : ['$scope', '$uibModalInstance', '$uibModal', function($scope, $uibModalInstance, $uibModal) {
          //CloseModal
          $scope.close = function () {
            $uibModalInstance.close();
          };

					$scope.enviar = function(){
						if ($scope.frmSendMail.mPara && $scope.frmSendMail.mAsunto && !$scope.frmSendMail.nPara.$invalid){
							vm.paramsEnviarEmail = {
							  email: $scope.frmSendMail.mPara,
							  bodyMessage: (typeof $scope.frmSendMail.mComentario === 'undefined') ? '': $scope.frmSendMail.mComentario,
							  subject: $scope.frmSendMail.mAsunto,
                list: vm.listArray
							};

							gcwFactory.sendImpresionesPolizasEmail(vm.paramsEnviarEmail, true).then(function(response) {
								if(response.operationCode === 200){
									$scope.message = true;
									$scope.respuesta = 'Email enviado';//response.data.description;
								}
							 }, function(error){
							});
						}
					}
        }]
      });
    }

		function validationForm() {
			return ((vm.formDataCartera.mConsentimientoPoliza || !vm.formDataCartera.mConsentimientoPoliza) &&
				(vm.formDataCartera.mConsentimientoAllPoliza || !vm.formDataCartera.mConsentimientoAllPoliza));
		}

    function isWindowsUserAgent() {
      if (vm.pagos) {
        var isWindows = !navigator.userAgent.indexOf('Macintosh') > 0;
        return (vm.pagos.length > 5) && isWindows;
      }
    }

    vm.selectPago = selectPago;
    function selectPago(index, val){
      vm.showEmailBtn = val;
      vm.pagos[index].selected = val;

      for(var i=0; i<vm.pagos.length; i++){
        if(vm.pagos[i].selected){
          vm.docsChecked = true;
          break;
        }else{
          vm.docsChecked = false;
        }
      }

      if(!vm.docsChecked){
        vm.showEmailBtn = false;
        vm.showSelectAll = false;
        vm.mCheckAll = false;
        vm.mCheckAllValue = false;
      }
    }

    vm.selectAll = selectAll;
    function selectAll(val){
      vm.showEmailBtn = val;
      vm.showSelectAll = val;
      vm.mCheckAllValue = val;

      for(var i = 0; i < vm.pagos.length; i++) {
        vm.pagos[i].selected = val;
      }
    }

    function selectAllPE(val){
      vm.mCheckAllValuePE = val;

      for(var i=0; i<vm.polizas.length; i++){
        vm.polizas[i].selected = val;
      }
    }

    function showModalEnvioMail(){
      for(var i=0; i<vm.pagos.length; i++){
        if(vm.pagos[i].selected){
          vm.paramsDocsPorPagar.push(vm.pagos[i]);
        }
      }
    }

    vm.modalEnvioMail = modalEnvioMail;
    function modalEnvioMail() {
      vm.paramsDocsPorPagar = [];
      vm.listItemsDocsPorPagar = [];
      showModalEnvioMail();
      //Modal
      if(vm.paramsDocsPorPagar.length>0){

        ng.forEach(vm.pagos, function (item, key) {
          if (vm.pagos[key].selected) {
            vm.docSeleted = {
              voucherPayment: item.voucherPayment,
              ramo: {
                companyId: item.ramo.companyId
              },
              typeResponse: item.documentType,
              documentNumber: item.documentNumber,
              situationType: item.situationType,
              agentId: item.client.agent.agentId,
              managerId: item.client.agent.managerId,
              client: {
                documentType: item.client.documentType,
                documentNumber: item.client.documentNumber
              }
            };
            vm.listItemsDocsPorPagar.push(vm.docSeleted);
          }
        });

        gcwFactory.openModalSendMail(vm.listItemsDocsPorPagar, $scope);
      }else{
        mModalAlert.showInfo("Debe elegir por lo menos un documento.", "Advertencia", "", "", "", "g-myd-modal");
      }
    }

	} // end controller
	return ng.module('appGcw')
		.controller('PolizaDetalleController', PolizaDetalleController)
		.component('gcwPolizaDetalle', {
			templateUrl: '/gcw/app/components/cartera/polizas/poliza-detalle/poliza-detalle.html',
			controller: 'PolizaDetalleController',
			controllerAs: 'vm',
			bindings: {
			}
		});
});
