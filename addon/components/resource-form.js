/**
  @module components
  @submodule resource-form
**/
import Ember from 'ember';
import BufferedProxy from 'ember-buffered-proxy/proxy';
import { task, timeout } from 'ember-concurrency';
import layout from '../templates/components/resource-form';

const { computed, Component } = Ember;

/**
  Abstract component for CRUD operations on a Resource instance (model).

  To trigger actions include the form controls component in the template for your
  compent that extends `resource-form`, and set the target…

  ```hbs
  {{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}
  {{! text-input is bound to the value, use action to persist changes}}
  {{text-input value=resource.name
    name="name" action="performUpdate" target=this
    requireInput=isEditing disabled=notEditing}}
  {{! number-input does not bind to the value, use action to set changes}}
  {{number-input value=resource.round min="0" step="1"
    name="round" action="applyChange" target=this
    requireInput=isEditing disabled=notEditing}}
  ```

  Actions that interact with the various presentation modes of the form,
  include: `toPreview` (new resource), `toDetail` / `toEdit` (persisted resource),
  `cancel`, `save`, and `destroy`.

  Example setup for a (concrete) component that extends…

  For an "editing" route or state of the form:

  ```hbs
  {{catalog-form model=model isNew=model.isNew isEditing=true
    on-update=(route-action 'update')
    on-toDetail=(route-action 'toDetail')
  }}
  ```

  For a "Detail" route or "Preview" state of the form:

  ```hbs
  {{catalog-form model=model isNew=model.isNew isEditing=false
    on-edit=(route-action 'toEdit')
    on-destroy=(route-action 'destroy')
  }}
  ```

  For a "New" route / state of the form:

  ```hbs
  {{catalog-form model=model isNew=model.isNew isEditing=false
    on-save=(route-action 'save')
    on-cancel=(route-action 'cancel')
  }}
  ```

  A Session service is needed for enforcing flags to protect editing/new states

  @class ResourceFormComponent
  @extends Ember.Component
*/
export default Component.extend({
  layout,

  /**
    Some flags require an admin role to make changes, `isNew`, `isEditing`.

    To fake this use a faux session:

    ```js
    let AdminSession = Ember.Service.extend({
      isAdmin: Ember.computed(function() {
        return true;
      })
    });
    ```

    @property session
    @required
    @type Service
  */
  session: Ember.required,

  /**
    @property classNames
    @type Array
  */
  classNames: ['ResourceForm'],

  /**
    @property classNameBindings
    @type Array
  */
  classNameBindings: ['notEditing:u-borderless'],

  /**
    @property tagName
    @type String
  */
  tagName: 'form',

  /**
    The model is required, properties changes will be buffered using
    the `resource`. Changes can be applied via actions or events.

    @property model
    @required
    @type Resource
  */
  model: null,

  /**
    The resource has proxied attributes from the model, changes are
    applied or cancelled. Can check whether it has changes too (isDirty)…

    ```js
    let resource = this.get('resource');
    resource.get('hasBufferedChanges');
    resource.applyChanges();
    resource.discardChanges();
    ```

    @property resource
    @type {BufferedProxy} proxy object for the model instance
  */
  resource: computed('model', function() {
    return BufferedProxy.create({ content: this.get('model') });
  }).readOnly(),

  /**
    Flag: the form has a model that is not persisted yet (no id).
    Requires admin role/privilege to create a new resource.

    @property isNew
    @type Boolean
  */
  isNew: computed('isAdmin', {
    get(key) {
      return this.get('isAdmin') && this[`_${key}`];
    },
    set(key, value) {
      this[`_${key}`] = value;
      return this.get('isAdmin') && value;
    }
  }),

  /**
    Flag: the form has a model that is already persisted.

    @property notNew
    @type Boolean
  */
  notNew: computed.not('isNew'),

  /**
    Flag: the form is in an editing (non disabled) state.
    Only when `isAdmin` is true can the change to editing "state" happen.

    @property isEditing
    @type Boolean
  */
  isEditing: computed('isAdmin', {
    get(key) {
      return this.get('isAdmin') && this[`_${key}`];
    },
    set(key, value) {
      this[`_${key}`] = value;
      return this.get('isAdmin') && value;
    }
  }),

  /**
    Flag: the form is in a previewing (editing disabled) state.

    @property notNew
    @type Boolean
  */
  notEditing: computed.not('isEditing'),

  /**
    Flag: the `updateTask` is busy so the form has an `inFlight` status.

    @property inFlight
    @type Boolean
  */
  inFlight: computed.oneWay('updateTask.isRunning'),

  /**
    Flag: active user that is an admin and can edit the resource.

    @property isAdmin
    @type Boolean
  */
  isAdmin: computed.readOnly('session.isAdmin'),

  /**
    Use the focus out event to apply proxied changes to the resource, to
    implement a strategy for peristing changes using event delegation, while
    buffering changes on model.

    Typically an input component should have use an action to apply a change,
    the `performUpdate` or `applyChange` actions to can process changes using
    the "data down, actions, up" (DDAU) methodology.

    Use this event handler for special cases when browser events are necessary
    to apply and persist a change.

    @method focusOut
    @param {jQuery.Event} event
    @public
  */
  /*
  focusOut(event) {
    Ember.Logger.debug('Implement a focusOut event to handle…', event);
    this.get('updateTask').perform();
  },
  */

  actions: {
    /**
      Action to apply a change to the resource

      @method actions.applyChange
      @param {String} name
      @param {String|Number} value
    */
    applyChange(name, value) {
      this.set(`resource.${name}`, value);
      this.send('performUpdate');
    },

    /**
      Perform the edit tasks when model is not new

      @method actions.performUpdate
    */
    performUpdate() {
      if (this.get('notNew')) {
        this.get('updateTask').perform();
      }
    },

    /**
      @method actions.cancel
    */
    cancel() {
      this.get('cancelTask').perform();
    },

    /**
      @method actions.destroy
    */
    destroy() {
      if(window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
        this.get('destroyTask').perform();
      }
    },

    /**
      @method actions.save
    */
    save() {
      this.get('saveTask').perform();
    },

    /**
      Action to change into an non-editing state

      @method actions.toEdit
    */
    toDetail() {
      this.get('toDetailTask').perform();
    },

    /**
      Action to change into an editing state

      @method actions.toEdit
    */
    toEdit() {
      this.get('toEditTask').perform();
    },

    /**
      Action to change into an previewing state

      @method actions.preview
    */
    toPreview() {
      this.get('toPreviewTask').perform();
    }
  },

  /**
    Command to cancel editing, expects an action to process transition.
    (Runs in the ember-concurrently task queue, safe to execute w/o an action.)

    @property cancelTask
    @type Task
  */
  cancelTask: task(function * () {
    this.set('isEditing', false);
    this.get('resource').discardChanges();
    yield this.getAction('on-cancel')(this.get('model'));
  }).enqueue(),

  /**
    Command to destroy model, requires a closure action to process operation.
    (Runs in the ember-concurrently task queue, must use action!)

    @property destroyTask
    @type Task
  */
  destroyTask: task(function * () {
    this.set('isEditing', false);
    yield this.getAction('on-destroy')(this.get('model'));
  }).enqueue(),

  /**
    Command to transition to detail, expects an action to process transition.
    (Runs in the ember-concurrently task queue, safe to execute w/o an action.)

    @property toDetailTask
    @type Task
  */
  toDetailTask: task(function * () {
    yield timeout(15); // break out of call stack, like Ember run next
    this.set('isEditing', false);
    this.getAction('on-toDetail')(this.get('model'));
  }).enqueue(),

  /**
    Command to transition to edit, expects an action to process transition.
    (Runs in the ember-concurrently task queue, safe to execute w/o an action.)

    @property toEditTask
    @type Task
  */
  toEditTask: task(function * () {
    yield timeout(15); // break out of call stack, like Ember run next
    this.set('isEditing', true);
    this.getAction('on-toEdit')(this.get('model'));
  }).enqueue(),

  /**
    Command to transition to previewing, may use an action to process transition.
    (Runs in the ember-concurrently task queue, safe to execute w/o an action.)

    @property toPreviewTask
    @type Task
  */
  toPreviewTask: task(function * () {
    yield timeout(15); // break out of call stack, like Ember run next
    this.set('isEditing', false);
    this.getAction('on-toPreview')(this.get('model'));
  }).enqueue(),

  /**
    Command to save model, requires a closure action to process operation.
    Only fires action when model has (buffered) changes to apply.
    (Runs in the ember-concurrently task queue, must use action!)

    @property saveTask
    @type Task
  */
  saveTask: task(function * () {
    let resource = this.get('resource');
    if (resource.get('hasBufferedChanges')) {
      this.set('isEditing', false);
      resource.applyChanges();
      yield this.getAction('on-save', true)(this.get('model'));
    } else {
      yield null;
    }
  }).enqueue(),

  /**
    Command to update model, expects a closure action to process operation.
    Only fires action when model has (buffered) changes to apply.
    (Runs in the ember-concurrently task queue,  must use action!)

    @property updateTask
    @type Task
  */
  updateTask: task(function * () {
    let resource = this.get('resource');
    if (resource.get('hasBufferedChanges')) {
      resource.applyChanges();
      yield this.getAction('on-update', true)(this.get('model'));
    } else {
      yield null;
    }
  }).enqueue(),

  /**
    Get the action passed into the component by name, e.g. on-save, on-toEdit.
    Has an optional argument to assert that a closure action is available.
    Returns the function to call and trigger the action, i.e. the closure action
    or the `sendAction` method.

    @method getAction
    @param {String} name
    @param {Boolean} assertIsFunction
    @returns {Function}
  */
  getAction(name, assertIsFunction = false) {
    let action = this.get(name);
    if (!action) { return Ember.K; /* fail silently if no action */ }
    let isFunction = (typeof action === 'function');
    if (assertIsFunction) {
      Ember.assert(`Action ${name} must be a closure action`, isFunction);
    }
    return (isFunction) ? action : this.sendAction;
  }
});
