(function($root, deps, action) {
  define(deps, action);
})(this, ['angular', 'constants'], function(angular, constants) {

    var app = angular.module("appVida");
    app.component('questionItem', {
      bindings: {
        question: '=',
        questionType: '@',
        onChange: '&'
      },
      templateUrl: 'app/vida/emit/component/questions/question-item.html',
      controller: [function() {
        var _self = this;

        _self.FORMAT_DATE = constants.formats.dateFormat;
        _self.FORMAT_MASK = constants.formats.dateFormatMask;
        _self.FORMAT_PATTERN = constants.formats.dateFormatRegex;
        _self.ALT_INPUT_FORMATS = ['M!/d!/yyyy'];

        var vTYPE = {
          INPUT_RADIO: 					1,
          INPUT_TEXT: 					2,
          INPUT_NUMBER: 				3,
          DATE_PICKER: 					4,
          SUB_TITLE_QUESTIONS: 	5,
          SUB_TITLE: 						6,
          SELECT: 							10
        };

        if(_self.question.TIPO === vTYPE.DATE_PICKER) {
          _self.dateOptions = {
            formatYear: 'yy'
          };
          _self.fnOpenDatePicker = function() {
            _self.popupDatePicker.opened = true;
          };
          _self.popupDatePicker = {
            opened: false
          };
        }
        
        _self.isRequired = function(question) {
          return question.MCA_OBLIGATORIO === 'S';
        };
      }]
    });

  });
