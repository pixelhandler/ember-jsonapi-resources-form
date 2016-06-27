import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-tag', 'Integration | Component | x-tag', {
  integration: true
});

test('it renders in a block', function(assert) {
  this.render(hbs`{{#x-tag}}thing{{/x-tag}}`);

  assert.equal(this.$().text().trim(), 'thing');
});
