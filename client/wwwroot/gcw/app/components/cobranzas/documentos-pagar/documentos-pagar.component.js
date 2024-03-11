define([
  'angular', 'constants', 'lodash',
  '/gcw/app/factory/gcwFactory.js', 'fexConsult'
], function (ng, constants, _) {

  DocumentosPagarController.$inject = [
    '$scope',
    'gcwFactory',
    'gaService',
    '$uibModal',
    'mModalAlert',
    'mModalConfirm',
    '$rootScope',
    '$sce',
    '$timeout',
    'MxPaginador',
    '$state',
    '$q',
    'mpSpin',
    '$http',
    'httpData',
    '$window',
    'mainServices'
  ];

  function DocumentosPagarController(
    $scope,
    gcwFactory,
    gaService,
    $uibModal,
    mModalAlert,
    mModalConfirm,
    $rootScope,
    $sce,
    $timeout,
    MxPaginador,
    $state,
    $q,
    mpSpin,
    $http,
    httpData,
    $window,
    mainServices
  ) {
    var vm = this;
    var page;

    vm.$onInit = function () {
      $rootScope.currentURL = $state.current.url;
      $rootScope.$broadcast('comprobanteRemitido');
      $rootScope.$broadcast('dashboard');
      $rootScope.$broadcast('networkInit');
      $rootScope.$broadcast('msgSinResultados');

      vm.evoProfile = JSON.parse(window.localStorage.getItem('evoProfile'));
      vm.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      vm.registeredLogsViewProperties = getRegisteredLogsViewProperties();
      vm.showClientRow = false;
      vm.showColDiasVenc = false;
      vm.showColPoliza = true;
      vm.showColDetalles = true;
      vm.colDktp1 = true;
      vm.colDktp2 = false;
      vm.coordinations = [];
      vm.cutoffDates = [];
      vm.dateNow = new Date();
      vm.paidFilterDates = {
        start: new Date(new Date().setDate(new Date().getDate() - 90)),
        end: new Date()
      }

      vm.itemsXPagina = 10;
      vm.itemsXTanda = vm.itemsXPagina * 10;
      vm.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
      page = new MxPaginador();
      page.setNroItemsPorPagina(vm.itemsXPagina);

      vm.formDocPagar = {};
      vm.formDocPagar.optRadioTap1 = "1";
      vm.formDocPagar.DocPagar = "Cobranzas - Documentos Por Pagar";

      vm.pageChanged = pageChanged;
      vm.firstLoad = false; //primera carga en false
      vm.noResult = true;

      vm.cabecera = $rootScope.cabecera;
      gcwFactory.cleanStorage();
      vm.dataTicket = gcwFactory.getVariableSession("dataTicket");
      vm.loadCoordinationTypes();
      // vm.loadCutoffDates();
    }
    vm.register = register;
    vm.buscar = buscar;
    vm.limpiar = limpiar;
    vm.sendEmail = sendEmail;
    vm.copy = copy;
    vm.seeDown = seeDown;
    vm.pago = pago;
    vm.affiliate = affiliate
    vm.showModalDocPagarDetalle = showModalDocPagarDetalle;

    $scope.$watch('vm.formDocPagar.optRadioTap1', function () {
      if (vm.totalRows >= 1) {
        switch (vm.formDocPagar.optRadioTap1.toString()) {
          case "1":
            vm.verSegmento = false;
            vm.verBtnEstado = false;
            break;
          case "2":
            vm.verSegmento = false;
            vm.verBtnEstado = false;
            break;
          case "3":
            vm.verSegmento = true;
            vm.verBtnEstado = true;
            break;
        }
      }
    });

    vm.showCols = showCols;

    function getListaDocPagar(params) {
      var docs;
      getListDocumentPayment(params, true).then(
        function (response) {
          if (response.data) {
            if (response.data.list.length > 0) {
              docs = mapPolicies(response.data.list);

              vm.clientName = response.data.clientName;
              vm.commercialSegment = response.data.commercialSegment;
              vm.totalPages = response.data.totalPages;
              vm.totalRows = response.data.totalRows;
              
              if (vm.formDocPagar.optRadioTap1.toString() == "2") { //por poliza

                var filter = {
                  policyNumber: vm.formDocPagar.mNumPoliza,
                  documentTypeCode: '',
                  documentTypeNumber: '',
                  roleType: vm.dataTicket.roleType,
                  managerId: 0
                }
                gcwFactory.getGestorAgentePorPoliza(filter, false).then(function (response) {
                  var ga = {};
                  ga = response.data;

                  $rootScope.codeAgent = (ng.isUndefined(ga.agentId) || ga.agentId == 0) ? "" : ga.agentId.toString();
                  $rootScope.nameAgent = (ng.isUndefined(ga.agentNameFull)) ? "" : ga.agentNameFull;

                  $rootScope.codeManager = (ng.isUndefined(ga.managerId) || ga.managerId == 0) ? "" : ga.managerId.toString();
                  $rootScope.descriptionManager = ng.isUndefined(ga.managerNameFull) ? "INDEFINIDO" : ga.managerNameFull;

                  if ($rootScope.codeAgent == "" && $rootScope.nameAgent == "")
                    vm.cabecera.agente = "";

                  $rootScope.polizaAnulada = vm.formDocPagar.optRadioTap1;
                  $rootScope.$broadcast('anuladasPorDeuda');
                });

              } else {
                $rootScope.codeAgent = undefined;
                $rootScope.nameAgent = undefined
                $rootScope.codeManager = undefined;
                $rootScope.descriptionManager = undefined

                $rootScope.polizaAnulada = vm.formDocPagar.optRadioTap1;
              }

            } else {
              docs = [];
              vm.totalRows = 0;
              vm.totalPages = 0;
            }

          } else {
            docs = [];
            vm.totalRows = 0;
            vm.totalPages = 0;
          }
          page.setNroTotalRegistros(vm.totalRows).setDataActual(docs).setConfiguracionTanda();
          setLstCurrentPage();
        });
    }

    function getDigitalHours() {
      return [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ];
    }

    function mapPolicies(policies) {
      return (policies || []).map(function (policy) {
        const policyClone = Object.assign({}, policy);
        const firstReceipt = policyClone.recibos[0] || {};

        return Object.assign(
          policyClone,
          {
            receiptsToView: mapReceiptsToView(policy.recibos),
            remainingMonths: calculateRemaningMonths(firstReceipt.dateEffect, firstReceipt.dateExpiration)
          }
        );
      });
    }

    function calculateRemaningMonths(initDate, endDate) {
      var initDateParts = initDate.split('/');
      var endDateParts = endDate.split('/');
  
      var initDays = initDateParts[0];
      var initMonths = initDateParts[1];
      var initYears = initDateParts[2];
  
      var endDays = endDateParts[0];
      var endMonths = endDateParts[1];
      var endYears = endDateParts[2];
  
      var initCompleteDate = new Date(initYears + '/' + initMonths + '/' + initDays);
      var endCompleteDate = new Date(endYears + '/' + endMonths + '/' + endDays);
  
      var diffMonths = (endCompleteDate.getFullYear() - initCompleteDate.getFullYear()) * 12 + (endCompleteDate.getMonth() - initCompleteDate.getMonth());
  
      return diffMonths % 12;
    }

    function mapReceiptsToView(receipts) {
      receipts = receipts || [];
      return receipts.reduce(function (acc, curr, index) {
          var receiptNumbersHTMLToAdd = index <= 2 ? '<div>' + curr.documentNumber + '</div>' : index === 3 ? '<div>Ver más</div>' : '';
          var receiptNumbersHTML = acc.receiptNumbersHTML + receiptNumbersHTMLToAdd;
          var dueDatesHTMLToAdd = index <= 2 ? '<div>' + curr.dateExpiration + '</div>' : index === 3 ? '...' : '';
          var dueDatesHTML = acc.dueDatesHTML + dueDatesHTMLToAdd;
          var formattedNumberDayExpiration = curr.numberDayExpiration > 0 ? ' - ' + curr.numberDayExpiration + 'd' : index === 3 ? '...' : '';
          var numberDaysExpirationHTMLToAdd = index <= 2 ? '<div>' + formattedNumberDayExpiration + '</div>' : index === 3 ? '...' : '';
          var numberDaysExpirationHTML = acc.numberDaysExpirationHTML + numberDaysExpirationHTMLToAdd;
          var amountsHTMLToAdd = index <= 2 ? '<div>' + curr.amount + '</div>' : index === 3 ? '...' : '';
          var amountsHTML = acc.amountsHTML + amountsHTMLToAdd;
          var totalAmount = acc.totalAmount++ + curr.amount;
  
          return {
            receiptNumbersHTML: receiptNumbersHTML,
            dueDatesHTML: dueDatesHTML,
            numberDaysExpirationHTML: numberDaysExpirationHTML,
            amountsHTML: amountsHTML,
            totalAmount: parseFloat(totalAmount).toFixed(2)
          };
  
      }, { receiptNumbersHTML: '', dueDatesHTML: '', numberDaysExpirationHTML: '', amountsHTML: '', totalAmount: 0 });
    }

    vm.loadCoordinationTypes = loadCoordinationTypes;
    function loadCoordinationTypes() {
      const savedCoordinationTypes = JSON.parse(localStorage.getItem('local_coordinations'));
      const localCoordinationTypes = Promise.resolve({ data: savedCoordinationTypes });
      const remoteCoordinationTypes = getCoordinationTypes;

      const dataPromise = savedCoordinationTypes ? localCoordinationTypes : remoteCoordinationTypes();

      dataPromise
        .then(function (response) {
          const coordinations = response && response.data;
          localStorage.setItem('local_coordinations', JSON.stringify(coordinations));
          vm.coordinations = coordinations;
        })
        .catch(function(error) {
          console.error(error);
        });
    }

    vm.loadCutoffDates = loadCutoffDates;
    function loadCutoffDates() {
      return getCutoffDates()
        .then(function (response) {
          return response && response.data.detalle;
          // localStorage.setItem('local_cutoff_dates', JSON.stringify(cutoffDates));
          // return cutoffDates;
        })
        .catch(function (error) {
          console.error(error);
        });
    }

    vm.registerContactInfo = registerContactInfo;
    function registerContactInfo(payload) {
      return registerContact(payload)
      .then(
        function(_) {
          return Promise.resolve(true);
        }
      )
      .catch(
        function(_) {
          mModalAlert.showError('No se pudo registrar el contacto', '');
          return Promise.resolve(false);
        }
      );
    }

    vm.sendLinkByEmail = sendLinkByEmail;
    function sendLinkByEmail(receipt, type) {
      const typeText = type === 'payment' ? 'PAGO' : 'AFILIACIÓN';
      const errorMessage = 'No es posible enviar un correo. Por favor, genere un enlace de ' + typeText.toLocaleLowerCase();

      const emailToSend = receipt && receipt.client && receipt.client.email;

      if(!emailToSend) {
        mModalAlert.showError(errorMessage, '');

        return Promise.resolve(null);
      }

      return Promise.resolve(true)
      .then(
        function(confirmAnswer){
          if (!confirmAnswer) {
            return Promise.resolve(false);
          }

          if (type === 'payment') {
            return getSendLinkPago(gcwFactory.requestDocPagar(receipt));
          }

          const requestBody = {
            tokenProcesadoras: [
              {
                nombreProcesadora: 'LYRA',
                tokenProcesadora: '2007d2e1-4e3a-462b-a7d0-7798657af750'
              }
            ],
            cliente: {
              nomTomador: receipt.client.name,
              codDocumento: receipt.client.documentNumber,
              tipDocumento: receipt.client.documentType,
              email: receipt.client.email
            },
            poliza: {
              compania: receipt.ramo.companyId,
              numero: receipt.policyNumber
            }
          };

          return getSendLinkAfiliacion(requestBody);
        } 
      )
      .then(
        function(_){ 
          return Promise.resolve(true);
        }
      )
      .catch(
        function(error){
          return error === 'cancel' ? Promise.resolve('cancel') : mModalAlert.showError(errorMessage, '');
        } 
      );
    }

    vm.copyLinkAffiliation = copyLinkAffiliation;
    function copyLinkAffiliation(receipt) {
      return getLinkAfiliacion(gcwFactory.requestDocPagar(receipt))
      .then(function(response) {
        return response.data.url ? copyContent(response.data.url) : Promise.reject(false);
      })
      .catch(function(error) {
        mModalAlert.showError("Error al generar o copiar enlace", "");
        return Promise.resolve(false)
      });
    }

    vm.copyLinkPayment = copyLinkPayment;
    function copyLinkPayment(receipt) {
      return getLinkPago(gcwFactory.requestDocPagar(receipt))
      .then(function(response) {
        return response.data.url ? copyContent(response.data.url) : Promise.reject(false);
      })
      .catch(function(error) {
        mModalAlert.showError("Error al generar o copiar enlace", "");
        return Promise.resolve(false)
      });
    }

    vm.copyContent = copyContent;
    function copyContent(content) {
      return navigator.clipboard.writeText(content).then(function(_) {
        return Promise.resolve(content);
      });
    }

    vm.getMembershipLink = getMembershipLink;
    function getMembershipLink(policy) {
      const receipt = policy.recibos[0];

      const requestBody = {
        tokenProcesadoras: [
          {
            nombreProcesadora: 'LYRA',
            tokenProcesadora: '2007d2e1-4e3a-462b-a7d0-7798657af750'
          }
        ],
        cliente: {
          nomTomador: receipt.client.name,
          codDocumento: receipt.client.documentNumber,
          tipDocumento: receipt.client.documentType,
          email: receipt.client.email
        },
        poliza: {
          compania: receipt.ramo.companyId,
          numero: policy.policyNumber
        }
      };

      return getSendLinkAfiliacion(requestBody).then(function(_) {
        return vm.openMembershipModal(policy);
      })
      .catch(function(_) {
        return mModalAlert.showError("Error en enviar el link de afiliación.", "");
      });
    }

    function sendEmail(event,poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      if(poliza.client.email){
        mModalConfirm.confirmWarning('¿DESEAS ENVIAR EL ENLACE DE PAGO A ' + poliza.client.email.toUpperCase() +'?','','')
        .then(function () {
          getSendLinkPago(gcwFactory.requestDocPagar(poliza)).then(function (response) {
            mModalAlert.showSuccess("El email ha sido enviado a " + poliza.client.email, "")
          }).catch(function () {
            mModalAlert.showError("No es posible enviar un correo. Por favor, genere un enlace de pago", "")
          })
        });
      }
      else{
        mModalAlert.showError("No es posible enviar un correo. Por favor, genere un enlace de pago", "")
      }
    }

    function copy(event, poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }


      getLinkPago(gcwFactory.requestDocPagar(poliza)).then(function (response) {
        navigator.clipboard.writeText(response.data.url)
          .then(function () {
            mModalAlert.showSuccess("El enlace fue copiado en el portapapeles", "")
          })
      }).catch(function () {
        mModalAlert.showError("Error al generar enlace", "")
      })
    }

    function pago(event, poliza) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/modal-generar-enlace/modal-generar-enlace.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
          $scope.poliza = Object.assign({}, poliza);
          $scope.receipts = poliza.recibos || [];
          $scope.poliza.accessActive = true;

          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

          $scope.generar = function(event, selectedReceipt) {
            preventEvent(event);

            if (!$scope.poliza.accessActive) {
              $scope.goToModalGenerated(selectedReceipt);
              
              return;
            }

            vm.sendLinkByEmail(selectedReceipt, 'payment').then(function(response) {
              if (response === 'cancel') {
                return;
              }
              return $scope.goToModalGenerated(selectedReceipt);
            });
          }

          $scope.goToModalGenerated = function(selectedReceipt) {
            vm.openModalGeneratedPaymentLink($scope.poliza, selectedReceipt);
            $uibModalInstance.close();
          }

          $scope.selectReceipt = function(event, currentReceipt) {
            event && event.stopPropagation() || event.preventDefault();

            $scope.selectedReceipt = currentReceipt;
          }
          
        }]
      });
    }

    function register(event,policy) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/modal-registrar-contacto-cliente/modal-registrar-contacto-cliente.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
          $scope.httpResponseOk = false;
          $scope.policy = Object.assign({}, policy);
          $scope.formattedCoordinations = mapCoordinations(vm.coordinations);
          $scope.fechaReprogramacion = '';
          $scope.currentContact = {
            coordinationKeys: '',
            from: '',
            to: '',
            date: '',
            comment: ''
          };
          $scope.currentCoordination = {
            code: '',
            type: ''
          };
          $scope.contactValidators = ['from', 'to', 'date', 'comment'];
          $scope.hoursFrom = getDigitalHours().map(function(d) {
            return { code: d, description: d};
          });
          $scope.hoursTo = getDigitalHours().map(function(d) {
            return { code: d, description: d};
          });

          $scope.closeModal = function (event) {
            preventEvent(event);

            $uibModalInstance.close();
          };

          $scope.changeCoordination = function() {
            const coordinationData = $scope.currentContact.coordinationKeys.split('-');
            var codeInt = coordinationData[0];
            var code = coordinationData[1];

            $scope.currentCoordination.type = codeInt;
            $scope.currentCoordination.code = code;

            if(codeInt === '2') {
              $scope.currentContact.from = '';
              $scope.currentContact.to = '';
              $scope.currentContact.date = '';
              $scope.contactValidators = ['comment'];

              return;
            }

            $scope.contactValidators = ['from', 'to', 'date', 'comment'];
          }

          $scope.isFormDisabled = function() {
            const first = $scope.contactValidators.map(function(v) {
              return !!$scope.currentContact[v];
            }).includes(false);

            const second = !$scope.currentCoordination.code;

            return first || second;
          }

          $scope.confirmRegistration = function (event) {
            preventEvent(event);

            if ($scope.currentContact.from > $scope.currentContact.to) {
              mModalAlert.showError('Error en el horario para contactarse con el cliente. La hora DESDE no debe ser mayor a la hora HASTA.', '');

              return;
            }

            var selectedDate = $scope.currentContact.date || new Date();
        
            var dateParts = selectedDate.toLocaleDateString().split('/');
            var day = dateParts[0];
            var month = dateParts[1];
            var year = dateParts[2];
        
            var formattedMonth = month.length === 2 ? month : '0' + month;
            var formattedDate = day + '/' + formattedMonth + '/' + year;
        
            var httpPayload = {
                poliza: {
                  policyNumber: $scope.policy.policyNumber,
                  supplementNumber: $scope.policy.recibos[0].supplementId
                },
                tipoCoordinacion: $scope.currentCoordination.code,
                reprogramacion: {
                  fecha: $scope.currentContact.date ? formattedDate : '',
                  horaDesde: $scope.currentContact.from,
                  horaHasta: $scope.currentContact.to
                },
                comentario: $scope.currentContact.comment
            };
        
            if ($scope.isFormDisabled()) {
                return;
            }
        
            vm.registerContactInfo(httpPayload).then(function(response) {
                if (!response) {
                    return;
                }
        
                $scope.httpResponseOk = true;
            });
          }

          function mapCoordinations(types) {
            return types.reduce(function(acc, curr) {
              var selector = curr.codeInt === 1 ? 'contacted' : 'notContacted';
              var currentSection = acc[selector].concat(curr);
              var updatedAcc = {};
              updatedAcc[selector] = currentSection;
              return Object.assign({}, acc, updatedAcc);
            }, { contacted: [], notContacted: [] });
          }
        }]
      });
    }

    function affiliate(event,policy) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      vm.getMembershipLink(policy);
    }

    vm.openMembershipModal = openMembershipModal;
    function openMembershipModal(policy) {
      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/modal-afiliar/modal-afiliar.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
          $scope.policy = Object.assign({}, policy);
          $scope.receipt = $scope.policy.recibos[0];
          $scope.isLinkCopied = false;
          $scope.isEmailEnabled = true;
          $scope.paymentLink = { url: '' };

          $scope.copyUrl = function (event) {
            preventEvent(event);

            if ($scope.paymentLink.url) {
              return;
            }

            copyLinkAffiliation($scope.receipt).then(function(response) {
              if (!response) {
                return;
              }

              $scope.paymentLink.url = response;
            });
          }

          $scope.sendEmail = function (event) {
            preventEvent(event);

            vm.sendLinkByEmail($scope.receipt, 'affiliation').then(function (response) {
              if (response === 'cancel') {
                return;
              }
              $scope.isEmailEnabled = false;

              var tickAnchorEl = document.querySelector('.container');
              setTimeout(function() { tickAnchorEl.click(); });
            });
          }

          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

        }]
      });
    }

    function seeDown(event) {
      preventEvent(event);
    }

    vm.showRegisteredLogs = showRegisteredLogs;
    function showRegisteredLogs(event, policy) {
      preventEvent(event);

      if(policy.showSeeDown === true) {
        policy.showSeeDown = false;
        
        return;
      }

      const tickAnchorEl = document.querySelector('.tick-anchor');
      const requestBody = {
        policyNumber: policy.policyNumber,
        supplementNumber: policy.recibos[0].supplementId
      };

      if (policy.showSeeDown) {
        return;
      }

      getRegisteredLogs(requestBody)
      .then(
        function (response) {
          if (!response || !response.data) {
            return Promise.reject(null);
          }

          policy.registeredLogs = response.data;
          policy.showSeeDown = true;
          policy.groupedLogs = getGroupedRegisteredLogs(policy.registeredLogs);

          setTimeout(function() { tickAnchorEl.click(); });
        }
      )
      .catch(function(_) {
        return mModalAlert.showError('Error al cargar bitácoras de la póliza seleccionada.', '');
      });
    }

    function setLstCurrentPage() {
      vm.docs = page.getItemsDePagina();
    }

    function getParams() {
      switch (vm.formDocPagar.optRadioTap1.toString()) {
        case "1": //por tiempo
          vm.verSegmento = false;
          vm.verBtnEstado = false;
          return {
            situationCode: vm.formDocPagar.Situacion.code,
            policyNumber: "",
            ramo: {
              ramoId: (ng.isUndefined(vm.formDocPagar.Ramo.ramoId) || vm.formDocPagar.Ramo.ramoId === null) ? 0 : vm.formDocPagar.Ramo.ramoId,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
          break;
        case "2": //por poliza
          vm.verSegmento = false;
          vm.verBtnEstado = false;
          return {
            situationCode: 'PL',
            policyNumber: vm.formDocPagar.mNumPoliza,
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
          break;
        case "3": //por cliente
          vm.verSegmento = true;
          vm.verBtnEstado = true;
          return {
            situationCode: 'CL',
            policyNumber: '',
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentType,
              documentNumber: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentNumber
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda,
            CurrentPage: vm.currentPage
          };
          break;
      }
    }

    function pageChanged(event) {
      vm.selectAll(false);
      vm.mCheckAll = false;
      switch (vm.formDocPagar.optRadioTap1.toString()) {
        case "1":
          vm.params = {
            situationCode: vm.formDocPagar.Situacion.code,
            policyNumber: "",
            ramo: {
              ramoId: (ng.isUndefined(vm.formDocPagar.Ramo.ramoId) || vm.formDocPagar.Ramo.ramoId === null) ? 0 : vm.formDocPagar.Ramo.ramoId,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          break;
        case "2":
          vm.params = {
            situationCode: 'PL',
            policyNumber: vm.formDocPagar.mNumPoliza,
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: '',
              documentNumber: ''
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          break;
        case "3":
          vm.params = {
            situationCode: 'CL',
            policyNumber: '',
            ramo: {
              ramoId: 0,
            },
            client: {
              documentType: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentType,
              documentNumber: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentNumber
            },
            RoleType: (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            RowByPage: vm.itemsXTanda
          };
          break;
      };
      page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(
        function (nroTanda) {
          vm.params.CurrentPage = nroTanda;
          getListaDocPagar(vm.params);
        }, setLstCurrentPage);
    }

    function buscar() {
      vm.rol = gcwFactory.obtenerAgente(vm.dataTicket);

      var paidFilterEvaluation = evaluatePaidFiltersDates(vm.paidFilterDates.start,vm.paidFilterDates.end);

      switch (vm.formDocPagar.optRadioTap1.toString()) {
        case "1":
          if (vm.cabecera && typeof vm.dataTicket != 'undefined') {
            if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Documentos por pagar");
            } else {

              if (!paidFilterEvaluation.passed) {
                return;
              }

              vm.currentPage = 1;
              vm.params = getParams();
              
              if (paidFilterEvaluation.addToParams) {
                vm.params.DateStart = getVisibleCorrectDate(vm.paidFilterDates.start);
                vm.params.DateEnd = getVisibleCorrectDate(vm.paidFilterDates.end);
              }

              page.setCurrentTanda(vm.currentPage);
              getListaDocPagar(vm.params);
            }
          }
          break;
        case "2":
          if (vm.formDocPagar.mNumPoliza == "" || ng.isUndefined(vm.formDocPagar.mNumPoliza)) {
            mModalAlert.showInfo("Ingrese una póliza antes de iniciar la consulta", "Cobranzas: Documentos por pagar");
          } else {
            vm.currentPage = 1;
            vm.params = getParams();
            page.setCurrentTanda(vm.currentPage);
            getListaDocPagar(vm.params);
          }

          break;
        case "3":
          if (vm.cabecera && typeof vm.dataTicket != 'undefined') {
            if (!vm.rol.agenteID || vm.rol.agenteID == 0) {
              mModalAlert.showInfo("Seleccione un agente para iniciar la consulta", "Cobranzas: Documentos por pagar");
            } else {
              if (ng.isUndefined(vm.formDocPagar.Cliente)) {
                mModalAlert.showInfo("Seleccione un cliente para iniciar la consulta", "Cobranzas: Documentos por pagar");
              } else {
                vm.currentPage = 1;
                vm.params = getParams();
                page.setCurrentTanda(vm.currentPage);
                getListaDocPagar(vm.params);
              }
            }
          }
          break;
      }
    }

    //@todo implementar
    function limpiar() {
      $rootScope.$emit('cliente:borrar');
      vm.formDocPagar.optRadioTap1 = "1";
      vm.formDocPagar.mNumPoliza = '';
      vm.formDocPagar.Situacion = {};
      vm.formDocPagar.Situacion.code = "PAG";
      vm.docs = null;
      vm.noResult = true;
      vm.firstLoad = true;
      vm.totalPages = 0;
      vm.totalRows = 0;

      resetPaidFilterDates();

      vm.formDocPagar.Ramo = null;
      vm.formDocPagar.Cliente = undefined;
    }

    vm.openModalReceipts = openModalReceipts;
    function openModalReceipts(policy, parentEvent) {

      const modalController = ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {

        $scope.policy = Object.assign({}, policy);
        $scope.receipts = Object.assign({}, $scope.policy.recibos);

        $scope.closeModal = function (event) {
          preventEvent(event);

          $uibModalInstance.close();
        }

        $scope.goToDetail = function(selectedReceipt, event) {
          vm.showModalDocPagarDetalle(null, parentEvent, selectedReceipt);

          $uibModalInstance.close();
        }

      }];

      const modalConfig = {
        backdrop: 'static',
        backdropClick: false,
        keyboard: false,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: [
          '/gcw/app/components/cobranzas/documentos-pagar',
          'modal-receipts/modal-receipts.html'
        ].join('/'),
        controller: modalController
      }

      $uibModal.open(modalConfig);
    }


    function showModalDocPagarDetalle(policy, event, receipt) {
      // ::::::: tiene que ser por póliza (se tiene que manejar individualmente)

      var currentReceipt = Object.assign({}, receipt);
      var firstCondition = !receipt && policy;

      if (firstCondition && policy.recibos.length > 1) {
        vm.openModalReceipts(policy, event);

        return;
      }

      if (firstCondition && policy.recibos.length === 1) {
        currentReceipt = Object.assign({}, policy.recibos[0]);
      }

      gaService.add({ gaCategory: 'CG - Cobranzas', gaAction: 'MPF - Documentos por pagar - Click Resultado', gaLabel: 'Ver: Detalle', gaValue: 'Periodo Regular' });
      var hasClassSendEmail = angular.element(event.target).hasClass('sendEmail');

      if (hasClassSendEmail) {
        modalEnvioMail();
        return;
      }

      $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/modal-documento-pagar-detalle.html',
        controller: ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {

          if (vm.formDocPagar.optRadioTap1 == "1") {
            vm.situationType = vm.formDocPagar.Situacion.code;
          } else if (vm.formDocPagar.optRadioTap1 == "2") {
            vm.situationType = 'PL';
          } else if (vm.formDocPagar.optRadioTap1 == "3") {
            vm.situationType = 'CL';
          }

          vm.filterDocPagarDetalle = {
            documentNumber: currentReceipt.documentNumber,
            situationType: vm.situationType,
            agentId: vm.rol.agenteID,
            managerId: vm.rol.gestorID,
            client: {
              documentType: currentReceipt.client.documentType,
              documentNumber: currentReceipt.client.documentNumber
            }
          };
          gcwFactory.getDataDocPagarDetalle(vm.filterDocPagarDetalle, true).then(function (response) {
            if (response.data) {
              $scope.poliza = response.data.policyNumber;
              $scope.contratante = response.data.client.name;
              $scope.producto = response.data.ramo.description;
              $scope.compania = response.data.ramo.companyName;
              $scope.documento = response.data.documentNumber;
              $scope.tipoDocumento = response.data.documentTypeDescription;
              $scope.vencimiento = response.data.dateEffect;
              $scope.importe = response.data.amount;
              $scope.moneda = response.data.coinDescription;
              $scope.medio = response.data.collectionMethod.description;
              $scope.cliente = response.data.client.name;
              $scope.tipoDocumentoCliente = response.data.client.documentType;
              $scope.numDocumento = response.data.client.documentNumber;
              $scope.documento2 = $scope.tipoDocumentoCliente + ' ' + $scope.numDocumento;

              $scope.itemsSaldo = response.data.anticipates.length;
              if (response.data.anticipates.length > 0) {
                $scope.saldos = response.data.anticipates;
              }
            }
          });

          $scope.closeModal = function () {
            $uibModalInstance.close();
          };

          $scope.verDocumento = function () { //OIM-2160
            vm.downloadFile = {
              typeResponse: "REC",
              documentNumber: currentReceipt.documentNumber,
              situationType: vm.situationType,
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              client: {
                documentType: $scope.tipoDocumentoCliente,
                documentNumber: $scope.numDocumento
              }
            };
            vm.verDocumentoURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/payment/document/receipt/download');

            $timeout(function () {
              document.getElementById('frmVerDocumento').submit();
            }, 500);

          };

          $scope.saldoFavor = function () { //OIM-2160
            vm.downloadFile2 = {
              typeResponse: "APO",
              documentNumber: currentReceipt.documentNumber,
              situationType: vm.situationType,
              agentId: vm.rol.agenteID,
              managerId: vm.rol.gestorID,
              client: {
                documentType: $scope.tipoDocumentoCliente,
                documentNumber: $scope.numDocumento
              }
            };
            vm.saldoFavorURL = $sce.trustAsResourceUrl(constants.system.api.endpoints.gcw + 'api/payment/document/receipt/download');

            $timeout(function () {
              document.getElementById('frmSaldoFavor').submit();
            }, 500);

          };

        }]
      });
    }

    //Mostrar y ocultar columnas
    function showCols(radioValue, selectValue) {
      if (radioValue != 1) {
        vm.showClientRow = true;
      }

      if (radioValue == 1) {
        if (selectValue == 'VE' || selectValue == 'PA') {
          vm.showColDiasVenc = true;
          vm.showColPoliza = true;
          vm.showColDetalles = true;
          vm.colDktp1 = false;
          vm.colDktp2 = true;
        } else {
          vm.showColDiasVenc = false;
          vm.showColPoliza = true;
          vm.showColDetalles = true;
          vm.colDktp1 = true;
          vm.colDktp2 = false;
        }
      }

      if (radioValue == 2) {
        vm.showColDiasVenc = true;
        vm.showColPoliza = false;
        vm.showColDetalles = true;
        vm.colDktp1 = false;
        vm.colDktp2 = false;
      }

      if (radioValue == 3) {
        vm.showColDiasVenc = true;
        vm.showColPoliza = true;
        vm.showColDetalles = false;
        vm.colDktp1 = false;
        vm.colDktp2 = false;
      }

    }

    $scope.exportar = function () {

      _downloadReportFile();
    }

    function _downloadReportFile(){
      var ramo;
      if (vm.formDocPagar.optRadioTap1.toString() == "1") {
        vm.situationType = vm.formDocPagar.Situacion.code;
        ramo = (ng.isUndefined(vm.formDocPagar.Ramo.ramoId) || vm.formDocPagar.Ramo.ramoId === null) ? 0 : vm.formDocPagar.Ramo.ramoId;
      } else if (vm.formDocPagar.optRadioTap1.toString() == "2") {
        vm.situationType = 'PL';
        ramo = 0;
      } else if (vm.formDocPagar.optRadioTap1.toString() == "3") {
        vm.situationType = 'CL';
        ramo = 0;
      }
      const pathParams = {
        codObjeto: localStorage.getItem('codObjeto'),
        opcMenu: localStorage.getItem('currentBreadcrumb')
       };
      const downloadFileBody = {
        'situationCode': vm.situationType,
        'policyNumber': (typeof vm.formDocPagar.mNumPoliza == 'undefined') ? '' : vm.formDocPagar.mNumPoliza,
        'ramo': {
          ramoId: ramo
        },
        'client': {
          documentType: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentType,
          documentNumber: (typeof vm.formDocPagar.Cliente == 'undefined') ? '' : vm.formDocPagar.Cliente.documentNumber
        },
        'RoleType': (typeof vm.dataTicket == 'undefined') ? '' : vm.dataTicket.roleType,
        'agentId': vm.rol.agenteID,
        'managerId': vm.rol.gestorID,
        'UserCode': vm.dataTicket.userCode
      }
      const dataJsonRequest = 'json=' + JSON.stringify(downloadFileBody);
      const urlRequest = constants.system.api.endpoints.gcw + 'api/payment/document/download' +'?COD_OBJETO='+pathParams.codObjeto+'&OPC_MENU='+pathParams.opcMenu;

     httpData.postDownload(
      urlRequest,
      dataJsonRequest,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },responseType: 'arraybuffer'},
      true
    ).then(function(data){
      mainServices.fnDownloadFileBase64(data.file, data.mimeType, data.defaultFileName, true);
    });

    }

    $scope.estadoDocumento = function () {
      if (ng.isUndefined(vm.formDocPagar.Cliente)) {
        mModalAlert.showInfo("Seleccione un cliente para descargar el estado de cuenta", "Cobranzas: Documentos por pagar");
      } else {
        var deferred = $q.defer();
        var documentType = ng.isUndefined(vm.formDocPagar.Cliente.documentType) ? '' : vm.formDocPagar.Cliente.documentType;
        var documentNumber = ng.isUndefined(vm.formDocPagar.Cliente.documentNumber) ? '' : vm.formDocPagar.Cliente.documentNumber;

        var downloadFile2 = {
          documentType: documentType,
          documentNumber: documentNumber,
          agentId: vm.rol.agenteID,
          UserCode: vm.dataTicket.userCode
        };

        var datajson = "json=" + JSON.stringify(downloadFile2);
        mpSpin.start();
        $http({
            method: "POST",
            url: constants.system.api.endpoints.gcw + "api/collection/document/statementAccount/download",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: datajson,
            responseType: 'arraybuffer'
          })
          .then(function (data) {
            // success
            if (data.status == 200) {
              var today = new Date();
              var y = today.getFullYear();
              var m = today.getMonth();
              var d = today.getDate();
              var dateDownload = y.toString() + m.toString() + d.toString();

              var h = today.getHours();
              var m = today.getMinutes();
              var hourDownload = h.toString() + m.toString();

              var defaultFileName = documentType + '_' + documentNumber + '_' + dateDownload + '_' + hourDownload + '.pdf';
              defaultFileName = defaultFileName.replace(/[<>:"/\\|?*]+/g, '_');
              var vtype = data.headers(["content-type"]);
              var file = new Blob([data.data], {
                type: vtype
              });
              mpSpin.end();
              $window.saveAs(file, defaultFileName);
              deferred.resolve(defaultFileName);
            } else {
              mpSpin.end();
              mModalAlert.showError("No se encontraron documentos en la consulta", "Documentos Por Pagar");
            }
          }, function (response) { // optional // failed
            mpSpin.end();
            mModalAlert.showError("No se encontraron documentos en la consulta", "Documentos Por Pagar");
          });
      }
    }

    vm.selectDoc = selectDoc;
    function selectDoc(index, val) {
      vm.showEmailBtn = val;
      vm.docs[index].selected = val;

      for (var i = 0; i < vm.docs.length; i++) {
        if (vm.docs[i].selected) {
          vm.docsChecked = true;
          vm.mCheckAll = false;
          vm.mCheckAllValue = false;
          break;
        } else {
          vm.docsChecked = false;
        }
      }

      if (!vm.docsChecked) {
        vm.showEmailBtn = false;
        vm.showSelectAll = false;
        vm.mCheckAll = false;
        vm.mCheckAllValue = false;
      }
    }

    vm.showCheckAndButton = showCheckAndButton;
    function showCheckAndButton() {
      return true;
    }

    vm.selectAll = selectAll;
    function selectAll(val) {
      vm.showEmailBtn = val;
      vm.showSelectAll = val;
      vm.mCheckAllValue = val;

      for (var i = 0; i < vm.docs.length; i++) {
        vm.docs[i].selected = val;
      }
    }

    function showModalEnvioMail() {
      for (var i = 0; i < vm.docs.length; i++) {
        if (vm.docs[i].selected) {
          vm.paramsDocsPorPagar.push(vm.docs[i]);
        }
      }
    }

    vm.modalEnvioMail = modalEnvioMail;
    function modalEnvioMail() {
      vm.paramsDocsPorPagar = [];
      vm.listItemsDocsPorPagar = [];
      showModalEnvioMail();
      //Modal
      if (vm.paramsDocsPorPagar.length > 0) {

        ng.forEach(vm.docs, function (item, key) {
          if (vm.docs[key].selected) {
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
      } else {
        mModalAlert.showInfo("Debe elegir por lo menos un documento.", "Advertencia");
      }
    }

    vm.openModalGeneratedPaymentLink = openModalGeneratedPaymentLink;
    function openModalGeneratedPaymentLink(policy, receipt) {

      const modalController = ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {

        $scope.policy = Object.assign({}, policy);
        $scope.receipt = Object.assign({}, receipt);
        $scope.isLinkCopied = false;
        $scope.isEmailEnabled = true;
        $scope.linkData = getLinkData(!$scope.policy.accessActive);
        $scope.paymentLink = { url: '' };

        $scope.closeModal = function (event) {
          preventEvent(event);

          $uibModalInstance.close();
        }

        $scope.sendEmail = function (event) {
          preventEvent(event);

          vm.sendLinkByEmail($scope.receipt, 'payment').then(function (response) {
            if (response === 'cancel') {
              return;
            }

            $scope.isEmailEnabled = false;

            var tickAnchorEl = document.querySelector('.container');
            setTimeout(function() { tickAnchorEl.click(); });
          });
        }

        $scope.copyUrl = function (event) {
          preventEvent(event);

          if ($scope.paymentLink.url) {
            return;
          }

          copyLinkPayment($scope.receipt).then(function(response) {
            if (!response) {
              return;
            }

            $scope.paymentLink.url = response;
          });
        }

        $scope.accept = function (event) {
          $uibModalInstance.close();
        }

        function getLinkData(showEmailField) {
          const withEmailInfo = {
            title: 'Enlace de pago generado',
            subtitle: 'Ahora puedes copiar o enviar por correo el enlace de pago al cliente'
          };

          const withoutEmailInfo = {
            title: 'Enlace y correo de pago generado',
            subtitle: 'Hemos enviado un correo con el enlace de pago al cliente'
          };

          return showEmailField ? withEmailInfo : withoutEmailInfo;
        }
      }];

      const modalConfig = {
        backdrop: 'static',
        backdropClick: false,
        keyboard: false,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: [
          '/gcw/app/components/cobranzas/documentos-pagar',
          'modal-generated-payment-link/modal-generated-payment-link.html'
        ].join('/'),
        controller: modalController
      }

      $uibModal.open(modalConfig);
    }

    vm.openManageNotifications = openManageNotifications;
    function openManageNotifications() {

      const modalController = ['$scope', '$uibModalInstance', function (scope, $uibModalInstance) {
        $scope.notification = {};

        loadData();

        $scope.closeModal = function (event) {
          preventEvent(event);

          $uibModalInstance.close();
        }

        $scope.changeCutoffDate = function (selectedCuoffDateId) {
          $scope.notification.selectedCuoffDate = $scope.notification.cutoffDates.find(function (cd) {
            return +cd.idConfig === +selectedCuoffDateId;
          });
        }

        $scope.updateNotification = function (event) {
          var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          var receiverTest = emailRegex.test($scope.notification.receiver);
          var carbonCopyEmailTest = emailRegex.test($scope.notification.carbonCopyEmail);

          if (!receiverTest || !carbonCopyEmailTest) {
            return mModalAlert.showError('Error en formato de correos.', '');

            return;
          }

          preventEvent(event);

          var selectedCuoffDate = $scope.notification.selectedCuoffDate
            ? $scope.notification.selectedCuoffDate
            : $scope.notification.cutoffDates.find(function (cd) {
              return +cd.idConfig === +$scope.notification.selectedCuoffDateId;
            });

          var httpPayload = {
            correo: $scope.notification.receiver.toLowerCase(),
            copia: $scope.notification.carbonCopyEmail.toLowerCase(),
            fechaCorteId: selectedCuoffDate.idConfig,
            fechaCorteDescripcion: selectedCuoffDate.descripcion
          };

          updateNotificationContent(httpPayload)
          .then(function (response) {
            if (response.data.operationCode !== 200) {
              throw new Error('Error en actualizar configuración de notificaciones');

              return;
            }

            return mModalAlert.showSuccess('Configuración de notificaciones actualizada!!', '');
          })
          .catch(function () {
            return mModalAlert.showError('Error en actualizar configuración de notificaciones', '');
          });
        }

        function loadData() {
          Promise.all([getNotificationContent(), vm.loadCutoffDates()]).then(function (responses) {
            var data = responses[0].data;
            $scope.notification.cutoffDates = responses[1];

            $scope.notification.receiver = data.correo;
            $scope.notification.carbonCopyEmail = data.copia;
            $scope.notification.selectedCuoffDateId = data.fechaCorteId;
          });
        }
      }];

      const modalConfig = {
        backdrop: 'static',
        backdropClick: false,
        keyboard: false,
        dialogFade: false,
        keyboard: true,
        scope: $scope,
        size: 'lg',
        windowTopClass: 'modal--lg fade',
        templateUrl: [
          '/gcw/app/components/cobranzas/documentos-pagar',
          'modal-manage-notifications/modal-manage-notifications.html'
        ].join('/'),
        controller: modalController
      }

      $uibModal.open(modalConfig);
    }

    vm.evaluatePaidFiltersDates = evaluatePaidFiltersDates;
    function evaluatePaidFiltersDates(startDate, endDate) {
      if (vm.formDocPagar.Situacion.code !== 'PAG') {
        return { addToParams: false, passed: true };
      }

      var daysDifference = calculateDaysDifference(startDate, endDate);

      if (daysDifference < 0) {
        mModalAlert.showError('La fecha HASTA debe ser mayor a la fecha DESDE', '');

        return { addToParams: false, passed: false };
      }

      if (daysDifference > 180) {
        mModalAlert.showError('El rango de fecha no puede exceder los 6 meses', '');

        return { addToParams: false, passed: false };
      }

      return { addToParams: true, passed: true };
    }

    function preventEvent(event) {
      if (!event) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    }

    function getGroupedRegisteredLogs(logs) {
      var registeredLogsMap = logs.reduce(function (acc, curr) {
        var monthYearKey = getMonthYearKey(curr);
        var currentItem = acc[monthYearKey.selector];
        var dateHourReg = monthYearKey.formattedTime.split(' ');
        var formattedCurr = Object.assign({}, curr, { dateReg: dateHourReg[0], hourReg: dateHourReg[1] });
    
        var itemToAdd = currentItem ? addValue(currentItem.logs, formattedCurr, monthYearKey) : getNewValue(formattedCurr, monthYearKey);
    
        var updatedAcc = {};
        updatedAcc[monthYearKey.selector] = itemToAdd;
        updatedAcc = Object.assign({}, acc, updatedAcc);
        return updatedAcc;
      }, {});

      var registeredLogsValues = Object.values(registeredLogsMap).map(function (groupedLog) {
        var orderedLogs = groupedLog.logs.slice().sort(function(a, b) {
          return a.formattedTime > b.formattedTime ? -1 : a.formattedTime === b.formattedTime ? 0 : 1;
        });

        return Object.assign({}, groupedLog, { orderedLogs: orderedLogs });
      });

      return registeredLogsValues.slice().sort(function(a, b) {
        return a.selector > b.selector ? -1 : a.selector === b.selector ? 0 : 1;
      });
    }
    
    function getNewValue(log, keyInfo) {
      return Object.assign({}, keyInfo, {
        logs: [Object.assign({}, log, { formattedTime: keyInfo.formattedTime })]
      });
    }
    
    function addValue(logs, newLog, keyInfo) {
      return Object.assign({}, keyInfo, {
        logs: logs.concat([Object.assign({}, newLog, { formattedTime: keyInfo.formattedTime })])
      });
    }
    
    function getMonthYearKey(bit) {
      var dateList = getFormattedDateList(bit.fecReg);
      var day = dateList[0];
      var month = dateList[1];
      var year = dateList[2];
      var hour = dateList[3];
      var min = dateList[4];
  
      var formattedTime = day + "/" + month + "/" + year + " " + hour + ":" + min;
      return {
          selector: year + "/" + month,
          title: vm.months[+month - 1] + " " + year + " - Mes " + month + "/12",
          formattedTime: formattedTime
      };
    }

    function getFormattedDateList(date) {
      return date.split(/ |\/|:/).map(function(d) {
          return d.length === 1 ? '0' + d : d;
      });
    }
    
    function getRegisteredLogsViewProperties() {
      return [
        {
          chipText: 'Reprogramar',
          showSchedulingDate: true,
          iconPath: '/images/calendar/calendar_002.svg',
          mainColor: 'yellow',
          userText: 'se contactó con el cliente'
        },
        {
          chipText: 'Compromiso de pago',
          showSchedulingDate: true,
          iconPath: '/images/success/success_001.svg',
          mainColor: 'green',
          userText: 'se contactó con el cliente'
        },
        {
          chipText: 'Solicitud de anulación',
          showSchedulingDate: true,
          iconPath: '/images/success/success_001.svg',
          mainColor: 'green',
          userText: 'se contactó con el cliente'
        },
        {
          chipText: 'Recibo Pagado',
          showSchedulingDate: false,
          iconPath: '/images/success/success_001.svg',
          mainColor: 'green',
          userText: 'se contactó con el cliente'
        },
        {
          chipText: 'Anulación por reemplazo',
          showSchedulingDate: true,
          iconPath: '/images/success/success_001.svg',
          mainColor: 'green',
          userText: 'se contactó con el cliente'
        },
        {
          chipText: 'No contesta nunca',
          showSchedulingDate: false,
          iconPath: '/images/alert/alert_001.svg',
          mainColor: 'orange',
          userText: 'no logró contactar con el cliente'
        },
        {
          chipText: 'Buzón apagado',
          showSchedulingDate: false,
          iconPath: '/images/alert/alert_001.svg',
          mainColor: 'orange',
          userText: 'no logró contactar con el cliente'
        },
        {
          chipText: 'Teléfono no existe',
          showSchedulingDate: false,
          iconPath: '/images/alert/alert_001.svg',
          mainColor: 'orange',
          userText: 'no logró contactar con el cliente'
        },
        {
          chipText: 'No le pertenece el número',
          showSchedulingDate: false,
          iconPath: '/images/alert/alert_001.svg',
          mainColor: 'orange',
          userText: 'no logró contactar con el cliente'
        }
      ];
    }

    function calculateDaysDifference(firstDate, secondDate) {
      var millisecondsDifference = secondDate.getTime() - firstDate.getTime();
      return Math.ceil(millisecondsDifference / (1000 * 60 * 60 * 24));
    }

    function resetPaidFilterDates() {
      vm.paidFilterDates = {
        start: new Date(new Date().setDate(new Date().getDate() - 90)),
        end: new Date()
      }
    }

    function getCorrectDate(ddmmaaaaDate) {
      var parts = ddmmaaaaDate.split('/');

      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    function getVisibleCorrectDate(date) {
      var dateParts = getFormattedDateList(date.toLocaleDateString());

      var day = dateParts[0];
      var month = dateParts[1];
      var year = dateParts[2];

      return day + '/' + month + '/' + year;
    }

    function getListDocumentPayment(filter) {
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/document/paging/group',
        filter, undefined, true
      );
    }

    function getCoordinationTypes() {
      return httpData['get'](
        constants.system.api.endpoints.gcw + 'api/lookup/bitacora/tipoCoordinacion',
        undefined, undefined, true
      );
    }

    function getCutoffDates() {
      return httpData['get'](
        constants.system.api.endpoints.gcw + 'api/payment/listFechasCorte',
        undefined, undefined, true
      );
    }

    function registerContact(requestBody) {
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/bitacora/add',
        requestBody, undefined, true
      );
    }

    function getRegisteredLogs(requestBody) {
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/document/bitacora',
        requestBody, undefined, true
      );
    }

    function getLinkAfiliacion(tokenAffiliationRq) {
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/linkAfiliacion',
        tokenAffiliationRq, undefined, true
      );
    }

    function getSendLinkAfiliacion(tokenAffiliationRq) {
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/sendLinkAfiliacion',
        tokenAffiliationRq, undefined, true
      );
    }

    function getLinkPago(tokenPaymentRq){
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/linkPago',
        tokenPaymentRq, undefined, true
      );
    }

    function getSendLinkPago(tokenPaymentRq){
      return httpData['post'](
        constants.system.api.endpoints.gcw + 'api/payment/sendLinkPago',
        tokenPaymentRq, undefined, true
      );
    }

    function getNotificationContent() {
      return httpData['get'](
        constants.system.api.endpoints.gcw + 'api/payment/notification',
        undefined, undefined, true
      );
    }

    function updateNotificationContent(payload) {
      return httpData['put'](
        constants.system.api.endpoints.gcw + 'api/payment/notification',
        payload, undefined, true
      )
    }


  } // end controller

  return ng.module('appGcw')
    .controller('DocumentosPagarController', DocumentosPagarController)
    .component('gcwDocumentosPagar', {
      templateUrl: '/gcw/app/components/cobranzas/documentos-pagar/documentos-pagar.html',
      controller: 'DocumentosPagarController',
      controllerAs: 'vm',
      bindings: {}
    });
});