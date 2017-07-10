var Backbone = require('backbone');

module.exports = Backbone.View.extend({

  events: {
    mousedown: 'onDrag',
    mouseover: 'displayPreview',
    mouseout: 'hidePreview'
  },

  initialize(o, config) {
    _.bindAll(this, 'onDrop');
    this.config = config || {};
    this.ppfx = this.config.pStylePrefix || '';
    this.listenTo(this.model, 'destroy', this.remove);
    this.doc = $(document);
    this.isVisiblePreview = false;
  },

  /**
   * Start block dragging
   * @private
   */
  onDrag(e) {
    if(!this.config.getSorter)
      return;
    this.hidePreview();
    this.config.em.refreshCanvas();
    var sorter = this.config.getSorter();
    let content = this.model.get('content').replace('{custom-class}',
      this.config.useCustomClass ? this.model.cid : '');

    sorter.setDragHelper(this.el, e);
    sorter.startSort(this.el);
    sorter.setDropContent(content);
    this.doc.on('mouseup', this.onDrop);
  },

  /**
   * Drop block
   * @private
   */
  onDrop() {
    this.doc.off('mouseup', this.onDrop);
    this.config.getSorter().endMove();
  },

  displayPreview() {
    if (!this.isVisiblePreview) {
      const id = `preview-${this.model.get('id')}`;
      const {description, image} = this.model.get('preview');
      const space = 10;
      const blockHeight = 90;
      const offset = this.$el.offset();
      const top = offset.top - $(window).scrollTop() - space + blockHeight / 2;
      const left = offset.left + this.$el[0].offsetWidth + space;

      let $preview = this.$el.find(`#${id}`);

      if ($preview.length === 0 && (description || image)) {
        const $image = image ? `<img src="${image}">` : '';
        const $description = description ? `<p>${description}</p>` : '';

        // this.$el.append(`<div id="${this.model.get('id')}_caret" class="preview_caret"></div>`);
        $preview = this.$el.append(`<div id="${id}">${$image}${$description}</div>`);
      }

      const previewHeight = $(`#${id}`).height();

      // $(`#${this.model.get('id')}_caret`)
      //   .css('display', 'block')
      //   .fadeIn('fast');

      $(`#${id}`)
        .css('top', `${Math.max(top - previewHeight / 2, 42)}px`)
        .css('left', `${left}px`)
        .css('display', 'block')
        .fadeIn('fast');
    }

    this.isVisiblePreview = true;
  },

  hidePreview() {
    const id = `preview-${this.model.get('id')}`;
    let $preview = $('body').find(`#${id}`);

    if ($preview.length === 1) {
      $(`#${id}`).css('display', 'none');
      // $(`#${id}_caret`)
      //   .css('display', 'none')
    }

    this.isVisiblePreview = false;
  },

  render() {
    var className = this.ppfx + 'block';
    this.$el.addClass(className);
    this.el.innerHTML = '<div class="' + className + '-label">' + this.model.get('label') + '</div>';
    return this;
  },

});
