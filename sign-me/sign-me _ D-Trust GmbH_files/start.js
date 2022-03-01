var START_FRAGMENT = START_FRAGMENT || (function ($) {
  'use strict';

  function init() {

    function disableAccordionAnkers() {
      $('#start-html .accordion-selfservice a').each(function () {
        setTimeout($.proxy(function () {
          $(this).removeAttr('href').addClass('disabled');
        }, this));
      });
    }

    function disableCancelAnker() {
      setTimeout(function () {
        $('#btn_back').removeAttr('href').addClass('disabled');
      });
    }

    (function addDoubleClickProtection() {
      $('#start-html .accordion-selfservice a').each(function () {
        $(this).off('click').on('click', function () {
          disableAccordionAnkers();
          disableCancelAnker();
        });
      });
    })();
  }

  return {
    init: init
  };

})(jQuery);
