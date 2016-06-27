import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('form-controls', 'Integration | Component | form-controls', {
  integration: true
});

test('without admin session, it renders in previewing mode', function(assert) {
  this.set('isEditing', false);
  this.set('isNew', false);
  this.set('isAdmin', false);

  this.render(hbs`{{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}`);

  assert.equal(this.$('button').length, 0, 'renders 0 buttons');
});

test('with admin session, it renders in previewing/notNew mode with edit controls', function(assert) {
  this.set('isEditing', false);
  this.set('isNew', false);
  this.set('isAdmin', true);

  this.render(hbs`{{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}`);

  assert.equal(this.$('button').length, 2, 'renders 2 buttons');
  assert.ok(this.$('button:first').hasClass('button-edit'), 'renders Edit button');
  assert.ok(this.$('button:last').hasClass('button-delete'), 'renders Delete button');
});

test('with admin session, it renders in editing/notNew mode', function(assert) {
  this.set('isEditing', true);
  this.set('isNew', false);
  this.set('isAdmin', true);

  this.render(hbs`{{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}`);

  assert.equal(this.$('button').length, 1, 'renders 1 button');
  assert.ok(this.$('button:last').hasClass('button-preview'), 'renders preview button');
});

test('with admin session, it renders in editing/new mode', function(assert) {
  this.set('isEditing', true);
  this.set('isNew', true);
  this.set('isAdmin', true);

  this.render(hbs`{{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}`);

  assert.equal(this.$('button').length, 2, 'renders 2 buttons');
  assert.ok(this.$('button:first').hasClass('button-preview'), 'renders Preview button');
  assert.ok(this.$('button:last').hasClass('button-cancel'), 'renders Cancel button');
});

test('with admin session, it renders in previewing/new mode', function(assert) {
  this.set('isEditing', false);
  this.set('isNew', true);
  this.set('isAdmin', true);

  this.render(hbs`{{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}`);

  assert.equal(this.$('button').length, 3, 'renders 3 buttons');
  assert.ok(this.$('button:first').hasClass('button-edit'), 'renders Edit button');
  assert.ok(this.$('button:eq(1)').hasClass('button-cancel'), 'renders Cancel button');
  assert.ok(this.$('button:last').hasClass('button-save'), 'renders Save button');
});
