import ResourceFormComponent from './resource-form';
import layout from '../templates/components/address-form';
import Ember from 'ember';

export default ResourceFormComponent.extend({
  layout,

  session: Ember.inject.service()
});
