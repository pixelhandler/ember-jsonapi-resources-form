/**
  @module components
  @submodule text-input
**/
import Ember from 'ember';
import layout from '../templates/components/text-input';

/**
  @class TextInputComponent
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
  type: 'text',

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
    this.sendAction();
  },

  /**
    Send action to process input value after user mouse's leaves input.

    @method mouseLeave
  */
  mouseLeave() {
    this.sendAction();
  }
});
