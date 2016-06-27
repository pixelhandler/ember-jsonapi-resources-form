/**
  @module components
  @submodule x-button
**/
import Ember from 'ember';
import layout from '../templates/components/x-button';

/**
  @class XButtonComponent
  @extends Ember.Component
*/
export default Ember.Component.extend({
  layout,

  /**
    @property tagName
    @type String
  */
  tagName: 'button',

  /**
    @property classNames
    @type Array
  */
  classNames: ['resource-form-button'],

  /**
    @property attributeBindings
    @type Array
  */
  attributeBindings: ['disabled'],

  /**
    @property disabled
    @type Boolean
  */
  disabled: false,

  /**
    @property active
    @type Boolean
  */
  active: Ember.computed.not('disabled'),

  /**
    @property action
    @type String
  */
  action: null,

  /**
    @method click
  */
  click() {
    if (this.get('active')) {
      this.sendAction();
    }
    return false; // prevent bubble
  }
});
