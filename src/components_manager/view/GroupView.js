const Backbone = require('backbone');
const BlockManager = require('../../block_manager/index');

module.exports = Backbone.View.extend({
  template: _.template(`<div class="<%= pfx %>title">
    <i id="<%= pfx %>caret" class="fa"></i>
    <%= label %>
  </div>`),

  events: {},

  initialize(options) {
    this.config = options.config;
    this.pfx = this.config.stylePrefix || '';
    this.target = options.target || {};
    this.caretR = 'fa-caret-right';
    this.caretD = 'fa-caret-down';
    this.listenTo(this.model, 'change:open', this.updateOpen);
    this.events['click .' + this.pfx + 'title']  = 'toggle';
    this.delegateEvents();
  },

  updateOpen() {
    if(this.model.get('open'))
      this.show();
    else
      this.hide();
  },

  show() {
    this.$el.addClass(this.pfx + "open");
    this.$el.find('.gjs-blocks-c').show();
    this.$caret.removeClass(this.caretR).addClass(this.caretD);
  },

  hide() {
    this.$el.removeClass(this.pfx + "open");
    this.$el.find('.gjs-blocks-c').hide();
    this.$caret.removeClass(this.caretD).addClass(this.caretR);
  },

  toggle() {
    const isOpen = !this.model.get('open');
    this.model.set('open', isOpen);
  },

  render() {
    const template = this.template({
      pfx: this.pfx,
      label: this.model.get('name')
    });
    this.$el.html(template);
    this.$caret  = this.$el.find('#' + this.pfx + 'caret');
    this.renderComponents();
    this.$el.attr('class', this.pfx + 'group no-select');
    this.updateOpen();

    return this;
  },

  renderComponents() {
    const config = _.extend(this.config, {blocks: this.model.get('blocks')});
    const $blocks = new BlockManager();
    $blocks.init(config);

    this.$el.append($blocks.render());
  }
});
