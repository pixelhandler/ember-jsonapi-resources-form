import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('input-row', 'Integration | Component | input-row', {
  integration: true
});

test('it renders', function(assert) {
  this.set('field', '');

  this.render(hbs`
    {{#input-row label="Yo Label"}}
      {{input type="text" value=field name="yo-name"}}
    {{/input-row}}
  `);

  assert.ok(this.$('input-row').hasClass('row'), 'input-row element with class row');
  assert.ok(this.$('input-row input').length, 'input-row can yield an input element');
  assert.equal(this.$('input-row label').text().trim(), 'Yo Label:', 'label has text, "Yo Label:"');
});
