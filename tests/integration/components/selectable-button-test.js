import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('selectable-button', 'Integration | Component | selectable-button', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with
  this.set('options', ['outdoor', 'indoor', 'universal']);
  this.set('optionFilter', 'outdoor');

  // Handle any actions with
  this.on('filtering', function(attr) { console.log(attr); });

  // Template block usage:
  this.render(hbs`
    {{#each options as |filter|}}
      {{#selectable-button value=filter selectedValue=optionFilter action="filtering" attrName="option"}}
        {{filter}}
      {{/selectable-button}}
    {{/each}}
  `);

  assert.equal(this.$('selectable-button').length, 3);
  assert.equal(this.$('selectable-button[value="outdoor"]').attr('disabled'), 'disabled');
  assert.ok(this.$('selectable-button[value="outdoor"]').hasClass('active'));
  assert.equal(this.$('selectable-button.active').length, 1);
});
