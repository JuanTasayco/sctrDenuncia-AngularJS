/*global angular*/
/*TODO: REVIEW*/
angular.module('mpTooltip', [])
    /**
     * @doc-component directive
     * @name gaiafrontend.directive.mpTooltip
     * @param {string} mp-tooltip Tooltip to display. The directive will create the title attribute with the contents of mp-tooltip.
     * @param {string=} mp-tooltip-type This attribute indicates the type of tooltip to display. The "error" will be used for validation tooltips.
     * @param {string=} mp-tooltip-options This optional attribute to customize the plugin options that activates the tooltip.
     * @description
     * This auxiliary component displays a tooltip when you mouseover an item. By default the tooltip is generated with the following properties that determine its position:
     * '''json
     *    position': {
     *        'my': 'center bottom-20',
     *        'at': 'center'
     *    }
     * '''
     * @example
       <doc:example module="mpTooltip">
        <doc:source>
        tooltipOptions = {'position': {'my': "center bottom-20", 'at': "left+60" }}
        form(ng-model="tooltipForm", name="tooltipForm")
          label(for="inputTooltip", mp-tooltip="'Tooltip en label'", mp-tooltip-options=JSON.stringify(tooltipOptions)) Label del input tooltip
          input#inputTooltip(type="text",mp-tooltip="'Tooltip en input'", ng-model="tooltipForm.inputTooltip")
        a.link(href="#", mp-tooltip="'Tooltip en enlace'") Tooltip
        </doc:source>
       </doc:example>
     */
    .directive('mpTooltip', ['Utils', function (Utils) {
        return {
            link: function(scope, elm, attrs) {
                var type = attrs.mpTooltipType,
                    options = attrs.mpTooltipOptions,
                    tooltipOptions = {
                        'position': {
                            'my': 'center bottom-20',
                            'at': 'center',
                            'collision': 'fit'
                        }
                    },
                    errorTooltipOptions = {
                        'position': {
                            'my': 'left-40 bottom-20',
                            'at': 'center',
                            'collision': 'fit'
                        }
                    };
                var unregisterWatch = scope.$watch(attrs.mpTooltip, function(title) {

                    /* Adds the attribute title in element like the jquery component */
                    elm.attr('title', title);

                    /* Adds custom options to tooltip*/
                    if (options) {
                        angular.extend(tooltipOptions, JSON.parse(attrs.mpTooltipOptions));
                    }

                    if (type) {
                        angular.extend(tooltipOptions, {
                            'tooltipClass': attrs.mpTooltipType
                        });
                        if (type === 'error') {
                            angular.extend(tooltipOptions, errorTooltipOptions);
                        }
                    }

                    tooltipOptions.content = title;

                    /* Runs the tooltip plugin */
                    elm.tooltip(tooltipOptions);

                }, true);

                function resetTooltip() {
                    elm.tooltip('close');
                    elm.tooltip(tooltipOptions, 'open');
                }
                if (Utils.platform.isTactile()) {
                    window.addEventListener('orientationchange', resetTooltip, false);
                }

                elm.on('$destroy', function () {
                    unregisterWatch();
                });
            }
        };
    }]);
