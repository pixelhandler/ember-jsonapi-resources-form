/*jshint node:true*/
module.exports = {
  description: 'ember-jsonapi-resources-form',

  normalizeEntityName: function () {},

  afterInstall: function () {
    return this.addPackagesToProject([
      { name: 'ember-buffered-proxy', target: '^0.5.1' },
      { name: 'ember-concurrency', target: '^0.7.0' },
      { name: 'ember-route-action-helper', target: '^0.3.1' }
    ]);
  }
};
