const Backbone = require('backbone');
const Group = require('./Group');

module.exports = Backbone.Collection.extend({
  model: Group
});
