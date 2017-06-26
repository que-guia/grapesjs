const Backbone = require('backbone');
const GroupView = require('./GroupView');

module.exports = Backbone.View.extend({
  initialize(options) {
    this.config = options.config || {};
    this.pfx = this.config.stylePrefix || '';
    this.target = options.target || {};
  },

  render() {
    const fragment = document.createDocumentFragment();
    const renderGroup = (model) => {
      const id = this.pfx + model.get('name').replace(/\s+/g, '_').toLowerCase();
      const name = model.get('name');
      const config = this.config;
      const target = this.target;

      const group = new GroupView({id, model, name, config, target});
      const rendered = group.render().el;

      fragment.appendChild(rendered);
    };

    this.$el.empty();
    this.collection.each(renderGroup);

    this.$el.attr('id', this.pfx + 'groups');
    this.$el.append(fragment);
    return this;
  }
});
