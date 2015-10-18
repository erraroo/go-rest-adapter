import Ember from 'ember';
import DS from 'ember-data';

function upperCamelize(str) {
  return str.classify();
}

export default DS.RESTSerializer.extend({
  primaryKey: 'ID',

  isNewSerializerAPI: true,

  serializeAttribute: function(record, json, key, attribute) {
    if (attribute.options.readOnly) {
      return;
    }

    return this._super(record, json, key, attribute);
  },

  serializeIntoHash: function(data, type, record, options) {
    const root = upperCamelize(type.modelName);
    data[root] = this.serialize(record, options);
  },

  keyForAttribute: function(attr) {
    return upperCamelize(attr);
  },

  keyForRelationship: function(key, relationship) {
    if (relationship === 'belongsTo') {
      return upperCamelize(key) + this.get('primaryKey');
    }

    if (relationship === 'hasMany') {
      return upperCamelize(key) + this.get('primaryKey') + 's';
    }

    return upperCamelize(key);
  },

  serializeHasMany: function(record, json, relationship) {
    if (relationship.options.async || relationship.options.readOnly) {
      return;
    }

    const key = this.keyForRelationship(relationship.key, relationship);
    const relationshipType = DS.RelationshipChange.determineRelationshipType(record.constructor, relationship);

    if (relationshipType === 'manyToNone' || relationshipType === 'manyToMany') {
      json[key] = Ember.get(record, relationship.key).mapBy('id');
    }
  },

  typeForRoot: function(root) {
    const camelized = Ember.String.camelize(root);
    return Ember.String.singularize(camelized);
  },

  extractMeta: function(store, type, payload) {
    if (payload && payload.Meta) {
      var metadata = payload.Meta;

      var meta = {};

      if (metadata.Pagination) {
        meta.pagination = {
          pages: metadata.Pagination.Pages,
          page: metadata.Pagination.Page,
          limit: metadata.Pagination.Limit,
          total: metadata.Pagination.Total,
        };
      }

      delete payload.Meta;
      return meta;
    }
  },
});

