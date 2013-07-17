/*
 * Bootstraps up the experience, dispatches the requests for the web fonts and,
 * once loaded, initializes the app proper.
 * @license see /LICENSE
 */
window.addEventListener('load', function() {

  // TODO(aerotwist) - provide a nicer way of doing this.
  var reset = /\?reset\/?/;
  if (reset.test(window.location.href)) {

    window.localStorage.clear();
    window.location.href = window.location.href.replace(reset, '');

  } else {

    // based on the code from https://github.com/typekit/webfontloader
    WebFontConfig = {
      custom: {
        families: ['roboto-thin', 'roboto-regular', 'roboto-bold'],
        urls: ['css/fonts.css']
      },

      fontactive: function(familyName, fvd) {
        if (familyName === "roboto-thin") {
          WT.App.init();
        }
      }
    };

    (function() {
      var wf = document.createElement('script');
      wf.src = 'libs/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
  }
});
