import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.Object.create({
      name: 'home',
      version: 1,
      isNew: false
    });
  },
  actions: {
    toEdit() {},
    toDetail() {}
  }
});
