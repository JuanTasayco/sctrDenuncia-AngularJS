/*global angular */
angular.module('mpSession', [])

    .constant('SessionConfig', {
        'sessionParams':{},
        'sessionNode':      null
    })

    .controller('MpSessionCtrl', ['$scope', '$filter', '$q', '$timeout', '$interval', '$window', 'SessionConfig', 'SessionSrv', function ($scope, $filter, $q, $timeout, $interval, $window, SessionConfig, SessionSrv) {
        var sessionContainer = angular.element('.sessionContainer');
        var sessionClickBtn = angular.element('#sessionBtn');
        var sessionMsg = angular.element('.sessionMsg');

        SessionConfig.time = SessionSrv.calculateMillis(SessionConfig.time);
        SessionConfig.sessionParams.sessionAlertTime = SessionSrv.calculateMillis(SessionConfig.sessionParams.sessionAlertTime);

        function deferredTranslation(key){
            var deferred = $q.defer();
             $timeout(function(){
                deferred.resolve($filter('translate')(key))}, 1000);
            return deferred.promise;
        }

        deferredTranslation('mpSession.msg1').then(function(result){
            SessionConfig.sessionParams.msg1 = result;
            $scope.msg1 = SessionConfig.sessionParams.msg1;
        });


        deferredTranslation('mpSession.msg2').then(function(result){
            SessionConfig.sessionParams.msg2 = result
        });

        SessionConfig.sessionNode = sessionContainer === null ? null : sessionContainer;

        /* Ocultamiento y envío de la petición para hacer ping y que no se cierre la sesión */
        function hide() {
            SessionSrv.sessionPing();
        }

        /* Control del evento de click del botón */
        function unlisten(element, event, listener) {
            element.off(event, listener);
        }

        function listen(element, event, listener) {
            element.on(event, listener);
            return function() {
                unlisten(element, event, listener);
            }
        }

        function desregisterListeners() {
            unlisten(sessionClickBtn, 'click', hide);
        }

        var unlistenSessionClickBtn = listen(sessionClickBtn, 'click', hide);

        sessionClickBtn.on('$destroy', function() {
            unlistenSessionClickBtn();
        })

        SessionSrv.init();

    }])

    .directive('mpSession', ['SessionConfig', function (SessionConfig) {
        return {
            templateUrl: 'gaiafrontend/html/sessionAlert.html',
            controller: 'MpSessionCtrl',
            transclude: true,
            replace: true
        };
    }])

    .factory('SessionSrv', ['SessionConfig', 'SessionCounterSrv', 'HttpSrv', '$interval', 'Tbid', function (SessionConfig, SessionCounterSrv, HttpSrv, $interval, Tbid) {

        function sessionPing(){
            HttpSrv.get(SessionConfig.sessionParams.endPoint);
        }

        function initSrv(){
            HttpSrv.get(SessionConfig.sessionParams.endPoint)
                .then(function(data){
                    SessionConfig.time = calculateMillis(data);
                    SessionCounterSrv.start(SessionConfig.time);
                    SessionConfig.tbid = {
                        header : Tbid.header
                    }
                })
        }

        function calculateMillis(time){
            return Math.round((parseFloat(time,10) * 60) * 1000);
        }

        return {
            sessionPing: sessionPing,
            init:        initSrv,
            calculateMillis: calculateMillis
        }
    }])

    .factory('SessionCounterSrv', ['SessionConfig', '$interval', '$window', '$filter', 'BrowserDetectSrv', 'SessionStorageSrv', function (SessionConfig, $interval, $window, $filter, BrowserDetectSrv, SessionStorage) {
        var deltaTime = 1000;
        var interval = null;
        var counter = SessionConfig.time;
        var mainSessionDiv = null;
        var sessionWindow;
        var win = angular.element($window);
        var browser;

        function clock(counterParam){
            if(counterParam){
                SessionConfig.time = counterParam;
            }

            checkTimersCoherence();
            counter = SessionConfig.time;

            if (counter > 1000 && !interval){
                interval = $interval(counterClockDown, deltaTime, 0);
            }
        }

        function checkTimersCoherence(){
            if(SessionConfig.time < 60000){
                SessionConfig.time  = 60000;
                if(typeof console !== "undefined"){
                    console.log('Check your session time. Is less than the 1 minute minimum. Setting session time to minimum.');
                }
            }

            if(SessionConfig.sessionParams.sessionAlertTime >= SessionConfig.time){
                SessionConfig.sessionParams.sessionAlertTime = SessionConfig.time / 2;
                if(typeof console !== "undefined"){
                    console.log('Check your session alert time. Is bigger than configured session time. Setting session alert time to half the session time.');
                }
            }
        }

        function counterClockDown(){

            if(!mainSessionDiv){
                mainSessionDiv = angular.element('.sessionContainer');
            }

            if(counter <= 0){
                var sessionBtn = angular.element('#sessionBtn', mainSessionDiv);
                var counterCont = angular.element('.counterCont', mainSessionDiv);

                killInterval();
                killTbid();
                killCookies();
                angular.element('.sessionMsg', mainSessionDiv).text(SessionConfig.sessionParams.msg2);
                counterCont.addClass('hide');
                sessionBtn.off('click');
                sessionBtn.on('click', redirectHREF);
                setWindowPosition();
                if(typeof console !== "undefined"){
                    console.log('Your session is over.');
                }
            }

            if(counter <= SessionConfig.sessionParams.sessionAlertTime ){
                var sessionCounterUnits = angular.element('.sessionCounterUnits', mainSessionDiv);
                var sessionCounterDigits = angular.element('strong', mainSessionDiv);

                if(counter > 60000){
                    sessionCounterDigits.text(Math.ceil((counter/1000)/60));
                    sessionCounterUnits.text($filter('translate')('mpSession.minStr'));
                }else{
                    sessionCounterDigits.text(counter/1000);
                    sessionCounterUnits.text($filter('translate')('mpSession.secStr'));
                }

                if(!mainSessionDiv.hasClass('show')){
                    mainSessionDiv.addClass('show');
                    setWindowPosition();
                }
            }

            counter = counter - deltaTime;
        }

        function redirectHREF(){
            $window.location.href = SessionConfig.sessionParams.expiredHREF;
        }

        function resetClock(){
            killInterval()
            if(mainSessionDiv){
                mainSessionDiv.removeClass('show');
                if(typeof console !== "undefined"){
                    console.log('Your session time has been restarted.');
                }
            }
            clock();
        }

        function killInterval(){
            if(interval){
                $interval.cancel(interval);
                interval = null;
            }
        }

        function killTbid(){
            SessionStorage.removeItem(SessionConfig.tbid.header.get())
        }

        function killCookies(){
            var aKeys = getCookiesKeys();
            for(var i=0; i<aKeys.length;i++){
                document.cookie = aKeys[i] + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        }

        function getCookiesKeys(){
            var aCookies = document.cookie.split('; ');
            var aKeys=[];
            for(var i=0; i<aCookies.length; i++){
                aKeys.push(aCookies[i].split('=')[0])
            }
            return aKeys
        }

        function setWindowPosition(){
            if(!browser){
                browser = BrowserDetectSrv.getBrowser();
            }

            if(browser.name === 'Explorer' && browser.version <= 8){
                sessionWindow = angular.element('.sessionWindow');
                var topPos = (win.height() - sessionWindow.height()) / 2;
                var leftPos = (win.width() - sessionWindow.width()) / 2;
                sessionWindow.css('top', topPos + 'px');
                sessionWindow.css('left', leftPos + 'px');
            }
        }

        win.bind('resize', function(){
            setWindowPosition();
        })

        return {
            reset: resetClock,
            start: clock,
            setWindowPosition: setWindowPosition
        }
    }]);
