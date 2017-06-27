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
    let content = this.model.get('content').replace('{custom-class}', this.model.cid);

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
      const image = this.model.get('previewImage');
      const top = this.$el[0].offsetTop - 10;
      const left = this.$el[0].offsetLeft + this.$el[0].offsetWidth + 10;

      let $preview = this.$el.find(`#${id}`);

      if ($preview.length === 0) {
        $preview = this.$el.append(`<p id="${id}"><img src="${image}"></p>`);
      }

      $(`#${id}`)
        .css('top', `${top}px`)
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
