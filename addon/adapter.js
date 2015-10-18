import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  shouldReloadAll() {
    return true;
  },

  shouldBackgroundReloadRecord() {
    return false;
  },

  handleResponse: function(status, headers, payload) {
    if (status === 401) {
      return true;
    }

    if (this.isInvalid(status, headers, payload)) {
      const errors = this._normalizeErrors(payload);
      return new DS.InvalidError(errors);
    }

    return this._super(...arguments);
  },

  isInvalid: function(status, headers, payload) {
    return status === 400 && !Ember.isNone(payload.Errors);
  },

  _normalizeErrors(payload) {
    const errors = [];
    const makeError = this._jsonApiError;
    Object.keys(payload.Errors).forEach(function(key) {
      payload.Errors[key].forEach(function(detail) {
        errors.push(makeError(key, detail));
      });
    });

    return errors;
  },

  _jsonApiError(key, detail) {
    return {
      detail: detail,
      source: {
        pointer: `data/attributes/${key.camelize()}`,
      },
    };
  },
});
