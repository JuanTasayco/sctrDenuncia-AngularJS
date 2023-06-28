(function($root, deps, factory) {
    define(deps, factory)
})(this, ['angular', 'constants'], function(angular, constants) {
    var appHome = angular.module('oim.layout');
    appHome.controller('topController', [
        '$scope'
        , '$http'
        , 'oimClaims'
        , '$rootScope'
        , 'mapfreAuthetication'
        , 'accessSupplier'
        , 'proxyClaims'
        , function(
            $scope
            , $http
            , oimClaims
            , $rootScope
            , mapfreAuthetication
            , accessSupplier
            , proxyClaims
            ) {

              $scope.baseUrl = constants.system.api.urlBase;

          function _getLoginType(){
              var vLoginType = null;
              if (oimClaims.userSubType == constants.typeLogin.proveedor.subType && oimClaims.userType == constants.typeLogin.proveedor.type) vLoginType = constants.typeLogin.proveedor.code;
              if (oimClaims.userSubType == constants.typeLogin.broker.subType && oimClaims.userType == constants.typeLogin.broker.type) vLoginType = constants.typeLogin.broker.code;
              return vLoginType;
            }

            function _linkHelp(){
              var vLinkHelp = oimClaims.tokenMapfre;
              var vLoginType = _getLoginType();
              if (vLoginType){
                switch (vLoginType){
                  case constants.typeLogin.proveedor.code:
                    vLinkHelp += '&User='+oimClaims.documentNumber+'&GRP_APL='+oimClaims.userSubType;
                    break;
                  case constants.typeLogin.broker.code:
                    vLinkHelp += '&User='+oimClaims.documentNumber+'&GRP_APL='+oimClaims.userSubType+'&CodAgt='+oimClaims.agentID+'&DesAgt='+oimClaims.agentName;
                    break;
                }
              }
              return vLinkHelp;
            }
            $scope.token = oimClaims.tokenMapfre;
            $scope.linkHelp = _linkHelp();

            $scope.goApplication = function(application, e) {
              if (e) {
                e.preventDefault();
                e.stopPropagation();

                proxyClaims.GenerateTokenMapfre(true)
                  .then(function(response) {
                    var vHref = application.replace('{tokenMapfre}', response);
                    window.open(vHref, '_blank');
                  });
              } else {
                window.localStorage['CodigoAplicacion'] = angular.toJson(application.code);
                window.location.href = application.href;
              }
            };


            function updateProfile() {
                var profile = mapfreAuthetication.get_profile();
                var name = "";
                for (var key in constants.typeLogin) {
                    if ((!constants.typeLogin[key].subType || constants.typeLogin[key].subType == oimClaims.userSubType) &&
                        constants.typeLogin[key].type == oimClaims.userType)
                        name = constants.typeLogin[key].headerName
                }
                if (profile) {
                    $scope.perfilEjecutivo = name;
                    $scope.fullUsername = profile.name;
                }
            }
            updateProfile();

            $rootScope.$on('$stateChangeSuccess', function() {
                updateProfile();
            });

            $scope.singout = function() {
              mapfreAuthetication.signOut()
                .then(function() {
                  mapfreAuthetication.goLoginPage(false);
                  accessSupplier.clean();
                });
            }

            $scope.showPerfil = false;
            $scope.showAyuda = false;
            $scope.showConsulta = false;
            $scope.goHome = function() {
              mapfreAuthetication.goHome();
            };

        }
    ])
    .directive('menuPerfilDesktop', ['$document', 'safeApply', function($document, safeApply){
        return {
            link: link,
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        };
        function link(scope, element, attrs) {
            scope.isPopupPerfilDesktopVisible = false;
            scope.toggleSelectPerfilDesktop = function(){
                scope.isPopupPerfilDesktopVisible = !scope.isPopupPerfilDesktopVisible;
            }
            $document.bind('click', function(event){
                var a = event.target;
                var isClickedElementChildOfPopupPerfilDesktop = false;
                var notFindParent = true;

                while (notFindParent && a) {
                    if(a.parentNode != null){
                        if ( a.parentNode.id == 'menu-perfil-desktop' ) {
                            notFindParent = false;
                            isClickedElementChildOfPopupPerfilDesktop = true;
                        }
                        a = a.parentNode;
                        if (a.tagName == 'HTML' || a.tagName == 'html') a = '';
                        }else{
                            break;
                    }
                }
                if (isClickedElementChildOfPopupPerfilDesktop)
                    return;
                scope.isPopupPerfilDesktopVisible = false;
                safeApply(scope);
            });
        }
    }])
    .directive('menuPerfilResponsive', ['$document', '$window', 'safeApply', function($document, $window, safeApply){
        return {
            link: link,
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        };
        function link(scope, element, attrs) {
            var w = angular.element($window);
            scope.isPopupPerfilResponsiveVisible = false;
            scope.toggleSelectPerfilResponsive = function(){
                scope.isPopupPerfilResponsiveVisible = !scope.isPopupPerfilResponsiveVisible;
                var heightPopupPerfil = $window.innerHeight - 55,
                    mnList = document.getElementById('g-perfil-list-responsive');
                mnList.style.height = heightPopupPerfil + 'px';
            }

            $document.bind('click', function(event){
                var a = event.target;
                var isClickedElementChildOfPopupPerfilResponsive = false;
                var notFindParent = true;
                while (notFindParent && a) {
                    if(a.parentNode != null){
                        if ( a.parentNode.id == 'menu-perfil-responsive' ) {
                            notFindParent = false;
                            isClickedElementChildOfPopupPerfilResponsive = true;
                            var isBackground = document.getElementsByClassName('menu-perfil-background').length > 0;
                            if (!isBackground) {
                                var node = document.createElement('div');
                                document.body.appendChild(node).setAttribute('class', 'menu-perfil-background');
                                document.getElementsByTagName('body')[0].classList.add('menu-perfil-body');
                            }
                        }
                        a = a.parentNode;
                        if (a.tagName == 'HTML' || a.tagName == 'html') a = '';
                    }else{
                        break;
                    }
                }
                if (isClickedElementChildOfPopupPerfilResponsive) {
                    var paras = document.getElementsByClassName('menu-perfil-background');
                    if (paras.length > 0 && !scope.isPopupPerfilResponsiveVisible) {
                        while(paras[0]) {
                            paras[0].parentNode.removeChild( paras[0] );
                        }
                        document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                    }
                    return;
                }
                scope.isPopupPerfilResponsiveVisible = false;
                var paras = document.getElementsByClassName('menu-perfil-background');
                if (paras.length > 0) {
                    while(paras[0]) {
                        paras[0].parentNode.removeChild( paras[0] );
                    }
                    document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                }
                safeApply(scope)
            });

            // **************************************************
            // Script cuando pasa de portrait a layout en Tablet
            // **************************************************
            w.bind('resize', function(){
            var isDesktop = $window.innerWidth > 991;
            if (isDesktop) {
                scope.isPopupPerfilResponsiveVisible = false;
                var paras = document.getElementsByClassName('menu-perfil-background');
                if (paras.length > 0 && !scope.isPopupPerfilResponsiveVisible) {
                    while(paras[0]) {
                        paras[0].parentNode.removeChild( paras[0] );
                    }
                }
                document.getElementsByTagName('body')[0].classList.remove('menu-perfil-body');
                return;
            }
          });
        }
    }])
    .directive('menuAyuda', ['$document', 'safeApply', function($document, safeApply){
        return {
            link: link,
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        };
        function link(scope, element, attrs) {
            scope.isPopupAyudaVisible = false;
            scope.toggleSelectAyuda = function(){
                scope.isPopupAyudaVisible = !scope.isPopupAyudaVisible;
            }
            $document.bind('click', function(event){
                var a = event.target;
                var isClickedElementChildOfPopupAyuda = false;
                var notFindParent = true;
                while (notFindParent && a) {
                    if ( a.parentNode.id == 'menu-ayuda' ) {
                        notFindParent = false;
                        isClickedElementChildOfPopupAyuda = true;
                    }
                    a = a.parentNode;
                    if (a.tagName == 'HTML' || a.tagName == 'html') a = '';
                }
                if (isClickedElementChildOfPopupAyuda)
                    return;
                scope.isPopupAyudaVisible = false;
                safeApply(scope);
            });
        }
    }])
    .directive('menuConsulta', ['$document', 'safeApply',function($document, safeApply){
        return {
            link: link,
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        };
        function link(scope, element, attrs) {
            scope.isPopupConsultaVisible = false;
            scope.toggleSelectConsulta = function(){
                scope.isPopupConsultaVisible = !scope.isPopupConsultaVisible;
            }
            $document.bind('click', function(event){
                var a = event.target;
                var isClickedElementChildOfPopupConsulta = false;
                var notFindParent = true;
                while (notFindParent && a) {
                    if(a.parentNode != null){
                        if ( a.parentNode.id == 'menu-consulta' ) {
                            notFindParent = false;
                            isClickedElementChildOfPopupConsulta = true;
                        }
                        a = a.parentNode;
                        if (a.tagName == 'HTML' || a.tagName == 'html') a = '';
                    }else{
                        break;
                    }
                }
                if (isClickedElementChildOfPopupConsulta)
                    return;
                scope.isPopupConsultaVisible = false;
                safeApply(scope);
            });
        }
    }])
    .factory('safeApply', [function($rootScope) {
        return function($scope, fn) {
          var phase = ($scope.$root) ? $scope.$root.$$phase : null;
          if(phase == '$apply' || phase == '$digest') {
            if (fn) {
              $scope.$eval(fn);
            }
          } else {
            if (fn) {
              $scope.$apply(fn);
            } else {
              $scope.$apply();
            }
          }
        }
      }])
    ;
})
