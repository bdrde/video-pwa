var CORE_FRAGMENT = CORE_FRAGMENT || (function ($, window, navigator) {
  'use strict';

  /**
  * * protects the side and mobile navigation menu against double click by removing the href attribute from .nav-link
    */
  function protectMenuFromDoubleClick() {
    (function disable() {
      $('.nav .nav-link').each(function () {
        $(this).removeAttr('href').addClass('disabled');
      });
    })();
  }

  /**
  * * makes the used device vibrate, but only if the vibration is natively supported
  @param _time - vibration time in ms
    */
  function vibrate(_time) {
    var isVibrateSupported = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate || null;
    if (isVibrateSupported) {
      navigator.vibrate(_time);
    }
  }

  /**
  * * generates a language-dependent date string
  @param _lang - currently selected language as locale
  @param _timestamp - current date as timestamp
  @returns {string} date string depending on the selected language
  */
  function formatDate(_lang, _timestamp) {

    if (!_lang) {
      _lang = enums.lang.EN_US;
    }
    if (!(+_timestamp)) { return ''; }

    var options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };

    var date = new Date(+_timestamp);

    return date.toLocaleDateString(_lang, options);
  }

  /**
  * * formats the passed process id into the XXX...XXX format
  @param _val - full process id
  @returns {string} formated process id
  */
  function formatProcessId(_val) {

    var SEPARATOR = ' ... ',
      MASKING_CHAR_SIZE = 3,
      MASKING_THRESHOLD_MAX = 9;

    if (!_val) { return ''; }
    if (_val.length <= MASKING_THRESHOLD_MAX) { return _val; }

    return _val.substring(+(false), MASKING_CHAR_SIZE) + SEPARATOR + _val.substr(_val.length - MASKING_CHAR_SIZE);
  }

  /**
  * * calculates the remaining time, depending on the given login time from server
  @returns {string} calculated remaining time as string
  */
  function calcRemainingTime(_time) {

    try {
      var now = ~~(new Date().getTime() / 1000);
      var remainingSecondsTotal = _time - now;
      var remainingMinutes = ~~(remainingSecondsTotal / 60);
      var remainingSeconds = remainingSecondsTotal % 60;

      if (remainingMinutes < +(false)) {
        remainingMinutes = +(false);
        remainingSeconds = +(false);
      }

      return remainingMinutes + ':' + (remainingSeconds < ((+(true) << 3) | 0x2) ? '0' + remainingSeconds : remainingSeconds);

    } catch (e) {
      console.error(e);
    }
  }

  /**
  * * checks if the cookie "STATE_S2" is enabled
  @returns {boolean} returns check as boolean
  */
  function isCookieEnabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? +(true) : +(false);
    var cookieName = "STATE_S2";

    if (typeof navigator.cookieEnabled == "undefined" && cookieEnabled == +(false)) {
      cookieEnabled = (document.cookie.indexof(cookieName) != -1) ? +(true) : +(false);
    }

    return cookieEnabled == +(true);
  }

  /**
  * * checks if the currently used browser is Internet Explorer
  * * inspired by: https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie-with-jquery
  @returns returns version of IE or false, if browser is not Internet Explorer
  */
  function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    return false;
  }

  /**
  * * floating labels can't detect autofill-values of some browsers, e.g. Chrome
  * * to prevent displaying floating labels over the value add "fix-top" class for each auto-filled input
  */
  function fixWebkitAutofill() {
    var ieVersion = detectIE();
    if (ieVersion && ieVersion > 11) {
      setTimeout(function () {
        var autofilled = document.querySelectorAll(':-webkit-autofill');
        if (autofilled) {
          $(autofilled).each(function () {
            $(this).siblings().filter('label.form-control-placeholder').addClass('fix-top');
          });
        }
      });
    }
  }

  /**
  * * toggles pw-input type & visibility icon
  */
  function handlePasswordToggleBtn() {
    $('.password-toggle').each(function () {
      $(this).click($.proxy(function () {
        var $passwordField = $(this).next()[0];
        $passwordField.type = ($passwordField.type === 'password') ? 'text' : 'password';
        $(this).toggleClass('pw-visible');
      }, this));
    });
  }

  function handleCustomFileUpload() {
    $('.inputfile').each(function () {
      var $input = $(this),
        $btnLabel = $('#lbl_ul_selfsign_document');
      $input.on('change', function (e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
          fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else if (e.target.value)
          fileName = e.target.value.split('\\').pop();
        if (fileName) {
          $btnLabel.text(fileName);
        } else {
          $btnLabel.text(lbl_upload_file_button_text);
        }
        // remove error-text after document change
        $('#ul_selfsign_document_errmsg').remove();
      });

      // firefox bug fix
      $input
        .on('focus', function () { $input.addClass('has-focus'); })
        .on('blur', function () { $input.removeClass('has-focus'); });
    });
  }

  /**
  * * prevents multiple form submits by penetrating the sign or continue button
  */
  function handleMultipleClickPrevention() {
    var btnSign = $('#btn_sign');
    var btnContinue = $('#btn_continue');
    var btnSave = $('#btn_save');
    var btnSaveCollapse = $('#btn_save[data-toggle=collapse]');
    var btnCancel = $('#btn_cancel');
    var btnSaveConfirm = $('#btn_save_confirm');
    var btnBack = $('#btn_back');

    btnSign.click(function () {
      setTimeout(function () {
        btnSign.prop('disabled', true);
        btnCancel.removeAttr('href').addClass('disabled');
      });
    });

    btnSave.click(function () {
      setTimeout(function () {
        btnSave.prop('disabled', true);
        btnBack.removeAttr('href').addClass('disabled');
      });
    });

    btnSaveCollapse.click(function () {
      $([document.documentElement, document.body]).animate({
        scrollTop: btnSaveCollapse.offset().top
      }, 1500);
    });

    btnSaveConfirm.click(function () {
      setTimeout(function () {
        btnSaveConfirm.prop('disabled', true);
        btnCancel.removeAttr('href').addClass('disabled');
      });
    });

    btnCancel.click(function () {
      setTimeout(function () {
        btnSave.prop('disabled', false);
        btnBack.attr('href', '?btn_back=true').removeClass('disabled');
      });
    });

    btnContinue.click(function () {
      setTimeout(function () {
        btnContinue.prop('disabled', true).removeAttr('href');
        btnCancel.removeAttr('href').addClass('disabled');
        btnBack.removeAttr('href').addClass('disabled');
      });
    });
  }

  function init() {
    $(function () {
      fixWebkitAutofill();
      handleMultipleClickPrevention();
      handleCustomFileUpload();
      handlePasswordToggleBtn();
    });

    /**
    * * to see the content of accordions in case of disabled javascript, all necessary accordions must be opened by default
    * * in case of activated javascript the opened accordions have to be closed again
    */
    (function handleNoScriptAccordion() {
      $('#moreinfo-card').ready(function () {
        setTimeout(function () {
          $('#moreinfo-card')
            .hide()
            .find('.collapse').collapse().end()
            .show();
        });
      });

      $('#accordion-certificates').ready(function () {
        setTimeout(function () {
          $('#accordion-certificates')
            .hide()
            .find('.collapse').collapse().end()
            .show();
        });
      });

      $('#accordion-faq').ready(function () {
        setTimeout(function () {
          $('#accordion-faq')
            .hide()
            .find('.collapse').collapse().end()
            .show();
        });
      });
    })();

    (function handleRemainingTime() {
      $('#remaining-time').ready(function () {
        $.proxy(function () {
          if ($(this).length) {
            $(this).text(calcRemainingTime(login_to_time_utc_sec));
            setInterval($.proxy(function () {
              $(this).text(calcRemainingTime(login_to_time_utc_sec));
            }, this), 1000);
          }
        }, $('#remaining-time'))();
      });

      $('#remaining-time-topmenu').ready(function () {
        $.proxy(function () {
          if ($(this).length) {
            $(this).text(calcRemainingTime(login_to_time_utc_sec));
            setInterval($.proxy(function () {
              $(this).text(calcRemainingTime(login_to_time_utc_sec));
            }, this), 1000);
          }
        }, $('#remaining-time-topmenu'))();
      });
    })();
  }

  init();

  return {
    init: init,
    formatDate: formatDate,
    isCookieEnabled: isCookieEnabled,
    calcRemainingTime: calcRemainingTime,
    detectIE: detectIE,
    protectMenuFromDoubleClick: protectMenuFromDoubleClick,
    vibrate: vibrate,
    fixWebkitAutofill: fixWebkitAutofill,
    formatProcessId: formatProcessId,
    detectSafari: function () {
      return window.safari;
    },
    inIframe: function () {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
  };
})(jQuery, window, navigator);





