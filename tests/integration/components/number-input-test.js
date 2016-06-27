import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('number-input', 'Integration | Component | number-input', {
  integration: true
});

test('becomes required after focusout event', function(assert) {
  let done = assert.async();
  this.set('field', '');
  this.on('applyChange', function(/*key, value*/) {});

  this.render(hbs`{{number-input name="field" value=field
                    requireInput=true action="applyChange" target=this}}`);

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

test('it sends an event for when changes are made, changed value is a number.', function(assert) {
  let done = assert.async();
  this.set('age', 19);
  this.set('changedValue', { key: null, value: null });
  this.on('applyChange', function(key, value) {
    this.set('changedValue.key', key);
    this.set('changedValue.value', value);
  }.bind(this));

  this.render(hbs`{{number-input name="age" value=age
                    requireInput=true action="applyChange" target=this}}`);

  assert.equal(this.$('input')[0].required, false, 'input it not required yet');

  Ember.run(function() {
    assert.equal(this.$('input')[0].value, '19', 'input value is 19, a String');
    this.$('input').trigger('focus');
    this.$('input').val('29'); // HTML inputs use string values even with type="number"
    this.$('input').trigger('change');
    this.$('input').trigger('focusout');
  }.bind(this));

  Ember.run(function() {
    assert.equal(this.$('input')[0].value, 29, 'input value is 29');
    assert.equal(this.get('changedValue.key'), 'age', 'age property changed after focusout');
    assert.ok(typeof this.get('changedValue.value') === 'number', 'changed value is a number');
    assert.equal(this.get('changedValue.value'), 29, 'age value set to a number after focusout');
    done();
  }.bind(this));
});
