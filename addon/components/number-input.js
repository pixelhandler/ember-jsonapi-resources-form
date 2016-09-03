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

    let value = this.get('value');
    if (isNaN(value)) { return; }
    this.get('target').send(this.get('action'), this.get('name'), value);
  },

  /**
    Send action to process input value after user mouse's leaves input.

    @method mouseLeave
  */
  mouseLeave() {
    let value = this.get('value');
    if (isNaN(value)) { return; }
    this.get('target').send(this.get('action'), this.get('name'), value);
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
      let value = parseInt(this.get(`_${key}`));
      return isNaN(value) ? 0 : value;
    },
    set(key, value) {
      let toNum = parseInt(value, 10);
      if(isNaN(toNum)) { return this.get(`_${key}`); } // Default to previous value.
      return this.set(`_${key}`, toNum);
    }
  })

});
