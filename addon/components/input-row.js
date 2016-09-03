/**
  @module components
  @submodule input-row
**/
import Ember from 'ember';
import layout from '../templates/components/input-row';

/**
  @class InputRowComponent
  @extends Ember.Component
*/
export default Ember.Component.extend({
  layout,

  tagName: 'input-row',

  classNames: ['block', 'mb2']
});
