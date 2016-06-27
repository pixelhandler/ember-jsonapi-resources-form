/**
  @module components
  @submodule x-tag
**/
import Ember from 'ember';
import layout from '../templates/components/x-tag';

/**
  @class XTagComponent
  @extends Ember.Component
*/
export default Ember.Component.extend({
  layout,

  /**
    @property tagName
    @type String
  */
  tagName: 'x-tag'
});
