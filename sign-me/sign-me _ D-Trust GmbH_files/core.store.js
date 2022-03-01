var CORE_STORE = CORE_STORE || (function (localStorage, sessionStorage) {
  'use strict';

  var store = new StoreAdapter(sessionStorage || localStorage);

  /**
  * * adapter for handling store operation of local or session storage
  */
  function StoreAdapter(_adaptee) {
    return {
      storeItem: function (_key, _value) {
        try {
          _adaptee.setItem(_key + '', JSON.stringify(_value));
        } catch (e) {
          console.error(e);
        }
      },
      removeItem: function (_key) {
        _adaptee.removeItem(_key + '');
      },
      getItem: function (_key) {
        try {
          var item = JSON.parse(_adaptee.getItem(_key + ''));
          return typeof item === 'object' ? item : item + '';
        } catch (e) {
          return _adaptee.getItem(_key + '') + '';
        }
      }
    }
  }

  var StoreFacade = {

    /**
    * * stores the status of an item
    @param _key - key of item to store
    @param _value - value of item to store. Type object is also possible
    */
    storeItem: function (_key, _value) {
      store.storeItem(_key, _value);
    },

    /**
    * * removes stored item by key
    @param _key - key of item to store
    */
    removeItem: function (_key) {
      store.removeItem(_key);
    },

    /**
    * * gets stored item by key
    @param _key - key of item to store
    @returns {object | string} - stored item value
    */
    getItem: function (_key) {
      return store.getItem(_key);
    }
  }

  return {
    store: StoreFacade
  };

})(localStorage, sessionStorage);
