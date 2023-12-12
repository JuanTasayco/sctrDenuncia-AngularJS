(function($root, deps, action) {
  define(deps, action);
})(this, ["angular", "constants", "mpfPersonConstants", "/polizas/app/autos/autosEmitirUsado/component/groupPolize/groupPolize.js"], function(
  angular,
  constants,
  personConstants
) {
  angular.module("appAutos").controller("carEmitPolizeData", [
    "$scope",
    "$window",
    "$state",
    "emitFactory",
    "carColors",
    "mpSpin",
    "mModalAlert",
    "oimPrincipal",
    'mainServices',
    'proxyListaNegra',
    'mModalConfirm',
    function($scope, $window, $state, emitFactory, carColors, mpSpin, mModalAlert, oimPrincipal, mainServices, proxyListaNegra, mModalConfirm) {
      $scope.showEt = function() {
        $scope.formData.mPlaca = $scope.formData.enTramite ? "E/T" : $scope.formData.mPlaca;
      };

      function settingsVigencia() {
        $scope.today = function() {
          $scope.formData.dt = new Date();
        };
        $scope.today();

        $scope.dateOptions = {
          dateDisabled: function(data) {
            var date = data.date;
            var _today = new Date();
            _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
            return date < _today;
          },
          formatYear: "yy",
          minDate: new Date(),
          startingDay: 1
        };

        console.log("Llega data carEmitPolizeData: ", $scope);

        $scope.dateOptions2 = {
          dateDisabled: function(data) {
            var date = data.date;
            var _today = new Date();
            _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
            return date < _today;
          },
          formatYear: "yy",
          minDate: new Date(),
          startingDay: 1
        };

        $scope.$watch("formData.dt", function(nv) {
          $scope.dateOptions2.minDate = $scope.formData.dt;
          $scope.dateOptions2.initDate = $scope.formData.dt;
        });


        $scope.open1 = function() {
          $scope.popup1.opened = true;
        };

        $scope.open2 = function() {
          $scope.popup2.opened = true;
        };

        $scope.setDate = function(year, month, day) {
          $scope.dt = new Date(year, month, day);
        };

        $scope.format = constants.formats.dateFormat;
        $scope.altInputFormats = ["M!/d!/yyyy"];

        $scope.popup1 = {
          opened: false
        };

        $scope.popup2 = {
          opened: false
        };
      }

      (function load() {
        settingsVigencia();
        $scope.quotation = $scope.quotation || {};
        $scope.showVigencia = true;
        $scope.formData = $scope.formData || {};
        
        if (angular.isUndefined($scope.formData.correspondenciaFlag)) $scope.formData.correspondenciaFlag = true;
        if (angular.isUndefined($scope.formData.aseguradoFlag)) $scope.formData.aseguradoFlag = true;
        
        var grupoPoliza = null;
        if ($scope.quotation.polizaB && $scope.quotation.polizaB.numeroPoliza)
          grupoPoliza = {
            groupPolize: $scope.quotation.polizaB.numeroPoliza,
            groupPolizeDescription: $scope.quotation.polizaB.nombrePolizaGrupo,
            showGroupPolize: true
          };
        $scope.changeDate = function() {
          $scope.formData.grupoPoliza = $scope.formData.grupoPoliza || grupoPoliza || { grupoPoliza: "" };
          if ($scope.quotation.mcaVigencia !== 'S') {
            $scope.formData.finVigencia = new Date(new Date($scope.diffencesDate + $scope.formData.dt.getTime()));
            var _today = new Date();
            _today = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate());
            var ini = $scope.formData.dt;
            if (angular.isDate(ini)) {
              if (
                $scope.showVigencia &&
                !($scope.quotation.tipoProducto != "PLURIANUAL" && oimPrincipal.get_role() == "BANSEG")
              ) {
                var anual = $scope.quotation.flagAnual == 1 ? 1 : 2;
                $scope.formData.finVigencia = new Date(ini.getFullYear() + anual, ini.getMonth(), ini.getDate());
              }
            } else {
              $scope.showVigencia = false;
            }
          }
        };

        $scope.$watch("formData.dt", function() {
          $scope.changeDate();
          
          if ($scope.quotation.mcaVigencia === 'S' && $scope.formData.dt) {
            $scope.formData.finVigencia = mainServices.date.fnAdd($scope.formData.dt, $scope.quotation.vigenciaMeses , 'M');
          }
        });

        $scope.changeDate();

        $scope.formData.codigoProducto = $scope.quotation.codigoProducto;
        isRC();
        $scope.showEt();

        if ($scope.quotation) {
          if ($scope.quotation.tipoProducto != "PLURIANUAL" || oimPrincipal.get_role() == "BANSEG") {
            if ($scope.quotation.vehiculo.fechaInicioVigenciaCot && $scope.quotation.vehiculo.fechaFinVigenciaCot) {
              var dateParts = $scope.quotation.vehiculo.fechaInicioVigenciaCot.split("/");
              $scope.formData.dt = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

              dateParts = $scope.quotation.vehiculo.fechaFinVigenciaCot.split("/");
              $scope.formData.finVigencia = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

              $scope.formData.mNroSolic = $scope.quotation.numeroSolicitud;
              $scope.formData.mPrimaPactada = $scope.quotation.primaPactada;

              $scope.diffencesDate = $scope.formData.finVigencia - $scope.formData.dt;
            }
          }
        }

        var profile = JSON.parse(window.localStorage.getItem('profile'));
        $scope.esEjecutivo = !profile.isAgent && profile.userSubType === "1";
        $scope.esAgente = profile.isAgent && profile.userSubType === "1";
        $scope.esCorredor = profile.userSubType === "3";
      })();

      function isRC() {
        $scope.formData.esRC = $scope.quotation.tipoProducto === "RC" ? true : false;
      }

      $scope.isTramit = function() {
        return $scope.formData.enTramite == true;
      };
      $scope.isValidForm = function() {
        $scope.frmPoliData.markAsPristine();
        if ($scope.formData.enTramite) {
          return (
            $scope.frmPoliData.nNumeroChasis.$valid &&
            $scope.frmPoliData.nNumeroMotor.$valid &&
            $scope.frmPoliData.nColor.$valid &&
            $scope.showVigencia &&
            $scope.formData.selectedAgent !== null &&
            $scope.formData.selectedAgent !== undefined &&
            $scope.frmAgent.$valid
          );
        } else {
          return (
            $scope.frmPoliData.$valid &&
            $scope.showVigencia &&
            $scope.formData.selectedAgent !== null &&
            $scope.formData.selectedAgent !== undefined &&
            $scope.frmAgent.$valid
          );
        }
      };

      $scope.formData.isDirtyCar = true;

      $scope.colors = carColors.data;

      $scope.$on("changingStep", function(ib, e) {
        var isToNext = e.step == 2 || e.step == 3;
        e.cancel = isToNext && $scope.next();
      });

      $scope.next = function() {
        $scope.formData.step1$Valid = $scope.isValidForm();
        if (!$scope.formData.step1$Valid || $scope.formData.finVigencia < $scope.formData.dt) {
          return true;
        }
        $scope.formData.step1$Valid = true;
		$scope.formData.mPlaca = $scope.formData.mPlaca && $scope.formData.mPlaca.toUpperCase();
		$scope.formData.mNumeroChasis = $scope.formData.mNumeroChasis && $scope.formData.mNumeroChasis.toUpperCase();
		$scope.formData.mNumeroMotor = $scope.formData.mNumeroMotor && $scope.formData.mNumeroMotor.toUpperCase();

		if(seValidaListaNegra()) {
			validarListNegra();
		} else {
			irAPaso2();
		}

        return true;
      };

      $scope.showVigenciaROL = function() {
        if ($scope.quotation) {
          if ($scope.quotation.tipoProducto == "PLURIANUAL") {
            return false;
          } else {
            return oimPrincipal.get_role() == "BANSEG";
          }
        }
      };

      function irAPaso2() {
        $window.setTimeout(function() {
            if ($scope.formData.isDirtyCar) {
              $scope.formData.isDirtyCar = false;
              $state.go("newEmit.steps", { step: 2 });
            }
        });
      }

      function seValidaListaNegra() {
        return ($scope.esEjecutivo || $scope.esAgente || $scope.esCorredor);
      }

      function validarListNegra() {
        var reqLN = [
          { "tipo": "NUM_MATRICULA", "valor": $scope.formData.mPlaca },
          { "tipo": "NUM_MOTOR", "valor": $scope.formData.mNumeroMotor },
          { "tipo": "NUM_SERIE", "valor": $scope.formData.mNumeroChasis }
        ];

        proxyListaNegra.ConsultaListaNegra(reqLN, true).then(function(response) {
          var datosLN = [];
          
          if(response.OperationCode === constants.operationCode.success) {
            var msg = "";

            response.Data.forEach(function(element) {
              if(element.Resultado) {
                var elemetLN = {
                  codAplicacion: personConstants.aplications.AUTOS,
                  numCotizacion: $scope.quotation.numeroDocumento,
                  tipoDato: element.Tipo,
                  valorDato: element.Valor
                };

                datosLN.push(elemetLN);
                var msgComun = "est&aacute; en la tabla de Cliente/Unidad inelegible por estudios t&eacute;cnicos.";
                switch(element.Tipo) {
                  case "NUM_MATRICULA": { msg += "El n&uacute;mero placa " + msgComun +"<br/>"; }; break;
                  case "NUM_MOTOR": { msg += "El n&uacute;mero motor " + msgComun +"<br/>"; }; break;
                  case "NUM_SERIE": { msg += "El n&uacute;mero chasis " + msgComun +"<br/>"; }; break;
                  default: "";
                }
              }
            });

            if(msg === "") {
              irAPaso2();
            } else {
              var fullMsg = msg;

              if($scope.esEjecutivo) {
                bloquearListaNegra(fullMsg);
              } else {
                confirmarListaNegra(datosLN);
              }
            }
          }
        });
      }

      function bloquearListaNegra(fullMsg) {
        mModalAlert.showError(fullMsg, 'Error');
      }

      function confirmarListaNegra(datosLN) {
        mModalConfirm.confirmError('Cliente/Unidad inelegible por estudios t&eacute;cnicos, la emisi&oacute;n estar&aacute; supedita a revisi&oacute;n.<br/><br/>&iquest;DESEA CONTINUAR CON LA EMISI&Oacute;N?', '', 'SI', undefined, 'NO')
        .then(function(ok) {
            if(ok) {
              datosLN.forEach(function(element) {
                element.aceptaAdvertencia = true;
                proxyListaNegra.GuardarAuditoria(element).then();  
              });

              irAPaso2();
            } 
        });
      }
    }
  ]);
});
