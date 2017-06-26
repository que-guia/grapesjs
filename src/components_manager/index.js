module.exports = () => {
  let configuration = {};
  let groups = {};
  let $groups = {};

  const defaultConfig = require('./config/index');
  const Groups = require('./model/Groups');
  const GroupsView = require('./view/GroupsView');

  return {
    name: 'ComponentsManager',

    getConfig() {
      return configuration;
    },

    init(config = {groups: []}) {
      configuration = _.extend(defaultConfig, config);
      configuration.stylePrefix = `${configuration.pStylePrefix || ''}${configuration.stylePrefix}`;

      groups = new Groups(configuration.groups);
      $groups = new GroupsView({
        collection: groups,
        target: configuration.em,
        config: configuration
      });

      return this;
    },

    render() {
      return $groups.render().el;
    }
  }
};
