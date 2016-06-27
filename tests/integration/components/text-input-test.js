import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('text-input', 'Integration | Component | text-input', {
  integration: true
});

test('becomes required after focusout event', function(assert) {
  let done = assert.async();
  this.set('field', '');

  this.render(hbs`{{text-input value=field requireInput=true}}`);

  assert.equal(this.$('input')[0].required, false, 'input it not required yet');

  Ember.run(function() {
    this.$('input').trigger('focus');
    this.$('input').trigger('focusout');
  }.bind(this));

  Ember.run(function() {
    assert.equal(this.$('input')[0].required, true, 'input is now required after focus out');
    done();
  }.bind(this));
});
