/**
  @module components
  @submodule number-input
**/
import Ember from 'ember';
import layout from '../templates/components/number-input';

/**
  @class NumberInputComponent
  @extends Ember.Component
*/
export default Ember.TextField.extend({
  layout,

  /**
    @property classNames
    @type Array
  */
  classNames: ['resource-form-input', 'u-full-width'],

  /**
    @property attributeBindings
    @type Array
  */
  attributeBindings: ['type', 'disabled'],

  /**
    @property type
    @type String
  */
  type: 'number',

  /**
    @property disabled
    @type Boolean
  */
  disabled: false,

  /**
    @property requireInput
    @type Boolean
  */
  requireInput: false,

  /**
    Set required attribute to element only after user looses focus on input,
    and send action to process input value.

    @method focusOut
  */
  focusOut() {
    if (this.get('requireInput')) {
      this.get('element').required = true;
    }
    this.get('target').send(this.get('action'), this.get('name'), this.get('value'));
  },

  /**
    Send action to process input value after user mouse's leaves input.

    @method mouseLeave
  */
  mouseLeave() {
    this.get('target').send(this.get('action'), this.get('name'), this.get('value'));
  },

  /**
    Enforces numberic value, but looses default value binding

    See:
    - https://github.com/emberjs/ember.js/issues/12621
    - https://github.com/emberjs/ember.js/pull/11225

    This is fine we're sending an action to apply the edits via events anyway

    @method mouseLeave
  */
  value: Ember.computed({
    get(key) {
      return parseInt(this.get(`_${key}`), 10);
    },
    set(key, value) {
      let toNum = parseInt(value, 10);
      return this.set(`_${key}`, toNum);
    }
  })
});
