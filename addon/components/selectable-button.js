/**
  @module components
  @submodule selectable-button
**/
import Ember from 'ember';
import layout from '../templates/components/selectable-button';

/**
  Selectable button component, works like a radio button

  Example:

  ```hbs
  {{#each model.FLIGHT_TYPES as |type|}}
    {{selectable-button content=type value=type selectedValue=model.flightType action="selectFlightType"}}
  {{/each}}
  ```

  @class SelectableButtonComponent
  @extends Ember.Component
  @param {String} content the content/label to display in the button element
  @param {String} value to send to the action method
  @param {String} selectedValue is the common value between buttons
  @param {String} action the name of a controller's method to call
*/
export default Ember.Component.extend({

  layout,

  /**
    @property tagName
    @type String
  */
  tagName: 'selectable-button',

  /**
    @property attributeBindings
    @type Array
  */
  attributeBindings: ['value', 'disabled', 'title'],

  /**
    @property classNames
    @type Array
  */
  classNames: ['selectable-button'],

  /**
    @property classNameBindings
    @type Array
  */
  classNameBindings: ['active'],

  /**
    @property active
    @type Boolean
  */
  active: Ember.computed('isSelected', function() {
    return this.get('isSelected');
  }),

  /**
    @property disabled
    @type Boolean
  */
  disabled: Ember.computed('active', function() {
    return this.get('active');
  }),

  /**
    @property title
    @type Boolean
  */
  title: Ember.computed('value', function() {
    return this.get('value');
  }),

  /**
    @property isSelected
    @type Boolean
  */
  isSelected: false,

  /**
    Pass in action handler in template

    @property action
    @type String
  */
  action: null,

  /**
    Pass in action handler in template, sent back with action on value change

    @property attrName
    @type String
  */
  attrName: '',

  /**
    Observes change to value/selectedValue and sets `selected` boolean attr

    @method valuesChanged
  */
  valuesChanged: Ember.on('init', Ember.observer('value', 'selectedValue', function() {
    return this.set('isSelected', this.get('selectedValue') === this.get('value'));
  })),

  /**
    Pass in selected value (of button group) in template

    @property selectedValue
    @type String
  */
  selectedValue: null,

  /**
    Trigger values changed observer before inserting to DOM

    @method willInsertElement
  */
  willInsertElement: function() {
    return this.valuesChanged();
  },

  /**
    Send action on click unless disabled, send value to action handler

    @method click
  */
  click: function(/*event*/) {
    if (!this.get('disabled')) {
      return this.sendAction('action', this.get('attrName'), this.get('value'));
    }
  }
});
