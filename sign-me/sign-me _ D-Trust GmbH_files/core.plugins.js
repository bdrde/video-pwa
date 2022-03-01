(function ($) {

  // this is a Jquery plugin function that fires an event when the size of an element is changed
  $.fn.sizeChanged = function (_fn) {
    var el = this;
    var lastWidth = el.width();
    var lastHeight = el.height();

    setInterval(function () {
      if (lastWidth === el.width() && lastHeight === el.height()) { return; }

      if (typeof (_fn) == 'function') {
        _fn(
          {
            width: lastWidth,
            height: lastHeight
          },
          {
            width: el.width(),
            height: el.height()
          });
        lastWidth = el.width();
        lastHeight = el.height();
      }
    }, 100);

    return el;
  };
  // usage: $().sizeChanged(function(){})

}(jQuery));
