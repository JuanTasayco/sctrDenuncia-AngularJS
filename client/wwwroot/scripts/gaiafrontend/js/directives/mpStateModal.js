/*global angular */
angular.module('mpStateModal', ['utils'])
    /**
     * @doc-component service
     * @name gaiafrontend.service.stateModal
     * @description
     * The `StateModal` service allows you to manage the visibility of a state (and its children) whose view is displayed as/in a modal.
     *
     * This service works "hand in hand" with `mpStateModal` directive.
     *
     * For more info about its usage see `mpStateModal` directive documentation.
     *
     */
    .factory('StateModal', function() {
        var modal = this;

        modal.visible = false;

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.stateModal
         * @name gaiafrontend.service.stateModal#open
         * @description The `open` method turns the state modal view visible.
         */
        function open() {
            modal.visible = true;
        }

        /**
         * @doc-component method
         * @methodOf gaiafrontend.service.stateModal
         * @name gaiafrontend.service.stateModal#close
         * @description The `close` method turns the state modal view not visible.
         */
        function close() {
            modal.visible = false;
        }

        modal.open = open;
        modal.close = close;

        return modal;
    })
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpStateModal
     * @param {string=} mp-state-modal-class Space separated classes to apply to .modal-dialog element. Bootstrap provides .modal-lg and -modal-sm classes to apply different modal sizes.
     * @description
     *
     * This directive allows you to display a state view as a modal window.
     *
     * This directive works "hand in hand" with `StateMdoal` service.
     *
     * #Usage
     *
     * If our web application has a section to register users in two steps we would have a `state.js` file like this.
     *
     *  ```js
     *  states.push({
     *      'name': 'registrationFlw',
     *      'abstract': true,
     *      'templateUrl': 'registration/html/registrationFlw.html',
     *      'controller': 'RegistrationFlwCtrl'
     *      },
     *      'resolve': {
     *          'flowData': ['DataSrv', function (DataSrv) {
     *              return DataSrv.$new(this.name);
     *          }]
     *      }
     *  });
     *
     *  states.push({
     *      'parent': 'registrationFlw',
     *      'name': 'registrationInfo',
     *      'url': '/registrationInfo',
     *      'views': {
     *          'registrationFlwChild@registrationFlw': {
     *              'templateUrl': 'registration/html/registrationInfo.html',
     *              'controller': 'RegistrationInfoCtrl'
     *          }
     *      }
     *  });
     *
     *  states.push({
     *      'parent': 'registrationFlw',
     *      'name': 'confirmation',
     *      'url': '/confirmation',
     *      'views': {
     *          'registrationFlwChild@registrationFlw': {
     *              'templateUrl': 'registration/html/confirmation.html',
     *              'controller': 'ConfirmationCtrl'
     *          }
     *      }
     *  });
     *  ```
     *
     * Our states are:
     *
     * - `registrationFlw` This is an abstract parent state to manage the registration flow.
     * - `registrationInfo` This is the first step of our flow. In this state the user will introduce his registration info.
     * - `confirmation` This is the second step of our flow. In ths state a confirmation/error message will be displayed.
     *
     * We want this flow to be displayed in a modal window.
     * For this purpose we will use the `mpStateModal` directive in the same DOM element we are using the `uiView` directive.
     *
     * The best way to do this is by applying the `mpStateModal` directive to the `registrationFlw` template's `uiView`.
     *
     * So the `registrationFlw` jade template will be something like this.
     *
     *  ```js
     *  h1 Registration
     *  div(ui-view="registrationFlwChild", mp-state-modal)
     *  ```
     *
     * To open/close our modal we could use the `onEnter`/`onExit` state object properties
     * but (due to how states are resolved) if we try to navigate straight to `registration` state the modal will not open
     * because the `onEnter` callback will be executed before the modal element exists in the DOM.
     *
     * To solve this problem the `StateModal` service has been developed. See `StateModal` service documentation for more info.
     *
     * So in our example we will show and hide our modal window from `RegistrationFlwCtrl`.
     *
     *  ```js
     *  function ControllerName($scope, StateModal) {
     *      StateModal.open();
     *
     *      //Logic here...
     *
     *      $scope.$on('$destroy', function () {
     *          StateModal.close();
     *      })
     *  }
     *  ```
     *
     * This way we can navigate straight to `registration` state and when we go to any state that is not a `registrationFlw` child state our modal will close.
     *
     */
    .directive('mpStateModal', ['Loader', 'StateModal',
        function(Loader, StateModal) {
            return {
                templateUrl: 'gaiafrontend/html/stateModal.html',
                transclude: true,
                link: function(scope, element, attributes) {
                    var loadPlugin = Loader.load,
                        bootstrapFile = 'bootstrap.js',
                        mpStateModalClass = attributes.mpStateModalClass,
                        modal = element.find('.modal');

                    if (mpStateModalClass) {
                        modal.find('.modal-dialog').addClass(mpStateModalClass);
                    }

                    function initModal() {
                        modal.modal({
                            backdrop: 'static',
                            keyboard: false,
                            show: false
                        });

                        scope.$watch(function() {
                            return StateModal.visible;
                        }, function(visible) {
                            modal.modal(visible ? 'show' : 'hide');
                        });
                    }

                    loadPlugin(bootstrapFile)
                        .then(initModal);
                }
            };
        }]);
