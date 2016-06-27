import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('resource-form', 'Integration | Component | resource-form', {
  integration: true
});

let AdminSession = Ember.Service.extend({
  isAdmin: Ember.computed(function() {
    return true;
  })
});

let UserSession = Ember.Service.extend({
  isAdmin: Ember.computed(function() {
    return false;
  })
});

/*
  See dummy app for an example of how to extend with a session service
  and custom template with input components.
*/

test('without admin session, form in previewing mode has no buttons/actions', function(assert) {
  this.register('service:session', UserSession);
  this.inject.service('session');

  this.set('model', modelFactory('home', 1));

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=false isEditing=false
                   }}
                     {{input type="text" name="name" value=resource.name}}
                     {{input type="number" name="version" value=resource.version}}
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 2, 'form renders inputs in block');
  assert.equal(this.$('form nav button').length, 0, 'no buttons for actions');
});

test('with admin session, form in previewing mode can send toEdit action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('home', 1));
  let called = { toEdit: false };
  this.on('toEdit', function() { called.toEdit = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=false isEditing=false
                     on-toEdit=(action 'toEdit')
                   }}
                     {{input type="text" name="name" value=resource.name}}
                     {{input type="number" name="version" value=resource.version}}
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 2, 'form renders inputs in block');

  Ember.run(function() {
    this.$('form nav:first button.button-edit').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.toEdit, true, 'toEdit action called');
    done();
  }.bind(this), 30);
});

test('with admin session, form in previewing mode can send destroy action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('home', 1));
  let called = { destroy: false };
  this.on('destroy', function() { called.destroy = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=false isEditing=false
                     on-destroy=(action 'destroy')
                   }}
                     {{input type="text" name="name" value=resource.name}}
                     {{input type="number" name="version" value=resource.version}}
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 2, 'form renders inputs in block');

  Ember.run(function() {
    this.$('form nav:first button.button-delete').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.destroy, true, 'destroy action called');
    done();
  }.bind(this), 30);
});

test('with admin session, form in editing mode can send toDetail action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('home', 1));
  let actionCalled = false;
  this.on('toDetail', function() { actionCalled = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=false isEditing=true
                     on-toDetail=(action 'toDetail')
                   }}
                     {{input type="text" name="name" value=resource.name}}
                     {{input type="number" name="version" value=resource.version}}
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 2, 'form renders inputs in block');

  Ember.run(function() {
    this.$('form nav:first button.button-preview').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(actionCalled, true, 'toDetail action called');
    done();
  }.bind(this), 30);
});

test('with admin session and new model, form in editing mode can send toPreview action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('work', 2, true));
  let called = { toPreview: false };
  this.on('toPreview', function() { called.toPreview = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=model.isNew isEditing=true
                     on-toPreview=(action 'toPreview')
                   }}
                     <input type="text" name="name" value=resource.name>
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 1, 'form renders input in block');

  Ember.run(function() {
    this.$('form nav:first button.button-preview').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.toPreview, true, 'toPreview action called');
    done();
  }.bind(this), 30);
});

test('with admin session and new model, form in editing mode can send cancel action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('work', 2, true));
  let called = { cancel: false };
  this.on('cancel', function() { called.cancel = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=model.isNew isEditing=true
                     on-cancel=(action 'cancel')
                   }}
                     <input type="text" name="name" value=resource.name>
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 1, 'form renders input in block');

  Ember.run(function() {
    this.$('form nav:first button.button-cancel').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.cancel, true, 'cancel action called');
    done();
  }.bind(this), 30);
});

test('with admin session and new model, form in previewing mode can send cancel action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('work', 2, true));
  let called = { cancel: false };
  this.on('cancel', function() { called.cancel = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=model.isNew isEditing=false
                     on-cancel=(action 'cancel')
                   }}
                     {{input type="text" name="name" value=resource.name}}
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 1, 'form renders input in block');

  Ember.run(function() {
    this.$('form nav:first button.button-cancel').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.cancel, true, 'cancel action called');
    done();
  }.bind(this), 30);
});

test('with admin session and new model, form in previewing mode can send save action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('work', 2, true));
  let called = { save: false };
  this.on('save', function() { called.save = true; });

  this.render(hbs`{{address-form model=model session=session
                    isNew=model.isNew isEditing=false
                    on-save=(action 'save')
                  }}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 2, 'form renders inputs in block');

  Ember.run(function() {
    let inputSelector = 'form input:first';
    assert.equal(this.$(inputSelector)[0].value, 'work', 'input value is "work"');
    this.$(inputSelector).trigger('focus')
      .val('other')
      .trigger('change')
      .trigger('focusout');
    this.$('form nav:last button.button-save').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.save, true, 'save action called');
    done();
  }.bind(this), 30);
});

test('with admin session and new model, form in previewing mode can send toEdit action', function(assert) {
  let done = assert.async();
  this.register('service:session', AdminSession);
  this.inject.service('session');

  this.set('model', modelFactory('work', 2, true));
  let called = { toEdit: false };
  this.on('toEdit', function() { called.toEdit = true; });

  this.render(hbs`{{#resource-form model=model session=session
                     isNew=model.isNew isEditing=false
                     on-toEdit=(action 'toEdit')
                   }}
                     <input type="text" name="name" value=resource.name>
                  {{/resource-form}}`);

  assert.equal(this.$('form').length, 1, 'renders a form');
  assert.equal(this.$('form input').length, 1, 'form renders input in block');

  Ember.run(function() {
    this.$('form nav:first button.button-edit').trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    assert.equal(called.toEdit, true, 'toEdit action called');
    done();
  }.bind(this), 30);
});

function modelFactory(name, version, isNew = false) {
  let data = JSON.parse(JSON.stringify({
    name: name,
    version: version
  }));
  data.isNew = isNew;
  return data;
}
