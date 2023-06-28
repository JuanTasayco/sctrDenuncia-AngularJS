/*global angular*/
angular.module('accordion', ['ui.bootstrap'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/accordion/accordion-group.html',
            '<div class=\"panel panel-default\">\n' +
            '  <div class=\"panel-heading\">\n' +
            '    <h4 class=\"panel-title\">\n' +
            '      <a href=\"javascript:void(0)\" tabindex=\"0\" class=\"accordion-toggle\" ng-click=\"toggleOpen()\" accordion-transclude=\"heading\">\n' +
            '       <span ng-class=\"{\'text-muted\': isDisabled}\">{{heading}}</span></a>\n' +
            '    </h4>\n' +
            '  </div>\n' +
            '  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n' +
            '     <div class=\"panel-body\" ng-class=\"{\'accordion-disabled\': isDisabled}\" ng-transclude></div>\n' +
            '  </div>\n' +
            '</div>'
        );
    }]);
