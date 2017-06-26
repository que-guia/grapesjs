const Backbone = require('backbone');

module.exports = Backbone.Model.extend({

  defaults: {
    id: '',
    name: '',
    blocks: [],
    open: false
  },

  initialize(options) {
    this.properties = options;
    this.set('properties', this.properties);
  }
});
