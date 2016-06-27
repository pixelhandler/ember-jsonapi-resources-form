import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-button', 'Integration | Component | x button', {
  integration: true
});

test('it renders in a block', function(assert) {
  this.render(hbs`{{#x-button}}Go{{/x-button}}`);

  assert.equal(this.$().text().trim(), 'Go');
});
