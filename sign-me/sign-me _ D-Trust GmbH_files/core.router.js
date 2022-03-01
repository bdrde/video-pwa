(function (window, CORE_STORE) {
  'use strict';

  if (window.location.pathname.indexOf(enums.fragments.HISTORY) === -1) {
    CORE_STORE.store.removeItem('sort');
    CORE_STORE.store.removeItem('pagination');
  }

  // return pure object without _proto_
  return Object.create(null);

})(window, CORE_STORE);
