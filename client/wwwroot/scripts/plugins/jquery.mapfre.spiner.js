(function(factory)
{
    if(typeof define == 'function' && define.amd)
        define(['jquery', 'spin'], function($, Spinner){ factory($, Spinner)  })
    else
        factory($, Spinner)
})((function($, Spinner){

    $.extend(
        {
            spin: function(spin, opts)
            {

                // TODO: Cambiar verificacion
                var myd = document.getElementsByClassName("app-my-dream")[0];

                if (opts === undefined) {
                    opts = {
                        lines: 13,
                        length: 20,
                        width: 10,
                        radius: 30,
                        corners: 1,
                        rotate: 0,
                        direction: 1,
                        color: '#000',
                        speed: 1,
                        trail: 56,
                        shadow: false,
                        hwaccel: false,
                        className: 'spinner',
                        zIndex: 2e9,
                        top: '50%',
                        left: '50%'
                    };
                }

                var data = $('body').data();

                if (data.spinner) {
                  if (!myd) {
                    try { data.spinner.stop(); }
                    catch(e) {}
                  }
                  delete data.spinner;
                  $("#spinner_modal").remove();
                  return this;
                }

                if (spin && spin !== 'false') {
                    var spinElem = this;
                    var textShow = '';
                    if (typeof spin === 'string' &&
                      ($.trim(spin).toLowerCase() !== 'false' && $.trim(spin).toLowerCase() !== 'true'))
                        textShow =  spin;

                   if (myd) {
                      $('body').append('<div id="spinner_modal" class="g-spinner">' +
                        '<div class="g-spinner--center">' +
                        '<div class="g-spinner--image"></div>' +
                        '<div class="g-spinner--text">' + textShow  +
                        '<span class="g-spinner--dots"><span>.</span><span>.</span><span>.</span></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                      data.spinner = true;
                    } else {
                      $('body').append('<div id="spinner_modal" class="g-new-spinner" style="background-color: rgba(0, 0, 0, 0.3); width:100%; height:100%; position:fixed; top:0px; left:0px; z-index:' + (opts.zIndex - 1) + '; text-align: center; vertical-align: middle;"><span style= "color:#000000; font-size:20px; position:fixed;text-shadow:0px 0px 1px #D6D6D6;">'+ textShow +'</<span></div>');
                      spinElem = $("#spinner_modal")[0];
                      data.spinner = new Spinner($.extend({
                        color: $('body').css('color')
                      }, opts)).spin(spinElem);

                      function redimText(){
                          var item = $('span', spinElem);
                          var spinner = $('.spinner', spinElem)
                          var w = $(window)
                          var wwindow = w.innerWidth() / 2;
                          var wspan = item.width() / 2
                          var hwindow = w.innerHeight() / 2;
                          var hspan = item.height() / 2
                          item.addClass('spinner-text');
                          item.css({
                            top: hwindow + 60,
                            left: '50%',
                            minWidth: '290px',
                            transform: 'translateX(-50%)'
                          })
                          var s = wwindow + wspan
                      }

                      redimText();
                      try{
                        $(window).unbind(redimText)
                      }catch(e){}

                      $(window).on('resize',
                        redimText
                      );
                    }

                }
            }
        });
}))


