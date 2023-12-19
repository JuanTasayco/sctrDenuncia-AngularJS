(function($root, deps, action){
  define(deps, action)
})(this, ['angular'
, 'constants'
, 'helper'
, 'lodash'
, 'seguridadFactory'
],
  function(
    ng
    , constants
    , helper
    , _
    ){

    var appSecurity = ng.module('appSecurity');

    appSecurity.controller('dashboardController', [
      '$scope'
      , '$window'
      , '$state'
      , '$timeout'
      , '$filter'
      , 'mainServices'
      , '$uibModal'
      , 'mModalAlert'
      , 'mModalConfirm'
      , 'MxPaginador'
      , '$http'
      , 'seguridadFactory'
      , function(
        $scope
        , $window
        , $state
        , $timeout
        , $filter
        , mainServices
        , $uibModal
        , mModalAlert
        , mModalConfirm
        , MxPaginador
        , $http
        , seguridadFactory
        ){
          var page;

          function bindLookups(){
              
            //tipos de usuario
            seguridadFactory.getGroupTypes().then(function(response){
              $scope.tipoUsuarioData = response.data || response.Data;
            });

            //tipo de ordenamiento
            seguridadFactory.getSortingTypes().then(function(response){
              $scope.ordenarPorData = response.data || response.Data;
            });

            //acciones
            seguridadFactory.getDashboardActions().then(function(response){
              $scope.accionesData = response.data || response.Data;
            });

            //cargos
            seguridadFactory.getCharges().then(function(response){
              $scope.cargosData = response.data || response.Data;
            });

            //estado de usuario
            seguridadFactory.getUserStatus().then(function(response){
              $scope.userStatusData = response.data || response.Data;
            });

            //grupo de usuarios para administrador externo
            //TODO determinar como asignar el grupo de usuario en listado de dashboard
            seguridadFactory.getGroupTypes().then(function(response){
              $scope.grupoData = response.data || response.Data;
            });

          }

          function _initData(){

            // $scope.dashboardData = $scope.dashboardData || [];
            $scope.dashboardData = [];
            $scope.showDates = false;
            $scope.status = {
              isopen: false
            };

            //rango fechas
            var pms5 = seguridadFactory.getDismaSearchParams();
            pms5.then(function(response){
              $scope.frmData.rangoFechaData = response.data || response.Data;
              $scope.frmData.rangoFechaData.splice(3, 1)
              // $scope.arrayRango = $scope.frmData.rangoFechaData;
              ng.forEach($scope.frmData.rangoFechaData, function(item){
                item.selected = false;
                if(item.codigo === $scope.frmData.rango){
                  item.selected = true;
                }
              });

              $scope.frmData.rangeDates = {codigo: 4, descripcion: 'Rango de fecha', selected: false};
              ng.forEach($scope.frmData.rangoFechaData, function(item){
                if(item.selected == true){
                  $scope.frmData.itemSelected = item;
                }
              })
              $scope.frmData.optionSelected = $scope.frmData.itemSelected;
            });                                                       

            $scope.fnItemSelected = _fnItemSelected;
            function _fnItemSelected(i){
              $scope.frmData.optionSelected = i;
              $scope.showDates = false;
              $scope.status = {
                isopen: false
              };
            }

            $scope.format = constants.formats.dateFormat;
            $scope.format2 = 'dd/MM/yy';
            $scope.FORMAT_MASK = constants.formats.dateFormatMask;
            $scope.FORMAT_PATTERN = constants.formats.dateFormatRegex;
            $scope.ALT_INPUT_FORMATS = ['d!/M!/yyyy'];
            $scope.frmData.mFechaDesde = '';
            $scope.frmData.mFechaHasta = '';

            $scope.fnFilterDate = $filter('date');

            $scope.firstLoad = true;            

            //Mensaje de resultados vacios por pestaña. 
            //Subtotal de cada pestaña (Habilitados, Dehabilitados, Sin confirma, Caducado)
            $scope.noResultsHabilitados = false;
            $scope.noResultsDeshabilitados = false;
            $scope.noResultsSinConfirmar = false;
            $scope.noResultsCaducado = false;

            $scope.mBuscarIDNombre = $scope.mBuscarIDNombre || "";

            $scope.params = {};

            //Paginador
            // items a mostrar por pagina. Por defecto es 10
            // este campo lo utilizaremos también como input del uib-pagination
            $scope.itemsXPagina = 10;
            $scope.itemsXTanda = $scope.itemsXPagina * 4;
            $scope.msgVacio = 'No hay resultados para la búsqueda realizada.<br/>Intenta nuevamente';
            page = new MxPaginador();
            page.setNroItemsPorPagina($scope.itemsXPagina);
          } //end initData    

          $scope.$watch('frmData.mFechaDesde', function(){
            if($scope.showDates){
              if($scope.frmData.mFechaDesde != ""){
                $scope.status.isopen = ($scope.frmData.mFechaHasta == "") ? true : false
              }else{
                $scope.status.isopen = false;
              }
            }else{
              $scope.status = {
                isopen: false
              }
            }
          });

          $scope.$watch('frmData.mFechaHasta', function(){
            if($scope.showDates){
              if($scope.frmData.mFechaHasta != ""){
                if($scope.frmData.mFechaDesde != ""){
                  var myEl = ng.element(document.querySelector('#movesMenu'));
                  myEl.removeAttr('auto-close')  
                  myEl.removeAttr('is-open')
                  myEl.attr('auto-close', "outsideClick")
                  $scope.status.isopen = false;
                  myEl.attr('is-open', !$scope.status.isopen)
                }else{
                  $scope.status.isopen = true;
                }
              }else{
                $scope.status.isopen = true;
              }
            }else{
              $scope.status = {
                isopen: false
              }
            }
          });       

          function _initProfile(){
            //tyeUser == 1 -> Ejecutivo Mapfre
            var profile = seguridadFactory.getVarLS("profile");
            var evoProfile = seguridadFactory.getVarLS("evoProfile");
            var userType = profile.typeUser;
            //$scope.userType = 2;

            /*--------------------------------------
            El grupo de usuario (Administrador o Regular) debera determinarse desde login
            La info obtenida tendra q mantenerse en LocalStorage para luego destruirse
            cerrando navegador o haciendo logout
            ----------------------------------------*/
            if(userType != 1){ //si es usuario externo
              //TODO condicionar el grupo de usuario
              $scope.userDisma = false;
              $scope.adminExt = {
                numPerson: evoProfile.companyId
                , name: profile.name
                , typePerson: profile.typeUser // typePerson??
                , codeStatus: 1
                , userRegister: profile.username
                , numDoc: evoProfile.documentNumber
              }              
              // $scope.grupoUsuario == 2 // Usuario Administrador
              //$scope.grupoUsuario == 1 // Usuario Externo
            }else $scope.userDisma = true;
          }

          (function onLoad(){

            $scope.firstLoad = true;
            $scope.btnSearch = false;

            //inicializa variables y funciones
            $scope.frmData = {};
            $scope.frmData = {
              optionSelected: {},
              mTipoUsuario: {},
              rangoFechaData: {},
              rangeDates: {}
            };
            var pms = seguridadFactory.getDetailsConfig();
            pms.then(function(response){
              var data = response.data || response.Data;
              $scope.frmData.rango = data.numRangoFechaDashboard;
            });  
            bindLookups();
            // $scope.frmData.optionSelected.codigo = $scope.frmData.optionSelected.codigo || 3;
            $scope.frmData.mTipoUsuario.codigo = $scope.frmData.mTipoUsuario.codigo || 0;

              $timeout(function(){
                var profile = seguridadFactory.getVarLS("profile");
                var userType = profile.typeUser;
                if(userType == 3){
                  $window.location.href = '/security/#/secciones/usuarios'
                }
                _initData();
              }, 500);
              _initProfile();

            $scope.panelActv = 0; //Panel Movimientos activo por defecto 
            $timeout(function(){
              getDashboardData(0);
            } ,500);

          })(); //end onLoad        

          $scope.fnSetUserType = _fnSetUserType;
          function _fnSetUserType(val){
            $scope.userType = val;
          }

          $scope.fnLimpiar = _fnLimpiar;
          $scope.fnReenviarEnlace = _fnReenviarEnlace;
          $scope.fnAnularUsuario = _fnAnularUsuario;

          //Filtros, paginacion y listado
          $scope.getDashboardData = getDashboardData;
          $scope.fnOrdenarPor = _fnOrdenarPor;          
          $scope.pageChanged = pageChanged;
          $scope.fnChangeDateStart = _fnChangeDateStart;

          //ver detalle
          $scope.fnVerDetalle = _fnVerDetalle;

          // Click outside
          $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
          };    
          // $scope.status.autoClose = (!$scope.status.isopen) ? 'disabled' : 'outsideClick'

          /*--------------------------------------
          Restablecer tabs a Movimientos
          ----------------------------------------*/      
          function backMoves(val){
            var state = (ng.isUndefined(val) || val == 0) ? 0 : val;
            var panels = document.getElementsByClassName('slide-content');
            var i = 0;
            ng.forEach(panels, function(item){
              if(i == state){
                panels[i].classList.add('show');
                panels[i].classList.add('active');
              }else{
                panels[i].classList.remove('show');
                panels[i].classList.remove('active');                
              }
              i++
            })
          }

          /*--------------------------------------
          Limpiar
          ----------------------------------------*/
          function _fnLimpiar(){

            backMoves();
            $scope.firstLoad = true;
            
            //fechas 
            $scope.frmData.optionSelected = $scope.frmData.itemSelected;

            $scope.showDates = false;
            $scope.frmData.mFechaDesde = undefined;
            $scope.frmData.mFechaHasta = undefined;

            //input buscador
            $scope.mBuscarIDNombre = "";

            //tipo usuario
            $scope.frmData.mTipoUsuario.codigo = 0

            //ordenar
            // TODO el filtro de ordenamiento deberá corregirlo maqueta
            $scope.mOrdenarPor.codigo = null;

            $scope.params = {};
            $scope.dashboardData = [];
            $scope.totalHabilitado = 0;  
            $scope.totalSinConfirmar = 0;  
            $scope.totalCaducado = 0;  
            $scope.totalDeshabilitado = 0;
            $scope.totalMovimientos = 0;  

            $scope.panelActv = 0;
            getDashboardData(0);

          }

          /*--------------------------------------
          build params
          ----------------------------------------*/
          function _buildParamsSearch(val){
            var params = {};
            var userStatus = (val == -1) ? 0 : val
            if($scope.firstLoad){
              params.SearchParameter = $scope.frmData.rango;
              params.StartDate = (!$scope.showDates) ? "" : $scope.fnFilterDate($scope.frmData.mFechaDesde, $scope.format)
              params.EndDate = (!$scope.showDates) ? "" : $scope.fnFilterDate($scope.frmData.mFechaHasta, $scope.format)
              // params.SearchValue = $scope.mBuscarIDNombre;
              if($scope.userDisma) params.UserType = (ng.isUndefined($scope.params.UserType)) ? 0 : $scope.params.UserType;
              else params.CompanyNumber = $scope.adminExt.numPerson;              
            }else{
              params.SearchParameter = (!$scope.showDates) ? $scope.frmData.optionSelected.codigo : 4;
              params.StartDate = (!$scope.showDates) ? "" : $scope.fnFilterDate($scope.frmData.mFechaDesde, $scope.format)
              params.EndDate = (!$scope.showDates) ? "" : $scope.fnFilterDate($scope.frmData.mFechaHasta, $scope.format)
              // params.SearchValue = (ng.isUndefined($scope.params.SearchValue) || $scope.params.SearchValue == "") ? "" : $scope.params.SearchValue;
              if($scope.userDisma) params.UserType = $scope.frmData.mTipoUsuario.codigo
              else params.CompanyNumber = $scope.adminExt.numPerson              
            }
            params.SearchValue = $scope.mBuscarIDNombre
            // if(val == -1){
            //   var val = 0;
            //   var params = _buildParamsSearch(val)
            //   // params.SearchParameter = (!$scope.showDates) ? $scope.frmData.optionSelected.codigo : 4
            //   params.SearchParameter = (!$scope.showDates) ? $scope.frmData.rangoFechaData : 4
            //   params.StartDate = ($scope.showDates) ? $scope.fnFilterDate($scope.frmData.mFechaDesde, $scope.format) : ""
            //   params.EndDate = ($scope.showDates) ? $scope.fnFilterDate($scope.frmData.mFechaHasta, $scope.format) : ""
            //   params.SearchValue = $scope.mBuscarIDNombre;
            //   if($scope.userDisma) params.UserType = $scope.frmData.mTipoUsuario.codigo
            //   else params.CompanyNumber = $scope.adminExt.numPerson
            // }else{
            //   var params = {};
            //   params.SearchParameter = ($scope.firstLoad) ? $scope.frmData.rango : $scope.params.SearchParameter;
            //   params.StartDate = (ng.isUndefined($scope.params.StartDate)) ? "" : $scope.params.StartDate;
            //   params.EndDate = (ng.isUndefined($scope.params.EndDate)) ? "" : $scope.params.EndDate;
            //   params.SearchValue = (ng.isUndefined($scope.params.SearchValue) || $scope.params.SearchValue == "") ? "" : $scope.params.SearchValue;
            //   if($scope.userDisma) params.UserType = (ng.isUndefined($scope.params.UserType)) ? 0 : $scope.params.UserType;
            //   else params.CompanyNumber = $scope.adminExt.numPerson;
            // }
            // params.UserStatus = val; // tab id
            params.UserStatus = userStatus; // tab id
            params.PageNum = $scope.currentPage;
            params.PageSize = $scope.itemsXPagina;
            params.SortingType = (ng.isUndefined($scope.mOrdenarPor) || $scope.mOrdenarPor.codigo == null) ? 0 : $scope.mOrdenarPor.codigo;
            return params;
          }

          /*--------------------------------------
          obtener Data
          ----------------------------------------*/
          function getDashboardData(val){
            $scope.dashboarData = []
            $scope.currentPage = 1;
            // $scope.btnSearch = (val == -1) ? true : false;
            $scope.state = (ng.isUndefined(parseInt($scope.activePanel)) || val == -1) ? 0 : val;
            $scope.params = _buildParamsSearch(val)
            page.setCurrentTanda($scope.currentPage);
            backMoves();
            if($scope.params.SearchParameter == 4){
              if($scope.frmData.mFechaDesde == "" || ng.isUndefined($scope.frmData.mFechaDesde)) mModalAlert.showWarning("Debe ingresar un rango de fechas", "");
              else if($scope.frmData.mFechaHasta == "") mModalAlert.showWarning("La fecha final es requerida", "");
              else{ 
                var fDesde = ($scope.frmData.mFechaDesde).getTime() 
                var fHasta = ($scope.frmData.mFechaHasta).getTime()
                if(fDesde > fHasta){
                  mModalAlert.showWarning("El rango de fechas no es el correcto", "");
                }else{
                  $timeout(function(){
                    getListItemsDashboard();
                  }, 200);
                }
              }
            }else{
              $timeout(function(){
                getListItemsDashboard();
              }, 200);
            }          
          }

          /*--------------------------------------
          Paginador
          ----------------------------------------*/
          function pageChanged(event){
            $scope.params.PageSize = $scope.itemsXPagina;

            page.setNroPaginaAMostrar(event.pageToLoad).thenLoadFrom(function(nroTanda){
              $scope.params.PageNum = nroTanda;
              getListItemsDashboard($scope.params);
            }, setLstCurrentPage);
          }

          function setLstCurrentPage() {
            $scope.data = page.getItemsDePagina();
            $scope.dashboardData = $scope.data;
          }

          function getListItemsDashboard(){
            if(!$scope.userDisma) //usuario externo
              var promise = seguridadFactory.getListDashboardAdministrador($scope.params);
            else var promise = seguridadFactory.getListDashboardDisma($scope.params);
              
            promise.then(function(response){
              $scope.firstLoad = false;
              if(response.operationCode == 200){
                if(response.data.totalFilas > 0){
                  $scope.data = response.data.paginacion;
                  $scope.totalPages = response.data.totalPaginas;
                  $scope.totalItems = response.data.totalFilas; //usado para paginar
                }else{
                  $scope.data = [];
                  $scope.totalMovimientos = 0
                  $scope.totalPages = 0;
                  $scope.totalItems = 0;
                }

                //cambio dinamico de contadores
                var params2 = {
                  StartDate: $scope.params.StartDate
                  , EndDate: $scope.params.EndDate
                  , SearchValue: $scope.params.SearchValue
                }
                if($scope.firstLoad) params2.SearchParameter = $scope.frmData.config;
                else params2.SearchParameter = (!$scope.showDates) ? $scope.frmData.optionSelected.codigo : 4;

                if(!$scope.userDisma){
                  params2.CompanyNumber = $scope.adminExt.numPerson;
                  var pms2 = seguridadFactory.getTotalsAdminExt(params2);
                }else{
                  params2.UserType = $scope.params.UserType;
                  var pms2 = seguridadFactory.getTotals(params2);
                } 
                pms2.then(function(response){
                  $scope.totalMovimientos = response.data[4].cantidad;
                  $scope.totalHabilitado = response.data[0].cantidad;  
                  $scope.totalSinConfirmar = response.data[1].cantidad;  
                  $scope.totalCaducado = response.data[2].cantidad;  
                  $scope.totalDeshabilitado = response.data[3].cantidad;  
                });

              }else{
                mModalAlert.showError(response.message, '');
                $scope.data = [];
                $scope.totalMovimientos = 0;
                $scope.totalPages = 0;
                $scope.totalItems = 0;
              }
              page.setNroTotalRegistros($scope.totalItems).setDataActual($scope.data).setConfiguracionTanda();
              setLstCurrentPage();
            });

          //data inicial
          $scope.dashboardData = $scope.data;

          }

          $scope.fnViewTabs = _fnViewTabs;
          function _fnViewTabs(){
            return $scope.totalMovimientos > 0 
            || $scope.totalCaducado > 0 
            || $scope.totalDeshabilitado > 0 
            || $scope.totalHabilitado > 0 
            || $scope.totalSinConfirmar > 0
          }
          
          function _calendarStart(){
            var today = new Date();

            $scope.openDateDesde = function(){
              $scope.popupStart.opened = true;
              if($scope.frmData.mFechaHasta != "") $scope.frmData.mFechaHasta = "";
            };

            $scope.todayStart = function(){
              //$scope.frmData.mFechaDesde = new Date(today.setMonth(today.getMonth()-1));
              $scope.frmData.mFechaDesde = "";
            }
            $scope.todayStart();

            $scope.frmData.dateOptionsDesde = {
              formatYear: 'yy',
              maxDate: new Date(),
              startingDay: 1
            }

            $scope.inlineOptions = {
              minDate: new Date(),
              showWeeks: false
            };

            $scope.toggleMinStart = function(){
              $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : $scope.frmData.mFechaDesde;
              $scope.frmData.dateOptionsDesde.minDate = $scope.inlineOptions.minDate;
            };
            $scope.toggleMinStart();

            $scope.format = constants.formats.dateFormat;
            $scope.mask = constants.formats.dateFormatMask;
            $scope.pattern = constants.formats.dateFormatRegex;

            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popupStart = {
              opened: false
            };      
          
          }
            
          //})();

          function _calendarEnd(){
            $scope.todayEnd = function(){
              $scope.frmData.mFechaHasta = "";
            }
            $scope.todayEnd();

            $scope.inlineOptions = {
              minDate: new Date(),
              showWeeks: false
            };

            $scope.frmData.dateOptionsHasta = {
              formatYear: 'yy',
              startingDay: 1
            }

              $scope.$watch('frmData.mFechaDesde', function(){
                var dd = new Date($scope.frmData.mFechaDesde).getDate();
                var mm = new Date($scope.frmData.mFechaDesde).getMonth();
                var aa = new Date($scope.frmData.mFechaDesde).getFullYear();

                var ddHoy = new Date().getDate() 
                var mmHoy = new Date().getMonth() 
                var aaHoy = new Date().getFullYear()
                var fHasta = new Date(aaHoy, mmHoy, ddHoy);
                fHasta = fHasta.getTime();

                var fDesde = new Date(aa, mm, dd);
                fDesde = fDesde.getTime();

                var diasDiff = fHasta - fDesde;
                var contDias = Math.round(diasDiff/(1000*60*60*24))

                if(contDias <= 60){
                  $scope.frmData.dateOptionsHasta.minDate = new Date(aa, mm, dd)
                  $scope.frmData.dateOptionsHasta.maxDate = new Date()
                }else{
                  $scope.frmData.dateOptionsHasta.minDate = new Date(aa, mm, dd)
                  $scope.frmData.dateOptionsHasta.maxDate = new Date(aa, mm+2, dd)
                } 
              });                

            $scope.toggleMinEnd = function(){
              $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
              $scope.frmData.dateOptionsHasta.minDate = $scope.inlineOptions.minDate;
            };
            $scope.toggleMinEnd();

            $scope.openDateHasta = function(){
              $scope.popupEnd.opened = (ng.isUndefined($scope.frmData.mFechaDesde) || $scope.frmData.mFechaDesde == "") ? false : true;
            };    

            $scope.formatDate = constants.formats.dateFormat;
            $scope.mask = constants.formats.dateFormatMask;
            $scope.pattern = constants.formats.dateFormatRegex;

            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.popupEnd = {
              opened: false
            };
          }// end calendarEnd

          /*--------------------------------------
          cambio de fechas
          ----------------------------------------*/
          function _fnChangeDateStart(){
            $scope.params.StartDate = $scope.fnFilterDate($scope.frmData.mFechaDesde, $scope.format);
          }

          //$scope.showDates = false;

          /*--------------------------------------
          ordenar por
          ----------------------------------------*/
          function _fnOrdenarPor(val){
            $scope.params.SortingType = (val == null) ? 0 : val;
            //page.setCurrentTanda($scope.currentPage);
            $timeout(function(){
              getListItemsDashboard();
            }, 200);
          }

          //$scope.email = 'camila@multiplica.com';
          function _fnReenviarEnlace(item){
            mModalConfirm.confirmQuestion(
              'Se reenviará un enlace al correo ' + item.email + ' para que el usuario pueda confirmar y acceder a su cuenta.',
              '¿Deseas reenviar el correo de confirmación?',
              'Reenviar'
            ).then(function() {
              var paramsResend = {
                UserNumber: item.numUsuario,
                TokenStatusCode: item.codEstadoToken,
                Person: item.persona,
                Email: item.email
              }
              _fnReenviarEnlaceOk(paramsResend);
            });
          }

          function _fnReenviarEnlaceOk(params) {
            //var promise = seguridadFactory.postResendLink(params);
            var promise = seguridadFactory.postDismaResendLink(params);
            promise.then(function(response){
              if(response.operationCode == 200){
                mModalAlert.showSuccess('El enlace ha sido reenviado a ' + params.Email, '¡Enlace reenviado!').then(function(){
                    backMoves();
                    getDashboardData(0);
                  });
              }else mModalAlert.showWarning('Ocurrió un error al intentar enviar el enlace.', '');
            });
          }

          function _fnAnularUsuario(item){
            mModalConfirm.confirmQuestion(
              'Al momento de caducar el usuario, este quedará deshabilitado.',
              '¿Está seguro de caducar el usuario?',
              'Caducar'
            ).then(function() {
                _fnAnularUsuarioOK(item.numUsuario);
              });
          }
          function _fnAnularUsuarioOK(num) {
            var promise = seguridadFactory.postExpireLink(num);
            promise.then(function(response){
              if (response.operationCode == 200){
                mModalAlert.showSuccess('El usuario ha sido caducado.', '¡Confirmación Caducar!').then(function(){
                    backMoves();
                    getDashboardData(0);
                })
                  
              }else mModalAlert.showWarning(response.message, '');
            });
          }

          _calendarStart();
          _calendarEnd();

          // $scope.$watch('mFechaHasta', function(){
          //   getDashboardData($scope.status);
          // }, false);

          function _fnVerDetalle(item){
            switch(item.usuario){
              case "EJECUTIVO MAPFRE":
                var goStr = "detalleEjecMapfre";
              break;
              case "CLIENTE EMPRESA":
                var goStr = "detalleCliEmp";
              break;
              case "CORREDOR":
                var goStr = "detalleCorredor";
              break;
              case "PROVEEDOR":
                var goStr = "detalleProveedor";
              break;
              case "CLIENTE PERSONA":
                var goStr = "detalleUsuario";
              break;
            }
            $state.go(goStr, {id: item.numUsuario});
          }

        }]) //end controller

      .directive('panelSlider', function() {
        return {
          link: link,
          restrict: 'A',
          scope: {
            activePanel: '='
          }
        };

        function link(scope, element, attrs, ctrl) {
          var arrows = element[0].getElementsByClassName('slide-arrow');
          var panels = element[0].getElementsByClassName('slide-content');
          var panelsNum = panels.length;
          var active = parseInt(scope.activePanel);

          panels[active].classList.add('show');
          panels[active].classList.add('active');

          ng.element(panels).bind('click', function () {
            ng.forEach(panels, function (v,k) {
              panels[k].classList.remove('show');
              panels[k].classList.remove('active');
            });
            this.classList.add('active');
            this.classList.add('show');
            active = Array.from(panels).indexOf(this);
            scope.activePanel = active;
          });

          ng.element(arrows[0]).bind('click', function () {
            ng.forEach(panels, function (v,k) {
              panels[k].classList.remove('show');
              panels[k].classList.remove('active');
            });
            if (active) {
              panels[active - 1].classList.add('show');
              panels[active - 1].classList.add('active');
              active = active - 1;
            } else {
              panels[0].classList.add('show');
              panels[0].classList.add('active');
              active = 0;
            }
            scope.activePanel = active;
          });

          ng.element(arrows[1]).bind('click', function () {
            ng.forEach(panels, function (v,k) {
              panels[k].classList.remove('show');
              panels[k].classList.remove('active');
            });
            if (active < panelsNum - 1) {
              panels[active + 1].classList.add('show');
              panels[active + 1].classList.add('active');
              active = active + 1;
            } else {
              panels[panelsNum - 1].classList.add('show')
              panels[panelsNum - 1].classList.add('active')
              active = panelsNum - 1;
            }
            scope.activePanel = active;
          });
        }
      })
  });
