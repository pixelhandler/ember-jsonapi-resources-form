# Ember-jsonapi-resources-form

Ember Addon that provides components for use with forms to edit a resource
that follows JSON API 1.0 specification.

- Use with the [ember-jsonapi-resources] addon

[ember-jsonapi-resources]: http://ember-jsonapi-resources.com

## Example Use

For a simple example see the `address-form` component usage in the `dummy` app.

The `resource-form` is an abstract component for CRUD operations on a Resource
instance (model).

To trigger actions include the form controls component in the template for your
component that extends `resource-form`, and set the target…

Example template for a form component that extends the `resource-form`:

```hbs
{{form-controls target=this isEditing=isEditing isNew=isNew isAdmin=isAdmin}}
{{text-input value=resource.name
  name="name" action="performUpdate" target=this
  requireInput=isEditing disabled=notEditing}}
{{number-input value=resource.total min="0" step="1"
  name="total" action="applyChange" target=this
  requireInput=isEditing disabled=notEditing}}
```

Actions that interact with the various presentation modes of the form,
include: `toPreview` (new resource), `toDetail` / `toEdit` (persisted resource),
`cancel`, `save`, and `destroy`.

A few examples using a (concrete) component which extends `resource-form`…

For an "editing" route or 'editing' state of the form:

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

A example form that adds behavior to edit relationships…

*Form component*

```js
import Ember from 'ember';
import ResourceFormComponent from 'core-form/components/resource-form';

const { get, set, inject, computed } = Ember;

export default ResourceFormComponent.extend({
  products: inject.service(),
  resourceName: 'catalog',

  /**
    Handles selected relation for new Resource

    @method relationSelected
    @param {ProductResource} relation
  */
  relationSelected(relation) {
    let model = get(this, 'model');
    model.addRelationship(get(relation, 'type'), get(relation, 'id'));
  },

  /**
    @method unsetRelation
    @param {ProductResource} relation
  */
  unsetRelation(relation) {
    let model = get(this, 'model');
    model.removeRelationship(get(relation, 'type'), get(relation, 'id'));
  },

  /**
    @method addRelationship
    @param String resourceName
    @param String id
  */
  addRelationship(resourceName, id){
    let model = get(this, 'model');
    model.addRelationship(resourceName, id);
    get(this, get('resourceName')).patchRelationship(model, resourceName, id);
  },

  /**
    @method removeRelationship
    @param  {String} resourceName
    @param  {String} id
  */
  removeRelationship(resourceName, id){
    let model = get(this, 'model');
    model.removeRelationship(resourceName, id);
    get(this, get('resourceName')).destroyRelationship(model, resourceName, id);
  }
});
```

*Form template*

```hbs
{{form-controls target=this isEditing=isEditing isNew=isNew inFlight=inFlight}}
<fieldset>
  <legend>Catalog Info</legend>
  {{#input-row label="Region" name="region"}}
    {{! text-input is bound to a value, use action to apply changes and persist}}
    {{text-input
      value=resource.region
      name="region"
      requireInput=isEditing
      disabled=notEditing
      action="performUpdate" target=this
    }}
  {{/input-row}}

  {{#input-row label="Total" name="total"}}
  {{! number-input doesn't bind to the value need, use action to set changes}}
  {{number-input min="0" step="15"
    value=resource.total
    name="total"
    requireInput=isEditing
    disabled=notEditing
    action="applyChange" target=this
  }}
  {{/input-row}}

  {{#input-row label="Product" name="product"}}
    {{#power-select
      placeholder="Choose a Product"
      disabled=notEditing
      selected=resource.product
      onchange=(action "selected")
      search=(action "search") as |product|}}
      {{product.name}}
    {{/power-select}}
  {{/input-row}}
</fieldset>
{{yield}}
```

## Installation

In the consuming application…

    ember install ember-jsonapi-resources-form

## Development

Install dependencies…

* `git clone` this repository
* `npm install`
* `bower install`

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
