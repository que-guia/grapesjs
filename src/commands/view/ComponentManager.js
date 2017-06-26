module.exports = {
  run(em, sender) {
    const panels = em.Panels;
    const manager = em.ComponentsManager;
    panels.addPanel({id: 'components-container'});

    this.panel = panels.getPanel('components-container');
    this.panel.set('appendContent', manager.render());
  }
};
